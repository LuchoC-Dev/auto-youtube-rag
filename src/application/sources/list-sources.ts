import type { SourceRegistry } from "../ports/source-registry.js";
import type { SourceRoot } from "../../domain/indexing/source-root.js";

export function listSources(
  registry: SourceRegistry,
): Promise<readonly SourceRoot[]> {
  return registry.list();
}
