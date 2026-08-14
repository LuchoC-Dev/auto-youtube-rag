import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import {
  SourceName,
  SyncId,
} from "../../../src/domain/indexing/identifiers.js";
import { SyncRun } from "../../../src/domain/indexing/sync-run.js";
import { openDatabase } from "../../../src/infrastructure/sqlite/open-database.js";
import { SQLiteIndexStore } from "../../../src/infrastructure/sqlite/sqlite-index-store.js";
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
  const root = await mkdtemp(join(tmpdir(), "auto-youtube-rag-cli-"));
  const collection = join(root, "collection");
  const modelCachePath = join(root, "models");
  await mkdir(join(collection, "videos"), { recursive: true });
  await writeFile(join(collection, "manifest.json"), '{"videos":[]}', "utf8");
  await mkdir(modelCachePath, { recursive: true });
  await installFakeModel(modelCachePath);
  return {
    root,
    collection,
    config: {
      databasePath: join(root, "data", "index.sqlite"),
      modelCachePath,
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
    const initialized = await command(["init", "--skip-model"], setup.config);
    assert.equal(initialized.exitCode, 0);
    assert.equal(json(initialized.stdout).status, "initialized");
    assert.equal(
      (await command(["init", "--skip-model"], setup.config)).exitCode,
      0,
    );

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

    await command(["init", "--skip-model"], setup.config);
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

void test("sync rejects a second concurrent run, and --force supersedes the stale one", async () => {
  const setup = await fixture();
  try {
    await command(["init", "--skip-model"], setup.config);
    await command(
      ["source", "add", setup.collection, "--name", "design"],
      setup.config,
    );

    // Simulate a process that started `sync` and was killed before it could
    // finish: a `running` row left behind for the source, the way Ctrl+C or
    // a closed terminal would leave it.
    const ghostDatabase = openDatabase(setup.config.databasePath);
    await new SQLiteIndexStore(ghostDatabase).recordRun(
      SyncRun.start({
        id: SyncId.create("sync:ghost"),
        sourceName: SourceName.create("design"),
        startedAt: "2026-08-11T00:00:00.000Z",
      }),
    );
    ghostDatabase.close();

    const blocked = await command(["sync", "--source", "design"], setup.config);
    assert.equal(blocked.exitCode, 1);
    const blockedError = record(json(blocked.stdout).error);
    assert.equal(blockedError.code, "SYNC_ALREADY_RUNNING");
    assert.match(String(blockedError.message), /sync:ghost/);
    assert.match(String(blockedError.message), /sync --force/);

    const forced = await command(
      ["sync", "--source", "design", "--force"],
      setup.config,
    );
    assert.equal(forced.exitCode, 0);
    assert.equal(json(forced.stdout).status, "no_changes");

    const verifyDatabase = openDatabase(setup.config.databasePath);
    try {
      const ghostRow = verifyDatabase
        .prepare("SELECT status, finished_at FROM sync_runs WHERE id = ?")
        .get("sync:ghost");
      assert.ok(ghostRow);
      assert.equal(ghostRow.status, "failed");
      assert.ok(ghostRow.finished_at);
      const issueRow = verifyDatabase
        .prepare("SELECT code FROM sync_issues WHERE sync_id = ?")
        .get("sync:ghost");
      assert.ok(issueRow);
      assert.equal(issueRow.code, "RUN_SUPERSEDED");
    } finally {
      verifyDatabase.close();
    }
  } finally {
    await rm(setup.root, { recursive: true, force: true });
  }
});
