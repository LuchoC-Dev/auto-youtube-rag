import assert from "node:assert/strict";
import { test } from "node:test";

import { retrieveCandidates } from "../../../src/application/retrieval/retrieve-candidates.js";
import { createRrfFusion } from "../../../src/application/retrieval/rrf-fusion.js";
import type { CandidateProvenance } from "../../../src/application/retrieval/retrieval-results.js";
import {
  PackageRef,
  SearchFragmentId,
  SourceName,
  VideoId,
} from "../../../src/domain/indexing/identifiers.js";
import { RetrievalQuery } from "../../../src/domain/retrieval/retrieval-query.js";
import { FakeEmbeddingGenerator } from "../../fakes/fake-embedding-generator.js";
import { fakeProvenance } from "../../fakes/fake-provenance.js";
import { FakeKnowledgeRepository } from "../../fakes/fake-knowledge-repository.js";
import { FakeTextSearchIndex } from "../../fakes/fake-text-search-index.js";
import { FakeVectorSearchIndex } from "../../fakes/fake-vector-search-index.js";

function setup() {
  const textIndex = new FakeTextSearchIndex();
  const vectorIndex = new FakeVectorSearchIndex();
  const knowledgeRepository = new FakeKnowledgeRepository();
  const embeddingGenerator = new FakeEmbeddingGenerator();

  return {
    textIndex,
    vectorIndex,
    knowledgeRepository,
    embeddingGenerator,
    dependencies: {
      textIndex,
      vectorIndex,
      knowledgeRepository,
      embeddingGenerator,
      fusionStrategy: createRrfFusion(),
    },
  };
}

/**
 * Seeds a discoverable fragment: registers its provenance in the fake
 * repository and returns the exact identifier a search hit must carry to
 * resolve to it, mirroring how a real fragment id ties both together.
 */
function seedFragment(
  repository: FakeKnowledgeRepository,
  name: string,
  videoId = "vid_1",
): CandidateProvenance {
  const packageRef = PackageRef.create(
    SourceName.create("auto-design"),
    VideoId.create(videoId),
  );
  const provenance = fakeProvenance({ name, packageRef, unitId: name });

  repository.provenanceByFragment.set(provenance.fragmentId.value, provenance);

  return provenance;
}

const unknownFragmentId = SearchFragmentId.create(
  "fragment:0000000000000000000000000000000000000000000000000000000000000000:0",
);

void test("fuses both paths and hydrates provenance for the result", async () => {
  const scenario = setup();
  const seeded = seedFragment(scenario.knowledgeRepository, "a");

  scenario.textIndex.hits = [
    { fragmentId: seeded.fragmentId, rank: 1, rawScore: -5 },
  ];
  scenario.vectorIndex.hits = [
    { fragmentId: seeded.fragmentId, rank: 1, rawScore: 0.9 },
  ];

  const outcome = await retrieveCandidates(
    scenario.dependencies,
    RetrievalQuery.create({ text: "brutalismo" }),
  );

  const [best] = outcome.candidates;

  assert.equal(outcome.status, "ok");
  assert.equal(outcome.candidates.length, 1);
  assert.ok(best);
  assert.equal(best.provenance.title, "a");
  assert.equal(best.textRank, 1);
  assert.equal(best.vectorRank, 1);
  assert.equal(outcome.metrics.textHits, 1);
  assert.equal(outcome.metrics.vectorHits, 1);
});

void test("embeds the query and loads the active model before searching", async () => {
  const scenario = setup();

  await retrieveCandidates(
    scenario.dependencies,
    RetrievalQuery.create({ text: "brutalismo" }),
  );

  assert.equal(scenario.vectorIndex.loads.length, 1);
  assert.equal(scenario.vectorIndex.loads[0]?.key, "fake-e5");
  assert.equal(scenario.vectorIndex.searchCalls.length, 1);
  // FakeEmbeddingGenerator.embedQuery encodes the query length (10 for
  // "brutalismo"), which also proves the raw query text reaches the model
  // unprefixed by the use case itself — the adapter owns the "query:" prefix.
  assert.deepEqual(
    [...(scenario.vectorIndex.searchCalls[0]?.vector ?? [])],
    [10, 1, -1],
  );
});

void test("degrades to the surviving path when one path fails", async () => {
  const scenario = setup();
  const seeded = seedFragment(scenario.knowledgeRepository, "only-vector");

  scenario.textIndex.failure = new Error("FTS5 unavailable");
  // Above the LOW_RELEVANCE floor on purpose: this test is about surviving a
  // failed path, and a cosine under the floor would add a second, unrelated
  // warning and obscure what it checks.
  scenario.vectorIndex.hits = [
    { fragmentId: seeded.fragmentId, rank: 1, rawScore: 0.9 },
  ];

  const outcome = await retrieveCandidates(
    scenario.dependencies,
    RetrievalQuery.create({ text: "brutalismo" }),
  );

  const [warning] = outcome.warnings;

  assert.equal(outcome.status, "ok");
  assert.equal(outcome.candidates.length, 1);
  assert.equal(outcome.warnings.length, 1);
  assert.ok(warning);
  assert.equal(warning.code, "TEXT_SEARCH_UNAVAILABLE");
  assert.equal(warning.path, "text");
});

