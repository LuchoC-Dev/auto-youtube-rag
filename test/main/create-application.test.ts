import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { ContextBudget } from "../../src/domain/context/context-budget.js";
import { RetrievalQuery } from "../../src/domain/retrieval/retrieval-query.js";
import { createApplication } from "../../src/main/create-application.js";
import { FakeEmbeddingGenerator } from "../fakes/fake-embedding-generator.js";
import { FakeVectorSearchIndex } from "../fakes/fake-vector-search-index.js";
import { InMemoryIndexStore } from "../fakes/in-memory-index-store.js";

void test("wires replaceable adapters without downloading or synchronizing", async () => {
  const directory = await mkdtemp(join(tmpdir(), "auto-youtube-rag-app-"));
  const embeddings = new FakeEmbeddingGenerator();
  const store = new InMemoryIndexStore();
  const vectors = new FakeVectorSearchIndex();
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
    assert.deepEqual(vectors.applied, []);
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

void test("shares one vector index between sync and retrieval", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "auto-youtube-rag-shared-vectors-"),
  );
  const embeddings = new FakeEmbeddingGenerator();
  const store = new InMemoryIndexStore();
  const vectors = new FakeVectorSearchIndex();
  const application = createApplication(
    {
      databasePath: join(directory, "index.sqlite"),
      modelCachePath: join(directory, "models"),
    },
    { embeddingGenerator: embeddings, indexStore: store, vectorIndex: vectors },
  );

  try {
    // Construction must not read vectors: opening the CLI for source list
    // should not pay for a query the command never makes.
    assert.equal(vectors.loads.length, 0);
    assert.equal(vectors.searchCalls.length, 0);

    const outcome = await application.retrieveCandidates(
      RetrievalQuery.create({ text: "brutalismo" }),
    );

    assert.equal(outcome.status, "no_results");
    // The same instance that would receive sync's published changes also
    // served this query, so a committed change and a query can never see
    // different vectors.
    assert.equal(vectors.searchCalls.length, 1);
  } finally {
    await application.close();
    await rm(directory, { recursive: true, force: true });
  }
});

void test("exposes assembleContext, reusing the same retrieval wiring", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "auto-youtube-rag-assemble-context-"),
  );
  const application = createApplication(
    {
      databasePath: join(directory, "index.sqlite"),
      modelCachePath: join(directory, "models"),
    },
    {
      embeddingGenerator: new FakeEmbeddingGenerator(),
      vectorIndex: new FakeVectorSearchIndex(),
    },
  );

  try {
    const bundle = await application.assembleContext({
      query: RetrievalQuery.create({ text: "brutalismo" }),
      budget: ContextBudget.default(),
    });

    // An empty library has no candidates, so a valid bundle explaining the
    // absence of evidence is the expected outcome, not an error.
    assert.equal(bundle.result.status, "no_results");
    assert.deepEqual(bundle.result.units, []);
  } finally {
    await application.close();
    await rm(directory, { recursive: true, force: true });
  }
});
