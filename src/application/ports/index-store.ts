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
}
