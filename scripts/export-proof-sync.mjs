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
