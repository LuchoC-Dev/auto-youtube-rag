import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { DatabaseSync } from "node:sqlite";

import type { IndexedPackageChange } from "../../src/application/indexing/indexed-package-change.js";
import {
  createFragmentKey,
  sha256,
} from "../../src/domain/indexing/content-identity.js";
import { EmbeddingRecord } from "../../src/domain/indexing/embedding-record.js";
import {
  DocumentId,
  KnowledgeUnitId,
  PackageRef,
  SearchFragmentId,
  SourceName,
  SyncId,
  VideoId,
} from "../../src/domain/indexing/identifiers.js";
import {
  KnowledgeUnit,
  type KnowledgeUnitType,
} from "../../src/domain/indexing/knowledge-unit.js";
import { SearchFragment } from "../../src/domain/indexing/search-fragment.js";
import { SourceDocument } from "../../src/domain/indexing/source-document.js";
import { SourceRoot } from "../../src/domain/indexing/source-root.js";
import { SyncRun } from "../../src/domain/indexing/sync-run.js";
import { VideoPackage } from "../../src/domain/indexing/video-package.js";
import { openDatabase } from "../../src/infrastructure/sqlite/open-database.js";
import { SQLiteIndexStore } from "../../src/infrastructure/sqlite/sqlite-index-store.js";
import { SQLiteSourceRegistry } from "../../src/infrastructure/sqlite/sqlite-source-registry.js";

export const testEmbeddingModel = {
  key: "e5-small",
  version: "1",
  dimensions: 384,
  maxInputTokens: 512,
} as const;

export interface FragmentSeed {
  readonly unitType: KnowledgeUnitType;
  readonly title: string | null;
  readonly headingPath: readonly string[];
  readonly content: string;
  /**
   * Direction of the unit vector on the first two axes, in radians. Keeping
   * every fixture vector on one plane makes expected cosine similarities
   * obvious: identical angles score 1 and orthogonal ones score 0.
   */
  readonly angle: number;
}

export interface PackageSeed {
  readonly videoId: string;
  readonly title: string;
  readonly creator: string;
  readonly contextLanguage: string;
  readonly fragments: readonly FragmentSeed[];
}

export interface SourceSeed {
  readonly name: string;
  readonly packages: readonly PackageSeed[];
}

export interface SeededFragment {
  readonly id: SearchFragmentId;
  readonly unitId: KnowledgeUnitId;
  readonly sourceName: string;
  readonly videoId: string;
  readonly content: string;
  readonly angle: number;
}

export interface TestLibrary {
  readonly database: DatabaseSync;
  readonly path: string;
  readonly fragments: readonly SeededFragment[];
  /** Looks up a seeded fragment by the words its content starts with. */
  find(startsWith: string): SeededFragment;
  close(): Promise<void>;
}

export function unitVector(angle: number): Float32Array {
  const vector = new Float32Array(testEmbeddingModel.dimensions);
  vector[0] = Math.cos(angle);
  vector[1] = Math.sin(angle);
  return vector;
}

function hashOf(value: string): string {
  return sha256(value);
}

function documentKindOf(unitType: KnowledgeUnitType): "context" | "rules" {
  return unitType.startsWith("context") ? "context" : "rules";
}

interface BuiltPackage {
  readonly change: IndexedPackageChange;
  readonly fragments: readonly SeededFragment[];
}

