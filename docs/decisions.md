# Decision log

## Confirmed

| Topic            | Decision                                                           | Rationale                                                          |
| ---------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| Name             | `auto-youtube-rag`                                                 | Project identity                                                   |
| Execution        | Local only                                                         | Privacy and the absence of external services                       |
| Generative brain | The querying agent                                                 | Avoid duplicating reasoning inside the RAG                         |
| Integration      | General skill + CLI                                                | Portability across providers                                       |
| Executable       | `auto-youtube-rag`                                                 | Explicit, neutral name                                             |
| CLI parser       | Strict `node:util.parseArgs`                                       | Standard Node API, with no extra dependency                        |
| Indexing         | A single `sync` command                                            | Avoid duplicating `index` and `sync`                               |
| CLI retrieval    | The `retrieve` command                                             | It assembles context, not just matches                             |
| Output           | Markdown + JSON bundle                                             | Avoid truncation and allow integration                             |
| Depths           | 12k / 32k / 64k                                                    | Presets adjustable by evaluation                                   |
| Citations        | `[S01]` resolved in the JSON                                       | Compact reading with complete provenance                           |
| Language         | Original content; English keys                                     | Neutrality across providers                                        |
| Process codes    | `0`, `1`, `2` and `130`                                            | Portable convention; detail through JSON codes                     |
| Skills           | One canonical source                                               | Avoid variants for Codex and Claude                                |
| Initial agents   | Codex and Claude                                                   | Minimum required compatibility                                     |
| Language         | Strict TypeScript                                                  | Integrated and supported path for ONNX on Windows                  |
| Toolchain        | TypeScript 6.0.3, ESLint 10, Prettier 3 and `node:test`            | Keep the analysis strict, reproducible and officially supported    |
| Runtime          | Node.js 24.19.0 LTS with ESM                                       | Pin a reproducible base validated locally                          |
| Packaging        | npm + `package-lock.json`                                          | Reproducible installation without another runtime                  |
| Architecture     | Domain + ports and adapters                                        | Replace infrastructure without altering use cases                  |
| Persistence      | SQLite                                                             | Local simplicity and sufficient scale                              |
| SQLite client    | `node:sqlite`                                                      | No native binding, and sufficient in the local benchmark           |
| Text             | SQLite FTS5                                                        | Exact search and search by relevance                               |
| Embeddings       | Multilingual E5 Small `q8`                                         | Best balance in the local benchmark                                |
| Coupling         | Model and DB only in infrastructure                                | Keep the domain and the application replaceable                    |
| Vectors          | SQLite BLOB + exact in-memory index                                | Lower latency in the local benchmark                               |
| Retrieval        | Hybrid and hierarchical                                            | Combine precision with broad coverage                              |
| Fusion           | Weighted RRF behind `FusionStrategy`                               | Combines ranks without comparing scales and keeps exclusive hits   |
| Result           | Broad, cited context                                               | Provide the agent with enough facts                                |
| Sources          | Several registered roots                                           | Unify `auto-design` and `catalog-design`                           |
| Main corpus      | `context.md`                                                       | Self-contained, validated document                                 |
| Rules            | `rules.json`                                                       | Structured source of patterns                                      |
| Metadata         | Filters and provenance                                             | Avoid treating metadata as knowledge                               |
| Transcript       | Optional fallback                                                  | Avoid duplicating VTT and equivalent text                          |
| Images           | References, with no embeddings in the MVP                          | The file name is not semantic                                      |
| MVP scope        | Video packages only                                                | Reduce the initial surface                                         |
| Human UI         | After the MVP                                                      | Validate retrieval for agents first                                |
| Tests            | Throughout development                                             | Detect functional regressions                                      |
| Evals            | On closing the MVP                                                 | Measure quality over the complete flow                             |
| Eval method      | Mechanical metrics + Codex and Claude judgement on the same bundle | No labelled ground truth; the consuming agent is the natural judge |

## Approved indexing design

- Package identity: `(source_name, video_id)`; the slug only locates.
- Broad `KnowledgeUnit` unit kept separate from the searchable `SearchFragment`.
- Metadata persisted through an allowlist; the full yt-dlp output is not stored.
- `rules.json` preserves the document, pattern and child-element hierarchy.
- `sync` applies each package atomically and keeps the last valid version.

## Expected volume

- Start: approximately 40 videos.
- Average growth: approximately 4 videos per day.
- Peaks: up to 10 videos per day.

## Approved embedding model

The initial benchmark over 18 passages and 16 queries left
`multilingual-e5-small` as the MVP model: it obtained `Hit@1 = 1.0` and
`MRR = 1.0`, the same as E5 Base, with 129 MB of cache and an average latency of
11.5 ms against E5 Base's 29 ms. It can be replaced if future evaluations
justify it; that replacement will affect the adapter and the index, not the
domain.

## Approved vector backend

The MVP will persist `float32[384]` vectors as BLOBs in SQLite and will build a
contiguous in-memory index for exact search. In the benchmark it was close to
five times faster than `sqlite-vec`; its additional RAM cost was small for the
initial scale. The `VectorSearchIndex` port makes it possible to replace it
without modifying the domain or the use cases.

## Approved SQLite client

The MVP will use `node:sqlite` on Node.js 24.19.0 LTS. The benchmark against
`better-sqlite3` validated transactions, FTS5, BLOBs, iterators, reopening,
backup and integrity with equivalent results. `node:sqlite` avoids the native
binding and worked with the local configuration that disables npm scripts.

`better-sqlite3` remains only as a development dependency, to reproduce the
benchmark. Data access will stay behind `KnowledgeRepository` and
`TextSearchIndex`, so changing client will not affect the domain.

## Approved toolchain

The repository compiles with `tsc`, runs TypeScript tests with `node:test` and
`tsx`, applies ESLint with typescript-eslint's strict and type-aware
configurations, and uses Prettier as the single formatting authority. `npm run
check` gathers the mandatory fast verifications.

TypeScript is temporarily pinned to 6.0.3. TypeScript 7.0.2 was already
available, but typescript-eslint 8.67.0 declares support only up to TypeScript
lower than 6.1. The upgrade will happen once official compatibility exists,
without affecting the architecture or the product contracts.

