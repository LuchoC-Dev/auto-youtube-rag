# Build progress

> **Note:** this document is the history of the project, not a tracker of
> pending work. It records what each point delivered and how it was validated
> against the real `auto-design` collection; nothing is left open except what is
> explicitly noted.

## States

- ⚪ Pending
- 🔵 In progress
- ✅ Completed

---

| Phase                      | No. | Stage                                | State |  %   | Description                                                   |
| -------------------------- | --- | ------------------------------------ | :---: | :--: | ------------------------------------------------------------- |
| **1 — Definition**         | 1.1 | Repository and initial context       |  ✅   | 100% | Git and documented decisions                                  |
|                            | 1.2 | CLI contract and outputs             |  ✅   | 100% | Commands, formats and codes defined                           |
|                            | 1.3 | Stack and vector strategy            |  ✅   | 100% | Stack and reproducible toolchain approved                     |
| **2 — MVP implementation** | 2.1 | Incremental indexing                 |  ✅   | 100% | Incremental sync and CLI verified                             |
|                            | 2.2 | Hybrid retrieval                     |  ✅   | 100% | FTS5, vectors and ranking verified                            |
|                            | 2.3 | Context assembly                     |  ✅   | 100% | Expansion, budget, citations and `retrieve`                   |
|                            | 2.4 | General skill                        |  ✅   | 100% | `skill/SKILL.md` verified cold                                |
| **3 — Quality**            | 3.1 | Functional tests                     |  ✅   | 100% | Domain, SQLite, CLI and E2E covered                           |
|                            | 3.2 | MVP evaluations                      |  ✅   | 100% | M, N and O complete; MVP closed                               |
| **4 — Post-MVP**           | 4.1 | `analysis.json` support (schema 2.0) |  ✅   | 100% | Blocks P–T complete; validated against the real `auto-design` |
|                            | 4.2 | Installation: user home and `init`   |  ✅   | 100% | Blocks U–Z and Y complete; validated cold from scratch        |
|                            | 4.3 | `sync` safety and performance        |  ✅   | 100% | Concurrency guard, ghost runs and batch 1 (2.23x)             |
|                            | 4.4 | Stale vector warning                 |  ✅   | 100% | `VECTORS_STALE` and index reload by model version             |
|                            | 4.5 | Embedding model profile              |  ✅   | 100% | Blocks AA–AD complete; validated without reindexing           |
|                            | 4.6 | `rebuild --confirm` command          |  ✅   | 100% | Blocks AE–AH complete; validated against the real binary      |
|                            | 4.7 | Low-relevance warning                |  ✅   | 100% | `LOW_RELEVANCE` with a threshold measured over 24 queries     |

---

## Detail by stage

### Stage 1 — Definition

#### 1.1 Repository and initial context

- [x] Create the Git repository
- [x] Document the objective and scope
- [x] Document the agreed architecture
- [x] Record decisions and open matters
- [x] Create the build tracking

#### 1.2 CLI contract and outputs

- [x] Define commands and arguments
- [x] Define exit codes
- [x] Define the Markdown format
- [x] Define a versioned JSON schema

#### 1.3 Stack and vector strategy

- [x] Choose the language and packaging
- [x] Evaluate and choose the local model
- [x] Define domain boundaries and adapters
- [x] Compare exact search and sqlite-vec
- [x] Choose the initial vector implementation
- [x] Evaluate SQLite clients reproducibly
- [x] Choose `node:sqlite` and pin Node 24.19.0
- [x] Define the build, test and lint commands

### Stage 2 — MVP implementation

#### 2.1 Incremental indexing

- [x] Define validated domain identities
- [x] Define base catalog entities
- [x] Define units, fragments and embeddings
- [x] Define runs, issues and content identity
- [x] Define snapshots and the atomic swap
- [x] Define indexing ports
- [x] Resolve source layouts
- [x] Read and validate manifests
- [x] Parse Markdown contexts
- [x] Parse JSON rules
- [x] Select stable metadata
- [x] Register multiple roots
- [x] Read packages without modifying them
- [x] Create hierarchical units
- [x] Fragment units by tokens
- [x] Generate local E5 embeddings
- [x] Validate the local model by smoke
- [x] Detect changes through hashes

#### 2.2 Hybrid retrieval

- [x] Implement FTS5 search
- [x] Implement semantic search
- [x] Combine and diversify results
- [x] Filter by metadata

