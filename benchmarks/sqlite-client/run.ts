import { spawnSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { cpus, totalmem } from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { backup as nodeBackup, DatabaseSync } from "node:sqlite";
import BetterSqlite3 from "better-sqlite3";

type Client = "node-sqlite" | "better-sqlite3";

type Result = {
  client: Client;
  rows: number;
  sqlite_version: string;
  fts5_enabled: boolean;
  insert_ms: number;
  rows_per_second: number;
  update_delete_ms: number;
  fts_query_p50_ms: number;
  fts_query_p95_ms: number;
  blob_stream_ms: number;
  blob_bytes_read: number;
  reopen_ms: number;
  backup_ms: number;
  database_bytes: number;
  backup_bytes: number;
  rss_before_mb: number;
  rss_after_insert_mb: number;
  rss_after_stream_mb: number;
  fts_signature: string;
  integrity_check: string;
};

const dimensions = 384;
const projectRoot = path.resolve(import.meta.dirname, "../..");
const cacheDir = path.join(projectRoot, ".cache", "sqlite-client-benchmark");
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
  if (!Number.isInteger(value) || value <= 0) throw new Error(`--${name} must be positive.`);
  return value;
}

function round(value: number, digits = 2): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function percentile(values: number[], fraction: number): number {
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * fraction) - 1)] ?? 0;
}

function rssMb(): number {
  return round(process.memoryUsage().rss / 1024 / 1024, 1);
}

function vectorFor(id: number): Uint8Array {
  const values = new Float32Array(dimensions);
  let state = (id * 2654435761) >>> 0 || 1;
  for (let index = 0; index < dimensions; index += 1) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    values[index] = (state >>> 0) / 0xffffffff * 2 - 1;
  }
  return new Uint8Array(values.buffer);
}

const topics = [
  "tipografia editorial", "paleta de color", "vestido de diseno", "interfaz minimalista",
  "jerarquia visual", "espaciado modular", "fotografia de producto", "identidad de marca",
];

function contentFor(id: number): { title: string; body: string; metadata: string } {
  const topic = topics[id % topics.length]!;
  const secondary = topics[(id * 3 + 1) % topics.length]!;
  return {
    title: `Video ${Math.ceil(id / 24)} - ${topic}`,
    body: `Fragmento ${id}. Principios de ${topic}, ejemplos de ${secondary} y decisiones visuales aplicables.`,
    metadata: JSON.stringify({ video_id: `video-${Math.ceil(id / 24)}`, section: id % 12 }),
  };
}

const schema = `
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;
  PRAGMA foreign_keys = ON;
  CREATE TABLE chunks (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    metadata TEXT NOT NULL,
    embedding BLOB NOT NULL
  );
  CREATE VIRTUAL TABLE chunks_fts USING fts5(
    title, body, content='chunks', content_rowid='id', tokenize='unicode61 remove_diacritics 2'
  );
  CREATE TRIGGER chunks_ai AFTER INSERT ON chunks BEGIN
    INSERT INTO chunks_fts(rowid, title, body) VALUES (new.id, new.title, new.body);
  END;
  CREATE TRIGGER chunks_ad AFTER DELETE ON chunks BEGIN
    INSERT INTO chunks_fts(chunks_fts, rowid, title, body)
    VALUES ('delete', old.id, old.title, old.body);
  END;
  CREATE TRIGGER chunks_au AFTER UPDATE ON chunks BEGIN
    INSERT INTO chunks_fts(chunks_fts, rowid, title, body)
    VALUES ('delete', old.id, old.title, old.body);
    INSERT INTO chunks_fts(rowid, title, body) VALUES (new.id, new.title, new.body);
  END;
`;

const ftsQueries = [
  "tipografia OR editorial", "paleta color", "vestido diseno", "interfaz minimalista",
  "jerarquia visual", "espaciado modular", "fotografia producto", "identidad marca",
];

function fileBytes(file: string): number {
  return existsSync(file) ? statSync(file).size : 0;
}

