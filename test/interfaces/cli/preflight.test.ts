import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";

import { runCli, type CliWriter } from "../../../src/interfaces/cli/run-cli.js";
import type { ApplicationConfig } from "../../../src/main/create-application.js";
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

async function tempConfig(): Promise<{
  root: string;
  config: ApplicationConfig;
}> {
  const root = await mkdtemp(join(tmpdir(), "auto-youtube-rag-preflight-"));
  return {
    root,
    config: {
      databasePath: join(root, "home", "index.sqlite"),
      modelCachePath: join(root, "home", "models"),
    },
  };
}

async function command(argv: readonly string[], config: ApplicationConfig) {
  const stdout = new BufferWriter();
  const stderr = new BufferWriter();
  const exitCode = await runCli({
    argv,
    config,
    stdout,
    stderr,
    // Any command reaching createApplication here means the preflight
    // failed to short-circuit before opening SQLite -- the test fails
    // loudly instead of silently building a real application.
    applicationFactory: () => {
      throw new Error(
        "preflight failed to block before building the Application",
      );
    },
  });
  return {
    exitCode,
    output: record(JSON.parse(stdout.value) as unknown),
  };
}

void test("status without a library: LIBRARY_NOT_FOUND, code 1, names init", async () => {
  const { root, config } = await tempConfig();
  try {
    const result = await command(["status"], config);
    assert.equal(result.exitCode, 1);
    const error = record(result.output.error);
    assert.equal(error.code, "LIBRARY_NOT_FOUND");
    assert.match(String(error.message), /auto-youtube-rag init/u);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

void test("source add without a library: LIBRARY_NOT_FOUND", async () => {
  const { root, config } = await tempConfig();
  try {
    const result = await command(
      ["source", "add", "C:\\videos", "--name", "design"],
      config,
    );
    assert.equal(result.exitCode, 1);
    assert.equal(record(result.output.error).code, "LIBRARY_NOT_FOUND");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

void test("sync without a library: LIBRARY_NOT_FOUND, not MODEL_NOT_INSTALLED", async () => {
  const { root, config } = await tempConfig();
  try {
    const result = await command(["sync"], config);
    assert.equal(result.exitCode, 1);
    assert.equal(record(result.output.error).code, "LIBRARY_NOT_FOUND");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

void test("sync with a library but no model: MODEL_NOT_INSTALLED, code 1, names models install", async () => {
  const { root, config } = await tempConfig();
  try {
    // "init --skip-model" cannot go through this test's throwing
    // applicationFactory, so create the library file directly -- the
    // preflight only checks existence.
    await mkdir(dirname(config.databasePath), { recursive: true });
    await writeFile(config.databasePath, "", "utf8");

    const result = await command(["sync"], config);
    assert.equal(result.exitCode, 1);
    const error = record(result.output.error);
    assert.equal(error.code, "MODEL_NOT_INSTALLED");
    assert.match(String(error.message), /auto-youtube-rag models install/u);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

void test("retrieve with library and model both present: preflight passes and reaches the Application", async () => {
  const { root, config } = await tempConfig();
  try {
    await mkdir(dirname(config.databasePath), { recursive: true });
    await writeFile(config.databasePath, "", "utf8");
    await mkdir(config.modelCachePath, { recursive: true });
    await installFakeModel(config.modelCachePath);

    const stdout = new BufferWriter();
    const stderr = new BufferWriter();
    let reachedApplication = false;
    await runCli({
      argv: ["retrieve", "brutalismo"],
      config,
      stdout,
      stderr,
      applicationFactory: () => {
        reachedApplication = true;
        throw new Error("stop here: preflight passed, as expected");
      },
    });
    assert.equal(reachedApplication, true);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

void test("doctor runs without a library or a model (requirement: none)", async () => {
  const { root, config } = await tempConfig();
  try {
    const stdout = new BufferWriter();
    const stderr = new BufferWriter();
    let reachedApplication = false;
    await runCli({
      argv: ["doctor"],
      config,
      stdout,
      stderr,
      applicationFactory: () => {
        reachedApplication = true;
        throw new Error("stop here: doctor requires nothing, as expected");
      },
    });
    assert.equal(reachedApplication, true);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
