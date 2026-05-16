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
