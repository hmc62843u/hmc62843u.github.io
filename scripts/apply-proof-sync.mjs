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
