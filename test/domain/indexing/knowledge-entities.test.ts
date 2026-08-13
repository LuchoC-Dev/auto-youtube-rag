import assert from "node:assert/strict";
import { test } from "node:test";

import { DomainValidationError } from "../../../src/domain/indexing/domain-error.js";
import { EmbeddingRecord } from "../../../src/domain/indexing/embedding-record.js";
import {
  DocumentId,
  KnowledgeUnitId,
  SearchFragmentId,
} from "../../../src/domain/indexing/identifiers.js";
import { KnowledgeUnit } from "../../../src/domain/indexing/knowledge-unit.js";
import { SearchFragment } from "../../../src/domain/indexing/search-fragment.js";

const documentId = DocumentId.create("document:auto-design:video123:context");
const rootUnitId = KnowledgeUnitId.create("unit:context-root:0001");
const childUnitId = KnowledgeUnitId.create("unit:context-section:0001");
const fragmentId = SearchFragmentId.create("fragment:context-section:0001");
const hash = "a".repeat(64);

function assertInvalid(createValue: () => unknown, field: string): void {
  assert.throws(createValue, (error: unknown) => {
    assert.ok(error instanceof DomainValidationError);
    assert.equal(error.field, field);
    return true;
  });
}

void test("creates root and child knowledge units with immutable evidence", () => {
  const root = KnowledgeUnit.create({
    id: rootUnitId,
    documentId,
    parentId: null,
    unitType: "context_document",
    depth: 0,
    ordinal: 0,
    title: "Context document",
    content: "Complete validated context.",
    structuredJson: null,
    headingPath: [],
    timestamps: [],
    visualEvidence: [],
    estimatedTokens: 12,
    contentHash: hash,
    searchable: false,
  });
  const headings = ["Design principles", "Hierarchy"];
  const evidence = ["visual/frames/frame-001.jpg"];
  const child = KnowledgeUnit.create({
    id: childUnitId,
    documentId,
    parentId: root.id,
    unitType: "context_section",
    depth: 1,
    ordinal: 0,
    title: "Hierarchy",
    content: "Hierarchy guides attention through contrast and scale.",
    structuredJson: JSON.stringify({ importance: "high" }),
    headingPath: headings,
    timestamps: ["00:01:12-00:01:25"],
    visualEvidence: evidence,
    estimatedTokens: 18,
    contentHash: hash,
    searchable: true,
  });

  headings.push("mutated");
  evidence.push("visual/frames/frame-999.jpg");

  assert.equal(root.parentId, null);
  assert.equal(root.searchable, false);
  assert.equal(child.parentId?.equals(root.id), true);
  assert.deepEqual(child.headingPath, ["Design principles", "Hierarchy"]);
  assert.deepEqual(child.visualEvidence, ["visual/frames/frame-001.jpg"]);
});

void test("rejects invalid knowledge hierarchy and numeric invariants", () => {
  const valid = {
    id: childUnitId,
    documentId,
    parentId: rootUnitId,
    unitType: "context_section",
    depth: 1,
    ordinal: 0,
    title: "Hierarchy",
    content: "Hierarchy content.",
    structuredJson: null,
    headingPath: ["Hierarchy"],
    timestamps: [],
    visualEvidence: [],
    estimatedTokens: 5,
    contentHash: hash,
    searchable: true,
  } as const;

  assertInvalid(
    () => KnowledgeUnit.create({ ...valid, parentId: null }),
    "parentId",
  );
  assertInvalid(
    () => KnowledgeUnit.create({ ...valid, parentId: childUnitId }),
    "parentId",
  );
  assertInvalid(() => KnowledgeUnit.create({ ...valid, depth: -1 }), "depth");
  assertInvalid(
    () => KnowledgeUnit.create({ ...valid, ordinal: 1.5 }),
    "ordinal",
  );
  assertInvalid(
    () => KnowledgeUnit.create({ ...valid, estimatedTokens: -1 }),
    "estimatedTokens",
  );
  assertInvalid(
    () => KnowledgeUnit.create({ ...valid, unitType: "unknown" }),
    "unitType",
  );
  assertInvalid(
    () => KnowledgeUnit.create({ ...valid, structuredJson: "{" }),
    "structuredJson",
  );
});

void test("requires document roots to be depth zero without a parent", () => {
  const validRoot = {
    id: rootUnitId,
    documentId,
    parentId: null,
    unitType: "rules_document",
    depth: 0,
    ordinal: 0,
    title: "Rules",
    content: "Complete rules document.",
    structuredJson: null,
    headingPath: [],
    timestamps: [],
    visualEvidence: [],
    estimatedTokens: 8,
    contentHash: hash,
    searchable: false,
  } as const;

  assert.doesNotThrow(() => KnowledgeUnit.create(validRoot));
  assertInvalid(
    () => KnowledgeUnit.create({ ...validRoot, depth: 1 }),
    "depth",
  );
  assertInvalid(
    () => KnowledgeUnit.create({ ...validRoot, parentId: childUnitId }),
    "parentId",
  );
});

