import type { SourceRegistry } from "../ports/source-registry.js";
import { SourceName } from "../../domain/indexing/identifiers.js";
import { SourceRoot } from "../../domain/indexing/source-root.js";

export interface ResolvedSourceLayout {
  readonly collectionPath: string;
  readonly manifestPath: string;
  readonly videosPath: string;
}

export type SourceLayoutResolver = (
  path: unknown,
) => Promise<ResolvedSourceLayout>;

export interface AddSourceInput {
  readonly name: unknown;
  readonly path: unknown;
}

export interface AddSourceDependencies {
  readonly registry: SourceRegistry;
  readonly resolveLayout: SourceLayoutResolver;
}

export async function addSource(
  dependencies: AddSourceDependencies,
  input: AddSourceInput,
): Promise<SourceRoot> {
  const [name, layout] = await Promise.all([
    Promise.resolve(SourceName.create(input.name)),
    dependencies.resolveLayout(input.path),
  ]);
  const source = SourceRoot.create({ ...layout, name, enabled: true });
  await dependencies.registry.add(source);
  return source;
}
