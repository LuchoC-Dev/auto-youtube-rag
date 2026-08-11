import { DomainValidationError } from "../indexing/domain-error.js";
import { RetrievalFilter } from "./retrieval-filter.js";

/**
 * Bounds the query so that a pasted document can never reach the embedding
 * model or the FTS5 parser. Real agent queries are far shorter than this.
 */
export const maxRetrievalQueryCharacters = 1000;

export const defaultRetrievalLimits = {
  textCandidates: 100,
  vectorCandidates: 100,
  fusedResults: 50,
  maxPerVideo: 4,
} as const;

export interface RetrievalLimitsInput {
  readonly textCandidates?: unknown;
  readonly vectorCandidates?: unknown;
  readonly fusedResults?: unknown;
  readonly maxPerVideo?: unknown;
}

export interface RetrievalQueryInput {
  readonly text: unknown;
  readonly filter?: unknown;
  readonly limits?: unknown;
}

function invalid(field: string, expectation: string): never {
  throw new DomainValidationError(
    "INVALID_RETRIEVAL_QUERY",
    field,
    `${field} ${expectation}`,
  );
}

function readPositiveInteger(
  input: unknown,
  field: string,
  fallback: number,
): number {
  if (input === undefined) {
    return fallback;
  }

  if (typeof input !== "number" || !Number.isSafeInteger(input) || input < 1) {
    invalid(field, "must be a positive safe integer");
  }

  return input;
}

/**
 * Normalizes to NFC so that the same word typed with composed or decomposed
 * accents produces one query, collapses internal whitespace for determinism,
 * and preserves case and diacritics because FTS5 folds them itself and E5
 * expects the original text.
 */
function readText(input: unknown): string {
  if (typeof input !== "string") {
    invalid("text", "must be a string");
  }

  if (input.length > maxRetrievalQueryCharacters) {
    invalid(
      "text",
      `must not exceed ${String(maxRetrievalQueryCharacters)} characters`,
    );
  }

  const normalized = input.normalize("NFC").trim().replace(/\s+/gu, " ");

  if (normalized.length === 0 || !/[\p{L}\p{N}]/u.test(normalized)) {
    invalid("text", "must contain at least one letter or number");
  }

  return normalized;
}

export class RetrievalLimits {
  private constructor(
    public readonly textCandidates: number,
    public readonly vectorCandidates: number,
    public readonly fusedResults: number,
    public readonly maxPerVideo: number,
  ) {}

  public static default(): RetrievalLimits {
    return RetrievalLimits.create({});
  }

  public static create(input: RetrievalLimitsInput): RetrievalLimits {
    return new RetrievalLimits(
      readPositiveInteger(
        input.textCandidates,
        "textCandidates",
        defaultRetrievalLimits.textCandidates,
      ),
      readPositiveInteger(
        input.vectorCandidates,
        "vectorCandidates",
        defaultRetrievalLimits.vectorCandidates,
      ),
      readPositiveInteger(
        input.fusedResults,
        "fusedResults",
        defaultRetrievalLimits.fusedResults,
      ),
      readPositiveInteger(
        input.maxPerVideo,
        "maxPerVideo",
        defaultRetrievalLimits.maxPerVideo,
      ),
    );
  }
}

export class RetrievalQuery {
  private constructor(
    public readonly text: string,
    public readonly filter: RetrievalFilter,
    public readonly limits: RetrievalLimits,
  ) {}

  public static create(input: RetrievalQueryInput): RetrievalQuery {
    const text = readText(input.text);

    if (
      input.filter !== undefined &&
      !(input.filter instanceof RetrievalFilter)
    ) {
      invalid("filter", "must be a RetrievalFilter");
    }

    if (
      input.limits !== undefined &&
      !(input.limits instanceof RetrievalLimits)
    ) {
      invalid("limits", "must be a RetrievalLimits");
    }

    return new RetrievalQuery(
      text,
      input.filter ?? RetrievalFilter.empty(),
      input.limits ?? RetrievalLimits.default(),
    );
  }
}
