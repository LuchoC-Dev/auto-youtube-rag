import assert from "node:assert/strict";
import { test } from "node:test";

import {
  EmbeddingAdapterError,
  TransformersEmbeddingGenerator,
  type EmbeddingRuntime,
  type EmbeddingSession,
  type EmbeddingRuntimeLoadOptions,
} from "../../../src/infrastructure/embeddings/transformers-embedding-generator.js";
import {
  activeModelProfile,
  type EmbeddingModelProfile,
} from "../../../src/infrastructure/embeddings/model-profile.js";

function vector(first = 3, second = 4, dimensions = 384): readonly number[] {
  const values = new Array<number>(dimensions).fill(0);
  values[0] = first;
  values[1] = second;
  return values;
}

class FakeSession implements EmbeddingSession {
  public readonly countedInputs: string[][] = [];
  public readonly embeddedInputs: string[][] = [];
  public disposeCalls = 0;

  public constructor(
    private readonly tokenCounter: (
      texts: readonly string[],
    ) => readonly number[] = (texts) => texts.map((text) => text.length + 2),
    private readonly embedder: (
      texts: readonly string[],
    ) => readonly (readonly number[] | Float32Array)[] = (texts) =>
      texts.map(() => vector()),
  ) {}

  public countTokens(texts: readonly string[]): Promise<readonly number[]> {
    this.countedInputs.push([...texts]);
    return Promise.resolve(this.tokenCounter(texts));
  }

  public embed(
    texts: readonly string[],
  ): Promise<readonly (readonly number[] | Float32Array)[]> {
    this.embeddedInputs.push([...texts]);
    return Promise.resolve(this.embedder(texts));
  }

  public dispose(): Promise<void> {
    this.disposeCalls += 1;
    return Promise.resolve();
  }
}

class FakeRuntime implements EmbeddingRuntime {
  public readonly loadOptions: EmbeddingRuntimeLoadOptions[] = [];

  public constructor(
    public readonly session: EmbeddingSession = new FakeSession(),
    private readonly loadError: Error | null = null,
  ) {}

  public load(options: EmbeddingRuntimeLoadOptions): Promise<EmbeddingSession> {
    this.loadOptions.push(options);
    return this.loadError === null
      ? Promise.resolve(this.session)
      : Promise.reject(this.loadError);
  }
}

async function expectCode(
  action: Promise<unknown>,
  code:
    | "INVALID_INPUT"
    | "INVALID_BATCH_SIZE"
    | "MODEL_LOAD_FAILED"
    | "TOKEN_COUNT_MISMATCH"
    | "INVALID_TOKEN_COUNT"
    | "INPUT_TOO_LONG"
    | "EMBEDDING_COUNT_MISMATCH"
    | "INVALID_VECTOR_DIMENSIONS"
    | "NON_FINITE_VECTOR"
    | "ZERO_NORM_VECTOR",
): Promise<void> {
  await assert.rejects(action, (error: unknown) => {
    assert.ok(error instanceof EmbeddingAdapterError);
    assert.equal(error.code, code);
    return true;
  });
}

void test("describes the approved E5 model without loading it", async () => {
  const runtime = new FakeRuntime();
  const generator = new TransformersEmbeddingGenerator({
    runtime,
    cacheDir: "C:/models",
    batchSize: 2,
  });

  assert.deepEqual(await generator.describe(), {
    key: "e5-small",
    version: "Xenova/multilingual-e5-small@main:q8",
    dimensions: 384,
    maxInputTokens: 512,
  });
  assert.equal(runtime.loadOptions.length, 0);
});

void test("counts passage-prefixed inputs including adapter-owned tokens", async () => {
  const session = new FakeSession((texts) =>
    texts.map((text) => Array.from(text).length + 2),
  );
  const runtime = new FakeRuntime(session);
  const generator = new TransformersEmbeddingGenerator({
    runtime,
    cacheDir: "C:/models",
  });

  const counts = await generator.countTokens(["  Diseño visual  ", "color"]);

  assert.deepEqual(session.countedInputs, [
    ["passage: Diseño visual", "passage: color"],
  ]);
  assert.deepEqual(counts, [
    Array.from("passage: Diseño visual").length + 2,
    16,
  ]);
  assert.equal(runtime.loadOptions.length, 1);
  const loadOptions = runtime.loadOptions[0];
  assert.ok(loadOptions);
  assert.equal(loadOptions.localFilesOnly, true);
  assert.equal(loadOptions.dtype, "q8");
  assert.equal(loadOptions.cacheDir.endsWith("models"), true);
});

