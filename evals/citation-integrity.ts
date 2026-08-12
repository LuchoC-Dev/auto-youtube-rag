import type { ContextBundle } from "../src/application/context/context-bundle.js";

/**
 * A `[S0N]` marker in `context.md` with no matching `citation_id` in
 * `result.json.units`, or a unit in `result.json.units` whose `citation_id`
 * never appears as a marker in `context.md`. Either is a bug in the
 * assembly pipeline (`assignCitations`, `renderContextMarkdown`,
 * `renderContextResult`), never a quality finding to report from an eval
 * run — see `docs/eval-design.md`, "Capa A".
 */
export interface CitationIntegrityIssue {
  readonly kind: "orphan_citation" | "uncited_unit";
  readonly citationId: string;
}

const CITATION_MARKER_PATTERN = /\[(S\d+)\]/g;

function citationIdsInMarkdown(markdown: string): ReadonlySet<string> {
  return new Set(
    [...markdown.matchAll(CITATION_MARKER_PATTERN)].map((match) => {
      const citationId = match[1];

      if (citationId === undefined) {
        throw new Error(
          "citationIdsInMarkdown: capture group must match when the pattern matches.",
        );
      }

      return citationId;
    }),
  );
}

/**
 * Pure verification, no SQLite and no embedding model involved: every
 * citation marker in `bundle.markdown` must resolve to a unit in
 * `bundle.result.units`, and every unit must be cited at least once.
 * Order is deterministic — markdown-first, then result-first — so repeated
 * runs over the same bundle report issues in the same order.
 */
export function checkCitationIntegrity(
  bundle: ContextBundle,
): readonly CitationIntegrityIssue[] {
  const markdownCitationIds = citationIdsInMarkdown(bundle.markdown);
  const resultCitationIds = new Set(
    bundle.result.units.map((unit) => unit.citation_id),
  );
  const issues: CitationIntegrityIssue[] = [];

  for (const citationId of markdownCitationIds) {
    if (!resultCitationIds.has(citationId)) {
      issues.push({ kind: "orphan_citation", citationId });
    }
  }

  for (const citationId of resultCitationIds) {
    if (!markdownCitationIds.has(citationId)) {
      issues.push({ kind: "uncited_unit", citationId });
    }
  }

  return issues;
}
