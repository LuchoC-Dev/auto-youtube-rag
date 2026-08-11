import { DatabaseSync } from "node:sqlite";

import type { SourceRegistry } from "../../application/ports/source-registry.js";
import { SourceName } from "../../domain/indexing/identifiers.js";
import { SourceRoot } from "../../domain/indexing/source-root.js";

export type SQLiteSourceRegistryErrorCode = "DUPLICATE_SOURCE";

export class SQLiteSourceRegistryError extends Error {
  public readonly code: SQLiteSourceRegistryErrorCode;

  public constructor(
    code: SQLiteSourceRegistryErrorCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "SQLiteSourceRegistryError";
    this.code = code;
  }
}

interface SourceRow {
  readonly name: string;
  readonly collection_path: string;
  readonly manifest_path: string;
  readonly videos_path: string;
  readonly enabled: number;
}

function toSourceRoot(row: SourceRow): SourceRoot {
  return SourceRoot.create({
    name: SourceName.create(row.name),
    collectionPath: row.collection_path,
    manifestPath: row.manifest_path,
    videosPath: row.videos_path,
    enabled: row.enabled === 1,
  });
}

function isUniqueConstraint(error: unknown): boolean {
  return (
    error instanceof Error &&
    (("errcode" in error && error.errcode === 2_067) ||
      error.message.includes("UNIQUE constraint failed"))
  );
}

export class SQLiteSourceRegistry implements SourceRegistry {
  public constructor(
    private readonly database: DatabaseSync,
    private readonly now: () => Date = () => new Date(),
  ) {}

  public add(source: SourceRoot): Promise<void> {
    const timestamp = this.now().toISOString();
    try {
      this.database
        .prepare(
          `INSERT INTO sources(
            name, collection_path, manifest_path, videos_path,
            enabled, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(
          source.name.value,
          source.collectionPath,
          source.manifestPath,
          source.videosPath,
          source.enabled ? 1 : 0,
          timestamp,
          timestamp,
        );
    } catch (error: unknown) {
      if (isUniqueConstraint(error)) {
        return Promise.reject(
          new SQLiteSourceRegistryError(
            "DUPLICATE_SOURCE",
            `A source already uses the name or one of the paths from ${source.name.value}.`,
            { cause: error },
          ),
        );
      }
      return Promise.reject(
        error instanceof Error
          ? error
          : new Error("SQLite source registration failed.", { cause: error }),
      );
    }
    return Promise.resolve();
  }

  public getByName(name: SourceName): Promise<SourceRoot | null> {
    const row = this.database
      .prepare(
        `SELECT name, collection_path, manifest_path, videos_path, enabled
         FROM sources
         WHERE name = ?`,
      )
      .get(name.value) as SourceRow | undefined;
    return Promise.resolve(row === undefined ? null : toSourceRoot(row));
  }

  public list(): Promise<readonly SourceRoot[]> {
    const rows = this.database
      .prepare(
        `SELECT name, collection_path, manifest_path, videos_path, enabled
         FROM sources
         ORDER BY name COLLATE BINARY`,
      )
      .all() as unknown as SourceRow[];
    return Promise.resolve(rows.map(toSourceRoot));
  }

  public remove(name: SourceName): Promise<void> {
    this.database.prepare("DELETE FROM sources WHERE name = ?").run(name.value);
    return Promise.resolve();
  }
}
