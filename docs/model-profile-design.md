# Design of point 4.5 — embedding model profile

## Problem

The `passage: ` and `query: ` prefixes are applied **always**, in two module
functions of `src/infrastructure/embeddings/e5-embedding-generator.ts`:

```ts
function passageInputs(texts: readonly string[]): readonly string[] {
  return Object.freeze(texts.map((text) => `passage: ${text}`));
}

function queryInput(text: string): string {
  return `query: ${text}`;
}
```

They are specific to the E5 family. With MiniLM, BGE or Jina they are not
neutral: the model literally embeds the words "passage" and "query" as content,
degrading quality **without producing any error**. Nothing fails, nothing warns;
the results simply get worse. The benchmark harness already accounts for this
with an `e5Prefixes: boolean` flag in its `ModelDefinition`
(`benchmarks/embeddings/run.ts:21`); the product does not.

`docs/install-design.md` → "Note: what it would take to support another model"
recorded it as the real work of "configurable model", above the dimension — which
is already generic end to end — and above reindexing when the model changes —
which already works through `unchanged()` in `sync-source.ts`.

The user set it as front number 1 on 14 August 2026.

## Scope

**In:** turning the model's identity and its prefix policy into explicit, single
data — a profile — that the embedding adapter and the installer consume instead
of hardcoding.

**Out:** changing the active model, adding a second model to the catalogue,
exposing model selection through the CLI or an environment variable, and making
two models coexist in the same database. The goal is for the product to **be
capable** of another model without degrading it silently, not to change it.
Changing model or dimension still requires explicit approval under the project's
invariants, and today it would trigger a complete reindex.

This point **must not reindex anything**. When it is finished, an
already-synchronised library must still answer `no_changes` on the next `sync`.
It is the point's most important acceptance criterion and the constraint that
determines Decision 3.

## Current state: where the model's identity lives today

It is scattered across three files, with `"Xenova/multilingual-e5-small"` written
literally in three different places:

| File                                   | What it defines                                                                   |
| -------------------------------------- | --------------------------------------------------------------------------------- |
| `embeddings/e5-embedding-generator.ts` | `modelDescriptor`, `modelRepository`, `modelRevision`, `modelDtype`, the prefixes |
| `embeddings/e5-model-installer.ts`     | `modelDirectory` (duplicated), imports the four constants above                   |
| `config/model-install-state.ts`        | `modelDirectory` (duplicated again) and `requiredModelFiles`                      |

`requiredModelFiles` — `config.json`, `tokenizer.json`, `tokenizer_config.json`,
`onnx/model_quantized.onnx` — is also model-specific: Jina, for example, needs a
different `model_file_name`, as the benchmark harness already knows
(`modelFileName?: string`).

## Decision 1 — a frozen `EmbeddingModelProfile`, single source

`src/infrastructure/embeddings/model-profile.ts` is born:

```ts
export interface EmbeddingInputPrefixes {
  readonly passage: string;
  readonly query: string;
}

export interface EmbeddingModelProfile {
  readonly key: string;
  readonly repository: string;
  readonly revision: string;
  readonly dtype: "q8";
  readonly dimensions: number;
  readonly maxInputTokens: number;
  /** `null` means "this model carries no prefixes", not "I have not decided
   * yet": it is the difference between E5 and MiniLM/BGE/Jina. */
  readonly inputPrefixes: EmbeddingInputPrefixes | null;
  /** Paths relative to `<modelsPath>/<repository>/` that the runtime needs in
   * order to load the model locally. */
  readonly requiredFiles: readonly string[];
}
```

The active profile, also in that module:

```ts
export const activeModelProfile: EmbeddingModelProfile = Object.freeze({
  key: "e5-small",
  repository: "Xenova/multilingual-e5-small",
  revision: "main",
  dtype: "q8",
  dimensions: 384,
  maxInputTokens: 512,
  inputPrefixes: Object.freeze({ passage: "passage: ", query: "query: " }),
  requiredFiles: Object.freeze([
    "config.json",
    "tokenizer.json",
    "tokenizer_config.json",
    "onnx/model_quantized.onnx",
  ]),
});
```

