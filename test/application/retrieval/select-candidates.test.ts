import assert from "node:assert/strict";
import { test } from "node:test";

import {
  PackageRef,
  SourceName,
  VideoId,
} from "../../../src/domain/indexing/identifiers.js";
import { RetrievalLimits } from "../../../src/domain/retrieval/retrieval-query.js";
import { selectCandidates } from "../../../src/application/retrieval/select-candidates.js";
import type { RetrievalCandidate } from "../../../src/application/retrieval/retrieval-results.js";
import { fakeProvenance } from "../../fakes/fake-provenance.js";

function candidate(input: {
  readonly name: string;
  readonly videoId: string;
  readonly unitId: string;
  readonly score: number;
}): RetrievalCandidate {
  const packageRef = PackageRef.create(
    SourceName.create("auto-design"),
    VideoId.create(input.videoId),
  );
  const provenance = fakeProvenance({
    name: input.name,
    packageRef,
    unitId: input.unitId,
  });

  return {
    fragmentId: provenance.fragmentId,
    unitId: provenance.unitId,
    packageRef,
    fusedScore: input.score,
    textRank: 1,
    vectorRank: 1,
    provenance,
  };
}

void test("keeps only the best fragment per unit", () => {
  const selected = selectCandidates({
    candidates: [
      candidate({
        name: "best",
        videoId: "vid_1",
        unitId: "unit:shared",
        score: 0.9,
      }),
      candidate({
        name: "worse",
        videoId: "vid_1",
        unitId: "unit:shared",
        score: 0.1,
      }),
    ],
    limits: RetrievalLimits.default(),
  });

  assert.equal(selected.length, 1);
  assert.equal(selected[0]?.provenance.title, "best");
});

void test("caps how many candidates one video may contribute", () => {
  const candidates = Array.from({ length: 6 }, (_value, index) =>
    candidate({
      name: `unit-${String(index)}`,
      videoId: "vid_dominant",
      unitId: `unit:${String(index)}`,
      score: 1 - index * 0.01,
    }),
  );

  const selected = selectCandidates({
    candidates,
    limits: RetrievalLimits.create({ maxPerVideo: 2 }),
  });

  assert.equal(selected.length, 2);
  assert.deepEqual(
    selected.map((entry) => entry.provenance.title),
    ["unit-0", "unit-1"],
  );
});

void test("lets distinct videos each contribute up to the per-video limit", () => {
  const selected = selectCandidates({
    candidates: [
      candidate({ name: "a", videoId: "vid_1", unitId: "unit:a", score: 0.9 }),
      candidate({ name: "b", videoId: "vid_2", unitId: "unit:b", score: 0.8 }),
      candidate({ name: "c", videoId: "vid_3", unitId: "unit:c", score: 0.7 }),
    ],
    limits: RetrievalLimits.create({ maxPerVideo: 1 }),
  });

  assert.equal(selected.length, 3);
});

void test("truncates to the fused results limit after selection", () => {
  const candidates = Array.from({ length: 10 }, (_value, index) =>
    candidate({
      name: `unit-${String(index)}`,
      videoId: `vid_${String(index)}`,
      unitId: `unit:${String(index)}`,
      score: 1 - index * 0.01,
    }),
  );

  const selected = selectCandidates({
    candidates,
    limits: RetrievalLimits.create({ fusedResults: 3 }),
  });

  assert.equal(selected.length, 3);
  assert.deepEqual(
    selected.map((entry) => entry.provenance.title),
    ["unit-0", "unit-1", "unit-2"],
  );
});

void test("preserves the incoming score order", () => {
  const selected = selectCandidates({
    candidates: [
      candidate({
        name: "second",
        videoId: "vid_1",
        unitId: "unit:a",
        score: 0.5,
      }),
      candidate({
        name: "first",
        videoId: "vid_2",
        unitId: "unit:b",
        score: 0.9,
      }),
    ],
    limits: RetrievalLimits.default(),
  });

  assert.deepEqual(
    selected.map((entry) => entry.provenance.title),
    ["second", "first"],
  );
});

void test("returns nothing for an empty input", () => {
  assert.deepEqual(
    selectCandidates({ candidates: [], limits: RetrievalLimits.default() }),
    [],
  );
});
