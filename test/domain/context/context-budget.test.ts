import assert from "node:assert/strict";
import { test } from "node:test";

import {
  ContextBudget,
  contextDepthPresets,
} from "../../../src/domain/context/context-budget.js";
import { DomainValidationError } from "../../../src/domain/indexing/domain-error.js";

function assertInvalid(createValue: () => unknown, field: string): void {
  assert.throws(createValue, (error: unknown) => {
    assert.ok(error instanceof DomainValidationError);
    assert.equal(error.code, "INVALID_CONTEXT_BUDGET");
    assert.equal(error.field, field);
    return true;
  });
}

void test("defaults to balanced with its preset token ceiling", () => {
  const budget = ContextBudget.default();

  assert.equal(budget.depth, "balanced");
  assert.equal(budget.maxTokens, 32_000);
});

void test("resolves each preset to its documented token ceiling", () => {
  assert.equal(
    ContextBudget.create({ depth: "focused" }).maxTokens,
    contextDepthPresets.focused,
  );
  assert.equal(
    ContextBudget.create({ depth: "balanced" }).maxTokens,
    contextDepthPresets.balanced,
  );
  assert.equal(
    ContextBudget.create({ depth: "deep" }).maxTokens,
    contextDepthPresets.deep,
  );
});

void test("an explicit override replaces the ceiling without renaming the preset", () => {
  const budget = ContextBudget.create({
    depth: "focused",
    maxTokensOverride: 5_000,
  });

  assert.equal(budget.depth, "focused");
  assert.equal(budget.maxTokens, 5_000);
});

void test("rejects an unknown depth", () => {
  assertInvalid(() => ContextBudget.create({ depth: "shallow" }), "depth");
  assertInvalid(() => ContextBudget.create({ depth: 1 }), "depth");
});

void test("rejects a non-positive or non-integer override", () => {
  for (const value of [
    0,
    -1,
    1.5,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    "1000",
  ]) {
    assertInvalid(
      () => ContextBudget.create({ maxTokensOverride: value }),
      "maxTokensOverride",
    );
  }
});

void test("null override falls back to the preset", () => {
  const budget = ContextBudget.create({
    depth: "deep",
    maxTokensOverride: null,
  });

  assert.equal(budget.maxTokens, contextDepthPresets.deep);
});
