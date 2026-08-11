import assert from "node:assert/strict";
import { test } from "node:test";

import { SQLiteKnowledgeRepository } from "../../../src/infrastructure/sqlite/sqlite-knowledge-repository.js";
import { verifyKnowledgeRepositoryContract } from "../../contracts/knowledge-repository.contract.js";
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
            content: "brutalismo expone la estructura con tipografía pesada",
            angle: 0,
          },
          {
            unitType: "rule_pattern",
            title: "Contraste alto",
            headingPath: ["Patrones", "Contraste alto"],
            content: "usar contraste alto entre fondo y texto",
            angle: 0.3,
          },
        ],
      },
    ],
  },
];

async function withRepository(
  run: (
    library: TestLibrary,
    repository: SQLiteKnowledgeRepository,
  ) => Promise<void>,
): Promise<void> {
  const library = await createTestLibrary(seeds);

  try {
    await run(library, new SQLiteKnowledgeRepository(library.database));
  } finally {
    await library.close();
  }
}

void test("satisfies the KnowledgeRepository contract", async () => {
  await withRepository(async (library, repository) => {
    const seeded = library.find("brutalismo");

    await verifyKnowledgeRepositoryContract({
      repository,
      knownFragmentId: seeded.id,
      knownUnitId: seeded.unitId,
    });
  });
});

void test("returns everything a citation needs", async () => {
  await withRepository(async (library, repository) => {
    const seeded = library.find("usar contraste");
    const [provenance] = await repository.getFragmentProvenance([seeded.id]);

    assert.ok(provenance);
    assert.equal(provenance.unitId.value, seeded.unitId.value);
    assert.equal(provenance.packageRef.sourceName.value, "auto-design");
    assert.equal(provenance.packageRef.videoId.value, "vid_brutal");
    assert.equal(provenance.unitType, "rule_pattern");
    assert.equal(provenance.documentKind, "rules");
    assert.equal(provenance.documentRelativePath, "deliverables/rules.json");
    assert.deepEqual(provenance.headingPath, ["Patrones", "Contraste alto"]);
    assert.equal(provenance.title, "Contraste alto");
    assert.equal(provenance.content, seeded.content);
    assert.equal(provenance.tokenCount, 8);
    assert.equal(provenance.videoTitle, "Estilos gráficos");
    assert.equal(provenance.creator, "Canal de diseño");
    assert.equal(
      provenance.canonicalUrl,
      "https://www.youtube.com/watch?v=vid_brutal",
    );
    assert.equal(provenance.language, "es");
    assert.deepEqual(provenance.visualEvidence, ["keyframes/frame-1.jpg"]);
  });
});

void test("resolves a whole batch in one call", async () => {
  await withRepository(async (library, repository) => {
    const first = library.find("brutalismo");
    const second = library.find("usar contraste");
    const provenance = await repository.getFragmentProvenance([
      second.id,
      first.id,
    ]);

    assert.equal(provenance.length, 2);
    assert.deepEqual(
      [...provenance.map((entry) => entry.fragmentId.value)].sort(),
      [first.id.value, second.id.value].sort(),
    );
  });
});

void test("walks a unit up to its document root", async () => {
  await withRepository(async (library, repository) => {
    const seeded = library.find("brutalismo");
    const ancestors = await repository.getAncestors([seeded.unitId]);

    assert.equal(ancestors.length, 1);

    const [root] = ancestors;

    assert.ok(root);
    assert.equal(root.unitType, "context_document");
    assert.equal(root.depth, 0);
    assert.equal(root.parentId, null);
    assert.equal(root.searchable, false);
  });
});

void test("rebuilds units with their persisted hierarchy and evidence", async () => {
  await withRepository(async (library, repository) => {
    const seeded = library.find("brutalismo");
    const [unit] = await repository.getUnits([seeded.unitId]);

    assert.ok(unit);
    assert.equal(unit.unitType, "context_section");
    assert.equal(unit.depth, 1);
    assert.ok(unit.parentId);
    assert.equal(unit.searchable, true);
    assert.deepEqual(unit.headingPath, ["Estilos", "Brutalismo"]);
    assert.deepEqual(unit.visualEvidence, ["keyframes/frame-0.jpg"]);
    assert.equal(
      unit.documentId.value.startsWith("document:auto-design:"),
      true,
    );
  });
});

void test("never writes to the library", async () => {
  await withRepository(async (library, repository) => {
    const seeded = library.find("brutalismo");

    await repository.getFragmentProvenance([seeded.id]);
    await repository.getUnits([seeded.unitId]);
    await repository.getAncestors([seeded.unitId]);

    assert.equal(
      library.database.prepare("PRAGMA integrity_check").get()?.integrity_check,
      "ok",
    );
    assert.equal(
      library.database
        .prepare("SELECT count(*) AS count FROM knowledge_units")
        .get()?.count,
      4,
    );
  });
});
