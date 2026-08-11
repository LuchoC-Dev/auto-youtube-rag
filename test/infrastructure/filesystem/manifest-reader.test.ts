import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

import { sha256 } from "../../../src/domain/indexing/content-identity.js";
import { SourceName } from "../../../src/domain/indexing/identifiers.js";
import { SourceRoot } from "../../../src/domain/indexing/source-root.js";
import {
  ManifestReadError,
  type ManifestReadErrorCode,
  parseManifest,
  readManifest,
} from "../../../src/infrastructure/filesystem/manifest-reader.js";

const fixturesDirectory = fileURLToPath(
  new URL("../../fixtures/indexing/", import.meta.url),
);
const sourceName = SourceName.create("auto-design");
const hash = "a".repeat(64);

function sourceFor(manifestPath: string): SourceRoot {
  const collectionPath = dirname(manifestPath);

  return SourceRoot.create({
    name: sourceName,
    collectionPath,
    manifestPath,
    videosPath: join(collectionPath, "videos"),
    enabled: true,
  });
}

function assertManifestError(
  code: ManifestReadErrorCode,
  manifestPath: string,
  field: string,
) {
  return (error: unknown): boolean => {
    assert.ok(error instanceof ManifestReadError);
    assert.equal(error.code, code);
    assert.equal(error.manifestPath, manifestPath);
    assert.equal(error.field, field);
    return true;
  };
}

void test("reads videos, keeps approved resources and ignores pages", async () => {
  const manifestPath = join(fixturesDirectory, "manifest-mixed.json");
  const rawManifest = await readFile(manifestPath, "utf8");
  const manifest = await readManifest(sourceFor(manifestPath));

  assert.equal(manifest.kind, "manifest");
  assert.equal(manifest.sourceName.equals(sourceName), true);
  assert.equal(manifest.contentHash, sha256(rawManifest));
  assert.equal(manifest.videos.length, 2);
  const [firstVideo, secondVideo] = manifest.videos;
  assert.ok(firstVideo);
  assert.ok(secondVideo);
  assert.equal(firstVideo.ref.serialize(), "auto-design:dQw4w9WgXcQ");
  assert.equal(firstVideo.contextLanguage, "es");
  assert.deepEqual(firstVideo.resources, {
    context: true,
    rules: true,
    metadata: true,
  });
  assert.deepEqual(secondVideo.resources, {
    context: true,
    rules: false,
    metadata: true,
  });
  assert.equal("pages" in manifest, false);
  assert.equal(Object.isFrozen(manifest.videos), true);
});

void test("rejects duplicate video ids and slugs with the exact field", async () => {
  const invalidPath = join(fixturesDirectory, "manifest-invalid.json");

  await assert.rejects(
    readManifest(sourceFor(invalidPath)),
    assertManifestError(
      "MANIFEST_DUPLICATE",
      invalidPath,
      "videos[1].video_id",
    ),
  );

  assert.throws(
    () =>
      parseManifest(
        {
          videos: [
            {
              video_id: "video_one",
              slug: "same-slug",
              resources: { context: true, rules: true, metadata: true },
            },
            {
              video_id: "video_two",
              slug: "same-slug",
              resources: { context: true, rules: true, metadata: true },
            },
          ],
        },
        { sourceName, manifestPath: "memory://manifest", contentHash: hash },
      ),
    assertManifestError(
      "MANIFEST_DUPLICATE",
      "memory://manifest",
      "videos[1].slug",
    ),
  );
});

void test("validates unknown structures and resource booleans", () => {
  assert.throws(
    () =>
      parseManifest(null, {
        sourceName,
        manifestPath: "memory://manifest",
        contentHash: hash,
      }),
    assertManifestError("MANIFEST_SCHEMA_INVALID", "memory://manifest", "$"),
  );

  assert.throws(
    () =>
      parseManifest(
        {
          videos: [
            {
              video_id: "video_one",
              slug: "valid-slug",
              resources: { context: "yes", rules: true, metadata: true },
            },
          ],
        },
        { sourceName, manifestPath: "memory://manifest", contentHash: hash },
      ),
    assertManifestError(
      "MANIFEST_SCHEMA_INVALID",
      "memory://manifest",
      "videos[0].resources.context",
    ),
  );
});

void test("reports malformed JSON and unreadable files with path and root field", async () => {
  const directory = await mkdtemp(join(tmpdir(), "auto-youtube-rag-manifest-"));
  const malformedPath = join(directory, "manifest.json");
  const missingPath = join(directory, "missing.json");

  try {
    await writeFile(malformedPath, '{"videos":', "utf8");

    await assert.rejects(
      readManifest(sourceFor(malformedPath)),
      assertManifestError("MANIFEST_JSON_INVALID", malformedPath, "$"),
    );
    await assert.rejects(
      readManifest(sourceFor(missingPath)),
      assertManifestError("MANIFEST_READ_FAILED", missingPath, "$"),
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
