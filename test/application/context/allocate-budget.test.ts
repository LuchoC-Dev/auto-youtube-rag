import assert from "node:assert/strict";
import { test } from "node:test";

import { allocateBudget } from "../../../src/application/context/allocate-budget.js";
import type { ContextUnitBlock } from "../../../src/application/context/context-blocks.js";
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
  readonly unitType: KnowledgeUnitType;
  readonly origin?: "candidate" | "ancestor";
  readonly fusedScore?: number;
  readonly tokenCount: number;
  readonly depth?: number;
}): ContextUnitBlock {
  const unit = fakeKnowledgeUnit({ packageRef, rawId: input.rawId });

  return {
    unitId: fakeUnitId(packageRef, input.rawId),
    packageRef,
    unitType: input.unitType,
    headingPath: [input.rawId],
    title: input.rawId,
    content: `${input.rawId} content`,
    contentHash: unit.contentHash,
    tokenCount: input.tokenCount,
    origin: input.origin ?? "candidate",
    fusedScore: input.fusedScore ?? 1,
    depth: input.depth ?? 0,
    documentKind: "context",
    documentRelativePath: "deliverables/context.md",
    videoTitle: null,
    creator: null,
    canonicalUrl: null,
    language: "es",
    timestamps: [],
    visualEvidence: [],
  };
}

void test("includes everything when it fits well under budget", () => {
  const blocks = [
    block({ rawId: "a", unitType: "context_section", tokenCount: 100 }),
    block({ rawId: "b", unitType: "rule_item", tokenCount: 50 }),
  ];

  const allocation = allocateBudget(blocks, 1000);

  assert.equal(allocation.included.length, 2);
  assert.equal(allocation.omittedCount, 0);
  assert.equal(allocation.estimatedTokens, 150);
  assert.equal(allocation.budgetExhausted, false);
});

void test("orders document/section candidates before rule candidates before ancestors", () => {
  const section = block({
    rawId: "section",
    unitType: "context_section",
    fusedScore: 0.1,
    tokenCount: 10,
  });
  const rule = block({
    rawId: "rule",
    unitType: "rule_item",
    fusedScore: 0.9,
    tokenCount: 10,
  });
  const ancestor = block({
    rawId: "ancestor",
    unitType: "context_document",
    origin: "ancestor",
    fusedScore: 0.99,
    tokenCount: 10,
  });

  const allocation = allocateBudget([ancestor, rule, section], 1000);

  assert.deepEqual(
    allocation.included.map((entry) => entry.headingPath[0]),
    ["section", "rule", "ancestor"],
  );
});

void test("within a bucket, sorts by descending fused score", () => {
  const low = block({
    rawId: "low",
    unitType: "context_section",
    fusedScore: 0.2,
    tokenCount: 10,
  });
  const high = block({
    rawId: "high",
    unitType: "context_section",
    fusedScore: 0.8,
    tokenCount: 10,
  });

  const allocation = allocateBudget([low, high], 1000);

  assert.deepEqual(
    allocation.included.map((entry) => entry.headingPath[0]),
    ["high", "low"],
  );
});

void test("ancestors break ties by descending depth within the same candidate score", () => {
  const grandparent = block({
    rawId: "grandparent",
    unitType: "context_document",
    origin: "ancestor",
    fusedScore: 0.5,
    depth: 0,
    tokenCount: 10,
  });
  const parent = block({
    rawId: "parent",
    unitType: "context_section",
    origin: "ancestor",
    fusedScore: 0.5,
    depth: 1,
    tokenCount: 10,
  });

  const allocation = allocateBudget([grandparent, parent], 1000);

  assert.deepEqual(
    allocation.included.map((entry) => entry.headingPath[0]),
    ["parent", "grandparent"],
  );
});

void test("omits whole blocks instead of truncating them", () => {
  const first = block({
    rawId: "first",
    unitType: "context_section",
    fusedScore: 0.9,
    tokenCount: 60,
  });
  const second = block({
    rawId: "second",
    unitType: "context_section",
    fusedScore: 0.8,
    tokenCount: 60,
  });

  const allocation = allocateBudget([first, second], 100);

  assert.equal(allocation.included.length, 1);
  assert.equal(allocation.included[0]?.headingPath[0], "first");
  assert.equal(allocation.omittedCount, 1);
  assert.equal(allocation.estimatedTokens, 60);
  assert.equal(allocation.budgetExhausted, true);
});

void test("includes the first block even when it alone exceeds the budget", () => {
  const oversized = block({
    rawId: "oversized",
    unitType: "context_section",
    tokenCount: 5_000,
  });

  const allocation = allocateBudget([oversized], 1_000);

  assert.equal(allocation.included.length, 1);
  assert.equal(allocation.included[0]?.headingPath[0], "oversized");
  assert.equal(allocation.omittedCount, 0);
  assert.equal(allocation.estimatedTokens, 5_000);
  assert.equal(allocation.budgetExhausted, true);
});

void test("omits every block after an oversized first block", () => {
  const oversized = block({
    rawId: "oversized",
    unitType: "context_section",
    fusedScore: 0.9,
    tokenCount: 5_000,
  });
  const next = block({
    rawId: "next",
    unitType: "context_section",
    fusedScore: 0.5,
    tokenCount: 1,
  });

  const allocation = allocateBudget([oversized, next], 1_000);

  assert.equal(allocation.included.length, 1);
  assert.equal(allocation.omittedCount, 1);
});

void test("is deterministic for the same input", () => {
  const blocks = [
    block({
      rawId: "a",
      unitType: "context_section",
      fusedScore: 0.5,
      tokenCount: 10,
    }),
    block({
      rawId: "b",
      unitType: "rule_item",
      fusedScore: 0.9,
      tokenCount: 10,
    }),
    block({
      rawId: "c",
      unitType: "context_document",
      origin: "ancestor",
      fusedScore: 0.3,
      tokenCount: 10,
    }),
  ];

  const first = allocateBudget(blocks, 1000);
  const second = allocateBudget(blocks, 1000);

  assert.deepEqual(
    first.included.map((entry) => entry.unitId.value),
    second.included.map((entry) => entry.unitId.value),
  );
});

void test("returns an empty allocation for no blocks", () => {
  const allocation = allocateBudget([], 1000);

  assert.equal(allocation.included.length, 0);
  assert.equal(allocation.omittedCount, 0);
  assert.equal(allocation.estimatedTokens, 0);
  assert.equal(allocation.budgetExhausted, false);
});
