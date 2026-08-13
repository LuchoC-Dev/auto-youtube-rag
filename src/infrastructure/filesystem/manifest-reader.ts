import { readFile } from "node:fs/promises";

import type {
  ManifestResourceSnapshot,
  ManifestSnapshot,
  ManifestVideoIssue,
  ManifestVideoSnapshot,
} from "../../application/indexing/package-snapshots.js";
import { sha256 } from "../../domain/indexing/content-identity.js";
import { DomainValidationError } from "../../domain/indexing/domain-error.js";
import {
  PackageRef,
  SourceName,
  VideoId,
} from "../../domain/indexing/identifiers.js";
import type { SourceRoot } from "../../domain/indexing/source-root.js";

export type ManifestReadErrorCode =
  | "MANIFEST_READ_FAILED"
  | "MANIFEST_JSON_INVALID"
  | "MANIFEST_SCHEMA_INVALID"
  | "MANIFEST_DUPLICATE";

export interface ManifestParseContext {
  readonly sourceName: SourceName;
  readonly manifestPath: string;
  readonly contentHash: string;
}

export class ManifestReadError extends Error {
  public constructor(
    public readonly code: ManifestReadErrorCode,
    public readonly manifestPath: string,
    public readonly field: string,
    message: string,
  ) {
    super(message);
    this.name = "ManifestReadError";
  }
}

const slugPattern =
  /^[\p{L}\p{N}](?:[\p{L}\p{N}\p{M}._-]*[\p{L}\p{N}\p{M}])?$/u;

function manifestError(
  code: ManifestReadErrorCode,
  context: Pick<ManifestParseContext, "manifestPath">,
  field: string,
  message: string,
): never {
  throw new ManifestReadError(code, context.manifestPath, field, message);
}

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

function readVideoId(
  input: unknown,
  context: ManifestParseContext,
  field: string,
): VideoId {
  try {
    return VideoId.create(input);
  } catch (error: unknown) {
    if (error instanceof DomainValidationError) {
      manifestError(
        "MANIFEST_SCHEMA_INVALID",
        context,
        field,
        `${field} must be a valid video id`,
      );
    }

    throw error;
  }
}

/**
 * Best-effort identification for a manifest entry that failed validation
 * elsewhere, used only to attribute a `ManifestVideoIssue` to a video.
 * Returns `null` instead of throwing when `video_id` itself is what is
 * missing or malformed — there is nothing safe to attribute the issue to.
 */
function tryReadVideoId(input: unknown): VideoId | null {
  if (!isRecord(input)) {
    return null;
  }

  try {
    return VideoId.create(input.video_id);
  } catch {
    return null;
  }
}

function readSlug(
  input: unknown,
  context: ManifestParseContext,
  field: string,
): string {
  if (typeof input !== "string" || !slugPattern.test(input)) {
    manifestError(
      "MANIFEST_SCHEMA_INVALID",
      context,
      field,
      `${field} must be a safe package slug`,
    );
  }

  return input;
}

function readOptionalText(
  input: unknown,
  context: ManifestParseContext,
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
    manifestError(
      "MANIFEST_SCHEMA_INVALID",
      context,
      field,
      `${field} must be null or non-empty canonical text`,
    );
  }

  return input;
}

function readResource(
  resources: Record<string, unknown>,
  key: keyof ManifestResourceSnapshot,
  context: ManifestParseContext,
  field: string,
): boolean {
  const value = resources[key];

  if (typeof value !== "boolean") {
    manifestError(
      "MANIFEST_SCHEMA_INVALID",
      context,
      `${field}.${key}`,
      `${field}.${key} must be a boolean`,
    );
  }

  return value;
}

function readResources(
  input: unknown,
  context: ManifestParseContext,
  field: string,
): ManifestResourceSnapshot {
  if (!isRecord(input)) {
    manifestError(
      "MANIFEST_SCHEMA_INVALID",
      context,
      field,
      `${field} must be an object`,
    );
  }

  return Object.freeze({
    context: readResource(input, "context", context, field),
    rules: readResource(input, "rules", context, field),
    metadata: readResource(input, "metadata", context, field),
  });
}

