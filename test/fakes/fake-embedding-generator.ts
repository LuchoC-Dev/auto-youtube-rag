import type {
  EmbeddingGenerator,
  EmbeddingModelDescriptor,
} from "../../src/application/ports/embedding-generator.js";

export class FakeEmbeddingGenerator implements EmbeddingGenerator {
  public embedCalls = 0;
  public readonly descriptor: EmbeddingModelDescriptor = Object.freeze({
    key: "fake-e5",
    version: "1",
    dimensions: 3,
    maxInputTokens: 64,
  });

  public describe(): Promise<EmbeddingModelDescriptor> {
    return Promise.resolve(this.descriptor);
  }

  public countTokens(texts: readonly string[]): Promise<readonly number[]> {
    return Promise.resolve(
      texts.map((text) => Math.max(1, text.split(/\s+/u).length)),
    );
  }

  public embedDocuments(
    texts: readonly string[],
  ): Promise<readonly Float32Array[]> {
    this.embedCalls += 1;
    return Promise.resolve(
      texts.map((text) => new Float32Array([text.length, 1, -1])),
    );
  }

  public embedQuery(query: string): Promise<Float32Array> {
    return Promise.resolve(new Float32Array([query.length, 1, -1]));
  }
}
