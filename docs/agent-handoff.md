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

## Flujo exacto de `retrieveCandidates` (2.2)

1. Normalizar y validar la consulta ya llegó resuelta como `RetrievalQuery`
   (el dominio ya garantiza texto no vacío, NFC, ≤1000 caracteres).
2. Lanzar `textIndex.search` y (`embeddingGenerator.describe` +
   `embeddingGenerator.embedQuery` + `vectorIndex.load` +
   `vectorIndex.search`) en paralelo.
3. Si una vía falla, capturar el error, agregar un `RetrievalWarning` con
   código `TEXT_SEARCH_UNAVAILABLE` o `VECTOR_SEARCH_UNAVAILABLE` y continuar
   con hits vacíos de esa vía. Nunca aborta la consulta completa.
4. Fusionar ambas listas de `RankedHit` con `FusionStrategy` (RRF ponderado
   por defecto) → `FusedHit[]`.
5. Hidratar procedencia del conjunto fusionado completo con
   `knowledgeRepository.getFragmentProvenance` en un solo lote (acotado por
   `textCandidates + vectorCandidates`). Un `FusedHit` sin procedencia
   (fragmento borrado justo antes de esta consulta) se descarta.
6. `selectCandidates`: deduplicar por `unitId` (conserva el de mejor score),
   diversificar con `maxPerVideo`, truncar a `fusedResults`.
7. Devolver `RetrievalOutcome` con `status` (`"ok"` o `"no_results"`),
   `candidates`, `metrics` y `warnings`.

`vectorIndex.load()` devuelve la cantidad de vectores disponibles para el
modelo activo (cambiado el 14 de agosto de 2026; antes era `Promise<void>`).
Si la carga no falló, ese conteo es cero y la vía textual **sí** encontró
hits, se emite el warning `VECTORS_STALE`: la biblioteca tiene contenido pero
ningún vector para el modelo activo. Las tres condiciones juntas importan —
ver `docs/decisions.md`, sección "Degradación silenciosa de la vía
vectorial".

**Gotcha que sigue vigente:** la búsqueda vectorial no tiene piso de similitud
(ver la sección de decisiones de 2.2 más abajo). `status: "ok"` con candidatos
de relevancia real baja es un resultado válido y esperado, no un bug. 2.3 lo
heredó explícitamente: `assembleContext` nunca filtra por umbral de similitud,
sólo por lo que el presupuesto de tokens permite incluir. El E2E de 2.3 lo
confirma: el único camino confiable a `status: "no_results"` es un filtro que
deja vacío el universo de candidatos (por ejemplo, `--source` de una fuente
inexistente), no una consulta "sin sentido" sobre una biblioteca no vacía.

## Flujo exacto de `assembleContext` (2.3)

1. Llamar `retrieveCandidates(request.query)` → `RetrievalOutcome`.
2. Recolectar el conjunto único de `unitId` de `outcome.candidates`.
3. Llamar `knowledgeRepository.getUnits(unitIds)` y
   `knowledgeRepository.getAncestors(unitIds)` en paralelo — dos lotes, no una
   consulta por candidato. `getUnits` recupera el `parentId` de cada
   candidato (`RetrievalCandidate` no lo transporta); `getAncestors` resuelve
   el conjunto plano deduplicado de ancestros alcanzables.
4. `expandToAncestors`: camina `parentId` desde cada candidato hacia la raíz,
   construye un `ContextUnitBlock` por `unitId` único (un ancestro nunca pisa
   un candidato ya construido) y hereda `packageRef`/metadata de video del
   candidato que lo trajo, porque `KnowledgeUnit` no la transporta.
5. `deduplicateBlocks`: colapsa bloques con `contentHash` idéntico bajo
   `unitId` distintos, conservando el primero en orden de entrada.
6. `allocateBudget`: bucketing fijo (documento/sección → reglas/patrones →
   ancestros, cada uno por `fusedScore` descendente; ancestros además por
   `depth` descendente, padre inmediato antes que abuelo) y truncamiento
   entero — nunca a la mitad. El primer bloque se incluye igual si por sí
   solo excede el presupuesto, y el presupuesto se marca agotado de
   inmediato.
7. `assignCitations`: IDs `S01`, `S02`... en el orden final de inclusión.
8. `renderContextMarkdown` y `renderContextResult`: redactan `context.md`
   (Markdown con las seis secciones fijas) y el objeto `ContextResultDocument`
   (`snake_case`, contrato ya aprobado en `cli-contract.md`).
9. Devolver `ContextBundle { markdown, result }`. La escritura a disco
   (`writeContextBundle`) ocurre después, en la capa de infraestructura/CLI,
   nunca dentro de `assembleContext`.

Una consulta `no_results` de 2.2, o un presupuesto tan chico que no cabe ni el
primer bloque, produce igual un `ContextBundle` válido explicando la ausencia
de evidencia — nunca nada sin escribir.

## Flujo exacto de `sync`

1. Crea y persiste un `SyncRun` en estado `running`.
2. Lee y valida el manifest completo.
3. Si el manifest falla, registra issue, cierra `failed` y no elimina paquetes.
4. Obtiene descriptor de modelo y referencias persistidas.
5. Por cada video, lee el paquete y calcula hash sobre documentos/versiones.
6. Si no cambió, ejecuta `markPackageSeen` con el run actual; no recalcula
   unidades ni embeddings.
7. Si cambió, construye unidades, fragmenta bajo el tokenizador real, genera
   embeddings y prepara el cambio completo.
8. `applyPackage` reemplaza paquete y derivados en una única transacción.
9. Sólo después del commit publica el cambio al sink vectorial.
10. Un fallo aislado registra issue; si existía una versión válida, la marca
    vista para conservarla.
11. Después de un manifest válido elimina paquetes no vistos.
12. Publica removals vectoriales y cierra el run como `ok` o `partial`.
13. Si no hubo indexaciones ni borrados devuelve `no_changes`.

## Esquema SQLite actual

Versión: `1`.

Tablas principales:

- `schema_meta`;
- `sources`;
- `sync_runs`;
- `video_packages`;
- `source_documents`;
- `knowledge_units`;
- `search_fragments`;
- `embeddings`;
- `sync_issues`.

Tabla virtual: `fragment_fts`, external-content sobre `search_fragments`.

Triggers: insert, update y delete mantienen FTS5 alineado. Las eliminaciones de
paquetes usan cascadas y `last_seen_sync_id`. Los embeddings incluyen modelo,
versión, dimensión, hash y BLOB.

**2.2 no agregó ninguna migración ni tabla.** Los adaptadores de recuperación
leen el esquema tal cual quedó en 2.1. Los identificadores de dominio de
fragmento y documento (`SearchFragmentId`, `DocumentId`) no tienen columna
propia: se reconstruyen en cada adaptador a partir de columnas existentes
(`knowledge_units.stable_key`, `search_fragments.ordinal`, `sources.name`,
`video_packages.video_id`, `source_documents.kind`). Antes de proponer
persistirlos explícitamente, leer la nota completa en
`docs/retrieval-design.md` — a la escala actual (~3.000 fragmentos) no hace
falta, y agregar una columna es un cambio de esquema que requiere aprobación
explícita según los invariantes del proyecto.

## CLI implementada

Implementado y anunciado como disponible:

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

`--source` es repetible. `--depth` y `--max-tokens` inválidos se rechazan en
`parse-command.ts` con código de uso `2`, antes de instanciar la aplicación.

```text
auto-youtube-rag rebuild --confirm
```