#### 2.3 Context assembly

- [x] Expand parent units
- [x] Deduplicate content
- [x] Apply budgets by depth
- [x] Preserve citations and limitations
- [x] Implement the `retrieve` command of the CLI

#### 2.4 General skill

- [x] Create a canonical skill
- [x] Invoke the CLI without provider-specific logic
- [x] Verify use from Claude (cold agent, no previous context)
- [x] Verify use from Codex (real external agent; confirmed by the
      maintainer on 15 August 2026, it worked)

`skill/SKILL.md` is self-contained (it does not depend on paths relative to
`docs/`) so that it can be installed outside this repository. Verified with two
runs of a cold subagent (with no previous context of the project, only the text
of the skill) against a temporary copy of two real `auto-design` videos: the
first run detected that `init` was not documented as a mandatory previous step;
once corrected, the second run completed the whole flow (`init` → `status` →
`source add` → `sync` → `retrieve`) and produced a correctly cited bundle
without inspecting `src/`. It closed with verification only on Claude, by
explicit decision of the user; the Codex verification followed on 15 August
2026 and also worked. The procedure is in `docs/agent-handoff.md`.

### Stage 3 — Quality

#### 3.1 Functional tests

- [x] Cover the domain and indexing
- [x] Test temporary SQLite
- [x] Test the CLI and the output schemas
- [x] Test updating and deletion

#### 3.2 MVP evaluations

Design proposed and approved on 12 August 2026 in `docs/eval-design.md` (blocks
M–O). Without labelled ground truth: it measures on two independent layers,
mechanical (coverage, citation integrity) and judged (a rubric answered by Codex
and by Claude over the same bundle).

- [x] M1. Citation integrity checker (`evals/citation-integrity.ts`)
- [x] M2. Seed query orchestration script (`evals/run-seed-queries.ts`)
- [x] M3. Layer A metrics aggregator (`evals/aggregate-mechanical-metrics.ts`)
- [x] M4. Real run over `auto-design` (24 bundles in `evals/results/2026-08-12/`; schema-drift finding in 17/51 videos of the real manifest)
- [x] N1. Rubric template (`evals/rubric-template.md`)
- [x] N2. Claude's judgement (`evals/results/2026-08-12/judgments/claude/`, cold subagent)
- [x] N3. Codex's judgement (`evals/results/2026-08-12/judgments/codex/`, run by the user)
- [x] N4. Codex vs. Claude comparison (9/24 pairs diverge, only because of rubric ambiguity, see `evals/results/2026-08-12/report.md`)
- [x] O1. Decision on RRF weights and budgets (defaults kept without
      changes; evidence and reasoning in `docs/decisions.md`, section
      "Calibration decision (O1, point 3.2)")
- [x] O2. Final report and closure of 3.2
      (`evals/results/2026-08-12/report.md`)

MVP complete: 2.1–2.4 and 3.1–3.2 are at 100%. The calibration decision of O1
and the actionable findings of 3.2 are in
`evals/results/2026-08-12/report.md` and `docs/decisions.md`. Reasonable later
work (vector similarity floor, MCP, web interface, web page packages) stays
outside this MVP, documented in `docs/agent-handoff.md`, not as an urgent
pending item. The support for `analysis.json`/schema 2.0, the first front of
later work, has already been implemented and validated — see 4.1 below.

### Stage 4 — Post-MVP

#### 4.1 `analysis.json` support (schema 2.0)

Design proposed and approved on 13 August 2026 in
`docs/analysis-schema-design.md` (blocks P–T). Reason: the producing skill
`youtube-video-context` replaced `rules.json`/schema 1.0 with
`analysis.json`/schema 2.0 on 2 August 2026; `auto-youtube-rag` never supported
the new schema, so the 17 real `auto-design` videos generated with the current
skill —and every future video— stay outside the library. Closed decisions: both
schemas are supported indefinitely; `topics`/`recommendations` reuse the fixed
sections already published in the bundle without adding a fourth one; the SQLite
migration edits `001-initial.ts` in place (there is no real database to
preserve). Full detail in `docs/decisions.md`.

- [x] P1–P3. Domain and application contracts
- [x] Q1. `analysis.json` parser
- [x] R1–R2. Package reading and knowledge units
- [x] S1–S3. SQLite migration, bucketing and E2E with fixtures
- [x] T1–T3. Real validation over `auto-design` and closure

