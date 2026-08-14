import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { test } from "node:test";

import { describeModelState } from "../../src/infrastructure/config/model-install-state.js";
import { E5ModelInstaller } from "../../src/infrastructure/embeddings/e5-model-installer.js";
import { activeModelProfile } from "../../src/infrastructure/embeddings/model-profile.js";

const requiredModelFiles = activeModelProfile.requiredFiles;

const projectRoot = resolve(import.meta.dirname, "../..");
const repositoryCache = join(projectRoot, ".cache", "models");
const modelDirectory = join("Xenova", "multilingual-e5-small");

/**
 * Exercises the real `--from` adoption against the ~130 MB model already in
 * the repository cache. Excluded from `npm run check` by the `smoke` pattern,
 * like the E5 generator smoke: it copies real weights and would make the
 * normal suite slow.
 *
 * It never reaches the network. Adoption is the whole point — a run that
 * downloaded would prove nothing about `--from` and would break the offline
 * guarantee the rest of the suite relies on.
 */
void test(
  "smoke: adopts the repository model through --from without touching the network",
  { timeout: 180_000 },
  async () => {
    if (!existsSync(join(repositoryCache, modelDirectory))) {
      // The repository cache is developer territory and may legitimately be
      // absent on a clean clone. Skipping beats failing on someone else's
      // machine.
      return;
    }

    const home = await mkdtemp(join(tmpdir(), "auto-youtube-rag-install-"));
    const modelsPath = join(home, "models");
    try {
      assert.equal(
        await describeModelState(modelsPath).then((s) => s.state),
        "absent",
      );

      const installer = new E5ModelInstaller();
      const result = await installer.install({
        modelsPath,
        from: repositoryCache,
        force: false,
      });

      assert.equal(result.status, "adopted");
      assert.equal(result.source, "copy");
      assert.ok(result.bytes > 100_000_000);

      const state = await describeModelState(modelsPath);
      assert.equal(state.state, "installed");
      assert.deepEqual(state.issues, []);

      // The receipt must describe what actually landed on disk, or the
      // incomplete-detection it exists for is worthless.
      const receipt: unknown = JSON.parse(
        await readFile(join(modelsPath, ".install.json"), "utf8"),
      );
      assert.equal(typeof receipt, "object");
      assert.notEqual(receipt, null);
      const files = (receipt as { files: { path: string; bytes: number }[] })
        .files;
      assert.equal(files.length, requiredModelFiles.length);
      for (const file of files) {
        const actual = await stat(join(modelsPath, modelDirectory, file.path));
        assert.equal(actual.size, file.bytes);
      }

      // Copy, never move: emptying the source would break the benchmarks and
      // the E5 generator smoke, which read this cache directly.
      for (const relativePath of requiredModelFiles) {
        assert.equal(
          existsSync(join(repositoryCache, modelDirectory, relativePath)),
          true,
        );
      }

      // Re-installing without --force must be a no-op, not a second copy.
      const again = await installer.install({
        modelsPath,
        from: repositoryCache,
        force: false,
      });
      assert.equal(again.status, "already_installed");
    } finally {
      await rm(home, { recursive: true, force: true });
    }
  },
);
