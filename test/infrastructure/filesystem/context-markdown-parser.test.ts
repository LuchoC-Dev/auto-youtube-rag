import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

import {
  ContextMarkdownParseError,
  parseContextMarkdown,
} from "../../../src/infrastructure/filesystem/context-markdown-parser.js";

const fixturePath = fileURLToPath(
  new URL("../../fixtures/indexing/context-complex.md", import.meta.url),
);

void test("parses observed frontmatter values and preserves UTF-8 preamble", async () => {
  const markdown = await readFile(fixturePath, "utf8");
  const document = parseContextMarkdown(markdown, fixturePath);

  assert.equal(document.kind, "context");
  assert.deepEqual(document.frontmatter, {
    title: "Guía visual: diseño útil",
    duration_seconds: 125,
    reviewed: true,
    visual_profile: null,
    secondary_languages: ["es", "pt-BR"],
    empty_values: [],
  });
  assert.equal(
    document.preamble,
    "Texto introductorio antes del primer encabezado.\n\n" +
      "Conserva **Markdown**, acentos y orden.",
  );
  assert.equal(Object.isFrozen(document.frontmatter), true);
  assert.equal(Object.isFrozen(document.frontmatter.secondary_languages), true);
});

void test("builds a neutral tree across skipped levels and repeated headings", async () => {
  const markdown = await readFile(fixturePath, "utf8");
  const document = parseContextMarkdown(markdown, fixturePath);
  const [firstRoot, secondRoot] = document.sections;

  assert.ok(firstRoot);
  assert.ok(secondRoot);
  assert.equal(firstRoot.title, "Método");
  assert.equal(firstRoot.level, 1);
  assert.equal(firstRoot.ordinal, 0);
  assert.deepEqual(firstRoot.headingPath, ["Método"]);
  assert.equal(
    firstRoot.content,
    "Contenido raíz entre 00:01–00:04.\n\n" +
      "Evidencia: `visual/frames/frame-001.jpg`.",
  );
  assert.deepEqual(firstRoot.timestamps, ["00:01–00:04"]);
  assert.deepEqual(firstRoot.visualEvidence, ["visual/frames/frame-001.jpg"]);

  assert.deepEqual(
    firstRoot.children.map((section) => ({
      title: section.title,
      level: section.level,
      ordinal: section.ordinal,
      headingPath: section.headingPath,
    })),
    [
      {
        title: "Salto de nivel",
        level: 3,
        ordinal: 0,
        headingPath: ["Método", "Salto de nivel"],
      },
      {
        title: "Repetido",
        level: 2,
        ordinal: 1,
        headingPath: ["Método", "Repetido"],
      },
      {
        title: "Repetido",
        level: 2,
        ordinal: 2,
        headingPath: ["Método", "Repetido"],
      },
    ],
  );
  assert.equal(secondRoot.title, "Método");
  assert.equal(secondRoot.ordinal, 1);
  assert.deepEqual(secondRoot.headingPath, ["Método"]);
  assert.equal(Object.isFrozen(firstRoot.children), true);
});

void test("keeps fenced Markdown in content without deriving false evidence", async () => {
  const markdown = await readFile(fixturePath, "utf8");
  const document = parseContextMarkdown(markdown, fixturePath);
  const skipped = document.sections[0]?.children[0];

  assert.ok(skipped);
  assert.match(skipped.content, /^Este encabezado/u);
  assert.match(skipped.content, /# Esto no es un encabezado/u);
  assert.deepEqual(skipped.children, []);
  assert.deepEqual(skipped.timestamps, []);
  assert.deepEqual(skipped.visualEvidence, []);
});

void test("reports malformed frontmatter with source path and field", () => {
  const sourcePath = "memory://context.md";

  assert.throws(
    () =>
      parseContextMarkdown(
        "---\ntitle: one\ntitle: two\n---\n# Body",
        sourcePath,
      ),
    (error: unknown) => {
      assert.ok(error instanceof ContextMarkdownParseError);
      assert.equal(error.code, "CONTEXT_FRONTMATTER_INVALID");
      assert.equal(error.sourcePath, sourcePath);
      assert.equal(error.field, "frontmatter.title");
      return true;
    },
  );

  assert.throws(
    () => parseContextMarkdown("---\ntags: [one,\n---\n# Body", sourcePath),
    (error: unknown) => {
      assert.ok(error instanceof ContextMarkdownParseError);
      assert.equal(error.field, "frontmatter.tags");
      return true;
    },
  );
});
