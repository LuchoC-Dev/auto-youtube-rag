# Design for `analysis.json` support (schema 2.0)

## Status

**Approved on 13 August 2026, implemented and validated the same day.**
The four open decisions were resolved (see "Confirmed decisions" at the end).
Blocks P–T, complete. Real validation against the `auto-design` collection
in `docs/decisions.md`, section "`analysis.json` (schema 2.0) support:
implemented and validated".

## Context

On 2 August 2026 the package-producing skill
(`youtube-video-context`, a separate repository) replaced
`deliverables/rules.json` (schema 1.0) with `deliverables/analysis.json`
(schema 2.0) in a deliberate, documented breaking change (commit
`aecdde9`): "it stops producing a manual of design rules and starts producing
a general analysis". The shape of the content is incompatible, not a field
rename — see `docs/decisions.md`, section "`analysis.json` (schema 2.0)
support: approved design".

On 13 August the **amplifying** half of the problem was resolved (tolerant
per-video validation: a package with an unrecognised schema no longer blocks
the synchronisation of the rest of the source). This document designs the
**substantive** half: letting `auto-youtube-rag` index and retrieve the real
content of `analysis.json` instead of discarding it as a permanent issue.
Without this work, the 17 real `auto-design` videos that already use schema
2.0 — and every future video, because the skill is not going back to
`rules.json` — stay out of the library forever.

## Scope

| Inside this design                                                                        | Outside                                                                                                                   |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Parsing `analysis.json` (schema 2.0) as first-class indexable content                     | Migrating the 17 existing `analysis.json` videos to `rules.json` or the other way round                                   |
| A new `"analysis"` document type in the domain and in persistence                         | Deprecating or dropping support for `rules.json`/schema 1.0 (it keeps being indexed unchanged)                            |
| New `KnowledgeUnitType`s for `topics`/`recommendations`/`assessment`/the evidence section | Changing how the already excluded resources are treated (`transcript`, `frames`, `source_video`, etc.)                    |
| `assembleContext` bucketing for the new content                                           | The vector similarity threshold, MCP, the web interface (already outside the MVP)                                         |
| A SQLite migration for the new document `kind`                                            | Recalibrating RRF weights or per-depth budgets because of this new content (assessed later, with real data, not a priori) |

## Confirmed decision: support both schemas indefinitely

The 34 existing videos with `rules.json` do not regenerate themselves — the
producing skill explicitly declared that v1 "is not migrated automatically" —
so dropping schema 1.0 support would lose content that is already indexed and
validated. `auto-youtube-rag` treats `rules.json` and `analysis.json` as two
independent structured document types, selected by which one each real package
carries (`resources.rules` / `resources.analysis`), not as versions of a single
schema where one replaces the other.

## Decision: `structuredContent` as a mandatory enum, not two independent booleans

The original draft of this document proposed adding `analysis: boolean`
alongside `rules: boolean`, both optional in the raw read (an absent key →
`false`). It works, but two independent flags allow states that have no
business meaning: `{ rules: true, analysis: true }` should never happen (a real
package carries one kind of structured knowledge, not both), and every consumer
(`filesystem-package-source-reader.ts`, and any future code that depends on
"what structured content this video has") would have to repeat two independent
`if`s instead of handling a single exhaustive value.

**Correction adopted:** `ManifestResourceSnapshot` replaces `rules` and
`analysis` with a single mandatory, exhaustive field:

```ts
export const structuredContentKinds = ["rules", "analysis", "none"] as const;
export type StructuredContentKind = (typeof structuredContentKinds)[number];

export interface ManifestResourceSnapshot {
  readonly context: boolean;
  readonly structuredContent: StructuredContentKind;
  readonly metadata: boolean;
}
```

`manifest-reader.ts` still reads the raw `resources.rules` and
`resources.analysis` booleans from the JSON — each optional, an absent key
equalling `false`, for exactly the reason already explained: a schema 1.0
manifest does not declare `analysis` and a schema 2.0 one does not declare
`rules` — but it collapses them into a single `structuredContent` before
building the snapshot:

- `rules: true`, `analysis: false` → `"rules"`.
- `rules: false`, `analysis: true` → `"analysis"`.
- both `false` → `"none"` (a package with no structured content; that is
  already a valid case today when `resources.rules` is `false`, see
  `manifest-mixed.json`).
