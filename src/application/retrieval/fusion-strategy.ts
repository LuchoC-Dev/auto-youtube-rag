import type { FusedHit, RankedHit } from "./retrieval-results.js";

export interface FusionInput {
  readonly textHits: readonly RankedHit[];
  readonly vectorHits: readonly RankedHit[];
}

/**
 * Combines the two retrieval paths into one ordered list. Kept behind an
 * interface so the baseline can be recalibrated, or replaced outright, once
 * the evaluations of stage 3.2 exist — without touching the use case or the
 * adapters.
 */
export interface FusionStrategy {
  fuse(input: FusionInput): readonly FusedHit[];
}
