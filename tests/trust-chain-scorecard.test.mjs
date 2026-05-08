import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

function read(relativePath) {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("scorecard docs folder has a maintenance guide", () => {
  assert.equal(existsSync(new URL("../docs/scorecards/README.md", import.meta.url)), true);

  const guide = read("docs/scorecards/README.md");
  assert.match(guide, /# Scorecards/);
  assert.match(guide, /Trust Chain scorecard/i);
  assert.match(guide, /Update routine/i);
  assert.match(guide, /npm test/i);
});

test("root README points to scorecard assets", () => {
  const rootReadme = read("README.md");
  assert.match(rootReadme, /docs\/scorecards\//);
  assert.match(rootReadme, /trust-chain-scorecard/i);
});
