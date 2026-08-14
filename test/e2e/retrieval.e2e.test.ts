import assert from "node:assert/strict";
import { test } from "node:test";

import type { EmbeddingGenerator } from "../../src/application/ports/embedding-generator.js";
import { VideoId } from "../../src/domain/indexing/identifiers.js";
import { RetrievalFilter } from "../../src/domain/retrieval/retrieval-filter.js";
import { RetrievalQuery } from "../../src/domain/retrieval/retrieval-query.js";
import { createApplication } from "../../src/main/create-application.js";
import {
  createTestCollection,
  type TestCollection,
  type TestVideo,
} from "../helpers/create-test-collection.js";

/**
 * Assigns each fragment a direction on a shared unit circle from a keyword
 * dictionary, instead of loading the real E5 model. Two texts sharing a
 * keyword land on the same angle regardless of any other word they share,
 * which is what lets this test prove a query with no literal overlap with a
 * fragment's text can still retrieve it through the vector path. The real
 * model's semantic quality is proven separately by the offline E5 smoke test;
 * this fixture only exercises the retrieval plumbing end to end.
 */
const topicAngles: Record<string, number> = {
  saturacion: 0.4,
  colorimetria: 0.4,
  helvetica: 5.0,
  cromatico: 5.5,
};

function stripAccents(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/gu, "");
}

function angleFor(text: string): number {
  const normalized = stripAccents(text).toLowerCase();

  for (const [keyword, angle] of Object.entries(topicAngles)) {
    if (normalized.includes(keyword)) {
      return angle;
    }
  }

  return 3.14;
}

function vectorForAngle(angle: number): Float32Array {
  return new Float32Array([Math.cos(angle), Math.sin(angle), 0]);
}

class TopicEmbeddingGenerator implements EmbeddingGenerator {
  public constructor(
    private readonly modelKey = "fake-topic-e5",
    private readonly modelVersion = "1",
  ) {}

  public describe() {
    return Promise.resolve({
      key: this.modelKey,
      version: this.modelVersion,
      dimensions: 3,
      maxInputTokens: 512,
    });
  }

  public countTokens(texts: readonly string[]): Promise<readonly number[]> {
    return Promise.resolve(
      texts.map((text) => Math.max(1, text.split(/\s+/u).length)),
    );
  }

  public embedDocuments(
    texts: readonly string[],
  ): Promise<readonly Float32Array[]> {
    return Promise.resolve(texts.map((text) => vectorForAngle(angleFor(text))));
  }

  public embedQuery(query: string): Promise<Float32Array> {
    return Promise.resolve(vectorForAngle(angleFor(query)));
  }
}

const rareVideo: TestVideo = { videoId: "rare_video", slug: "rare-design" };
const topicVideo: TestVideo = { videoId: "topic_video", slug: "topic-design" };
const catalogVideo: TestVideo = {
  videoId: "catalog_video",
  slug: "catalog-design",
};

async function withoutMutating<T>(
  collections: readonly TestCollection[],
  operation: () => Promise<T>,
): Promise<T> {
  const before = await Promise.all(
    collections.map((collection) => collection.snapshot()),
  );
  const result = await operation();
  const after = await Promise.all(
    collections.map((collection) => collection.snapshot()),
  );
  assert.deepEqual(after, before);
  return result;
}

