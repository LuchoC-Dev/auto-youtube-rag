# Agreed architecture

## Guiding principle

The system uses a domain-centred architecture with ports and adapters. The
indexing, retrieval and assembly rules remain independent of concrete models,
databases, libraries and agents.

```text
interfaces/cli ──→ application ──→ domain
                         ↑
infrastructure/adapters ─┘
```

`domain` imports no external layer. `application` orchestrates the domain and
declares the ports it needs. `infrastructure` implements those ports. The CLI
receives inputs and presents outputs, while `main` selects and wires the
concrete adapters.

## Module boundaries

| Module | Contains | Must not know about |
| --- | --- | --- |
| Domain | entities, value objects, rules and policies | SQLite, E5, ONNX, CLI |
| Application | use cases, internal DTOs and ports | concrete implementations |
| Infrastructure | SQLite, FTS5, E5 Small and vector search | presentation decisions |
| Interfaces | commands, validation and public formats | internal adapter details |
| Main | configuration and composition root | new business rules |

The minimum ports foreseen are `EmbeddingGenerator`, `KnowledgeRepository`,
`TextSearchIndex` and `VectorSearchIndex`. Their final names and signatures will
be specified before implementing, but their responsibility and dependency
direction are approved requirements.

## Overall flow

```text
Validated packages across several roots
              ↓
        incremental indexer
              ↓
  SQLite + FTS5 + exact in-memory index
              ↓
   high-coverage hybrid retrieval
              ↓
 hierarchical expansion and deduplication
              ↓
   Markdown package + JSON result
              ↓
         querying agent
```

## Responsibilities

### General skill

- Explain when and how to invoke the CLI.
- Choose the requested depth.
- Deliver the result to the agent.
- Not implement retrieval or provider-specific logic.

### CLI

- Validate arguments and configuration.
- Manage roots, indexing, search and diagnostics.
- Emit stable outputs and predictable process codes.
- Not generate answers through an LLM.

### Indexer

- Read `manifest.json`, `context.md`, `rules.json` and `metadata.json`.
- Create internal units per document, section and rule.
- Compute hashes and embeddings only when the content changes.
- Maintain parent-child relations without writing to the source packages.

### Retriever

- Combine FTS5, semantic similarity and filters.
- Initially retrieve a broad candidate set.
- Expand matches to parent sections or documents.
- Diversify by video and remove duplicates.

### Context assembler

- Respect the configured depth and budget.
- Organize the material by topic and relevance.
- Preserve provenance and limitations.
- Produce Markdown for direct consumption and JSON for integration.

## Hierarchical index

```text
Collection
  └─ Video
      ├─ Complete context.md document
      │   └─ Sections and subsections
      └─ rules.json
          └─ Patterns and rules
```

The hierarchy makes it possible to search with small units and return broad
units. No intermediate documents are created in the source folders.

## Persistence and portability

SQLite is the confirmed persistence for the MVP. FTS5 constitutes the initial
textual layer. The initial adapter will use `node:sqlite` on Node.js 24.19.0
LTS; the client will not cross the application ports. Embeddings are stored
together with:

- model identifier;
- version;
- dimension;
- content hash;
- indexing date.

The approved implementation of `VectorSearchIndex` loads the persisted BLOBs
into a contiguous `Float32Array` block and runs an exact search from the
application. E5 Small vectors are normalized, so ordering by L2 distance
produces the same ranking as cosine similarity. The in-memory index is rebuilt
on startup and updated after persisted changes are committed.

`sqlite-vec` is not part of the MVP runtime. It remains as a benchmark and as a
possible future adapter if memory or load time becomes a problem. A future
migration must not change the CLI, the skill or the domain.

`better-sqlite3` is not part of the MVP runtime either. It is kept as a
development dependency for the comparative benchmark. Replacing `node:sqlite` in
the future will only require another infrastructure adapter.

E5 Small is the approved embedding generator for the MVP and lives in an
infrastructure adapter. The model identifier, version and dimension are part of
the index metadata so that it can be detected when a replacement requires
reindexing. Changing the model does not modify the use cases.

## Decoupling verification

- The domain is tested without loading SQLite, ONNX or Transformers.js.
- Use cases are tested with in-memory implementations of the ports.
- Every adapter runs a shared contract suite.
- Integration tests verify the real wiring from the composition root.
- No type from an external dependency crosses a public port.

## Retrieval and assembly

```text
query
  → expansion and normalization
  → textual and semantic candidates
  → score combination
  → grouping by topic, section and video
  → expansion to parent units
  → deduplication and diversity
  → assembly up to the budget
```

The foreseen modes are `focused`, `balanced` and `deep`. Their initial budgets
and thresholds are 12k, 32k and 64k estimated tokens. Evaluations may adjust
those figures without changing the public names.

## Retrieval bundle

`retrieve` writes `context.md` and `result.json` into a temporary directory or
into the path given by `--out`. The terminal receives only a compact JSON with
the paths, metrics and warnings. This avoids truncating extensive context in
shells or agent tools.

The Markdown contains units cited through `[S01]` and equivalents. The JSON
resolves every citation to source, video, file, section, optional timestamp and
visual evidence. The RAG organizes evidence, but does not answer or infer on the
agent's behalf.

## Foreseen evolution

1. Local MVP for video packages.
2. Evaluations and retrieval tuning.
3. Web page packages.
4. Human interface.
5. Direct visual search and a specialized database if the scale requires it.
