---
name: auto-youtube-rag
description: Retrieves broad, cited context with provenance from a local RAG library of already-indexed video packages, using the `auto-youtube-rag` CLI. Use it when the user asks to research, compare, summarise or cite content from an already-registered collection of videos, instead of opening the original videos or reading their source packages directly.
---

# auto-youtube-rag

This skill teaches you to operate `auto-youtube-rag`, a local RAG library that
indexes already-generated video packages (one per video, with `context.md`,
metadata, and structured content in `rules.json` **or** `analysis.json`
depending on the schema version the package was generated with) and returns
broad, deduplicated and cited context.

**The product does not answer questions by itself.** It contains no internal
LLM. You —the agent running this skill— are the only one responsible for
reading the retrieved context, reasoning over it and writing the answer. Never
assume that `retrieve` gives you a final answer; it gives you evidence with
provenance.

It works exclusively on the local machine and never writes to or modifies the
registered source packages.

## Reference files

This skill is read in full every time. The procedures that are only needed
occasionally live in separate files, next to this one:

| File                            | Read it when                                                                                                          |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `references/setup.md`           | It is the first time on this machine, or the database, the paths or the loading of the embedding model fails.         |
| `references/troubleshooting.md` | A command returned a code other than `0`, or there are `warnings` or symbolic codes you do not know how to interpret. |

If the library is already working, do not open either of them: everything you
need in order to operate is below.

## When to use this skill

Use it when the user asks for something that is better answered with content
from an already-indexed collection of videos: finding which videos deal with a
concept, comparing recommendations across sources, retrieving rules or
patterns, identifying agreements or contradictions, or assembling broad context
for a factual question about the domain of the collection.

Do not use it to find a specific moment of a video (that is not its purpose)
nor for tasks that do not depend on this library.

## Before you start

The CLI is invoked as `auto-youtube-rag <command>`. If the command is not on
the PATH, read `references/setup.md` for the alternative form.

