# Embedding baseline

Measurements taken on the target machine, with Node.js 24.13.1 and each model run in a fresh process. Weights were loaded exclusively from the local cache.

| Model | Dim. | Disk | Hit@1 | Recall@5 | MRR | Average query | Indexing | Final RSS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| E5 Small | 384 | 129.1 MB | 100% | 100% | 1.000 | 11.5 ms | 40.72 passages/s | 570.5 MB |
| MiniLM | 384 | 129.1 MB | 93.75% | 100% | 0.953 | 9.7 ms | 52.06 passages/s | 564.0 MB |
| E5 Base | 768 | 282.0 MB | 100% | 100% | 1.000 | 29.0 ms | 15.04 passages/s | 720.4 MB |
| Jina ES | 768 | 156.8 MB | 87.5% | 100% | 0.922 | 25.7 ms | 14.13 passages/s | 504.8 MB |

## Reading

E5 Small and E5 Base resolved all 16 queries correctly in first position. E5 Small needed less than half the space of E5 Base, answered roughly 2.5 times faster and indexed about 2.7 times more passages per second.

MiniLM was the fastest, but placed query `q16` in fourth position. Jina ES placed `q02` in second position and `q16` in fourth. All four models kept the expected result within the first five.

The provisional recommendation is `e5-small`. This baseline uses 18 passages and 16 curated queries; it is not a definitive selection until the evaluation is repeated over a representative sample of the full corpus.
