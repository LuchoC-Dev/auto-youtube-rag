/**
 * Cosine similarity below which the semantic path is reporting content that
 * has little to do with the query.
 *
 * Measured on 14 August 2026 against the real `auto-design` library (51
 * videos, 3.635 fragments), taking the best vector hit for 24 hand-classified
 * queries:
 *
 * | class                                  | min    | max    | avg    |
 * | -------------------------------------- | ------ | ------ | ------ |
 * | in domain (10 queries)                 | 0.8657 | 0.9012 | 0.8824 |
 * | technical but not covered (5 queries)  | 0.8428 | 0.8600 | 0.8526 |
 * | plainly out of domain (9 queries)      | 0.8149 | 0.8389 | 0.8253 |
 *
 * The classes do not overlap, but the margins are thin: 0.0039 between the
 * worst "not covered" and the best "out of domain". E5 compresses every score
 * into 0.81..0.90, so nothing ever scores low in absolute terms — which is
 * exactly why a raw cosine reads as "high" even for a nonsense query.
 *
 * 0.84 is the conservative cut of the two available: it separates plainly
 * out-of-domain queries from everything else, instead of trying to split
 * "covered" from "adjacent", where the margin is finer and the judgement more
 * arguable.
 *
 * **This number is calibrated against one Spanish-language design collection.**
 * A different corpus, language or embedding model shifts the whole
 * distribution and invalidates it. It is a dependency rather than a constant
 * so it can be re-measured and injected without touching the use case.
 */
export const defaultLowRelevanceCosine = 0.84;
