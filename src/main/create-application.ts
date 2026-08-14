import type { DatabaseSync } from "node:sqlite";

import {
  supersedeActiveRun,
  syncSource,
  type SyncSourceResult,
} from "../application/indexing/sync-source.js";
import type { EmbeddingGenerator } from "../application/ports/embedding-generator.js";
import type { IndexStore } from "../application/ports/index-store.js";
import type { KnowledgeRepository } from "../application/ports/knowledge-repository.js";
import type { PackageSourceReader } from "../application/ports/package-source-reader.js";
import type { SourceRegistry } from "../application/ports/source-registry.js";
import type { TextSearchIndex } from "../application/ports/text-search-index.js";
import type { VectorSearchIndex } from "../application/ports/vector-search-index.js";
import { assembleContext } from "../application/context/assemble-context.js";
import type { ContextBundle } from "../application/context/context-bundle.js";
import type { ContextRequest } from "../application/context/context-request.js";
import type { FusionStrategy } from "../application/retrieval/fusion-strategy.js";
import {
  retrieveCandidates,
  type RetrieveCandidatesDependencies,
} from "../application/retrieval/retrieve-candidates.js";
import { createRrfFusion } from "../application/retrieval/rrf-fusion.js";
import type { RetrievalOutcome } from "../application/retrieval/retrieval-results.js";
import {
  addSource,
  type AddSourceInput,
  type SourceLayoutResolver,
} from "../application/sources/add-source.js";
import { listSources } from "../application/sources/list-sources.js";
import { removeSource } from "../application/sources/remove-source.js";
import { SourceName } from "../domain/indexing/identifiers.js";
import type { RetrievalQuery } from "../domain/retrieval/retrieval-query.js";
import type { SourceRoot } from "../domain/indexing/source-root.js";
import { TransformersEmbeddingGenerator } from "../infrastructure/embeddings/transformers-embedding-generator.js";
import { FilesystemPackageSourceReader } from "../infrastructure/filesystem/filesystem-package-source-reader.js";
import { resolveSourceLayout } from "../infrastructure/filesystem/source-layout-resolver.js";
import { openDatabase } from "../infrastructure/sqlite/open-database.js";
import { SQLiteIndexStore } from "../infrastructure/sqlite/sqlite-index-store.js";
import { SQLiteKnowledgeRepository } from "../infrastructure/sqlite/sqlite-knowledge-repository.js";
import { SQLiteSourceRegistry } from "../infrastructure/sqlite/sqlite-source-registry.js";
import { SQLiteTextSearchIndex } from "../infrastructure/sqlite/sqlite-text-search-index.js";
import { InMemoryVectorSearchIndex } from "../infrastructure/vector/in-memory-vector-search-index.js";
import { SQLiteVectorSource } from "../infrastructure/vector/sqlite-vector-loader.js";

export interface ApplicationConfig {
  readonly databasePath: string;
  readonly modelCachePath: string;
  /** The pre-4.2 cwd-relative database path (`<cwd>/.auto-youtube-rag/index.sqlite`).
   * Used only to detect and warn about LEGACY_LIBRARY_FOUND (Decision 6 of
   * docs/install-design.md); never read from automatically. `undefined`
   * disables the check (e.g. in tests that do not care about it). */
  readonly legacyDatabasePath?: string;
}

export interface ApplicationOverrides {
  readonly database?: DatabaseSync;
  readonly sourceRegistry?: SourceRegistry;
  readonly indexStore?: IndexStore;
  readonly packageReader?: PackageSourceReader;
  readonly embeddingGenerator?: EmbeddingGenerator;
  readonly vectorIndex?: VectorSearchIndex;
  readonly textSearchIndex?: TextSearchIndex;
  readonly knowledgeRepository?: KnowledgeRepository;
  readonly fusionStrategy?: FusionStrategy;
  readonly resolveLayout?: SourceLayoutResolver;
}

