# Incremental indexing design

## Status

Specification approved on 10 August 2026. This document is the source of truth
for the entities, ports and SQLite schema of point 2.1. The implementation must
follow a plan and tasks reviewed before starting.

## Evidence inspected

Snapshot of 10 August 2026, the day this specification was approved. The figures
record what was inspected then, not the present size of the collection:
`auto-design` has grown since, and the current figures are in `decisions.md` and
`build.md`.

At that date the real `auto-design` collection contained 33 videos and one web
entry. All 33 `video_id`s and slugs were unique. Every video had `context.md`,
`rules.json` and `metadata.json`; together they contained 243 patterns. The
`rules.json` files shared the same shape and the pattern IDs were unique once
combined with their video.

The frontmatters of `context.md` vary slightly, but they share identity,
languages and provenance. `metadata.json` is an extensive and volatile yt-dlp
output, so it must not be copied whole into the index.

## Revisable assumptions

1. The `manifest.json` sitting above `videos/` is the authoritative inventory of
   each registered root. `source add` accepts the collection root or its
   `videos/` folder; on registering, both canonical paths are resolved and
   stored.
2. `video_id` identifies the video and `(source_name, video_id)` identifies the
   concrete package. The slug only locates files and may change.
3. The MVP processes `manifest.videos` only; it ignores `manifest.pages` without
   treating that as an error.
4. `context.md` and `rules.json` contribute knowledge. `manifest.json` and the
   selected subset of `metadata.json` contribute inventory, filters and
   provenance.
5. Source files are immutable for the RAG. All generated data is stored in the
   SQLite library.
6. A single SQLite instance administers multiple roots.

## Domain model

### `SourceRoot`

A root registered by the user. Its name is unique and stable; it keeps the
canonical paths of the collection, the manifest and `videos/`, along with the
enabled state and the registration date. The path can change through a future
explicit operation, but it is never inferred from a package's slug.

### `VideoPackage`

Represents one appearance of a video inside a root. Its natural identity is
`(sourceName, videoId)`. It keeps the slug, relative path, manifest stage,
stable metadata, package fingerprint and the last synchronisation in which it
was observed.

### `SourceDocument`

A file derived from a package with kind `context`, `rules`, `analysis` or
`metadata`. `rules` and `analysis` are mutually exclusive per package: every
real video carries either `rules.json` (schema 1.0) or `analysis.json`
(schema 2.0), never both — see "`analysis.json` support (schema 2.0)" in
`docs/decisions.md` and `docs/analysis-schema-design.md`. It keeps the relative
path, SHA-256 hash, size and versioned parser. A change of hash or of parser
version invalidates its derived data only.

### `KnowledgeUnit`

A broad unit that can be returned to the agent. It forms a hierarchy through
`parentId`, `depth` and `ordinal`. Initial types:

- `context_document` and `context_section`;
- `rules_document` and `rules_section`;
- `rule_pattern`, `rule_item`, `avoid_item` and `acceptance_criterion`;
- `analysis_document` and `analysis_section` (point 4.1, schema 2.0);
- `analysis_topic` and `analysis_recommendation`.

Every unit keeps rendered text, an optional structured representation, heading
path, existing timestamps, visual evidence, token estimate and provenance. Root
documents serve for expansion; they need not be search candidates if they exceed
the model's limit.

### `SearchFragment`

A small unit that does take part in FTS5 and embeddings. It belongs to a
`KnowledgeUnit` and keeps position, text and hash. Fragments respect semantic
boundaries — paragraphs, lists and JSON fields — and are split again according
to the input limit declared by the embedding generator. A match on a fragment is
then expanded to its unit and its parents.

### `EmbeddingRecord`

A vector associated with a fragment and a concrete model. It includes the model
identifier and version, dimension, fragment hash and the `float32` vector as a
BLOB. A different model key makes it possible to rebuild embeddings without
altering the units.

### `SyncRun` and `SyncIssue`

`SyncRun` records scope, start, end, status and counters. `SyncIssue` records
problems per package or file without aborting the rest. An invalid read keeps
the last valid version of the package and marks the result as partial.

## Deterministic identifiers

- Package: `(source_name, video_id)`.
- Document: `(package_id, document_kind)`.
- Markdown section: hash of the normalised heading path plus the occurrence
  number when a path repeats.
- Pattern: `pattern:<pattern.id>`, always within the package.
- Pattern child: type plus stable position within the pattern.
- Fragment: `(unit_id, ordinal)` plus `content_hash` for invalidation.

Renaming a heading creates a new unit; changing only its content preserves the
identity and replaces the affected fragments. SQLite's internal IDs are
surrogates and are never exposed as public identity.

## Admitted metadata

Only useful and relatively stable fields are kept:

- `video_id`, title, creator/channel and canonical URL;
- duration, publication date and languages;
- manifest stage and slug;
- tags and categories when they exist;
- visual profile and coverage declared in the deliverables;
- limitations and relative paths of evidence.

Counters, download formats, temporary URLs, cookies, headers and the complete
raw yt-dlp object are not indexed as knowledge.

