# Hybrid retrieval design

## Status

Specification proposed on 11 August 2026 for point 2.2. This document is the
source of truth for retrieval's contracts, adapters and fusion policy. It
continues [indexing-design.md](indexing-design.md), which already reserved the
signatures of `KnowledgeRepository`, `TextSearchIndex` and `VectorSearchIndex`.

## Scope

Point 2.2 delivers candidates that have been retrieved, fused, diversified and
given complete provenance. It does not assemble `context.md`, does not apply
per-depth budgets and exposes no CLI surface.

| Inside 2.2                     | Outside 2.2 (belongs to 2.3)         |
| ------------------------------ | ------------------------------------ |
| Normalised query and filters   | `focused`/`balanced`/`deep` presets  |
| FTS5 search with `bm25()`      | Token budget                         |
| Exact vector search with E5    | Expansion to parent units            |
| Weighted RRF fusion            | Writing `context.md`                 |
| Deduplication and diversity    | Assigning `[S01]` citations          |
| Provenance down to the package | Writing the bundle and `result.json` |
| Metrics and warnings           | The `retrieve` command               |

`retrieve` is not announced as available until 2.3 is closed.

## Approved fusion decision

On 11 August 2026 **weighted RRF behind a replaceable interface** was approved,
resolving the only open matter of [product-spec.md](product-spec.md).

`bm25()` returns negative values with no stable bound and cosine similarity
lives in `0..1`. They are not comparable, and normalising them per batch would
make the ordering depend on which other candidates appeared. RRF ignores the
magnitude and combines positions only:

```text
score(f) = Σ  w_i / (k + rank_i(f))
```

Baseline: `k = 60`, `wText = 1.0`, `wVector = 1.0`. A fragment appearing in a
single list keeps its contribution; a fragment flagged by both paths wins by
consensus. That preservation of the exclusive hits is the reason for the
decision: the product's success criterion is broad coverage, not a single
match.

The cascade — one path filters and the other reranks — was rejected because it
eliminates the hits that only one path finds. At the real scale (2,967
fragments, ~1.1 MB of vectors) running both paths in full has no relevant cost,
so the cascade contributes no performance and only reduces recall.

Known and accepted limitation: RRF discards the distance between scores. Two
fragments with cosine 0.95 and 0.40 are treated as first and second. That is why
the strategy stays behind `FusionStrategy` and the weights get calibrated in
stage 3.2 with real queries, without modifying use cases or adapters.

## Retrieval model

### Normalised query

`RetrievalQuery` is a domain value object. It normalises the text to NFC, trims
whitespace and rejects queries that are empty or made only of punctuation. It
does not alter accents or capitalisation: `remove_diacritics 2` already resolves
the diacritics on the FTS5 side, and E5 receives the original text.

```ts
interface RetrievalQuery {
  readonly text: string;
  readonly filter: RetrievalFilter;
  readonly limits: RetrievalLimits;
}

interface RetrievalFilter {
  readonly sources: readonly SourceName[];
  readonly videoIds: readonly VideoId[];
  readonly languages: readonly string[];
  readonly unitTypes: readonly KnowledgeUnitType[];
}

interface RetrievalLimits {
  readonly textCandidates: number; // 100 by default
  readonly vectorCandidates: number; // 100 by default
  readonly fusedResults: number; // 50 by default
  readonly maxPerVideo: number; // 4 by default
}
```

An empty filter means "no restriction". The limits are on candidates, not on
tokens; the budget is a matter for 2.3.

The query admits at most 1,000 characters. The limit stops a document pasted by
mistake from reaching the embedding model or the FTS5 parser; an agent's real
queries are much shorter. Internal whitespace is collapsed as well, so that two
spellings of the same query produce the same result.

Language tags are compared in lower case because the indexed packages declare
them inconsistently. The filter lists keep the first appearance of each
criterion: repeating a value never changes the resulting SQL.

### Hits and candidates

Each path returns `RankedHit`, with the position already resolved by the
adapter. The use case never compares raw scores across paths.

```ts
interface RankedHit {
  readonly fragmentId: SearchFragmentId;
  readonly rank: number; // 1-based, dense, with no gaps
  readonly rawScore: number; // diagnostics and evaluation; never fused
}

interface RetrievalCandidate {
  readonly fragmentId: SearchFragmentId;
  readonly unitId: KnowledgeUnitId;
  readonly packageRef: PackageRef;
  readonly fusedScore: number;
  readonly textRank: number | null;
  readonly vectorRank: number | null;
  readonly provenance: CandidateProvenance;
}
```

