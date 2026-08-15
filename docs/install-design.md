# Installation design: user home and `models install`

## Status

Proposed on 13 August 2026. Point 4.2, after the MVP. Requires explicit approval
before implementation.

## Context

The cold verification run of 13 August (a subagent with no prior context, two
real collections, see `docs/decisions.md` → "Skill split") failed on its first
`sync` with **63 `MODEL_LOAD_FAILED` issues**, one per video. The agent resolved
it by copying the repository's cache by hand.

The immediate cause is that the model is looked for in `<cwd>/.cache/models`.
The real cause is deeper and was exposed while investigating how the product is
installed: **it was never decided how it is installed.** `package.json` declares
`"private": true` alongside a `bin`, no specification describes distribution, and
the only installer that exists is a benchmark script.

The code audit found **four different places** computing the model cache path,
each with its own rule:

| Where                                  | Rule                        |
| -------------------------------------- | --------------------------- |
| `benchmarks/embeddings/run.ts`         | `<repo-root>/.cache/models` |
| `src/main.ts`                          | `<cwd>/.cache/models`       |
| `e5-embedding-generator.ts` (fallback) | `<cwd>/.cache/models`       |
| `evals/run-seed-queries.ts` (default)  | `<cwd>/.cache/models`       |

The one that downloads and the ones that read only agree if execution starts
exactly at the repository root. Outside of that — the normal case — they look at
different places, with no warning whatsoever. The three duplicated `cwd` defaults
are also a latent trap: changing only one leaves the others pointing at the old
place.

`npm run models:download` is furthermore `tsx benchmarks/embeddings/run.ts
--download-only --models=e5-small`: the benchmark harness, which knows four
models, filtered down to one. `tsx` is a `devDependency` and `benchmarks/` is
development material, so that command **does not exist** for anyone without the
repository cloned. The skill pointed at it all the same, and the subagent
reported the contradiction.

## Product decision that enables this work

The user confirmed on 13 August that the CLI is distributed as an **npm-style
global command**, and explicitly discarded a `postinstall` hook because there are
installations with scripts disabled — theirs included. That criterion already had
precedent in the project: `docs/benchmarks/sqlite-client.md` chose `node:sqlite`
over `better-sqlite3` partly because it "works with installations that disable
scripts". A 129 MB `postinstall` would contradict a decision already taken.

## Scope

In:

- a single user home for the database and the model;
- a path resolver shared by everything that reads or writes those paths,
  eliminating the three duplicated defaults;
- `init` as the complete system installer;
- a `models` subcommand of the CLI, with `install` and `status`;
- reuse of a model already present on disk through an explicit `--from`;
- an installation receipt that distinguishes "missing" from "broken";
- a per-command requirements preflight, run once and not per video;
- `doctor` aligned with the new home;
- updated documentation and skill.

Out:

- changing the default model or its dimension (invariant: requires its own
  approval);
- publishing the package on npm (`private: true` is not touched in this point);
- the `sync` concurrency guard (an independent pending item);
- `rebuild --confirm`.

## Decision 1: one home, not two loose locations

Today there are two independent paths with two independent variables. They are
unified under a single directory:

```text
~/.auto-youtube-rag/          ← AUTO_YOUTUBE_RAG_HOME
  index.sqlite                ← the library
  models/                     ← the embedding model
```

