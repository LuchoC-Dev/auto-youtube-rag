import assert from "node:assert/strict";

import type { EmbeddingModelDescriptor } from "../../src/application/ports/embedding-generator.js";
import type { VectorSearchIndex } from "../../src/application/ports/vector-search-index.js";
import { RetrievalFilter } from "../../src/domain/retrieval/retrieval-filter.js";

export interface VectorSearchIndexContractInput {
  readonly index: VectorSearchIndex;
  readonly model: EmbeddingModelDescriptor;
  /** A normalised query vector expected to match the seeded library. */
  readonly query: Float32Array;
}

/**
 * Invariants every VectorSearchIndex must satisfy, exact or approximate.
 */
export async function verifyVectorSearchIndexContract(
  input: VectorSearchIndexContractInput,
): Promise<void> {
  const search = (limit: number) =>
    input.index.search(input.query, {
      filter: RetrievalFilter.empty(),
      limit,
    });

  await input.index.load(input.model);

  const hits = await search(50);

  assert.ok(hits.length > 0, "expected the query to match seeded vectors");

  assert.deepEqual(
    hits.map((hit) => hit.rank),
    hits.map((_hit, index) => index + 1),
    "ranks must be dense and 1-based",
  );

  const scores = hits.map((hit) => hit.rawScore);

  assert.deepEqual(
    scores,
    [...scores].sort((left, right) => right - left),
    "hits must be ordered by descending similarity",
  );

  assert.equal(
    new Set(hits.map((hit) => hit.fragmentId.value)).size,
    hits.length,
    "hits must be unique",
  );

  const limited = await search(1);

  assert.equal(limited.length, 1, "the limit must be honoured");
  assert.equal(
    limited[0]?.fragmentId.value,
    hits[0]?.fragmentId.value,
    "limiting must keep the best hit",
  );

  assert.deepEqual(
    (await search(50)).map((hit) => hit.fragmentId.value),
    hits.map((hit) => hit.fragmentId.value),
    "the same query must return the same order",
  );

  await assert.rejects(
    () => search(0),
    "a non-positive limit must be rejected",
  );

  await assert.rejects(
    () =>
      input.index.search(new Float32Array(input.model.dimensions + 1), {
        filter: RetrievalFilter.empty(),
        limit: 10,
      }),
    "a query of the wrong dimension must be rejected",
  );
}
