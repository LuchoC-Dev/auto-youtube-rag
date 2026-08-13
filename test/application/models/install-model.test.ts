import assert from "node:assert/strict";
import { test } from "node:test";

import { installModel } from "../../../src/application/models/install-model.js";
import { FakeEmbeddingGenerator } from "../../fakes/fake-embedding-generator.js";
import { FakeModelInstaller } from "../../fakes/fake-model-installer.js";

void test("combines the installer outcome with the embedding generator's model identity", async () => {
  const modelInstaller = new FakeModelInstaller({
    status: "installed",
    source: "download",
    bytes: 135_266_304,
  });
  const embeddingGenerator = new FakeEmbeddingGenerator();

  const result = await installModel(
    { modelInstaller, embeddingGenerator },
    { modelsPath: "C:/home/models", from: null, force: false },
  );

  assert.deepEqual(result, {
    status: "installed",
    model: embeddingGenerator.descriptor,
    cachePath: "C:/home/models",
    bytes: 135_266_304,
    source: "download",
  });
  assert.deepEqual(modelInstaller.calls, [
    { modelsPath: "C:/home/models", from: null, force: false },
  ]);
});

void test("passes --from and --force through unchanged", async () => {
  const modelInstaller = new FakeModelInstaller({
    status: "adopted",
    source: "copy",
    bytes: 42,
  });
  const embeddingGenerator = new FakeEmbeddingGenerator();

  await installModel(
    { modelInstaller, embeddingGenerator },
    {
      modelsPath: "C:/home/models",
      from: "C:/repo/.cache/models",
      force: true,
    },
  );

  assert.deepEqual(modelInstaller.calls, [
    {
      modelsPath: "C:/home/models",
      from: "C:/repo/.cache/models",
      force: true,
    },
  ]);
});

void test("propagates a rejection from the installer without touching SQLite or a real model", async () => {
  const modelInstaller = new FakeModelInstaller(
    { status: "installed", source: "download", bytes: 0 },
    new Error("MODEL_SOURCE_INVALID"),
  );
  const embeddingGenerator = new FakeEmbeddingGenerator();

  await assert.rejects(
    installModel(
      { modelInstaller, embeddingGenerator },
      { modelsPath: "C:/home/models", from: "C:/bad-source", force: false },
    ),
    /MODEL_SOURCE_INVALID/,
  );
});