void test("embeds documents in batches and normalizes document and query vectors", async () => {
  const session = new FakeSession();
  const generator = new TransformersEmbeddingGenerator({
    runtime: new FakeRuntime(session),
    batchSize: 2,
    cacheDir: "C:/models",
  });
  const documents = ["uno", "dos", "tres", "cuatro", "cinco"];

  const embedded = await generator.embedDocuments(documents);
  const query = await generator.embedQuery("jerarquía visual");

  assert.deepEqual(session.embeddedInputs, [
    ["passage: uno", "passage: dos"],
    ["passage: tres", "passage: cuatro"],
    ["passage: cinco"],
    ["query: jerarquía visual"],
  ]);
  assert.equal(embedded.length, 5);
  assert.equal(Object.isFrozen(embedded), true);
  for (const result of [...embedded, query]) {
    assert.ok(result instanceof Float32Array);
    assert.equal(result.length, 384);
    assert.ok(Math.abs((result[0] ?? 0) - 0.6) < 1e-6);
    assert.ok(Math.abs((result[1] ?? 0) - 0.8) < 1e-6);
    const norm = Math.hypot(...result);
    assert.ok(Math.abs(norm - 1) < 1e-6);
  }
});

void test("rejects invalid inputs, counters and vectors", async () => {
  assert.throws(
    () =>
      new TransformersEmbeddingGenerator({
        runtime: new FakeRuntime(),
        batchSize: 0,
        cacheDir: "C:/models",
      }),
    (error: unknown) => {
      assert.ok(error instanceof EmbeddingAdapterError);
      assert.equal(error.code, "INVALID_BATCH_SIZE");
      return true;
    },
  );

  await expectCode(
    new TransformersEmbeddingGenerator({
      runtime: new FakeRuntime(),
      cacheDir: "C:/models",
    }).embedQuery("   "),
    "INVALID_INPUT",
  );

  const mismatch = new FakeSession(() => []);
  await expectCode(
    new TransformersEmbeddingGenerator({
      runtime: new FakeRuntime(mismatch),
      cacheDir: "C:/models",
    }).countTokens(["texto"]),
    "TOKEN_COUNT_MISMATCH",
  );

  const invalidCount = new FakeSession((texts) => texts.map(() => Number.NaN));
  await expectCode(
    new TransformersEmbeddingGenerator({
      runtime: new FakeRuntime(invalidCount),
      cacheDir: "C:/models",
    }).countTokens(["texto"]),
    "INVALID_TOKEN_COUNT",
  );

  const tooLong = new FakeSession((texts) => texts.map(() => 513));
  await expectCode(
    new TransformersEmbeddingGenerator({
      runtime: new FakeRuntime(tooLong),
      cacheDir: "C:/models",
    }).embedDocuments(["texto"]),
    "INPUT_TOO_LONG",
  );

  const wrongCount = new FakeSession(undefined, () => []);
  await expectCode(
    new TransformersEmbeddingGenerator({
      runtime: new FakeRuntime(wrongCount),
      cacheDir: "C:/models",
    }).embedDocuments(["texto"]),
    "EMBEDDING_COUNT_MISMATCH",
  );

  const wrongDimensions = new FakeSession(undefined, (texts) =>
    texts.map(() => vector(3, 4, 383)),
  );
  await expectCode(
    new TransformersEmbeddingGenerator({
      runtime: new FakeRuntime(wrongDimensions),
      cacheDir: "C:/models",
    }).embedDocuments(["texto"]),
    "INVALID_VECTOR_DIMENSIONS",
  );

  const nonFinite = new FakeSession(undefined, (texts) =>
    texts.map(() => vector(Number.NaN, 4)),
  );
  await expectCode(
    new TransformersEmbeddingGenerator({
      runtime: new FakeRuntime(nonFinite),
      cacheDir: "C:/models",
    }).embedDocuments(["texto"]),
    "NON_FINITE_VECTOR",
  );

  const zero = new FakeSession(undefined, (texts) =>
    texts.map(() => vector(0, 0)),
  );
  await expectCode(
    new TransformersEmbeddingGenerator({
      runtime: new FakeRuntime(zero),
      cacheDir: "C:/models",
    }).embedDocuments(["texto"]),
    "ZERO_NORM_VECTOR",
  );
});

