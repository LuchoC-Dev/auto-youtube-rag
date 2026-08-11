import type { SourceName } from "../../domain/indexing/identifiers.js";
import type { SourceRoot } from "../../domain/indexing/source-root.js";

export interface SourceRegistry {
  add(source: SourceRoot): Promise<void>;
  getByName(name: SourceName): Promise<SourceRoot | null>;
  list(): Promise<readonly SourceRoot[]>;
  remove(name: SourceName): Promise<void>;
}
