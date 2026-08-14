import assert from "node:assert/strict";
import { test } from "node:test";

import { rebuildIndex } from "../../../src/application/indexing/rebuild-index.js";
import type { SyncSourceResult } from "../../../src/application/indexing/sync-source.js";
import type { SourceRegistry } from "../../../src/application/ports/source-registry.js";
import type {
  VectorIndexChange,
  VectorIndexSink,
} from "../../../src/application/ports/vector-index-sink.js";
import {
  SourceName,
  SyncId,
  VideoId,
} from "../../../src/domain/indexing/identifiers.js";
import { SourceRoot } from "../../../src/domain/indexing/source-root.js";
import { SyncIssue, SyncRun } from "../../../src/domain/indexing/sync-run.js";
import { InMemoryIndexStore } from "../../fakes/in-memory-index-store.js";

class RecordingVectorSink implements VectorIndexSink {
  public readonly changes: VectorIndexChange[] = [];
  public apply(change: VectorIndexChange): Promise<void> {
    this.changes.push(change);
    return Promise.resolve();
  }
}

function source(name: string): SourceRoot {
  return SourceRoot.create({
    name: SourceName.create(name),
    collectionPath: `C:\\knowledge\\${name}`,
    manifestPath: `C:\\knowledge\\${name}\\manifest.json`,
    videosPath: `C:\\knowledge\\${name}\\videos`,
    enabled: true,
  });
}

function registryOf(sources: readonly SourceRoot[]): SourceRegistry {
  return {
    add: () => Promise.reject(new Error("not used")),
    getByName: (name) =>
      Promise.resolve(
        sources.find((candidate) => candidate.name.equals(name)) ?? null,
      ),
    list: () => Promise.resolve(sources),
    remove: () => Promise.reject(new Error("not used")),
  };
}

function syncResult(input: {
  readonly sourceName: string;
  readonly status: SyncSourceResult["status"];
  readonly packagesIndexed: number;
  readonly packagesFailed?: number;
  readonly issues?: readonly SyncIssue[];
}): SyncSourceResult {
  return {
    syncId: SyncId.create(`sync:${input.sourceName}`),
    sourceName: input.sourceName,
    status: input.status,
    counters: {
      packagesSeen: input.packagesIndexed + (input.packagesFailed ?? 0),
      packagesUnchanged: 0,
      packagesIndexed: input.packagesIndexed,
      packagesFailed: input.packagesFailed ?? 0,
      packagesDeleted: 0,
    },
    issues: input.issues ?? [],
  };
}

void test("purges once and rebuilds every registered source", async () => {
  const store = new InMemoryIndexStore();
  const first = source("auto-design");
  const second = source("catalog-design");
  const synced: string[] = [];

  const vectorIndex = new RecordingVectorSink();
  const result = await rebuildIndex({
    store,
    vectorIndex,
    registry: registryOf([first, second]),
    sync: (target) => {
      // The purge must already have happened by the time any source syncs:
      // otherwise a source would index into a library about to be emptied.
      assert.equal(store.purges, 1);
      synced.push(target.name.value);
      return Promise.resolve(
        syncResult({
          sourceName: target.name.value,
          status: "ok",
          packagesIndexed: target.name.value === "auto-design" ? 34 : 17,
        }),
      );
    },
  });

  assert.deepEqual(synced, ["auto-design", "catalog-design"]);
  assert.equal(
    store.purges,
    1,
    "one purge for the whole rebuild, not per source",
  );
  assert.equal(result.status, "ok");
  assert.equal(result.sourcesRebuilt, 2);
  assert.equal(result.packagesIndexed, 51);
  assert.equal(result.packagesFailed, 0);
  assert.deepEqual(result.sources, [
    {
      name: "auto-design",
      status: "ok",
      packagesIndexed: 34,
      packagesFailed: 0,
    },
    {
      name: "catalog-design",
      status: "ok",
      packagesIndexed: 17,
      packagesFailed: 0,
    },
  ]);
});

