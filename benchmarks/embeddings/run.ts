import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { performance } from "node:perf_hooks";
import path from "node:path";
import process from "node:process";
import { env, pipeline } from "@huggingface/transformers";

type Passage = { id: string; source: string; text: string };
type Query = { id: string; text: string; relevant: string[] };
type Fixture = {
  schema_version: string;
  description: string;
  passages: Passage[];
  queries: Query[];
};

type ModelDefinition = {
  id: string;
  repository: string;
  dimensions: number;
  e5Prefixes: boolean;
  modelFileName?: string;
};

type RankedResult = { passage_id: string; score: number };

type ModelResult = {
  id: string;
  repository: string;
  status: "ok" | "error";
  error?: string;
  dimensions?: number;
  cache_bytes?: number;
  load_ms?: number;
  passage_embedding_ms?: number;
  passages_per_second?: number;
  query_embedding_ms?: number;
  mean_query_ms?: number;
  rss_before_mb?: number;
  rss_after_mb?: number;
  hit_at_1?: number;
  recall_at_5?: number;
  mrr?: number;
  rankings?: Array<{
    query_id: string;
    relevant: string[];
    first_relevant_rank: number | null;
    top: RankedResult[];
  }>;
};

const models: ModelDefinition[] = [
  {
    id: "e5-small",
    repository: "Xenova/multilingual-e5-small",
    dimensions: 384,
    e5Prefixes: true,
  },
  {
    id: "minilm",
    repository: "Xenova/paraphrase-multilingual-MiniLM-L12-v2",
    dimensions: 384,
    e5Prefixes: false,
  },
  {
    id: "e5-base",
    repository: "Xenova/multilingual-e5-base",
    dimensions: 768,
    e5Prefixes: true,
  },
  {
    id: "jina-es",
    repository: "jinaai/jina-embeddings-v2-base-es",
    dimensions: 768,
    e5Prefixes: false,
    modelFileName: "model",
  },
];

const projectRoot = path.resolve(import.meta.dirname, "../..");
const cacheDir = path.join(projectRoot, ".cache", "models");
const fixturePath = path.join(import.meta.dirname, "fixture.json");
const resultsDir = path.join(import.meta.dirname, "results");

env.cacheDir = cacheDir;
env.allowLocalModels = true;
env.allowRemoteModels = true;

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

function outputName(): string {
  const argument = process.argv.find((value) => value.startsWith("--output="));
  return argument ? argument.slice("--output=".length) : "latest";
}

function selectedModels(): ModelDefinition[] {
  const argument = process.argv.find((value) => value.startsWith("--models="));
  if (!argument) return models;
  const ids = new Set(argument.slice("--models=".length).split(","));
  return models.filter((model) => ids.has(model.id));
}

function rssMb(): number {
  return Math.round((process.memoryUsage().rss / 1024 / 1024) * 10) / 10;
}

function dot(left: number[], right: number[]): number {
  let score = 0;
  for (let index = 0; index < left.length; index += 1) {
    score += left[index]! * right[index]!;
  }
  return score;
}

async function directorySize(directory: string): Promise<number> {
  if (!existsSync(directory)) return 0;
  const { readdir, stat } = await import("node:fs/promises");
  let total = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    total += entry.isDirectory()
      ? await directorySize(entryPath)
      : (await stat(entryPath)).size;
  }
  return total;
}

async function locateModelCache(model: ModelDefinition): Promise<string> {
  const direct = path.join(cacheDir, model.repository);
  if (existsSync(direct)) return direct;
  const slug = model.repository.replaceAll("/", path.sep);
  const alternative = path.join(cacheDir, slug);
  return existsSync(alternative) ? alternative : cacheDir;
}

function asMatrix(output: unknown): number[][] {
  const tensor = output as { tolist(): unknown };
  const value = tensor.tolist();
  if (!Array.isArray(value) || !Array.isArray(value[0])) {
    throw new Error("The model did not return a two-dimensional embedding tensor.");
  }
  return value as number[][];
}