`provenance` carries the heading path, unit type, title and relative path of the
document, creator, timestamps and visual evidence. It is the raw material with
which 2.3 builds `[S01]`. No SQLite row or Transformers.js tensor crosses these
boundaries.

### Result

```ts
interface RetrievalOutcome {
  readonly status: "ok" | "no_results";
  readonly candidates: readonly RetrievalCandidate[];
  readonly metrics: RetrievalMetrics;
  readonly warnings: readonly RetrievalWarning[];
}
```

A query with no matches is `no_results` with an empty `candidates`: it is a
valid terminal state, not an error, and corresponds to process code `0`
according to [cli-contract.md](cli-contract.md).

## Ports

```ts
interface TextSearchIndex {
  search(request: TextSearchRequest): Promise<readonly RankedHit[]>;
}

interface VectorSearchIndex {
  load(model: EmbeddingModelDescriptor): Promise<void>;
  search(
    vector: Float32Array,
    request: VectorSearchRequest,
  ): Promise<readonly RankedHit[]>;
  apply(change: VectorIndexChange): Promise<void>;
}

interface KnowledgeRepository {
  getFragmentProvenance(
    ids: readonly SearchFragmentId[],
  ): Promise<readonly CandidateProvenance[]>;
  getUnits(ids: readonly KnowledgeUnitId[]): Promise<readonly KnowledgeUnit[]>;
  getAncestors(
    ids: readonly KnowledgeUnitId[],
  ): Promise<readonly KnowledgeUnit[]>;
}

interface FusionStrategy {
  fuse(input: FusionInput): readonly FusedHit[];
}
```

`VectorSearchIndex` extends the current `VectorIndexSink` with reading. That is
deliberate: today `MemoryVectorIndexSink` receives changes but does not query,
and keeping two objects with different copies of the same vectors would let them
diverge. `sync` still publishes exclusively after the SQLite commit.

`getUnits` and `getAncestors` are declared and implemented in 2.2 because the
repository is a single adapter, but their real consumption happens in 2.3.

## Textual adapter

`SqliteTextSearchIndex` queries `fragment_fts` and orders by `bm25()`.

### Query sanitisation

The grammar of `MATCH` is not `LIKE`. A raw query such as `diseño 3d: guía
(2024)` throws a syntax error, and words like `OR`, `NEAR` or `NOT` are
interpreted as operators. The adapter turns the text into a safe query:

1. extract as tokens the sequences of letters and numbers, exactly what the
   `unicode61` tokenizer considers a token;
2. discard everything else — quotes, colons, asterisks, circumflex accents,
   parentheses and hyphens are separators, so hostile punctuation never reaches
   the parser;
3. deduplicate tokens without distinguishing case, because FTS5 folds case when
   indexing;
4. wrap each token in double quotes, which turns `OR`, `NOT` and `NEAR` into
   literal terms;
5. limit to 64 tokens so as not to exhaust FTS5's expression depth;
6. join with an explicit `OR` to maximise coverage;
7. if no token is left, return `null` and run no SQL.

The suite verifies every generated expression against a real FTS5 `MATCH`: the
engine's grammar is the only authority on whether a query parses.

The user never writes FTS5 syntax; no operator of theirs is honoured. This is a
decision about security and predictability, not a temporary limitation.

### Score and ordering

`bm25()` gets more negative the better the match, so the ordering is `ASC`. The
columns are weighted `title = 3.0`, `heading_path = 2.0`, `content = 1.0`: a
fragment whose heading names the concept is usually better context than one that
mentions it in passing. The tie-break is `fragment_id ASC` so that the ordering
is fully deterministic.

The filters are applied with a `JOIN` over `search_fragments`,
`knowledge_units`, `source_documents`, `video_packages` and `sources`, after the
`MATCH`, so as not to invalidate the use of the FTS index.

## Vector adapter

`InMemoryVectorSearchIndex` keeps a contiguous `Float32Array` of
`fragments × 384` plus a parallel array of identities and filter attributes.

### Loading

It is built lazily from SQLite, not when the application is created: opening the
CLI for `source list` must not read 1.1 MB of BLOBs nor touch the model.

`sync` publishes changes that carry vectors and identities, but not the unit
type or the language that retrieval filters on. That is why `apply` does not
patch the index — it would leave new entries impossible to filter — but instead
discards the snapshot and lets the next query rebuild it. SQLite is already the
source of truth and the change is published after the commit, so the rebuild is
always correct and costs milliseconds at this scale. Restarting the process
rebuilds by the same route.

