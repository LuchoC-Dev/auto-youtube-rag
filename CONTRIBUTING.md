# Contributing to auto-youtube-rag

Thanks for looking at this project. This document is the entry point for
anyone — human or agent — who has never touched the repository before.

## Workflow: issue first, then PR

Every change starts as an issue. Open one before writing code, describing the
problem or the feature. Once the work is ready, open a pull request that
references it with `Closes #N` in the PR description, so the issue closes
automatically when the PR merges.

**Never commit directly to `main`.** It is branch-protected, and all work
happens on a branch off `main`, submitted as a PR.

## Branch naming

Name branches after the conventional-commit type of the change they contain,
followed by a short slug:

```
feat/<slug>
fix/<slug>
docs/<slug>
refactor/<slug>
test/<slug>
chore/<slug>
perf/<slug>
build/<slug>
```

For example: `feat/hybrid-retrieval`, `fix/sync-race`,
`docs/contribution-workflow`.

## Commit messages

Commits follow [Conventional Commits](https://www.conventionalcommits.org/)
**with a scope**, matching the existing history (162+ commits at the time of
writing): `feat(retrieval): ...`, `fix(sync): ...`, `docs(readme): ...`. The
scope is usually the module or area touched (`retrieval`, `sync`, `cli`,
`embeddings`, `development`, ...).

Commit messages stay in **English**, even though some project documentation
is still being translated as part of this milestone.

This project commits using the `/git-commit` skill, never a hand-written
`git commit -m`. If you are an agent working in this repo and that skill is
available to you, use it — it analyzes the real diff to choose type and scope
instead of guessing.

## Before pushing: local quality gate

Run the full gate before pushing any branch:

```powershell
npm.cmd ci            # never "npm install" — respects package-lock.json
npm.cmd run check     # typecheck + lint + test + format:check
npm.cmd run build
```

Use `npm.cmd`, not `npm`, on PowerShell — the execution policy can block
`npm.ps1`.

Two additional gates exist but are **not** run by CI, because they need a
~130 MB local embedding model:

```powershell
npm.cmd run models:download        # fetches the model into the repo cache
npm.cmd run test:embedding:smoke
npm.cmd run test:install:smoke
```

Run them yourself whenever a change touches embeddings, model installation,
or anything they exercise.

## Toolchain

- **Node.js 24.19.0**, pinned in `.node-version`.
- Install dependencies with `npm ci`, not `npm install`, for a reproducible
  tree that matches `package-lock.json`.

## Invariants a green test suite will not catch

A pull request can pass every automated check and still break something the
suite doesn't cover. Before proposing a change, be aware of:

- **Source packages are strictly read-only.** The tool only ever reads the
  registered knowledge-package sources; nothing in the codebase writes,
  moves, or deletes files inside them.
- **No implicit model downloads.** Tests and normal use never fetch the
  embedding model over the network; only `auto-youtube-rag init` (and the
  explicit `models:download` dev script) do.
- **No schema, model, or embedding-dimension changes without approval.** The
  SQLite schema and the embedding model/dimensions are a stable contract;
  changing either is a deliberate, approved decision, not a side effect of
  an unrelated PR.
- **Domain and application layers never import SQLite or Transformers.js.**
  Those concerns enter only through ports/adapters; a PR that reaches for
  `node:sqlite` or `@huggingface/transformers` from domain or application
  code has crossed a boundary the architecture depends on.

The full, current list lives in `docs/agent-handoff.md` under
"Invariantes y límites obligatorios" — read it before a change that touches
sync, retrieval, indexing, or embeddings.

## Questions

If something about the workflow, the architecture, or a command isn't clear,
open a discussion or an issue — see the README for the documentation map.
