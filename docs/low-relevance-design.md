# Design 4.7: low relevance warning (`LOW_RELEVANCE`)

## Status

Proposed and implemented on 14 August 2026, from empirical evidence over the
real library of 51 videos.

It closes — partially, and in a different shape from the one anticipated — the
front that 2.2 left open as "a minimum vector similarity floor, barring clear
evidence" and that 3.2 could not close for lack of that evidence.

## The problem, reproduced with real data

Vector search is an exhaustive ranking with no similarity floor: every query
over a non-empty library returns candidates. Measured over the already indexed
`auto-design` collection:

```text
auto-youtube-rag retrieve "síntomas y tratamiento de la diabetes tipo 2 en adultos mayores"
→ status: "ok", 31,982 tokens, 29 videos, warnings: []
```

The first cited block came from _"8 advanced rules of minimal Web Design"_ and
talked about using at most two typefaces. **Nowhere does the bundle declare that
none of that answers the query**: `warnings` empty and `limitations` mentioning
only the exhausted budget.

An attentive agent detects it while reading the content — that is what 3.2
concluded and it remains true — but the product holds the signal and does not
communicate it.

## Why `fusedScore` cannot be used

RRF assigns `1/(k + rank)`: it encodes **position, not similarity**. The first
candidate of a perfect query and that of an absurd one receive exactly the same
`fusedScore`. Comparing `rawScore` across paths is no use either, and the port
itself warns about it: BM25 has no bound, cosine lives in `0..1`.

The only signal with an absolute meaning is the **cosine of the vector path**.

## The measurement

24 queries against the real library (51 videos, 3,635 fragments), classified by
hand into three groups, recording the cosine of the best hit:

| Class                                 | min    | max    | average |
| ------------------------------------- | ------ | ------ | ------- |
| **High** — in domain (10 queries)     | 0.8657 | 0.9012 | 0.8824  |
| **Medium** — technical, uncovered (5) | 0.8428 | 0.8600 | 0.8526  |
| **Low** — out of domain (9)           | 0.8149 | 0.8389 | 0.8253  |

The three classes **do not overlap**. But the margins are narrow: 0.0057
between high and medium, and **0.0039** between medium and low. E5 compresses
the whole distribution between 0.81 and 0.90, so no value drops below 0.80
however absurd the query is.

## Decisions

**The default threshold is `0.84`.** It cleanly separates the low class
(maximum 0.8389) from the medium one (minimum 0.8428) in the measured corpus.
The more conservative of the two possible cuts was chosen: warn only when the
query is clearly out of domain, instead of attempting to distinguish "medium"
from "high", where the margin is even finer and the judgement more debatable.

**The warning filters nothing.** `LOW_RELEVANCE` is informational: the bundle is
assembled just the same, with the same blocks and the same citations. It is the
point's most important design decision, and it is taken precisely because the
threshold is fragile:

- a threshold that is too high produces one warning too many — annoying, harmless;
- a threshold that is too low stays silent — exactly today's behaviour.

Neither of the two errors can hide real evidence or empty a bundle. A floor that
**discarded** candidates would carry the opposite risk and a far worse one, and
that is why it is still discarded, just as in 2.2 and 3.2.

**The threshold is configurable, not a hidden constant.** It lives in
`retrieval-thresholds.ts` alongside the table of measurements that justifies it,
and it can be injected by dependency. It is calibrated over **one** design
collection in Spanish: another corpus, another language or another model shift
the distribution, and the number would have to be measured again. That is
written where the number lives, not only in this document.

**It does not fire when the vector path did not take part.** If the vector path
failed, if there are no vectors for the active model (`VECTORS_STALE`) or if
there were no hits, there is no cosine to evaluate and the warning is not
emitted: a specific warning already exists for each of those cases, and adding
`LOW_RELEVANCE` would only add noise.

## Expected behaviour

| Query                                 | cosine | warns?  |
| ------------------------------------- | ------ | ------- |
| "jerarquía tipográfica en diseño web" | 0.8914 | no      |
| "arquitectura hexagonal en backend"   | 0.8600 | no      |
| "cómo configurar un pipeline de CI"   | 0.8428 | no      |
| "receta de pan de masa madre"         | 0.8389 | **yes** |
| "síntomas de la diabetes tipo 2"      | 0.8206 | **yes** |
| "historia de la revolución francesa"  | 0.8149 | **yes** |

## The number is always reported, not only when it warns

`metrics.top_vector_similarity` carries the cosine of the best vector hit on
**every** query (or `null` if the semantic path did not run). The warning is a
judgement with a debatable threshold; the number is the fact.

The reason is the product's philosophy: the querying agent is the only brain.
Deciding what a 0.84 means is exactly the kind of judgement the design delegates
to it, so giving it only the verdict — and not the evidence — would be
incoherent. With the number it can apply its own criterion, or calibrate another
threshold for its corpus without touching the product.

It also corrects a risk that the warning alone introduces: **false confidence
through absence**. An agent could reason "there is no `LOW_RELEVANCE`, so this is
relevant", and that is false — the threshold may not fire on tangential content.
With the number at hand, the absence of a warning stops being the only available
information.

How narrow the margin is was demonstrated in the first real run after
implementing it: "síntomas de la diabetes tipo 2" measured **0.8399** against a
floor of 0.84. One ten-thousandth more and it would not have warned, with the
content being just as irrelevant.

## Known limitation: the text path does not take part

The judgement rests on the vector cosine alone. If FTS5 were to find an exact
lexical match — a strong signal of relevance — but the cosine fell below the
floor, the warning would fire regardless: a false positive.

In practice it is unlikely, because a term present in the collection usually
raises the cosine as well. And the cost is bounded by design: since the warning
informs and does not filter, a false positive costs one warning too many, never
lost content. But the criterion does not cover that case and it is worth knowing
before raising the threshold.

## Out of scope

- **Filtering or discarding candidates by threshold.** The decision from 2.2 and
  3.2 is maintained.
- **Calibrating the threshold per library at run time.** It would be more robust
  than a constant, but it demands a baseline per corpus and there is no evidence
  yet that it is needed.
- **Changing `status`.** An out-of-domain query still returns `ok` with exit
  code `0`: real evidence was retrieved, only loosely related. Degrading it to
  `no_results` would be lying in the other direction.

## Blocks

| Block | Content                                                               |
| ----- | --------------------------------------------------------------------- |
| AI    | Measured threshold, warning code and emission in `retrieveCandidates` |
| AJ    | Propagation to the bundle, documentation and skill                    |
