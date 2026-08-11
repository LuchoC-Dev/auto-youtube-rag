import type { EmbeddingRecord } from "../../domain/indexing/embedding-record.js";
import type { SyncId } from "../../domain/indexing/identifiers.js";
import type { KnowledgeUnit } from "../../domain/indexing/knowledge-unit.js";
import type { SearchFragment } from "../../domain/indexing/search-fragment.js";
import type { SourceDocument } from "../../domain/indexing/source-document.js";
import type { VideoPackage } from "../../domain/indexing/video-package.js";

export interface IndexedPackageChange {
  readonly kind: "replace_package";
  readonly syncId: SyncId;
  readonly packageHash: string;
  readonly indexedAt: string;
  readonly videoPackage: VideoPackage;
  readonly documents: readonly SourceDocument[];
  readonly units: readonly KnowledgeUnit[];
  readonly fragments: readonly SearchFragment[];
  readonly embeddings: readonly EmbeddingRecord[];
}