Every command is non-interactive and safe to run without human supervision,
except `rebuild`, which deletes and regenerates the whole library: it demands
`--confirm` and should not be launched on your own initiative (see "Rebuilding
the library" below).

`stdout` always prints compact JSON (receipts or structured results). `stderr`
carries progress and warnings; it is not part of the data contract. Never print
extra output by asking for an extra `--json`: it is already the default format.

**The library lives in the user's home**, at `~/.auto-youtube-rag/`, not in the
directory you run from. You can invoke the CLI standing in any folder and you
will always be talking to the same library.

## Recommended flow

1. **Install before any other command.** `init` leaves the whole system ready:
   it creates the home, prepares the database and leaves the embedding model
   installed.

   ```text
   auto-youtube-rag init
   ```

   It is idempotent: repeating it destroys nothing.

   **`init` is not instantaneous.** With no flags it downloads the model, about
   130 MB, and it is the only operation in the whole tool that uses the
   network. Give it a generous timeout or run it in the background. Two flags
   change that:

   - `--from <path>` copies a model that is already on disk instead of
     downloading it, and takes seconds;
   - `--skip-model` prepares only the database, without a model. It is meant
     for CI or environments without network, but `sync` and `retrieve` **will
     not work** until you install the model.

   If you skip it, the other commands fail with `LIBRARY_NOT_FOUND` and tell
   you exactly what to run.

2. **Diagnose before assuming state.** Run `auto-youtube-rag status` to see the
   registered sources, the last synchronisation and the health of the model.
   If something looks broken (and you already ran `init`), run
   `auto-youtube-rag doctor` for a read-only integrity check.

   For the model specifically:

   ```text
   auto-youtube-rag models status
   auto-youtube-rag models install [--force] [--from <path>]
   ```

   `models status` returns `installed`, `incomplete` or `absent`, always with
   exit code `0` — reporting an absence is not a failure. `incomplete` means a
   damaged or half-finished installation, typically an interrupted download,
   and it is repaired with `models install --force`.

3. **Register a source if needed.** If `status` does not show the collection
   the user needs:

   ```text
   auto-youtube-rag source add <path-to-the-videos-folder> --name <name>
   auto-youtube-rag source list
   ```

   The name is unique and stable; use it afterwards to filter queries.
   The path you pass to `source add` is the `videos/` folder itself (the one
   that contains one subdirectory per `<slug>`), not its parent folder. The
   receipt may return a `collection_path` one level above that path — that is
   the expected resolution of the root of the collection, not an error.

   The expected structure is `videos/<slug>/deliverables/context.md` and
   `source/metadata.json`, plus `deliverables/rules.json` **or**
   `deliverables/analysis.json`. Both structured formats are equally valid and
   coexist in the same library: `rules.json` is the original schema and
   `analysis.json` the one of the more recent packages. A collection may mix
   both, and even have videos with neither.
   **Do not treat the absence of `rules.json` as an invalid collection** and do
   not try to convert one format into the other.

4. **Synchronise.** Before an important query, or if `status` shows an old
   synchronisation:

   ```text
   auto-youtube-rag sync
   auto-youtube-rag sync --source <name>
   ```

   `sync` is incremental and idempotent: repeating it with no changes does
   nothing destructive. An invalid package does not block the rest; check
   `warnings` in the receipt if something failed partially.

   **`sync` is a long operation.** The first indexing takes on the order of
   **5 to 10 seconds per video** — a collection of 60 videos takes between 5
   and 10 minutes. A later `sync` with no changes finishes in seconds. Plan the
   wait before launching it: in the background if your environment can, or with
   a generous timeout (15 minutes or more) if you can only do it in the
   foreground.

   **Do not launch a second `sync` while one is running.** Since point 4.3 the
   product rejects it with `SYNC_ALREADY_RUNNING` instead of letting you
   corrupt the library, but you would be wasting your time all the same. The
   only reliable signal that it finished is the JSON receipt of the command
   itself; the video count of `status` does not work as a progress signal.

   If a previous `sync` died (Ctrl+C, terminal closed, power cut), its record
   stays marked as active forever and blocks the following ones. `doctor`
   reports it as `STALE_SYNC_RUN`. To unblock it:

   ```text
   auto-youtube-rag sync --force
   ```

   It marks the abandoned run as failed and starts a new one. **Use it only if
   you are sure the previous process no longer exists**, not to skip a sync
   that is still working.

5. **Retrieve context.**

   ```text
   auto-youtube-rag retrieve "<natural-language query>" \
     --depth focused|balanced|deep \
     [--max-tokens <positive-integer>] \
     [--source <name>] [--source <other-name>] \
     [--out <directory>]
   ```

   - `--depth balanced` (32k estimated tokens) is the default value; use
     `focused` (12k) for a specific question and `deep` (64k) for broad
     research. Do not invent other preset names.
   - `--source` is repeatable; use it to narrow down to a particular
     collection when the user asks for it or when you already know which
     source is relevant.
   - Without `--out`, the bundle stays in a temporary directory whose path the
     receipt gives you; you do not need to choose `--out` unless the user wants
     to keep it in a particular place.

   For broad research, several `focused` or `balanced` queries from different
   angles usually pay off more than a single `deep` one: a collection of
   thematic catalogues returns a lot of tangential content when the budget is
   large.

6. **Read the bundle, do not guess from the receipt.** `retrieve` never prints
   the full context on `stdout`; it prints a compact receipt:

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

   An empty `warnings` means that nothing degraded, **not** that the content is
   necessarily relevant: the low-relevance warning may not fire with barely
   tangential material. Always judge by reading the context.

   Open `context_path` (`context.md`) to read the context organised in fixed
   sections (`Query and scope`, `Highest-relevance context`,
   `Related rules and patterns`, `Additional relevant context`,
   `Coverage and limitations`, `Source registry`), cited with `[S01]`, `[S02]`
   markers, etc.

   **Every ID opens its block, inside the heading**, and labels the text that
   comes below:

   ```text
   ### [S01] Método completo de la fuente > Brutalismo

   Diez de los doce sitios usan tipografía de gran escala...
   ```

   An ID never appears outside a heading line, so there is no ambiguity about
   which content it belongs to.

   Open `result_path` (`result.json`) only when you need to resolve a citation
   to its exact provenance (source, video, heading, visual evidence) or to
   inspect metrics.

   If the receipt brings a `status` other than `"ok"` or non-empty `warnings`,
   read `references/troubleshooting.md` before interpreting the coverage.

   **Pay attention to `LOW_RELEVANCE`.** It is the warning you will see most
   often, and it does not mean that something failed: it means the library has
   no content about what you asked. Retrieval always returns something —it
   discards nothing for low similarity—, so without that warning there would be
   no way to tell a real answer from barely similar material. When it appears,
   **say so in your answer** instead of presenting that content as if it
   answered the question.

   The raw datum behind the warning is always in
   `metrics.top_vector_similarity` of `result.json`, whether it fires or not.
   It is the similarity of the best semantic result; it lets you judge on your
   own, because the threshold is calibrated over a particular collection and
   the margin is thin.

7. **Cite with real provenance.** When you use retrieved content in your
   answer, cite the `[S0N]` IDs exactly as they appear in `context.md`. Never
   fabricate a citation that does not come from the bundle.

## Rebuilding the library

`rebuild` deletes the whole derived index and regenerates it from the packages
that are still on disk. It preserves the registered sources and the history;
the source packages are never touched.

```text
auto-youtube-rag rebuild --confirm
```

It serves what a normal `sync` **cannot** detect: `sync` is incremental and
compares the hash of the package against the indexed one, so if the package did
not change it recalculates nothing, even if the way of indexing did change.
Typical cases: the product was updated and changed how it generates embeddings
or how it parses the files.

When **not** to use it:

- to fix a `sync` that failed: that is solved by reading the `issues` of the
  receipt, not by deleting the library;
- to "refresh" new content: that is what `sync` is for, which is incremental
  and much faster;
- while a `sync` is running: the command fails with `SYNC_ALREADY_RUNNING`
  without deleting anything.

What to expect when running it:

- **it takes minutes**, because it regenerates the embeddings of the whole
  library. Do not mistake it for a hung command;
- `--confirm` is mandatory; without that flag it ends with code `2`;
- it does not accept `--force`. If there is a phantom run blocking it, first
  `sync --source <name> --force` and then `rebuild`;
- **if the process is interrupted halfway, the library is left partially
  rebuilt.** That is not a corrupt state and requires no special repair: run
  `rebuild --confirm` again, which always leaves the same result. Until it
  finishes, `retrieve` may return less context than expected.

The receipt brings `status` (`ok`, `partial` or `failed`), `packages_deleted`,
`packages_indexed`, `packages_failed`, the per-source detail and `issues`.
`partial` and `failed` exit with code `1`.

## Golden rules

- Never read the source packages (the original `context.md`, `rules.json` or
  `analysis.json`) directly when `retrieve` can give you the same content
  already organised, deduplicated and cited.
- Never modify or delete files inside a registered source; the product does not
  do it either.
- Never fabricate an `[S0N]` citation nor content that does not come from the
  bundle.
- Never launch `rebuild` on your own to "fix" a `sync` that failed: that is not
  its purpose and it takes minutes. Suggest it only for the cases in the
  "Rebuilding the library" section, and let the user decide.
- Never assume that a low-relevance `status: "ok"` is a bug: it is the expected
  behaviour of the MVP.
- Never launch a `sync` while another is still running, nor use the
  intermediate count of `status` as a progress signal.
- Never use `sync --force` to skip a `sync` in progress: it is only for
  unblocking one that died.
- Never retry a failed command without having first read the reference file
  that corresponds to it: most failures are configuration failures and retrying
  blindly repeats them just the same.
