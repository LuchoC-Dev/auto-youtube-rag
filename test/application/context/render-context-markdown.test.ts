import assert from "node:assert/strict";
import { test } from "node:test";

import { allocateBudget } from "../../../src/application/context/allocate-budget.js";
import { assignCitations } from "../../../src/application/context/assign-citations.js";
import type { ContextUnitBlock } from "../../../src/application/context/context-blocks.js";
import { renderContextMarkdown } from "../../../src/application/context/render-context-markdown.js";
import type { RetrievalWarning } from "../../../src/application/retrieval/retrieval-results.js";
import { ContextBudget } from "../../../src/domain/context/context-budget.js";
import {
  PackageRef,
  SourceName,
  VideoId,
} from "../../../src/domain/indexing/identifiers.js";
import type { KnowledgeUnitType } from "../../../src/domain/indexing/knowledge-unit.js";
import {
  fakeKnowledgeUnit,
  fakeUnitId,
} from "../../fakes/fake-knowledge-unit.js";

const packageRef = PackageRef.create(
  SourceName.create("auto-design"),
  VideoId.create("vid_1"),
);

function block(input: {
  readonly rawId: string;
  readonly unitType?: KnowledgeUnitType;
  readonly origin?: "candidate" | "ancestor";
  readonly headingPath?: readonly string[];
  readonly content?: string;
}): ContextUnitBlock {
  const unit = fakeKnowledgeUnit({ packageRef, rawId: input.rawId });
  const content = input.content ?? `${input.rawId} content`;

  return {
    unitId: fakeUnitId(packageRef, input.rawId),
    packageRef,
    unitType: input.unitType ?? "context_section",
    headingPath: input.headingPath ?? [input.rawId],
    title: input.rawId,
    content,
    contentHash: unit.contentHash,
    tokenCount: 10,
    origin: input.origin ?? "candidate",
    fusedScore: 1,
    depth: 0,
    documentKind: "context",
    documentRelativePath: "deliverables/context.md",
    videoTitle: "Video title",
    creator: "Test channel",
    canonicalUrl: null,
    language: "es",
    timestamps: [],
    visualEvidence: [],
  };
}

function render(
  blocks: readonly ContextUnitBlock[],
  overrides: {
    readonly maxTokens?: number;
    readonly sourceFilter?: readonly string[];
    readonly warnings?: readonly RetrievalWarning[];
  } = {},
) {
  const allocation = allocateBudget(blocks, overrides.maxTokens ?? 10_000);
  const citations = assignCitations(allocation.included);

  return renderContextMarkdown({
    query: "diseño brutalista",
    budget: ContextBudget.default(),
    allocation,
    citations,
    warnings: overrides.warnings ?? [],
    sourceFilter: overrides.sourceFilter ?? [],
  });
}

void test("includes the front matter fields", () => {
  const markdown = render([block({ rawId: "a" })]);

  assert.match(markdown, /^---\n/);
  assert.match(markdown, /schema_version: "1\.0"/);
  assert.match(markdown, /query: "diseño brutalista"/);
  assert.match(markdown, /depth: balanced/);
  assert.match(markdown, /estimated_tokens: 10/);
  assert.match(markdown, /sources_used: 1/);
});

void test("renders the six fixed sections in order", () => {
  const markdown = render([block({ rawId: "a" })]);
  const headings = [
    "# Context package",
    "## Query and scope",
    "## Highest-relevance context",
    "## Related rules and patterns",
    "## Additional relevant context",
    "## Coverage and limitations",
    "## Source registry",
  ];

  let cursor = -1;
  for (const heading of headings) {
    const index = markdown.indexOf(heading);
    assert.ok(index > cursor, `expected to find "${heading}" in order`);
    cursor = index;
  }
});

