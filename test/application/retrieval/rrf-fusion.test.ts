import assert from "node:assert/strict";
import { test } from "node:test";

import { SearchFragmentId } from "../../../src/domain/indexing/identifiers.js";
import {
  FusionError,
  createRrfFusion,
  defaultRrfOptions,
} from "../../../src/application/retrieval/rrf-fusion.js";
import type { RankedHit } from "../../../src/application/retrieval/retrieval-results.js";

function fragment(name: string): SearchFragmentId {
  return SearchFragmentId.create(`fragment:auto-design:video:${name}`);
}

/** Builds a dense ranking from an ordered list of fragment names. */
function ranking(...names: readonly string[]): readonly RankedHit[] {
  return names.map((name, index) => ({
    fragmentId: fragment(name),
    rank: index + 1,
    rawScore: -1 * (index + 1),
  }));
}

function names(hits: readonly { readonly fragmentId: SearchFragmentId }[]) {
  return hits.map((hit) => hit.fragmentId.value.split(":").at(-1));
}

void test("keeps hits that only one path found", () => {
  const fuse = createRrfFusion();

  const fused = fuse.fuse({
    textHits: ranking("only-text"),
    vectorHits: ranking("only-vector"),
  });

  assert.deepEqual(names(fused).sort(), ["only-text", "only-vector"]);
  assert.equal(fused.length, 2);
});

void test("ranks consensus above a single first place", () => {
  const fuse = createRrfFusion();

  const fused = fuse.fuse({
    textHits: ranking("a", "b", "c", "consensus"),
    vectorHits: ranking("consensus", "d"),
  });

  assert.equal(names(fused)[0], "consensus");

  const [consensus] = fused;

  assert.ok(consensus);
  assert.equal(consensus.textRank, 4);
  assert.equal(consensus.vectorRank, 1);
  assert.equal(
    consensus.fusedScore,
    1 / (defaultRrfOptions.k + 4) + 1 / (defaultRrfOptions.k + 1),
  );
});

void test("reports the originating rank of every path", () => {
  const fuse = createRrfFusion();

  const fused = fuse.fuse({
    textHits: ranking("text-only"),
    vectorHits: ranking("vector-only"),
  });
  const textOnly = fused.find((hit) =>
    hit.fragmentId.value.endsWith("text-only"),
  );
  const vectorOnly = fused.find((hit) =>
    hit.fragmentId.value.endsWith("vector-only"),
  );

  assert.ok(textOnly);
  assert.ok(vectorOnly);
  assert.equal(textOnly.textRank, 1);
  assert.equal(textOnly.vectorRank, null);
  assert.equal(vectorOnly.textRank, null);
  assert.equal(vectorOnly.vectorRank, 1);
});

void test("honours asymmetric weights", () => {
  const textHeavy = createRrfFusion({ weightText: 3, weightVector: 1 });

  const fused = textHeavy.fuse({
    textHits: ranking("lexical"),
    vectorHits: ranking("semantic"),
  });

  const [lexical] = fused;

  assert.ok(lexical);
  assert.equal(names(fused)[0], "lexical");
  assert.equal(lexical.fusedScore, 3 / (defaultRrfOptions.k + 1));
});

void test("breaks ties deterministically and ignores raw scores", () => {
  const fuse = createRrfFusion();
  const tied = {
    textHits: ranking("zebra", "alpha"),
    vectorHits: [],
  };

  const first = fuse.fuse(tied);
  const second = fuse.fuse(tied);

  assert.deepEqual(names(first), names(second));

  const inflated = fuse.fuse({
    textHits: [
      { fragmentId: fragment("beta"), rank: 1, rawScore: -999 },
      { fragmentId: fragment("alpha"), rank: 1, rawScore: -0.001 },
    ],
    vectorHits: [],
  });

  assert.deepEqual(names(inflated), ["alpha", "beta"]);
});

void test("collapses a fragment repeated inside one ranking", () => {
  const fuse = createRrfFusion();

  const fused = fuse.fuse({
    textHits: [
      { fragmentId: fragment("dup"), rank: 3, rawScore: -3 },
      { fragmentId: fragment("dup"), rank: 1, rawScore: -1 },
    ],
    vectorHits: [],
  });

  const [deduplicated] = fused;

  assert.equal(fused.length, 1);
  assert.ok(deduplicated);
  assert.equal(deduplicated.textRank, 1);
});

void test("returns nothing when both paths are empty", () => {
  assert.deepEqual(
    createRrfFusion().fuse({ textHits: [], vectorHits: [] }),
    [],
  );
});

void test("rejects invalid options and malformed ranks", () => {
  for (const options of [
    { k: 0 },
    { k: -1 },
    { k: Number.NaN },
    { weightText: 0 },
    { weightVector: -2 },
    { weightVector: Number.POSITIVE_INFINITY },
  ]) {
    assert.throws(
      () => createRrfFusion(options),
      (error: unknown) => {
        assert.ok(error instanceof FusionError);
        assert.equal(error.code, "INVALID_FUSION_OPTIONS");
        return true;
      },
    );
  }

  for (const rank of [0, -1, 1.5]) {
    assert.throws(
      () =>
        createRrfFusion().fuse({
          textHits: [{ fragmentId: fragment("bad"), rank, rawScore: 0 }],
          vectorHits: [],
        }),
      (error: unknown) => {
        assert.ok(error instanceof FusionError);
        assert.equal(error.code, "INVALID_RANK");
        return true;
      },
    );
  }
});
