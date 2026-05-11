# Proof Flow MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a lightweight, human-in-the-loop Proof Flow MVP that can capture proof tasks, generate draft proof assets, package approved proof for a few routing channels, and log feedback in a repo-native format compatible with the current W&Patent discovery framework, including early social-proof signals from communities and follower networks.

**Architecture:** Build the MVP as a file-based workflow rather than a web app. Keep one JSON workspace in `data/proof-flow/`, store reusable markdown templates in `templates/proof-flow/`, implement small Node CLIs in `scripts/`, and protect the workflow with a dedicated test file. The CLIs should support five states: intake, draft creation, human approval, routing packet generation, and feedback logging. Human review remains mandatory before anything is treated as approved or routed externally, and the feedback model should capture both funding signals and early social-proof signals.

**Tech Stack:** Node 23, CommonJS helper module, `.mjs` CLI entry points, JSON file storage, markdown templates, built-in `node:test`

---

### Task 1: Scaffold the Proof Flow workspace, templates, and contract test

**Files:**
- Create: `tests/proof-flow.test.mjs`
- Create: `data/proof-flow/workspace.json`
- Create: `docs/proof-flow/README.md`
- Create: `templates/proof-flow/case-note.md`
- Create: `templates/proof-flow/founder-memo.md`

- [ ] **Step 1: Write the failing contract test**

Create `tests/proof-flow.test.mjs` with:

```js
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
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
node --test tests/proof-flow.test.mjs
```

Expected: FAIL because the workspace, README, and templates do not exist yet.

- [ ] **Step 3: Create the workspace, README, and templates**

Create `data/proof-flow/workspace.json` with:

```json
{
  "version": 1,
  "tasks": [],
  "assets": [],
  "distributions": [],
  "feedback": []
}
```

Create `docs/proof-flow/README.md` with:

```md
# Proof Flow

This folder documents a lightweight, human-in-the-loop Proof Flow MVP.

The MVP is compatible with the current W&Patent discovery framework:

- discovery and proof gaps can open proof tasks
- approved proof assets can link back to live topic pages
- routing and feedback can be reviewed alongside roadmap refreshes and early social-proof movement

## Commands

- `node scripts/create-proof-task.mjs ...`
- `node scripts/approve-proof-asset.mjs ...`
- `node scripts/build-proof-packet.mjs ...`
- `node scripts/record-proof-feedback.mjs ...`

## Workflow

1. Open a proof task from a real topic gap or proof gap.
2. Draft the proof asset from a template.
3. Review it manually before approval.
4. Build a routing packet for the right channels and communities.
5. Record the feedback after distribution, including traction and social-proof signals.
```

Create `templates/proof-flow/case-note.md` with:

```md
# {{title}}

## Topic Cluster

{{topic_cluster}}

## Claim

{{claim}}

## Situation

{{situation}}

## Why It Matters

{{why_it_matters}}

## Linked Page

{{linked_page}}
```

Create `templates/proof-flow/founder-memo.md` with:

```md
# {{title}}

## Topic Cluster

{{topic_cluster}}

## Core Claim

{{claim}}

## Founder Point Of View

{{founder_point_of_view}}

## Evidence Or Example

{{supporting_evidence}}

## Linked Page

{{linked_page}}
```

- [ ] **Step 4: Run the dedicated test and full suite**

Run:

```bash
node --test tests/proof-flow.test.mjs
npm test
```

Expected:

- the dedicated proof-flow test passes
- the full suite passes with one additional test file included

- [ ] **Step 5: Commit the scaffolding**

Run:

```bash
git add tests/proof-flow.test.mjs data/proof-flow/workspace.json docs/proof-flow/README.md templates/proof-flow/case-note.md templates/proof-flow/founder-memo.md
git commit -m "docs: scaffold proof flow mvp"
```

### Task 2: Implement the shared helper and the proof-task intake CLI

**Files:**
- Modify: `tests/proof-flow.test.mjs`
- Create: `scripts/lib/proof-flow.js`
- Create: `scripts/create-proof-task.mjs`

- [ ] **Step 1: Extend the test with failing helper and CLI expectations**

Update `tests/proof-flow.test.mjs` to:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import proofFlow from "../scripts/lib/proof-flow.js";

