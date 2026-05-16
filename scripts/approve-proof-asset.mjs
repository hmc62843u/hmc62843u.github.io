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
