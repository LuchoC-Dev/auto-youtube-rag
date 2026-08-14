import assert from "node:assert/strict";
import { test } from "node:test";

import { modelDescriptor } from "../../../src/infrastructure/embeddings/e5-embedding-generator.js";
import {
  activeModelProfile,
  modelDescriptorOf,
  modelVersion,
  type EmbeddingModelProfile,
} from "../../../src/infrastructure/embeddings/model-profile.js";

void test("modelVersion(activeModelProfile) is the exact literal already persisted in the embeddings table", () => {
  // Regression guard: this string is what unchanged() in sync-source.ts
  // compares to decide whether a sync reindexes. If this literal ever
  // changes for the active profile, every already-synced library becomes
  // "changed" and the next sync reindexes all 51 videos against the real
  // model. See docs/model-profile-design.md, Decision 3, Risk 1.
  assert.equal(
    modelVersion(activeModelProfile),
    "Xenova/multilingual-e5-small@main:q8",
  );
});

void test("modelVersion appends +noprefix when inputPrefixes is null", () => {
  const profile: EmbeddingModelProfile = {
    ...activeModelProfile,
    inputPrefixes: null,
  };

  assert.equal(
    modelVersion(profile),
    "Xenova/multilingual-e5-small@main:q8+noprefix",
  );
});

void test("modelVersion changes with repository, revision or dtype", () => {
  const otherRepository: EmbeddingModelProfile = {
    ...activeModelProfile,
    repository: "Xenova/bge-small-en-v1.5",
  };
  const otherRevision: EmbeddingModelProfile = {
    ...activeModelProfile,
    revision: "v2",
  };

  assert.equal(
    modelVersion(otherRepository),
    "Xenova/bge-small-en-v1.5@main:q8",
  );
  assert.equal(
    modelVersion(otherRevision),
    "Xenova/multilingual-e5-small@v2:q8",
  );
});

void test("modelDescriptorOf(activeModelProfile) matches the port descriptor field by field", () => {
  const descriptor = modelDescriptorOf(activeModelProfile);

  assert.deepEqual(descriptor, {
    key: modelDescriptor.key,
    version: modelDescriptor.version,
    dimensions: modelDescriptor.dimensions,
    maxInputTokens: modelDescriptor.maxInputTokens,
  });
});

void test("activeModelProfile and its nested objects are frozen", () => {
  assert.ok(Object.isFrozen(activeModelProfile));
  assert.ok(Object.isFrozen(activeModelProfile.inputPrefixes));
  assert.ok(Object.isFrozen(activeModelProfile.requiredFiles));
});