### Model validation

Before querying, the `model_key`, `model_version` and `dimensions` of the
persisted embeddings are compared against the descriptor of the active
generator. A discrepancy produces an explicit error with a symbolic code, never
a silent comparison between different vector spaces.

### Similarity

The vectors are already normalised during indexing, so the dot product is
equivalent to the cosine and avoids a square root per fragment. The query is
embedded with E5's `query:` prefix — the asymmetric prefix is part of the
model's contract and using `passage:` would degrade quality. The sweep is exact
over every fragment that passes the filter; at this scale it costs milliseconds
and avoids the approximation error of an ANN index.

## Orchestration

`retrieveCandidates` is the use case and knows only ports:

1. normalise and validate the query;
2. launch both searches in parallel;
3. if one path fails, record a warning and continue with the other — a degraded
   retrieval is preferable to none;
4. fuse with `FusionStrategy`;
5. hydrate the provenance of the complete fused set in a single batched query;
6. deduplicate: keep the best fragment per `unitId`;
7. diversify: apply `maxPerVideo` walking in score order;
8. truncate to `fusedResults`;
9. return `RetrievalOutcome` with metrics.

Deduplication precedes diversity deliberately: two fragments of the same section
are redundancy, whereas two different sections of the same video are legitimate
context up to the per-video limit.

Implementation note: hydration was brought forward with respect to the original
order of this document. `RankedHit` carries only `fragmentId`; neither
deduplication by `unitId` nor diversity by video is possible without knowing the
provenance, so both stages need the hydrated batch. The set to hydrate is
bounded by `textCandidates + vectorCandidates`, so it remains a single batched
query, not one per candidate. A fused hit with no provenance — a deletion racing
with the query — is discarded instead of being shown without evidence.

## No threshold in the vector search

Vector search is an exhaustive ranking, not a filter: every query returns all
the fragments that pass the metadata filter, ordered by similarity, up to
`vectorCandidates`. There is no minimum similarity floor.

This means that `status: "no_results"` only happens when the filter leaves the
library empty or when both paths fail; a query over a non-empty library with no
restrictive filters always returns candidates, even if their real semantic
similarity is low. The retrieval E2E confirms it: verifying that a deletion
"disappears from both rankings" requires filtering by the deleted video, not
just repeating the original query, because the rest of the library still appears
through the vector path.

The question of a minimum similarity threshold was settled in point 4.7. The
floor exists — `0.84`, calibrated over 24 hand-classified queries — but it only
raises the `LOW_RELEVANCE` warning and reports `top_vector_similarity`: it never
discards candidates, so the statement above still holds in full. The rationale
and the calibration are in [low-relevance-design.md](low-relevance-design.md).

## Determinism

The same query over the same database produces exactly the same ordering. That
is achieved with explicit tie-breaks at every stage: `bm25` breaks ties by
`fragment_id`, similarity breaks ties by `fragment_id`, and fusion breaks ties
by score, then by lower textual rank, then by `fragment_id`. No stage depends on
the resolution order of promises nor on the iteration order of a `Map` built
concurrently.

## Invariants

- No retrieval operation writes to SQLite or to the sources.
- No retrieval operation accesses the network.
- No candidate is returned without complete provenance.
- Raw scores from different paths are never compared.
- Embeddings of a model other than the active one are never queried.
- The vector index never contains fragments absent from SQLite.
- A deleted package disappears from both rankings without rebuilding the
  database.
- The user's query is never interpreted as FTS5 syntax.

## Required tests

- Sanitisation: accents, capitals, quotes, hyphens, parentheses, `OR`, `*`, an
  empty query and a punctuation-only query.
- FTS5: rare exact term, frequent term, no results, filters by
  source/video/language/unit type.
- Vector: paraphrase with no shared vocabulary, multilingual query, incorrect
  dimension, absent model, database with no embeddings.
- Fusion: an exclusively textual hit, an exclusively vector one, consensus,
  ties, asymmetric weights and determinism across runs.
- Diversity: one dominant video does not monopolise the result.
- Life cycle: `sync` makes a new package queryable without a restart; deleting a
  package withdraws it from both paths; restarting rebuilds the index.
- Degradation: a downed path produces a warning and results from the other.

The fast tests use a fake, deterministic embedding generator. The real model
only takes part in the already existing smoke test.

## Closing criterion

2.2 is marked complete when the tests demonstrate the eight points of the
provisional criterion of [agent-handoff.md](agent-handoff.md), the fast suite
stays offline and `npm run check` and `npm run build` pass.
