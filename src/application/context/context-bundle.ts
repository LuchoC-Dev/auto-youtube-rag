import type { ContextDepth } from "../../domain/context/context-budget.js";
import type { KnowledgeUnitType } from "../../domain/indexing/knowledge-unit.js";
import type { RetrievalWarning } from "../retrieval/retrieval-results.js";
import type { ContextSection } from "./context-blocks.js";

/**
 * `result.json`'s field names are the wire contract already approved in
 * `cli-contract.md` (snake_case), not an internal TypeScript convention, so
 * this type spells them exactly as the file will. `CitationRecord`
 * (`context-blocks.ts`) stays camelCase for internal use; `renderContextResult`
 * is the one place that maps one to the other, the same way `run-cli.ts`
 * builds its snake_case receipts from camelCase application types.
 */
export interface ContextResultUnit {
  readonly citation_id: string;
  readonly section: ContextSection;
  readonly source_name: string;
  readonly video_id: string;
  readonly video_title: string | null;
  readonly creator: string | null;
  readonly file: string;
  readonly heading_path: readonly string[];
  readonly unit_type: KnowledgeUnitType;
  readonly timestamp: string | null;
  readonly visual_evidence: readonly string[];
  readonly content: string;
  readonly token_count: number;
}

export interface ContextResultSource {
  readonly source_name: string;
  readonly video_id: string;
  readonly video_title: string | null;
  readonly creator: string | null;
  readonly canonical_url: string | null;
}

export interface ContextResultDocument {
  readonly schema_version: "1.0";
  readonly status: "ok" | "no_results";
  readonly request: {
    readonly query: string;
    readonly depth: ContextDepth;
    readonly max_tokens: number;
    readonly sources: readonly string[];
  };
  readonly metrics: {
    readonly candidates_considered: number;
    readonly units_selected: number;
    readonly sources_used: number;
    readonly estimated_tokens: number;
    /**
     * Cosine of the closest semantic match, or `null` when the vector path did
     * not run. Always reported, so the agent can weigh relevance itself rather
     * than only learning about it when `LOW_RELEVANCE` fires.
     */
    readonly top_vector_similarity: number | null;
  };
  readonly units: readonly ContextResultUnit[];
  readonly sources: readonly ContextResultSource[];
  readonly coverage: {
    readonly units_by_type: Readonly<
      Partial<Record<KnowledgeUnitType, number>>
    >;
    readonly units_by_source: Readonly<Record<string, number>>;
    readonly omitted_for_budget: number;
    readonly budget_exhausted: boolean;
  };
  readonly warnings: readonly RetrievalWarning[];
  readonly limitations: readonly string[];
}

/**
 * The complete assembled artifact: the Markdown text for `context.md` and
 * the structured document for `result.json`. Writing both to disk is an
 * infrastructure concern (`writeContextBundle`); this type carries no path.
 */
export interface ContextBundle {
  readonly markdown: string;
  readonly result: ContextResultDocument;
}
