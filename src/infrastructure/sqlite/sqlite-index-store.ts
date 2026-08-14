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
  | "INVALID_DELETE_RUN"
  | "INVALID_PACKAGE_CHANGE"
  | "SYNC_ALREADY_RUNNING"
  | "UNKNOWN_SOURCE"
  | "UNKNOWN_SYNC_RUN";

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

function vectorBlob(vector: Float32Array): Uint8Array {
  const bytes = new Uint8Array(vector.length * Float32Array.BYTES_PER_ELEMENT);
  const view = new DataView(bytes.buffer);
  for (const [index, value] of vector.entries()) {
    view.setFloat32(index * Float32Array.BYTES_PER_ELEMENT, value, true);
  }
  return bytes;
}

interface SourceIdRow {
  readonly id: number;
}

interface SyncRunRow {
  readonly source_id: number | null;
  readonly status: string;
}

interface ActiveRunRow {
  readonly id: string;
  readonly started_at: string;
}

function insertedId(row: unknown): number {
  if (
    typeof row !== "object" ||
    row === null ||
    !("id" in row) ||
    typeof row.id !== "number"
  ) {
    throw new SQLiteIndexStoreError(
      "INVALID_PACKAGE_CHANGE",
      "SQLite did not return the inserted row identifier.",
    );
  }
  return row.id;
}

export class SQLiteIndexStore implements IndexStore {
  public constructor(private readonly database: DatabaseSync) {}

  public listPackageRefs(source: SourceName): Promise<readonly PackageRef[]> {
    try {
      const rows = this.database
        .prepare(
          `SELECT p.video_id
           FROM video_packages p
           JOIN sources s ON s.id = p.source_id
           WHERE s.name = ?
           ORDER BY p.video_id COLLATE BINARY`,
        )
        .all(source.value);
      return Promise.resolve(
        rows.map((row) =>
          PackageRef.create(source, VideoId.create(String(row.video_id))),
        ),
      );
    } catch (error: unknown) {
      return rejected(error);
    }
  }

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

  public markPackageSeen(ref: PackageRef, syncId: SyncId): Promise<void> {
    try {
      const source = this.database
        .prepare("SELECT id FROM sources WHERE name = ?")
        .get(ref.sourceName.value) as SourceIdRow | undefined;
      if (source === undefined) {
        return rejected(
          new SQLiteIndexStoreError(
            "UNKNOWN_SOURCE",
            `Source ${ref.sourceName.value} is not registered.`,
          ),
        );
      }
      const run = this.database
        .prepare("SELECT source_id, status FROM sync_runs WHERE id = ?")
        .get(syncId.value) as SyncRunRow | undefined;
      if (run === undefined) {
        return rejected(
          new SQLiteIndexStoreError(
            "UNKNOWN_SYNC_RUN",
            `Sync run ${syncId.value} does not exist.`,
          ),
        );
      }
      if (run.source_id !== source.id || run.status !== "running") {
        return rejected(
          new SQLiteIndexStoreError(
            "INVALID_PACKAGE_CHANGE",
            "Marking a package seen requires the active run for its source.",
          ),
        );
      }
      const result = this.database
        .prepare(
          `UPDATE video_packages
           SET last_seen_sync_id = ?
           WHERE source_id = ? AND video_id = ?`,
        )
        .run(syncId.value, source.id, ref.videoId.value);
      if (result.changes !== 1) {
        return rejected(
          new SQLiteIndexStoreError(
            "INVALID_PACKAGE_CHANGE",
            `Package ${ref.serialize()} is not indexed.`,
          ),
        );
      }
      return Promise.resolve();
    } catch (error: unknown) {
      return rejected(error);
    }
  }

