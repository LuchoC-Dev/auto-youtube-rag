import type { SearchFragmentId } from "../../domain/indexing/identifiers.js";
import type { FusionInput, FusionStrategy } from "./fusion-strategy.js";
import type { FusedHit, RankedHit } from "./retrieval-results.js";

export type FusionErrorCode = "INVALID_FUSION_OPTIONS" | "INVALID_RANK";

export class FusionError extends Error {
  public constructor(
    public readonly code: FusionErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "FusionError";
  }
}

export interface RrfOptions {
  /**
   * Dampens the advantage of the top positions. The standard value of 60 keeps
   * a first place worth roughly as much as the gap between it and a hit around
   * position 60, which is why a second opinion can outweigh a single leader.
   */
  readonly k: number;
  readonly weightText: number;
  readonly weightVector: number;
}

export const defaultRrfOptions: RrfOptions = {
  k: 60,
  weightText: 1,
  weightVector: 1,
};

interface Accumulator {
  readonly fragmentId: SearchFragmentId;
  score: number;
  textRank: number | null;
  vectorRank: number | null;
}

function readPositiveNumber(value: number, field: string): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new FusionError(
      "INVALID_FUSION_OPTIONS",
      `${field} must be a finite number greater than zero`,
    );
  }

  return value;
}

function readRank(hit: RankedHit): number {
  if (!Number.isSafeInteger(hit.rank) || hit.rank < 1) {
    throw new FusionError(
      "INVALID_RANK",
      `rank must be a positive safe integer, received ${String(hit.rank)}`,
    );
  }

  return hit.rank;
}

/**
 * Reciprocal Rank Fusion. Deliberately ignores `rawScore`: BM25 is unbounded
 * and negative while cosine similarity lives in 0..1, so only their positions
 * are comparable. A fragment found by a single path keeps its contribution,
 * which is what preserves coverage.
 */
export function createRrfFusion(
  options: Partial<RrfOptions> = {},
): FusionStrategy {
  const k = readPositiveNumber(options.k ?? defaultRrfOptions.k, "k");
  const weightText = readPositiveNumber(
    options.weightText ?? defaultRrfOptions.weightText,
    "weightText",
  );
  const weightVector = readPositiveNumber(
    options.weightVector ?? defaultRrfOptions.weightVector,
    "weightVector",
  );

  function accumulate(
    totals: Map<string, Accumulator>,
    hits: readonly RankedHit[],
    weight: number,
    path: "text" | "vector",
  ): void {
    for (const hit of hits) {
      const rank = readRank(hit);
      const key = hit.fragmentId.value;
      const existing = totals.get(key);

      if (existing === undefined) {
        totals.set(key, {
          fragmentId: hit.fragmentId,
          score: weight / (k + rank),
          textRank: path === "text" ? rank : null,
          vectorRank: path === "vector" ? rank : null,
        });
        continue;
      }

      const currentRank =
        path === "text" ? existing.textRank : existing.vectorRank;

      // A repeated fragment inside one ranking keeps only its best position,
      // so a duplicate never inflates the fused score.
      if (currentRank !== null && currentRank <= rank) {
        continue;
      }

      if (currentRank !== null) {
        existing.score -= weight / (k + currentRank);
      }

      existing.score += weight / (k + rank);

      if (path === "text") {
        existing.textRank = rank;
      } else {
        existing.vectorRank = rank;
      }
    }
  }

  return {
    fuse(input: FusionInput): readonly FusedHit[] {
      const totals = new Map<string, Accumulator>();

      accumulate(totals, input.textHits, weightText, "text");
      accumulate(totals, input.vectorHits, weightVector, "vector");

      return [...totals.values()]
        .map((entry): FusedHit => ({
          fragmentId: entry.fragmentId,
          fusedScore: entry.score,
          textRank: entry.textRank,
          vectorRank: entry.vectorRank,
        }))
        .sort(compareFusedHits);
    },
  };
}

/**
 * Every tie is broken explicitly so the same library always answers a query in
 * the same order, regardless of insertion or promise resolution order.
 */
function compareFusedHits(left: FusedHit, right: FusedHit): number {
  if (left.fusedScore !== right.fusedScore) {
    return right.fusedScore - left.fusedScore;
  }

  const leftText = left.textRank ?? Number.MAX_SAFE_INTEGER;
  const rightText = right.textRank ?? Number.MAX_SAFE_INTEGER;

  if (leftText !== rightText) {
    return leftText - rightText;
  }

  return left.fragmentId.value.localeCompare(right.fragmentId.value, "en");
}