Closed on 13 August 2026. Real validation (block T) against a temporary copy of
the real `auto-design` collection (51 videos, including the 17 with
`analysis.json`) with the real E5 model: the 51 packages were indexed without a
single `issue`, `doctor` reported the five checks as `ok`, and the SHA-256
digest of the source tree was identical before and after `sync`. A new seed
query (`es-analysis-neumorphism-accessibility`) aimed specifically at
`analysis.json` content produced a real bundle where a citation resolved to an
`analysis_topic` unit with correct provenance. `catalog-design` was not
validated explicitly: its manifest declares no video with `resources.analysis`,
so it does not exercise this work. Full detail in `docs/decisions.md`, section
"`analysis.json` support (schema 2.0): implemented and validated".

#### 4.2 Installation: user home, `init` as installer and preflight

Origin: the cold verification run of 13 August failed with 63
`MODEL_LOAD_FAILED` issues and exposed that **it had never been decided how the
product is installed**. The only installer was the benchmark harness, which does
not exist outside the cloned repository, and four different places computed the
model path with incompatible rules.

- [x] U1–U2. Shared path resolver, receipt and model state
- [x] V1–V3. Removal of the three duplicated `cwd` defaults
- [x] W1–W4. Port, download adapter and copy from `--from`
- [x] X1–X5. `models` and `init` in the CLI, `main.ts` and `doctor` aligned
- [x] Z1–Z4. Requirements preflight and translation of state failures
- [x] Y1–Y3. Real smoke, cold validation and closure

Closed on 14 August 2026. Design in `docs/install-design.md`, decisions in
`docs/decisions.md`.

**Cold validation (Y2)**: a subagent with no previous context, with access only
to `skill/SKILL.md` and its references, started from a machine with no user home
and got from zero to a cited answer. It installed with `init --from`, registered
`catalog-design`, indexed the 12 videos in 3 min 54 s without a single `issue`
and retrieved a bundle of 54 units with zero orphan citations. **It copied no
file by hand and relaunched no `sync`** —the two things the previous run had
done— and it found the `--from` flag by reading the skill, unaided.

Two findings from the run:

1. **`doctor` gave a false bill of health** for a truncated model: it detected
   with `readdir(...).length > 0` even though its message already pointed at
   `models install`. Fixed; `runDoctor` receives the already-resolved state.
2. **The citation marker of `context.md` is misread.** It is a closing marker
   and the agent interpreted it as an opening one, producing a summary with the
   wrong provenance even though the 54 citations resolve and there are no
   orphans. It reproduced twice, even reading the whole bundle in one go.
   **Resolved on 14 August 2026**: the citation id now opens the block, inside
   the heading (`### [S01] ...`), in commit `3969d2b`. `cli-contract.md`,
   `skill/SKILL.md` and `docs/decisions.md` record the new marker.

#### 4.3 `sync` safety and indexing performance

Design in `docs/sync-safety-design.md`. Two pieces of work with the same origin:
the cold run of 13 August.

- [x] AA. Concurrency guard in the store and cross-deletion regression
- [x] AB. `sync --force`, `RUN_SUPERSEDED` and `doctor` with `STALE_SYNC_RUN`
- [x] AC. `defaultBatchSize` from 16 to 1
- [x] AD. Closing the race between processes: `recordRun` under
      `BEGIN IMMEDIATE` (14 August, after the initial closure of 4.3)

Closed on 14 August 2026.

**The cross-deletion was confirmed, not assumed.** The deterministic
reproduction showed that two overlapping runs over one source leave it
completely empty: each one deletes what it did not claim itself, so what the
other one already claimed looks unseen. Both finish without an error. It
explains the `status` that reported 13 videos when there were 53.

Verified against the real binary: with an active run, `sync` rejects with
`SYNC_ALREADY_RUNNING` naming the run and its start; `doctor` reports it as
`STALE_SYNC_RUN` with its age; `sync --force` marks it as failed, leaves a
`RUN_SUPERSEDED` issue and starts a new one **preserving the 12 packages**.

**Performance: 2.23x measured end to end.** The same collection of 12 videos
went from 3 min 54 s to 1 min 45 s. The cause was the padding inside the batch:
the fragments range from 13 to 511 tokens and all of them were padded up to the
longest one, so a short one cost as much as one of 511.

