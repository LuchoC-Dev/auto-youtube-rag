import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { ModelInstallerError } from "../../../src/application/ports/model-installer.js";
import {
  E5ModelInstaller,
  type E5DownloadOptions,
  type E5DownloadRuntime,
} from "../../../src/infrastructure/embeddings/e5-model-installer.js";
import { readInstallReceipt } from "../../../src/infrastructure/config/model-install-state.js";
import { activeModelProfile } from "../../../src/infrastructure/embeddings/model-profile.js";

const requiredModelFiles = activeModelProfile.requiredFiles;

const modelDirectory = join("Xenova", "multilingual-e5-small");

class FakeDownloadRuntime implements E5DownloadRuntime {
  public calls: E5DownloadOptions[] = [];

  public constructor(private readonly fail = false) {}

  public async download(options: E5DownloadOptions): Promise<void> {
    this.calls.push(options);
    if (this.fail) {
      throw new Error("network unavailable");
    }
    for (const relativePath of requiredModelFiles) {
      const target = join(options.cacheDir, modelDirectory, relativePath);
      await mkdir(join(target, ".."), { recursive: true });
      await writeFile(target, "downloaded", "utf8");
    }
  }
}

async function writeAllRequiredFiles(root: string): Promise<void> {
  for (const relativePath of requiredModelFiles) {
    const target = join(root, modelDirectory, relativePath);
    await mkdir(join(target, ".."), { recursive: true });
    await writeFile(target, "origin", "utf8");
  }
}

async function tempDir(): Promise<string> {
  return mkdtemp(join(tmpdir(), "auto-youtube-rag-model-installer-"));
}

void test("download requests the approved repository, revision and dtype at the resolved destination", async () => {
  const root = await tempDir();
  try {
    const runtime = new FakeDownloadRuntime();
    const installer = new E5ModelInstaller({ runtime });
    const modelsPath = join(root, "models");

    const outcome = await installer.install({
      modelsPath,
      from: null,
      force: false,
    });

    assert.equal(outcome.status, "installed");
    assert.equal(outcome.source, "download");
    assert.ok(outcome.bytes > 0);
    assert.equal(runtime.calls.length, 1);
    const call = runtime.calls[0];
    assert.ok(call);
    assert.equal(call.repository, "Xenova/multilingual-e5-small");
    assert.equal(call.revision, "main");
    assert.equal(call.dtype, "q8");
    assert.equal(call.cacheDir, modelsPath);

    const receipt = await readInstallReceipt(modelsPath);
    assert.ok(receipt !== null);
    assert.equal(receipt.source, "download");
    assert.equal(receipt.files.length, requiredModelFiles.length);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

void test("already installed: does nothing and never calls the download runtime", async () => {
  const root = await tempDir();
  try {
    const runtime = new FakeDownloadRuntime();
    const installer = new E5ModelInstaller({ runtime });
    const modelsPath = join(root, "models");

    await installer.install({ modelsPath, from: null, force: false });
    assert.equal(runtime.calls.length, 1);

    const second = await installer.install({
      modelsPath,
      from: null,
      force: false,
    });
    assert.equal(second.status, "already_installed");
    assert.equal(second.source, null);
    assert.equal(runtime.calls.length, 1);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

void test("--from with a complete model: copies, writes a receipt and never empties the origin", async () => {
  const root = await tempDir();
  try {
    const from = join(root, "origin");
    await writeAllRequiredFiles(from);
    const modelsPath = join(root, "models");
    const installer = new E5ModelInstaller({
      runtime: new FakeDownloadRuntime(),
    });

    const outcome = await installer.install({ modelsPath, from, force: false });

    assert.equal(outcome.status, "adopted");
    assert.equal(outcome.source, "copy");
    assert.ok(outcome.bytes > 0);

    const receipt = await readInstallReceipt(modelsPath);
    assert.ok(receipt !== null);
    assert.equal(receipt.source, "copy");

    for (const relativePath of requiredModelFiles) {
      const originContent = await readFile(
        join(from, modelDirectory, relativePath),
        "utf8",
      );
      assert.equal(originContent, "origin");
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

void test("--from with an incomplete model: rejects with MODEL_SOURCE_INVALID instead of falling back to download", async () => {
  const root = await tempDir();
  try {
    const from = join(root, "origin");
    const [firstRequired] = requiredModelFiles;
    assert.ok(firstRequired);
    const partial = join(from, modelDirectory, firstRequired);
    await mkdir(join(partial, ".."), { recursive: true });
    await writeFile(partial, "partial", "utf8");

    const runtime = new FakeDownloadRuntime();
    const installer = new E5ModelInstaller({ runtime });
    const modelsPath = join(root, "models");

    await assert.rejects(
      installer.install({ modelsPath, from, force: false }),
      (error: unknown) => {
        assert.ok(error instanceof ModelInstallerError);
        assert.equal(error.code, "MODEL_SOURCE_INVALID");
        return true;
      },
    );
    assert.equal(runtime.calls.length, 0);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

void test("force reinstalls even when a valid model is already present", async () => {
  const root = await tempDir();
  try {
    const runtime = new FakeDownloadRuntime();
    const installer = new E5ModelInstaller({ runtime });
    const modelsPath = join(root, "models");

    await installer.install({ modelsPath, from: null, force: false });
    const forced = await installer.install({
      modelsPath,
      from: null,
      force: true,
    });

    assert.equal(forced.status, "installed");
    assert.equal(runtime.calls.length, 2);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

void test("wraps a download failure in MODEL_DOWNLOAD_FAILED", async () => {
  const root = await tempDir();
  try {
    const installer = new E5ModelInstaller({
      runtime: new FakeDownloadRuntime(true),
    });

    await assert.rejects(
      installer.install({
        modelsPath: join(root, "models"),
        from: null,
        force: false,
      }),
      (error: unknown) => {
        assert.ok(error instanceof ModelInstallerError);
        assert.equal(error.code, "MODEL_DOWNLOAD_FAILED");
        assert.ok(error.cause instanceof Error);
        return true;
      },
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
