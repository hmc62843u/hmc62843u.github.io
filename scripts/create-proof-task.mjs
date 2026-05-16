import proofFlow from "./lib/proof-flow.js";

const { createProofTask, loadWorkspace, saveWorkspace } = proofFlow;

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

const result = createProofTask({
  workspace,
  topicCluster: args["--topic-cluster"],
  assetType: args["--asset-type"],
  title: args["--title"],
  claim: args["--claim"],
  linkedPage: args["--linked-page"],
  frameworkSource: args["--framework-source"]
});

saveWorkspace(workspacePath, result.workspace);
console.log(
  `Created ${result.task.id} and ${result.asset.id} for topic cluster "${result.task.topic_cluster}".`
);
