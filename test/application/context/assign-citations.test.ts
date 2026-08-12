import assert from "node:assert/strict";
import { test } from "node:test";

import { assignCitations } from "../../../src/application/context/assign-citations.js";
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
  readonly headingPath?: readonly string[];
  readonly timestamps?: readonly string[];
  readonly visualEvidence?: readonly string[];
  readonly packageRef?: PackageRef;
}): ContextUnitBlock {
  const ref = input.packageRef ?? packageRef;
  const unit = fakeKnowledgeUnit({ packageRef: ref, rawId: input.rawId });

  return {
    unitId: fakeUnitId(ref, input.rawId),
    packageRef: ref,
    unitType: "context_section",
    headingPath: input.headingPath ?? [input.rawId],
    title: input.rawId,
    content: `${input.rawId} content`,
    contentHash: unit.contentHash,
    tokenCount: 10,
    origin: "candidate",
    fusedScore: 1,
    depth: 0,
    documentKind: "context",
    documentRelativePath: "deliverables/context.md",
    videoTitle: "Video title",
    creator: "Test channel",
    canonicalUrl: null,
    language: "es",
    timestamps: input.timestamps ?? [],
    visualEvidence: input.visualEvidence ?? [],
  };
}

void test("assigns sequential ids without gaps in the given order", () => {
  const citations = assignCitations([
    block({ rawId: "a" }),
    block({ rawId: "b" }),
    block({ rawId: "c" }),
  ]);

  assert.deepEqual(
    citations.map((citation) => citation.citationId),
    ["S01", "S02", "S03"],
  );
});

void test("pads single-digit ids to two digits", () => {
  const citations = assignCitations([block({ rawId: "only" })]);

  assert.equal(citations[0]?.citationId, "S01");
});

void test("gives two blocks of the same video distinct citations when headings differ", () => {
  const citations = assignCitations([
    block({ rawId: "a", headingPath: ["Intro"] }),
    block({ rawId: "b", headingPath: ["Method"] }),
  ]);

  assert.equal(citations.length, 2);
  assert.notEqual(citations[0]?.citationId, citations[1]?.citationId);
  assert.deepEqual(citations[0]?.headingPath, ["Intro"]);
  assert.deepEqual(citations[1]?.headingPath, ["Method"]);
});

void test("resolves the source name and video id from the package reference", () => {
  const [citation] = assignCitations([block({ rawId: "a" })]);

  assert.ok(citation);
  assert.equal(citation.sourceName, "auto-design");
  assert.equal(citation.videoId, "vid_1");
});

void test("carries the first timestamp when present, or null otherwise", () => {
  const withTimestamp = assignCitations([
    block({ rawId: "a", timestamps: ["00:01:23", "00:02:00"] }),
  ]);
  const withoutTimestamp = assignCitations([block({ rawId: "b" })]);

  assert.equal(withTimestamp[0]?.timestamp, "00:01:23");
  assert.equal(withoutTimestamp[0]?.timestamp, null);
});

void test("carries every visual evidence path of the block", () => {
  const citations = assignCitations([
    block({ rawId: "a", visualEvidence: ["frame-1.jpg", "frame-2.jpg"] }),
  ]);

  assert.deepEqual(citations[0]?.visualEvidence, [
    "frame-1.jpg",
    "frame-2.jpg",
  ]);
});

void test("returns nothing for an empty input", () => {
  assert.deepEqual(assignCitations([]), []);
});
