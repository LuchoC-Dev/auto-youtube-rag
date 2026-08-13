import assert from "node:assert/strict";
import { resolve } from "node:path";
import { test } from "node:test";

import { resolvePaths } from "../../../src/infrastructure/config/resolve-paths.js";

function homedir(): string {
  return "C:/Users/fixture-user";
}

void test("resolves the default home and model paths from homedir alone", () => {
  const paths = resolvePaths({}, homedir);
  assert.equal(paths.home, resolve("C:/Users/fixture-user/.auto-youtube-rag"));
  assert.equal(
    paths.databasePath,
    resolve("C:/Users/fixture-user/.auto-youtube-rag/index.sqlite"),
  );
  assert.equal(
    paths.modelsPath,
    resolve("C:/Users/fixture-user/.auto-youtube-rag/models"),
  );
});

void test("AUTO_YOUTUBE_RAG_HOME overrides the home and the derived model path", () => {
  const paths = resolvePaths(
    { AUTO_YOUTUBE_RAG_HOME: "D:/custom-home" },
    homedir,
  );
  assert.equal(paths.home, resolve("D:/custom-home"));
  assert.equal(paths.databasePath, resolve("D:/custom-home/index.sqlite"));
  assert.equal(paths.modelsPath, resolve("D:/custom-home/models"));
});

void test("AUTO_YOUTUBE_RAG_MODELS_DIR overrides only the model path", () => {
  const paths = resolvePaths(
    { AUTO_YOUTUBE_RAG_MODELS_DIR: "E:/shared-models" },
    homedir,
  );
  assert.equal(paths.home, resolve("C:/Users/fixture-user/.auto-youtube-rag"));
  assert.equal(paths.modelsPath, resolve("E:/shared-models"));
});

void test("both variables can be set independently", () => {
  const paths = resolvePaths(
    {
      AUTO_YOUTUBE_RAG_HOME: "D:/custom-home",
      AUTO_YOUTUBE_RAG_MODELS_DIR: "E:/shared-models",
    },
    homedir,
  );
  assert.equal(paths.home, resolve("D:/custom-home"));
  assert.equal(paths.databasePath, resolve("D:/custom-home/index.sqlite"));
  assert.equal(paths.modelsPath, resolve("E:/shared-models"));
});

void test("an empty or whitespace-only variable is treated as unset", () => {
  const paths = resolvePaths(
    { AUTO_YOUTUBE_RAG_HOME: "   ", AUTO_YOUTUBE_RAG_MODELS_DIR: "" },
    homedir,
  );
  assert.equal(paths.home, resolve("C:/Users/fixture-user/.auto-youtube-rag"));
  assert.equal(
    paths.modelsPath,
    resolve("C:/Users/fixture-user/.auto-youtube-rag/models"),
  );
});

void test("returned paths are always absolute", () => {
  const paths = resolvePaths(
    { AUTO_YOUTUBE_RAG_HOME: "relative-home" },
    homedir,
  );
  assert.equal(paths.home, resolve("relative-home"));
});
