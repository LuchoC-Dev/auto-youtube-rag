import type { IndexedPackageChange } from "../../src/application/indexing/indexed-package-change.js";
import type {
  IndexedPackageState,
  IndexStore,
} from "../../src/application/ports/index-store.js";
import type {
  PackageRef,
  SourceName,
  SyncId,
} from "../../src/domain/indexing/identifiers.js";
import type { SyncIssue, SyncRun } from "../../src/domain/indexing/sync-run.js";

export class InMemoryIndexStore implements IndexStore {
  public readonly states = new Map<string, IndexedPackageState>();
  public readonly changes: IndexedPackageChange[] = [];
  public readonly runs = new Map<string, SyncRun>();
  public readonly issues: SyncIssue[] = [];

  public constructor(private readonly events: string[] = []) {}

  public listPackageRefs(source: SourceName): Promise<readonly PackageRef[]> {
    return Promise.resolve(
      [...this.states.values()]
        .filter((state) => state.ref.sourceName.equals(source))
        .map((state) => state.ref),
    );
  }

  public getPackageState(ref: PackageRef): Promise<IndexedPackageState | null> {
    return Promise.resolve(this.states.get(ref.serialize()) ?? null);
  }

  public markPackageSeen(ref: PackageRef, syncId: SyncId): Promise<void> {
    const current = this.states.get(ref.serialize());
    if (current === undefined)
      return Promise.reject(new Error("Package is not indexed."));
    this.states.set(ref.serialize(), { ...current, lastSeenSyncId: syncId });
    return Promise.resolve();
  }

  public applyPackage(change: IndexedPackageChange): Promise<void> {
    this.changes.push(change);
    this.states.set(change.videoPackage.ref.serialize(), {
      ref: change.videoPackage.ref,
      packageHash: change.packageHash,
      documents: change.documents.map((document) => ({
        kind: document.kind,
        contentHash: document.contentHash,
        parserVersion: document.parserVersion,
      })),
      embeddingModels: [
        ...new Map(
          change.embeddings.map((embedding) => [
            embedding.modelKey,
            {
              key: embedding.modelKey,
              version: embedding.modelVersion,
              dimensions: embedding.dimensions,
            },
          ]),
        ).values(),
      ],
      lastSeenSyncId: change.syncId,
      indexedAt: change.indexedAt,
    });
    this.events.push(`commit:${change.videoPackage.ref.serialize()}`);
    return Promise.resolve();
  }

  public deletePackagesNotSeen(
    source: SourceName,
    syncId: SyncId,
  ): Promise<number> {
    let deleted = 0;
    for (const [key, state] of this.states) {
      if (
        state.ref.sourceName.equals(source) &&
        !state.lastSeenSyncId.equals(syncId)
      ) {
        this.states.delete(key);
        deleted += 1;
      }
    }
    return Promise.resolve(deleted);
  }

  public recordRun(run: SyncRun): Promise<void> {
    this.runs.set(run.id.value, run);
    return Promise.resolve();
  }

  public recordIssue(issue: SyncIssue): Promise<void> {
    this.issues.push(issue);
    return Promise.resolve();
  }
}
