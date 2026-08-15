# sqlite-vec benchmark

## Objective

Determine whether `sqlite-vec` is compatible and stable enough to be the MVP's
first `VectorSearchIndex` adapter, comparing it against an exact search
implemented in memory by the application.

## Environment

- Windows x64.
- Node.js 24.13.1 or later within the 24 line.
- `node:sqlite` as the database client.
- `sqlite-vec` 0.1.9.
- `float32` vectors of 384 dimensions, identical to E5 Small's output.

## Commands

```text
npm install
npm run typecheck
npm run benchmark:vector -- --sizes=10000,50000 --queries=50 --k=20
npm run benchmark:vector:smoke
```

## Structure

```text
benchmarks/vector-search/run.ts       comparative harness
benchmarks/vector-search/results/     generated runs and reviewed baseline
docs/benchmarks/sqlite-vec.md         protocol, results and decision
```

## Protocol

1. Generate normalised vectors and queries through a PRNG with a fixed seed.
2. Insert the same set into an ordinary SQLite table and into a `vec0` virtual
   table.
3. Build the in-memory adapter from the persisted BLOBs, so that its real load
   cost is included.
4. Run exact L2 searches over normalised vectors, equivalent in ranking to
   cosine distance, and compare IDs.
5. Measure insertion, load, p50/p95 latencies, throughput, RSS and bytes on disk.
6. Close and reopen the database to verify persistence.
7. Update and delete rows, and check that no stale results appear.

The main scales are 10,000 and 50,000 vectors. Smoke mode uses a small dataset
and validates compatibility and basic operations only.

## Style

The harness uses strict TypeScript, deterministic data and versioned JSON
results. The adapters share input and output types; no measurement modifies
video packages or the product's domain.

## Verification

- `sqlite-vec` loads from a clean npm installation on Windows.
- The extension reports its version and accepts 384-dimension vectors.
- Insertion, query, update, deletion and reopening work.
- The first `k` IDs match the exact reference within the documented tolerance.
- A failure produces a non-zero process and is recorded in JSON.

## Limits

### Always

- Run both backends with the same data and queries.
- Separate data generation time from search metrics.
- Keep a reviewed baseline and exclude temporary runs from Git.

### Ask first

- Changing dimensions, metric or acceptance scales.
- Replacing the exact in-memory backend approved for the MVP.

### Never

- Interpreting a synthetic dataset as an evaluation of semantic quality.
- Using experimental approximate indexes as the grounds for the decision.
- Hiding installation failures or unsupported operations.

## Decision criterion

`sqlite-vec` will be recommendable if it passes every operation, keeps exact
results, usefully reduces memory or latency at 50,000 vectors and introduces no
reproducible installation problem. The benchmark reports the recommendation;
adoption requires the user's approval.

## Results

The reviewed run was performed with 50 queries per scale and `top-k = 20`. Both
backends returned the same `top-k` sets, hit the expected result in first
position and passed update, deletion and reopening.

| Backend    | Vectors | Insertion   |       p50 |       p95 | Queries/s |   Disk | RSS loaded |
| ---------- | ------: | ----------: | --------: | --------: | --------: | -----: | ---------: |
| In-memory  |  10,000 |   552.62 ms |   5.70 ms |  10.12 ms |    159.29 | 19.6 MB |    88.5 MB |
| sqlite-vec |  10,000 |   617.62 ms |  30.87 ms |  34.85 ms |     31.65 | 15.3 MB |    81.0 MB |
| In-memory  |  50,000 | 2,352.90 ms |  31.71 ms |  45.35 ms |     29.74 | 97.9 MB |   148.9 MB |
| sqlite-vec |  50,000 | 2,581.07 ms | 156.60 ms | 193.11 ms |      6.19 | 74.7 MB |    82.0 MB |

The in-memory adapter was approximately five times faster. At 10,000 vectors,
`sqlite-vec` saved 7.5 MB of RSS and 4.3 MB of disk; at 50,000 it saved 66.9 MB
of RSS and 23.2 MB of disk. It also avoided the index's initial load, which took
95.75 ms and 519.15 ms respectively in memory.

## Compatibility findings

- The npm package installed the Windows x64 binary without manual compilation.
- `node:sqlite` loaded `sqlite-vec` 0.1.9 and accepted `float32[384]` vectors.
- Primary keys and the `k` parameter must be bound as `BigInt` so that `vec0`
  receives them as strict integers.
- Node.js 24.13.1 still marks `node:sqlite` as experimental.
- `sqlite-vec` remains pre-v1 and may introduce breaking changes.

## Confirmed decision

`sqlite-vec` is technically viable, exact and operational on the target machine,
but it does not offer the best balance for the initial volume. The user
confirmed the exact in-memory adapter, with the vectors persisted as BLOBs in
SQLite. At 10,000 vectors its additional memory cost is small and its latency is
much lower. Even at 50,000, the 66.9 MB saved by `sqlite-vec` represent less
than 1% of the machine's total RAM.

`sqlite-vec` remains an alternative adapter for when memory or load time matter
more than latency, or when its approximate indexes mature. Any replacement will
have to preserve the `VectorSearchIndex` port.
