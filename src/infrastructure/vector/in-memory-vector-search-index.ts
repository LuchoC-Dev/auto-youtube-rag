import type { EmbeddingModelDescriptor } from "../../application/ports/embedding-generator.js";
import type {
  VectorSearchIndex,
  VectorSearchRequest,
} from "../../application/ports/vector-search-index.js";
import type { VectorIndexChange } from "../../application/ports/vector-index-sink.js";
import type { RankedHit } from "../../application/retrieval/retrieval-results.js";
import { createFragmentKey } from "../../domain/indexing/content-identity.js";
import {
  KnowledgeUnitId,
  SearchFragmentId,
} from "../../domain/indexing/identifiers.js";
import type { RetrievalFilter } from "../../domain/retrieval/retrieval-filter.js";
import type { VectorEntry, VectorSource } from "./sqlite-vector-loader.js";

export type VectorSearchErrorCode =
  "INVALID_LIMIT" | "MODEL_NOT_LOADED" | "QUERY_DIMENSION_MISMATCH";

export class VectorSearchError extends Error {
  public readonly code: VectorSearchErrorCode;

  public constructor(code: VectorSearchErrorCode, message: string) {
    super(message);
    this.name = "VectorSearchError";
    this.code = code;
  }
}

interface LoadedIndex {
  readonly model: EmbeddingModelDescriptor;
  /** All vectors laid out contiguously as `entries × dimensions`. */
  readonly matrix: Float32Array;
  readonly entries: readonly VectorEntry[];
}

function matches(entry: VectorEntry, filter: RetrievalFilter): boolean {
  if (
    filter.sources.length > 0 &&
    !filter.sources.some((source) => source.value === entry.sourceName)
  ) {
    return false;
  }

  if (
    filter.videoIds.length > 0 &&
    !filter.videoIds.some((videoId) => videoId.value === entry.videoId)
  ) {
    return false;
  }

  if (
    filter.unitTypes.length > 0 &&
    !filter.unitTypes.some((unitType) => unitType === entry.unitType)
  ) {
    return false;
  }

  return (
    filter.languages.length === 0 ||
    (entry.language !== null && filter.languages.includes(entry.language))
  );
}

interface ScoredEntry {
  readonly index: number;
  readonly score: number;
  readonly fragmentId: SearchFragmentId;
}

/**
 * Exact nearest-neighbour search over the whole library.
 *
 * At the scale this product targets a full scan costs milliseconds, so the
 * index trades nothing for the approximation error an ANN structure would
 * introduce. It stays behind `VectorSearchIndex`, which is what allows a
 * different backend to replace it later without touching the use case.
 */
export class InMemoryVectorSearchIndex implements VectorSearchIndex {
  private loaded: LoadedIndex | null = null;

  public constructor(private readonly source: VectorSource) {}

  public load(model: EmbeddingModelDescriptor): Promise<number> {
    if (this.loaded !== null && this.loaded.model.key === model.key) {
      return Promise.resolve(this.loaded.entries.length);
    }

    try {
      const entries = this.source.load(model);
      const matrix = new Float32Array(entries.length * model.dimensions);

      for (const [position, entry] of entries.entries()) {
        matrix.set(entry.vector, position * model.dimensions);
      }

      this.loaded = { model, matrix, entries };
      return Promise.resolve(entries.length);
    } catch (error: unknown) {
      this.loaded = null;
      return Promise.reject(
        error instanceof Error
          ? error
          : new Error("Loading the vector index failed.", { cause: error }),
      );
    }
  }

  /**
   * Published changes carry vectors but not the attributes retrieval filters
   * on, so the index drops its snapshot instead of patching it. SQLite is
   * already the source of truth and the change was committed before being
   * published, so the next query simply rebuilds from it.
   */
  public apply(change: VectorIndexChange): Promise<void> {
    void change;
    this.loaded = null;
    return Promise.resolve();
  }

  public search(
    vector: Float32Array,
    request: VectorSearchRequest,
  ): Promise<readonly RankedHit[]> {
    const loaded = this.loaded;

    if (loaded === null) {
      return Promise.reject(
        new VectorSearchError(
          "MODEL_NOT_LOADED",
          "The vector index must be loaded before searching.",
        ),
      );
    }

    if (!Number.isSafeInteger(request.limit) || request.limit < 1) {
      return Promise.reject(
        new VectorSearchError(
          "INVALID_LIMIT",
          "Vector search limit must be a positive safe integer.",
        ),
      );
    }

    if (vector.length !== loaded.model.dimensions) {
      return Promise.reject(
        new VectorSearchError(
          "QUERY_DIMENSION_MISMATCH",
          `The query vector has ${String(vector.length)} dimensions but the model declares ${String(loaded.model.dimensions)}.`,
        ),
      );
    }

    const scored: ScoredEntry[] = [];

    for (const [position, entry] of loaded.entries.entries()) {
      if (!matches(entry, request.filter)) {
        continue;
      }

      scored.push({
        index: position,
        // Indexed vectors are normalised, so the dot product is the cosine
        // similarity without paying for a square root per fragment.
        score: this.dotProduct(loaded, position, vector),
        fragmentId: SearchFragmentId.create(
          createFragmentKey(
            KnowledgeUnitId.create(entry.unitKey),
            entry.ordinal,
          ),
        ),
      });
    }

    scored.sort(compareScored);

    return Promise.resolve(
      scored.slice(0, request.limit).map((entry, index) => ({
        fragmentId: entry.fragmentId,
        rank: index + 1,
        rawScore: entry.score,
      })),
    );
  }

  private dotProduct(
    loaded: LoadedIndex,
    position: number,
    query: Float32Array,
  ): number {
    const { dimensions } = loaded.model;
    const offset = position * dimensions;
    let total = 0;

    for (let axis = 0; axis < dimensions; axis += 1) {
      total += (loaded.matrix[offset + axis] ?? 0) * (query[axis] ?? 0);
    }

    return total;
  }
}

function compareScored(left: ScoredEntry, right: ScoredEntry): number {
  if (left.score !== right.score) {
    return right.score - left.score;
  }

  return left.fragmentId.value.localeCompare(right.fragmentId.value, "en");
}
