import type { DatabaseSync } from "node:sqlite";

import type {
  TextSearchIndex,
  TextSearchRequest,
} from "../../application/ports/text-search-index.js";
import type { RankedHit } from "../../application/retrieval/retrieval-results.js";
import { createFragmentKey } from "../../domain/indexing/content-identity.js";
import {
  KnowledgeUnitId,
  SearchFragmentId,
} from "../../domain/indexing/identifiers.js";
import type { RetrievalFilter } from "../../domain/retrieval/retrieval-filter.js";
import { sanitizeFtsQuery } from "./fts-query-sanitizer.js";

export type SQLiteTextSearchErrorCode = "INVALID_LIMIT" | "TEXT_SEARCH_FAILED";

export class SQLiteTextSearchError extends Error {
  public readonly code: SQLiteTextSearchErrorCode;

  public constructor(
    code: SQLiteTextSearchErrorCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "SQLiteTextSearchError";
    this.code = code;
  }
}

/**
 * A hit whose heading names the concept is usually better context than one
 * that mentions it in passing, so the title and heading path outweigh the body.
 */
const columnWeights = { title: 3.0, headingPath: 2.0, content: 1.0 } as const;

function placeholders(count: number): string {
  return Array.from({ length: count }, () => "?").join(", ");
}

interface FilterClause {
  readonly sql: readonly string[];
  readonly parameters: readonly string[];
}

/**
 * Filters are applied after the MATCH so the FTS index still drives the scan.
 */
function buildFilter(filter: RetrievalFilter): FilterClause {
  const sql: string[] = [];
  const parameters: string[] = [];

  if (filter.sources.length > 0) {
    sql.push(`s.name IN (${placeholders(filter.sources.length)})`);
    parameters.push(...filter.sources.map((source) => source.value));
  }

  if (filter.videoIds.length > 0) {
    sql.push(`p.video_id IN (${placeholders(filter.videoIds.length)})`);
    parameters.push(...filter.videoIds.map((videoId) => videoId.value));
  }

  if (filter.languages.length > 0) {
    // The context document is what got indexed, so its language decides; the
    // source language is only a fallback when the package omits it.
    sql.push(
      `lower(coalesce(p.context_language, p.source_language)) IN (${placeholders(
        filter.languages.length,
      )})`,
    );
    parameters.push(...filter.languages);
  }

  if (filter.unitTypes.length > 0) {
    sql.push(`u.unit_type IN (${placeholders(filter.unitTypes.length)})`);
    parameters.push(...filter.unitTypes);
  }

  return { sql, parameters };
}

export class SQLiteTextSearchIndex implements TextSearchIndex {
  public constructor(private readonly database: DatabaseSync) {}

  public search(request: TextSearchRequest): Promise<readonly RankedHit[]> {
    if (!Number.isSafeInteger(request.limit) || request.limit < 1) {
      return Promise.reject(
        new SQLiteTextSearchError(
          "INVALID_LIMIT",
          "Text search limit must be a positive safe integer.",
        ),
      );
    }

    const expression = sanitizeFtsQuery(request.text);

    // Nothing searchable survived sanitisation, so no SQL is worth running.
    if (expression === null) {
      return Promise.resolve([]);
    }

    const filter = buildFilter(request.filter);
    const conditions =
      filter.sql.length > 0 ? ` AND ${filter.sql.join(" AND ")}` : "";

    try {
      const rows = this.database
        .prepare(
          `SELECT u.stable_key AS unit_key,
                  f.ordinal AS ordinal,
                  bm25(fragment_fts, ${String(columnWeights.title)}, ${String(
                    columnWeights.headingPath,
                  )}, ${String(columnWeights.content)}) AS score
           FROM fragment_fts
           JOIN search_fragments f ON f.id = fragment_fts.rowid
           JOIN knowledge_units u ON u.id = f.unit_id
           JOIN source_documents d ON d.id = u.document_id
           JOIN video_packages p ON p.id = d.package_id
           JOIN sources s ON s.id = p.source_id
           WHERE fragment_fts MATCH ?${conditions}
           ORDER BY score ASC, f.id ASC
           LIMIT ?`,
        )
        .all(expression, ...filter.parameters, request.limit);

      return Promise.resolve(
        rows.map((row, index) => ({
          // The fragment identifier is derived, not stored: it is a pure
          // function of the unit's stable key and the fragment ordinal.
          fragmentId: SearchFragmentId.create(
            createFragmentKey(
              KnowledgeUnitId.create(String(row.unit_key)),
              Number(row.ordinal),
            ),
          ),
          rank: index + 1,
          rawScore: Number(row.score),
        })),
      );
    } catch (error: unknown) {
      return Promise.reject(
        new SQLiteTextSearchError(
          "TEXT_SEARCH_FAILED",
          "SQLite text search failed.",
          { cause: error },
        ),
      );
    }
  }
}
