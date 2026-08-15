# Local development

## Status

Toolchain approved and in use. This document defines the quality contract of the
repository and how to get to work on a new machine.

The original sentence said that the repository "does not yet implement the
domain or the use cases". That went out of date long ago: the complete MVP
(2.1–2.4, 3.1–3.2) and points 4.1–4.6 are closed, with the administrative CLI,
`retrieve` and `rebuild` implemented and tested. See `docs/build.md`.

## Pinned versions

- Node.js 24.19.0 through `.node-version`.
- TypeScript 6.0.3 in strict mode.
- ESLint 10 with the `strictTypeChecked` and `stylisticTypeChecked`
  configurations from typescript-eslint.
- Prettier 3.9.6 with `eslint-config-prettier`.
- `node:test`, run over TypeScript through `tsx`.

TypeScript 7.0.2 is not used for now because typescript-eslint 8.67.0 declares
compatibility with TypeScript `>=4.8.4 <6.1.0`. Keeping the compiler at 6.0.3
avoids a forced installation and allows linting with type information. The
upgrade will be reconsidered when the official chain is compatible.

## Getting started on a new machine

Nothing that is not versioned is unrecoverable. A clean clone gets to work with
these steps:

```powershell
git clone https://github.com/LuchoC-Dev/auto-youtube-rag.git
cd auto-youtube-rag
npm.cmd ci          # respects package-lock.json; do not use "npm install"
npm.cmd run check   # 352 tests, no network and no model
npm.cmd run build
```

To also leave the `auto-youtube-rag` command available on the system,
`npm.cmd run setup` (builds and installs globally). See the "Global
installation" section below.

**Up to this point neither network nor embedding model is needed.** The fast
suite skips the smokes through the `smoke` pattern and works with
`FakeEmbeddingGenerator`, so typecheck, lint, tests, formatting and build all
run in full on a freshly downloaded clone.

Only two things require an extra step, and each one has its command:

| For                               | Run                           | Requires network |
| --------------------------------- | ----------------------------- | ---------------- |
| The two smokes and the benchmarks | `npm.cmd run models:download` | Yes, ~129 MB     |
| Actually using the product        | `auto-youtube-rag init`       | Yes, ~130 MB     |

They are separate paths on purpose: `models:download` fills the **repository's**
cache (`<repo>/.cache/models`) and is a development tool; `init` installs into
the **user's home** and does not know that this repository exists. See the next
section.

What is missing in a clone and how it comes back:

| Missing         | Regenerated with              |
| --------------- | ----------------------------- |
| `node_modules/` | `npm.cmd ci`                  |
| `dist/`         | `npm.cmd run build`           |
| `.cache/models` | `npm.cmd run models:download` |
| The library     | `auto-youtube-rag init`       |

`.cache/` is in `.gitignore` and **never travelled to the remote**: no machine
receives it when cloning, and that is the intention. It is local development
territory, rebuildable in a single command.

### Global installation

`npm run setup` builds and then runs `scripts/install-global.mjs`, which packs
with `npm pack` and installs **the tarball**, not the directory.

The distinction is not cosmetic. `npm install --global .` **ignores the `files`
field** and copies the whole folder: measured here, 605 MB and 8,549 files, with
`.git`, `.cache`, `node_modules`, `src`, `test`, `docs` and `evals` inside.
`npm pack` does respect `files`, so the tarball carries only `dist` (~150 kB
compressed) and npm resolves the runtime dependency separately.

What ends up installed is **1 MB of own code** plus ~375 MB of `node_modules`,
of which 338 MB are `onnxruntime-node` and `onnxruntime-web`, dragged in by
`@huggingface/transformers`. That weight is inherent to the dependency, not to
the packaging.

It installs by **copy, not by link** (unlike `npm link`), so the clone remains
disposable: it can be deleted without breaking the command. To develop on the
code the opposite is preferable — `npm link`, which does link to the clone and
reflects every rebuild without reinstalling.

Uninstallation: `npm uninstall --global auto-youtube-rag`.

**This project does not use `prepare`, `postinstall` or any other lifecycle
script to install.** This is not a stylistic preference: this machine has
`ignore-scripts=true` in `~/.npmrc` — a reasonable precaution against packages
that run code when installed — and with that configuration the `pre`/`post`
scripts **do not run and do not warn**. An installer that depends on them fails
silently. That is why `build` explicitly chains `npm run clean` instead of
trusting a `prebuild`, and why the installation is a command that the user types,
not a side effect of `npm install`.

### Watch out for path depth on Windows

