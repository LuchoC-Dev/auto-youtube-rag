import assert from "node:assert/strict";
import { test } from "node:test";

import { DomainValidationError } from "../../../src/domain/indexing/domain-error.js";
import {
  DocumentId,
  KnowledgeUnitId,
  PackageRef,
  SearchFragmentId,
  SourceName,
  SyncId,
  VideoId,
} from "../../../src/domain/indexing/identifiers.js";

function assertInvalid(
  createValue: () => unknown,
  field: string,
  code: "INVALID_IDENTIFIER" | "INVALID_PACKAGE_REF" = "INVALID_IDENTIFIER",
): void {
  assert.throws(createValue, (error: unknown) => {
    assert.ok(error instanceof DomainValidationError);
    assert.equal(error.code, code);
    assert.equal(error.field, field);
    return true;
  });
}

void test("creates comparable and serializable source and video identifiers", () => {
  const source = SourceName.create("auto-design");
  const sameSource = SourceName.create("auto-design");
  const otherSource = SourceName.create("catalog_design.v2");
  const video = VideoId.create("dQw4w9WgXcQ");

  assert.equal(source.value, "auto-design");
  assert.equal(source.toString(), "auto-design");
  assert.equal(source.toJSON(), "auto-design");
  assert.equal(source.equals(sameSource), true);
  assert.equal(source.equals(otherSource), false);
  assert.equal(video.toJSON(), "dQw4w9WgXcQ");
});

void test("rejects empty, whitespace and ambiguous component separators", () => {
  for (const value of [
    "",
    "   ",
    " auto-design",
    "auto design",
    "auto:design",
  ]) {
    assertInvalid(() => SourceName.create(value), "sourceName");
  }

  for (const value of ["", "video id", "video:id", "video/id", "video.id"]) {
    assertInvalid(() => VideoId.create(value), "videoId");
  }
});

void test("requires explicit namespaces and non-empty internal id segments", () => {
  const document = DocumentId.create(
    "document:auto-design:dQw4w9WgXcQ:context",
  );
  const unit = KnowledgeUnitId.create("unit:document-hash:section-01");
  const fragment = SearchFragmentId.create("fragment:unit-hash:0001");
  const sync = SyncId.create("sync:01J5J8Y7N8G4X2W3Z6Q9R0T1AB");

  assert.equal(document.toJSON(), "document:auto-design:dQw4w9WgXcQ:context");
  assert.equal(unit.toJSON(), "unit:document-hash:section-01");
  assert.equal(fragment.toJSON(), "fragment:unit-hash:0001");
  assert.equal(sync.toJSON(), "sync:01J5J8Y7N8G4X2W3Z6Q9R0T1AB");

  assertInvalid(() => DocumentId.create("unit:wrong-prefix"), "documentId");
  assertInvalid(
    () => KnowledgeUnitId.create("unit::section"),
    "knowledgeUnitId",
  );
  assertInvalid(
    () => SearchFragmentId.create("fragment:unit hash:1"),
    "searchFragmentId",
  );
  assertInvalid(() => SyncId.create("sync:"), "syncId");
});

void test("keeps RFC 3986 unreserved characters at internal segment boundaries", () => {
  const document = DocumentId.create(
    "document:auto-design:_DHiyzRN4gY:context",
  );
  const unit = KnowledgeUnitId.create("unit:auto-design:trailing-:context");

  assert.equal(document.value, "document:auto-design:_DHiyzRN4gY:context");
  assert.equal(unit.value, "unit:auto-design:trailing-:context");
});

void test("serializes and parses package references without delimiter ambiguity", () => {
  const reference = PackageRef.create(
    SourceName.create("auto-design"),
    VideoId.create("dQw4w9WgXcQ"),
  );
  const parsed = PackageRef.parse(reference.serialize());

  assert.equal(reference.serialize(), "auto-design:dQw4w9WgXcQ");
  assert.equal(reference.toString(), "auto-design:dQw4w9WgXcQ");
  assert.equal(reference.toJSON(), "auto-design:dQw4w9WgXcQ");
  assert.equal(parsed.equals(reference), true);
  assert.equal(parsed.sourceName.equals(reference.sourceName), true);
  assert.equal(parsed.videoId.equals(reference.videoId), true);

  for (const value of ["", "auto-design", "auto:video:extra", ":video"]) {
    assertInvalid(
      () => PackageRef.parse(value),
      "packageRef",
      "INVALID_PACKAGE_REF",
    );
  }
});
