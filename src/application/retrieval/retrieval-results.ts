import type {
  KnowledgeUnitId,
  PackageRef,
  SearchFragmentId,
} from "../../domain/indexing/identifiers.js";
import type { KnowledgeUnitType } from "../../domain/indexing/knowledge-unit.js";
import type { SourceDocumentKind } from "../../domain/indexing/source-document.js";

/**
 * A single result from one retrieval path. The rank is resolved by the adapter
 * because only it knows how its own scores order; `rawScore` exists for
 * diagnostics and evaluation and must never be compared across paths, since
 * BM25 is unbounded-negative while cosine similarity lives in 0..1.
 */
export interface RankedHit {
  readonly fragmentId: SearchFragmentId;
  /** 1-based and dense: the first hit is 1 and no positions are skipped. */
  readonly rank: number;
  readonly rawScore: number;
}

export type RetrievalPath = "text" | "vector";

export interface FusedHit {
  readonly fragmentId: SearchFragmentId;
  readonly fusedScore: number;
  readonly textRank: number | null;
  readonly vectorRank: number | null;
}

/**
 * Everything needed to cite a fragment without reopening the source package.
 * Carries the fragment text itself because a citation must quote it, and point
 * 2.3 assembles the context bundle from these records alone.
 */
export interface CandidateProvenance {
  readonly fragmentId: SearchFragmentId;
  readonly unitId: KnowledgeUnitId;
  readonly packageRef: PackageRef;
  readonly unitType: KnowledgeUnitType;
  readonly documentKind: SourceDocumentKind;
  readonly documentRelativePath: string;
  readonly headingPath: readonly string[];
  readonly title: string | null;
  readonly content: string;
  readonly tokenCount: number;
  readonly videoTitle: string | null;
  readonly creator: string | null;
  readonly canonicalUrl: string | null;
  readonly language: string | null;
  readonly timestamps: readonly string[];
  readonly visualEvidence: readonly string[];
}

export interface RetrievalCandidate {
  readonly fragmentId: SearchFragmentId;
  readonly unitId: KnowledgeUnitId;
  readonly packageRef: PackageRef;
  readonly fusedScore: number;
  readonly textRank: number | null;
  readonly vectorRank: number | null;
  readonly provenance: CandidateProvenance;
}

export interface RetrievalMetrics {
  readonly textHits: number;
  readonly vectorHits: number;
  readonly fusedHits: number;
  readonly returnedCandidates: number;
  readonly videosCovered: number;
  readonly sourcesCovered: number;
}

export type RetrievalWarningCode =
  | "TEXT_SEARCH_UNAVAILABLE"
  | "VECTOR_SEARCH_UNAVAILABLE"
  | "EMBEDDING_MODEL_MISSING"
  | "QUERY_HAS_NO_SEARCHABLE_TERMS";

export interface RetrievalWarning {
  readonly code: RetrievalWarningCode;
  readonly path: RetrievalPath | null;
  readonly message: string;
}

/**
 * `no_results` is a valid terminal state, not a failure: the library simply
 * holds no evidence for the query.
 */
export interface RetrievalOutcome {
  readonly status: "ok" | "no_results";
  readonly candidates: readonly RetrievalCandidate[];
  readonly metrics: RetrievalMetrics;
  readonly warnings: readonly RetrievalWarning[];
}
