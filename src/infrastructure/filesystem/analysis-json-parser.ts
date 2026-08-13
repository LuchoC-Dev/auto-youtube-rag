import type {
  AnalysisAssessmentSnapshot,
  AnalysisConfidence,
  AnalysisDocumentSnapshot,
  AnalysisEvidenceBoundarySnapshot,
  AnalysisEvidenceClass,
  AnalysisLensSnapshot,
  AnalysisRecommendationSnapshot,
  AnalysisTopicSnapshot,
} from "../../application/indexing/package-snapshots.js";
import {
  analysisConfidenceLevels,
  analysisEvidenceClasses,
} from "../../application/indexing/package-snapshots.js";
import type { VideoId } from "../../domain/indexing/identifiers.js";

export type AnalysisJsonParseErrorCode =
  | "ANALYSIS_SCHEMA_INVALID"
  | "ANALYSIS_VIDEO_ID_MISMATCH"
  | "ANALYSIS_DUPLICATE_TOPIC_ID"
  | "ANALYSIS_DUPLICATE_RECOMMENDATION_ID";

export class AnalysisJsonParseError extends Error {
  public constructor(
    public readonly code: AnalysisJsonParseErrorCode,
    public readonly sourcePath: string,
    public readonly field: string,
    message: string,
  ) {
    super(message);
    this.name = "AnalysisJsonParseError";
  }
}

const idPattern = /^[A-Za-z0-9](?:[A-Za-z0-9._-]*[A-Za-z0-9])?$/u;

function analysisError(
  code: AnalysisJsonParseErrorCode,
  sourcePath: string,
  field: string,
  message: string,
): never {
  throw new AnalysisJsonParseError(code, sourcePath, field, message);
}

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

function readRecord(
  input: unknown,
  sourcePath: string,
  field: string,
): Record<string, unknown> {
  if (!isRecord(input)) {
    return analysisError(
      "ANALYSIS_SCHEMA_INVALID",
      sourcePath,
      field,
      `${field} must be an object`,
    );
  }

  return input;
}

function readText(input: unknown, sourcePath: string, field: string): string {
  if (
    typeof input !== "string" ||
    input.trim().length === 0 ||
    input !== input.trim() ||
    input.includes("\0")
  ) {
    return analysisError(
      "ANALYSIS_SCHEMA_INVALID",
      sourcePath,
      field,
      `${field} must be non-empty canonical text`,
    );
  }

  return input;
}

function readNullableText(
  input: unknown,
  sourcePath: string,
  field: string,
): string | null {
  return input === null || input === undefined
    ? null
    : readText(input, sourcePath, field);
}

function readTextList(
  input: unknown,
  sourcePath: string,
  field: string,
): readonly string[] {
  if (!Array.isArray(input)) {
    return analysisError(
      "ANALYSIS_SCHEMA_INVALID",
      sourcePath,
      field,
      `${field} must be an array`,
    );
  }

  return Object.freeze(
    input.map((value, index) =>
      readText(value, sourcePath, `${field}[${String(index)}]`),
    ),
  );
}

function readId(input: unknown, sourcePath: string, field: string): string {
  const id = readText(input, sourcePath, field);

  if (!idPattern.test(id)) {
    return analysisError(
      "ANALYSIS_SCHEMA_INVALID",
      sourcePath,
      field,
      `${field} must be a safe structural id`,
    );
  }

  return id;
}

function readEvidenceClass(
  input: unknown,
  sourcePath: string,
  field: string,
): AnalysisEvidenceClass {
  const value = readText(input, sourcePath, field);

  if (!analysisEvidenceClasses.some((candidate) => candidate === value)) {
    return analysisError(
      "ANALYSIS_SCHEMA_INVALID",
      sourcePath,
      field,
      `${field} must be one of: ${analysisEvidenceClasses.join(", ")}`,
    );
  }

  return value as AnalysisEvidenceClass;
}

function readConfidence(
  input: unknown,
  sourcePath: string,
  field: string,
): AnalysisConfidence {
  const value = readText(input, sourcePath, field);

  if (!analysisConfidenceLevels.some((candidate) => candidate === value)) {
    return analysisError(
      "ANALYSIS_SCHEMA_INVALID",
      sourcePath,
      field,
      `${field} must be one of: ${analysisConfidenceLevels.join(", ")}`,
    );
  }

  return value as AnalysisConfidence;
}

function readChosenBy(
  input: unknown,
  sourcePath: string,
  field: string,
): "agent" | "user" {
  const value = readText(input, sourcePath, field);

  if (value !== "agent" && value !== "user") {
    return analysisError(
      "ANALYSIS_SCHEMA_INVALID",
      sourcePath,
      field,
      `${field} must be one of: agent, user`,
    );
  }

  return value;
}

function readAnalysisLens(
  input: unknown,
  sourcePath: string,
): AnalysisLensSnapshot {
  const lens = readRecord(input, sourcePath, "analysis_lens");

  return Object.freeze({
    lens: readText(lens.lens, sourcePath, "analysis_lens.lens"),
    rationale: readText(lens.rationale, sourcePath, "analysis_lens.rationale"),
    chosenBy: readChosenBy(
      lens.chosen_by,
      sourcePath,
      "analysis_lens.chosen_by",
    ),
  });
}