- **both `true` → schema error** (`MANIFEST_SCHEMA_INVALID`, field
  `resources`, "must not declare both rules and analysis"). It is not a case
  observed in reality; rather than tolerating it silently or indexing both
  documents, it is treated like any other invalid manifest entry — the video
  is discarded and reported as a `ManifestVideoIssue` thanks to the tolerant
  per-video validation already implemented, instead of aborting the whole
  manifest.

All the code that decides which file to read (`filesystem-package-source-reader.ts`)
goes from two independent conditionals to a single exhaustive `switch` over
`structuredContent`, with the same pattern already used in
`buildKnowledgeUnits` for `document.kind`: if a third kind of structured
content appears in the future, TypeScript forces it to be handled instead of
letting it fall through silently on an `if` nobody updated.

## Data contract of `analysis.json` (schema 2.0)

Confirmed against `references/authoring.md` in the real repository of the
producing skill:

```json
{
  "schema_version": "2.0",
  "source": { "video_id", "title", "url", "creator", "duration_seconds", "language" },
  "analysis_lens": { "lens", "rationale", "chosen_by": "agent" | "user" },
  "summary": "string",
  "topics": [
    {
      "id", "title", "what_the_source_says",
      "evidence_class": "direct" | "visual" | "time_bound" | "unverified",
      "timestamps": ["string"], "visual_evidence": ["string"],
      "analyst_note": "string | omitted"
    }
  ],
  "recommendations": [
    { "id", "recommendation", "rationale", "confidence": "high" | "medium" | "low" }
  ],
  "assessment": { "strengths": ["string"], "weaknesses": ["string"], "verdict", "basis" },
  "evidence_boundary": { "transcript", "frames", "analyst_opinion", "unverified" }
}
```

All the content of `analysis.json` is always in English (except
`source.title`/`source.creator`, verbatim), unlike `context.md`, which follows
the language of the dossier — a fact already relevant for multilingual
retrieval that requires no special treatment: FTS5/E5 are already
language-agnostic by design.

## New application snapshots (`package-snapshots.ts`)

```ts
export const analysisEvidenceClasses = [
  "direct",
  "visual",
  "time_bound",
  "unverified",
] as const;
export type AnalysisEvidenceClass = (typeof analysisEvidenceClasses)[number];

export const analysisConfidenceLevels = ["high", "medium", "low"] as const;
export type AnalysisConfidence = (typeof analysisConfidenceLevels)[number];

export interface AnalysisTopicSnapshot {
  readonly id: string;
  readonly title: string;
  readonly whatTheSourceSays: string;
  readonly evidenceClass: AnalysisEvidenceClass;
  readonly timestamps: readonly string[];
  readonly visualEvidence: readonly string[];
  readonly analystNote: string | null;
}

export interface AnalysisRecommendationSnapshot {
  readonly id: string;
  readonly recommendation: string;
  readonly rationale: string;
  readonly confidence: AnalysisConfidence;
}

export interface AnalysisAssessmentSnapshot {
  readonly strengths: readonly string[];
  readonly weaknesses: readonly string[];
  readonly verdict: string;
  readonly basis: string;
}

export interface AnalysisEvidenceBoundarySnapshot {
  readonly transcript: string;
  readonly frames: string;
  readonly analystOpinion: string;
  readonly unverified: string;
}

export interface AnalysisLensSnapshot {
  readonly lens: string;
  readonly rationale: string;
  readonly chosenBy: "agent" | "user";
}

export interface AnalysisDocumentSnapshot {
  readonly kind: "analysis";
  readonly schemaVersion: string;
  readonly analysisLens: AnalysisLensSnapshot;
  readonly summary: string;
  readonly topics: readonly AnalysisTopicSnapshot[];
  readonly recommendations: readonly AnalysisRecommendationSnapshot[];
  readonly assessment: AnalysisAssessmentSnapshot;
  readonly evidenceBoundary: AnalysisEvidenceBoundarySnapshot;
}
```

The `source.*` of `analysis.json` is not copied into a snapshot of its own: it
duplicates what `metadata.json` already contributes to
`SelectedMetadataSnapshot`, and that is the one already feeding `VideoPackage`.
Just like `rules.json` today, `analysis.json` is not the package's source of
metadata.

`PackageDocumentSnapshotBase` is extended with the `TKind` `"analysis"`,
`AnalysisPackageDocumentSnapshot` is added and joins the
`PackageDocumentSnapshot` union — the same pattern as
`RulesPackageDocumentSnapshot`.

## New parser: `analysis-json-parser.ts`

