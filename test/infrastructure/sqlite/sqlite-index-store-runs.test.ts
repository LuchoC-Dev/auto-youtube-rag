import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, test } from "node:test";

import {
  PackageRef,
  SourceName,
  SyncId,
  VideoId,
} from "../../../src/domain/indexing/identifiers.js";
import { SourceRoot } from "../../../src/domain/indexing/source-root.js";
import { SyncIssue, SyncRun } from "../../../src/domain/indexing/sync-run.js";
import { openDatabase } from "../../../src/infrastructure/sqlite/open-database.js";
import {
  SQLiteIndexStore,
  SQLiteIndexStoreError,
} from "../../../src/infrastructure/sqlite/sqlite-index-store.js";
import { SQLiteSourceRegistry } from "../../../src/infrastructure/sqlite/sqlite-source-registry.js";
import {
  type PersistedIssueView,
  type PersistedRunView,
  verifyIndexStoreRunContract,
} from "../../contracts/index-store.contract.js";

const temporaryDirectories: string[] = [];

async function databasePath(): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), "auto-youtube-rag-store-"));
  temporaryDirectories.push(directory);
  return join(directory, "index.sqlite");
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

const sourceName = SourceName.create("auto-design");
const source = SourceRoot.create({
  name: sourceName,
  collectionPath: "C:\\knowledge\\auto-design",
  manifestPath: "C:\\knowledge\\auto-design\\manifest.json",
  videosPath: "C:\\knowledge\\auto-design\\videos",
  enabled: true,
});

void test("records and closes runs with associated issues", async () => {
  const database = openDatabase(await databasePath());
  try {
    await new SQLiteSourceRegistry(database).add(source);
    const store = new SQLiteIndexStore(database);

    await verifyIndexStoreRunContract({
      store,
      sourceName,
      readRun(id): PersistedRunView | null {
        const row = database
          .prepare(
            "SELECT id, status, started_at, finished_at, counters_json FROM sync_runs WHERE id = ?",
          )
          .get(id);
        if (row === undefined) return null;
        return {
          id: String(row.id),
          status: String(row.status),
          startedAt: String(row.started_at),
          finishedAt: row.finished_at === null ? null : String(row.finished_at),
          counters: JSON.parse(String(row.counters_json)) as unknown,
        };
      },
      readIssues(id): readonly PersistedIssueView[] {
        return database
          .prepare(
            `SELECT sync_id, video_id, relative_path, code, message, retryable
             FROM sync_issues WHERE sync_id = ? ORDER BY id`,
          )
          .all(id)
          .map((row) => ({
            syncId: String(row.sync_id),
            videoId: row.video_id === null ? null : String(row.video_id),
            relativePath:
              row.relative_path === null ? null : String(row.relative_path),
            code: String(row.code),
            message: String(row.message),
            retryable: row.retryable === 1,
          }));
      },
    });

    assert.equal(
      database.prepare("SELECT count(*) AS count FROM video_packages").get()
        ?.count,
      0,
    );
  } finally {
    database.close();
  }
});

void test("reopens persisted package state and model summaries", async () => {
  const path = await databasePath();
  const database = openDatabase(path);
  try {
    await new SQLiteSourceRegistry(database).add(source);
    database.exec(`
      INSERT INTO sync_runs(id, source_id, status, started_at, finished_at, counters_json)
      SELECT 'sync:state', id, 'ok', '2026-08-11T00:00:00.000Z', '2026-08-11T00:01:00.000Z', '{}'
      FROM sources WHERE name = 'auto-design';
      INSERT INTO video_packages(source_id, video_id, slug, relative_path, package_hash, last_seen_sync_id, indexed_at)
      SELECT id, 'video_1', 'video-1', 'videos/video-1', '${"a".repeat(64)}', 'sync:state', '2026-08-11T00:01:00.000Z'
      FROM sources WHERE name = 'auto-design';
      INSERT INTO source_documents(package_id, kind, relative_path, content_hash, byte_size, parser_version)
      VALUES (1, 'context', 'context.md', '${"b".repeat(64)}', 42, 'context-v1');
      INSERT INTO knowledge_units(document_id, parent_id, stable_key, unit_type, depth, ordinal, title, content, structured_json, heading_path_json, timestamps_json, visual_evidence_json, estimated_tokens, content_hash, searchable)
      VALUES (1, NULL, 'unit:root', 'context_document', 0, 0, NULL, 'body', NULL, '[]', '[]', '[]', 1, '${"c".repeat(64)}', 1);
      INSERT INTO search_fragments(unit_id, ordinal, title, heading_path, content, token_count, content_hash)
      VALUES (1, 0, NULL, '', 'body', 1, '${"d".repeat(64)}');
      INSERT INTO embeddings(fragment_id, model_key, model_version, dimensions, content_hash, vector, created_at)
      VALUES (1, 'e5-small', '1', 384, '${"d".repeat(64)}', zeroblob(1536), '2026-08-11T00:01:00.000Z');
    `);
  } finally {
    database.close();
  }

  const reopened = openDatabase(path);
  try {
    const state = await new SQLiteIndexStore(reopened).getPackageState(
      PackageRef.create(sourceName, VideoId.create("video_1")),
    );
    assert.ok(state);
    assert.equal(state.ref.serialize(), "auto-design:video_1");
    assert.equal(state.packageHash, "a".repeat(64));
    assert.equal(
      state.lastSeenSyncId.equals(SyncId.create("sync:state")),
      true,
    );
    assert.equal(state.indexedAt, "2026-08-11T00:01:00.000Z");
    assert.deepEqual(state.documents, [
      {
        kind: "context",
        contentHash: "b".repeat(64),
        parserVersion: "context-v1",
      },
    ]);
    assert.deepEqual(state.embeddingModels, [
      { key: "e5-small", version: "1", dimensions: 384 },
    ]);
  } finally {
    reopened.close();
  }
});

