import assert from "node:assert/strict";

import type { KnowledgeRepository } from "../../src/application/ports/knowledge-repository.js";
import {
  KnowledgeUnitId,
  SearchFragmentId,
} from "../../src/domain/indexing/identifiers.js";

export interface KnowledgeRepositoryContractInput {
  readonly repository: KnowledgeRepository;
  readonly knownFragmentId: SearchFragmentId;
  readonly knownUnitId: KnowledgeUnitId;
}

const unknownFragmentId = SearchFragmentId.create(
  "fragment:0000000000000000000000000000000000000000000000000000000000000000:0",
);
const unknownUnitId = KnowledgeUnitId.create("unit:missing:missing:0");

/**
 * Invariants every KnowledgeRepository must satisfy.
 */
export async function verifyKnowledgeRepositoryContract(
  input: KnowledgeRepositoryContractInput,
): Promise<void> {
  assert.deepEqual(
    await input.repository.getFragmentProvenance([]),
    [],
    "an empty batch must not query anything",
  );
  assert.deepEqual(await input.repository.getUnits([]), []);
  assert.deepEqual(await input.repository.getAncestors([]), []);

  const provenance = await input.repository.getFragmentProvenance([
    input.knownFragmentId,
    unknownFragmentId,
  ]);

  const [resolved] = provenance;

  assert.equal(
    provenance.length,
    1,
    "unknown identifiers must be omitted, never invented",
  );
  assert.ok(resolved);
  assert.equal(
    resolved.fragmentId.value,
    input.knownFragmentId.value,
    "the returned identifier must be the one requested",
  );
  assert.ok(resolved.content, "provenance must carry the quoted text");

  const units = await input.repository.getUnits([
    input.knownUnitId,
    unknownUnitId,
  ]);

  assert.equal(units.length, 1);
  assert.equal(units[0]?.id.value, input.knownUnitId.value);

  const ancestors = await input.repository.getAncestors([input.knownUnitId]);

  assert.ok(
    ancestors.every((unit) => unit.id.value !== input.knownUnitId.value),
    "ancestors must exclude the starting unit",
  );
  assert.equal(
    new Set(ancestors.map((unit) => unit.id.value)).size,
    ancestors.length,
    "ancestors must not repeat",
  );
}
