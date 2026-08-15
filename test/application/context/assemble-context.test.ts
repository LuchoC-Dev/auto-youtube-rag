import assert from "node:assert/strict";
import { test } from "node:test";

import { assembleContext } from "../../../src/application/context/assemble-context.js";
import type { ContextRequest } from "../../../src/application/context/context-request.js";
import type {
  RetrievalCandidate,
  RetrievalOutcome,
} from "../../../src/application/retrieval/retrieval-results.js";
import { ContextBudget } from "../../../src/domain/context/context-budget.js";
import {
  PackageRef,
  SourceName,
  VideoId,
} from "../../../src/domain/indexing/identifiers.js";
import { RetrievalFilter } from "../../../src/domain/retrieval/retrieval-filter.js";
import { RetrievalQuery } from "../../../src/domain/retrieval/retrieval-query.js";
import { FakeKnowledgeRepository } from "../../fakes/fake-knowledge-repository.js";
import { fakeKnowledgeUnit } from "../../fakes/fake-knowledge-unit.js";
import { fakeProvenance } from "../../fakes/fake-provenance.js";

const packageRef = PackageRef.create(
  SourceName.create("auto-design"),
  VideoId.create("vid_1"),
);

function emptyOutcome(): RetrievalOutcome {
  return {
    status: "no_results",
    candidates: [],
    metrics: {
      textHits: 0,
      vectorHits: 0,
      fusedHits: 0,
      returnedCandidates: 0,
      videosCovered: 0,
      sourcesCovered: 0,
      topVectorSimilarity: 0.88,
    },
    warnings: [],
  };
}

function seededScenario() {
  const knowledgeRepository = new FakeKnowledgeRepository();

  const parentUnit = fakeKnowledgeUnit({
    packageRef,
    rawId: "parent",
    depth: 0,
  });
  const childUnit = fakeKnowledgeUnit({
    packageRef,
    rawId: "child",
    parentRawId: "parent",
    depth: 1,
  });

  const provenance = fakeProvenance({
    name: "child",
    packageRef,
    unitId: "child",
  });

  knowledgeRepository.units = [childUnit];
  knowledgeRepository.ancestors = [parentUnit];

  const candidate: RetrievalCandidate = {
    fragmentId: provenance.fragmentId,
    unitId: provenance.unitId,
    packageRef,
    fusedScore: 0.9,
    textRank: 1,
    vectorRank: 1,
    provenance,
  };

  const outcome: RetrievalOutcome = {
    status: "ok",
    candidates: [candidate],
    metrics: {
      textHits: 1,
      vectorHits: 1,
      fusedHits: 1,
      returnedCandidates: 1,
      videosCovered: 1,
      sourcesCovered: 1,
      topVectorSimilarity: 0.88,
    },
    warnings: [],
  };

  return { knowledgeRepository, outcome, candidate, childUnit, parentUnit };
}

function requestFor(
  text: string,
  overrides: {
    readonly maxTokensOverride?: number;
    readonly filter?: RetrievalFilter;
  } = {},
): ContextRequest {
  return {
    query: RetrievalQuery.create({
      text,
      filter: overrides.filter,
    }),
    budget: ContextBudget.create({
      maxTokensOverride: overrides.maxTokensOverride,
    }),
  };
}

void test("assembles a bundle including the candidate and its ancestor", async () => {
  const scenario = seededScenario();

  const bundle = await assembleContext(
    {
      retrieveCandidates: () => Promise.resolve(scenario.outcome),
      knowledgeRepository: scenario.knowledgeRepository,
    },
    requestFor("brutalismo"),
  );

  assert.equal(bundle.result.status, "ok");
  assert.equal(bundle.result.units.length, 2);
  assert.match(bundle.markdown, /\[S01\]/);
});

void test("calls getUnits and getAncestors once each, not per candidate", async () => {
  const scenario = seededScenario();
  let getUnitsCalls = 0;
  let getAncestorsCalls = 0;

  const originalGetUnits = scenario.knowledgeRepository.getUnits.bind(
    scenario.knowledgeRepository,
  );
  const originalGetAncestors = scenario.knowledgeRepository.getAncestors.bind(
    scenario.knowledgeRepository,
  );
  scenario.knowledgeRepository.getUnits = (ids) => {
    getUnitsCalls += 1;
    return originalGetUnits(ids);
  };
  scenario.knowledgeRepository.getAncestors = (ids) => {
    getAncestorsCalls += 1;
    return originalGetAncestors(ids);
  };

  await assembleContext(
    {
      retrieveCandidates: () => Promise.resolve(scenario.outcome),
      knowledgeRepository: scenario.knowledgeRepository,
    },
    requestFor("brutalismo"),
  );

  assert.equal(getUnitsCalls, 1);
  assert.equal(getAncestorsCalls, 1);
});

void test("produces a valid bundle explaining the absence of evidence for no_results", async () => {
  const knowledgeRepository = new FakeKnowledgeRepository();

  const bundle = await assembleContext(
    {
      retrieveCandidates: () => Promise.resolve(emptyOutcome()),
      knowledgeRepository,
    },
    requestFor("consulta sin evidencia"),
  );

  assert.equal(bundle.result.status, "no_results");
  assert.deepEqual(bundle.result.units, []);
  assert.match(bundle.markdown, /No evidence matched this section\./);
});

void test("a small budget still includes the top block and marks the budget exhausted", async () => {
  const scenario = seededScenario();

  const bundle = await assembleContext(
    {
      retrieveCandidates: () => Promise.resolve(scenario.outcome),
      knowledgeRepository: scenario.knowledgeRepository,
    },
    requestFor("brutalismo", { maxTokensOverride: 1 }),
  );

  assert.equal(bundle.result.status, "ok");
  assert.equal(bundle.result.units.length, 1);
  assert.equal(bundle.result.coverage.budget_exhausted, true);
});

void test("propagates retrieval warnings into the bundle", async () => {
  const scenario = seededScenario();
  const outcomeWithWarning: RetrievalOutcome = {
    ...scenario.outcome,
    warnings: [
      {
        code: "TEXT_SEARCH_UNAVAILABLE",
        path: "text",
        message: "The lexical search path failed.",
      },
    ],
  };

  const bundle = await assembleContext(
    {
      retrieveCandidates: () => Promise.resolve(outcomeWithWarning),
      knowledgeRepository: scenario.knowledgeRepository,
    },
    requestFor("brutalismo"),
  );

  assert.equal(bundle.result.warnings.length, 1);
  assert.match(bundle.markdown, /The lexical search path failed\./);
});

void test("reflects an applied source filter in the rendered request", async () => {
  const scenario = seededScenario();

  const bundle = await assembleContext(
    {
      retrieveCandidates: () => Promise.resolve(scenario.outcome),
      knowledgeRepository: scenario.knowledgeRepository,
    },
    requestFor("brutalismo", {
      filter: RetrievalFilter.create({
        sources: [SourceName.create("auto-design")],
      }),
    }),
  );

  assert.deepEqual(bundle.result.request.sources, ["auto-design"]);
  assert.match(bundle.markdown, /Sources restricted to: auto-design/);
});
