# Detailed handoff to continue `auto-youtube-rag`

## Purpose of this document

This document lets a new agent pick up the project without depending on the
conversation that originated it. It describes the product goal, the exact state
of the repository, the confirmed decisions, the architecture already
implemented, the invariants that must not be broken, the validations already
performed, and the recommended next block.

Reference state: **14 August 2026**, after closing points 4.2 —installation:
user home, `init` as installer and preflight—, 4.3 —`sync` safety and indexing
performance—, 4.4 —stale vector warning—, 4.5 —embedding model profile and
prefix policy—, 4.6 —the `rebuild --confirm` command— and 4.7 —the
`LOW_RELEVANCE` warning.

**What is most likely to contradict your memory of older sessions**, in order
of impact:

1. The database and the model are **no longer relative to the working
   directory**. They live in `~/.auto-youtube-rag/`, they are installed with
   `auto-youtube-rag init`, and `AUTO_YOUTUBE_RAG_MODEL_CACHE` was renamed to
   `AUTO_YOUTUBE_RAG_MODELS_DIR`.
2. The branch is **`main`**, with a private remote, not
   `feat/sqlite-vec-benchmark`.
3. **You cannot launch two `sync` runs at once** over one source: the product
   rejects them with `SYNC_ALREADY_RUNNING`. `sync --force` exists to unblock
   a ghost run.
4. **The citation marker opens the block, inside the heading**
   (`### [S01] ...`); it does not close it on a separate line.
5. `init` is **no longer instantaneous**: it installs the model unless
   `--skip-model` is passed.
6. **`rebuild --confirm` is already implemented.** If an old memory says the
   contract approves it but it does not exist, that memory is out of date: it
   was closed as point 4.6. The CLI has no command left to implement.

See "Runtime configuration" below before assuming any path.

Previously, point 3.2 — MVP evaluations — and point 4.1 — `analysis.json`
support (schema 2.0), the first piece of post-MVP work — had been closed. The
complete MVP described in `product-spec.md` (2.1–2.4 and 3.1–3.2) is finished.
The CLI's `retrieve` command and the portable skill (`skill/SKILL.md`) are
implemented, tested and announced as available; the retrieval and assembly
evaluations have been run over the real collection with a documented result.
On top of that, `auto-youtube-rag` now indexes and retrieves `analysis.json`
(schema 2.0) end to end, validated against the 17 real `auto-design` videos
that use it. The identity of the embedding model and its prefix policy are now
an explicit, injectable piece of data (`EmbeddingModelProfile`) instead of
hardcoded E5-specific constants — front number 1 of the priority order the
user set on 14 August is already closed. There is no open block in
`docs/build.md`. The work that follows —if the user asks for it— is explicitly
post-MVP (see "Reasonable later work, outside this MVP" below), not an urgent
pending item.

## Quick facts

| Fact                   | Value                                                                                    |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| Project                | `auto-youtube-rag`                                                                       |
| Repository             | `<repo>` (root of the local checkout)                                                    |
| Current branch         | `main`                                                                                   |
| Remote                 | `origin` → `github.com/LuchoC-Dev/auto-youtube-rag` (private)                            |
| Last documented commit | see `git log --oneline -1`; the work of this document closes point 4.6                   |
| Git state at closing   | Clean worktree; `main` pushed and in sync with `origin/main` (0 difference); only branch |
| Runtime                | Node.js 24.19.0 LTS, ESM                                                                 |
| Language               | Strict TypeScript 6.0.3                                                                  |
| Persistence            | SQLite through `node:sqlite`                                                             |
| Model                  | `Xenova/multilingual-e5-small`, revision `main`, `q8` quantization                       |
| Dimension              | 384                                                                                      |
| Installation           | `auto-youtube-rag init` → `~/.auto-youtube-rag/` (database + model, ~130 MB)             |
| Operation              | Exclusively local; no external APIs                                                      |
| MVP state              | Complete — 2.1–2.4, 3.1–3.2 and 4.1–4.7 at 100% in `docs/build.md`                       |
| Next point             | None open; the 14 August priority order is exhausted (see "Priority order" below)        |

**This changed on 14 August 2026.** Until then the whole project lived on a
branch called `feat/sqlite-vec-benchmark` —a name inherited from a discarded
benchmark— with no `main` branch and no remote. `main` was created on the tip
of that branch, so it contains the 128 commits since the first one with no need
for a merge, and it was published to a private repository. If an old session
memory mentions `feat/sqlite-vec-benchmark` as the working branch, it is out of
date.

`sqlite-vec` is still an evaluated and **discarded** option for the MVP: the
old branch name does not mean anyone is working on it.

Do not rewrite history or force pushes without explicit authorization.

**`main` is now the only branch, local and remote.** The three dead local
branches —`feat/sqlite-vec-benchmark`, `docs/bootstrap-project` and
`feat/embedding-benchmark`— were deleted on 14 August 2026 with
`git branch -d`, after confirming that none of them held a single commit that
`main` did not already contain. Nothing was lost: their commits are still in
`main`'s history.

## Recommended reading order

Before modifying code, read in this order:

1. `docs/product-spec.md`: goal, scope, limits and the complete product.
2. `docs/decisions.md`: confirmed decisions and discarded alternatives.
3. `docs/cli-contract.md`: approved public contract, including future commands.
4. `docs/build.md`: build history, what each point delivered and how it was
   validated.
5. `docs/indexing-design.md`: logical model and architecture of point 2.1,
   already completed.
6. `docs/retrieval-design.md`: contracts, adapters and fusion policy of point
   2.2, already completed.
7. `docs/context-assembly-design.md`: contracts, layers, expansion,
   deduplication, budget, citations and bundle contract of point 2.3, already
   completed.
8. `skill/SKILL.md`: portable skill already verified, point 2.4 completed.
9. `docs/eval-design.md`: two-layer evaluation design of point 3.2, already
   completed.
10. `evals/results/2026-08-12/report.md`: final report of 3.2 — executive
    summary, Layer A metrics, Layer B Codex/Claude comparison, actionable
    findings and the calibration decision (O1).
11. `docs/analysis-schema-design.md`: design of `analysis.json` support
    (schema 2.0), point 4.1, already completed.
12. `docs/install-design.md`: installation design —user home, `init` as
    installer and preflight— of point 4.2, already completed. It includes the
    note "what it would take to support another model", which is the starting
    point of the next front.
13. `docs/sync-safety-design.md`: concurrency guard, ghost runs and batch size
    of point 4.3, already completed.
14. `docs/rebuild-design.md`: the `rebuild --confirm` command of point 4.6,
    already completed. It includes why sorting by length was closed without
    writing code.
15. `docs/low-relevance-design.md`: the `LOW_RELEVANCE` warning and the
    `top_vector_similarity` metric of point 4.7, already completed. It includes
    the table of 24 measurements that sets the threshold and why `fusedScore`
    is useless for measuring relevance.
16. This document: consolidated operational state of the MVP, of points 4.1 to
    4.7, the already exhausted priority order and what the 13 and 14 August
    session taught.

`docs/development.md` is still the toolchain reference, and since 14 August
2026 also the reference for **how to get started on a new machine** (section
"Getting started on a new machine"): `npm ci` + `npm run check` +
`npm run build` work on a clean clone **with no network and no model**, because
the fast suite skips the smokes and uses fakes. Only the smokes and the
benchmarks need `npm run models:download`, and only using the product needs
`auto-youtube-rag init`. Its sentence describing the repository as a scaffold
with no domain has already been corrected.

## Product goal

The system builds a queryable local library out of the self-contained packages
generated by the video context skill. It does not attempt to answer with an
internal LLM. The querying agent —Codex, Claude or another— is the only
generative brain.

The product must retrieve broad, ordered, cited context with provenance. It is
not designed only to find a single pinpoint match. For example, a query about a
design style must deliver enough related context for the agent to reason
correctly about facts, rules, patterns, limitations and evidence.

The MVP is for agents, not for human search. The approved integration is a CLI
consumed by a single portable skill. MCP, API, web interface and support for
web page packages are left for later phases.

## Scope of the sources

Every registered root follows the structure produced by the video skill:

```text
collection/
  manifest.json
  videos/
    <slug>/
      deliverables/context.md
      deliverables/rules.json
      source/metadata.json
      ...other files not indexed by the MVP
```

Indexed:

- `manifest.json` as the authoritative inventory;
- `context.md` as the main narrative knowledge;
- `rules.json` as structured pattern knowledge;
- a stable allowlist of `metadata.json` for filters and provenance.

Not indexed as knowledge:

- redundant transcripts;
- equivalent subtitles in several formats;
- images or frames by file name;
- web pages from the manifest;
- the full volatile yt-dlp metadata;
- source videos.

Existing visual evidence paths and timestamps are preserved inside the units
for future citations or inspection.

## Confirmed decisions that should not be reopened without cause

- Exclusively local execution.
- TypeScript on Node 24.19.0; not Go or Rust for this MVP.
- SQLite, not PostgreSQL.
- `node:sqlite` as the client; `better-sqlite3` only remains because of
  historical benchmarks.
- FTS5 for textual retrieval.
- Multilingual E5 Small `q8` for documents and queries.
- Vectors persisted as little-endian `Float32Array` BLOBs and exact in-memory
  search during the MVP.
- `sqlite-vec` is not integrated initially: the benchmark did not justify
  taking on its instability and operational complexity at this point.
- Domain and application know nothing about SQLite, Transformers.js or file
  formats.
- A single general skill for Codex, Claude and future agents.
- CLI with strict `node:util.parseArgs`, with no additional framework.
- Public process codes: `0`, `1`, `2`, `130`.
- Technical keys and symbolic codes in English; content in its original
  language.
