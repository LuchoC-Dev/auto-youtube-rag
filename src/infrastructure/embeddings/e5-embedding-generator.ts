import { resolve } from "node:path";

import type {
  EmbeddingGenerator,
  EmbeddingModelDescriptor,
} from "../../application/ports/embedding-generator.js";
import {
  activeModelProfile,
  modelDescriptorOf,
  type EmbeddingModelProfile,
} from "./model-profile.js";

// Batch 1, not 16: within a batch every text pads to the longest one, and
// this library's fragments range from 13 to 511 tokens. Measured with real
// fragments, batch 1 ran 2.27x faster than batch 16 because padding, not
// throughput, dominated the cost (see docs/sync-safety-design.md). Still
// overridable via `batchSize` for anyone who wants to trade it back.
const defaultBatchSize = 1;

export type E5EmbeddingErrorCode =
  | "INVALID_INPUT"
  | "INVALID_BATCH_SIZE"
  | "MODEL_LOAD_FAILED"
  | "TOKEN_COUNT_MISMATCH"
  | "INVALID_TOKEN_COUNT"
  | "INPUT_TOO_LONG"
  | "EMBEDDING_COUNT_MISMATCH"
  | "INVALID_VECTOR_DIMENSIONS"
  | "NON_FINITE_VECTOR"
  | "ZERO_NORM_VECTOR";

export class E5EmbeddingError extends Error {
  public constructor(
    public readonly code: E5EmbeddingErrorCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "E5EmbeddingError";
  }
}

export interface E5RuntimeLoadOptions {
  readonly repository: string;
  readonly revision: string;
  readonly dtype: "q8";
  readonly cacheDir: string;
  readonly localFilesOnly: true;
}

export interface E5EmbeddingSession {
  countTokens(texts: readonly string[]): Promise<readonly number[]>;
  embed(
    texts: readonly string[],
  ): Promise<readonly (readonly number[] | Float32Array)[]>;
  dispose(): Promise<void>;
}

export interface E5EmbeddingRuntime {
  load(options: E5RuntimeLoadOptions): Promise<E5EmbeddingSession>;
}

export interface E5EmbeddingGeneratorOptions {
  readonly runtime?: E5EmbeddingRuntime;
  readonly cacheDir: string;
  readonly batchSize?: number;
  // Injected for tests: exercising a profile without prefixes, or with a
  // different prefix policy, without touching the real model. Not a
  // configuration knob for callers: create-application.ts and run-cli.ts
  // always fall back to the active profile. See
  // docs/model-profile-design.md, Decision 6.
  readonly profile?: EmbeddingModelProfile;
}

function readBatchSize(input: unknown): number {
  if (typeof input !== "number" || !Number.isSafeInteger(input) || input <= 0) {
    throw new E5EmbeddingError(
      "INVALID_BATCH_SIZE",
      "batchSize must be a positive safe integer",
    );
  }

  return input;
}

function readCacheDir(input: unknown): string {
  if (
    typeof input !== "string" ||
    input.trim().length === 0 ||
    input.includes("\0")
  ) {
    throw new E5EmbeddingError(
      "INVALID_INPUT",
      "cacheDir must be a non-empty path without null bytes",
    );
  }

  return resolve(input);
}

function readTexts(input: readonly string[]): readonly string[] {
  if (!Array.isArray(input)) {
    throw new E5EmbeddingError("INVALID_INPUT", "texts must be an array");
  }

  const texts = input.map((text) => {
    if (typeof text !== "string" || text.includes("\0")) {
      throw new E5EmbeddingError(
        "INVALID_INPUT",
        "texts must contain only non-empty strings without null bytes",
      );
    }

    const canonical = text.trim();
    if (canonical.length === 0) {
      throw new E5EmbeddingError(
        "INVALID_INPUT",
        "texts must contain only non-empty strings without null bytes",
      );
    }

    return canonical;
  });

  return Object.freeze(texts);
}

