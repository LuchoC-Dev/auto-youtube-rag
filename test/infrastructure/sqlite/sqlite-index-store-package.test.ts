import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, test } from "node:test";

import type { IndexedPackageChange } from "../../../src/application/indexing/indexed-package-change.js";
import { EmbeddingRecord } from "../../../src/domain/indexing/embedding-record.js";
import {
  DocumentId,
  KnowledgeUnitId,
  PackageRef,
  SearchFragmentId,
  SourceName,
  SyncId,
  VideoId,
} from "../../../src/domain/indexing/identifiers.js";
import { KnowledgeUnit } from "../../../src/domain/indexing/knowledge-unit.js";
import { SearchFragment } from "../../../src/domain/indexing/search-fragment.js";
import { SourceDocument } from "../../../src/domain/indexing/source-document.js";
import { SourceRoot } from "../../../src/domain/indexing/source-root.js";
import { SyncRun } from "../../../src/domain/indexing/sync-run.js";
import { VideoPackage } from "../../../src/domain/indexing/video-package.js";
import { openDatabase } from "../../../src/infrastructure/sqlite/open-database.js";
import {
  SQLiteIndexStore,
  SQLiteIndexStoreError,
} from "../../../src/infrastructure/sqlite/sqlite-index-store.js";
import { SQLiteSourceRegistry } from "../../../src/infrastructure/sqlite/sqlite-source-registry.js";

const temporaryDirectories: string[] = [];

async function databasePath(): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), "auto-youtube-rag-package-"));
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

function source(name: string): SourceRoot {
  return SourceRoot.create({
    name: SourceName.create(name),
    collectionPath: `C:\\knowledge\\${name}`,
    manifestPath: `C:\\knowledge\\${name}\\manifest.json`,
    videosPath: `C:\\knowledge\\${name}\\videos`,
    enabled: true,
  });
}

function packageChange(input: {
  readonly sourceName: SourceName;
  readonly videoId: string;
  readonly syncId: SyncId;
  readonly hashCharacter: "a" | "b" | "c" | "d";
  readonly searchTerm: string;
  readonly vectorValue: number;
}): IndexedPackageChange {
  const ref = PackageRef.create(
    input.sourceName,
    VideoId.create(input.videoId),
  );
  const suffix = `${input.videoId}:${input.hashCharacter}`;
  const documentId = DocumentId.create(`document:${suffix}`);
  const unitId = KnowledgeUnitId.create(`unit:${suffix}`);
  const fragmentId = SearchFragmentId.create(`fragment:${suffix}`);
  const contentHash = input.hashCharacter.repeat(64);
  const document = SourceDocument.create({
    id: documentId,
    packageRef: ref,
    kind: "context",
    relativePath: "deliverables/context.md",
    contentHash,
    byteSize: 100,
    parserVersion: "context-v1",
  });
  const unit = KnowledgeUnit.create({
    id: unitId,
    documentId,
    parentId: null,
    unitType: "context_document",
    depth: 0,
    ordinal: 0,
    title: "Visual design",
    content: `${input.searchTerm} visual design system`,
    structuredJson: null,
    headingPath: ["Design"],
    timestamps: [],
    visualEvidence: ["keyframes/frame-001.jpg"],
    estimatedTokens: 4,
    contentHash,
    searchable: true,
  });
  const fragment = SearchFragment.create({
    id: fragmentId,
    unitId,
    ordinal: 0,
    title: "Visual design",
    headingPath: ["Design"],
    content: `${input.searchTerm} visual design system`,
    tokenCount: 4,
    contentHash,
  });
  const vector = new Float32Array(384).fill(input.vectorValue);
  vector[1] = -input.vectorValue;
  const embedding = EmbeddingRecord.create({
    fragmentId,
    modelKey: "e5-small",
    modelVersion: "1",
    dimensions: 384,
    contentHash,
    vector,
    createdAt: "2026-08-11T00:00:30.000Z",
  });

  return {
    kind: "replace_package",
    syncId: input.syncId,
    packageHash: contentHash,
    indexedAt: "2026-08-11T00:00:30.000Z",
    videoPackage: VideoPackage.create({
      ref,
      slug: `${input.videoId}-${input.hashCharacter}`,
      relativePath: `videos/${input.videoId}-${input.hashCharacter}`,
      manifestStage: "complete",
      title: "Visual design",
      creator: "Design channel",
      canonicalUrl: `https://www.youtube.com/watch?v=${input.videoId}`,
      durationSeconds: 120,
      publishedAt: "2026-08-10T00:00:00.000Z",
      sourceLanguage: "en",
      contextLanguage: "es",
      tags: ["design"],
      categories: ["Education"],
      visualProfile: "visual-dependent",
    }),
    documents: [document],
    units: [unit],
    fragments: [fragment],
    embeddings: [embedding],
  };
}

