import type {
  KnowledgeUnitId,
  PackageRef,
} from "../../domain/indexing/identifiers.js";
import type { KnowledgeUnitType } from "../../domain/indexing/knowledge-unit.js";
import type { SourceDocumentKind } from "../../domain/indexing/source-document.js";

/**
 * A single citable unit of context, whether it matched the query directly
 * (`origin: "candidate"`) or was pulled in by expanding a match to its parent
 * sections (`origin: "ancestor"`). `content` and `tokenCount` are always the
 * unit's full text and its already-persisted token count — never a fragment
 * chunk and never re-tokenized.
 */
export interface ContextUnitBlock {
  readonly unitId: KnowledgeUnitId;
  readonly packageRef: PackageRef;
  readonly unitType: KnowledgeUnitType;
  readonly headingPath: readonly string[];
  readonly title: string | null;
  readonly content: string;
  readonly contentHash: string;
  readonly tokenCount: number;
  readonly origin: "candidate" | "ancestor";
  /** The fusing candidate's score, or the score of the candidate whose
   * expansion produced this block when `origin` is `"ancestor"`. Never
   * compared across blocks with different origins; only used to order within
   * a bucket. */
  readonly fusedScore: number;
  /** Hierarchical depth, 0 = document root. */
  readonly depth: number;
  readonly documentKind: SourceDocumentKind;
  readonly documentRelativePath: string;
  readonly videoTitle: string | null;
  readonly creator: string | null;
  readonly canonicalUrl: string | null;
  readonly language: string | null;
  readonly timestamps: readonly string[];
  readonly visualEvidence: readonly string[];
}

export type ContextSection =
  "highest_relevance" | "related_rules" | "additional_context";

const highestRelevanceTypes = new Set([
  "context_section",
  "context_document",
  "rules_section",
  "rules_document",
  "analysis_document",
  "analysis_section",
  "analysis_topic",
]);

const relatedRulesTypes = new Set([
  "rule_pattern",
  "rule_item",
  "avoid_item",
  "acceptance_criterion",
  "analysis_recommendation",
]);

/**
 * The fixed bucketing rule approved for 2.3: ancestor blocks always land in
 * "Additional relevant context" regardless of their own unit type, because
 * they exist only to give surrounding context, not because they matched the
 * query directly. A candidate block lands by its `unitType`; any candidate
 * type outside the two named buckets falls back to "additional_context"
 * rather than being silently dropped from every section.
 */
export function classifyContextSection(
  block: ContextUnitBlock,
): ContextSection {
  if (block.origin === "ancestor") {
    return "additional_context";
  }

  if (highestRelevanceTypes.has(block.unitType)) {
    return "highest_relevance";
  }

  if (relatedRulesTypes.has(block.unitType)) {
    return "related_rules";
  }

  return "additional_context";
}

/**
 * The outcome of walking the ordered block sequence and accumulating token
 * counts. A block is either fully included or fully omitted; nothing is cut
 * mid-block, so no citation is ever left quoting a truncated fragment.
 */
export interface BudgetAllocation {
  readonly included: readonly ContextUnitBlock[];
  readonly omittedCount: number;
  readonly estimatedTokens: number;
  readonly budgetExhausted: boolean;
}

/**
 * The resolved citation for one included block, matching the schema already
 * approved in `cli-contract.md`.
 */
export interface CitationRecord {
  readonly citationId: string; // "S01", "S02", ...
  readonly sourceName: string;
  readonly videoId: string;
  readonly videoTitle: string | null;
  readonly creator: string | null;
  readonly file: string;
  readonly headingPath: readonly string[];
  readonly unitType: KnowledgeUnitType;
  readonly timestamp: string | null;
  readonly visualEvidence: readonly string[];
}
