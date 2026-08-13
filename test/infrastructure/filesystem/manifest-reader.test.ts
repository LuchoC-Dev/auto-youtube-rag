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
  assert.deepEqual(manifest.issues, []);
  const [firstVideo, secondVideo] = manifest.videos;
  assert.ok(firstVideo);
  assert.ok(secondVideo);
  assert.equal(firstVideo.ref.serialize(), "auto-design:dQw4w9WgXcQ");
  assert.equal(firstVideo.contextLanguage, "es");
  assert.deepEqual(firstVideo.resources, {
    context: true,
    structuredContent: "rules",
    metadata: true,
  });
  assert.deepEqual(secondVideo.resources, {
    context: true,
    structuredContent: "none",
    metadata: true,
  });
  assert.equal("pages" in manifest, false);
  assert.equal(Object.isFrozen(manifest.videos), true);
  assert.equal(Object.isFrozen(manifest.issues), true);
});

void test("skips duplicate video ids and slugs, keeping the first entry as an issue", async () => {
  const invalidPath = join(fixturesDirectory, "manifest-invalid.json");
  const manifest = await readManifest(sourceFor(invalidPath));

  assert.equal(manifest.videos.length, 1);
  assert.equal(manifest.videos[0]?.slug, "first-video");
  assert.equal(manifest.issues.length, 1);
  const [duplicateIdIssue] = manifest.issues;
  assert.ok(duplicateIdIssue);
  assert.equal(duplicateIdIssue.code, "DUPLICATE");
  assert.equal(duplicateIdIssue.field, "videos[1].video_id");
  assert.equal(duplicateIdIssue.videoId?.value, "duplicate_id");

  const manifest2 = parseManifest(
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
  );

  assert.equal(manifest2.videos.length, 1);
  assert.equal(manifest2.videos[0]?.ref.videoId.value, "video_one");
  assert.equal(manifest2.issues.length, 1);
  const [duplicateSlugIssue] = manifest2.issues;
  assert.ok(duplicateSlugIssue);
  assert.equal(duplicateSlugIssue.code, "DUPLICATE");
  assert.equal(duplicateSlugIssue.field, "videos[1].slug");
  assert.equal(duplicateSlugIssue.videoId?.value, "video_two");
});

void test("rejects a manifest whose root is not an object or whose videos field is not an array", () => {
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
        { videos: "not-an-array" },
        { sourceName, manifestPath: "memory://manifest", contentHash: hash },
      ),
    assertManifestError(
      "MANIFEST_SCHEMA_INVALID",
      "memory://manifest",
      "videos",
    ),
  );
});

void test("skips a video with an invalid resource boolean and reports it as an issue", () => {
  const manifest = parseManifest(
    {
      videos: [
        {
          video_id: "video_one",
          slug: "valid-slug",
          resources: { context: "yes", rules: true, metadata: true },
        },
        {
          video_id: "video_two",
          slug: "other-slug",
          resources: { context: true, rules: true, metadata: true },
        },
      ],
    },
    { sourceName, manifestPath: "memory://manifest", contentHash: hash },
  );

  assert.equal(manifest.videos.length, 1);
  assert.equal(manifest.videos[0]?.ref.videoId.value, "video_two");
  assert.equal(manifest.issues.length, 1);
  const [invalidResourceIssue] = manifest.issues;
  assert.ok(invalidResourceIssue);
  assert.equal(invalidResourceIssue.code, "SCHEMA_INVALID");
  assert.equal(invalidResourceIssue.field, "videos[0].resources.context");
  assert.equal(invalidResourceIssue.videoId?.value, "video_one");
});

void test("collapses rules/analysis booleans into structuredContent for both schemas", () => {
  const manifest = parseManifest(
    {
      videos: [
        {
          video_id: "video_rules",
          slug: "video-rules",
          resources: { context: true, rules: true, metadata: true },
        },
        {
          video_id: "video_analysis",
          slug: "video-analysis",
          resources: { context: true, analysis: true, metadata: true },
        },
        {
          video_id: "video_none",
          slug: "video-none",
          resources: { context: true, metadata: true },
        },
      ],
    },
    { sourceName, manifestPath: "memory://manifest", contentHash: hash },
  );

  assert.equal(manifest.issues.length, 0);
  assert.equal(manifest.videos.length, 3);
  const [rulesVideo, analysisVideo, noneVideo] = manifest.videos;
  assert.equal(rulesVideo?.resources.structuredContent, "rules");
  assert.equal(analysisVideo?.resources.structuredContent, "analysis");
  assert.equal(noneVideo?.resources.structuredContent, "none");
});

void test("skips a video declaring both rules and analysis as an issue", () => {
  const manifest = parseManifest(
    {
      videos: [
        {
          video_id: "video_both",
          slug: "video-both",
          resources: {
            context: true,
            rules: true,
            analysis: true,
            metadata: true,
          },
        },
        {
          video_id: "video_ok",
          slug: "video-ok",
          resources: { context: true, rules: true, metadata: true },
        },
      ],
    },
    { sourceName, manifestPath: "memory://manifest", contentHash: hash },
  );

  assert.equal(manifest.videos.length, 1);
  assert.equal(manifest.videos[0]?.ref.videoId.value, "video_ok");
  assert.equal(manifest.issues.length, 1);
  const [bothIssue] = manifest.issues;
  assert.ok(bothIssue);
  assert.equal(bothIssue.code, "SCHEMA_INVALID");
  assert.equal(bothIssue.field, "videos[0].resources");
  assert.equal(bothIssue.videoId?.value, "video_both");
});

void test("skips a video whose own video_id is invalid, with a null issue videoId", () => {
  const manifest = parseManifest(
    {
      videos: [
        {
          video_id: "",
          slug: "valid-slug",
          resources: { context: true, rules: true, metadata: true },
        },
      ],
    },
    { sourceName, manifestPath: "memory://manifest", contentHash: hash },
  );

  assert.equal(manifest.videos.length, 0);
  assert.equal(manifest.issues.length, 1);
  assert.equal(manifest.issues[0]?.videoId, null);
});

void test("accepts canonical Unicode slugs without allowing path separators", () => {
  const manifest = parseManifest(
    {
      videos: [
        {
          video_id: "video_es",
          slug: "7-estilos-de-diseño-gráfico-que-no-conocías",
          resources: { context: true, rules: true, metadata: true },
        },
      ],
    },
    { sourceName, manifestPath: "memory://manifest", contentHash: hash },
  );

  assert.equal(
    manifest.videos[0]?.slug,
    "7-estilos-de-diseño-gráfico-que-no-conocías",
  );
  assert.equal(manifest.issues.length, 0);

  const rejected = parseManifest(
    {
      videos: [
        {
          video_id: "video_es",
          slug: "diseño/../fuera",
          resources: { context: true, rules: true, metadata: true },
        },
      ],
    },
    { sourceName, manifestPath: "memory://manifest", contentHash: hash },
  );

  assert.equal(rejected.videos.length, 0);
  assert.equal(rejected.issues.length, 1);
  const [slugIssue] = rejected.issues;
  assert.ok(slugIssue);
  assert.equal(slugIssue.field, "videos[0].slug");
  assert.equal(slugIssue.videoId?.value, "video_es");
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
