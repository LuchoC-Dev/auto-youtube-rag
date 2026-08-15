import type { KnowledgeRepository } from "../ports/knowledge-repository.js";
import type { KnowledgeUnit } from "../../domain/indexing/knowledge-unit.js";
import type { RetrievalOutcome } from "../retrieval/retrieval-results.js";
import { allocateBudget } from "./allocate-budget.js";
import { assignCitations } from "./assign-citations.js";
import type { ContextBundle } from "./context-bundle.js";
import type { ContextRequest } from "./context-request.js";
import { deduplicateBlocks } from "./deduplicate-blocks.js";
import { expandToAncestors } from "./expand-to-ancestors.js";
import { renderContextMarkdown } from "./render-context-markdown.js";
import { renderContextResult } from "./render-context-result.js";

export interface AssembleContextDependencies {
  /** Typically `Application.retrieveCandidates`, injected as a function so
   * this use case only depends on the shape it needs, not on every port
   * `retrieveCandidates` itself requires. */
  readonly retrieveCandidates: (
    request: ContextRequest["query"],
  ) => Promise<RetrievalOutcome>;
  readonly knowledgeRepository: KnowledgeRepository;
}

/**
 * Orchestrates 2.2's retrieval with 2.3's expansion, deduplication, budget
 * allocation, citation assignment and rendering. Only knows ports: no
 * SQLite, no `node:fs`, no Transformers.js.
 */
export async function assembleContext(
  dependencies: AssembleContextDependencies,
  request: ContextRequest,
): Promise<ContextBundle> {
  const outcome = await dependencies.retrieveCandidates(request.query);

  const candidateUnitIds = [
    ...new Map(
      outcome.candidates.map((candidate) => [
        candidate.unitId.value,
        candidate.unitId,
      ]),
    ).values(),
  ];

  // Two batches, not one query per candidate: getUnits recovers each
  // candidate's own parentId (KnowledgeUnit does not travel inside
  // RetrievalCandidate), and getAncestors resolves the full chains those
  // parentIds reach into.
  const [candidateUnitsList, ancestorUnits] = await Promise.all([
    dependencies.knowledgeRepository.getUnits(candidateUnitIds),
    dependencies.knowledgeRepository.getAncestors(candidateUnitIds),
  ]);

  const candidateUnits = new Map<string, KnowledgeUnit>(
    candidateUnitsList.map((unit) => [unit.id.value, unit]),
  );

  const expanded = expandToAncestors({
    candidates: outcome.candidates,
    candidateUnits,
    ancestorUnits,
  });
  const deduplicated = deduplicateBlocks(expanded);
  const allocation = allocateBudget(deduplicated, request.budget.maxTokens);
  const citations = assignCitations(allocation.included);
  const sourceFilter = request.query.filter.sources.map(
    (source) => source.value,
  );

  const markdown = renderContextMarkdown({
    query: request.query.text,
    budget: request.budget,
    allocation,
    citations,
    warnings: outcome.warnings,
    sourceFilter,
  });

  const result = renderContextResult({
    query: request.query.text,
    budget: request.budget,
    sourceFilter,
    candidatesConsidered: outcome.candidates.length,
    allocation,
    citations,
    warnings: outcome.warnings,
    topVectorSimilarity: outcome.metrics.topVectorSimilarity,
  });

  return { markdown, result };
}
