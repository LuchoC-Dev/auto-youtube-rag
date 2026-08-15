# Embedding model benchmark

## Objective

Compare local multilingual models compatible with Transformers.js before
selecting the MVP's semantic backend. The benchmark does not evaluate the
quality of the complete RAG; it isolates dense retrieval over a small, traceable
fixture.

## Models

| ID          | Repository                                    | Expected dimension | Configuration              |
| ----------- | --------------------------------------------- | -----------------: | -------------------------- |
| `e5-small`  | `Xenova/multilingual-e5-small`                |                384 | `q8`, E5 prefixes          |
| `minilm`    | `Xenova/paraphrase-multilingual-MiniLM-L12-v2` |                384 | `q8`                       |
| `e5-base`   | `Xenova/multilingual-e5-base`                 |                768 | `q8`, E5 prefixes          |
| `jina-es`   | `jinaai/jina-embeddings-v2-base-es`           |                768 | Explicit quantised ONNX    |

## Fixture

The fixture contains fragments derived from real, validated `auto-design`
packages. The queries mix Spanish and English in order to measure monolingual
and cross-lingual retrieval. Each query declares one or more relevant IDs.

The fixture is deliberately small. It serves to detect incompatibility, obvious
regressions and initial differences; it does not replace the MVP's evaluations
over the whole corpus.

## Metrics

- `hit_at_1`: proportion of queries whose first result is relevant.
- `recall_at_5`: proportion with at least one relevant result among the first five.
- `mrr`: mean reciprocal rank of the first relevant result.
- model load time;
- fixture indexing time and throughput;
- average query latency;
- RSS observed after loading and running;
- bytes present in the model cache.

## Procedure

```text
npm install
npm run typecheck
npm run models:download:benchmarks
npm run benchmark:embeddings
```

The download uses `.cache/models`, ignored by Git. The final measurement runs
with `local_files_only` so that network time is not mixed with inference. The
models are processed sequentially to reduce memory pressure.

The memory comparison is repeated with a fresh Node process per model to prevent
ONNX's native reservations from contaminating the next measurement.

The reviewed baseline is kept in
`benchmarks/embeddings/results/baseline.md` and `baseline.json`.

## Decision criterion

The smallest model that maintains good retrieval in Spanish, English and
cross-lingual queries is preferred. A marginal quality improvement does not
justify doubling memory or latency on the target hardware. The winner will have
to be evaluated again over real queries once the MVP is complete.
