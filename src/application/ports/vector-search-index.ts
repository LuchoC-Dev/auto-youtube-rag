import type { RetrievalFilter } from "../../domain/retrieval/retrieval-filter.js";
import type { RankedHit } from "../retrieval/retrieval-results.js";
import type { EmbeddingModelDescriptor } from "./embedding-generator.js";
import type { VectorIndexSink } from "./vector-index-sink.js";

export interface VectorSearchRequest {
  readonly filter: RetrievalFilter;
  readonly limit: number;
}

/**
 * Extends the write-only sink instead of standing beside it: one object owns
 * the vectors, so a published change and a served query can never disagree.
 */
export interface VectorSearchIndex extends VectorIndexSink {
  /**
   * Prepares the index for the active model. Implementations may load lazily,
   * but must reject vectors belonging to a different model or dimension rather
   * than comparing incompatible vector spaces.
   *
   * Resolves to the number of vectors now available for `model`. A caller
   * cannot otherwise tell a genuinely empty library apart from an index that
   * holds vectors for a model that is no longer active — both surface as
   * zero search hits.
   */
  load(model: EmbeddingModelDescriptor): Promise<number>;
  search(
    vector: Float32Array,
    request: VectorSearchRequest,
  ): Promise<readonly RankedHit[]>;
}
