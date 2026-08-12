import type { ContextUnitBlock } from "./context-blocks.js";

/**
 * Collapses blocks that carry identical content under different `unitId`s —
 * a rule repeated verbatim across packages, for example. The first block in
 * input order wins; later duplicates are dropped entirely, so they generate
 * no citation and contribute nothing to `coverage`. Callers pass candidate
 * blocks before ancestor blocks so a direct match always outranks context
 * pulled in only for expansion.
 */
export function deduplicateBlocks(
  blocks: readonly ContextUnitBlock[],
): readonly ContextUnitBlock[] {
  const seenHashes = new Set<string>();
  const deduplicated: ContextUnitBlock[] = [];

  for (const block of blocks) {
    if (seenHashes.has(block.contentHash)) {
      continue;
    }

    seenHashes.add(block.contentHash);
    deduplicated.push(block);
  }

  return Object.freeze(deduplicated);
}