void test("degrades when the vector path fails", async () => {
  const scenario = setup();
  const seeded = seedFragment(scenario.knowledgeRepository, "only-text");

  scenario.vectorIndex.failure = new Error("model missing");
  scenario.textIndex.hits = [
    { fragmentId: seeded.fragmentId, rank: 1, rawScore: -1 },
  ];

  const outcome = await retrieveCandidates(
    scenario.dependencies,
    RetrievalQuery.create({ text: "brutalismo" }),
  );

  const [warning] = outcome.warnings;

  assert.equal(outcome.status, "ok");
  assert.equal(outcome.candidates.length, 1);
  assert.ok(warning);
  assert.equal(warning.code, "VECTOR_SEARCH_UNAVAILABLE");
  assert.equal(warning.path, "vector");
});

void test("warns VECTORS_STALE when the vector index has no vectors but text found hits", async () => {
  const scenario = setup();
  const seeded = seedFragment(scenario.knowledgeRepository, "text-only");

  scenario.textIndex.hits = [
    { fragmentId: seeded.fragmentId, rank: 1, rawScore: -1 },
  ];
  scenario.vectorIndex.vectorCount = 0;
  scenario.vectorIndex.hits = [];

  const outcome = await retrieveCandidates(
    scenario.dependencies,
    RetrievalQuery.create({ text: "brutalismo" }),
  );

  const staleWarning = outcome.warnings.find(
    (warning) => warning.code === "VECTORS_STALE",
  );

  assert.equal(outcome.status, "ok");
  assert.ok(staleWarning);
  assert.equal(staleWarning.path, "vector");
});

void test("does not warn VECTORS_STALE when the vector index is empty and text found nothing either", async () => {
  const scenario = setup();

  scenario.vectorIndex.vectorCount = 0;
  scenario.vectorIndex.hits = [];

  const outcome = await retrieveCandidates(
    scenario.dependencies,
    RetrievalQuery.create({ text: "brutalismo" }),
  );

  assert.equal(outcome.status, "no_results");
  assert.deepEqual(outcome.warnings, []);
});

void test("does not warn VECTORS_STALE when the vector index holds vectors", async () => {
  const scenario = setup();
  const seeded = seedFragment(scenario.knowledgeRepository, "both-paths");

  scenario.textIndex.hits = [
    { fragmentId: seeded.fragmentId, rank: 1, rawScore: -1 },
  ];
  scenario.vectorIndex.vectorCount = 5;
  scenario.vectorIndex.hits = [];

  const outcome = await retrieveCandidates(
    scenario.dependencies,
    RetrievalQuery.create({ text: "brutalismo" }),
  );

  assert.deepEqual(outcome.warnings, []);
});

void test("returns no_results with empty candidates and no fabricated content", async () => {
  const scenario = setup();

  const outcome = await retrieveCandidates(
    scenario.dependencies,
    RetrievalQuery.create({ text: "consulta sin evidencia" }),
  );

  assert.equal(outcome.status, "no_results");
  assert.deepEqual(outcome.candidates, []);
  assert.deepEqual(outcome.warnings, []);
});

void test("drops a fused hit whose fragment no longer exists in SQLite", async () => {
  const scenario = setup();

  scenario.textIndex.hits = [
    { fragmentId: unknownFragmentId, rank: 1, rawScore: -1 },
  ];
  // No provenance seeded: simulates a deletion racing this query.

  const outcome = await retrieveCandidates(
    scenario.dependencies,
    RetrievalQuery.create({ text: "brutalismo" }),
  );

  assert.equal(outcome.status, "no_results");
  assert.equal(outcome.metrics.fusedHits, 1);
  assert.equal(outcome.metrics.returnedCandidates, 0);
});

void test("reports coverage across distinct videos and sources", async () => {
  const scenario = setup();
  const first = seedFragment(scenario.knowledgeRepository, "a", "vid_1");
  const second = seedFragment(scenario.knowledgeRepository, "b", "vid_2");

  scenario.textIndex.hits = [
    { fragmentId: first.fragmentId, rank: 1, rawScore: -1 },
    { fragmentId: second.fragmentId, rank: 2, rawScore: -2 },
  ];

  const outcome = await retrieveCandidates(
    scenario.dependencies,
    RetrievalQuery.create({ text: "brutalismo" }),
  );

  assert.equal(outcome.metrics.videosCovered, 2);
  assert.equal(outcome.metrics.sourcesCovered, 1);
});

void test("passes the filter and configured limits to both paths", async () => {
  const scenario = setup();
  const query = RetrievalQuery.create({ text: "brutalismo" });

  await retrieveCandidates(scenario.dependencies, query);

  const [textCall] = scenario.textIndex.calls;
  const [vectorCall] = scenario.vectorIndex.searchCalls;

  assert.ok(textCall);
  assert.ok(vectorCall);
  assert.equal(textCall.limit, query.limits.textCandidates);
  assert.equal(vectorCall.request.limit, query.limits.vectorCandidates);
  assert.equal(textCall.filter, query.filter);
});

