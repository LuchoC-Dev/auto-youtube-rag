#!/usr/bin/env -S node --import tsx
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import process from "node:process";
import { parseArgs } from "node:util";
import { fileURLToPath, pathToFileURL } from "node:url";

import { checkCitationIntegrity } from "./citation-integrity.js";
import {
  ContextBudget,
  contextDepths,
} from "../src/domain/context/context-budget.js";
import { RetrievalFilter } from "../src/domain/retrieval/retrieval-filter.js";
import { RetrievalQuery } from "../src/domain/retrieval/retrieval-query.js";
import { resolvePaths } from "../src/infrastructure/config/resolve-paths.js";
import { writeContextBundle } from "../src/infrastructure/filesystem/write-context-bundle.js";
import type {
  Application,
  ApplicationConfig,
} from "../src/main/create-application.js";
import { createApplication } from "../src/main/create-application.js";

const evalsDir = dirname(fileURLToPath(import.meta.url));

/**
 * `runSeedQueries` only ever calls `assembleContext` and `close`, so it asks
 * for no more than that — a test can inject a stub without building a whole
 * fake `Application` (source registry, sync, vector index, ...).
 */
export type SeedQueryApplication = Pick<
  Application,
  "assembleContext" | "close"
>;

export interface SeedQuery {
  readonly id: string;
  readonly text: string;
  readonly language: string;
  readonly kind: string;
  readonly expected: { readonly notes: string };
}

interface SeedQueriesFile {
  readonly schema_version: string;
  readonly queries: readonly SeedQuery[];
}

export interface RunSeedQueriesOptions {
  /** Path to an already-synced `.auto-youtube-rag` home directory, i.e. the
   * one that contains `index.sqlite` after `init` + `source add` + `sync`
   * ran against the collection under evaluation. This script never syncs
   * anything itself. */
  readonly homeDir: string;
  readonly modelCachePath: string;
  readonly queriesPath: string;
  /** Bundles land under `<outDir>/<date>/<query-id>/<depth>/`. */
  readonly outDir: string;
  readonly date: string;
  readonly createApplicationFn?: (
    config: ApplicationConfig,
  ) => SeedQueryApplication;
}

export interface RunSeedQueriesResult {
  readonly generatedBundles: number;
  readonly resultsDir: string;
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Resolves the `--model-cache` default through the same `resolvePaths`
 * function the product uses (see `docs/install-design.md`, block V), so this
 * harness can never drift to a different default than `src/main.ts`. The
 * flag remains an explicit override.
 */
export function resolveModelCachePath(
  flagValue: string | undefined,
  env: NodeJS.ProcessEnv,
  homedirFn: () => string,
): string {
  return resolve(flagValue ?? resolvePaths(env, homedirFn).modelsPath);
}

async function loadSeedQueries(path: string): Promise<readonly SeedQuery[]> {
  const raw = await readFile(path, "utf8");
  const parsed = JSON.parse(raw) as SeedQueriesFile;
  return parsed.queries;
}

/**
 * `writeContextBundle` nests every write under `<outputDir>/<requestId>/` so
 * that a repeated `request_id` never mixes files. Here the directory that
 * already disambiguates a run is `<outDir>/<date>/<query-id>/<depth>/`, so
 * this generator returns the empty string: `path.join(dir, "")` is `dir`
 * itself, and a genuine repeat (same date/query/depth run twice) still fails
 * explicitly via `WriteContextBundleError` instead of overwriting a bundle.
 */
function noAdditionalNesting(): string {
  return "";
}

/**
 * Runs the eight seed queries at the three depth presets (24 bundles total)
 * against a real, already-synced `Application`, verifying citation
 * integrity (M1) on every bundle before writing it. Reuses
 * `assembleContext`/`writeContextBundle` directly — it never shells out to
 * the CLI binary — so a mismatch here is a real assembly bug, not a
 * CLI-parsing artifact.
 */
export async function runSeedQueries(
  options: RunSeedQueriesOptions,
): Promise<RunSeedQueriesResult> {
  const application: SeedQueryApplication = (
    options.createApplicationFn ?? createApplication
  )({
    databasePath: join(options.homeDir, "index.sqlite"),
    modelCachePath: options.modelCachePath,
  });

  const resultsDir = join(options.outDir, options.date);
  let generatedBundles = 0;

  try {
    const queries = await loadSeedQueries(options.queriesPath);

    for (const seedQuery of queries) {
      for (const depth of contextDepths) {
        const bundle = await application.assembleContext({
          query: RetrievalQuery.create({
            text: seedQuery.text,
            filter: RetrievalFilter.empty(),
          }),
          budget: ContextBudget.create({ depth }),
        });

        const issues = checkCitationIntegrity(bundle);
        if (issues.length > 0) {
          throw new Error(
            `Citation integrity check failed for query "${seedQuery.id}" at depth "${depth}": ${JSON.stringify(issues)}`,
          );
        }

        await writeContextBundle(
          bundle,
          join(resultsDir, seedQuery.id, depth),
          noAdditionalNesting,
        );
        generatedBundles += 1;
      }
    }
  } finally {
    await application.close();
  }

  return { generatedBundles, resultsDir };
}

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      home: { type: "string" },
      "model-cache": { type: "string" },
      queries: { type: "string" },
      out: { type: "string" },
      date: { type: "string" },
    },
    strict: true,
  });

  if (values.home === undefined) {
    throw new Error(
      "--home is required: path to an already-synced .auto-youtube-rag directory (must contain index.sqlite).",
    );
  }

  const result = await runSeedQueries({
    homeDir: resolve(values.home),
    modelCachePath: resolveModelCachePath(
      values["model-cache"],
      process.env,
      homedir,
    ),
    queriesPath: resolve(
      values.queries ?? join(evalsDir, "queries", "seed-queries.json"),
    ),
    outDir: resolve(values.out ?? join(evalsDir, "results")),
    date: values.date ?? todayIsoDate(),
  });

  process.stdout.write(
    `Generated ${String(result.generatedBundles)} bundles under ${result.resultsDir}\n`,
  );
}

const entryPoint = process.argv[1];
if (
  entryPoint !== undefined &&
  pathToFileURL(resolve(entryPoint)).href === import.meta.url
) {
  main().catch((error: unknown) => {
    process.stderr.write(
      `${error instanceof Error ? (error.stack ?? error.message) : String(error)}\n`,
    );
    process.exitCode = 1;
  });
}