export interface Application {
  readonly database: DatabaseSync;
  readonly sourceRegistry: SourceRegistry;
  readonly indexStore: IndexStore;
  readonly packageReader: PackageSourceReader;
  readonly embeddingGenerator: EmbeddingGenerator;
  readonly vectorIndex: VectorSearchIndex;
  readonly textSearchIndex: TextSearchIndex;
  readonly knowledgeRepository: KnowledgeRepository;
  addSource(input: AddSourceInput): Promise<SourceRoot>;
  listSources(): Promise<readonly SourceRoot[]>;
  removeSource(name: unknown): Promise<void>;
  sync(
    sourceName?: unknown,
    options?: { readonly force?: boolean },
  ): Promise<readonly SyncSourceResult[]>;
  retrieveCandidates(query: RetrievalQuery): Promise<RetrievalOutcome>;
  assembleContext(request: ContextRequest): Promise<ContextBundle>;
  close(): Promise<void>;
}

export function createApplication(
  config: ApplicationConfig,
  overrides: ApplicationOverrides = {},
): Application {
  const ownsDatabase = overrides.database === undefined;
  const database = overrides.database ?? openDatabase(config.databasePath);
  const sourceRegistry =
    overrides.sourceRegistry ?? new SQLiteSourceRegistry(database);
  const indexStore = overrides.indexStore ?? new SQLiteIndexStore(database);
  const packageReader =
    overrides.packageReader ??
    new FilesystemPackageSourceReader(sourceRegistry);
  const embeddingGenerator =
    overrides.embeddingGenerator ??
    new TransformersEmbeddingGenerator({ cacheDir: config.modelCachePath });
  // sync publishes through this same instance, and retrieval queries it: one
  // object owns the vectors, so a committed change and a served query cannot
  // disagree about which fragments exist.
  const vectorIndex =
    overrides.vectorIndex ??
    new InMemoryVectorSearchIndex(new SQLiteVectorSource(database));
  const textSearchIndex =
    overrides.textSearchIndex ?? new SQLiteTextSearchIndex(database);
  const knowledgeRepository =
    overrides.knowledgeRepository ?? new SQLiteKnowledgeRepository(database);
  const fusionStrategy = overrides.fusionStrategy ?? createRrfFusion();
  const resolveLayout = overrides.resolveLayout ?? resolveSourceLayout;
  const retrievalDependencies: RetrieveCandidatesDependencies = {
    textIndex: textSearchIndex,
    vectorIndex,
    knowledgeRepository,
    embeddingGenerator,
    fusionStrategy,
  };

  return {
    database,
    sourceRegistry,
    indexStore,
    packageReader,
    embeddingGenerator,
    vectorIndex,
    textSearchIndex,
    knowledgeRepository,
    addSource: (input) =>
      addSource({ registry: sourceRegistry, resolveLayout }, input),
    listSources: () => listSources(sourceRegistry),
    removeSource: (name) => removeSource(sourceRegistry, name),
    async sync(
      name?: unknown,
      options?: { readonly force?: boolean },
    ): Promise<readonly SyncSourceResult[]> {
      const sources =
        name === undefined
          ? await sourceRegistry.list()
          : [await sourceRegistry.getByName(SourceName.create(name))].filter(
              (source): source is SourceRoot => source !== null,
            );
      if (options?.force === true) {
        // Supersede every targeted source's ghost run before any of them
        // starts, so a stale run for source B cannot still block source B
        // just because this pass happened to reach it after source A.
        await Promise.all(
          sources.map((source) => supersedeActiveRun(indexStore, source.name)),
        );
      }
      return Promise.all(
        sources.map((source) =>
          syncSource(
            {
              reader: packageReader,
              store: indexStore,
              embeddingGenerator,
              vectorIndex,
            },
            source,
          ),
        ),
      );
    },
    retrieveCandidates: (query) =>
      retrieveCandidates(retrievalDependencies, query),
    assembleContext: (request) =>
      assembleContext(
        {
          retrieveCandidates: (query) =>
            retrieveCandidates(retrievalDependencies, query),
          knowledgeRepository,
        },
        request,
      ),
    async close(): Promise<void> {
      if (embeddingGenerator instanceof TransformersEmbeddingGenerator) {
        await embeddingGenerator.dispose();
      }
      if (ownsDatabase) database.close();
    },
  };
}
