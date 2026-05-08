import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

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

test("scorecards README documents the prompt evidence artifacts", () => {
  const readme = read("docs/scorecards/README.md");
  assert.match(readme, /prompts\.txt/i);
  assert.match(readme, /prompt-runs\.csv/i);
  assert.match(readme, /append/i);
});