## Approved fusion policy

On 11 August 2026 weighted Reciprocal Rank Fusion was approved as the baseline
for hybrid search, with `k = 60` and initial weights `wText = wVector = 1.0`.

`bm25()` returns negative values with no stable bound and cosine similarity
lives in `0..1`; they are not comparable, and normalizing them per batch would
make the ordering depend on which other candidates happened to appear. RRF
combines positions only, is deterministic and keeps the hits that only one of
the two paths finds, which sustains the product's broad-coverage criterion.

The cascade — one path filters and the other reranks — was rejected because it
loses those exclusive hits. At the real scale, running both paths in full has no
relevant cost, so the cascade contributes no performance either.

The strategy stays behind the `FusionStrategy` port, so the weights can be
calibrated, or the strategy replaced, without modifying use cases or adapters.
The detail is in [retrieval-design.md](retrieval-design.md).

## Approved context assembly design

On 12 August 2026 the design decisions of point 2.3 were approved, detailed in
[context-assembly-design.md](context-assembly-design.md):

- Fixed bucketing by `unitType`: document/section units always go to
  "Highest-relevance context" and rules/patterns always to "Related rules and
  patterns", with no mixing by raw score.
- The ancestors produced by hierarchical expansion always fall into "Additional
  relevant context", never into the two preceding sections.
- A single block that on its own exceeds the budget is included anyway — the
  bundle is never empty when real evidence exists — and the budget is marked
  exhausted immediately afterwards.
- Deduplication at two levels: by `unitId` (structural) and by `contentHash`
  (identical content under different units), both implemented from the start of
  2.3.
- `request_id` uses the same ad-hoc generator as `SyncId`
  (`Date.now().toString(36)` + random), without adding a ULID dependency. It is
  independent of `contentHash` deduplication: one names the bundle directory,
  the other collapses repeated content.
- Per-depth budgets confirmed without recalibration: `focused` = 12k,
  `balanced` = 32k, `deep` = 64k estimated tokens.

## Approved evaluation design

On 12 August 2026 the design of point 3.2 was approved, detailed in
[eval-design.md](eval-design.md):

- No hand-labelled relevance ground truth: it is expensive, subjective, and the
  product's success criterion is not a pinpoint match but broad, cited
  coverage.
- Two independent measurement layers: mechanical (citation integrity, coverage,
  status vs. expected `kind`, computable with no agent at all) and judged (a
  short rubric answered by the real consuming agent over the already assembled
  bundle).
- Codex and Claude evaluate exactly the same bundle per query and depth — never
  independent `retrieve` runs per agent — in order to measure the product's
  consistency across providers, not to compare different retrieval
  configurations.
- The grid of RRF weights and per-depth budgets is not swept blindly: they are
  adjusted only if the evidence from 3.2 shows a concrete problem, and the
  change is documented here with that evidence.

## Calibration decision (O1, point 3.2)

On 13 August 2026 the mechanical Layer A (M3,
`evals/results/2026-08-12/layer-a-report.md`) and the judged Layer B (N4,
`evals/results/2026-08-12/report.md`) were reviewed together over the 24 real
bundles from `auto-design`. **Decision: keep the current defaults unchanged** —
RRF with `k = 60`, `wText = wVector = 1.0`, and per-depth budgets
`focused` = 12k, `balanced` = 32k, `deep` = 64k estimated tokens. No sufficient
evidence was found to justify a change, according to the same criterion
`eval-design.md` already set.

Evidence considered, and why it does not clear the "clear evidence" bar:

- **Almost universal budget exhaustion** (100% in `focused` and `balanced`, 88%
  in `deep`, see M3). This is not evidence of badly calibrated budgets: the
  design of 2.2/2.3 deliberately retrieves a broad universe of candidates
  (`fusedResults = 50`) to sustain coverage, so exhausting the budget is the
  expected behaviour, not a symptom of undersizing. `coverage.budget_exhausted`
  exists precisely so that the consuming agent knows there is more evidence
  available than the amount that made it in, not to trigger an automatic token
  increase.
- **Judged coverage (N4) generally improves from `focused` to `balanced` and
  flattens from `balanced` to `deep`** in 5 of the 8 queries with real content
  (`en-concept-visual-hierarchy`, `es-concept-brutalism`,
  `es-paraphrase-saturated-colors`, `es-rules-comparison-brutalism-minimalism`,
  `multilingual-grid-systems`), and does not change at all with depth in
  `es-rare-term-kerning` because the scarcity is the corpus's, not the
  budget's. This pattern is consistent with presets conceived as distinct usage
  profiles (`focused` fast and narrow, `deep` exhaustive), not with a broken
  preset: there is no query where `deep` performs worse than `focused`, nor any
  where `balanced` leaves out content that a larger preset would retrieve under
  a different RRF weighting.
- **`es-no-answer-unrelated-topic` never produces `status: "no_results"`**
  (mechanical divergence at all three depths, inherited from the absence of a
  similarity floor already documented in `retrieval-design.md`). But Layer B
  neutralizes it: both judges, with no divergence, scored
  `precision_aparente = 0.00` and `cobertura_suficiente = 1` at all three
  depths. The consuming agent correctly identifies, by reading the bundle, that
  there is no relevant content — the absence of a similarity floor did not stop
  it from reaching the correct conclusion. This is exactly the case that
  `eval-design.md` left out of scope "except with clear evidence", and here the
  evidence points against adding a threshold: the product already communicates
  the absence of relevant content without one.
- **No data from 3.2 isolates the contribution of the textual path against the
  vector one.** The Layer A metrics do not separate candidates by origin, and
  none of N4's 9 discrepancies is attributed to one path dominating the other
  (see the hypotheses in `report.md`): all nine fall under severity of
  `precision_aparente` or ambiguity of the rubric about "sufficient
  coverage"/"multilingual crossover". There is no signal to move
  `wText`/`wVector` in either direction.

