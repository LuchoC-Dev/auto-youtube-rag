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
