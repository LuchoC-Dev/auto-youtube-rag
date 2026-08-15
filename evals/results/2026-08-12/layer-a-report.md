## Layer A — mechanical metrics

**Note on the bundles:** the 24 generated bundles (`context.md` and
`result.json` per query and depth) are not versioned in this repository
because they contain verbatim text derived from third-party YouTube videos.
Regenerate them by running `evals/run-seed-queries.ts` over
`evals/queries/seed-queries.json` against your own collection.

| Query | Kind | Depth | Status | Expected | Match | Candidates | Units | Sources | Tokens | Budget exhausted | Omitted | Warnings |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| es-concept-brutalism | concept | focused | ok | ok | yes | 50 | 60 | 20 | 11681 | yes | 22 | — |
| es-concept-brutalism | concept | balanced | ok | ok | yes | 50 | 63 | 20 | 29737 | yes | 19 | — |
| es-concept-brutalism | concept | deep | ok | ok | yes | 50 | 67 | 20 | 62781 | yes | 15 | — |
| en-concept-visual-hierarchy | concept | focused | ok | ok | yes | 50 | 67 | 23 | 11986 | yes | 25 | — |
| en-concept-visual-hierarchy | concept | balanced | ok | ok | yes | 50 | 83 | 23 | 31751 | yes | 9 | — |
| en-concept-visual-hierarchy | concept | deep | ok | ok | yes | 50 | 92 | 23 | 45752 | no | 0 | — |
| es-rare-term-kerning | rare_term | focused | ok | ok | yes | 50 | 67 | 22 | 11941 | yes | 43 | — |
| es-rare-term-kerning | rare_term | balanced | ok | ok | yes | 50 | 89 | 22 | 31983 | yes | 21 | — |
| es-rare-term-kerning | rare_term | deep | ok | ok | yes | 50 | 96 | 22 | 63918 | yes | 14 | — |
| es-paraphrase-saturated-colors | paraphrase | focused | ok | ok | yes | 50 | 43 | 19 | 11993 | yes | 36 | — |
| es-paraphrase-saturated-colors | paraphrase | balanced | ok | ok | yes | 50 | 58 | 23 | 28813 | yes | 21 | — |
| es-paraphrase-saturated-colors | paraphrase | deep | ok | ok | yes | 50 | 62 | 23 | 62828 | yes | 17 | — |
| multilingual-grid-systems | multilingual | focused | ok | ok | yes | 50 | 37 | 16 | 11999 | yes | 49 | — |
| multilingual-grid-systems | multilingual | balanced | ok | ok | yes | 50 | 63 | 21 | 31973 | yes | 23 | — |
| multilingual-grid-systems | multilingual | deep | ok | ok | yes | 50 | 69 | 21 | 63879 | yes | 17 | — |
| en-multilingual-typography-pairing | multilingual | focused | ok | ok | yes | 50 | 68 | 22 | 11963 | yes | 33 | — |
| en-multilingual-typography-pairing | multilingual | balanced | ok | ok | yes | 50 | 75 | 22 | 31989 | yes | 26 | — |
| en-multilingual-typography-pairing | multilingual | deep | ok | ok | yes | 50 | 99 | 22 | 63893 | yes | 2 | — |
| es-no-answer-unrelated-topic | no_answer | focused | ok | no_results | no | 50 | 44 | 23 | 11997 | yes | 35 | — |
| es-no-answer-unrelated-topic | no_answer | balanced | ok | no_results | no | 50 | 55 | 25 | 31944 | yes | 24 | — |
| es-no-answer-unrelated-topic | no_answer | deep | ok | no_results | no | 50 | 60 | 25 | 63618 | yes | 19 | — |
| es-rules-comparison-brutalism-minimalism | comparison | focused | ok | ok | yes | 50 | 51 | 19 | 11958 | yes | 25 | — |
| es-rules-comparison-brutalism-minimalism | comparison | balanced | ok | ok | yes | 50 | 59 | 19 | 30198 | yes | 17 | — |
| es-rules-comparison-brutalism-minimalism | comparison | deep | ok | ok | yes | 50 | 64 | 19 | 63651 | yes | 12 | — |

### Status divergences from expectation

- `es-no-answer-unrelated-topic` at `focused`: got `ok`, expected `no_results` for kind `no_answer`.
- `es-no-answer-unrelated-topic` at `balanced`: got `ok`, expected `no_results` for kind `no_answer`.
- `es-no-answer-unrelated-topic` at `deep`: got `ok`, expected `no_results` for kind `no_answer`.

### Budget exhaustion rate by depth

- `focused`: 8/8 (100%) queries exhausted the budget.
- `balanced`: 8/8 (100%) queries exhausted the budget.
- `deep`: 7/8 (88%) queries exhausted the budget.
