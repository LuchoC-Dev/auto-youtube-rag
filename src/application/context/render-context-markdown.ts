import type { ContextBudget } from "../../domain/context/context-budget.js";
import type { RetrievalWarning } from "../retrieval/retrieval-results.js";
import {
  classifyContextSection,
  type BudgetAllocation,
  type CitationRecord,
  type ContextUnitBlock,
} from "./context-blocks.js";

export interface RenderContextMarkdownInput {
  readonly query: string;
  readonly budget: ContextBudget;
  readonly allocation: BudgetAllocation;
  /** Same order and length as `allocation.included`, i.e. the direct output
   * of `assignCitations(allocation.included)`. */
  readonly citations: readonly CitationRecord[];
  readonly warnings: readonly RetrievalWarning[];
  readonly sourceFilter: readonly string[];
}

function frontMatter(input: RenderContextMarkdownInput): string {
  return [
    "---",
    'schema_version: "1.0"',
    `query: ${JSON.stringify(input.query)}`,
    `depth: ${input.budget.depth}`,
    `estimated_tokens: ${String(input.allocation.estimatedTokens)}`,
    `sources_used: ${String(countDistinctSources(input.allocation.included))}`,
    "---",
  ].join("\n");
}

function countDistinctSources(blocks: readonly ContextUnitBlock[]): number {
  return new Set(blocks.map((block) => block.packageRef.serialize())).size;
}

function blockHeading(block: ContextUnitBlock): string {
  if (block.headingPath.length > 0) {
    return block.headingPath.join(" > ");
  }

  return block.title ?? "Untitled";
}

function renderBlock(
  block: ContextUnitBlock,
  citation: CitationRecord,
): string {
  return [
    `### ${blockHeading(block)}`,
    "",
    block.content,
    "",
    `[${citation.citationId}]`,
  ].join("\n");
}

function renderSection(
  heading: string,
  entries: readonly {
    readonly block: ContextUnitBlock;
    readonly citation: CitationRecord;
  }[],
): string {
  if (entries.length === 0) {
    return [`## ${heading}`, "", "No evidence matched this section."].join(
      "\n",
    );
  }

  return [
    `## ${heading}`,
    "",
    entries
      .map(({ block, citation }) => renderBlock(block, citation))
      .join("\n\n"),
  ].join("\n");
}

function renderQueryAndScope(input: RenderContextMarkdownInput): string {
  const lines = [
    `Query: ${input.query}`,
    `Depth: ${input.budget.depth} (max ${String(input.budget.maxTokens)} estimated tokens)`,
  ];

  if (input.sourceFilter.length > 0) {
    lines.push(`Sources restricted to: ${input.sourceFilter.join(", ")}`);
  }

  return ["## Query and scope", "", lines.join("\n")].join("\n");
}

function renderCoverageAndLimitations(
  input: RenderContextMarkdownInput,
): string {
  const lines: string[] = [];

  lines.push(
    `- Blocks considered: ${String(input.allocation.included.length + input.allocation.omittedCount)}`,
  );
  lines.push(`- Blocks included: ${String(input.allocation.included.length)}`);

  if (input.allocation.budgetExhausted) {
    lines.push(
      `- The token budget was exhausted; ${String(input.allocation.omittedCount)} additional block(s) with real evidence were left out.`,
    );
  }

  for (const warning of input.warnings) {
    lines.push(`- ${warning.message}`);
  }

  if (input.sourceFilter.length > 0) {
    lines.push(
      `- Results were restricted to the requested source(s): ${input.sourceFilter.join(", ")}.`,
    );
  }

  if (lines.length === 2) {
    lines.push("- No degradation or truncation occurred for this query.");
  }

  return ["## Coverage and limitations", "", lines.join("\n")].join("\n");
}

function renderSourceRegistry(blocks: readonly ContextUnitBlock[]): string {
  const seen = new Map<string, ContextUnitBlock>();

  for (const block of blocks) {
    seen.set(block.packageRef.serialize(), block);
  }

  if (seen.size === 0) {
    return ["## Source registry", "", "No sources contributed evidence."].join(
      "\n",
    );
  }

  const rows = [...seen.values()].map(
    (block) =>
      `- ${block.packageRef.sourceName.value} / ${block.packageRef.videoId.value}` +
      (block.videoTitle !== null ? ` — ${block.videoTitle}` : "") +
      (block.creator !== null ? ` (${block.creator})` : ""),
  );

  return ["## Source registry", "", rows.join("\n")].join("\n");
}

/**
 * Pure Markdown renderer for `context.md`. Organizes already-selected
 * evidence; it never answers the query or adds inference of its own.
 */
export function renderContextMarkdown(
  input: RenderContextMarkdownInput,
): string {
  const entries = input.allocation.included.map((block, index) => {
    const citation = input.citations[index];

    if (citation === undefined) {
      throw new Error(
        "renderContextMarkdown: citations must align with allocation.included by index.",
      );
    }

    return { block, citation };
  });

  const bySection = {
    highest_relevance: entries.filter(
      (entry) => classifyContextSection(entry.block) === "highest_relevance",
    ),
    related_rules: entries.filter(
      (entry) => classifyContextSection(entry.block) === "related_rules",
    ),
    additional_context: entries.filter(
      (entry) => classifyContextSection(entry.block) === "additional_context",
    ),
  };

  return [
    frontMatter(input),
    "",
    "# Context package",
    "",
    renderQueryAndScope(input),
    "",
    renderSection("Highest-relevance context", bySection.highest_relevance),
    "",
    renderSection("Related rules and patterns", bySection.related_rules),
    "",
    renderSection("Additional relevant context", bySection.additional_context),
    "",
    renderCoverageAndLimitations(input),
    "",
    renderSourceRegistry(input.allocation.included),
    "",
  ].join("\n");
}
