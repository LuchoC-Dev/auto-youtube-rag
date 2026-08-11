import type { SourceRegistry } from "../ports/source-registry.js";
import { SourceName } from "../../domain/indexing/identifiers.js";

export async function removeSource(
  registry: SourceRegistry,
  name: unknown,
): Promise<void> {
  await registry.remove(SourceName.create(name));
}