void test("loads lazily, disposes once and explains a missing local model", async () => {
  const session = new FakeSession();
  const runtime = new FakeRuntime(session);
  const generator = new TransformersEmbeddingGenerator({
    runtime,
    cacheDir: "C:/models",
  });

  await Promise.all([
    generator.countTokens(["uno"]),
    generator.countTokens(["dos"]),
  ]);
  assert.equal(runtime.loadOptions.length, 1);
  await generator.dispose();
  await generator.dispose();
  assert.equal(session.disposeCalls, 1);

  const missing = new TransformersEmbeddingGenerator({
    runtime: new FakeRuntime(undefined, new Error("files absent")),
    cacheDir: "C:/models",
  });
  await assert.rejects(missing.countTokens(["texto"]), (error: unknown) => {
    assert.ok(error instanceof EmbeddingAdapterError);
    assert.equal(error.code, "MODEL_LOAD_FAILED");
    assert.match(error.message, /auto-youtube-rag models install/u);
    assert.equal(error.cause instanceof Error, true);
    return true;
  });
});

function noPrefixProfile(): EmbeddingModelProfile {
  return Object.freeze({
    ...activeModelProfile,
    inputPrefixes: null,
  });
}

function customPrefixProfile(): EmbeddingModelProfile {
  return Object.freeze({
    ...activeModelProfile,
    inputPrefixes: Object.freeze({ passage: "doc>> ", query: "q>> " }),
  });
}

void test("sends raw text to the runtime for a profile without prefixes", async () => {
  const session = new FakeSession();
  const generator = new TransformersEmbeddingGenerator({
    runtime: new FakeRuntime(session),
    cacheDir: "C:/models",
    profile: noPrefixProfile(),
  });

  await generator.embedDocuments(["uno", "dos"]);
  await generator.embedQuery("tres");

  assert.deepEqual(session.embeddedInputs, [["uno"], ["dos"], ["tres"]]);
});

void test("applies a profile's own prefixes verbatim, distinct from E5's", async () => {
  const session = new FakeSession();
  const generator = new TransformersEmbeddingGenerator({
    runtime: new FakeRuntime(session),
    cacheDir: "C:/models",
    profile: customPrefixProfile(),
  });

  await generator.embedDocuments(["uno"]);
  await generator.embedQuery("dos");

  assert.deepEqual(session.embeddedInputs, [["doc>> uno"], ["q>> dos"]]);
});

void test("counts tokens on exactly the same text embedDocuments submits", async () => {
  const noPrefixSession = new FakeSession();
  const noPrefixGenerator = new TransformersEmbeddingGenerator({
    runtime: new FakeRuntime(noPrefixSession),
    cacheDir: "C:/models",
    profile: noPrefixProfile(),
  });

  await noPrefixGenerator.countTokens(["uno", "dos"]);
  await noPrefixGenerator.embedDocuments(["uno", "dos"]);

  assert.deepEqual(noPrefixSession.countedInputs[0], ["uno", "dos"]);
  assert.deepEqual(noPrefixSession.embeddedInputs.flat(), ["uno", "dos"]);
  assert.deepEqual(
    noPrefixSession.countedInputs[0],
    noPrefixSession.embeddedInputs.flat(),
  );

  const activeSession = new FakeSession();
  const activeGenerator = new TransformersEmbeddingGenerator({
    runtime: new FakeRuntime(activeSession),
    cacheDir: "C:/models",
  });

  await activeGenerator.countTokens(["uno"]);
  await activeGenerator.embedDocuments(["uno"]);

  assert.deepEqual(activeSession.countedInputs[0], ["passage: uno"]);
  assert.deepEqual(activeSession.embeddedInputs.flat(), ["passage: uno"]);
});
