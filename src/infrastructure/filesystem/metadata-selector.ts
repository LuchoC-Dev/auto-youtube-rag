import type {
  ContextDocumentSnapshot,
  RulesDocumentSnapshot,
  SelectedMetadataSnapshot,
} from "../../application/indexing/package-snapshots.js";
import type { VideoId } from "../../domain/indexing/identifiers.js";

export type MetadataSelectionErrorCode =
  | "METADATA_SCHEMA_INVALID"
  | "METADATA_VIDEO_ID_MISMATCH"
  | "METADATA_EVIDENCE_PATH_INVALID";

export interface MetadataSelectionContext {
  readonly expectedVideoId: VideoId;
  readonly sourceLanguage: string | null;
  readonly contextLanguage: string | null;
  readonly context: ContextDocumentSnapshot | null;
  readonly rules: RulesDocumentSnapshot | null;
  readonly sourcePath?: string;
}

export class MetadataSelectionError extends Error {
  public constructor(
    public readonly code: MetadataSelectionErrorCode,
    public readonly sourcePath: string,
    public readonly field: string,
    message: string,
  ) {
    super(message);
    this.name = "MetadataSelectionError";
  }
}

function selectionError(
  code: MetadataSelectionErrorCode,
  sourcePath: string,
  field: string,
  message: string,
): never {
  throw new MetadataSelectionError(code, sourcePath, field, message);
}

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

function readOptionalText(
  input: unknown,
  sourcePath: string,
  field: string,
): string | null {
  if (input === undefined || input === null) {
    return null;
  }

  if (
    typeof input !== "string" ||
    input.trim().length === 0 ||
    input !== input.trim() ||
    input.includes("\0")
  ) {
    return selectionError(
      "METADATA_SCHEMA_INVALID",
      sourcePath,
      field,
      `${field} must be null or non-empty canonical text`,
    );
  }

  return input;
}

function readOptionalTextList(
  input: unknown,
  sourcePath: string,
  field: string,
): readonly string[] {
  if (input === undefined || input === null) {
    return Object.freeze([]);
  }

  if (!Array.isArray(input)) {
    return selectionError(
      "METADATA_SCHEMA_INVALID",
      sourcePath,
      field,
      `${field} must be an array`,
    );
  }

  return Object.freeze(
    input.map((item, index) => {
      const value = readOptionalText(
        item,
        sourcePath,
        `${field}[${String(index)}]`,
      );

      if (value === null) {
        return selectionError(
          "METADATA_SCHEMA_INVALID",
          sourcePath,
          `${field}[${String(index)}]`,
          `${field} must contain only strings`,
        );
      }

      return value;
    }),
  );
}

function readDuration(input: unknown, sourcePath: string): number | null {
  if (input === undefined || input === null) {
    return null;
  }

  if (typeof input !== "number" || !Number.isFinite(input) || input < 0) {
    return selectionError(
      "METADATA_SCHEMA_INVALID",
      sourcePath,
      "duration",
      "duration must be null or a finite non-negative number",
    );
  }

  return input;
}

function readPublishedAt(input: unknown, sourcePath: string): string | null {
  const uploadDate = readOptionalText(input, sourcePath, "upload_date");

  if (uploadDate === null) {
    return null;
  }

  const match = /^(\d{4})(\d{2})(\d{2})$/u.exec(uploadDate);

  if (match === null) {
    return selectionError(
      "METADATA_SCHEMA_INVALID",
      sourcePath,
      "upload_date",
      "upload_date must use YYYYMMDD",
    );
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return selectionError(
      "METADATA_SCHEMA_INVALID",
      sourcePath,
      "upload_date",
      "upload_date must identify a real calendar date",
    );
  }

  return date.toISOString();
}

