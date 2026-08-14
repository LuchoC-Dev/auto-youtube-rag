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
  activeModelProfile,
  modelDescriptorOf,
  type EmbeddingModelProfile,
} from "./model-profile.js";

export interface ModelDownloadOptions {
  readonly repository: string;
  readonly revision: string;
  readonly dtype: "q8";
  readonly cacheDir: string;
}

export interface ModelDownloadRuntime {
  /** Downloads the model files to `options.cacheDir`. Only this adapter is
   * allowed to allow remote models: the embedding generator that serves
   * `sync`/`retrieve` always forces `allowRemoteModels = false`. */
  download(options: ModelDownloadOptions): Promise<void>;
}

const transformersDownloadRuntime: ModelDownloadRuntime = {
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

export interface TransformersModelInstallerOptions {
  readonly runtime?: ModelDownloadRuntime;
  // Injected for tests: exercising a profile with a different repository
  // without touching the real model. Not a configuration knob for callers:
  // run-cli.ts always falls back to the active profile. See
  // docs/model-profile-design.md, Decision 6.
  readonly profile?: EmbeddingModelProfile;
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
export class TransformersModelInstaller implements ModelInstaller {
  private readonly runtime: ModelDownloadRuntime;
  private readonly profile: EmbeddingModelProfile;

  public constructor(options: TransformersModelInstallerOptions = {}) {
    this.runtime = options.runtime ?? transformersDownloadRuntime;
    this.profile = options.profile ?? activeModelProfile;
  }

  public async install(
    options: ModelInstallOptions,
  ): Promise<ModelInstallOutcome> {
    if (!options.force) {
      const state = await readModelState(options.modelsPath, this.profile);
      if (state === "installed") {
        const measured = await measureModelFiles(
          options.modelsPath,
          this.profile,
        );
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
    const modelDirectory = this.profile.repository;
    const sourceState = await readSourceState(from, this.profile);
    if (sourceState !== "complete") {
      throw new ModelInstallerError(
        "MODEL_SOURCE_INVALID",
        `--from ${from} does not contain a complete model under ${modelDirectory}.`,
        false,
      );
    }

    await cp(join(from, modelDirectory), join(modelsPath, modelDirectory), {
      recursive: true,
    });

    const measured = await measureModelFiles(modelsPath, this.profile);
    if (measured === null) {
      throw new ModelInstallerError(
        "MODEL_SOURCE_INVALID",
        `Copy from ${from} to ${modelsPath} did not produce a complete model.`,
        false,
      );
    }

    await writeInstallReceipt(modelsPath, {
      schema_version: "1.0",
      model: modelDescriptorOf(this.profile),
      files: measured,
      installed_at: new Date().toISOString(),
      source: "copy",
    });

    return { status: "adopted", source: "copy", bytes: totalBytes(measured) };
  }

  private async download(modelsPath: string): Promise<ModelInstallOutcome> {
    try {
      await this.runtime.download({
        repository: this.profile.repository,
        revision: this.profile.revision,
        dtype: this.profile.dtype,
        cacheDir: modelsPath,
      });
    } catch (cause: unknown) {
      throw new ModelInstallerError(
        "MODEL_DOWNLOAD_FAILED",
        `Could not download ${this.profile.repository} to ${modelsPath}.`,
        true,
        { cause },
      );
    }

    const measured = await measureModelFiles(modelsPath, this.profile);
    if (measured === null) {
      throw new ModelInstallerError(
        "MODEL_DOWNLOAD_FAILED",
        `Download to ${modelsPath} did not produce a complete model.`,
        true,
      );
    }

    await writeInstallReceipt(modelsPath, {
      schema_version: "1.0",
      model: modelDescriptorOf(this.profile),
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
