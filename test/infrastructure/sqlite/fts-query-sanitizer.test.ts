import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { test } from "node:test";

import {
  maxFtsQueryTokens,
  sanitizeFtsQuery,
} from "../../../src/infrastructure/sqlite/fts-query-sanitizer.js";

/**
 * Proves the produced expressions are accepted by the real FTS5 grammar, which
 * is the only authority on whether a query parses.
 */
function assertParsesInFts5(expression: string): void {
  const database = new DatabaseSync(":memory:");

  try {
    database.exec(
      "CREATE VIRTUAL TABLE probe USING fts5(content, tokenize='unicode61 remove_diacritics 2')",
    );
    database.prepare("INSERT INTO probe(content) VALUES (?)").run("kerning");
    database
      .prepare("SELECT rowid FROM probe WHERE probe MATCH ?")
      .all(expression);
  } finally {
    database.close();
  }
}

void test("keeps every meaningful token and drops punctuation", () => {
  assert.equal(
    sanitizeFtsQuery("diseño brutalista"),
    '"diseño" OR "brutalista"',
  );
  assert.equal(
    sanitizeFtsQuery("¿qué es el kerning?"),
    '"qué" OR "es" OR "el" OR "kerning"',
  );
  assert.equal(sanitizeFtsQuery("Bauhaus 2024"), '"Bauhaus" OR "2024"');
});

void test("neutralizes FTS5 operators as literal terms", () => {
  for (const [query, expected] of [
    ["color OR forma", '"color" OR "OR" OR "forma"'],
    ["NOT brutalismo", '"NOT" OR "brutalismo"'],
    ["texto NEAR imagen", '"texto" OR "NEAR" OR "imagen"'],
    ["diseño*", '"diseño"'],
    ["^inicio", '"inicio"'],
    ["columna:valor", '"columna" OR "valor"'],
    ["(agrupado)", '"agrupado"'],
    ["guion-medio", '"guion" OR "medio"'],
  ] as const) {
    const expression = sanitizeFtsQuery(query);

    assert.equal(expression, expected);
    assert.ok(expression);
    assertParsesInFts5(expression);
  }
});

void test("survives quotes and other syntax that would break a raw MATCH", () => {
  const hostile = 'diseño "3d": guía (2024) -- x* ^y "';
  const expression = sanitizeFtsQuery(hostile);

  assert.ok(expression);
  assert.equal(expression.includes('""'), false);
  assertParsesInFts5(expression);

  const database = new DatabaseSync(":memory:");

  try {
    database.exec("CREATE VIRTUAL TABLE probe USING fts5(content)");
    assert.throws(() =>
      database
        .prepare("SELECT rowid FROM probe WHERE probe MATCH ?")
        .all(hostile),
    );
  } finally {
    database.close();
  }
});

void test("returns null when nothing searchable remains", () => {
  for (const query of ["", "   ", "...", "¿?", "--- ***", '""', "()"]) {
    assert.equal(sanitizeFtsQuery(query), null);
  }
});

void test("deduplicates repeated tokens case-insensitively", () => {
  assert.equal(sanitizeFtsQuery("kerning Kerning KERNING"), '"kerning"');
  assert.equal(sanitizeFtsQuery("color color forma"), '"color" OR "forma"');
});

void test("caps the number of tokens so one query cannot explode the parser", () => {
  const many = Array.from(
    { length: maxFtsQueryTokens + 20 },
    (_value, index) => `t${String(index)}`,
  ).join(" ");
  const expression = sanitizeFtsQuery(many);

  assert.ok(expression);
  assert.equal(expression.split(" OR ").length, maxFtsQueryTokens);
  assertParsesInFts5(expression);
});

void test("preserves non-latin scripts", () => {
  const expression = sanitizeFtsQuery("デザイン 設計");

  assert.equal(expression, '"デザイン" OR "設計"');
  assert.ok(expression);
  assertParsesInFts5(expression);
});
