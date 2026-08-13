import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { ModelInstallerError } from "../../../src/application/ports/model-installer.js";
import { runCli, type CliWriter } from "../../../src/interfaces/cli/run-cli.js";
import type { ApplicationConfig } from "../../../src/main/create-application.js";
import { FakeModelInstaller } from "../../fakes/fake-model-installer.js";

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

async function command(
  argv: readonly string[],
  config: ApplicationConfig,
  modelInstaller?: FakeModelInstaller,
) {
  const stdout = new BufferWriter();
  const stderr = new BufferWriter();
  const exitCode = await runCli({
    argv,
    config,
    stdout,
    stderr,
    // Any command reaching createApplication here (i.e. not a models
    // command) is a wiring bug: this factory always throws, so the test
    // fails loudly instead of silently touching a real SQLite database.
    applicationFactory: () => {
      throw new Error("models commands must never build the Application");
    },
    modelInstallerFactory:
      modelInstaller === undefined ? undefined : () => modelInstaller,
  });
  return {
    exitCode,
    output: record(JSON.parse(stdout.value) as unknown),
  };
}

async function tempConfig(): Promise<{
  root: string;
  config: ApplicationConfig;
}> {
  const root = await mkdtemp(join(tmpdir(), "auto-youtube-rag-models-cli-"));
  return {
    root,
    config: {
      databasePath: join(root, "index.sqlite"),
      modelCachePath: join(root, "models"),
    },
  };
}

void test("models install never builds the Application and reports the installed receipt", async () => {
  const { root, config } = await tempConfig();
  try {
    const installer = new FakeModelInstaller({
      status: "installed",
      source: "download",
      bytes: 135_266_304,
    });

    const result = await command(["models", "install"], config, installer);

    assert.equal(result.exitCode, 0);
    assert.equal(result.output.status, "installed");
    assert.equal(record(result.output.model).key, "e5-small");
    assert.equal(result.output.cache_path, config.modelCachePath);
    assert.equal(result.output.bytes, 135_266_304);
    assert.equal(result.output.source, "download");
    assert.deepEqual(installer.calls, [
      { modelsPath: config.modelCachePath, from: null, force: false },
    ]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

void test("models install passes --force and --from through to the installer", async () => {
  const { root, config } = await tempConfig();
  try {
    const installer = new FakeModelInstaller({
      status: "adopted",
      source: "copy",
      bytes: 42,
    });

    const result = await command(
      ["models", "install", "--force", "--from", "C:\\repo\\.cache\\models"],
      config,
      installer,
    );

    assert.equal(result.exitCode, 0);
    assert.equal(result.output.status, "adopted");
    assert.deepEqual(installer.calls, [
      {
        modelsPath: config.modelCachePath,
        from: "C:\\repo\\.cache\\models",
        force: true,
      },
    ]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

void test("models install maps an incomplete --from to usage exit code 2", async () => {
  const { root, config } = await tempConfig();
  try {
    const installer = new FakeModelInstaller(
      { status: "installed", source: "download", bytes: 0 },
      new ModelInstallerError(
        "MODEL_SOURCE_INVALID",
        "--from does not contain a complete model.",
        false,
      ),
    );

    const result = await command(
      ["models", "install", "--from", "C:\\bad-source"],
      config,
      installer,
    );

    assert.equal(result.exitCode, 2);
    assert.equal(record(result.output.error).code, "MODEL_SOURCE_INVALID");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

void test("models install maps a download failure to a retryable operational error", async () => {
  const { root, config } = await tempConfig();
  try {
    const installer = new FakeModelInstaller(
      { status: "installed", source: "download", bytes: 0 },
      new ModelInstallerError(
        "MODEL_DOWNLOAD_FAILED",
        "network unavailable",
        true,
      ),
    );

    const result = await command(["models", "install"], config, installer);

    assert.equal(result.exitCode, 1);
    const error = record(result.output.error);
    assert.equal(error.code, "MODEL_DOWNLOAD_FAILED");
    assert.equal(error.retryable, true);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

void test("models status reports absent with exit code 0 before any install ever ran", async () => {
  const { root, config } = await tempConfig();
  try {
    const result = await command(["models", "status"], config);

    assert.equal(result.exitCode, 0);
    assert.equal(result.output.status, "absent");
    assert.equal(result.output.cache_path, config.modelCachePath);
    assert.equal(result.output.issues, undefined);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
