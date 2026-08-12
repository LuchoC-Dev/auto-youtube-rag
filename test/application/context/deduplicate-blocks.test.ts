import assert from "node:assert/strict";
import { test } from "node:test";

import { deduplicateBlocks } from "../../../src/application/context/deduplicate-blocks.js";
import type { ContextUnitBlock } from "../../../src/application/context/context-blocks.js";
import {
  PackageRef,
  SourceName,
  VideoId,
} from "../../../src/domain/indexing/identifiers.js";
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
  readonly contentHash: string;
  readonly origin?: "candidate" | "ancestor";
}): ContextUnitBlock {
  const unit = fakeKnowledgeUnit({ packageRef, rawId: input.rawId });

  return {
    unitId: fakeUnitId(packageRef, input.rawId),
    packageRef,
    unitType: unit.unitType,
    headingPath: unit.headingPath,
    title: unit.title,
    content: unit.content,
    contentHash: input.contentHash,
    tokenCount: unit.estimatedTokens,
    origin: input.origin ?? "candidate",
    fusedScore: 1,
    depth: unit.depth,
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

void test("collapses two blocks with identical content into one", () => {
  const first = block({ rawId: "a", contentHash: "same-hash" });
  const second = block({ rawId: "b", contentHash: "same-hash" });

  const deduplicated = deduplicateBlocks([first, second]);

  assert.equal(deduplicated.length, 1);
  assert.equal(deduplicated[0], first);
});

void test("keeps the first occurrence in input order", () => {
  const preferred = block({
    rawId: "candidate-copy",
    contentHash: "duplicated",
    origin: "candidate",
  });
  const discarded = block({
    rawId: "ancestor-copy",
    contentHash: "duplicated",
    origin: "ancestor",
  });

  const deduplicated = deduplicateBlocks([preferred, discarded]);

  assert.equal(deduplicated.length, 1);
  assert.equal(deduplicated[0], preferred);
});

void test("keeps blocks with distinct content hashes", () => {
  const first = block({ rawId: "a", contentHash: "hash-a" });
  const second = block({ rawId: "b", contentHash: "hash-b" });

  const deduplicated = deduplicateBlocks([first, second]);

  assert.equal(deduplicated.length, 2);
});

void test("returns nothing for an empty input", () => {
  assert.deepEqual(deduplicateBlocks([]), []);
});