const { createProofTask, loadWorkspace, slugify } = proofFlow;

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
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
node --test tests/proof-flow.test.mjs
```

Expected: FAIL because `scripts/lib/proof-flow.js` and `scripts/create-proof-task.mjs` do not exist yet.

- [ ] **Step 3: Implement the helper and intake CLI**

Create `scripts/lib/proof-flow.js` with:

```js
const { readFileSync, writeFileSync } = require("node:fs");

function loadWorkspace(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function saveWorkspace(filePath, workspace) {
  writeFileSync(filePath, `${JSON.stringify(workspace, null, 2)}\n`);
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function nextId(prefix, items) {
  return `${prefix}-${String(items.length + 1).padStart(3, "0")}`;
}

function createProofTask({
  workspace,
  topicCluster,
  assetType,
  title,
  claim,
  linkedPage,
  frameworkSource
}) {
  const task = {
    id: nextId("task", workspace.tasks),
    title,
    topic_cluster: topicCluster,
    asset_type: assetType,
    claim,
    linked_page: linkedPage,
    framework_source: frameworkSource,
    status: "open"
  };

  const asset = {
    id: nextId("asset", workspace.assets),
    task_id: task.id,
    title,
    asset_type: assetType,
    topic_cluster: topicCluster,
    claim,
    linked_page: linkedPage,
    status: "draft"
  };

  workspace.tasks.push(task);
  workspace.assets.push(asset);

  return { workspace, task, asset };
}

module.exports = {
  createProofTask,
  loadWorkspace,
  saveWorkspace,
  slugify
};
```

Create `scripts/create-proof-task.mjs` with:

```js
import proofFlow from "./lib/proof-flow.js";

const { createProofTask, loadWorkspace, saveWorkspace } = proofFlow;

function readArgs(argv) {
  const args = {};
  for (let index = 2; index < argv.length; index += 2) {
    args[argv[index]] = argv[index + 1];
  }
  return args;
}

const args = readArgs(process.argv);
const workspacePath = args["--workspace"] || "data/proof-flow/workspace.json";
const workspace = loadWorkspace(workspacePath);

const result = createProofTask({
  workspace,
  topicCluster: args["--topic-cluster"],
  assetType: args["--asset-type"],
  title: args["--title"],
  claim: args["--claim"],
  linkedPage: args["--linked-page"],
  frameworkSource: args["--framework-source"]
});

saveWorkspace(workspacePath, result.workspace);
console.log(
  `Created ${result.task.id} and ${result.asset.id} for topic cluster "${result.task.topic_cluster}".`
);
```

- [ ] **Step 4: Run the dedicated test and full suite**

Run:

```bash
node --test tests/proof-flow.test.mjs
npm test
```

Expected:

- the helper and CLI tests pass
- the full suite stays green

- [ ] **Step 5: Commit the intake flow**

Run:

```bash
git add tests/proof-flow.test.mjs scripts/lib/proof-flow.js scripts/create-proof-task.mjs
git commit -m "feat: add proof flow intake tooling"
```

### Task 3: Implement human approval and routing-packet generation for proof assets

**Files:**
- Modify: `tests/proof-flow.test.mjs`
- Modify: `scripts/lib/proof-flow.js`
- Create: `scripts/approve-proof-asset.mjs`
- Create: `scripts/build-proof-packet.mjs`
- Create: `docs/proof-flow/packets/.gitkeep`

- [ ] **Step 1: Extend the test with failing approval and routing expectations**

Update `tests/proof-flow.test.mjs` to:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import proofFlow from "../scripts/lib/proof-flow.js";

const { approveAsset, buildProofPacket, createProofTask, loadWorkspace } = proofFlow;

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
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
node --test tests/proof-flow.test.mjs
```

Expected: FAIL because approval and packet generation are not implemented yet.

- [ ] **Step 3: Implement approval and packet generation**

Update `scripts/lib/proof-flow.js` to:

```js
const { readFileSync, writeFileSync } = require("node:fs");

function loadWorkspace(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function saveWorkspace(filePath, workspace) {
  writeFileSync(filePath, `${JSON.stringify(workspace, null, 2)}\n`);
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function nextId(prefix, items) {
  return `${prefix}-${String(items.length + 1).padStart(3, "0")}`;
}

function createProofTask({ workspace, topicCluster, assetType, title, claim, linkedPage, frameworkSource }) {
  const task = {
    id: nextId("task", workspace.tasks),
    title,
    topic_cluster: topicCluster,
    asset_type: assetType,
    claim,
    linked_page: linkedPage,
    framework_source: frameworkSource,
    status: "open"
  };

  const asset = {
    id: nextId("asset", workspace.assets),
    task_id: task.id,
    title,
    asset_type: assetType,
    topic_cluster: topicCluster,
    claim,
    linked_page: linkedPage,
    status: "draft"
  };

  workspace.tasks.push(task);
  workspace.assets.push(asset);
  return { workspace, task, asset };
}

function approveAsset(workspace, { assetId, reviewer }) {
  const asset = workspace.assets.find((item) => item.id === assetId);
  if (!asset) {
    throw new Error(`Asset not found for ${assetId}`);
  }
  asset.status = "approved";
  asset.approved_by = reviewer;
  return asset;
}

function buildProofPacket(asset, channels) {
  const list = channels.map((value) => String(value || "").trim()).filter(Boolean);
  const sections = list.map((channel) => {
    if (channel === "site-note") {
      return `## Site Note\n\n${asset.title}\n\n${asset.claim}\n\nLinked page: ${asset.linked_page}`;
    }
    if (channel === "founder-post") {
      return `## Founder Post\n\n${asset.title}\n\nPoint of view: ${asset.claim}`;
    }
    return `## Intro Note\n\nShare ${asset.title} as supporting proof for ${asset.topic_cluster}.`;
  });
  return `# Proof Packet: ${asset.id}\n\n${sections.join("\n\n")}\n`;
}

