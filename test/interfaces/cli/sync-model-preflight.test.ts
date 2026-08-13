import assert from "node:assert/strict";
import { rm } from "node:fs/promises";
import { test } from "node:test";

import { runCli, type CliWriter } from "../../../src/interfaces/cli/run-cli.js";
import { createApplication } from "../../../src/main/create-application.js";
import { FakeEmbeddingGenerator } from "../../fakes/fake-embedding-generator.js";
import {
  createTestCollection,
  type TestVideo,
} from "../../helpers/create-test-collection.js";

class BufferWriter implements CliWriter {
  public value = "";
  public write(text: string): void {
    this.value += text;
  }
}

function record(value: unknown): Record<string, unknown> {
  assert.equal(typeof value, "object");
  assert.notEqual(value, null);
  return value as Record<string, unknown>;
}

const videos: readonly TestVideo[] = [
  { videoId: "video_1", slug: "video-1" },
  { videoId: "video_2", slug: "video-2" },
  { videoId: "video_3", slug: "video-3" },
  { videoId: "video_4", slug: "video-4" },
  { videoId: "video_5", slug: "video-5" },
];

/**
 * Direct regression test for the 13 August cold run: `sync` over a
 * multi-video source with the model missing used to discover
 * MODEL_LOAD_FAILED once per video (63 issues, one per video, in that
 * incident). With the Z2 preflight in place, sync must never even start
 * processing packages: exactly one MODEL_NOT_INSTALLED preflight error,
 * never a `results` array with per-video issues.
 */
void test("sync over five videos without the model produces one preflight error, not five issues", async () => {
  const collection = await createTestCollection(videos);
  const config = {
    databasePath: collection.databasePath,
    modelCachePath: collection.modelCachePath,
  };

  const applicationFactory = (cfg: typeof config) =>
    createApplication(cfg, {
      embeddingGenerator: new FakeEmbeddingGenerator(),
    });

  async function command(argv: readonly string[]) {
    const stdout = new BufferWriter();
    const stderr = new BufferWriter();
    const exitCode = await runCli({
      argv,
      config,
      stdout,
      stderr,
      applicationFactory,
    });
    return { exitCode, output: record(JSON.parse(stdout.value) as unknown) };
  }

  try {
    await command(["init", "--skip-model"]);
    await command([
      "source",
      "add",
      collection.collectionPath,
      "--name",
      "design",
    ]);

    // createTestCollection installs a fixture model by default (block Z2's
    // own test infrastructure); remove it here to exercise the "model
    // missing" branch this regression test targets.
    await rm(collection.modelCachePath, { recursive: true, force: true });

    const synced = await command(["sync", "--source", "design"]);

    assert.equal(synced.exitCode, 1);
    assert.equal(record(synced.output.error).code, "MODEL_NOT_INSTALLED");
    // The old bug produced a top-level "results" array with one issue per
    // video; the preflight error must never carry one.
    assert.equal(synced.output.results, undefined);
  } finally {
    await collection.cleanup();
  }
});
