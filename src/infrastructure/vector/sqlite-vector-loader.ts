import type { DatabaseSync } from "node:sqlite";

import type { EmbeddingModelDescriptor } from "../../application/ports/embedding-generator.js";

export interface VectorEntry {
  /** Stable key of the owning unit, used to rebuild the fragment identity. */
  readonly unitKey: string;
  readonly ordinal: number;
  readonly sourceName: string;
  readonly videoId: string;
  readonly unitType: string;
  readonly language: string | null;
  readonly vector: Float32Array;
}

export interface VectorSource {
  load(model: EmbeddingModelDescriptor): readonly VectorEntry[];
}

export type VectorLoadErrorCode = "DIMENSION_MISMATCH" | "MALFORMED_VECTOR";

export class VectorLoadError extends Error {
  public readonly code: VectorLoadErrorCode;

  public constructor(code: VectorLoadErrorCode, message: string) {
    super(message);
    this.name = "VectorLoadError";
    this.code = code;
  }
}

/**
 * Decodes the little-endian float32 BLOB written during indexing. Reading it
 * byte by byte rather than viewing the buffer directly avoids depending on the
 * platform's endianness or on the BLOB being aligned.
 */
function decodeVector(blob: Uint8Array, expected: number): Float32Array {
  if (blob.byteLength !== expected * Float32Array.BYTES_PER_ELEMENT) {
    throw new VectorLoadError(
      "MALFORMED_VECTOR",
      `Expected a ${String(expected)}-dimensional vector but found ${String(
        blob.byteLength,
      )} bytes.`,
    );
  }

  const view = new DataView(blob.buffer, blob.byteOffset, blob.byteLength);
  const vector = new Float32Array(expected);

  for (let index = 0; index < expected; index += 1) {
    vector[index] = view.getFloat32(
      index * Float32Array.BYTES_PER_ELEMENT,
      true,
    );
  }

  return vector;
}

export class SQLiteVectorSource implements VectorSource {
  public constructor(private readonly database: DatabaseSync) {}

  public load(model: EmbeddingModelDescriptor): readonly VectorEntry[] {
    const rows = this.database
      .prepare(
        `SELECT u.stable_key AS unit_key,
                f.ordinal AS ordinal,
                s.name AS source_name,
                p.video_id AS video_id,
                u.unit_type AS unit_type,
                lower(coalesce(p.context_language, p.source_language)) AS language,
                e.dimensions AS dimensions,
                e.vector AS vector
         FROM embeddings e
         JOIN search_fragments f ON f.id = e.fragment_id
         JOIN knowledge_units u ON u.id = f.unit_id
         JOIN source_documents d ON d.id = u.document_id
         JOIN video_packages p ON p.id = d.package_id
         JOIN sources s ON s.id = p.source_id
         WHERE e.model_key = ? AND e.model_version = ?
         ORDER BY f.id ASC`,
      )
      .all(model.key, model.version);

    return rows.map((row) => {
      const dimensions = Number(row.dimensions);

      if (dimensions !== model.dimensions) {
        throw new VectorLoadError(
          "DIMENSION_MISMATCH",
          `Stored vectors have ${String(dimensions)} dimensions but the active model declares ${String(model.dimensions)}.`,
        );
      }

      if (!(row.vector instanceof Uint8Array)) {
        throw new VectorLoadError(
          "MALFORMED_VECTOR",
          "Stored vector is not a BLOB.",
        );
      }

      return {
        unitKey: String(row.unit_key),
        ordinal: Number(row.ordinal),
        sourceName: String(row.source_name),
        videoId: String(row.video_id),
        unitType: String(row.unit_type),
        language: row.language === null ? null : String(row.language),
        vector: decodeVector(row.vector, dimensions),
      };
    });
  }
}
