import type { ContextDepth } from "../src/domain/context/context-budget.js";
import type { ContextResultDocument } from "../src/application/context/context-bundle.js";

/**
 * One generated `result.json`, tagged with the seed query metadata that
 * produced it. `kind` is free text straight from `seed-queries.json`
 * (`concept`, `rare_term`, `paraphrase`, `multilingual`, `no_answer`,
 * `comparison`, ...), not a closed enum the domain validates.
 */
export interface MechanicalMetricsEntry {
  readonly queryId: string;
  readonly kind: string;
  readonly depth: ContextDepth;
  readonly result: ContextResultDocument;
}

export interface MechanicalMetricsRow {
  readonly queryId: string;
  readonly kind: string;
  readonly depth: ContextDepth;
  readonly status: ContextResultDocument["status"];
  /** `null` when the query's `kind` carries no status expectation of its
   * own — every kind other than `no_answer` simply expects `"ok"` over a
   * non-empty library, per `docs/eval-design.md`. */
  readonly expectedStatus: ContextResultDocument["status"] | null;
  readonly statusMatchesExpectation: boolean;
  readonly candidatesConsidered: number;
  readonly unitsSelected: number;
  readonly sourcesUsed: number;
  readonly estimatedTokens: number;
  readonly budgetExhausted: boolean;
  readonly omittedForBudget: number;
  readonly warningCodes: readonly string[];
}

/**
 * Only `no_answer` queries carry a status expectation distinct from `"ok"`
 * — and even that one is soft: the vector path has no similarity floor
 * (`docs/retrieval-design.md`), so a `no_answer` query over a non-empty,
 * unfiltered library can legitimately still return weak `"ok"` candidates.
 * A mismatch here is a signal for the Layer B judges to look at, never an
 * automatic failure — see `docs/eval-design.md`, "Capa A".
 */
function expectedStatusFor(kind: string): ContextResultDocument["status"] {
  return kind === "no_answer" ? "no_results" : "ok";
}

export function buildMechanicalMetricsRows(
  entries: readonly MechanicalMetricsEntry[],
): readonly MechanicalMetricsRow[] {
  return entries.map((entry) => {
    const expectedStatus = expectedStatusFor(entry.kind);

    return {
      queryId: entry.queryId,
      kind: entry.kind,
      depth: entry.depth,
      status: entry.result.status,
      expectedStatus,
      statusMatchesExpectation: entry.result.status === expectedStatus,
      candidatesConsidered: entry.result.metrics.candidates_considered,
      unitsSelected: entry.result.metrics.units_selected,
      sourcesUsed: entry.result.metrics.sources_used,
      estimatedTokens: entry.result.metrics.estimated_tokens,
      budgetExhausted: entry.result.coverage.budget_exhausted,
      omittedForBudget: entry.result.coverage.omitted_for_budget,
      warningCodes: entry.result.warnings.map((warning) => warning.code),
    };
  });
}

function renderRowsTable(rows: readonly MechanicalMetricsRow[]): string {
  const header =
    "| Query | Kind | Depth | Status | Expected | Match | Candidates | Units | Sources | Tokens | Budget exhausted | Omitted | Warnings |";
  const divider =
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |";

  const body = rows.map(
    (row) =>
      `| ${row.queryId} | ${row.kind} | ${row.depth} | ${row.status} | ${row.expectedStatus ?? "—"} | ${row.statusMatchesExpectation ? "yes" : "no"} | ${String(row.candidatesConsidered)} | ${String(row.unitsSelected)} | ${String(row.sourcesUsed)} | ${String(row.estimatedTokens)} | ${row.budgetExhausted ? "yes" : "no"} | ${String(row.omittedForBudget)} | ${row.warningCodes.join(", ") || "—"} |`,
  );

  return [header, divider, ...body].join("\n");
}

function renderDivergingStatuses(
  rows: readonly MechanicalMetricsRow[],
): string {
  const diverging = rows.filter((row) => !row.statusMatchesExpectation);

  if (diverging.length === 0) {
    return "No query diverged from its expected status.";
  }

  return diverging
    .map(
      (row) =>
        `- \`${row.queryId}\` at \`${row.depth}\`: got \`${row.status}\`, expected \`${row.expectedStatus ?? "—"}\` for kind \`${row.kind}\`.`,
    )
    .join("\n");
}

function renderBudgetExhaustionRate(
  rows: readonly MechanicalMetricsRow[],
): string {
  const byDepth = new Map<ContextDepth, { total: number; exhausted: number }>();

  for (const row of rows) {
    const bucket = byDepth.get(row.depth) ?? { total: 0, exhausted: 0 };
    bucket.total += 1;
    if (row.budgetExhausted) bucket.exhausted += 1;
    byDepth.set(row.depth, bucket);
  }

  const lines = [...byDepth.entries()].map(([depth, bucket]) => {
    const rate =
      bucket.total === 0
        ? 0
        : Math.round((bucket.exhausted / bucket.total) * 100);
    return `- \`${depth}\`: ${String(bucket.exhausted)}/${String(bucket.total)} (${String(rate)}%) queries exhausted the budget.`;
  });

  return lines.length === 0 ? "No rows to aggregate." : lines.join("\n");
}

/**
 * Pure Markdown renderer for the Layer A section of the eval report
 * (`docs/eval-design.md`, "Formato del reporte"). Never blocks: a diverging
 * status is a signal for Layer B, not a failure — the only Layer A check
 * that can fail a run is citation integrity (M1), enforced upstream in
 * `runSeedQueries` before a bundle ever reaches this function.
 */
export function renderMechanicalMetricsReport(
  entries: readonly MechanicalMetricsEntry[],
): string {
  const rows = buildMechanicalMetricsRows(entries);

  return [
    "## Layer A — mechanical metrics",
    "",
    renderRowsTable(rows),
    "",
    "### Status divergences from expectation",
    "",
    renderDivergingStatuses(rows),
    "",
    "### Budget exhaustion rate by depth",
    "",
    renderBudgetExhaustionRate(rows),
  ].join("\n");
}
