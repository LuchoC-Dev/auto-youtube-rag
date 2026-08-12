import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { runCli, type CliWriter } from "../../src/interfaces/cli/run-cli.js";
import { createApplication } from "../../src/main/create-application.js";
import { FakeEmbeddingGenerator } from "../fakes/fake-embedding-generator.js";
import {
  createTestCollection,
  type TestCollection,
  type TestVideo,
} from "../helpers/create-test-collection.js";

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

function json(text: string): Record<string, unknown> {
  return record(JSON.parse(text) as unknown);
}

const designVideo: TestVideo = {
  videoId: "design_video",
  slug: "design-video",
};
const catalogVideo: TestVideo = {
  videoId: "catalog_video",
  slug: "catalog-video",
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

void test("assembles, budgets and cites context end to end through the retrieve command", async () => {
  const design = await createTestCollection([designVideo]);
  const catalog = await createTestCollection([catalogVideo]);
  const collections = [design, catalog];

  // Nested headings produce a real ancestor chain to expand: the H1 slug
  // section is the child of the synthetic document root, "Método completo"
  // is its child, and "Brutalismo" — where the rare lexical term lives — is
  // the deepest match.
  await design.writeContext(
    designVideo,
    [
      "## Método completo",
      "",
      "Introducción general al método de diseño aplicado en este video.",
      "",
      "### Brutalismo",
      "",
      "El brutalismo digital utiliza tipografía cruda como Helvetica y contraste extremo.",
    ].join("\n"),
  );
  await catalog.writeContext(
    catalogVideo,
    "El catálogo organiza referencias visuales por sistema cromático internacional.",
  );

  const config = {
    databasePath: design.databasePath,
    modelCachePath: design.modelCachePath,
  };
  const outDir = await mkdtemp(
    join(tmpdir(), "auto-youtube-rag-retrieve-e2e-"),
  );

  const applicationFactory = (applicationConfig: typeof config) =>
    createApplication(applicationConfig, {
      embeddingGenerator: new FakeEmbeddingGenerator(),
    });

  async function retrieve(argv: readonly string[]) {
    const stdout = new BufferWriter();
    const stderr = new BufferWriter();
    const exitCode = await runCli({
      argv,
      config,
      stdout,
      stderr,
      applicationFactory,
    });
    return { exitCode, stdout: stdout.value, stderr: stderr.value };
  }

  try {
    await withoutMutating(collections, async () => {
      const init = await retrieve(["init"]);
      assert.equal(init.exitCode, 0);
      const addDesign = await retrieve([
        "source",
        "add",
        design.collectionPath,
        "--name",
        "design",
      ]);
      assert.equal(addDesign.exitCode, 0);
      const addCatalog = await retrieve([
        "source",
        "add",
        catalog.collectionPath,
        "--name",
        "catalog",
      ]);
      assert.equal(addCatalog.exitCode, 0);
      const syncDesign = await retrieve(["sync", "--source", "design"]);
      assert.equal(syncDesign.exitCode, 0);
      const syncCatalog = await retrieve(["sync", "--source", "catalog"]);
      assert.equal(syncCatalog.exitCode, 0);
    });

    // The rare term resolves through the lexical path, source-filtered to
    // design alone, and the bundle is written where --out points.
    const filtered = await withoutMutating(collections, () =>
      retrieve([
        "retrieve",
        "Helvetica",
        "--source",
        "design",
        "--out",
        outDir,
      ]),
    );

    assert.equal(filtered.exitCode, 0);
    assert.equal(filtered.stderr, "Retrieving context...\n");
    const receipt = json(filtered.stdout);
    assert.equal(receipt.status, "ok");
    assert.equal(receipt.schema_version, "1.0");
    assert.equal(typeof receipt.request_id, "string");

    const contextPath = receipt.context_path;
    const resultPath = receipt.result_path;
    assert.equal(typeof contextPath, "string");
    assert.equal(typeof resultPath, "string");

    const markdown = await readFile(contextPath as string, "utf8");
    const result = json(await readFile(resultPath as string, "utf8"));

    // The matched leaf and its expanded ancestor are both cited.
    assert.match(markdown, /Helvetica/u);
    assert.match(markdown, /\[S01\]/u);
    assert.match(markdown, /Método completo/u);
    assert.equal(result.status, "ok");
    const resultSources = result.sources;
    assert.ok(Array.isArray(resultSources));
    assert.deepEqual(
      resultSources.map((source) => record(source).source_name),
      ["design"],
    );

    // A tight budget still returns the best evidence but marks itself
    // exhausted; a generous budget over the same query keeps more of it.
    const tight = await retrieve([
      "retrieve",
      "Helvetica",
      "--source",
      "design",
      "--max-tokens",
      "5",
      "--out",
      outDir,
    ]);
    const generous = await retrieve([
      "retrieve",
      "Helvetica",
      "--source",
      "design",
      "--max-tokens",
      "5000",
      "--out",
      outDir,
    ]);

    assert.equal(tight.exitCode, 0);
    assert.equal(generous.exitCode, 0);
    const tightReceipt = json(tight.stdout);
    const generousReceipt = json(generous.stdout);
    assert.ok(
      Number(tightReceipt.estimated_tokens) <=
        Number(generousReceipt.estimated_tokens),
    );

    // The vector path has no similarity floor (see retrieval-design.md): a
    // query over a non-empty library always ranks something. The only
    // reliable no_results case is a filter that empties the candidate
    // universe itself, e.g. a source that was never registered.
    const empty = await retrieve([
      "retrieve",
      "Helvetica",
      "--source",
      "ghost-source",
      "--out",
      outDir,
    ]);
    assert.equal(empty.exitCode, 0);
    const emptyReceipt = json(empty.stdout);
    assert.equal(emptyReceipt.status, "no_results");
    const emptyMarkdown = await readFile(
      emptyReceipt.context_path as string,
      "utf8",
    );
    assert.match(emptyMarkdown, /No evidence matched this section\./u);
  } finally {
    await rm(outDir, { recursive: true, force: true });
    await design.cleanup();
    await catalog.cleanup();
  }
});
