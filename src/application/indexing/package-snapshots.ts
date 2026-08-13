import type {
  PackageRef,
  SourceName,
  VideoId,
} from "../../domain/indexing/identifiers.js";

export type ContextFrontmatterValue =
  string | number | boolean | null | readonly string[];

export type ContextFrontmatterSnapshot = Readonly<
  Record<string, ContextFrontmatterValue>
>;

export interface ContextSectionSnapshot {
  readonly kind: "context_section";
  readonly title: string;
  readonly level: number;
  readonly ordinal: number;
  readonly headingPath: readonly string[];
  readonly content: string;
  readonly timestamps: readonly string[];
  readonly visualEvidence: readonly string[];
  readonly children: readonly ContextSectionSnapshot[];
}

export interface ContextDocumentSnapshot {
  readonly kind: "context";
  readonly frontmatter: ContextFrontmatterSnapshot;
  readonly preamble: string;
  readonly sections: readonly ContextSectionSnapshot[];
}

export interface RulesEvidenceSnapshot {
  readonly transcriptFile?: string | null;
  readonly framesDirectory?: string | null;
  readonly contactSheet?: string | null;
  readonly frameSampling?: string | null;
  readonly limitations: readonly string[];
  readonly visualEvidence: readonly string[];
}

export interface RuleSourceBasisSnapshot {
  readonly direct: string;
  readonly professionalExtension: string | null;
}

export interface RulePatternSnapshot {
  readonly id: string;
  readonly name: string;
  readonly principle: string;
  readonly problem: string;
  readonly visualEvidence: readonly string[];
  readonly rules: readonly string[];
  readonly avoid: readonly string[];
  readonly acceptanceCriteria: readonly string[];
  readonly sourceBasis: RuleSourceBasisSnapshot;
}

export interface RulesDocumentSnapshot {
  readonly kind: "rules";
  readonly schemaVersion: string;
  readonly coreThesis: string;
  readonly evidence: RulesEvidenceSnapshot;
  readonly patterns: readonly RulePatternSnapshot[];
  readonly agentWorkflow: readonly string[];
}

export const analysisEvidenceClasses = [
  "direct",
  "visual",
  "time_bound",
  "unverified",
] as const;
export type AnalysisEvidenceClass = (typeof analysisEvidenceClasses)[number];

export const analysisConfidenceLevels = ["high", "medium", "low"] as const;
export type AnalysisConfidence = (typeof analysisConfidenceLevels)[number];

export interface AnalysisTopicSnapshot {
  readonly id: string;
  readonly title: string;
  readonly whatTheSourceSays: string;
  readonly evidenceClass: AnalysisEvidenceClass;
  readonly timestamps: readonly string[];
  readonly visualEvidence: readonly string[];
  readonly analystNote: string | null;
}

export interface AnalysisRecommendationSnapshot {
  readonly id: string;
  readonly recommendation: string;
  readonly rationale: string;
  readonly confidence: AnalysisConfidence;
}

export interface AnalysisAssessmentSnapshot {
  readonly strengths: readonly string[];
  readonly weaknesses: readonly string[];
  readonly verdict: string;
  readonly basis: string;
}

export interface AnalysisEvidenceBoundarySnapshot {
  readonly transcript: string;
  readonly frames: string;
  readonly analystOpinion: string;
  readonly unverified: string;
}

export interface AnalysisLensSnapshot {
  readonly lens: string;
  readonly rationale: string;
  readonly chosenBy: "agent" | "user";
}

export interface AnalysisDocumentSnapshot {
  readonly kind: "analysis";
  readonly schemaVersion: string;
  readonly analysisLens: AnalysisLensSnapshot;
  readonly summary: string;
  readonly topics: readonly AnalysisTopicSnapshot[];
  readonly recommendations: readonly AnalysisRecommendationSnapshot[];
  readonly assessment: AnalysisAssessmentSnapshot;
  readonly evidenceBoundary: AnalysisEvidenceBoundarySnapshot;
}

export interface SelectedMetadataSnapshot {
  readonly kind: "metadata";
  readonly videoId: VideoId;
  readonly title: string | null;
  readonly creator: string | null;
  readonly canonicalUrl: string | null;
  readonly durationSeconds: number | null;
  readonly publishedAt: string | null;
  readonly sourceLanguage: string | null;
  readonly contextLanguage: string | null;
  readonly tags: readonly string[];
  readonly categories: readonly string[];
  readonly visualProfile: string | null;
  readonly visualCoverage: string | null;
  readonly limitations: readonly string[];
  readonly visualEvidence: readonly string[];
}

interface PackageDocumentSnapshotBase<
  TKind extends "context" | "rules" | "analysis" | "metadata",
  TContent,
> {
  readonly kind: TKind;
  readonly relativePath: string;
  readonly contentHash: string;
  readonly byteSize: number;
  readonly parserVersion: string;
  readonly content: TContent;
}

export type ContextPackageDocumentSnapshot = PackageDocumentSnapshotBase<
  "context",
  ContextDocumentSnapshot
>;

export type RulesPackageDocumentSnapshot = PackageDocumentSnapshotBase<
  "rules",
  RulesDocumentSnapshot
>;

export type AnalysisPackageDocumentSnapshot = PackageDocumentSnapshotBase<
  "analysis",
  AnalysisDocumentSnapshot
>;

export type MetadataPackageDocumentSnapshot = PackageDocumentSnapshotBase<
  "metadata",
  SelectedMetadataSnapshot
>;

export type PackageDocumentSnapshot =
  | ContextPackageDocumentSnapshot
  | RulesPackageDocumentSnapshot
  | AnalysisPackageDocumentSnapshot
  | MetadataPackageDocumentSnapshot;

export interface PackageSnapshot {
  readonly kind: "video_package";
  readonly ref: PackageRef;
  readonly slug: string;
  readonly relativePath: string;
  readonly manifestStage: string | null;
  readonly documents: readonly PackageDocumentSnapshot[];
}

export interface ManifestResourceSnapshot {
  readonly context: boolean;
  readonly rules: boolean;
  readonly metadata: boolean;
}

export interface ManifestVideoSnapshot {
  readonly ref: PackageRef;
  readonly slug: string;
  readonly sourceLanguage: string | null;
  readonly contextLanguage: string | null;
  readonly stage: string | null;
  readonly resources: ManifestResourceSnapshot;
}

/**
 * A manifest entry that failed schema validation or duplicated an id/slug
 * already seen earlier in the array. The entry is skipped from `videos`
 * instead of aborting the whole manifest, so one malformed video can never
 * block the rest of a source from syncing. `videoId` is a best-effort
 * identification: it is `null` when the entry's own `video_id` field is what
 * failed validation, so there is nothing safe to attribute the issue to.
 */
export interface ManifestVideoIssue {
  readonly index: number;
  readonly videoId: VideoId | null;
  readonly field: string;
  readonly code: "SCHEMA_INVALID" | "DUPLICATE";
  readonly message: string;
}

export interface ManifestSnapshot {
  readonly kind: "manifest";
  readonly sourceName: SourceName;
  readonly contentHash: string;
  readonly videos: readonly ManifestVideoSnapshot[];
  readonly issues: readonly ManifestVideoIssue[];
}