**Parallelising was of no use**, and it was measured before discarding it:
concurrency 2 → 0.99x, concurrency 4 → 1.00x. ONNX already saturates the cores
internally.

#### 4.4 Stale vector warning

- [x] `VECTORS_STALE` when the library has content and no vector for the
      active model
- [x] `VectorSearchIndex.load()` returns the count of loaded vectors
- [x] The index reloads when `version` or `dimensions` change, not just `key`

Closed on 14 August 2026. Detail in `docs/decisions.md`, section "Silent
degradation of the vector path".

It closed the gap noted while investigating support for other models:
`retrieve` returned `status: "ok"` built with textual search only, with no
warning, when the vectors did not correspond to the active model.

**A second defect was covering the first.** The fast path of the index compared
only `model.key` —which is `e5-small` and never changes— instead of `version`,
which encodes revision and quantisation. Reusing the snapshot returns a count
greater than zero, so the new warning would never have fired. It was detected by
the agent implementing `VECTORS_STALE`, who reported it instead of fixing it
silently.

#### 4.5 Embedding model profile

Design in `docs/model-profile-design.md` (blocks AA–AD). Origin: the
`passage: `/`query: ` prefixes of the E5 family were applied always, without
exception, in `e5-embedding-generator.ts`; with another model (MiniLM, BGE,
Jina) they degrade the quality **without any error**, the gap that was noted
while investigating point 4.2 and that the user set as front number 1 on 14
August 2026.

- [x] AA. `model-profile.ts`: `EmbeddingModelProfile`, frozen
      `activeModelProfile`, `modelVersion` and `modelDescriptorOf`
- [x] AB. The generator applies prefixes according to the injected profile;
      `countTokens` and `embedDocuments` share the same prefixing policy
- [x] AC. `model-install-state.ts` and the installer consume the profile; the
      duplicates of `modelDirectory` and `requiredModelFiles` die
- [x] AD. Rename of the adapter and the installer, real validation without
      reindexing, documentation closure

Closed on 14 August 2026.

`"Xenova/multilingual-e5-small"` went from being written three times in `src/`
to appearing only once, in `model-profile.ts`. `E5EmbeddingGenerator` and
`E5ModelInstaller` were renamed to `TransformersEmbeddingGenerator` and
`TransformersModelInstaller` —they are no longer specific to E5— without
changing the values of any public error code.

**The riskiest decision was not to reindex anything.** `modelVersion(profile)`
folds the prefix policy into the persisted `version` (a `+noprefix` suffix
without prefixes), but with the active profile it produces, character by
character, the same literal that already existed:
`"Xenova/multilingual-e5-small@main:q8"`. A regression test pins that literal.
Validated as well against the real binary (AD3): over a temporary copy of 3 real
`auto-design` videos already synchronised with the previous code, `sync` with
the code of 4.5 returned `status: "no_changes"`, `packagesIndexed: 0`;
`retrieve` showed neither `VECTORS_STALE` nor any other warning, confirming that
the old vectors are still valid; `doctor` reported the six checks as `ok`; and
the SHA-256 digest of the source tree was identical before and after. Full
detail in `docs/decisions.md`, section "Model profile and prefix policy".

#### 4.6 `rebuild --confirm` command

Design in `docs/rebuild-design.md` (blocks AE–AH). Origin: `rebuild` was the
only command with a public contract approved since the MVP that was never
implemented, and point 2 of the priority order of 14 August 2026.

- [x] AE. `purgeDerivedIndex` in the port and in SQLite, with the guard for an
      active `sync` inside the same transaction as the deletion
- [x] AF. `rebuildIndex` use case: it purges, publishes the vector removal and
      re-synchronises each source reusing the wiring of `sync`
- [x] AG. CLI surface: mandatory `--confirm`, `library_and_model` requirement,
      aggregated receipt and exit codes
- [x] AH. E2E over real SQLite, CLI contract, `SKILL.md` and closure

Closed on 14 August 2026.

`rebuild` covers what `sync` cannot detect: `unchanged()` only compares the hash
of the package and the identity of the model, so a new batch size (the
reindexing that 4.3 left as "advisable but not mandatory" with no way of
exercising it), a different `parser_version` or a change of fragmentation leave
the library inconsistent while `doctor` keeps reporting `ok`.

