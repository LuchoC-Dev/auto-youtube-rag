import type { IndexedPackageChange } from "../../../src/application/indexing/indexed-package-change.js";
import type {
  ContextDocumentSnapshot,
  ManifestSnapshot,
  PackageDocumentSnapshot,
  PackageSnapshot,
  RulesDocumentSnapshot,
  SelectedMetadataSnapshot,
} from "../../../src/application/indexing/package-snapshots.js";
import type { EmbeddingRecord } from "../../../src/domain/indexing/embedding-record.js";
import {
  PackageRef,
  SourceName,
  SyncId,
  VideoId,
} from "../../../src/domain/indexing/identifiers.js";
import type { KnowledgeUnit } from "../../../src/domain/indexing/knowledge-unit.js";
import type { SearchFragment } from "../../../src/domain/indexing/search-fragment.js";
import type { SourceDocument } from "../../../src/domain/indexing/source-document.js";
import type { VideoPackage } from "../../../src/domain/indexing/video-package.js";

const ref = PackageRef.create(
  SourceName.create("auto-design"),
  VideoId.create("dQw4w9WgXcQ"),
);
const hash = "a".repeat(64);

const metadata = {
  kind: "metadata",
  videoId: ref.videoId,
  title: "Design principles",
  creator: "Design channel",
  canonicalUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  durationSeconds: 125,
  publishedAt: "2026-08-10T00:00:00.000Z",
  sourceLanguage: "en",
  contextLanguage: "es",
  tags: ["design"],
  categories: ["Education"],
  visualProfile: "visual-dependent",
  visualCoverage: "adaptive sampling inspected",
  limitations: ["Automatic captions only."],
  visualEvidence: ["visual/frames/contact-sheet.jpg"],
} as const satisfies SelectedMetadataSnapshot;

const context = {
  kind: "context",
  frontmatter: {
    title: "Design principles",
    visual_profile: "visual-dependent",
  },
  preamble: "",
  sections: [
    {
      kind: "context_section",
      title: "Hierarchy",
      level: 2,
      ordinal: 0,
      headingPath: ["Hierarchy"],
      content: "Hierarchy guides attention.",
      timestamps: ["00:01:00-00:01:15"],
      visualEvidence: ["visual/frames/frame-001.jpg"],
      children: [],
    },
  ],
} as const satisfies ContextDocumentSnapshot;

const rules = {
  kind: "rules",
  schemaVersion: "1.0",
  coreThesis: "Hierarchy guides attention.",
  evidence: {
    limitations: ["Automatic captions only."],
    visualEvidence: ["visual/frames/contact-sheet.jpg"],
  },
  patterns: [
    {
      id: "visual_hierarchy",
      name: "Create visual hierarchy",
      principle: "Use contrast and scale.",
      problem: "Equal emphasis obscures priority.",
      visualEvidence: ["visual/frames/frame-001.jpg"],
      rules: ["Use one dominant element."],
      avoid: ["Giving every element equal weight."],
      acceptanceCriteria: ["The primary action is visually dominant."],
      sourceBasis: {
        direct: "Demonstrated at 00:01:00.",
        professionalExtension: null,
      },
    },
  ],
  agentWorkflow: ["Identify the primary action."],
} as const satisfies RulesDocumentSnapshot;

const packageSnapshot = {
  kind: "video_package",
  ref,
  slug: "design-principles-dQw4w9WgXcQ",
  relativePath: "videos/design-principles-dQw4w9WgXcQ",
  manifestStage: "complete",
  documents: [
    {
      kind: "context",
      relativePath: "deliverables/context.md",
      contentHash: hash,
      byteSize: 100,
      parserVersion: "context-v1",
      content: context,
    },
    {
      kind: "rules",
      relativePath: "deliverables/rules.json",
      contentHash: hash,
      byteSize: 100,
      parserVersion: "rules-v1",
      content: rules,
    },
    {
      kind: "metadata",
      relativePath: "source/metadata.json",
      contentHash: hash,
      byteSize: 100,
      parserVersion: "metadata-v1",
      content: metadata,
    },
  ],
} as const satisfies PackageSnapshot;

const manifest = {
  kind: "manifest",
  sourceName: ref.sourceName,
  contentHash: hash,
  videos: [
    {
      ref,
      slug: packageSnapshot.slug,
      sourceLanguage: "en",
      contextLanguage: "es",
      stage: "complete",
      resources: { context: true, structuredContent: "rules", metadata: true },
    },
  ],
  issues: [],
} as const satisfies ManifestSnapshot;

export function describeDocument(document: PackageDocumentSnapshot): string {
  switch (document.kind) {
    case "context":
      return document.content.sections.length.toString();
    case "rules":
      return document.content.patterns.length.toString();
    case "analysis":
      return document.content.topics.length.toString();
    case "metadata":
      return document.content.title ?? "untitled";
  }
}

export const indexedChange = {
  kind: "replace_package",
  syncId: SyncId.create("sync:01J5J8Y7N8G4X2W3Z6Q9R0T1AB"),
  packageHash: hash,
  indexedAt: "2026-08-11T12:00:00.000Z",
  videoPackage: null as unknown as VideoPackage,
  documents: [] as readonly SourceDocument[],
  units: [] as readonly KnowledgeUnit[],
  fragments: [] as readonly SearchFragment[],
  embeddings: [] as readonly EmbeddingRecord[],
} as const satisfies IndexedPackageChange;

export const contractExamples = { manifest, packageSnapshot, indexedChange };

function verifyReadonlyContracts(): void {
  // @ts-expect-error snapshots expose readonly collections
  manifest.videos = [];
  // @ts-expect-error atomic changes cannot replace their aggregate
  indexedChange.documents = [];
}

void verifyReadonlyContracts;
