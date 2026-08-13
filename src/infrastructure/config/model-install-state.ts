import { readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * The four files the runtime needs to load the model locally. Paths are
 * relative to `<modelsPath>/Xenova/multilingual-e5-small/`.
 */
export const requiredModelFiles: readonly string[] = Object.freeze([
  "config.json",
  "tokenizer.json",
  "tokenizer_config.json",
  "onnx/model_quantized.onnx",
]);

const modelDirectory = "Xenova/multilingual-e5-small";
const receiptFileName = ".install.json";

export interface InstallReceiptModel {
  readonly key: string;
  readonly version: string;
  readonly dimensions: number;
}

export interface InstallReceiptFile {
  readonly path: string;
  readonly bytes: number;
}

export type ModelInstallSourceKind = "download" | "copy";

export interface InstallReceipt {
  readonly schema_version: string;
  readonly model: InstallReceiptModel;
  readonly files: readonly InstallReceiptFile[];
  readonly installed_at: string;
  readonly source: ModelInstallSourceKind;
}

export type ModelState = "installed" | "incomplete" | "absent";
export type SourceState = "complete" | "absent";

function receiptPath(modelsPath: string): string {
  return join(modelsPath, receiptFileName);
}

function isInstallReceipt(value: unknown): value is InstallReceipt {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  if (typeof record.schema_version !== "string") return false;
  if (typeof record.installed_at !== "string") return false;
  if (record.source !== "download" && record.source !== "copy") return false;
  if (!Array.isArray(record.files)) return false;
  const model = record.model;
  if (typeof model !== "object" || model === null) return false;
  const modelRecord = model as Record<string, unknown>;
  if (
    typeof modelRecord.key !== "string" ||
    typeof modelRecord.version !== "string" ||
    typeof modelRecord.dimensions !== "number"
  ) {
    return false;
  }
  return record.files.every(
    (file) =>
      typeof file === "object" &&
      file !== null &&
      typeof (file as Record<string, unknown>).path === "string" &&
      typeof (file as Record<string, unknown>).bytes === "number",
  );
}

/** Reads and validates `models/.install.json`. Returns `null` when it does
 * not exist or its shape is not a well-formed receipt. */
export async function readInstallReceipt(
  modelsPath: string,
): Promise<InstallReceipt | null> {
  let raw: string;
  try {
    raw = await readFile(receiptPath(modelsPath), "utf8");
  } catch {
    return null;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  return isInstallReceipt(parsed) ? parsed : null;
}

export async function writeInstallReceipt(
  modelsPath: string,
  receipt: InstallReceipt,
): Promise<void> {
  await writeFile(
    receiptPath(modelsPath),
    `${JSON.stringify(receipt, null, 2)}\n`,
    "utf8",
  );
}

async function fileBytes(path: string): Promise<number | null> {
  try {
    const info = await stat(path);
    return info.isFile() ? info.size : null;
  } catch {
    return null;
  }
}

/** Byte size of each required file under `<path>/Xenova/multilingual-e5-small/`,
 * or `null` for a file that does not exist (or is not a regular file). */
async function measureRequiredFiles(
  path: string,
): Promise<readonly (InstallReceiptFile | null)[]> {
  return Promise.all(
    requiredModelFiles.map(async (relativePath) => {
      const bytes = await fileBytes(join(path, modelDirectory, relativePath));
      return bytes === null ? null : { path: relativePath, bytes };
    }),
  );
}

/** Measures the four required files under `path`. Returns `null` if any of
 * them is missing; otherwise the byte size of each, in `requiredModelFiles`
 * order. Used to build a fresh receipt after a download or a copy. */
export async function measureModelFiles(
  path: string,
): Promise<readonly InstallReceiptFile[] | null> {
  const measured = await measureRequiredFiles(path);
  return measured.every((file): file is InstallReceiptFile => file !== null)
    ? measured
    : null;
}

/** `--from` origins never carry a receipt, so completeness is judged purely
 * by the presence of the four required files. */
export async function readSourceState(path: string): Promise<SourceState> {
  const measured = await measureModelFiles(path);
  return measured === null ? "absent" : "complete";
}

export interface ModelStateIssue {
  readonly path: string;
  readonly reason: "missing" | "size_mismatch";
}

export interface ModelStateDescription {
  readonly state: ModelState;
  readonly issues: readonly ModelStateIssue[];
}

/**
 * Compares the receipt against the files actually on disk, by size only
 * (never by hash, so this never reads the ~130 MB model). A directory with
 * files but no receipt is `incomplete`, not `installed`: it is the "someone
 * copied the model by hand" case, meant to be normalized by
 * `models install --force`. When `incomplete`, `issues` lists every
 * required file that is missing or whose size does not match the receipt
 * (used by `models status`).
 */
export async function describeModelState(
  modelsPath: string,
): Promise<ModelStateDescription> {
  const receipt = await readInstallReceipt(modelsPath);
  const measured = await measureRequiredFiles(modelsPath);
  const actualByPath = new Map(
    measured
      .filter((file): file is InstallReceiptFile => file !== null)
      .map((file) => [file.path, file.bytes]),
  );

  let state: ModelState;
  if (receipt === null) {
    state = actualByPath.size > 0 ? "incomplete" : "absent";
  } else {
    const matches =
      receipt.files.length === requiredModelFiles.length &&
      receipt.files.every(
        (file) => actualByPath.get(file.path) === file.bytes,
      ) &&
      actualByPath.size === receipt.files.length;
    state = matches ? "installed" : "incomplete";
  }

  if (state !== "incomplete") return { state, issues: [] };

  const expectedByPath = new Map(
    receipt?.files.map((file) => [file.path, file.bytes]) ?? [],
  );
  const issues: ModelStateIssue[] = [];
  for (const relativePath of requiredModelFiles) {
    const actualBytes = actualByPath.get(relativePath);
    if (actualBytes === undefined) {
      issues.push({ path: relativePath, reason: "missing" });
      continue;
    }
    const expectedBytes = expectedByPath.get(relativePath);
    if (expectedBytes !== undefined && expectedBytes !== actualBytes) {
      issues.push({ path: relativePath, reason: "size_mismatch" });
    }
  }

  return { state, issues };
}

export async function readModelState(modelsPath: string): Promise<ModelState> {
  return (await describeModelState(modelsPath)).state;
}