function registerDistributions(workspace, assetId, channels) {
  for (const channel of channels) {
    workspace.distributions.push({
      id: nextId("dist", workspace.distributions),
      asset_id: assetId,
      channel,
      status: "drafted"
    });
  }
  return workspace;
}

module.exports = {
  approveAsset,
  buildProofPacket,
  createProofTask,
  loadWorkspace,
  registerDistributions,
  saveWorkspace,
  slugify
};
```

Create `scripts/build-proof-packet.mjs` with:

```js
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import proofFlow from "./lib/proof-flow.js";

const { buildProofPacket, loadWorkspace, registerDistributions, saveWorkspace } = proofFlow;

function readArgs(argv) {
  const args = {};
  for (let index = 2; index < argv.length; index += 2) {
    args[argv[index]] = argv[index + 1];
  }
  return args;
}

const args = readArgs(process.argv);
const workspacePath = args["--workspace"] || "data/proof-flow/workspace.json";
const outputDir = args["--output-dir"] || "docs/proof-flow/packets";
const assetId = args["--asset-id"];
const channels = String(args["--channels"] || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const workspace = loadWorkspace(workspacePath);
const asset = workspace.assets.find((item) => item.id === assetId);

if (!asset || asset.status !== "approved") {
  throw new Error(`Approved asset not found for ${assetId}`);
}

const packet = buildProofPacket(asset, channels);
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, `${asset.id}-packet.md`), packet);
registerDistributions(workspace, asset.id, channels);
saveWorkspace(workspacePath, workspace);
console.log(`Built packet for ${asset.id} with ${channels.length} channels.`);
```

Create `scripts/approve-proof-asset.mjs` with:

```js
import proofFlow from "./lib/proof-flow.js";

const { approveAsset, loadWorkspace, saveWorkspace } = proofFlow;

function readArgs(argv) {
  const args = {};
  for (let index = 2; index < argv.length; index += 2) {
    args[argv[index]] = argv[index + 1];
  }
  return args;
}

const args = readArgs(process.argv);
const workspacePath = args["--workspace"] || "data/proof-flow/workspace.json";
const workspace = loadWorkspace(workspacePath);

const asset = approveAsset(workspace, {
  assetId: args["--asset-id"],
  reviewer: args["--reviewer"]
});

