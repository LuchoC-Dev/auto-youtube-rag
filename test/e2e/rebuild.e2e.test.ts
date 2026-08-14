import assert from "node:assert/strict";
import { test } from "node:test";

import { getStatus } from "../../src/application/diagnostics/get-status.js";
import { SourceName } from "../../src/domain/indexing/identifiers.js";
import { SQLiteDiagnosticsRepository } from "../../src/infrastructure/sqlite/sqlite-diagnostics.js";
import { createApplication } from "../../src/main/create-application.js";
import { FakeEmbeddingGenerator } from "../fakes/fake-embedding-generator.js";
import {
  createTestCollection,
  type TestVideo,
} from "../helpers/create-test-collection.js";

const alpha: TestVideo = { videoId: "alpha_video", slug: "alpha-design" };
const beta: TestVideo = { videoId: "beta_video", slug: "beta-design" };

function count(
  application: ReturnType<typeof createApplication>,
  sql: string,
): number {
  return Number(application.database.prepare(sql).get()?.count ?? -1);
}

void test("regenerates derivatives that an incremental sync cannot notice", async () => {
  const collection = await createTestCollection([alpha, beta]);
  const config = {
    databasePath: collection.databasePath,
    modelCachePath: collection.modelCachePath,
  };
  const application = createApplication(config, {
    embeddingGenerator: new FakeEmbeddingGenerator(),
  });

  try {
    await application.addSource({
      name: "design",
      path: collection.collectionPath,
    });
    const initial = await application.sync("design");
    assert.equal(initial[0]?.counters.packagesIndexed, 2);

    const fragmentsBefore = count(
      application,
      "SELECT COUNT(*) AS count FROM search_fragments",
    );
    const embeddingsBefore = count(
      application,
      "SELECT COUNT(*) AS count FROM embeddings",
    );
    const sourceTreeBefore = await collection.snapshot();

    // Corrupt a derivative without touching the source package. This is the
    // shape of every problem rebuild exists for -- a batch size change, a new
    // parser version, a fragmentation change: the derived rows stop matching
    // what the pipeline would produce today, while the package hash on disk
    // is untouched.
    application.database
      .prepare("UPDATE search_fragments SET content = ? WHERE id = ?")
      .run("contenidocorrupto", 1);
    assert.equal(
      count(
        application,
        "SELECT COUNT(*) AS count FROM fragment_fts WHERE fragment_fts MATCH 'contenidocorrupto'",
      ),
      1,
    );

    // sync cannot repair it: unchanged() compares the package hash and the
    // model identity, and neither moved. This is the gap, demonstrated.
    const repeated = await application.sync("design");
    assert.equal(repeated[0]?.status, "no_changes");
    assert.equal(
      count(
        application,
        "SELECT COUNT(*) AS count FROM fragment_fts WHERE fragment_fts MATCH 'contenidocorrupto'",
      ),
      1,
      "sync left the corrupted derivative in place",
    );

    const result = await application.rebuildIndex();

    assert.equal(result.status, "ok");
    assert.equal(result.sourcesRebuilt, 1);
    assert.equal(result.packagesDeleted, 2);
    assert.equal(result.packagesIndexed, 2);
    assert.equal(result.packagesFailed, 0);

    // The corruption is gone and the library holds exactly what a sync from
    // scratch would produce.
    assert.equal(
      count(
        application,
        "SELECT COUNT(*) AS count FROM fragment_fts WHERE fragment_fts MATCH 'contenidocorrupto'",
      ),
      0,
    );
    assert.equal(
      count(application, "SELECT COUNT(*) AS count FROM search_fragments"),
      fragmentsBefore,
    );
    assert.equal(
      count(application, "SELECT COUNT(*) AS count FROM embeddings"),
      embeddingsBefore,
    );
    assert.equal(
      count(application, "SELECT COUNT(*) AS count FROM video_packages"),
      2,
    );
    assert.deepEqual(
      application.database.prepare("PRAGMA foreign_key_check").all(),
      [],
    );

    // Configuration survives, and so does the run history: the evidence of
    // why someone had to rebuild is the last thing a rebuild should destroy.
    const sources = await application.listSources();
    assert.deepEqual(
      sources.map((source) => source.name.value),
      ["design"],
    );
    assert.ok(
      count(application, "SELECT COUNT(*) AS count FROM sync_runs") >= 3,
      "the runs from before the rebuild are still there",
    );

    // The sources themselves are read-only, as always.
    assert.deepEqual(await collection.snapshot(), sourceTreeBefore);

    const status = await getStatus(
      new SQLiteDiagnosticsRepository(application.database),
      application.embeddingGenerator,
    );
    assert.equal(status.counts.sources, 1);
    assert.equal(status.counts.videos, 2);
  } finally {
    await application.close();
    await collection.cleanup();
  }
});

void test("a rebuild that ends with no packages leaves no phantom vectors behind", async () => {
  const collection = await createTestCollection([alpha, beta]);
  const config = {
    databasePath: collection.databasePath,
    modelCachePath: collection.modelCachePath,
  };
  const application = createApplication(config, {
    embeddingGenerator: new FakeEmbeddingGenerator(),
  });

  try {
    await application.addSource({
      name: "design",
      path: collection.collectionPath,
    });
    await application.sync("design");
    const model = await application.embeddingGenerator.describe();
    assert.ok((await application.vectorIndex.load(model)) > 0);

    // Every video leaves the manifest, so the rebuild regenerates nothing.
    await collection.writeManifest([]);
    const result = await application.rebuildIndex();
    assert.equal(result.packagesDeleted, 2);
    assert.equal(result.packagesIndexed, 0);

    // 4.4's lesson: the in-memory index must not keep serving a stale
    // snapshot. A non-zero count here would silently suppress VECTORS_STALE
    // and answer queries from vectors whose fragments no longer exist.
    assert.equal(await application.vectorIndex.load(model), 0);
    assert.equal(
      count(application, "SELECT COUNT(*) AS count FROM embeddings"),
      0,
    );
    const refs = await application.indexStore.listPackageRefs(
      SourceName.create("design"),
    );
    assert.deepEqual(refs, []);
  } finally {
    await application.close();
    await collection.cleanup();
  }
});
