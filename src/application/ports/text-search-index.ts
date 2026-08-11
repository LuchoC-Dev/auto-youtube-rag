import type { RetrievalFilter } from "../../domain/retrieval/retrieval-filter.js";
import type { RankedHit } from "../retrieval/retrieval-results.js";

export interface TextSearchRequest {
  /**
   * The normalized user query as plain text. The adapter owns the translation
   * into its own query grammar; callers never write index syntax.
   */
  readonly text: string;
  readonly filter: RetrievalFilter;
  readonly limit: number;
}

export interface TextSearchIndex {
  search(request: TextSearchRequest): Promise<readonly RankedHit[]>;
}