saveWorkspace(workspacePath, workspace);
console.log(`Approved ${asset.id} by ${asset.approved_by}.`);
```

Create `docs/proof-flow/packets/.gitkeep` as an empty file.

- [ ] **Step 4: Run the dedicated test and full suite**

Run:

```bash
node --test tests/proof-flow.test.mjs
npm test
```

Expected:

- routing-packet tests pass
- the full suite remains green

- [ ] **Step 5: Commit the routing flow**

Run:

```bash
git add tests/proof-flow.test.mjs scripts/lib/proof-flow.js scripts/approve-proof-asset.mjs scripts/build-proof-packet.mjs docs/proof-flow/packets/.gitkeep
git commit -m "feat: add proof flow approval and routing"
```

### Task 4: Implement feedback logging and wire the MVP back into the W&Patent operating docs

**Files:**
- Modify: `tests/proof-flow.test.mjs`
- Modify: `docs/proof-flow/README.md`
- Modify: `.agents/skills/founder-led-discovery-spine/runbooks/wpatent-on-demand-operations.md`
- Modify: `.agents/skills/founder-led-discovery-spine/profiles/wpatent-proof-network.md`
- Modify: `scripts/lib/proof-flow.js`
- Create: `scripts/record-proof-feedback.mjs`

- [ ] **Step 1: Extend the test with failing feedback expectations**

Update `tests/proof-flow.test.mjs` to:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import proofFlow from "../scripts/lib/proof-flow.js";

const { loadWorkspace, recordFeedback } = proofFlow;

test("recordFeedback appends a funding-related signal", () => {
  const workspace = {
    version: 1,
    tasks: [],
    assets: [],
    distributions: [{ id: "dist-001", asset_id: "asset-001", channel: "founder-post", status: "sent" }],
    feedback: []
  };

  const event = recordFeedback(workspace, {
    distributionId: "dist-001",
    feedbackType: "investor-interest",
    signalStrength: "high",
    notes: "Investor requested a follow-up meeting.",
    relatedFundingStage: "pre-seed"
  });

  assert.equal(event.id, "feedback-001");
  assert.equal(event.feedback_type, "investor-interest");
  assert.equal(workspace.feedback.length, 1);
});

test("record-proof-feedback CLI appends a feedback event", () => {
  const sandboxDir = mkdtempSync(join(tmpdir(), "proof-flow-feedback-"));
  const workspacePath = join(sandboxDir, "workspace.json");

  writeFileSync(
    workspacePath,
    JSON.stringify(
      {
        version: 1,
        tasks: [],
        assets: [],
        distributions: [{ id: "dist-001", asset_id: "asset-001", channel: "founder-post", status: "sent" }],
        feedback: []
      },
      null,
      2
    )
  );

  execFileSync("node", [
    "scripts/record-proof-feedback.mjs",
    "--workspace",
    workspacePath,
    "--distribution-id",
    "dist-001",
    "--feedback-type",
    "investor-interest",
    "--signal-strength",
    "high",
    "--notes",
    "Investor requested a follow-up meeting.",
    "--related-funding-stage",
    "pre-seed"
  ]);

  const workspace = loadWorkspace(workspacePath);
  assert.equal(workspace.feedback.length, 1);
  assert.equal(workspace.feedback[0].related_funding_stage, "pre-seed");
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
node --test tests/proof-flow.test.mjs
```

Expected: FAIL because feedback logging is not implemented yet.

- [ ] **Step 3: Implement feedback logging and update the operating docs**

Update `scripts/lib/proof-flow.js` to:

```js
const { readFileSync, writeFileSync } = require("node:fs");

function loadWorkspace(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function saveWorkspace(filePath, workspace) {
  writeFileSync(filePath, `${JSON.stringify(workspace, null, 2)}\n`);
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function nextId(prefix, items) {
  return `${prefix}-${String(items.length + 1).padStart(3, "0")}`;
}

function createProofTask({ workspace, topicCluster, assetType, title, claim, linkedPage, frameworkSource }) {
  const task = {
    id: nextId("task", workspace.tasks),
    title,
    topic_cluster: topicCluster,
    asset_type: assetType,
    claim,
    linked_page: linkedPage,
    framework_source: frameworkSource,
    status: "open"
  };

  const asset = {
    id: nextId("asset", workspace.assets),
    task_id: task.id,
    title,
    asset_type: assetType,
    topic_cluster: topicCluster,
    claim,
    linked_page: linkedPage,
    status: "draft"
  };

  workspace.tasks.push(task);
  workspace.assets.push(asset);
  return { workspace, task, asset };
}

function buildProofPacket(asset, channels) {
  const list = channels.map((value) => String(value || "").trim()).filter(Boolean);
  const sections = list.map((channel) => {
    if (channel === "site-note") {
      return `## Site Note\n\n${asset.title}\n\n${asset.claim}\n\nLinked page: ${asset.linked_page}`;
    }
    if (channel === "founder-post") {
      return `## Founder Post\n\n${asset.title}\n\nPoint of view: ${asset.claim}`;
    }
    return `## Intro Note\n\nShare ${asset.title} as supporting proof for ${asset.topic_cluster}.`;
  });
  return `# Proof Packet: ${asset.id}\n\n${sections.join("\n\n")}\n`;
}