- Source packages are immutable.
- Retrieval evaluations are prepared before closing the MVP.

`product-spec.md` has no open items blocking implementation: the results
combination and reranking policy, which was the only pending one, was resolved
on 11 August 2026 (weighted RRF, see `decisions.md`).

## Completed state

### Definition and stack

- Repository, specifications and tracker created.
- CLI contract and output schemas approved.
- Model benchmarks performed; E5 Small selected.
- Benchmark of `sqlite-vec` against exact search performed; exact was chosen.
- SQLite client benchmark performed; `node:sqlite` was chosen.
- Toolchain pinned and reproducible.

### Point 2.1 — incremental indexing

Blocks A–E are completed:

- A: identities, entities, content, runs, issues, ports and atomic changes.
- B: layout, manifest, Markdown, rules, metadata, package reader, units and
  fragmentation.
- C: local E5 adapter and offline smoke.
- D: SQLite schema, source registry, state, runs, issues, transactional
  replacement, FTS5 and embeddings.
- E: source use cases, `sync` orchestrator, composition root, CLI, `status`,
  `doctor` and E2E.

### Point 2.2 — hybrid retrieval

Blocks F–H are completed:

- F: query/filter/limits value objects, retrieval ports (`TextSearchIndex`,
  `VectorSearchIndex`, `KnowledgeRepository`) and weighted RRF fusion.
- G: FTS5 query sanitizer, text adapter over `fragment_fts`, exact in-memory
  vector index and SQLite knowledge repository.
- H: selection (dedupe + diversity), `retrieveCandidates` use case, wiring in
  the composition root and complete E2E.