  public applyPackage(change: IndexedPackageChange): Promise<void> {
    try {
      const source = this.database
        .prepare("SELECT id FROM sources WHERE name = ?")
        .get(change.videoPackage.ref.sourceName.value) as
        SourceIdRow | undefined;
      if (source === undefined) {
        return rejected(
          new SQLiteIndexStoreError(
            "UNKNOWN_SOURCE",
            `Source ${change.videoPackage.ref.sourceName.value} is not registered.`,
          ),
        );
      }
      const run = this.database
        .prepare("SELECT source_id, status FROM sync_runs WHERE id = ?")
        .get(change.syncId.value) as SyncRunRow | undefined;
      if (run === undefined) {
        return rejected(
          new SQLiteIndexStoreError(
            "UNKNOWN_SYNC_RUN",
            `Sync run ${change.syncId.value} does not exist.`,
          ),
        );
      }
      if (run.source_id !== source.id || run.status !== "running") {
        return rejected(
          new SQLiteIndexStoreError(
            "INVALID_PACKAGE_CHANGE",
            "Package changes require a running sync for the package source.",
          ),
        );
      }

      this.database.exec("BEGIN IMMEDIATE");
      try {
        const videoPackage = change.videoPackage;
        const packageId = insertedId(
          this.database
            .prepare(
              `INSERT INTO video_packages(
              source_id, video_id, slug, relative_path, manifest_stage, title,
              creator, canonical_url, duration_seconds, published_at,
              source_language, context_language, tags_json, categories_json,
              visual_profile, package_hash, last_seen_sync_id, indexed_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(source_id, video_id) DO UPDATE SET
              slug = excluded.slug,
              relative_path = excluded.relative_path,
              manifest_stage = excluded.manifest_stage,
              title = excluded.title,
              creator = excluded.creator,
              canonical_url = excluded.canonical_url,
              duration_seconds = excluded.duration_seconds,
              published_at = excluded.published_at,
              source_language = excluded.source_language,
              context_language = excluded.context_language,
              tags_json = excluded.tags_json,
              categories_json = excluded.categories_json,
              visual_profile = excluded.visual_profile,
              package_hash = excluded.package_hash,
              last_seen_sync_id = excluded.last_seen_sync_id,
              indexed_at = excluded.indexed_at
            RETURNING id`,
            )
            .get(
              source.id,
              videoPackage.ref.videoId.value,
              videoPackage.slug,
              videoPackage.relativePath,
              videoPackage.manifestStage,
              videoPackage.title,
              videoPackage.creator,
              videoPackage.canonicalUrl,
              videoPackage.durationSeconds,
              videoPackage.publishedAt,
              videoPackage.sourceLanguage,
              videoPackage.contextLanguage,
              JSON.stringify(videoPackage.tags),
              JSON.stringify(videoPackage.categories),
              videoPackage.visualProfile,
              change.packageHash,
              change.syncId.value,
              change.indexedAt,
            ),
        );

        this.database
          .prepare("DELETE FROM source_documents WHERE package_id = ?")
          .run(packageId);

        const documentIds = new Map<string, number>();
        const insertDocument = this.database.prepare(
          `INSERT INTO source_documents(
            package_id, kind, relative_path, content_hash, byte_size, parser_version
          ) VALUES (?, ?, ?, ?, ?, ?) RETURNING id`,
        );
        for (const document of change.documents) {
          if (!document.packageRef.equals(videoPackage.ref)) {
            throw new SQLiteIndexStoreError(
              "INVALID_PACKAGE_CHANGE",
              `Document ${document.id.value} belongs to another package.`,
            );
          }
          const id = insertedId(
            insertDocument.get(
              packageId,
              document.kind,
              document.relativePath,
              document.contentHash,
              document.byteSize,
              document.parserVersion,
            ),
          );
          documentIds.set(document.id.value, id);
        }

        const unitIds = new Map<string, number>();
        const insertUnit = this.database.prepare(
          `INSERT INTO knowledge_units(
            document_id, parent_id, stable_key, unit_type, depth, ordinal,
            title, content, structured_json, heading_path_json, timestamps_json,
            visual_evidence_json, estimated_tokens, content_hash, searchable
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
        );
        let pendingUnits = [...change.units];
        while (pendingUnits.length > 0) {
          const deferred = [];
          for (const unit of pendingUnits) {
            const documentId = documentIds.get(unit.documentId.value);
            if (documentId === undefined) {
              deferred.push(unit);
              continue;
            }
            let parentId: number | null = null;
            if (unit.parentId !== null) {
              const resolvedParentId = unitIds.get(unit.parentId.value);
              if (resolvedParentId === undefined) {
                deferred.push(unit);
                continue;
              }
              parentId = resolvedParentId;
            }
            const id = insertedId(
              insertUnit.get(
                documentId,
                parentId,
                unit.id.value,
                unit.unitType,
                unit.depth,
                unit.ordinal,
                unit.title,
                unit.content,
                unit.structuredJson,
                JSON.stringify(unit.headingPath),
                JSON.stringify(unit.timestamps),
                JSON.stringify(unit.visualEvidence),
                unit.estimatedTokens,
                unit.contentHash,
                unit.searchable ? 1 : 0,
              ),
            );
            unitIds.set(unit.id.value, id);
          }
          if (deferred.length === pendingUnits.length) {
            throw new SQLiteIndexStoreError(
              "INVALID_PACKAGE_CHANGE",
              "Knowledge units contain a missing document, parent or cycle.",
            );
          }
          pendingUnits = deferred;
        }

        const fragmentIds = new Map<string, number>();
        const insertFragment = this.database.prepare(
          `INSERT INTO search_fragments(
            unit_id, ordinal, title, heading_path, content, token_count, content_hash
          ) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id`,
        );
        for (const fragment of change.fragments) {
          const unitId = unitIds.get(fragment.unitId.value);
          if (unitId === undefined) {
            throw new SQLiteIndexStoreError(
              "INVALID_PACKAGE_CHANGE",
              `Fragment ${fragment.id.value} references a missing unit.`,
            );
          }
          const id = insertedId(
            insertFragment.get(
              unitId,
              fragment.ordinal,
              fragment.title,
              fragment.headingPath.join(" > "),
              fragment.content,
              fragment.tokenCount,
              fragment.contentHash,
            ),
          );
          fragmentIds.set(fragment.id.value, id);
        }

        const insertEmbedding = this.database.prepare(
          `INSERT INTO embeddings(
            fragment_id, model_key, model_version, dimensions,
            content_hash, vector, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        );
        for (const embedding of change.embeddings) {
          const fragmentId = fragmentIds.get(embedding.fragmentId.value);
          if (fragmentId === undefined) {
            throw new SQLiteIndexStoreError(
              "INVALID_PACKAGE_CHANGE",
              `Embedding for ${embedding.fragmentId.value} references a missing fragment.`,
            );
          }
          insertEmbedding.run(
            fragmentId,
            embedding.modelKey,
            embedding.modelVersion,
            embedding.dimensions,
            embedding.contentHash,
            vectorBlob(embedding.vector),
            embedding.createdAt,
          );
        }

        this.database.exec("COMMIT");
        return Promise.resolve();
      } catch (error: unknown) {
        this.database.exec("ROLLBACK");
        return rejected(
          error instanceof SQLiteIndexStoreError
            ? error
            : new SQLiteIndexStoreError(
                "INVALID_PACKAGE_CHANGE",
                `Could not atomically replace package ${change.videoPackage.ref.serialize()}: ${error instanceof Error ? error.message : "unknown SQLite error"}`,
              ),
        );
      }
    } catch (error: unknown) {
      return rejected(error);
    }
  }

  public deletePackagesNotSeen(
    source: SourceName,
    syncId: SyncId,
  ): Promise<number> {
    try {
      const sourceRow = this.database
        .prepare("SELECT id FROM sources WHERE name = ?")
        .get(source.value) as SourceIdRow | undefined;
      if (sourceRow === undefined) {
        return rejected(
          new SQLiteIndexStoreError(
            "UNKNOWN_SOURCE",
            `Source ${source.value} is not registered.`,
          ),
        );
      }
      const run = this.database
        .prepare("SELECT source_id, status FROM sync_runs WHERE id = ?")
        .get(syncId.value) as SyncRunRow | undefined;
      if (run === undefined) {
        return rejected(
          new SQLiteIndexStoreError(
            "UNKNOWN_SYNC_RUN",
            `Sync run ${syncId.value} does not exist.`,
          ),
        );
      }
      if (run.source_id !== sourceRow.id || run.status !== "running") {
        return rejected(
          new SQLiteIndexStoreError(
            "INVALID_DELETE_RUN",
            "Deleting unseen packages requires the active run for that source after a valid manifest scan.",
          ),
        );
      }
      const result = this.database
        .prepare(
          `DELETE FROM video_packages
           WHERE source_id = ? AND last_seen_sync_id <> ?`,
        )
        .run(sourceRow.id, syncId.value);
      return Promise.resolve(Number(result.changes));
    } catch (error: unknown) {
      return rejected(error);
    }
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

      // Only registering a *new* running run is guarded here; closing an
      // existing one (transition to ok/partial/failed, or a repeated write
      // of the same running run) must never be blocked by its own row, so
      // active runs are matched excluding this run's id.
      if (run.status === "running") {
        const active = this.database
          .prepare(
            `SELECT id, started_at FROM sync_runs
             WHERE source_id = ? AND status = 'running' AND id <> ?`,
          )
          .get(source.id, run.id.value) as ActiveRunRow | undefined;
        if (active !== undefined) {
          return rejected(
            new SQLiteIndexStoreError(
              "SYNC_ALREADY_RUNNING",
              `Sync run ${active.id} for source ${run.sourceName.value} is ` +
                `already running (started at ${active.started_at}). Run ` +
                `"auto-youtube-rag sync --force" to supersede it.`,
            ),
          );
        }
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

  public supersedeActiveRun(
    source: SourceName,
    supersededAt: string,
  ): Promise<SyncId | null> {
    try {
      const sourceRow = this.database
        .prepare("SELECT id FROM sources WHERE name = ?")
        .get(source.value) as SourceIdRow | undefined;
      if (sourceRow === undefined) {
        return rejected(
          new SQLiteIndexStoreError(
            "UNKNOWN_SOURCE",
            `Source ${source.value} is not registered.`,
          ),
        );
      }
      const superseded = this.database
        .prepare(
          `UPDATE sync_runs
           SET status = 'failed', finished_at = ?
           WHERE source_id = ? AND status = 'running'
           RETURNING id`,
        )
        .get(supersededAt, sourceRow.id) as { readonly id: string } | undefined;
      return Promise.resolve(
        superseded === undefined ? null : SyncId.create(superseded.id),
      );
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