void test("warns LOW_RELEVANCE when the closest vector hit falls under the floor", async () => {
  const scenario = setup();
  const seeded = seedFragment(scenario.knowledgeRepository, "unrelated");

  // 0.8206 is the real cosine measured for "síntomas de la diabetes tipo 2"
  // against the design library: high in absolute terms, which is exactly why
  // a raw cosine cannot be read as relevance without a calibrated floor.
  scenario.vectorIndex.hits = [
    { fragmentId: seeded.fragmentId, rank: 1, rawScore: 0.8206 },
  ];

  const outcome = await retrieveCandidates(
    scenario.dependencies,
    RetrievalQuery.create({ text: "diabetes tipo 2" }),
  );

  const warning = outcome.warnings.find(
    (candidate) => candidate.code === "LOW_RELEVANCE",
  );

  // The bundle is still produced with every candidate: the warning informs,
  // it never filters.
  assert.equal(outcome.status, "ok");
  assert.equal(outcome.candidates.length, 1);
  assert.ok(warning);
  assert.equal(warning.path, "vector");
  assert.match(warning.message, /0\.8206/u);
  assert.match(warning.message, /0\.84/u);
});

void test("does not warn LOW_RELEVANCE when the closest hit clears the floor", async () => {
  const scenario = setup();
  const seeded = seedFragment(scenario.knowledgeRepository, "on-topic");

  // 0.8428 is the measured cosine of an adjacent-but-uncovered query, the
  // closest case above the floor: the warning must stay silent there.
  scenario.vectorIndex.hits = [
    { fragmentId: seeded.fragmentId, rank: 1, rawScore: 0.8428 },
  ];

  const outcome = await retrieveCandidates(
    scenario.dependencies,
    RetrievalQuery.create({ text: "pipeline de CI" }),
  );

  assert.deepEqual(
    outcome.warnings.filter((entry) => entry.code === "LOW_RELEVANCE"),
    [],
  );
});

void test("judges LOW_RELEVANCE by the best hit, not the worst", async () => {
  const scenario = setup();
  const strong = seedFragment(scenario.knowledgeRepository, "strong");
  const weak = seedFragment(scenario.knowledgeRepository, "weak", "vid_2");

  scenario.vectorIndex.hits = [
    { fragmentId: strong.fragmentId, rank: 1, rawScore: 0.8914 },
    { fragmentId: weak.fragmentId, rank: 2, rawScore: 0.6 },
  ];

  const outcome = await retrieveCandidates(
    scenario.dependencies,
    RetrievalQuery.create({ text: "jerarquía tipográfica" }),
  );

  // A long tail of weak matches is normal in an exhaustive ranking; what
  // decides relevance is whether anything matched well at all.
  assert.deepEqual(
    outcome.warnings.filter((entry) => entry.code === "LOW_RELEVANCE"),
    [],
  );
});

void test("does not warn LOW_RELEVANCE when the vector path never ran", async () => {
  const scenario = setup();
  const seeded = seedFragment(scenario.knowledgeRepository, "only-text");

  scenario.vectorIndex.failure = new Error("model missing");
  scenario.textIndex.hits = [
    { fragmentId: seeded.fragmentId, rank: 1, rawScore: -1 },
  ];

  const outcome = await retrieveCandidates(
    scenario.dependencies,
    RetrievalQuery.create({ text: "brutalismo" }),
  );

  // The failure already has its own warning; there is no cosine to judge, and
  // a second warning would only add noise.
  assert.deepEqual(
    outcome.warnings.map((entry) => entry.code),
    ["VECTOR_SEARCH_UNAVAILABLE"],
  );
});

void test("does not warn LOW_RELEVANCE when the vector path returned nothing", async () => {
  const scenario = setup();
  const seeded = seedFragment(scenario.knowledgeRepository, "only-text");

  scenario.textIndex.hits = [
    { fragmentId: seeded.fragmentId, rank: 1, rawScore: -1 },
  ];
  scenario.vectorIndex.hits = [];

  const outcome = await retrieveCandidates(
    scenario.dependencies,
    RetrievalQuery.create({ text: "brutalismo" }),
  );

  assert.deepEqual(
    outcome.warnings.filter((entry) => entry.code === "LOW_RELEVANCE"),
    [],
  );
});

void test("honours an injected relevance floor over the calibrated default", async () => {
  const scenario = setup();
  const seeded = seedFragment(scenario.knowledgeRepository, "on-topic");

  scenario.vectorIndex.hits = [
    { fragmentId: seeded.fragmentId, rank: 1, rawScore: 0.8914 },
  ];

  const outcome = await retrieveCandidates(
    { ...scenario.dependencies, lowRelevanceCosine: 0.95 },
    RetrievalQuery.create({ text: "jerarquía tipográfica" }),
  );

  // The default is calibrated against one corpus; another library can raise
  // or lower the floor without the use case changing.
  const warning = outcome.warnings.find(
    (entry) => entry.code === "LOW_RELEVANCE",
  );
  assert.ok(warning);
  assert.match(warning.message, /0\.95/u);
});
