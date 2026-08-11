import {
  createMarkdownSectionKey,
  createRuleChildKey,
  createRulePatternKey,
  sha256,
  type RuleChildKind,
} from "../../domain/indexing/content-identity.js";
import {
  DocumentId,
  KnowledgeUnitId,
  type PackageRef,
} from "../../domain/indexing/identifiers.js";
import {
  KnowledgeUnit,
  type KnowledgeUnitType,
} from "../../domain/indexing/knowledge-unit.js";
import type {
  ContextDocumentSnapshot,
  ContextPackageDocumentSnapshot,
  ContextSectionSnapshot,
  PackageSnapshot,
  RulePatternSnapshot,
  RulesDocumentSnapshot,
  RulesPackageDocumentSnapshot,
} from "./package-snapshots.js";

interface UnitInput {
  readonly id: KnowledgeUnitId;
  readonly documentId: DocumentId;
  readonly parentId: KnowledgeUnitId | null;
  readonly unitType: KnowledgeUnitType;
  readonly depth: number;
  readonly ordinal: number;
  readonly title: string | null;
  readonly content: string;
  readonly structuredJson: string | null;
  readonly headingPath: readonly string[];
  readonly timestamps: readonly string[];
  readonly visualEvidence: readonly string[];
  readonly searchable: boolean;
}

interface RulesSectionInput {
  readonly key: string;
  readonly ordinal: number;
  readonly title: string;
  readonly content: string;
  readonly structuredJson: string | null;
  readonly visualEvidence?: readonly string[];
  readonly searchable: boolean;
}

const timestampPattern = /(?<!\d)(?:\d{1,2}:)?\d{2}:\d{2}(?!\d)/gu;

function createDocumentId(
  ref: PackageRef,
  kind: "context" | "rules",
): DocumentId {
  return DocumentId.create(
    `document:${ref.sourceName.value}:${ref.videoId.value}:${kind}`,
  );
}

function createUnitId(
  ref: PackageRef,
  kind: "context" | "rules",
  structuralKey: string,
): KnowledgeUnitId {
  return KnowledgeUnitId.create(
    `unit:${ref.sourceName.value}:${ref.videoId.value}:${kind}:${structuralKey.replaceAll("/", ":")}`,
  );
}

function estimateTokens(content: string): number {
  return Math.max(1, Math.ceil(Array.from(content).length / 4));
}

function createUnit(input: UnitInput): KnowledgeUnit {
  return KnowledgeUnit.create({
    ...input,
    estimatedTokens: estimateTokens(input.content),
    contentHash: sha256(input.content),
  });
}

function json(value: unknown): string {
  return JSON.stringify(value);
}

function contextTitle(document: ContextDocumentSnapshot): string {
  const title = document.frontmatter.title;
  return typeof title === "string" && title.trim() !== ""
    ? title
    : "Context document";
}

function renderContextSection(section: ContextSectionSnapshot): string {
  const ownContent = section.content.trim();
  const heading = `${"#".repeat(section.level)} ${section.title}`;
  const children = section.children.map(renderContextSection);

  return [heading, ownContent, ...children]
    .filter((part) => part !== "")
    .join("\n\n");
}

function renderContextDocument(document: ContextDocumentSnapshot): string {
  const rendered = [
    document.preamble.trim(),
    ...document.sections.map(renderContextSection),
  ]
    .filter((part) => part !== "")
    .join("\n\n");

  return rendered === "" ? contextTitle(document) : rendered;
}

