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
  assert.deepEqual(parseCommand(["init"]), {
    kind: "init",
    skipModel: false,
    from: null,
  });
  assert.deepEqual(parseCommand(["init", "--skip-model"]), {
    kind: "init",
    skipModel: true,
    from: null,
  });
  assert.deepEqual(
    parseCommand(["init", "--from", "C:\\repo\\.cache\\models"]),
    { kind: "init", skipModel: false, from: "C:\\repo\\.cache\\models" },
  );
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
  assert.deepEqual(parseCommand(["sync"]), {
    kind: "sync",
    source: null,
    force: false,
  });
  assert.deepEqual(parseCommand(["sync", "--source", "design"]), {
    kind: "sync",
    source: "design",
    force: false,
  });
  assert.deepEqual(parseCommand(["sync", "--force"]), {
    kind: "sync",
    source: null,
    force: true,
  });
  assert.deepEqual(parseCommand(["status"]), { kind: "status" });
  assert.deepEqual(parseCommand(["doctor"]), { kind: "doctor" });
  assert.deepEqual(parseCommand(["retrieve", "brutalismo"]), {
    kind: "retrieve",
    query: "brutalismo",
    depth: null,
    maxTokens: null,
    sources: [],
    out: null,
  });
  assert.deepEqual(
    parseCommand([
      "retrieve",
      "brutalismo",
      "--depth",
      "deep",
      "--max-tokens",
      "5000",
      "--source",
      "auto-design",
      "--source",
      "catalog-design",
      "--out",
      "C:\\out",
    ]),
    {
      kind: "retrieve",
      query: "brutalismo",
      depth: "deep",
      maxTokens: 5000,
      sources: ["auto-design", "catalog-design"],
      out: "C:\\out",
    },
  );
  assert.deepEqual(parseCommand(["models", "install"]), {
    kind: "models_install",
    force: false,
    from: null,
  });
  assert.deepEqual(parseCommand(["models", "install", "--force"]), {
    kind: "models_install",
    force: true,
    from: null,
  });
  assert.deepEqual(
    parseCommand(["models", "install", "--from", "C:\\repo\\.cache\\models"]),
    {
      kind: "models_install",
      force: false,
      from: "C:\\repo\\.cache\\models",
    },
  );
  assert.deepEqual(parseCommand(["models", "status"]), {
    kind: "models_status",
  });
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
    ["retrieve"],
    ["retrieve", "brutalismo", "--depth", "shallow"],
    ["retrieve", "brutalismo", "--max-tokens", "0"],
    ["retrieve", "brutalismo", "--max-tokens", "abc"],
    ["models"],
    ["models", "frobnicate"],
    ["models", "install", "extra"],
    ["models", "install", "--unknown"],
    ["models", "status", "extra"],
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
