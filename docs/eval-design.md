# MVP evaluation design

## Status

Specification proposed and approved on 12 August 2026 for point 3.2, the only
open block of `build.md`. It continues
[retrieval-design.md](retrieval-design.md) (which left the RRF weights and an
eventual similarity floor pending calibration) and
[context-assembly-design.md](context-assembly-design.md) (which left the
per-depth budgets pending calibration). It introduces no changes to the schema,
the domain, the use cases or the public CLI contract: 3.2 evaluates the product
already closed in 2.1–2.4, it does not modify it unless the evidence justifies
doing so.

## Scope

| Inside 3.2                                                                 | Outside 3.2                                                                 |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Run `retrieve` over the real collection with the real E5                   | New CLI surface                                                             |
| Mechanical metrics of coverage and citation integrity                      | Hand-labelled relevance ground truth                                        |
| Quality judgement by Codex and by Claude over the same bundle              | Automated tests in CI                                                       |
| Adjustment of RRF weights and per-depth budgets, only if the evidence asks | Minimum vector similarity threshold (stays open except with clear evidence) |
| Final report with actionable findings                                      | New sources or web page packages                                            |

## Starting constraint: there is no labelled corpus

Building a list of "correct fragments" per query by hand would be expensive and
subjective, and the product's own success criterion
([product-spec.md](product-spec.md)) is not "a pinpoint match" but broad, cited
coverage. That is why 3.2 does not pursue a classical recall/precision against
ground truth. Instead it measures in two independent layers:

- **Layer A — mechanical:** verifiable with code, with no agent in the middle,
  100% reproducible.
- **Layer B — judged:** the real consuming agent (Codex or Claude) reads the
  bundle and answers a short rubric. It is the natural judge because the product
  is "for agents, not for human search"
  ([product-spec.md](product-spec.md)).

Neither layer replaces the other. Layer A detects structural regressions with no
human intervention; Layer B is the only source of signal about real semantic
relevance.

## Layer A — Mechanical metrics

Computed directly from `RetrievalOutcome`/`ContextResultDocument`
(`src/application/retrieval/retrieval-results.ts`,
`src/application/context/context-bundle.ts`) for each query of
[`evals/queries/seed-queries.json`](../evals/queries/seed-queries.json), at the
three depth presets.

Per query and depth:

