import assert from "node:assert/strict";
import { test } from "node:test";

import type { PackageSnapshot } from "../../../src/application/indexing/package-snapshots.js";
import { buildKnowledgeUnits } from "../../../src/application/indexing/build-knowledge-units.js";
import {
  PackageRef,
  SourceName,
  VideoId,
} from "../../../src/domain/indexing/identifiers.js";

const ref = PackageRef.create(
  SourceName.create("auto-design"),
  VideoId.create("video_123"),
);
const contextHash = "a".repeat(64);
const rulesHash = "b".repeat(64);

function packageSnapshot(
  firstRepeatedContent = "Primera aparición.",
): PackageSnapshot {
  return {
    kind: "video_package",
    ref,
    slug: "design-video",
    relativePath: "videos/design-video",
    manifestStage: "complete",
    documents: [
      {
        kind: "context",
        relativePath: "deliverables/context.md",
        contentHash: contextHash,
        byteSize: 500,
        parserVersion: "context-v1",
        content: {
          kind: "context",
          frontmatter: {
            title: "Contexto autónomo",
            visual_profile: "visual-heavy",
          },
          preamble: "Introducción general.",
          sections: [
            {
              kind: "context_section",
              title: "Método",
              level: 1,
              ordinal: 0,
              headingPath: ["Método"],
              content: "Contenido principal entre 00:01–00:04.",
              timestamps: ["00:01–00:04"],
              visualEvidence: ["visual/frames/frame-001.jpg"],
              children: [
                {
                  kind: "context_section",
                  title: "Repetido",
                  level: 2,
                  ordinal: 0,
                  headingPath: ["Método", "Repetido"],
                  content: firstRepeatedContent,
                  timestamps: [],
                  visualEvidence: [],
                  children: [],
                },
                {
                  kind: "context_section",
                  title: "Repetido",
                  level: 2,
                  ordinal: 1,
                  headingPath: ["Método", "Repetido"],
                  content: "Segunda aparición.",
                  timestamps: [],
                  visualEvidence: [],
                  children: [],
                },
              ],
            },
            {
              kind: "context_section",
              title: "Salida",
              level: 1,
              ordinal: 1,
              headingPath: ["Salida"],
              content: "Resultado esperado.",
              timestamps: [],
              visualEvidence: [],
              children: [],
            },
          ],
        },
      },
      {
        kind: "rules",
        relativePath: "deliverables/rules.json",
        contentHash: rulesHash,
        byteSize: 700,
        parserVersion: "rules-v1",
        content: {
          kind: "rules",
          schemaVersion: "1.0",
          coreThesis: "El contraste dirige la atención.",
          evidence: {
            transcriptFile: "transcript/source.txt",
            framesDirectory: "visual/frames",
            contactSheet: "visual/frames/contact-sheet.jpg",
            frameSampling: "20 fotogramas uniformes.",
            limitations: ["El texto pequeño no es legible."],
            visualEvidence: ["visual/frames/contact-sheet.jpg"],
          },
          patterns: [
            {
              id: "visual_hierarchy",
              name: "Jerarquía visual",
              principle: "Usar contraste y escala.",
              problem: "La igualdad de peso oculta prioridades.",
              visualEvidence: ["frame-05pct.png muestra contraste."],
              rules: [
                "Definir un elemento dominante.",
                "Reducir el peso secundario.",
              ],
              avoid: ["Dar igual peso a todo."],
              acceptanceCriteria: ["La acción principal es dominante."],
              sourceBasis: {
                direct: "Demostrado entre 00:10 y 00:30.",
                professionalExtension: null,
              },
            },
          ],
          agentWorkflow: ["Identificar la acción principal."],
        },
      },
    ],
  };
}

function serializeUnits(snapshot = packageSnapshot()) {
  return buildKnowledgeUnits(snapshot).map((unit) => ({
    id: unit.id.value,
    documentId: unit.documentId.value,
    parentId: unit.parentId?.value ?? null,
    unitType: unit.unitType,
    depth: unit.depth,
    ordinal: unit.ordinal,
    title: unit.title,
    content: unit.content,
    structuredJson: unit.structuredJson,
    headingPath: unit.headingPath,
    timestamps: unit.timestamps,
    visualEvidence: unit.visualEvidence,
    estimatedTokens: unit.estimatedTokens,
    contentHash: unit.contentHash,
    searchable: unit.searchable,
  }));
}