async function startRun(
  store: SQLiteIndexStore,
  sourceName: SourceName,
  id: string,
): Promise<SyncRun> {
  const run = SyncRun.start({
    id: SyncId.create(id),
    sourceName,
    startedAt: "2026-08-11T00:00:00.000Z",
  });
  await store.recordRun(run);
  return run;
}

void test("atomically replaces a package, FTS rows and float32 embeddings", async () => {
  const path = await databasePath();
  const database = openDatabase(path);
  const sourceRoot = source("auto-design");
  const first = packageChange({
    sourceName: sourceRoot.name,
    videoId: "video_1",
    syncId: SyncId.create("sync:replace"),
    hashCharacter: "a",
    searchTerm: "alpha",
    vectorValue: 0.25,
  });
  const replacement = packageChange({
    sourceName: sourceRoot.name,
    videoId: "video_1",
    syncId: first.syncId,
    hashCharacter: "b",
    searchTerm: "beta",
    vectorValue: 0.75,
  });
  try {
    await new SQLiteSourceRegistry(database).add(sourceRoot);
    const store = new SQLiteIndexStore(database);
    await startRun(store, sourceRoot.name, first.syncId.value);
    await store.applyPackage(first);
    await store.applyPackage(replacement);

    for (const table of [
      "video_packages",
      "source_documents",
      "knowledge_units",
      "search_fragments",
      "fragment_fts",
      "embeddings",
    ]) {
      assert.equal(
        database.prepare(`SELECT count(*) AS count FROM ${table}`).get()?.count,
        1,
        table,
      );
    }
    assert.equal(
      database
        .prepare(
          "SELECT count(*) AS count FROM fragment_fts WHERE fragment_fts MATCH 'alpha'",
        )
        .get()?.count,
      0,
    );
    assert.equal(
      database
        .prepare(
          "SELECT count(*) AS count FROM fragment_fts WHERE fragment_fts MATCH 'beta'",
        )
        .get()?.count,
      1,
    );
  } finally {
    database.close();
  }

  const reopened = openDatabase(path);
  try {
    const state = await new SQLiteIndexStore(reopened).getPackageState(
      replacement.videoPackage.ref,
    );
    assert.equal(state?.packageHash, "b".repeat(64));
    const row = reopened
      .prepare("SELECT dimensions, vector FROM embeddings")
      .get();
    assert.ok(row);
    assert.equal(row.dimensions, 384);
    assert.ok(row.vector instanceof Uint8Array);
    assert.equal(row.vector.byteLength, 384 * Float32Array.BYTES_PER_ELEMENT);
    const view = new DataView(
      row.vector.buffer,
      row.vector.byteOffset,
      row.vector.byteLength,
    );
    assert.equal(view.getFloat32(0, true), 0.75);
    assert.equal(view.getFloat32(4, true), -0.75);
    assert.equal(
      reopened.prepare("PRAGMA integrity_check").get()?.integrity_check,
      "ok",
    );
    assert.deepEqual(reopened.prepare("PRAGMA foreign_key_check").all(), []);
  } finally {
    reopened.close();
  }
});

void test("rolls back the complete replacement when a derivative is invalid", async () => {
  const database = openDatabase(await databasePath());
  const sourceRoot = source("auto-design");
  try {
    await new SQLiteSourceRegistry(database).add(sourceRoot);
    const store = new SQLiteIndexStore(database);
    const run = await startRun(store, sourceRoot.name, "sync:rollback");
    const valid = packageChange({
      sourceName: sourceRoot.name,
      videoId: "video_1",
      syncId: run.id,
      hashCharacter: "a",
      searchTerm: "preserved",
      vectorValue: 0.25,
    });
    await store.applyPackage(valid);

    const invalidBase = packageChange({
      sourceName: sourceRoot.name,
      videoId: "video_1",
      syncId: run.id,
      hashCharacter: "b",
      searchTerm: "discarded",
      vectorValue: 0.75,
    });
    const invalidFragment = SearchFragment.create({
      id: SearchFragmentId.create("fragment:missing"),
      unitId: KnowledgeUnitId.create("unit:missing"),
      ordinal: 0,
      title: null,
      headingPath: [],
      content: "invalid derivative",
      tokenCount: 2,
      contentHash: "c".repeat(64),
    });
    await assert.rejects(
      store.applyPackage({
        ...invalidBase,
        fragments: [invalidFragment],
        embeddings: [],
      }),
      (error: unknown) => {
        assert.ok(error instanceof SQLiteIndexStoreError);
        assert.equal(error.code, "INVALID_PACKAGE_CHANGE");
        return true;
      },
    );

    assert.equal(
      (await store.getPackageState(valid.videoPackage.ref))?.packageHash,
      "a".repeat(64),
    );
    assert.equal(
      database
        .prepare(
          "SELECT count(*) AS count FROM fragment_fts WHERE fragment_fts MATCH 'preserved'",
        )
        .get()?.count,
      1,
    );
    assert.equal(
      database
        .prepare(
          "SELECT count(*) AS count FROM fragment_fts WHERE fragment_fts MATCH 'discarded'",
        )
        .get()?.count,
      0,
    );
  } finally {
    database.close();
  }
});