A mirror of `rules-json-parser.ts`: it validates the exact shape, requires the
six fields of every `topic` (`id`, `title`, `what_the_source_says`,
`evidence_class`, `timestamps`, `visual_evidence`), the four of every
`recommendation`, ids with the same structural pattern as `patternId`
(`readStructuralSegment`), detects duplicate topic/recommendation ids, and
validates the `evidence_class`/`confidence`/`chosen_by` enums against closed
lists. It does not repeat the full editorial discipline of the producing
skill's validator (length, coverage exhaustiveness): it only recognises a
parseable shape, just as `rules-json-parser.ts` does not repeat the authoring
rules of `rules.json`.

Error codes: `ANALYSIS_SCHEMA_INVALID`, `ANALYSIS_VIDEO_ID_MISMATCH`,
`ANALYSIS_DUPLICATE_TOPIC_ID`, `ANALYSIS_DUPLICATE_RECOMMENDATION_ID`.

## Reading the package (`filesystem-package-source-reader.ts`)

The block that today is `if (manifestVideo.resources.rules) { ... }` is
replaced by a single exhaustive `switch` over `structuredContent`:

```ts
switch (manifestVideo.resources.structuredContent) {
  case "rules": {
    const relativePath = "deliverables/rules.json";
    // read, parse with parseRulesJson, push into documents
    break;
  }
  case "analysis": {
    const relativePath = "deliverables/analysis.json";
    // read, parse with parseAnalysisJson, push into documents
    break;
  }
  case "none":
    break;
}
```

A real package carries `rules.json` **or** `analysis.json`, never both; with
the enum, that "never both" is guaranteed by construction (the manifest already
rejected it as a schema error if it declared both), not merely assumed by
convention. The `switch` is exhaustive: if a third `StructuredContentKind` is
added in the future, `tsc` forces it to be handled here before it compiles.

## Knowledge units (`build-knowledge-units.ts`)

Four new `KnowledgeUnitType`s, symmetric to the pattern already used for
`rules_document`/`rules_section`/`rule_pattern`/children:

```ts
"analysis_document",    // root, depth 0, not searchable — summary + lens
"analysis_section",     // depth 1 — "Summary", "Evidence boundary", "Assessment", the "Topics"/"Recommendations" header
"analysis_topic",       // depth 2, child of the "Topics" section
"analysis_recommendation", // depth 2, child of the "Recommendations" section
```

`assessment` does not need a `unitType` of its own: unlike `topics` and
`recommendations` (arrays with their own `id`, one per element, just like
`patterns[]`), `assessment` is a single object of four fields — it fits whole
into one searchable `analysis_section`, just like `coreThesis` of `rules.json`
today. `evidence_boundary` gets the same treatment as `evidence` in
`rules.json`: a searchable `analysis_section` of its own, so that an agent can
retrieve "what the transcript establishes vs. what is the analyst's opinion"
directly without pulling in the whole document.

There is no need to migrate `search_fragments`/embeddings in any special way:
the fragmentation pipeline (`fragmentKnowledgeUnits`) already operates on
`KnowledgeUnit.content`/`estimatedTokens` without knowing the unit type.

## Bucketing in `assembleContext` (a product decision)

`classifyContextSection` (`context-blocks.ts`) uses two fixed sets,
`highestRelevanceTypes` and `relatedRulesTypes`, with a fallback to
`additional_context` for any type not listed — so technically this already
"works" without touching code (everything falls into the third section). The
question is whether that fallback is the right place.

Proposal:

- `analysis_document`, `analysis_section`, `analysis_topic` →
  `highestRelevanceTypes`. They play the same role as `context_section`/
  `rules_section`: they are the substantive narrative coverage of the video —
  `topics[]` is, in spirit, what replaces the thematic sections.
- `analysis_recommendation` → `relatedRulesTypes`. It is not literally a
  "rule" or a "pattern", but it shares the functional role: prescriptive,
  actionable content derived from the analysis, closer in tone to
  `rule_item`/`acceptance_criterion` than to pure narrative coverage.