- the `status` obtained vs. what is expectable according to the query's `kind`
  field (e.g. `kind: "no_answer"` should produce `status: "no_results"` or,
  given that the vector path has no similarity floor
  ([retrieval-design.md](retrieval-design.md#no-threshold-in-the-vector-search)),
  candidates whose real relevance Layer B marks as low).
- `metrics.candidates_considered`, `metrics.units_selected`,
  `metrics.sources_used`, `metrics.estimated_tokens`.
- `coverage.units_by_type`, `coverage.units_by_source`,
  `coverage.omitted_for_budget`, `coverage.budget_exhausted`.
- the `warnings` present (`TEXT_SEARCH_UNAVAILABLE`,
  `VECTOR_SEARCH_UNAVAILABLE`, etc.).
- **Citation integrity**, the only verification that can fail like an automated
  test: every `[S0N]` marker that appears in `context.md` must resolve to a unit
  of `result.json.units` with the same `citation_id`, and every unit of
  `result.json.units` must have at least one appearance of its `citation_id` in
  `context.md`. A mismatch is an assembly bug, not a quality finding — if it
  appears, it gets fixed in `src/`, it is not documented as an eval result.

Aggregated across the eight queries and the three depths: a coverage table
(sources/videos reached), the rate of `budget_exhausted` per depth, and any
citation integrity discrepancy.

## Layer B — Relevance judged by Codex and by Claude

### Why the same bundle for both judges

The purpose of comparing Codex and Claude is not to evaluate two different
retrieval configurations — the product is neutral with respect to the provider
by design ([decisions.md](decisions.md)) — but to measure **the product's
consistency across consuming agents**. That is why both judges receive exactly
the same `context.md`/`result.json`, generated once per query and depth, never
independent `retrieve` runs per agent.

### Rubric

It anchors in the `expected.notes` field that every seed query already carries,
so as not to invent a new criterion disconnected from the one that motivated
each query when it was seeded. For each bundle, the judge answers:

1. **Apparent precision** (0.0–1.0): the fraction of the units included in
   `context.md` that the judge considers relevant to the query, by their own
   reading criterion.
2. **Sufficient coverage** (1–5): does the bundle suffice to answer the query
   without rereading the original videos? 1 = clearly insufficient, 5 =
   sufficient and well organised.
3. **Perceived gap** (free text, optional): would the judge notice, without
   seeing the complete collection, that something obvious they would expect to
   find is missing? This is a qualitative proxy for recall — never a number,
   because no judge without access to the complete collection can measure real
   recall.
4. **Match with `expected.notes`**: yes/no/partial, if the query's note
   describes a verifiable expectation (e.g. "it must contribute both paths", "it
   must cross over to content in the other language").

The judge reads only `context.md` (the artefact designed for agent consumption)
plus the compact receipt of `retrieve`; `result.json` stays available so that
the judge can verify a particular citation if they need to, not as the main
reading.

### Procedure

1. Generate the bundles once (see Layer A) over the real collection.
2. Present each bundle to Claude (this same session or another one, with no
   prior context of the bundle) and record its four answers.
3. Present the same bundles to Codex, with the same protocol and the same answer
   format.
4. Compare: for each query, do the two judges agree on apparent precision
   (within ±0.2) and on sufficient coverage (within ±1)? A large discrepancy is
   a finding in itself — it may indicate that an agent interprets `context.md`
   differently, not necessarily that the bundle is wrong.

There is no numeric pass threshold fixed beforehand: 3.2 is the first real pass
and its result informs whether it is worth fixing one afterwards, not the other
way round.

## Execution over the real collection

The first complete validation over `auto-design` with the real E5 model,
something that 2.1, 2.2 and 2.3 explicitly deferred (see
[agent-handoff.md](agent-handoff.md), "Última validación conocida"). The same
pattern already documented:

1. Copy `auto-design/videos` to a temporary directory outside the repo.
2. Compute and store the SHA-256 digest of the tree before touching it.
3. `init` + `source add` + `sync` over the copy, with the model already cached
   in `.cache/models`.
4. Run `retrieve` for the eight queries of `seed-queries.json`, at
   `--depth focused|balanced|deep` (24 bundles in total), dumping each one under
   `evals/results/<date>/<query-id>/<depth>/`.
5. Verify that the SHA-256 digest of the source tree is unchanged.
6. Delete the temporary copy and its SQLite database on finishing;
   `evals/results/` keeps only the generated bundles and the report, never the
   collection nor the index.

## Conditional calibration of RRF and budgets

`FusionStrategy` is already replaceable through `ApplicationOverrides` in
`src/main/create-application.ts` without touching the domain, the use cases or
the CLI. This makes it possible to instantiate
`createRrfFusion({ k, weightText, weightVector })` with different values from an
evaluation script, without changing the `fusionStrategy` that the real CLI uses.

Decision rule: **the grid of weights is not swept blindly.** It is run first
with the defaults (`k = 60`, `wText = wVector = 1.0`) and variants are only
tried if Layer A or Layer B shows a concrete problem — for example, one path
systematically dominating and the other contributing no candidates the judges
consider relevant. The same criterion applies to the depth presets (`focused`
12k / `balanced` 32k / `deep` 64k): they are adjusted only if
`coverage.budget_exhausted`/`coverage.omitted_for_budget` show that they do not
discriminate between real cases.

Any change of weights or budgets resulting from 3.2 is documented in
`docs/decisions.md` with the concrete evidence that motivated it, following the
same format as the RRF decision of 2.2. If 3.2 finds no evidence sufficient to
change anything, that "no changes, insufficient evidence" is in itself a valid
result and gets recorded all the same.

## Report format

A single `evals/results/<date>/report.md` with:

1. An executive summary (does the product meet its success criterion today?).
2. A Layer A table per query × depth.
3. A Layer B table with each judge's four answers, per query × depth, and the
   Codex vs. Claude comparison.
4. Actionable findings, each one with: symptom, the query that exposed it, a
   hypothesis of the cause, and whether or not it warrants an action within 3.2
   itself or is left for a later stage.
5. The final decision on RRF weights and budgets (change with evidence, or keep
   unchanged).

The 24 raw bundles (`context.md` + `result.json`) stay next to the report so
they can be reread without regenerating anything.

## Invariants

- 3.2 never writes, moves or deletes files of the real collection; it operates
  only over the temporary copy.
- 3.2 never commits to the repository the copied collection, the temporary
  SQLite database, or the downloaded model — only bundles and the report under
  `evals/results/`.
- No change of RRF weights or budgets is applied without evidence documented in
  `decisions.md`.
- Layer B's judgement never substitutes for Layer A's mechanical verification: a
  citation mismatch is a bug, it gets fixed, it is not reported as a quality
  finding.
- The two Layer B judges see exactly the same bundle; different bundles "for
  Codex" and "for Claude" are never generated.

## Required tests

- The citation integrity verifier (Layer A) is tested with automated cases: a
  bundle with no mismatches passes, one with an orphan citation or a unit with
  no citation fails — using small fixtures, not the real collection.
- The seed-query orchestration script is tested with `npm run check` and
  `npm run build` like any change to `src/`/`evals/`, even though its real
  execution against the collection is manual.
- The real run over `auto-design` and the Codex/Claude judgement are manual by
  nature: there is no way to automate an agent's judgement over free text within
  this stage.

## Closing criterion

3.2 is marked complete when:

1. The 24 bundles are generated and stored together with their Layer A metrics.
2. The four Layer B fields are recorded for Claude and for Codex over those same
   24 bundles.
3. The aggregate report exists with findings and the final decision on RRF
   weights and budgets, be it to change them or to keep them.
4. Any change of weights/budgets is reflected in `decisions.md`.
5. `docs/build.md` marks 3.2 at 100% and `docs/agent-handoff.md` documents the
   final state of the MVP for the next agent.
6. `npm run check` and `npm run build` pass and the worktree keeps no temporary
   collections, databases or models.
