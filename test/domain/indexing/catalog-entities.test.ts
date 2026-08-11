import assert from "node:assert/strict";
import { test } from "node:test";

import { DomainValidationError } from "../../../src/domain/indexing/domain-error.js";
import {
  DocumentId,
  PackageRef,
  SourceName,
  VideoId,
} from "../../../src/domain/indexing/identifiers.js";
import { SourceDocument } from "../../../src/domain/indexing/source-document.js";
import { SourceRoot } from "../../../src/domain/indexing/source-root.js";
import { VideoPackage } from "../../../src/domain/indexing/video-package.js";

const packageRef = PackageRef.create(
  SourceName.create("auto-design"),
  VideoId.create("dQw4w9WgXcQ"),
);

function assertInvalid(createValue: () => unknown, field: string): void {
  assert.throws(createValue, (error: unknown) => {
    assert.ok(error instanceof DomainValidationError);
    assert.equal(error.field, field);
    return true;
  });
}

void test("keeps canonical source paths as explicit data", () => {
  const source = SourceRoot.create({
    name: SourceName.create("auto-design"),
    collectionPath: "C:\\knowledge\\auto-design",
    manifestPath: "C:\\knowledge\\auto-design\\manifest.json",
    videosPath: "C:\\knowledge\\auto-design\\videos",
    enabled: true,
  });

  assert.equal(source.name.value, "auto-design");
  assert.equal(source.collectionPath, "C:\\knowledge\\auto-design");
  assert.equal(
    source.manifestPath,
    "C:\\knowledge\\auto-design\\manifest.json",
  );
  assert.equal(source.videosPath, "C:\\knowledge\\auto-design\\videos");
  assert.equal(source.enabled, true);
});

void test("rejects missing or malformed canonical source paths", () => {
  const valid = {
    name: SourceName.create("auto-design"),
    collectionPath: "C:\\knowledge\\auto-design",
    manifestPath: "C:\\knowledge\\auto-design\\manifest.json",
    videosPath: "C:\\knowledge\\auto-design\\videos",
    enabled: true,
  } as const;

  assertInvalid(
    () => SourceRoot.create({ ...valid, collectionPath: "" }),
    "collectionPath",
  );
  assertInvalid(
    () => SourceRoot.create({ ...valid, manifestPath: " manifest.json" }),
    "manifestPath",
  );
  assertInvalid(
    () => SourceRoot.create({ ...valid, videosPath: "videos\0hidden" }),
    "videosPath",
  );
});

void test("creates a video package without deriving identity from its slug", () => {
  const inputTags = ["design", "visual"];
  const videoPackage = VideoPackage.create({
    ref: packageRef,
    slug: "design-principles-dQw4w9WgXcQ",
    relativePath: "videos/design-principles-dQw4w9WgXcQ",
    manifestStage: "complete",
    title: "Design principles",
    creator: "Design channel",
    canonicalUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    durationSeconds: 125.5,
    publishedAt: "2026-08-10T00:00:00.000Z",
    sourceLanguage: "en",
    contextLanguage: "es",
    tags: inputTags,
    categories: ["Education"],
    visualProfile: "visual-dependent",
  });

  inputTags.push("mutated-after-create");

  assert.equal(videoPackage.ref.equals(packageRef), true);
  assert.equal(videoPackage.slug, "design-principles-dQw4w9WgXcQ");
  assert.equal(
    videoPackage.relativePath,
    "videos/design-principles-dQw4w9WgXcQ",
  );
  assert.equal(videoPackage.durationSeconds, 125.5);
  assert.deepEqual(videoPackage.tags, ["design", "visual"]);
  assert.deepEqual(videoPackage.categories, ["Education"]);
});

void test("rejects invalid package locations and negative durations", () => {
  const valid = {
    ref: packageRef,
    slug: "design-principles-dQw4w9WgXcQ",
    relativePath: "videos/design-principles-dQw4w9WgXcQ",
    durationSeconds: 125,
  } as const;

  assertInvalid(
    () => VideoPackage.create({ ...valid, slug: "videos/design" }),
    "slug",
  );
  assertInvalid(
    () => VideoPackage.create({ ...valid, relativePath: "../outside" }),
    "relativePath",
  );
  assertInvalid(
    () => VideoPackage.create({ ...valid, durationSeconds: -1 }),
    "durationSeconds",
  );
  assertInvalid(
    () => VideoPackage.create({ ...valid, durationSeconds: Number.NaN }),
    "durationSeconds",
  );
});

void test("creates only the three approved source document kinds", () => {
  for (const [kind, relativePath] of [
    ["context", "deliverables/context.md"],
    ["rules", "deliverables/rules.json"],
    ["metadata", "source/metadata.json"],
  ] as const) {
    const document = SourceDocument.create({
      id: DocumentId.create(`document:auto-design:dQw4w9WgXcQ:${kind}`),
      packageRef,
      kind,
      relativePath,
      contentHash: "a".repeat(64),
      byteSize: 0,
      parserVersion: `${kind}-v1`,
    });

    assert.equal(document.kind, kind);
    assert.equal(document.relativePath, relativePath);
    assert.equal(document.byteSize, 0);
  }
});

void test("rejects unsupported document kinds, paths, hashes and sizes", () => {
  const valid = {
    id: DocumentId.create("document:auto-design:dQw4w9WgXcQ:context"),
    packageRef,
    kind: "context",
    relativePath: "deliverables/context.md",
    contentHash: "a".repeat(64),
    byteSize: 100,
    parserVersion: "context-v1",
  } as const;

  assertInvalid(
    () => SourceDocument.create({ ...valid, kind: "transcript" }),
    "kind",
  );
  assertInvalid(
    () => SourceDocument.create({ ...valid, relativePath: "/absolute.md" }),
    "relativePath",
  );
  assertInvalid(
    () => SourceDocument.create({ ...valid, contentHash: "not-sha256" }),
    "contentHash",
  );
  assertInvalid(
    () => SourceDocument.create({ ...valid, byteSize: -1 }),
    "byteSize",
  );
  assertInvalid(
    () => SourceDocument.create({ ...valid, byteSize: 1.5 }),
    "byteSize",
  );
});
