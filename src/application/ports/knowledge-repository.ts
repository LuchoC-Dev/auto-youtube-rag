import type {
  KnowledgeUnitId,
  SearchFragmentId,
} from "../../domain/indexing/identifiers.js";
import type { KnowledgeUnit } from "../../domain/indexing/knowledge-unit.js";
import type { CandidateProvenance } from "../retrieval/retrieval-results.js";

export interface KnowledgeRepository {
  /**
   * Resolves a whole batch at once, because hydrating candidates one by one
   * would issue a query per hit. Unknown ids are omitted rather than invented,
   * so the result may be shorter than the request.
   */
  getFragmentProvenance(
    ids: readonly SearchFragmentId[],
  ): Promise<readonly CandidateProvenance[]>;
  getUnits(ids: readonly KnowledgeUnitId[]): Promise<readonly KnowledgeUnit[]>;
  /**
   * Walks each unit up to its document root. Point 2.3 uses this to widen a
   * small hit into the section that explains it.
   */
  getAncestors(
    ids: readonly KnowledgeUnitId[],
  ): Promise<readonly KnowledgeUnit[]>;
}
