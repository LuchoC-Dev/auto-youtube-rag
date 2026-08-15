import assert from "node:assert/strict";
import { test } from "node:test";

import { checkCitationIntegrity } from "../../evals/citation-integrity.js";
import type { ContextBundle } from "../../src/application/context/context-bundle.js";
import type { ContextResultUnit } from "../../src/application/context/context-bundle.js";

function unit(citationId: string): ContextResultUnit {
  return {
    citation_id: citationId,
    section: "highest_relevance",
    source_name: "auto-design",
    video_id: "vid_1",
    video_title: "Video title",
    creator: "Test channel",
    file: "deliverables/context.md",
    heading_path: ["Intro"],
    unit_type: "context_section",
    timestamp: null,
    visual_evidence: [],
    content: `${citationId} content`,
    token_count: 10,
  };
}

function bundle(input: {
  readonly units: readonly ContextResultUnit[];
  readonly markdownCitationIds: readonly string[];
}): ContextBundle {
  const markdown = [
    "# Context package",
    "",
    ...input.markdownCitationIds.map((citationId) => `[${citationId}]`),
  ].join("\n");

  return {
    markdown,
    result: {
      schema_version: "1.0",
      status: input.units.length === 0 ? "no_results" : "ok",
      request: {
        query: "test query",
        depth: "focused",
        max_tokens: 12000,
        sources: [],
      },
      metrics: {
        candidates_considered: input.units.length,
        units_selected: input.units.length,
        sources_used: 1,
        estimated_tokens: 10 * input.units.length,
        top_vector_similarity: 0.88,
      },
      units: input.units,
      sources: [],
      coverage: {
        units_by_type: {},
        units_by_source: {},
        omitted_for_budget: 0,
        budget_exhausted: false,
      },
      warnings: [],
      limitations: [],
    },
  };
}

void test("reports no issues for a well-formed bundle", () => {
  const wellFormed = bundle({
    units: [unit("S01"), unit("S02")],
    markdownCitationIds: ["S01", "S02"],
  });

  assert.deepEqual(checkCitationIntegrity(wellFormed), []);
});

void test("reports an orphan citation marker with no matching unit", () => {
  const orphan = bundle({
    units: [unit("S01")],
    markdownCitationIds: ["S01", "S02"],
  });

  assert.deepEqual(checkCitationIntegrity(orphan), [
    { kind: "orphan_citation", citationId: "S02" },
  ]);
});

void test("reports a unit whose citation never appears in the markdown", () => {
  const uncited = bundle({
    units: [unit("S01"), unit("S02")],
    markdownCitationIds: ["S01"],
  });

  assert.deepEqual(checkCitationIntegrity(uncited), [
    { kind: "uncited_unit", citationId: "S02" },
  ]);
});

void test("reports both kinds of mismatch in one pass", () => {
  const mismatched = bundle({
    units: [unit("S01")],
    markdownCitationIds: ["S02"],
  });

  assert.deepEqual(checkCitationIntegrity(mismatched), [
    { kind: "orphan_citation", citationId: "S02" },
    { kind: "uncited_unit", citationId: "S01" },
  ]);
});

void test("reports nothing for an empty bundle", () => {
  const empty = bundle({ units: [], markdownCitationIds: [] });

  assert.deepEqual(checkCitationIntegrity(empty), []);
});
