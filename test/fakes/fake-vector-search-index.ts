import type { EmbeddingModelDescriptor } from "../../src/application/ports/embedding-generator.js";
import type {
  VectorSearchIndex,
  VectorSearchRequest,
} from "../../src/application/ports/vector-search-index.js";
import type { VectorIndexChange } from "../../src/application/ports/vector-index-sink.js";
import type { RankedHit } from "../../src/application/retrieval/retrieval-results.js";

export class FakeVectorSearchIndex implements VectorSearchIndex {
  public loads: EmbeddingModelDescriptor[] = [];
  public applied: VectorIndexChange[] = [];
  public searchCalls: {
    readonly vector: Float32Array;
    readonly request: VectorSearchRequest;
  }[] = [];
  public hits: readonly RankedHit[] = [];
  public failure: Error | null = null;

  public load(model: EmbeddingModelDescriptor): Promise<void> {
    this.loads.push(model);
    return Promise.resolve();
  }

  public apply(change: VectorIndexChange): Promise<void> {
    this.applied.push(change);
    return Promise.resolve();
  }

  public search(
    vector: Float32Array,
    request: VectorSearchRequest,
  ): Promise<readonly RankedHit[]> {
    this.searchCalls.push({ vector, request });

    if (this.failure) {
      return Promise.reject(this.failure);
    }

    return Promise.resolve(this.hits);
  }
}
