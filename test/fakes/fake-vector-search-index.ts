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
  /** Vectors available for the loaded model. Defaults to `hits.length` so
   * tests that only care about search results need not set this
   * separately; tests exercising `VECTORS_STALE` set it explicitly. */
  public vectorCount: number | null = null;

  public load(model: EmbeddingModelDescriptor): Promise<number> {
    this.loads.push(model);
    return Promise.resolve(this.vectorCount ?? this.hits.length);
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
