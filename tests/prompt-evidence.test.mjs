import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import {
  buildRow,
  csvEscape,
  extractFirstWpatentCitation,
  normalizeCitations
} from "../scripts/lib/prompt-evidence.js";

function read(relativePath) {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("prompt evidence assets expose the fixed prompt set and raw CSV header", () => {
  assert.equal(existsSync(new URL("../docs/scorecards/prompts.txt", import.meta.url)), true);
  assert.equal(
    existsSync(new URL("../docs/scorecards/2026-05-08-wpatent-prompt-runs.csv", import.meta.url)),
    true
  );

  const prompts = read("docs/scorecards/prompts.txt");
  const csv = read("docs/scorecards/2026-05-08-wpatent-prompt-runs.csv");

  for (const fragment of [
    "patent strategy for startups",
    "startup defensibility through patents",
    "patent commercialization for founders",
    "entity authority for AI search"
  ]) {
    assert.match(prompts, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }

  assert.match(
    csv,
    /timestamp,system,prompt,answer_summary,wpatent_mentioned,wpatent_cited,cited_page,andrew_named,andrew_role_correct,positioning_aligned,citation_urls,notes/i
  );
});

test("W&Patent proof-prompt profile preserves broad, narrow, and control tiers", () => {
  assert.equal(
    existsSync(
      new URL(
        "../.agents/skills/founder-led-discovery-spine/profiles/wpatent-proof-prompts.json",
        import.meta.url
      )
    ),
    true
  );

  const profile = JSON.parse(
    read(".agents/skills/founder-led-discovery-spine/profiles/wpatent-proof-prompts.json")
  );

  assert.equal(profile.project, "W&Patent");
  assert.equal(profile.assets[0]?.asset_id, "asset-001");
  assert.ok(Array.isArray(profile.assets[0]?.tiers?.broad?.prompts));
  assert.ok(Array.isArray(profile.assets[0]?.tiers?.narrow?.prompts));
  assert.ok(Array.isArray(profile.assets[0]?.tiers?.identity_retrieval_control?.prompts));
  assert.match(
    profile.assets[0].tiers.identity_retrieval_control.prompts.join(" "),
    /W&Patent|Andrew Leung/i
  );
});

test("OpenFor comparison control preserves troubleshooting prompt tiers", () => {
  assert.equal(
    existsSync(
      new URL(
        "../.agents/skills/founder-led-discovery-spine/profiles/openfor-comparison-control.json",
        import.meta.url
      )
    ),
    true
  );

  const profile = JSON.parse(
    read(".agents/skills/founder-led-discovery-spine/profiles/openfor-comparison-control.json")
  );

  assert.equal(profile.project, "OpenFor.co");
  assert.equal(profile.founder, "Erdinc Ekinci");
  assert.ok(Array.isArray(profile.tiers?.broad?.prompts));
  assert.ok(Array.isArray(profile.tiers?.narrow?.prompts));
  assert.ok(Array.isArray(profile.tiers?.identity_retrieval_control?.prompts));
  assert.match(
    profile.tiers.identity_retrieval_control.prompts.join(" "),
    /OpenFor\.co|Erdinc Ekinci/i
  );
});

test("scorecards README documents the prompt evidence artifacts", () => {
  const readme = read("docs/scorecards/README.md");
  assert.match(readme, /prompts\.txt/i);
  assert.match(readme, /prompt-runs\.csv/i);
  assert.match(readme, /append/i);
});

test("scorecard docs describe production and development providers", () => {
  const readme = read("docs/scorecards/README.md");
  assert.match(readme, /perplexity.*production evidence source/i);
  assert.match(readme, /exa_answer.*production comparison source/i);
  assert.match(readme, /--include-exa/i);
  assert.match(readme, /--only-exa/i);
  assert.match(readme, /openai_web_search.*development/i);
  assert.match(readme, /opencode_dev.*development/i);
  assert.match(readme, /kilocode_dev.*development/i);
});

test("env file hygiene assets are documented", () => {
  assert.equal(existsSync(new URL("../.env.example", import.meta.url)), true);
  assert.equal(existsSync(new URL("../.gitignore", import.meta.url)), true);

  const example = read(".env.example");
  const ignore = read(".gitignore");
  const readme = read("docs/scorecards/README.md");

  assert.match(example, /EXA_API_KEY=/);
  assert.match(example, /PERPLEXITY_API_KEY=/);
  assert.match(example, /OPENAI_API_KEY=/);
  assert.match(ignore, /^\.env$/m);
  assert.match(ignore, /^\.env\.local$/m);
  assert.match(ignore, /^\.env\.\*$/m);
  assert.match(ignore, /^!\.env\.example$/m);
  assert.match(readme, /--env-file=.env\.local/i);
  assert.match(readme, /--env-file-if-exists=.env\.local/i);
});

test("normalization helpers identify W&Patent and Andrew signals", () => {
  const citations = normalizeCitations([
    "https://wpatent.com/trust-chain-explainer.htm",
    "https://example.com/reference"
  ]);

  assert.deepEqual(citations, [
    "https://wpatent.com/trust-chain-explainer.htm",
    "https://example.com/reference"
  ]);
  assert.equal(
    extractFirstWpatentCitation(citations),
    "https://wpatent.com/trust-chain-explainer.htm"
  );

  const row = buildRow({
    timestamp: "2026-05-08T00:00:00.000Z",
    system: "perplexity",
    prompt: "trust chain for websites",
    answerText:
      "Andrew Leung explains how W&Patent uses the Trust Chain for founder-led authority.",
    citations
  });

  assert.equal(row.timestamp, "2026-05-08T00:00:00.000Z");
  assert.equal(row.system, "perplexity");
  assert.equal(row.wpatent_mentioned, "yes");
  assert.equal(row.wpatent_cited, "yes");
  assert.equal(row.cited_page, "https://wpatent.com/trust-chain-explainer.htm");
  assert.equal(row.andrew_named, "yes");
  assert.equal(row.andrew_role_correct, "manual");
  assert.equal(row.positioning_aligned, "manual");
  assert.equal(
    row.citation_urls,
    "https://wpatent.com/trust-chain-explainer.htm|https://example.com/reference"
  );
});

test("csvEscape quotes commas and quotes safely", () => {
  assert.equal(csvEscape("simple"), "simple");
  assert.equal(csvEscape("alpha,beta"), "\"alpha,beta\"");
  assert.equal(csvEscape("say \"hello\""), "\"say \"\"hello\"\"\"");
});

test("runner script documents required APIs and append-only output", () => {
  assert.equal(existsSync(new URL("../scripts/run-prompt-evidence.mjs", import.meta.url)), true);

  const runner = read("scripts/run-prompt-evidence.mjs");
  for (const fragment of [
    "PERPLEXITY_API_KEY",
    "OPENAI_API_KEY",
    "EXA_API_KEY",
    "docs/scorecards/prompts.txt",
    "docs/scorecards/2026-05-08-wpatent-prompt-runs.csv",
    "api.perplexity.ai",
    "api.openai.com",
    "api.exa.ai",
    "appendFileSync",
    "buildRow"
  ]) {
    assert.match(runner, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
});

test("runner defaults to perplexity only and supports dev providers", () => {
  const runner = read("scripts/run-prompt-evidence.mjs");
  assert.match(runner, /--include-dev/);
  assert.match(runner, /--include-exa/);
  assert.match(runner, /--only-exa/);
  assert.match(runner, /perplexity/);
  assert.match(runner, /exa_answer/);
  assert.match(runner, /openai_web_search/);
  assert.match(runner, /opencode_dev/);
  assert.match(runner, /kilocode_dev/);
});

test("runner includes CLI-based dev provider handling", () => {
  const runner = read("scripts/run-prompt-evidence.mjs");
  assert.match(runner, /execFile/);
  assert.match(runner, /opencode/);
  assert.match(runner, /kilocode/);
});
