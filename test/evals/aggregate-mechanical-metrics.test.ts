import assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildMechanicalMetricsRows,
  renderMechanicalMetricsReport,
  type MechanicalMetricsEntry,
} from "../../evals/aggregate-mechanical-metrics.js";
import type { ContextResultDocument } from "../../src/application/context/context-bundle.js";

function result(
  overrides: Partial<{
    status: ContextResultDocument["status"];
    candidatesConsidered: number;
    unitsSelected: number;
    sourcesUsed: number;
    estimatedTokens: number;
    budgetExhausted: boolean;
    omittedForBudget: number;
    warningCodes: readonly ContextResultDocument["warnings"][number]["code"][];
  }> = {},
): ContextResultDocument {
  return {
    schema_version: "1.0",
    status: overrides.status ?? "ok",
    request: { query: "q", depth: "focused", max_tokens: 12000, sources: [] },
    metrics: {
      candidates_considered: overrides.candidatesConsidered ?? 10,
      units_selected: overrides.unitsSelected ?? 3,
      sources_used: overrides.sourcesUsed ?? 2,
      estimated_tokens: overrides.estimatedTokens ?? 500,
    },
    units: [],
    sources: [],
    coverage: {
      units_by_type: {},
      units_by_source: {},
      omitted_for_budget: overrides.omittedForBudget ?? 0,
      budget_exhausted: overrides.budgetExhausted ?? false,
    },
    warnings: (overrides.warningCodes ?? []).map((code) => ({
      code,
      path: null,
      message: `warning ${code}`,
    })),
    limitations: [],
  };
}

void test("marks status as matching expectation for a non-no_answer kind returning ok", () => {
  const rows = buildMechanicalMetricsRows([
    {
      queryId: "es-concept-brutalism",
      kind: "concept",
      depth: "focused",
      result: result({ status: "ok" }),
    },
  ]);

  const [row] = rows;
  assert.ok(row);
  assert.equal(row.expectedStatus, "ok");
  assert.equal(row.statusMatchesExpectation, true);
});

void test("marks status as matching expectation for a no_answer kind returning no_results", () => {
  const rows = buildMechanicalMetricsRows([
    {
      queryId: "es-no-answer-unrelated-topic",
      kind: "no_answer",
      depth: "focused",
      result: result({ status: "no_results" }),
    },
  ]);

  const [row] = rows;
  assert.ok(row);
  assert.equal(row.expectedStatus, "no_results");
  assert.equal(row.statusMatchesExpectation, true);
});

void test("flags a no_answer query that still comes back ok as diverging, without failing", () => {
  const entries: MechanicalMetricsEntry[] = [
    {
      queryId: "es-no-answer-unrelated-topic",
      kind: "no_answer",
      depth: "focused",
      result: result({ status: "ok" }),
    },
  ];

  const rows = buildMechanicalMetricsRows(entries);
  assert.equal(rows[0]?.statusMatchesExpectation, false);

  const report = renderMechanicalMetricsReport(entries);
  assert.match(report, /es-no-answer-unrelated-topic/);
  assert.match(report, /got `ok`, expected `no_results`/);
});

void test("carries metrics, coverage and warning codes through to the row", () => {
  const rows = buildMechanicalMetricsRows([
    {
      queryId: "es-rare-term-kerning",
      kind: "rare_term",
      depth: "deep",
      result: result({
        candidatesConsidered: 42,
        unitsSelected: 7,
        sourcesUsed: 1,
        estimatedTokens: 6000,
        budgetExhausted: true,
        omittedForBudget: 2,
        warningCodes: ["VECTOR_SEARCH_UNAVAILABLE"],
      }),
    },
  ]);

  const [row] = rows;
  assert.ok(row);
  assert.equal(row.candidatesConsidered, 42);
  assert.equal(row.unitsSelected, 7);
  assert.equal(row.sourcesUsed, 1);
  assert.equal(row.estimatedTokens, 6000);
  assert.equal(row.budgetExhausted, true);
  assert.equal(row.omittedForBudget, 2);
  assert.deepEqual(row.warningCodes, ["VECTOR_SEARCH_UNAVAILABLE"]);
});

void test("renders a Markdown table row per query and a budget exhaustion rate per depth", () => {
  const entries: MechanicalMetricsEntry[] = [
    {
      queryId: "q1",
      kind: "concept",
      depth: "focused",
      result: result({ budgetExhausted: true }),
    },
    {
      queryId: "q2",
      kind: "concept",
      depth: "focused",
      result: result({ budgetExhausted: false }),
    },
  ];

  const report = renderMechanicalMetricsReport(entries);

  assert.match(report, /\| q1 \|/);
  assert.match(report, /\| q2 \|/);
  assert.match(
    report,
    /`focused`: 1\/2 \(50%\) queries exhausted the budget\./,
  );
});

void test("reports no divergence when every row matches its expectation", () => {
  const report = renderMechanicalMetricsReport([
    {
      queryId: "q1",
      kind: "concept",
      depth: "focused",
      result: result({ status: "ok" }),
    },
  ]);

  assert.match(report, /No query diverged from its expected status\./);
});
