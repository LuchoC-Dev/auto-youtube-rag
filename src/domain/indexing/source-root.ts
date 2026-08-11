import { DomainValidationError } from "./domain-error.js";
import { SourceName } from "./identifiers.js";

export interface SourceRootInput {
  readonly name: SourceName;
  readonly collectionPath: string;
  readonly manifestPath: string;
  readonly videosPath: string;
  readonly enabled: boolean;
}

function readCanonicalPath(input: unknown, field: string): string {
  if (
    typeof input !== "string" ||
    input.length === 0 ||
    input !== input.trim() ||
    input.includes("\0")
  ) {
    throw new DomainValidationError(
      "INVALID_IDENTIFIER",
      field,
      `${field} must be a non-empty canonical path without surrounding whitespace or null bytes`,
    );
  }

  return input;
}

export class SourceRoot {
  private constructor(
    public readonly name: SourceName,
    public readonly collectionPath: string,
    public readonly manifestPath: string,
    public readonly videosPath: string,
    public readonly enabled: boolean,
  ) {}

  public static create(input: SourceRootInput): SourceRoot {
    if (!(input.name instanceof SourceName)) {
      throw new DomainValidationError(
        "INVALID_IDENTIFIER",
        "name",
        "name must be a SourceName",
      );
    }

    if (typeof input.enabled !== "boolean") {
      throw new DomainValidationError(
        "INVALID_IDENTIFIER",
        "enabled",
        "enabled must be a boolean",
      );
    }

    const collectionPath = readCanonicalPath(
      input.collectionPath,
      "collectionPath",
    );
    const manifestPath = readCanonicalPath(input.manifestPath, "manifestPath");
    const videosPath = readCanonicalPath(input.videosPath, "videosPath");

    if (
      collectionPath === manifestPath ||
      collectionPath === videosPath ||
      manifestPath === videosPath
    ) {
      throw new DomainValidationError(
        "INVALID_IDENTIFIER",
        "sourcePaths",
        "collectionPath, manifestPath and videosPath must identify distinct locations",
      );
    }

    return new SourceRoot(
      input.name,
      collectionPath,
      manifestPath,
      videosPath,
      input.enabled,
    );
  }
}