void test("supersedeActiveRun marks the running run failed and unblocks recordRun", async () => {
  const database = openDatabase(await databasePath());
  try {
    await new SQLiteSourceRegistry(database).add(source);
    const store = new SQLiteIndexStore(database);

    const running = SyncRun.start({
      id: SyncId.create("sync:ghost"),
      sourceName,
      startedAt: "2026-08-11T00:00:00.000Z",
    });
    await store.recordRun(running);

    // recordRun already refuses a second running run while the ghost is
    // still marked running.
    await assert.rejects(
      store.recordRun(
        SyncRun.start({
          id: SyncId.create("sync:blocked"),
          sourceName,
          startedAt: "2026-08-11T00:05:00.000Z",
        }),
      ),
      (error: unknown) => {
        assert.ok(error instanceof SQLiteIndexStoreError);
        assert.equal(error.code, "SYNC_ALREADY_RUNNING");
        return true;
      },
    );

    const supersededId = await store.supersedeActiveRun(
      sourceName,
      "2026-08-11T00:10:00.000Z",
    );
    assert.equal(supersededId?.value, "sync:ghost");

    const row = database
      .prepare("SELECT status, finished_at FROM sync_runs WHERE id = ?")
      .get("sync:ghost");
    assert.ok(row);
    assert.equal(row.status, "failed");
    assert.equal(row.finished_at, "2026-08-11T00:10:00.000Z");

    // Now a new running run for the source is accepted.
    const afterForce = SyncRun.start({
      id: SyncId.create("sync:after-force"),
      sourceName,
      startedAt: "2026-08-11T00:10:01.000Z",
    });
    await store.recordRun(afterForce);
    await store.recordRun(
      afterForce.finish({
        status: "ok",
        finishedAt: "2026-08-11T00:11:00.000Z",
        counters: {
          packagesSeen: 0,
          packagesUnchanged: 0,
          packagesIndexed: 0,
          packagesFailed: 0,
          packagesDeleted: 0,
        },
      }),
    );

    // Nothing left to supersede once no run is running.
    assert.equal(
      await store.supersedeActiveRun(sourceName, "2026-08-11T00:20:00.000Z"),
      null,
    );
  } finally {
    database.close();
  }
});

void test("rejects runs for unknown sources and issues for unknown runs", async () => {
  const database = openDatabase(await databasePath());
  try {
    const store = new SQLiteIndexStore(database);
    const run = SyncRun.start({
      id: SyncId.create("sync:missing"),
      sourceName,
      startedAt: "2026-08-11T00:00:00.000Z",
    });
    await assert.rejects(store.recordRun(run), (error: unknown) => {
      assert.ok(error instanceof SQLiteIndexStoreError);
      assert.equal(error.code, "UNKNOWN_SOURCE");
      return true;
    });
    await assert.rejects(
      store.recordIssue(
        SyncIssue.create({
          syncId: run.id,
          videoId: null,
          relativePath: null,
          code: "MANIFEST_READ_FAILED",
          message: "The manifest could not be read.",
          retryable: true,
        }),
      ),
      (error: unknown) => {
        assert.ok(error instanceof SQLiteIndexStoreError);
        assert.equal(error.code, "UNKNOWN_SYNC_RUN");
        return true;
      },
    );
  } finally {
    database.close();
  }
});
