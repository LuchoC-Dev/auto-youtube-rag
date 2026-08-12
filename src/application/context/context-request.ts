import type { ContextBudget } from "../../domain/context/context-budget.js";
import type { RetrievalQuery } from "../../domain/retrieval/retrieval-query.js";

/**
 * Everything `assembleContext` needs beyond what `RetrievalQuery` already
 * carries. The query's own filter and candidate limits (2.2) stay untouched;
 * `ContextBudget` is the only concept 2.3 adds.
 */
export interface ContextRequest {
  readonly query: RetrievalQuery;
  readonly budget: ContextBudget;
}
