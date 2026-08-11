import type { EmbeddingGenerator } from "../ports/embedding-generator.js";
import type { IndexStore } from "../ports/index-store.js";
import type { PackageSourceReader } from "../ports/package-source-reader.js";
import type { VectorIndexSink } from "../ports/vector-index-sink.js";
import { sha256 } from "../../domain/indexing/content-identity.js";
import { EmbeddingRecord } from "../../domain/indexing/embedding-record.js";
import { DocumentId, SyncId } from "../../domain/indexing/identifiers.js";
import { SourceDocument } from "../../domain/indexing/source-document.js";
import type { SourceRoot } from "../../domain/indexing/source-root.js";
import {
  SyncIssue,
  SyncRun,
  type SyncCounters,
} from "../../domain/indexing/sync-run.js";
import { VideoPackage } from "../../domain/indexing/video-package.js";
import { buildKnowledgeUnits } from "./build-knowledge-units.js";
import { fragmentKnowledgeUnits } from "./fragment-knowledge-units.js";
import type { PackageSnapshot } from "./package-snapshots.js";

export interface SyncSourceDependencies {
  readonly reader: PackageSourceReader;
  readonly store: IndexStore;
  readonly embeddingGenerator: EmbeddingGenerator;
  readonly vectorIndex: VectorIndexSink;
  readonly createSyncId?: () => SyncId;
  readonly now?: () => Date;
}

export interface SyncSourceResult {
  readonly syncId: SyncId;
  readonly sourceName: string;
  readonly status: "ok" | "no_changes" | "partial" | "failed";
  readonly counters: SyncCounters;
  readonly issues: readonly SyncIssue[];
}

function defaultSyncId(): SyncId {
  const value = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return SyncId.create(`sync:${value}`);
}

function packageHash(snapshot: PackageSnapshot): string {
  return sha256(
    JSON.stringify({
      slug: snapshot.slug,
      relativePath: snapshot.relativePath,
      manifestStage: snapshot.manifestStage,
      documents: snapshot.documents.map((document) => ({
        kind: document.kind,
        relativePath: document.relativePath,
        contentHash: document.contentHash,
        parserVersion: document.parserVersion,
      })),
    }),
  );
}

function sourceDocuments(snapshot: PackageSnapshot): readonly SourceDocument[] {
  return snapshot.documents.map((document) =>
    SourceDocument.create({
      id: DocumentId.create(
        `document:${snapshot.ref.sourceName.value}:${snapshot.ref.videoId.value}:${document.kind}`,
      ),
      packageRef: snapshot.ref,
      kind: document.kind,
      relativePath: document.relativePath,
      contentHash: document.contentHash,
      byteSize: document.byteSize,
      parserVersion: document.parserVersion,
    }),
  );
}

function videoPackage(snapshot: PackageSnapshot): VideoPackage {
  const metadata = snapshot.documents.find(
    (document) => document.kind === "metadata",
  )?.content;
  return VideoPackage.create({
    ref: snapshot.ref,
    slug: snapshot.slug,
    relativePath: snapshot.relativePath,
    manifestStage: snapshot.manifestStage,
    title: metadata?.kind === "metadata" ? metadata.title : null,
    creator: metadata?.kind === "metadata" ? metadata.creator : null,
    canonicalUrl: metadata?.kind === "metadata" ? metadata.canonicalUrl : null,
    durationSeconds:
      metadata?.kind === "metadata" ? metadata.durationSeconds : null,
    publishedAt: metadata?.kind === "metadata" ? metadata.publishedAt : null,
    sourceLanguage:
      metadata?.kind === "metadata" ? metadata.sourceLanguage : null,
    contextLanguage:
      metadata?.kind === "metadata" ? metadata.contextLanguage : null,
    tags: metadata?.kind === "metadata" ? metadata.tags : [],
    categories: metadata?.kind === "metadata" ? metadata.categories : [],
    visualProfile:
      metadata?.kind === "metadata" ? metadata.visualProfile : null,
  });
}

function unchanged(
  state: Awaited<ReturnType<IndexStore["getPackageState"]>>,
  hash: string,
  snapshot: PackageSnapshot,
  model: Awaited<ReturnType<EmbeddingGenerator["describe"]>>,
): boolean {
  if (state?.packageHash !== hash) return false;
  if (state.documents.length !== snapshot.documents.length) return false;
  const documentsMatch = snapshot.documents.every((document) =>
    state.documents.some(
      (current) =>
        current.kind === document.kind &&
        current.contentHash === document.contentHash &&
        current.parserVersion === document.parserVersion,
    ),
  );
  return (
    documentsMatch &&
    state.embeddingModels.some(
      (current) =>
        current.key === model.key &&
        current.version === model.version &&
        current.dimensions === model.dimensions,
    )
  );
}

