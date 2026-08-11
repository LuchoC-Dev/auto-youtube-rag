import assert from "node:assert/strict";

import type { SourceRegistry } from "../../src/application/ports/source-registry.js";
import { SourceName } from "../../src/domain/indexing/identifiers.js";
import { SourceRoot } from "../../src/domain/indexing/source-root.js";

function source(name: string, enabled = true): SourceRoot {
  return SourceRoot.create({
    name: SourceName.create(name),
    collectionPath: `C:\\knowledge\\${name}`,
    manifestPath: `C:\\knowledge\\${name}\\manifest.json`,
    videosPath: `C:\\knowledge\\${name}\\videos`,
    enabled,
  });
}

export async function verifySourceRegistryContract(
  registry: SourceRegistry,
): Promise<void> {
  const bravo = source("bravo", false);
  const alpha = source("alpha");

  await registry.add(bravo);
  await registry.add(alpha);

  const listed = await registry.list();
  assert.deepEqual(
    listed.map((entry) => entry.name.value),
    ["alpha", "bravo"],
  );
  assert.deepEqual(await registry.getByName(alpha.name), alpha);
  assert.deepEqual(await registry.getByName(bravo.name), bravo);
  assert.equal(await registry.getByName(SourceName.create("missing")), null);

  await registry.remove(alpha.name);
  await registry.remove(alpha.name);
  assert.equal(await registry.getByName(alpha.name), null);
  assert.deepEqual(
    (await registry.list()).map((entry) => entry.name.value),
    ["bravo"],
  );
}
