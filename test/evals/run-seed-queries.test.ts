import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { test } from "node:test";

import {
  resolveModelCachePath,
  runSeedQueries,
  type SeedQueryApplication,
} from "../../evals/run-seed-queries.js";
import { contextDepths } from "../../src/domain/context/context-budget.js";
import { resolvePaths } from "../../src/infrastructure/config/resolve-paths.js";
import type {
  ContextBundle,
  ContextResultUnit,
} from "../../src/application/context/context-bundle.js";

const seedQueriesFixture = {
  schema_version: "1.0",
  queries: [
    {
      id: "query-a",
      text: "query a text",
      language: "es",
      kind: "concept",
      expected: { notes: "n/a" },
    },
    {
      id: "query-b",
      text: "query b text",
      language: "en",
      kind: "rare_term",
      expected: { notes: "n/a" },
    },
  ],
};

function resultUnit(citationId: string): ContextResultUnit {
  return {
    citation_id: citationId,
    section: "highest_relevance",
    source_name: "auto-design",
    video_id: "vid_1",
    video_title: "Video title",
    creator: "Test channel",
    file: "deliverables/context.md",
    heading_path: ["Intro"],
    unit_type: "context_section",
    timestamp: null,
    visual_evidence: [],
    content: `${citationId} content`,
    token_count: 10,
  };
}

function wellFormedBundle(citationId: string): ContextBundle {
  return {
    markdown: `# Context package\n\n[${citationId}]\n`,
    result: {
      schema_version: "1.0",
      status: "ok",
      request: { query: "q", depth: "focused", max_tokens: 12000, sources: [] },
      metrics: {
        candidates_considered: 1,
        units_selected: 1,
        sources_used: 1,
        estimated_tokens: 10,
      },
      units: [resultUnit(citationId)],
      sources: [],
      coverage: {
        units_by_type: {},
        units_by_source: {},
        omitted_for_budget: 0,
        budget_exhausted: false,
      },
      warnings: [],
      limitations: [],
    },
  };
}

function uncitedBundle(citationId: string): ContextBundle {
  return {
    markdown: "# Context package\n",
    result: wellFormedBundle(citationId).result,
  };
}

async function writeSeedQueries(directory: string): Promise<string> {
  const path = join(directory, "seed-queries.json");
  await writeFile(path, JSON.stringify(seedQueriesFixture), "utf8");
  return path;
}

function fakeApplication(
  bundleFor: (queryText: string, depth: string) => ContextBundle,
): { app: SeedQueryApplication; calls: { query: string; depth: string }[] } {
  const calls: { query: string; depth: string }[] = [];
  const app: SeedQueryApplication = {
    assembleContext: (request) => {
      calls.push({ query: request.query.text, depth: request.budget.depth });
      return Promise.resolve(
        bundleFor(request.query.text, request.budget.depth),
      );
    },
    close: () => Promise.resolve(),
  };
  return { app, calls };
}

void test("generates one bundle per query per depth preset under <out>/<date>/<query-id>/<depth>", async () => {
  const directory = await mkdtemp(join(tmpdir(), "auto-youtube-rag-eval-"));
  try {
    const queriesPath = await writeSeedQueries(directory);
    const { app, calls } = fakeApplication(() => wellFormedBundle("S01"));

    const result = await runSeedQueries({
      homeDir: join(directory, "home"),
      modelCachePath: join(directory, "models"),
      queriesPath,
      outDir: join(directory, "results"),
      date: "2026-08-12",
      createApplicationFn: () => app,
    });

    assert.equal(result.generatedBundles, 6); // 2 queries x 3 depths
    assert.equal(calls.length, 6);
    assert.deepEqual(
      new Set(calls.map((call) => call.depth)),
      new Set(contextDepths),
    );

    for (const queryId of ["query-a", "query-b"]) {
      for (const depth of contextDepths) {
        const bundleDir = join(
          directory,
          "results",
          "2026-08-12",
          queryId,
          depth,
        );
        const markdown = await readFile(join(bundleDir, "context.md"), "utf8");
        assert.match(markdown, /\[S01\]/);
        const resultJson = JSON.parse(
          await readFile(join(bundleDir, "result.json"), "utf8"),
        ) as { units: readonly { citation_id: string }[] };
        assert.equal(resultJson.units[0]?.citation_id, "S01");
      }
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

void test("aborts with an explicit message identifying the query and depth on a citation mismatch", async () => {
  const directory = await mkdtemp(join(tmpdir(), "auto-youtube-rag-eval-"));
  try {
    const queriesPath = await writeSeedQueries(directory);
    const { app } = fakeApplication(() => uncitedBundle("S01"));

    await assert.rejects(
      runSeedQueries({
        homeDir: join(directory, "home"),
        modelCachePath: join(directory, "models"),
        queriesPath,
        outDir: join(directory, "results"),
        date: "2026-08-12",
        createApplicationFn: () => app,
      }),
      /Citation integrity check failed for query "query-a" at depth "focused"/,
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

void test("--model-cache default resolves the same path as the product's resolvePaths", () => {
  function fixtureHomedir(): string {
    return "C:/Users/fixture-eval-user";
  }

  const withoutFlag = resolveModelCachePath(undefined, {}, fixtureHomedir);
  assert.equal(withoutFlag, resolvePaths({}, fixtureHomedir).modelsPath);

  const withEnvHome = resolveModelCachePath(
    undefined,
    { AUTO_YOUTUBE_RAG_HOME: "D:/custom-home" },
    fixtureHomedir,
  );
  assert.equal(
    withEnvHome,
    resolvePaths({ AUTO_YOUTUBE_RAG_HOME: "D:/custom-home" }, fixtureHomedir)
      .modelsPath,
  );

  const withFlag = resolveModelCachePath(
    "E:/explicit-models",
    {},
    fixtureHomedir,
  );
  assert.equal(withFlag, resolve("E:/explicit-models"));
});

void test("never writes outside the requested output directory", async () => {
  const directory = await mkdtemp(join(tmpdir(), "auto-youtube-rag-eval-"));
  try {
    const queriesPath = await writeSeedQueries(directory);
    const { app } = fakeApplication(() => wellFormedBundle("S01"));
    const outDir = join(directory, "results");

    await runSeedQueries({
      homeDir: join(directory, "home"),
      modelCachePath: join(directory, "models"),
      queriesPath,
      outDir,
      date: "2026-08-12",
      createApplicationFn: () => app,
    });

    const siblingsOfOut = await readFile(queriesPath, "utf8");
    assert.ok(siblingsOfOut.length > 0); // the fixture itself is untouched
    const bundleDir = join(outDir, "2026-08-12", "query-a", "focused");
    await assert.doesNotReject(readFile(join(bundleDir, "context.md"), "utf8"));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
