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
  assert.match(rootReadme, /discovery-roadmap/i);
  assert.match(rootReadme, /docs\/comparison-controls\//);
  assert.match(rootReadme, /openfor/i);
});

test("comparison control docs are present for OpenFor.co", () => {
  assert.equal(existsSync(new URL("../docs/comparison-controls/README.md", import.meta.url)), true);
  assert.equal(
    existsSync(new URL("../docs/comparison-controls/2026-05-19-openfor-scorecard.md", import.meta.url)),
    true
  );
  assert.equal(
    existsSync(
      new URL("../docs/comparison-controls/2026-05-19-openfor-identity-overview.md", import.meta.url)
    ),
    true
  );
  assert.equal(
    existsSync(
      new URL(
        "../docs/comparison-controls/2026-05-19-openfor-discovery-grounding-overview.md",
        import.meta.url
      )
    ),
    true
  );
  assert.equal(
    existsSync(
      new URL("../docs/comparison-controls/2026-05-19-openfor-improvement-snapshot.md", import.meta.url)
    ),
    true
  );

  const guide = read("docs/comparison-controls/README.md");
  const scorecard = read("docs/comparison-controls/2026-05-19-openfor-scorecard.md");
  const identity = read("docs/comparison-controls/2026-05-19-openfor-identity-overview.md");
  const grounding = read("docs/comparison-controls/2026-05-19-openfor-discovery-grounding-overview.md");
  const improvements = read("docs/comparison-controls/2026-05-19-openfor-improvement-snapshot.md");

  assert.match(guide, /# Comparison Controls/);
  assert.match(guide, /OpenFor\.co/i);
  assert.match(scorecard, /# OpenFor\.co Comparison Scorecard/);
  assert.match(scorecard, /Summary Dashboard/i);
  assert.match(scorecard, /Identity Surface Score/i);
  assert.match(scorecard, /Broad Discovery Score/i);
  assert.match(scorecard, /Branded Grounding Score/i);
  assert.match(scorecard, /Intent Fit Score/i);
  assert.match(scorecard, /Improvement Readiness Score/i);
  assert.match(identity, /# OpenFor\.co Identity Overview/);
  assert.match(identity, /Erdinc Ekinci/i);
  assert.match(identity, /Tokyo/i);
  assert.match(grounding, /# OpenFor\.co Discovery And Grounding Overview/);
  assert.match(grounding, /Exa answer API/i);
  assert.match(grounding, /partial branded grounding/i);
  assert.match(improvements, /# OpenFor\.co Improvement Snapshot/);
  assert.match(improvements, /direct founder-view summaries/i);
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

test("scorecard summary includes the AEO/GEO comparison block", () => {
  const summary = read("docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.md");
  assert.match(summary, /## AEO\/GEO Comparison/i);
  assert.match(summary, /Development AEO\/GEO/i);
  assert.match(summary, /Production AEO\/GEO/i);
  assert.match(summary, /Concept Alignment/i);
  assert.match(summary, /Entity Recognition/i);
  assert.match(summary, /Founder Recognition/i);
  assert.match(summary, /Authority Framing/i);
  assert.match(summary, /Reference Quality|Citation Quality/i);
});

test("discovery roadmap turns current evidence into prioritized actions", () => {
  assert.equal(
    existsSync(new URL("../docs/scorecards/2026-05-08-wpatent-discovery-roadmap.md", import.meta.url)),
    true
  );

  const roadmap = read("docs/scorecards/2026-05-08-wpatent-discovery-roadmap.md");
  for (const fragment of [
    "# W&Patent Discovery Improvement Roadmap",
    "Current Evidence Snapshot",
    "Priority Workstreams",
    "public-site simulation",
    "external discovery evidence",
    "trust chain for websites",
    "0/10",
    "Andrew Leung",
    "Validation",
    "Recommended Build Order"
  ]) {
    assert.match(roadmap, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
});

test("scorecard worksheet seeds the evidence model", () => {
  assert.equal(
    existsSync(new URL("../docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.csv", import.meta.url)),
    true
  );

  const worksheet = read("docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.csv");
  for (const fragment of [
    "Metric,Category,Weight,Before,After,Source,Status,Notes",
    "Canonical coverage of core trust pages",
    "Trust Chain explainer publicly indexed",
    "Andrew to W&Patent linkage visible on core pages",
    "Perplexity cites wpatent.com on target prompts",
    "Founder named in AI answer",
    "Average engagement time on trust-chain-explainer.htm",
    "Scorecard requests"
  ]) {
    assert.match(worksheet, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
});