void test("reports how many packages the purge deleted", async () => {
  const store = new InMemoryIndexStore();
  const target = source("auto-design");
  // Seed two package states so the purge has something to count.
  store.seedPackages(target.name, ["video_1", "video_2"]);

  const vectorIndex = new RecordingVectorSink();
  const result = await rebuildIndex({
    store,
    vectorIndex,
    registry: registryOf([target]),
    sync: (synced) =>
      Promise.resolve(
        syncResult({
          sourceName: synced.name.value,
          status: "ok",
          packagesIndexed: 2,
        }),
      ),
  });

  assert.equal(result.packagesDeleted, 2);
  assert.equal(result.packagesIndexed, 2);

  // The purge deletes rows through SQL, which publishes nothing, so the
  // removal has to be published explicitly or the in-memory index keeps
  // serving vectors whose fragments are gone.
  assert.equal(vectorIndex.changes.length, 1);
  const [published] = vectorIndex.changes;
  assert.ok(published?.kind === "remove_packages");
  assert.deepEqual(
    published.packageRefs.map((ref) => ref.videoId.value),
    ["video_1", "video_2"],
  );
});

void test("a source that degrades leaves the rebuild partial without stopping the others", async () => {
  const store = new InMemoryIndexStore();
  const first = source("auto-design");
  const second = source("catalog-design");
  const issue = SyncIssue.create({
    syncId: SyncId.create("sync:auto-design"),
    videoId: VideoId.create("video_9"),
    relativePath: "videos/video-9/context.md",
    code: "INVALID_CONTEXT",
    message: "The context file could not be parsed.",
    retryable: false,
  });

  const vectorIndex = new RecordingVectorSink();
  const result = await rebuildIndex({
    store,
    vectorIndex,
    registry: registryOf([first, second]),
    sync: (target) =>
      Promise.resolve(
        target.name.value === "auto-design"
          ? syncResult({
              sourceName: "auto-design",
              status: "partial",
              packagesIndexed: 33,
              packagesFailed: 1,
              issues: [issue],
            })
          : syncResult({
              sourceName: "catalog-design",
              status: "ok",
              packagesIndexed: 17,
            }),
      ),
  });

  assert.equal(result.status, "partial");
  assert.equal(result.sourcesRebuilt, 2);
  assert.equal(result.packagesIndexed, 50);
  assert.equal(result.packagesFailed, 1);
  assert.deepEqual(result.issues, [issue]);
});

void test("every source failing is reported as failed, not partial", async () => {
  const store = new InMemoryIndexStore();

  const vectorIndex = new RecordingVectorSink();
  const result = await rebuildIndex({
    store,
    vectorIndex,
    registry: registryOf([source("auto-design"), source("catalog-design")]),
    sync: (target) =>
      Promise.resolve(
        syncResult({
          sourceName: target.name.value,
          status: "failed",
          packagesIndexed: 0,
        }),
      ),
  });

  assert.equal(result.status, "failed");
  assert.equal(result.packagesIndexed, 0);
});

void test("a library with no registered sources rebuilds successfully into nothing", async () => {
  const store = new InMemoryIndexStore();

  const vectorIndex = new RecordingVectorSink();
  const result = await rebuildIndex({
    store,
    vectorIndex,
    registry: registryOf([]),
    sync: () => Promise.reject(new Error("no source should be synchronized")),
  });

  // Not an error: there is nothing to rebuild and nothing is broken. The purge
  // still runs, so a library holding orphan derivatives is cleaned anyway.
  assert.equal(result.status, "ok");
  assert.equal(result.sourcesRebuilt, 0);
  assert.equal(result.packagesDeleted, 0);
  assert.deepEqual(result.sources, []);
  assert.equal(store.purges, 1);
});

void test("a running sync stops the rebuild before anything is purged or synced", async () => {
  const store = new InMemoryIndexStore();
  const target = source("auto-design");
  store.seedPackages(target.name, ["video_1"]);
  await store.recordRun(
    SyncRun.start({
      id: SyncId.create("sync:in-flight"),
      sourceName: target.name,
      startedAt: "2026-08-14T00:00:00.000Z",
    }),
  );

  const vectorIndex = new RecordingVectorSink();
  await assert.rejects(
    rebuildIndex({
      store,
      vectorIndex,
      registry: registryOf([target]),
      sync: () =>
        Promise.reject(new Error("no source may sync under a running run")),
    }),
    /sync:in-flight/,
  );

  assert.equal(store.purges, 0);
  assert.equal(store.states.size, 1, "the library is untouched");
  assert.deepEqual(
    vectorIndex.changes,
    [],
    "nothing was published, because nothing was removed",
  );
});