void test("retrieves a synced package through both paths, degrades correctly on deletion and survives a restart", async () => {
  const design = await createTestCollection([rareVideo, topicVideo]);
  const catalog = await createTestCollection([catalogVideo]);
  const collections = [design, catalog];
  let paraphraseFragmentId: string | undefined;

  await design.writeContext(
    rareVideo,
    "El sistema tipográfico utiliza Helvetica como fuente principal para el cuerpo editorial.",
  );
  await design.writeContext(
    topicVideo,
    "Trabajar la saturación agresiva de la paleta produce un impacto visual muy fuerte.",
  );
  await catalog.writeContext(
    catalogVideo,
    "El catálogo utiliza un sistema cromático internacional para ordenar referencias visuales.",
  );

  // The same database backs both sources so the source filter has something
  // real to isolate.
  const config = {
    databasePath: design.databasePath,
    modelCachePath: design.modelCachePath,
  };
  const application = createApplication(config, {
    embeddingGenerator: new TopicEmbeddingGenerator(),
  });

  try {
    await withoutMutating(collections, async () => {
      await application.addSource({
        name: "design",
        path: design.collectionPath,
      });
      await application.addSource({
        name: "catalog",
        path: catalog.collectionPath,
      });
      const [designSync] = await application.sync("design");
      const [catalogSync] = await application.sync("catalog");

      assert.equal(designSync?.status, "ok");
      assert.equal(catalogSync?.status, "ok");
    });

    // A package is queryable through the exact lexical path immediately
    // after sync, with no restart. The vector path has no similarity
    // threshold, so it ranks every indexed fragment for every query; the
    // proof of the lexical path is the top-ranked candidate and its
    // textRank, not the size of the result.
    const rareTermOutcome = await application.retrieveCandidates(
      RetrievalQuery.create({ text: "Helvetica" }),
    );
    const [rareTermBest] = rareTermOutcome.candidates;

    assert.equal(rareTermOutcome.status, "ok");
    assert.ok(rareTermBest);
    assert.ok(rareTermBest.provenance.content.includes("Helvetica"));
    assert.ok(rareTermBest.textRank !== null);
    assert.equal(rareTermOutcome.metrics.textHits, 1);

    // A query sharing no word with the target fragment still ranks it first
    // through the vector path alone.
    const paraphraseOutcome = await application.retrieveCandidates(
      RetrievalQuery.create({ text: "colorimetria intensa" }),
    );
    const [paraphraseCandidate] = paraphraseOutcome.candidates;

    assert.equal(paraphraseOutcome.status, "ok");
    assert.ok(paraphraseCandidate);
    assert.ok(paraphraseCandidate.provenance.content.includes("saturación"));
    assert.equal(paraphraseCandidate.textRank, null);
    assert.ok(paraphraseCandidate.vectorRank !== null);
    assert.equal(paraphraseOutcome.metrics.textHits, 0);
    assert.ok(paraphraseOutcome.metrics.vectorHits > 0);
    paraphraseFragmentId = paraphraseCandidate.fragmentId.value;

    // A term common to two sources is found in both, each through its own
    // lexical hit; a source filter isolates one without contaminating the
    // result with the other.
    const unfilteredOutcome = await application.retrieveCandidates(
      RetrievalQuery.create({ text: "sistema" }),
    );
    const unfilteredLexicalHits = unfilteredOutcome.candidates.filter(
      (candidate) => candidate.textRank !== null,
    );

    assert.equal(unfilteredOutcome.metrics.sourcesCovered, 2);
    assert.equal(unfilteredLexicalHits.length, 2);
    assert.ok(
      unfilteredLexicalHits.every((candidate) =>
        candidate.provenance.content.includes("sistema"),
      ),
    );

    const catalogSource = (await application.listSources()).find(
      (source) => source.name.value === "catalog",
    );

    assert.ok(catalogSource);

    const filteredOutcome = await application.retrieveCandidates(
      RetrievalQuery.create({
        text: "sistema",
        filter: RetrievalFilter.create({ sources: [catalogSource.name] }),
      }),
    );

    // The filter narrows the whole candidate universe, not just the lexical
    // hit, so only catalog's one fragment can appear at all.
    assert.equal(filteredOutcome.candidates.length, 1);
    assert.equal(
      filteredOutcome.candidates[0]?.packageRef.sourceName.value,
      "catalog",
    );

    // Deleting the package removes it from both paths. Filtering to its
    // exact video proves this cleanly even though the vector path would
    // otherwise still rank the library's other fragments for any query.
    // Rewriting the manifest is a deliberate source mutation performed by the
    // test itself, standing in for the video being retired upstream, so it
    // happens outside withoutMutating — only the sync call it triggers is
    // guarded, to prove sync itself never writes to the source.
    await design.writeManifest([topicVideo]);
    const [deletion] = await withoutMutating(collections, () =>
      application.sync("design"),
    );

    assert.ok(deletion);
    assert.equal(deletion.status, "ok");
    assert.equal(deletion.counters.packagesDeleted, 1);

    const deletedVideoOutcome = await application.retrieveCandidates(
      RetrievalQuery.create({
        text: "Helvetica",
        filter: RetrievalFilter.create({
          videoIds: [VideoId.create(rareVideo.videoId)],
        }),
      }),
    );

    assert.equal(deletedVideoOutcome.status, "no_results");
    assert.equal(deletedVideoOutcome.metrics.textHits, 0);
    assert.equal(deletedVideoOutcome.metrics.vectorHits, 0);

    const afterDeletion = await application.retrieveCandidates(
      RetrievalQuery.create({ text: "Helvetica" }),
    );

    assert.equal(afterDeletion.metrics.textHits, 0);
    assert.ok(
      afterDeletion.candidates.every(
        (candidate) => !candidate.provenance.content.includes("Helvetica"),
      ),
    );
  } finally {
    await application.close();
  }

  // Reopening the process must reconstruct the vector index from SQLite and
  // reach the same answer for a query that only the vector path can resolve.
  const reopened = createApplication(config, {
    embeddingGenerator: new TopicEmbeddingGenerator(),
  });

  try {
    const rebuiltOutcome = await reopened.retrieveCandidates(
      RetrievalQuery.create({ text: "colorimetria intensa" }),
    );
    const [rebuiltBest] = rebuiltOutcome.candidates;

    assert.equal(rebuiltOutcome.status, "ok");
    assert.ok(rebuiltBest);
    assert.ok(paraphraseFragmentId);
    assert.equal(rebuiltBest.fragmentId.value, paraphraseFragmentId);

    // No accesses beyond SQLite happened: TopicEmbeddingGenerator never
    // touches a filesystem model cache or the network.
    assert.equal(
      reopened.database.prepare("PRAGMA integrity_check").get()
        ?.integrity_check,
      "ok",
    );
  } finally {
    await reopened.close();
    await design.cleanup();
    await catalog.cleanup();
  }
});

