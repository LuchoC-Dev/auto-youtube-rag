import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { isAbsolute, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

import type { SourceRegistry } from "../../../src/application/ports/source-registry.js";
import { sha256 } from "../../../src/domain/indexing/content-identity.js";
import {
  PackageRef,
  SourceName,
  VideoId,
} from "../../../src/domain/indexing/identifiers.js";
import { SourceRoot } from "../../../src/domain/indexing/source-root.js";
import { parseContextMarkdown } from "../../../src/infrastructure/filesystem/context-markdown-parser.js";
import {
  FilesystemPackageReadError,
  FilesystemPackageSourceReader,
} from "../../../src/infrastructure/filesystem/filesystem-package-source-reader.js";
import { selectMetadata } from "../../../src/infrastructure/filesystem/metadata-selector.js";
import { parseRulesJson } from "../../../src/infrastructure/filesystem/rules-json-parser.js";

const fixturesDirectory = fileURLToPath(
  new URL("../../fixtures/indexing/", import.meta.url),
);
const videoId = VideoId.create("video_123");
const sourceName = SourceName.create("fixture-source");
const ref = PackageRef.create(sourceName, videoId);

async function readFixture(name: string): Promise<string> {
  return readFile(join(fixturesDirectory, name), "utf8");
}

void test("selects stable metadata and drops volatile yt-dlp fields", async () => {
  const metadata = JSON.parse(
    await readFixture("metadata-volatile.json"),
  ) as unknown;
  const context = parseContextMarkdown(
    (await readFixture("context-complex.md")).replace(
      "visual_profile: null",
      'visual_profile: "visual-heavy"',
    ),
  );
  const rules = parseRulesJson(
    JSON.parse(await readFixture("rules-complete.json")) as unknown,
    videoId,
  );

  const selected = selectMetadata(metadata, {
    expectedVideoId: videoId,
    sourceLanguage: "en",
    contextLanguage: "es",
    context,
    rules,
    sourcePath: "memory://metadata.json",
  });

  assert.equal(selected.videoId.equals(videoId), true);
  assert.equal(selected.title, "Diseño visual útil");
  assert.equal(selected.creator, "Canal de Diseño");
  assert.equal(
    selected.canonicalUrl,
    "https://www.youtube.com/watch?v=video_123",
  );
  assert.equal(selected.durationSeconds, 125);
  assert.equal(selected.publishedAt, "2026-08-10T00:00:00.000Z");
  assert.equal(selected.sourceLanguage, "en");
  assert.equal(selected.contextLanguage, "es");
  assert.deepEqual(selected.tags, ["diseño", "jerarquía visual"]);
  assert.deepEqual(selected.categories, ["Education"]);
  assert.equal(selected.visualProfile, "visual-heavy");
  assert.equal(selected.visualCoverage, "20 uniformes y muestreo adaptativo");
  assert.equal(selected.limitations.length, 2);
  assert.equal(selected.visualEvidence.length, 4);
  assert.equal(
    selected.visualEvidence.every(
      (path) => !isAbsolute(path) && !path.split("/").includes(".."),
    ),
    true,
  );
  assert.equal("viewCount" in selected, false);
  assert.equal("formats" in selected, false);
  assert.equal("automaticCaptions" in selected, false);
});

void test("reads a complete package through the application port without writes", async () => {
  const directory = await mkdtemp(join(tmpdir(), "auto-youtube-rag-package-"));
  const slug = "design-video";
  const videosPath = join(directory, "videos");
  const packagePath = join(videosPath, slug);
  const deliverablesPath = join(packagePath, "deliverables");
  const sourcePath = join(packagePath, "source");
  const manifestPath = join(directory, "manifest.json");
  const contextPath = join(deliverablesPath, "context.md");
  const rulesPath = join(deliverablesPath, "rules.json");
  const metadataPath = join(sourcePath, "metadata.json");
  const contextRaw = (await readFixture("context-complex.md")).replace(
    "visual_profile: null",
    'visual_profile: "visual-heavy"',
  );
  const rulesRaw = await readFixture("rules-complete.json");
  const metadataRaw = await readFixture("metadata-volatile.json");

  try {
    await mkdir(deliverablesPath, { recursive: true });
    await mkdir(sourcePath, { recursive: true });
    await writeFile(contextPath, contextRaw, "utf8");
    await writeFile(rulesPath, rulesRaw, "utf8");
    await writeFile(metadataPath, metadataRaw, "utf8");
    await writeFile(
      manifestPath,
      JSON.stringify({
        videos: [
          {
            video_id: videoId.value,
            slug,
            source_language: "en",
            dossier_language: "es",
            stage: "complete",
            resources: { context: true, rules: true, metadata: true },
          },
        ],
      }),
      "utf8",
    );

    const source = SourceRoot.create({
      name: sourceName,
      collectionPath: directory,
      manifestPath,
      videosPath,
      enabled: true,
    });
    const reader = new FilesystemPackageSourceReader(registryFor(source));
    const manifest = await reader.readManifest(source);
    const snapshot = await reader.readPackage(ref);

    assert.equal(manifest.videos.length, 1);
    assert.equal(snapshot.kind, "video_package");
    assert.equal(snapshot.ref.equals(ref), true);
    assert.equal(snapshot.slug, slug);
    assert.equal(snapshot.relativePath, `videos/${slug}`);
    assert.equal(snapshot.manifestStage, "complete");
    assert.deepEqual(
      snapshot.documents.map((document) => ({
        kind: document.kind,
        relativePath: document.relativePath,
        parserVersion: document.parserVersion,
      })),
      [
        {
          kind: "context",
          relativePath: "deliverables/context.md",
          parserVersion: "context-v1",
        },
        {
          kind: "rules",
          relativePath: "deliverables/rules.json",
          parserVersion: "rules-v1",
        },
        {
          kind: "metadata",
          relativePath: "source/metadata.json",
          parserVersion: "metadata-v1",
        },
      ],
    );
    const contextDocument = snapshot.documents[0];
    assert.ok(contextDocument);
    assert.equal(contextDocument.contentHash, sha256(contextRaw));
    assert.equal(contextDocument.byteSize, Buffer.byteLength(contextRaw));
    assert.equal(await readFile(contextPath, "utf8"), contextRaw);
    assert.equal(Object.isFrozen(snapshot.documents), true);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

void test("reads a package with analysis.json instead of rules.json", async () => {
  const directory = await mkdtemp(join(tmpdir(), "auto-youtube-rag-package-"));
  const analysisVideoId = VideoId.create("video_456");
  const analysisRef = PackageRef.create(sourceName, analysisVideoId);
  const slug = "analysis-video";
  const videosPath = join(directory, "videos");
  const packagePath = join(videosPath, slug);
  const deliverablesPath = join(packagePath, "deliverables");
  const manifestPath = join(directory, "manifest.json");
  const analysisPath = join(deliverablesPath, "analysis.json");
  const analysisRaw = await readFixture("analysis-complete.json");

  try {
    await mkdir(deliverablesPath, { recursive: true });
    await writeFile(analysisPath, analysisRaw, "utf8");
    await writeFile(
      manifestPath,
      JSON.stringify({
        videos: [
          {
            video_id: analysisVideoId.value,
            slug,
            source_language: "es",
            dossier_language: "es",
            stage: "complete",
            resources: { context: false, analysis: true, metadata: false },
          },
        ],
      }),
      "utf8",
    );

    const source = SourceRoot.create({
      name: sourceName,
      collectionPath: directory,
      manifestPath,
      videosPath,
      enabled: true,
    });
    const reader = new FilesystemPackageSourceReader(registryFor(source));
    const snapshot = await reader.readPackage(analysisRef);

    assert.deepEqual(
      snapshot.documents.map((document) => ({
        kind: document.kind,
        relativePath: document.relativePath,
        parserVersion: document.parserVersion,
      })),
      [
        {
          kind: "analysis",
          relativePath: "deliverables/analysis.json",
          parserVersion: "analysis-v1",
        },
      ],
    );
    const analysisDocument = snapshot.documents[0];
    assert.ok(analysisDocument);
    assert.equal(analysisDocument.contentHash, sha256(analysisRaw));
    assert.equal(analysisDocument.kind, "analysis");
    assert.equal(analysisDocument.content.topics.length, 2);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

void test("reports unknown sources and packages with stable fields", async () => {
  const missingSource = SourceName.create("missing-source");
  const reader = new FilesystemPackageSourceReader(registryFor(null));

  await assert.rejects(
    reader.readPackage(PackageRef.create(missingSource, videoId)),
    assertPackageError("PACKAGE_SOURCE_NOT_FOUND", "sourceName"),
  );
});

function registryFor(source: SourceRoot | null): SourceRegistry {
  return {
    add(): Promise<void> {
      return Promise.resolve();
    },
    getByName(name: SourceName): Promise<SourceRoot | null> {
      return Promise.resolve(
        source?.name.equals(name) === true ? source : null,
      );
    },
    list(): Promise<readonly SourceRoot[]> {
      return Promise.resolve(source === null ? [] : [source]);
    },
    remove(): Promise<void> {
      return Promise.resolve();
    },
  };
}

function assertPackageError(code: string, field: string) {
  return (error: unknown): boolean => {
    assert.ok(error instanceof FilesystemPackageReadError);
    assert.equal(error.code, code);
    assert.equal(error.field, field);
    return true;
  };
}