async function runNodeSqlite(databasePath: string, backupPath: string, rows: number, repetitions: number): Promise<Result> {
  const rssBefore = rssMb();
  let database = new DatabaseSync(databasePath, { timeout: 5_000 });
  database.exec(schema);
  const insert = database.prepare("INSERT INTO chunks(id,title,body,metadata,embedding) VALUES(?,?,?,?,?)");
  const insertStart = performance.now();
  database.exec("BEGIN IMMEDIATE");
  try {
    for (let id = 1; id <= rows; id += 1) {
      const item = contentFor(id);
      insert.run(id, item.title, item.body, item.metadata, vectorFor(id));
    }
    database.exec("COMMIT");
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
  const insertMs = performance.now() - insertStart;
  const rssAfterInsert = rssMb();
  const operationsStart = performance.now();
  database.exec("BEGIN IMMEDIATE");
  try {
    database.prepare("UPDATE chunks SET body = body || ' actualizado' WHERE id = ?").run(rows - 1);
    database.prepare("DELETE FROM chunks WHERE id = ?").run(rows);
    database.exec("COMMIT");
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
  const updateDeleteMs = performance.now() - operationsStart;
  database.close();
  const reopenStart = performance.now();
  database = new DatabaseSync(databasePath, { readOnly: false, timeout: 5_000 });
  const reopenMs = performance.now() - reopenStart;
  const version = database.prepare("SELECT sqlite_version() AS version").get() as { version: string };
  const compileOptions = [...database.prepare("PRAGMA compile_options").iterate()] as Array<{ compile_options: string }>;
  const query = database.prepare("SELECT rowid AS id FROM chunks_fts WHERE chunks_fts MATCH ? ORDER BY bm25(chunks_fts), rowid LIMIT 20");
  const latencies: number[] = [];
  const signatures: string[] = [];
  for (let index = 0; index < repetitions; index += 1) {
    const started = performance.now();
    const ids = [...query.iterate(ftsQueries[index % ftsQueries.length]!)] as Array<{ id: number }>;
    latencies.push(performance.now() - started);
    if (index < ftsQueries.length) signatures.push(ids.map((row) => row.id).join(","));
  }
  const streamStart = performance.now();
  let blobBytesRead = 0;
  for (const row of database.prepare("SELECT embedding FROM chunks ORDER BY id").iterate() as Iterable<{ embedding: Uint8Array }>) {
    blobBytesRead += row.embedding.byteLength;
  }
  const blobStreamMs = performance.now() - streamStart;
  const rssAfterStream = rssMb();
  const backupStart = performance.now();
  await nodeBackup(database, backupPath);
  const backupMs = performance.now() - backupStart;
  const integrity = database.prepare("PRAGMA integrity_check").get() as { integrity_check: string };
  database.close();
  return {
    client: "node-sqlite", rows, sqlite_version: version.version,
    fts5_enabled: compileOptions.some((row) => row.compile_options === "ENABLE_FTS5"),
    insert_ms: round(insertMs), rows_per_second: round(rows / (insertMs / 1000)),
    update_delete_ms: round(updateDeleteMs), fts_query_p50_ms: round(percentile(latencies, 0.5), 4),
    fts_query_p95_ms: round(percentile(latencies, 0.95), 4), blob_stream_ms: round(blobStreamMs),
    blob_bytes_read: blobBytesRead, reopen_ms: round(reopenMs), backup_ms: round(backupMs),
    database_bytes: fileBytes(databasePath), backup_bytes: fileBytes(backupPath), rss_before_mb: rssBefore,
    rss_after_insert_mb: rssAfterInsert, rss_after_stream_mb: rssAfterStream,
    fts_signature: signatures.join("|"), integrity_check: integrity.integrity_check,
  };
}

async function runBetterSqlite(databasePath: string, backupPath: string, rows: number, repetitions: number): Promise<Result> {
  const rssBefore = rssMb();
  let database = new BetterSqlite3(databasePath, { timeout: 5_000 });
  database.exec(schema);
  const insert = database.prepare("INSERT INTO chunks(id,title,body,metadata,embedding) VALUES(?,?,?,?,?)");
  const insertAll = database.transaction(() => {
    for (let id = 1; id <= rows; id += 1) {
      const item = contentFor(id);
      insert.run(id, item.title, item.body, item.metadata, Buffer.from(vectorFor(id)));
    }
  });
  const insertStart = performance.now();
  insertAll.immediate();
  const insertMs = performance.now() - insertStart;
  const rssAfterInsert = rssMb();
  const mutate = database.transaction(() => {
    database.prepare("UPDATE chunks SET body = body || ' actualizado' WHERE id = ?").run(rows - 1);
    database.prepare("DELETE FROM chunks WHERE id = ?").run(rows);
  });
  const operationsStart = performance.now();
  mutate.immediate();
  const updateDeleteMs = performance.now() - operationsStart;
  database.close();
  const reopenStart = performance.now();
  database = new BetterSqlite3(databasePath, { timeout: 5_000 });
  const reopenMs = performance.now() - reopenStart;
  const version = database.prepare("SELECT sqlite_version() AS version").get() as { version: string };
  const compileOptions = database.prepare("PRAGMA compile_options").all() as Array<{ compile_options: string }>;
  const query = database.prepare("SELECT rowid AS id FROM chunks_fts WHERE chunks_fts MATCH ? ORDER BY bm25(chunks_fts), rowid LIMIT 20");
  const latencies: number[] = [];
  const signatures: string[] = [];
  for (let index = 0; index < repetitions; index += 1) {
    const started = performance.now();
    const ids = query.all(ftsQueries[index % ftsQueries.length]!) as Array<{ id: number }>;
    latencies.push(performance.now() - started);
    if (index < ftsQueries.length) signatures.push(ids.map((row) => row.id).join(","));
  }
  const streamStart = performance.now();
  let blobBytesRead = 0;
  for (const row of database.prepare("SELECT embedding FROM chunks ORDER BY id").iterate() as Iterable<{ embedding: Buffer }>) {
    blobBytesRead += row.embedding.byteLength;
  }
  const blobStreamMs = performance.now() - streamStart;
  const rssAfterStream = rssMb();
  const backupStart = performance.now();
  await database.backup(backupPath);
  const backupMs = performance.now() - backupStart;
  const integrity = database.pragma("integrity_check", { simple: true }) as string;
  database.close();
  return {
    client: "better-sqlite3", rows, sqlite_version: version.version,
    fts5_enabled: compileOptions.some((row) => row.compile_options === "ENABLE_FTS5"),
    insert_ms: round(insertMs), rows_per_second: round(rows / (insertMs / 1000)),
    update_delete_ms: round(updateDeleteMs), fts_query_p50_ms: round(percentile(latencies, 0.5), 4),
    fts_query_p95_ms: round(percentile(latencies, 0.95), 4), blob_stream_ms: round(blobStreamMs),
    blob_bytes_read: blobBytesRead, reopen_ms: round(reopenMs), backup_ms: round(backupMs),
    database_bytes: fileBytes(databasePath), backup_bytes: fileBytes(backupPath), rss_before_mb: rssBefore,
    rss_after_insert_mb: rssAfterInsert, rss_after_stream_mb: rssAfterStream,
    fts_signature: signatures.join("|"), integrity_check: integrity,
  };
}

async function runWorker(): Promise<void> {
  const client = argument("worker") as Client;
  if (client !== "node-sqlite" && client !== "better-sqlite3") throw new Error("Unknown client.");
  const rows = numericArgument("rows", 10_000);
  const repetitions = numericArgument("repetitions", 100);
  const output = argument("output") ?? "latest";
  await mkdir(cacheDir, { recursive: true });
  const databasePath = path.join(cacheDir, `${output}-${client}-${rows}.sqlite`);
  const backupPath = path.join(cacheDir, `${output}-${client}-${rows}-backup.sqlite`);
  for (const file of [databasePath, `${databasePath}-wal`, `${databasePath}-shm`, backupPath]) await rm(file, { force: true });
  const result = client === "node-sqlite"
    ? await runNodeSqlite(databasePath, backupPath, rows, repetitions)
    : await runBetterSqlite(databasePath, backupPath, rows, repetitions);
  process.stdout.write(`${JSON.stringify(result)}\n`);
}

function renderMarkdown(results: Result[], generatedAt: string): string {
  const rows = results.map((result) =>
    `| ${result.client} | ${result.rows.toLocaleString("en-US")} | ${result.sqlite_version} | ${result.insert_ms} | ${result.fts_query_p50_ms} | ${result.fts_query_p95_ms} | ${result.blob_stream_ms} | ${result.backup_ms} | ${result.rss_after_stream_mb} |`,
  );
  return `# Resultado del benchmark de clientes SQLite\n\nGenerado: ${generatedAt}\n\n| Cliente | Filas | SQLite | Inserción ms | FTS p50 ms | FTS p95 ms | BLOB stream ms | Backup ms | RSS MB |\n| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: |\n${rows.join("\n")}\n\nAmbos clientes ejecutaron el mismo esquema, transacciones, FTS5, BLOBs, reapertura, backup e integrity check.\n`;
}

async function runParent(): Promise<void> {
  const smoke = hasFlag("smoke");
  const sizes = smoke ? [1_000] : (argument("sizes") ?? "10000,50000").split(",").map(Number);
  const repetitions = numericArgument("repetitions", smoke ? 16 : 100);
  const output = argument("output") ?? "latest";
  await mkdir(resultsDir, { recursive: true });
  const results: Result[] = [];
  for (const rows of sizes) {
    for (const client of ["node-sqlite", "better-sqlite3"] as const) {
      console.log(`[${client}] ${rows.toLocaleString("en-US")} rows`);
      const child = spawnSync(process.execPath, ["--import", "tsx", currentFile, `--worker=${client}`, `--rows=${rows}`, `--repetitions=${repetitions}`, `--output=${output}`], {
        cwd: projectRoot, encoding: "utf8", env: { ...process.env, NODE_NO_WARNINGS: "1" }, timeout: 900_000,
      });
      if (child.status !== 0) throw new Error(`${client}/${rows} failed: ${child.error?.message ?? child.stderr}`);
      const line = child.stdout.trim().split(/\r?\n/).at(-1);
      if (!line) throw new Error(`${client}/${rows} returned no result.`);
      const result = JSON.parse(line) as Result;
      if (!result.fts5_enabled || result.integrity_check !== "ok") throw new Error(`${client}/${rows} failed validation.`);
      results.push(result);
    }
    const pair = results.filter((result) => result.rows === rows);
    if (pair[0]?.fts_signature !== pair[1]?.fts_signature || pair[0]?.blob_bytes_read !== pair[1]?.blob_bytes_read) {
      throw new Error(`Clients produced different results for ${rows} rows.`);
    }
  }
  const generatedAt = new Date().toISOString();
  const payload = {
    schema_version: "1.0", generated_at: generatedAt, mode: smoke ? "smoke" : "benchmark",
    runtime: { node: process.version, platform: process.platform, arch: process.arch, cpu: cpus()[0]?.model, logical_processors: cpus().length, total_ram_gb: round(totalmem() / 1024 ** 3, 1) },
    config: { dimensions, sizes, repetitions }, results,
  };
  await writeFile(path.join(resultsDir, `${output}.json`), `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  await writeFile(path.join(resultsDir, `${output}.md`), renderMarkdown(results, generatedAt), "utf8");
  console.log(`Results: ${path.join(resultsDir, `${output}.json`)}`);
}

if (argument("worker")) await runWorker();
else await runParent();
