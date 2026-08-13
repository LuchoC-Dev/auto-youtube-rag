import { readFile, realpath } from "node:fs/promises";
import { isAbsolute, join, relative } from "node:path";

import type {
  AnalysisPackageDocumentSnapshot,
  ContextPackageDocumentSnapshot,
  MetadataPackageDocumentSnapshot,
  PackageDocumentSnapshot,
  PackageSnapshot,
  RulesPackageDocumentSnapshot,
} from "../../application/indexing/package-snapshots.js";
import type { PackageSourceReader } from "../../application/ports/package-source-reader.js";
import type { SourceRegistry } from "../../application/ports/source-registry.js";
import { sha256 } from "../../domain/indexing/content-identity.js";
import type { PackageRef } from "../../domain/indexing/identifiers.js";
import type { SourceRoot } from "../../domain/indexing/source-root.js";
import { parseAnalysisJson } from "./analysis-json-parser.js";
import { parseContextMarkdown } from "./context-markdown-parser.js";
import { readManifest as readFilesystemManifest } from "./manifest-reader.js";
import { selectMetadata } from "./metadata-selector.js";
import { parseRulesJson } from "./rules-json-parser.js";

export type FilesystemPackageReadErrorCode =
  | "PACKAGE_SOURCE_NOT_FOUND"
  | "PACKAGE_NOT_LISTED"
  | "PACKAGE_PATH_INVALID"
  | "PACKAGE_DOCUMENT_READ_FAILED"
  | "PACKAGE_DOCUMENT_UTF8_INVALID"
  | "PACKAGE_DOCUMENT_JSON_INVALID";

export class FilesystemPackageReadError extends Error {
  public constructor(
    public readonly code: FilesystemPackageReadErrorCode,
    public readonly field: string,
    public readonly sourcePath: string | null,
    message: string,
  ) {
    super(message);
    this.name = "FilesystemPackageReadError";
  }
}

interface RawDocument {
  readonly bytes: Uint8Array;
  readonly text: string;
}

const decoder = new TextDecoder("utf-8", { fatal: true });

function packageError(
  code: FilesystemPackageReadErrorCode,
  field: string,
  sourcePath: string | null,
  message: string,
): never {
  throw new FilesystemPackageReadError(code, field, sourcePath, message);
}

async function readDocument(
  sourcePath: string,
  relativePath: string,
): Promise<RawDocument> {
  let bytes: Uint8Array;

  try {
    bytes = await readFile(sourcePath);
  } catch {
    return packageError(
      "PACKAGE_DOCUMENT_READ_FAILED",
      relativePath,
      sourcePath,
      `package document could not be read: ${sourcePath}`,
    );
  }

  try {
    return { bytes, text: decoder.decode(bytes) };
  } catch {
    return packageError(
      "PACKAGE_DOCUMENT_UTF8_INVALID",
      relativePath,
      sourcePath,
      `package document is not valid UTF-8: ${sourcePath}`,
    );
  }
}

function parseJson(
  document: RawDocument,
  relativePath: string,
  sourcePath: string,
): unknown {
  try {
    return JSON.parse(document.text) as unknown;
  } catch {
    return packageError(
      "PACKAGE_DOCUMENT_JSON_INVALID",
      relativePath,
      sourcePath,
      `package document is not valid JSON: ${sourcePath}`,
    );
  }
}

function documentIdentity(
  document: RawDocument,
): Pick<ContextPackageDocumentSnapshot, "contentHash" | "byteSize"> {
  return {
    contentHash: sha256(document.bytes),
    byteSize: document.bytes.byteLength,
  };
}

async function resolvePackagePath(
  source: SourceRoot,
  slug: string,
): Promise<string> {
  const candidate = join(source.videosPath, slug);
  let resolved: string;

  try {
    resolved = await realpath(candidate);
  } catch {
    return packageError(
      "PACKAGE_PATH_INVALID",
      "packagePath",
      candidate,
      `package directory does not exist: ${candidate}`,
    );
  }

  const fromVideos = relative(source.videosPath, resolved);

  if (
    fromVideos === "" ||
    fromVideos === ".." ||
    fromVideos.startsWith("..\\") ||
    fromVideos.startsWith("../") ||
    isAbsolute(fromVideos)
  ) {
    return packageError(
      "PACKAGE_PATH_INVALID",
      "packagePath",
      resolved,
      `package directory must stay within the source videos directory`,
    );
  }

  return resolved;
}

