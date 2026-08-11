import type { DatabaseSync } from "node:sqlite";

import type {
  DatabaseHealthSnapshot,
  DiagnosticsRepository,
  LibraryStatusSnapshot,
} from "../../application/diagnostics/get-status.js";

interface CountRow {
  readonly count: number;
}

interface SchemaRow {
  readonly value: string;
}

interface IntegrityRow {
  readonly integrity_check: string;
}

interface LatestSyncRow {
  readonly id: string;
  readonly source_name: string | null;
  readonly status: string;
  readonly started_at: string;
  readonly finished_at: string | null;
}

const countedTables = {
  sources: "sources",
  videos: "video_packages",
  documents: "source_documents",
  knowledgeUnits: "knowledge_units",
  fragments: "search_fragments",
  embeddings: "embeddings",
  issues: "sync_issues",
} as const;

export class SQLiteDiagnosticsRepository implements DiagnosticsRepository {
  public constructor(private readonly database: DatabaseSync) {}

  public readStatus(): Promise<LibraryStatusSnapshot> {
    const schema = this.database
      .prepare("SELECT value FROM schema_meta WHERE key = 'schema_version'")
      .get() as SchemaRow | undefined;
    const entries = Object.entries(countedTables).map(([key, table]) => [
      key,
      (
        this.database
          .prepare(`SELECT COUNT(*) AS count FROM ${table}`)
          .get() as CountRow | undefined
      )?.count ?? 0,
    ]);
    const latest = this.database
      .prepare(
        `SELECT r.id, s.name AS source_name, r.status, r.started_at, r.finished_at
         FROM sync_runs r
         LEFT JOIN sources s ON s.id = r.source_id
         ORDER BY r.started_at DESC, r.id DESC
         LIMIT 1`,
      )
      .get() as LatestSyncRow | undefined;

    return Promise.resolve({
      schemaVersion: schema?.value ?? "unknown",
      counts: Object.fromEntries(entries) as LibraryStatusSnapshot["counts"],
      latestSync: latest
        ? {
            id: latest.id,
            sourceName: latest.source_name,
            status: latest.status,
            startedAt: latest.started_at,
            finishedAt: latest.finished_at,
          }
        : null,
    });
  }

  public checkHealth(): Promise<DatabaseHealthSnapshot> {
    const integrityRows = this.database
      .prepare("PRAGMA integrity_check")
      .all() as unknown as IntegrityRow[];
    const foreignKeys = this.database.prepare("PRAGMA foreign_key_check").all();
    let fullTextSearch = true;
    try {
      this.database
        .prepare(
          "SELECT rowid FROM fragment_fts WHERE fragment_fts MATCH ? LIMIT 1",
        )
        .all("diagnostic");
    } catch {
      fullTextSearch = false;
    }
    return Promise.resolve({
      integrity:
        integrityRows.length === 1 &&
        integrityRows[0]?.integrity_check === "ok",
      foreignKeyViolations: foreignKeys.length,
      fullTextSearch,
    });
  }
}
