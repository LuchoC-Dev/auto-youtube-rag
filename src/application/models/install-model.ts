import type {
  EmbeddingGenerator,
  EmbeddingModelDescriptor,
} from "../ports/embedding-generator.js";
import type {
  ModelInstallSource,
  ModelInstallStatus,
  ModelInstaller,
} from "../ports/model-installer.js";

export interface InstallModelDependencies {
  readonly modelInstaller: ModelInstaller;
  readonly embeddingGenerator: EmbeddingGenerator;
}

export interface InstallModelInput {
  readonly modelsPath: string;
  readonly from: string | null;
  readonly force: boolean;
}

export interface InstallModelResult {
  readonly status: ModelInstallStatus;
  readonly model: EmbeddingModelDescriptor;
  readonly cachePath: string;
  readonly bytes: number;
  readonly source: ModelInstallSource;
}

/**
 * Orchestrates the ModelInstaller port (which only knows about files and
 * bytes) with the EmbeddingGenerator port (which owns model identity), so
 * the CLI receipt can report `model: {key, version, dimensions}` without
 * the installer duplicating that knowledge. No SQLite, no filesystem, no
 * Hugging Face: both dependencies are ports, so this is testable with
 * fakes alone (docs/install-tasks.md, W4).
 */
export async function installModel(
  deps: InstallModelDependencies,
  input: InstallModelInput,
): Promise<InstallModelResult> {
  const [outcome, model] = await Promise.all([
    deps.modelInstaller.install({
      modelsPath: input.modelsPath,
      from: input.from,
      force: input.force,
    }),
    deps.embeddingGenerator.describe(),
  ]);

  return {
    status: outcome.status,
    model,
    cachePath: input.modelsPath,
    bytes: outcome.bytes,
    source: outcome.source,
  };
}
