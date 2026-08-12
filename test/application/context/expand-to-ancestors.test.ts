import assert from "node:assert/strict";
import { test } from "node:test";

import { expandToAncestors } from "../../../src/application/context/expand-to-ancestors.js";
import type { RetrievalCandidate } from "../../../src/application/retrieval/retrieval-results.js";
import {
  PackageRef,
  SourceName,
  VideoId,
} from "../../../src/domain/indexing/identifiers.js";
import type { KnowledgeUnit } from "../../../src/domain/indexing/knowledge-unit.js";
import { fakeKnowledgeUnit } from "../../fakes/fake-knowledge-unit.js";
import { fakeProvenance } from "../../fakes/fake-provenance.js";

const packageRef = PackageRef.create(
  SourceName.create("auto-design"),
  VideoId.create("vid_1"),
);

function candidate(rawId: string, score: number): RetrievalCandidate {
  const provenance = fakeProvenance({
    name: rawId,
    packageRef,
    unitId: rawId,
  });

  return {
    fragmentId: provenance.fragmentId,
    unitId: provenance.unitId,
    packageRef,
    fusedScore: score,
    textRank: 1,
    vectorRank: 1,
    provenance,
  };
}

function unit(
  rawId: string,
  parentRawId: string | null,
  depth: number,
): KnowledgeUnit {
  return fakeKnowledgeUnit({ packageRef, rawId, parentRawId, depth });
}

void test("adds a block for the candidate itself", () => {
  const leaf = candidate("leaf", 0.9);
  const leafUnit = unit("leaf", null, 0);

  const blocks = expandToAncestors({
    candidates: [leaf],
    candidateUnits: new Map([[leafUnit.id.value, leafUnit]]),
    ancestorUnits: [],
  });

  assert.equal(blocks.length, 1);
  const [block] = blocks;
  assert.ok(block);
  assert.equal(block.origin, "candidate");
  assert.equal(block.fusedScore, 0.9);
});

void test("walks the parent chain up to the document root", () => {
  const child = candidate("child", 0.8);
  const childUnit = unit("child", "parent", 2);
  const parentUnit = unit("parent", "root", 1);
  const rootUnit = unit("root", null, 0);

  const blocks = expandToAncestors({
    candidates: [child],
    candidateUnits: new Map([[childUnit.id.value, childUnit]]),
    ancestorUnits: [parentUnit, rootUnit],
  });

  assert.equal(blocks.length, 3);
  const origins = new Map(
    blocks.map((block) => [block.unitId.value, block.origin]),
  );
  assert.equal(origins.get(childUnit.id.value), "candidate");
  assert.equal(origins.get(parentUnit.id.value), "ancestor");
  assert.equal(origins.get(rootUnit.id.value), "ancestor");
});

void test("two siblings sharing a parent produce one shared ancestor block", () => {
  const first = candidate("first", 0.9);
  const second = candidate("second", 0.5);
  const firstUnit = unit("first", "shared-parent", 1);
  const secondUnit = unit("second", "shared-parent", 1);
  const parentUnit = unit("shared-parent", null, 0);

  const blocks = expandToAncestors({
    candidates: [first, second],
    candidateUnits: new Map([
      [firstUnit.id.value, firstUnit],
      [secondUnit.id.value, secondUnit],
    ]),
    ancestorUnits: [parentUnit],
  });

  assert.equal(blocks.length, 3);
  const parentBlock = blocks.find(
    (block) => block.unitId.value === parentUnit.id.value,
  );
  assert.ok(parentBlock);
  // The parent is attributed to whichever candidate reached it first, i.e.
  // the higher-scoring one given candidates are processed in input order.
  assert.equal(parentBlock.fusedScore, 0.9);
});

void test("never rebuilds a unit that already surfaced as a candidate", () => {
  const parentAsLeaf = candidate("parent", 0.95);
  const child = candidate("child", 0.4);
  const parentUnit = unit("parent", null, 0);
  const childUnit = unit("child", "parent", 1);

  const blocks = expandToAncestors({
    candidates: [parentAsLeaf, child],
    candidateUnits: new Map([
      [parentUnit.id.value, parentUnit],
      [childUnit.id.value, childUnit],
    ]),
    ancestorUnits: [parentUnit],
  });

  assert.equal(blocks.length, 2);
  const parentBlock = blocks.find(
    (block) => block.unitId.value === parentUnit.id.value,
  );
  assert.ok(parentBlock);
  assert.equal(parentBlock.origin, "candidate");
  assert.equal(parentBlock.fusedScore, 0.95);
});

void test("ancestor blocks inherit package and document metadata from the originating candidate", () => {
  const child = candidate("child", 0.7);
  const childUnit = unit("child", "parent", 1);
  const parentUnit = unit("parent", null, 0);

  const blocks = expandToAncestors({
    candidates: [child],
    candidateUnits: new Map([[childUnit.id.value, childUnit]]),
    ancestorUnits: [parentUnit],
  });

  const parentBlock = blocks.find(
    (block) => block.unitId.value === parentUnit.id.value,
  );

  assert.ok(parentBlock);
  assert.equal(parentBlock.packageRef.videoId.value, "vid_1");
  assert.equal(parentBlock.documentRelativePath, "deliverables/context.md");
  assert.equal(parentBlock.creator, "Test channel");
});

void test("skips a candidate whose own unit was not resolved", () => {
  const orphan = candidate("orphan", 0.6);

  const blocks = expandToAncestors({
    candidates: [orphan],
    candidateUnits: new Map(),
    ancestorUnits: [],
  });

  assert.equal(blocks.length, 0);
});

void test("returns nothing for an empty input", () => {
  assert.deepEqual(
    expandToAncestors({
      candidates: [],
      candidateUnits: new Map(),
      ancestorUnits: [],
    }),
    [],
  );
});
