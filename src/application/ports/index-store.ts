import type { IndexedPackageChange } from "../indexing/indexed-package-change.js";
import type {
  PackageRef,
  SourceName,
  SyncId,
} from "../../domain/indexing/identifiers.js";
import type { SourceDocumentKind } from "../../domain/indexing/source-document.js";
import type { SyncIssue, SyncRun } from "../../domain/indexing/sync-run.js";

export interface IndexedDocumentState {
  readonly kind: SourceDocumentKind;
  readonly contentHash: string;
  readonly parserVersion: string;
}

export interface IndexedEmbeddingModelState {
  readonly key: string;
  readonly version: string;
  readonly dimensions: number;
}

export interface IndexedPackageState {
  readonly ref: PackageRef;
  readonly packageHash: string;
  readonly documents: readonly IndexedDocumentState[];
  readonly embeddingModels: readonly IndexedEmbeddingModelState[];
  readonly lastSeenSyncId: SyncId;
  readonly indexedAt: string;
}

export interface IndexStore {
  listPackageRefs(source: SourceName): Promise<readonly PackageRef[]>;
  getPackageState(ref: PackageRef): Promise<IndexedPackageState | null>;
  markPackageSeen(ref: PackageRef, syncId: SyncId): Promise<void>;
  applyPackage(change: IndexedPackageChange): Promise<void>;
  deletePackagesNotSeen(source: SourceName, syncId: SyncId): Promise<number>;
  recordRun(run: SyncRun): Promise<void>;
  recordIssue(issue: SyncIssue): Promise<void>;
  /**
   * Marks the source's active `running` run `failed` (`--force`'s escape
   * hatch for a ghost run left behind by a killed process), so `recordRun`'s
   * one-running-run-per-source guard stops blocking new syncs for it.
   * Returns the superseded run's id, or `null` when the source had no
   * active run to supersede.
   */
  supersedeActiveRun(
    source: SourceName,
    supersededAt: string,
  ): Promise<SyncId | null>;
  /**
   * Deletes every indexed package and everything derived from it — documents,
   * knowledge units, fragments, the FTS index and embeddings — so `rebuild`
   * can regenerate them from packages that are still on disk. Returns how many
   * packages it deleted.
   *
   * Deliberately preserves what is *not* derived from the sources: the source
   * registry (user configuration), the schema version, and the run history
   * (`sync_runs`/`sync_issues`), which is the only evidence of why someone had
   * to rebuild. `source remove` already leaves that same detached history
   * behind, so this is an established precedent rather than a new rule.
   *
   * Rejects with `SYNC_ALREADY_RUNNING` when any source has a running sync,
   * having deleted nothing: the check and the delete share one transaction,
   * for the same reason `recordRun` guards inside `BEGIN IMMEDIATE` — checking
   * first and deleting after leaves a window where a sync starts in between
   * and writes into a library being emptied underneath it.
   */
  purgeDerivedIndex(): Promise<number>;
}