`rebuild` se implementó en el punto 4.6 (14 de agosto de 2026). **Ya no queda
ningún comando del contrato sin implementar.** Borra el índice derivado y lo
regenera desde los paquetes en disco; preserva `sources`, la versión de
esquema y el historial de runs. `--confirm` es obligatorio (sin él, código
`2`) y no acepta `--force`.

## Configuración de ejecución

**Cambió en el punto 4.2 (14 de agosto de 2026).** Si una memoria de sesión
vieja dice que las rutas son relativas al `cwd`, está desactualizada.

Todo vive en un hogar de usuario, resuelto por
`src/infrastructure/config/resolve-paths.ts`, la **única** función que
calcula estas rutas:

```text
~/.auto-youtube-rag/          ← C:\Users\<usuario>\.auto-youtube-rag\
  index.sqlite                ← la biblioteca
  models/                     ← el modelo instalado (~130 MB)
```

Variables admitidas:

```text
AUTO_YOUTUBE_RAG_HOME        ← mueve el hogar entero
AUTO_YOUTUBE_RAG_MODELS_DIR  ← mueve sólo el modelo
```

`AUTO_YOUTUBE_RAG_MODEL_CACHE` **ya no existe**: se renombró a
`AUTO_YOUTUBE_RAG_MODELS_DIR` porque el modelo es estado instalado, no un
caché que se regenere solo.

El modelo se instala con el producto, no con npm:

```text
auto-youtube-rag init                    # crea hogar, base y modelo
auto-youtube-rag init --from <ruta>      # copia un modelo ya presente
auto-youtube-rag init --skip-model       # sólo la base (CI, sin red)
auto-youtube-rag models install [--force] [--from <ruta>]
auto-youtube-rag models status
```

`models/.install.json` es el recibo de instalación: guarda el tamaño esperado
de cada archivo y permite distinguir `absent`, `incomplete` (descarga
truncada) e `installed` sin hashear 130 MB.

`npm run models:download` **sigue existiendo pero es sólo para benchmarks**
(`benchmarks/embeddings/run.ts`, escribe en `<repo>/.cache/models`). No lo
ofrezcas como remedio de producto: depende de `tsx` y de `benchmarks/`, que
no existen fuera del repositorio clonado. El `.cache/` del repo es territorio
exclusivo de benchmarks; el producto no lo lee nunca.

El producto no debe descargar durante `sync`, `doctor` ni tests normales.
Sólo `init` y `models install` usan la red, y sólo cuando el usuario los
invoca por nombre.

## Comandos de desarrollo y calidad

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

En PowerShell puede ser necesario usar `npm.cmd` porque la política de ejecución
puede bloquear `npm.ps1`.

`npm run check` omite la inferencia real mediante el patrón `smoke`. El smoke de
E5 se ejecuta explícitamente y nunca debe depender de red.

**No borres `.gitattributes`.** Fija `* text=auto eol=lf` y existe desde el
14 de agosto de 2026 (commit `7ee0a9b`). Sin él, `core.autocrlf=true` en
Windows materializa CRLF en cada `checkout` y en cada clon nuevo, y
`format:check` —parte de `npm run check`— falla sobre archivos que nadie
editó. Es una trampa desconcertante porque `git diff` no muestra **nada**:
git normaliza los finales de línea al comparar, así que sólo difiere la
representación en disco. Si algún día `format:check` falla sobre archivos
ajenos a tu cambio, verificá que `.gitattributes` siga existiendo antes de
tocar cualquier otra cosa; el remedio inmediato es `npx prettier --write .`,
que no produce ningún commit.

## Última validación conocida

### Puerta final de 2.1 (11 de agosto de 2026)

- 91 tests aprobados;
- cobertura: 93,90% líneas, 81,73% ramas, 98,17% funciones;
- `npm run build`: aprobado;
- `npm run check`: aprobado;
- `npm run test:embedding:smoke`: aprobado con E5 local;
- worktree limpio.

Validación sobre una copia temporal de los recursos indexables de la colección
real `auto-design`:

- 34 videos observados;
- 34 paquetes persistidos;
- 102 documentos;
- 2.965 unidades de conocimiento;
- 2.967 fragmentos y embeddings con el tokenizador real;
- segundo `sync`: 34 unchanged, 0 indexed, estado `no_changes`;
- `doctor`: integridad, foreign keys, FTS5, fuente y modelo en `ok`;
- digest SHA-256 del árbol fuente idéntico antes y después.

La copia y su base temporal fueron eliminadas tras validar.

### Puerta final de 2.2 (12 de agosto de 2026)

- 151 tests aprobados (91 heredados de 2.1 + 60 nuevos de recuperación);
- cobertura: 94,66% líneas, 84,25% ramas, 98,23% funciones;
- `npm run build`: aprobado;
- `npm run check`: aprobado;
- `npm run test:coverage`: aprobado;
- `test/e2e/retrieval.e2e.test.ts` aprobado sobre SQLite real (no fakes),
  fixture de dos fuentes, sin modelo E5 real (embedding determinista por
  palabra clave, ver el propio archivo);
- worktree limpio.

No se ejecutó una validación sobre la colección real `auto-design` con el
modelo E5 real al cerrar 2.2, por decisión explícita del usuario. **Sigue sin
ejecutarse al cerrar 2.3** — el mismo patrón documentado abajo aplica, y
tampoco es un pendiente urgente por sí solo. Si se necesita (por ejemplo,
antes de evaluaciones reales en 3.2, o si aparece un bug que sólo se
manifiesta con datos reales), el patrón es: copiar la colección a un
directorio temporal, sincronizar con el modelo real (ya cacheado en
`.cache/models`), correr consultas de `evals/queries/seed-queries.json` contra
`retrieveCandidates`/`assembleContext`, revisar cualitativamente, verificar el
digest SHA-256 del árbol fuente antes/después, y borrar la copia y la base
temporal al terminar.

### Puerta final de 2.3 (12 de agosto de 2026)

- 221 tests aprobados (151 heredados de 2.1–2.2 + 70 nuevos de ensamblado de
  contexto y CLI);
- cobertura: 95,25% líneas, 86,02% ramas, 98,43% funciones;
- `npm run build`: aprobado;
- `npm run check`: aprobado;
- `npm run test:coverage`: aprobado;
- `test/e2e/context-assembly.e2e.test.ts` aprobado sobre SQLite real (no
  fakes) y el comando `retrieve` real de la CLI, fixture de dos fuentes con
  encabezados anidados (documento → sección → subsección) para ejercer la
  expansión a ancestros, sin modelo E5 real (`FakeEmbeddingGenerator`);
- worktree limpio.

**Nota de implementación descubierta durante la prueba E2E:** la búsqueda
vectorial no tiene piso de similitud (heredado de 2.2), así que una consulta
"sin sentido" sobre una biblioteca no vacía igual devuelve `status: "ok"`. El
E2E prueba `no_results` filtrando por una fuente inexistente (`--source
ghost-source`), que sí vacía el universo de candidatos, en vez de depender de
una consulta sin coincidencias léxicas ni semánticas aparentes.

**Tampoco se ejecutó una validación de `retrieve` sobre la colección real
`auto-design`.** Mismo patrón y mismo criterio que el párrafo anterior: no es
un pendiente urgente, y el procedimiento a seguir es el mismo, agregando la
inspección cualitativa de `context.md`/`result.json` generados (¿el bundle es
legible?, ¿las citas resuelven?, ¿la expansión a padres aporta contexto real
o sólo ruido?) antes de calibrar presupuestos en una etapa posterior.

