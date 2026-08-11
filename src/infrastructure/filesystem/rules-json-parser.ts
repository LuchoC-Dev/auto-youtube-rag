import type {
  RulePatternSnapshot,
  RulesDocumentSnapshot,
  RulesEvidenceSnapshot,
} from "../../application/indexing/package-snapshots.js";
import type { VideoId } from "../../domain/indexing/identifiers.js";

export type RulesJsonParseErrorCode =
  | "RULES_SCHEMA_INVALID"
  | "RULES_VIDEO_ID_MISMATCH"
  | "RULES_DUPLICATE_PATTERN_ID";

export class RulesJsonParseError extends Error {
  public constructor(
    public readonly code: RulesJsonParseErrorCode,
    public readonly sourcePath: string,
    public readonly field: string,
    message: string,
  ) {
    super(message);
    this.name = "RulesJsonParseError";
  }
}

const patternIdPattern = /^[A-Za-z0-9](?:[A-Za-z0-9._-]*[A-Za-z0-9])?$/u;

function rulesError(
  code: RulesJsonParseErrorCode,
  sourcePath: string,
  field: string,
  message: string,
): never {
  throw new RulesJsonParseError(code, sourcePath, field, message);
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
    return rulesError(
      "RULES_SCHEMA_INVALID",
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
    return rulesError(
      "RULES_SCHEMA_INVALID",
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
  if (input === null) {
    return null;
  }

  return readText(input, sourcePath, field);
}

function readTextList(
  input: unknown,
  sourcePath: string,
  field: string,
): readonly string[] {
  if (!Array.isArray(input)) {
    return rulesError(
      "RULES_SCHEMA_INVALID",
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

function readOptionalTextList(
  input: unknown,
  sourcePath: string,
  field: string,
): readonly string[] {
  return input === undefined
    ? Object.freeze([])
    : readTextList(input, sourcePath, field);
}

function readOptionalText(
  input: unknown,
  sourcePath: string,
  field: string,
): string | null {
  return input === undefined ? null : readText(input, sourcePath, field);
}

function uniqueText(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const value of values) {
    if (!seen.has(value)) {
      seen.add(value);
      unique.push(value);
    }
  }

  return Object.freeze(unique);
}

function readEvidence(
  input: unknown,
  sourcePath: string,
): RulesEvidenceSnapshot {
  const evidence = readRecord(input, sourcePath, "evidence");
  const transcriptFile = readText(
    evidence.transcript_file,
    sourcePath,
    "evidence.transcript_file",
  );
  const framesDirectory = readText(
    evidence.frames_directory,
    sourcePath,
    "evidence.frames_directory",
  );
  const contactSheet = readText(
    evidence.contact_sheet,
    sourcePath,
    "evidence.contact_sheet",
  );
  const adaptiveContactSheets = readOptionalTextList(
    evidence.adaptive_contact_sheets,
    sourcePath,
    "evidence.adaptive_contact_sheets",
  );
  const coverageReport = readOptionalText(
    evidence.coverage_report,
    sourcePath,
    "evidence.coverage_report",
  );

  return Object.freeze({
    transcriptFile,
    framesDirectory,
    contactSheet,
    frameSampling: readText(
      evidence.frame_sampling,
      sourcePath,
      "evidence.frame_sampling",
    ),
    limitations: readTextList(
      evidence.limitations,
      sourcePath,
      "evidence.limitations",
    ),
    visualEvidence: uniqueText([
      contactSheet,
      ...adaptiveContactSheets,
      ...(coverageReport === null ? [] : [coverageReport]),
    ]),
  });
}

function readPattern(
  input: unknown,
  index: number,
  sourcePath: string,
): RulePatternSnapshot {
  const field = `patterns[${String(index)}]`;
  const pattern = readRecord(input, sourcePath, field);
  const id = readText(pattern.id, sourcePath, `${field}.id`);

  if (!patternIdPattern.test(id)) {
    return rulesError(
      "RULES_SCHEMA_INVALID",
      sourcePath,
      `${field}.id`,
      `${field}.id must be a safe pattern id`,
    );
  }

  const sourceBasis = readRecord(
    pattern.source_basis,
    sourcePath,
    `${field}.source_basis`,
  );

  return Object.freeze({
    id,
    name: readText(pattern.name, sourcePath, `${field}.name`),
    principle: readText(pattern.principle, sourcePath, `${field}.principle`),
    problem: readText(pattern.problem, sourcePath, `${field}.problem`),
    visualEvidence: readTextList(
      pattern.visual_evidence,
      sourcePath,
      `${field}.visual_evidence`,
    ),
    rules: readTextList(pattern.rules, sourcePath, `${field}.rules`),
    avoid: readTextList(pattern.avoid, sourcePath, `${field}.avoid`),
    acceptanceCriteria: readTextList(
      pattern.acceptance_criteria,
      sourcePath,
      `${field}.acceptance_criteria`,
    ),
    sourceBasis: Object.freeze({
      direct: readText(
        sourceBasis.direct,
        sourcePath,
        `${field}.source_basis.direct`,
      ),
      professionalExtension: readNullableText(
        sourceBasis.professional_extension,
        sourcePath,
        `${field}.source_basis.professional_extension`,
      ),
    }),
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
    rulesError(
      "RULES_VIDEO_ID_MISMATCH",
      sourcePath,
      "source.video_id",
      `source.video_id must match ${expectedVideoId.value}`,
    );
  }
}

export function parseRulesJson(
  input: unknown,
  expectedVideoId: VideoId,
  sourcePath = "<memory>",
): RulesDocumentSnapshot {
  const root = readRecord(input, sourcePath, "$");
  validateExpectedVideo(root.source, expectedVideoId, sourcePath);

  if (!Array.isArray(root.patterns)) {
    return rulesError(
      "RULES_SCHEMA_INVALID",
      sourcePath,
      "patterns",
      "patterns must be an array",
    );
  }

  const seenPatternIds = new Set<string>();
  const patterns = root.patterns.map((pattern, index) => {
    const snapshot = readPattern(pattern, index, sourcePath);

    if (seenPatternIds.has(snapshot.id)) {
      return rulesError(
        "RULES_DUPLICATE_PATTERN_ID",
        sourcePath,
        `patterns[${String(index)}].id`,
        `pattern id is duplicated within ${expectedVideoId.value}: ${snapshot.id}`,
      );
    }

    seenPatternIds.add(snapshot.id);
    return snapshot;
  });

  return Object.freeze({
    kind: "rules",
    schemaVersion: readText(root.schema_version, sourcePath, "schema_version"),
    coreThesis: readText(root.core_thesis, sourcePath, "core_thesis"),
    evidence: readEvidence(root.evidence, sourcePath),
    patterns: Object.freeze(patterns),
    agentWorkflow: readTextList(
      root.agent_workflow,
      sourcePath,
      "agent_workflow",
    ),
  });
}
