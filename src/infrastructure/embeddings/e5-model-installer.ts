import { cp } from "node:fs/promises";
import { join } from "node:path";

import type {
  ModelInstallOptions,
  ModelInstallOutcome,
  ModelInstaller,
} from "../../application/ports/model-installer.js";
import { ModelInstallerError } from "../../application/ports/model-installer.js";
import {
  measureModelFiles,
  readModelState,
  readSourceState,
  writeInstallReceipt,
} from "../config/model-install-state.js";
import {
  modelDescriptor,
  modelDtype,
  modelRepository,
  modelRevision,
} from "./e5-embedding-generator.js";

const modelDirectory = "Xenova/multilingual-e5-small";

export interface E5DownloadOptions {
  readonly repository: string;
  readonly revision: string;
  readonly dtype: "q8";
  readonly cacheDir: string;
}

export interface E5DownloadRuntime {
  /** Downloads the model files to `options.cacheDir`. Only this adapter is
   * allowed to allow remote models: the embedding generator that serves
   * `sync`/`retrieve` always forces `allowRemoteModels = false`. */
  download(options: E5DownloadOptions): Promise<void>;
}

const transformersDownloadRuntime: E5DownloadRuntime = {
  async download(options) {
    const { env, pipeline } = await import("@huggingface/transformers");
    env.allowLocalModels = true;
    env.allowRemoteModels = true;
    env.cacheDir = options.cacheDir;
    const extractor = await pipeline("feature-extraction", options.repository, {
      revision: options.revision,
      dtype: options.dtype,
      cache_dir: options.cacheDir,
      local_files_only: false,
    });
    await extractor.dispose();
  },
};

export interface E5ModelInstallerOptions {
  readonly runtime?: E5DownloadRuntime;
}

function totalBytes(files: readonly { readonly bytes: number }[]): number {
  return files.reduce((sum, file) => sum + file.bytes, 0);
}

/**
 * Implements the full decision order of Decision 5
 * (docs/install-design.md): an already-installed destination short-circuits
 * unless `force`; a complete `--from` is copied (never moved, so the origin
 * -- e.g. the repository's own .cache/models used by benchmarks and the E5
 * smoke test -- is untouched); an incomplete `--from` is a usage error
 * (`MODEL_SOURCE_INVALID`); otherwise the model is downloaded.
 */
export class E5ModelInstaller implements ModelInstaller {
  private readonly runtime: E5DownloadRuntime;

  public constructor(options: E5ModelInstallerOptions = {}) {
    this.runtime = options.runtime ?? transformersDownloadRuntime;
  }

  public async install(
    options: ModelInstallOptions,
  ): Promise<ModelInstallOutcome> {
    if (!options.force) {
      const state = await readModelState(options.modelsPath);
      if (state === "installed") {
        const measured = await measureModelFiles(options.modelsPath);
        return {
          status: "already_installed",
          source: null,
          bytes: measured === null ? 0 : totalBytes(measured),
        };
      }
    }

    if (options.from !== null) {
      return this.adoptFrom(options.from, options.modelsPath);
    }

    return this.download(options.modelsPath);
  }

  private async adoptFrom(
    from: string,
    modelsPath: string,
  ): Promise<ModelInstallOutcome> {
    const sourceState = await readSourceState(from);
    if (sourceState !== "complete") {
      throw new ModelInstallerError(
        "MODEL_SOURCE_INVALID",
        `--from ${from} does not contain a complete model under ${modelDirectory}.`,
      );
    }

    await cp(join(from, modelDirectory), join(modelsPath, modelDirectory), {
      recursive: true,
    });

    const measured = await measureModelFiles(modelsPath);
    if (measured === null) {
      throw new ModelInstallerError(
        "MODEL_SOURCE_INVALID",
        `Copy from ${from} to ${modelsPath} did not produce a complete model.`,
      );
    }

    await writeInstallReceipt(modelsPath, {
      schema_version: "1.0",
      model: modelDescriptor,
      files: measured,
      installed_at: new Date().toISOString(),
      source: "copy",
    });

    return { status: "adopted", source: "copy", bytes: totalBytes(measured) };
  }

  private async download(modelsPath: string): Promise<ModelInstallOutcome> {
    try {
      await this.runtime.download({
        repository: modelRepository,
        revision: modelRevision,
        dtype: modelDtype,
        cacheDir: modelsPath,
      });
    } catch (cause: unknown) {
      throw new ModelInstallerError(
        "MODEL_DOWNLOAD_FAILED",
        `Could not download ${modelRepository} to ${modelsPath}.`,
        { cause },
      );
    }

    const measured = await measureModelFiles(modelsPath);
    if (measured === null) {
      throw new ModelInstallerError(
        "MODEL_DOWNLOAD_FAILED",
        `Download to ${modelsPath} did not produce a complete model.`,
      );
    }

    await writeInstallReceipt(modelsPath, {
      schema_version: "1.0",
      model: modelDescriptor,
      files: measured,
      installed_at: new Date().toISOString(),
      source: "download",
    });

    return {
      status: "installed",
      source: "download",
      bytes: totalBytes(measured),
    };
  }
}