## Bugs importantes ya corregidos

### Paquetes sin cambios eliminados accidentalmente

Un paquete unchanged debe actualizar `last_seen_sync_id`. Para eso existen
`listPackageRefs` y `markPackageSeen`. No elimines esta operación ni vuelvas a
derivar “visto” sólo desde reemplazos.

### Preflight de Transformers.js intentaba red

En Transformers.js 4.2, `pipeline()` realiza inspecciones antes de propagar
`local_files_only`. El adaptador configura el entorno global local antes de
crear el pipeline. Mantener esta secuencia o el smoke puede intentar Hugging
Face y producir tokenizer nulo.

### Slugs Unicode inconsistentes

Manifest y dominio deben aceptar la misma forma canónica Unicode. El paquete
real `7-estilos-de-diseño-gráfico-que-no-conocías` es la regresión. No volver a
un patrón ASCII.

### Orden de ancestros invertido en `allocateBudget` (2.3)

El primer borrador de `context-assembly-design.md` especificaba "depth
ascendente (el padre inmediato antes que el abuelo)" para desempatar bloques
de ancestro con el mismo `fusedScore`. Es una contradicción: `depth` 0 es la
raíz del documento, así que el padre inmediato de una unidad profunda tiene
`depth` **mayor** que su abuelo, no menor. El test de `allocate-budget.test.ts`
lo capturó de inmediato al implementar J3. La regla correcta —ya aplicada en
código y documentación— es `depth` **descendente**. Si alguna referencia
vieja (memoria de sesión, comentario) dice "ascendente", está desactualizada.

### Un solo video con esquema roto bloqueaba la sincronización de toda la fuente

