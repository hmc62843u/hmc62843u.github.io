import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

function read(relativePath) {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("proof flow MVP scaffolds the workspace, templates, and README", () => {
  assert.equal(existsSync(new URL("../data/proof-flow/workspace.json", import.meta.url)), true);
  assert.equal(existsSync(new URL("../docs/proof-flow/README.md", import.meta.url)), true);
  assert.equal(existsSync(new URL("../templates/proof-flow/case-note.md", import.meta.url)), true);
  assert.equal(existsSync(new URL("../templates/proof-flow/founder-memo.md", import.meta.url)), true);

  const workspace = JSON.parse(read("data/proof-flow/workspace.json"));
  assert.deepEqual(Object.keys(workspace), [
    "version",
    "tasks",
    "assets",
    "distributions",
    "feedback"
  ]);
  assert.deepEqual(workspace.tasks, []);
  assert.deepEqual(workspace.assets, []);
  assert.deepEqual(workspace.distributions, []);
  assert.deepEqual(workspace.feedback, []);

  const readme = read("docs/proof-flow/README.md");
  assert.match(readme, /Proof Flow/i);
  assert.match(readme, /human-in-the-loop/i);
  assert.match(readme, /create-proof-task/i);

  const caseNote = read("templates/proof-flow/case-note.md");
  const founderMemo = read("templates/proof-flow/founder-memo.md");
  assert.match(caseNote, /\{\{title\}\}/);
  assert.match(caseNote, /\{\{claim\}\}/);
  assert.match(founderMemo, /\{\{title\}\}/);
  assert.match(founderMemo, /\{\{claim\}\}/);
});