The longest relative path in the repository is **95 characters**
(`evals/results/2026-08-12/judgments/...`). With Windows' 260-character limit,
that leaves about **164 for the directory you clone into**. Past that point
`git clone` fails halfway through the checkout with `Filename too long` and
leaves an incomplete tree — verified: a clone into a 170-character path failed
with 7 files never created, while one into `C:\tmp-clone-test` brought in all
325 files without a single error.

Cloning into a short path (`C:\dev\...`) is enough. If a deep one is needed:

```powershell
git config --global core.longpaths true
```

Verified on 14 August 2026 on a clean clone in `C:\tmp-clone-test`: `npm ci`,
`npm run check` (342 tests) and `npm run build` passed **without `.cache/` and
without network**. `test:embedding:smoke` failed with its message pointing at
`npm run models:download`, and `test:install:smoke` skipped itself, exactly as
designed.

The only thing that exists solely on the machine where it was run are the loose
benchmark results (`benchmarks/*/results/`, except the versioned `baseline.*`).
This is deliberate: the **conclusions** of every benchmark are in
`docs/decisions.md`, which is versioned; the raw data of each run is not kept.

## Commands

| Command                        | Responsibility                                                |
| ------------------------------ | ------------------------------------------------------------- |
| `npm run build`                | Compile `src/` into `dist/` with declarations and source maps |
| `npm run typecheck`            | Verify all the TypeScript without emitting files              |
| `npm run lint`                 | Run the strict, type-aware rules                              |
| `npm test`                     | Run the tests with Node's native runner                       |
| `npm run test:watch`           | Repeat the affected tests during development                  |
| `npm run test:coverage`        | Generate coverage with Node's native support                  |
| `npm run test:embedding:smoke` | Validate E5 Small using only the local model                  |
| `npm run format`               | Apply Prettier                                                |
| `npm run format:check`         | Verify formatting without modifying files                     |
| `npm run check`                | Run typecheck, lint, tests and formatting                     |

The benchmarks keep separate commands because they are not part of the fast
quality gate of every change.

### Local smoke of E5 Small

The model smoke is deliberately independent of `npm run check`. The fast suite
discovers its file, but skips it through the `smoke` pattern; only the explicit
command runs the inference:

```text
npm run models:download
npm run test:embedding:smoke
npm run test:install:smoke
```

`models:download` downloads only E5 Small **into the repository's cache**
(`<repo>/.cache/models`). It is a development tool: it feeds the benchmarks and
the two smokes. To download every model of the historical benchmark, use
`npm run models:download:benchmarks`.

**This is not the way to install the product.** Since point 4.2, the user
installs with `auto-youtube-rag init`, which writes into the user's home
(`~/.auto-youtube-rag/models/`) and does not know that this repository exists.
`models:download` depends on `tsx` and on `benchmarks/`, neither of which is
available outside a cloned repository. The repository's `.cache/` is exclusively
development territory.

The embedding smoke requires the files in `.cache/models`, works with
`local_files_only` and never accesses the network. `test:install:smoke` copies
that same model into a temporary home in order to exercise the real adoption
through `--from`; it is skipped if the cache does not exist, instead of failing.
Both are left out of `npm run check` through the `smoke` pattern.

## Structure and boundaries

`tsconfig.json` covers product, tests and benchmarks. `tsconfig.build.json`
emits only `src/`. The historical benchmarks are still under typecheck, but are
temporarily excluded from ESLint and Prettier so as not to mix their migration
with the implementation of the product. All new code in `src/` and `test/` uses
the strict baseline. Generated directories, caches, results and local weights
are excluded from lint, formatting and Git as appropriate.

`src/main.ts` is the real entry point of the CLI: it resolves the user home
paths with `resolvePaths` and delegates to `runCli`, which implements every
command of the contract. It was a smoke scaffold at the beginning of the project
and this section described it that way; it stopped being one when point 2.1 was
closed.

## How to commit

**Commits are made with the `/git-commit` skill, not with `git commit` by
hand.** It is the project convention and applies to any agent working here,
with no exception for urgency or for the size of the change.

The skill analyses the real diff to choose type and scope, instead of trusting
what the author believes they changed, and it avoids the deviations that appear
when everyone writes the message to their own criteria.

Rules that go with it:

- One logical change per commit; at most five files per task. If a commit needs
  more, say so explicitly in the body and explain why splitting it would have
  been worse.
- Messages in English, following the repository's history.
- Never `Co-Authored-By`.
- Never `--no-verify` or skipping hooks.
- **Never push or rewrite history without an explicit request from the user**:
  `main` is published in a private repository and pushing makes it visible
  outside this machine.

## Acceptance criteria

Before integrating a change, these must pass:

```text
npm run build
npm run check
```

The functional tests will grow along with every use case. The adapter contract
suites and the SQLite tests will use temporary resources and will not depend on
the user's personal index.
