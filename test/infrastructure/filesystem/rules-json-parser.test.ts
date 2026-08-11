import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

import { VideoId } from "../../../src/domain/indexing/identifiers.js";
import {
  RulesJsonParseError,
  parseRulesJson,
} from "../../../src/infrastructure/filesystem/rules-json-parser.js";

const fixturePath = fileURLToPath(
  new URL("../../fixtures/indexing/rules-complete.json", import.meta.url),
);
const expectedVideoId = VideoId.create("video_123");

void test("projects every approved rules section and preserves order", async () => {
  const input = JSON.parse(await readFile(fixturePath, "utf8")) as unknown;
  const rules = parseRulesJson(input, expectedVideoId, fixturePath);

  assert.equal(rules.kind, "rules");
  assert.equal(rules.schemaVersion, "1.0");
  assert.equal(
    rules.coreThesis,
    "Nombrar un estilo permite buscar referencias precisas.",
  );
  assert.deepEqual(rules.evidence, {
    transcriptFile: "transcript/source.txt",
    framesDirectory: "visual/frames",
    contactSheet: "visual/frames/contact-sheet.jpg",
    frameSampling: "20 uniformes y muestreo adaptativo",
    limitations: [
      "El texto pequeño de algunos ejemplos no es legible.",
      "Las muestras visuales no demuestran licencias de reutilización.",
    ],
    visualEvidence: [
      "visual/frames/contact-sheet.jpg",
      "visual/frames/adaptive-contact-sheet-01.jpg",
      "visual/frames/adaptive-contact-sheet-02.jpg",
      "visual/coverage.json",
    ],
  });
  assert.deepEqual(
    rules.patterns.map((pattern) => pattern.id),
    ["visual_hierarchy", "context-first"],
  );
  assert.deepEqual(rules.agentWorkflow, [
    "Identificar el objetivo principal.",
    "Seleccionar el patrón aplicable.",
    "Verificar sus criterios de aceptación.",
  ]);
  assert.equal("evaluation" in rules, false);
  assert.equal("evidenceBoundary" in rules, false);
  assert.equal(Object.isFrozen(rules.patterns), true);
  assert.equal(Object.isFrozen(rules.patterns[0]?.rules), true);
});

void test("preserves child lists and source basis without coercion", async () => {
  const input = JSON.parse(await readFile(fixturePath, "utf8")) as unknown;
  const rules = parseRulesJson(input, expectedVideoId, fixturePath);
  const [first, second] = rules.patterns;

  assert.ok(first);
  assert.ok(second);
  assert.deepEqual(first.visualEvidence, [
    "frame-05pct.png muestra un elemento dominante.",
  ]);
  assert.deepEqual(first.rules, [
    "Definir un elemento dominante.",
    "Reducir el peso de los elementos secundarios.",
  ]);
  assert.deepEqual(first.avoid, ["Dar el mismo peso a todos los elementos."]);
  assert.deepEqual(first.acceptanceCriteria, [
    "La acción principal se reconoce sin explicación adicional.",
  ]);
  assert.deepEqual(first.sourceBasis, {
    direct: "La fuente lo demuestra entre 00:10 y 00:30.",
    professionalExtension: null,
  });
  assert.equal(
    second.sourceBasis.professionalExtension,
    "Documentar también restricciones de accesibilidad.",
  );
});

void test("validates source and pattern ids for the expected video", async () => {
  const input = JSON.parse(await readFile(fixturePath, "utf8")) as {
    source: { video_id: string };
    patterns: { id: string }[];
  };

  input.source.video_id = "different_video";
  assert.throws(
    () => parseRulesJson(input, expectedVideoId, fixturePath),
    assertRulesError("RULES_VIDEO_ID_MISMATCH", "source.video_id"),
  );

  input.source.video_id = expectedVideoId.value;
  const firstId = input.patterns[0]?.id;
  assert.ok(firstId);
  const secondPattern = input.patterns[1];
  assert.ok(secondPattern);
  secondPattern.id = firstId;
  assert.throws(
    () => parseRulesJson(input, expectedVideoId, fixturePath),
    assertRulesError("RULES_DUPLICATE_PATTERN_ID", "patterns[1].id"),
  );
});

void test("rejects incomplete or mistyped forms with an exact field", async () => {
  const input = JSON.parse(await readFile(fixturePath, "utf8")) as {
    patterns: { rules?: unknown }[];
  };
  const firstPattern = input.patterns[0];
  assert.ok(firstPattern);
  delete firstPattern.rules;

  assert.throws(
    () => parseRulesJson(input, expectedVideoId, fixturePath),
    assertRulesError("RULES_SCHEMA_INVALID", "patterns[0].rules"),
  );

  firstPattern.rules = "una regla";
  assert.throws(
    () => parseRulesJson(input, expectedVideoId, fixturePath),
    assertRulesError("RULES_SCHEMA_INVALID", "patterns[0].rules"),
  );
});

function assertRulesError(code: string, field: string) {
  return (error: unknown): boolean => {
    assert.ok(error instanceof RulesJsonParseError);
    assert.equal(error.code, code);
    assert.equal(error.sourcePath, fixturePath);
    assert.equal(error.field, field);
    return true;
  };
}
