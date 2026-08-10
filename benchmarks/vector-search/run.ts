import { spawnSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { cpus, totalmem } from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import * as sqliteVec from "sqlite-vec";

type Backend = "memory" | "sqlite-vec";

type RankedItem = { id: number; distance: number };

type WorkerResult = {
  backend: Backend;
  size_requested: number;
  size_after_operations: number;
  dimensions: number;
  queries: number;
  k: number;
  sqlite_vec_version?: string;
  extension_path?: string;
  insert_ms: number;
  rows_per_second: number;
  update_delete_ms: number;
  reopen_ms: number;
  index_load_ms: number;
  query_mean_ms: number;
  query_p50_ms: number;
  query_p95_ms: number;
  queries_per_second: number;
  hit_at_1: number;
  stale_delete_absent: boolean;
  updated_vector_found: boolean;
  database_bytes: number;
  rss_before_mb: number;
  rss_after_insert_mb: number;
  rss_after_load_mb: number;
  rss_after_queries_mb: number;
  rankings: Array<{ query_id: number; expected_id: number; top: RankedItem[] }>;
};

type Comparison = {
  size: number;
  top_k_overlap: number;
  identical_top_1: number;
  sqlite_vec_query_speedup: number;
  sqlite_vec_rss_saving_mb: number;
  sqlite_vec_disk_overhead_mb: number;
};

const dimensions = 384;
const projectRoot = path.resolve(import.meta.dirname, "../..");
const cacheDir = path.join(projectRoot, ".cache", "vector-benchmark");
const resultsDir = path.join(import.meta.dirname, "results");
const currentFile = fileURLToPath(import.meta.url);

function argument(name: string): string | undefined {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length);
}

function hasFlag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

function numericArgument(name: string, fallback: number): number {
  const value = Number(argument(name) ?? fallback);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`--${name} must be a positive integer.`);
  }
  return value;
}

function round(value: number, digits = 2): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function rssMb(): number {
  return round(process.memoryUsage().rss / 1024 / 1024, 1);
}

function percentile(values: number[], fraction: number): number {
  const sorted = [...values].sort((left, right) => left - right);
  const index = Math.min(sorted.length - 1, Math.ceil(sorted.length * fraction) - 1);
  return sorted[index] ?? 0;
}

function mix32(value: number): number {
  let mixed = value | 0;
  mixed = Math.imul(mixed ^ (mixed >>> 16), 0x45d9f3b);
  mixed = Math.imul(mixed ^ (mixed >>> 16), 0x45d9f3b);
  return (mixed ^ (mixed >>> 16)) >>> 0;
}

function vectorFor(id: number, seed: number): Float32Array {
  let state = mix32(id ^ seed) || 1;
  const vector = new Float32Array(dimensions);
  let norm = 0;
  for (let index = 0; index < dimensions; index += 1) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    const value = (state >>> 0) / 0xffffffff * 2 - 1;
    vector[index] = value;
    norm += value * value;
  }
  const scale = 1 / Math.sqrt(norm);
  for (let index = 0; index < dimensions; index += 1) {
    vector[index]! *= scale;
  }
  return vector;
}

function asBlob(vector: Float32Array): Uint8Array {
  return new Uint8Array(vector.buffer, vector.byteOffset, vector.byteLength);
}

function bindInteger(backend: Backend, value: number): number | bigint {
  return backend === "sqlite-vec" ? BigInt(value) : value;
}

function queryIds(size: number, count: number): number[] {
  const usable = size - 2;
  return Array.from({ length: count }, (_, index) =>
    1 + Math.floor((index * usable) / count),
  );
}

function insertRanked(top: RankedItem[], item: RankedItem, k: number): void {
  if (top.length === k && item.distance >= top[top.length - 1]!.distance) return;
  let index = top.length;
  while (index > 0 && top[index - 1]!.distance > item.distance) index -= 1;
  top.splice(index, 0, item);
  if (top.length > k) top.pop();
}

function l2Search(
  ids: Int32Array,
  vectors: Float32Array,
  query: Float32Array,
  k: number,
): RankedItem[] {
  const top: RankedItem[] = [];
  for (let row = 0; row < ids.length; row += 1) {
    const offset = row * dimensions;
    let distance = 0;
    for (let column = 0; column < dimensions; column += 1) {
      const difference = vectors[offset + column]! - query[column]!;
      distance += difference * difference;
    }
    insertRanked(top, { id: ids[row]!, distance }, k);
  }
  return top;
}

