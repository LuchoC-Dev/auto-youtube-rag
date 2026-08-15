# Codes, states and failure recovery

Read this file when a command fails, returns an exit code other than `0`, or
produces `warnings` you do not know how to interpret. For problems with the
installation, the paths or the embedding model, read `setup.md` instead.

## Process exit codes

|  Code | Meaning                                                     | What to do                                            |
| ----: | ----------------------------------------------------------- | ----------------------------------------------------- |
|   `0` | Success, including `no_results`, `no_changes`, etc.         | Carry on normally.                                    |
|   `1` | Operational failure or partial result (`status: "partial"`) | Check `warnings`/`limitations`; do not retry blindly. |
|   `2` | Invalid use of the CLI (a misspelled argument)              | Fix the command, it is not a bug of the product.      |
| `130` | Manual interruption (Ctrl+C)                                | Does not apply to non-interactive use.                |

A code `2` is always yours: a misspelled flag, an invented `--depth` preset or a
`--max-tokens` that is not a positive integer. Fix the command instead of
investigating the product.

## `status` in the `retrieve` receipt

- `"ok"`: there is a bundle with evidence. A `status: "ok"` with low relevance
  is still a valid and expected result, not an error — semantic search discards
  nothing for similarity, so queries barely related to the collection still
  return candidates. **Since point 4.7 that is no longer silent**: when the best
  score stays below the calibrated floor, `LOW_RELEVANCE` appears in `warnings`
  (see below). It is still worth reading `Coverage and limitations` in
  `context.md` before trusting the relevance blindly: the warning may not fire
  and the content may be tangential.
- `"no_results"`: the library (after applying `--source` or other filters) was
  left with no candidates. The bundle is written all the same, explaining the
  absence of evidence. It is not a failure of the command.
- `"partial"`: a retrieval path degraded (for example, textual or vector search
  unavailable) but a usable bundle was produced anyway. Check `warnings` before
  trusting the coverage.

## Symbolic codes

Every JSON output includes stable symbolic codes (for example
`SOURCE_NOT_FOUND`, `PACKAGE_INVALID`) and a `retryable` where appropriate. Use
them to decide whether retrying makes sense or whether human intervention is
needed.

Installation status codes, all resolved in `setup.md`:

| Code                       | What it means                                                        |
| -------------------------- | -------------------------------------------------------------------- |
| `LIBRARY_NOT_FOUND`        | The database is missing. Run `init`.                                 |
| `MODEL_NOT_INSTALLED`      | The model is missing or damaged. Run `models install`.               |
| `MODEL_SOURCE_INVALID`     | `--from` points at a path without the complete model. A usage error. |
| `MODEL_DOWNLOAD_FAILED`    | The network failed during the download. It is retryable.             |
| `DATABASE_INTEGRITY_ERROR` | The database is damaged. Run `doctor` for the detail.                |
| `LEGACY_LIBRARY_FOUND`     | Warning: there is an old database relative to the current directory. |

None of the first three is transient: retrying the same command without changing
anything fails again just the same.

Separately, in the `warnings` of `retrieve`:

| Code                        | What it means                                                                        |
| --------------------------- | ------------------------------------------------------------------------------------ |
| `EMBEDDING_MODEL_MISSING`   | The vector path degraded; the bundle is produced anyway, with the textual path only. |
| `VECTOR_SEARCH_UNAVAILABLE` | The vector path failed with an error; the bundle was built with textual search only. |
| `TEXT_SEARCH_UNAVAILABLE`   | The textual path failed; the bundle was built with semantic search only.             |
| `VECTORS_STALE`             | The library has content but **no vector** for the active model.                      |
| `LOW_RELEVANCE`             | Nothing in the library really answers the query. See below.                          |

In the first three the bundle is usable, but it was built with a single path.
Say so if you are going to rely on that evidence.

**`VECTORS_STALE` deserves separate attention.** It means that semantic search
did not take part at all: the results came only from lexical matching, so the
coverage is considerably worse than usual. It happens when the vectors do not
correspond to the active model, typically because the library was indexed with
another model and has not been regenerated yet.

It is resolved by reindexing:

```text
auto-youtube-rag sync
```

If `sync` answers `no_changes` and the warning **keeps appearing**, the packages
did not change and neither did the model, so incremental indexing has nothing to
recalculate. At that point the full regeneration has to be forced:

```text
auto-youtube-rag rebuild --confirm
```

Until then you can use the bundle, but **say in your answer that semantic search
did not take part**: relevant content that lexical matching cannot reach may be
missing.

## `LOW_RELEVANCE`

**It is not a degradation**: every path worked, the bundle is complete and
properly cited. What it says is that the library **has no content on the topic
queried**, and that is why `status` is still `"ok"` with exit code `0`.

It appears because vector search is an exhaustive ranking with no floor: any
query over a non-empty library returns something, even if it is the least
distant material rather than an answer. The message includes the real score and
the threshold, for example `0.8206 against a 0.84 relevance floor`.

What to do when it appears:

- **Say so in your answer.** Do not present that content as if it answered the
  question; most likely it is unrelated.
- **Read the bundle anyway before discarding it.** The threshold is calibrated
  over a particular collection and can be wrong: if the content turns out to be
  pertinent, use it and state the nuance.
- **Do not retry the same command**: it will give exactly the same thing. If you
  believe the library does cover the topic, rephrase the query with the terms
  the video would use.
- **If you expected coverage and there is none**, a source may need
  synchronising (`sync`) or registering outright (`source add`).

**The number is always available**, whether or not the warning fires:
`metrics.top_vector_similarity` in `result.json` carries the cosine of the best
semantic result. Use it to judge on your own instead of trusting only the
presence or absence of the warning — the threshold is calibrated over a
particular collection and the margin is thin. A real case measured `0.8399`
against a floor of `0.84`: one ten-thousandth more and it would not have warned.

## `sync` failed partially

An invalid package does not block the rest of the collection: it is isolated as
an issue and the other videos are indexed all the same. Check `warnings` in the
receipt to see which videos were left out and why.

An interrupted, relaunched or half-cut `sync` **does not corrupt the library**:
the next complete run rebuilds the correct state. Do not try to repair anything
by hand.

## `sync` looks hung

Before assuming it failed, read the `sync` section of `SKILL.md`: the first
indexing of a large collection takes between 5 and 10 minutes, and that is
normal.

Do not use the video count of `status` as a progress signal: while a `sync` is
in progress it can go up and down. The only reliable signal that it finished is
the JSON receipt of the command itself.

A second simultaneous `sync` is no longer possible: the product rejects it with
`SYNC_ALREADY_RUNNING`.

## `SYNC_ALREADY_RUNNING`

There is an active run for that source. Two cases:

1. **A `sync` is really still working.** Wait for its JSON receipt. Do not force
   anything.
2. **A previous `sync` died** (Ctrl+C, terminal closed, power cut) and left its
   record marked as active. `doctor` reports it as `STALE_SYNC_RUN` with its
   age. To unblock it:

   ```text
   auto-youtube-rag sync --force
   ```

   It marks the abandoned run as failed —leaving a `RUN_SUPERSEDED` issue as a
   record— and starts a new one.

The age that `doctor` reports is the signal that tells the two cases apart: a
run of minutes is probably still alive; one of hours is not.

`rebuild` emits the same code, with one difference: it covers **every** source,
so an active run in any of them blocks it, and it **does not accept `--force`**.
Unblock first with `sync --source <name> --force` and then run the rebuild.

## `rebuild` ended in `partial` or `failed`

`partial` means that some source degraded while being regenerated, and the
others were rebuilt correctly; `failed`, that none could be rebuilt. In both
cases the exit code is `1` and the `issues` of the receipt say which video
failed and why — they are read just like those of `sync`.

**The library is not left corrupt.** If the process is interrupted halfway
(Ctrl+C, power cut, terminal closed) it is left partially rebuilt, which is not
a damaged state and requires no manual repair: run `rebuild --confirm` again,
which always leaves the same result. In the meantime `retrieve` may return less
context than expected.

What `rebuild` does **not** fix: a `sync` that failed because of an invalid
package. That is solved by reading the `issues` of the `sync` receipt, not by
deleting and regenerating the whole library.

## Verifying integrity

`auto-youtube-rag doctor` runs a read-only check over SQLite, FTS5, the local
model and the schema. It is safe to run at any moment and modifies nothing. If
`doctor` says `ok` but a result looks odd to you, the problem is not one of
database integrity.