function buildPackage(
  sourceName: SourceName,
  seed: PackageSeed,
  syncId: SyncId,
): BuiltPackage {
  const ref = PackageRef.create(sourceName, VideoId.create(seed.videoId));
  const prefix = `${sourceName.value}:${seed.videoId}`;
  const documents = [];
  const units = [];
  const fragments = [];
  const embeddings = [];
  const seeded: SeededFragment[] = [];
  const roots = new Map<string, KnowledgeUnitId>();

  for (const kind of ["context", "rules"] as const) {
    const documentId = DocumentId.create(`document:${prefix}:${kind}`);
    const rootId = KnowledgeUnitId.create(`unit:${prefix}:${kind}:root`);

    documents.push(
      SourceDocument.create({
        id: documentId,
        packageRef: ref,
        kind,
        relativePath:
          kind === "context"
            ? "deliverables/context.md"
            : "deliverables/rules.json",
        contentHash: hashOf(`${prefix}:${kind}`),
        byteSize: 512,
        parserVersion: `${kind}-v1`,
      }),
    );
    units.push(
      KnowledgeUnit.create({
        id: rootId,
        documentId,
        parentId: null,
        unitType: kind === "context" ? "context_document" : "rules_document",
        depth: 0,
        ordinal: 0,
        title: seed.title,
        content: `${seed.title} document root`,
        structuredJson: null,
        headingPath: [seed.title],
        timestamps: [],
        visualEvidence: [],
        estimatedTokens: 4,
        contentHash: hashOf(`${prefix}:${kind}:root`),
        // Document roots exist to widen a hit, not to compete as one.
        searchable: false,
      }),
    );
    roots.set(kind, rootId);
  }

  for (const [index, fragmentSeed] of seed.fragments.entries()) {
    const kind = documentKindOf(fragmentSeed.unitType);
    const documentId = DocumentId.create(`document:${prefix}:${kind}`);
    const parentId = roots.get(kind);

    if (parentId === undefined) {
      throw new Error(`Missing ${kind} root for ${prefix}.`);
    }

    const unitId = KnowledgeUnitId.create(
      `unit:${prefix}:${kind}:${String(index)}`,
    );
    const contentHash = hashOf(`${prefix}:${String(index)}`);

    units.push(
      KnowledgeUnit.create({
        id: unitId,
        documentId,
        parentId,
        unitType: fragmentSeed.unitType,
        depth: 1,
        ordinal: index,
        title: fragmentSeed.title,
        content: fragmentSeed.content,
        structuredJson: null,
        headingPath: fragmentSeed.headingPath,
        timestamps: [],
        visualEvidence: [`keyframes/frame-${String(index)}.jpg`],
        estimatedTokens: 8,
        contentHash,
        searchable: true,
      }),
    );

    // Mirrors how the application derives fragment identity, so the adapter
    // can rebuild the same id from persisted rows.
    const fragmentId = SearchFragmentId.create(createFragmentKey(unitId, 0));

    fragments.push(
      SearchFragment.create({
        id: fragmentId,
        unitId,
        ordinal: 0,
        title: fragmentSeed.title,
        headingPath: fragmentSeed.headingPath,
        content: fragmentSeed.content,
        tokenCount: 8,
        contentHash,
      }),
    );
    embeddings.push(
      EmbeddingRecord.create({
        fragmentId,
        modelKey: testEmbeddingModel.key,
        modelVersion: testEmbeddingModel.version,
        dimensions: testEmbeddingModel.dimensions,
        contentHash,
        vector: unitVector(fragmentSeed.angle),
        createdAt: "2026-08-11T00:00:30.000Z",
      }),
    );
    seeded.push({
      id: fragmentId,
      unitId,
      sourceName: sourceName.value,
      videoId: seed.videoId,
      content: fragmentSeed.content,
      angle: fragmentSeed.angle,
    });
  }

  return {
    fragments: seeded,
    change: {
      kind: "replace_package",
      syncId,
      packageHash: hashOf(prefix),
      indexedAt: "2026-08-11T00:00:30.000Z",
      videoPackage: VideoPackage.create({
        ref,
        slug: seed.videoId,
        relativePath: `videos/${seed.videoId}`,
        manifestStage: "complete",
        title: seed.title,
        creator: seed.creator,
        canonicalUrl: `https://www.youtube.com/watch?v=${seed.videoId}`,
        durationSeconds: 600,
        publishedAt: "2026-08-10T00:00:00.000Z",
        sourceLanguage: seed.contextLanguage,
        contextLanguage: seed.contextLanguage,
        tags: ["design"],
        categories: ["Education"],
        visualProfile: "visual-dependent",
      }),
      documents,
      units,
      fragments,
      embeddings,
    },
  };
}

/**
 * Builds a real SQLite library on disk from declarative seeds, so retrieval
 * adapters are exercised against the same schema, triggers and BLOB encoding
 * that production uses.
 */
export async function createTestLibrary(
  sources: readonly SourceSeed[],
): Promise<TestLibrary> {
  const directory = await mkdtemp(join(tmpdir(), "auto-youtube-rag-library-"));
  const path = join(directory, "index.sqlite");
  const database = openDatabase(path);
  const registry = new SQLiteSourceRegistry(database);
  const store = new SQLiteIndexStore(database);
  const seeded: SeededFragment[] = [];

  for (const sourceSeed of sources) {
    const sourceName = SourceName.create(sourceSeed.name);

    await registry.add(
      SourceRoot.create({
        name: sourceName,
        collectionPath: `C:\\knowledge\\${sourceSeed.name}`,
        manifestPath: `C:\\knowledge\\${sourceSeed.name}\\manifest.json`,
        videosPath: `C:\\knowledge\\${sourceSeed.name}\\videos`,
        enabled: true,
      }),
    );

    const syncId = SyncId.create(`sync:${sourceSeed.name}`);

    await store.recordRun(
      SyncRun.start({
        id: syncId,
        sourceName,
        startedAt: "2026-08-11T00:00:00.000Z",
      }),
    );

    for (const packageSeed of sourceSeed.packages) {
      const built = buildPackage(sourceName, packageSeed, syncId);

      await store.applyPackage(built.change);
      seeded.push(...built.fragments);
    }
  }

  return {
    database,
    path,
    fragments: seeded,
    find(startsWith: string): SeededFragment {
      const match = seeded.find((fragment) =>
        fragment.content.startsWith(startsWith),
      );

      if (match === undefined) {
        throw new Error(`No seeded fragment starts with "${startsWith}".`);
      }

      return match;
    },
    async close(): Promise<void> {
      database.close();
      await rm(directory, { recursive: true, force: true });
    },
  };
}
