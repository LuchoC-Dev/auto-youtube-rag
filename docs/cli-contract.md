# CLI contract

## Status

Contract approved and complete for the MVP, extended on 13 August 2026 with
point 4.2 (user home and model installation). Design in
`docs/install-design.md`.

## Principles

- The executable is called `auto-youtube-rag`.
- The CLI is neutral with respect to Codex, Claude and future agents.
- No command uses an LLM to answer.
- Source packages are considered immutable.
- `stdout` contains receipts or structured results.
- `stderr` contains progress, diagnostics and warnings.
- The commands used by the skill work without interaction.
- The technical keys are in English; the content keeps its original language.

## MVP commands

```text
auto-youtube-rag init [--skip-model] [--from <path>]
auto-youtube-rag source add <path> --name <name>
auto-youtube-rag source list
auto-youtube-rag source remove <name>
auto-youtube-rag sync [--source <name>] [--force]
auto-youtube-rag retrieve <query> [options]
auto-youtube-rag status
auto-youtube-rag doctor
auto-youtube-rag models install [--force] [--from <path>]
auto-youtube-rag models status
auto-youtube-rag rebuild --confirm
```

There are no separate `index` or `search` commands in the MVP. `sync` covers
initial and incremental indexing; `retrieve` searches and assembles context.
`models install`/`models status` and the `--skip-model`/`--from` flags of `init`
belong to point 4.2.

## Administration

### `init`

Initialises the user home (`~/.auto-youtube-rag/`, or `AUTO_YOUTUBE_RAG_HOME` if
it is defined), creates/migrates the SQLite database and leaves the embedding
model installed. It must be idempotent and never replace an existing library.

```text
auto-youtube-rag init [--skip-model] [--from <path>]
```

`--skip-model` omits the model installation (meant for CI and environments
without network). `--from <path>` copies a model already present on disk instead
of downloading it — see `models install` for the complete resolution order,
which `init` reuses internally.

`init` stops being instantaneous by default: without `--skip-model`, it takes as
long as it takes to download ~130 MB the first time it runs in a new home.

The receipt adds `home` (the resolved home) and `model` (the same object that
`models install` emits, or `null` if `--skip-model` was used) to the
`database_path` it already emitted. It may also add `warnings` with
`LEGACY_LIBRARY_FOUND` — see below.

### `source add`

Registers a package root. The name is unique and stable.

```text
auto-youtube-rag source add <path> --name <name>
```

Example:

```powershell
auto-youtube-rag source add `
  "C:\Users\<user>\ai-transcripcion\auto-design\videos" `
  --name auto-design
```

### `source list`

Lists names, paths, status, number of packages and last synchronisation.

```text
auto-youtube-rag source list
```

### `source remove`

Unregisters the root and withdraws only its derived records. It never deletes or
modifies source files.

```text
auto-youtube-rag source remove <name>
```

### `sync`

Performs initial or incremental indexing. It detects new packages, changes by
hash and deleted packages. An invalid package must not prevent processing the
rest; the result reports successes, omissions and errors.

```text
auto-youtube-rag sync
auto-youtube-rag sync --source <name>
auto-youtube-rag sync --force
```

There can only be one `running` run per source at a time: it is the invariant
that stops two concurrent syncs over the same source from deleting each other's
packages (see `docs/sync-safety-design.md`). If there is already an active one,
`sync` fails with exit code `1` and symbol `SYNC_ALREADY_RUNNING`, naming the id
of the active run, when it started and `auto-youtube-rag sync --force` as the
way out.

`--force` marks that active run as `failed` (recording a `SyncIssue` with code
`RUN_SUPERSEDED` that leaves a record that it was abandoned, not completed) and
starts a new one. It is the way out when the process that left the run active
died (Ctrl+C, terminal closed, power cut); a run is never abandoned
automatically. Without an active run, `--force` does nothing different from a
normal `sync`.

### `status`

Reports sources, videos, documents, sections, rules, embeddings, errors, last
synchronisation, embedding model and schema version. It adds `warnings` with
`LEGACY_LIBRARY_FOUND` when the resolved home is empty (no sources) and a
`.auto-youtube-rag/index.sqlite` database relative to the `cwd` exists — see
Decision 6 of `docs/install-design.md`.

```text
auto-youtube-rag status
```

