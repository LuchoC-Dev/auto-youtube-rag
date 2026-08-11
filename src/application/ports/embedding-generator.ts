export interface EmbeddingModelDescriptor {
  readonly key: string;
  readonly version: string;
  readonly dimensions: number;
  readonly maxInputTokens: number;
}

export interface EmbeddingGenerator {
  describe(): Promise<EmbeddingModelDescriptor>;
  /**
   * Counts each text exactly as `embedDocuments` will submit it to the model,
   * including document prefixes and special tokens owned by the adapter.
   */
  countTokens(texts: readonly string[]): Promise<readonly number[]>;
  embedDocuments(texts: readonly string[]): Promise<readonly Float32Array[]>;
  embedQuery(query: string): Promise<Float32Array>;
}