function buildContextUnits(
  ref: PackageRef,
  document: ContextPackageDocumentSnapshot,
): readonly KnowledgeUnit[] {
  const documentId = createDocumentId(ref, "context");
  const rootId = createUnitId(ref, "context", "root");
  const units: KnowledgeUnit[] = [
    createUnit({
      id: rootId,
      documentId,
      parentId: null,
      unitType: "context_document",
      depth: 0,
      ordinal: 0,
      title: contextTitle(document.content),
      content: renderContextDocument(document.content),
      structuredJson: json({ frontmatter: document.content.frontmatter }),
      headingPath: [],
      timestamps: [],
      visualEvidence: [],
      searchable: false,
    }),
  ];
  const occurrences = new Map<string, number>();

  function visit(
    section: ContextSectionSnapshot,
    parentId: KnowledgeUnitId,
    depth: number,
  ): void {
    const occurrenceGroup = createMarkdownSectionKey(section.headingPath, 0);
    const occurrence = occurrences.get(occurrenceGroup) ?? 0;
    occurrences.set(occurrenceGroup, occurrence + 1);
    const id = createUnitId(
      ref,
      "context",
      createMarkdownSectionKey(section.headingPath, occurrence),
    );
    const directContent = section.content.trim();
    units.push(
      createUnit({
        id,
        documentId,
        parentId,
        unitType: "context_section",
        depth,
        ordinal: section.ordinal,
        title: section.title,
        content: directContent === "" ? section.title : directContent,
        structuredJson: json({ level: section.level }),
        headingPath: section.headingPath,
        timestamps: section.timestamps,
        visualEvidence: section.visualEvidence,
        searchable: directContent !== "",
      }),
    );

    for (const child of section.children) {
      visit(child, id, depth + 1);
    }
  }

  for (const section of document.content.sections) {
    visit(section, rootId, 1);
  }

  return Object.freeze(units);
}

function uniqueTimestamps(input: string): readonly string[] {
  return Object.freeze([...new Set(input.match(timestampPattern) ?? [])]);
}

function renderEvidence(document: RulesDocumentSnapshot): string {
  const parts: string[] = [];

  if (
    document.evidence.frameSampling !== null &&
    document.evidence.frameSampling !== undefined
  ) {
    parts.push(`Frame sampling: ${document.evidence.frameSampling}`);
  }

  if (document.evidence.limitations.length > 0) {
    parts.push(
      `Limitations:\n${document.evidence.limitations.map((item) => `- ${item}`).join("\n")}`,
    );
  }

  return parts.join("\n\n") || "No evidence limitations declared.";
}

function renderPattern(pattern: RulePatternSnapshot): string {
  const parts = [
    pattern.name,
    `Principle: ${pattern.principle}`,
    `Problem: ${pattern.problem}`,
    `Source basis: ${pattern.sourceBasis.direct}`,
  ];

  if (pattern.sourceBasis.professionalExtension !== null) {
    parts.push(
      `Professional extension: ${pattern.sourceBasis.professionalExtension}`,
    );
  }

  return parts.join("\n\n");
}

function renderRulesDocument(document: RulesDocumentSnapshot): string {
  const patterns = document.patterns.map(renderPattern).join("\n\n");
  const workflow = document.agentWorkflow.map((item) => `- ${item}`).join("\n");

  return [document.coreThesis, patterns, workflow]
    .filter((part) => part !== "")
    .join("\n\n");
}

function buildRuleChildUnits(
  ref: PackageRef,
  documentId: DocumentId,
  pattern: RulePatternSnapshot,
  parentId: KnowledgeUnitId,
  timestamps: readonly string[],
): readonly KnowledgeUnit[] {
  const units: KnowledgeUnit[] = [];
  let siblingOrdinal = 0;

  function append(
    items: readonly string[],
    kind: RuleChildKind,
    title: string,
    heading: string,
  ): void {
    items.forEach((content, localOrdinal) => {
      units.push(
        createUnit({
          id: createUnitId(
            ref,
            "rules",
            createRuleChildKey(pattern.id, kind, localOrdinal),
          ),
          documentId,
          parentId,
          unitType: kind,
          depth: 3,
          ordinal: siblingOrdinal,
          title: `${title} ${String(localOrdinal + 1)}`,
          content,
          structuredJson: json({
            patternId: pattern.id,
            kind,
            ordinal: localOrdinal,
          }),
          headingPath: ["Patterns", pattern.name, heading],
          timestamps,
          visualEvidence: pattern.visualEvidence,
          searchable: true,
        }),
      );
      siblingOrdinal += 1;
    });
  }

  append(pattern.rules, "rule_item", "Rule", "Rules");
  append(pattern.avoid, "avoid_item", "Avoid", "Avoid");
  append(
    pattern.acceptanceCriteria,
    "acceptance_criterion",
    "Acceptance criterion",
    "Acceptance criteria",
  );
  return Object.freeze(units);
}

