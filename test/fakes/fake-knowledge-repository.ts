import type { KnowledgeRepository } from "../../src/application/ports/knowledge-repository.js";
import type {
  KnowledgeUnitId,
  SearchFragmentId,
} from "../../src/domain/indexing/identifiers.js";
import type { KnowledgeUnit } from "../../src/domain/indexing/knowledge-unit.js";
import type { CandidateProvenance } from "../../src/application/retrieval/retrieval-results.js";

export class FakeKnowledgeRepository implements KnowledgeRepository {
  public provenanceCalls: (readonly SearchFragmentId[])[] = [];
  public provenanceByFragment = new Map<string, CandidateProvenance>();
  public units: readonly KnowledgeUnit[] = [];
  public ancestors: readonly KnowledgeUnit[] = [];

  public getFragmentProvenance(
    ids: readonly SearchFragmentId[],
  ): Promise<readonly CandidateProvenance[]> {
    this.provenanceCalls.push(ids);

    const found: CandidateProvenance[] = [];

    for (const id of ids) {
      const entry = this.provenanceByFragment.get(id.value);

      if (entry !== undefined) {
        found.push(entry);
      }
    }

    return Promise.resolve(found);
  }

  public getUnits(
    ids: readonly KnowledgeUnitId[],
  ): Promise<readonly KnowledgeUnit[]> {
    void ids;
    return Promise.resolve(this.units);
  }

  public getAncestors(
    ids: readonly KnowledgeUnitId[],
  ): Promise<readonly KnowledgeUnit[]> {
    void ids;
    return Promise.resolve(this.ancestors);
  }
}
