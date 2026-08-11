import { DomainValidationError } from "./domain-error.js";
import { KnowledgeUnitId, SearchFragmentId } from "./identifiers.js";

export interface SearchFragmentInput {
  readonly id: SearchFragmentId;
  readonly unitId: KnowledgeUnitId;
  readonly ordinal: unknown;
  readonly title: unknown;
  readonly headingPath: unknown;
  readonly content: unknown;
  readonly tokenCount: unknown;
  readonly contentHash: unknown;
}

function invalid(field: string, expectation: string): never {
  throw new DomainValidationError(
    "INVALID_IDENTIFIER",
    field,
    `${field} ${expectation}`,
  );
}

function readNonNegativeInteger(input: unknown, field: string): number {
  if (typeof input !== "number" || !Number.isSafeInteger(input) || input < 0) {
    invalid(field, "must be a non-negative safe integer");
  }

  return input;
}

function readTitle(input: unknown): string | null {
  if (input === null) {
    return null;
  }

  if (
    typeof input !== "string" ||
    input.trim().length === 0 ||
    input.includes("\0")
  ) {
    invalid("title", "must be null or non-empty text without null bytes");
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

function copyHeadingPath(input: unknown): readonly string[] {
  if (!Array.isArray(input) || !input.every(isCanonicalText)) {
    invalid("headingPath", "must contain only non-empty text");
  }

  return Object.freeze([...input]);
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

function readTokenCount(input: unknown): number {
  const tokenCount = readNonNegativeInteger(input, "tokenCount");

  if (tokenCount === 0) {
    invalid("tokenCount", "must be positive");
  }

  return tokenCount;
}

function readContentHash(input: unknown): string {
  if (typeof input !== "string" || !/^[a-f0-9]{64}$/u.test(input)) {
    invalid("contentHash", "must be a lowercase SHA-256 hex digest");
  }

  return input;
}

export class SearchFragment {
  private constructor(
    public readonly id: SearchFragmentId,
    public readonly unitId: KnowledgeUnitId,
    public readonly ordinal: number,
    public readonly title: string | null,
    public readonly headingPath: readonly string[],
    public readonly content: string,
    public readonly tokenCount: number,
    public readonly contentHash: string,
  ) {}

  public static create(input: SearchFragmentInput): SearchFragment {
    if (!(input.id instanceof SearchFragmentId)) {
      invalid("id", "must be a SearchFragmentId");
    }

    if (!(input.unitId instanceof KnowledgeUnitId)) {
      invalid("unitId", "must be a KnowledgeUnitId");
    }

    return new SearchFragment(
      input.id,
      input.unitId,
      readNonNegativeInteger(input.ordinal, "ordinal"),
      readTitle(input.title),
      copyHeadingPath(input.headingPath),
      readContent(input.content),
      readTokenCount(input.tokenCount),
      readContentHash(input.contentHash),
    );
  }
}