### `doctor`

Checks SQLite, FTS5, the local model, paths, configuration, permissions and
schema integrity without modifying data. The `EMBEDDING_MODEL` check reads the
same path that `models status` resolves, and its message for an absent model
names `auto-youtube-rag models install`, not a benchmarks command. It is the
only administrative command that keeps running — and reports the detail — even
if the database fails to open (`SQLITE_INTEGRITY` in `error`), instead of
propagating the raw error from the driver.

The `STALE_SYNC_RUN` check lists the `running` runs of any source, with their id
and age. Status `error` only if any exists, with the message naming
`auto-youtube-rag sync --force`; `ok` if there is none. `doctor` never marks an
active run as failed by itself — it only reports; the user decides whether to
run `sync --force`.

```text
auto-youtube-rag doctor
```

### `models install`

Installs the embedding model (multilingual E5 Small, ~130 MB) in the resolved
home. It reuses the resolution order of Decision 5 of
`docs/install-design.md`:

1. if the destination already has the model installed (receipt and disk agree) →
   `already_installed`, it does nothing, except with `--force`;
2. if `--from <path>` was passed and that path has the complete model → it
   copies (never moves) and reports `adopted`;
3. if `--from` was passed and the path does not have the complete model → usage
   error, code `2`, `MODEL_SOURCE_INVALID`;
4. otherwise → it downloads from Hugging Face and reports `installed`.

```text
auto-youtube-rag models install [--force] [--from <path>]
```

It does not require the database or the home to exist beforehand. It touches the
network unless `--from` is used; it stays out of `npm run check` for the same
reason as the E5 smoke.

Receipt:

```json
{
  "schema_version": "1.0",
  "status": "installed",
  "model": { "key": "e5-small", "version": "1", "dimensions": 384 },
  "cache_path": "C:\\Users\\<user>\\.auto-youtube-rag\\models",
  "bytes": 135266304,
  "source": "download"
}
```

`status` admits `installed`, `already_installed` and `adopted`. `source` admits
`download` and `copy` (`null` when `status` is `already_installed`).

### `models status`

Reports the state of the model without downloading or modifying anything. Exit
code `0` in all three states: reporting an absence is not an operational
failure.

```text
auto-youtube-rag models status
```

```json
{
  "schema_version": "1.0",
  "status": "incomplete",
  "model": { "key": "e5-small", "version": "1", "dimensions": 384 },
  "cache_path": "C:\\Users\\<user>\\.auto-youtube-rag\\models",
  "issues": [{ "path": "onnx/model_quantized.onnx", "reason": "missing" }]
}
```

`status` admits `installed`, `incomplete` and `absent`. `issues` only appears
when `status` is `incomplete`, listing each required file that is absent
(`reason: "missing"`) or of a size different from the receipt (`reason:
"size_mismatch"`) — it never hashes the ~130 MB.

### `rebuild`

Regenerates the derived index and demands explicit confirmation. It never
modifies the registered roots.

```text
auto-youtube-rag rebuild --confirm
```

Implemented in point 4.6. It deletes every indexed package and everything
derived from them —documents, units, fragments, FTS5 and embeddings— and then
re-synchronises every registered source. It **preserves** the source registry,
the schema version and the history of runs and issues.

It serves the changes that `sync` cannot detect, because `unchanged()` only
compares the hash of the package and the identity of the model: a different
embedding batch size (see `sync-safety-design.md`), a new `parser_version` or a
change of fragmentation. It is not the remedy for a failed `sync`.

`--confirm` is mandatory; without it the command ends with code `2`. `rebuild`
**does not accept `--force`**: unblocking a phantom run is a separate decision
(`sync --force`). If any source has a `sync` in progress, `rebuild` fails with
`SYNC_ALREADY_RUNNING` without deleting anything.

It requires a library and a model, like `sync` and `retrieve`.

```json
{
  "schema_version": "1.0",
  "status": "ok",
  "sources_rebuilt": 2,
  "packages_deleted": 51,
  "packages_indexed": 51,
  "packages_failed": 0,
  "sources": [
    {
      "name": "auto-design",
      "status": "ok",
      "packages_indexed": 34,
      "packages_failed": 0
    }
  ],
  "issues": []
}
```

