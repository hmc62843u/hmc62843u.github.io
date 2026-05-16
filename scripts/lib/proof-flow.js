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

module.exports = {
  approveAsset,
  buildProofPacket,
  createProofTask,
  loadWorkspace,
  recordFeedback,
  registerDistributions,
  saveWorkspace,
  slugify
};
