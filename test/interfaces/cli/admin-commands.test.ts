import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { runCli, type CliWriter } from "../../../src/interfaces/cli/run-cli.js";
import { createApplication } from "../../../src/main/create-application.js";

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
  const root = await mkdtemp(join(tmpdir(), "auto-youtube-rag-cli-"));
  const collection = join(root, "collection");
  await mkdir(join(collection, "videos"), { recursive: true });
  await writeFile(join(collection, "manifest.json"), '{"videos":[]}', "utf8");
  return {
    root,
    collection,
    config: {
      databasePath: join(root, "data", "index.sqlite"),
      modelCachePath: join(root, "models"),
    },
  };
}

async function command(
  argv: readonly string[],
  config: { readonly databasePath: string; readonly modelCachePath: string },
  applicationFactory = createApplication,
) {
  const stdout = new BufferWriter();
  const stderr = new BufferWriter();
  const exitCode = await runCli({
    argv,
    config,
    stdout,
    stderr,
    applicationFactory,
  });
  return { exitCode, stdout: stdout.value, stderr: stderr.value };
}

void test("runs init and source administration through the real composition root", async () => {
  const setup = await fixture();
  try {
    const initialized = await command(["init"], setup.config);
    assert.equal(initialized.exitCode, 0);
    assert.equal(json(initialized.stdout).status, "initialized");
    assert.equal((await command(["init"], setup.config)).exitCode, 0);

    const added = await command(
      ["source", "add", setup.collection, "--name", "design"],
      setup.config,
    );
    assert.equal(added.exitCode, 0);
    assert.equal(record(json(added.stdout).source).name, "design");

    const listed = await command(["source", "list"], setup.config);
    const listedSources = json(listed.stdout).sources;
    assert.ok(Array.isArray(listedSources));
    assert.deepEqual(
      listedSources.map((source) => record(source).name),
      ["design"],
    );

    const synced = await command(["sync", "--source", "design"], setup.config);
    assert.equal(synced.exitCode, 0);
    assert.equal(json(synced.stdout).status, "no_changes");
    assert.equal(synced.stderr, "Synchronizing registered sources...\n");

    assert.equal(
      (await command(["source", "remove", "design"], setup.config)).exitCode,
      0,
    );
    assert.deepEqual(
      json((await command(["source", "list"], setup.config)).stdout).sources,
      [],
    );
  } finally {
    await rm(setup.root, { recursive: true, force: true });
  }
});

void test("returns 2 for usage, 1 for operations and 130 for interruption", async () => {
  const setup = await fixture();
  try {
    const usage = await command(["sync", "--unknown"], setup.config);
    assert.equal(usage.exitCode, 2);
    assert.equal(record(json(usage.stdout).error).code, "INVALID_ARGUMENTS");

    await command(["init"], setup.config);
    const missing = await command(
      ["sync", "--source", "missing"],
      setup.config,
    );
    assert.equal(missing.exitCode, 1);
    assert.equal(record(json(missing.stdout).error).code, "SOURCE_NOT_FOUND");

    const interrupted = await command(["sync"], setup.config, (config) => {
      const application = createApplication(config);
      return {
        ...application,
        sync: () =>
          Promise.reject(
            Object.assign(new Error("Interrupted"), { name: "AbortError" }),
          ),
      };
    });
    assert.equal(interrupted.exitCode, 130);
  } finally {
    await rm(setup.root, { recursive: true, force: true });
  }
});
