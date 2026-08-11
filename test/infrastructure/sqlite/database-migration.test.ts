import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { afterEach, test } from "node:test";

import {
  SQLiteMigrationError,
  openDatabase,
} from "../../../src/infrastructure/sqlite/open-database.js";

const temporaryDirectories: string[] = [];

async function databasePath(): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), "auto-youtube-rag-sqlite-"));
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

function scalarNumber(database: DatabaseSync, sql: string): number {
  const row = database.prepare(sql).get() as
    Record<string, unknown> | undefined;
  assert.ok(row);
  const value = Object.values(row)[0];
  if (typeof value !== "number") {
    throw new TypeError(
      `Expected a numeric SQLite scalar, received ${typeof value}.`,
    );
  }
  return value;
}

void test("opens twice idempotently with WAL, foreign keys and version 1", async () => {
  const path = await databasePath();
  const first = openDatabase(path);
  try {
    assert.equal(
      first.prepare("PRAGMA journal_mode").get()?.journal_mode,
      "wal",
    );
    assert.equal(scalarNumber(first, "PRAGMA foreign_keys"), 1);
    assert.equal(
      first
        .prepare("SELECT value FROM schema_meta WHERE key = 'schema_version'")
        .get()?.value,
      "1",
    );
    assert.deepEqual(first.prepare("PRAGMA foreign_key_check").all(), []);
    assert.equal(
      first.prepare("PRAGMA integrity_check").get()?.integrity_check,
      "ok",
    );
  } finally {
    first.close();
  }

  const second = openDatabase(path);
  try {
    assert.equal(
      scalarNumber(
        second,
        "SELECT count(*) FROM schema_meta WHERE key = 'schema_version'",
      ),
      1,
    );
  } finally {
    second.close();
  }
});

void test("creates every approved table, index and FTS trigger", async () => {
  const database = openDatabase(await databasePath());
  try {
    const objects = database
      .prepare(
        "SELECT type, name FROM sqlite_master WHERE name NOT LIKE 'sqlite_%' ORDER BY type, name",
      )
      .all() as Record<string, unknown>[];
    const names = new Set(objects.map((row) => row.name));

    for (const name of [
      "schema_meta",
      "sources",
      "sync_runs",
      "video_packages",
      "source_documents",
      "knowledge_units",
      "search_fragments",
      "fragment_fts",
      "embeddings",
      "sync_issues",
      "fragment_fts_insert",
      "fragment_fts_update",
      "fragment_fts_delete",
    ]) {
      assert.equal(names.has(name), true, `missing SQLite object: ${name}`);
    }

    database.exec(`
      INSERT INTO sources(name, collection_path, manifest_path, videos_path, enabled, created_at, updated_at)
      VALUES ('auto-design', 'C:/collection', 'C:/collection/manifest.json', 'C:/collection/videos', 1, '2026-08-11T00:00:00.000Z', '2026-08-11T00:00:00.000Z');
      INSERT INTO sync_runs(id, source_id, status, started_at, finished_at, counters_json)
      VALUES ('sync:one', 1, 'running', '2026-08-11T00:00:00.000Z', NULL, '{}');
      INSERT INTO video_packages(source_id, video_id, slug, relative_path, package_hash, last_seen_sync_id, indexed_at)
      VALUES (1, 'video_1', 'video-1', 'videos/video-1', '${"a".repeat(64)}', 'sync:one', '2026-08-11T00:00:00.000Z');
      INSERT INTO source_documents(package_id, kind, relative_path, content_hash, byte_size, parser_version)
      VALUES (1, 'context', 'deliverables/context.md', '${"b".repeat(64)}', 10, 'context-v1');
      INSERT INTO knowledge_units(document_id, parent_id, stable_key, unit_type, depth, ordinal, title, content, structured_json, heading_path_json, timestamps_json, visual_evidence_json, estimated_tokens, content_hash, searchable)
      VALUES (1, NULL, 'unit:root', 'context_document', 0, 0, 'Original title', 'Original searchable body', NULL, '[]', '[]', '[]', 3, '${"c".repeat(64)}', 1);
      INSERT INTO search_fragments(unit_id, ordinal, title, heading_path, content, token_count, content_hash)
      VALUES (1, 0, 'Original title', 'Fundamentos', 'Original searchable body', 3, '${"d".repeat(64)}');
    `);

    assert.equal(
      scalarNumber(
        database,
        "SELECT count(*) FROM fragment_fts WHERE fragment_fts MATCH 'searchable'",
      ),
      1,
    );
    database.exec(
      "UPDATE search_fragments SET content = 'Updated semantic content' WHERE id = 1",
    );
    assert.equal(
      scalarNumber(
        database,
        "SELECT count(*) FROM fragment_fts WHERE fragment_fts MATCH 'updated'",
      ),
      1,
    );
    database.exec("DELETE FROM search_fragments WHERE id = 1");
    assert.equal(
      scalarNumber(database, "SELECT count(*) FROM fragment_fts"),
      0,
    );
  } finally {
    database.close();
  }
});

void test("rejects an incompatible version without mutating the database", async () => {
  const path = await databasePath();
  const incompatible = new DatabaseSync(path);
  incompatible.exec(`
    CREATE TABLE schema_meta(key TEXT PRIMARY KEY, value TEXT NOT NULL);
    INSERT INTO schema_meta(key, value) VALUES ('schema_version', '99');
    CREATE TABLE preserved(value TEXT NOT NULL);
    INSERT INTO preserved(value) VALUES ('unchanged');
  `);
  incompatible.close();

  assert.throws(
    () => openDatabase(path),
    (error: unknown) => {
      assert.ok(error instanceof SQLiteMigrationError);
      assert.equal(error.code, "INCOMPATIBLE_SCHEMA_VERSION");
      return true;
    },
  );

  const verify = new DatabaseSync(path);
  try {
    assert.equal(
      verify.prepare("SELECT value FROM preserved").get()?.value,
      "unchanged",
    );
    assert.equal(
      verify.prepare("SELECT value FROM schema_meta").get()?.value,
      "99",
    );
    assert.equal(
      scalarNumber(
        verify,
        "SELECT count(*) FROM sqlite_master WHERE name = 'sources'",
      ),
      0,
    );
  } finally {
    verify.close();
  }
});

void test("rejects a non-empty unversioned database without mutation", async () => {
  const path = await databasePath();
  const legacy = new DatabaseSync(path);
  legacy.exec(
    "CREATE TABLE legacy_data(value TEXT); INSERT INTO legacy_data VALUES ('keep');",
  );
  legacy.close();

  assert.throws(
    () => openDatabase(path),
    (error: unknown) => {
      assert.ok(error instanceof SQLiteMigrationError);
      assert.equal(error.code, "UNVERSIONED_SCHEMA");
      return true;
    },
  );

  const verify = new DatabaseSync(path);
  try {
    assert.equal(
      verify.prepare("SELECT value FROM legacy_data").get()?.value,
      "keep",
    );
  } finally {
    verify.close();
  }
});
