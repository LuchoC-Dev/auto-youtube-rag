# Design 4.3: concurrency guard, ghost runs and batch size

## Status

Proposed and approved on 14 August 2026. Two independent pieces of work sharing
one origin: the cold run of 13 August.

## Part 1 — Cross-deletion between concurrent syncs

### The bug, confirmed

Until now the hypothesis was noted as plausible but unconfirmed. It was
reproduced deterministically on 14 August:

```text
3 packages indexed
run A marks video_1 and video_2 as seen
run B marks video_3 as seen
A finishes → deletePackagesNotSeen(A) deletes 1 (B's)
B finishes → deletePackagesNotSeen(B) deletes 2 (A's)
result: 0 packages
```

**Both runs finish without error, every video was seen by one of them, and the
source is left empty all the same.** It explains what was observed on 13 August,
when `status` reported 13 videos where there were 53.

Mechanism:

```sql
DELETE FROM video_packages WHERE source_id = ? AND last_seen_sync_id <> ?
```

Each run deletes what it did not claim itself. Whatever a concurrent run already
claimed looks unseen. The existing guard only validates that the run exists,
belongs to that source and is `running`; **it does not validate that it is the
only active one**, so two concurrent runs both pass it.

### Decision: reject the second sync, with no time heuristics

`sync` fails if there is already a `running` run for that source. Symbolic code
`SYNC_ALREADY_RUNNING`, exit `1`, and a message naming the active run's id and
when it started.

An age heuristic ("a run older than N minutes is dead") was discarded: no
defensible N exists. A sync of 60 videos takes 11 minutes and one of 500 would
take an hour and a half, so any threshold either kills live syncs or lets ghosts
through.

### Ghost runs

A dead process — Ctrl+C, closing the terminal, a power cut — leaves its run
`running` forever. Today that is harmless because nobody reads it; with the
guard it would come to block every future sync. With no way out, we would be
trading a silent bug for a noisy one.

Two mechanisms, both explicit:

- **`sync --force`**: marks the active run as `failed`, recording a `SyncIssue`
  with code `RUN_SUPERSEDED` that leaves it on record as abandoned rather than
  completed, and starts a new one. It is the way out when the user knows the
  process died.
- **`doctor` reports them**: a new `STALE_SYNC_RUN` check that lists the
  `running` runs per source, with their id and age. Status `error` only if one
  exists, with the message naming `sync --force`. That way the user finds out
  without having to deduce it from a failure.

No run is abandoned automatically. Marking another process's work as failed
without anyone asking is exactly the kind of decision the rest of the product
avoids.

### Where the guard lives

In the store, not in the use case: it is a persistence invariant and it has to
hold even if some other path starts a sync tomorrow. `recordRun` refuses to
record a `running` run for a source that already has another one `running`, with
a `SQLiteIndexStoreError` of code `SYNC_ALREADY_RUNNING`.

**Update of 14 August 2026:** the original version checked and then inserted
without atomicity, so it did not eliminate the race between two operating-system
processes. It was closed by wrapping the check and the write in a single
`BEGIN IMMEDIATE`, which takes the lock before reading. See `docs/decisions.md`,
section "Closing the cross-process race in `recordRun`".

## Part 2 — Embedding batch size

### The measurement

With real fragments from the library (13 to 511 tokens, 115 on average):

| Configuration             | frag/s | vs. current |
| ------------------------- | -----: | ----------: |
| Batch 1                   |  17.09 |       2.27x |
| Batch 2                   |  15.78 |       2.09x |
| Batch 16 sorted by length |  14.52 |       1.93x |
| Batch 4                   |  11.36 |       1.51x |
| **Batch 16 (current)**    |   7.54 |           — |
| Batch 32                  |   7.20 |       0.95x |
| Batch 64                  |   5.60 |       0.74x |

Cause: within a batch, every text is padded up to the longest one. With
fragments of 13 to 511 tokens, a batch of 16 makes a short fragment cost as much
as a 511-token one. Batch 1 has no padding possible.

Embedding accounts for practically all of `sync`'s time: 688 s projected against
660 s measured over 63 videos.

**Parallelising is no use.** Measured with real content: concurrency 2 → 0.99x,
concurrency 4 → 1.00x. ONNX already saturates the 8 cores internally, so
distributing videos across tasks would compete for the same CPU.

### Decision: `defaultBatchSize` goes from 16 to 1

A constant change that yields 2.27x. The sync of 63 videos drops from ~11
minutes to under 5.

`batchSize` remains configurable: the option is not removed, only the default
changes.

### A consequence that has to be declared

**The vectors change slightly with the batch size.** Measured: a cosine
deviation of 4.8×10⁻³ between batch 1 and batch 16 for the same text. The model
does not mask the padding perfectly.

Implications:

- The deviation (0.5%) is far below what separates two distinct fragments, so it
  should not move rankings.
- `unchanged()` does **not** detect it: the batch size is not part of the model's
  identity (`key`/`version`/`dimensions`), so an existing library keeps its old
  vectors and only the packages that change are reindexed with the new default.
  Mixed vectors remain.
- It is documented that reindexing is advisable but not mandatory. It is not
  forced: requiring 63 videos to be reindexed over a 0.5% deviation would be
  disproportionate.

**The batch size is not added to the model's identity.** It would make any
performance adjustment invalidate the entire library, which is worse than the
mixture it avoids.

A welcome side effect: with batch 1 embedding becomes deterministic with respect
to batch composition, because there is no batch.

## Out of scope

- Sorting fragments by length before batching (1.93x, less than batch 1 and more
  complex).
- A real database lock between operating-system processes.
- Automatic reindexing when the batch size changes.

## Blocks

| Block | Content                                                             |
| ----- | ------------------------------------------------------------------- |
| AA    | Guard in the store and cross-deletion regression                    |
| AB    | `sync --force`, `RUN_SUPERSEDED` and `doctor` with `STALE_SYNC_RUN` |
| AC    | `defaultBatchSize` to 1 and its documentation                       |
