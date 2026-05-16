import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import proofFlow from "../scripts/lib/proof-flow.js";

const { approveAsset, buildProofPacket, createProofTask, loadWorkspace, slugify } = proofFlow;

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

test("createProofTask appends a task and draft asset in memory", () => {
  const workspace = {
    version: 1,
    tasks: [],
    assets: [],
    distributions: [],
    feedback: []
  };

  const result = createProofTask({
    workspace,
    topicCluster: "startup patent strategy",
    assetType: "case-note",
    title: "Why a startup patent strategy needs business leverage",
    claim: "Patent strategy should protect leverage, not just generate filings.",
    linkedPage: "startup-patent-strategy.htm",
    frameworkSource: "docs/scorecards/2026-05-08-wpatent-discovery-roadmap.md"
  });

  assert.equal(result.task.id, "task-001");
  assert.equal(result.asset.id, "asset-001");
  assert.equal(result.task.status, "open");
  assert.equal(result.asset.status, "draft");
  assert.equal(result.asset.topic_cluster, "startup patent strategy");
  assert.equal(result.asset.linked_page, "startup-patent-strategy.htm");
  assert.equal(slugify("Startup Patent Strategy"), "startup-patent-strategy");
});

test("create-proof-task CLI writes the updated workspace", () => {
  const sandboxDir = mkdtempSync(join(tmpdir(), "proof-flow-"));
  const workspacePath = join(sandboxDir, "workspace.json");
  const workspace = {
    version: 1,
    tasks: [],
    assets: [],
    distributions: [],
    feedback: []
  };

  writeFileSync(workspacePath, JSON.stringify(workspace, null, 2));

  execFileSync("node", [
    "scripts/create-proof-task.mjs",
    "--workspace",
    workspacePath,
    "--topic-cluster",
    "startup patent strategy",
    "--asset-type",
    "case-note",
    "--title",
    "Why leverage matters in startup patents",
    "--claim",
    "A strong startup patent strategy protects leverage.",
    "--linked-page",
    "startup-patent-strategy.htm",
    "--framework-source",
    "docs/scorecards/2026-05-08-wpatent-discovery-roadmap.md"
  ]);

  const nextWorkspace = loadWorkspace(workspacePath);
  assert.equal(nextWorkspace.tasks.length, 1);
  assert.equal(nextWorkspace.assets.length, 1);
  assert.equal(nextWorkspace.tasks[0].title, "Why leverage matters in startup patents");
});

test("approveAsset marks a draft asset as approved", () => {
  const workspace = {
    version: 1,
    tasks: [],
    assets: [
      {
        id: "asset-001",
        task_id: "task-001",
        title: "Why leverage matters in startup patents",
        asset_type: "case-note",
        topic_cluster: "startup patent strategy",
        claim: "A strong startup patent strategy protects leverage.",
        linked_page: "startup-patent-strategy.htm",
        status: "draft"
      }
    ],
    distributions: [],
    feedback: []
  };

  const asset = approveAsset(workspace, {
    assetId: "asset-001",
    reviewer: "Andrew Leung"
  });

  assert.equal(asset.status, "approved");
  assert.equal(asset.approved_by, "Andrew Leung");
});

test("buildProofPacket produces channel-ready sections", () => {
  const asset = {
    id: "asset-001",
    title: "Why leverage matters in startup patents",
    asset_type: "case-note",
    topic_cluster: "startup patent strategy",
    claim: "A strong startup patent strategy protects leverage.",
    linked_page: "startup-patent-strategy.htm",
    status: "approved"
  };

  const packet = buildProofPacket(asset, ["site-note", "founder-post", "intro-note"]);
  assert.match(packet, /Site Note/i);
  assert.match(packet, /Founder Post/i);
  assert.match(packet, /Intro Note/i);
  assert.match(packet, /startup-patent-strategy\.htm/i);
});

test("build-proof-packet CLI writes a packet for an approved asset", () => {
  const sandboxDir = mkdtempSync(join(tmpdir(), "proof-flow-packet-"));
  const workspacePath = join(sandboxDir, "workspace.json");
  const workspace = {
    version: 1,
    tasks: [],
    assets: [
      {
        id: "asset-001",
        task_id: "task-001",
        title: "Why leverage matters in startup patents",
        asset_type: "case-note",
        topic_cluster: "startup patent strategy",
        claim: "A strong startup patent strategy protects leverage.",
        linked_page: "startup-patent-strategy.htm",
        status: "approved"
      }
    ],
    distributions: [],
    feedback: []
  };

  writeFileSync(workspacePath, JSON.stringify(workspace, null, 2));

  execFileSync("node", [
    "scripts/approve-proof-asset.mjs",
    "--workspace",
    workspacePath,
    "--asset-id",
    "asset-001",
    "--reviewer",
    "Andrew Leung"
  ]);

  execFileSync("node", [
    "scripts/build-proof-packet.mjs",
    "--workspace",
    workspacePath,
    "--asset-id",
    "asset-001",
    "--channels",
    "site-note,founder-post,intro-note",
    "--output-dir",
    sandboxDir
  ]);

  const packet = readFileSync(join(sandboxDir, "asset-001-packet.md"), "utf8");
  const nextWorkspace = loadWorkspace(workspacePath);

  assert.match(packet, /Founder Post/i);
  assert.equal(nextWorkspace.assets[0].status, "approved");
  assert.equal(nextWorkspace.distributions.length, 3);
  assert.equal(nextWorkspace.distributions[0].asset_id, "asset-001");
});
