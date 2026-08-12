import {
  classifyContextSection,
  type BudgetAllocation,
  type ContextUnitBlock,
} from "./context-blocks.js";

/**
 * Fixed, deterministic ingestion order approved for 2.3: document/section
 * candidates first, then rule/pattern candidates, then ancestor blocks
 * pulled in only for expansion. Each bucket sorts by descending fused score;
 * ancestors additionally break ties by descending depth (depth 0 is the
 * document root) so the immediate parent always precedes a grandparent.
 */
function orderedForBudget(
  blocks: readonly ContextUnitBlock[],
): readonly ContextUnitBlock[] {
  const highestRelevance: ContextUnitBlock[] = [];
  const relatedRules: ContextUnitBlock[] = [];
  const additionalContext: ContextUnitBlock[] = [];

  for (const block of blocks) {
    const section = classifyContextSection(block);

    if (section === "highest_relevance") {
      highestRelevance.push(block);
    } else if (section === "related_rules") {
      relatedRules.push(block);
    } else {
      additionalContext.push(block);
    }
  }

  const byScoreDesc = (a: ContextUnitBlock, b: ContextUnitBlock): number =>
    b.fusedScore - a.fusedScore;

  highestRelevance.sort(byScoreDesc);
  relatedRules.sort(byScoreDesc);
  // Within "additional context", ancestor blocks additionally break ties by
  // descending depth; a stray candidate without a dedicated bucket has no
  // such notion and simply keeps the score-only order.
  additionalContext.sort(
    (a, b) => b.fusedScore - a.fusedScore || b.depth - a.depth,
  );

  return [...highestRelevance, ...relatedRules, ...additionalContext];
}

/**
 * Walks the fixed ingestion order and accumulates token counts. A block is
 * always included whole or omitted whole — never split — so no citation is
 * ever left quoting a truncated fragment. The first block is included even
 * if it alone exceeds the budget: the bundle must never come back empty when
 * real evidence exists, and the budget is then marked exhausted immediately.
 */
export function allocateBudget(
  blocks: readonly ContextUnitBlock[],
  maxTokens: number,
): BudgetAllocation {
  const ordered = orderedForBudget(blocks);
  const included: ContextUnitBlock[] = [];
  let estimatedTokens = 0;
  let omittedCount = 0;
  let exhaustedByFirstBlock = false;

  for (const block of ordered) {
    if (included.length === 0) {
      included.push(block);
      estimatedTokens += block.tokenCount;
      exhaustedByFirstBlock = estimatedTokens > maxTokens;
      continue;
    }

    if (
      exhaustedByFirstBlock ||
      estimatedTokens + block.tokenCount > maxTokens
    ) {
      omittedCount += 1;
      continue;
    }

    included.push(block);
    estimatedTokens += block.tokenCount;
  }

  return {
    included: Object.freeze(included),
    omittedCount,
    estimatedTokens,
    budgetExhausted: exhaustedByFirstBlock || omittedCount > 0,
  };
}