void test("builds document roots and context sections in deterministic preorder", () => {
  const units = buildKnowledgeUnits(packageSnapshot());
  const contextUnits = units.filter((unit) =>
    unit.documentId.value.endsWith(":context"),
  );
  const [root, method, firstRepeated, secondRepeated, output] = contextUnits;

  assert.ok(root);
  assert.ok(method);
  assert.ok(firstRepeated);
  assert.ok(secondRepeated);
  assert.ok(output);
  assert.equal(root.id.value, "unit:auto-design:video_123:context:root");
  assert.equal(root.documentId.value, "document:auto-design:video_123:context");
  assert.equal(root.parentId, null);
  assert.equal(root.depth, 0);
  assert.equal(root.searchable, false);
  assert.deepEqual(
    contextUnits.map((unit) => unit.title),
    ["Contexto autónomo", "Método", "Repetido", "Repetido", "Salida"],
  );
  assert.equal(method.parentId?.equals(root.id), true);
  assert.equal(method.depth, 1);
  assert.equal(firstRepeated.parentId?.equals(method.id), true);
  assert.equal(firstRepeated.depth, 2);
  assert.equal(firstRepeated.ordinal, 0);
  assert.equal(secondRepeated.ordinal, 1);
  assert.notEqual(firstRepeated.id.value, secondRepeated.id.value);
  assert.deepEqual(method.timestamps, ["00:01–00:04"]);
  assert.deepEqual(method.visualEvidence, ["visual/frames/frame-001.jpg"]);
  assert.deepEqual(output.headingPath, ["Salida"]);
});

void test("builds rules sections, patterns and typed child units", () => {
  const units = buildKnowledgeUnits(packageSnapshot());
  const rulesUnits = units.filter((unit) =>
    unit.documentId.value.endsWith(":rules"),
  );
  const pattern = rulesUnits.find((unit) => unit.unitType === "rule_pattern");
  const ruleItems = rulesUnits.filter((unit) => unit.unitType === "rule_item");
  const avoid = rulesUnits.find((unit) => unit.unitType === "avoid_item");
  const criterion = rulesUnits.find(
    (unit) => unit.unitType === "acceptance_criterion",
  );

  assert.equal(rulesUnits[0]?.unitType, "rules_document");
  assert.deepEqual(
    rulesUnits
      .filter((unit) => unit.unitType === "rules_section")
      .map((unit) => unit.title),
    ["Core thesis", "Evidence and limitations", "Patterns", "Agent workflow"],
  );
  assert.ok(pattern);
  assert.equal(
    pattern.id.value,
    "unit:auto-design:video_123:rules:pattern:visual_hierarchy",
  );
  assert.deepEqual(pattern.timestamps, ["00:10", "00:30"]);
  assert.deepEqual(pattern.visualEvidence, [
    "frame-05pct.png muestra contraste.",
  ]);
  assert.equal(ruleItems.length, 2);
  const firstRule = ruleItems[0];
  assert.ok(firstRule);
  assert.ok(firstRule.parentId);
  assert.equal(
    firstRule.id.value,
    "unit:auto-design:video_123:rules:pattern:visual_hierarchy:rule_item:0",
  );
  assert.equal(firstRule.parentId.equals(pattern.id), true);
  assert.equal(avoid?.parentId?.equals(pattern.id), true);
  assert.equal(criterion?.parentId?.equals(pattern.id), true);
  assert.deepEqual(JSON.parse(pattern.structuredJson ?? "null"), {
    id: "visual_hierarchy",
    name: "Jerarquía visual",
    principle: "Usar contraste y escala.",
    problem: "La igualdad de peso oculta prioridades.",
    visualEvidence: ["frame-05pct.png muestra contraste."],
    rules: ["Definir un elemento dominante.", "Reducir el peso secundario."],
    avoid: ["Dar igual peso a todo."],
    acceptanceCriteria: ["La acción principal es dominante."],
    sourceBasis: {
      direct: "Demostrado entre 00:10 y 00:30.",
      professionalExtension: null,
    },
  });
});

void test("rebuilds identically and keeps structural ids across content changes", () => {
  assert.deepEqual(serializeUnits(), serializeUnits());

  const before = buildKnowledgeUnits(packageSnapshot()).find(
    (unit) => unit.title === "Repetido" && unit.ordinal === 0,
  );
  const after = buildKnowledgeUnits(
    packageSnapshot("Contenido modificado."),
  ).find((unit) => unit.title === "Repetido" && unit.ordinal === 0);

  assert.ok(before);
  assert.ok(after);
  assert.equal(before.id.equals(after.id), true);
  assert.notEqual(before.contentHash, after.contentHash);
  assert.equal(before.estimatedTokens > 0, true);
  assert.equal(after.estimatedTokens > 0, true);
});
