import type { DatabaseSync } from "node:sqlite";

import type { KnowledgeRepository } from "../../application/ports/knowledge-repository.js";
import type { CandidateProvenance } from "../../application/retrieval/retrieval-results.js";
import { createFragmentKey } from "../../domain/indexing/content-identity.js";
import {
  DocumentId,
  KnowledgeUnitId,
  PackageRef,
  SearchFragmentId,
  SourceName,
  VideoId,
} from "../../domain/indexing/identifiers.js";
import {
  KnowledgeUnit,
  type KnowledgeUnitType,
  knowledgeUnitTypes,
} from "../../domain/indexing/knowledge-unit.js";
import {
  type SourceDocumentKind,
  sourceDocumentKinds,
} from "../../domain/indexing/source-document.js";

export type SQLiteKnowledgeErrorCode = "MALFORMED_ROW";

export class SQLiteKnowledgeError extends Error {
  public readonly code: SQLiteKnowledgeErrorCode;

  public constructor(
    code: SQLiteKnowledgeErrorCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "SQLiteKnowledgeError";
    this.code = code;
  }
}

const provenanceColumns = `
  u.stable_key AS unit_key,
  f.ordinal AS ordinal,
  f.title AS fragment_title,
  f.content AS content,
  f.token_count AS token_count,
  u.unit_type AS unit_type,
  u.heading_path_json AS heading_path_json,
  u.timestamps_json AS timestamps_json,
  u.visual_evidence_json AS visual_evidence_json,
  d.kind AS document_kind,
  d.relative_path AS document_relative_path,
  s.name AS source_name,
  p.video_id AS video_id,
  p.title AS video_title,
  p.creator AS creator,
  p.canonical_url AS canonical_url,
  lower(coalesce(p.context_language, p.source_language)) AS language`;

const unitColumns = `
  u.stable_key AS unit_key,
  parent.stable_key AS parent_key,
  u.unit_type AS unit_type,
  u.depth AS depth,
  u.ordinal AS ordinal,
  u.title AS title,
  u.content AS content,
  u.structured_json AS structured_json,
  u.heading_path_json AS heading_path_json,
  u.timestamps_json AS timestamps_json,
  u.visual_evidence_json AS visual_evidence_json,
  u.estimated_tokens AS estimated_tokens,
  u.content_hash AS content_hash,
  u.searchable AS searchable,
  d.kind AS document_kind,
  s.name AS source_name,
  p.video_id AS video_id`;

const unitJoins = `
  FROM knowledge_units u
  LEFT JOIN knowledge_units parent ON parent.id = u.parent_id
  JOIN source_documents d ON d.id = u.document_id
  JOIN video_packages p ON p.id = d.package_id
  JOIN sources s ON s.id = p.source_id`;

function placeholders(count: number): string {
  return Array.from({ length: count }, () => "?").join(", ");
}

/**
 * Nullable text columns arrive as strings or SQL NULL; anything else means the
 * row does not hold what the schema promised.
 */
function optionalText(value: unknown): string | null {
  if (typeof value === "string") {
    return value;
  }

  if (value === null || value === undefined) {
    return null;
  }

  throw new SQLiteKnowledgeError(
    "MALFORMED_ROW",
    "Expected a text column or NULL.",
  );
}

/**
 * Persisted enumerations are re-validated on the way out: a row written by an
 * older or hand-edited database must not become an unknown type downstream.
 */
function unitTypeOf(value: unknown): KnowledgeUnitType {
  const candidate = String(value);
  const match = knowledgeUnitTypes.find((unitType) => unitType === candidate);

  if (match === undefined) {
    throw new SQLiteKnowledgeError(
      "MALFORMED_ROW",
      `Stored unit type "${candidate}" is not an approved knowledge unit type.`,
    );
  }

  return match;
}

function documentKindOf(value: unknown): SourceDocumentKind {
  const candidate = String(value);
  const match = sourceDocumentKinds.find((kind) => kind === candidate);

  if (match === undefined) {
    throw new SQLiteKnowledgeError(
      "MALFORMED_ROW",
      `Stored document kind "${candidate}" is not approved.`,
    );
  }

  return match;
}

function textList(value: unknown, field: string): readonly string[] {
  try {
    const parsed: unknown = JSON.parse(String(value));

    if (!Array.isArray(parsed)) {
      throw new Error("not an array");
    }

    return parsed.map((item) => String(item));
  } catch (error: unknown) {
    throw new SQLiteKnowledgeError(
      "MALFORMED_ROW",
      `Stored ${field} is not a JSON array.`,
      { cause: error },
    );
  }
}

/**
 * Rebuilds the document identity from persisted columns. Like the fragment
 * identifier, it is a pure function of the source, video and document kind, so
 * nothing extra needs to be stored to speak the domain identity.
 */
function documentIdOf(
  sourceName: string,
  videoId: string,
  kind: string,
): DocumentId {
  return DocumentId.create(`document:${sourceName}:${videoId}:${kind}`);
}

/**
 * Extracts the fragment ordinal, which the identifier carries in clear text as
 * its final segment. The unit hash cannot be reversed, but narrowing the scan
 * by ordinal keeps the batch lookup cheap.
 */
function ordinalOf(id: SearchFragmentId): number | null {
  const parsed = Number(id.value.split(":").at(-1));

  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : null;
}

export class SQLiteKnowledgeRepository implements KnowledgeRepository {
  public constructor(private readonly database: DatabaseSync) {}