export class FilesystemPackageSourceReader implements PackageSourceReader {
  public constructor(private readonly sources: SourceRegistry) {}

  public async readManifest(source: SourceRoot) {
    return readFilesystemManifest(source);
  }

  public async readPackage(ref: PackageRef): Promise<PackageSnapshot> {
    const source = await this.sources.getByName(ref.sourceName);

    if (source === null) {
      return packageError(
        "PACKAGE_SOURCE_NOT_FOUND",
        "sourceName",
        null,
        `source is not registered: ${ref.sourceName.value}`,
      );
    }

    const manifest = await this.readManifest(source);
    const manifestVideo = manifest.videos.find((video) =>
      video.ref.equals(ref),
    );

    if (manifestVideo === undefined) {
      return packageError(
        "PACKAGE_NOT_LISTED",
        "videoId",
        source.manifestPath,
        `video is not listed in the source manifest: ${ref.videoId.value}`,
      );
    }

    const packagePath = await resolvePackagePath(source, manifestVideo.slug);
    const documents: PackageDocumentSnapshot[] = [];
    let contextDocument: ContextPackageDocumentSnapshot | null = null;
    let rulesDocument: RulesPackageDocumentSnapshot | null = null;

    if (manifestVideo.resources.context) {
      const relativePath = "deliverables/context.md";
      const sourcePath = join(packagePath, "deliverables", "context.md");
      const raw = await readDocument(sourcePath, relativePath);
      contextDocument = Object.freeze({
        kind: "context",
        relativePath,
        ...documentIdentity(raw),
        parserVersion: "context-v1",
        content: parseContextMarkdown(raw.text, sourcePath),
      });
      documents.push(contextDocument);
    }

    switch (manifestVideo.resources.structuredContent) {
      case "rules": {
        const relativePath = "deliverables/rules.json";
        const sourcePath = join(packagePath, "deliverables", "rules.json");
        const raw = await readDocument(sourcePath, relativePath);
        rulesDocument = Object.freeze({
          kind: "rules",
          relativePath,
          ...documentIdentity(raw),
          parserVersion: "rules-v1",
          content: parseRulesJson(
            parseJson(raw, relativePath, sourcePath),
            ref.videoId,
            sourcePath,
          ),
        });
        documents.push(rulesDocument);
        break;
      }
      case "analysis": {
        const relativePath = "deliverables/analysis.json";
        const sourcePath = join(packagePath, "deliverables", "analysis.json");
        const raw = await readDocument(sourcePath, relativePath);
        const analysisDocument: AnalysisPackageDocumentSnapshot = Object.freeze(
          {
            kind: "analysis",
            relativePath,
            ...documentIdentity(raw),
            parserVersion: "analysis-v1",
            content: parseAnalysisJson(
              parseJson(raw, relativePath, sourcePath),
              ref.videoId,
              sourcePath,
            ),
          },
        );
        documents.push(analysisDocument);
        break;
      }
      case "none":
        break;
    }

    if (manifestVideo.resources.metadata) {
      const relativePath = "source/metadata.json";
      const sourcePath = join(packagePath, "source", "metadata.json");
      const raw = await readDocument(sourcePath, relativePath);
      const metadataDocument: MetadataPackageDocumentSnapshot = Object.freeze({
        kind: "metadata",
        relativePath,
        ...documentIdentity(raw),
        parserVersion: "metadata-v1",
        content: selectMetadata(parseJson(raw, relativePath, sourcePath), {
          expectedVideoId: ref.videoId,
          sourceLanguage: manifestVideo.sourceLanguage,
          contextLanguage: manifestVideo.contextLanguage,
          context: contextDocument?.content ?? null,
          rules: rulesDocument?.content ?? null,
          sourcePath,
        }),
      });
      documents.push(metadataDocument);
    }

    return Object.freeze({
      kind: "video_package",
      ref,
      slug: manifestVideo.slug,
      relativePath: `videos/${manifestVideo.slug}`,
      manifestStage: manifestVideo.stage,
      documents: Object.freeze(documents),
    });
  }
}
