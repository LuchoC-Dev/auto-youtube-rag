import assert from "node:assert/strict";
import { test } from "node:test";

import {
  CliUsageError,
  parseCommand,
} from "../../../src/interfaces/cli/parse-command.js";
import {
  renderCliError,
  renderCliSuccess,
} from "../../../src/interfaces/cli/render-cli-output.js";

void test("parses every non-interactive administrative command", () => {
  assert.deepEqual(parseCommand(["init"]), { kind: "init" });
  assert.deepEqual(
    parseCommand(["source", "add", "C:\\library", "--name", "design"]),
    {
      kind: "source_add",
      path: "C:\\library",
      name: "design",
    },
  );
  assert.deepEqual(parseCommand(["source", "list"]), { kind: "source_list" });
  assert.deepEqual(parseCommand(["source", "remove", "design"]), {
    kind: "source_remove",
    name: "design",
  });
  assert.deepEqual(parseCommand(["sync"]), { kind: "sync", source: null });
  assert.deepEqual(parseCommand(["sync", "--source", "design"]), {
    kind: "sync",
    source: "design",
  });
  assert.deepEqual(parseCommand(["status"]), { kind: "status" });
  assert.deepEqual(parseCommand(["doctor"]), { kind: "doctor" });
});

void test("maps missing, unknown and mistyped arguments to usage exit code 2", () => {
  for (const args of [
    [],
    ["unknown"],
    ["init", "extra"],
    ["source", "add", "path"],
    ["source", "remove"],
    ["sync", "--unknown"],
    ["status", "extra"],
  ]) {
    assert.throws(
      () => parseCommand(args),
      (error: unknown) => {
        assert.ok(error instanceof CliUsageError);
        assert.equal(error.code, "INVALID_ARGUMENTS");
        assert.equal(error.exitCode, 2);
        return true;
      },
    );
  }
});

void test("renders compact versioned JSON with English technical keys", () => {
  const success = JSON.parse(
    renderCliSuccess({ status: "ok", sources: [{ name: "design" }] }),
  ) as Record<string, unknown>;
  assert.equal(success.schema_version, "1.0");
  assert.equal(success.status, "ok");

  const rendered = renderCliError(new CliUsageError("A command is required."));
  assert.equal(rendered.exitCode, 2);
  assert.deepEqual(JSON.parse(rendered.output), {
    schema_version: "1.0",
    status: "error",
    error: {
      code: "INVALID_ARGUMENTS",
      message: "A command is required.",
      retryable: false,
    },
  });
  assert.equal(rendered.output.endsWith("\n"), true);
  assert.equal(rendered.output.includes("\u001b"), false);
});