function readCanonicalUrl(input: unknown, sourcePath: string): string | null {
  const value = readOptionalText(input, sourcePath, "webpage_url");

  if (value === null) {
    return null;
  }

  let url: URL;

  try {
    url = new URL(value);
  } catch {
    return selectionError(
      "METADATA_SCHEMA_INVALID",
      sourcePath,
      "webpage_url",
      "webpage_url must be an absolute HTTP(S) URL",
    );
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return selectionError(
      "METADATA_SCHEMA_INVALID",
      sourcePath,
      "webpage_url",
      "webpage_url must be an absolute HTTP(S) URL",
    );
  }

  return value;
}

function frontmatterText(
  context: ContextDocumentSnapshot | null,
  key: string,
  sourcePath: string,
): string | null {
  const value = context?.frontmatter[key];

  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    return selectionError(
      "METADATA_SCHEMA_INVALID",
      sourcePath,
      `context.frontmatter.${key}`,
      `context.frontmatter.${key} must be text`,
    );
  }

  return value;
}

function relativeEvidencePath(
  input: string,
  sourcePath: string,
  field: string,
): string {
  const normalized = input.replaceAll("\\", "/");

  if (
    normalized.startsWith("/") ||
    /^[A-Za-z]:\//u.test(normalized) ||
    /^[A-Za-z][A-Za-z0-9+.-]*:/u.test(normalized) ||
    normalized.split("/").some((segment) => segment === ".." || segment === "")
  ) {
    return selectionError(
      "METADATA_EVIDENCE_PATH_INVALID",
      sourcePath,
      field,
      `${field} must be relative to the package`,
    );
  }

  return normalized;
}

export function selectMetadata(
  input: unknown,
  selection: MetadataSelectionContext,
): SelectedMetadataSnapshot {
  const sourcePath = selection.sourcePath ?? "<memory>";

  if (!isRecord(input)) {
    return selectionError(
      "METADATA_SCHEMA_INVALID",
      sourcePath,
      "$",
      "metadata root must be an object",
    );
  }

  const actualVideoId = readOptionalText(input.id, sourcePath, "id");

  if (actualVideoId !== selection.expectedVideoId.value) {
    return selectionError(
      "METADATA_VIDEO_ID_MISMATCH",
      sourcePath,
      "id",
      `id must match ${selection.expectedVideoId.value}`,
    );
  }

  const uploader = readOptionalText(input.uploader, sourcePath, "uploader");
  const channel = readOptionalText(input.channel, sourcePath, "channel");
  const creator = readOptionalText(input.creator, sourcePath, "creator");
  const rawLanguage = readOptionalText(input.language, sourcePath, "language");
  const sourceLanguage =
    selection.sourceLanguage ??
    rawLanguage ??
    frontmatterText(selection.context, "source_language", sourcePath);
  const contextLanguage =
    selection.contextLanguage ??
    frontmatterText(selection.context, "context_language", sourcePath);
  const visualEvidence = selection.rules?.evidence.visualEvidence ?? [];

  return Object.freeze({
    kind: "metadata",
    videoId: selection.expectedVideoId,
    title: readOptionalText(input.title, sourcePath, "title"),
    creator: uploader ?? channel ?? creator,
    canonicalUrl: readCanonicalUrl(input.webpage_url, sourcePath),
    durationSeconds: readDuration(input.duration, sourcePath),
    publishedAt: readPublishedAt(input.upload_date, sourcePath),
    sourceLanguage,
    contextLanguage,
    tags: readOptionalTextList(input.tags, sourcePath, "tags"),
    categories: readOptionalTextList(
      input.categories,
      sourcePath,
      "categories",
    ),
    visualProfile: frontmatterText(
      selection.context,
      "visual_profile",
      sourcePath,
    ),
    visualCoverage: selection.rules?.evidence.frameSampling ?? null,
    limitations: Object.freeze([
      ...(selection.rules?.evidence.limitations ?? []),
    ]),
    visualEvidence: Object.freeze(
      visualEvidence.map((path, index) =>
        relativeEvidencePath(
          path,
          sourcePath,
          `rules.evidence.visualEvidence[${String(index)}]`,
        ),
      ),
    ),
  });
}
