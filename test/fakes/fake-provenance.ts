import {
  createFragmentKey,
  sha256,
} from "../../src/domain/indexing/content-identity.js";
import {
  KnowledgeUnitId,
  SearchFragmentId,
  type PackageRef,
} from "../../src/domain/indexing/identifiers.js";
import type { CandidateProvenance } from "../../src/application/retrieval/retrieval-results.js";

export interface FakeProvenanceInput {
  readonly name: string;
  readonly packageRef: PackageRef;
  readonly unitId: string;
  readonly content?: string;
  readonly language?: string | null;
}

/** Builds a plausible, internally consistent CandidateProvenance for tests. */
export function fakeProvenance(
  input: FakeProvenanceInput,
): CandidateProvenance {
  const unitId = KnowledgeUnitId.create(
    `unit:${input.packageRef.serialize()}:${sha256(input.unitId).slice(0, 12)}`,
  );
  const fragmentId = SearchFragmentId.create(createFragmentKey(unitId, 0));

  return {
    fragmentId,
    unitId,
    packageRef: input.packageRef,
    unitType: "context_section",
    documentKind: "context",
    documentRelativePath: "deliverables/context.md",
    headingPath: [input.name],
    title: input.name,
    content: input.content ?? `${input.name} content`,
    tokenCount: 8,
    videoTitle: input.name,
    creator: "Test channel",
    canonicalUrl: `https://www.youtube.com/watch?v=${input.packageRef.videoId.value}`,
    language: input.language ?? "es",
    timestamps: [],
    visualEvidence: [],
  };
}
