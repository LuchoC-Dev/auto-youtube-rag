# SQLite client benchmark

## Objective

Choose the MVP's SQLite client between `node:sqlite` and `better-sqlite3`
without changing SQLite, FTS5 or the architectural boundaries already approved.

## Criteria

The decision weighs, in this order: API stability for Node 24, reproducible
installation on Windows x64, correctness, maintenance and distribution, and
finally performance. A minor difference in speed does not offset a greater
operational risk.

## Protocol

Both clients run, in separate processes, the same deterministic workload:

1. Create a fragment table and an FTS5 index kept in sync by triggers.
2. Insert 10,000 and 50,000 rows inside an immediate transaction.
3. Persist one `float32[384]` BLOB per row.
4. Update and delete content, close and reopen the database.
5. Run 100 FTS5 queries and compare their ordered IDs.
6. Walk every BLOB through iterators and compare the bytes read.
7. Create a backup and run `PRAGMA integrity_check`.
8. Record versions, latencies, throughput, RSS and on-disk size.

## Commands

```text
npm run benchmark:sqlite-client:smoke
npm run benchmark:sqlite-client
npm run typecheck
```

## Acceptance

- Both clients must install and load without manual compilation on the target machine.
- FTS5, transactions, BLOBs, iterators, reopening and backup must work.
- The FTS5 results and the bytes read must match.
- Every database and its backup must pass `integrity_check`.
- The benchmark reports a recommendation; adopting a client requires the user's approval.

## Limits

The data is synthetic and serves to compare adapters, not to measure the
semantic quality of the RAG. The generated databases stay in `.cache` and are
not versioned.

## Results

Environment: Windows x64, Node.js 24.13.1, SQLite 3.51.2, 8 GB of RAM. Both
clients produced exactly the same FTS5 results and BLOB bytes, and passed
update, deletion, reopening, backup and `integrity_check`.

| Run    | Client         |   Rows | Insertion    | FTS p50    | FTS p95    | BLOB stream | Backup      | Final RSS |
| ------ | -------------- | -----: | -----------: | ---------: | ---------: | ----------: | ----------: | --------: |
| Initial | node:sqlite    | 10,000 |  9,052.74 ms |  2.0086 ms |  3.8080 ms |   140.39 ms |   548.09 ms |   74.2 MB |
| Initial | better-sqlite3 | 10,000 |  1,386.31 ms |  2.8938 ms |  5.4999 ms |   108.45 ms |   545.14 ms |   89.8 MB |
| Initial | node:sqlite    | 50,000 |  7,353.82 ms |  9.5207 ms | 11.8866 ms |   420.07 ms | 5,216.01 ms |   75.5 MB |
| Initial | better-sqlite3 | 50,000 |  9,984.70 ms | 10.0378 ms | 12.9912 ms |   391.29 ms | 2,926.46 ms |   93.9 MB |
| Repeat | node:sqlite    | 10,000 |  2,812.64 ms |  2.1479 ms |  2.9668 ms |    85.79 ms | 5,358.38 ms |   81.0 MB |
| Repeat | better-sqlite3 | 10,000 |  1,319.69 ms |  1.8885 ms |  2.5818 ms |    90.22 ms |   464.27 ms |   89.3 MB |
| Repeat | node:sqlite    | 50,000 |  7,950.73 ms |  9.0014 ms | 10.9429 ms |   398.87 ms | 2,414.18 ms |   76.6 MB |
| Repeat | better-sqlite3 | 50,000 | 23,341.15 ms | 11.3503 ms | 18.3405 ms |   460.06 ms | 2,845.83 ms |   95.0 MB |

Insertion and backup varied too much between runs to ground the decision,
probably because of caching and disk activity. FTS5 and BLOB reading were
comparable; at 50,000 rows `node:sqlite` obtained lower FTS5 latency in both
runs. It also used between 8.3 and 18.4 MB less final RSS.

## Installation and stability findings

- `node:sqlite` worked without additional packages or bindings, although Node
  24.13.1 still emits an experimental warning.
- The documentation for Node 24.15.0 and later classifies the API as a release
  candidate. The project was updated and validated with Node 24.19.0 LTS.
- `better-sqlite3` 12.6.2 declares support for Node 24 and its Windows x64
  prebuild worked, but the local `ignore-scripts=true` setting prevented it from
  being installed automatically. It was necessary to run
  `npm rebuild better-sqlite3 --ignore-scripts=false`.
- `better-sqlite3` added 37 packages and a native binding. The audit attributed
  no new vulnerabilities to those packages; the four existing alerts come from
  the embeddings dependency.

## Confirmed decision

The user approved `node:sqlite` as the initial adapter and Node 24.19.0 LTS as
the development runtime. It delivers every required capability, avoids a native
dependency and works with installations that disable scripts. The benchmark does
not show a consistent advantage for `better-sqlite3` that would offset that
distribution cost. The choice does not change the domain: access will remain
behind `KnowledgeRepository` and `TextSearchIndex`.

A smoke run after the update validated both clients with Node 24.19.0.
`node:sqlite` used SQLite 3.53.3 and did not emit the experimental warning
observed with Node 24.13.1.