async function createExtractor(model: ModelDefinition, localOnly: boolean) {
  const options: Record<string, unknown> = {
    dtype: "q8",
    cache_dir: cacheDir,
    local_files_only: localOnly,
  };
  if (model.modelFileName) options.model_file_name = model.modelFileName;
  return pipeline("feature-extraction", model.repository, options);
}

async function disposeExtractor(extractor: unknown): Promise<void> {
  const disposable = extractor as { dispose?: () => void | Promise<void> };
  await disposable.dispose?.();
}

async function benchmarkModel(
  model: ModelDefinition,
  fixture: Fixture,
  localOnly: boolean,
  downloadOnly: boolean,
  smoke: boolean,
): Promise<ModelResult> {
  const result: ModelResult = {
    id: model.id,
    repository: model.repository,
    status: "error",
  };
  const passages = smoke ? fixture.passages.slice(0, 6) : fixture.passages;
  const queries = smoke ? fixture.queries.slice(0, 4) : fixture.queries;
  const beforeRss = rssMb();
  let extractor: Awaited<ReturnType<typeof createExtractor>> | undefined;

  try {
    console.log(`[${model.id}] loading ${model.repository}`);
    const loadStart = performance.now();
    extractor = await createExtractor(model, localOnly);
    result.load_ms = Math.round((performance.now() - loadStart) * 10) / 10;
    result.rss_before_mb = beforeRss;

    const warmupText = model.e5Prefixes
      ? "query: diseño con jerarquía visual"
      : "diseño con jerarquía visual";
    const warmup = await extractor(warmupText, {
      pooling: "mean",
      normalize: true,
    });
    const warmupMatrix = asMatrix(warmup);
    const dimensions = warmupMatrix[0]?.length ?? 0;
    if (dimensions !== model.dimensions) {
      throw new Error(`Expected ${model.dimensions} dimensions, received ${dimensions}.`);
    }
    result.dimensions = dimensions;
    result.cache_bytes = await directorySize(await locateModelCache(model));

    if (downloadOnly) {
      result.status = "ok";
      result.rss_after_mb = rssMb();
      console.log(`[${model.id}] downloaded and verified (${dimensions} dimensions)`);
      return result;
    }

    const passageInputs = passages.map((passage) =>
      model.e5Prefixes ? `passage: ${passage.text}` : passage.text,
    );
    const passageStart = performance.now();
    const passageOutput = await extractor(passageInputs, {
      pooling: "mean",
      normalize: true,
    });
    const passageVectors = asMatrix(passageOutput);
    const passageMs = performance.now() - passageStart;
    result.passage_embedding_ms = Math.round(passageMs * 10) / 10;
    result.passages_per_second =
      Math.round((passages.length / (passageMs / 1000)) * 100) / 100;

    const rankings: NonNullable<ModelResult["rankings"]> = [];
    let queryTotalMs = 0;
    for (const query of queries) {
      const queryInput = model.e5Prefixes ? `query: ${query.text}` : query.text;
      const queryStart = performance.now();
      const queryOutput = await extractor(queryInput, {
        pooling: "mean",
        normalize: true,
      });
      queryTotalMs += performance.now() - queryStart;
      const queryVector = asMatrix(queryOutput)[0]!;
      const ranked = passageVectors
        .map((vector, index) => ({
          passage_id: passages[index]!.id,
          score: dot(queryVector, vector),
        }))
        .sort((left, right) => right.score - left.score);
      const firstRelevantIndex = ranked.findIndex((item) =>
        query.relevant.includes(item.passage_id),
      );
      rankings.push({
        query_id: query.id,
        relevant: query.relevant,
        first_relevant_rank: firstRelevantIndex < 0 ? null : firstRelevantIndex + 1,
        top: ranked.slice(0, 5).map((item) => ({
          passage_id: item.passage_id,
          score: Math.round(item.score * 1_000_000) / 1_000_000,
        })),
      });
    }

    const reciprocalRanks = rankings.map((ranking) =>
      ranking.first_relevant_rank ? 1 / ranking.first_relevant_rank : 0,
    );
    result.query_embedding_ms = Math.round(queryTotalMs * 10) / 10;
    result.mean_query_ms = Math.round((queryTotalMs / queries.length) * 10) / 10;
    result.hit_at_1 =
      rankings.filter((ranking) => ranking.first_relevant_rank === 1).length /
      queries.length;
    result.recall_at_5 =
      rankings.filter(
        (ranking) =>
          ranking.first_relevant_rank !== null && ranking.first_relevant_rank <= 5,
      ).length / queries.length;
    result.mrr =
      reciprocalRanks.reduce((sum, value) => sum + value, 0) / queries.length;
    result.rss_after_mb = rssMb();
    result.rankings = rankings;
    result.status = "ok";
    console.log(
      `[${model.id}] hit@1=${result.hit_at_1.toFixed(3)} mrr=${result.mrr.toFixed(3)} mean=${result.mean_query_ms}ms`,
    );
    return result;
  } catch (error) {
    result.error = error instanceof Error ? error.stack ?? error.message : String(error);
    result.rss_after_mb = rssMb();
    console.error(`[${model.id}] failed: ${result.error}`);
    return result;
  } finally {
    if (extractor) await disposeExtractor(extractor);
  }
}

