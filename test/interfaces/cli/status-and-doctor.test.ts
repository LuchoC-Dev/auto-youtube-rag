import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { runCli, type CliWriter } from "../../../src/interfaces/cli/run-cli.js";
import { createApplication } from "../../../src/main/create-application.js";
import { FakeEmbeddingGenerator } from "../../fakes/fake-embedding-generator.js";

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

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), "auto-youtube-rag-doctor-"));
  const collection = join(root, "collection");
  const modelCachePath = join(root, "models");
  await mkdir(join(collection, "videos"), { recursive: true });
  await mkdir(modelCachePath);
  await writeFile(join(collection, "manifest.json"), '{"videos":[]}', "utf8");
  await writeFile(join(modelCachePath, "model.onnx"), "fixture", "utf8");
  return {
    root,
    collection,
    config: { databasePath: join(root, "index.sqlite"), modelCachePath },
  };
}

async function command(
  argv: readonly string[],
  config: { readonly databasePath: string; readonly modelCachePath: string },
) {
  const stdout = new BufferWriter();
  const stderr = new BufferWriter();
  const exitCode = await runCli({
    argv,
    config,
    stdout,
    stderr,
    applicationFactory: (applicationConfig) =>
      createApplication(applicationConfig, {
        embeddingGenerator: new FakeEmbeddingGenerator(),
      }),
  });
  return {
    exitCode,
    output: record(JSON.parse(stdout.value) as unknown),
  };
}

void test("reports status and runs read-only health checks", async () => {
  const setup = await fixture();
  try {
    await command(["init"], setup.config);
    await command(
      ["source", "add", setup.collection, "--name", "design"],
      setup.config,
    );

    const status = await command(["status"], setup.config);
    assert.equal(status.exitCode, 0);
    assert.equal(status.output.schemaVersion, "1");
    assert.equal(record(status.output.counts).sources, 1);
    assert.equal(record(status.output.model).dimensions, 3);

    const before = await command(["status"], setup.config);
    const doctor = await command(["doctor"], setup.config);
    const after = await command(["status"], setup.config);
    assert.equal(doctor.exitCode, 0);
    assert.equal(doctor.output.status, "ok");
    assert.deepEqual(after.output.counts, before.output.counts);
  } finally {
    await rm(setup.root, { recursive: true, force: true });
  }
});

void test("doctor reports a missing local model cache", async () => {
  const setup = await fixture();
  try {
    await command(["init"], setup.config);
    await rm(setup.config.modelCachePath, { recursive: true, force: true });
    const doctor = await command(["doctor"], setup.config);
    assert.equal(doctor.exitCode, 1);
    assert.equal(doctor.output.status, "error");
    const checks = doctor.output.checks;
    assert.ok(Array.isArray(checks));
    assert.ok(
      checks.some(
        (check) =>
          record(check).code === "EMBEDDING_MODEL" &&
          record(check).status === "error",
      ),
    );
  } finally {
    await rm(setup.root, { recursive: true, force: true });
  }
});