Aggregated `status`: `ok` if every source finished well, `partial` if any of them
degraded, `failed` if none could be rebuilt. A library with no registered
sources returns `ok` with `sources_rebuilt: 0`. Exit codes: `0` for `ok`, `1`
for `partial` and `failed`.

Only the purge is transactional. If the process dies between the purge and the
end of the re-synchronisation, the library is left partially rebuilt; the remedy
is to run `rebuild` again, which is idempotent.

## Retrieval

### `retrieve`

Builds a context package for the agent.

```text
auto-youtube-rag retrieve <query> \
  [--depth focused|balanced|deep] \
  [--max-tokens <positive-integer>] \
  [--source <name>] \
  [--out <directory>]
```

`balanced` is the default depth. `--max-tokens` replaces the budget of the
preset. `--source` can be repeated to limit the query to particular roots.
`--out` keeps the bundle in a chosen location; without it, a temporary directory
identified by `request_id` is used.

#### `top_vector_similarity` metric

`result.json` includes in `metrics` the cosine of the best result of the
semantic path, on **every** query, or `null` if that path did not run. It is the
raw datum behind `LOW_RELEVANCE`: it is reported whether or not the warning
fires, so that the agent judges relevance with its own criterion instead of
inheriting a threshold calibrated over a particular collection.

It is not a relevance percentage: it is distance in the embedding space, and E5
compresses everything between 0.81 and 0.90.

#### `LOW_RELEVANCE` warning

`retrieve` emits it when the best similarity score of the vector path stays
below the calibrated floor (`0.84` by default, see
`docs/low-relevance-design.md`). It means that the library has no content on the
topic, not that something has failed.

**It does not degrade the result**: `status` stays `"ok"` and the exit code is
`0`, unlike the warnings that report a downed path. Nor does it filter
candidates: the bundle is assembled just the same, with the same citations.

### Initial budgets

| Depth      | Estimated tokens | Purpose                    |
| ---------- | ---------------: | -------------------------- |
| `focused`  |           12,000 | Relatively specific query  |
| `balanced` |           32,000 | Default broad context      |
| `deep`     |           64,000 | Extensive research         |

The budgets are maximums, not filling targets. If there is not enough relevant
evidence, the bundle must be smaller. The figures will be adjusted through
evaluations without changing the public names of the presets.

## Output bundle

`retrieve` creates:

```text
<output>/<request-id>/
  context.md
  result.json
```

The CLI does not print the long context in the terminal. It emits a compact
receipt:

```json
{
  "schema_version": "1.0",
  "status": "ok",
  "request_id": "01J...",
  "context_path": "C:\\...\\context.md",
  "result_path": "C:\\...\\result.json",
  "estimated_tokens": 28740,
  "sources_used": 7,
  "warnings": []
}
```

## `context.md` contract

`context.md` organises evidence; it does not answer the query nor add
inferences. Every retrieved block contains at least one short citation.

```markdown
---
schema_version: "1.0"
query: "características del diseño brutalista"
depth: balanced
estimated_tokens: 28740
sources_used: 7
---

# Context package

## Query and scope
## Highest-relevance context
## Related rules and patterns
## Additional relevant context
## Coverage and limitations
## Source registry
```

The technical headings of the bundle are stable and are in English. The
retrieved fragments are kept in the language of their packages.

## `result.json` contract

```json
{
  "schema_version": "1.0",
  "status": "ok",
  "request": {
    "query": "características del diseño brutalista",
    "depth": "balanced",
    "max_tokens": 32000,
    "sources": []
  },
  "metrics": {
    "candidates_considered": 50,
    "units_selected": 18,
    "sources_used": 7,
    "estimated_tokens": 28740
  },
  "units": [],
  "sources": [],
  "coverage": {},
  "warnings": [],
  "limitations": []
}
```

`schema_version` makes it possible to extend the contract without breaking
consumers. A result with no valid matches uses `status: "no_results"` and
delivers a bundle with coverage and limitations, without fabricating content.

## Citations

The Markdown uses `[S01]`, `[S02]` and equivalents. **The ID opens the block, as
part of its heading**, and labels the content that comes below:

```text
### [S01] Método completo de la fuente > Brutalismo

Diez de los doce sitios usan tipografía de gran escala...
```

An ID never appears outside a heading line. Until 14 August 2026 the marker
closed the block, on its own line, which left it visually stuck to the following
heading: a consuming agent attributed citations to the wrong unit even though
every ID resolved. See `docs/decisions.md`.

