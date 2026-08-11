import assert from "node:assert/strict";

import type { IndexStore } from "../../src/application/ports/index-store.js";
import { SyncId, VideoId } from "../../src/domain/indexing/identifiers.js";
import { SyncIssue, SyncRun } from "../../src/domain/indexing/sync-run.js";

export interface PersistedRunView {
  readonly id: string;
  readonly status: string;
  readonly startedAt: string;
  readonly finishedAt: string | null;
  readonly counters: unknown;
}

export interface PersistedIssueView {
  readonly syncId: string;
  readonly videoId: string | null;
  readonly relativePath: string | null;
  readonly code: string;
  readonly message: string;
  readonly retryable: boolean;
}

export async function verifyIndexStoreRunContract(input: {
  readonly store: IndexStore;
  readonly sourceName: SyncRun["sourceName"];
  readonly readRun: (id: string) => PersistedRunView | null;
  readonly readIssues: (id: string) => readonly PersistedIssueView[];
}): Promise<void> {
  const syncId = SyncId.create("sync:contract");
  const running = SyncRun.start({
    id: syncId,
    sourceName: input.sourceName,
    startedAt: "2026-08-11T00:00:00.000Z",
  });
  await input.store.recordRun(running);
  assert.deepEqual(input.readRun(syncId.value), {
    id: syncId.value,
    status: "running",
    startedAt: running.startedAt,
    finishedAt: null,
    counters: {
      packagesSeen: 0,
      packagesUnchanged: 0,
      packagesIndexed: 0,
      packagesFailed: 0,
      packagesDeleted: 0,
    },
  });

  await input.store.recordIssue(
    SyncIssue.create({
      syncId,
      videoId: VideoId.create("video_1"),
      relativePath: "videos/video-1/context.md",
      code: "INVALID_CONTEXT",
      message: "The context file could not be parsed.",
      retryable: false,
    }),
  );

  const failed = running.finish({
    status: "failed",
    finishedAt: "2026-08-11T00:01:00.000Z",
    counters: {
      packagesSeen: 1,
      packagesUnchanged: 0,
      packagesIndexed: 0,
      packagesFailed: 1,
      packagesDeleted: 0,
    },
  });
  await input.store.recordRun(failed);

  assert.deepEqual(input.readRun(syncId.value), {
    id: syncId.value,
    status: "failed",
    startedAt: running.startedAt,
    finishedAt: failed.finishedAt,
    counters: failed.counters,
  });
  assert.deepEqual(input.readIssues(syncId.value), [
    {
      syncId: syncId.value,
      videoId: "video_1",
      relativePath: "videos/video-1/context.md",
      code: "INVALID_CONTEXT",
      message: "The context file could not be parsed.",
      retryable: false,
    },
  ]);
}
