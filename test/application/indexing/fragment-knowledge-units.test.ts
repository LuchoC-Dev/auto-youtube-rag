import assert from "node:assert/strict";
import { test } from "node:test";

import type {
  EmbeddingGenerator,
  EmbeddingModelDescriptor,
} from "../../../src/application/ports/embedding-generator.js";
import {
  FragmentationError,
  fragmentKnowledgeUnits,
} from "../../../src/application/indexing/fragment-knowledge-units.js";
import { sha256 } from "../../../src/domain/indexing/content-identity.js";
import {
  DocumentId,
  KnowledgeUnitId,
} from "../../../src/domain/indexing/identifiers.js";
import { KnowledgeUnit } from "../../../src/domain/indexing/knowledge-unit.js";

type FragmentationModel = Pick<EmbeddingGenerator, "describe" | "countTokens">;

function createUnit(
  suffix: string,
  content: string,
  searchable = true,
): KnowledgeUnit {
  return KnowledgeUnit.create({
    id: KnowledgeUnitId.create(`unit:auto-design:video_123:context:${suffix}`),
    documentId: DocumentId.create("document:auto-design:video_123:context"),
    parentId: KnowledgeUnitId.create("unit:auto-design:video_123:context:root"),
    unitType: "context_section",
    depth: 1,
    ordinal: 0,
    title: "Jerarquía visual",
    content,
    structuredJson: null,
    headingPath: ["Fundamentos", "Jerarquía visual"],
    timestamps: [],
    visualEvidence: [],
    estimatedTokens: Math.max(1, content.length),
    contentHash: sha256(content),
    searchable,
  });
}

function createModel(
  maxInputTokens: number,
  count: (text: string) => number,
): FragmentationModel {
  const descriptor: EmbeddingModelDescriptor = {
    key: "test-model",
    version: "1",
    dimensions: 3,
    maxInputTokens,
  };

  return {
    describe() {
      return Promise.resolve(descriptor);
    },
    countTokens(texts) {
      return Promise.resolve(texts.map(count));
    },
  };
}

function countWords(text: string): number {
  return text.trim().split(/\s+/u).length;
}

void test("creates stable fragments only for searchable units", async () => {
  const root = createUnit("root-copy", "Documento completo", false);
  const section = createUnit("short", "Contraste y escala.");
  const model = createModel(64, countWords);

  const fragments = await fragmentKnowledgeUnits([root, section], model);

  assert.equal(fragments.length, 1);
  const fragment = fragments[0];
  assert.ok(fragment);
  assert.equal(fragment.id.value, `fragment:${sha256(section.id.value)}:0`);
  assert.equal(fragment.unitId.equals(section.id), true);
  assert.equal(fragment.ordinal, 0);
  assert.equal(fragment.title, section.title);
  assert.deepEqual(fragment.headingPath, section.headingPath);
  assert.equal(fragment.content, "Contraste y escala.");
  assert.equal(fragment.tokenCount, 3);
  assert.equal(fragment.contentHash, sha256(fragment.content));
  assert.equal(Object.isFrozen(fragments), true);

  const rebuilt = await fragmentKnowledgeUnits([root, section], model);
  assert.deepEqual(rebuilt, fragments);
});

void test("keeps paragraphs and list blocks intact when they fit", async () => {
  const unit = createUnit(
    "semantic-blocks",
    "Uno dos.\n\n- tres\n- cuatro\n- cinco\n\nSeis siete ocho.",
  );

  const fragments = await fragmentKnowledgeUnits(
    [unit],
    createModel(6, countWords),
  );

  assert.deepEqual(
    fragments.map((fragment) => fragment.content),
    ["Uno dos.", "- tres\n- cuatro\n- cinco", "Seis siete ocho."],
  );
  assert.deepEqual(
    fragments.map((fragment) => fragment.ordinal),
    [0, 1, 2],
  );
  assert.equal(
    fragments.every((fragment) => fragment.tokenCount <= 6),
    true,
  );
});

void test("recursively splits oversized sentences, words and code points", async () => {
  const prose = createUnit(
    "recursive-prose",
    "Uno dos tres cuatro. Cinco seis siete ocho.",
  );
  const longWord = createUnit("recursive-word", "abcdefg");

  const proseFragments = await fragmentKnowledgeUnits(
    [prose],
    createModel(3, countWords),
  );
  const wordFragments = await fragmentKnowledgeUnits(
    [longWord],
    createModel(3, (text) => Array.from(text).length),
  );

  assert.deepEqual(
    proseFragments.map((fragment) => fragment.content),
    ["Uno dos tres", "cuatro.", "Cinco seis siete", "ocho."],
  );
  assert.deepEqual(
    wordFragments.map((fragment) => fragment.content),
    ["abc", "def", "g"],
  );
  assert.equal(
    [...proseFragments, ...wordFragments].every(
      (fragment) =>
        fragment.content.trim().length > 0 && fragment.tokenCount <= 3,
    ),
    true,
  );
});

void test("rejects invalid token limits and inconsistent counters", async () => {
  const unit = createUnit("invalid-counter", "Contenido válido.");

  await assert.rejects(
    fragmentKnowledgeUnits([unit], createModel(0, countWords)),
    (error: unknown) => {
      assert.ok(error instanceof FragmentationError);
      assert.equal(error.code, "INVALID_MAX_INPUT_TOKENS");
      return true;
    },
  );

  const mismatched: FragmentationModel = {
    ...createModel(10, countWords),
    countTokens() {
      return Promise.resolve([]);
    },
  };
  await assert.rejects(
    fragmentKnowledgeUnits([unit], mismatched),
    (error: unknown) => {
      assert.ok(error instanceof FragmentationError);
      assert.equal(error.code, "TOKEN_COUNT_MISMATCH");
      return true;
    },
  );

  await assert.rejects(
    fragmentKnowledgeUnits(
      [unit],
      createModel(10, () => Number.NaN),
    ),
    (error: unknown) => {
      assert.ok(error instanceof FragmentationError);
      assert.equal(error.code, "INVALID_TOKEN_COUNT");
      return true;
    },
  );
});

void test("fails explicitly when one code point cannot fit", async () => {
  const unit = createUnit("unsplittable", "🧩");

  await assert.rejects(
    fragmentKnowledgeUnits(
      [unit],
      createModel(1, () => 2),
    ),
    (error: unknown) => {
      assert.ok(error instanceof FragmentationError);
      assert.equal(error.code, "CONTENT_UNSPLITTABLE");
      return true;
    },
  );
});
