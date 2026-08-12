import type { RetrievalLimits } from "../../domain/retrieval/retrieval-query.js";
import type { RetrievalCandidate } from "./retrieval-results.js";

export interface SelectCandidatesInput {
  /** Must already be sorted by descending fused score. */
  readonly candidates: readonly RetrievalCandidate[];
  readonly limits: RetrievalLimits;
}

/**
 * Reduces fused, hydrated candidates to the final list.
 *
 * Deduplication runs before diversity on purpose: two fragments from the same
 * unit are redundant, while two sections from the same video are legitimate
 * context up to the per-video limit. Both passes preserve the incoming score
 * order, so the result stays deterministic as long as the input is.
 */
export function selectCandidates(
  input: SelectCandidatesInput,
): readonly RetrievalCandidate[] {
  const seenUnits = new Set<string>();
  const deduplicated: RetrievalCandidate[] = [];

  for (const candidate of input.candidates) {
    const key = candidate.unitId.value;

    if (seenUnits.has(key)) {
      continue;
    }

    seenUnits.add(key);
    deduplicated.push(candidate);
  }

  const perVideo = new Map<string, number>();
  const diversified: RetrievalCandidate[] = [];

  for (const candidate of deduplicated) {
    const videoKey = candidate.packageRef.serialize();
    const count = perVideo.get(videoKey) ?? 0;

    if (count >= input.limits.maxPerVideo) {
      continue;
    }

    perVideo.set(videoKey, count + 1);
    diversified.push(candidate);
  }

  return diversified.slice(0, input.limits.fusedResults);
}