function registerDistributions(workspace, assetId, channels) {
  for (const channel of channels) {
    workspace.distributions.push({
      id: nextId("dist", workspace.distributions),
      asset_id: assetId,
      channel,
      status: "drafted"
    });
  }
  return workspace;
}

function recordFeedback(workspace, { distributionId, feedbackType, signalStrength, notes, relatedFundingStage }) {
  const event = {
    id: nextId("feedback", workspace.feedback),
    distribution_id: distributionId,
    feedback_type: feedbackType,
    signal_strength: signalStrength,
    notes,
    related_funding_stage: relatedFundingStage
  };
  workspace.feedback.push(event);
  return event;
}

module.exports = {
  buildProofPacket,
  createProofTask,
  loadWorkspace,
  recordFeedback,
  registerDistributions,
  saveWorkspace,
  slugify
};
```

Create `scripts/record-proof-feedback.mjs` with:

```js
import proofFlow from "./lib/proof-flow.js";

const { loadWorkspace, recordFeedback, saveWorkspace } = proofFlow;

function readArgs(argv) {
  const args = {};
  for (let index = 2; index < argv.length; index += 2) {
    args[argv[index]] = argv[index + 1];
  }
  return args;
}

const args = readArgs(process.argv);
const workspacePath = args["--workspace"] || "data/proof-flow/workspace.json";
const workspace = loadWorkspace(workspacePath);

const event = recordFeedback(workspace, {
  distributionId: args["--distribution-id"],
  feedbackType: args["--feedback-type"],
  signalStrength: args["--signal-strength"],
  notes: args["--notes"],
  relatedFundingStage: args["--related-funding-stage"]
});

saveWorkspace(workspacePath, workspace);
console.log(`Recorded ${event.id} for ${event.distribution_id}.`);
```

Update `docs/proof-flow/README.md` to add:

```md
## Feedback loop

After an asset is routed, record the meaningful response:

- citation movement
- investor interest
- community mentions
- reposts or shares
- endorsements or positive replies
- reply quality
- intro acceptance
- follow-up meeting signals

Use:

- `node scripts/record-proof-feedback.mjs ...`
```

Update `.agents/skills/founder-led-discovery-spine/runbooks/wpatent-on-demand-operations.md` to add to the default read order and tasks:

```md
7. `docs/proof-flow/README.md`

### 6. Proof Flow Review

Use when the main question is:
`What proof asset should we create, route, or review next?`

Expected outputs:

- the linked topic cluster
- current proof task status
- whether the next step is intake, validation, routing, or feedback
- the exact file or script to use next
```

Update `.agents/skills/founder-led-discovery-spine/profiles/wpatent-proof-network.md` to add:

```md
## MVP Tooling Link

When the proof gap should become an actual task, use the Proof Flow MVP:

- open the task with `scripts/create-proof-task.mjs`
- package approved proof with `scripts/build-proof-packet.mjs`
- log outcome signals with `scripts/record-proof-feedback.mjs`
```

- [ ] **Step 4: Run the dedicated test and full suite**

Run:

```bash
node --test tests/proof-flow.test.mjs
npm test
```

Expected:

- feedback logging tests pass
- the full suite remains green

- [ ] **Step 5: Commit the feedback loop and framework integration**

Run:

```bash
git add tests/proof-flow.test.mjs scripts/lib/proof-flow.js scripts/record-proof-feedback.mjs docs/proof-flow/README.md .agents/skills/founder-led-discovery-spine/runbooks/wpatent-on-demand-operations.md .agents/skills/founder-led-discovery-spine/profiles/wpatent-proof-network.md
git commit -m "feat: add proof flow feedback loop"
```

## Spec Coverage Check

- `Proof Intake`: covered by Task 2
- `Proof Formation`: covered by Task 2 through draft asset creation
- `Proof Validation`: covered by Task 3 through explicit human approval before routing
- `Proof Routing`: covered by Task 3
- `Proof Feedback`: covered by Task 4, including funding and social-proof signals
- compatibility with the current framework: covered by Task 4 runbook and proof-network updates

## Self-Review

- No placeholder steps remain.
- The plan stays inside a lightweight, repo-native MVP rather than inventing a platform too early.
- Human approval remains explicit before routing.
- The tasks are sequenced so each stage adds one working slice: scaffolding, intake, routing, feedback.