void test("warns VECTORS_STALE when the active model has no embeddings in the index", async () => {
  const collection = await createTestCollection([rareVideo]);

  await collection.writeContext(
    rareVideo,
    "El sistema tipográfico utiliza Helvetica como fuente principal para el cuerpo editorial.",
  );

  const config = {
    databasePath: collection.databasePath,
    modelCachePath: collection.modelCachePath,
  };

  // Sync while "model-a" is active: fragments get indexed and embedded
  // under that model's key and version.
  const syncedApplication = createApplication(config, {
    embeddingGenerator: new TopicEmbeddingGenerator("model-a", "1"),
  });

  try {
    await syncedApplication.addSource({
      name: "design",
      path: collection.collectionPath,
    });
    const [syncResult] = await syncedApplication.sync("design");

    assert.equal(syncResult?.status, "ok");
  } finally {
    await syncedApplication.close();
  }

  // Reopen with "model-b" active, reusing the same database. sqlite-vector-
  // loader.ts filters embeddings by model_key/model_version, so the index
  // for "model-b" loads zero vectors even though search_fragments still
  // holds text for the lexical path — reproducing the silent-degradation
  // hole documented in docs/install-design.md.
  const staleApplication = createApplication(config, {
    embeddingGenerator: new TopicEmbeddingGenerator("model-b", "1"),
  });

  try {
    const outcome = await staleApplication.retrieveCandidates(
      RetrievalQuery.create({ text: "Helvetica" }),
    );

    const staleWarning = outcome.warnings.find(
      (warning) => warning.code === "VECTORS_STALE",
    );

    assert.equal(outcome.status, "ok");
    assert.ok(outcome.metrics.textHits > 0);
    assert.equal(outcome.metrics.vectorHits, 0);
    assert.ok(staleWarning, "expected a VECTORS_STALE warning");
    assert.equal(staleWarning.path, "vector");
  } finally {
    await staleApplication.close();
    await collection.cleanup();
  }
});
