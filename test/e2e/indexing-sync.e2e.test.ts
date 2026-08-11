import assert from "node:assert/strict";
import { test } from "node:test";

import { getStatus } from "../../src/application/diagnostics/get-status.js";
import { SourceName } from "../../src/domain/indexing/identifiers.js";
import { SQLiteDiagnosticsRepository } from "../../src/infrastructure/sqlite/sqlite-diagnostics.js";
import { createApplication } from "../../src/main/create-application.js";
import { FakeEmbeddingGenerator } from "../fakes/fake-embedding-generator.js";
import {
  createTestCollection,
  type TestCollection,
  type TestVideo,
} from "../helpers/create-test-collection.js";

const alpha: TestVideo = { videoId: "alpha_video", slug: "alpha-design" };
const beta: TestVideo = { videoId: "beta_video", slug: "beta-design" };

async function withoutSourceMutation<T>(
  collection: TestCollection,
  operation: () => Promise<T>,
): Promise<T> {
  const before = await collection.snapshot();
  const result = await operation();
  assert.deepEqual(await collection.snapshot(), before);
  return result;
}

void test("indexes, repeats, changes, isolates failures, deletes and reopens", async () => {
  const collection = await createTestCollection([alpha, beta]);
  const fakeModel = new FakeEmbeddingGenerator();
  const config = {
    databasePath: collection.databasePath,
    modelCachePath: collection.modelCachePath,
  };
  const application = createApplication(config, {
    embeddingGenerator: fakeModel,
  });

  try {
    await application.addSource({
      name: "design",
      path: collection.collectionPath,
    });

    const initial = await withoutSourceMutation(collection, () =>
      application.sync("design"),
    );
    const initialResult = initial[0];
    assert.ok(initialResult);
    assert.equal(initialResult.status, "ok");
    assert.equal(initialResult.counters.packagesIndexed, 2);

    const repeated = await withoutSourceMutation(collection, () =>
      application.sync("design"),
    );
    const repeatedResult = repeated[0];
    assert.ok(repeatedResult);
    assert.equal(repeatedResult.status, "no_changes");
    assert.equal(repeatedResult.counters.packagesUnchanged, 2);

    await collection.writeContext(
      alpha,
      "Grid editorial renovado con jerarquia tipografica precisa.",
    );
    const changed = await withoutSourceMutation(collection, () =>
      application.sync("design"),
    );
    const changedResult = changed[0];
    assert.ok(changedResult);
    assert.equal(changedResult.status, "ok");
    assert.equal(changedResult.counters.packagesIndexed, 1);
    assert.equal(changedResult.counters.packagesUnchanged, 1);

    await collection.removeContext(beta);
    const partial = await withoutSourceMutation(collection, () =>
      application.sync("design"),
    );
    const partialResult = partial[0];
    assert.ok(partialResult);
    assert.equal(partialResult.status, "partial");
    assert.equal(partialResult.counters.packagesFailed, 1);
    assert.equal(
      application.database
        .prepare("SELECT COUNT(*) AS count FROM video_packages")
        .get()?.count,
      2,
    );

    await collection.writeManifest([alpha]);
    const deleted = await withoutSourceMutation(collection, () =>
      application.sync("design"),
    );
    const deletedResult = deleted[0];
    assert.ok(deletedResult);
    assert.equal(deletedResult.status, "ok");
    assert.equal(deletedResult.counters.packagesDeleted, 1);
  } finally {
    await application.close();
  }

  const reopened = createApplication(config, {
    embeddingGenerator: new FakeEmbeddingGenerator(),
  });
  try {
    const refs = await reopened.indexStore.listPackageRefs(
      SourceName.create("design"),
    );
    assert.deepEqual(
      refs.map((ref) => ref.videoId.value),
      [alpha.videoId],
    );
    assert.equal(
      reopened.database
        .prepare(
          "SELECT COUNT(*) AS count FROM fragment_fts WHERE fragment_fts MATCH 'grid'",
        )
        .get()?.count,
      1,
    );
    assert.deepEqual(
      reopened.database.prepare("PRAGMA foreign_key_check").all(),
      [],
    );
    const status = await getStatus(
      new SQLiteDiagnosticsRepository(reopened.database),
      reopened.embeddingGenerator,
    );
    assert.equal(status.counts.sources, 1);
    assert.equal(status.counts.videos, 1);
    assert.equal(status.latestSync?.status, "ok");
  } finally {
    await reopened.close();
    await collection.cleanup();
  }
});
