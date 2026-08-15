import assert from "node:assert/strict";
import { test } from "node:test";

import { allocateBudget } from "../../../src/application/context/allocate-budget.js";
import { assignCitations } from "../../../src/application/context/assign-citations.js";
import type { ContextUnitBlock } from "../../../src/application/context/context-blocks.js";
import { renderContextResult } from "../../../src/application/context/render-context-result.js";
import type { RetrievalWarning } from "../../../src/application/retrieval/retrieval-results.js";
import { ContextBudget } from "../../../src/domain/context/context-budget.js";
import {
  PackageRef,
  SourceName,
  VideoId,
} from "../../../src/domain/indexing/identifiers.js";
import type { KnowledgeUnitType } from "../../../src/domain/indexing/knowledge-unit.js";
import {
  fakeKnowledgeUnit,
  fakeUnitId,
} from "../../fakes/fake-knowledge-unit.js";

const packageRef = PackageRef.create(
  SourceName.create("auto-design"),
  VideoId.create("vid_1"),
);

function block(input: {
  readonly rawId: string;
  readonly unitType?: KnowledgeUnitType;
  readonly headingPath?: readonly string[];
  readonly tokenCount?: number;
  readonly packageRef?: PackageRef;
}): ContextUnitBlock {
  const ref = input.packageRef ?? packageRef;
  const unit = fakeKnowledgeUnit({ packageRef: ref, rawId: input.rawId });

  return {
    unitId: fakeUnitId(ref, input.rawId),
    packageRef: ref,
    unitType: input.unitType ?? "context_section",
    headingPath: input.headingPath ?? [input.rawId],
    title: input.rawId,
    content: `${input.rawId} content`,
    contentHash: unit.contentHash,
    tokenCount: input.tokenCount ?? 10,
    origin: "candidate",
    fusedScore: 1,
    depth: 0,
    documentKind: "context",
    documentRelativePath: "deliverables/context.md",
    videoTitle: "Video title",
    creator: "Test channel",
    canonicalUrl: "https://example.com/watch",
    language: "es",
    timestamps: ["00:01:00"],
    visualEvidence: ["frame.jpg"],
  };
}

function render(
  blocks: readonly ContextUnitBlock[],
  overrides: {
    readonly maxTokens?: number;
    readonly sourceFilter?: readonly string[];
    readonly warnings?: readonly RetrievalWarning[];
    readonly candidatesConsidered?: number;
  } = {},
) {
  const allocation = allocateBudget(blocks, overrides.maxTokens ?? 10_000);
  const citations = assignCitations(allocation.included);

  return renderContextResult({
    query: "diseño brutalista",
    budget: ContextBudget.default(),
    sourceFilter: overrides.sourceFilter ?? [],
    candidatesConsidered: overrides.candidatesConsidered ?? blocks.length,
    allocation,
    citations,
    warnings: overrides.warnings ?? [],
    topVectorSimilarity: 0.88,
  });
}

void test("carries the schema version and request fields", () => {
  const result = render([block({ rawId: "a" })]);

  assert.equal(result.schema_version, "1.0");
  assert.equal(result.request.query, "diseño brutalista");
  assert.equal(result.request.depth, "balanced");
  assert.equal(result.request.max_tokens, 32_000);
});

void test("is ok when at least one block is included", () => {
  const result = render([block({ rawId: "a" })]);

  assert.equal(result.status, "ok");
});

void test("is no_results when the allocation includes nothing", () => {
  const result = render([]);

  assert.equal(result.status, "no_results");
  assert.deepEqual(result.units, []);
});

void test("reports metrics including candidates considered and units selected", () => {
  const result = render([block({ rawId: "a" }), block({ rawId: "b" })], {
    candidatesConsidered: 5,
  });

  assert.equal(result.metrics.candidates_considered, 5);
  assert.equal(result.metrics.units_selected, 2);
  assert.equal(result.metrics.estimated_tokens, 20);
});

void test("maps each included block to a snake_case citation-backed unit", () => {
  const result = render([
    block({ rawId: "a", headingPath: ["Método", "Brutalismo"] }),
  ]);
  const [unit] = result.units;

  assert.ok(unit);
  assert.equal(unit.citation_id, "S01");
  assert.equal(unit.source_name, "auto-design");
  assert.equal(unit.video_id, "vid_1");
  assert.deepEqual(unit.heading_path, ["Método", "Brutalismo"]);
  assert.equal(unit.section, "highest_relevance");
  assert.equal(unit.content, "a content");
  assert.equal(unit.token_count, 10);
  assert.equal(unit.timestamp, "00:01:00");
  assert.deepEqual(unit.visual_evidence, ["frame.jpg"]);
});

void test("lists each distinct source once", () => {
  const other = PackageRef.create(
    SourceName.create("auto-design"),
    VideoId.create("vid_2"),
  );

  const result = render([
    block({ rawId: "a" }),
    block({ rawId: "b", packageRef: other }),
  ]);

  assert.equal(result.sources.length, 2);
  assert.equal(result.metrics.sources_used, 2);
});

void test("counts coverage by unit type and by source", () => {
  const result = render([
    block({ rawId: "a", unitType: "rule_item" }),
    block({ rawId: "b", unitType: "rule_item" }),
    block({ rawId: "c", unitType: "context_section" }),
  ]);

  assert.equal(result.coverage.units_by_type.rule_item, 2);
  assert.equal(result.coverage.units_by_type.context_section, 1);
  assert.equal(result.coverage.units_by_source["auto-design"], 3);
});

void test("reports omitted count and budget exhaustion in coverage", () => {
  const result = render(
    [
      block({ rawId: "a", tokenCount: 60 }),
      block({ rawId: "b", tokenCount: 60 }),
    ],
    { maxTokens: 100 },
  );

  assert.equal(result.coverage.omitted_for_budget, 1);
  assert.equal(result.coverage.budget_exhausted, true);
});

void test("propagates retrieval warnings and turns budget exhaustion into a limitation", () => {
  const warning: RetrievalWarning = {
    code: "TEXT_SEARCH_UNAVAILABLE",
    path: "text",
    message: "The lexical search path failed.",
  };

  const result = render(
    [
      block({ rawId: "a", tokenCount: 60 }),
      block({ rawId: "b", tokenCount: 60 }),
    ],
    { maxTokens: 100, warnings: [warning] },
  );

  assert.deepEqual(result.warnings, [warning]);
  assert.ok(
    result.limitations.some((limitation) =>
      limitation.includes("budget was exhausted"),
    ),
  );
  assert.ok(
    result.limitations.some((limitation) =>
      limitation.includes("lexical search path failed"),
    ),
  );
});

void test("never fabricates a limitation when nothing degraded", () => {
  const result = render([block({ rawId: "a" })]);

  assert.deepEqual(result.limitations, []);
});
