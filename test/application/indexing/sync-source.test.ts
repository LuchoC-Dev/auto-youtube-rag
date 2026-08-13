import assert from "node:assert/strict";
import { test } from "node:test";

import type {
  ManifestSnapshot,
  ManifestVideoIssue,
  PackageSnapshot,
} from "../../../src/application/indexing/package-snapshots.js";
import { syncSource } from "../../../src/application/indexing/sync-source.js";
import type { PackageSourceReader } from "../../../src/application/ports/package-source-reader.js";
import type {
  VectorIndexChange,
  VectorIndexSink,
} from "../../../src/application/ports/vector-index-sink.js";
import {
  PackageRef,
  SourceName,
  SyncId,
  VideoId,
} from "../../../src/domain/indexing/identifiers.js";
import { SourceRoot } from "../../../src/domain/indexing/source-root.js";
import { FakeEmbeddingGenerator } from "../../fakes/fake-embedding-generator.js";
import { InMemoryIndexStore } from "../../fakes/in-memory-index-store.js";

const sourceName = SourceName.create("auto-design");
const source = SourceRoot.create({
  name: sourceName,
  collectionPath: "C:\\knowledge\\auto-design",
  manifestPath: "C:\\knowledge\\auto-design\\manifest.json",
  videosPath: "C:\\knowledge\\auto-design\\videos",
  enabled: true,
});

function ref(id: string): PackageRef {
  return PackageRef.create(sourceName, VideoId.create(id));
}

function snapshot(
  packageRef: PackageRef,
  hash: string,
  content: string,
): PackageSnapshot {
  return Object.freeze({
    kind: "video_package",
    ref: packageRef,
    slug: `${packageRef.videoId.value}-slug`,
    relativePath: `videos/${packageRef.videoId.value}-slug`,
    manifestStage: "complete",
    documents: Object.freeze([
      {
        kind: "context" as const,
        relativePath: "deliverables/context.md",
        contentHash: hash.repeat(64),
        byteSize: content.length,
        parserVersion: "context-v1",
        content: Object.freeze({
          kind: "context" as const,
          frontmatter: Object.freeze({ title: packageRef.videoId.value }),
          preamble: "",
          sections: Object.freeze([
            {
              kind: "context_section" as const,
              title: "Design",
              level: 1,
              ordinal: 0,
              headingPath: Object.freeze(["Design"]),
              content,
              timestamps: Object.freeze([]),
              visualEvidence: Object.freeze([]),
              children: Object.freeze([]),
            },
          ]),
        }),
      },
    ]),
  });
}

class FakeReader implements PackageSourceReader {
  public manifestError: Error | null = null;
  public manifestIssues: ManifestVideoIssue[] = [];
  public readonly packageErrors = new Map<string, Error>();
  public constructor(
    public videos: PackageRef[],
    public readonly packages: Map<string, PackageSnapshot>,
  ) {}

  public readManifest(): Promise<ManifestSnapshot> {
    if (this.manifestError !== null) return Promise.reject(this.manifestError);
    return Promise.resolve(
      Object.freeze({
        kind: "manifest",
        sourceName,
        contentHash: "f".repeat(64),
        videos: Object.freeze(
          this.videos.map((packageRef) =>
            Object.freeze({
              ref: packageRef,
              slug: `${packageRef.videoId.value}-slug`,
              sourceLanguage: "en",
              contextLanguage: "es",
              stage: "complete",
              resources: Object.freeze({
                context: true,
                structuredContent: "none",
                metadata: false,
              }),
            }),
          ),
        ),
        issues: Object.freeze(this.manifestIssues),
      }),
    );
  }

  public readPackage(packageRef: PackageRef): Promise<PackageSnapshot> {
    const error = this.packageErrors.get(packageRef.serialize());
    if (error !== undefined) return Promise.reject(error);
    const value = this.packages.get(packageRef.serialize());
    return value === undefined
      ? Promise.reject(new Error("Missing fake package."))
      : Promise.resolve(value);
  }
}

class FakeVectorSink implements VectorIndexSink {
  public readonly changes: VectorIndexChange[] = [];
  public constructor(private readonly events: string[] = []) {}
  public apply(change: VectorIndexChange): Promise<void> {
    this.changes.push(change);
    this.events.push(`publish:${change.kind}`);
    return Promise.resolve();
  }
}

function clock(): () => Date {
  let tick = 0;
  return () => new Date(Date.UTC(2026, 7, 11, 0, 0, tick++));
}

function dependencies(
  reader: FakeReader,
  store = new InMemoryIndexStore(),
  events: string[] = [],
) {
  const embeddings = new FakeEmbeddingGenerator();
  const vectors = new FakeVectorSink(events);
  return {
    input: {
      reader,
      store,
      embeddingGenerator: embeddings,
      vectorIndex: vectors,
      createSyncId: () =>
        SyncId.create(`sync:test-${String(store.runs.size + 1)}`),
      now: clock(),
    },
    store,
    embeddings,
    vectors,
  };
}

