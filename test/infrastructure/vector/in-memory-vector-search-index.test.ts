import assert from "node:assert/strict";
import { test } from "node:test";

import type { EmbeddingModelDescriptor } from "../../../src/application/ports/embedding-generator.js";
import {
  PackageRef,
  SourceName,
  VideoId,
} from "../../../src/domain/indexing/identifiers.js";
import { RetrievalFilter } from "../../../src/domain/retrieval/retrieval-filter.js";
import {
  InMemoryVectorSearchIndex,
  VectorSearchError,
} from "../../../src/infrastructure/vector/in-memory-vector-search-index.js";
import {
  SQLiteVectorSource,
  VectorLoadError,
  type VectorEntry,
  type VectorSource,
} from "../../../src/infrastructure/vector/sqlite-vector-loader.js";
import { verifyVectorSearchIndexContract } from "../../contracts/vector-search-index.contract.js";
import {
  createTestLibrary,
  testEmbeddingModel,
  unitVector,
  type SourceSeed,
  type TestLibrary,
} from "../../helpers/create-test-library.js";

const model: EmbeddingModelDescriptor = testEmbeddingModel;

const seeds: readonly SourceSeed[] = [
  {
    name: "auto-design",
    packages: [
      {
        videoId: "vid_brutal",
        title: "Estilos gráficos",
        creator: "Canal de diseño",
        contextLanguage: "es",
        fragments: [
          {
            unitType: "context_section",
            title: "Brutalismo",
            headingPath: ["Estilos", "Brutalismo"],
            content: "brutalismo expone la estructura",
            angle: 0,
          },
          {
            unitType: "rule_pattern",
            title: "Contraste alto",
            headingPath: ["Patrones", "Contraste alto"],
            content: "usar contraste alto entre fondo y texto",
            angle: 0.1,
          },
        ],
      },
    ],
  },
  {
    name: "catalog-design",
    packages: [
      {
        videoId: "vid_color",
        title: "Colour systems",
        creator: "Studio channel",
        contextLanguage: "en",
        fragments: [
          {
            unitType: "context_section",
            title: "Saturation",
            headingPath: ["Colour", "Saturation"],
            content: "saturated palettes create visual impact",
            angle: 1.4,
          },
        ],
      },
    ],
  },
];

async function withLibrary(
  run: (
    library: TestLibrary,
    index: InMemoryVectorSearchIndex,
  ) => Promise<void>,
): Promise<void> {
  const library = await createTestLibrary(seeds);

  try {
    await run(
      library,
      new InMemoryVectorSearchIndex(new SQLiteVectorSource(library.database)),
    );
  } finally {
    await library.close();
  }
}

/** Counts loads so lazy behaviour can be observed. */
class CountingVectorSource implements VectorSource {
  public loads = 0;

  public constructor(private readonly inner: VectorSource) {}

  public load(descriptor: EmbeddingModelDescriptor): readonly VectorEntry[] {
    this.loads += 1;
    return this.inner.load(descriptor);
  }
}

void test("satisfies the VectorSearchIndex contract", async () => {
  await withLibrary(async (_library, index) => {
    await verifyVectorSearchIndexContract({
      index,
      model,
      query: unitVector(0),
    });
  });
});

void test("ranks the semantically closest fragment first", async () => {
  await withLibrary(async (library, index) => {
    await index.load(model);

    const hits = await index.search(unitVector(1.4), {
      filter: RetrievalFilter.empty(),
      limit: 10,
    });

    const [best] = hits;

    assert.equal(hits.length, 3);
    assert.ok(best);
    assert.equal(
      best.fragmentId.value,
      library.find("saturated").id.value,
      "the fragment sharing the query direction must win",
    );
    assert.ok(best.rawScore > 0.99, "an identical direction scores ~1");
  });
});

void test("reads nothing until the first load", async () => {
  const library = await createTestLibrary(seeds);
  const source = new CountingVectorSource(
    new SQLiteVectorSource(library.database),
  );

  try {
    const index = new InMemoryVectorSearchIndex(source);

    assert.equal(source.loads, 0, "construction must not read vectors");

    await index.load(model);
    assert.equal(source.loads, 1);

    await index.load(model);
    assert.equal(source.loads, 1, "a second load of the same model is a no-op");
  } finally {
    await library.close();
  }
});

void test("refuses to search before loading", async () => {
  await withLibrary(async (_library, index) => {
    await assert.rejects(
      () =>
        index.search(unitVector(0), {
          filter: RetrievalFilter.empty(),
          limit: 5,
        }),
      (error: unknown) => {
        assert.ok(error instanceof VectorSearchError);
        assert.equal(error.code, "MODEL_NOT_LOADED");
        return true;
      },
    );
  });
});

