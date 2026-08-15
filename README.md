# auto-youtube-rag

A **local** RAG library that turns the knowledge packages produced by the video
skill into broad, ordered and cited context, ready for an agent to reason over.

It does not answer on its own. There is no LLM inside: it retrieves,
deduplicates, orders and cites — the querying agent (Codex, Claude or another)
is the only generative brain. Everything runs on your machine, with no external
APIs.

**Status: complete and in use.** The MVP (incremental indexing, hybrid
retrieval, context assembly and a portable skill) is closed, and so are the
seven points that followed, up to the low-relevance warning. No command of the
contract is left unimplemented. See [`docs/build.md`](docs/build.md).

## Installation

Requires **Node.js 24.19.0** (pinned in `.node-version`).

```powershell
git clone https://github.com/LuchoC-Dev/auto-youtube-rag.git
cd auto-youtube-rag
npm ci
npm run setup
```

`npm run setup` builds the project and leaves the `auto-youtube-rag` command
available globally. **From that point on the clone is disposable**: you can
delete the folder, because the installation copies what it needs and stays
unlinked from the repository.

The package is deliberately not published to the npm registry: `"private": true`
in `package.json` is intentional, not an oversight. The intended installation is
`git clone` + `npm run setup`.

Next, prepare the library and the embedding model:

```text
auto-youtube-rag init
```

`init` creates `~/.auto-youtube-rag/` with the SQLite database and the model
(~130 MB). **It is the only operation in the whole tool that uses the network**,
and it takes a while: give it time. It is idempotent, so repeating it breaks
nothing.

The embedding model (`Xenova/multilingual-e5-small`) that `init` downloads has
its own license, different from this repository's; check it on its Hugging Face
page if the detail matters to you.

Two useful flags: `--from <path>` copies a model you already have on disk
instead of downloading it (seconds instead of minutes), and `--skip-model`
prepares only the database, for CI or environments without network access.

To uninstall the command: `npm uninstall --global auto-youtube-rag`. The library
in `~/.auto-youtube-rag/` survives; delete it by hand if you want to start from
scratch.

## Usage

```text
auto-youtube-rag source add <path-to-the-collection> --name design
auto-youtube-rag sync
auto-youtube-rag retrieve "jerarquía tipográfica en diseño web" --depth balanced
```

`sync` indexes incrementally: the first run over a large collection takes
several minutes, the following ones are almost instantaneous if nothing
changed. `retrieve` writes two files and returns a JSON receipt with their
paths:

- **`context.md`** — the assembled context, in six fixed sections, with every
  block opened by its citation marker (`### [S01] ...`);
- **`result.json`** — the exact provenance of every citation: source, video,
  heading, timestamps and visual evidence.

The original packages are **never modified**: the tool only reads.

### All the commands

```text
auto-youtube-rag init [--skip-model] [--from <path>]
auto-youtube-rag source add <path> --name <name>
auto-youtube-rag source list
auto-youtube-rag source remove <name>
auto-youtube-rag sync [--source <name>] [--force]
auto-youtube-rag retrieve <query> [--depth focused|balanced|deep]
                                  [--max-tokens <integer>]
                                  [--source <name>] [--out <directory>]
auto-youtube-rag status
auto-youtube-rag doctor
auto-youtube-rag models install [--force] [--from <path>]
auto-youtube-rag models status
auto-youtube-rag rebuild --confirm
```

All of them are non-interactive and emit compact JSON on `stdout`; `stderr`
carries the progress. Exit codes: `0` success, `1` operational failure or
partial result, `2` invalid usage, `130` interruption.

`doctor` is read-only and safe to run at any time: it is the first place to look
if something seems off.

## Use from an agent

The intended way to consume this is not by hand, but by installing
[`skill/SKILL.md`](skill/SKILL.md) in your agent. It is self-contained and free
of provider-specific logic: it teaches the whole flow, how to read the bundle
and how to cite with real provenance.

## Documentation

**To use the tool:**

- [`skill/references/setup.md`](skill/references/setup.md) — installation,
  paths, environment variables and the most frequent errors.
- [`skill/references/troubleshooting.md`](skill/references/troubleshooting.md) —
  exit codes, `warnings` and failure recovery.
- [`docs/cli-contract.md`](docs/cli-contract.md) — normative reference for every
  command, flag and receipt.

**To work on the code:**

- [`docs/development.md`](docs/development.md) — toolchain, quality commands and
  how to get started from a clean clone.
- [`docs/agent-handoff.md`](docs/agent-handoff.md) — complete handover to pick
  the project up cold.
- [`docs/product-spec.md`](docs/product-spec.md) — goal, scope and limits.
- [`docs/architecture.md`](docs/architecture.md) — agreed architecture.
- [`docs/decisions.md`](docs/decisions.md) — decisions taken and alternatives
  rejected, with their rationale.
- [`docs/build.md`](docs/build.md) — progress point by point.

The `*-design.md` and `*-tasks.md` files in `docs/` document the design and the
checklist of every point already closed.

## How it is built

- **Strict TypeScript on Node 24**, ESM, with no CLI framework
  (`node:util.parseArgs`).
- **SQLite** via `node:sqlite`, with FTS5 for the lexical path.
- **Local embeddings** with `Xenova/multilingual-e5-small` (384 dimensions, `q8`
  quantization) on Transformers.js, always in offline mode.
- **Hybrid retrieval**: FTS5 and exact in-memory vector search, fused with
  weighted RRF.
- **Layered architecture**: domain and application know nothing about SQLite,
  Transformers.js or the file system; everything comes in through ports.

Deliberate decisions: broad, deduplicated context instead of a small `top-k`;
provenance preserved down to the section and evidence level; source packages are
immutable; a single portable skill instead of one per provider.