Every ID resolves in `result.json`:

```json
{
  "citation_id": "S01",
  "source_name": "auto-design",
  "video_id": "...",
  "video_title": "...",
  "creator": "...",
  "file": "deliverables/context.md",
  "heading_path": ["Método completo", "Brutalismo"],
  "unit_type": "section",
  "timestamp": null,
  "visual_evidence": []
}
```

Timestamps are preserved when they exist, but they are not a search capability.
Visual paths are kept as verifiable evidence.

## Process output

- `stdout`: compact JSON or the requested structured output.
- `stderr`: progress, logs and warnings.
- No colour when the output is not interactive.
- The administrative commands may accept `--json`.
- The skill will always use non-interactive options.

### Exit codes

The CLI uses a small and conventional contract, portable across shells, agents
and automation tools.

| Code  | Meaning                                          |
| ----: | ------------------------------------------------ |
| `0`   | Valid and complete execution                     |
| `1`   | Operational failure or partial result            |
| `2`   | Invalid use of the CLI or incorrect arguments    |
| `130` | Interruption requested by the user with `Ctrl+C` |

Code `0` includes valid terminal states that produce no work or evidence:
`no_results`, `no_changes` and `already_initialized`. A partial result uses code
`1`, declares `status: "partial"` and may keep the bundle or the usable records
it produced before the failure.

The numeric codes do not describe each concrete cause. The JSON outputs include
a stable symbolic code, for example `SOURCE_NOT_FOUND`, `PACKAGE_INVALID`,
`DATABASE_INTEGRITY_ERROR`, `INCOMPATIBLE_SCHEMA_VERSION`,
`EMBEDDING_MODEL_MISSING` or `LIBRARY_NOT_FOUND`, as well as `retryable` where
appropriate.

Codes from point 4.2 (requirements preflight and installation, see
`docs/install-design.md`):

| Code                       | Type              | When                                                                                                                                                                                                                                       |
| -------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `LIBRARY_NOT_FOUND`        | error             | Preflight: `sync`/`retrieve`/`status`/`source *` without a database, code `1`                                                                                                                                                              |
| `MODEL_NOT_INSTALLED`      | error             | Preflight: `sync`/`retrieve` without an installed model, code `1`                                                                                                                                                                          |
| `MODEL_SOURCE_INVALID`     | usage (`2`)       | `--from` points at a path without a complete model                                                                                                                                                                                         |
| `MODEL_DOWNLOAD_FAILED`    | error, retryable  | The network failed during `models install`/`init`                                                                                                                                                                                          |
| `DATABASE_INTEGRITY_ERROR` | error             | The database fails to open; the message points at `auto-youtube-rag doctor`                                                                                                                                                                |
| `LEGACY_LIBRARY_FOUND`     | warning           | There is a `.auto-youtube-rag/index.sqlite` database relative to the `cwd` that is not visible from the resolved home, and the home is empty                                                                                                |
| `VECTORS_STALE`            | warning           | `retrieve`: the textual path found results but the vector index loaded zero vectors for the active model; the results come only from textual search. It appears in `warnings` of the `retrieve` receipt and in "Coverage and limitations" of `context.md` |

Codes from point 4.3 (concurrency guard, see `docs/sync-safety-design.md`):

| Code                    | Type                        | When                                                                                    |
| ----------------------- | --------------------------- | --------------------------------------------------------------------------------------- |
| `SYNC_ALREADY_RUNNING`  | error                       | `sync` without `--force` with a `running` run active for the source, code `1`             |
| `RUN_SUPERSEDED`        | `SyncIssue`, not a process code | Recorded on the run that `sync --force` marked `failed` instead of completing          |
| `STALE_SYNC_RUN`        | `doctor` check              | `running` runs listed by `doctor`, with id and age; `error` only if there is any          |

Every command declares what it needs before executing anything: `init`,
`doctor`, `models install` and `models status` require neither a database nor a
model; `source add/list/remove` and `status` require a database; `sync` and
`retrieve` require a database and a model. A missing requirement produces **one**
error, not a failure per processed element.

The application does not internally emit `126`, `127` or codes of the
`128 + signal` family, because they are reserved for the shell or the execution
environment.
