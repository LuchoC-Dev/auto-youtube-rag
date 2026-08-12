import type { KnowledgeUnit } from "../../domain/indexing/knowledge-unit.js";
import type { ContextUnitBlock } from "./context-blocks.js";
import type { RetrievalCandidate } from "../retrieval/retrieval-results.js";

export interface ExpandToAncestorsInput {
  readonly candidates: readonly RetrievalCandidate[];
  /** Each candidate's own unit, keyed by `unitId.value`. Only its `parentId`
   * and `depth` are used here; the citable text comes from `provenance`. */
  readonly candidateUnits: ReadonlyMap<string, KnowledgeUnit>;
  /** The deduplicated union of every ancestor reachable from any candidate,
   * as returned by `KnowledgeRepository.getAncestors`. */
  readonly ancestorUnits: readonly KnowledgeUnit[];
}

/**
 * `CandidateProvenance` does not carry `contentHash` (it is a 2.2 contract
 * already closed). The candidate's own `KnowledgeUnit`, fetched via
 * `getUnits` for the `parentId` walk, already has it, so it is reused here
 * instead of adding a field to a settled port.
 */
function candidateBlock(
  candidate: RetrievalCandidate,
  candidateUnit: KnowledgeUnit,
): ContextUnitBlock {
  const { provenance } = candidate;

  return {
    unitId: provenance.unitId,
    packageRef: provenance.packageRef,
    unitType: provenance.unitType,
    headingPath: provenance.headingPath,
    title: provenance.title,
    content: provenance.content,
    contentHash: candidateUnit.contentHash,
    tokenCount: provenance.tokenCount,
    origin: "candidate",
    fusedScore: candidate.fusedScore,
    depth: candidateUnit.depth,
    documentKind: provenance.documentKind,
    documentRelativePath: provenance.documentRelativePath,
    videoTitle: provenance.videoTitle,
    creator: provenance.creator,
    canonicalUrl: provenance.canonicalUrl,
    language: provenance.language,
    timestamps: provenance.timestamps,
    visualEvidence: provenance.visualEvidence,
  };
}

function ancestorBlock(
  unit: KnowledgeUnit,
  originatingCandidate: RetrievalCandidate,
): ContextUnitBlock {
  const { provenance } = originatingCandidate;

  return {
    unitId: unit.id,
    packageRef: provenance.packageRef,
    unitType: unit.unitType,
    headingPath: unit.headingPath,
    title: unit.title,
    content: unit.content,
    contentHash: unit.contentHash,
    tokenCount: unit.estimatedTokens,
    origin: "ancestor",
    fusedScore: originatingCandidate.fusedScore,
    depth: unit.depth,
    documentKind: provenance.documentKind,
    documentRelativePath: provenance.documentRelativePath,
    videoTitle: provenance.videoTitle,
    creator: provenance.creator,
    canonicalUrl: provenance.canonicalUrl,
    language: provenance.language,
    timestamps: unit.timestamps,
    visualEvidence: unit.visualEvidence,
  };
}

/**
 * Merges candidates and their ancestor chains into one block per unique
 * `unitId`. A unit that already surfaced as a candidate is never rebuilt as
 * an ancestor, and two candidates that share an ancestor produce a single
 * shared block: the walk for the second candidate stops the moment it
 * reaches a `unitId` already built.
 */
export function expandToAncestors(
  input: ExpandToAncestorsInput,
): readonly ContextUnitBlock[] {
  const ancestorsById = new Map(
    input.ancestorUnits.map((unit) => [unit.id.value, unit]),
  );
  const blocks = new Map<string, ContextUnitBlock>();

  for (const candidate of input.candidates) {
    const unitKey = candidate.provenance.unitId.value;
    const candidateUnit = input.candidateUnits.get(unitKey);

    if (candidateUnit === undefined) {
      continue;
    }

    if (!blocks.has(unitKey)) {
      blocks.set(unitKey, candidateBlock(candidate, candidateUnit));
    }

    let parentId = candidateUnit.parentId;

    while (parentId !== null) {
      const parentKey = parentId.value;

      if (blocks.has(parentKey)) {
        break;
      }

      const ancestorUnit = ancestorsById.get(parentKey);

      if (ancestorUnit === undefined) {
        break;
      }

      blocks.set(parentKey, ancestorBlock(ancestorUnit, candidate));
      parentId = ancestorUnit.parentId;
    }
  }

  return Object.freeze([...blocks.values()]);
}
