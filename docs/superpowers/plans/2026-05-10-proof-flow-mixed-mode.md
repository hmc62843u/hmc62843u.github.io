# Proof Flow Mixed-Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the founder-private Proof Flow MVP with a mixed-mode sync layer that exports approved proof into an incubator community workspace and imports selected community feedback back into the founder workspace.

**Architecture:** Build the mixed-mode layer as a file-based packet exchange, not a live multi-tenant platform. Keep the founder-private workspace in `data/proof-flow/workspace.json`, add a shared incubator workspace in `data/proof-flow/community-workspace.json`, use JSON sync packets in a local outbox, and implement small Node CLIs for export, apply, and feedback import. Preserve explicit human approval before outward sync and keep transport, auth, permissions, and conflict resolution out of scope.

**Tech Stack:** Node 23, CommonJS helper module, `.mjs` CLI entry points, JSON file storage, markdown docs, built-in `node:test`

---

**Prerequisite:** Complete [2026-05-10-proof-flow-mvp.md](/Users/andrew/backup/work/github/hmc62843u.github.io/docs/superpowers/plans/2026-05-10-proof-flow-mvp.md) first. This plan assumes `scripts/lib/proof-flow.js`, `scripts/create-proof-task.mjs`, `scripts/approve-proof-asset.mjs`, `scripts/build-proof-packet.mjs`, `scripts/record-proof-feedback.mjs`, `data/proof-flow/workspace.json`, and `docs/proof-flow/README.md` already exist.

### Task 1: Scaffold the community workspace and mixed-mode contract

**Files:**
- Create: `tests/proof-flow-mixed-mode.test.mjs`
- Create: `data/proof-flow/community-workspace.json`
- Create: `docs/proof-flow/mixed-mode.md`
- Modify: `docs/proof-flow/README.md`

- [ ] **Step 1: Write the failing mixed-mode contract test**

Create `tests/proof-flow-mixed-mode.test.mjs` with:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

