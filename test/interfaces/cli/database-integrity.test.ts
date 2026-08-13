import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
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

async function corruptFixture(): Promise<{
  root: string;
  config: ApplicationConfig;
}> {
  const root = await mkdtemp(join(tmpdir(), "auto-youtube-rag-corrupt-"));
  const databasePath = join(root, "home", "index.sqlite");
  const modelCachePath = join(root, "home", "models");
  await mkdir(join(root, "home"), { recursive: true });
  // Not a SQLite file at all: node:sqlite's DatabaseSync throws
  // ERR_SQLITE_ERROR ("file is not a database") opening this, the same
  // raw driver failure a corrupted/truncated real database produces.
  await writeFile(databasePath, "not a sqlite database".repeat(20), "utf8");
  await mkdir(modelCachePath, { recursive: true });
  await installFakeModel(modelCachePath);
  return { root, config: { databasePath, modelCachePath } };
}

async function command(argv: readonly string[], config: ApplicationConfig) {
  const stdout = new BufferWriter();
  const stderr = new BufferWriter();
  const exitCode = await runCli({ argv, config, stdout, stderr });
  return {
    exitCode,
    output: record(JSON.parse(stdout.value) as unknown),
  };
}

void test("status on a corrupt database: translated message pointing to doctor, not a raw driver error", async () => {
  const { root, config } = await corruptFixture();
  try {
    const result = await command(["status"], config);

    assert.equal(result.exitCode, 1);
    const error = record(result.output.error);
    assert.equal(error.code, "DATABASE_INTEGRITY_ERROR");
    assert.match(String(error.message), /auto-youtube-rag doctor/u);
    assert.doesNotMatch(String(error.message), /ERR_SQLITE_ERROR/u);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

void test("sync on a corrupt database: same translation, never a raw ERR_SQLITE_ERROR", async () => {
  const { root, config } = await corruptFixture();
  try {
    const result = await command(["sync"], config);

    assert.equal(result.exitCode, 1);
    assert.equal(record(result.output.error).code, "DATABASE_INTEGRITY_ERROR");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

void test("doctor on a corrupt database keeps running and reports the detail instead of crashing", async () => {
  const { root, config } = await corruptFixture();
  try {
    const result = await command(["doctor"], config);

    assert.equal(result.exitCode, 1);
    assert.equal(result.output.status, "error");
    const checks = result.output.checks;
    assert.ok(Array.isArray(checks));
    const integrityCheck = checks
      .map(record)
      .find((check) => check.code === "SQLITE_INTEGRITY");
    assert.ok(integrityCheck);
    assert.equal(integrityCheck.status, "error");
    // The raw driver detail must still be visible to whoever reads doctor's
    // output -- "sigue corriendo y reportando el detalle" (Z4).
    assert.match(String(integrityCheck.message), /database/iu);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
