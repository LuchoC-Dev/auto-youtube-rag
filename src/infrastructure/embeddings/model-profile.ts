import type { EmbeddingModelDescriptor } from "../../application/ports/embedding-generator.js";

export interface EmbeddingInputPrefixes {
  readonly passage: string;
  readonly query: string;
}

export interface EmbeddingModelProfile {
  readonly key: string;
  readonly repository: string;
  readonly revision: string;
  readonly dtype: "q8";
  readonly dimensions: number;
  readonly maxInputTokens: number;
  /** `null` means "this model carries no prefixes", not "not decided yet":
   * it is the difference between E5 and MiniLM/BGE/Jina. */
  readonly inputPrefixes: EmbeddingInputPrefixes | null;
  /** Paths relative to `<modelsPath>/<repository>/` that the runtime needs
   * to load the model locally. */
  readonly requiredFiles: readonly string[];
}

export const activeModelProfile: EmbeddingModelProfile = Object.freeze({
  key: "e5-small",
  repository: "Xenova/multilingual-e5-small",
  revision: "main",
  dtype: "q8",
  dimensions: 384,
  maxInputTokens: 512,
  inputPrefixes: Object.freeze({ passage: "passage: ", query: "query: " }),
  requiredFiles: Object.freeze([
    "config.json",
    "tokenizer.json",
    "tokenizer_config.json",
    "onnx/model_quantized.onnx",
  ]),
});

/**
 * Derives the version string persisted in the `embeddings` table. The prefix
 * policy participates in the derivation: if a profile ever turned prefixes
 * off without changing repository/revision/dtype, `key`/`version`/
 * `dimensions` would otherwise stay identical, `unchanged()` in
 * sync-source.ts would report "no changes", and the library would serve
 * stale prefixed vectors against unprefixed queries. Silently, which would
 * be worse than the original bug. See docs/model-profile-design.md,
 * Decision 3.
 */
export function modelVersion(profile: EmbeddingModelProfile): string {
  const base = `${profile.repository}@${profile.revision}:${profile.dtype}`;
  return profile.inputPrefixes === null ? `${base}+noprefix` : base;
}

/** The only place a profile is translated into the application port's type. */
export function modelDescriptorOf(
  profile: EmbeddingModelProfile,
): EmbeddingModelDescriptor {
  return Object.freeze({
    key: profile.key,
    version: modelVersion(profile),
    dimensions: profile.dimensions,
    maxInputTokens: profile.maxInputTokens,
  });
}
