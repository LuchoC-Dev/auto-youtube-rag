import { createHash } from "node:crypto";

import { DomainValidationError } from "./domain-error.js";
import { KnowledgeUnitId } from "./identifiers.js";

export const ruleChildKinds = [
  "rule_item",
  "avoid_item",
  "acceptance_criterion",
] as const;
export type RuleChildKind = (typeof ruleChildKinds)[number];

const structuralSegmentPattern =
  /^[A-Za-z0-9](?:[A-Za-z0-9._-]*[A-Za-z0-9])?$/u;

function invalid(field: string, expectation: string): never {
  throw new DomainValidationError(
    "INVALID_IDENTIFIER",
    field,
    `${field} ${expectation}`,
  );
}

function readNonNegativeInteger(input: unknown, field: string): number {
  if (typeof input !== "number" || !Number.isSafeInteger(input) || input < 0) {
    invalid(field, "must be a non-negative safe integer");
  }

  return input;
}

function readStructuralSegment(input: unknown, field: string): string {
  if (typeof input !== "string" || !structuralSegmentPattern.test(input)) {
    invalid(field, "must be a non-empty safe structural segment");
  }

  return input;
}

function readRuleChildKind(input: unknown): RuleChildKind {
  if (
    typeof input !== "string" ||
    !ruleChildKinds.some((candidate) => candidate === input)
  ) {
    invalid("kind", "must be rule_item, avoid_item or acceptance_criterion");
  }

  return input as RuleChildKind;
}

function normalizeHeading(input: unknown): string {
  if (typeof input !== "string" || input.includes("\0")) {
    invalid("headingPath", "must contain only non-empty headings");
  }

  const normalized = input
    .normalize("NFKC")
    .trim()
    .replace(/\s+/gu, " ")
    .toLowerCase();

  if (normalized.length === 0) {
    invalid("headingPath", "must contain only non-empty headings");
  }

  return normalized;
}

export function sha256(input: string | Uint8Array): string {
  if (typeof input !== "string" && !(input instanceof Uint8Array)) {
    invalid("content", "must be text or bytes");
  }

  return createHash("sha256").update(input).digest("hex");
}

export function createMarkdownSectionKey(
  headingPath: readonly string[],
  occurrence: number,
): string {
  if (!Array.isArray(headingPath) || headingPath.length === 0) {
    invalid("headingPath", "must contain at least one heading");
  }

  const normalizedPath = headingPath.map(normalizeHeading);
  const normalizedOccurrence = readNonNegativeInteger(occurrence, "occurrence");

  return `heading:${sha256(JSON.stringify(normalizedPath))}:${String(normalizedOccurrence)}`;
}

export function createRulePatternKey(patternId: string): string {
  return `pattern:${readStructuralSegment(patternId, "patternId")}`;
}

export function createRuleChildKey(
  patternId: string,
  kind: unknown,
  ordinal: number,
): string {
  const normalizedKind = readRuleChildKind(kind);

  return `${createRulePatternKey(patternId)}/${normalizedKind}:${String(readNonNegativeInteger(ordinal, "ordinal"))}`;
}

export function createAnalysisTopicKey(topicId: string): string {
  return `topic:${readStructuralSegment(topicId, "topicId")}`;
}

export function createAnalysisRecommendationKey(
  recommendationId: string,
): string {
  return `recommendation:${readStructuralSegment(recommendationId, "recommendationId")}`;
}

export function createFragmentKey(
  unitId: KnowledgeUnitId,
  ordinal: number,
): string {
  if (!(unitId instanceof KnowledgeUnitId)) {
    invalid("unitId", "must be a KnowledgeUnitId");
  }

  const normalizedOrdinal = readNonNegativeInteger(ordinal, "ordinal");

  return `fragment:${sha256(unitId.value)}:${String(normalizedOrdinal)}`;
}
