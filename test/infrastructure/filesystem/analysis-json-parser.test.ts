import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

import { VideoId } from "../../../src/domain/indexing/identifiers.js";
import {
  AnalysisJsonParseError,
  parseAnalysisJson,
} from "../../../src/infrastructure/filesystem/analysis-json-parser.js";

const fixturePath = fileURLToPath(
  new URL("../../fixtures/indexing/analysis-complete.json", import.meta.url),
);
const expectedVideoId = VideoId.create("video_456");

void test("projects every approved analysis section and preserves order", async () => {
  const input = JSON.parse(await readFile(fixturePath, "utf8")) as unknown;
  const analysis = parseAnalysisJson(input, expectedVideoId, fixturePath);

  assert.equal(analysis.kind, "analysis");
  assert.equal(analysis.schemaVersion, "2.0");
  assert.deepEqual(analysis.analysisLens, {
    lens: "Diseño gráfico editorial",
    rationale: "El video cubre publicaciones editoriales recientes.",
    chosenBy: "agent",
  });
  assert.equal(
    analysis.summary,
    "El video repasa tendencias editoriales recientes con énfasis en tipografía expresiva.",
  );
  assert.deepEqual(
    analysis.topics.map((topic) => topic.id),
    ["expressive_typography", "muted_palettes"],
  );
  assert.deepEqual(
    analysis.recommendations.map((recommendation) => recommendation.id),
    ["adopt_expressive_type", "test_muted_palette"],
  );
  assert.equal(Object.isFrozen(analysis.topics), true);
  assert.equal(Object.isFrozen(analysis.recommendations), true);
});

void test("preserves topic and recommendation fields without coercion", async () => {
  const input = JSON.parse(await readFile(fixturePath, "utf8")) as unknown;
  const analysis = parseAnalysisJson(input, expectedVideoId, fixturePath);
  const [firstTopic, secondTopic] = analysis.topics;
  const [firstRecommendation] = analysis.recommendations;

  assert.ok(firstTopic);
  assert.ok(secondTopic);
  assert.ok(firstRecommendation);
  assert.equal(firstTopic.evidenceClass, "direct");
  assert.deepEqual(firstTopic.timestamps, ["00:01:12-00:02:03"]);
  assert.deepEqual(firstTopic.visualEvidence, ["visual/frames/frame-012.jpg"]);
  assert.equal(
    firstTopic.analystNote,
    "Coincide con tendencias ya observadas en otros videos de la colección.",
  );
  assert.equal(secondTopic.evidenceClass, "visual");
  assert.equal(secondTopic.analystNote, null);
  assert.equal(firstRecommendation.confidence, "high");

  assert.deepEqual(analysis.assessment, {
    strengths: ["Ejemplos visuales abundantes y bien encuadrados."],
    weaknesses: ["No se discuten limitaciones de accesibilidad tipográfica."],
    verdict:
      "Contenido útil como referencia de tendencias, no como manual normativo.",
    basis:
      "Basado en la cobertura visual y la ausencia de guía prescriptiva explícita.",
  });
  assert.deepEqual(analysis.evidenceBoundary, {
    transcript: "La transcripción confirma el enfoque editorial declarado.",
    frames: "Los frames muestran ejemplos consistentes con lo narrado.",
    analystOpinion:
      "La clasificación de tendencia es interpretación del analista.",
    unverified: "No se verificó la fuente original de cada pieza mostrada.",
  });
});

void test("validates source, topic ids and recommendation ids for the expected video", async () => {
  const input = JSON.parse(await readFile(fixturePath, "utf8")) as {
    source: { video_id: string };
    topics: { id: string }[];
    recommendations: { id: string }[];
  };

  input.source.video_id = "different_video";
  assert.throws(
    () => parseAnalysisJson(input, expectedVideoId, fixturePath),
    assertAnalysisError("ANALYSIS_VIDEO_ID_MISMATCH", "source.video_id"),
  );

  input.source.video_id = expectedVideoId.value;
  const firstTopicId = input.topics[0]?.id;
  assert.ok(firstTopicId);
  const secondTopic = input.topics[1];
  assert.ok(secondTopic);
  secondTopic.id = firstTopicId;
  assert.throws(
    () => parseAnalysisJson(input, expectedVideoId, fixturePath),
    assertAnalysisError("ANALYSIS_DUPLICATE_TOPIC_ID", "topics[1].id"),
  );

  secondTopic.id = "muted_palettes";
  const firstRecommendationId = input.recommendations[0]?.id;
  assert.ok(firstRecommendationId);
  const secondRecommendation = input.recommendations[1];
  assert.ok(secondRecommendation);
  secondRecommendation.id = firstRecommendationId;
  assert.throws(
    () => parseAnalysisJson(input, expectedVideoId, fixturePath),
    assertAnalysisError(
      "ANALYSIS_DUPLICATE_RECOMMENDATION_ID",
      "recommendations[1].id",
    ),
  );
});

void test("rejects an invalid evidence_class enum value with an exact field", async () => {
  const input = JSON.parse(await readFile(fixturePath, "utf8")) as {
    topics: { evidence_class?: unknown }[];
  };
  const firstTopic = input.topics[0];
  assert.ok(firstTopic);
  firstTopic.evidence_class = "guessed";

  assert.throws(
    () => parseAnalysisJson(input, expectedVideoId, fixturePath),
    assertAnalysisError("ANALYSIS_SCHEMA_INVALID", "topics[0].evidence_class"),
  );
});

void test("rejects an invalid confidence enum value with an exact field", async () => {
  const input = JSON.parse(await readFile(fixturePath, "utf8")) as {
    recommendations: { confidence?: unknown }[];
  };
  const firstRecommendation = input.recommendations[0];
  assert.ok(firstRecommendation);
  firstRecommendation.confidence = "certain";

  assert.throws(
    () => parseAnalysisJson(input, expectedVideoId, fixturePath),
    assertAnalysisError(
      "ANALYSIS_SCHEMA_INVALID",
      "recommendations[0].confidence",
    ),
  );
});

void test("rejects incomplete or mistyped forms with an exact field", async () => {
  const input = JSON.parse(await readFile(fixturePath, "utf8")) as {
    topics: { timestamps?: unknown }[];
  };
  const firstTopic = input.topics[0];
  assert.ok(firstTopic);
  delete firstTopic.timestamps;

  assert.throws(
    () => parseAnalysisJson(input, expectedVideoId, fixturePath),
    assertAnalysisError("ANALYSIS_SCHEMA_INVALID", "topics[0].timestamps"),
  );

  firstTopic.timestamps = "00:01:00";
  assert.throws(
    () => parseAnalysisJson(input, expectedVideoId, fixturePath),
    assertAnalysisError("ANALYSIS_SCHEMA_INVALID", "topics[0].timestamps"),
  );
});

function assertAnalysisError(code: string, field: string) {
  return (error: unknown): boolean => {
    assert.ok(error instanceof AnalysisJsonParseError);
    assert.equal(error.code, code);
    assert.equal(error.sourcePath, fixturePath);
    assert.equal(error.field, field);
    return true;
  };
}
