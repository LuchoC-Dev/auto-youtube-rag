import type {
  TextSearchIndex,
  TextSearchRequest,
} from "../../src/application/ports/text-search-index.js";
import type { RankedHit } from "../../src/application/retrieval/retrieval-results.js";

export class FakeTextSearchIndex implements TextSearchIndex {
  public calls: TextSearchRequest[] = [];
  public hits: readonly RankedHit[] = [];
  public failure: Error | null = null;

  public search(request: TextSearchRequest): Promise<readonly RankedHit[]> {
    this.calls.push(request);

    if (this.failure) {
      return Promise.reject(this.failure);
    }

    return Promise.resolve(this.hits);
  }
}
