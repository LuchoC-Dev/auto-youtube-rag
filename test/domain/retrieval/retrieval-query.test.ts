import assert from "node:assert/strict";
import { test } from "node:test";

import { DomainValidationError } from "../../../src/domain/indexing/domain-error.js";
import {
  SourceName,
  VideoId,
} from "../../../src/domain/indexing/identifiers.js";
import { RetrievalFilter } from "../../../src/domain/retrieval/retrieval-filter.js";
import {
  RetrievalLimits,
  RetrievalQuery,
  maxRetrievalQueryCharacters,
} from "../../../src/domain/retrieval/retrieval-query.js";

const combiningTilde = String.fromCodePoint(0x0303);

function assertInvalid(createValue: () => unknown, field: string): void {
  assert.throws(createValue, (error: unknown) => {
    assert.ok(error instanceof DomainValidationError);
    assert.equal(error.code, "INVALID_RETRIEVAL_QUERY");
    assert.equal(error.field, field);
    return true;
  });
}

void test("normalizes query text without losing accents or case", () => {
  const query = RetrievalQuery.create({
    text: "  Diseño   Brutalista  ",
  });

  assert.equal(query.text, "Diseño Brutalista");
  assert.equal(query.filter.isUnrestricted, true);
  assert.equal(query.limits.fusedResults, 50);
});

void test("normalizes decomposed Unicode to a single canonical form", () => {
  const decomposedInput = `disen${combiningTilde}o`;

  assert.equal(decomposedInput.length, 7);

  const decomposed = RetrievalQuery.create({ text: decomposedInput });
  const composed = RetrievalQuery.create({ text: "diseño" });

  assert.equal(decomposed.text, composed.text);
  assert.equal(decomposed.text.length, 6);
});

void test("rejects empty, whitespace and punctuation-only queries", () => {
  for (const text of ["", "   ", "\t\n", "...", "¿?", "--- ***", " "]) {
    assertInvalid(() => RetrievalQuery.create({ text }), "text");
  }

  assertInvalid(() => RetrievalQuery.create({ text: 42 }), "text");
  assertInvalid(
    () =>
      RetrievalQuery.create({
        text: "a".repeat(maxRetrievalQueryCharacters + 1),
      }),
    "text",
  );
});

void test("accepts queries whose meaning lives in numbers or non-latin scripts", () => {
  assert.equal(RetrievalQuery.create({ text: "2024" }).text, "2024");
  assert.equal(RetrievalQuery.create({ text: "デザイン" }).text, "デザイン");
  assert.equal(
    RetrievalQuery.create({ text: "¿qué es el kerning?" }).text,
    "¿qué es el kerning?",
  );
});

void test("builds an unrestricted filter and deduplicates its criteria", () => {
  const empty = RetrievalFilter.empty();

  assert.equal(empty.isUnrestricted, true);
  assert.deepEqual(empty.sources, []);

  const filter = RetrievalFilter.create({
    sources: [
      SourceName.create("auto-design"),
      SourceName.create("auto-design"),
    ],
    videoIds: [VideoId.create("dQw4w9WgXcQ")],
    languages: ["ES", "es", "en-US"],
    unitTypes: ["rule_pattern", "rule_pattern", "context_section"],
  });

  assert.equal(filter.isUnrestricted, false);
  assert.equal(filter.sources.length, 1);
  assert.deepEqual(filter.languages, ["es", "en-us"]);
  assert.deepEqual(filter.unitTypes, ["rule_pattern", "context_section"]);
  assert.equal(Object.isFrozen(filter.languages), true);
});

void test("rejects malformed filter criteria with the exact field", () => {
  assertInvalid(
    () => RetrievalFilter.create({ sources: ["auto-design"] }),
    "sources",
  );
  assertInvalid(
    () => RetrievalFilter.create({ videoIds: ["dQw4w9WgXcQ"] }),
    "videoIds",
  );
  assertInvalid(
    () => RetrievalFilter.create({ languages: ["es_AR"] }),
    "languages",
  );
  assertInvalid(() => RetrievalFilter.create({ languages: [""] }), "languages");
  assertInvalid(
    () => RetrievalFilter.create({ unitTypes: ["chapter"] }),
    "unitTypes",
  );
  assertInvalid(
    () => RetrievalFilter.create({ sources: SourceName.create("auto-design") }),
    "sources",
  );
});

void test("applies default limits and honours explicit overrides", () => {
  const defaults = RetrievalLimits.default();

  assert.equal(defaults.textCandidates, 100);
  assert.equal(defaults.vectorCandidates, 100);
  assert.equal(defaults.fusedResults, 50);
  assert.equal(defaults.maxPerVideo, 4);

  const overridden = RetrievalLimits.create({ fusedResults: 12 });

  assert.equal(overridden.fusedResults, 12);
  assert.equal(overridden.textCandidates, 100);
});

void test("rejects limits that are not positive safe integers", () => {
  for (const value of [
    0,
    -1,
    1.5,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    "10",
  ]) {
    assertInvalid(
      () => RetrievalLimits.create({ fusedResults: value }),
      "fusedResults",
    );
  }

  assertInvalid(
    () => RetrievalLimits.create({ maxPerVideo: 0 }),
    "maxPerVideo",
  );
  assertInvalid(
    () => RetrievalLimits.create({ textCandidates: 0 }),
    "textCandidates",
  );
  assertInvalid(
    () => RetrievalLimits.create({ vectorCandidates: 0 }),
    "vectorCandidates",
  );
});

void test("composes a query with an explicit filter and limits", () => {
  const query = RetrievalQuery.create({
    text: "paleta saturada",
    filter: RetrievalFilter.create({ languages: ["es"] }),
    limits: RetrievalLimits.create({ maxPerVideo: 2 }),
  });

  assert.deepEqual(query.filter.languages, ["es"]);
  assert.equal(query.limits.maxPerVideo, 2);
  assertInvalid(
    () => RetrievalQuery.create({ text: "válido", filter: { languages: [] } }),
    "filter",
  );
  assertInvalid(
    () => RetrievalQuery.create({ text: "válido", limits: { maxPerVideo: 2 } }),
    "limits",
  );
});