None of N4's 9 Codex/Claude discrepancies points to a product defect — see the
aggregate reading in `report.md`. They are ambiguities of the evaluation
instrument (`evals/rubric-template.md`), which are noted as an improvement for a
future evaluation pass, not as a reason to change code in 3.2.

## Per-video tolerant validation in the manifest

On 13 August 2026 the first half of the schema-drift finding from M4 was
resolved (see `evals/results/2026-08-12/report.md`, "Hallazgos accionables" — 17
of 51 real `auto-design` videos with `resources.analysis` instead of
`resources.rules`): a single video with an invalid schema no longer aborts
reading the whole manifest.

- `parseManifest` (`src/infrastructure/filesystem/manifest-reader.ts`) now
  distinguishes two failure levels: **root structural** ones (the root is not an
  object, `videos` is not an array, invalid JSON, unreadable file) are still
  fatal — there is no list of videos to salvage. **Per-entry** ones (a video
  with an invalid schema field, or a duplicate id/slug) no longer throw
  `ManifestReadError`: they are dropped from the `videos` array and accumulated
  as `ManifestVideoIssue` in the new `ManifestSnapshot.issues` field, with
  best-effort identification of the video (`videoId: VideoId | null`, `null`
  only when `video_id` itself is what failed).
- `syncSource` (`src/application/indexing/sync-source.ts`) translates each
  `ManifestVideoIssue` into a `SyncIssue` (`MANIFEST_ENTRY_SCHEMA_INVALID` or
  `MANIFEST_ENTRY_DUPLICATE`) and counts it in `packagesSeen`/`packagesFailed`,
  just like a per-package indexing failure. When the broken entry still resolves
  to a known `VideoId`, it marks as seen (`markPackageSeen`) any previously
  indexed package of that video **before** the "not seen in this run" deletion
  step — a video that regresses to an invalid schema must never look deleted
  from the collection. A run with at least one such entry finishes as `partial`,
  like any other partial failure already supported.
- Neither the SQLite schema nor the public CLI contract changes. The change is
  entirely within `manifest-reader.ts` and `sync-source.ts`, covered by new
  tests in both test files.

This resolves the amplifying effect (one broken video blocked all 51), not the
underlying finding: the 17 videos with `resources.analysis` stayed isolated as
an `issue` (instead of taking down the whole run) until full `analysis.json`
support was implemented — see "`analysis.json` support (schema 2.0): implemented
and validated" below.

## `analysis.json` support (schema 2.0): implemented and validated

