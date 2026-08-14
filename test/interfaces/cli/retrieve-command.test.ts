import assert from "node:assert/strict";
import { access, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import type { ContextBundle } from "../../../src/application/context/context-bundle.js";
import type { ContextRequest } from "../../../src/application/context/context-request.js";
import { runCli, type CliWriter } from "../../../src/interfaces/cli/run-cli.js";
import { createApplication } from "../../../src/main/create-application.js";
import { installFakeModel } from "../../helpers/install-fake-model.js";

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

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function sampleBundle(
  overrides: {
    readonly status?: "ok" | "no_results";
    readonly warnings?: ContextBundle["result"]["warnings"];
  } = {},
): ContextBundle {
  return {
    markdown: "# Context package\n",
    result: {
      schema_version: "1.0",
      status: overrides.status ?? "ok",
      request: {
        query: "brutalismo",
        depth: "balanced",
        max_tokens: 32_000,
        sources: [],
      },
      metrics: {
        candidates_considered: 1,
        units_selected: overrides.status === "no_results" ? 0 : 1,
        sources_used: overrides.status === "no_results" ? 0 : 1,
        estimated_tokens: overrides.status === "no_results" ? 0 : 10,
      },
      units: [],
      sources: [],
      coverage: {
        units_by_type: {},
        units_by_source: {},
        omitted_for_budget: 0,
        budget_exhausted: false,
      },
      warnings: overrides.warnings ?? [],
      limitations: [],
    },
  };
}

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), "auto-youtube-rag-retrieve-"));
  const collection = join(root, "collection");
  const modelCachePath = join(root, "models");
  await mkdir(join(collection, "videos"), { recursive: true });
  await writeFile(join(collection, "manifest.json"), '{"videos":[]}', "utf8");
  await mkdir(modelCachePath, { recursive: true });
  await installFakeModel(modelCachePath);
  return {
    root,
    config: {
      databasePath: join(root, "data", "index.sqlite"),
      modelCachePath,
    },
  };
}

async function command(
  argv: readonly string[],
  config: { readonly databasePath: string; readonly modelCachePath: string },
  bundle: ContextBundle,
  onRequest?: (request: ContextRequest) => void,
) {
  const stdout = new BufferWriter();
  const stderr = new BufferWriter();
  const exitCode = await runCli({
    argv,
    config,
    stdout,
    stderr,
    applicationFactory: (applicationConfig) => {
      const application = createApplication(applicationConfig);
      return {
        ...application,
        assembleContext: (request: ContextRequest) => {
          onRequest?.(request);
          return Promise.resolve(bundle);
        },
      };
    },
  });
  return { exitCode, stdout: stdout.value, stderr: stderr.value };
}

void test("writes the bundle and emits a compact ok receipt", async () => {
  const setup = await fixture();
  const outDir = join(setup.root, "out");
  try {
    await command(["init", "--skip-model"], setup.config, sampleBundle());

    const result = await command(
      ["retrieve", "brutalismo", "--out", outDir],
      setup.config,
      sampleBundle(),
    );

    assert.equal(result.exitCode, 0);
    const receipt = json(result.stdout);
    assert.equal(receipt.status, "ok");
    assert.equal(receipt.schema_version, "1.0");
    assert.equal(typeof receipt.request_id, "string");
    assert.equal(receipt.estimated_tokens, 10);
    assert.equal(receipt.sources_used, 1);
    assert.deepEqual(receipt.warnings, []);
    assert.ok(typeof receipt.context_path === "string");
    assert.ok(await exists(receipt.context_path));
    assert.equal(result.stderr, "Retrieving context...\n");
  } finally {
    await rm(setup.root, { recursive: true, force: true });
  }
});

void test("uses a temporary directory when --out is not given", async () => {
  const setup = await fixture();
  try {
    await command(["init", "--skip-model"], setup.config, sampleBundle());
    const result = await command(
      ["retrieve", "brutalismo"],
      setup.config,
      sampleBundle(),
    );

    assert.equal(result.exitCode, 0);
    const receipt = json(result.stdout);
    assert.ok(await exists(receipt.context_path as string));
  } finally {
    await rm(setup.root, { recursive: true, force: true });
  }
});