## Application ports

The contracts use their own types; no SQLite, Transformers.js or filesystem type
crosses them.

### Reading and inventory

```ts
interface PackageSourceReader {
  readManifest(source: SourceRoot): Promise<ManifestSnapshot>;
  readPackage(ref: PackageRef): Promise<PackageSnapshot>;
}

interface SourceRegistry {
  add(source: SourceRoot): Promise<void>;
  getByName(name: SourceName): Promise<SourceRoot | null>;
  list(): Promise<readonly SourceRoot[]>;
  remove(name: SourceName): Promise<void>;
}
```

### Persistence and indexing

```ts
interface IndexStore {
  getPackageState(ref: PackageRef): Promise<IndexedPackageState | null>;
  applyPackage(change: IndexedPackageChange): Promise<void>;
  deletePackagesNotSeen(source: SourceName, syncId: SyncId): Promise<number>;
  recordRun(run: SyncRun): Promise<void>;
  recordIssue(issue: SyncIssue): Promise<void>;
}

interface EmbeddingGenerator {
  describe(): Promise<EmbeddingModelDescriptor>;
  countTokens(texts: readonly string[]): Promise<readonly number[]>;
  embedDocuments(texts: readonly string[]): Promise<readonly Float32Array[]>;
  embedQuery(query: string): Promise<Float32Array>;
}
```

`applyPackage` is an atomic operation: it replaces documents, units, fragments,
FTS rows and derived embeddings only after building a complete and valid
version.

### Future retrieval

```ts
interface KnowledgeRepository {
  getUnits(ids: readonly KnowledgeUnitId[]): Promise<readonly KnowledgeUnit[]>;
  getAncestors(
    ids: readonly KnowledgeUnitId[],
  ): Promise<readonly KnowledgeUnit[]>;
}

interface TextSearchIndex {
  search(request: TextSearchRequest): Promise<readonly SearchHit[]>;
}

interface VectorSearchIndex {
  load(model: EmbeddingModelDescriptor): Promise<void>;
  search(
    vector: Float32Array,
    request: VectorSearchRequest,
  ): Promise<readonly SearchHit[]>;
  apply(change: VectorIndexChange): Promise<void>;
}
```

The retrieval ports will be detailed in points 2.2 and 2.3. Only the
dependencies that indexing must feed are fixed here.

## Proposed SQLite schema

All dates use UTC ISO 8601 text; booleans use `INTEGER` with `CHECK`; JSON is
validated with `json_valid`. Foreign keys and WAL mode are enabled when the
database is opened.

```sql
CREATE TABLE schema_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE sources (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  collection_path TEXT NOT NULL UNIQUE,
  manifest_path TEXT NOT NULL UNIQUE,
  videos_path TEXT NOT NULL UNIQUE,
  enabled INTEGER NOT NULL DEFAULT 1 CHECK (enabled IN (0, 1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE sync_runs (
  id TEXT PRIMARY KEY,
  source_id INTEGER REFERENCES sources(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('running', 'ok', 'partial', 'failed')),
  started_at TEXT NOT NULL,
  finished_at TEXT,
  counters_json TEXT NOT NULL CHECK (json_valid(counters_json))
);

CREATE TABLE video_packages (
  id INTEGER PRIMARY KEY,
  source_id INTEGER NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  relative_path TEXT NOT NULL,
  manifest_stage TEXT,
  title TEXT,
  creator TEXT,
  canonical_url TEXT,
  duration_seconds INTEGER,
  published_at TEXT,
  source_language TEXT,
  context_language TEXT,
  tags_json TEXT CHECK (tags_json IS NULL OR json_valid(tags_json)),
  categories_json TEXT CHECK (categories_json IS NULL OR json_valid(categories_json)),
  visual_profile TEXT,
  package_hash TEXT NOT NULL,
  last_seen_sync_id TEXT NOT NULL REFERENCES sync_runs(id),
  indexed_at TEXT NOT NULL,
  UNIQUE (source_id, video_id)
);

CREATE TABLE source_documents (
  id INTEGER PRIMARY KEY,
  package_id INTEGER NOT NULL REFERENCES video_packages(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('context', 'rules', 'analysis', 'metadata')),
  relative_path TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  byte_size INTEGER NOT NULL CHECK (byte_size >= 0),
  parser_version TEXT NOT NULL,
  UNIQUE (package_id, kind)
);

CREATE TABLE knowledge_units (
  id INTEGER PRIMARY KEY,
  document_id INTEGER NOT NULL REFERENCES source_documents(id) ON DELETE CASCADE,
  parent_id INTEGER REFERENCES knowledge_units(id) ON DELETE CASCADE,
  stable_key TEXT NOT NULL,
  unit_type TEXT NOT NULL,
  depth INTEGER NOT NULL CHECK (depth >= 0),
  ordinal INTEGER NOT NULL CHECK (ordinal >= 0),
  title TEXT,
  content TEXT NOT NULL,
  structured_json TEXT CHECK (structured_json IS NULL OR json_valid(structured_json)),
  heading_path_json TEXT NOT NULL CHECK (json_valid(heading_path_json)),
  timestamps_json TEXT NOT NULL CHECK (json_valid(timestamps_json)),
  visual_evidence_json TEXT NOT NULL CHECK (json_valid(visual_evidence_json)),
  estimated_tokens INTEGER NOT NULL CHECK (estimated_tokens >= 0),
  content_hash TEXT NOT NULL,
  searchable INTEGER NOT NULL CHECK (searchable IN (0, 1)),
  UNIQUE (document_id, stable_key)
);

CREATE TABLE search_fragments (
  id INTEGER PRIMARY KEY,
  unit_id INTEGER NOT NULL REFERENCES knowledge_units(id) ON DELETE CASCADE,
  ordinal INTEGER NOT NULL CHECK (ordinal >= 0),
  title TEXT,
  heading_path TEXT NOT NULL,
  content TEXT NOT NULL,
  token_count INTEGER NOT NULL CHECK (token_count > 0),
  content_hash TEXT NOT NULL,
  UNIQUE (unit_id, ordinal)
);

CREATE VIRTUAL TABLE fragment_fts USING fts5(
  title,
  heading_path,
  content,
  content='search_fragments',
  content_rowid='id',
  tokenize='unicode61 remove_diacritics 2'
);

CREATE TABLE embeddings (
  fragment_id INTEGER NOT NULL REFERENCES search_fragments(id) ON DELETE CASCADE,
  model_key TEXT NOT NULL,
  model_version TEXT NOT NULL,
  dimensions INTEGER NOT NULL CHECK (dimensions > 0),
  content_hash TEXT NOT NULL,
  vector BLOB NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (fragment_id, model_key)
);

CREATE TABLE sync_issues (
  id INTEGER PRIMARY KEY,
  sync_id TEXT NOT NULL REFERENCES sync_runs(id) ON DELETE CASCADE,
  video_id TEXT,
  relative_path TEXT,
  code TEXT NOT NULL,
  message TEXT NOT NULL,
  retryable INTEGER NOT NULL CHECK (retryable IN (0, 1))
);
```

