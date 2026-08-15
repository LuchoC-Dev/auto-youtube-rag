# Context assembly design

## Status

Specification **approved** on 12 August 2026 for point 2.3, with the six
decisions of the final section already confirmed by the user. It continues
[retrieval-design.md](retrieval-design.md), which already reserved `getUnits`
and `getAncestors` in `KnowledgeRepository` for this point. The consolidated
record of the decisions also lives in
[decisions.md](decisions.md#approved-context-assembly-design).

## Scope

2.3 takes `RetrievalOutcome` from `retrieveCandidates` (2.2) and produces the
`context.md` + `result.json` bundle that the agent consumes, plus the CLI's
`retrieve` command that exposes it.

| Inside 2.3                              | Outside 2.3 (left for 3.x)                |
| --------------------------------------- | ----------------------------------------- |
| Expansion of candidates to parent units | Calibration of RRF weights                |
| Deduplication of repeated content       | Minimum vector similarity threshold       |
| Token budget per depth                  | Real recall/precision evaluations         |
| Assignment of `[S0N]` citations         | Human interface                           |
| Writing `context.md` and `result.json`  | `rebuild` (does not depend on this point) |
| The CLI's `retrieve` command            | Additional reranking or an internal LLM   |

`retrieve` becomes available only once 2.3 is closed.

## Where each piece lives (layering decision)

Following the architecture already established (a pure domain, an application
with ports, infrastructure with concrete details):

- **Domain** (`src/domain/context/`): only the budget value object
  (`ContextDepth`, token resolution). It is the only business rule with
  invariants of its own (stable preset names, a positive override). It knows
  nothing about Markdown, JSON or the filesystem.
- **Application** (`src/application/context/`): the use case that orchestrates
  `KnowledgeRepository.getAncestors`, and the pure policies of expansion,
  deduplication, budget, citations and **rendering to text** (Markdown and the
  `result.json` object). Rendering is a pure function from application types to
  `string`/plain object — it does not touch disk, so it lives here just as
  `render-cli-output.ts` lives in the interface but without opening files.
- **Infrastructure** (`src/infrastructure/filesystem/`): only writing the bundle
  to disk (`<out>/<request_id>/context.md` and `result.json`) and generating
  `request_id`.
- **Interface** (`src/interfaces/cli/`): parsing `retrieve` and the compact
  receipt on `stdout`, just like the existing commands.

This keeps the same rule that already governs the project: the domain and the
application know nothing about Node paths or concrete file formats, and only
infrastructure writes.

## Budget model

```ts
export type ContextDepth = "focused" | "balanced" | "deep";

export const contextDepthPresets: Readonly<Record<ContextDepth, number>> = {
  focused: 12_000,
  balanced: 32_000,
  deep: 64_000,
};

export class ContextBudget {
  readonly depth: ContextDepth;
  readonly maxTokens: number;

  static default(): ContextBudget;
  static create(input: {
    depth?: unknown;
    maxTokensOverride?: unknown;
  }): ContextBudget;
}
```

Implemented in `src/domain/context/context-budget.ts` following the same pattern
as `RetrievalLimits`: a private constructor, `create()` validates and applies
default values, `default()` is a shortcut with no overrides. The default `depth`
is `balanced`, according to `cli-contract.md`. `--max-tokens` replaces the
number but never the public names of the presets: the override is only a
positive integer, with no upper cap of its own — an absurdly high value is
simply never reached, because there is no more evidence to offer.

## Assembly request

```ts
export interface ContextRequest {
  readonly query: RetrievalQuery; // reuses the value object of 2.2
  readonly budget: ContextBudget; // already resolves depth + maxTokens (I1)
}
```

No new query value object is created: `RetrievalQuery` and `RetrievalFilter`
from 2.2 already cover text, filters and candidate limits. The only new concept
of 2.3 is the budget, and `ContextBudget` is reused instead of repeating loose
`depth`/`maxTokensOverride` fields.

## Expansion to parent units

1. Start from `RetrievalOutcome.candidates` (already deduplicated by unit and
   diversified by video in 2.2; at most `fusedResults`, 50 by default).
2. Collect the unique set of `unitId`s of the candidates.
3. Call **two** batches, not one: `knowledgeRepository.getUnits(unitIds)` and
   `knowledgeRepository.getAncestors(unitIds)`. `getAncestors` returns only the
   flat, deduplicated set of ancestor units — it does not say which ancestor
   corresponds to which candidate — and `KnowledgeUnit` does not carry
   video/document metadata (that lives only in `CandidateProvenance`).
   `getUnits` recovers each candidate's `parentId`, indispensable in order to
   reconstruct its exact chain and so that each ancestor block inherits the
   metadata of the candidate that originated it, since an ancestor never crosses
   documents. It is still O(1) in number of queries: two batches, not one query
   per candidate.
4. Build one citable block (`ContextUnitBlock`) per candidate (using
   `provenance.content`, which is already the complete text of the unit in the
   common case — it is only fragmented when a unit exceeds the model's token
   limit, see `fragment-knowledge-units.ts`) and, walking `parentId` from each
   candidate's unit towards the root through the ancestor map, one block per
   ancestor unit not seen yet (using `KnowledgeUnit.content`, always the whole
   text of the unit, never a fragment, and inheriting `packageRef`,
   `documentKind`, `documentRelativePath`, `videoTitle`, `creator`,
   `canonicalUrl` and `language` from the candidate that brought it in). If two
   candidates share an ancestor, the second walk stops as soon as it finds a
   `unitId` already built.

```ts
export interface ContextUnitBlock {
  readonly unitId: KnowledgeUnitId;
  readonly packageRef: PackageRef;
  readonly unitType: KnowledgeUnitType;
  readonly headingPath: readonly string[];
  readonly title: string | null;
  readonly content: string;
  readonly contentHash: string; // for the deduplication of J2
  readonly tokenCount: number;
  readonly origin: "candidate" | "ancestor";
  readonly fusedScore: number; // its own, or that of the candidate that expanded the ancestor
  readonly depth: number; // hierarchical depth, 0 = document
  readonly documentKind: SourceDocumentKind;
  readonly documentRelativePath: string;
  readonly videoTitle: string | null;
  readonly creator: string | null;
  readonly canonicalUrl: string | null;
  readonly language: string | null;
  readonly timestamps: readonly string[];
  readonly visualEvidence: readonly string[];
}
```

Implemented in `src/application/context/context-blocks.ts`, together with
`BudgetAllocation` and `CitationRecord`. `fusedScore` is never `null`: an
ancestor block inherits the score of the candidate that brought it in, because
J3 needs a comparable value in order to sort within "Additional relevant
context" without introducing a second ordering criterion.

The `result.json` object was typed in
`src/application/context/context-bundle.ts` (`ContextResultDocument`).
`cli-contract.md` leaves the items of `units[]` and `sources[]` without an
explicit schema beyond the citation example; 2.3 completes it like this: every
`ContextResultUnit` carries the same citation fields (`citation_id`,
`source_name`, `video_id`, ...) plus `section`
(`highest_relevance | related_rules | additional_context`), `content` and
`token_count`; every `ContextResultSource` summarises a distinct `packageRef`
(`source_name`, `video_id`, `video_title`, `creator`, `canonical_url`).

`ContextResultDocument` uses `snake_case` in its fields because that is the
exact, already approved shape of the file, not an internal TypeScript convention
— unlike `CitationRecord`/`ContextUnitBlock`, which are internal types in
`camelCase`. `renderContextResult` (K2) is the only place that translates from
one to the other, just as `run-cli.ts` builds its `snake_case` receipts out of
application types in `camelCase`.
`coverage` reports real counts (`unitsByType`, `unitsBySource`,
`omittedForBudget`, `budgetExhausted`), never invented text.

A candidate's `tokenCount` comes from `provenance.tokenCount`; an ancestor's
comes from `KnowledgeUnit.estimatedTokens`. Neither of the two is recomputed:
both have been persisted since indexing (2.1), so assembly never tokenises again
nor depends on the embedding model.

## Deduplication

Two levels, both required by `product-spec.md` ("deduplicate repeated
content"):

1. **By `unitId`**: a unit that already appeared as a candidate is never
   repeated as an ancestor of another candidate (for example, two sibling
   `rule_item`s that share the same parent `rule_pattern`). A single block is
   built per `unitId`, with metadata priority (`origin: "candidate"` wins over
   `"ancestor"` if the same unit arrives by both routes).
2. **By `contentHash`**: in the rare case of identical content under two
   different `unitId`s (for example, a rule repeated verbatim in two packages),
   only the first in inclusion order is kept and the rest are omitted.
   References are not merged: the omitted unit simply produces no block and no
   citation.

## Budget and truncation

The order of entry into the budget is fixed and deterministic:

1. Candidate blocks whose `unitType` is `context_section`, `context_document`,
   `rules_section`, `rules_document`, `analysis_document`, `analysis_section` or
   `analysis_topic`, ordered by descending `fusedScore` → they feed
   "Highest-relevance context".
2. Candidate blocks whose `unitType` is `rule_pattern`, `rule_item`,
   `avoid_item`, `acceptance_criterion` or `analysis_recommendation`, ordered by
   descending `fusedScore` → they feed "Related rules and patterns"
   (`analysis_recommendation` is not literally a rule, but it shares the
   functional role of prescriptive content derived from the analysis; see
   "Bucketing" in `docs/analysis-schema-design.md`).
3. Ancestor blocks, ordered by the `fusedScore` of the candidate that originated
   them (descending) and, within the same candidate, by descending `depth` —
   `depth` 0 is the root of the document, so a higher `depth` is closer to the
   leaf — so that the immediate parent always precedes the grandparent → they
   feed "Additional relevant context".

Each `unitType` category falls into a single section: a unit does not appear
twice even if it matches through both search paths, because it already arrives
deduplicated by `unitId` from the previous step.

`allocateBudget` walks that sequence accumulating `tokenCount` and **never cuts
a block in half**: it includes the complete block or omits it entirely, so that
no citation is left truncated. Edge-case rule: if the first block on its own
already exceeds the budget, it is included anyway — the bundle is never empty
when there is real relevant evidence — and the budget is marked exhausted
immediately afterwards, without adding anything else.

```ts
export interface BudgetAllocation {
  readonly included: readonly ContextUnitBlock[];
  readonly omittedCount: number;
  readonly estimatedTokens: number;
  readonly budgetExhausted: boolean;
}
```

## Citations

The IDs `[S01]`, `[S02]`... are assigned **after** the budget, in the final
inclusion order: an omitted block never reserves or skips a number. Every
included block produces exactly one citation record, following the schema
already approved in `cli-contract.md`:

```ts
export interface CitationRecord {
  readonly citationId: string; // "S01", "S02", ...
  readonly sourceName: string;
  readonly videoId: string;
  readonly videoTitle: string | null;
  readonly creator: string | null;
  readonly file: string; // documentRelativePath
  readonly headingPath: readonly string[];
  readonly unitType: KnowledgeUnitType;
  readonly timestamp: string | null; // the first timestamp if it exists
  readonly visualEvidence: readonly string[];
}
```

Two blocks from the same video receive different citations if their
`headingPath` differs, exactly as the example in `cli-contract.md` shows.

## Writing `context.md`

A pure function `renderContextMarkdown(request, allocation, citations, metrics)`
that produces exactly the document approved in `cli-contract.md`: front matter
(`schema_version`, `query`, `depth`, `estimated_tokens`, `sources_used`) and the
six fixed sections. Each block is rendered with its `headingPath` as a subtitle
and its whole content followed by the `[S0N]` marker; "short" in the contract
describes the citation marker, not a trimming of the content — the agent needs
the block's complete text, not a summary. "Coverage and limitations" enumerates,
inventing nothing, only real available signals: warnings from
`RetrievalOutcome.warnings`, `budgetExhausted`, `omittedCount` and sources
filtered explicitly by the user. "Source registry" lists each distinct
`packageRef` present in the included blocks, with its `sourceName`, `videoId`,
title and creator.

## Writing `result.json`

A pure function `renderContextResult(request, allocation, citations, metrics,
warnings)` that produces the versioned object already approved, with `units`
(one element per included block, with its citation), `sources` (the same
registry as the Markdown section), `coverage` (counts by `unitType` and by
source) and `limitations` (text derived only from real warnings/truncation, in
English). `status` is `"ok"` if there is at least one included block, or
`"no_results"` if `RetrievalOutcome.status` was already `"no_results"` or if the
budget did not allow including any block (an absurdly low budget, for example
`--max-tokens 1`).

## Writing the bundle

`writeContextBundle(bundle, outputDir)` in infrastructure creates
`<outputDir>/<request_id>/context.md` and `result.json`. `request_id` follows
the same pattern already used for `SyncId` in `sync-source.ts`
(`Date.now().toString(36)` + random), injectable for deterministic tests. The
`01J...` format of the example in `cli-contract.md` is illustrative, not a
demand for a real ULID: no new dependency is added to generate it, just as
`SyncId` did not need one.

Without `--out`, `os.tmpdir()` is used with the same `request_id` as a
subfolder — consistent with "without it, a temporary directory identified by
`request_id` is used" in `cli-contract.md`. `--out` with an existing, non-empty
path that is not already the directory of a previous `request_id` must fail
explicitly instead of mixing bundles.

## The `retrieve` command

```text
auto-youtube-rag retrieve <query> \
  [--depth focused|balanced|deep] \
  [--max-tokens <positive-integer>] \
  [--source <name>] \
  [--out <directory>]
```

`--source` is repeatable (the same pattern as other list filters). The command:

1. parses arguments and builds `RetrievalQuery`/`RetrievalFilter`/
   `RetrievalLimits` with the default values of 2.2;
2. calls `application.retrieveCandidates`;
3. if `status` is `no_results`, it assembles a minimal bundle all the same, with
   `coverage`/`limitations` explaining the absence of evidence, instead of
   writing nothing — the agent always receives a bundle it can read;
4. if there are candidates, it expands, deduplicates, budgets, cites and
   renders;
5. writes the bundle and emits the compact receipt of `cli-contract.md` on
   `stdout`;
6. exit code `0` for `ok`/`no_results`, `1` if `retrieveCandidates` could only
   complete one degraded path and that is reflected as `status: "partial"` in
   the receipt, `2` for invalid use.

`stderr` receives progress only ("Retrieving context...", "Assembling
bundle..."), just like `sync`.

## Invariants

- No block is truncated in half: it is included whole or omitted.
- No `[S0N]` citation is left without its corresponding record in
  `result.json`, and vice versa.
- Assembly never tokenises again nor opens the embedding model: it uses
  exclusively the `tokenCount`/`estimatedTokens` already persisted.
- Assembly never writes to SQLite or to the sources.
- A source package is never opened directly: all cited content comes out of
  `KnowledgeRepository`.
- `context.md` does not answer the query nor add inferences: it only organises
  evidence with provenance.
- `limitations` and "Coverage and limitations" never fabricate a cause: they
  only describe real signals (`warnings`, `budgetExhausted`, `omittedCount`,
  applied filters).
- `retrieve` is not announced as available until this point is closed.

## Required tests

- Budget: `ContextDepth` resolves the three presets; `--max-tokens` replaces the
  preset without changing its name; a non-positive or non-integer value is
  rejected.
- Expansion: a child candidate brings in its parent and grandparent up to the
  root; two sibling candidates do not duplicate the common parent; a unit
  already present as a candidate is never repeated as an ancestor.
- Deduplication: two units with an identical `contentHash` produce a single
  block and a single citation.
- Budget and truncation: a small budget omits whole blocks, never trims them;
  the first block is included anyway if on its own it exceeds the budget;
  `omittedCount` and `budgetExhausted` are correct.
- Citations: the IDs are sequential with no gaps in the final inclusion order;
  two blocks from the same video with different `headingPath`s receive different
  citations; every `[S0N]` in the Markdown resolves in `result.json`.
- Writing: `context.md` keeps the six fixed sections and the front matter;
  `result.json` validates against the schema of `cli-contract.md`.
- CLI: `retrieve` with no results writes a valid bundle with
  `status: "no_results"`; a repeated `--source` filters correctly; `--out`
  respects the requested path; without `--out` it uses a temporary directory;
  the exit codes match the contract.
- E2E: the complete cycle over the reproducible temporary collection, with
  deterministic embeddings as in `test/e2e/retrieval.e2e.test.ts`, and a digest
  of the source tree unchanged before/after.

## Decisions approved on 12 August 2026

1. Fixed bucketing by `unitType`: document/section units always go to
   "Highest-relevance context" and rules/patterns always to "Related rules and
   patterns", never by raw score.
2. Expansion ancestors always fall into "Additional relevant context", never
   into the two preceding sections, even if the ancestor is itself a relevant
   `rule_pattern`.
3. Rule for a single block that exceeds the budget: it is included anyway and
   the budget is marked exhausted immediately, instead of omitting it.
4. Deduplication at two levels from the start of 2.3: by `unitId` (structural,
   block J1) and by `contentHash` (identical content under different units,
   block J2). It is not postponed.
5. `request_id` uses the same ad-hoc generator as `SyncId` (with no new
   dependency). It is independent of decision 4: one names the bundle's
   directory, the other collapses repeated content within the bundle.
6. Per-depth budgets: the values already fixed in `cli-contract.md` are kept
   (`focused` 12k / `balanced` 32k / `deep` 64k) without recalibrating in this
   point.
