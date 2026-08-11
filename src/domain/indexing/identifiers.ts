import { DomainValidationError } from "./domain-error.js";

const sourceNamePattern = /^[A-Za-z0-9](?:[A-Za-z0-9._-]*[A-Za-z0-9])?$/;
const videoIdPattern = /^[A-Za-z0-9_-]+$/;
const identifierSegment = "[A-Za-z0-9](?:[A-Za-z0-9._-]*[A-Za-z0-9])?";

abstract class StringIdentifier<
  TIdentifier extends StringIdentifier<TIdentifier>,
> {
  protected constructor(public readonly value: string) {}

  public equals(other: TIdentifier): boolean {
    return this.constructor === other.constructor && this.value === other.value;
  }

  public toJSON(): string {
    return this.value;
  }

  public toString(): string {
    return this.value;
  }
}

function invalidIdentifier(field: string, expectation: string): never {
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
    /\s/u.test(input)
  ) {
    invalidIdentifier(field, "must be a non-empty string without whitespace");
  }

  return input;
}

function validateSourceName(input: unknown): string {
  const value = readCompactString(input, "sourceName");

  if (!sourceNamePattern.test(value)) {
    invalidIdentifier(
      "sourceName",
      "must contain only letters, numbers, dots, underscores or hyphens and must start and end with a letter or number",
    );
  }

  return value;
}

function validateVideoId(input: unknown): string {
  const value = readCompactString(input, "videoId");

  if (!videoIdPattern.test(value)) {
    invalidIdentifier(
      "videoId",
      "must contain only letters, numbers, underscores or hyphens",
    );
  }

  return value;
}

function validateNamespacedId(
  input: unknown,
  field: string,
  namespace: string,
): string {
  const value = readCompactString(input, field);
  const pattern = new RegExp(
    `^${namespace}:${identifierSegment}(?::${identifierSegment})*$`,
  );

  if (!pattern.test(value)) {
    invalidIdentifier(
      field,
      `must use the ${namespace}: namespace with non-empty safe segments`,
    );
  }

  return value;
}

export class SourceName extends StringIdentifier<SourceName> {
  private constructor(value: string) {
    super(value);
  }

  public static create(input: unknown): SourceName {
    return new SourceName(validateSourceName(input));
  }
}

export class VideoId extends StringIdentifier<VideoId> {
  private constructor(value: string) {
    super(value);
  }

  public static create(input: unknown): VideoId {
    return new VideoId(validateVideoId(input));
  }
}

export class DocumentId extends StringIdentifier<DocumentId> {
  private constructor(value: string) {
    super(value);
  }

  public static create(input: unknown): DocumentId {
    return new DocumentId(
      validateNamespacedId(input, "documentId", "document"),
    );
  }
}

export class KnowledgeUnitId extends StringIdentifier<KnowledgeUnitId> {
  private constructor(value: string) {
    super(value);
  }

  public static create(input: unknown): KnowledgeUnitId {
    return new KnowledgeUnitId(
      validateNamespacedId(input, "knowledgeUnitId", "unit"),
    );
  }
}

export class SearchFragmentId extends StringIdentifier<SearchFragmentId> {
  private constructor(value: string) {
    super(value);
  }

  public static create(input: unknown): SearchFragmentId {
    return new SearchFragmentId(
      validateNamespacedId(input, "searchFragmentId", "fragment"),
    );
  }
}

export class SyncId extends StringIdentifier<SyncId> {
  private constructor(value: string) {
    super(value);
  }

  public static create(input: unknown): SyncId {
    return new SyncId(validateNamespacedId(input, "syncId", "sync"));
  }
}

export class PackageRef {
  private constructor(
    public readonly sourceName: SourceName,
    public readonly videoId: VideoId,
  ) {}

  public static create(sourceName: SourceName, videoId: VideoId): PackageRef {
    return new PackageRef(sourceName, videoId);
  }

  public static parse(input: unknown): PackageRef {
    if (typeof input !== "string") {
      return PackageRef.invalid();
    }

    const parts = input.split(":");

    if (parts.length !== 2) {
      return PackageRef.invalid();
    }

    try {
      return PackageRef.create(
        SourceName.create(parts[0]),
        VideoId.create(parts[1]),
      );
    } catch (error: unknown) {
      if (error instanceof DomainValidationError) {
        return PackageRef.invalid();
      }

      throw error;
    }
  }

  private static invalid(): never {
    throw new DomainValidationError(
      "INVALID_PACKAGE_REF",
      "packageRef",
      "packageRef must use the unambiguous sourceName:videoId format",
    );
  }

  public equals(other: PackageRef): boolean {
    return (
      this.sourceName.equals(other.sourceName) &&
      this.videoId.equals(other.videoId)
    );
  }

  public serialize(): string {
    return `${this.sourceName.value}:${this.videoId.value}`;
  }

  public toJSON(): string {
    return this.serialize();
  }

  public toString(): string {
    return this.serialize();
  }
}
