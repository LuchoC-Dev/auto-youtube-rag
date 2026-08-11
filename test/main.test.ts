import assert from "node:assert/strict";
import { test } from "node:test";

import { applicationName } from "../src/main.js";

void test("the scaffold exposes the approved application name", () => {
  assert.equal(applicationName, "auto-youtube-rag");
});
