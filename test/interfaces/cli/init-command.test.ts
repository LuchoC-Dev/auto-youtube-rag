import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { runCli, type CliWriter } from "../../../src/interfaces/cli/run-cli.js";
import type { ApplicationConfig } from "../../../src/main/create-application.js";
import { createApplication } from "../../../src/main/create-application.js";
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

async function tempConfig(): Promise<{
  root: string;
  config: ApplicationConfig;
}> {
  const root = await mkdtemp(join(tmpdir(), "auto-youtube-rag-init-cli-"));
  return {
    root,
    config: {
      databasePath: join(root, "home", "index.sqlite"),
      modelCachePath: join(root, "home", "models"),
    },
  };
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
    applicationFactory: createApplication,
    modelInstallerFactory:
      modelInstaller === undefined ? undefined : () => modelInstaller,
  });
  return {
    exitCode,
    output: record(JSON.parse(stdout.value) as unknown),
  };
}

void test("--skip-model never calls the installer and reports model: null", async () => {
  const { root, config } = await tempConfig();
  try {
    const installer = new FakeModelInstaller();
    const result = await command(["init", "--skip-model"], config, installer);

    assert.equal(result.exitCode, 0);
    assert.equal(result.output.status, "initialized");
    assert.equal(result.output.model, null);
    assert.equal(installer.calls.length, 0);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

void test("by default, init installs the model through the installer and reports it", async () => {
  const { root, config } = await tempConfig();
  try {
    const installer = new FakeModelInstaller({
      status: "installed",
      source: "download",
      bytes: 135_266_304,
    });
    const result = await command(["init"], config, installer);

    assert.equal(result.exitCode, 0);
    const model = record(result.output.model);
    assert.equal(model.status, "installed");
    assert.equal(model.key, "e5-small");
    assert.equal(model.bytes, 135_266_304);
    assert.equal(model.source, "download");
    assert.deepEqual(installer.calls, [
      { modelsPath: config.modelCachePath, from: null, force: false },
    ]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

void test("--from is passed through to the installer", async () => {
  const { root, config } = await tempConfig();
  try {
    const installer = new FakeModelInstaller({
      status: "adopted",
      source: "copy",
      bytes: 42,
    });
    await command(
      ["init", "--from", "C:\\repo\\.cache\\models"],
      config,
      installer,
    );

    assert.deepEqual(installer.calls, [
      {
        modelsPath: config.modelCachePath,
        from: "C:\\repo\\.cache\\models",
        force: false,
      },
    ]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

void test("LEGACY_LIBRARY_FOUND: empty home, legacy cwd library present", async () => {
  const { root, config } = await tempConfig();
  const legacyDatabasePath = join(root, "legacy", "index.sqlite");
  try {
    await mkdir(join(root, "legacy"), { recursive: true });
    await writeFile(legacyDatabasePath, "legacy", "utf8");

    const result = await command(["init", "--skip-model"], {
      ...config,
      legacyDatabasePath,
    });

    assert.equal(result.exitCode, 0);
    const warnings = result.output.warnings;
    assert.ok(Array.isArray(warnings));
    assert.equal(warnings.length, 1);
    assert.equal(record(warnings[0]).code, "LEGACY_LIBRARY_FOUND");
    assert.equal(record(warnings[0]).legacy_database_path, legacyDatabasePath);
    assert.equal(record(warnings[0]).home_database_path, config.databasePath);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

void test("no warning: empty home, no legacy library", async () => {
  const { root, config } = await tempConfig();
  try {
    const result = await command(["init", "--skip-model"], {
      ...config,
      legacyDatabasePath: join(root, "legacy", "index.sqlite"),
    });

    assert.equal(result.exitCode, 0);
    assert.deepEqual(result.output.warnings, []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

void test("no warning: home already has a library, even with a legacy library present", async () => {
  const { root, config } = await tempConfig();
  const legacyDatabasePath = join(root, "legacy", "index.sqlite");
  try {
    await mkdir(join(root, "legacy"), { recursive: true });
    await writeFile(legacyDatabasePath, "legacy", "utf8");

    const configWithLegacy = { ...config, legacyDatabasePath };
    await command(["init", "--skip-model"], configWithLegacy);
    const second = await command(["init", "--skip-model"], configWithLegacy);

    assert.equal(second.exitCode, 0);
    assert.equal(second.output.status, "already_initialized");
    assert.deepEqual(second.output.warnings, []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

void test("status also reports LEGACY_LIBRARY_FOUND when the home library is empty", async () => {
  const { root, config } = await tempConfig();
  const legacyDatabasePath = join(root, "legacy", "index.sqlite");
  try {
    await mkdir(join(root, "legacy"), { recursive: true });
    await writeFile(legacyDatabasePath, "legacy", "utf8");
    const configWithLegacy = { ...config, legacyDatabasePath };

    await command(["init", "--skip-model"], configWithLegacy);
    const status = await command(["status"], configWithLegacy);

    assert.equal(status.exitCode, 0);
    const warnings = status.output.warnings;
    assert.ok(Array.isArray(warnings));
    assert.equal(warnings.length, 1);
    assert.equal(record(warnings[0]).code, "LEGACY_LIBRARY_FOUND");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