The producing skill `youtube-video-context` replaced `rules.json`/schema 1.0
with `analysis.json`/schema 2.0 on 2 August 2026 (commit `aecdde9` of that
skill's repository, an explicit breaking change: "it stops producing a design
rules manual in order to produce a general analysis"). `auto-youtube-rag` never
supported schema 2.0; the shape of `analysis.json`
(`topics`/`recommendations`/`assessment`/`evidence_boundary`) is not analogous
to that of `rules.json` (`patterns`/`principle`/`problem`/`rules`/`avoid`/
`acceptanceCriteria`), so neither a field alias in the manifest nor reusing
`rules-json-parser.ts` is viable.

On 13 August 2026 the full design was approved in
[analysis-schema-design.md](analysis-schema-design.md) (blocks P–T), with these
decisions:

- **Both schemas are supported indefinitely.** `rules.json`/schema 1.0 is
  neither frozen nor deprecated — the 34 existing `auto-design` videos do not
  regenerate themselves.
- **Bucketing:** `topics`/`analysis_document`/`analysis_section` fall into
  "Highest-relevance context"; `recommendations` falls into "Related rules and
  patterns". The two fixed sections already published in `cli-contract.md` are
  reused without renaming them or adding a third, so as not to break the wire
  contract already consumed by `skill/SKILL.md` and by real agents.
- **SQLite migration:** `001-initial.ts` is edited in place so that the `CHECK`
  on `source_documents.kind` includes `'analysis'` from the origin, instead of
  building an incremental migrator. Confirmed with the user that no real,
  persistent `.auto-youtube-rag/index.sqlite` database exists to preserve —
  `auto-design` and `design-catalog` (the latter another real collection
  generated by the same skill, with a few more videos) are source collections on
  disk, not already-built indexes.
- **Real E2E validation (block T)** against the real videos with
  `analysis.json` from `auto-design` was included in this work, not postponed.

**Implemented and closed on 13 August 2026** — blocks P–T complete. Real
validation (block T) run against a temporary copy of the real `auto-design`
collection (51 videos, including the 17 with `analysis.json`) with the real E5
model:

- all 51 packages were indexed with no `issue` at all (`packagesIndexed: 51`,
  `packagesFailed: 0`) — the 17 videos with `analysis.json` that used to stay
  isolated as an issue are now indexed as first-class citizens;
- `doctor` reported all five checks as `ok`;
- the SHA-256 digest of the copied source tree was identical before and after
  `sync`, confirming that the source is never written to;
- a new seed query (`es-analysis-neumorphism-accessibility` in
  `evals/queries/seed-queries.json`), aimed specifically at content unreachable
  from `rules.json`, produced a real bundle via `retrieve --depth balanced`
  where the citation `[S45]` resolved to a real `analysis_topic` unit
  (`psyw2_j_5jk`, "Neumorphism as a middle ground, and its accessibility
  defense") in the "Highest-relevance context" section, with correct provenance
  and a readable `context.md`;
- the temporary copy was discarded on finishing; the real `auto-design`
  collection was not modified.

`design-catalog` (the second real collection mentioned above) was not validated
explicitly because its manifest declares no video with `resources.analysis` — it
does not exercise this work. It is not an open item: schema 2.0 support does not
depend on that collection in particular.

## Skill split into `SKILL.md` + `skill/references/`

Date: 13 August 2026. Origin: a cold verification run on the Swiss design style,
with a subagent that had no prior context of the project, against the two real
collections (`auto-design`, 51 videos, and `catalog-design`, 12 videos)
registered by direct path, with no copy.

The run finished well — 63 packages indexed, 9 bundles with perfect citation
integrity, sources byte-identical before and after — but it uncovered five gaps
in `skill/SKILL.md`, all of them documentation and none of them code:

1. the database and model cache paths resolve relative to the `cwd`, something
   the skill did not mention; working outside the repository, the first `sync`
   failed with 63 `MODEL_LOAD_FAILED` issues, one per video;
2. that symbolic code was not documented — the skill documented
   `EMBEDDING_MODEL_MISSING`, which is **not a synonym**: the first is emitted by
   the embedding generator during `sync`, the second is a warning about
   degradation of the vector path in `retrieve`;
3. the claim "it works without network" coexisted with the instruction to run
   `npm run models:download`, which does require network, without resolving the
   apparent contradiction;
4. there was no estimate of `sync` duration nor any waiting strategy, which led
   the agent to launch four syncs, two of them concurrent;
5. the skill described packages with `rules.json` only and ordered the agent to
   reject structures lacking it — after point 4.1 that would have made a cold
   agent discard a perfectly valid schema 2.0 collection.

With all five corrected, `SKILL.md` had grown to 283 lines (~14.5 KB), which are
loaded in full every time the skill fires.

**Decision: separate by frequency of use, not by topic.** `SKILL.md` keeps what
is needed on every run (when to use it, the flow, `sync`, `retrieve`, reading
the bundle, citations, golden rules) and drops to 198 lines (~9.4 KB), 35% less
load per invocation. What is needed only from time to time moves into two files:

- `skill/references/setup.md`: the alternative CLI invocation, paths and
  environment variables, the model cache procedure, `init`, and the two causes
  of the database-open error.
- `skill/references/troubleshooting.md`: exit codes, interpreting `status`,
  symbolic codes, partial `sync` failure and `doctor`.

**This does not contradict the self-containment that point 2.4 established.**
That decision forbade the skill from depending on files _outside_ itself — in
particular, referencing `docs/` by relative path — so that it could be installed
or linked outside this repository. The `skill/` directory travels whole, so the
bundle is still self-contained. Having more than one file inside it was never
forbidden. If a future reading interprets the split as a regression of 2.4, that
reading is wrong.

The invariant the split introduces: **the triggers stay in `SKILL.md`, the
procedures leave.** Every condition that requires reading a reference is named
in `SKILL.md` by its symptom (`ERR_SQLITE_ERROR`, `status` other than `ok`, the
command missing from PATH), plus a reference table at the start. The 2.4
verification had already shown that a cold agent skips a step that is not in
sight; moving content without leaving the reflex behind would reproduce that
failure.

Two things were deliberately kept in `SKILL.md` even though by topic they would
look like candidates to move, because by frequency they are not: the `sync`
waiting guidance and the `rules.json`/`analysis.json` coexistence. Both are
needed at the moment of running, not after failing.

The split has **not been validated cold yet**; repeating the same kind of run
with the already split skill remains pending.

## Installation: user home, `init` as installer, and preflight (point 4.2)

Implemented on 13 and 14 August 2026. Full design in `docs/install-design.md`.
It closes the open item "Default del caché del modelo" that the cold run had
opened.

The investigation started from a symptom — 63 `MODEL_LOAD_FAILED` issues — and
arrived at a much deeper cause: **it had never been decided how the product is
installed**. `package.json` declared `private: true` alongside a `bin`, no
specification covered distribution, and the only installer was
`npm run models:download`, which is the benchmark harness
(`tsx benchmarks/embeddings/run.ts`) and does not exist for anyone without the
repository cloned. The audit found **four places** computing the model path,
three of them duplicating a default relative to the `cwd`.

Closed decisions, all confirmed by the user:

- **Distribution as an npm-style global command, with no `postinstall`.** There
  are installations with scripts disabled; the project had already chosen
  `node:sqlite` over `better-sqlite3` partly for that very reason
  (`docs/benchmarks/sqlite-client.md`), and a 130 MB hook would contradict that
  decision.
- **A single user home** `~/.auto-youtube-rag/`, with `index.sqlite` and
  `models/` inside it. It replaces the `cwd`-relative defaults, which broke the
  main use case — an agent querying from another project — and failed silently:
  `status` reported zero sources and looked like data loss.
- **The directory is called `models/`, not `cache/`,** and the variable went
  from `AUTO_YOUTUBE_RAG_MODEL_CACHE` to `AUTO_YOUTUBE_RAG_MODELS_DIR`. A cache
  is derived data that regenerates itself; this model never restores itself,
  because the invariant forbids downloading implicitly and the adapter forces
  `allowRemoteModels = false`. It is installed state. The old name came from the
  Transformers.js vocabulary, where downloading does happen on its own.
- **A single shared resolver** (`resolve-paths.ts`), used by reader and writer.
  The three duplicated defaults were removed: `E5EmbeddingGenerator` now
  requires `cacheDir` and `evals/run-seed-queries.ts` resolves through the same
  path. `benchmarks/embeddings/run.ts` is kept intact: it is a research tool and
  legitimately works against the repository.
- **`init` installs the complete system** (home, database and model), with
  `--skip-model` for CI. It stops being instantaneous, and that is documented
  with the same prominence as the duration of `sync`.
- **A model already present on disk is reused only with an explicit `--from`.**
  Automatic detection of the repository was rejected: it would give the product
  knowledge of the repo structure, and the agreed principle is the opposite —
  the repo is source code, and the product must not be able to run from it
  without having been installed. It copies, never moves: emptying the origin
  would break the benchmarks and the E5 smoke test.
- **Requirement preflight once per command.** Every command declares what it
  needs and the CLI verifies it before building anything. The case that
  motivated it: `sync` discovered the missing model once per video, processing
  63 packages to reach a conclusion available in the first millisecond.
  `test/interfaces/cli/` pins that regression.
- **A `models/.install.json` receipt** with the expected size of each file, in
  order to distinguish `absent`, `incomplete` and `installed`. It detects the
  truncated download — which leaves the four files present with the wrong size —
  without reading 130 MB on every `doctor`. Sizes are compared, never hashes.
- **The old `cwd`-relative database is reported (`LEGACY_LIBRARY_FOUND`), not
  migrated automatically.** Moving the user's data without being asked exceeds
  the mandate of `init`.

A bug found and fixed during verification: `doctor` was still detecting the
model with `readdir(...).length > 0` — "is there anything in the folder?" — even
though its message already pointed at `models install`. With a truncated model,
`models status` said `incomplete` and `sync` refused to run, but `doctor`, which
is the diagnostic command, returned `ok`. `runDoctor` now receives the already
resolved state instead of inspecting the filesystem, which additionally removes
a `readdir` from the application layer.

The default model and its dimension **did not change**. What would be needed to
support another model was recorded in `docs/install-design.md`, section "Nota:
qué haría falta para soportar otro modelo": the dimension and automatic
reindexing already work; the hardcoded E5 prefixes and the impossibility of two
models coexisting do not.

## The citation marker opens the block, inside the heading

Fixed on 14 August 2026, the same day it was discovered during the cold
validation of 4.2.

**The problem.** The `[S0N]` marker closed its block, alone on its own line,
which left it one blank line away from the **following** heading. The cold agent
interpreted it as an opening marker and attributed to each ID the content that
came afterwards, producing a summary with the wrong provenance: it claimed that
`S21` documented the Swiss style (it was `S22`) and that `S18` dealt with
brutalism (it was content about minimalism).

**The product did not have a data bug**: `result.json` matched the closing
interpretation exactly, all 54 units resolved and there were zero orphan
citations. It was a problem of format readability.

It is the worst possible kind of failure: **it passed every mechanical
verification and still produced false attributions in the final answer**. Layer
A of 3.2 gave it a pass, and Layer B did not detect it because its judges
evaluated bundles, they did not produce citations from them. Neither of the two
layers measured the agent citing.

**It was reproduced twice**, with the same agent and two different readings of
the same bundle: the first reading `context.md` in two batches because of its
size (2,322 lines), the second one whole in a single pass. It was not a
pagination artefact. The shift was of one block backwards and **not uniform** —
some citations came out correct (`S03`, `S09`), probably located by content and
not by position — which produced a summary that was partially well attributed
and therefore harder to detect than one shifted evenly.

**The fix.** The ID becomes part of the block's heading:

```text
### [S01] Método completo de la fuente > Brutalismo
```

An ID cannot appear outside a heading line, so the association is structural
instead of positional. The alternatives of a double marker (opening and closing)
were rejected for duplicating noise in a file that already runs to about 2,300
lines, and so was leaving the format as it was and warning about it in the
skill, because that leaves the trap standing and depends on every consumer
reading and remembering the warning.

**It does not break the contract**: `cli-contract.md` fixed the `[S01]` shape,
never its position. It did not break anything mechanical either — the integrity
verifier uses `matchAll` with a regex, independent of position. Verified over a
real bundle: 34 units, 34 markers, zero orphans, and all 34 with their own
heading.

## `sync` safety and batch size (point 4.3)

Implemented on 14 August 2026. Design in `docs/sync-safety-design.md`. It closes
the open item "Guard de concurrencia en `sync`".

**Cross-deletion was confirmed, not assumed.** The deterministic reproduction
shows that two overlapping runs over one source leave it completely empty: each
run deletes the packages it did not claim
(`DELETE ... WHERE last_seen_sync_id <> ?`), so whatever the other one already
claimed looks unseen. Both finish without error and every video was seen by one
of them. It explains what was observed on 13 August, when `status` reported 13
videos when there were 53.

Closed decisions:

- **The guard lives in the store, not in the use case.** It is a persistence
  invariant: `recordRun` refuses to record a `running` run for a source that
  already has another. It applies only on creation, never on closing a run.
- **No age heuristic.** "A run older than N minutes is dead" was rejected: there
  is no defensible N when a sync of 60 videos takes minutes and one of 500 would
  take more than an hour. Any threshold either kills live syncs or lets ghosts
  through.
- **Two explicit exits for ghost runs**: `sync --force`, which marks the active
  run as `failed` and leaves a `RUN_SUPERSEDED` `SyncIssue` as a record that it
  was abandoned and not completed; and a `STALE_SYNC_RUN` check in `doctor` that
  lists them with their age. **Nothing is abandoned on its own**: marking
  another process's work as failed without anyone asking is the kind of decision
  the rest of the product avoids.
- **`defaultBatchSize` from 16 to 1.** Padding within the batch dominated the
  cost: fragments range from 13 to 511 tokens and all of them were padded up to
  the longest one. Measured end to end: 12 videos went from 3 min 54 s to
  1 min 45 s, **2.23x**, very close to the 2.27x the micro-benchmark predicted.
- **Parallelizing was rejected with a measurement, not on intuition.**
  Concurrency 2 → 0.99x, concurrency 4 → 1.00x over real content: ONNX already
  saturates the eight cores internally, so spreading videos across tasks would
  compete for the same CPU.

Declared, not hidden, limitations:

- ~~The guard does not eliminate the race between two operating system
  processes.~~ **Closed on 14 August 2026**, see "Closing the cross-process
  race" further below. The original version checked and then inserted without
  atomicity, so two processes could read "there is no active run" before either
  of them had written.
- `supersedeActiveRun` does a direct `UPDATE` instead of rebuilding a `SyncRun`
  and passing it through `recordRun`, so it does not go through the domain state
  machine. It sets `status` and `finished_at` together, so the
  `finishedAt >= startedAt` invariant holds all the same. It is a bounded and
  deliberate repair operation; if the `SyncRun` invariants become critical on
  more paths in the future, it is worth revisiting.
- **The vectors change slightly with the batch size** (cosine deviation of
  4.8×10⁻³ between batch 1 and batch 16 for the same text): the model does not
  mask the padding perfectly. It is far below what separates two different
  fragments, so it should not move rankings. `unchanged()` does not detect it,
  because the batch size is not part of the model identity, so an existing
  library keeps its old vectors and ends up mixed. **Reindexing is advisable,
  not mandatory**; the batch was not added to the model identity because that
  would make any performance tweak invalidate the entire library.

## Silent degradation of the vector path

Fixed on 14 August 2026. It closes the gap that had been noted in
`docs/install-design.md` while investigating support for other models.

**The defect.** `sqlite-vector-loader.ts` queries
`WHERE model_key = ? AND model_version = ?`. If the active model changed and
reindexing has not happened yet, that query returns no rows, the index stays
empty and `retrieve` answered `status: "ok"` built **from textual search alone,
with no warning at all**. The semantic half of the product disappeared
silently.

`VECTOR_SEARCH_UNAVAILABLE` did not cover it: it is emitted only when the vector
path throws an exception. An empty index does not throw, it returns zero
results, which is indistinguishable from "there were no matches".

**The fix.** `VectorSearchIndex.load()` goes from `Promise<void>` to returning
the number of vectors available for the active model — data the loader already
had. `retrieveCandidates` emits the new `VECTORS_STALE` warning when three
conditions hold at once:

1. the load did **not** fail (if it threw, there is already
   `VECTOR_SEARCH_UNAVAILABLE` with an unknown cause and it is not appropriate
   to also report staleness);
2. it loaded **zero** vectors;
3. the textual path **did** return hits.

The third is the one that avoids false positives. On its own, the second would
fire on an empty or newly created library, or when a `--source` filter leaves
the universe with no candidates; in those cases the text returns nothing either
and `no_results` already explains it. Text finding content while vectors do not
is the unambiguous signal of staleness.

The message **does not assert the cause**: it says that semantic search did not
take part, that the results come from the lexical path only, and that `sync`
regenerates the vectors. That the model has changed is a hypothesis the code
cannot verify.

The warning already reached the bundle with no extra wiring: `outcome.warnings`
flows to `renderContextResult` and to "Coverage and limitations" in
`context.md`, and `run-cli` degrades the status to `partial` with exit `1` on
any warning.

**A second defect that masked the first.** The fast path of
`InMemoryVectorSearchIndex.load()` compared only `model.key`, which is
`e5-small` and never changes; what changes is `version`, which encodes
repository, revision and quantization
(`Xenova/multilingual-e5-small@main:q8`). A change of revision reused the cached
matrix instead of reloading, and **a reused matrix has a count greater than
zero, so `VECTORS_STALE` would never have fired**. The two defects covered for
each other: fixing only the warning was not enough.

It now compares key, version and dimension. In practice the CLI runs one command
per process, so the stale snapshot only affects a long-lived application — the
tests today, a server or an MCP host later on — but the fix is worth it all the
same.

It was detected by the agent implementing `VECTORS_STALE`, which **reported it
instead of fixing it silently** because it was outside its scope. That report is
what prevented closing the point with a warning that could not fire.

## Closing the cross-process race in `recordRun`

Fixed on 14 August 2026. It closes the limitation that 4.3 had explicitly
declared unresolved.

**The problem.** The guard checked with a `SELECT` and then inserted, with no
atomicity. Two operating system processes could read "there is no active run"
before either of them had written, and both start — which is exactly the
scenario whose damage 4.3 confirmed: two overlapping runs leave the source
empty.

**The fix.** The check and the write happen inside a single `BEGIN IMMEDIATE`.
That mode takes the write lock **before** reading, so the second process waits
(up to the 5 s of `busy_timeout` that `open-database.ts` already configured) and
then sees the first one's run and is rejected. The guard stops being indicative
and becomes a guarantee.

**A partial unique index was rejected** (`CREATE UNIQUE INDEX ... WHERE
status = 'running'`), which would also solve the problem. Reasons: it requires
changing the schema, and `open-database.ts` has no incremental migration path —
it compares the version and rejects any difference — so it would have forced
building that mechanism or invalidating existing libraries. It would also fail
on creation if a database already had two `running` runs, a state that was
possible before 4.3. `BEGIN IMMEDIATE` gives the same guarantee without touching
the schema and reuses a pattern that `migrateEmptyDatabase` itself already used.

**A bug of its own, found by the test.** The first version left the
`BEGIN IMMEDIATE` outside the `try`, so failing to take the lock threw
**synchronously** in a method typed `Promise<void>`: a caller with `.catch()`
would not have seen it. The contention test caught it immediately. The
transaction opening is now inside the `try`, and the `ROLLBACK` only runs if the
transaction actually got opened.

**How it is tested.** Two connections to the same file, which is the real case
of two processes: while one holds the lock, the other must be rejected instead
of falling through to the `INSERT`, must not leave a transaction open — a later
write over that same connection has to work — and the disputed run must not have
been written.

## Model profile and prefix policy

Implemented on 14 August 2026. Design in `docs/model-profile-design.md`
(point 4.5). It closes front number 1 of the priority order set on 14 August in
`docs/agent-handoff.md`.

**The problem.** The `passage: ` and `query: ` prefixes were applied **always**,
in two module functions of what used to be `e5-embedding-generator.ts`. They are
specific to the E5 family: with MiniLM, BGE or Jina they are not neutral, the
model literally embeds the words "passage" and "query" as content and degrades
quality **without producing any error**. Nothing failed, nothing warned; only
the results got worse. The benchmark harness already accounted for it with an
`e5Prefixes: boolean` flag in its `ModelDefinition`; the product did not. It was
noted as the real work behind "configurable model" while investigating point
4.2, see `docs/install-design.md` → "Nota: qué haría falta para soportar otro
modelo".

**The solution.** `src/infrastructure/embeddings/model-profile.ts` is born, and
it imports nothing from Transformers.js, `node:fs` or any other module of the
project: it is pure data. It defines `EmbeddingModelProfile` (repository,
revision, `dtype`, dimensions, `maxInputTokens`, `requiredFiles` and
`inputPrefixes: EmbeddingInputPrefixes | null`, where `null` explicitly means
"this model takes no prefixes", not "it has not been decided yet") and the
frozen active profile `activeModelProfile`, today with the same values that were
hardcoded for E5 Small. The embedding generator and the installer stop having
constants of their own and receive the profile by injection, with
`activeModelProfile` as the default — nobody constructing with `{ cacheDir }`
notices the change. `countTokens` and `embedDocuments` share the same prefixing
function, so the 512-token budget always measures the text exactly as it enters
the model, prefix included.

Mechanical consequence: `"Xenova/multilingual-e5-small"` went from being written
three times in `src/` (the generator, the installer and the installation state,
each with its own copy of `modelDirectory`) to appearing only once, in
`model-profile.ts`. The other two modules derive the directory from
`profile.repository`.

The occasion was used to rename the adapter: `E5EmbeddingGenerator`, which no
longer knows anything about E5 — it is now a generic consumer of a profile —
was a name that reintroduced the very confusion this point came to erase.
`TransformersEmbeddingGenerator` and `TransformersModelInstaller` replace
`E5EmbeddingGenerator` and `E5ModelInstaller`, along with their types
(`EmbeddingAdapterError`, `EmbeddingSession`, `EmbeddingRuntime`,
`ModelDownloadRuntime`, etc.). **The values of the error codes did not change** —
`MODEL_LOAD_FAILED`, `INPUT_TOO_LONG`, `MODEL_SOURCE_INVALID` and the rest are
public contract documented in `cli-contract.md` and `skill/SKILL.md`; only the
name of the class carrying them changed. While at it, the `MODEL_LOAD_FAILED`
message naming "E5 Small" by hand was fixed; today it takes it from
`profile.repository`.

**Why the prefix policy folds into `version`, and why that does not reindex
today.** It is the decision with the most consequences in this point.
`unchanged()` in `sync-source.ts` includes the active model's `key`, `version`
and `dimensions` in its criterion: changing any of the three invalidates all
packages and the next `sync` reindexes. If someone turned the prefixes off
without changing model and `version` did not move, `unchanged()` would say "no
changes" and the library would serve old prefixed vectors against new
unprefixed queries — silent, and worse than the original bug this point fixes.

That is why `modelVersion(profile)` derives the string and the prefix policy
takes part in the derivation: with no prefixes it appends the suffix
`+noprefix` to the base literal `repository@revision:dtype`. With the active
profile — which does carry prefixes — this produces, character by character, the
same literal that existed before this point:
`"Xenova/multilingual-e5-small@main:q8"`. No existing database is invalidated
and nothing is reindexed today; a regression test pins that exact literal
because if someone breaks it by accident, it silently invalidates every
installed library. Any future profile with a different prefix policy does
produce a different `version` and triggers the automatic reindexing that already
existed.

Adding a `prefixPolicy` field to the port's `EmbeddingModelDescriptor` and
comparing that in `unchanged()` was rejected: it forces changing the application
port, the `embeddings` table has no column to persist it in, and `version` is
already exactly the place where the project decided to encode "everything that
makes two vectors incomparable" — revision and quantization already live there.

**Real validation (AD3).** Over a temporary copy with only the indexable
resources of 3 real `auto-design` videos (2.22 MB, one of them with
`analysis.json` schema 2.0), never the original collection:

- with the code prior to 4.5 (commit `be4ebff`), `init --from` adopted the real
  model (135,392,016 bytes, `version`
  `Xenova/multilingual-e5-small@main:q8`) and `sync` indexed the 3 packages
  (`status: "ok"`, `packagesIndexed: 3`);
- with the 4.5 code over that same database, `sync` returned `status:
"no_changes"`, `packagesUnchanged: 3`, `packagesIndexed: 0` — nothing was
  reindexed, which is the property the point had to guarantee;
- `retrieve "neumorfismo accesibilidad contraste" --depth balanced` returned
  `status: "ok"`, 19,354 estimated tokens, 3 sources and **no warnings**, in
  particular no `VECTORS_STALE` — confirming that the vectors generated by the
  old code are still valid for the active model. The bundle opens with an
  `analysis` schema 2.0 unit and its 18 cited units resolve 1:1 against the 18
  `[S01]`–`[S18]` markers of `context.md`;
- `doctor` reported all six checks as `ok` (`SQLITE_INTEGRITY`,
  `SQLITE_FOREIGN_KEYS`, `SQLITE_FTS`, `SOURCE_READABLE`, `STALE_SYNC_RUN`,
  `EMBEDDING_MODEL`);
- the SHA-256 digest of the source tree was identical before and after. The copy
  and the temporary database were deleted on finishing.

**A collateral finding, recorded as a note, not as an open item.** While
preparing the temporary copy for AD3, `parseManifest` rejected a `manifest.json`
with a UTF-8 BOM with `MANIFEST_JSON_INVALID`. It appeared because PowerShell
wrote the test manifest with a BOM by default. The real manifests are produced
by the `youtube-video-context` skill without a BOM, so this blocks nobody today;
it is recorded in case somebody edits a manifest by hand on Windows and runs
into the same error.

**What did not change:** the active model, its dimension, revision and
quantization; the `version` persisted in `embeddings`; the public error codes
and the shape of the JSON receipts; `models/.install.json`; the
`EmbeddingGenerator` port and `EmbeddingModelDescriptor`; the SQLite schema
(zero migrations); `cli-contract.md` (no new command or flag); `skill/SKILL.md`
(nothing observable changed for a consuming agent).

## `rebuild` regenerates instead of only purging (point 4.6)

Decided and implemented on 14 August 2026. Full design in
`docs/rebuild-design.md`.

The contract approved since the MVP said barely two sentences: "it regenerates
the derived index and requires explicit confirmation". The decisions that had to
be taken in order to implement it:

- **It purges and re-syncs, it does not only purge.** The contract says
  "regenerates". A dry purge would leave the library empty and silently useless
  until somebody remembered to run `sync`: the worst possible state for a
  command whose purpose is to repair.
- **It preserves `sources`, `schema_meta`, `sync_runs` and `sync_issues`.** Only
  `video_packages` and its cascade are derived. Preserving the history is not a
  new preference: `source remove` already leaves detached history and
  `sync_runs.source_id` is `ON DELETE SET NULL` precisely to allow it. A rebuild
  that deleted the history would destroy the only evidence of why somebody had
  to rebuild.
- **The active-`sync` guard lives inside the purge transaction**, not in the use
  case. Checking in the application and deleting afterwards reopens the same
  window that 4.3 closed in `recordRun`. A rebuild spans every source, so an
  active run in any of them blocks it.
- **It does not accept `--force`.** Unblocking a ghost run and rebuilding the
  entire library are two different decisions.
- **Only the purge is transactional.** Wrapping the re-sync as well would leave
  a `BEGIN IMMEDIATE` open during the embedding of the entire library. It is
  accepted that a process killed halfway leaves the library partially rebuilt;
  the remedy is to repeat the command, which is idempotent, and both
  `cli-contract.md` and `SKILL.md` state so.
- **It walks the sources sequentially**, unlike the `Promise.all` of `sync`: a
  rebuild is the maximum-load case and 4.3 measured that parallelizing indexing
  yields 1.00x because ONNX already saturates the cores.

### The defect found by the vector index test

The design claimed that no new mechanism was needed for the in-memory index,
because it already invalidates its snapshot on `apply`. **That was false.** The
purge deletes rows through SQL, and SQL publishes nothing; a rebuild that ends
with no packages at all publishes not a single change, so the snapshot survives
whole. Measured: 2 vectors served over a library with zero embeddings.

It is the same defect 4.4 fixed — a stale snapshot masking `VECTORS_STALE` —
arriving by a new route. `rebuildIndex` now publishes a `remove_packages` with
the `PackageRef`s that were there, after the purge commits and never before,
respecting the invariant of not publishing vectors before the SQLite commit.

## Sorting fragments by length: measured and rejected

Closed on 14 August 2026 **without writing code**, after verifying it against
the code and not against the document. It was point 1 of the user's priority
order.

Sorting by length amortizes the padding within a batch: every text in a batch is
padded up to the longest one. With `batchSize = 1` — the default 4.3 adopted —
each call receives a single text and no padding is possible, so sorting the
input does not change a single runtime operation.

- `defaultBatchSize` is `1` and no product caller overrides it.
- `embedDocuments` is invoked **per package**, inside the video loop of
  `syncSource`, so the sortable universe would be the fragments of one video,
  not the corpus against which the 1.93x was measured.
- The 4.3 measurement already said it: sorted batch 16 yields 1.93x against
  2.27x for batch 1. It was not an improvement over batch 1; it was the
  alternative that batch 1 beat.
- Reintroducing it would cost the determinism 4.3 celebrated: a fragment's
  vector would come to depend on which other fragments of the same video have a
  similar length.

Only reopen it if an independent reason appears to go back to a batch larger
than 1.

## Low-relevance warning instead of a similarity floor (point 4.7)

Decided and implemented on 14 August 2026. Full design in
`docs/low-relevance-design.md`.

Since 2.2 a "minimum vector similarity floor, except with clear evidence" had
stayed open; 3.2 looked for that evidence and did not find it. It appeared on 14
August, testing the real library: a query about type 2 diabetes symptoms
returned `status: "ok"` with 31,982 tokens about web design and
`warnings: []`.

- **`fusedScore` is no good for measuring relevance.** RRF assigns
  `1/(k + rank)`: it encodes position, not similarity, so the top candidate of a
  perfect query and that of an absurd one receive the same value. The only
  signal with absolute meaning is the cosine of the vector path.
- **The threshold was measured, not chosen.** 24 queries classified by hand
  against the 51 videos: in-domain 0.8657–0.9012; uncovered techniques
  0.8428–0.8600; out of domain 0.8149–0.8389. No overlap, but with margins of
  thousandths. `0.84` is the conservative cut.
- **The warning informs and does not filter**, precisely because the threshold
  is fragile: too high is merely annoying, too low stays silent. Neither of the
  two errors can hide evidence. A floor that discarded candidates would have the
  opposite risk, and it is still rejected just as in 2.2 and 3.2.
- **The threshold is injectable and lives next to its table of measurements**
  (`retrieval-thresholds.ts`), because it is calibrated over a single Spanish
  design collection: another corpus, language or model invalidates it.
- **An informational warning does not degrade the result.** `run-cli.ts` treated
  any warning as degradation, which turned a healthy query into `partial` with
  code `1`. `informationalWarningCodes` separates "something failed" from "this
  is a fact about the answer"; `LOW_RELEVANCE` keeps `ok` and exit `0`.

It was found by verification against the real binary, not by the suite: the 348
tests passed with the defect present.

**The number is always reported, not just the judgement.**
`metrics.top_vector_similarity` carries the cosine of the best vector hit on
every query (`null` if the path did not run). Decided while reviewing the point:
a binary warning with a debatable threshold, delivered on its own, creates
**false confidence by absence** — "there is no warning, therefore it is
relevant" — and contradicts the product's premise that the querying agent is the
only brain. Judging relevance with a number calibrated over one collection is
exactly the kind of decision the design delegates to it. With the raw figure it
can apply its own criterion.

The first real run after implementing it justified the choice on its own:
"síntomas de la diabetes tipo 2" measured **0.8399** against the floor of 0.84 —
one ten-thousandth more and it would not have warned, with the content just as
irrelevant.

**Known limitation:** the judgement uses only the vector cosine, so an exact
lexical match with a low cosine would produce a false positive. It is bounded
because the warning does not filter, but the criterion does not cover it.

## Pending decisions

None.

## Follow-up work noted, with no pending decision

- **Verify `skill/SKILL.md` from a real Codex.** Point 2.4 was closed with
  verification on Claude only, by explicit decision of the user.

Historical description of the open item that 4.3 closed:

- **Concurrency guard in `sync`.** There was no lock at all preventing two
  simultaneous `sync` runs over the same database. The cold run produced them
  and observed inconsistent counts while they ran (`status` went as far as
  reporting 13 videos when there were 53); the later full `sync` rebuilt the
  correct state and `doctor` never reported damage, so **there is no confirmed
  permanent loss**. The hypothesis that two overlapping runs delete each other's
  packages — via the logic of removing those not seen by the run itself — is
  plausible given the observed timestamps but **is not confirmed**: it would
  need to be reproduced in an isolated and deliberate way before being treated
  as a bug. For now the skill warns about it.

It was reproduced on 14 August and turned out to be true, and worse than
described: it does not just corrupt counts, it leaves the source empty. The
caution of not treating it as a bug until reproducing it was right — the
conclusion could have been the opposite — but the doubt is now settled.