On Windows it resolves to `C:\Users\<user>\.auto-youtube-rag\`, via
`os.homedir()`.

The directory is called `models/`, not `cache/`, and the variable is renamed
`AUTO_YOUTUBE_RAG_MODELS_DIR`. **The model stopped being a cache**: a cache is
derived data that regenerates itself, and the project's invariant forbids
downloading implicitly (the adapter forces `allowRemoteModels = false`). If it is
deleted, nothing replaces it: `sync` fails until the user reinstalls by hand.
That is an installed dependency. The name `.cache/` was inherited from the
vocabulary of Transformers.js, which does treat its `cacheDir` as a cache because
it downloads on its own — a capability this product deliberately disables.

The rename is cheap now: only `src/main.ts` reads the variable, it was documented
on 13 August and the package was never published (`private: true`). Inside the
adapter the parameter is still called `cacheDir`, because there the language of
Transformers.js is spoken; what has to tell the truth is the public surface.

Model precedence order:

1. `AUTO_YOUTUBE_RAG_MODELS_DIR` if defined;
2. `<AUTO_YOUTUBE_RAG_HOME>/models`;
3. `<os.homedir()>/.auto-youtube-rag/models`.

And for the database:

1. `AUTO_YOUTUBE_RAG_HOME` if defined;
2. `<os.homedir()>/.auto-youtube-rag/`.

`AUTO_YOUTUBE_RAG_MODELS_DIR` is kept as an independent override because it
allows 130 MB to be shared between several homes without duplicating them. Today
no other part of the project reads these variables: only `src/main.ts`. The tests
and the evaluation harness do not use environment variables (see Decision 3).

## Decision 2: why the user home replaces the `cwd`

The opening position in this discussion was that a `cwd`-relative database was
defensible for allowing one library per project. It is discarded, for three
reasons in order of weight:

1. **The main use case is broken by default.** The skill exists so that an agent
   working in _another_ project can query the library. With the database relative
   to the `cwd`, that agent finds an empty library and would have to reindex the
   entire collection for every folder it works from.
2. **It fails silently.** Standing in another folder produces no error: `status`
   reports zero sources and looks like data loss. `skill/references/setup.md`
   already documents the symptom; removing the failure is better than documenting
   it.
3. **The evidence from the cold run.** The library built by the subagent — 63
   packages, 4,799 embeddings, ~20 minutes of computation — ended up in a
   temporary directory and is useless. With a user home it would have been
   reusable from any folder.

The real counter-argument — tests and evaluations need disposable libraries — is
already covered by `AUTO_YOUTUBE_RAG_HOME`, which the harness sets explicitly.
The default does not have to carry that need.

## Decision 3: the path resolver is a shared function

The current mismatch exists because two programs compute the same path with
different rules. The structural correction is for **a single function** to exist,
and for both the reader and the writer to use it.

New file: `src/infrastructure/config/resolve-paths.ts`.

```ts
export interface ResolvedPaths {
  readonly home: string;
  readonly databasePath: string;
  readonly modelsPath: string;
}

