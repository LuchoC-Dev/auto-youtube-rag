import assert from "node:assert/strict";
import { test } from "node:test";

import { classifyContextSection } from "../../../src/application/context/context-blocks.js";
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

function block(
  unitType: KnowledgeUnitType,
  origin: "candidate" | "ancestor" = "candidate",
): ContextUnitBlock {
  const unit = fakeKnowledgeUnit({ packageRef, rawId: "u" });

  return {
    unitId: fakeUnitId(packageRef, "u"),
    packageRef,
    unitType,
    headingPath: ["u"],
    title: "u",
    content: "u content",
    contentHash: unit.contentHash,
    tokenCount: 10,
    origin,
    fusedScore: 1,
    depth: 0,
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

void test("classifies analysis_document, analysis_section and analysis_topic as highest relevance", () => {
  for (const unitType of [
    "analysis_document",
    "analysis_section",
    "analysis_topic",
  ] as const) {
    assert.equal(classifyContextSection(block(unitType)), "highest_relevance");
  }
});

void test("classifies analysis_recommendation as related rules", () => {
  assert.equal(
    classifyContextSection(block("analysis_recommendation")),
    "related_rules",
  );
});

void test("sends any candidate analysis type to additional context when it is an ancestor", () => {
  assert.equal(
    classifyContextSection(block("analysis_topic", "ancestor")),
    "additional_context",
  );
  assert.equal(
    classifyContextSection(block("analysis_recommendation", "ancestor")),
    "additional_context",
  );
});
