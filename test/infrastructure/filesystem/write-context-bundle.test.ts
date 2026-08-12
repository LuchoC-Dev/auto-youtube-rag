import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";

import {
  WriteContextBundleError,
  writeContextBundle,
} from "../../../src/infrastructure/filesystem/write-context-bundle.js";
import type { ContextBundle } from "../../../src/application/context/context-bundle.js";

const roots: string[] = [];

after(async () => {
  await Promise.all(
    roots.map((root) => rm(root, { recursive: true, force: true })),
  );
});

async function tempOutputDir(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "context-bundle-"));
  roots.push(root);
  return root;
}

function sampleBundle(): ContextBundle {
  return {
    markdown: "# Context package\n",
    result: {
      schema_version: "1.0",
      status: "ok",
      request: {
        query: "brutalismo",
        depth: "balanced",
        max_tokens: 32_000,
        sources: [],
      },
      metrics: {
        candidates_considered: 1,
        units_selected: 1,
        sources_used: 1,
        estimated_tokens: 10,
      },
      units: [],
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

void test("writes context.md and result.json under a request id directory", async () => {
  const outputDir = await tempOutputDir();

  const written = await writeContextBundle(
    sampleBundle(),
    outputDir,
    () => "req-1",
  );

  assert.equal(written.requestId, "req-1");
  assert.equal(written.contextPath, join(outputDir, "req-1", "context.md"));
  assert.equal(written.resultPath, join(outputDir, "req-1", "result.json"));

  const markdown = await readFile(written.contextPath, "utf8");
  const result: unknown = JSON.parse(
    await readFile(written.resultPath, "utf8"),
  );

  assert.equal(markdown, "# Context package\n");
  assert.ok(result !== null && typeof result === "object");
  assert.equal((result as { status: unknown }).status, "ok");
});

void test("uses the injected request id generator", async () => {
  const outputDir = await tempOutputDir();
  let calls = 0;

  const written = await writeContextBundle(sampleBundle(), outputDir, () => {
    calls += 1;
    return "deterministic-id";
  });

  assert.equal(calls, 1);
  assert.equal(written.requestId, "deterministic-id");
});

void test("fails explicitly instead of mixing files into an existing request directory", async () => {
  const outputDir = await tempOutputDir();
  await mkdir(join(outputDir, "already-used"), { recursive: true });

  await assert.rejects(
    writeContextBundle(sampleBundle(), outputDir, () => "already-used"),
    (error: unknown) => {
      assert.ok(error instanceof WriteContextBundleError);
      assert.equal(error.code, "REQUEST_ID_ALREADY_USED");
      return true;
    },
  );
});

void test("never writes outside the request id subdirectory", async () => {
  const outputDir = await tempOutputDir();

  await writeContextBundle(sampleBundle(), outputDir, () => "scoped");

  const stray = await readFile(
    join(outputDir, "scoped", "context.md"),
    "utf8",
  ).catch(() => null);
  assert.ok(stray !== null);

  await assert.rejects(readFile(join(outputDir, "context.md"), "utf8"));
});
