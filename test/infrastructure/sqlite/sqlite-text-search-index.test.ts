import assert from "node:assert/strict";
import { test } from "node:test";

import {
  SourceName,
  VideoId,
} from "../../../src/domain/indexing/identifiers.js";
import { RetrievalFilter } from "../../../src/domain/retrieval/retrieval-filter.js";
import { SQLiteTextSearchIndex } from "../../../src/infrastructure/sqlite/sqlite-text-search-index.js";
import { verifyTextSearchIndexContract } from "../../contracts/text-search-index.contract.js";
import {
  createTestLibrary,
  type SourceSeed,
  type TestLibrary,
} from "../../helpers/create-test-library.js";

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
            content:
              "brutalismo expone la estructura con tipografía pesada y contraste duro",
            angle: 0,
          },
          {
            unitType: "rule_pattern",
            title: "Contraste alto",
            headingPath: ["Patrones", "Contraste alto"],
            content:
              "usar contraste alto entre fondo y texto para mantener la jerarquía",
            angle: 0.2,
          },
        ],
      },
      {
        videoId: "vid_type",
        title: "Tipografía aplicada",
        creator: "Canal de diseño",
        contextLanguage: "es",
        fragments: [
          {
            unitType: "context_section",
            title: "Kerning",
            headingPath: ["Tipografía", "Kerning"],
            content: "kerning ajusta el espacio entre pares de letras",
            angle: 1.2,
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
            content: "saturated palettes create visual impact and hierarchy",
            angle: 1.5,
          },
        ],
      },
    ],
  },
];

async function withLibrary(
  run: (library: TestLibrary, index: SQLiteTextSearchIndex) => Promise<void>,
): Promise<void> {
  const library = await createTestLibrary(seeds);

  try {
    await run(library, new SQLiteTextSearchIndex(library.database));
  } finally {
    await library.close();
  }
}

void test("satisfies the TextSearchIndex contract", async () => {
  await withLibrary(async (_library, index) => {
    await verifyTextSearchIndexContract({
      index,
      presentTerm: "contraste",
      absentTerm: "helvetica",
    });
  });
});

void test("finds a rare exact term the way only lexical search can", async () => {
  await withLibrary(async (library, index) => {
    const hits = await index.search({
      text: "kerning",
      filter: RetrievalFilter.empty(),
      limit: 10,
    });

    assert.equal(hits.length, 1);
    assert.equal(hits[0]?.fragmentId.value, library.find("kerning").id.value);
  });
});

void test("matches accents and case through the tokenizer", async () => {
  await withLibrary(async (library, index) => {
    const expected = library.find("kerning").id.value;

    for (const text of ["TIPOGRAFIA", "tipografía", "Tipografia"]) {
      const hits = await index.search({
        text,
        filter: RetrievalFilter.empty(),
        limit: 10,
      });

      assert.ok(
        hits.some((hit) => hit.fragmentId.value === expected),
        `expected ${text} to match the kerning fragment`,
      );
    }
  });
});

void test("ranks a heading match above a passing body mention", async () => {
  await withLibrary(async (library, index) => {
    const hits = await index.search({
      text: "contraste",
      filter: RetrievalFilter.empty(),
      limit: 10,
    });

    assert.equal(hits.length, 2);
    assert.equal(
      hits[0]?.fragmentId.value,
      library.find("usar contraste").id.value,
      "the fragment titled Contraste alto must win",
    );
  });
});

void test("restricts results by source, video, language and unit type", async () => {
  await withLibrary(async (library, index) => {
    const everywhere = await index.search({
      text: "jerarquía hierarchy",
      filter: RetrievalFilter.empty(),
      limit: 10,
    });

    assert.equal(everywhere.length, 2);

    const bySource = await index.search({
      text: "jerarquía hierarchy",
      filter: RetrievalFilter.create({
        sources: [SourceName.create("catalog-design")],
      }),
      limit: 10,
    });

    assert.deepEqual(
      bySource.map((hit) => hit.fragmentId.value),
      [library.find("saturated").id.value],
    );

    const byLanguage = await index.search({
      text: "jerarquía hierarchy",
      filter: RetrievalFilter.create({ languages: ["ES"] }),
      limit: 10,
    });

    assert.deepEqual(
      byLanguage.map((hit) => hit.fragmentId.value),
      [library.find("usar contraste").id.value],
    );

    const byVideo = await index.search({
      text: "contraste tipografía",
      filter: RetrievalFilter.create({
        videoIds: [VideoId.create("vid_brutal")],
      }),
      limit: 10,
    });

    assert.ok(byVideo.length > 0);
    assert.ok(
      byVideo.every(
        (hit) => hit.fragmentId.value !== library.find("kerning").id.value,
      ),
    );

    const byUnitType = await index.search({
      text: "contraste",
      filter: RetrievalFilter.create({ unitTypes: ["rule_pattern"] }),
      limit: 10,
    });

    assert.deepEqual(
      byUnitType.map((hit) => hit.fragmentId.value),
      [library.find("usar contraste").id.value],
    );
  });
});

void test("never writes to the library", async () => {
  await withLibrary(async (library, index) => {
    const before = library.database
      .prepare("SELECT count(*) AS count FROM search_fragments")
      .get();

    await index.search({
      text: "brutalismo contraste kerning",
      filter: RetrievalFilter.empty(),
      limit: 10,
    });

    const after = library.database
      .prepare("SELECT count(*) AS count FROM search_fragments")
      .get();

    assert.deepEqual(after, before);
    assert.equal(
      library.database.prepare("PRAGMA integrity_check").get()?.integrity_check,
      "ok",
    );
  });
});