function readVideo(
  input: unknown,
  index: number,
  context: ManifestParseContext,
): ManifestVideoSnapshot {
  const field = `videos[${String(index)}]`;

  if (!isRecord(input)) {
    manifestError(
      "MANIFEST_SCHEMA_INVALID",
      context,
      field,
      `${field} must be an object`,
    );
  }

  const videoId = readVideoId(input.video_id, context, `${field}.video_id`);

  return Object.freeze({
    ref: PackageRef.create(context.sourceName, videoId),
    slug: readSlug(input.slug, context, `${field}.slug`),
    sourceLanguage: readOptionalText(
      input.source_language,
      context,
      `${field}.source_language`,
    ),
    contextLanguage: readOptionalText(
      input.dossier_language,
      context,
      `${field}.dossier_language`,
    ),
    stage: readOptionalText(input.stage, context, `${field}.stage`),
    resources: readResources(input.resources, context, `${field}.resources`),
  });
}

/**
 * Parses a manifest, tolerating per-video problems: a malformed or
 * duplicated entry is skipped and reported as a `ManifestVideoIssue` instead
 * of aborting the whole manifest. Only structural failures with no
 * per-video meaning — the root not being an object, `videos` not being an
 * array, unreadable or malformed JSON (see `readManifest`) — remain fatal,
 * because there is no video list left to salvage.
 *
 * This exists so a single video generated under a different package schema
 * (see `docs/decisions.md`, "manifest schema drift") can never block sync
 * for the rest of a source, which was the amplifying failure mode found
 * during 3.2's real-collection evaluation.
 */
export function parseManifest(
  input: unknown,
  context: ManifestParseContext,
): ManifestSnapshot {
  if (!isRecord(input)) {
    manifestError(
      "MANIFEST_SCHEMA_INVALID",
      context,
      "$",
      "manifest root must be an object",
    );
  }

  if (!Array.isArray(input.videos)) {
    manifestError(
      "MANIFEST_SCHEMA_INVALID",
      context,
      "videos",
      "videos must be an array",
    );
  }

  const seenVideoIds = new Set<string>();
  const seenSlugs = new Set<string>();
  const videos: ManifestVideoSnapshot[] = [];
  const issues: ManifestVideoIssue[] = [];

  input.videos.forEach((video, index) => {
    let snapshot: ManifestVideoSnapshot;

    try {
      snapshot = readVideo(video, index, context);
    } catch (error: unknown) {
      if (error instanceof ManifestReadError) {
        issues.push({
          index,
          videoId: tryReadVideoId(video),
          field: error.field,
          code: "SCHEMA_INVALID",
          message: error.message,
        });
        return;
      }

      throw error;
    }

    const videoId = snapshot.ref.videoId.value;

    if (seenVideoIds.has(videoId)) {
      issues.push({
        index,
        videoId: snapshot.ref.videoId,
        field: `videos[${String(index)}].video_id`,
        code: "DUPLICATE",
        message: `video id is duplicated: ${videoId}`,
      });
      return;
    }

    if (seenSlugs.has(snapshot.slug)) {
      issues.push({
        index,
        videoId: snapshot.ref.videoId,
        field: `videos[${String(index)}].slug`,
        code: "DUPLICATE",
        message: `slug is duplicated: ${snapshot.slug}`,
      });
      return;
    }

    seenVideoIds.add(videoId);
    seenSlugs.add(snapshot.slug);
    videos.push(snapshot);
  });

  return Object.freeze({
    kind: "manifest",
    sourceName: context.sourceName,
    contentHash: context.contentHash,
    videos: Object.freeze(videos),
    issues: Object.freeze(issues),
  });
}

export async function readManifest(
  source: SourceRoot,
): Promise<ManifestSnapshot> {
  let rawManifest: string;

  try {
    rawManifest = await readFile(source.manifestPath, "utf8");
  } catch {
    manifestError(
      "MANIFEST_READ_FAILED",
      { manifestPath: source.manifestPath },
      "$",
      `manifest could not be read: ${source.manifestPath}`,
    );
  }

  let parsedManifest: unknown;

  try {
    parsedManifest = JSON.parse(rawManifest) as unknown;
  } catch {
    manifestError(
      "MANIFEST_JSON_INVALID",
      { manifestPath: source.manifestPath },
      "$",
      `manifest is not valid JSON: ${source.manifestPath}`,
    );
  }

  return parseManifest(parsedManifest, {
    sourceName: source.name,
    manifestPath: source.manifestPath,
    contentHash: sha256(rawManifest),
  });
}
