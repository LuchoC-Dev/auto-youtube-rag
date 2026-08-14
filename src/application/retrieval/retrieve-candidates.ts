import type { EmbeddingGenerator } from "../ports/embedding-generator.js";
import type { KnowledgeRepository } from "../ports/knowledge-repository.js";
import type { TextSearchIndex } from "../ports/text-search-index.js";
import type { VectorSearchIndex } from "../ports/vector-search-index.js";
import type { RetrievalQuery } from "../../domain/retrieval/retrieval-query.js";
import type { FusionStrategy } from "./fusion-strategy.js";
import { selectCandidates } from "./select-candidates.js";
import type {
  CandidateProvenance,
  RetrievalCandidate,
  RetrievalOutcome,
  RetrievalWarning,
} from "./retrieval-results.js";

export interface RetrieveCandidatesDependencies {
  readonly textIndex: TextSearchIndex;
  readonly vectorIndex: VectorSearchIndex;
  readonly knowledgeRepository: KnowledgeRepository;
  readonly embeddingGenerator: EmbeddingGenerator;
  readonly fusionStrategy: FusionStrategy;
}

/**
 * Runs one retrieval path and turns a failure into a warning instead of
 * aborting the whole query: a degraded result from the other path is
 * preferable to none at all.
 */
async function attempt<TValue>(
  run: () => Promise<TValue>,
  onEmpty: TValue,
  warning: RetrievalWarning,
): Promise<{
  readonly value: TValue;
  readonly warning: RetrievalWarning | null;
}> {
  try {
    return { value: await run(), warning: null };
  } catch {
    return { value: onEmpty, warning };
  }
}

export async function retrieveCandidates(
  dependencies: RetrieveCandidatesDependencies,
  query: RetrievalQuery,
): Promise<RetrievalOutcome> {
  const warnings: RetrievalWarning[] = [];

  const textAttempt = await attempt(
    () =>
      dependencies.textIndex.search({
        text: query.text,
        filter: query.filter,
        limit: query.limits.textCandidates,
      }),
    [],
    {
      code: "TEXT_SEARCH_UNAVAILABLE",
      path: "text",
      message: "The lexical search path failed; results may be incomplete.",
    },
  );

  const vectorAttempt = await attempt(
    async () => {
      const model = await dependencies.embeddingGenerator.describe();
      const [vector, loadedVectorCount] = await Promise.all([
        dependencies.embeddingGenerator.embedQuery(query.text),
        dependencies.vectorIndex.load(model),
      ]);

      const hits = await dependencies.vectorIndex.search(vector, {
        filter: query.filter,
        limit: query.limits.vectorCandidates,
      });

      return { hits, loadedVectorCount };
    },
    { hits: [], loadedVectorCount: 0 },
    {
      code: "VECTOR_SEARCH_UNAVAILABLE",
      path: "vector",
      message: "The semantic search path failed; results may be incomplete.",
    },
  );

  if (textAttempt.warning) warnings.push(textAttempt.warning);
  if (vectorAttempt.warning) warnings.push(vectorAttempt.warning);

  // A vector path that loaded zero vectors for the active model is
  // indistinguishable from one that simply found no matches — unless the
  // text path did find something. Text hits with an empty vector index is
  // the one unambiguous signal that the vectors are missing or stale for the
  // active model, not that the library (or a --source filter) is genuinely
  // empty. `vectorAttempt.warning === null` excludes the case where the
  // vector path threw: that already has its own warning and an unknown
  // cause, so it must not also be reported as staleness.
  if (
    vectorAttempt.warning === null &&
    vectorAttempt.value.loadedVectorCount === 0 &&
    textAttempt.value.length > 0
  ) {
    warnings.push({
      code: "VECTORS_STALE",
      path: "vector",
      message:
        "Semantic search did not run: the vector index has no vectors for the active embedding model, so these results come from lexical search only. Run `auto-youtube-rag sync` to regenerate embeddings.",
    });
  }

  const fused = dependencies.fusionStrategy.fuse({
    textHits: textAttempt.value,
    vectorHits: vectorAttempt.value.hits,
  });

  // Provenance is hydrated for the whole fused set, ahead of selection,
  // because deduplication and diversity both key on the unit and package the
  // fragment belongs to, and neither survives in a bare FusedHit.
  const provenance =
    await dependencies.knowledgeRepository.getFragmentProvenance(
      fused.map((hit) => hit.fragmentId),
    );
  const provenanceByFragment = new Map<string, CandidateProvenance>(
    provenance.map((entry) => [entry.fragmentId.value, entry]),
  );

  const hydrated: RetrievalCandidate[] = [];

  for (const hit of fused) {
    const entry = provenanceByFragment.get(hit.fragmentId.value);

    // A fused hit without provenance means SQLite no longer holds that
    // fragment — most likely a deletion racing the query — so it is dropped
    // rather than surfaced without procedence.
    if (entry === undefined) {
      continue;
    }

    hydrated.push({
      fragmentId: hit.fragmentId,
      unitId: entry.unitId,
      packageRef: entry.packageRef,
      fusedScore: hit.fusedScore,
      textRank: hit.textRank,
      vectorRank: hit.vectorRank,
      provenance: entry,
    });
  }

  const candidates = selectCandidates({
    candidates: hydrated,
    limits: query.limits,
  });

  // Zero hits from both paths with no path-level failure is a legitimate
  // no_results outcome, not a warning: RetrievalQuery already guarantees the
  // text holds a searchable letter or number by the time it reaches here.
  return {
    status: candidates.length === 0 ? "no_results" : "ok",
    candidates,
    metrics: {
      textHits: textAttempt.value.length,
      vectorHits: vectorAttempt.value.hits.length,
      fusedHits: fused.length,
      returnedCandidates: candidates.length,
      videosCovered: new Set(
        candidates.map((candidate) => candidate.packageRef.serialize()),
      ).size,
      sourcesCovered: new Set(
        candidates.map((candidate) => candidate.packageRef.sourceName.value),
      ).size,
    },
    warnings,
  };
}
