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

export interface DiagnosticsRepository {
  readStatus(): Promise<LibraryStatusSnapshot>;
  checkHealth(): Promise<DatabaseHealthSnapshot>;
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
