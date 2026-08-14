import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import {
  measureModelFiles,
  writeInstallReceipt,
} from "../../src/infrastructure/config/model-install-state.js";
import { activeModelProfile } from "../../src/infrastructure/embeddings/model-profile.js";

const requiredModelFiles = activeModelProfile.requiredFiles;
const modelDirectory = join("Xenova", "multilingual-e5-small");

/**
 * Writes the four files `readModelState` requires under `modelsPath`, plus
 * a matching `.install.json` receipt, so CLI-level tests can pass the Z2
 * preflight (`sync`/`retrieve` require `library_and_model`) without a real
 * ~130 MB download. Content is a short fixture string, not a real ONNX
 * model: nothing here loads the model, only checks that it is present.
 */
export async function installFakeModel(modelsPath: string): Promise<void> {
  for (const relativePath of requiredModelFiles) {
    const target = join(modelsPath, modelDirectory, relativePath);
    await mkdir(join(target, ".."), { recursive: true });
    await writeFile(target, "fixture", "utf8");
  }

  const measured = await measureModelFiles(modelsPath);
  if (measured === null) {
    throw new Error("installFakeModel did not produce a complete model.");
  }

  await writeInstallReceipt(modelsPath, {
    schema_version: "1.0",
    model: {
      key: "e5-small",
      version: "Xenova/multilingual-e5-small@main:q8",
      dimensions: 384,
    },
    files: measured,
    installed_at: new Date().toISOString(),
    source: "download",
  });
}