function formatNumber(value: number | undefined, digits = 3): string {
  return value === undefined ? "—" : value.toFixed(digits);
}

function renderMarkdown(results: ModelResult[], generatedAt: string): string {
  const rows = results.map((result) => {
    const cacheMb = result.cache_bytes === undefined
      ? "—"
      : (result.cache_bytes / 1024 / 1024).toFixed(1);
    return `| ${result.id} | ${result.status} | ${formatNumber(result.hit_at_1)} | ${formatNumber(result.recall_at_5)} | ${formatNumber(result.mrr)} | ${formatNumber(result.mean_query_ms, 1)} | ${formatNumber(result.passages_per_second, 1)} | ${cacheMb} | ${result.rss_after_mb ?? "—"} |`;
  });
  const errors = results
    .filter((result) => result.error)
    .map((result) => `- **${result.id}:** ${result.error!.split("\n")[0]}`);
  return `# Resultado del benchmark de embeddings\n\nGenerado: ${generatedAt}\n\n| Modelo | Estado | Hit@1 | Recall@5 | MRR | Consulta ms | Pasajes/s | Caché MB | RSS MB |\n| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |\n${rows.join("\n")}\n\n## Errores\n\n${errors.length ? errors.join("\n") : "Sin errores."}\n`;
}

async function main(): Promise<void> {
  const localOnly = hasFlag("--local-only");
  const downloadOnly = hasFlag("--download-only");
  const smoke = hasFlag("--smoke");
  await mkdir(cacheDir, { recursive: true });
  await mkdir(resultsDir, { recursive: true });
  const resultName = outputName();
  const jsonOutput = path.join(resultsDir, `${resultName}.json`);
  const markdownOutput = path.join(resultsDir, `${resultName}.md`);
  const fixture = JSON.parse(await readFile(fixturePath, "utf8")) as Fixture;
  const generatedAt = new Date().toISOString();
  const results: ModelResult[] = [];

  for (const model of selectedModels()) {
    results.push(
      await benchmarkModel(model, fixture, localOnly, downloadOnly, smoke),
    );
  }

  const payload = {
    schema_version: "1.0",
    generated_at: generatedAt,
    mode: downloadOnly ? "download" : smoke ? "smoke" : "benchmark",
    local_files_only: localOnly,
    runtime: {
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      cpu: (await import("node:os")).cpus()[0]?.model,
      logical_processors: (await import("node:os")).cpus().length,
      total_ram_gb:
        Math.round(((await import("node:os")).totalmem() / 1024 ** 3) * 10) / 10,
    },
    fixture: {
      passages: smoke ? 6 : fixture.passages.length,
      queries: smoke ? 4 : fixture.queries.length,
    },
    results,
  };
  await writeFile(jsonOutput, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  await writeFile(markdownOutput, renderMarkdown(results, generatedAt), "utf8");
  console.log(`Results: ${jsonOutput}`);
  if (results.every((result) => result.status === "error")) process.exitCode = 1;
}

await main();