void test("renders a candidate block's content with its citation marker", () => {
  const markdown = render([
    block({ rawId: "a", headingPath: ["Método", "Brutalismo"] }),
  ]);

  assert.match(markdown, /### \[S01\] Método > Brutalismo/);
  assert.match(markdown, /a content/);
});

void test("binds each citation id to the heading of the block it labels", () => {
  // Regression for the 14 August cold run: the id used to trail its block,
  // which left it one blank line above the *next* heading. A consuming agent
  // read it as opening what followed and attributed citations to the wrong
  // unit, while every id still resolved against result.json — so no
  // mechanical check caught it.
  const markdown = render([
    block({ rawId: "first", headingPath: ["Primero"] }),
    block({ rawId: "second", headingPath: ["Segundo"] }),
  ]);

  const lines = markdown.split("\n");
  const headings = lines.filter((line) => line.startsWith("### "));
  assert.deepEqual(headings, ["### [S01] Primero", "### [S02] Segundo"]);

  // No citation id may stand alone: every one lives on a heading line.
  for (const line of lines) {
    if (!/\[S\d+\]/u.test(line)) continue;
    assert.ok(
      line.startsWith("### "),
      `citation id found outside a heading: ${line}`,
    );
  }

  // The second block's content must not sit between S01 and its own heading.
  assert.ok(
    markdown.indexOf("### [S02] Segundo") < markdown.indexOf("second content"),
  );
});

void test("places document/section and rule blocks in their dedicated sections", () => {
  const markdown = render([
    block({ rawId: "section", unitType: "context_section" }),
    block({ rawId: "rule", unitType: "rule_item" }),
  ]);

  const highest = markdown.indexOf("## Highest-relevance context");
  const rules = markdown.indexOf("## Related rules and patterns");
  const additional = markdown.indexOf("## Additional relevant context");

  assert.ok(markdown.indexOf("section content", highest) < rules);
  assert.ok(markdown.indexOf("rule content", rules) < additional);
});

void test("states no evidence for an empty section instead of leaving it blank", () => {
  const markdown = render([block({ rawId: "a", unitType: "rule_item" })]);
  const highest = markdown.indexOf("## Highest-relevance context");
  const rules = markdown.indexOf("## Related rules and patterns");

  assert.ok(
    markdown
      .slice(highest, rules)
      .includes("No evidence matched this section."),
  );
});

void test("reports omitted evidence and warnings under coverage and limitations", () => {
  const markdown = render(
    [
      block({ rawId: "a", content: "x".repeat(40) }),
      block({ rawId: "b", content: "y".repeat(40) }),
    ],
    {
      maxTokens: 10,
      warnings: [
        {
          code: "TEXT_SEARCH_UNAVAILABLE",
          path: "text",
          message: "The lexical search path failed.",
        },
      ],
    },
  );

  assert.match(markdown, /budget was exhausted/);
  assert.match(markdown, /The lexical search path failed\./);
});

void test("mentions an applied source filter in scope and coverage", () => {
  const markdown = render([block({ rawId: "a" })], {
    sourceFilter: ["auto-design"],
  });

  assert.match(markdown, /Sources restricted to: auto-design/);
  assert.match(markdown, /restricted to the requested source/);
});

void test("lists each distinct package once in the source registry", () => {
  const other = PackageRef.create(
    SourceName.create("auto-design"),
    VideoId.create("vid_2"),
  );
  const secondBlock: ContextUnitBlock = {
    ...block({ rawId: "b" }),
    packageRef: other,
    unitId: fakeUnitId(other, "b"),
  };

  const markdown = render([block({ rawId: "a" }), secondBlock]);
  const registry = markdown.slice(markdown.indexOf("## Source registry"));

  assert.match(registry, /auto-design \/ vid_1/);
  assert.match(registry, /auto-design \/ vid_2/);
});

void test("says nothing degraded when there is nothing to report", () => {
  const markdown = render([block({ rawId: "a" })]);

  assert.match(markdown, /No degradation or truncation occurred/);
});
