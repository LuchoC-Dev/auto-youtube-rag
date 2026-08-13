import assert from "node:assert/strict";
import { test } from "node:test";

import {
  commandRequirement,
  type CommandRequirement,
} from "../../../src/interfaces/cli/command-requirements.js";
import type { ParsedCliCommand } from "../../../src/interfaces/cli/parse-command.js";

// One representative command per `ParsedCliCommand["kind"]`. If a new kind
// is ever added to the union without a case in commandRequirement's
// switch, that function fails to typecheck (its `default: unreachable`
// branch stops compiling) before this list would even need updating --
// this test documents the resulting mapping and would need a new entry to
// exercise it, but the compile failure is the real guardrail.
const oneOfEachKind: readonly ParsedCliCommand[] = [
  { kind: "init", skipModel: false, from: null },
  { kind: "source_add", path: "C:\\videos", name: "design" },
  { kind: "source_list" },
  { kind: "source_remove", name: "design" },
  { kind: "sync", source: null },
  { kind: "status" },
  { kind: "doctor" },
  {
    kind: "retrieve",
    query: "brutalismo",
    depth: null,
    maxTokens: null,
    sources: [],
    out: null,
  },
  { kind: "models_install", force: false, from: null },
  { kind: "models_status" },
];

const expected: Readonly<Record<ParsedCliCommand["kind"], CommandRequirement>> =
  {
    init: "none",
    source_add: "library",
    source_list: "library",
    source_remove: "library",
    sync: "library_and_model",
    status: "library",
    doctor: "none",
    retrieve: "library_and_model",
    models_install: "none",
    models_status: "none",
  };

void test("every ParsedCliCommand kind has a declared requirement", () => {
  assert.equal(oneOfEachKind.length, Object.keys(expected).length);
  for (const command of oneOfEachKind) {
    assert.equal(commandRequirement(command), expected[command.kind]);
  }
});

void test("doctor requires nothing so it can diagnose a missing library or model", () => {
  assert.equal(commandRequirement({ kind: "doctor" }), "none");
});

void test("sync and retrieve are the only commands requiring both the library and the model", () => {
  for (const [kind, requirement] of Object.entries(expected)) {
    const needsBoth = requirement === "library_and_model";
    const isSyncOrRetrieve = kind === "sync" || kind === "retrieve";
    assert.equal(needsBoth, isSyncOrRetrieve, kind);
  }
});
