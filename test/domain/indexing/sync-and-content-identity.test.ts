import assert from "node:assert/strict";
import { test } from "node:test";

import {
  createAnalysisRecommendationKey,
  createAnalysisTopicKey,
  createFragmentKey,
  createMarkdownSectionKey,
  createRuleChildKey,
  createRulePatternKey,
  sha256,
} from "../../../src/domain/indexing/content-identity.js";
import { DomainValidationError } from "../../../src/domain/indexing/domain-error.js";
import {
  KnowledgeUnitId,
  SourceName,
  SyncId,
  VideoId,
} from "../../../src/domain/indexing/identifiers.js";
import { SyncIssue, SyncRun } from "../../../src/domain/indexing/sync-run.js";

const syncId = SyncId.create("sync:01J5J8Y7N8G4X2W3Z6Q9R0T1AB");
const sourceName = SourceName.create("auto-design");
const startedAt = "2026-08-11T12:00:00.000Z";

function assertInvalid(createValue: () => unknown, field: string): void {
  assert.throws(createValue, (error: unknown) => {
    assert.ok(error instanceof DomainValidationError);
    assert.equal(error.field, field);
    return true;
  });
}

void test("starts a run and finishes it through an approved transition", () => {
  const running = SyncRun.start({ id: syncId, sourceName, startedAt });
  const counters = {
    packagesSeen: 4,
    packagesUnchanged: 1,
    packagesIndexed: 2,
    packagesFailed: 1,
    packagesDeleted: 0,
  };
  const finished = running.finish({
    status: "partial",
    finishedAt: "2026-08-11T12:01:00.000Z",
    counters,
  });

  counters.packagesSeen = 99;

  assert.equal(running.status, "running");
  assert.equal(running.finishedAt, null);
  assert.deepEqual(running.counters, {
    packagesSeen: 0,
    packagesUnchanged: 0,
    packagesIndexed: 0,
    packagesFailed: 0,
    packagesDeleted: 0,
  });
  assert.equal(finished.status, "partial");
  assert.equal(finished.finishedAt, "2026-08-11T12:01:00.000Z");
  assert.equal(finished.counters.packagesSeen, 4);
});

void test("rejects invalid run transitions, counters and timestamps", () => {
  const running = SyncRun.start({ id: syncId, sourceName, startedAt });
  const validFinish = {
    status: "ok",
    finishedAt: "2026-08-11T12:01:00.000Z",
    counters: {
      packagesSeen: 1,
      packagesUnchanged: 0,
      packagesIndexed: 1,
      packagesFailed: 0,
      packagesDeleted: 0,
    },
  } as const;
  const finished = running.finish(validFinish);

  assertInvalid(() => finished.finish(validFinish), "status");
  assertInvalid(
    () => running.finish({ ...validFinish, status: "running" }),
    "status",
  );
  assertInvalid(
    () =>
      running.finish({
        ...validFinish,
        counters: { ...validFinish.counters, packagesIndexed: -1 },
      }),
    "packagesIndexed",
  );
  assertInvalid(
    () =>
      running.finish({
        ...validFinish,
        finishedAt: "2026-08-11T11:59:59.000Z",
      }),
    "finishedAt",
  );
  assertInvalid(
    () => SyncRun.start({ id: syncId, sourceName, startedAt: "not-a-date" }),
    "startedAt",
  );
});

void test("creates package and source-level sync issues", () => {
  const packageIssue = SyncIssue.create({
    syncId,
    videoId: VideoId.create("dQw4w9WgXcQ"),
    relativePath: "videos/design-principles/deliverables/context.md",
    code: "INVALID_CONTEXT",
    message: "The context document could not be parsed.",
    retryable: false,
  });
  const sourceIssue = SyncIssue.create({
    syncId,
    videoId: null,
    relativePath: null,
    code: "MANIFEST_UNREADABLE",
    message: "The source manifest could not be read.",
    retryable: true,
  });

  assert.equal(packageIssue.videoId?.value, "dQw4w9WgXcQ");
  assert.equal(
    packageIssue.relativePath,
    "videos/design-principles/deliverables/context.md",
  );
  assert.equal(sourceIssue.videoId, null);
  assert.equal(sourceIssue.retryable, true);
});

