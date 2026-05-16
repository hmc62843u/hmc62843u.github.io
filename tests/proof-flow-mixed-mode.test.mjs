import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import proofFlow from "../scripts/lib/proof-flow.js";

const { applySharePacket, buildSharePacket, loadCommunityWorkspace, loadWorkspace } = proofFlow;

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
