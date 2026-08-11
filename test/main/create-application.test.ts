import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import type {
  VectorIndexChange,
  VectorIndexSink,
} from "../../src/application/ports/vector-index-sink.js";
import { createApplication } from "../../src/main/create-application.js";
import { FakeEmbeddingGenerator } from "../fakes/fake-embedding-generator.js";
import { InMemoryIndexStore } from "../fakes/in-memory-index-store.js";

class RecordingVectorIndex implements VectorIndexSink {
  public readonly changes: VectorIndexChange[] = [];
  public apply(change: VectorIndexChange): Promise<void> {
    this.changes.push(change);
    return Promise.resolve();
  }
}

void test("wires replaceable adapters without downloading or synchronizing", async () => {
  const directory = await mkdtemp(join(tmpdir(), "auto-youtube-rag-app-"));
  const embeddings = new FakeEmbeddingGenerator();
  const store = new InMemoryIndexStore();
  const vectors = new RecordingVectorIndex();
  const application = createApplication(
    {
      databasePath: join(directory, "index.sqlite"),
      modelCachePath: join(directory, "models"),
    },
    { embeddingGenerator: embeddings, indexStore: store, vectorIndex: vectors },
  );

  try {
    assert.equal(application.embeddingGenerator, embeddings);
    assert.equal(application.indexStore, store);
    assert.equal(application.vectorIndex, vectors);
    assert.deepEqual(await application.listSources(), []);
    assert.equal(embeddings.embedCalls, 0);
    assert.deepEqual(store.runs.size, 0);
    assert.deepEqual(vectors.changes, []);
  } finally {
    await application.close();
    await rm(directory, { recursive: true, force: true });
  }
});

void test("creates the default adapters lazily from path values", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "auto-youtube-rag-default-app-"),
  );
  const application = createApplication({
    databasePath: join(directory, "index.sqlite"),
    modelCachePath: join(directory, "models"),
  });
  try {
    assert.deepEqual(await application.listSources(), []);
    assert.equal(
      (await application.embeddingGenerator.describe()).dimensions,
      384,
    );
    assert.equal(
      application.database.prepare("PRAGMA integrity_check").get()
        ?.integrity_check,
      "ok",
    );
  } finally {
    await application.close();
    await rm(directory, { recursive: true, force: true });
  }
});
