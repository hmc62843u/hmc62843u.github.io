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
