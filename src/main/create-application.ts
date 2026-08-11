import type { DatabaseSync } from "node:sqlite";

import {
  syncSource,
  type SyncSourceResult,
} from "../application/indexing/sync-source.js";
import type { EmbeddingGenerator } from "../application/ports/embedding-generator.js";
import type { IndexStore } from "../application/ports/index-store.js";
import type { PackageSourceReader } from "../application/ports/package-source-reader.js";
import type { SourceRegistry } from "../application/ports/source-registry.js";
import type {
  VectorIndexChange,
  VectorIndexSink,
} from "../application/ports/vector-index-sink.js";
import {
  addSource,
  type AddSourceInput,
  type SourceLayoutResolver,
} from "../application/sources/add-source.js";
import { listSources } from "../application/sources/list-sources.js";
import { removeSource } from "../application/sources/remove-source.js";
import { SourceName } from "../domain/indexing/identifiers.js";
import type { SourceRoot } from "../domain/indexing/source-root.js";
import { E5EmbeddingGenerator } from "../infrastructure/embeddings/e5-embedding-generator.js";
import { FilesystemPackageSourceReader } from "../infrastructure/filesystem/filesystem-package-source-reader.js";
import { resolveSourceLayout } from "../infrastructure/filesystem/source-layout-resolver.js";
import { openDatabase } from "../infrastructure/sqlite/open-database.js";
import { SQLiteIndexStore } from "../infrastructure/sqlite/sqlite-index-store.js";
import { SQLiteSourceRegistry } from "../infrastructure/sqlite/sqlite-source-registry.js";

export interface ApplicationConfig {
  readonly databasePath: string;
  readonly modelCachePath: string;
}

export interface ApplicationOverrides {
  readonly database?: DatabaseSync;
  readonly sourceRegistry?: SourceRegistry;
  readonly indexStore?: IndexStore;
  readonly packageReader?: PackageSourceReader;
  readonly embeddingGenerator?: EmbeddingGenerator;
  readonly vectorIndex?: VectorIndexSink;
  readonly resolveLayout?: SourceLayoutResolver;
}

export interface Application {
  readonly database: DatabaseSync;
  readonly sourceRegistry: SourceRegistry;
  readonly indexStore: IndexStore;
  readonly packageReader: PackageSourceReader;
  readonly embeddingGenerator: EmbeddingGenerator;
  readonly vectorIndex: VectorIndexSink;
  addSource(input: AddSourceInput): Promise<SourceRoot>;
  listSources(): Promise<readonly SourceRoot[]>;
  removeSource(name: unknown): Promise<void>;
  sync(sourceName?: unknown): Promise<readonly SyncSourceResult[]>;
  close(): Promise<void>;
}

export class MemoryVectorIndexSink implements VectorIndexSink {
  public readonly changes: VectorIndexChange[] = [];

  public apply(change: VectorIndexChange): Promise<void> {
    this.changes.push(change);
    return Promise.resolve();
  }
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
    new E5EmbeddingGenerator({ cacheDir: config.modelCachePath });
  const vectorIndex = overrides.vectorIndex ?? new MemoryVectorIndexSink();
  const resolveLayout = overrides.resolveLayout ?? resolveSourceLayout;

  return {
    database,
    sourceRegistry,
    indexStore,
    packageReader,
    embeddingGenerator,
    vectorIndex,
    addSource: (input) =>
      addSource({ registry: sourceRegistry, resolveLayout }, input),
    listSources: () => listSources(sourceRegistry),
    removeSource: (name) => removeSource(sourceRegistry, name),
    async sync(name?: unknown): Promise<readonly SyncSourceResult[]> {
      const sources =
        name === undefined
          ? await sourceRegistry.list()
          : [await sourceRegistry.getByName(SourceName.create(name))].filter(
              (source): source is SourceRoot => source !== null,
            );
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
    async close(): Promise<void> {
      if (embeddingGenerator instanceof E5EmbeddingGenerator) {
        await embeddingGenerator.dispose();
      }
      if (ownsDatabase) database.close();
    },
  };
}