The prefixes include their trailing space. Today they are interpolated as
`` `passage: ${text}` ``, so the space is part of the literal; keeping it inside
the value prevents a future profile that does not want a space from having to
fight a fixed concatenation.

`model-profile.ts` **imports nothing**: not Transformers.js, not `node:fs`, not
another module of the project. It is data.

## Decision 2 — the model directory is derived, not declared

`modelDirectory` is exactly `profile.repository`, and today it is copied into two
files that can diverge from the generator without anything noticing. It is
removed from both: `e5-model-installer.ts` and `model-install-state.ts` receive
the profile and use `profile.repository`.

`model-install-state.ts` stops exporting the `requiredModelFiles` constant as a
module value and comes to receive the profile in its functions
(`measureModelFiles`, `readSourceState`, `describeModelState`, `readModelState`).
It is the file that changes the most signatures, and the one with the most
consumers (`doctor`, `models status`, the installer), so it goes in a block of its
own.

## Decision 3 — the prefix policy takes part in `version`, without reindexing today

This is the decision with the most consequences and the only one carrying real
risk.

`unchanged()` in `sync-source.ts` includes the active model's `key`, `version`
and `dimensions` in its criterion: changing any of the three invalidates every
package and the next `sync` reindexes. Today `version` is the literal
`"Xenova/multilingual-e5-small@main:q8"`.

The problem: if someone were to turn off the prefixes without changing model,
`key`, `version` and `dimensions` would remain identical, `unchanged()` would say
"no changes", and the library would serve old prefixed vectors against new
unprefixed queries. Silent, and worse than the original bug.

That is why `version` is **derived** from the profile, and the prefix policy
takes part in the derivation:

```ts
export function modelVersion(profile: EmbeddingModelProfile): string {
  const base = `${profile.repository}@${profile.revision}:${profile.dtype}`;
  return profile.inputPrefixes === null ? `${base}+noprefix` : base;
}
```

With the active profile this produces, character for character,
`"Xenova/multilingual-e5-small@main:q8"` — the same string as today. **No
existing database is invalidated and nothing is reindexed.** Any profile with a
different policy produces a different `version` and triggers the automatic
reindexing that already exists.

A test must pin that literal equality as a regression: if someone changes the
format of `modelVersion` unintentionally, they silently invalidate every
installed library.

The alternative — adding a `prefixPolicy` field to the port's
`EmbeddingModelDescriptor` and having `unchanged()` compare it — is discarded: it
forces a change to the application port, the `embeddings` table has no column in
which to persist it, and `version` is already exactly the place where the project
decided to encode "everything that makes two vectors incomparable" (revision and
quantisation already live there).

## Decision 4 — the adapter is renamed: it stops being "E5"

An `E5EmbeddingGenerator` that no longer knows anything about E5 is a name that
reintroduces the very confusion this point erases. It is renamed:

| Before                                       | After                                                            |
| -------------------------------------------- | ---------------------------------------------------------------- |
| `e5-embedding-generator.ts`                  | `transformers-embedding-generator.ts`                            |
| `E5EmbeddingGenerator`                       | `TransformersEmbeddingGenerator`                                 |
| `E5EmbeddingError` / `...ErrorCode`          | `EmbeddingAdapterError` / `...ErrorCode`                         |
| `E5EmbeddingSession` / `...Runtime`          | `EmbeddingSession` / `EmbeddingRuntime`                          |
| `E5RuntimeLoadOptions`                       | `EmbeddingRuntimeLoadOptions`                                    |
| `e5-model-installer.ts` / `E5ModelInstaller` | `transformers-model-installer.ts` / `TransformersModelInstaller` |
| `E5DownloadRuntime` / `E5DownloadOptions`    | `ModelDownloadRuntime` / `ModelDownloadOptions`                  |

It is mechanical but touches seven files across `src/` and `test/`, so it goes in
a block of its own, **after** the behaviour is already correct and tested.
Renaming first would mix noise with substance in the same diff.

