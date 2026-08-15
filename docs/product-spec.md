# Product specification: auto-youtube-rag

## Status

`SPECIFY` phase. The confirmed decisions are the source of truth; the matters
marked as pending must not be resolved during implementation without first
updating this specification.

## Goal

Build a local RAG library that indexes the validated packages produced by the
video skill and hands an agent a broad, ordered, deduplicated and cited
thematic context package.

The product does not contain an internal generative agent. The agent running the
query is the only one responsible for interpreting the context and writing the
answer.

### Target capabilities

- Find videos that deal with a concept.
- Search for elements and characteristics described visually.
- Compare recommendations across several videos.
- Retrieve rules, patterns, procedures and antipatterns.
- Expose agreements, differences and contradictions between sources.
- Assemble enough context for broad factual queries.

Locating specific moments of a video is not a function of the product. Existing
timestamps may be kept solely as provenance.

## Success criterion

Given a query, the system retrieves and organises a sufficiently broad portion
of the relevant knowledge, removes repetitions, preserves provenance and builds
a cited package within a configurable budget. The agent must be able to answer
based mainly on that package, without consulting the original videos.

The result is not limited to a small fixed number of fragments. The search
retrieves candidates with high coverage, expands the matches to their parent
sections, diversifies sources and assembles context until it reaches the budget.

## Users and compatibility

- MVP consumed by agents, not by humans.
- Minimum compatibility with Codex and Claude.
- Provider-neutral design.
- A single canonical skill, installable or linkable from different agents.
- Human interface reserved for a later phase.

## Input sources

The system supports several registered roots, initially:

- `auto-design\videos`
- `catalog-design\videos`

Every package keeps its original structure. The indexer does not add or modify
files inside those packages.

| Source                       | Use in the MVP                                                                                        |
| ---------------------------- | ----------------------------------------------------------------------------------------------------- |
| `manifest.json`              | Inventory and status; not a semantic corpus                                                           |
| `deliverables/context.md`    | Main source of knowledge                                                                              |
| `deliverables/rules.json`    | Structured patterns and rules (schema 1.0)                                                            |
| `deliverables/analysis.json` | Structured general analysis (schema 2.0, point 4.1); mutually exclusive with `rules.json` per package |
| `source/metadata.json`       | Identity, filters and provenance                                                                      |
| `transcript/source.txt`      | Optional backup; not indexed by default                                                               |
| VTT files                    | Not indexed                                                                                           |
| `visual/coverage.json`       | Evidence metadata                                                                                     |
| Images                       | Path preserved; no embeddings in the MVP                                                              |

## MVP scope

- Register multiple package roots.
- Index and synchronise video packages incrementally and idempotently.
- Detect additions, changes and deletions through content hashes.
- Run textual, semantic and metadata search.
- Retrieve documents, sections and rules hierarchically.
- Deduplicate and diversify sources.
- Assemble a context package with configurable depth.
- Deliver Markdown for the agent and versioned JSON for integration.
- Include provenance, coverage and limitations.
- Provide a local CLI consumable from the general skill.

## Outside the MVP

- Chat or internal LLM.
- MCP.
- Remote API.
- Web interface for humans.
- Direct processing of raw videos.
- Semantic indexing of images.
- Additional OCR.
- GraphRAG.
- Packages produced by the web page skill.

## Confirmed stack

- Language: strict TypeScript 6.0.3.
- Runtime: Node.js 24 or higher, ESM modules.
- Packaging: npm with `package-lock.json`.
- Architecture: central domain with ports and adapters.
- Initial persistence: SQLite behind a replaceable port.
- Textual search: SQLite FTS5.
- Semantic search: local multilingual E5 Small, implemented as an adapter.
- Vectors: versioned BLOB in SQLite and exact in-memory `Float32Array` index.
- Integration: CLI and a single portable skill.

The toolchain uses `tsc`, ESLint with type information, Prettier and
`node:test`; its commands are defined in [development.md](development.md). The
administrative CLI uses `node:util.parseArgs` in strict mode, without bringing
in an additional framework. The decision keeps a small and portable surface.

