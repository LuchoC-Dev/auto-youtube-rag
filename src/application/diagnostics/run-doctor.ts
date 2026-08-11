import { access, readdir } from "node:fs/promises";

import type { EmbeddingGenerator } from "../ports/embedding-generator.js";
import type { SourceRegistry } from "../ports/source-registry.js";
import type { DiagnosticsRepository } from "./get-status.js";

export interface DoctorCheck {
  readonly code: string;
  readonly status: "ok" | "error";
  readonly message: string;
}

export interface DoctorResult {
  readonly status: "ok" | "error";
  readonly checks: readonly DoctorCheck[];
}

async function readable(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function runDoctor(
  repository: DiagnosticsRepository,
  sources: SourceRegistry,
  embeddingGenerator: EmbeddingGenerator,
  modelCachePath: string,
): Promise<DoctorResult> {
  const checks: DoctorCheck[] = [];
  const health = await repository.checkHealth();
  checks.push({
    code: "SQLITE_INTEGRITY",
    status: health.integrity ? "ok" : "error",
    message: health.integrity
      ? "SQLite integrity check passed."
      : "SQLite integrity check failed.",
  });
  checks.push({
    code: "SQLITE_FOREIGN_KEYS",
    status: health.foreignKeyViolations === 0 ? "ok" : "error",
    message: `${String(health.foreignKeyViolations)} foreign key violation(s).`,
  });
  checks.push({
    code: "SQLITE_FTS",
    status: health.fullTextSearch ? "ok" : "error",
    message: health.fullTextSearch
      ? "Full-text search is available."
      : "Full-text search is unavailable.",
  });

  for (const source of await sources.list()) {
    const paths = [
      source.collectionPath,
      source.manifestPath,
      source.videosPath,
    ];
    const pathsReadable = (
      await Promise.all(paths.map((path) => readable(path)))
    ).every(Boolean);
    checks.push({
      code: "SOURCE_READABLE",
      status: pathsReadable ? "ok" : "error",
      message: pathsReadable
        ? `Source ${source.name.value} is readable.`
        : `Source ${source.name.value} has an unreadable required path.`,
    });
  }

  const modelPresent = await readdir(modelCachePath)
    .then((entries) => entries.length > 0)
    .catch(() => false);
  const model = await embeddingGenerator.describe();
  checks.push({
    code: "EMBEDDING_MODEL",
    status: modelPresent ? "ok" : "error",
    message: modelPresent
      ? `${model.key}@${model.version} cache is present.`
      : `${model.key}@${model.version} cache is missing.`,
  });

  return {
    status: checks.some((check) => check.status === "error") ? "error" : "ok",
    checks,
  };
}