The error codes **do not change**: `MODEL_LOAD_FAILED`, `INPUT_TOO_LONG`,
`MODEL_SOURCE_INVALID` and the rest are a public contract documented in
`cli-contract.md` and in `skill/SKILL.md`. What changes is the name of the class
carrying them, never the code's value.

`npm run test:embedding:smoke` is still called the same: that is the name of the
script, not of the adapter.

## Decision 5 — token counting still measures the already-prefixed text

The port already demands it explicitly:

> Counts each text exactly as `embedDocuments` will submit it to the model,
> including document prefixes and special tokens owned by the adapter.

With a profile without prefixes, `countTokens` measures the raw text, and the
`maxInputTokens` ceiling stops being spent on the prefix. That is correct and
intended: the limit exists for the text that actually enters the model. The
consequence — the fragmentation boundary shifts — is exactly why a change of
prefix policy must invalidate the vectors, which is what Decision 3 guarantees.

The rule that cannot be broken: **`countTokens` and `embedDocuments` must apply
the same prefix policy**. A test must verify that a profile without prefixes
produces the same text on both paths.

## Decision 6 — the profile is injected, with the active one as the default

Every constructor accepts `profile?: EmbeddingModelProfile` and falls back to
`activeModelProfile`. Neither `create-application.ts` nor `run-cli.ts` passes a
profile: they keep constructing with `{ cacheDir }` as they do today.

The parameter exists for the tests — being able to exercise a profile without
prefixes without touching the real model is precisely what is impossible today —
not to expose a configuration knob. No environment variable or CLI flag is added:
choosing a model requires approval and reindexing, and that is not this point.

## What does not change

- The active model, its dimension, its revision and its quantisation.
- The `version` persisted in `embeddings` (Decision 3).
- The public error codes and the shape of the JSON receipts.
- `models/.install.json`: it still stores `key`/`version`/`dimensions`.
- The `EmbeddingGenerator` port and `EmbeddingModelDescriptor`.
- The SQLite schema: zero migrations.
- `cli-contract.md`: no new command or flag.
- The benchmark harness: `benchmarks/` is left intact. Its `ModelDefinition` is
  the inspiration for this design, not a module to share; it lives outside the
  product build and depends on `tsx`.

## Risks

1. **Invalidating the library by accident.** If `modelVersion` does not return
   exactly the current literal, the next `sync` reindexes 51 videos with the real
   model. Mitigation: a regression test over the literal, and verifying
   `no_changes` in block AD's real validation.
2. **An incomplete rename.** An old import breaks the build, so the risk is
   visible, not silent: `npm run check` catches it.
3. **Desynchronising `countTokens` from `embedDocuments`.** Mitigation: an
   explicit test with a profile without prefixes (Decision 5).

## Documents to update on implementation

- `docs/decisions.md`: a new section "Model profile and prefix policy", closing
  the pending half of the note in `install-design.md`.
- `docs/install-design.md`: the note "what it would take to support another
  model" loses its second item; strike it through as was done with the silent
  degradation gap, do not delete it.
- `docs/build.md`: point 4.5.
- `docs/agent-handoff.md`: operational status, `src/` inventory and the priority
  order (point 1 becomes closed; point 2 becomes the next one).
- `skill/SKILL.md`: **only if something observable changes**. Nothing observable
  changes, so the expectation is not to touch it.

## Block plan

| Block | Content                                                                                           |
| ----- | ------------------------------------------------------------------------------------------------- |
| AA    | `model-profile.ts`: types, active profile, `modelVersion` and its tests                           |
| AB    | The generator consumes the profile and applies prefixes according to policy                       |
| AC    | Installation state and installer consume the profile; the `modelDirectory` duplicates are deleted |
| AD    | Adapter rename, real validation and documentation closure                                         |

Execution order: AA → AB → AC → AD, strictly sequential. AB and AC depend on AA;
AD is a mechanical rename that only makes sense with the behaviour already
closed.
