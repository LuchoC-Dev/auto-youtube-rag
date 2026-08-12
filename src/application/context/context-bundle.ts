import type { ContextDepth } from "../../domain/context/context-budget.js";
import type { KnowledgeUnitType } from "../../domain/indexing/knowledge-unit.js";
import type { RetrievalWarning } from "../retrieval/retrieval-results.js";
import type { CitationRecord, ContextSection } from "./context-blocks.js";

/**
 * One entry of `result.json`'s `units` array: a resolved citation plus the
 * full text it backs and the section of `context.md` it was rendered into.
 * `cli-contract.md` shows the citation shape alone; this extends it with the
 * fields a consumer needs without reopening `context.md`.
 */
export interface ContextResultUnit extends CitationRecord {
  readonly section: ContextSection;
  readonly content: string;
  readonly tokenCount: number;
}

export interface ContextResultSource {
  readonly sourceName: string;
  readonly videoId: string;
  readonly videoTitle: string | null;
  readonly creator: string | null;
  readonly canonicalUrl: string | null;
}

export interface ContextResultDocument {
  readonly schemaVersion: "1.0";
  readonly status: "ok" | "no_results";
  readonly request: {
    readonly query: string;
    readonly depth: ContextDepth;
    readonly maxTokens: number;
    readonly sources: readonly string[];
  };
  readonly metrics: {
    readonly candidatesConsidered: number;
    readonly unitsSelected: number;
    readonly sourcesUsed: number;
    readonly estimatedTokens: number;
  };
  readonly units: readonly ContextResultUnit[];
  readonly sources: readonly ContextResultSource[];
  readonly coverage: {
    readonly unitsByType: Readonly<Partial<Record<KnowledgeUnitType, number>>>;
    readonly unitsBySource: Readonly<Record<string, number>>;
    readonly omittedForBudget: number;
    readonly budgetExhausted: boolean;
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