## Approved CLI contract

The complete specification is in [cli-contract.md](cli-contract.md). The public
surface of the MVP is:

```text
auto-youtube-rag source add <path>
auto-youtube-rag source list
auto-youtube-rag sync
auto-youtube-rag retrieve <query> --depth <focused|balanced|deep>
auto-youtube-rag status
auto-youtube-rag doctor
auto-youtube-rag rebuild --confirm
```

`sync` covers initial and incremental indexing. `retrieve` produces a bundle
with `context.md` and `result.json`, and emits on `stdout` only a compact
receipt. The initial presets are `focused` = 12k, `balanced` = 32k and `deep` =
64k estimated tokens, replaceable through `--max-tokens`.

The development, testing, lint and build commands are defined in
[development.md](development.md). The CLI uses `0` for success, `1` for an
operational failure or a partial result, `2` for invalid usage and `130` for an
interruption through `Ctrl+C`; the concrete causes are expressed with symbolic
codes in JSON.

## Architecture and conceptual structure

The domain defines the vocabulary, the invariants and the contracts that the use
cases need. It knows nothing about Transformers.js, E5 Small, SQLite, FTS5, file
formats or CLI frameworks. Those details are implemented as adapters and are
wired exclusively from the composition root.

```text
skill/                    portable skill that teaches how to use the CLI
src/domain/               entities, value objects and pure rules
src/application/          use cases and required ports
src/infrastructure/       model, search and persistence adapters
src/interfaces/cli/       commands, validation and presentation
src/main/                 composition root and configuration
tests/                    unit, contract and integration tests
evals/                    retrieval quality evaluations
docs/                     specifications, decisions and progress
```

This structure is conceptual and does not yet authorise the creation of `src/`.

The ports must allow replacing at least the embedding generator, the persistent
repository, the textual search and the vector search. Changing an adapter may
require migrating or rebuilding indexes, but it cannot alter the domain, the use
cases or the public contract of the CLI.

## Code style

Strict TypeScript, explicit names, types on every public boundary and small
functions. Dependencies always point towards the domain: adapters implement
internal ports and the core never imports infrastructure packages or
provider-specific types.

## Testing strategy

### During development

- Unit tests of the domain and the ranking.
- Reusable contract tests for each adapter.
- Integration tests with a temporary SQLite database.
- CLI tests.
- Repeated indexing without duplicates.
- Verifiable updating and deletion.
- Compatibility of the output schema.
- Deterministic retrieval over small fixtures.

### On completing the MVP

- Recall, precision and thematic coverage evaluations.
- Real queries in Spanish and English.
- Comparison of small embedding models.
- Evaluation of the context with Codex and Claude.
- Cases without an answer and contradictory sources.

## Expected scale

- Approximately 40 initial videos.
- Estimated average growth: 4 videos per day.
- Estimated peaks: up to 10 videos per day.
- Local execution and no concurrent human users in the MVP.

## Limits of action

### Always

- Preserve the original packages.
- Keep provenance and a versioned schema.
- Validate inputs and hashes.
- Run the tests before every commit.
- Keep the CLI neutral with respect to the agent.
- Keep the domain free of infrastructure dependencies.

### Ask first

- Change the persisted schema.
- Add dependencies or native extensions.
- Change the embedding model or dimension.
- Extend the MVP to web pages, MCP, API or a human interface.

### Never

- Index secrets or `.env` files.
- Overwrite source packages.
- Present a result without provenance.
- Couple the domain to Codex, Claude, E5, SQLite or a specific vector database.
- Delete failing tests in order to allow a delivery.

## Open matters

None blocks the implementation in progress.

The combination and reranking policy was resolved on 11 August 2026: weighted
Reciprocal Rank Fusion as the baseline, behind a replaceable port. The weights
will be calibrated in stage 3.2 through real evaluations, without altering the
domain, the use cases or the public contract of the CLI. The rationale is in
[decisions.md](decisions.md) and the design in
[retrieval-design.md](retrieval-design.md).
