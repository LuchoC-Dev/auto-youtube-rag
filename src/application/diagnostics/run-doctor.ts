import { access } from "node:fs/promises";

import type { EmbeddingGenerator } from "../ports/embedding-generator.js";
import type { SourceRegistry } from "../ports/source-registry.js";
import type { DiagnosticsRepository } from "./get-status.js";

export interface DoctorCheck {
  readonly code: string;
  readonly status: "ok" | "error";
  readonly message: string;
}

/**
 * Installation state of the embedding model, resolved by the caller.
 *
 * `runDoctor` receives it already computed instead of inspecting the
 * filesystem itself: reading the install receipt is infrastructure work, and
 * a non-empty directory is not evidence that the model is usable. A
 * truncated download leaves every required file in place with the wrong
 * size, which is exactly the case this check has to catch.
 */
export interface DoctorModelState {
  readonly state: "installed" | "incomplete" | "absent";
  readonly issues: readonly { readonly path: string; readonly reason: string }[];
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

function describeIssues(
  issues: readonly { readonly path: string; readonly reason: string }[],
): string {
  if (issues.length === 0) return "no install receipt";
  return issues.map((issue) => `${issue.path}: ${issue.reason}`).join(", ");
}

export async function runDoctor(
  repository: DiagnosticsRepository,
  sources: SourceRegistry,
  embeddingGenerator: EmbeddingGenerator,
  modelCachePath: string,
  modelState: DoctorModelState,
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

  const model = await embeddingGenerator.describe();
  const identity = `${model.key}@${model.version}`;
  checks.push({
    code: "EMBEDDING_MODEL",
    status: modelState.state === "installed" ? "ok" : "error",
    message:
      modelState.state === "installed"
        ? `${identity} is installed at ${modelCachePath}.`
        : modelState.state === "incomplete"
          ? `${identity} is incomplete at ${modelCachePath} (${describeIssues(modelState.issues)}). Run "auto-youtube-rag models install --force" to repair it.`
          : `${identity} is not installed at ${modelCachePath}. Run "auto-youtube-rag models install" first.`,
  });

  return {
    status: checks.some((check) => check.status === "error") ? "error" : "ok",
    checks,
  };
}
