import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { test } from "node:test";

import { E5EmbeddingGenerator } from "../../src/infrastructure/embeddings/e5-embedding-generator.js";

const projectRoot = resolve(import.meta.dirname, "../..");
const cacheDir = join(projectRoot, ".cache", "models");
const modelDir = join(cacheDir, "Xenova", "multilingual-e5-small");

function dot(left: Float32Array, right: Float32Array): number {
  assert.equal(left.length, right.length);
  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result += (left[index] ?? 0) * (right[index] ?? 0);
  }
  return result;
}

function assertNormalized(vector: Float32Array): void {
  assert.equal(vector.length, 384);
  assert.equal(vector.every(Number.isFinite), true);
  assert.ok(Math.abs(Math.hypot(...vector) - 1) < 1e-5);
}

void test(
  "smoke: embeds with the downloaded E5 Small model",
  { timeout: 120_000 },
  async () => {
    assert.ok(
      existsSync(join(modelDir, "config.json")) &&
        existsSync(join(modelDir, "tokenizer.json")) &&
        existsSync(join(modelDir, "onnx", "model_quantized.onnx")),
      "E5 Small is missing from .cache/models. Run `npm run models:download`; the smoke test never downloads files automatically.",
    );

    const generator = new E5EmbeddingGenerator({ cacheDir, batchSize: 2 });
    try {
      const documents = await generator.embedDocuments([
        "La jerarquía visual organiza títulos, subtítulos y texto mediante escala y contraste.",
        "La fotosíntesis transforma luz, agua y dióxido de carbono en energía química.",
      ]);
      const query = await generator.embedQuery(
        "cómo crear jerarquía visual en un diseño",
      );

      assert.equal(documents.length, 2);
      const related = documents[0];
      const unrelated = documents[1];
      assert.ok(related);
      assert.ok(unrelated);
      assertNormalized(related);
      assertNormalized(unrelated);
      assertNormalized(query);
      assert.ok(
        dot(query, related) > dot(query, unrelated),
        "the design query should be closer to the visual-hierarchy passage",
      );
    } finally {
      await generator.dispose();
    }
  },
);
