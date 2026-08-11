import assert from "node:assert/strict";
import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  realpath,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import {
  resolveSourceLayout,
  SourceLayoutError,
  type SourceLayoutErrorCode,
} from "../../../src/infrastructure/filesystem/source-layout-resolver.js";

async function withTempDirectory(
  run: (directory: string) => Promise<void>,
): Promise<void> {
  const directory = await mkdtemp(join(tmpdir(), "auto-youtube-rag-layout-"));

  try {
    await run(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

async function createCollection(parent: string, name = "collection") {
  const collectionPath = join(parent, name);
  const manifestPath = join(collectionPath, "manifest.json");
  const videosPath = join(collectionPath, "videos");

  await mkdir(videosPath, { recursive: true });
  await writeFile(manifestPath, '{"videos":[]}', "utf8");

  return { collectionPath, manifestPath, videosPath };
}

async function readTree(directory: string, prefix = ""): Promise<string[]> {
  const result: string[] = [];
  const entries = await readdir(directory, { withFileTypes: true });
  entries.sort((left, right) => left.name.localeCompare(right.name));

  for (const entry of entries) {
    const relativePath = prefix === "" ? entry.name : `${prefix}/${entry.name}`;
    const absolutePath = join(directory, entry.name);

    if (entry.isDirectory()) {
      result.push(`directory:${relativePath}`);
      result.push(...(await readTree(absolutePath, relativePath)));
    } else {
      result.push(
        `file:${relativePath}:${await readFile(absolutePath, "utf8")}`,
      );
    }
  }

  return result;
}

function assertLayoutError(code: SourceLayoutErrorCode) {
  return (error: unknown): boolean => {
    assert.ok(error instanceof SourceLayoutError);
    assert.equal(error.code, code);
    return true;
  };
}

void test("resolves a collection root and its videos directory identically without writing", async () => {
  await withTempDirectory(async (directory) => {
    const collection = await createCollection(directory);
    const before = await readTree(directory);

    const fromCollection = await resolveSourceLayout(collection.collectionPath);
    const fromVideos = await resolveSourceLayout(collection.videosPath);

    assert.deepEqual(fromCollection, fromVideos);
    assert.deepEqual(fromCollection, {
      collectionPath: await realpath(collection.collectionPath),
      manifestPath: await realpath(collection.manifestPath),
      videosPath: await realpath(collection.videosPath),
    });
    assert.deepEqual(await readTree(directory), before);
  });
});

void test("rejects empty, missing and non-directory inputs", async () => {
  await assert.rejects(
    resolveSourceLayout(" "),
    assertLayoutError("INVALID_SOURCE_PATH"),
  );

  await withTempDirectory(async (directory) => {
    const filePath = join(directory, "source.txt");
    await writeFile(filePath, "not a directory", "utf8");

    await assert.rejects(
      resolveSourceLayout(join(directory, "missing")),
      assertLayoutError("SOURCE_PATH_NOT_FOUND"),
    );
    await assert.rejects(
      resolveSourceLayout(filePath),
      assertLayoutError("SOURCE_PATH_NOT_DIRECTORY"),
    );
  });
});

void test("rejects layouts without a manifest or videos directory", async () => {
  await withTempDirectory(async (directory) => {
    const withoutManifest = join(directory, "without-manifest");
    await mkdir(join(withoutManifest, "videos"), { recursive: true });

    const withoutVideos = join(directory, "without-videos");
    await mkdir(withoutVideos, { recursive: true });
    await writeFile(join(withoutVideos, "manifest.json"), "{}", "utf8");

    await assert.rejects(
      resolveSourceLayout(withoutManifest),
      assertLayoutError("INVALID_SOURCE_LAYOUT"),
    );
    await assert.rejects(
      resolveSourceLayout(withoutVideos),
      assertLayoutError("INVALID_SOURCE_LAYOUT"),
    );
  });
});

void test("rejects an input that is both a collection and a parent collection videos directory", async () => {
  await withTempDirectory(async (directory) => {
    const outer = await createCollection(directory, "outer");
    await writeFile(join(outer.videosPath, "manifest.json"), "{}", "utf8");
    await mkdir(join(outer.videosPath, "videos"));

    await assert.rejects(
      resolveSourceLayout(outer.videosPath),
      assertLayoutError("AMBIGUOUS_SOURCE_LAYOUT"),
    );
  });
});