**Confirmed decision: reuse the two fixed bundle sections already approved and
published** in `cli-contract.md` ("Highest-relevance context", "Related rules
and patterns"), without renaming them or adding a third. The alternative — a
fourth "Assessment and recommendations" section — would have been semantically
more precise, but it changes the wire contract already consumed by the portable
skill (`skill/SKILL.md`) and by real agents in production. The cost of a
slightly imprecise "Related rules and patterns" label for a recommendation is
low compared with breaking an already published contract, and it is reversible
later on if Layer B of a future evaluation shows that it confuses agents.

## SQLite migration: the finding that changes the scope the most

`source_documents.kind` today has `CHECK (kind IN ('context', 'rules',
'metadata'))`. Adding `'analysis'` requires a real migration, and
**`open-database.ts` supports none today** — it only knows how to create the
full schema in an empty database or to reject any database that is not already
exactly at `schema_version = '1'`. No mechanism exists yet to take an existing,
populated v1 database to v2.

Two paths:

1. **Build the first real migrator** (`migrations/002-analysis-kind.ts` plus
   logic in `open-database.ts` that applies 002 over a v1 database: SQLite
   does not support `ALTER TABLE ... DROP CONSTRAINT`, so the standard pattern
   is to create a new `source_documents` with the correct `CHECK`, copy the
   rows, replace the table, update `schema_meta.schema_version` to `'2'`,
   all in one transaction). It is the correct long-term solution — it unblocks
   any future schema evolution, not just this one — but it is new
   infrastructure work, not just one more migration.
2. **Edit `001-initial.ts` in place** so that the `CHECK` already includes
   `'analysis'` from the origin, without adding a 002 migration. Far simpler,
   but only safe if **no real, persistent SQLite database built with the
   current schema exists yet** — otherwise rewriting an already applied
   migration silently breaks any existing installation
   (`assertCompatibleVersion` would still see `schema_version = '1'` but the
   real `CHECK` would no longer match what the code expects to be able to
   write).

**Confirmed decision: path 2.** The user confirmed that no real, persistent
`.auto-youtube-rag/index.sqlite` database exists outside this repository —
only already deleted temporary copies from earlier validations (2.1, 2.2, 2.3,
M4). Two real source collections generated by the same producing skill do
exist (`auto-design` and `design-catalog`, the latter with a few more videos),
but neither has a persistent SQLite index built from it yet — they are
collections of packages on disk, not `auto-youtube-rag` databases.
`design-catalog` is noted as an additional candidate for block T. If this
reading were incorrect — if a real index was created and is still kept outside
this repo — say so before block S is run: editing `001-initial.ts` over a
real, already populated database would leave it in an inconsistent state (a new
`CHECK`, but a `schema_version` out of date with respect to what the code of
that moment expected).

## Documents to update when implementing (see T3)

- `docs/product-spec.md`: add `analysis.json` to the indexed content table.
- `docs/indexing-design.md`: documents, units and the synchronisation
  algorithm.
- `docs/context-assembly-design.md`: extended bucketing.
- `docs/decisions.md`: close with the real result of the implementation
  (T1/T2), not just with the design decision already recorded.
- `docs/agent-handoff.md`: close the item already noted as pending.
- `evals/queries/seed-queries.json` and a future evaluation pass (outside
  this block): the current 8 seed queries only exercise `rules.json` content;
  at some point it is worth seeding queries that specifically exercise
  `analysis.json` content — it is not part of this design, it is noted here so
  as not to lose it.

## Block plan

- **Block P** — contracts: application snapshots, extended
  `ManifestResourceSnapshot`, optional `readResource`, new `KnowledgeUnitType`s,
  extended `sourceDocumentKinds`.
- **Block Q** — `analysis-json-parser.ts` and its tests.
- **Block R** — extended `build-knowledge-units.ts`, package reading in
  `filesystem-package-source-reader.ts`, tests.
- **Block S** — SQLite migration (path 1 or 2 according to the decision),
  bucketing in `context-blocks.ts`, tests.
- **Block T** — real E2E: copy the `auto-design` collection (and, time
  permitting, `design-catalog`), synchronise including the videos with
  `analysis.json`, run `retrieve` over at least one new seed query aimed at
  that content, qualitative inspection, verify the SHA-256 digest before and
  after, delete the copy.

## Confirmed decisions (13 August 2026)

1. **Support both schemas indefinitely.** `rules.json`/schema 1.0 is neither
   frozen nor deprecated.
2. **Bucketing:** reuse the two existing fixed bundle sections
   (`highest_relevance` for topics, `related_rules` for recommendations)
   without renaming them. Neither `cli-contract.md` nor `skill/SKILL.md` is
   touched by this change.
3. **SQLite migration:** path 2 — edit `001-initial.ts` in place to include
   `'analysis'` in the `CHECK` of `source_documents.kind` from the origin.
   Confirmed that no real, persistent `.auto-youtube-rag/index.sqlite` database
   exists to preserve; `auto-design` and `design-catalog` are source
   collections on disk, not indexes already built.
4. **Block T included** in this work, not postponed.