void test("accepts the four analysis unit types under the same document/child rules", () => {
  const analysisRoot = KnowledgeUnit.create({
    id: rootUnitId,
    documentId,
    parentId: null,
    unitType: "analysis_document",
    depth: 0,
    ordinal: 0,
    title: "Analysis",
    content: "Complete analysis document.",
    structuredJson: null,
    headingPath: [],
    timestamps: [],
    visualEvidence: [],
    estimatedTokens: 8,
    contentHash: hash,
    searchable: false,
  });

  assert.equal(analysisRoot.unitType, "analysis_document");
  assert.equal(analysisRoot.parentId, null);
  assertInvalid(
    () =>
      KnowledgeUnit.create({
        id: rootUnitId,
        documentId,
        parentId: null,
        unitType: "analysis_document",
        depth: 1,
        ordinal: 0,
        title: "Analysis",
        content: "Complete analysis document.",
        structuredJson: null,
        headingPath: [],
        timestamps: [],
        visualEvidence: [],
        estimatedTokens: 8,
        contentHash: hash,
        searchable: false,
      }),
    "depth",
  );

  for (const unitType of [
    "analysis_section",
    "analysis_topic",
    "analysis_recommendation",
  ] as const) {
    const child = KnowledgeUnit.create({
      id: childUnitId,
      documentId,
      parentId: analysisRoot.id,
      unitType,
      depth: 1,
      ordinal: 0,
      title: "Topics",
      content: "Analysis child content.",
      structuredJson: null,
      headingPath: ["Topics"],
      timestamps: [],
      visualEvidence: [],
      estimatedTokens: 6,
      contentHash: hash,
      searchable: true,
    });

    assert.equal(child.unitType, unitType);
    assert.equal(child.parentId?.equals(analysisRoot.id), true);
  }
});

void test("creates search fragments with copied heading paths", () => {
  const headingPath = ["Design principles", "Hierarchy"];
  const fragment = SearchFragment.create({
    id: fragmentId,
    unitId: childUnitId,
    ordinal: 0,
    title: "Hierarchy",
    headingPath,
    content: "Hierarchy guides attention.",
    tokenCount: 7,
    contentHash: hash,
  });

  headingPath.push("mutated");

  assert.deepEqual(fragment.headingPath, ["Design principles", "Hierarchy"]);
  assert.equal(fragment.tokenCount, 7);
});

void test("rejects empty fragments, invalid ordinals, tokens and hashes", () => {
  const valid = {
    id: fragmentId,
    unitId: childUnitId,
    ordinal: 0,
    title: null,
    headingPath: ["Hierarchy"],
    content: "Hierarchy guides attention.",
    tokenCount: 7,
    contentHash: hash,
  } as const;

  assertInvalid(
    () => SearchFragment.create({ ...valid, content: "" }),
    "content",
  );
  assertInvalid(
    () => SearchFragment.create({ ...valid, ordinal: -1 }),
    "ordinal",
  );
  assertInvalid(
    () => SearchFragment.create({ ...valid, tokenCount: 0 }),
    "tokenCount",
  );
  assertInvalid(
    () => SearchFragment.create({ ...valid, contentHash: "invalid" }),
    "contentHash",
  );
});

void test("copies finite embedding vectors and preserves model identity", () => {
  const inputVector = new Float32Array([0.25, -0.5, 0.75]);
  const embedding = EmbeddingRecord.create({
    fragmentId,
    modelKey: "intfloat/multilingual-e5-small:q8",
    modelVersion: "4.2.0",
    dimensions: 3,
    contentHash: hash,
    vector: inputVector,
    createdAt: "2026-08-11T12:00:00.000Z",
  });

  inputVector[0] = 99;
  const exposedVector = embedding.vector;
  exposedVector[1] = 99;

  assert.deepEqual([...embedding.vector], [0.25, -0.5, 0.75]);
  assert.equal(embedding.dimensions, 3);
  assert.equal(embedding.modelKey, "intfloat/multilingual-e5-small:q8");
});

void test("rejects mismatched, non-finite and invalid embedding data", () => {
  const valid = {
    fragmentId,
    modelKey: "intfloat/multilingual-e5-small:q8",
    modelVersion: "4.2.0",
    dimensions: 3,
    contentHash: hash,
    vector: new Float32Array([0.25, -0.5, 0.75]),
    createdAt: "2026-08-11T12:00:00.000Z",
  } as const;

  assertInvalid(
    () => EmbeddingRecord.create({ ...valid, dimensions: 2 }),
    "dimensions",
  );
  assertInvalid(
    () =>
      EmbeddingRecord.create({
        ...valid,
        vector: new Float32Array([0.25, Number.NaN, 0.75]),
      }),
    "vector",
  );
  assertInvalid(
    () => EmbeddingRecord.create({ ...valid, dimensions: 0 }),
    "dimensions",
  );
  assertInvalid(
    () => EmbeddingRecord.create({ ...valid, createdAt: "not-a-date" }),
    "createdAt",
  );
});
