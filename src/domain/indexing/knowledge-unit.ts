import { DomainValidationError } from "./domain-error.js";
import { DocumentId, KnowledgeUnitId } from "./identifiers.js";

export const knowledgeUnitTypes = [
  "context_document",
  "context_section",
  "rules_document",
  "rules_section",
  "rule_pattern",
  "rule_item",
  "avoid_item",
  "acceptance_criterion",
  "analysis_document",
  "analysis_section",
  "analysis_topic",
  "analysis_recommendation",
] as const;

export type KnowledgeUnitType = (typeof knowledgeUnitTypes)[number];

const documentUnitTypes = new Set<KnowledgeUnitType>([
  "context_document",
  "rules_document",
  "analysis_document",
]);

export interface KnowledgeUnitInput {
  readonly id: KnowledgeUnitId;
  readonly documentId: DocumentId;
  readonly parentId: KnowledgeUnitId | null;
  readonly unitType: unknown;
  readonly depth: unknown;
  readonly ordinal: unknown;
  readonly title: unknown;
  readonly content: unknown;
  readonly structuredJson: unknown;
  readonly headingPath: unknown;
  readonly timestamps: unknown;
  readonly visualEvidence: unknown;
  readonly estimatedTokens: unknown;
  readonly contentHash: unknown;
  readonly searchable: unknown;
}

function invalid(field: string, expectation: string): never {
  throw new DomainValidationError(
    "INVALID_IDENTIFIER",
    field,
    `${field} ${expectation}`,
  );
}

function readUnitType(input: unknown): KnowledgeUnitType {
  if (
    typeof input !== "string" ||
    !knowledgeUnitTypes.some((unitType) => unitType === input)
  ) {
    invalid("unitType", "must be an approved knowledge unit type");
  }

  return input as KnowledgeUnitType;
}

function readNonNegativeInteger(input: unknown, field: string): number {
  if (typeof input !== "number" || !Number.isSafeInteger(input) || input < 0) {
    invalid(field, "must be a non-negative safe integer");
  }

  return input;
}

function readOptionalText(input: unknown, field: string): string | null {
  if (input === null) {
    return null;
  }

  if (
    typeof input !== "string" ||
    input.trim().length === 0 ||
    input.includes("\0")
  ) {
    invalid(field, "must be null or non-empty text without null bytes");
  }

  return input;
}

function readContent(input: unknown): string {
  if (
    typeof input !== "string" ||
    input.trim().length === 0 ||
    input.includes("\0")
  ) {
    invalid("content", "must be non-empty text without null bytes");
  }

  return input;
}

function readStructuredJson(input: unknown): string | null {
  if (input === null) {
    return null;
  }

  if (typeof input !== "string" || input.length === 0) {
    invalid("structuredJson", "must be null or valid JSON text");
  }

  try {
    JSON.parse(input);
  } catch {
    invalid("structuredJson", "must be null or valid JSON text");
  }

  return input;
}

function isCanonicalText(input: unknown): input is string {
  return (
    typeof input === "string" &&
    input.trim().length > 0 &&
    !input.includes("\0")
  );
}

function copyTextList(input: unknown, field: string): readonly string[] {
  if (!Array.isArray(input) || !input.every(isCanonicalText)) {
    invalid(field, "must contain only non-empty text without null bytes");
  }

  return Object.freeze([...input]);
}

function readContentHash(input: unknown): string {
  if (typeof input !== "string" || !/^[a-f0-9]{64}$/u.test(input)) {
    invalid("contentHash", "must be a lowercase SHA-256 hex digest");
  }

  return input;
}

export class KnowledgeUnit {
  private constructor(
    public readonly id: KnowledgeUnitId,
    public readonly documentId: DocumentId,
    public readonly parentId: KnowledgeUnitId | null,
    public readonly unitType: KnowledgeUnitType,
    public readonly depth: number,
    public readonly ordinal: number,
    public readonly title: string | null,
    public readonly content: string,
    public readonly structuredJson: string | null,
    public readonly headingPath: readonly string[],
    public readonly timestamps: readonly string[],
    public readonly visualEvidence: readonly string[],
    public readonly estimatedTokens: number,
    public readonly contentHash: string,
    public readonly searchable: boolean,
  ) {}

  public static create(input: KnowledgeUnitInput): KnowledgeUnit {
    if (!(input.id instanceof KnowledgeUnitId)) {
      invalid("id", "must be a KnowledgeUnitId");
    }

    if (!(input.documentId instanceof DocumentId)) {
      invalid("documentId", "must be a DocumentId");
    }

    const unitType = readUnitType(input.unitType);
    const depth = readNonNegativeInteger(input.depth, "depth");
    const ordinal = readNonNegativeInteger(input.ordinal, "ordinal");
    const estimatedTokens = readNonNegativeInteger(
      input.estimatedTokens,
      "estimatedTokens",
    );

    if (
      input.parentId !== null &&
      !(input.parentId instanceof KnowledgeUnitId)
    ) {
      invalid("parentId", "must be null or a KnowledgeUnitId");
    }

    if (input.parentId?.equals(input.id) === true) {
      invalid("parentId", "must not equal the unit id");
    }

    if (documentUnitTypes.has(unitType)) {
      if (input.parentId !== null) {
        invalid("parentId", "must be null for document units");
      }

      if (depth !== 0) {
        invalid("depth", "must be zero for document units");
      }
    } else {
      if (input.parentId === null) {
        invalid("parentId", "must be present for non-document units");
      }

      if (depth === 0) {
        invalid("depth", "must be positive for non-document units");
      }
    }

    if (typeof input.searchable !== "boolean") {
      invalid("searchable", "must be a boolean");
    }

    return new KnowledgeUnit(
      input.id,
      input.documentId,
      input.parentId,
      unitType,
      depth,
      ordinal,
      readOptionalText(input.title, "title"),
      readContent(input.content),
      readStructuredJson(input.structuredJson),
      copyTextList(input.headingPath, "headingPath"),
      copyTextList(input.timestamps, "timestamps"),
      copyTextList(input.visualEvidence, "visualEvidence"),
      estimatedTokens,
      readContentHash(input.contentHash),
      input.searchable,
    );
  }
}
