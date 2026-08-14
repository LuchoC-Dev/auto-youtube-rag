import type { IndexStore } from "../ports/index-store.js";
import type { SourceRegistry } from "../ports/source-registry.js";
import type { SourceRoot } from "../../domain/indexing/source-root.js";
import type { SyncIssue } from "../../domain/indexing/sync-run.js";
import type { SyncSourceResult } from "./sync-source.js";

export interface RebuildIndexDependencies {
  readonly store: IndexStore;
  readonly registry: SourceRegistry;
  /**
   * Injected rather than called directly so a rebuild reuses the exact
   * wiring a plain `sync` uses. Reimplementing the loop here would let the
   * two drift apart, and a rebuild that indexes differently from a sync
   * defeats its own purpose.
   */
  readonly sync: (source: SourceRoot) => Promise<SyncSourceResult>;
}

export interface RebuiltSource {
  readonly name: string;
  readonly status: SyncSourceResult["status"];
  readonly packagesIndexed: number;
  readonly packagesFailed: number;
}

export interface RebuildIndexResult {
  readonly status: "ok" | "partial" | "failed";
  readonly sourcesRebuilt: number;
  readonly packagesDeleted: number;
  readonly packagesIndexed: number;
  readonly packagesFailed: number;
  readonly sources: readonly RebuiltSource[];
  readonly issues: readonly SyncIssue[];
}

function aggregateStatus(
  sources: readonly RebuiltSource[],
): RebuildIndexResult["status"] {
  // No sources registered is not a failure: there is nothing to rebuild and
  // nothing is broken.
  if (sources.length === 0) return "ok";
  if (sources.every((source) => source.status === "failed")) return "failed";
  if (
    sources.some(
      (source) => source.status === "partial" || source.status === "failed",
    )
  ) {
    return "partial";
  }
  return "ok";
}

/**
 * Purges the derived index and regenerates it from the packages still on
 * disk.
 *
 * It regenerates rather than only purging because the approved contract says
 * "regenerates the derived index": a bare purge would leave the library empty
 * and silently useless until someone remembers to sync, which is the worst
 * possible outcome for a command whose purpose is to repair.
 *
 * Only the purge is transactional. The re-synchronization that follows is not
 * part of it: each `syncSource` manages its own transactions, and one source
 * failing must behave exactly as in a normal sync (issue recorded, run
 * `partial`) instead of rolling back a purge that already succeeded. A process
 * killed in between therefore leaves a partially rebuilt library — the remedy
 * is to run `rebuild` again, which is idempotent. Holding one transaction
 * across the embedding of the entire library would be worse.
 *
 * The running-sync guard lives inside `purgeDerivedIndex`, not here, so the
 * check and the delete cannot be separated by a sync starting in between.
 */
export async function rebuildIndex(
  dependencies: RebuildIndexDependencies,
): Promise<RebuildIndexResult> {
  const sources = await dependencies.registry.list();
  const packagesDeleted = await dependencies.store.purgeDerivedIndex();

  // Sequential, unlike `sync`'s Promise.all over sources. A rebuild reindexes
  // everything, so it is the maximum-load case, and 4.3 measured that
  // parallelizing indexing yields 1.00x because ONNX already saturates the
  // cores. Running sources concurrently here would only multiply peak memory
  // and interleave the progress output of a command that already takes
  // minutes.
  const results: SyncSourceResult[] = [];
  for (const source of sources) {
    results.push(await dependencies.sync(source));
  }

  const rebuilt = results.map((result): RebuiltSource => ({
    name: result.sourceName,
    status: result.status,
    packagesIndexed: result.counters.packagesIndexed,
    packagesFailed: result.counters.packagesFailed,
  }));

  return {
    status: aggregateStatus(rebuilt),
    sourcesRebuilt: rebuilt.length,
    packagesDeleted,
    packagesIndexed: rebuilt.reduce(
      (total, source) => total + source.packagesIndexed,
      0,
    ),
    packagesFailed: rebuilt.reduce(
      (total, source) => total + source.packagesFailed,
      0,
    ),
    sources: rebuilt,
    issues: results.flatMap((result) => [...result.issues]),
  };
}