void test("reports no_results with exit code 0", async () => {
  const setup = await fixture();
  try {
    await command(["init", "--skip-model"], setup.config, sampleBundle());
    const result = await command(
      ["retrieve", "consulta sin evidencia"],
      setup.config,
      sampleBundle({ status: "no_results" }),
    );

    assert.equal(result.exitCode, 0);
    assert.equal(json(result.stdout).status, "no_results");
  } finally {
    await rm(setup.root, { recursive: true, force: true });
  }
});

void test("reports partial with exit code 1 when a retrieval path degraded", async () => {
  const setup = await fixture();
  try {
    await command(["init", "--skip-model"], setup.config, sampleBundle());
    const result = await command(
      ["retrieve", "brutalismo"],
      setup.config,
      sampleBundle({
        warnings: [
          {
            code: "TEXT_SEARCH_UNAVAILABLE",
            path: "text",
            message: "The lexical search path failed.",
          },
        ],
      }),
    );

    assert.equal(result.exitCode, 1);
    assert.equal(json(result.stdout).status, "partial");
  } finally {
    await rm(setup.root, { recursive: true, force: true });
  }
});

void test("passes depth, max-tokens and repeated source filters through to the request", async () => {
  const setup = await fixture();
  let captured: ContextRequest | undefined;
  try {
    await command(["init", "--skip-model"], setup.config, sampleBundle());
    await command(
      [
        "retrieve",
        "brutalismo",
        "--depth",
        "deep",
        "--max-tokens",
        "5000",
        "--source",
        "auto-design",
        "--source",
        "catalog-design",
      ],
      setup.config,
      sampleBundle(),
      (request) => {
        captured = request;
      },
    );

    assert.ok(captured);
    assert.equal(captured.budget.depth, "deep");
    assert.equal(captured.budget.maxTokens, 5000);
    assert.deepEqual(
      captured.query.filter.sources.map((source) => source.value),
      ["auto-design", "catalog-design"],
    );
  } finally {
    await rm(setup.root, { recursive: true, force: true });
  }
});

void test("returns usage exit code 2 for invalid arguments without touching the application", async () => {
  const setup = await fixture();
  try {
    const result = await command(
      ["retrieve", "brutalismo", "--depth", "shallow"],
      setup.config,
      sampleBundle(),
    );

    assert.equal(result.exitCode, 2);
    assert.equal(record(json(result.stdout).error).code, "INVALID_ARGUMENTS");
  } finally {
    await rm(setup.root, { recursive: true, force: true });
  }
});

void test("LOW_RELEVANCE keeps status ok and exit code 0", async () => {
  const setup = await fixture();
  try {
    await command(["init", "--skip-model"], setup.config, sampleBundle());
    const result = await command(
      ["retrieve", "diabetes tipo 2"],
      setup.config,
      sampleBundle({
        warnings: [
          {
            code: "LOW_RELEVANCE",
            path: "vector",
            message:
              "The closest match scored 0.8206 against a 0.84 relevance floor.",
          },
        ],
      }),
    );

    // Nothing degraded: every path ran and the bundle is complete. The
    // warning is about the library not covering the topic, which is a fact
    // about the corpus, not a failure of the command.
    assert.equal(result.exitCode, 0);
    const receipt = json(result.stdout);
    assert.equal(receipt.status, "ok");
    assert.equal(
      (receipt.warnings as readonly { code: string }[])[0]?.code,
      "LOW_RELEVANCE",
    );
  } finally {
    await rm(setup.root, { recursive: true, force: true });
  }
});

void test("a real degradation still outranks an informational warning", async () => {
  const setup = await fixture();
  try {
    await command(["init", "--skip-model"], setup.config, sampleBundle());
    const result = await command(
      ["retrieve", "brutalismo"],
      setup.config,
      sampleBundle({
        warnings: [
          {
            code: "LOW_RELEVANCE",
            path: "vector",
            message: "Low relevance.",
          },
          {
            code: "TEXT_SEARCH_UNAVAILABLE",
            path: "text",
            message: "The lexical search path failed.",
          },
        ],
      }),
    );

    assert.equal(result.exitCode, 1);
    assert.equal(json(result.stdout).status, "partial");
  } finally {
    await rm(setup.root, { recursive: true, force: true });
  }
});
