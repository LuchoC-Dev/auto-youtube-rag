import { DomainValidationError } from "./domain-error.js";
import { SearchFragmentId } from "./identifiers.js";

export interface EmbeddingRecordInput {
  readonly fragmentId: SearchFragmentId;
  readonly modelKey: unknown;
  readonly modelVersion: unknown;
  readonly dimensions: unknown;
  readonly contentHash: unknown;
  readonly vector: unknown;
  readonly createdAt: unknown;
}

function invalid(field: string, expectation: string): never {
  throw new DomainValidationError(
    "INVALID_IDENTIFIER",
    field,
    `${field} ${expectation}`,
  );
}

function readCompactString(input: unknown, field: string): string {
  if (
    typeof input !== "string" ||
    input.length === 0 ||
    input !== input.trim() ||
    /\s/u.test(input) ||
    input.includes("\0")
  ) {
    invalid(field, "must be a compact non-empty string");
  }

  return input;
}

function readDimensions(input: unknown): number {
  if (typeof input !== "number" || !Number.isSafeInteger(input) || input <= 0) {
    invalid("dimensions", "must be a positive safe integer");
  }

  return input;
}

function readContentHash(input: unknown): string {
  if (typeof input !== "string" || !/^[a-f0-9]{64}$/u.test(input)) {
    invalid("contentHash", "must be a lowercase SHA-256 hex digest");
  }

  return input;
}

function copyVector(input: unknown, dimensions: number): Float32Array {
  if (!(input instanceof Float32Array)) {
    invalid("vector", "must be a Float32Array");
  }

  if (input.length !== dimensions) {
    invalid("dimensions", "must equal the vector length");
  }

  for (const value of input) {
    if (!Number.isFinite(value)) {
      invalid("vector", "must contain only finite numbers");
    }
  }

  return new Float32Array(input);
}

function readCreatedAt(input: unknown): string {
  if (typeof input !== "string") {
    invalid("createdAt", "must be a canonical UTC ISO 8601 timestamp");
  }

  const parsed = new Date(input);

  if (Number.isNaN(parsed.getTime()) || parsed.toISOString() !== input) {
    invalid("createdAt", "must be a canonical UTC ISO 8601 timestamp");
  }

  return input;
}

export class EmbeddingRecord {
  readonly #vector: Float32Array;

  private constructor(
    public readonly fragmentId: SearchFragmentId,
    public readonly modelKey: string,
    public readonly modelVersion: string,
    public readonly dimensions: number,
    public readonly contentHash: string,
    vector: Float32Array,
    public readonly createdAt: string,
  ) {
    this.#vector = vector;
  }

  public static create(input: EmbeddingRecordInput): EmbeddingRecord {
    if (!(input.fragmentId instanceof SearchFragmentId)) {
      invalid("fragmentId", "must be a SearchFragmentId");
    }

    const dimensions = readDimensions(input.dimensions);

    return new EmbeddingRecord(
      input.fragmentId,
      readCompactString(input.modelKey, "modelKey"),
      readCompactString(input.modelVersion, "modelVersion"),
      dimensions,
      readContentHash(input.contentHash),
      copyVector(input.vector, dimensions),
      readCreatedAt(input.createdAt),
    );
  }

  public get vector(): Float32Array {
    return new Float32Array(this.#vector);
  }
}