function passageInputs(
  texts: readonly string[],
  profile: EmbeddingModelProfile,
): readonly string[] {
  const { inputPrefixes } = profile;
  if (inputPrefixes === null) {
    return texts;
  }
  return Object.freeze(texts.map((text) => `${inputPrefixes.passage}${text}`));
}

function queryInput(text: string, profile: EmbeddingModelProfile): string {
  const { inputPrefixes } = profile;
  return inputPrefixes === null ? text : `${inputPrefixes.query}${text}`;
}

function readTokenCounts(
  input: readonly number[],
  expected: number,
): readonly number[] {
  if (!Array.isArray(input) || input.length !== expected) {
    throw new E5EmbeddingError(
      "TOKEN_COUNT_MISMATCH",
      "runtime must return exactly one token count per text",
    );
  }

  const counts = input.map((count: unknown) => {
    if (
      typeof count !== "number" ||
      !Number.isSafeInteger(count) ||
      count <= 0
    ) {
      throw new E5EmbeddingError(
        "INVALID_TOKEN_COUNT",
        "runtime token counts must be positive safe integers",
      );
    }
    return count;
  });

  return Object.freeze(counts);
}

function normalizeVector(
  input: readonly number[] | Float32Array,
  expectedDimensions: number,
): Float32Array {
  const values = Array.from(input);
  if (values.length !== expectedDimensions) {
    throw new E5EmbeddingError(
      "INVALID_VECTOR_DIMENSIONS",
      `expected ${String(expectedDimensions)} dimensions, received ${String(values.length)}`,
    );
  }

  if (!values.every(Number.isFinite)) {
    throw new E5EmbeddingError(
      "NON_FINITE_VECTOR",
      "embedding vectors must contain only finite values",
    );
  }

  const norm = Math.hypot(...values);
  if (norm === 0) {
    throw new E5EmbeddingError(
      "ZERO_NORM_VECTOR",
      "embedding vectors must have a positive norm",
    );
  }

  const normalized = Float32Array.from(values, (value) => value / norm);
  if (!normalized.every(Number.isFinite)) {
    throw new E5EmbeddingError(
      "NON_FINITE_VECTOR",
      "normalized embedding vectors must contain only finite values",
    );
  }

  return normalized;
}

function readRuntimeMatrix(input: unknown): readonly (readonly number[])[] {
  if (!Array.isArray(input)) {
    return Object.freeze([]);
  }

  return Object.freeze(
    input.map((row) => {
      if (!Array.isArray(row)) {
        return Object.freeze([]);
      }
      return Object.freeze(
        row.map((value) => (typeof value === "number" ? value : Number.NaN)),
      );
    }),
  );
}

const transformersRuntime: E5EmbeddingRuntime = {
  async load(options) {
    const { env, pipeline } = await import("@huggingface/transformers");
    env.allowLocalModels = true;
    env.allowRemoteModels = false;
    env.cacheDir = options.cacheDir;
    const extractor = await pipeline("feature-extraction", options.repository, {
      revision: options.revision,
      dtype: options.dtype,
      cache_dir: options.cacheDir,
      local_files_only: options.localFilesOnly,
    });

    return {
      countTokens(texts) {
        return Promise.resolve(
          texts.map((text) => extractor.tokenizer.encode(text).length),
        );
      },
      async embed(texts) {
        const output = await extractor([...texts], {
          pooling: "mean",
          normalize: false,
        });
        try {
          return readRuntimeMatrix(output.tolist() as unknown);
        } finally {
          output.dispose();
        }
      },
      dispose() {
        return extractor.dispose();
      },
    };
  },
};

export class E5EmbeddingGenerator implements EmbeddingGenerator {
  private readonly runtime: E5EmbeddingRuntime;
  private readonly cacheDir: string;
  private readonly batchSize: number;
  private readonly profile: EmbeddingModelProfile;
  private sessionPromise: Promise<E5EmbeddingSession> | undefined;