void test("rejects malformed sync issues", () => {
  const valid = {
    syncId,
    videoId: null,
    relativePath: null,
    code: "MANIFEST_UNREADABLE",
    message: "The source manifest could not be read.",
    retryable: true,
  } as const;

  assertInvalid(() => SyncIssue.create({ ...valid, code: "bad code" }), "code");
  assertInvalid(() => SyncIssue.create({ ...valid, message: "" }), "message");
  assertInvalid(
    () => SyncIssue.create({ ...valid, relativePath: "../manifest.json" }),
    "relativePath",
  );
  assertInvalid(
    () => SyncIssue.create({ ...valid, retryable: "yes" }),
    "retryable",
  );
});

void test("computes stable SHA-256 digests from text and bytes", () => {
  const expected =
    "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad";

  assert.equal(sha256("abc"), expected);
  assert.equal(sha256(new TextEncoder().encode("abc")), expected);
  assert.notEqual(sha256("abc"), sha256("ABC"));
});

void test("normalizes heading paths and separates repeated occurrences", () => {
  const first = createMarkdownSectionKey(
    [" Design   Principles ", "VISUAL Hierarchy"],
    0,
  );
  const equivalent = createMarkdownSectionKey(
    ["design principles", "visual hierarchy"],
    0,
  );
  const repeated = createMarkdownSectionKey(
    ["design principles", "visual hierarchy"],
    1,
  );

  assert.equal(first, equivalent);
  assert.notEqual(first, repeated);
  assert.equal(
    first,
    createMarkdownSectionKey(["design principles", "visual hierarchy"], 0),
  );
  assert.match(first, /^heading:[a-f0-9]{64}:0$/u);
});

void test("builds deterministic rule and fragment structural keys", () => {
  const pattern = createRulePatternKey("P001");
  const item = createRuleChildKey("P001", "rule_item", 0);
  const avoidance = createRuleChildKey("P001", "avoid_item", 0);
  const fragment = createFragmentKey(
    KnowledgeUnitId.create("unit:context-section:0001"),
    2,
  );

  assert.equal(pattern, "pattern:P001");
  assert.equal(item, "pattern:P001/rule_item:0");
  assert.equal(avoidance, "pattern:P001/avoid_item:0");
  assert.equal(
    fragment,
    createFragmentKey(KnowledgeUnitId.create("unit:context-section:0001"), 2),
  );
  assert.match(fragment, /^fragment:[a-f0-9]{64}:2$/u);

  assertInvalid(() => createMarkdownSectionKey([], 0), "headingPath");
  assertInvalid(() => createMarkdownSectionKey(["Heading"], -1), "occurrence");
  assertInvalid(() => createRulePatternKey("bad/id"), "patternId");
  assertInvalid(() => createRuleChildKey("P001", "unknown", 0), "kind");
  assertInvalid(
    () =>
      createFragmentKey(
        KnowledgeUnitId.create("unit:context-section:0001"),
        -1,
      ),
    "ordinal",
  );
});

void test("builds deterministic analysis structural keys", () => {
  const topic = createAnalysisTopicKey("expressive_typography");
  const recommendation = createAnalysisRecommendationKey(
    "adopt_expressive_type",
  );

  assert.equal(topic, "topic:expressive_typography");
  assert.equal(recommendation, "recommendation:adopt_expressive_type");
  assertInvalid(() => createAnalysisTopicKey("bad/id"), "topicId");
  assertInvalid(
    () => createAnalysisRecommendationKey("bad/id"),
    "recommendationId",
  );
});
