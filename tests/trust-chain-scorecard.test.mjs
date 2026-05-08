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

test("scorecard summary defines the four scoring categories and prompt workflow", () => {
  assert.equal(
    existsSync(new URL("../docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.md", import.meta.url)),
    true
  );

  const summary = read("docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.md");
  for (const fragment of [
    "# W&Patent Trust Chain Scorecard",
    "Summary Dashboard",
    "Trust Surface Score",
    "AI Visibility Score",
    "Authority Transfer Score",
    "Business Outcome Score",
    "Headline Signals",
    "Prompt Set",
    "Perplexity",
    "ChatGPT / AI Mode",
    "Update Workflow",
    "wpatent.com"
  ]) {
    assert.match(summary, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
});
