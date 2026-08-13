import { DomainValidationError } from "./domain-error.js";
import { DocumentId, PackageRef } from "./identifiers.js";

export const sourceDocumentKinds = [
  "context",
  "rules",
  "analysis",
  "metadata",
] as const;
export type SourceDocumentKind = (typeof sourceDocumentKinds)[number];

export interface SourceDocumentInput {
  readonly id: DocumentId;
  readonly packageRef: PackageRef;
  readonly kind: unknown;
  readonly relativePath: unknown;
  readonly contentHash: unknown;
  readonly byteSize: unknown;
  readonly parserVersion: unknown;
}

function invalid(field: string, expectation: string): never {
  throw new DomainValidationError(
    "INVALID_IDENTIFIER",
    field,
    `${field} ${expectation}`,
  );
}

function readKind(input: unknown): SourceDocumentKind {
  if (
    typeof input !== "string" ||
    !sourceDocumentKinds.some((kind) => kind === input)
  ) {
    invalid("kind", "must be context, rules, analysis or metadata");
  }

  return input as SourceDocumentKind;
}

function readRelativePath(input: unknown): string {
  if (
    typeof input !== "string" ||
    input.length === 0 ||
    input !== input.trim() ||
    input.includes("\0") ||
    input.includes("\\") ||
    input.startsWith("/") ||
    /^[A-Za-z]:/u.test(input)
  ) {
    invalid("relativePath", "must be a canonical relative POSIX path");
  }

  const segments = input.split("/");

  if (
    segments.some(
      (segment) => segment === "" || segment === "." || segment === "..",
    )
  ) {
    invalid(
      "relativePath",
      "must not contain empty, current or parent segments",
    );
  }

  return input;
}

function readContentHash(input: unknown): string {
  if (typeof input !== "string" || !/^[a-f0-9]{64}$/u.test(input)) {
    invalid("contentHash", "must be a lowercase SHA-256 hex digest");
  }

  return input;
}

function readByteSize(input: unknown): number {
  if (typeof input !== "number" || !Number.isSafeInteger(input) || input < 0) {
    invalid("byteSize", "must be a non-negative safe integer");
  }

  return input;
}

function readParserVersion(input: unknown): string {
  if (
    typeof input !== "string" ||
    input.length === 0 ||
    input !== input.trim() ||
    /\s/u.test(input) ||
    input.includes("\0")
  ) {
    invalid("parserVersion", "must be a compact non-empty string");
  }

  return input;
}

export class SourceDocument {
  private constructor(
    public readonly id: DocumentId,
    public readonly packageRef: PackageRef,
    public readonly kind: SourceDocumentKind,
    public readonly relativePath: string,
    public readonly contentHash: string,
    public readonly byteSize: number,
    public readonly parserVersion: string,
  ) {}

  public static create(input: SourceDocumentInput): SourceDocument {
    if (!(input.id instanceof DocumentId)) {
      invalid("id", "must be a DocumentId");
    }

    if (!(input.packageRef instanceof PackageRef)) {
      invalid("packageRef", "must be a PackageRef");
    }

    return new SourceDocument(
      input.id,
      input.packageRef,
      readKind(input.kind),
      readRelativePath(input.relativePath),
      readContentHash(input.contentHash),
      readByteSize(input.byteSize),
      readParserVersion(input.parserVersion),
    );
  }
}
