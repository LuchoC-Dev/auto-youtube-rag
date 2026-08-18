# Vector search baseline

Target machine: Windows x64, Node.js 24.13.1, Intel i7-4790S and 7.9 GB of RAM.
Each backend was measured in a fresh process with normalized `float32[384]`
vectors, 50 queries per scale and `top-k = 20`.

| Backend    | Vectors | p50       | p95       | Queries/s | Disk    | Loaded RSS |
| ---------- | ------: | --------: | --------: | --------: | ------: | ---------: |
| Memory     |  10,000 |   5.70 ms |  10.12 ms |    159.29 | 19.6 MB |    88.5 MB |
| sqlite-vec |  10,000 |  30.87 ms |  34.85 ms |     31.65 | 15.3 MB |    81.0 MB |
| Memory     |  50,000 |  31.71 ms |  45.35 ms |     29.74 | 97.9 MB |   148.9 MB |
| sqlite-vec |  50,000 | 156.60 ms | 193.11 ms |      6.19 | 74.7 MB |    82.0 MB |

The `top-k` sets matched 100%. Both backends passed insertion, update, deletion
and reopening. `sqlite-vec` reduced memory and disk, but exact in-memory search
was roughly five times faster.

Confirmed decision: exact in-memory adapter for the MVP. `sqlite-vec` remains
available as a benchmark reference and a possible future adapter.
