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