export function resolvePaths(
  env: NodeJS.ProcessEnv,
  homedir: () => string,
): ResolvedPaths;
```

`env` and `homedir` are injected so that the tests do not depend on the real
environment or on the user running the suite. `src/main.ts` calls it with
`process.env` and `os.homedir`.

It lives in infrastructure, not in the domain or the application: it is knowledge
of the file system and of environment variables, and the project's invariant
forbids the domain and the application from knowing about Node paths.

The `config.modelCachePath` field that `runCli` and `createApplication` receive
today **keeps its name** in this point: it is internal, the three E2Es and
several tests use it, and renaming it would mix a broad refactor with a change of
behaviour. What does change name is the public surface — the environment variable
and the directory.

The three duplicated `cwd` defaults **are removed**, not left as a fallback:

- `e5-embedding-generator.ts` comes to require `cacheDir`. Today it has a
  fallback to `<cwd>/.cache/models` that can only mask incomplete wiring: the
  composition root always supplies it.
- `evals/run-seed-queries.ts` comes to resolve its default with `resolvePaths`,
  keeping its `--model-cache` flag as an explicit override.
- `benchmarks/embeddings/run.ts` **is not touched**: it is a research tool that
  legitimately works against the repository, and it is no longer offered as a
  product remedy.

**The risk of the change is far smaller than it appears**, and it is worth
writing down so nobody oversizes block V: the tests do not read environment
variables or the `cwd`. They build their paths in temporary directories and
inject them as `config` into `runCli` and `createApplication` (see
`test/helpers/create-test-collection.ts` and the three E2Es). The real surface
that changes behaviour is `src/main.ts`, which is the product's only point that
consults the environment.

## Decision 4: `init` installs the complete system

The system needs four things in order to work. Only two are this product's
responsibility:

| What                    | Who provides it             |
| ----------------------- | --------------------------- |
| Node ≥ 24.19.0          | Environment prerequisite    |
| The CLI on the `PATH`   | npm (`i -g` / `link`)       |
| **The model (130 MB)**  | **This product**            |
| **The home and the DB** | **This product**            |
| Registered sources      | User data, not installation |

`init` comes to cover the two of its own in a single command: it creates the
home, migrates the database and leaves the model installed.

```text
auto-youtube-rag init [--skip-model] [--from <path>]
auto-youtube-rag models install [--force] [--from <path>]
auto-youtube-rag models status
```

`--skip-model` exists for CI and environments with no network. `models install`
survives in order to repair or reinstall the model without touching the database.

**It changes the nature of `init`**, which today is instantaneous and offline and
comes to take however long downloading 130 MB takes. That is acceptable because
it is a first-time command, but it demands documenting the duration with the same
prominence as `sync`'s — the cold run demonstrated that an unannounced long
operation blocks the consuming agent.

The installer becomes part of the product:

Five intended consequences:

- it uses the only production dependency (`@huggingface/transformers`), not `tsx`
  or `benchmarks/`;
- it resolves the destination path with `resolvePaths`, **the same one** the
  reader uses — the mismatch disappears by construction, not by documentation;
- it exists for anyone who has the CLI, with or without the repository;
- it respects the invariant of not downloading implicitly: the download only
  happens when the user asks for it by name;
- it leaves a natural place for a future model change (see "Note: what it would
  take to support another model"). Changing the default model still requires
  explicit approval; this point only enables the installation mechanics.

`npm run models:download` **is kept** pointing at the benchmarks, which is its
legitimate place. It stops being mentioned as a product remedy.

## Decision 5: reuse an existing model only with an explicit `--from`

`models install` and `init` accept `--from <path>` in order to copy a model that
is already on disk instead of downloading it. Resolution order:

1. if the destination already contains the installed model → `already_installed`,
   it does nothing (except with `--force`);
2. if `--from <path>` was passed and that path contains the complete model →
   **copy** to the destination, write the receipt and report `adopted`;
3. if `--from` was passed and the path does not contain the complete model →
   usage error, code `2`. It does not silently fall back to downloading: the user
   asked for something specific and has to be told it was not there;
4. otherwise → download and report `installed`.

**Automatic detection of the repository was discarded.** It was more convenient
the first time, but it would give the product knowledge of the repository's
structure, and the agreed principle is the opposite: the repo is source code and
the product must not be able to run from it without having been installed. With
`--from`, the product does not know a repository exists; it simply copies from
wherever it is told.

It copies rather than moves: emptying the origin would break the benchmarks and
the E5 smoke test, which read the repository's cache on their own.

"Complete model" at the origin means that the four files the runtime needs exist:
`config.json`, `tokenizer.json`, `tokenizer_config.json` and
`onnx/model_quantized.onnx`, under `<origin>/Xenova/multilingual-e5-small/`. A
half-downloaded directory does not qualify. The origin does not need a receipt —
typically it will not have one, because it was not installed by this product.

## Decision 6: the change of behaviour is announced, not silenced

An existing database in `<cwd>/.auto-youtube-rag/` stops being read. Silencing
that reproduces the very failure this work sets out to eliminate.

`init` and `status` detect the case: if the resolved home contains no database
but `<cwd>/.auto-youtube-rag/index.sqlite` **does** exist, they add a
`LEGACY_LIBRARY_FOUND` warning with both paths and the instruction to move the
file or set `AUTO_YOUTUBE_RAG_HOME`. It does not migrate automatically: moving
the user's data unasked exceeds these commands' mandate.

The warning is emitted only when the resolved home is empty. If there is already
a library in the home, an old database in the `cwd` is noise and is not
mentioned.

## Decision 7: requirements preflight, once per command

The two cold runs left both startup failures measured, and both are defects of
our own, not of the environment:

| Missing      | Current behaviour                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| The database | `ERR_SQLITE_ERROR: unable to open database file`, a raw error                                                |
| The model    | **63 `MODEL_LOAD_FAILED` issues**, one per video, pointing at a command that does not exist outside the repo |

The second is the costlier one: the system discovered the model was missing once
per video, processing package by package until it ended in `partial`. It could
have known before starting.

Each command declares which requirements it needs, and the CLI verifies them
**once only, before executing anything**:

| Command                           | Requirements           |
| --------------------------------- | ---------------------- |
| `init`                            | none (it creates them) |
| `status`, `doctor`                | database               |
| `source add/list/remove`          | database               |
| `sync`, `retrieve`                | database + model       |
| `models install`, `models status` | none                   |

A missing requirement produces **one** actionable error naming the command that
resolves it (`auto-youtube-rag init`), exit code `1`, and the symbolic codes
`LIBRARY_NOT_FOUND` or `MODEL_NOT_INSTALLED`. Never 63 identical issues nor a raw
SQLite error.

`doctor` is the deliberate exception: it runs regardless without a model, because
its job is precisely to diagnose what is missing.

### Installation receipt

Distinguishing "missing" from "broken" needs more than the existence of files. A
cut-off download leaves the four files present with the wrong size, and the
failure only shows up when loading the model, as an incomprehensible ONNX error.

`models/.install.json`, written by the installation:

```json
{
  "schema_version": "1.0",
  "model": {
    "key": "e5-small",
    "version": "Xenova/multilingual-e5-small@main:q8",
    "dimensions": 384
  },
  "files": [{ "path": "onnx/model_quantized.onnx", "bytes": 118654321 }],
  "installed_at": "2026-08-13T18:00:00.000Z",
  "source": "download"
}
```

It allows three verifiable states without hashing 130 MB:

- **`absent`**: there is no receipt and no files.
- **`incomplete`**: the receipt does not match the disk (a missing file or one of
  a different size), or there are files with no receipt. Repaired with
  `models install --force`.
- **`installed`**: receipt and disk match.

Sizes are compared, not hashes: it detects truncated downloads — the real failure
— without reading 130 MB on every `doctor`.

A directory with files but no receipt counts as `incomplete`, not as
`installed`: that is the case of someone who copied the model by hand, and it is
best for `models install --force` to normalise it by writing the receipt.

### Corrupt database

`doctor` already detects corruption with `integrity_check`. What is missing is
for `sync` and `retrieve` to translate a SQLite integrity error into a message
that sends the user to `doctor`, instead of propagating the driver's raw error.

## Output contract

`models install`:

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
`download` and `copy`.

`models status` returns the same shape without `bytes` and without downloading,
with `status: "installed"`, `"incomplete"` or `"absent"`, and exit code `0` in
all three cases: reporting absence is not an operational failure. When the state
is `incomplete`, it adds `issues` with the files that do not match the receipt.

`init` adds `home` and `model` to the receipt, alongside the `database_path` it
already emits.

New symbolic codes:

| Code                    | Type             | When                                             |
| ----------------------- | ---------------- | ------------------------------------------------ |
| `MODEL_DOWNLOAD_FAILED` | error, retryable | The network failed during the download           |
| `MODEL_NOT_INSTALLED`   | error            | Preflight: `sync`/`retrieve` with no model       |
| `LIBRARY_NOT_FOUND`     | error            | Preflight: the database is missing               |
| `MODEL_SOURCE_INVALID`  | usage (`2`)      | `--from` points at a path with no complete model |
| `LEGACY_LIBRARY_FOUND`  | warning          | There is an old `cwd`-relative database          |

## Impact on `doctor`

The model check already exists and reads `modelCachePath`. It comes to receive
the resolver's path, and its error message stops saying "Run npm run
models:download first" and says `auto-youtube-rag models install` instead. It is
the message the subagent read, and it sent them to a command that did not exist
in their context.

## Main risk and how it is bounded

The initial hypothesis was that the user home could break the suite. The audit
discarded it: the tests inject `config` with temporary paths and do not consult
the environment, so block V remains a bounded verification rather than a refactor.
It is kept all the same, and before `main.ts`, because confirming a benign
hypothesis is cheap and discovering it false halfway through is not.

The risk that does remain is the **removal of the duplicated defaults**: if some
path constructs `E5EmbeddingGenerator` without `cacheDir`, today it works by
accident and would come to fail at compile time. That is desirable — it turns a
silent failure into a visible one — but every construction has to be reviewed
before the parameter is required.

Secondary risk: `models install` downloads from the network. It must be kept out
of `npm run check` through the existing `smoke` pattern, just like the E5 smoke
test.

## Note: what it would take to support another model

Outside the scope of 4.2, recorded here because the code audit made it clear and
it is best not to investigate it from scratch again.

**What is already resolved:**

- The dimension is generic end to end. `embeddings` stores `dimensions`,
  `model_key` and `model_version` per row; the loader filters by the active
  model; the in-memory index builds its matrix from `model.dimensions` with no
  hardcoded `384`, and validates that what was stored matches what was declared.
- **Automatic reindexing when the model changes already works.** `unchanged()` in
  `sync-source.ts` includes the active model's `key`, `version` and `dimensions`
  in its criterion, so changing any of the three invalidates every package and
  the next `sync` reindexes. `version` is
  `"Xenova/multilingual-e5-small@main:q8"`, so changing revision or quantisation
  also triggers it.

**What is missing:**

- ~~The model's identity is module constants in `e5-embedding-generator.ts`
  (`modelRepository`, `modelRevision`, `modelDtype`, `modelDescriptor`). Changing
  model means changing code.~~ **Corrected on 14 August 2026.**
  `src/infrastructure/embeddings/model-profile.ts` is born with
  `EmbeddingModelProfile` and the frozen active profile `activeModelProfile`; the
  generator (renamed `TransformersEmbeddingGenerator`) and the installer (renamed
  `TransformersModelInstaller`) receive it by injection, with that profile as the
  default. `"Xenova/multilingual-e5-small"` now appears only once in all of
  `src/`. Detail in `docs/decisions.md`, section "Model profile and prefix
  policy".
- ~~**The E5 prefixes (`passage: ` / `query: `) are hardcoded** and are always
  applied. They are specific to the E5 family: with MiniLM, Jina or BGE they
  degrade quality **with no error at all**. The benchmark harness already
  accounts for this with an `e5Prefixes` flag in its `ModelDefinition`; the
  product does not. Moving the prefixes into the model descriptor is the real
  work of "configurable model", not the dimension.~~ **Corrected on 14 August 2026.** `EmbeddingModelProfile.inputPrefixes` is `EmbeddingInputPrefixes | null`
  — `null` is explicit ("this model carries no prefixes"), not a forgotten
  default. `countTokens` and `embedDocuments` share the same prefixing policy.
  The policy takes part in `modelVersion(profile)` (a `+noprefix` suffix when
  there are no prefixes), so a future profile without prefixes invalidates and
  reindexes automatically; with the active profile the `version` literal did not
  change, so nothing was reindexed when implementing this (validated in AD3 of
  `docs/model-profile-design.md`). Detail in `docs/decisions.md`.
- **Two models do not coexist in practice**, even though the schema allows it
  (`PRIMARY KEY (fragment_id, model_key)`). `applyPackage` does
  `DELETE FROM source_documents`, and the cascade
  `source_documents → knowledge_units → search_fragments → embeddings` deletes the
  vectors of every model in the package. Each `sync` leaves exactly one model.
  Comparing two models over the same corpus would require a code path that does
  not exist today.
- ~~**Silent degradation gap.**~~ **Corrected on 14 August 2026.** Between
  changing the model and running `sync`, the loader filtered by the active model,
  found no vectors and `retrieve` returned `status: "ok"` with the text path
  alone, with no warning. It now emits `VECTORS_STALE`. Detail in
  `docs/decisions.md`, section "Silent degradation of the vector path".

A generative LLM is discarded by the product's definition: the system needs a
fixed-size vector per text, and the founding decision is that there is no
internal LLM.

## Documents to update on implementation

- `docs/cli-contract.md`: the `models` command and its receipts.
- `docs/product-spec.md`: the installation section, non-existent today.
- `docs/development.md`: `models:download` belongs to benchmarks, not to the
  product.
- `docs/decisions.md`: close the two pending items the test opened — the cache
  default is resolved here; the concurrency guard remains open and must be
  recorded as such.
- `skill/SKILL.md` and `skill/references/setup.md`: the user home removes a good
  part of the path text that was added on 13 August.
- `docs/build.md`: point 4.2.
- `docs/agent-handoff.md`: operational status.

## Block plan

| Block | Content                                                        |
| ----- | -------------------------------------------------------------- |
| U     | Path resolver, receipt and model state                         |
| V     | Removal of the three duplicated defaults                       |
| W     | Model download: port, adapter and copy from `--from`           |
| X     | `models` and `init` in the CLI, `main.ts` and `doctor` aligned |
| Z     | Requirements preflight and translation of state failures       |
| Y     | Real cold validation and documentation closure                 |

Execution order: U → V → W → X → Z → Y.

## Confirmed decisions (13 August 2026)

- Distribution as a global command; no `postinstall`, because there are
  installations with scripts disabled.
- A single user home `~/.auto-youtube-rag/`, with `AUTO_YOUTUBE_RAG_HOME` to move
  it as a whole and `AUTO_YOUTUBE_RAG_MODELS_DIR` for the model.
- The directory is called `models/`, not `cache/`: the model is installed state,
  not derived data that regenerates itself.
- The resolver is a single function shared by reader and writer; the three
  duplicated `cwd` defaults are removed.
- `init` installs the complete system (home, database and model), with
  `--skip-model` for CI.
- The installer is a subcommand of the product; `npm run models:download` remains
  a benchmark tool, valid only from the repository.
- A model already present on disk is reused only with an explicit `--from`.
  Automatic detection of the repository was discarded: the product must not know
  the repo's structure, nor be able to run from it without being installed.
- It copies, it does not move: emptying the origin would break benchmarks and
  smoke tests.
- The old `cwd`-relative database is announced (`LEGACY_LIBRARY_FOUND`), it does
  not migrate on its own.
- Requirements preflight once per command, not once per video.
- A `models/.install.json` receipt to distinguish absent, incomplete and
  installed, comparing sizes and not hashes.
- The default model and its dimension do not change in this point.