function readTopic(
  input: unknown,
  index: number,
  sourcePath: string,
): AnalysisTopicSnapshot {
  const field = `topics[${String(index)}]`;
  const topic = readRecord(input, sourcePath, field);

  return Object.freeze({
    id: readId(topic.id, sourcePath, `${field}.id`),
    title: readText(topic.title, sourcePath, `${field}.title`),
    whatTheSourceSays: readText(
      topic.what_the_source_says,
      sourcePath,
      `${field}.what_the_source_says`,
    ),
    evidenceClass: readEvidenceClass(
      topic.evidence_class,
      sourcePath,
      `${field}.evidence_class`,
    ),
    timestamps: readTextList(
      topic.timestamps,
      sourcePath,
      `${field}.timestamps`,
    ),
    visualEvidence: readTextList(
      topic.visual_evidence,
      sourcePath,
      `${field}.visual_evidence`,
    ),
    analystNote: readNullableText(
      topic.analyst_note,
      sourcePath,
      `${field}.analyst_note`,
    ),
  });
}

function readRecommendation(
  input: unknown,
  index: number,
  sourcePath: string,
): AnalysisRecommendationSnapshot {
  const field = `recommendations[${String(index)}]`;
  const recommendation = readRecord(input, sourcePath, field);

  return Object.freeze({
    id: readId(recommendation.id, sourcePath, `${field}.id`),
    recommendation: readText(
      recommendation.recommendation,
      sourcePath,
      `${field}.recommendation`,
    ),
    rationale: readText(
      recommendation.rationale,
      sourcePath,
      `${field}.rationale`,
    ),
    confidence: readConfidence(
      recommendation.confidence,
      sourcePath,
      `${field}.confidence`,
    ),
  });
}

function readAssessment(
  input: unknown,
  sourcePath: string,
): AnalysisAssessmentSnapshot {
  const assessment = readRecord(input, sourcePath, "assessment");

  return Object.freeze({
    strengths: readTextList(
      assessment.strengths,
      sourcePath,
      "assessment.strengths",
    ),
    weaknesses: readTextList(
      assessment.weaknesses,
      sourcePath,
      "assessment.weaknesses",
    ),
    verdict: readText(assessment.verdict, sourcePath, "assessment.verdict"),
    basis: readText(assessment.basis, sourcePath, "assessment.basis"),
  });
}

function readEvidenceBoundary(
  input: unknown,
  sourcePath: string,
): AnalysisEvidenceBoundarySnapshot {
  const boundary = readRecord(input, sourcePath, "evidence_boundary");

  return Object.freeze({
    transcript: readText(
      boundary.transcript,
      sourcePath,
      "evidence_boundary.transcript",
    ),
    frames: readText(boundary.frames, sourcePath, "evidence_boundary.frames"),
    analystOpinion: readText(
      boundary.analyst_opinion,
      sourcePath,
      "evidence_boundary.analyst_opinion",
    ),
    unverified: readText(
      boundary.unverified,
      sourcePath,
      "evidence_boundary.unverified",
    ),
  });
}

function validateExpectedVideo(
  input: unknown,
  expectedVideoId: VideoId,
  sourcePath: string,
): void {
  const source = readRecord(input, sourcePath, "source");
  const actualVideoId = readText(
    source.video_id,
    sourcePath,
    "source.video_id",
  );

  if (actualVideoId !== expectedVideoId.value) {
    analysisError(
      "ANALYSIS_VIDEO_ID_MISMATCH",
      sourcePath,
      "source.video_id",
      `source.video_id must match ${expectedVideoId.value}`,
    );
  }
}

export function parseAnalysisJson(
  input: unknown,
  expectedVideoId: VideoId,
  sourcePath = "<memory>",
): AnalysisDocumentSnapshot {
  const root = readRecord(input, sourcePath, "$");
  validateExpectedVideo(root.source, expectedVideoId, sourcePath);

  if (!Array.isArray(root.topics)) {
    return analysisError(
      "ANALYSIS_SCHEMA_INVALID",
      sourcePath,
      "topics",
      "topics must be an array",
    );
  }

  if (!Array.isArray(root.recommendations)) {
    return analysisError(
      "ANALYSIS_SCHEMA_INVALID",
      sourcePath,
      "recommendations",
      "recommendations must be an array",
    );
  }

  const seenTopicIds = new Set<string>();
  const topics = root.topics.map((topic, index) => {
    const snapshot = readTopic(topic, index, sourcePath);

    if (seenTopicIds.has(snapshot.id)) {
      return analysisError(
        "ANALYSIS_DUPLICATE_TOPIC_ID",
        sourcePath,
        `topics[${String(index)}].id`,
        `topic id is duplicated within ${expectedVideoId.value}: ${snapshot.id}`,
      );
    }

    seenTopicIds.add(snapshot.id);
    return snapshot;
  });

  const seenRecommendationIds = new Set<string>();
  const recommendations = root.recommendations.map((recommendation, index) => {
    const snapshot = readRecommendation(recommendation, index, sourcePath);

    if (seenRecommendationIds.has(snapshot.id)) {
      return analysisError(
        "ANALYSIS_DUPLICATE_RECOMMENDATION_ID",
        sourcePath,
        `recommendations[${String(index)}].id`,
        `recommendation id is duplicated within ${expectedVideoId.value}: ${snapshot.id}`,
      );
    }

    seenRecommendationIds.add(snapshot.id);
    return snapshot;
  });

  return Object.freeze({
    kind: "analysis",
    schemaVersion: readText(root.schema_version, sourcePath, "schema_version"),
    analysisLens: readAnalysisLens(root.analysis_lens, sourcePath),
    summary: readText(root.summary, sourcePath, "summary"),
    topics: Object.freeze(topics),
    recommendations: Object.freeze(recommendations),
    assessment: readAssessment(root.assessment, sourcePath),
    evidenceBoundary: readEvidenceBoundary(root.evidence_boundary, sourcePath),
  });
}
