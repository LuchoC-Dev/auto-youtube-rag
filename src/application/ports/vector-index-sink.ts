import type { EmbeddingRecord } from "../../domain/indexing/embedding-record.js";
import type { PackageRef } from "../../domain/indexing/identifiers.js";
import type { EmbeddingModelDescriptor } from "./embedding-generator.js";

export interface ReplacePackageVectors {
  readonly kind: "replace_package";
  readonly packageRef: PackageRef;
  readonly model: EmbeddingModelDescriptor;
  readonly embeddings: readonly EmbeddingRecord[];
}

export interface RemovePackageVectors {
  readonly kind: "remove_packages";
  readonly packageRefs: readonly PackageRef[];
}

export type VectorIndexChange = ReplacePackageVectors | RemovePackageVectors;

export interface VectorIndexSink {
  apply(change: VectorIndexChange): Promise<void>;
}
