import type { ContextBudget } from "../../domain/context/context-budget.js";
import type { KnowledgeUnitType } from "../../domain/indexing/knowledge-unit.js";
import type { RetrievalWarning } from "../retrieval/retrieval-results.js";
import {
  classifyContextSection,
  type BudgetAllocation,
  type CitationRecord,
  type ContextUnitBlock,
} from "./context-blocks.js";
import type {
  ContextResultDocument,
  ContextResultSource,
  ContextResultUnit,
} from "./context-bundle.js";

export interface RenderContextResultInput {
  readonly query: string;
  readonly budget: ContextBudget;
  readonly sourceFilter: readonly string[];
  readonly candidatesConsidered: number;
  readonly allocation: BudgetAllocation;
  /** Same order and length as `allocation.included`. */
  readonly citations: readonly CitationRecord[];
  readonly warnings: readonly RetrievalWarning[];
}

function toResultUnit(
  block: ContextUnitBlock,
  citation: CitationRecord,
): ContextResultUnit {
  return {
    citation_id: citation.citationId,
    section: classifyContextSection(block),
    source_name: citation.sourceName,
    video_id: citation.videoId,
    video_title: citation.videoTitle,
    creator: citation.creator,
    file: citation.file,
    heading_path: citation.headingPath,
    unit_type: citation.unitType,
    timestamp: citation.timestamp,
    visual_evidence: citation.visualEvidence,
    content: block.content,
    token_count: block.tokenCount,
  };
}

function toSources(
  blocks: readonly ContextUnitBlock[],
): readonly ContextResultSource[] {
  const seen = new Map<string, ContextUnitBlock>();

  for (const block of blocks) {
    seen.set(block.packageRef.serialize(), block);
  }

  return [...seen.values()].map((block) => ({
    source_name: block.packageRef.sourceName.value,
    video_id: block.packageRef.videoId.value,
    video_title: block.videoTitle,
    creator: block.creator,
    canonical_url: block.canonicalUrl,
  }));
}

function unitsByType(
  blocks: readonly ContextUnitBlock[],
): Partial<Record<KnowledgeUnitType, number>> {
  const counts: Partial<Record<KnowledgeUnitType, number>> = {};

  for (const block of blocks) {
    counts[block.unitType] = (counts[block.unitType] ?? 0) + 1;
  }

  return counts;
}

function unitsBySource(
  blocks: readonly ContextUnitBlock[],
): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const block of blocks) {
    const key = block.packageRef.sourceName.value;
    counts[key] = (counts[key] ?? 0) + 1;
  }

  return counts;
}

function limitations(
  allocation: BudgetAllocation,
  warnings: readonly RetrievalWarning[],
): readonly string[] {
  const reasons: string[] = warnings.map((warning) => warning.message);

  if (allocation.budgetExhausted) {
    reasons.push(
      `The token budget was exhausted; ${String(allocation.omittedCount)} additional block(s) with real evidence were left out.`,
    );
  }

  return reasons;
}

/**
 * Pure renderer for `result.json`. `status` is `"no_results"` whenever no
 * block made it into the bundle, whether because retrieval itself found
 * nothing or because the requested budget was too small to fit even the
 * first block's citable text.
 */
export function renderContextResult(
  input: RenderContextResultInput,
): ContextResultDocument {
  const entries = input.allocation.included.map((block, index) => {
    const citation = input.citations[index];

    if (citation === undefined) {
      throw new Error(
        "renderContextResult: citations must align with allocation.included by index.",
      );
    }

    return toResultUnit(block, citation);
  });

  return {
    schema_version: "1.0",
    status: input.allocation.included.length === 0 ? "no_results" : "ok",
    request: {
      query: input.query,
      depth: input.budget.depth,
      max_tokens: input.budget.maxTokens,
      sources: input.sourceFilter,
    },
    metrics: {
      candidates_considered: input.candidatesConsidered,
      units_selected: input.allocation.included.length,
      sources_used: new Set(
        input.allocation.included.map((block) => block.packageRef.serialize()),
      ).size,
      estimated_tokens: input.allocation.estimatedTokens,
    },
    units: entries,
    sources: toSources(input.allocation.included),
    coverage: {
      units_by_type: unitsByType(input.allocation.included),
      units_by_source: unitsBySource(input.allocation.included),
      omitted_for_budget: input.allocation.omittedCount,
      budget_exhausted: input.allocation.budgetExhausted,
    },
    warnings: input.warnings,
    limitations: limitations(input.allocation, input.warnings),
  };
}