  /**
   * Resolves a whole batch in one query. Fragment identifiers are derived from
   * a hash of the unit key, so rows are matched in memory rather than by an
   * indexed lookup; the scan is bounded by the requested ordinals and stays in
   * the millisecond range at this library's scale.
   */
  public getFragmentProvenance(
    ids: readonly SearchFragmentId[],
  ): Promise<readonly CandidateProvenance[]> {
    if (ids.length === 0) {
      return Promise.resolve([]);
    }

    const wanted = new Map(ids.map((id) => [id.value, id]));
    const ordinals = [
      ...new Set(
        ids
          .map((id) => ordinalOf(id))
          .filter((ordinal): ordinal is number => ordinal !== null),
      ),
    ];

    if (ordinals.length === 0) {
      return Promise.resolve([]);
    }

    try {
      const rows = this.database
        .prepare(
          `SELECT ${provenanceColumns}
           FROM search_fragments f
           JOIN knowledge_units u ON u.id = f.unit_id
           JOIN source_documents d ON d.id = u.document_id
           JOIN video_packages p ON p.id = d.package_id
           JOIN sources s ON s.id = p.source_id
           WHERE f.ordinal IN (${placeholders(ordinals.length)})`,
        )
        .all(...ordinals);
      const found: CandidateProvenance[] = [];

      for (const row of rows) {
        const unitId = KnowledgeUnitId.create(String(row.unit_key));
        const ordinal = Number(row.ordinal);
        const fragmentId = wanted.get(createFragmentKey(unitId, ordinal));

        if (fragmentId === undefined) {
          continue;
        }

        const sourceName = String(row.source_name);
        const videoId = String(row.video_id);

        found.push({
          fragmentId,
          unitId,
          packageRef: PackageRef.create(
            SourceName.create(sourceName),
            VideoId.create(videoId),
          ),
          unitType: unitTypeOf(row.unit_type),
          documentKind: documentKindOf(row.document_kind),
          documentRelativePath: String(row.document_relative_path),
          headingPath: textList(row.heading_path_json, "headingPath"),
          title: optionalText(row.fragment_title),
          content: String(row.content),
          tokenCount: Number(row.token_count),
          videoTitle: optionalText(row.video_title),
          creator: optionalText(row.creator),
          canonicalUrl: optionalText(row.canonical_url),
          language: optionalText(row.language),
          timestamps: textList(row.timestamps_json, "timestamps"),
          visualEvidence: textList(row.visual_evidence_json, "visualEvidence"),
        });
      }

      return Promise.resolve(found);
    } catch (error: unknown) {
      return Promise.reject(
        error instanceof Error
          ? error
          : new Error("Reading fragment provenance failed.", { cause: error }),
      );
    }
  }

  public getUnits(
    ids: readonly KnowledgeUnitId[],
  ): Promise<readonly KnowledgeUnit[]> {
    if (ids.length === 0) {
      return Promise.resolve([]);
    }

    try {
      const rows = this.database
        .prepare(
          `SELECT ${unitColumns} ${unitJoins}
           WHERE u.stable_key IN (${placeholders(ids.length)})
           ORDER BY u.id ASC`,
        )
        .all(...ids.map((id) => id.value));

      return Promise.resolve(rows.map((row) => this.toKnowledgeUnit(row)));
    } catch (error: unknown) {
      return Promise.reject(
        error instanceof Error
          ? error
          : new Error("Reading knowledge units failed.", { cause: error }),
      );
    }
  }

  /**
   * Walks every ancestor chain up to the document root in one recursive query
   * and excludes the starting units, so the caller receives only what widens
   * its hits.
   */
  public getAncestors(
    ids: readonly KnowledgeUnitId[],
  ): Promise<readonly KnowledgeUnit[]> {
    if (ids.length === 0) {
      return Promise.resolve([]);
    }

    const keys = ids.map((id) => id.value);

    try {
      const rows = this.database
        .prepare(
          `WITH RECURSIVE chain(id) AS (
             SELECT parent_id FROM knowledge_units
             WHERE stable_key IN (${placeholders(keys.length)})
               AND parent_id IS NOT NULL
             UNION
             SELECT u.parent_id FROM knowledge_units u
             JOIN chain c ON u.id = c.id
             WHERE u.parent_id IS NOT NULL
           )
           SELECT ${unitColumns} ${unitJoins}
           WHERE u.id IN (SELECT id FROM chain)
             AND u.stable_key NOT IN (${placeholders(keys.length)})
           ORDER BY u.depth ASC, u.id ASC`,
        )
        .all(...keys, ...keys);

      return Promise.resolve(rows.map((row) => this.toKnowledgeUnit(row)));
    } catch (error: unknown) {
      return Promise.reject(
        error instanceof Error
          ? error
          : new Error("Reading ancestor units failed.", { cause: error }),
      );
    }
  }

  private toKnowledgeUnit(row: Record<string, unknown>): KnowledgeUnit {
    const parentKey = optionalText(row.parent_key);

    return KnowledgeUnit.create({
      id: KnowledgeUnitId.create(String(row.unit_key)),
      documentId: documentIdOf(
        String(row.source_name),
        String(row.video_id),
        String(row.document_kind),
      ),
      parentId: parentKey === null ? null : KnowledgeUnitId.create(parentKey),
      unitType: String(row.unit_type),
      depth: Number(row.depth),
      ordinal: Number(row.ordinal),
      title: optionalText(row.title),
      content: String(row.content),
      structuredJson: optionalText(row.structured_json),
      headingPath: textList(row.heading_path_json, "headingPath"),
      timestamps: textList(row.timestamps_json, "timestamps"),
      visualEvidence: textList(row.visual_evidence_json, "visualEvidence"),
      estimatedTokens: Number(row.estimated_tokens),
      contentHash: String(row.content_hash),
      searchable: Number(row.searchable) === 1,
    });
  }
}
