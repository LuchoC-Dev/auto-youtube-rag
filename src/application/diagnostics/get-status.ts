import type {
  EmbeddingGenerator,
  EmbeddingModelDescriptor,
} from "../ports/embedding-generator.js";

export interface LibraryCounts {
  readonly sources: number;
  readonly videos: number;
  readonly documents: number;
  readonly knowledgeUnits: number;
  readonly fragments: number;
  readonly embeddings: number;
  readonly issues: number;
}

export interface LatestSyncStatus {
  readonly id: string;
  readonly sourceName: string | null;
  readonly status: string;
  readonly startedAt: string;
  readonly finishedAt: string | null;
}

export interface LibraryStatusSnapshot {
  readonly schemaVersion: string;
  readonly counts: LibraryCounts;
  readonly latestSync: LatestSyncStatus | null;
}

export interface DatabaseHealthSnapshot {
  readonly integrity: boolean;
  readonly foreignKeyViolations: number;
  readonly fullTextSearch: boolean;
}

/** A `running` sync run, as read by `doctor`'s `STALE_SYNC_RUN` check. Every
 * run this lists is either genuinely in progress or a ghost left behind by
 * a killed process (Ctrl+C, closed terminal, power cut) — `doctor` cannot
 * tell which, so it only reports, never guesses or supersedes. */
export interface ActiveSyncRunSnapshot {
  readonly id: string;
  readonly sourceName: string | null;
  readonly startedAt: string;
}

export interface DiagnosticsRepository {
  readStatus(): Promise<LibraryStatusSnapshot>;
  checkHealth(): Promise<DatabaseHealthSnapshot>;
  listActiveSyncRuns(): Promise<readonly ActiveSyncRunSnapshot[]>;
}

export interface ApplicationStatus extends LibraryStatusSnapshot {
  readonly model: EmbeddingModelDescriptor;
}

export async function getStatus(
  repository: DiagnosticsRepository,
  embeddingGenerator: EmbeddingGenerator,
): Promise<ApplicationStatus> {
  const [snapshot, model] = await Promise.all([
    repository.readStatus(),
    embeddingGenerator.describe(),
  ]);
  return { ...snapshot, model };
}
