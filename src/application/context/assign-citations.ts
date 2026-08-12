import type { CitationRecord, ContextUnitBlock } from "./context-blocks.js";

function citationId(index: number): string {
  return `S${String(index + 1).padStart(2, "0")}`;
}

/**
 * Assigns `[S01]`, `[S02]`... in the given order — the order the caller
 * already finalized after budget allocation. An omitted block never reaches
 * this function, so it never reserves or skips a number.
 */
export function assignCitations(
  blocks: readonly ContextUnitBlock[],
): readonly CitationRecord[] {
  return Object.freeze(
    blocks.map((block, index) => ({
      citationId: citationId(index),
      sourceName: block.packageRef.sourceName.value,
      videoId: block.packageRef.videoId.value,
      videoTitle: block.videoTitle,
      creator: block.creator,
      file: block.documentRelativePath,
      headingPath: block.headingPath,
      unitType: block.unitType,
      timestamp: block.timestamps[0] ?? null,
      visualEvidence: block.visualEvidence,
    })),
  );
}
