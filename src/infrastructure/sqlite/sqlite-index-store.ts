import { DatabaseSync } from "node:sqlite";

import type { IndexedPackageChange } from "../../application/indexing/indexed-package-change.js";
import type {
  IndexedDocumentState,
  IndexedEmbeddingModelState,
  IndexedPackageState,
  IndexStore,
} from "../../application/ports/index-store.js";
import {
  PackageRef,
  SourceName,
  SyncId,
  VideoId,
} from "../../domain/indexing/identifiers.js";
import type { SourceDocumentKind } from "../../domain/indexing/source-document.js";
import type { SyncIssue, SyncRun } from "../../domain/indexing/sync-run.js";

export type SQLiteIndexStoreErrorCode =
  "PACKAGE_WRITES_NOT_IMPLEMENTED" | "UNKNOWN_SOURCE" | "UNKNOWN_SYNC_RUN";

export class SQLiteIndexStoreError extends Error {
  public readonly code: SQLiteIndexStoreErrorCode;

  public constructor(code: SQLiteIndexStoreErrorCode, message: string) {
    super(message);
    this.name = "SQLiteIndexStoreError";
    this.code = code;
  }
}

interface PackageStateRow {
  readonly package_hash: string;
  readonly last_seen_sync_id: string;
  readonly indexed_at: string;
}

interface DocumentStateRow {
  readonly kind: SourceDocumentKind;
  readonly content_hash: string;
  readonly parser_version: string;
}

interface EmbeddingModelStateRow {
  readonly model_key: string;
  readonly model_version: string;
  readonly dimensions: number;
}

function rejected(error: unknown): Promise<never> {
  return Promise.reject(
    error instanceof Error
      ? error
      : new Error("SQLite index persistence failed.", { cause: error }),
  );
}

export class SQLiteIndexStore implements IndexStore {
  public constructor(private readonly database: DatabaseSync) {}

  public getPackageState(ref: PackageRef): Promise<IndexedPackageState | null> {
    try {
      const packageRow = this.database
        .prepare(
          `SELECT p.package_hash, p.last_seen_sync_id, p.indexed_at
           FROM video_packages p
           JOIN sources s ON s.id = p.source_id
           WHERE s.name = ? AND p.video_id = ?`,
        )
        .get(ref.sourceName.value, ref.videoId.value) as
        PackageStateRow | undefined;

      if (packageRow === undefined) {
        return Promise.resolve(null);
      }

      const documents = this.database
        .prepare(
          `SELECT d.kind, d.content_hash, d.parser_version
           FROM source_documents d
           JOIN video_packages p ON p.id = d.package_id
           JOIN sources s ON s.id = p.source_id
           WHERE s.name = ? AND p.video_id = ?
           ORDER BY d.kind COLLATE BINARY`,
        )
        .all(
          ref.sourceName.value,
          ref.videoId.value,
        ) as unknown as DocumentStateRow[];
      const embeddingModels = this.database
        .prepare(
          `SELECT DISTINCT e.model_key, e.model_version, e.dimensions
           FROM embeddings e
           JOIN search_fragments f ON f.id = e.fragment_id
           JOIN knowledge_units u ON u.id = f.unit_id
           JOIN source_documents d ON d.id = u.document_id
           JOIN video_packages p ON p.id = d.package_id
           JOIN sources s ON s.id = p.source_id
           WHERE s.name = ? AND p.video_id = ?
           ORDER BY e.model_key COLLATE BINARY, e.model_version COLLATE BINARY`,
        )
        .all(
          ref.sourceName.value,
          ref.videoId.value,
        ) as unknown as EmbeddingModelStateRow[];

      return Promise.resolve({
        ref: PackageRef.create(
          SourceName.create(ref.sourceName.value),
          VideoId.create(ref.videoId.value),
        ),
        packageHash: packageRow.package_hash,
        documents: documents.map((row): IndexedDocumentState => ({
          kind: row.kind,
          contentHash: row.content_hash,
          parserVersion: row.parser_version,
        })),
        embeddingModels: embeddingModels.map(
          (row): IndexedEmbeddingModelState => ({
            key: row.model_key,
            version: row.model_version,
            dimensions: row.dimensions,
          }),
        ),
        lastSeenSyncId: SyncId.create(packageRow.last_seen_sync_id),
        indexedAt: packageRow.indexed_at,
      });
    } catch (error: unknown) {
      return rejected(error);
    }
  }

  public applyPackage(change: IndexedPackageChange): Promise<void> {
    void change;
    return rejected(
      new SQLiteIndexStoreError(
        "PACKAGE_WRITES_NOT_IMPLEMENTED",
        "Atomic package writes are implemented in persistence task D4.",
      ),
    );
  }

  public deletePackagesNotSeen(
    source: SourceName,
    syncId: SyncId,
  ): Promise<number> {
    void source;
    void syncId;
    return rejected(
      new SQLiteIndexStoreError(
        "PACKAGE_WRITES_NOT_IMPLEMENTED",
        "Safe package deletion is implemented in persistence task D4.",
      ),
    );
  }

  public recordRun(run: SyncRun): Promise<void> {
    try {
      const source = this.database
        .prepare("SELECT id FROM sources WHERE name = ?")
        .get(run.sourceName.value) as { readonly id: number } | undefined;
      if (source === undefined) {
        return rejected(
          new SQLiteIndexStoreError(
            "UNKNOWN_SOURCE",
            `Source ${run.sourceName.value} is not registered.`,
          ),
        );
      }

      this.database
        .prepare(
          `INSERT INTO sync_runs(
            id, source_id, status, started_at, finished_at, counters_json
          ) VALUES (?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            source_id = excluded.source_id,
            status = excluded.status,
            started_at = excluded.started_at,
            finished_at = excluded.finished_at,
            counters_json = excluded.counters_json`,
        )
        .run(
          run.id.value,
          source.id,
          run.status,
          run.startedAt,
          run.finishedAt,
          JSON.stringify(run.counters),
        );
      return Promise.resolve();
    } catch (error: unknown) {
      return rejected(error);
    }
  }

  public recordIssue(issue: SyncIssue): Promise<void> {
    try {
      const run = this.database
        .prepare("SELECT 1 FROM sync_runs WHERE id = ?")
        .get(issue.syncId.value);
      if (run === undefined) {
        return rejected(
          new SQLiteIndexStoreError(
            "UNKNOWN_SYNC_RUN",
            `Sync run ${issue.syncId.value} does not exist.`,
          ),
        );
      }

      this.database
        .prepare(
          `INSERT INTO sync_issues(
            sync_id, video_id, relative_path, code, message, retryable
          ) VALUES (?, ?, ?, ?, ?, ?)`,
        )
        .run(
          issue.syncId.value,
          issue.videoId?.value ?? null,
          issue.relativePath,
          issue.code,
          issue.message,
          issue.retryable ? 1 : 0,
        );
      return Promise.resolve();
    } catch (error: unknown) {
      return rejected(error);
    }
  }
}
