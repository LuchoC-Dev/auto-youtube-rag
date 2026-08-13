import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import {
  measureModelFiles,
  readInstallReceipt,
  readModelState,
  readSourceState,
  requiredModelFiles,
  writeInstallReceipt,
  type InstallReceipt,
} from "../../../src/infrastructure/config/model-install-state.js";

const modelDirectory = join("Xenova", "multilingual-e5-small");

async function writeAllRequiredFiles(
  root: string,
  bytesByFile: Readonly<Record<string, string>> = {},
): Promise<void> {
  for (const relativePath of requiredModelFiles) {
    const target = join(root, modelDirectory, relativePath);
    await mkdir(join(target, ".."), { recursive: true });
    await writeFile(target, bytesByFile[relativePath] ?? "x", "utf8");
  }
}

function fixtureReceipt(
  files: readonly { path: string; bytes: number }[],
): InstallReceipt {
  return {
    schema_version: "1.0",
    model: {
      key: "e5-small",
      version: "Xenova/multilingual-e5-small@main:q8",
      dimensions: 384,
    },
    files,
    installed_at: new Date().toISOString(),
    source: "download",
  };
}

async function tempDir(): Promise<string> {
  return mkdtemp(join(tmpdir(), "auto-youtube-rag-model-state-"));
}

void test("absent: no receipt and no files", async () => {
  const root = await tempDir();
  try {
    assert.equal(await readModelState(root), "absent");
    assert.equal(await readInstallReceipt(root), null);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

void test("installed: receipt matches files on disk by size", async () => {
  const root = await tempDir();
  try {
    await writeAllRequiredFiles(root);
    const measured = await measureModelFiles(root);
    assert.ok(measured !== null);
    await writeInstallReceipt(root, fixtureReceipt(measured));

    assert.equal(await readModelState(root), "installed");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

void test("incomplete: a file's size on disk differs from the receipt (truncated download)", async () => {
  const root = await tempDir();
  try {
    await writeAllRequiredFiles(root);
    const measured = await measureModelFiles(root);
    assert.ok(measured !== null);
    await writeInstallReceipt(root, fixtureReceipt(measured));

    // Truncate one file after the receipt was written.
    const truncated = requiredModelFiles[0];
    assert.ok(truncated);
    await writeFile(join(root, modelDirectory, truncated), "", "utf8");

    assert.equal(await readModelState(root), "incomplete");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

void test("incomplete: a receipt exists but files are missing", async () => {
  const root = await tempDir();
  try {
    await writeInstallReceipt(
      root,
      fixtureReceipt(requiredModelFiles.map((path) => ({ path, bytes: 10 }))),
    );

    assert.equal(await readModelState(root), "incomplete");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

void test("incomplete: files exist on disk but there is no receipt", async () => {
  const root = await tempDir();
  try {
    await writeAllRequiredFiles(root);

    assert.equal(await readModelState(root), "incomplete");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

void test("readSourceState reports complete only when all four files exist", async () => {
  const root = await tempDir();
  try {
    assert.equal(await readSourceState(root), "absent");
    await writeAllRequiredFiles(root);
    assert.equal(await readSourceState(root), "complete");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

void test("readSourceState reports absent when only some files exist", async () => {
  const root = await tempDir();
  try {
    const first = requiredModelFiles[0];
    assert.ok(first);
    const target = join(root, modelDirectory, first);
    await mkdir(join(target, ".."), { recursive: true });
    await writeFile(target, "partial", "utf8");

    assert.equal(await readSourceState(root), "absent");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