function read(relativePath) {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("mixed-mode scaffolding exposes a community workspace and guide", () => {
  assert.equal(
    existsSync(new URL("../data/proof-flow/community-workspace.json", import.meta.url)),
    true
  );
  assert.equal(
    existsSync(new URL("../docs/proof-flow/mixed-mode.md", import.meta.url)),
    true
  );

  const community = JSON.parse(read("data/proof-flow/community-workspace.json"));
  assert.deepEqual(Object.keys(community), [
    "version",
    "received_sync_ids",
    "shared_assets",
    "amplification_events"
  ]);
  assert.deepEqual(community.received_sync_ids, []);
  assert.deepEqual(community.shared_assets, []);
  assert.deepEqual(community.amplification_events, []);

  const guide = read("docs/proof-flow/mixed-mode.md");
  assert.match(guide, /private founder instance/i);
  assert.match(guide, /incubator community operating system/i);
  assert.match(guide, /selective sync/i);

  const readme = read("docs/proof-flow/README.md");
  assert.match(readme, /mixed mode/i);
  assert.match(readme, /community-workspace\.json/i);
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
node --test tests/proof-flow-mixed-mode.test.mjs
```

Expected: FAIL because the community workspace file, mixed-mode guide, and README references do not exist yet.

- [ ] **Step 3: Create the community workspace and mixed-mode guide**

Create `data/proof-flow/community-workspace.json` with:

```json
{
  "version": 1,
  "received_sync_ids": [],
  "shared_assets": [],
  "amplification_events": []
}
```

Create `docs/proof-flow/mixed-mode.md` with:

```md
# Proof Flow Mixed Mode

This document describes the mixed-mode boundary for Proof Flow.

## Layers

- `private founder instance`: founder-only notes, drafts, and approvals
- `incubator community operating system`: shared circulation, amplification, and selected feedback
- `selective sync`: only approved proof moves outward, and only selected feedback moves back

## Rules

- raw notes stay private
- unapproved drafts stay private
- approved proof can sync outward
- community amplification can sync back as feedback
```

Update `docs/proof-flow/README.md` to:

```md
# Proof Flow

This folder documents a lightweight, human-in-the-loop Proof Flow MVP.

The MVP is compatible with the current W&Patent discovery framework:

- discovery and proof gaps can open proof tasks
- approved proof assets can link back to live topic pages
- routing and feedback can be reviewed alongside roadmap refreshes and early social-proof movement
- the private workspace can later become the founder-side instance in a mixed-mode system

The v1 workspace is founder-private by default.
Approved assets can then be routed outward into incubator or community channels.

## Mixed mode

- founder workspace: `data/proof-flow/workspace.json`
- community workspace: `data/proof-flow/community-workspace.json`
- mixed-mode guide: `docs/proof-flow/mixed-mode.md`

## Commands

- `node scripts/create-proof-task.mjs ...`
- `node scripts/approve-proof-asset.mjs ...`
- `node scripts/build-proof-packet.mjs ...`
- `node scripts/record-proof-feedback.mjs ...`
```

- [ ] **Step 4: Run the dedicated test and full suite**

Run:

```bash
node --test tests/proof-flow-mixed-mode.test.mjs
npm test
```

Expected:

- the mixed-mode contract test passes
- the full suite stays green

- [ ] **Step 5: Commit the scaffolding**

Run:

```bash
git add tests/proof-flow-mixed-mode.test.mjs data/proof-flow/community-workspace.json docs/proof-flow/mixed-mode.md docs/proof-flow/README.md
git commit -m "docs: scaffold proof flow mixed mode"
```

### Task 2: Implement outward sync packet export from the founder workspace

**Files:**
- Modify: `tests/proof-flow-mixed-mode.test.mjs`
- Modify: `scripts/lib/proof-flow.js`
- Create: `scripts/export-proof-sync.mjs`
- Create: `data/proof-flow/sync-outbox/.gitkeep`

- [ ] **Step 1: Extend the test with failing export expectations**

Update `tests/proof-flow-mixed-mode.test.mjs` to:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import proofFlow from "../scripts/lib/proof-flow.js";

const { buildSharePacket, loadWorkspace } = proofFlow;

function read(relativePath) {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("mixed-mode scaffolding exposes a community workspace and guide", () => {
  assert.equal(
    existsSync(new URL("../data/proof-flow/community-workspace.json", import.meta.url)),
    true
  );
  assert.equal(
    existsSync(new URL("../docs/proof-flow/mixed-mode.md", import.meta.url)),
    true
  );
});

test("buildSharePacket exports only approved proof with channel context", () => {
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
        approved_by: "Andrew Leung",
        status: "approved"
      }
    ],
    distributions: [],
    feedback: []
  };

  const packet = buildSharePacket({
    workspace,
    assetId: "asset-001",
    channels: ["founder-post", "community-post"],
    exportedAt: "2026-05-10T00:00:00.000Z"
  });

  assert.equal(packet.packet_type, "proof-share");
  assert.equal(packet.asset_id, "asset-001");
  assert.equal(packet.approved_by, "Andrew Leung");
  assert.deepEqual(packet.channels, ["founder-post", "community-post"]);
  assert.match(packet.packet_markdown, /Founder Post/i);
});

test("export-proof-sync CLI writes a sync packet to the outbox", () => {
  const sandboxDir = mkdtempSync(join(tmpdir(), "proof-flow-sync-"));
  const workspacePath = join(sandboxDir, "workspace.json");
  const outboxDir = join(sandboxDir, "outbox");

  writeFileSync(
    workspacePath,
    JSON.stringify(
      {
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
            approved_by: "Andrew Leung",
            status: "approved"
          }
        ],
        distributions: [],
        feedback: []
      },
      null,
      2
    )
  );

  execFileSync("node", [
    "scripts/export-proof-sync.mjs",
    "--workspace",
    workspacePath,
    "--asset-id",
    "asset-001",
    "--channels",
    "founder-post,community-post",
    "--output-dir",
    outboxDir
  ]);

  const packet = JSON.parse(
    readFileSync(join(outboxDir, "asset-001-share.json"), "utf8")
  );
  const workspace = loadWorkspace(workspacePath);

  assert.equal(packet.asset_id, "asset-001");
  assert.deepEqual(packet.channels, ["founder-post", "community-post"]);
  assert.equal(workspace.assets[0].status, "approved");
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
node --test tests/proof-flow-mixed-mode.test.mjs
```

Expected: FAIL because the new helper and export CLI do not exist yet.

- [ ] **Step 3: Implement the share-packet helper and export CLI**

Update `scripts/lib/proof-flow.js` to:

```js
const { readFileSync, writeFileSync } = require("node:fs");

function loadWorkspace(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function saveWorkspace(filePath, workspace) {
  writeFileSync(filePath, `${JSON.stringify(workspace, null, 2)}\n`);
}

function loadCommunityWorkspace(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function saveCommunityWorkspace(filePath, workspace) {
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
    if (channel === "community-post") {
      return `## Community Post\n\n${asset.title}\n\nShare this proof with community context for ${asset.topic_cluster}.`;
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

function buildSharePacket({ workspace, assetId, channels, exportedAt }) {
  const asset = workspace.assets.find((item) => item.id === assetId);
  if (!asset || asset.status !== "approved") {
    throw new Error(`Approved asset not found for ${assetId}`);
  }

  return {
    packet_type: "proof-share",
    sync_id: `${asset.id}--${String(exportedAt).replace(/[:.]/g, "-")}`,
    asset_id: asset.id,
    title: asset.title,
    topic_cluster: asset.topic_cluster,
    claim: asset.claim,
    linked_page: asset.linked_page,
    approved_by: asset.approved_by || "",
    channels: channels.map((value) => String(value || "").trim()).filter(Boolean),
    packet_markdown: buildProofPacket(asset, channels),
    exported_at: exportedAt
  };
}

module.exports = {
  approveAsset,
  buildProofPacket,
  buildSharePacket,
  createProofTask,
  loadCommunityWorkspace,
  loadWorkspace,
  recordFeedback,
  registerDistributions,
  saveCommunityWorkspace,
  saveWorkspace,
  slugify
};
```

Create `scripts/export-proof-sync.mjs` with:

```js
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import proofFlow from "./lib/proof-flow.js";

const { buildSharePacket, loadWorkspace } = proofFlow;

function readArgs(argv) {
  const args = {};
  for (let index = 2; index < argv.length; index += 2) {
    args[argv[index]] = argv[index + 1];
  }
  return args;
}

const args = readArgs(process.argv);
const workspacePath = args["--workspace"] || "data/proof-flow/workspace.json";
const outputDir = args["--output-dir"] || "data/proof-flow/sync-outbox";
const assetId = args["--asset-id"];
const channels = String(args["--channels"] || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const workspace = loadWorkspace(workspacePath);
const packet = buildSharePacket({
  workspace,
  assetId,
  channels,
  exportedAt: new Date().toISOString()
});

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, `${assetId}-share.json`), `${JSON.stringify(packet, null, 2)}\n`);
console.log(`Exported ${packet.sync_id} to ${outputDir}.`);
```

Create `data/proof-flow/sync-outbox/.gitkeep` as an empty file.

- [ ] **Step 4: Run the dedicated test and full suite**

Run:

```bash
node --test tests/proof-flow-mixed-mode.test.mjs
npm test
```

Expected:

- the export tests pass
- the full suite remains green

- [ ] **Step 5: Commit the outward sync flow**

Run:

```bash
git add tests/proof-flow-mixed-mode.test.mjs scripts/lib/proof-flow.js scripts/export-proof-sync.mjs data/proof-flow/sync-outbox/.gitkeep
git commit -m "feat: add proof flow sync export"
```

### Task 3: Apply approved sync packets to the incubator community workspace

**Files:**
- Modify: `tests/proof-flow-mixed-mode.test.mjs`
- Modify: `scripts/lib/proof-flow.js`
- Create: `scripts/apply-proof-sync.mjs`

- [ ] **Step 1: Extend the test with failing apply expectations**

Update `tests/proof-flow-mixed-mode.test.mjs` to:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import proofFlow from "../scripts/lib/proof-flow.js";

const { applySharePacket, loadCommunityWorkspace } = proofFlow;

test("applySharePacket imports a shared asset and deduplicates by sync id", () => {
  const communityWorkspace = {
    version: 1,
    received_sync_ids: [],
    shared_assets: [],
    amplification_events: []
  };

  const packet = {
    packet_type: "proof-share",
    sync_id: "asset-001--2026-05-10T00-00-00-000Z",
    asset_id: "asset-001",
    title: "Why leverage matters in startup patents",
    topic_cluster: "startup patent strategy",
    claim: "A strong startup patent strategy protects leverage.",
    linked_page: "startup-patent-strategy.htm",
    approved_by: "Andrew Leung",
    channels: ["founder-post", "community-post"],
    packet_markdown: "# Proof Packet: asset-001",
    exported_at: "2026-05-10T00:00:00.000Z"
  };

  const first = applySharePacket(communityWorkspace, packet);
  const second = applySharePacket(communityWorkspace, packet);

  assert.equal(first.duplicated, false);
  assert.equal(second.duplicated, true);
  assert.equal(communityWorkspace.shared_assets.length, 1);
  assert.deepEqual(communityWorkspace.received_sync_ids, [
    "asset-001--2026-05-10T00-00-00-000Z"
  ]);
});

test("apply-proof-sync CLI writes the imported asset to the community workspace", () => {
  const sandboxDir = mkdtempSync(join(tmpdir(), "proof-flow-community-"));
  const communityPath = join(sandboxDir, "community-workspace.json");
  const packetPath = join(sandboxDir, "asset-001-share.json");

  writeFileSync(
    communityPath,
    JSON.stringify(
      {
        version: 1,
        received_sync_ids: [],
        shared_assets: [],
        amplification_events: []
      },
      null,
      2
    )
  );

  writeFileSync(
    packetPath,
    JSON.stringify(
      {
        packet_type: "proof-share",
        sync_id: "asset-001--2026-05-10T00-00-00-000Z",
        asset_id: "asset-001",
        title: "Why leverage matters in startup patents",
        topic_cluster: "startup patent strategy",
        claim: "A strong startup patent strategy protects leverage.",
        linked_page: "startup-patent-strategy.htm",
        approved_by: "Andrew Leung",
        channels: ["founder-post", "community-post"],
        packet_markdown: "# Proof Packet: asset-001",
        exported_at: "2026-05-10T00:00:00.000Z"
      },
      null,
      2
    )
  );

  execFileSync("node", [
    "scripts/apply-proof-sync.mjs",
    "--community-workspace",
    communityPath,
    "--packet",
    packetPath
  ]);

  const community = loadCommunityWorkspace(communityPath);
  assert.equal(community.shared_assets.length, 1);
  assert.equal(community.shared_assets[0].asset_id, "asset-001");
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
node --test tests/proof-flow-mixed-mode.test.mjs
```

Expected: FAIL because the apply helper and apply CLI do not exist yet.

- [ ] **Step 3: Implement community-workspace apply logic**

Update `scripts/lib/proof-flow.js` to:

```js
const { readFileSync, writeFileSync } = require("node:fs");

function loadWorkspace(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function saveWorkspace(filePath, workspace) {
  writeFileSync(filePath, `${JSON.stringify(workspace, null, 2)}\n`);
}

function loadCommunityWorkspace(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function saveCommunityWorkspace(filePath, workspace) {
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
    if (channel === "community-post") {
      return `## Community Post\n\n${asset.title}\n\nShare this proof with community context for ${asset.topic_cluster}.`;
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

function buildSharePacket({ workspace, assetId, channels, exportedAt }) {
  const asset = workspace.assets.find((item) => item.id === assetId);
  if (!asset || asset.status !== "approved") {
    throw new Error(`Approved asset not found for ${assetId}`);
  }

  return {
    packet_type: "proof-share",
    sync_id: `${asset.id}--${String(exportedAt).replace(/[:.]/g, "-")}`,
    asset_id: asset.id,
    title: asset.title,
    topic_cluster: asset.topic_cluster,
    claim: asset.claim,
    linked_page: asset.linked_page,
    approved_by: asset.approved_by || "",
    channels: channels.map((value) => String(value || "").trim()).filter(Boolean),
    packet_markdown: buildProofPacket(asset, channels),
    exported_at: exportedAt
  };
}

function applySharePacket(communityWorkspace, packet) {
  if (communityWorkspace.received_sync_ids.includes(packet.sync_id)) {
    return { communityWorkspace, duplicated: true };
  }

  communityWorkspace.received_sync_ids.push(packet.sync_id);
  communityWorkspace.shared_assets.push({
    sync_id: packet.sync_id,
    asset_id: packet.asset_id,
    title: packet.title,
    topic_cluster: packet.topic_cluster,
    claim: packet.claim,
    linked_page: packet.linked_page,
    approved_by: packet.approved_by,
    channels: packet.channels,
    packet_markdown: packet.packet_markdown,
    exported_at: packet.exported_at
  });

  return { communityWorkspace, duplicated: false };
}

module.exports = {
  approveAsset,
  applySharePacket,
  buildProofPacket,
  buildSharePacket,
  createProofTask,
  loadCommunityWorkspace,
  loadWorkspace,
  recordFeedback,
  registerDistributions,
  saveCommunityWorkspace,
  saveWorkspace,
  slugify
};
```

Create `scripts/apply-proof-sync.mjs` with:

```js
import { readFileSync } from "node:fs";
import proofFlow from "./lib/proof-flow.js";

const { applySharePacket, loadCommunityWorkspace, saveCommunityWorkspace } = proofFlow;

function readArgs(argv) {
  const args = {};
  for (let index = 2; index < argv.length; index += 2) {
    args[argv[index]] = argv[index + 1];
  }
  return args;
}

const args = readArgs(process.argv);
const workspacePath = args["--community-workspace"] || "data/proof-flow/community-workspace.json";
const packetPath = args["--packet"];

const communityWorkspace = loadCommunityWorkspace(workspacePath);
const packet = JSON.parse(readFileSync(packetPath, "utf8"));
const result = applySharePacket(communityWorkspace, packet);

saveCommunityWorkspace(workspacePath, result.communityWorkspace);
console.log(
  result.duplicated
    ? `Skipped duplicate sync ${packet.sync_id}.`
    : `Applied sync ${packet.sync_id}.`
);
```

- [ ] **Step 4: Run the dedicated test and full suite**

Run:

```bash
node --test tests/proof-flow-mixed-mode.test.mjs
npm test
```

Expected:

- the apply tests pass
- the full suite remains green

- [ ] **Step 5: Commit the shared-workspace import flow**

Run:

```bash
git add tests/proof-flow-mixed-mode.test.mjs scripts/apply-proof-sync.mjs scripts/lib/proof-flow.js
git commit -m "feat: add proof flow shared workspace apply"
```

### Task 4: Import selected community feedback back into the founder workspace

**Files:**
- Modify: `tests/proof-flow-mixed-mode.test.mjs`
- Modify: `scripts/lib/proof-flow.js`
- Create: `scripts/import-proof-feedback.mjs`
- Modify: `docs/proof-flow/README.md`
- Modify: `.agents/skills/founder-led-discovery-spine/runbooks/wpatent-on-demand-operations.md`
- Modify: `.agents/skills/founder-led-discovery-spine/profiles/wpatent-proof-network.md`

- [ ] **Step 1: Extend the test with failing feedback-import expectations**

Update `tests/proof-flow-mixed-mode.test.mjs` to:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import proofFlow from "../scripts/lib/proof-flow.js";

const { importCommunityFeedback, loadWorkspace } = proofFlow;

test("importCommunityFeedback appends selected community signals to the founder workspace", () => {
  const workspace = {
    version: 1,
    tasks: [],
    assets: [],
    distributions: [],
    feedback: []
  };

  importCommunityFeedback(workspace, {
    packet_type: "community-feedback",
    asset_id: "asset-001",
    events: [
      {
        feedback_type: "community-mention",
        signal_strength: "medium",
        notes: "Mentioned in incubator member digest.",
        related_funding_stage: "pre-seed",
        source_channel: "member-digest",
        origin: "community"
      }
    ]
  });

  assert.equal(workspace.feedback.length, 1);
  assert.equal(workspace.feedback[0].distribution_id, "shared:asset-001");
  assert.equal(workspace.feedback[0].source_channel, "member-digest");
  assert.equal(workspace.feedback[0].origin, "community");
});

test("import-proof-feedback CLI writes selected shared feedback into the founder workspace", () => {
  const sandboxDir = mkdtempSync(join(tmpdir(), "proof-flow-feedback-"));
  const workspacePath = join(sandboxDir, "workspace.json");
  const packetPath = join(sandboxDir, "feedback.json");

  writeFileSync(
    workspacePath,
    JSON.stringify(
      {
        version: 1,
        tasks: [],
        assets: [],
        distributions: [],
        feedback: []
      },
      null,
      2
    )
  );

  writeFileSync(
    packetPath,
    JSON.stringify(
      {
        packet_type: "community-feedback",
        asset_id: "asset-001",
        events: [
          {
            feedback_type: "investor-interest",
            signal_strength: "high",
            notes: "Investor asked for a follow-up after seeing the founder post.",
            related_funding_stage: "pre-seed",
            source_channel: "incubator-newsletter",
            origin: "incubator"
          }
        ]
      },
      null,
      2
    )
  );

  execFileSync("node", [
    "scripts/import-proof-feedback.mjs",
    "--workspace",
    workspacePath,
    "--packet",
    packetPath
  ]);

  const workspace = loadWorkspace(workspacePath);
  assert.equal(workspace.feedback.length, 1);
  assert.equal(workspace.feedback[0].feedback_type, "investor-interest");
  assert.equal(workspace.feedback[0].origin, "incubator");
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
node --test tests/proof-flow-mixed-mode.test.mjs
```

Expected: FAIL because the feedback-import helper and CLI do not exist yet.

- [ ] **Step 3: Implement feedback import and mixed-mode doc wiring**

Update `scripts/lib/proof-flow.js` to:

```js
const { readFileSync, writeFileSync } = require("node:fs");

function loadWorkspace(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function saveWorkspace(filePath, workspace) {
  writeFileSync(filePath, `${JSON.stringify(workspace, null, 2)}\n`);
}

function loadCommunityWorkspace(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function saveCommunityWorkspace(filePath, workspace) {
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
    if (channel === "community-post") {
      return `## Community Post\n\n${asset.title}\n\nShare this proof with community context for ${asset.topic_cluster}.`;
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

function buildSharePacket({ workspace, assetId, channels, exportedAt }) {
  const asset = workspace.assets.find((item) => item.id === assetId);
  if (!asset || asset.status !== "approved") {
    throw new Error(`Approved asset not found for ${assetId}`);
  }

  return {
    packet_type: "proof-share",
    sync_id: `${asset.id}--${String(exportedAt).replace(/[:.]/g, "-")}`,
    asset_id: asset.id,
    title: asset.title,
    topic_cluster: asset.topic_cluster,
    claim: asset.claim,
    linked_page: asset.linked_page,
    approved_by: asset.approved_by || "",
    channels: channels.map((value) => String(value || "").trim()).filter(Boolean),
    packet_markdown: buildProofPacket(asset, channels),
    exported_at: exportedAt
  };
}

function applySharePacket(communityWorkspace, packet) {
  if (communityWorkspace.received_sync_ids.includes(packet.sync_id)) {
    return { communityWorkspace, duplicated: true };
  }

  communityWorkspace.received_sync_ids.push(packet.sync_id);
  communityWorkspace.shared_assets.push({
    sync_id: packet.sync_id,
    asset_id: packet.asset_id,
    title: packet.title,
    topic_cluster: packet.topic_cluster,
    claim: packet.claim,
    linked_page: packet.linked_page,
    approved_by: packet.approved_by,
    channels: packet.channels,
    packet_markdown: packet.packet_markdown,
    exported_at: packet.exported_at
  });

  return { communityWorkspace, duplicated: false };
}

function importCommunityFeedback(workspace, packet) {
  for (const event of packet.events) {
    workspace.feedback.push({
      id: nextId("feedback", workspace.feedback),
      distribution_id: `shared:${packet.asset_id}`,
      feedback_type: event.feedback_type,
      signal_strength: event.signal_strength,
      notes: event.notes,
      related_funding_stage: event.related_funding_stage || "",
      source_channel: event.source_channel || "",
      origin: event.origin || "community"
    });
  }

  return workspace;
}

module.exports = {
  approveAsset,
  applySharePacket,
  buildProofPacket,
  buildSharePacket,
  createProofTask,
  importCommunityFeedback,
  loadCommunityWorkspace,
  loadWorkspace,
  recordFeedback,
  registerDistributions,
  saveCommunityWorkspace,
  saveWorkspace,
  slugify
};
```

Create `scripts/import-proof-feedback.mjs` with:

```js
import { readFileSync } from "node:fs";
import proofFlow from "./lib/proof-flow.js";

const { importCommunityFeedback, loadWorkspace, saveWorkspace } = proofFlow;

function readArgs(argv) {
  const args = {};
  for (let index = 2; index < argv.length; index += 2) {
    args[argv[index]] = argv[index + 1];
  }
  return args;
}

const args = readArgs(process.argv);
const workspacePath = args["--workspace"] || "data/proof-flow/workspace.json";
const packetPath = args["--packet"];

const workspace = loadWorkspace(workspacePath);
const packet = JSON.parse(readFileSync(packetPath, "utf8"));
importCommunityFeedback(workspace, packet);
saveWorkspace(workspacePath, workspace);
console.log(`Imported ${packet.events.length} feedback event(s) for ${packet.asset_id}.`);
```

Update `docs/proof-flow/README.md` to:

```md
# Proof Flow

This folder documents a lightweight, human-in-the-loop Proof Flow MVP.

The MVP is compatible with the current W&Patent discovery framework:

- discovery and proof gaps can open proof tasks
- approved proof assets can link back to live topic pages
- routing and feedback can be reviewed alongside roadmap refreshes and early social-proof movement
- the private workspace can later become the founder-side instance in a mixed-mode system

The v1 workspace is founder-private by default.
Approved assets can then be routed outward into incubator or community channels.

## Mixed mode

- founder workspace: `data/proof-flow/workspace.json`
- community workspace: `data/proof-flow/community-workspace.json`
- outbox: `data/proof-flow/sync-outbox/`
- mixed-mode guide: `docs/proof-flow/mixed-mode.md`

## Commands

- `node scripts/create-proof-task.mjs ...`
- `node scripts/approve-proof-asset.mjs ...`
- `node scripts/build-proof-packet.mjs ...`
- `node scripts/record-proof-feedback.mjs ...`
- `node scripts/export-proof-sync.mjs ...`
- `node scripts/apply-proof-sync.mjs ...`
- `node scripts/import-proof-feedback.mjs ...`

## Workflow

1. Open a proof task from a real topic gap or proof gap.
2. Draft the proof asset from a template.
3. Review it manually before approval.
4. Build a routing packet for the right channels and communities.
5. Export the approved asset into the sync outbox.
6. Apply the sync packet to the community workspace.
7. Import selected community feedback back into the founder workspace.
```

Update `.agents/skills/founder-led-discovery-spine/runbooks/wpatent-on-demand-operations.md` to add:

```md
8. `docs/proof-flow/mixed-mode.md`

### 7. Mixed-Mode Sync Review

Use when the main question is:
`What should move from the private founder instance into the incubator layer, or back again?`

Expected outputs:

- whether the asset should stay private or sync outward
- whether the feedback should stay shared or sync back
- the exact sync packet or script to use next
- any privacy or approval gate that must be cleared first
```

Update `.agents/skills/founder-led-discovery-spine/profiles/wpatent-proof-network.md` to add:

```md
## Mixed-Mode Sync

When a proof asset is approved and should move into incubator or community circulation:

- export it with `scripts/export-proof-sync.mjs`
- apply it to the shared layer with `scripts/apply-proof-sync.mjs`
- import selected response signals back with `scripts/import-proof-feedback.mjs`
```

- [ ] **Step 4: Run the dedicated test and full suite**

Run:

```bash
node --test tests/proof-flow-mixed-mode.test.mjs
npm test
```

Expected:

- the feedback-import tests pass
- the full suite remains green

- [ ] **Step 5: Commit the feedback-import loop**

Run:

```bash
git add tests/proof-flow-mixed-mode.test.mjs scripts/lib/proof-flow.js scripts/import-proof-feedback.mjs docs/proof-flow/README.md .agents/skills/founder-led-discovery-spine/runbooks/wpatent-on-demand-operations.md .agents/skills/founder-led-discovery-spine/profiles/wpatent-proof-network.md
git commit -m "feat: add proof flow mixed mode feedback import"
```

## Spec Coverage Check

- `Private founder instance`: preserved by keeping `data/proof-flow/workspace.json` local and unchanged by community apply
- `Incubator community operating system`: implemented through `data/proof-flow/community-workspace.json`
- `Selective sync layer`: implemented through export, apply, and feedback-import packet flows
- `What stays private`: protected by only exporting approved assets
- `What can sync outward`: covered by the share-packet export and shared-workspace apply flow
- `What can sync back`: covered by selected community feedback packet import
- `Founder approval required`: preserved by requiring `approved` status before export
- `No forced centralization`: preserved by file-based packet exchange instead of live shared-state sync

## Self-Review

- The plan extends the Proof Flow MVP instead of re-implementing it.
- The mixed-mode layer stays deliberately file-based and human-reviewed.
- Tenancy, auth, permissions, and conflict resolution stay deferred, matching the architecture note.
- Each task produces a working slice: scaffold, export, apply, feedback import.