function buildRulesUnits(
  ref: PackageRef,
  document: RulesPackageDocumentSnapshot,
): readonly KnowledgeUnit[] {
  const documentId = createDocumentId(ref, "rules");
  const rootId = createUnitId(ref, "rules", "root");
  const units: KnowledgeUnit[] = [
    createUnit({
      id: rootId,
      documentId,
      parentId: null,
      unitType: "rules_document",
      depth: 0,
      ordinal: 0,
      title: "Rules document",
      content: renderRulesDocument(document.content),
      structuredJson: json({
        schemaVersion: document.content.schemaVersion,
        evidence: document.content.evidence,
      }),
      headingPath: [],
      timestamps: [],
      visualEvidence: document.content.evidence.visualEvidence,
      searchable: false,
    }),
  ];

  function addSection(input: RulesSectionInput): KnowledgeUnit {
    const unit = createUnit({
      id: createUnitId(ref, "rules", `section:${input.key}`),
      documentId,
      parentId: rootId,
      unitType: "rules_section",
      depth: 1,
      ordinal: input.ordinal,
      title: input.title,
      content: input.content,
      structuredJson: input.structuredJson,
      headingPath: [input.title],
      timestamps: [],
      visualEvidence: input.visualEvidence ?? [],
      searchable: input.searchable,
    });
    units.push(unit);
    return unit;
  }

  addSection({
    key: "core-thesis",
    ordinal: 0,
    title: "Core thesis",
    content: document.content.coreThesis,
    structuredJson: null,
    searchable: true,
  });
  addSection({
    key: "evidence",
    ordinal: 1,
    title: "Evidence and limitations",
    content: renderEvidence(document.content),
    structuredJson: json(document.content.evidence),
    visualEvidence: document.content.evidence.visualEvidence,
    searchable: true,
  });
  const patternsSection = addSection({
    key: "patterns",
    ordinal: 2,
    title: "Patterns",
    content: `${String(document.content.patterns.length)} validated rule patterns.`,
    structuredJson: null,
    searchable: false,
  });

  document.content.patterns.forEach((pattern, ordinal) => {
    const id = createUnitId(ref, "rules", createRulePatternKey(pattern.id));
    const timestamps = uniqueTimestamps(pattern.sourceBasis.direct);
    units.push(
      createUnit({
        id,
        documentId,
        parentId: patternsSection.id,
        unitType: "rule_pattern",
        depth: 2,
        ordinal,
        title: pattern.name,
        content: renderPattern(pattern),
        structuredJson: json(pattern),
        headingPath: ["Patterns", pattern.name],
        timestamps,
        visualEvidence: pattern.visualEvidence,
        searchable: true,
      }),
    );
    units.push(
      ...buildRuleChildUnits(ref, documentId, pattern, id, timestamps),
    );
  });

  addSection({
    key: "agent-workflow",
    ordinal: 3,
    title: "Agent workflow",
    content:
      document.content.agentWorkflow.map((item) => `- ${item}`).join("\n") ||
      "No agent workflow declared.",
    structuredJson: json(document.content.agentWorkflow),
    searchable: document.content.agentWorkflow.length > 0,
  });
  return Object.freeze(units);
}

export function buildKnowledgeUnits(
  snapshot: PackageSnapshot,
): readonly KnowledgeUnit[] {
  const units: KnowledgeUnit[] = [];

  for (const document of snapshot.documents) {
    switch (document.kind) {
      case "context":
        units.push(...buildContextUnits(snapshot.ref, document));
        break;
      case "rules":
        units.push(...buildRulesUnits(snapshot.ref, document));
        break;
      case "metadata":
        break;
    }
  }

  return Object.freeze(units);
}