void test("restricts results by source, video, language and unit type", async () => {
  await withLibrary(async (library, index) => {
    await index.load(model);

    const query = unitVector(0);
    const search = (filter: RetrievalFilter) =>
      index.search(query, { filter, limit: 10 });

    assert.deepEqual(
      (
        await search(
          RetrievalFilter.create({
            sources: [SourceName.create("catalog-design")],
          }),
        )
      ).map((hit) => hit.fragmentId.value),
      [library.find("saturated").id.value],
    );

    assert.deepEqual(
      (
        await search(
          RetrievalFilter.create({ videoIds: [VideoId.create("vid_color")] }),
        )
      ).map((hit) => hit.fragmentId.value),
      [library.find("saturated").id.value],
    );

    assert.deepEqual(
      (await search(RetrievalFilter.create({ languages: ["EN"] }))).map(
        (hit) => hit.fragmentId.value,
      ),
      [library.find("saturated").id.value],
    );

    assert.deepEqual(
      (
        await search(RetrievalFilter.create({ unitTypes: ["rule_pattern"] }))
      ).map((hit) => hit.fragmentId.value),
      [library.find("usar contraste").id.value],
    );
  });
});

void test("rebuilds from SQLite after a published change", async () => {
  const library = await createTestLibrary(seeds);
  const source = new CountingVectorSource(
    new SQLiteVectorSource(library.database),
  );

  try {
    const index = new InMemoryVectorSearchIndex(source);

    await index.load(model);

    const before = await index.search(unitVector(0), {
      filter: RetrievalFilter.empty(),
      limit: 10,
    });

    await index.apply({
      kind: "remove_packages",
      packageRefs: [
        PackageRef.create(
          SourceName.create("auto-design"),
          VideoId.create("vid_brutal"),
        ),
      ],
    });

    await index.load(model);
    assert.equal(
      source.loads,
      2,
      "a published change must invalidate the index",
    );

    const after = await index.search(unitVector(0), {
      filter: RetrievalFilter.empty(),
      limit: 10,
    });

    assert.equal(before.length, 3);
    assert.equal(
      after.length,
      3,
      "SQLite still holds the rows, so the rebuild sees them",
    );
  } finally {
    await library.close();
  }
});

void test("rejects vectors that belong to another model", async () => {
  await withLibrary(async (_library, index) => {
    await assert.rejects(
      () => index.load({ ...model, dimensions: 128 }),
      (error: unknown) => {
        assert.ok(error instanceof VectorLoadError);
        assert.equal(error.code, "DIMENSION_MISMATCH");
        return true;
      },
    );

    await assert.rejects(
      () =>
        index.search(unitVector(0), {
          filter: RetrievalFilter.empty(),
          limit: 5,
        }),
      "a failed load must leave the index unusable rather than stale",
    );
  });
});

void test("reports an empty library instead of failing", async () => {
  const library = await createTestLibrary([]);

  try {
    const index = new InMemoryVectorSearchIndex(
      new SQLiteVectorSource(library.database),
    );

    await index.load(model);

    assert.deepEqual(
      await index.search(unitVector(0), {
        filter: RetrievalFilter.empty(),
        limit: 10,
      }),
      [],
    );
  } finally {
    await library.close();
  }
});

void test("reloads when the model version changes, not just its key", async () => {
  // `key` stays `e5-small` across revisions and quantizations; `version`
  // carries them (`Xenova/multilingual-e5-small@main:q8`). Comparing only the
  // key would keep serving vectors built by a different model, and would also
  // hide the staleness VECTORS_STALE reports: a reused snapshot has a
  // non-zero count, so the warning never fires.
  const library = await createTestLibrary(seeds);
  const source = new CountingVectorSource(
    new SQLiteVectorSource(library.database),
  );

  try {
    const index = new InMemoryVectorSearchIndex(source);

    await index.load(model);
    assert.equal(source.loads, 1);

    await index.load(model);
    assert.equal(source.loads, 1, "the same model must reuse the snapshot");

    const otherRevision = { ...model, version: `${model.version}-next` };
    const loaded = await index.load(otherRevision);
    assert.equal(source.loads, 2, "a different version must reload");
    assert.equal(
      loaded,
      0,
      "no vectors exist for the new version, which is what VECTORS_STALE reports",
    );
  } finally {
    // `library.close()`, not `library.database.close()`: the latter closes
    // SQLite but leaves the temporary directory behind, one per run.
    await library.close();
  }
});