void test("indexes initially, publishes after commit and returns no_changes on repeat", async () => {
  const packageRef = ref("video_1");
  const reader = new FakeReader(
    [packageRef],
    new Map([
      [packageRef.serialize(), snapshot(packageRef, "a", "visual hierarchy")],
    ]),
  );
  const events: string[] = [];
  const setup = dependencies(reader, new InMemoryIndexStore(events), events);
  const first = await syncSource(setup.input, source);
  assert.equal(first.status, "ok");
  assert.equal(first.counters.packagesIndexed, 1);
  assert.deepEqual(events, [
    "commit:auto-design:video_1",
    "publish:replace_package",
  ]);

  const second = await syncSource(setup.input, source);
  assert.equal(second.status, "no_changes");
  assert.equal(second.counters.packagesUnchanged, 1);
  assert.equal(setup.embeddings.embedCalls, 1);
  assert.equal(setup.store.changes.length, 1);
});

void test("reindexes changed content and removes packages missing from a valid manifest", async () => {
  const kept = ref("kept");
  const removed = ref("removed");
  const packages = new Map([
    [kept.serialize(), snapshot(kept, "a", "first")],
    [removed.serialize(), snapshot(removed, "b", "removed")],
  ]);
  const reader = new FakeReader([kept, removed], packages);
  const setup = dependencies(reader);
  await syncSource(setup.input, source);

  packages.set(kept.serialize(), snapshot(kept, "c", "changed"));
  reader.videos = [kept];
  const result = await syncSource(setup.input, source);
  assert.equal(result.status, "ok");
  assert.equal(result.counters.packagesIndexed, 1);
  assert.equal(result.counters.packagesDeleted, 1);
  assert.equal(await setup.store.getPackageState(removed), null);
  assert.deepEqual(setup.vectors.changes.at(-1), {
    kind: "remove_packages",
    packageRefs: [removed],
  });
});

void test("keeps processing after one invalid package and preserves its previous state", async () => {
  const broken = ref("broken");
  const valid = ref("valid");
  const reader = new FakeReader(
    [broken, valid],
    new Map([
      [broken.serialize(), snapshot(broken, "a", "old valid")],
      [valid.serialize(), snapshot(valid, "b", "valid")],
    ]),
  );
  const setup = dependencies(reader);
  await syncSource(setup.input, source);
  const previousBroken = await setup.store.getPackageState(broken);
  reader.packageErrors.set(
    broken.serialize(),
    Object.assign(new Error("Invalid context"), { code: "PACKAGE_INVALID" }),
  );
  reader.packages.set(valid.serialize(), snapshot(valid, "c", "new valid"));

  const result = await syncSource(setup.input, source);
  assert.equal(result.status, "partial");
  assert.equal(result.counters.packagesFailed, 1);
  assert.equal(result.counters.packagesIndexed, 1);
  assert.equal(
    (await setup.store.getPackageState(broken))?.packageHash,
    previousBroken?.packageHash,
  );
  assert.equal(setup.store.issues.at(-1)?.videoId?.value, "broken");
});

void test("tolerates a regressed manifest entry: records an issue, protects its previous package and still syncs the rest", async () => {
  const regressed = ref("regressed");
  const valid = ref("valid");
  const reader = new FakeReader(
    [regressed, valid],
    new Map([
      [regressed.serialize(), snapshot(regressed, "a", "old valid")],
      [valid.serialize(), snapshot(valid, "b", "first")],
    ]),
  );
  const setup = dependencies(reader);
  await syncSource(setup.input, source);
  const previousRegressed = await setup.store.getPackageState(regressed);
  assert.ok(previousRegressed);

  // The regressed video's manifest entry no longer parses (e.g. a package
  // schema drift), so the reader drops it from `videos` and reports it as a
  // manifest-level issue instead, the same shape parseManifest produces.
  reader.videos = [valid];
  reader.manifestIssues = [
    {
      index: 0,
      videoId: regressed.videoId,
      field: "videos[0].resources.rules",
      code: "SCHEMA_INVALID",
      message: "videos[0].resources.rules must be a boolean",
    },
  ];
  reader.packages.set(valid.serialize(), snapshot(valid, "c", "changed"));

  const result = await syncSource(setup.input, source);
  assert.equal(result.status, "partial");
  assert.equal(result.counters.packagesFailed, 1);
  assert.equal(result.counters.packagesIndexed, 1);
  assert.equal(result.counters.packagesDeleted, 0);
  assert.equal(
    (await setup.store.getPackageState(regressed))?.packageHash,
    previousRegressed.packageHash,
  );
  const manifestIssue = result.issues.find(
    (issue) => issue.videoId?.value === "regressed",
  );
  assert.ok(manifestIssue);
  assert.equal(manifestIssue.code, "MANIFEST_ENTRY_SCHEMA_INVALID");
});

void test("fails an unreadable manifest without deleting the previous index", async () => {
  const packageRef = ref("video_1");
  const reader = new FakeReader(
    [packageRef],
    new Map([[packageRef.serialize(), snapshot(packageRef, "a", "preserved")]]),
  );
  const setup = dependencies(reader);
  await syncSource(setup.input, source);
  reader.manifestError = Object.assign(new Error("Manifest unreadable"), {
    code: "MANIFEST_READ_FAILED",
  });
  reader.videos = [];

  const result = await syncSource(setup.input, source);
  assert.equal(result.status, "failed");
  assert.ok(await setup.store.getPackageState(packageRef));
  assert.equal(result.counters.packagesDeleted, 0);
});
