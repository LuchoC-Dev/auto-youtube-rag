import assert from "node:assert/strict";

import type {
  TextSearchIndex,
  TextSearchRequest,
} from "../../src/application/ports/text-search-index.js";
import { RetrievalFilter } from "../../src/domain/retrieval/retrieval-filter.js";

export interface TextSearchIndexContractInput {
  readonly index: TextSearchIndex;
  /** A term present in the seeded library. */
  readonly presentTerm: string;
  /** A well-formed term that matches nothing. */
  readonly absentTerm: string;
}

function request(text: string, limit: number): TextSearchRequest {
  return { text, filter: RetrievalFilter.empty(), limit };
}

/**
 * Invariants every TextSearchIndex must satisfy, whatever engine backs it.
 */
export async function verifyTextSearchIndexContract(
  input: TextSearchIndexContractInput,
): Promise<void> {
  const hits = await input.index.search(request(input.presentTerm, 50));

  assert.ok(hits.length > 0, "expected the present term to match");

  assert.deepEqual(
    hits.map((hit) => hit.rank),
    hits.map((_hit, index) => index + 1),
    "ranks must be dense and 1-based",
  );

  const identifiers = new Set(hits.map((hit) => hit.fragmentId.value));

  assert.equal(identifiers.size, hits.length, "hits must be unique");

  assert.deepEqual(
    await input.index.search(request(input.absentTerm, 50)),
    [],
    "an unmatched term must return no hits",
  );

  assert.deepEqual(
    await input.index.search(request("   ", 50)),
    [],
    "a query without searchable tokens must return no hits",
  );

  const limited = await input.index.search(request(input.presentTerm, 1));

  assert.ok(limited.length <= 1, "the limit must be honoured");

  const repeated = await input.index.search(request(input.presentTerm, 50));

  assert.deepEqual(
    repeated.map((hit) => hit.fragmentId.value),
    hits.map((hit) => hit.fragmentId.value),
    "the same query must return the same order",
  );

  await assert.rejects(
    () => input.index.search(request(input.presentTerm, 0)),
    "a non-positive limit must be rejected",
  );
}