The initial migration will add triggers to keep `fragment_fts` synchronised with
`search_fragments`, indexes over frequent relations and filters, and an explicit
`schema_version`. The final SQL will live in infrastructure; this schema is its
logical contract.

## Synchronisation algorithm

1. Create a `SyncRun` and read the manifest without modifying it.
2. Validate each `manifest.videos` entry and build its `PackageRef`.
3. Compare hashes and parser/model versions against `IndexedPackageState`.
4. Skip packages with no changes.
5. Parse the changed documents completely in memory.
6. Build hierarchy, fragments and embeddings before persisting.
7. Apply each valid package in an atomic transaction.
8. Record issues and keep the last valid version of failed packages.
9. After completing a valid scan of the manifest, delete the packages that were
   not seen in that run.
10. Confirm the run as `ok` or `partial` and update the in-memory vector index
    only after the SQLite commit.

If the whole manifest is unreadable (the root is not an object, `videos` is not
an array, invalid JSON or an unreadable file), all the packages are not
interpreted as deleted. The run fails and the previous index stays intact.

**An individual invalid `manifest.videos` entry does not abort the whole
manifest.** Since 13 August 2026 (see `docs/decisions.md`, "Per-video tolerant
validation in the manifest"), a video with a broken schema or a duplicate
id/slug is dropped as a `ManifestVideoIssue` and the rest of the manifest is
processed all the same. `syncSource` records each one as a `SyncIssue` and, if
the video had a previously indexed version, marks it as seen so that it survives
the "not seen in this run" deletion — a video that regresses to an invalid
schema must never look deleted from the collection.

## Invariants

- No writes inside the source roots.
- A unit always belongs to exactly one document and package.
- A fragment never exceeds the limit declared by the model.
- An embedding matches its fragment in hash and its model in dimension.
- FTS5 contains exactly the persisted fragments.
- Repeating `sync` with no changes creates no rows and recomputes no embeddings.
- An isolated error does not destroy the last valid version of the package.
- Deletions are applied only after reading the manifest correctly.

## Tests required in order to implement

- Manifest parser with videos and pages mixed together.
- Stable identities under slug and content changes.
- Markdown hierarchy with repeated headings and skipped levels.
- Complete conversion of every observed shape of `rules.json`.
- Explicit selection of metadata and rejection of volatile fields.
- Fragmentation under the model's limit, even with a long block.
- Initial, repeated, modified and deleting synchronisation.
- An invalid package that keeps its last valid version.
- An invalid manifest that causes no deletions.
- SQLite atomicity, cascades, FTS5 triggers and reopening.
- Rebuilding on a parser or model change.

## Approved decisions

On 10 August 2026 the following were explicitly approved:

1. the separation between the broad `KnowledgeUnit` and the small
   `SearchFragment`;
2. the `(source_name, video_id)` identity of the package;
3. the metadata subset;
4. the granularity of `rules.json`;
5. the SQLite schema and the policy of keeping the last valid package.