**Block AH2 found a real defect before it reached production.** The design took
for granted that the in-memory vector index would invalidate itself, because it
already does so in `apply`. That is false: the purge deletes rows through SQL,
and SQL publishes nothing, so a rebuild ending with no packages left the index
serving phantom vectors —2 measured over a library with zero embeddings—,
exactly the defect that 4.4 had fixed, reappearing through a new path. Fixed by
publishing a `remove_packages` after the commit of the purge.

**Validation against the real binary**, not only with tests, over a temporary
copy of 3 real `auto-design` videos (two with `rules.json`, one with
`analysis.json`, so as to exercise both schemas) and the real E5 model adopted
from `.cache/models`:

- initial `sync`: 3 packages, 252 units, 254 fragments and embeddings;
- `rebuild` without `--confirm` → code `2`; with `--force` → code `2`
  (`--force` does not exist for this command);
- `rebuild --confirm`: `status: "ok"`, 3 deleted, 3 reindexed, 24 s. The
  SHA-256 digests of units, fragments **and vectors** stayed identical bit for
  bit to the previous ones — confirmation on real data that with batch 1 the
  embedding is deterministic. `sync_runs` went from 1 to 2: the history was
  preserved and the run of the rebuild was added;
- `doctor`: the six checks as `ok`; `retrieve --depth focused`: `ok`, 3
  sources, **without `VECTORS_STALE` or any other warning**;
- with a `running` run injected by hand, `rebuild` was rejected with
  `SYNC_ALREADY_RUNNING` and code `1` **without deleting anything** (3 packages
  and 254 embeddings intact), naming `sync --source design --force` as the way
  out;
- a real repair: with a derived fragment corrupted, `sync` answered
  `no_changes` and left it intact —the gap, reproduced with the binary—, and
  `rebuild --confirm` removed it, returning the three digests to their original
  value.

The digest of the source tree was identical before and after the whole
procedure. The temporary copy and database were deleted on finishing.

**Point 1 of the priority order —sorting fragments by length before
batching— was closed without writing code.** It is inert with the
`batchSize = 1` that 4.3 adopted: the padding that the sorting attacks only
exists inside a batch of two or more. Detail in `docs/rebuild-design.md`,
section "Why point 1 was closed without code".

#### 4.7 Low-relevance warning (`LOW_RELEVANCE`)

Design in `docs/low-relevance-design.md` (blocks AI–AJ). Origin: a manual test
over the real library asked about symptoms of type 2 diabetes and received
`status: "ok"`, 31,982 tokens of content about web design and `warnings: []`.
The product had the signal that nothing answered the query and did not
communicate it.

- [x] AI. Measured threshold, `LOW_RELEVANCE` and its emission in
      `retrieveCandidates`
- [x] AJ. Distinction between an informational warning and a degradation, CLI
      contract, skill and closure

Closed on 14 August 2026. It closes —in a form different from the one
foreseen— the front that 2.2 left open as "a minimum vector similarity floor,
barring clear evidence" and that 3.2 could not close for lack of that evidence.

**The evidence, this time, exists.** 24 queries classified by hand against the
51 real videos, measuring the cosine of the best vector hit: in domain
0.8657–0.9012; techniques not covered 0.8428–0.8600; out of domain
0.8149–0.8389. The three classes do not overlap, but the margins are of
thousandths and E5 compresses everything between 0.81 and 0.90.

That fragility decided the design: **the warning informs and does not filter**.
A badly calibrated threshold produces at most one warning too many; it never
hides evidence nor empties a bundle. A floor that discards candidates is still
ruled out, just as in 2.2 and 3.2.

**A defect found while verifying against the binary, not with tests.** The first
version worked, but the receipt turned into `status: "partial"` with exit code
`1`: `run-cli.ts` treated any warning as a degradation. `LOW_RELEVANCE` is not
one —every path ran and the bundle is complete—, so
`informationalWarningCodes` was introduced to separate "something failed" from
"this is a datum about the answer". Verified afterwards against the binary:
`status: "ok"`, exit `0`, and the warning present both in `result.json` and in
the readable section of `context.md`.

**Reviewed after implementing it: `metrics.top_vector_similarity` was added.**
The cosine of the best vector hit is reported on every query, whether or not the
warning fires. A binary verdict delivered on its own only creates false
confidence by absence and contradicts the premise that the consuming agent is
the only brain. The first real run confirmed it: the out-of-domain query
measured 0.8399 against a floor of 0.84 — a ten-thousandth of margin.
