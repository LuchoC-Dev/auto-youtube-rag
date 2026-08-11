import assert from "node:assert/strict";
import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, test } from "node:test";

import { addSource } from "../../../src/application/sources/add-source.js";
import { listSources } from "../../../src/application/sources/list-sources.js";
import { removeSource } from "../../../src/application/sources/remove-source.js";
import { resolveSourceLayout } from "../../../src/infrastructure/filesystem/source-layout-resolver.js";
import { openDatabase } from "../../../src/infrastructure/sqlite/open-database.js";
import {
  SQLiteSourceRegistry,
  SQLiteSourceRegistryError,
} from "../../../src/infrastructure/sqlite/sqlite-source-registry.js";

const temporaryDirectories: string[] = [];

async function createCollection(): Promise<{
  readonly root: string;
  readonly collection: string;
  readonly videos: string;
  readonly database: string;
}> {
  const root = await mkdtemp(
    join(tmpdir(), "auto-youtube-rag-sources-use-case-"),
  );
  temporaryDirectories.push(root);
  const collection = join(root, "auto-design");
  const videos = join(collection, "videos");
  await mkdir(videos, { recursive: true });
  await writeFile(join(collection, "manifest.json"), '{"videos":[]}', "utf8");
  await writeFile(join(videos, "keep.txt"), "immutable", "utf8");
  return { root, collection, videos, database: join(root, "index.sqlite") };
}

async function sourceTree(
  root: string,
  prefix = "",
): Promise<readonly string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  entries.sort((left, right) => left.name.localeCompare(right.name));
  const result: string[] = [];
  for (const entry of entries) {
    if (entry.name.startsWith("index.sqlite")) continue;
    const relative = prefix === "" ? entry.name : `${prefix}/${entry.name}`;
    const absolute = join(root, entry.name);
    if (entry.isDirectory()) {
      result.push(`d:${relative}`);
      result.push(...(await sourceTree(absolute, relative)));
    } else {
      result.push(`f:${relative}:${await readFile(absolute, "utf8")}`);
    }
  }
  return result;
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

void test("adds either source path canonically and lists registered roots", async () => {
  const fixture = await createCollection();
  const database = openDatabase(fixture.database);
  try {
    const registry = new SQLiteSourceRegistry(database);
    const added = await addSource(
      { registry, resolveLayout: resolveSourceLayout },
      { name: "auto-design", path: fixture.videos },
    );
    assert.equal(added.name.value, "auto-design");
    assert.deepEqual(await listSources(registry), [added]);

    await assert.rejects(
      addSource(
        { registry, resolveLayout: resolveSourceLayout },
        { name: "same-path", path: fixture.collection },
      ),
      (error: unknown) => {
        assert.ok(error instanceof SQLiteSourceRegistryError);
        assert.equal(error.code, "DUPLICATE_SOURCE");
        return true;
      },
    );
  } finally {
    database.close();
  }
});

void test("removes only registry data and never changes source files", async () => {
  const fixture = await createCollection();
  const before = await sourceTree(fixture.collection);
  const database = openDatabase(fixture.database);
  try {
    const registry = new SQLiteSourceRegistry(database);
    await addSource(
      { registry, resolveLayout: resolveSourceLayout },
      { name: "auto-design", path: fixture.collection },
    );
    await removeSource(registry, "auto-design");
    assert.deepEqual(await listSources(registry), []);
    assert.deepEqual(await sourceTree(fixture.collection), before);
  } finally {
    database.close();
  }
});
