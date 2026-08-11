import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, test } from "node:test";

import { SourceName } from "../../../src/domain/indexing/identifiers.js";
import { SourceRoot } from "../../../src/domain/indexing/source-root.js";
import { openDatabase } from "../../../src/infrastructure/sqlite/open-database.js";
import {
  SQLiteSourceRegistry,
  SQLiteSourceRegistryError,
} from "../../../src/infrastructure/sqlite/sqlite-source-registry.js";
import { verifySourceRegistryContract } from "../../contracts/source-registry.contract.js";

const temporaryDirectories: string[] = [];

async function databasePath(): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), "auto-youtube-rag-sources-"));
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

function source(
  name: string,
  paths: {
    readonly collection?: string;
    readonly manifest?: string;
    readonly videos?: string;
  } = {},
): SourceRoot {
  return SourceRoot.create({
    name: SourceName.create(name),
    collectionPath: paths.collection ?? `C:\\collections\\${name}`,
    manifestPath: paths.manifest ?? `C:\\collections\\${name}\\manifest.json`,
    videosPath: paths.videos ?? `C:\\collections\\${name}\\videos`,
    enabled: true,
  });
}

void test("satisfies the SourceRegistry contract and survives reopening", async () => {
  const path = await databasePath();
  const firstDatabase = openDatabase(path);
  try {
    await verifySourceRegistryContract(
      new SQLiteSourceRegistry(
        firstDatabase,
        () => new Date("2026-08-11T00:00:00.000Z"),
      ),
    );
  } finally {
    firstDatabase.close();
  }

  const reopenedDatabase = openDatabase(path);
  try {
    const registry = new SQLiteSourceRegistry(reopenedDatabase);
    assert.deepEqual(
      (await registry.list()).map((entry) => entry.name.value),
      ["bravo"],
    );
  } finally {
    reopenedDatabase.close();
  }
});

void test("rejects duplicate names and every duplicate canonical path", async () => {
  const database = openDatabase(await databasePath());
  try {
    const registry = new SQLiteSourceRegistry(database);
    const original = source("original");
    await registry.add(original);

    for (const duplicate of [
      source("original"),
      source("collection-copy", { collection: original.collectionPath }),
      source("manifest-copy", { manifest: original.manifestPath }),
      source("videos-copy", { videos: original.videosPath }),
    ]) {
      await assert.rejects(registry.add(duplicate), (error: unknown) => {
        assert.ok(error instanceof SQLiteSourceRegistryError);
        assert.equal(error.code, "DUPLICATE_SOURCE");
        return true;
      });
    }
  } finally {
    database.close();
  }
});

void test("removes catalog derivatives but preserves detached run history", async () => {
  const database = openDatabase(await databasePath());
  try {
    const registry = new SQLiteSourceRegistry(database);
    const original = source("auto-design");
    await registry.add(original);
    database.exec(`
      INSERT INTO sync_runs(id, source_id, status, started_at, finished_at, counters_json)
      SELECT 'sync:one', id, 'ok', '2026-08-11T00:00:00.000Z', '2026-08-11T00:01:00.000Z', '{}'
      FROM sources WHERE name = 'auto-design';
      INSERT INTO video_packages(source_id, video_id, slug, relative_path, package_hash, last_seen_sync_id, indexed_at)
      SELECT id, 'video_1', 'video-1', 'videos/video-1', '${"a".repeat(64)}', 'sync:one', '2026-08-11T00:01:00.000Z'
      FROM sources WHERE name = 'auto-design';
    `);

    await registry.remove(original.name);

    assert.equal(
      database.prepare("SELECT count(*) AS count FROM video_packages").get()
        ?.count,
      0,
    );
    const run = database.prepare("SELECT id, source_id FROM sync_runs").get();
    assert.ok(run);
    assert.equal(run.id, "sync:one");
    assert.equal(run.source_id, null);
    assert.deepEqual(database.prepare("PRAGMA foreign_key_check").all(), []);
  } finally {
    database.close();
  }
});
