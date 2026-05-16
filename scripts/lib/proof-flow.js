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
