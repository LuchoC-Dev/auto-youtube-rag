import { sha256 } from "../../src/domain/indexing/content-identity.js";
import {
  DocumentId,
  KnowledgeUnitId,
  type PackageRef,
} from "../../src/domain/indexing/identifiers.js";
import {
  KnowledgeUnit,
  type KnowledgeUnitType,
} from "../../src/domain/indexing/knowledge-unit.js";

/**
 * Derives the same `KnowledgeUnitId` that `fakeProvenance` builds from a raw
 * id, so tests can construct a candidate's provenance and its own unit (or an
 * ancestor unit) that agree on identity.
 */
export function fakeUnitId(
  packageRef: PackageRef,
  rawId: string,
): KnowledgeUnitId {
  return KnowledgeUnitId.create(
    `unit:${packageRef.serialize()}:${sha256(rawId).slice(0, 12)}`,
  );
}

export interface FakeKnowledgeUnitInput {
  readonly packageRef: PackageRef;
  readonly rawId: string;
  readonly parentRawId?: string | null;
  readonly unitType?: KnowledgeUnitType;
  readonly depth?: number;
  readonly title?: string | null;
  readonly content?: string;
  readonly headingPath?: readonly string[];
}

/** Builds a plausible, internally consistent KnowledgeUnit for tests. */
export function fakeKnowledgeUnit(
  input: FakeKnowledgeUnitInput,
): KnowledgeUnit {
  const id = fakeUnitId(input.packageRef, input.rawId);
  const parentId =
    input.parentRawId === undefined || input.parentRawId === null
      ? null
      : fakeUnitId(input.packageRef, input.parentRawId);
  const documentId = DocumentId.create(
    `document:${input.packageRef.sourceName.value}:${input.packageRef.videoId.value}:context`,
  );
  const unitType: KnowledgeUnitType =
    input.unitType ??
    (parentId === null ? "context_document" : "context_section");
  const content = input.content ?? `${input.rawId} content`;

  return KnowledgeUnit.create({
    id,
    documentId,
    parentId,
    unitType,
    depth: input.depth ?? (parentId === null ? 0 : 1),
    ordinal: 0,
    title: input.title ?? null,
    content,
    structuredJson: null,
    headingPath: input.headingPath ?? [],
    timestamps: [],
    visualEvidence: [],
    estimatedTokens: 8,
    contentHash: sha256(content),
    searchable: true,
  });
}