Descubierto en M4 (3.2) contra la colección real `auto-design`: `sync`
antes procesaba `manifest.videos` con un `.map()` síncrono que tiraba
`ManifestReadError` en la primera entrada inválida, abortando la lectura del
manifest completo. Un solo video con un campo de esquema roto (por ejemplo,
`resources.analysis` en vez de `resources.rules`, ver "Deriva de esquema
real" más arriba) bloqueaba la sincronización de los otros 50 videos de la
fuente, incluidos los válidos. Corregido el 13 de agosto: `parseManifest`
ahora descarta la entrada inválida y la reporta como `ManifestVideoIssue`
en vez de abortar; sólo los fallos de raíz del manifest (root no objeto,
`videos` no array, JSON inválido, archivo no legible) siguen siendo
fatales. Detalle en `docs/decisions.md`, sección "Validación tolerante por
video en el manifest". No revertir a un `.map()`/`throw` síncrono sin
recrear este mismo aislamiento.

## Invariantes y límites obligatorios

- Nunca escribir, mover ni eliminar archivos de las fuentes registradas.
- Nunca interpretar un manifest ilegible como eliminación masiva.
- Nunca publicar cambios vectoriales antes del commit SQLite.
- Nunca perder la última versión válida por un fallo parcial.
- Nunca permitir dos runs `running` sobre la misma fuente: cada run borra los
  paquetes que no reclamó él, así que dos solapados dejan la fuente vacía.
  Confirmado con reproducción determinista el 14 de agosto; el guard vive en
  `recordRun` y no debe debilitarse.
- Nunca dejar que una vía de recuperación desaparezca en silencio. Si la
  búsqueda semántica no participa —porque no hay vectores para el modelo
  activo— tiene que emitirse `VECTORS_STALE`. El índice vectorial además debe
  recargar cuando cambia `version` o `dimensions`, no sólo `key`: reutilizar
  el snapshot devuelve un conteo mayor que cero y anula ese warning.
- Nunca acoplar dominio o aplicación a SQLite, Transformers.js o Node paths.
- Nunca persistir `.env`, cookies, headers, URLs temporales ni metadata cruda.
- Nunca descargar el modelo implícitamente durante tests o uso normal.
- Nunca cambiar esquema, modelo/dimensión o dependencia nativa sin aprobación.
- **Commitear siempre con la skill `/git-commit`, nunca con `git commit` a
  mano.** No es una preferencia de estilo: la skill analiza el diff real para
  elegir tipo y alcance. Detalle en `docs/development.md` → "Cómo commitear".
- Nunca pushear, reescribir historial ni forzar sin pedido explícito: `main`
  está publicada en un repositorio privado y el push la hace visible fuera
  de esta máquina.
- Antes de cada commit ejecutar al menos el test específico, `npm run check` y
  `npm run build` según el riesgo.
- Preservar stdout JSON y stderr para progreso.

Invariantes propias de recuperación (2.2):

- Nunca comparar `rawScore` entre la vía textual y la vectorial: BM25 no tiene
  cota y coseno vive en `0..1`. Sólo se comparan posiciones (rangos).
- Nunca asumir que la búsqueda vectorial tiene un piso de similitud: siempre
  devuelve algo si la biblioteca (tras filtros) no está vacía.
- Nunca dejar que `sync` y `retrieveCandidates` usen instancias distintas del
  índice vectorial: deben compartir la misma para que un cambio publicado y una
  consulta nunca vean vectores diferentes.

Invariantes propias de ensamblado de contexto (2.3):

- Nunca cortar un `ContextUnitBlock` a la mitad: se incluye completo o se
  omite entero, para que ninguna cita `[S0N]` quede apuntando a texto
  truncado.
- Nunca reservar ni saltar un número de cita para un bloque omitido por
  presupuesto: `assignCitations` sólo recorre `allocation.included`.
- Nunca volver a tokenizar en el ensamblado: `tokenCount`/`estimatedTokens`
  ya están persistidos desde la indexación (2.1); ni `assembleContext` ni sus
  políticas puras abren el modelo de embeddings.
- Nunca fabricar una causa en `limitations`/"Coverage and limitations": sólo
  se describen señales reales (`warnings` de `RetrievalOutcome`,
  `budgetExhausted`, `omittedCount`, filtros aplicados).
- Nunca dejar que un ancestro pise un bloque que ya llegó como candidato:
  `origin: "candidate"` siempre gana sobre `"ancestor"` para el mismo
  `unitId`.
- Nunca escribir el bundle fuera de `<outputDir>/<request_id>/`; un
  `request_id` repetido falla explícito (`WriteContextBundleError`) en vez de
  mezclar archivos.
- Nunca validar `--depth`/`--max-tokens` como fallo operativo (código `1`):
  son errores de uso (código `2`), validados en `parse-command.ts`.

## Punto 2.2 completado — recuperación híbrida

Bloques F–H están completados (contratos, adaptadores, orquestación). Detalle
completo en `docs/retrieval-design.md`.

Decisiones cerradas durante 2.2 que no deben reabrirse sin motivo:

- Fusión: RRF ponderado (`k = 60`, `wText = wVector = 1.0`) detrás de
  `FusionStrategy`, sustituible para la calibración de 3.2. Se descartó la
  cascada porque descarta hits exclusivos de una vía sin ganar rendimiento a
  esta escala.
- `VectorIndexSink` fue reemplazado por `VectorSearchIndex` en `sync` y en la
  aplicación: una sola instancia (`InMemoryVectorSearchIndex`) recibe los
  cambios publicados y sirve las consultas, así que nunca pueden divergir.
- Los identificadores de fragmento y documento **no se persisten**; son
  funciones puras de columnas que sí existen (`fragment:sha256(unitId):ordinal`
  y `document:<source>:<video>:<kind>`). Los adaptadores los reconstruyen. Ver
  la nota en `retrieval-design.md` antes de considerar un cambio de esquema.
- El índice vectorial invalida su snapshot completo en `apply` en vez de
  parchear: `VectorIndexChange` no transporta tipo de unidad ni idioma, y un
  parche dejaría entradas nuevas imposibles de filtrar.
- La hidratación de procedencia ocurre **antes** de deduplicar y diversificar,
  no después como sugería el primer borrador del diseño: `RankedHit` sólo lleva
  `fragmentId`, y ni la deduplicación por `unitId` ni la diversidad por video
  son posibles sin conocer la procedencia.
- **La búsqueda vectorial no tiene piso de similitud.** Es un ranking
  exhaustivo: toda consulta sobre una biblioteca no vacía (tras filtros)
  devuelve candidatos, aunque la similitud real sea baja. `status: "no_results"`
  sólo ocurre si el filtro deja la biblioteca vacía o si ambas vías fallan. Un
  umbral mínimo queda pendiente de calibración en 3.2.
- 2.2 no exponía superficie de CLI; `retrieve` se implementó recién al cerrar
  2.3 (ver la sección siguiente).

Validación completa, incluida la decisión explícita de no correr la pasada
cualitativa sobre la colección real, en
["Última validación conocida"](#última-validación-conocida) → "Puerta final de
2.2".

## Punto 2.3 completado — ensamblado de contexto

Bloques I–L están completados (contratos, expansión/deduplicación/presupuesto/
citas, redacción, orquestación, CLI). Detalle completo en
`docs/context-assembly-design.md`.

Decisiones cerradas durante 2.3 que no deben reabrirse sin motivo (registradas
también en `decisions.md`):

- Bucketing fijo por `unitType`: documento/sección siempre a "Highest-relevance
  context", reglas/patrones siempre a "Related rules and patterns", nunca por
  puntaje puro.
- Los ancestros de expansión caen siempre en "Additional relevant context",
  aunque el ancestro sea en sí una regla relevante.
- Un bloque único que por sí solo excede el presupuesto se incluye igual —el
  bundle nunca queda vacío habiendo evidencia real— y el presupuesto se marca
  agotado de inmediato después.
- Deduplicación en dos niveles desde el inicio: por `unitId` (estructural) y
  por `contentHash` (contenido idéntico bajo unidades distintas).
- `request_id` usa el mismo generador ad-hoc que `SyncId`, sin depender de
  ULID.
- `result.json` usa `snake_case` porque es el contrato de cable ya aprobado;
  `CitationRecord`/`ContextUnitBlock` internos siguen en `camelCase`.
  `renderContextResult` es el único punto de traducción entre ambos.
- Presupuestos por profundidad (`focused` 12k / `balanced` 32k / `deep` 64k)
  confirmados sin recalibrar en este punto; la calibración queda para 3.2.

Presupuestos de contexto por profundidad ya no aparece como pendiente de
decisión en `decisions.md`: quedó confirmado el 12 de agosto de 2026.

## Punto 2.4 completado — skill general

`skill/SKILL.md` invoca la CLI ya completa (`init`, `source add/list/remove`,
`sync`, `retrieve`, `status`, `doctor`) sin lógica específica de proveedor.
`rebuild` se documenta explícitamente como no disponible todavía.

Decisiones cerradas durante 2.4 que no deben reabrirse sin motivo:

- Ubicación: `skill/SKILL.md` en la raíz del repo, tal como ya aprobaba el
  árbol conceptual de `product-spec.md` (`skill/` a secas, sin anidar un
  directorio con el nombre del proyecto adentro).
- Autocontención: el contenido esencial del contrato de CLI (comandos, flags,
  exit codes, forma del recibo JSON, códigos simbólicos) está embebido
  directamente en `SKILL.md`, no referenciado por ruta relativa a `docs/`,
  porque la skill debe poder instalarse o enlazarse fuera de este
  repositorio.
- Invocación: la skill asume `auto-youtube-rag <comando>` como forma
  canónica (igual que `cli-contract.md`) y documenta `node
"<ruta-al-repo>/dist/main.js" <comando>` como respaldo, porque el binario
  no está enlazado globalmente (`npm link`) en este entorno de desarrollo.
- Verificación: **"en frío"**, con un subagente sin contexto previo del
  proyecto (no leyó `docs/` ni `src/`, sólo el texto de la skill) contra una
  copia temporal de dos videos reales de `auto-design` — nunca contra la
  colección original. Dos corridas:
  1. La primera corrida reveló un hueco crítico: la skill no mencionaba
     `init` como paso previo obligatorio. Sin él, `status`/`doctor`/
     `source add` fallan con `ERR_SQLITE_ERROR: unable to open database
file`, un código que la skill tampoco explicaba. Corregido agregando
     `init` como paso 1 del flujo recomendado.
  2. La segunda corrida, con la skill corregida, completó el flujo completo
     (`init` → `status` → `source add` → `sync` → `retrieve` → lectura de
     `context.md`/`result.json` → cita con procedencia) sin inspeccionar
     `src/` ni inventar sintaxis, y confirmó que las citas `[S0N]` resuelven
     correctamente contra `result.json`. Encontró dos ambigüedades menores,
     ya corregidas en el texto: (a) el mismo `ERR_SQLITE_ERROR` también
     puede deberse a un `cwd` inconsistente entre invocaciones, no sólo a
     `init` faltante — la base de datos por defecto era relativa a
     `<cwd>/.auto-youtube-rag/` **cuando se escribió esto**; el punto 4.2 la
     movió al hogar de usuario y reemplazó ese error crudo por
     `LIBRARY_NOT_FOUND`, así que este hallazgo ya no aplica; (b) `source
add` espera la ruta a la
     carpeta `videos/` en sí, no a su carpeta padre, y el `collection_path`
     del recibo puede quedar un nivel arriba de esa ruta sin que eso sea un
     error.
  3. **Verificación específica en Codex (agente externo real, no simulado)
     no se ejecutó** — el usuario eligió explícitamente cerrar 2.4 con sólo
     verificación en Claude Code por ahora. Si aparece un problema de
     interpretación de la skill específico de Codex, o antes de considerar
     el punto "verificado en dos proveedores" en un sentido estricto, correr
     la misma skill desde Codex contra una colección de prueba y reportar
     resultado.
- No se modificó ningún archivo de `src/`, `docs/cli-contract.md` ni
  `docs/product-spec.md`: 2.4 fue estrictamente documentación de uso sobre
  una CLI ya cerrada.

## Punto 3.2 completado — evaluaciones del MVP

Bloques M–O están completados (Capa A mecánica, Capa B juzgada, calibración
y cierre). Diseño en `docs/eval-design.md`, reporte final en
`evals/results/2026-08-12/report.md`.

Fue, según lo previsto, la primera validación completa sobre la colección
real `auto-design` con el modelo E5 real (no fixtures ni copias parciales),
usando el procedimiento ya documentado en "Última validación conocida" →
notas de 2.2/2.3.

Decisiones y hallazgos cerrados durante 3.2 que no deben reabrirse sin
motivo (registrados también en `decisions.md` y en el reporte final):

- **Sin ground truth etiquetado a mano.** Mide en dos capas independientes:
  Capa A mecánica (verificable con código, sin agente) y Capa B juzgada
  (rúbrica corta respondida por el agente consumidor real sobre el bundle ya
  ensamblado). El criterio de éxito del producto es cobertura amplia y
  citada, no coincidencia puntual contra una lista de "fragmentos
  correctos".
- **Deriva de esquema real en `auto-design`, con causa raíz identificada
  fuera de este repositorio.** La colección creció de 34 a 51 videos; 17
  usan `resources.analysis` en vez de `resources.rules`. Investigación
  posterior a 3.2 (13 de agosto) contra el repositorio real de la skill
  productora (`youtube-video-context`) encontró la causa exacta: el 2 de
  agosto esa skill reemplazó `rules.json`/schema 1.0 por
  `analysis.json`/schema 2.0 en un breaking change deliberado y documentado
  (commit `aecdde9`, "deja de producir un manual de reglas de diseño para
  producir un análisis general"). No es un rename de campo — la forma de
  `analysis.json` (`topics`/`recommendations`/`assessment`/
  `evidence_boundary`) es incompatible con la de `rules.json`
  (`patterns`/`principle`/`rules`/`avoid`/`acceptanceCriteria`). Los 34
  videos "válidos" son los generados **antes** del pivot; los 17 "rotos" son
  los generados **con la skill actual** — es `auto-youtube-rag` el que
  quedó atrás, no al revés, y todo video nuevo de acá en adelante va a usar
  schema 2.0. Detalle completo en `docs/decisions.md`, sección "Pendientes
  de decisión" → "Soporte de `analysis.json` (schema 2.0)".

  **Ya resuelto (13 de agosto): la mitad "amplificadora" del problema.**
  Antes, una sola entrada de video con esquema roto abortaba la lectura de
  _todo_ el manifest (`parseManifest` tiraba en el primer video inválido),
  así que ningún video de la fuente podía sincronizar — ni siquiera los 34
  válidos. `parseManifest` (`manifest-reader.ts`) ahora es tolerante por
  video: sólo los fallos de raíz (root no objeto, `videos` no array, JSON
  inválido, archivo no legible) siguen siendo fatales; una entrada de video
  con esquema inválido o un id/slug duplicado se descarta y se reporta como
  `ManifestVideoIssue` en `ManifestSnapshot.issues`, sin tumbar el resto.
  `syncSource` traduce cada una en un `SyncIssue`
  (`MANIFEST_ENTRY_SCHEMA_INVALID`/`MANIFEST_ENTRY_DUPLICATE`) y protege de
  borrado cualquier paquete previamente indexado de ese video. Ver
  `docs/decisions.md`, sección "Validación tolerante por video en el
  manifest", y `docs/indexing-design.md`.

  **Todavía pendiente: la mitad "de fondo".** Los 17 videos con
  `resources.analysis` siguen sin indexarse — ahora aislados como `issue`
  en vez de bloquear la fuente entera, pero su contenido real
  (`analysis.json`) sigue sin tener parser ni modelo de dominio en
  `auto-youtube-rag`. Requiere diseño propio (parser nuevo, snapshot nuevo,
  decisión de bucketing en `assembleContext`, decisión sobre sostener ambos
  esquemas o congelar schema 1.0) y aprobación explícita antes de
  implementar — no se resuelve con un alias de campo.

- **Precisión aparente limitada por ruido de catálogo compartido, no por
  errores de recuperación.** La mayoría de consultas semilla recupera del
  mismo subconjunto de videos sobre catálogos de estilos/tendencias; más
  profundidad tiende a sumar más catálogo tangencial, no más contenido
  específico. Es una característica del corpus real; RRF no tiene hoy una
  señal adicional (tipo de unidad, densidad temática) para distinguirlo.
- **Decisión de calibración (O1): se mantienen los defaults sin cambios** —
  RRF `k = 60`, `wText = wVector = 1.0`, presupuestos `focused` 12k /
  `balanced` 32k / `deep` 64k. Ninguna señal de M3 o N4 cruzó la barra de
  "evidencia clara" que fijaba `eval-design.md`: el agotamiento de
  presupuesto casi universal es el comportamiento esperado de recuperar un
  universo amplio de candidatos; la cobertura juzgada se aplana de
  `balanced` a `deep` sin que ningún preset rinda peor que uno menor; y
  `es-no-answer-unrelated-topic` —el único caso que nunca produce
  `status: "no_results"`— igual obtiene `precision_aparente = 0.00` sin
  divergencia entre jueces, así que el producto ya comunica la ausencia de
  contenido relevante sin necesitar un piso de similitud vectorial.
  Razonamiento completo, punto por punto, en `docs/decisions.md`, sección
  "Decisión de calibración (O1, punto 3.2)".
- **Las 9 discrepancias de 24 entre los jueces Codex y Claude (N4) no
  señalan ningún defecto del producto.** Se explican por severidad de
  criterio en `precision_aparente` (2 casos) o por ambigüedad real en
  `evals/rubric-template.md` sobre "cobertura suficiente" y "cruce
  multilingüe demostrado" (7 casos) — ningún juez leyó mal un bundle ni
  inventó contenido. Afinar la rúbrica queda anotado para una futura pasada
  de evaluación, no como pendiente de 3.2.
- No se modificó ningún archivo de `src/`: 3.2 fue estrictamente medición
  sobre un producto ya cerrado, y la única decisión con potencial de tocar
  código (O1) concluyó en mantener los defaults.

## Punto 4.1 completado — soporte de `analysis.json` (schema 2.0)

Primer trabajo posterior al MVP, cerrado el 13 de agosto de 2026. Bloques
P–T completos (contratos, parser, lectura de paquete, unidades de
conocimiento, migración SQLite, bucketing, E2E con fixtures y validación
real). Diseño completo en `docs/analysis-schema-design.md`, decisión de
cierre en `docs/decisions.md`
sección "Soporte de `analysis.json` (schema 2.0): implementado y
validado".

Qué cambió en `src/`:

- `structuredContentKinds`/`StructuredContentKind` reemplaza los dos
  booleanos `rules`/`analysis` de `ManifestResourceSnapshot` por un enum
  obligatorio de tres valores; `manifest-reader.ts` colapsa los booleanos
  crudos (cada uno opcional) y rechaza declarar ambos a la vez como
  `MANIFEST_SCHEMA_INVALID`.
- `analysis-json-parser.ts` (`parseAnalysisJson`) es un espejo de
  `rules-json-parser.ts` para el schema 2.0
  (`topics`/`recommendations`/`assessment`/`evidence_boundary`).
- `filesystem-package-source-reader.ts` lee `deliverables/analysis.json`
  mediante un `switch` exhaustivo sobre `structuredContent` (antes era un
  `if` sólo para `rules`).
- Cuatro `KnowledgeUnitType` nuevos: `analysis_document`, `analysis_section`,
  `analysis_topic`, `analysis_recommendation`. `buildAnalysisUnits`
  (`build-knowledge-units.ts`) construye la jerarquía: raíz →
  cinco secciones fijas (`Summary and lens`, `Evidence boundary`,
  `Assessment`, cabecera `Topics`, cabecera `Recommendations`) →
  `analysis_topic`/`analysis_recommendation` searchable bajo su cabecera.
- `source_documents.kind` en SQLite acepta `'analysis'` (edición in-place de
  `001-initial.ts`, no una migración incremental — no había ninguna base
  real que preservar).
- `classifyContextSection` (`context-blocks.ts`) suma
  `analysis_document`/`analysis_section`/`analysis_topic` a
  `highest_relevance` y `analysis_recommendation` a `related_rules`, sin
  agregar una tercera sección al bundle ni tocar `cli-contract.md`.
- `rules.json`/schema 1.0 sigue funcionando exactamente igual que antes;
  ambos esquemas se sostienen indefinidamente, seleccionados por
  `structuredContent`, no como versiones donde una reemplaza a la otra.

Validación real (bloque T, no fixtures): copia temporal de la colección
real `auto-design` (51 videos, 17 con `analysis.json`) sincronizada con el
modelo E5 real. Los 51 paquetes se indexaron sin ningún `issue`; `doctor`
en `ok`; digest SHA-256 del árbol fuente idéntico antes/después. La consulta
semilla nueva `es-analysis-neumorphism-accessibility`
(`evals/queries/seed-queries.json`) produjo, vía `retrieve --depth
balanced`, una cita real (`[S45]`) resuelta a una unidad `analysis_topic`
del video real `psyw2_j_5jk`, en la sección "Highest-relevance context", con
procedencia correcta y `context.md` legible. La copia temporal se borró al
terminar. `design-catalog` (mencionada en diseños previos como segunda
colección real candidata; en disco vive como `catalog-design` bajo
`ai-transcripcion/`) no se usó para esta validación: su manifest no declara
ningún video con `resources.analysis`.

## Punto 4.5 completado — perfil de modelo de embeddings

Cerrado el 14 de agosto de 2026. Diseño en `docs/model-profile-design.md`
(bloques AA–AD). Origen: los
prefijos `passage:`/`query:` de E5 se aplicaban siempre, sin excepción, y
degradaban en silencio cualquier otro modelo — hueco anotado al investigar
4.2, fijado como frente número 1 el 14 de agosto.

Qué cambió en `src/` (ver también la sección de inventario más arriba):

- Nace `model-profile.ts`: `EmbeddingModelProfile`, `activeModelProfile`
  congelado, `modelVersion(profile)` y `modelDescriptorOf(profile)`. No
  importa nada de fuera. `"Xenova/multilingual-e5-small"` pasó de tres
  copias en `src/` a una sola.
- El generador y el instalador reciben el perfil por inyección, con
  `activeModelProfile` como default; ningún llamador de producto
  (`create-application.ts`, `run-cli.ts`) pasa perfil explícito.
  `countTokens` y `embedDocuments` comparten la misma función de prefijado.
- `model-install-state.ts` recibe el perfil (o `repository`/`requiredFiles`)
  en vez de leer constantes de módulo propias.
- Rename: `E5EmbeddingGenerator` → `TransformersEmbeddingGenerator`,
  `E5ModelInstaller` → `TransformersModelInstaller`, con sus archivos y
  tipos. Los valores de los códigos de error públicos no cambiaron.

**La decisión de mayor riesgo:** la política de prefijos participa de
`modelVersion`, así que apagar los prefijos algún día invalida y reindexa
automáticamente por diseño, pero con el perfil activo el literal de
`version` no se movió un carácter
(`"Xenova/multilingual-e5-small@main:q8"`), fijado con un test de regresión.
Validado contra el binario real (no sólo tests): sobre una copia temporal de
3 videos reales de `auto-design` ya sincronizados con el código anterior a
4.5, `sync` con el código nuevo devolvió `status: "no_changes"`,
`packagesIndexed: 0`; `retrieve` no mostró `VECTORS_STALE` ni ningún otro
warning; `doctor` reportó los seis checks en `ok`; el digest SHA-256 del
árbol fuente fue idéntico antes y después. La copia y la base temporal se
borraron al terminar.

Hallazgo colateral, anotado en `docs/decisions.md`, no un pendiente:
`parseManifest` rechaza un `manifest.json` con BOM UTF-8
(`MANIFEST_JSON_INVALID`) — apareció por cómo PowerShell escribió el
manifest de prueba, no afecta a los manifests reales de la skill productora.

`skill/SKILL.md` no se tocó: nada observable cambió para un agente
consumidor. Estado final: **325 tests, 0 fallos**, `npm run check` y
`npm run build` en verde, smoke real del modelo en verde.

## MVP completo — cierre y trabajo posterior

Con 3.2 cerrado, `docs/build.md` marca 2.1, 2.2, 2.3, 2.4, 3.1 y 3.2 al
100%. El MVP descrito en `docs/product-spec.md` está completo: indexación
incremental, recuperación híbrida, ensamblado de contexto citado, comando
`retrieve`, skill portable para agentes, pruebas funcionales y evaluación en
dos capas sobre la colección real.

Después del MVP se cerraron seis puntos más: 4.1 (`analysis.json`), 4.2
(instalación), 4.3 (seguridad de `sync` y rendimiento), 4.4 (aviso de vectores
obsoletos), 4.5 (perfil de modelo de embeddings y política de prefijos) y 4.6
(el comando `rebuild --confirm`). Los cinco primeros se originaron en corridas
de verificación en frío o en investigación de sus hallazgos; 4.6 vino del
orden de prioridad que el usuario fijó el 14 de agosto.

### Orden de prioridad fijado por el usuario el 14 de agosto de 2026

Este orden ya está decidido. **No vuelvas a preguntarlo**; si el usuario
cambia de idea lo dirá.

~~1. **Prefijos E5 hardcodeados.**~~ **Cerrado el 14 de agosto de 2026 como
punto 4.5.** `passage:` y `query:` ya no se aplican incondicionalmente:
`EmbeddingModelProfile.inputPrefixes` los hace un dato explícito
(`null` = sin prefijo), inyectable en el generador y en el instalador con el
perfil activo como default. La política de prefijos participa de
`modelVersion`, así que un cambio futuro de política dispara reindexación
automática; con el perfil activo hoy no cambió nada y no se reindexó
(validado contra el binario real). Detalle en `docs/decisions.md`, sección
"Perfil de modelo y política de prefijos", y en `docs/model-profile-design.md`.

~~1. **Ordenar fragmentos por longitud antes de lotear.**~~ **Cerrado el 14 de
agosto de 2026 sin escribir código.** Es inerte con el `batchSize = 1` que
adoptó 4.3: el padding que ataca sólo existe dentro de un lote de dos o más, y
`defaultBatchSize` es 1 sin que ningún llamador de producto lo sobrescriba.
Además `embedDocuments` se llama por paquete, así que el universo ordenable
serían los fragmentos de un video, no el corpus del benchmark. Y la propia
medición de 4.3 ya lo decía: 1,93x contra 2,27x del lote 1 — no era una mejora
sobre el lote 1, era la alternativa que el lote 1 le ganó. Detalle en
`docs/decisions.md`, sección "Ordenar fragmentos por longitud: medido y
descartado".

~~2. **Comando `rebuild --confirm`.**~~ **Cerrado el 14 de agosto de 2026 como
punto 4.6.** Ver `docs/rebuild-design.md`.

**El orden de prioridad del 14 de agosto quedó agotado.** Lo único que sigue
en pie de esa lista es lo que el usuario dejó explícitamente para el final
(abajo). Después de eso: **MCP, interfaz web y soporte de paquetes de páginas
web**, fuera de alcance desde el `product-spec.md` original.

Explícitamente **para el final**, por decisión del usuario:

- **Verificar `skill/SKILL.md` desde Codex real.** Es la única casilla sin
  marcar de `docs/build.md` (punto 2.4). Gana valor porque la skill cambió
  mucho el 13 y 14 de agosto —se dividió en tres archivos, cambió el modelo
  de instalación, sumó `models`, `--force` y códigos nuevos— y todo eso se
  validó en frío **sólo con agentes Claude**. Requiere que lo corra el
  usuario: un agente Claude no puede invocar Codex.
- ~~**Higiene del repositorio.**~~ **Hecha el 14 de agosto de 2026.** Se
  borraron las tres ramas locales muertas y se limpió `.cache/` de 2110 MB a
  **129 MB**: se fueron `sqlite-client-benchmark` (995 MB),
  `vector-benchmark` (418 MB) y los tres modelos que el benchmark descartó
  (`multilingual-e5-base`, `jina-embeddings-v2-base-es`,
  `paraphrase-multilingual-MiniLM-L12-v2`, 568 MB juntos). **Se conservó
  deliberadamente `Xenova/multilingual-e5-small`**: es la única copia local
  del modelo activo, la que exige `test:embedding:smoke` y la que
  `test:install:smoke` y `models install --from` adoptan para validar contra
  el binario real sin bajar 129 MB de red. Ambos smokes se verificaron en
  verde después de limpiar. Si algún día falta, `npm run models:download` lo
  repone.

Frentes anteriores que siguen sin evidencia que los justifique, y que no
están en el orden de arriba:

~~- Piso mínimo de similitud vectorial.~~ **Resuelto el 14 de agosto de 2026
como punto 4.7, en una forma distinta a la prevista.** La evidencia apareció
probando la biblioteca real; se midió el coseno sobre 24 consultas y se
emite `LOW_RELEVANCE` bajo `0.84`. **El aviso informa, no filtra**: un piso
que descarte candidatos se sigue descartando, igual que en 2.2 y 3.2. Ver
`docs/low-relevance-design.md`.

- Señal de densidad temática para que RRF distinga contenido específico de
  catálogo tangencial (hallazgo de 3.2, no un bug).
- Afinar `evals/rubric-template.md` en los dos puntos de ambigüedad de N4.

## Punto 4.7 completado — aviso de baja relevancia

Cerrado el 14 de agosto de 2026. Diseño en `docs/low-relevance-design.md`.

Qué resuelve: la búsqueda vectorial es un ranking exhaustivo sin piso, así que
toda consulta sobre una biblioteca no vacía devuelve candidatos. Preguntarle
por síntomas de diabetes a la colección de diseño daba `status: "ok"`, 31.982
tokens y `warnings: []`. El producto tenía la señal y no la comunicaba.

Qué cambió en `src/`:

- `retrieval-thresholds.ts`: `defaultLowRelevanceCosine = 0.84`, con la tabla
  de mediciones que lo justifica escrita al lado.
- `retrieveCandidates` emite `LOW_RELEVANCE` cuando el mejor coseno de la vía
  vectorial queda bajo el piso, y reporta ese coseno en
  `metrics.topVectorSimilarity` **en toda consulta** (`null` si la vía no
  corrió).
- `informationalWarningCodes` (`retrieval-results.ts`) separa advertencias
  informativas de degradaciones; `run-cli.ts` sólo degrada a `partial` por las
  segundas.
- `metrics.top_vector_similarity` en el contrato del bundle.

**Tres cosas que conviene no reabrir sin leer el diseño:**

1. **`fusedScore` no puede medir relevancia.** RRF asigna `1/(k + rank)`:
   codifica posición, no similitud. El primer candidato de una consulta
   perfecta y el de una absurda reciben el mismo valor. Por eso el coseno se
   lee **antes** de fusionar.
2. **El umbral se midió, no se eligió.** 24 consultas clasificadas a mano: en
   dominio 0,8657–0,9012; técnicas no cubiertas 0,8428–0,8600; fuera de
   dominio 0,8149–0,8389. Sin solapamiento, pero con márgenes de milésimas, y
   calibrado sobre **una** colección de diseño en español.
3. **El aviso informa y no filtra**, justamente por esa fragilidad. Un piso
   que descarte candidatos se sigue descartando, igual que en 2.2 y 3.2.

El margen fino no es teórico: la primera corrida real tras implementarlo midió
**0,8399** contra el piso de 0,84. Una diezmilésima más y no habría avisado.
Por eso el número se reporta siempre, para que el agente consumidor —que por
diseño es el único cerebro— juzgue con su propio criterio en vez de heredar el
umbral.

**Limitación conocida:** el juicio usa sólo el coseno vectorial, así que una
coincidencia léxica exacta con coseno bajo sería un falso positivo. Acotado
porque el aviso no filtra, pero el criterio no lo cubre.

Estado final: **352 tests, 0 fallos**, verificado contra el binario real sobre
la biblioteca de 51 videos.

## Punto 4.6 completado — comando `rebuild --confirm`

Cerrado el 14 de agosto de 2026. Diseño en `docs/rebuild-design.md`
(bloques AE–AH).

Qué resuelve: `sync` es incremental y `unchanged()` sólo compara el hash del
paquete y la identidad del modelo. Un tamaño de lote distinto —la reindexación
que 4.3 dejó "recomendable pero no obligatoria" sin ninguna forma de
ejercerla—, un `parser_version` nuevo o un cambio de fragmentación dejan la
biblioteca inconsistente mientras `doctor` sigue diciendo `ok`.

Qué cambió en `src/`:

- `IndexStore.purgeDerivedIndex()`: borra `video_packages` y, por las cascadas
  y triggers que ya existían, todo lo derivado. El `SELECT` de runs activos y
  el `DELETE` comparten un `BEGIN IMMEDIATE`, igual que `recordRun`. **Sin
  migración de esquema.**
- `rebuild-index.ts` (`rebuildIndex`): purga, publica la remoción vectorial y
  re-sincroniza cada fuente con la función `sync` inyectada — el mismo
  cableado que usa `application.sync`, así que nunca puede indexar distinto.
  Recorre las fuentes **secuencialmente**, no con `Promise.all`.
- `Application.rebuildIndex()`, `kind: "rebuild"` en `parse-command.ts`,
  entrada `library_and_model` en `command-requirements.ts` y la rama en
  `run-cli.ts`.

Decisiones que no conviene reabrir sin motivo: regenera en vez de sólo purgar;
preserva `sources` y el historial de runs; el guard va dentro de la purga; no
acepta `--force`; sólo la purga es transaccional. Razonamiento completo en
`docs/decisions.md`, sección "`rebuild` regenera en vez de sólo purgar (punto
4.6)".

**El defecto que encontró AH2, y que vale recordar.** El diseño afirmaba que
el índice vectorial en memoria se invalidaría solo, porque ya lo hace en
`apply`. Es falso: la purga borra por SQL y SQL no publica nada, así que un
rebuild que termina sin ningún paquete dejaba el índice sirviendo vectores
fantasma — 2 medidos sobre una biblioteca con cero embeddings. Es el mismo
defecto de 4.4 llegando por un camino nuevo. `rebuildIndex` ahora publica un
`remove_packages` después del commit de la purga. **Si tocás la purga, mantené
esa publicación.**

**Validado contra el binario real**, no sólo con tests: copia temporal de 3
videos reales de `auto-design` (dos con `rules.json`, uno con
`analysis.json`), modelo E5 real. `rebuild --confirm` dejó los digests
SHA-256 de unidades, fragmentos **y vectores** idénticos bit a bit a los de
antes —con lote 1 el embedding es determinista también sobre datos reales—,
preservó el historial de runs, y `doctor` quedó en `ok` con `retrieve` sin
ningún warning. Con un run `running` inyectado, el guard rechazó el comando
sin borrar nada. Corrompiendo un fragmento derivado a mano: `sync` respondió
`no_changes` y lo dejó intacto, `rebuild` lo reparó. Digest del árbol fuente
idéntico antes y después; la copia y la base temporales se borraron al
terminar. Detalle en `docs/build.md`.

Estado final: **342 tests, 0 fallos**, `npm run check` y `npm run build` en
verde.

## Primer turno recomendado para el próximo agente

1. Confirmar `git status --short` vacío y revisar los últimos commits.
   La rama es `main` y tiene remoto privado: **no pushees sin pedido
   explícito**.
2. Ejecutar `npm.cmd run check` y `npm.cmd run build`. La referencia al
   cerrar el punto 4.6, el 14 de agosto: **342 tests, 0 fallos**.
3. Leer los documentos del orden de lectura, incluidos los diseños
   posteriores al MVP: `install-design.md`, `sync-safety-design.md`,
   `model-profile-design.md` y `rebuild-design.md`.
4. **No hay un frente decidido esperando.** El orden de prioridad que el
   usuario fijó el 14 de agosto se agotó: sus dos puntos se cerraron ese
   mismo día (4.6 el segundo; el primero, sin código, por inerte). Lo que
   queda es lo que el usuario dejó explícitamente para el final —verificar la
   skill desde Codex real, que requiere que la corra él, e higiene del
   repositorio— y después el trabajo fuera de alcance del `product-spec.md`
   original. **Preguntá antes de elegir**: acá sí corresponde.
5. Proponer diseño y checklist fino **antes** de implementar, siguiendo el
   patrón de `retrieval-design.md` / `install-design.md` /
   `sync-safety-design.md` / `rebuild-design.md`, y esperar aprobación
   explícita.
6. Implementar en cortes de máximo cinco archivos por tarea. **Commitear con
   la skill `/git-commit`**, nunca a mano — ver `docs/development.md` →
   "Cómo commitear".

### Lo que enseñó la sesión del 13 y 14 de agosto

Cinco defectos reales se corrigieron en dos días. **Cuatro de los cinco
aparecieron verificando otra cosa**, no buscándolos. Vale la pena repetir el
método:

- **Verificá contra el binario real, no sólo con tests.** `doctor` daba un
  parte de salud falso ante un modelo truncado y toda la suite pasaba; sólo
  se vio corriendo el comando con un archivo dañado a propósito.
- **Desconfiá del "todo bien".** Tres de los cinco defectos tenían la misma
  forma: el sistema respondía correctamente mientras algo estaba roto. El
  marcador de citas pasaba toda verificación mecánica y producía procedencia
  falsa; `retrieve` devolvía `ok` con la búsqueda semántica muerta; `doctor`
  decía `ok` con el modelo corrupto.
- **Un arreglo puede estar tapado por otro.** `VECTORS_STALE` no podía
  dispararse nunca porque el índice reutilizaba un snapshot obsoleto. Dos
  defectos se cubrían mutuamente.
- **Medí antes de optimizar.** El paralelismo parecía obvio y rindió 1,00x;
  el tamaño de lote no parecía nada y rindió 2,23x. La primera medición del
  embedding fue engañosa por usar textos cortos en vez de contenido real.
- **Los subagentes que reportan lo que no arreglaron valen oro.** El hueco
  del snapshot obsoleto lo encontró un subagente que decidió que estaba
  fuera de su alcance y lo dijo, en vez de tocarlo en silencio.

Prompt sugerido para retomar:

> Retoma `auto-youtube-rag` desde `docs/agent-handoff.md`. Verifica primero
> el estado del repositorio y las pruebas. El MVP está completo, y también
> los puntos 4.1 a 4.6: soporte de `analysis.json`, instalación con hogar de
> usuario, seguridad de `sync` con guard de concurrencia, aviso de vectores
> obsoletos, perfil de modelo de embeddings (prefijos ya no hardcodeados) y
> el comando `rebuild --confirm`. No hay pendientes de decisión ni ningún
> comando del contrato sin implementar, y el orden de prioridad del 14 de
> agosto quedó agotado. Pregúntame qué priorizar antes de empezar, y propone
> diseño y checklist antes de implementar nada.

## Historial reciente relevante

Los commits más recientes.

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

## Definición de éxito del relevo

Un agente está correctamente situado cuando puede explicar, antes de escribir
código:

1. por qué el agente consultante es el único LLM;
2. por qué existen `KnowledgeUnit` y `SearchFragment` separados;
3. cómo `sync` preserva paquetes válidos ante fallos;
4. por qué los paquetes fuente son estrictamente read-only;
5. cómo se mantienen alineados SQLite, FTS5 y embeddings;
6. por qué la búsqueda vectorial inicial será exacta y reemplazable;
7. qué entregó cada punto — 2.1 indexación, 2.2 recuperación, 2.3 ensamblado y
   `retrieve`, 2.4 la skill portable, 3.2 la evaluación en dos capas — y por
   qué el MVP completo ya está cerrado, no en curso;
8. por qué RRF ponderado es el baseline de fusión, y por qué 3.2 decidió
   mantener `k`/`wText`/`wVector` sin cambios en vez de calibrarlos;
9. por qué la búsqueda vectorial no tiene piso de similitud, qué implica eso
   tanto para `status: "no_results"` en 2.2 y en el bundle de 2.3, y por qué
   3.2 concluyó que ese hueco no bloquea al agente consumidor (Capa B lo
   compensa) ni justifica agregar un umbral todavía;
10. por qué los identificadores de fragmento y documento son derivados en vez
    de persistidos, y qué adaptadores dependen de esa reconstrucción;
11. por qué `assembleContext` necesita `getUnits` además de `getAncestors`
    (`KnowledgeUnit` no transporta metadata de video/documento, y hay que
    conocer el `parentId` de cada candidato antes de poder caminarlo);
12. por qué 3.2 mide en dos capas independientes sin ground truth etiquetado
    (Capa A mecánica, Capa B juzgada por Codex y Claude sobre el mismo
    bundle), y por qué ninguna de las 9 discrepancias entre jueces señala un
    defecto del producto — son ambigüedad de la rúbrica, no de lectura;
13. qué frentes quedan como trabajo posterior, en qué orden los priorizó el
    usuario el 14 de agosto, y cuáles quedaron explícitamente para el final;
14. por qué un bloque de ancestro siempre cae en "Additional relevant
    context" aunque sea en sí una regla relevante, y por qué un presupuesto
    nunca corta un bloque a la mitad;
15. por qué la biblioteca y el modelo viven en el hogar del usuario y no en
    el directorio de trabajo, y por qué el modelo es estado instalado y no
    un caché;
16. por qué dos `sync` concurrentes sobre una fuente la dejaban vacía, por
    qué el guard va en `recordRun` bajo `BEGIN IMMEDIATE` en vez de un
    índice único, y por qué no se abandona ningún run automáticamente;
17. por qué `VECTORS_STALE` necesita tres condiciones y no una, y por qué el
    índice vectorial debe recargar al cambiar `version`, no sólo `key`;
18. por qué paralelizar la indexación no sirve —ONNX ya satura los núcleos—
    y por qué bajar el lote a 1 rindió 2,23x;
19. qué detecta `rebuild` que `sync` no puede detectar, por qué regenera en
    vez de sólo purgar, por qué preserva el historial de runs, y por qué su
    guard de concurrencia vive dentro de la transacción de la purga;
20. por qué ordenar fragmentos por longitud dejó de tener sentido en cuanto
    el lote bajó a 1, y por qué eso se cerró sin escribir código.