  public constructor(options: E5EmbeddingGeneratorOptions) {
    this.runtime = options.runtime ?? transformersRuntime;
    this.cacheDir = readCacheDir(options.cacheDir);
    this.batchSize = readBatchSize(options.batchSize ?? defaultBatchSize);
    this.profile = options.profile ?? activeModelProfile;
  }

  public describe(): Promise<EmbeddingModelDescriptor> {
    return Promise.resolve(modelDescriptorOf(this.profile));
  }

  public async countTokens(
    texts: readonly string[],
  ): Promise<readonly number[]> {
    const canonical = readTexts(texts);
    if (canonical.length === 0) {
      return Object.freeze([]);
    }
    return this.countPrefixed(passageInputs(canonical, this.profile));
  }

  public async embedDocuments(
    texts: readonly string[],
  ): Promise<readonly Float32Array[]> {
    const canonical = readTexts(texts);
    if (canonical.length === 0) {
      return Object.freeze([]);
    }
    return this.embedPrefixed(passageInputs(canonical, this.profile));
  }

  public async embedQuery(query: string): Promise<Float32Array> {
    const canonical = readTexts([query]);
    const vectors = await this.embedPrefixed([
      queryInput(canonical[0] ?? "", this.profile),
    ]);
    const vector = vectors[0];
    if (vector === undefined) {
      throw new E5EmbeddingError(
        "EMBEDDING_COUNT_MISMATCH",
        "runtime did not return the query embedding",
      );
    }
    return vector;
  }

  public async dispose(): Promise<void> {
    const pending = this.sessionPromise;
    if (pending === undefined) {
      return;
    }

    this.sessionPromise = undefined;
    const session = await pending;
    await session.dispose();
  }

  private getSession(): Promise<E5EmbeddingSession> {
    if (this.sessionPromise === undefined) {
      const loading = this.runtime.load({
        repository: this.profile.repository,
        revision: this.profile.revision,
        dtype: this.profile.dtype,
        cacheDir: this.cacheDir,
        localFilesOnly: true,
      });
      this.sessionPromise = loading.catch((cause: unknown) => {
        this.sessionPromise = undefined;
        throw new E5EmbeddingError(
          "MODEL_LOAD_FAILED",
          `E5 Small could not be loaded from ${this.cacheDir}. Run "auto-youtube-rag models install" first.`,
          { cause },
        );
      });
    }

    return this.sessionPromise;
  }

  private async countPrefixed(
    texts: readonly string[],
  ): Promise<readonly number[]> {
    const session = await this.getSession();
    return readTokenCounts(await session.countTokens(texts), texts.length);
  }

  private async embedPrefixed(
    texts: readonly string[],
  ): Promise<readonly Float32Array[]> {
    const counts = await this.countPrefixed(texts);
    const oversized = counts.findIndex(
      (count) => count > this.profile.maxInputTokens,
    );
    if (oversized >= 0) {
      throw new E5EmbeddingError(
        "INPUT_TOO_LONG",
        `input ${String(oversized)} has ${String(counts[oversized])} tokens and exceeds the ${String(this.profile.maxInputTokens)} token model limit`,
      );
    }

    const session = await this.getSession();
    const vectors: Float32Array[] = [];
    for (let offset = 0; offset < texts.length; offset += this.batchSize) {
      const batch = Object.freeze(texts.slice(offset, offset + this.batchSize));
      const raw = await session.embed(batch);
      if (!Array.isArray(raw) || raw.length !== batch.length) {
        throw new E5EmbeddingError(
          "EMBEDDING_COUNT_MISMATCH",
          "runtime must return exactly one embedding per text",
        );
      }
      const dimensions = this.profile.dimensions;
      vectors.push(
        ...raw.map((vector: readonly number[] | Float32Array) =>
          normalizeVector(vector, dimensions),
        ),
      );
    }

    return Object.freeze(vectors);
  }
}
