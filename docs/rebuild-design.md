# Design 4.6: the `rebuild --confirm` command

## Status

**Proposed on 14 August 2026. Pending explicit approval.**

It is point 2 of the priority order set by the user on 14 August. Point 1 —
sorting fragments by length before batching — was closed without implementation:
it is inert with the `batchSize = 1` that 4.3 adopted (see "Why point 1 was
closed without code" below).

`rebuild` is the only command whose public contract has been approved in
`cli-contract.md` since the MVP and was never implemented.

## The problem it solves

`sync` is incremental by design: `unchanged()` compares the hash of the package
on disk against the persisted one, and if they match it marks the package seen
without recomputing anything. That is correct and it is what makes a `sync` over
51 unchanged videos finish in seconds.

But `unchanged()` only looks at **the source's content and the model's identity**
(`key`/`version`/`dimensions`). It looks at nothing else in the derived pipeline.
There are at least four real changes, already occurred or foreseeable, that
invalidate the index without `sync` being able to notice:

1. **Embedding batch size.** 4.3 lowered the default from 16 to 1 and measured a
   cosine deviation of 4.8×10⁻³ between the two. The design of 4.3 explicitly
   declared that the batch is **not** part of the model's identity, so an
   existing library keeps its old vectors: mixed vectors remain and "reindexing
   is advisable but not mandatory". Today there is no way of acting on that
   recommendation short of deleting the SQLite file by hand.
2. **Parser changes.** `source_documents.parser_version` is persisted per
   document precisely because a new parser produces different units from the same
   input byte. `unchanged()` does not compare it.
3. **Fragmentation or unit type changes.** 4.1 added four new
   `KnowledgeUnitType`s; an equivalent future change does not re-fragment
   already-indexed packages.
4. **Model profile change.** 4.5 made the prefix policy take part in
   `modelVersion`, so that case **does** trigger automatic reindexing — it is the
   only one of the four already covered, and it is worth recording why it does
   not need `rebuild`.

In the first three cases the library is left internally inconsistent with no
signal whatsoever: `doctor` reports `ok`, `retrieve` returns results and nobody
finds out. It is exactly the form of defect that the session of 13 and 14 August
identified as the costliest: _the system answers correctly while something is
broken_.

## What it does exactly

```text
auto-youtube-rag rebuild --confirm
```

Three phases, in order, over the user home's library:

1. **Purges** the entire derived index.
2. **Re-synchronises** each registered source, in the order the registry returns
   them, reusing `syncSource` without duplicating a single line of its logic.
3. **Emits an aggregate receipt** summing what each `sync` reported.

### Why it re-synchronises instead of only purging

The contract says "**regenerates** the derived index", not "deletes". A dry purge
would leave the library empty and silently useless until the user remembers to
run `sync` — the worst possible state for a command whose purpose is to repair. A
consuming agent that ran `rebuild` and then `retrieve` would get `no_results`
with no explanation at all.

Since `rebuild` leaves the same state as a complete `sync` from scratch, it is
also idempotent in the sense that matters: running it twice in a row produces the
same library.

### What is deleted and what survives

The boundary is read directly from the schema of `001-initial.ts`:

| Table                                                                   | Fate     | Why                                                                                                 |
| ----------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------- |
| `video_packages`                                                        | deleted  | Derived: rebuilt by reading the manifest and the packages                                           |
| `source_documents`, `knowledge_units`, `search_fragments`, `embeddings` | deleted  | Cascade from `video_packages`; no non-derivable data of their own                                   |
| `fragment_fts`                                                          | emptied  | The `fragment_fts_delete` triggers keep it aligned on their own                                     |
| `sources`                                                               | **kept** | It is the user's configuration, not derived. Deleting it would make `rebuild` genuinely destructive |
| `schema_meta`                                                           | **kept** | The schema version does not change; `rebuild` is not a migration                                    |
| `sync_runs`, `sync_issues`                                              | **kept** | Operation history, not derived from the content                                                     |

Preserving the run history follows an already established precedent, not a new
preference: `source remove` "removes catalog derivatives but preserves detached
run history" (its own test pins it), and `sync_runs.source_id` is
`ON DELETE SET NULL` precisely to allow it. A `rebuild` that deleted the history
would destroy the only evidence of why someone had to rebuild.

Accepted consequence: rows remain in `sync_runs` with no `video_packages`
referencing them. It is the same detached state that `source remove` already
produces, and `doctor` does not treat it as an error.

### The purge goes in a single transaction

A `rebuild` interrupted halfway through the purge must not leave half a library.
The deletion of `video_packages` for every source happens in a single
`BEGIN IMMEDIATE`, just like `applyPackage`. The subsequent re-synchronisation
does **not** enter that transaction: each `syncSource` manages its own, and a
partial failure of one source must behave exactly as in a normal `sync` (issue
recorded, run `partial`), not revert the entire purge.

This implies a real window: if the process dies between the purge and the end of
the re-synchronisation, the library is left partially rebuilt. That is acceptable
and is not concealed — the remedy is to run `rebuild` again, which is idempotent.
It is declared in the receipt and in the skill.

## Interaction with 4.3's concurrency guard

`rebuild` **respects the guard, it does not bypass it**. If any source has a
`running` run, `rebuild` fails completely before deleting anything, with the same
`SYNC_ALREADY_RUNNING` code that `sync` already emits.

The verification happens **inside the same transaction as the purge**, not before
it and not per source during the loop. While implementing it, it became clear
that checking in the application and deleting afterwards reopens exactly the
window that 4.3 closed in `recordRun`: between the check and the `DELETE` a `sync`
can start and index into a library about to be emptied. Putting the `SELECT` of
active runs and the `DELETE` under a single `BEGIN IMMEDIATE` turns the guard into
a guarantee, just as it did there. Besides, a rebuild spans **every** source, so
an active run in any of them blocks it, not only in the one about to be touched.

Design consequence: the guard lives in `purgeDerivedIndex`, not in the use case,
and `rebuildIndex` needs no method for reading active runs.

**`rebuild` does not accept `--force`.** Unblocking a ghost run and rebuilding the
entire library are two distinct decisions and the user must take them separately:
first `sync --source <name> --force`, then `rebuild`. Combining them in one flag
would make a single command unblock a run that may well be alive and delete
everything on top.

## CLI surface

### `--confirm` is mandatory

Without the flag, `rebuild` ends with **code 2** (usage error), validated in
`parse-command.ts` before building the `Application`, consistent with the rule
already set for `--depth` and `--max-tokens`: a missing or misspelled argument
never produces the operational failure code 1. There is no interactive prompt:
the CLI is non-interactive by contract and its consumer is an agent.

### Requirements

`rebuild` joins `sync` and `retrieve` as `library_and_model` in
`command-requirements.ts`. It needs the model because it re-embeds everything:
leaving it as `library` would reproduce exactly the defect 4.2 corrected —
discovering the missing model once per video instead of once before starting.

This breaks the test `sync and retrieve are the only commands requiring both the
library and the model`, which has to be updated to the three commands. It is a
deliberate contract update, not a regression.

### Receipt

The approved contract defines no receipt for `rebuild` (`cli-contract.md` only
declares two sentences), so it has to be defined and documented. Proposal,
following the shape of `sync`'s receipt:

```json
{
  "schema_version": "1.0",
  "status": "ok",
  "sources_rebuilt": 2,
  "packages_deleted": 51,
  "packages_indexed": 51,
  "packages_failed": 0,
  "sources": [
    { "name": "auto-design", "status": "ok", "packages_indexed": 51 }
  ],
  "issues": []
}
```

Aggregate `status`: `ok` if every source finished `ok`; `partial` if any finished
`partial` or `failed`, with the rest rebuilt; `failed` if none could be rebuilt.
Exit codes: `0` for `ok`, `1` for `partial` and `failed`, the same as `sync`.

A library with no registered source returns `status: "ok"` with
`sources_rebuilt: 0` and code `0`. It is not an error: there is nothing to
rebuild and nothing is broken.

## Where the code lives

`rebuild` is an application use case, not CLI logic:

- **Domain**: no changes. No new concept appears.
- **Port**: `IndexStore` adds one operation — `purgeDerivedIndex(): Promise<number>` —
  returning how many packages it deleted. It is the only genuinely new
  capability; everything else already exists.
- **Application**: `src/application/indexing/rebuild-index.ts` with
  `rebuildIndex`, which calls `purgeDerivedIndex` and then `syncSource` for each
  source. It knows nothing of SQLite and does not check active runs on its own:
  the guard is part of the purge.
- **Infrastructure**: `SQLiteIndexStore.purgeDerivedIndex` — the `SELECT` of
  active runs and a `DELETE FROM video_packages` under a single
  `BEGIN IMMEDIATE`, resting on the cascades and triggers that already exist,
  without touching the schema.
- **Interface**: `kind: "rebuild"` in `parse-command.ts`, its entry in
  `command-requirements.ts` and its branch in `run-cli.ts`.
- **Composition root**: `Application` exposes `rebuildIndex`, replaceable just
  like `retrieveCandidates` and `assembleContext`.

**There is no schema migration.** `rebuild` deletes rows through the cascades
already declared; it adds, removes and alters no table, index or trigger.

## The in-memory vector index

`InMemoryVectorSearchIndex` is the same instance that serves queries and receives
`sync`'s changes. After a purge its snapshot is left describing vectors that no
longer exist.

The first draft of this design took for granted that no new mechanism was needed:
the index **already invalidates its complete snapshot on `apply`** (a decision
from 2.2) and re-synchronisation publishes changes for each package.

**That was false, and the AH2 test proved it.** The purge deletes rows through
SQL, and SQL publishes nothing to the index: `apply` is the only thing that
invalidates it. A `rebuild` that ends with no packages — every source with an
empty or unreadable manifest — publishes not one change, so the previous snapshot
survives whole and `load()` keeps returning vectors whose fragments no longer
exist. Measured: 2 vectors served over a library with zero embeddings.

It is exactly the defect 4.4 found — the stale snapshot masking `VECTORS_STALE` —
reappearing through a new path, and it confirms the lesson of 13 and 14 August:
the system was answering correctly while something was broken.

Correction: `rebuildIndex` receives the `VectorIndexSink` and publishes a
`remove_packages` with the `PackageRef`s that were there, **after** the purge
commits, never before — the same order `sync` respects. The refs are collected
before purging, while the rows still exist, so that what is published names the
packages that actually went away.

## Out of scope

- Automatic reindexing on detecting vectors from mixed batches. `rebuild` is and
  remains explicit: the user runs it when they decide to run it.
- `rebuild --source <name>` to rebuild a single source. The approved contract
  does not include it and there is no evidence it is needed; adding a flag to the
  public contract requires separate approval.
- Adding the batch size to the model's identity. 4.3 discarded it with cause and
  `rebuild` is precisely the alternative that makes it unnecessary.
- Backup or rollback of the previous library. The source packages are immutable
  and remain on disk: the library is rebuildable by definition, which is the very
  reason this command can exist.
- A progress bar. `sync` already emits progress on stderr and `rebuild` inherits
  it.

## Blocks

| Block | Content                                                                        |
| ----- | ------------------------------------------------------------------------------ |
| AE    | The `purgeDerivedIndex` port and its transactional SQLite implementation       |
| AF    | The `rebuildIndex` use case: prior guard, purge, re-sync and aggregate receipt |
| AG    | CLI surface: `parse-command`, requirements, `run-cli` and receipt              |
| AH    | E2E over real SQLite, `cli-contract.md`, `SKILL.md` and `build.md`             |

## Why point 1 was closed without code

The priority order of 14 August put "sorting fragments by length before batching"
ahead of `rebuild`. It was discarded after verifying it against the code, not
against the document:

- `defaultBatchSize` is already `1` (`transformers-embedding-generator.ts:18`) and
  no product caller overrides it.
- Batching is a sequential slice
  (`transformers-embedding-generator.ts:373-375`): with batch 1 each call receives
  a single text, and padding is relative to the longest one in the batch. With no
  batch there is no padding to sort against; sorting the input does not change a
  single runtime operation.
- `embedDocuments` is called **per package** (`sync-source.ts:287-289`, inside the
  video loop), so the sortable universe would be one video's fragments, not the
  corpus the 1.93x was measured on.
- The measurement from 4.3 already said so: batch 16 sorted by length yields
  1.93x, against 2.27x for the batch 1 that was adopted. It was not an improvement
  over batch 1; it was the alternative that batch 1 beat.
- Reintroducing it would cost the determinism 4.3 celebrated: a fragment's vector
  would come to depend on which other fragments of the same video have a similar
  length.

It stands as **measured and discarded with cause**, not as pending. Only reopen it
if an independent reason appears to return to a batch larger than 1.