function databaseSize(databasePath: string): number {
  return [databasePath, `${databasePath}-wal`, `${databasePath}-shm`]
    .filter(existsSync)
    .reduce((sum, file) => sum + statSync(file).size, 0);
}

function openDatabase(databasePath: string, backend: Backend): DatabaseSync {
  const database = new DatabaseSync(databasePath, {
    allowExtension: backend === "sqlite-vec",
    timeout: 5_000,
  });
  if (backend === "sqlite-vec") sqliteVec.load(database);
  database.exec("PRAGMA journal_mode = DELETE; PRAGMA synchronous = NORMAL;");
  return database;
}

async function runWorker(): Promise<void> {
  const backend = argument("worker") as Backend;
  if (backend !== "memory" && backend !== "sqlite-vec") {
    throw new Error("Worker backend must be memory or sqlite-vec.");
  }
  const size = numericArgument("size", 10_000);
  const queries = numericArgument("queries", 30);
  const k = numericArgument("k", 20);
  const seed = numericArgument("seed", 20_260_810);
  const output = argument("output") ?? "latest";
  const databasePath = path.join(cacheDir, `${output}-${backend}-${size}.sqlite`);
  await mkdir(cacheDir, { recursive: true });
  await rm(databasePath, { force: true });

  const rssBefore = rssMb();
  let database = openDatabase(databasePath, backend);
  if (backend === "memory") {
    database.exec("CREATE TABLE vectors (id INTEGER PRIMARY KEY, embedding BLOB NOT NULL)");
  } else {
    database.exec(
      `CREATE VIRTUAL TABLE vectors USING vec0(id INTEGER PRIMARY KEY, embedding float[${dimensions}])`,
    );
  }

  const insert = database.prepare("INSERT INTO vectors(id, embedding) VALUES (?, ?)");
  const insertStart = performance.now();
  database.exec("BEGIN IMMEDIATE");
  try {
    for (let id = 1; id <= size; id += 1) {
      insert.run(bindInteger(backend, id), asBlob(vectorFor(id, seed)));
    }
    database.exec("COMMIT");
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
  const insertMs = performance.now() - insertStart;
  const rssAfterInsert = rssMb();

  const updatedId = size - 1;
  const deletedId = size;
  const updatedVector = vectorFor(updatedId, seed ^ 0x5f3759df);
  const operationStart = performance.now();
  database.exec("BEGIN IMMEDIATE");
  try {
    database.prepare("UPDATE vectors SET embedding = ? WHERE id = ?")
      .run(asBlob(updatedVector), bindInteger(backend, updatedId));
    database.prepare("DELETE FROM vectors WHERE id = ?")
      .run(bindInteger(backend, deletedId));
    database.exec("COMMIT");
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
  const updateDeleteMs = performance.now() - operationStart;
  database.close();

  const reopenStart = performance.now();
  database = openDatabase(databasePath, backend);
  const reopenMs = performance.now() - reopenStart;
  const countRow = database.prepare("SELECT count(*) AS count FROM vectors").get() as {
    count: number;
  };

  let ids = new Int32Array(0);
  let vectors = new Float32Array(0);
  const indexLoadStart = performance.now();
  if (backend === "memory") {
    const rows = database.prepare("SELECT id, embedding FROM vectors ORDER BY id").iterate() as Iterable<{
      id: number;
      embedding: Uint8Array;
    }>;
    ids = new Int32Array(Number(countRow.count));
    vectors = new Float32Array(Number(countRow.count) * dimensions);
    let rowIndex = 0;
    for (const row of rows) {
      ids[rowIndex] = row.id;
      const source = new Float32Array(
        row.embedding.buffer,
        row.embedding.byteOffset,
        row.embedding.byteLength / Float32Array.BYTES_PER_ELEMENT,
      );
      vectors.set(source, rowIndex * dimensions);
      rowIndex += 1;
    }
  }
  const indexLoadMs = performance.now() - indexLoadStart;
  const rssAfterLoad = rssMb();

  const selectedQueryIds = queryIds(size, queries);
  const latencies: number[] = [];
  const rankings: WorkerResult["rankings"] = [];
  const sqliteSearch = backend === "sqlite-vec"
    ? database.prepare(
        "SELECT id, distance FROM vectors WHERE embedding MATCH ? AND k = ? ORDER BY distance",
      )
    : undefined;

  for (const queryId of selectedQueryIds) {
    const query = vectorFor(queryId, seed);
    const started = performance.now();
    const top = backend === "memory"
      ? l2Search(ids, vectors, query, k)
      : (sqliteSearch!.all(asBlob(query), BigInt(k)) as Array<{
          id: number | bigint;
          distance: number;
        }>).map(
          (row) => ({ id: Number(row.id), distance: row.distance }),
        );
    latencies.push(performance.now() - started);
    rankings.push({
      query_id: queryId,
      expected_id: queryId,
      top: top.map((item) => ({ id: item.id, distance: round(item.distance, 8) })),
    });
  }

  const deletedQuery = vectorFor(deletedId, seed);
  const updatedQuery = updatedVector;
  const searchOperational = (query: Float32Array): RankedItem[] =>
    backend === "memory"
      ? l2Search(ids, vectors, query, 1)
      : (sqliteSearch!.all(asBlob(query), 1n) as Array<{
          id: number | bigint;
          distance: number;
        }>).map((row) => ({ id: Number(row.id), distance: row.distance }));
  const staleDeleteAbsent = searchOperational(deletedQuery)[0]?.id !== deletedId;
  const updatedVectorFound = searchOperational(updatedQuery)[0]?.id === updatedId;
  const rssAfterQueries = rssMb();
  const version = backend === "sqlite-vec"
    ? (database.prepare("SELECT vec_version() AS version").get() as { version: string }).version
    : undefined;
  database.close();

  const queryTotalMs = latencies.reduce((sum, value) => sum + value, 0);
  const result: WorkerResult = {
    backend,
    size_requested: size,
    size_after_operations: Number(countRow.count),
    dimensions,
    queries,
    k,
    sqlite_vec_version: version,
    extension_path: backend === "sqlite-vec"
      ? path.relative(projectRoot, sqliteVec.getLoadablePath()).replaceAll("\\", "/")
      : undefined,
    insert_ms: round(insertMs),
    rows_per_second: round(size / (insertMs / 1_000)),
    update_delete_ms: round(updateDeleteMs),
    reopen_ms: round(reopenMs),
    index_load_ms: round(indexLoadMs),
    query_mean_ms: round(queryTotalMs / latencies.length),
    query_p50_ms: round(percentile(latencies, 0.5)),
    query_p95_ms: round(percentile(latencies, 0.95)),
    queries_per_second: round(latencies.length / (queryTotalMs / 1_000)),
    hit_at_1: rankings.filter((ranking) => ranking.top[0]?.id === ranking.expected_id).length /
      rankings.length,
    stale_delete_absent: staleDeleteAbsent,
    updated_vector_found: updatedVectorFound,
    database_bytes: databaseSize(databasePath),
    rss_before_mb: rssBefore,
    rss_after_insert_mb: rssAfterInsert,
    rss_after_load_mb: rssAfterLoad,
    rss_after_queries_mb: rssAfterQueries,
    rankings,
  };
  process.stdout.write(`${JSON.stringify(result)}\n`);
}

function compare(memory: WorkerResult, sqlite: WorkerResult): Comparison {
  let overlap = 0;
  let identicalTop1 = 0;
  memory.rankings.forEach((ranking, index) => {
    const sqliteRanking = sqlite.rankings[index]!;
    const sqliteIds = new Set(sqliteRanking.top.map((item) => item.id));
    overlap += ranking.top.filter((item) => sqliteIds.has(item.id)).length / ranking.top.length;
    if (ranking.top[0]?.id === sqliteRanking.top[0]?.id) identicalTop1 += 1;
  });
  return {
    size: memory.size_requested,
    top_k_overlap: round(overlap / memory.rankings.length, 4),
    identical_top_1: round(identicalTop1 / memory.rankings.length, 4),
    sqlite_vec_query_speedup: round(memory.query_mean_ms / sqlite.query_mean_ms),
    sqlite_vec_rss_saving_mb: round(memory.rss_after_load_mb - sqlite.rss_after_load_mb, 1),
    sqlite_vec_disk_overhead_mb: round(
      (sqlite.database_bytes - memory.database_bytes) / 1024 / 1024,
      1,
    ),
  };
}

function renderMarkdown(
  results: WorkerResult[],
  comparisons: Comparison[],
  generatedAt: string,
): string {
  const rows = results.map((result) =>
    `| ${result.backend} | ${result.size_requested.toLocaleString("en-US")} | ${result.insert_ms} | ${result.query_p50_ms} | ${result.query_p95_ms} | ${result.queries_per_second} | ${(result.database_bytes / 1024 / 1024).toFixed(1)} | ${result.rss_after_load_mb} |`,
  );
  const comparisonRows = comparisons.map((result) =>
    `| ${result.size.toLocaleString("en-US")} | ${(result.top_k_overlap * 100).toFixed(1)} % | ${(result.identical_top_1 * 100).toFixed(1)} % | ${result.sqlite_vec_query_speedup}x | ${result.sqlite_vec_rss_saving_mb} MB | ${result.sqlite_vec_disk_overhead_mb} MB |`,
  );
  return `# Resultado del benchmark de búsqueda vectorial\n\nGenerado: ${generatedAt}\n\n| Backend | Vectores | Inserción ms | p50 ms | p95 ms | Consultas/s | Disco MB | RSS tras carga MB |\n| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |\n${rows.join("\n")}\n\n## Comparación\n\n| Vectores | Solapamiento top-k | Top-1 idéntico | Aceleración sqlite-vec | Ahorro RSS | Diferencia disco |\n| ---: | ---: | ---: | ---: | ---: | ---: |\n${comparisonRows.join("\n")}\n\nTodas las ejecuciones validaron inserción, actualización, eliminación, reapertura y Hit@1. Los vectores normalizados hacen que el ranking L2 sea equivalente al ranking coseno.\n`;
}

async function runParent(): Promise<void> {
  const smoke = hasFlag("smoke");
  const sizes = smoke
    ? [1_000]
    : (argument("sizes") ?? "10000,50000").split(",").map((value) => Number(value));
  if (sizes.some((value) => !Number.isInteger(value) || value < 3)) {
    throw new Error("--sizes must contain integers of at least 3.");
  }
  const queries = numericArgument("queries", smoke ? 5 : 30);
  const k = numericArgument("k", smoke ? 10 : 20);
  const seed = numericArgument("seed", 20_260_810);
  const output = argument("output") ?? "latest";
  await mkdir(resultsDir, { recursive: true });
  await mkdir(cacheDir, { recursive: true });

  const results: WorkerResult[] = [];
  for (const size of sizes) {
    for (const backend of ["memory", "sqlite-vec"] as const) {
      console.log(`[${backend}] ${size.toLocaleString("en-US")} vectors`);
      const child = spawnSync(
        process.execPath,
        [
          "--import",
          "tsx",
          currentFile,
          `--worker=${backend}`,
          `--size=${size}`,
          `--queries=${queries}`,
          `--k=${k}`,
          `--seed=${seed}`,
          `--output=${output}`,
        ],
        {
          cwd: projectRoot,
          encoding: "utf8",
          env: { ...process.env, NODE_NO_WARNINGS: "1" },
          timeout: smoke ? 120_000 : 900_000,
        },
      );
      if (child.status !== 0) {
        throw new Error(
          `${backend}/${size} failed with status ${child.status}: ${child.error?.message ?? child.stderr ?? child.stdout}`,
        );
      }
      const line = child.stdout.trim().split(/\r?\n/).at(-1);
      if (!line) throw new Error(`${backend}/${size} returned no result.`);
      const result = JSON.parse(line) as WorkerResult;
      if (
        result.hit_at_1 !== 1 ||
        !result.stale_delete_absent ||
        !result.updated_vector_found ||
        result.size_after_operations !== size - 1
      ) {
        throw new Error(`${backend}/${size} failed operational validation.`);
      }
      results.push(result);
      console.log(
        `[${backend}] p95=${result.query_p95_ms}ms rss=${result.rss_after_load_mb}MB`,
      );
    }
  }

  const comparisons = sizes.map((size) =>
    compare(
      results.find((result) => result.size_requested === size && result.backend === "memory")!,
      results.find(
        (result) => result.size_requested === size && result.backend === "sqlite-vec",
      )!,
    ),
  );
  if (comparisons.some((comparison) => comparison.top_k_overlap !== 1)) {
    throw new Error("Backends did not produce identical top-k sets.");
  }

  const generatedAt = new Date().toISOString();
  const payload = {
    schema_version: "1.0",
    generated_at: generatedAt,
    mode: smoke ? "smoke" : "benchmark",
    runtime: {
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      cpu: cpus()[0]?.model,
      logical_processors: cpus().length,
      total_ram_gb: round(totalmem() / 1024 ** 3, 1),
    },
    config: { dimensions, sizes, queries, k, seed },
    results,
    comparisons,
  };
  await writeFile(
    path.join(resultsDir, `${output}.json`),
    `${JSON.stringify(payload, null, 2)}\n`,
    "utf8",
  );
  await writeFile(
    path.join(resultsDir, `${output}.md`),
    renderMarkdown(results, comparisons, generatedAt),
    "utf8",
  );
  console.log(`Results: ${path.join(resultsDir, `${output}.json`)}`);
}

if (argument("worker")) {
  await runWorker();
} else {
  await runParent();
}