void test("deletes only unseen packages for the source and active run", async () => {
  const database = openDatabase(await databasePath());
  const alpha = source("alpha");
  const bravo = source("bravo");
  try {
    const registry = new SQLiteSourceRegistry(database);
    await registry.add(alpha);
    await registry.add(bravo);
    const store = new SQLiteIndexStore(database);
    const alphaOld = await startRun(store, alpha.name, "sync:alpha-old");
    await store.applyPackage(
      packageChange({
        sourceName: alpha.name,
        videoId: "old_video",
        syncId: alphaOld.id,
        hashCharacter: "a",
        searchTerm: "oldalpha",
        vectorValue: 0.1,
      }),
    );
    // alphaOld must finish before alphaCurrent can start: recordRun rejects
    // a second running run for the same source (see the concurrency guard
    // regression test below).
    await store.recordRun(
      alphaOld.finish({
        status: "ok",
        finishedAt: "2026-08-11T00:00:30.000Z",
        counters: {
          packagesSeen: 1,
          packagesUnchanged: 0,
          packagesIndexed: 1,
          packagesFailed: 0,
          packagesDeleted: 0,
        },
      }),
    );
    const alphaCurrent = await startRun(
      store,
      alpha.name,
      "sync:alpha-current",
    );
    const bravoCurrent = await startRun(
      store,
      bravo.name,
      "sync:bravo-current",
    );
    await store.applyPackage(
      packageChange({
        sourceName: alpha.name,
        videoId: "kept_video",
        syncId: alphaCurrent.id,
        hashCharacter: "b",
        searchTerm: "keptalpha",
        vectorValue: 0.2,
      }),
    );
    await store.applyPackage(
      packageChange({
        sourceName: bravo.name,
        videoId: "bravo_video",
        syncId: bravoCurrent.id,
        hashCharacter: "c",
        searchTerm: "keptbravo",
        vectorValue: 0.3,
      }),
    );

    assert.deepEqual(
      (await store.listPackageRefs(alpha.name)).map((ref) => ref.videoId.value),
      ["kept_video", "old_video"],
    );

    assert.equal(
      await store.deletePackagesNotSeen(alpha.name, alphaCurrent.id),
      1,
    );
    assert.equal(
      await store.getPackageState(
        PackageRef.create(alpha.name, VideoId.create("old_video")),
      ),
      null,
    );
    assert.ok(
      await store.getPackageState(
        PackageRef.create(alpha.name, VideoId.create("kept_video")),
      ),
    );
    assert.ok(
      await store.getPackageState(
        PackageRef.create(bravo.name, VideoId.create("bravo_video")),
      ),
    );
    assert.equal(
      database
        .prepare(
          "SELECT count(*) AS count FROM fragment_fts WHERE fragment_fts MATCH 'oldalpha'",
        )
        .get()?.count,
      0,
    );
    await assert.rejects(
      store.deletePackagesNotSeen(bravo.name, alphaCurrent.id),
      (error: unknown) => {
        assert.ok(error instanceof SQLiteIndexStoreError);
        assert.equal(error.code, "INVALID_DELETE_RUN");
        return true;
      },
    );
    await store.recordRun(
      alphaCurrent.finish({
        status: "failed",
        finishedAt: "2026-08-11T00:02:00.000Z",
        counters: {
          packagesSeen: 2,
          packagesUnchanged: 0,
          packagesIndexed: 1,
          packagesFailed: 1,
          packagesDeleted: 1,
        },
      }),
    );
    await assert.rejects(
      store.deletePackagesNotSeen(alpha.name, alphaCurrent.id),
      (error: unknown) => {
        assert.ok(error instanceof SQLiteIndexStoreError);
        assert.equal(error.code, "INVALID_DELETE_RUN");
        return true;
      },
    );
    assert.deepEqual(database.prepare("PRAGMA foreign_key_check").all(), []);
  } finally {
    database.close();
  }
});

