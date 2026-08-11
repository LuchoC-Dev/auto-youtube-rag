import { DomainValidationError } from "./domain-error.js";
import { PackageRef } from "./identifiers.js";

const slugPattern =
  /^[\p{L}\p{N}](?:[\p{L}\p{N}\p{M}._-]*[\p{L}\p{N}\p{M}])?$/u;

export interface VideoPackageInput {
  readonly ref: PackageRef;
  readonly slug: string;
  readonly relativePath: string;
  readonly manifestStage?: string | null;
  readonly title?: string | null;
  readonly creator?: string | null;
  readonly canonicalUrl?: string | null;
  readonly durationSeconds?: number | null;
  readonly publishedAt?: string | null;
  readonly sourceLanguage?: string | null;
  readonly contextLanguage?: string | null;
  readonly tags?: readonly string[];
  readonly categories?: readonly string[];
  readonly visualProfile?: string | null;
}

function invalid(field: string, expectation: string): never {
  throw new DomainValidationError(
    "INVALID_IDENTIFIER",
    field,
    `${field} ${expectation}`,
  );
}

function readSlug(input: unknown): string {
  if (typeof input !== "string" || !slugPattern.test(input)) {
    invalid("slug", "must be a safe package directory name");
  }

  return input;
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

function readOptionalText(
  input: string | null | undefined,
  field: string,
): string | null {
  if (input === undefined || input === null) {
    return null;
  }

  if (input.length === 0 || input !== input.trim() || input.includes("\0")) {
    invalid(field, "must be non-empty and canonical when provided");
  }

  return input;
}

function readDuration(input: number | null | undefined): number | null {
  if (input === undefined || input === null) {
    return null;
  }

  if (!Number.isFinite(input) || input < 0) {
    invalid("durationSeconds", "must be a finite non-negative number");
  }

  return input;
}

function copyTextList(
  input: readonly string[] | undefined,
  field: string,
): readonly string[] {
  if (input === undefined) {
    return Object.freeze([]);
  }

  for (const item of input) {
    if (item.length === 0 || item !== item.trim() || item.includes("\0")) {
      invalid(field, "must contain only non-empty canonical strings");
    }
  }

  return Object.freeze([...input]);
}

export class VideoPackage {
  private constructor(
    public readonly ref: PackageRef,
    public readonly slug: string,
    public readonly relativePath: string,
    public readonly manifestStage: string | null,
    public readonly title: string | null,
    public readonly creator: string | null,
    public readonly canonicalUrl: string | null,
    public readonly durationSeconds: number | null,
    public readonly publishedAt: string | null,
    public readonly sourceLanguage: string | null,
    public readonly contextLanguage: string | null,
    public readonly tags: readonly string[],
    public readonly categories: readonly string[],
    public readonly visualProfile: string | null,
  ) {}

  public static create(input: VideoPackageInput): VideoPackage {
    if (!(input.ref instanceof PackageRef)) {
      invalid("ref", "must be a PackageRef");
    }

    return new VideoPackage(
      input.ref,
      readSlug(input.slug),
      readRelativePath(input.relativePath),
      readOptionalText(input.manifestStage, "manifestStage"),
      readOptionalText(input.title, "title"),
      readOptionalText(input.creator, "creator"),
      readOptionalText(input.canonicalUrl, "canonicalUrl"),
      readDuration(input.durationSeconds),
      readOptionalText(input.publishedAt, "publishedAt"),
      readOptionalText(input.sourceLanguage, "sourceLanguage"),
      readOptionalText(input.contextLanguage, "contextLanguage"),
      copyTextList(input.tags, "tags"),
      copyTextList(input.categories, "categories"),
      readOptionalText(input.visualProfile, "visualProfile"),
    );
  }
}