function issueFrom(
  error: unknown,
  syncId: SyncId,
  videoId: SyncIssue["videoId"],
): SyncIssue {
  const rawCode =
    error instanceof Error && "code" in error && typeof error.code === "string"
      ? error.code
      : "PACKAGE_INVALID";
  const code = /^[A-Z][A-Z0-9_]*$/u.test(rawCode) ? rawCode : "PACKAGE_INVALID";
  const rawMessage =
    error instanceof Error ? error.message : "Package processing failed.";
  const message =
    rawMessage.replaceAll("\0", "").trim() || "Package processing failed.";
  return SyncIssue.create({
    syncId,
    videoId,
    relativePath: null,
    code,
    message,
    retryable: false,
  });
}

export async function syncSource(
  dependencies: SyncSourceDependencies,
  source: SourceRoot,
): Promise<SyncSourceResult> {
  const now = dependencies.now ?? (() => new Date());
  const syncId = (dependencies.createSyncId ?? defaultSyncId)();
  const running = SyncRun.start({
    id: syncId,
    sourceName: source.name,
    startedAt: now().toISOString(),
  });
  await dependencies.store.recordRun(running);
  const counters = {
    packagesSeen: 0,
    packagesUnchanged: 0,
    packagesIndexed: 0,
    packagesFailed: 0,
    packagesDeleted: 0,
  };
  const issues: SyncIssue[] = [];

  let manifest;
  try {
    manifest = await dependencies.reader.readManifest(source);
  } catch (error: unknown) {
    const issue = issueFrom(error, syncId, null);
    issues.push(issue);
    await dependencies.store.recordIssue(issue);
    const failed = running.finish({
      status: "failed",
      finishedAt: now().toISOString(),
      counters,
    });
    await dependencies.store.recordRun(failed);
    return {
      syncId,
      sourceName: source.name.value,
      status: "failed",
      counters: failed.counters,
      issues,
    };
  }

  const model = await dependencies.embeddingGenerator.describe();
  const previousRefs = await dependencies.store.listPackageRefs(source.name);
  const manifestRefs = new Set(
    manifest.videos.map((video) => video.ref.serialize()),
  );

  for (const video of manifest.videos) {
    counters.packagesSeen += 1;
    const previous = await dependencies.store.getPackageState(video.ref);
    try {
      const snapshot = await dependencies.reader.readPackage(video.ref);
      const hash = packageHash(snapshot);
      if (unchanged(previous, hash, snapshot, model)) {
        await dependencies.store.markPackageSeen(video.ref, syncId);
        counters.packagesUnchanged += 1;
        continue;
      }

      const units = buildKnowledgeUnits(snapshot);
      const fragments = await fragmentKnowledgeUnits(
        units,
        dependencies.embeddingGenerator,
      );
      const vectors = await dependencies.embeddingGenerator.embedDocuments(
        fragments.map((fragment) => fragment.content),
      );
      if (vectors.length !== fragments.length) {
        throw new Error(
          "Embedding generator returned an unexpected vector count.",
        );
      }
      const createdAt = now().toISOString();
      const embeddings = fragments.map((fragment, index) =>
        EmbeddingRecord.create({
          fragmentId: fragment.id,
          modelKey: model.key,
          modelVersion: model.version,
          dimensions: model.dimensions,
          contentHash: fragment.contentHash,
          vector: vectors[index],
          createdAt,
        }),
      );
      await dependencies.store.applyPackage({
        kind: "replace_package",
        syncId,
        packageHash: hash,
        indexedAt: createdAt,
        videoPackage: videoPackage(snapshot),
        documents: sourceDocuments(snapshot),
        units,
        fragments,
        embeddings,
      });
      await dependencies.vectorIndex.apply({
        kind: "replace_package",
        packageRef: video.ref,
        model,
        embeddings,
      });
      counters.packagesIndexed += 1;
    } catch (error: unknown) {
      if (previous !== null) {
        await dependencies.store.markPackageSeen(video.ref, syncId);
      }
      const issue = issueFrom(error, syncId, video.ref.videoId);
      issues.push(issue);
      counters.packagesFailed += 1;
      await dependencies.store.recordIssue(issue);
    }
  }

  counters.packagesDeleted = await dependencies.store.deletePackagesNotSeen(
    source.name,
    syncId,
  );
  const removedRefs = previousRefs.filter(
    (ref) => !manifestRefs.has(ref.serialize()),
  );
  if (removedRefs.length > 0) {
    await dependencies.vectorIndex.apply({
      kind: "remove_packages",
      packageRefs: removedRefs,
    });
  }

  const terminalStatus = issues.length > 0 ? "partial" : "ok";
  const finished = running.finish({
    status: terminalStatus,
    finishedAt: now().toISOString(),
    counters,
  });
  await dependencies.store.recordRun(finished);
  const status =
    terminalStatus === "partial"
      ? "partial"
      : counters.packagesIndexed === 0 && counters.packagesDeleted === 0
        ? "no_changes"
        : "ok";
  return {
    syncId,
    sourceName: source.name.value,
    status,
    counters: finished.counters,
    issues,
  };
}