void test("marks an unchanged package seen without replacing derivatives", async () => {
  const database = openDatabase(await databasePath());
  const sourceRoot = source("auto-design");
  try {
    await new SQLiteSourceRegistry(database).add(sourceRoot);
    const store = new SQLiteIndexStore(database);
    const oldRun = await startRun(store, sourceRoot.name, "sync:old");
    const change = packageChange({
      sourceName: sourceRoot.name,
      videoId: "unchanged_video",
      syncId: oldRun.id,
      hashCharacter: "d",
      searchTerm: "unchanged",
      vectorValue: 0.4,
    });
    await store.applyPackage(change);
    // oldRun must finish before currentRun can start: recordRun rejects a
    // second running run for the same source.
    await store.recordRun(
      oldRun.finish({
        status: "ok",
        finishedAt: "2026-08-11T00:00:30.000Z",
        counters: {
          packagesSeen: 1,
          packagesUnchanged: 0,
          packagesIndexed: 1,
          packagesFailed: 0,
          packagesDeleted: 0,
        },
      }),
    );
    const currentRun = await startRun(store, sourceRoot.name, "sync:current");
    const before = database
      .prepare(
        "SELECT package_hash, (SELECT count(*) FROM embeddings) AS embeddings FROM video_packages",
      )
      .get();

    await store.markPackageSeen(change.videoPackage.ref, currentRun.id);
    assert.equal(
      await store.deletePackagesNotSeen(sourceRoot.name, currentRun.id),
      0,
    );
    const after = database
      .prepare(
        "SELECT package_hash, last_seen_sync_id, (SELECT count(*) FROM embeddings) AS embeddings FROM video_packages",
      )
      .get();
    assert.equal(after?.package_hash, before?.package_hash);
    assert.equal(after?.embeddings, before?.embeddings);
    assert.equal(after?.last_seen_sync_id, currentRun.id.value);
  } finally {
    database.close();
  }
});

void test("a second concurrent run over one source is rejected, so neither can delete the other's packages", async () => {
  // Deliberate reproduction of the hypothesis left open on 13 August, after
  // a cold run launched four syncs (two overlapping) and `status` reported
  // 13 videos where there were 53. The mechanism was `deletePackagesNotSeen`,
  // which removes every package whose `last_seen_sync_id` is not the run
  // asking: whatever a concurrent run had already claimed looked unseen.
  // `recordRun` now rejects a second `running` run for the same source, so
  // the second sync never gets to claim or delete anything.
  const path = await databasePath();
  const database = openDatabase(path);
  const sourceRoot = source("auto-design");
  try {
    const registry = new SQLiteSourceRegistry(database);
    await registry.add(sourceRoot);
    const store = new SQLiteIndexStore(database);

    const seed = await startRun(store, sourceRoot.name, "sync:seed");
    for (const videoId of ["video_1", "video_2", "video_3"]) {
      await store.applyPackage(
        packageChange({
          sourceName: sourceRoot.name,
          videoId,
          syncId: seed.id,
          hashCharacter: "a",
          searchTerm: "alpha",
          vectorValue: 0.25,
        }),
      );
    }
    await store.recordRun(
      seed.finish({
        status: "ok",
        finishedAt: "2026-08-11T00:01:00.000Z",
        counters: {
          packagesSeen: 3,
          packagesUnchanged: 0,
          packagesIndexed: 3,
          packagesFailed: 0,
          packagesDeleted: 0,
        },
      }),
    );

    const runA = await startRun(store, sourceRoot.name, "sync:concurrent-a");

    // The interleaving two overlapping syncs produce: a second `sync`
    // launched while the first is still running must be rejected outright,
    // not allowed to start and race `deletePackagesNotSeen` against it.
    await assert.rejects(
      startRun(store, sourceRoot.name, "sync:concurrent-b"),
      (error: unknown) => {
        assert.ok(error instanceof SQLiteIndexStoreError);
        assert.equal(error.code, "SYNC_ALREADY_RUNNING");
        assert.match(error.message, /sync:concurrent-a/);
        assert.match(error.message, /2026-08-11T00:00:00\.000Z/);
        return true;
      },
    );

    // A can still claim and finish normally.
    await store.markPackageSeen(
      PackageRef.create(sourceRoot.name, VideoId.create("video_1")),
      runA.id,
    );
    await store.markPackageSeen(
      PackageRef.create(sourceRoot.name, VideoId.create("video_2")),
      runA.id,
    );
    await store.markPackageSeen(
      PackageRef.create(sourceRoot.name, VideoId.create("video_3")),
      runA.id,
    );
    assert.equal(
      await store.deletePackagesNotSeen(sourceRoot.name, runA.id),
      0,
    );

    // Every package survives: the second run never got to exist.
    assert.equal((await store.listPackageRefs(sourceRoot.name)).length, 3);
  } finally {
    database.close();
  }
});