Full detail, decisions and implementation notes in the
["Point 2.2 completed"](#point-22-completed--hybrid-retrieval) section below,
and in `docs/retrieval-design.md`.

### Point 2.3 — context assembly

Blocks I–L are completed:

- I: budget by depth (`ContextBudget`) and application types
  (`ContextRequest`, `ContextUnitBlock`, `BudgetAllocation`, `CitationRecord`,
  `ContextBundle`/`ContextResultDocument`).
- J: expansion to parent units (`expandToAncestors`), deduplication by `unitId`
  and by `contentHash` (`deduplicateBlocks`), budget and truncation
  (`allocateBudget`) and citation assignment (`assignCitations`).
- K: rendering of `context.md` (`renderContextMarkdown`) and `result.json`
  (`renderContextResult`), orchestration (`assembleContext`) and writing the
  bundle to disk (`writeContextBundle`).
- L: the CLI's `retrieve` command, complete E2E and documentation closure.

`retrieve` is announced and available. Full detail, decisions and
implementation notes in `docs/context-assembly-design.md`.

### Point 2.4 — general skill

Completed: `skill/SKILL.md` at the root of the repository, self-contained (it
does not depend on paths relative to `docs/`, so that it can be installed
outside this repo), and it teaches an agent to operate `init`, `status`,
`doctor`, `source add/list/remove`, `sync` and `retrieve` with no
provider-specific logic. It required no changes in `src/`.

Verified with two runs of a subagent with no prior context of the project
("cold"), each one with only the text of the skill and a temporary copy of two
real `auto-design` videos. Full detail in the
["Point 2.4 completed"](#point-24-completed--general-skill) section below.

### Point 3.2 — MVP evaluations

Completed on 13 August 2026, in two independent layers with no hand-labelled
ground truth (design in `docs/eval-design.md`):

- Layer A (mechanical, block M): 24 real bundles generated over the
  `auto-design` collection with the real E5; perfect citation integrity;
  metrics aggregator.
- Layer B (judged, block N): a shared rubric answered by Claude and by Codex
  over the same 24 bundles, without seeing each other's answers; 9/24 pairs
  diverge, none of them because of a product defect.
- Block O: explicit decision to keep the RRF defaults and the budgets by depth
  unchanged, plus the final closing report.

Full detail, decisions and actionable findings in the
["Point 3.2 completed"](#point-32-completed--mvp-evaluations) section below, in
`docs/eval-design.md`, and in `evals/results/2026-08-12/report.md`.

`docs/build.md` marks 2.1, 2.2, 2.3, 2.4, 3.1 and 3.2 at 100%. The complete MVP
is closed; no block remains open.

## Implemented architecture

Complete inventory of `src/` as of the date of this document (69 files). A cold
agent can trust this list instead of exploring the tree again; if it diverges
from reality, the tree wins and this list is out of date.

### Domain — `src/domain`

It does not import infrastructure.

`src/domain/indexing/`:

- identifiers (`identifiers.ts`): `SourceName`, `VideoId`, `PackageRef`,
  `DocumentId`, `KnowledgeUnitId`, `SearchFragmentId`, `SyncId`;
- entities: `source-root.ts`, `video-package.ts`, `source-document.ts`,
  `knowledge-unit.ts`, `search-fragment.ts`, `embedding-record.ts`,
  `sync-run.ts` (includes `SyncIssue`);
- `content-identity.ts`: SHA-256 and deterministic structural keys
  (`createMarkdownSectionKey`, `createRulePatternKey`, `createRuleChildKey`,
  `createFragmentKey`);
- `domain-error.ts`: `DomainValidationError` with symbolic codes shared across
  the whole domain (`INVALID_IDENTIFIER`, `INVALID_PACKAGE_REF`,
  `INVALID_RETRIEVAL_QUERY`).

Important identity: a package is `(source_name, video_id)`. The slug only
locates the directory and can change.

`src/domain/retrieval/` (new in 2.2):

- `retrieval-query.ts`: `RetrievalQuery`, `RetrievalLimits`, NFC normalization
  and a 1000-character cap;
- `retrieval-filter.ts`: `RetrievalFilter`, criteria deduplication and
  lowercase language comparison.

`src/domain/context/` (new in 2.3):

- `context-budget.ts`: `ContextBudget`, resolves the `focused`/`balanced`/`deep`
  presets (12k/32k/64k tokens) and validates the `--max-tokens` override as a
  positive integer without renaming the public preset.

### Application — `src/application`

Current ports (`src/application/ports/`):

- `package-source-reader.ts` → `PackageSourceReader`;
- `source-registry.ts` → `SourceRegistry`;
- `index-store.ts` → `IndexStore`;
- `embedding-generator.ts` → `EmbeddingGenerator`;
- `vector-index-sink.ts` → `VectorIndexSink` (write-only; it still exists as
  the base of `VectorSearchIndex`, `sync` does not replace it directly);
- `text-search-index.ts` → `TextSearchIndex` (new in 2.2);
- `vector-search-index.ts` → `VectorSearchIndex` (new in 2.2; extends
  `VectorIndexSink` with `load` and `search`);
- `knowledge-repository.ts` → `KnowledgeRepository` (new in 2.2).

Use cases and pure policies:

- `src/application/sources/`: `add-source.ts`, `list-sources.ts`,
  `remove-source.ts`;
- `src/application/indexing/`: `build-knowledge-units.ts`,
  `fragment-knowledge-units.ts`, `sync-source.ts` (`syncSource` orchestrator),
  `package-snapshots.ts`, `indexed-package-change.ts`;
- `src/application/diagnostics/`: `get-status.ts`, `run-doctor.ts`;
- `src/application/retrieval/` (new in 2.2): `retrieval-results.ts` (shared
  types `RankedHit`, `FusedHit`, `CandidateProvenance`, `RetrievalCandidate`,
  `RetrievalOutcome`), `fusion-strategy.ts` (`FusionStrategy` port),
  `rrf-fusion.ts` (`createRrfFusion`), `select-candidates.ts`
  (`selectCandidates`, dedupe + diversity), `retrieve-candidates.ts`
  (`retrieveCandidates`, the orchestrator of 2.2).

`src/application/context/` (new in 2.3):

- `context-request.ts`: `ContextRequest` (query + `ContextBudget`);
- `context-blocks.ts`: `ContextUnitBlock`, `BudgetAllocation`,
  `CitationRecord`, `ContextSection` and `classifyContextSection` (bucketing
  shared by `allocateBudget` and the renderers);
- `context-bundle.ts`: `ContextBundle`, `ContextResultDocument`,
  `ContextResultUnit`, `ContextResultSource` — with `snake_case` names because
  they are the wire contract already approved in `cli-contract.md`, not an
  internal TypeScript convention;
- `expand-to-ancestors.ts` (`expandToAncestors`): combines candidates and
  already resolved ancestor chains into citable blocks without duplicates;
- `deduplicate-blocks.ts` (`deduplicateBlocks`): collapses blocks with an
  identical `contentHash` under different `unitId`s;
- `allocate-budget.ts` (`allocateBudget`): fixed order by bucket
  (document/section → rules/patterns → ancestors) and whole-block truncation,
  never halfway;
- `assign-citations.ts` (`assignCitations`): IDs `S01`, `S02`... in the final
  inclusion order;
- `render-context-markdown.ts` (`renderContextMarkdown`) and
  `render-context-result.ts` (`renderContextResult`): pure renderers of
  `context.md` and `result.json`;
- `assemble-context.ts` (`assembleContext`): orchestrator of 2.3, composes
  everything above on top of `RetrievalOutcome`.

The orchestrator only knows ports. Application tests use fakes (`test/fakes/`)
and load neither SQLite nor the real model.

### Infrastructure — `src/infrastructure`

Filesystem (`src/infrastructure/filesystem/`):

- `source-layout-resolver.ts`: canonical resolution of a collection or a
  `videos/` folder;
- `manifest-reader.ts`: manifest parsing;
- `context-markdown-parser.ts`, `rules-json-parser.ts`: parsing of `context.md`
  and `rules.json`;
- `metadata-selector.ts`: selection of stable metadata;
- `filesystem-package-source-reader.ts`: complete reading of packages with no
  writes;
- `write-context-bundle.ts` (new in 2.3): `writeContextBundle`, writes
  `context.md` and `result.json` under `<outputDir>/<request_id>/`;
  `request_id` uses the same ad-hoc generator as `SyncId` (no ULID
  dependency); it fails explicitly if the `request_id` directory already
  exists instead of mixing files.

Embeddings (`src/infrastructure/embeddings/`, renamed in point 4.5):

- `model-profile.ts` (new in 4.5): `EmbeddingModelProfile`,
  `EmbeddingInputPrefixes`, the frozen active profile `activeModelProfile`,
  `modelVersion(profile)` and `modelDescriptorOf(profile)`. It imports
  nothing: not Transformers.js, not `node:fs`, not another module of the
  project. It is the only source of the model's identity (repository,
  revision, `dtype`, dimensions, `maxInputTokens`, `requiredFiles`) and of its
  prefix policy. `"Xenova/multilingual-e5-small"` appears exactly once in all
  of `src/`, here.
- `transformers-embedding-generator.ts` (formerly
  `e5-embedding-generator.ts`): `TransformersEmbeddingGenerator` loads lazily
  and receives `profile?: EmbeddingModelProfile` defaulting to
  `activeModelProfile`; prefixes are applied according to
  `profile.inputPrefixes` (`null` = no prefix, raw text), and
  `countTokens`/`embedDocuments` share the same prefixing function; declared
  limit: `profile.maxInputTokens` (512 with the active profile); configurable
  batches; normalized and validated vectors; runtime forced to local through
  `env.allowRemoteModels = false` and `env.cacheDir` before creating the
  pipeline. Renamed types: `EmbeddingAdapterError`/`...ErrorCode`,
  `EmbeddingSession`, `EmbeddingRuntime`, `EmbeddingRuntimeLoadOptions`
  (formerly prefixed with `E5`). The error code **values** did not change.
- `transformers-model-installer.ts` (formerly `e5-model-installer.ts`):
  `TransformersModelInstaller` receives the profile just like the generator;
  renamed types `ModelDownloadRuntime`/`ModelDownloadOptions` (formerly
  `E5DownloadRuntime`/`E5DownloadOptions`).

SQLite (`src/infrastructure/sqlite/`):

- `open-database.ts`: opening with WAL and foreign keys;
- `migrations/001-initial.ts`: versioned initial migration;
- `sqlite-source-registry.ts`: source registry;
- `sqlite-index-store.ts`: package and run state, complete transactional
  application;
- `sqlite-diagnostics.ts`: read-only diagnostics for `status`/`doctor`;
- `fts-query-sanitizer.ts` (new in 2.2): translates free text into a safe
  `MATCH` expression, tokenizing by letters/numbers and quoting every token;
- `sqlite-text-search-index.ts` (new in 2.2): `SQLiteTextSearchIndex`, queries
  `fragment_fts` with `bm25()` weighted by column;
- `sqlite-knowledge-repository.ts` (new in 2.2): `SQLiteKnowledgeRepository`,
  batched provenance, units and ancestors.

Vector (`src/infrastructure/vector/`, new in 2.2):

- `sqlite-vector-loader.ts`: `SQLiteVectorSource`, decodes little-endian
  float32 BLOBs from `embeddings`;
- `in-memory-vector-search-index.ts`: `InMemoryVectorSearchIndex`, contiguous
  matrix, lazy loading, dot product over normalized vectors.

### Interface — `src/interfaces/cli`

- `parse-command.ts`: strict arguments with `parseArgs`; it validates `--depth`
  and `--max-tokens` as a usage error (code `2`) before they reach
  `ContextBudget`, so that a mistyped argument never produces the operational
  failure code `1`;
- `render-cli-output.ts`: compact versioned JSON.
- `run-cli.ts`: use case execution and exit codes; the `retrieve` command (new
  in 2.3) builds `RetrievalQuery`/`RetrievalFilter`, calls
  `application.assembleContext`, writes the bundle with `writeContextBundle`
  and emits the compact receipt of `cli-contract.md`.
- `src/main.ts`: ESM entry point and configuration by environment.

`retrieve` has been available since the closure of 2.3 (see
["Implemented CLI"](#implemented-cli)).

### Composition root — `src/main/create-application.ts`

It wires concrete adapters and allows replacing them through overrides
(`ApplicationOverrides`). Creating the application downloads no models, does
not synchronize and does not load vectors. The model is loaded only when
counting tokens or generating embeddings; the vector index is loaded only on
the first query or `sync`.

Important change from 2.2: **`MemoryVectorIndexSink` was removed.** The
`vectorIndex` field of `Application` is now a `VectorSearchIndex`
(`InMemoryVectorSearchIndex` over `SQLiteVectorSource` by default). The same
instance receives the changes `sync` publishes and serves the
`retrieveCandidates` queries, so a committed change and a query can never see
different vectors. If you find references to `MemoryVectorIndexSink` in code or
in memory from old sessions, they are obsolete.

`Application` exposes `retrieveCandidates(query: RetrievalQuery):
Promise<RetrievalOutcome>`, as well as `vectorIndex`, `textSearchIndex` and
`knowledgeRepository` as replaceable properties.

New in 2.3: `Application` also exposes `assembleContext(request:
ContextRequest): Promise<ContextBundle>`, replaceable just like
`retrieveCandidates` (see the test `exposes assembleContext, reusing the same
retrieval wiring` in `test/main/create-application.test.ts`). It reuses exactly
the same internal `retrieveCandidates`, so it can never drift out of sync with
the retrieval engine.

## Exact flow of `retrieveCandidates` (2.2)

1. Normalizing and validating the query already arrived resolved as a
   `RetrievalQuery` (the domain already guarantees non-empty text, NFC, ≤1000
   characters).
2. Launch `textIndex.search` and (`embeddingGenerator.describe` +
   `embeddingGenerator.embedQuery` + `vectorIndex.load` +
   `vectorIndex.search`) in parallel.
3. If one path fails, capture the error, add a `RetrievalWarning` with code
   `TEXT_SEARCH_UNAVAILABLE` or `VECTOR_SEARCH_UNAVAILABLE` and continue with
   empty hits from that path. It never aborts the whole query.
4. Fuse both `RankedHit` lists with `FusionStrategy` (weighted RRF by default)
   → `FusedHit[]`.
5. Hydrate the provenance of the complete fused set with
   `knowledgeRepository.getFragmentProvenance` in a single batch (bounded by
   `textCandidates + vectorCandidates`). A `FusedHit` with no provenance (a
   fragment deleted right before this query) is discarded.
6. `selectCandidates`: deduplicate by `unitId` (keeping the best-scoring one),
   diversify with `maxPerVideo`, truncate to `fusedResults`.
7. Return a `RetrievalOutcome` with `status` (`"ok"` or `"no_results"`),
   `candidates`, `metrics` and `warnings`.

`vectorIndex.load()` returns the number of vectors available for the active
model (changed on 14 August 2026; it used to be `Promise<void>`). If the load
did not fail, that count is zero and the text path **did** find hits, the
`VECTORS_STALE` warning is emitted: the library has content but no vector for
the active model. The three conditions together matter — see
`docs/decisions.md`, section "Silent degradation of the vector path".

**A gotcha that is still current:** vector search has no similarity floor (see
the 2.2 decisions section below). `status: "ok"` with candidates of genuinely
low relevance is a valid and expected result, not a bug. 2.3 inherited this
explicitly: `assembleContext` never filters by a similarity threshold, only by
what the token budget allows it to include. The 2.3 E2E confirms it: the only
reliable path to `status: "no_results"` is a filter that empties the universe
of candidates (for example, `--source` of a non-existent source), not a
"meaningless" query over a non-empty library.

## Exact flow of `assembleContext` (2.3)

1. Call `retrieveCandidates(request.query)` → `RetrievalOutcome`.
2. Collect the unique set of `unitId`s from `outcome.candidates`.
3. Call `knowledgeRepository.getUnits(unitIds)` and
   `knowledgeRepository.getAncestors(unitIds)` in parallel — two batches, not
   one query per candidate. `getUnits` recovers each candidate's `parentId`
   (`RetrievalCandidate` does not carry it); `getAncestors` resolves the flat
   deduplicated set of reachable ancestors.
4. `expandToAncestors`: walks `parentId` from each candidate towards the root,
   builds one `ContextUnitBlock` per unique `unitId` (an ancestor never
   overwrites an already built candidate) and inherits `packageRef`/video
   metadata from the candidate that brought it in, because `KnowledgeUnit` does
   not carry it.
5. `deduplicateBlocks`: collapses blocks with an identical `contentHash` under
   different `unitId`s, keeping the first one in input order.
6. `allocateBudget`: fixed bucketing (document/section → rules/patterns →
   ancestors, each one by descending `fusedScore`; ancestors additionally by
   descending `depth`, immediate parent before grandparent) and whole-block
   truncation — never halfway. The first block is included anyway if it alone
   exceeds the budget, and the budget is marked exhausted immediately
   afterwards.
7. `assignCitations`: IDs `S01`, `S02`... in the final inclusion order.
8. `renderContextMarkdown` and `renderContextResult`: render `context.md`
   (Markdown with the six fixed sections) and the `ContextResultDocument`
   object (`snake_case`, a contract already approved in `cli-contract.md`).
9. Return `ContextBundle { markdown, result }`. Writing to disk
   (`writeContextBundle`) happens afterwards, in the infrastructure/CLI layer,
   never inside `assembleContext`.

A `no_results` query from 2.2, or a budget so small that not even the first
block fits, still produces a valid `ContextBundle` explaining the absence of
evidence — never nothing written at all.

## Exact flow of `sync`

1. It creates and persists a `SyncRun` in the `running` state.
2. It reads and validates the complete manifest.
3. If the manifest fails, it records an issue, closes as `failed` and deletes
   no packages.
4. It obtains the model descriptor and the persisted references.
5. For each video, it reads the package and computes a hash over
   documents/versions.
6. If it did not change, it runs `markPackageSeen` with the current run; it
   recomputes neither units nor embeddings.
7. If it changed, it builds units, fragments under the real tokenizer,
   generates embeddings and prepares the complete change.
8. `applyPackage` replaces the package and its derivatives in a single
   transaction.
9. Only after the commit does it publish the change to the vector sink.
10. An isolated failure records an issue; if a valid version existed, it marks
    it seen to preserve it.
11. After a valid manifest it deletes unseen packages.
12. It publishes vector removals and closes the run as `ok` or `partial`.
13. If there were neither indexings nor deletions it returns `no_changes`.

## Current SQLite schema

Version: `1`.

Main tables:

- `schema_meta`;
- `sources`;
- `sync_runs`;
- `video_packages`;
- `source_documents`;
- `knowledge_units`;
- `search_fragments`;
- `embeddings`;
- `sync_issues`.

Virtual table: `fragment_fts`, external-content over `search_fragments`.

Triggers: insert, update and delete keep FTS5 aligned. Package deletions use
cascades and `last_seen_sync_id`. Embeddings include model, version, dimension,
hash and BLOB.

**2.2 added no migration and no table.** The retrieval adapters read the schema
exactly as 2.1 left it. The fragment and document domain identifiers
(`SearchFragmentId`, `DocumentId`) have no column of their own: they are
rebuilt in each adapter out of existing columns
(`knowledge_units.stable_key`, `search_fragments.ordinal`, `sources.name`,
`video_packages.video_id`, `source_documents.kind`). Before proposing to
persist them explicitly, read the full note in `docs/retrieval-design.md` — at
the current scale (~3,000 fragments) it is not needed, and adding a column is a
schema change that requires explicit approval under the project's invariants.

## Implemented CLI

Implemented and announced as available:

```text
auto-youtube-rag init
auto-youtube-rag source add <path> --name <name>
auto-youtube-rag source list
auto-youtube-rag source remove <name>
auto-youtube-rag sync [--source <name>]
auto-youtube-rag status
auto-youtube-rag doctor
auto-youtube-rag retrieve <query> [--depth focused|balanced|deep] \
  [--max-tokens <positive-integer>] [--source <name>] [--out <directory>]
```

`--source` is repeatable. Invalid `--depth` and `--max-tokens` values are
rejected in `parse-command.ts` with usage code `2`, before the application is
instantiated.

```text
auto-youtube-rag rebuild --confirm
```

`rebuild` was implemented in point 4.6 (14 August 2026). **No command of the
contract is left unimplemented.** It deletes the derived index and regenerates
it from the packages on disk; it preserves `sources`, the schema version and
the run history. `--confirm` is mandatory (without it, code `2`) and it does
not accept `--force`.

## Runtime configuration

**This changed in point 4.2 (14 August 2026).** If an old session memory says
that paths are relative to the `cwd`, it is out of date.

Everything lives in a user home, resolved by
`src/infrastructure/config/resolve-paths.ts`, the **only** function that
computes these paths:

```text
~/.auto-youtube-rag/          ← C:\Users\<user>\.auto-youtube-rag\
  index.sqlite                ← the library
  models/                     ← the installed model (~130 MB)
```

Supported variables:

```text
AUTO_YOUTUBE_RAG_HOME        ← moves the whole home
AUTO_YOUTUBE_RAG_MODELS_DIR  ← moves only the model
```

`AUTO_YOUTUBE_RAG_MODEL_CACHE` **no longer exists**: it was renamed to
`AUTO_YOUTUBE_RAG_MODELS_DIR` because the model is installed state, not a cache
that regenerates on its own.

The model is installed with the product, not with npm:

```text
auto-youtube-rag init                    # creates home, database and model
auto-youtube-rag init --from <path>      # copies an already present model
auto-youtube-rag init --skip-model       # database only (CI, no network)
auto-youtube-rag models install [--force] [--from <path>]
auto-youtube-rag models status
```

`models/.install.json` is the installation receipt: it stores the expected size
of each file and makes it possible to tell `absent`, `incomplete` (truncated
download) and `installed` apart without hashing 130 MB.

`npm run models:download` **still exists but is only for benchmarks**
(`benchmarks/embeddings/run.ts`, it writes into `<repo>/.cache/models`). Do not
offer it as a product remedy: it depends on `tsx` and on `benchmarks/`, which
do not exist outside the cloned repository. The repo's `.cache/` is exclusive
benchmark territory; the product never reads it.

The product must not download during `sync`, `doctor` or normal tests. Only
`init` and `models install` use the network, and only when the user invokes
them by name.

## Development and quality commands

```powershell
cd <repo>
node --version
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run format:check
npm.cmd run check
npm.cmd run build
npm.cmd run test:coverage
npm.cmd run test:embedding:smoke
```

In PowerShell it may be necessary to use `npm.cmd`, because the execution
policy can block `npm.ps1`.

`npm run check` skips real inference through the `smoke` pattern. The E5 smoke
is run explicitly and must never depend on the network.

**Do not delete `.gitattributes`.** It pins `* text=auto eol=lf` and has
existed since 14 August 2026 (commit `7ee0a9b`). Without it,
`core.autocrlf=true` on Windows materializes CRLF on every `checkout` and on
every new clone, and `format:check` —part of `npm run check`— fails on files
nobody edited. It is a baffling trap because `git diff` shows **nothing**: git
normalizes line endings when comparing, so only the representation on disk
differs. If one day `format:check` fails on files unrelated to your change,
verify that `.gitattributes` still exists before touching anything else; the
immediate remedy is `npx prettier --write .`, which produces no commit.

## Last known validation

### Final gate of 2.1 (11 August 2026)

- 91 tests passing;
- coverage: 93.90% lines, 81.73% branches, 98.17% functions;
- `npm run build`: passing;
- `npm run check`: passing;
- `npm run test:embedding:smoke`: passing with the local E5;
- clean worktree.

Validation over a temporary copy of the indexable resources of the real
`auto-design` collection:

- 34 videos observed;
- 34 packages persisted;
- 102 documents;
- 2,965 knowledge units;
- 2,967 fragments and embeddings with the real tokenizer;
- second `sync`: 34 unchanged, 0 indexed, `no_changes` state;
- `doctor`: integrity, foreign keys, FTS5, source and model all `ok`;
- SHA-256 digest of the source tree identical before and after.

The copy and its temporary database were deleted after validating.

### Final gate of 2.2 (12 August 2026)

- 151 tests passing (91 inherited from 2.1 + 60 new retrieval ones);
- coverage: 94.66% lines, 84.25% branches, 98.23% functions;
- `npm run build`: passing;
- `npm run check`: passing;
- `npm run test:coverage`: passing;
- `test/e2e/retrieval.e2e.test.ts` passing over real SQLite (not fakes), a
  two-source fixture, without the real E5 model (deterministic embedding by
  keyword, see the file itself);
- clean worktree.

No validation over the real `auto-design` collection with the real E5 model was
run when closing 2.2, by explicit decision of the user. **It is still not run
when closing 2.3** — the same pattern documented below applies, and it is not
an urgent pending item on its own either. If it becomes necessary (for example,
before real evaluations in 3.2, or if a bug appears that only manifests with
real data), the pattern is: copy the collection to a temporary directory,
synchronize with the real model (already cached in `.cache/models`), run
queries from `evals/queries/seed-queries.json` against
`retrieveCandidates`/`assembleContext`, review qualitatively, verify the SHA-256
digest of the source tree before/after, and delete the copy and the temporary
database when finished.

### Final gate of 2.3 (12 August 2026)

- 221 tests passing (151 inherited from 2.1–2.2 + 70 new ones for context
  assembly and the CLI);
- coverage: 95.25% lines, 86.02% branches, 98.43% functions;
- `npm run build`: passing;
- `npm run check`: passing;
- `npm run test:coverage`: passing;
- `test/e2e/context-assembly.e2e.test.ts` passing over real SQLite (not fakes)
  and the real `retrieve` command of the CLI, a two-source fixture with nested
  headings (document → section → subsection) to exercise the expansion to
  ancestors, without the real E5 model (`FakeEmbeddingGenerator`);
- clean worktree.

**Implementation note discovered during the E2E test:** vector search has no
similarity floor (inherited from 2.2), so a "meaningless" query over a
non-empty library still returns `status: "ok"`. The E2E tests `no_results` by
filtering on a non-existent source (`--source ghost-source`), which does empty
the universe of candidates, instead of relying on a query with no apparent
lexical or semantic matches.

**A validation of `retrieve` over the real `auto-design` collection was not run
either.** Same pattern and same criterion as the previous paragraph: it is not
an urgent pending item, and the procedure to follow is the same, adding the
qualitative inspection of the generated `context.md`/`result.json` (is the
bundle readable? do the citations resolve? does the expansion to parents
contribute real context or only noise?) before calibrating budgets at a later
stage.

## Important bugs already fixed

### Unchanged packages deleted by accident

An unchanged package must update `last_seen_sync_id`. That is what
`listPackageRefs` and `markPackageSeen` exist for. Do not remove this operation
and do not go back to deriving "seen" only from replacements.

### The Transformers.js preflight attempted network access

In Transformers.js 4.2, `pipeline()` performs inspections before propagating
`local_files_only`. The adapter configures the local global environment before
creating the pipeline. Keep this sequence, or the smoke may reach for Hugging
Face and produce a null tokenizer.

### Inconsistent Unicode slugs

Manifest and domain must accept the same canonical Unicode form. The real
package `7-estilos-de-diseño-gráfico-que-no-conocías` is the regression. Do not
go back to an ASCII pattern.

### Inverted ancestor order in `allocateBudget` (2.3)

The first draft of `context-assembly-design.md` specified "ascending depth (the
immediate parent before the grandparent)" for breaking ties between ancestor
blocks with the same `fusedScore`. It is a contradiction: `depth` 0 is the root
of the document, so the immediate parent of a deep unit has a **greater**
`depth` than its grandparent, not a smaller one. The `allocate-budget.test.ts`
test caught it immediately while implementing J3. The correct rule —already
applied in code and documentation— is **descending** `depth`. If some old
reference (session memory, comment) says "ascending", it is out of date.

### A single video with a broken schema blocked syncing the whole source

Discovered in M4 (3.2) against the real `auto-design` collection: `sync` used
to process `manifest.videos` with a synchronous `.map()` that threw
`ManifestReadError` on the first invalid entry, aborting the reading of the
whole manifest. A single video with a broken schema field (for example,
`resources.analysis` instead of `resources.rules`, see "Real schema drift"
above) blocked syncing the other 50 videos of the source, including the valid
ones. Fixed on 13 August: `parseManifest` now discards the invalid entry and
reports it as a `ManifestVideoIssue` instead of aborting; only manifest root
failures (root not an object, `videos` not an array, invalid JSON, unreadable
file) remain fatal. Detail in `docs/decisions.md`, section "Per-video tolerant
validation in the manifest". Do not revert to a synchronous `.map()`/`throw`
without recreating this same isolation.

## Mandatory invariants and limits

- Never write, move or delete files of the registered sources.
- Never interpret an unreadable manifest as a mass deletion.
- Never publish vector changes before the SQLite commit.
- Never lose the last valid version because of a partial failure.
- Never allow two `running` runs over the same source: each run deletes the
  packages it did not claim itself, so two overlapping ones leave the source
  empty. Confirmed with a deterministic reproduction on 14 August; the guard
  lives in `recordRun` and must not be weakened.
- Never let a retrieval path disappear silently. If semantic search does not
  take part —because there are no vectors for the active model—
  `VECTORS_STALE` has to be emitted. The vector index must also reload when
  `version` or `dimensions` change, not just `key`: reusing the snapshot
  returns a count greater than zero and cancels that warning.
- Never couple domain or application to SQLite, Transformers.js or Node paths.
- Never persist `.env`, cookies, headers, temporary URLs or raw metadata.
- Never download the model implicitly during tests or normal use.
- Never change the schema, the model/dimension or a native dependency without
  approval.
- **Always commit with the `/git-commit` skill, never with a hand-written
  `git commit`.** This is not a style preference: the skill analyzes the real
  diff to choose type and scope. Detail in `docs/development.md` → "How to
  commit".
- Never push, rewrite history or force anything without an explicit request:
  `main` is published in a private repository and pushing makes it visible
  outside this machine.
- Before each commit run at least the specific test, `npm run check` and
  `npm run build`, according to the risk.
- Preserve JSON on stdout and stderr for progress.

Invariants specific to retrieval (2.2):

- Never compare `rawScore` between the text path and the vector path: BM25 has
  no bound and cosine lives in `0..1`. Only positions (ranks) are compared.
- Never assume vector search has a similarity floor: it always returns
  something if the library (after filters) is not empty.
- Never let `sync` and `retrieveCandidates` use different instances of the
  vector index: they must share the same one so that a published change and a
  query never see different vectors.

Invariants specific to context assembly (2.3):

- Never cut a `ContextUnitBlock` in half: it is either included whole or
  omitted whole, so that no `[S0N]` citation ends up pointing at truncated
  text.
- Never reserve or skip a citation number for a block omitted for budget
  reasons: `assignCitations` only walks `allocation.included`.
- Never tokenize again during assembly: `tokenCount`/`estimatedTokens` are
  already persisted from indexing (2.1); neither `assembleContext` nor its pure
  policies open the embedding model.
- Never fabricate a cause in `limitations`/"Coverage and limitations": only
  real signals are described (`warnings` from `RetrievalOutcome`,
  `budgetExhausted`, `omittedCount`, applied filters).
- Never let an ancestor overwrite a block that already arrived as a candidate:
  `origin: "candidate"` always wins over `"ancestor"` for the same `unitId`.
- Never write the bundle outside `<outputDir>/<request_id>/`; a repeated
  `request_id` fails explicitly (`WriteContextBundleError`) instead of mixing
  files.
- Never validate `--depth`/`--max-tokens` as an operational failure (code `1`):
  they are usage errors (code `2`), validated in `parse-command.ts`.

## Point 2.2 completed — hybrid retrieval

Blocks F–H are completed (contracts, adapters, orchestration). Full detail in
`docs/retrieval-design.md`.

Decisions closed during 2.2 that should not be reopened without cause:

- Fusion: weighted RRF (`k = 60`, `wText = wVector = 1.0`) behind
  `FusionStrategy`, replaceable for the 3.2 calibration. The cascade was
  discarded because it drops hits exclusive to one path without gaining
  performance at this scale.
- `VectorIndexSink` was replaced by `VectorSearchIndex` in `sync` and in the
  application: a single instance (`InMemoryVectorSearchIndex`) receives the
  published changes and serves the queries, so they can never diverge.
- The fragment and document identifiers **are not persisted**; they are pure
  functions of columns that do exist (`fragment:sha256(unitId):ordinal` and
  `document:<source>:<video>:<kind>`). The adapters rebuild them. See the note
  in `retrieval-design.md` before considering a schema change.
- The vector index invalidates its whole snapshot on `apply` instead of
  patching it: `VectorIndexChange` carries neither unit type nor language, and
  a patch would leave new entries impossible to filter.
- Provenance hydration happens **before** deduplicating and diversifying, not
  afterwards as the first draft of the design suggested: `RankedHit` only
  carries `fragmentId`, and neither deduplication by `unitId` nor per-video
  diversity is possible without knowing the provenance.
- **Vector search has no similarity floor.** It is an exhaustive ranking: every
  query over a non-empty library (after filters) returns candidates, even if
  the real similarity is low. `status: "no_results"` only happens if the filter
  leaves the library empty or if both paths fail. A minimum threshold remains
  pending calibration in 3.2.
- 2.2 exposed no CLI surface; `retrieve` was implemented only when closing 2.3
  (see the next section).

Complete validation, including the explicit decision not to run the qualitative
pass over the real collection, in
["Last known validation"](#last-known-validation) → "Final gate of 2.2".

## Point 2.3 completed — context assembly

Blocks I–L are completed (contracts,
expansion/deduplication/budget/citations, rendering, orchestration, CLI). Full
detail in `docs/context-assembly-design.md`.

Decisions closed during 2.3 that should not be reopened without cause (also
recorded in `decisions.md`):

- Fixed bucketing by `unitType`: document/section always to "Highest-relevance
  context", rules/patterns always to "Related rules and patterns", never by
  raw score.
- Expansion ancestors always fall into "Additional relevant context", even if
  the ancestor is itself a relevant rule.
- A single block that alone exceeds the budget is included anyway —the bundle
  is never empty when real evidence exists— and the budget is marked exhausted
  immediately afterwards.
- Deduplication at two levels from the start: by `unitId` (structural) and by
  `contentHash` (identical content under different units).
- `request_id` uses the same ad-hoc generator as `SyncId`, without depending on
  ULID.
- `result.json` uses `snake_case` because it is the already approved wire
  contract; the internal `CitationRecord`/`ContextUnitBlock` stay in
  `camelCase`. `renderContextResult` is the only translation point between the
  two.
- Budgets by depth (`focused` 12k / `balanced` 32k / `deep` 64k) confirmed
  without recalibrating at this point; calibration is left for 3.2.

Context budgets by depth no longer appear as a pending decision in
`decisions.md`: they were confirmed on 12 August 2026.

## Point 2.4 completed — general skill

`skill/SKILL.md` invokes the already complete CLI (`init`,
`source add/list/remove`, `sync`, `retrieve`, `status`, `doctor`) with no
provider-specific logic. `rebuild` is explicitly documented as not yet
available.

Decisions closed during 2.4 that should not be reopened without cause:

- Location: `skill/SKILL.md` at the root of the repo, exactly as the conceptual
  tree of `product-spec.md` already approved (plain `skill/`, without nesting a
  directory named after the project inside it).
- Self-containment: the essential content of the CLI contract (commands, flags,
  exit codes, shape of the JSON receipt, symbolic codes) is embedded directly
  in `SKILL.md`, not referenced by a path relative to `docs/`, because the
  skill must be installable or linkable outside this repository.
- Invocation: the skill assumes `auto-youtube-rag <command>` as the canonical
  form (same as `cli-contract.md`) and documents
  `node "<path-to-repo>/dist/main.js" <command>` as a fallback, because the
  binary is not globally linked (`npm link`) in this development environment.
- Verification: **"cold"**, with a subagent with no prior context of the
  project (it read neither `docs/` nor `src/`, only the text of the skill)
  against a temporary copy of two real `auto-design` videos — never against the
  original collection. Two runs:
  1. The first run revealed a critical gap: the skill did not mention `init` as
     a mandatory previous step. Without it, `status`/`doctor`/`source add` fail
     with `ERR_SQLITE_ERROR: unable to open database file`, a code the skill
     did not explain either. Fixed by adding `init` as step 1 of the
     recommended flow.
  2. The second run, with the corrected skill, completed the whole flow
     (`init` → `status` → `source add` → `sync` → `retrieve` → reading
     `context.md`/`result.json` → citation with provenance) without inspecting
     `src/` or inventing syntax, and confirmed that the `[S0N]` citations
     resolve correctly against `result.json`. It found two minor ambiguities,
     already corrected in the text: (a) the same `ERR_SQLITE_ERROR` can also be
     caused by an inconsistent `cwd` between invocations, not only by a missing
     `init` — the default database was relative to `<cwd>/.auto-youtube-rag/`
     **when this was written**; point 4.2 moved it to the user home and
     replaced that raw error with `LIBRARY_NOT_FOUND`, so this finding no
     longer applies; (b) `source add` expects the path to the `videos/` folder
     itself, not to its parent folder, and the receipt's `collection_path` may
     end up one level above that path without that being an error.
  3. **Specific verification on Codex (a real external agent, not a simulated
     one) was not run** — the user explicitly chose to close 2.4 with
     verification on Claude Code only for now. If a Codex-specific problem of
     skill interpretation appears, or before considering the point "verified on
     two providers" in a strict sense, run the same skill from Codex against a
     test collection and report the result.
- No file of `src/`, `docs/cli-contract.md` or `docs/product-spec.md` was
  modified: 2.4 was strictly usage documentation over an already closed CLI.

## Point 3.2 completed — MVP evaluations

Blocks M–O are completed (mechanical Layer A, judged Layer B, calibration and
closure). Design in `docs/eval-design.md`, final report in
`evals/results/2026-08-12/report.md`.

It was, as planned, the first complete validation over the real `auto-design`
collection with the real E5 model (not fixtures or partial copies), using the
procedure already documented in "Last known validation" → the 2.2/2.3 notes.

Decisions and findings closed during 3.2 that should not be reopened without
cause (also recorded in `decisions.md` and in the final report):

- **No hand-labelled ground truth.** It measures in two independent layers:
  mechanical Layer A (verifiable with code, without an agent) and judged Layer
  B (a short rubric answered by the real consuming agent over the already
  assembled bundle). The product's success criterion is broad, cited coverage,
  not a pinpoint match against a list of "correct fragments".
- **Real schema drift in `auto-design`, with a root cause identified outside
  this repository.** The collection grew from 34 to 51 videos; 17 use
  `resources.analysis` instead of `resources.rules`. Investigation after 3.2
  (13 August) against the real repository of the producing skill
  (`youtube-video-context`) found the exact cause: on 2 August that skill
  replaced `rules.json`/schema 1.0 with `analysis.json`/schema 2.0 in a
  deliberate and documented breaking change (commit `aecdde9`, "deja de
  producir un manual de reglas de diseño para producir un análisis general").
  It is not a field rename — the shape of `analysis.json`
  (`topics`/`recommendations`/`assessment`/`evidence_boundary`) is incompatible
  with that of `rules.json`
  (`patterns`/`principle`/`rules`/`avoid`/`acceptanceCriteria`). The 34 "valid"
  videos are the ones generated **before** the pivot; the 17 "broken" ones are
  the ones generated **with the current skill** — it is `auto-youtube-rag` that
  fell behind, not the other way around, and every new video from here on will
  use schema 2.0. Full detail in `docs/decisions.md`, section "`analysis.json`
  support (schema 2.0): implemented and validated".

  **Already resolved (13 August): the "amplifying" half of the problem.**
  Before, a single video entry with a broken schema aborted the reading of
  _the whole_ manifest (`parseManifest` threw on the first invalid video), so
  no video of the source could sync — not even the 34 valid ones.
  `parseManifest` (`manifest-reader.ts`) is now tolerant per video: only root
  failures (root not an object, `videos` not an array, invalid JSON, unreadable
  file) remain fatal; a video entry with an invalid schema or a duplicate
  id/slug is discarded and reported as a `ManifestVideoIssue` in
  `ManifestSnapshot.issues`, without bringing down the rest. `syncSource`
  translates each one into a `SyncIssue`
  (`MANIFEST_ENTRY_SCHEMA_INVALID`/`MANIFEST_ENTRY_DUPLICATE`) and protects any
  previously indexed package of that video from deletion. See
  `docs/decisions.md`, section "Per-video tolerant validation in the manifest",
  and `docs/indexing-design.md`.

  **Still pending: the "substantive" half.** The 17 videos with
  `resources.analysis` are still not indexed — now isolated as an `issue`
  instead of blocking the entire source, but their real content
  (`analysis.json`) still has neither a parser nor a domain model in
  `auto-youtube-rag`. It requires its own design (a new parser, a new snapshot,
  a bucketing decision in `assembleContext`, a decision about supporting both
  schemas or freezing schema 1.0) and explicit approval before implementing —
  it is not solved with a field alias.

- **Apparent precision limited by shared catalogue noise, not by retrieval
  errors.** Most seed queries retrieve from the same subset of videos about
  style/trend catalogues; more depth tends to add more tangential catalogue,
  not more specific content. It is a characteristic of the real corpus; RRF
  has no additional signal today (unit type, topical density) to tell them
  apart.
- **Calibration decision (O1): the defaults are kept unchanged** — RRF
  `k = 60`, `wText = wVector = 1.0`, budgets `focused` 12k / `balanced` 32k /
  `deep` 64k. No signal from M3 or N4 cleared the "clear evidence" bar that
  `eval-design.md` set: the almost universal budget exhaustion is the expected
  behaviour of retrieving a broad universe of candidates; judged coverage
  flattens out from `balanced` to `deep` without any preset performing worse
  than a smaller one; and `es-no-answer-unrelated-topic` —the only case that
  never produces `status: "no_results"`— still gets
  `precision_aparente = 0.00` with no divergence between judges, so the
  product already communicates the absence of relevant content without needing
  a vector similarity floor. Full point-by-point reasoning in
  `docs/decisions.md`, section "Calibration decision (O1, point 3.2)".
- **The 9 discrepancies out of 24 between the Codex and Claude judges (N4)
  point at no product defect.** They are explained by severity of criterion in
  `precision_aparente` (2 cases) or by real ambiguity in
  `evals/rubric-template.md` about "sufficient coverage" and "demonstrated
  multilingual crossover" (7 cases) — no judge misread a bundle or invented
  content. Refining the rubric is noted for a future evaluation pass, not as a
  pending item of 3.2.
- No file of `src/` was modified: 3.2 was strictly measurement over an already
  closed product, and the only decision with the potential to touch code (O1)
  concluded in keeping the defaults.

## Point 4.1 completed — `analysis.json` support (schema 2.0)

The first piece of post-MVP work, closed on 13 August 2026. Blocks P–T complete
(contracts, parser, package reading, knowledge units, SQLite migration,
bucketing, E2E with fixtures and real validation). Full design in
`docs/analysis-schema-design.md`, closing decision in `docs/decisions.md`
section "`analysis.json` support (schema 2.0): implemented and validated".

What changed in `src/`:

- `structuredContentKinds`/`StructuredContentKind` replaces the two
  `rules`/`analysis` booleans of `ManifestResourceSnapshot` with a mandatory
  three-value enum; `manifest-reader.ts` collapses the raw booleans (each one
  optional) and rejects declaring both at once as `MANIFEST_SCHEMA_INVALID`.
- `analysis-json-parser.ts` (`parseAnalysisJson`) is a mirror of
  `rules-json-parser.ts` for schema 2.0
  (`topics`/`recommendations`/`assessment`/`evidence_boundary`).
- `filesystem-package-source-reader.ts` reads `deliverables/analysis.json`
  through an exhaustive `switch` over `structuredContent` (it used to be an
  `if` only for `rules`).
- Four new `KnowledgeUnitType`s: `analysis_document`, `analysis_section`,
  `analysis_topic`, `analysis_recommendation`. `buildAnalysisUnits`
  (`build-knowledge-units.ts`) builds the hierarchy: root → five fixed sections
  (`Summary and lens`, `Evidence boundary`, `Assessment`, the `Topics` header,
  the `Recommendations` header) → searchable
  `analysis_topic`/`analysis_recommendation` under their header.
- `source_documents.kind` in SQLite accepts `'analysis'` (an in-place edit of
  `001-initial.ts`, not an incremental migration — there was no real database
  to preserve).
- `classifyContextSection` (`context-blocks.ts`) adds
  `analysis_document`/`analysis_section`/`analysis_topic` to
  `highest_relevance` and `analysis_recommendation` to `related_rules`, without
  adding a third section to the bundle or touching `cli-contract.md`.
- `rules.json`/schema 1.0 keeps working exactly as before; both schemas are
  supported indefinitely, selected by `structuredContent`, not as versions
  where one replaces the other.

Real validation (block T, not fixtures): a temporary copy of the real
`auto-design` collection (51 videos, 17 with `analysis.json`) synchronized with
the real E5 model. The 51 packages were indexed without a single `issue`;
`doctor` in `ok`; SHA-256 digest of the source tree identical before/after. The
new seed query `es-analysis-neumorphism-accessibility`
(`evals/queries/seed-queries.json`) produced, via `retrieve --depth balanced`,
a real citation (`[S45]`) resolved to an `analysis_topic` unit of the real
video `psyw2_j_5jk`, in the "Highest-relevance context" section, with correct
provenance and a readable `context.md`. The temporary copy was deleted when
finished. `catalog-design` (mentioned in previous designs as a second candidate
real collection) was not used for this validation: its manifest declares no
video with `resources.analysis`.

## Point 4.5 completed — embedding model profile

Closed on 14 August 2026. Design in `docs/model-profile-design.md` (blocks
AA–AD). Origin: E5's `passage:`/`query:` prefixes were applied always, without
exception, and silently degraded any other model — a gap noted while
investigating 4.2, set as front number 1 on 14 August.

What changed in `src/` (see also the inventory section above):

- `model-profile.ts` is born: `EmbeddingModelProfile`, the frozen
  `activeModelProfile`, `modelVersion(profile)` and
  `modelDescriptorOf(profile)`. It imports nothing from outside.
  `"Xenova/multilingual-e5-small"` went from three copies in `src/` to a single
  one.
- The generator and the installer receive the profile by injection, with
  `activeModelProfile` as the default; no product caller
  (`create-application.ts`, `run-cli.ts`) passes an explicit profile.
  `countTokens` and `embedDocuments` share the same prefixing function.
- `model-install-state.ts` receives the profile (or
  `repository`/`requiredFiles`) instead of reading its own module constants.
- Rename: `E5EmbeddingGenerator` → `TransformersEmbeddingGenerator`,
  `E5ModelInstaller` → `TransformersModelInstaller`, along with their files and
  types. The values of the public error codes did not change.

**The highest-risk decision:** the prefix policy takes part in `modelVersion`,
so turning the prefixes off some day invalidates and reindexes automatically by
design, but with the active profile the `version` literal did not move a single
character (`"Xenova/multilingual-e5-small@main:q8"`), pinned with a regression
test. Validated against the real binary (not only tests): over a temporary copy
of 3 real `auto-design` videos already synchronized with the code prior to 4.5,
`sync` with the new code returned `status: "no_changes"`, `packagesIndexed: 0`;
`retrieve` showed neither `VECTORS_STALE` nor any other warning; `doctor`
reported the six checks in `ok`; the SHA-256 digest of the source tree was
identical before and after. The copy and the temporary database were deleted
when finished.

A collateral finding, noted in `docs/decisions.md`, not a pending item:
`parseManifest` rejects a `manifest.json` with a UTF-8 BOM
(`MANIFEST_JSON_INVALID`) — it appeared because of how PowerShell wrote the
test manifest, and it does not affect the real manifests of the producing
skill.

`skill/SKILL.md` was not touched: nothing observable changed for a consuming
agent. Final state: **325 tests, 0 failures**, `npm run check` and
`npm run build` green, real model smoke green.

## MVP complete — closure and follow-up work

With 3.2 closed, `docs/build.md` marks 2.1, 2.2, 2.3, 2.4, 3.1 and 3.2 at 100%.
The MVP described in `docs/product-spec.md` is complete: incremental indexing,
hybrid retrieval, cited context assembly, the `retrieve` command, a portable
skill for agents, functional tests and a two-layer evaluation over the real
collection.

After the MVP, six more points were closed: 4.1 (`analysis.json`), 4.2
(installation), 4.3 (`sync` safety and performance), 4.4 (stale vector
warning), 4.5 (embedding model profile and prefix policy) and 4.6 (the
`rebuild --confirm` command). The first five originated in cold verification
runs or in the investigation of their findings; 4.6 came from the priority
order the user set on 14 August.

### Priority order set by the user on 14 August 2026

This order is already decided. **Do not ask about it again**; if the user
changes their mind, they will say so.

~~1. **Hardcoded E5 prefixes.**~~ **Closed on 14 August 2026 as point 4.5.**
`passage:` and `query:` are no longer applied unconditionally:
`EmbeddingModelProfile.inputPrefixes` makes them an explicit piece of data
(`null` = no prefix), injectable into the generator and the installer with the
active profile as the default. The prefix policy takes part in `modelVersion`,
so a future policy change triggers automatic reindexing; with the active
profile nothing changed today and nothing was reindexed (validated against the
real binary). Detail in `docs/decisions.md`, section "Model profile and prefix
policy", and in `docs/model-profile-design.md`.

~~1. **Sorting fragments by length before batching.**~~ **Closed on 14 August
2026 without writing code.** It is inert with the `batchSize = 1` that 4.3
adopted: the padding it attacks only exists inside a batch of two or more, and
`defaultBatchSize` is 1 with no product caller overriding it. Besides,
`embedDocuments` is called per package, so the sortable universe would be the
fragments of one video, not the benchmark's corpus. And 4.3's own measurement
already said so: 1.93x against 2.27x for batch 1 — it was not an improvement
over batch 1, it was the alternative that batch 1 beat. Detail in
`docs/decisions.md`, section "Sorting fragments by length: measured and
rejected".

~~2. **`rebuild --confirm` command.**~~ **Closed on 14 August 2026 as point
4.6.** See `docs/rebuild-design.md`.

**The priority order of 14 August is exhausted.** The only thing still standing
from that list is what the user explicitly left for the end (below). After
that: **MCP, web interface and support for web page packages**, out of scope
since the original `product-spec.md`.

Explicitly **for the end**, by decision of the user:

- **Verify `skill/SKILL.md` from a real Codex.** It is the only unchecked box
  in `docs/build.md` (point 2.4). It gains value because the skill changed a
  lot on 13 and 14 August —it was split into three files, the installation
  model changed, it gained `models`, `--force` and new codes— and all of that
  was validated cold **only with Claude agents**. It requires the user to run
  it: a Claude agent cannot invoke Codex.
- ~~**Repository hygiene.**~~ **Done on 14 August 2026.** The three dead local
  branches were deleted and `.cache/` was cleaned from 2110 MB down to **129
  MB**: `sqlite-client-benchmark` (995 MB), `vector-benchmark` (418 MB) and the
  three models the benchmark discarded (`multilingual-e5-base`,
  `jina-embeddings-v2-base-es`, `paraphrase-multilingual-MiniLM-L12-v2`, 568 MB
  together) are gone. **`Xenova/multilingual-e5-small` was deliberately
  kept**: it is the only local copy of the active model, the one
  `test:embedding:smoke` requires and the one `test:install:smoke` and
  `models install --from` adopt to validate against the real binary without
  downloading 129 MB over the network. Both smokes were verified green after
  cleaning. If it is ever missing, `npm run models:download` restores it.

Earlier fronts that still lack evidence justifying them, and that are not in
the order above:

~~- Minimum vector similarity floor.~~ **Resolved on 14 August 2026 as point
4.7, in a different form than expected.** The evidence appeared while testing
the real library; the cosine was measured over 24 queries and `LOW_RELEVANCE`
is emitted below `0.84`. **The warning informs, it does not filter**: a floor
that discards candidates is still discarded, just as in 2.2 and 3.2. See
`docs/low-relevance-design.md`.

- A topical density signal so that RRF can tell specific content from
  tangential catalogue (a 3.2 finding, not a bug).
- Refine `evals/rubric-template.md` on the two ambiguity points from N4.

## Point 4.7 completed — low-relevance warning

Closed on 14 August 2026. Design in `docs/low-relevance-design.md`.

What it solves: vector search is an exhaustive ranking with no floor, so every
query over a non-empty library returns candidates. Asking the design collection
about diabetes symptoms gave `status: "ok"`, 31,982 tokens and `warnings: []`.
The product had the signal and did not communicate it.

What changed in `src/`:

- `retrieval-thresholds.ts`: `defaultLowRelevanceCosine = 0.84`, with the table
  of measurements that justifies it written right beside it.
- `retrieveCandidates` emits `LOW_RELEVANCE` when the best cosine of the vector
  path falls below the floor, and reports that cosine in
  `metrics.topVectorSimilarity` **on every query** (`null` if the path did not
  run).
- `informationalWarningCodes` (`retrieval-results.ts`) separates informational
  warnings from degradations; `run-cli.ts` only degrades to `partial` because
  of the latter.
- `metrics.top_vector_similarity` in the bundle contract.

**Three things worth not reopening without reading the design:**

1. **`fusedScore` cannot measure relevance.** RRF assigns `1/(k + rank)`: it
   encodes position, not similarity. The first candidate of a perfect query and
   that of an absurd one receive the same value. That is why the cosine is read
   **before** fusing.
2. **The threshold was measured, not chosen.** 24 queries classified by hand:
   in-domain 0.8657–0.9012; uncovered technical ones 0.8428–0.8600;
   out-of-domain 0.8149–0.8389. No overlap, but with margins of thousandths,
   and calibrated over **one** design collection in Spanish.
3. **The warning informs and does not filter**, precisely because of that
   fragility. A floor that discards candidates is still discarded, just as in
   2.2 and 3.2.

The fine margin is not theoretical: the first real run after implementing it
measured **0.8399** against the floor of 0.84. One ten-thousandth more and it
would not have warned. That is why the number is always reported, so that the
consuming agent —which by design is the only brain— judges with its own
criterion instead of inheriting the threshold.

**Known limitation:** the judgement uses only the vector cosine, so an exact
lexical match with a low cosine would be a false positive. Bounded because the
warning does not filter, but the criterion does not cover it.

Final state: **352 tests, 0 failures**, verified against the real binary over
the 51-video library.

## Point 4.6 completed — `rebuild --confirm` command

Closed on 14 August 2026. Design in `docs/rebuild-design.md` (blocks AE–AH).

What it solves: `sync` is incremental and `unchanged()` only compares the
package hash and the model identity. A different batch size —the reindexing
that 4.3 left as "recommended but not mandatory" with no way to exercise it—, a
new `parser_version` or a change in fragmentation leave the library
inconsistent while `doctor` keeps saying `ok`.

What changed in `src/`:

- `IndexStore.purgeDerivedIndex()`: deletes `video_packages` and, through the
  cascades and triggers that already existed, everything derived. The `SELECT`
  of active runs and the `DELETE` share a `BEGIN IMMEDIATE`, just like
  `recordRun`. **No schema migration.**
- `rebuild-index.ts` (`rebuildIndex`): purges, publishes the vector removal and
  re-synchronizes each source with the injected `sync` function — the same
  wiring `application.sync` uses, so it can never index differently. It walks
  the sources **sequentially**, not with `Promise.all`.
- `Application.rebuildIndex()`, `kind: "rebuild"` in `parse-command.ts`, the
  `library_and_model` entry in `command-requirements.ts` and the branch in
  `run-cli.ts`.

Decisions not worth reopening without cause: it regenerates instead of only
purging; it preserves `sources` and the run history; the guard goes inside the
purge; it does not accept `--force`; only the purge is transactional. Full
reasoning in `docs/decisions.md`, section "`rebuild` regenerates instead of
only purging (point 4.6)".

**The defect AH2 found, which is worth remembering.** The design claimed the
in-memory vector index would invalidate itself, because it already does so in
`apply`. That is false: the purge deletes via SQL and SQL publishes nothing, so
a rebuild that ends with no packages left the index serving phantom vectors — 2
measured over a library with zero embeddings. It is the same defect as 4.4
arriving by a new route. `rebuildIndex` now publishes a `remove_packages` after
the commit of the purge. **If you touch the purge, keep that publication.**

**Validated against the real binary**, not only with tests: a temporary copy of
3 real `auto-design` videos (two with `rules.json`, one with `analysis.json`),
the real E5 model. `rebuild --confirm` left the SHA-256 digests of units,
fragments **and vectors** bit-for-bit identical to the previous ones —with
batch 1 the embedding is deterministic over real data too—, preserved the run
history, and `doctor` stayed in `ok` with `retrieve` showing no warning at all.
With a `running` run injected, the guard rejected the command without deleting
anything. Corrupting a derived fragment by hand: `sync` answered `no_changes`
and left it intact, `rebuild` repaired it. Source tree digest identical before
and after; the temporary copy and database were deleted when finished. Detail
in `docs/build.md`.

Final state: **342 tests, 0 failures**, `npm run check` and `npm run build`
green.

## Recommended first turn for the next agent

1. Confirm that `git status --short` is empty and review the latest commits.
   The branch is `main` and it has a private remote: **do not push without an
   explicit request**.
2. Run `npm.cmd run check` and `npm.cmd run build`. The reference at the
   closure of point 4.6, on 14 August: **342 tests, 0 failures**.
3. Read the documents of the reading order, including the post-MVP designs:
   `install-design.md`, `sync-safety-design.md`, `model-profile-design.md` and
   `rebuild-design.md`.
4. **There is no decided front waiting.** The priority order the user set on 14
   August is exhausted: its two points were closed that same day (4.6 the
   second one; the first one, with no code, because it was inert). What is left
   is what the user explicitly left for the end —verifying the skill from a
   real Codex, which requires the user to run it, and repository hygiene— and
   after that the work out of scope of the original `product-spec.md`. **Ask
   before choosing**: here it is appropriate.
5. Propose a design and a fine-grained checklist **before** implementing,
   following the pattern of `retrieval-design.md` / `install-design.md` /
   `sync-safety-design.md` / `rebuild-design.md`, and wait for explicit
   approval.
6. Implement in slices of at most five files per task. **Commit with the
   `/git-commit` skill**, never by hand — see `docs/development.md` → "How to
   commit".

### What the 13 and 14 August session taught

Five real defects were fixed in two days. **Four of the five appeared while
verifying something else**, not while looking for them. The method is worth
repeating:

- **Verify against the real binary, not only with tests.** `doctor` gave a
  false health report in the face of a truncated model and the whole suite
  passed; it was only seen by running the command with a deliberately damaged
  file.
- **Distrust "everything is fine".** Three of the five defects had the same
  shape: the system answered correctly while something was broken. The citation
  marker passed every mechanical verification and produced false provenance;
  `retrieve` returned `ok` with semantic search dead; `doctor` said `ok` with a
  corrupt model.
- **One fix can be masked by another.** `VECTORS_STALE` could never fire
  because the index reused a stale snapshot. Two defects covered each other.
- **Measure before optimizing.** Parallelism seemed obvious and yielded 1.00x;
  batch size seemed like nothing and yielded 2.23x. The first embedding
  measurement was misleading because it used short texts instead of real
  content.
- **Subagents that report what they did not fix are worth gold.** The stale
  snapshot gap was found by a subagent that decided it was out of its scope and
  said so, instead of touching it silently.

Suggested prompt for resuming:

> Pick `auto-youtube-rag` back up from `docs/agent-handoff.md`. First verify
> the state of the repository and the tests. The MVP is complete, and so are
> points 4.1 to 4.6: `analysis.json` support, installation with a user home,
> `sync` safety with a concurrency guard, the stale vector warning, the
> embedding model profile (prefixes are no longer hardcoded) and the
> `rebuild --confirm` command. There are no pending decisions and no command
> of the contract left unimplemented, and the priority order of 14 August is
> exhausted. Ask me what to prioritize before starting, and propose a design
> and a checklist before implementing anything.

## Recent relevant history

The most recent commits.

```text
7ee0a9b build(repo): check every file out with LF so format:check survives a checkout
9107f02 docs(model-profile): close point 4.5 documentation
eb12309 fix(embeddings): name the loaded model from the profile, not a literal
53545b8 refactor(embeddings): rename E5ModelInstaller to TransformersModelInstaller
faa04fb refactor(embeddings): rename E5EmbeddingGenerator to TransformersEmbeddingGenerator
a0ce77f refactor(embeddings): installer consumes the profile, duplicates die
dc2e580 refactor(install): model-install-state accepts the embedding profile
e3b7d5d feat(embeddings): apply prefix policy from the injected model profile
8738de5 docs(embeddings): design the model profile and its task checklist
4291bbf feat(embeddings): add model profile as single source of truth
be4ebff docs(handoff): hand over with the priority order and what the session taught
73b59aa fix(sync): close the cross-process race by locking before the check
fb2b02c docs(retrieval): close point 4.4 and teach the skill VECTORS_STALE
d7b5df0 fix(vector-search): reload the snapshot when the model version changes
09e5175 test(e2e): reproduce VECTORS_STALE with real SQLite and document the code
1f64f4b feat(retrieval): warn VECTORS_STALE when the active model has no vectors
fb56413 refactor(vector-search): return the loaded vector count from load()
ca4829d docs(development): require /git-commit for every commit
e5061fa docs(handoff): record the move to main and the private remote
700f938 docs(sync): close point 4.3 and teach the skill sync --force
def5de1 feat(cli): add sync --force and doctor STALE_SYNC_RUN
fb98d58 perf(embeddings): default embedding batch size to 1
5bc1538 fix(sync): reject a second concurrent running sync per source
c2e8a7a docs(sync): confirm the cross-deletion bug and design the guard
3969d2b fix(context): open each block with its citation id in the heading
d304054 docs(install): close point 4.2 and record the cold-run findings
4bb6de3 test(install): smoke the real --from adoption against the repo cache
116801a docs(skill): describe the user home, init installer and models commands
033d746 fix(doctor): detect an incomplete model instead of trusting the directory
0235184 docs(cli-contract): document models install/status, init flags and 4.2 codes
8c633b6 feat(cli): translate raw SQLite integrity failures for sync and retrieve
70ad16c test(cli): pin the sync-never-discovers-63-missing-models regression
ef06e93 feat(cli): preflight requirements once, before building the Application
9598b67 feat(cli): add the command requirements table
c9b4ee4 fix(doctor): point the missing-model check at models install
```

## Definition of a successful handoff

An agent is correctly situated when it can explain, before writing code:

1. why the querying agent is the only LLM;
2. why `KnowledgeUnit` and `SearchFragment` exist separately;
3. how `sync` preserves valid packages in the face of failures;
4. why source packages are strictly read-only;
5. how SQLite, FTS5 and embeddings are kept aligned;
6. why the initial vector search will be exact and replaceable;
7. what each point delivered — 2.1 indexing, 2.2 retrieval, 2.3 assembly and
   `retrieve`, 2.4 the portable skill, 3.2 the two-layer evaluation — and why
   the complete MVP is already closed, not in progress;
8. why weighted RRF is the fusion baseline, and why 3.2 decided to keep
   `k`/`wText`/`wVector` unchanged instead of calibrating them;
9. why vector search has no similarity floor, what that implies both for
   `status: "no_results"` in 2.2 and in the 2.3 bundle, and why 3.2 concluded
   that this gap neither blocks the consuming agent (Layer B compensates for
   it) nor justifies adding a threshold yet;
10. why the fragment and document identifiers are derived instead of persisted,
    and which adapters depend on that reconstruction;
11. why `assembleContext` needs `getUnits` in addition to `getAncestors`
    (`KnowledgeUnit` does not carry video/document metadata, and each
    candidate's `parentId` must be known before it can be walked);
12. why 3.2 measures in two independent layers with no labelled ground truth
    (mechanical Layer A, Layer B judged by Codex and Claude over the same
    bundle), and why none of the 9 discrepancies between judges points at a
    product defect — they are rubric ambiguity, not reading ambiguity;
13. which fronts remain as follow-up work, in what order the user prioritized
    them on 14 August, and which ones were explicitly left for the end;
14. why an ancestor block always falls into "Additional relevant context" even
    if it is itself a relevant rule, and why a budget never cuts a block in
    half;
15. why the library and the model live in the user's home and not in the
    working directory, and why the model is installed state and not a cache;
16. why two concurrent `sync` runs over one source left it empty, why the guard
    goes in `recordRun` under `BEGIN IMMEDIATE` instead of a unique index, and
    why no run is abandoned automatically;
17. why `VECTORS_STALE` needs three conditions and not one, and why the vector
    index must reload when `version` changes, not just `key`;
18. why parallelizing the indexing is useless —ONNX already saturates the
    cores— and why lowering the batch to 1 yielded 2.23x;
19. what `rebuild` detects that `sync` cannot detect, why it regenerates
    instead of only purging, why it preserves the run history, and why its
    concurrency guard lives inside the purge transaction;
20. why sorting fragments by length stopped making sense as soon as the batch
    dropped to 1, and why that was closed without writing code.
