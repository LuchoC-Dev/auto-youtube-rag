import { DomainValidationError } from "../indexing/domain-error.js";
import { SourceName, VideoId } from "../indexing/identifiers.js";
import {
  type KnowledgeUnitType,
  knowledgeUnitTypes,
} from "../indexing/knowledge-unit.js";

const languageTagPattern = /^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/u;

export interface RetrievalFilterInput {
  readonly sources?: unknown;
  readonly videoIds?: unknown;
  readonly languages?: unknown;
  readonly unitTypes?: unknown;
}

function invalid(field: string, expectation: string): never {
  throw new DomainValidationError(
    "INVALID_RETRIEVAL_QUERY",
    field,
    `${field} ${expectation}`,
  );
}

function readList(input: unknown, field: string): readonly unknown[] {
  if (input === undefined) {
    return [];
  }

  if (!Array.isArray(input)) {
    invalid(field, "must be an array when present");
  }

  return input;
}

/**
 * Keeps the first occurrence of every criterion so that an accidental
 * repetition never changes the resulting SQL or the reported filter.
 */
function deduplicate<TValue>(
  values: readonly TValue[],
  keyOf: (value: TValue) => string,
): readonly TValue[] {
  const seen = new Set<string>();
  const unique: TValue[] = [];

  for (const value of values) {
    const key = keyOf(value);

    if (!seen.has(key)) {
      seen.add(key);
      unique.push(value);
    }
  }

  return Object.freeze(unique);
}

function readIdentifiers<TIdentifier extends SourceName | VideoId>(
  input: unknown,
  field: string,
  typeName: string,
  isIdentifier: (value: unknown) => value is TIdentifier,
): readonly TIdentifier[] {
  const values = readList(input, field);

  if (!values.every(isIdentifier)) {
    invalid(field, `must contain only ${typeName} instances`);
  }

  return deduplicate(values, (value) => value.value);
}

function isSourceName(value: unknown): value is SourceName {
  return value instanceof SourceName;
}

function isVideoId(value: unknown): value is VideoId {
  return value instanceof VideoId;
}

/**
 * Language tags are compared case-insensitively because the indexed packages
 * declare them inconsistently, so `ES` and `es` must select the same rows.
 */
function readLanguages(input: unknown): readonly string[] {
  const values = readList(input, "languages");
  const normalized: string[] = [];

  for (const value of values) {
    if (typeof value !== "string") {
      invalid("languages", "must contain only text language tags");
    }

    const tag = value.trim().toLowerCase();

    if (!languageTagPattern.test(tag)) {
      invalid("languages", "must contain only BCP 47 style language tags");
    }

    normalized.push(tag);
  }

  return deduplicate(normalized, (tag) => tag);
}

function readUnitTypes(input: unknown): readonly KnowledgeUnitType[] {
  const values = readList(input, "unitTypes");

  if (
    !values.every((value): value is KnowledgeUnitType =>
      knowledgeUnitTypes.some((unitType) => unitType === value),
    )
  ) {
    invalid("unitTypes", "must contain only approved knowledge unit types");
  }

  return deduplicate(values, (unitType) => unitType);
}

export class RetrievalFilter {
  private constructor(
    public readonly sources: readonly SourceName[],
    public readonly videoIds: readonly VideoId[],
    public readonly languages: readonly string[],
    public readonly unitTypes: readonly KnowledgeUnitType[],
  ) {}

  public static empty(): RetrievalFilter {
    return RetrievalFilter.create({});
  }

  public static create(input: RetrievalFilterInput): RetrievalFilter {
    return new RetrievalFilter(
      readIdentifiers(input.sources, "sources", "SourceName", isSourceName),
      readIdentifiers(input.videoIds, "videoIds", "VideoId", isVideoId),
      readLanguages(input.languages),
      readUnitTypes(input.unitTypes),
    );
  }

  /** An unrestricted filter selects every indexed fragment. */
  public get isUnrestricted(): boolean {
    return (
      this.sources.length === 0 &&
      this.videoIds.length === 0 &&
      this.languages.length === 0 &&
      this.unitTypes.length === 0
    );
  }
}
