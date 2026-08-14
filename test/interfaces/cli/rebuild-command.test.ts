import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import type { RebuildIndexResult } from "../../../src/application/indexing/rebuild-index.js";
import { SyncId, VideoId } from "../../../src/domain/indexing/identifiers.js";
import { SyncIssue } from "../../../src/domain/indexing/sync-run.js";
import { runCli, type CliWriter } from "../../../src/interfaces/cli/run-cli.js";
import { createApplication } from "../../../src/main/create-application.js";
import { installFakeModel } from "../../helpers/install-fake-model.js";

class BufferWriter implements CliWriter {
  public value = "";
  public write(text: string): void {
    this.value += text;
  }
}

function record(value: unknown): Record<string, unknown> {
  assert.equal(typeof value, "object");
  assert.notEqual(value, null);
  return value as Record<string, unknown>;
}

function json(text: string): Record<string, unknown> {
  return record(JSON.parse(text) as unknown);
}

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), "auto-youtube-rag-rebuild-cli-"));
  const modelCachePath = join(root, "models");
  await mkdir(modelCachePath, { recursive: true });
  await installFakeModel(modelCachePath);
  return {
    root,
    config: {
      databasePath: join(root, "data", "index.sqlite"),
      modelCachePath,
    },
  };
}

async function command(
  argv: readonly string[],
  config: { readonly databasePath: string; readonly modelCachePath: string },
  result?: RebuildIndexResult,
) {
  const stdout = new BufferWriter();
  const stderr = new BufferWriter();
  const exitCode = await runCli({
    argv,
    config,
    stdout,
    stderr,
    applicationFactory: (applicationConfig) => {
      const application = createApplication(applicationConfig);
      return result === undefined
        ? application
        : { ...application, rebuildIndex: () => Promise.resolve(result) };
    },
  });
  return { exitCode, stdout: stdout.value, stderr: stderr.value };
}

void test("emits a compact receipt and exit code 0 for a clean rebuild", async () => {
  const setup = await fixture();
  try {
    await command(["init", "--skip-model"], setup.config);

    const outcome = await command(["rebuild", "--confirm"], setup.config, {
      status: "ok",
      sourcesRebuilt: 2,
      packagesDeleted: 51,
      packagesIndexed: 51,
      packagesFailed: 0,
      sources: [
        {
          name: "auto-design",
          status: "ok",
          packagesIndexed: 34,
          packagesFailed: 0,
        },
        {
          name: "catalog-design",
          status: "ok",
          packagesIndexed: 17,
          packagesFailed: 0,
        },
      ],
      issues: [],
    });

    assert.equal(outcome.exitCode, 0);
    const receipt = json(outcome.stdout);
    assert.equal(receipt.schema_version, "1.0");
    assert.equal(receipt.status, "ok");
    assert.equal(receipt.sources_rebuilt, 2);
    assert.equal(receipt.packages_deleted, 51);
    assert.equal(receipt.packages_indexed, 51);
    assert.equal(receipt.packages_failed, 0);
    assert.deepEqual(receipt.sources, [
      {
        name: "auto-design",
        status: "ok",
        packages_indexed: 34,
        packages_failed: 0,
      },
      {
        name: "catalog-design",
        status: "ok",
        packages_indexed: 17,
        packages_failed: 0,
      },
    ]);
    assert.deepEqual(receipt.issues, []);

    // A command that takes minutes must say so on stderr, and must say that
    // an interrupted run is recoverable by repeating it.
    assert.match(outcome.stderr, /Rebuilding the derived index/u);
    assert.match(outcome.stderr, /run it again/u);
  } finally {
    await rm(setup.root, { recursive: true, force: true });
  }
});

void test("a degraded source makes the rebuild partial with exit code 1", async () => {
  const setup = await fixture();
  try {
    await command(["init", "--skip-model"], setup.config);

    const outcome = await command(["rebuild", "--confirm"], setup.config, {
      status: "partial",
      sourcesRebuilt: 1,
      packagesDeleted: 34,
      packagesIndexed: 33,
      packagesFailed: 1,
      sources: [
        {
          name: "auto-design",
          status: "partial",
          packagesIndexed: 33,
          packagesFailed: 1,
        },
      ],
      issues: [
        SyncIssue.create({
          syncId: SyncId.create("sync:rebuild"),
          videoId: VideoId.create("video_9"),
          relativePath: "videos/video-9/context.md",
          code: "INVALID_CONTEXT",
          message: "The context file could not be parsed.",
          retryable: false,
        }),
      ],
    });

    assert.equal(outcome.exitCode, 1);
    const receipt = json(outcome.stdout);
    assert.equal(receipt.status, "partial");
    assert.equal(receipt.packages_failed, 1);
    assert.deepEqual(receipt.issues, [
      {
        video_id: "video_9",
        relative_path: "videos/video-9/context.md",
        code: "INVALID_CONTEXT",
        message: "The context file could not be parsed.",
        retryable: false,
      },
    ]);
  } finally {
    await rm(setup.root, { recursive: true, force: true });
  }
});

void test("an empty library rebuilds into nothing with exit code 0", async () => {
  const setup = await fixture();
  try {
    await command(["init", "--skip-model"], setup.config);

    // No stub: the real use case runs against a real, empty library. Nothing
    // registered means nothing to regenerate, and that is not an error.
    const outcome = await command(["rebuild", "--confirm"], setup.config);

    assert.equal(outcome.exitCode, 0);
    const receipt = json(outcome.stdout);
    assert.equal(receipt.status, "ok");
    assert.equal(receipt.sources_rebuilt, 0);
    assert.equal(receipt.packages_deleted, 0);
    assert.deepEqual(receipt.sources, []);
  } finally {
    await rm(setup.root, { recursive: true, force: true });
  }
});
