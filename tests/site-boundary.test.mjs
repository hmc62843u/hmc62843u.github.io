import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";

test("site repo no longer owns the founder-discovery skill bundle", () => {
  assert.equal(
    existsSync(
      new URL("../.agents/skills/founder-led-discovery-spine/README.md", import.meta.url)
    ),
    false
  );
  assert.equal(
    existsSync(
      new URL(
        "../.agents/skills/founder-led-discovery-spine/profiles/wpatent-proof-prompts.json",
        import.meta.url
      )
    ),
    false
  );
});

test("site repo no longer owns the proof-flow docs, data, or scripts", () => {
  for (const relativePath of [
    "../docs/proof-flow/README.md",
    "../docs/proof-flow/mixed-mode.md",
    "../data/proof-flow/workspace.json",
    "../data/proof-flow/community-workspace.json",
    "../scripts/apply-proof-sync.mjs",
    "../scripts/approve-proof-asset.mjs",
    "../scripts/build-proof-packet.mjs",
    "../scripts/create-proof-task.mjs",
    "../scripts/export-proof-sync.mjs",
    "../scripts/import-proof-feedback.mjs",
    "../scripts/record-proof-feedback.mjs",
    "../scripts/lib/proof-flow.js",
    "../tests/proof-flow.test.mjs",
    "../tests/proof-flow-mixed-mode.test.mjs"
  ]) {
    assert.equal(existsSync(new URL(relativePath, import.meta.url)), false);
  }
});
