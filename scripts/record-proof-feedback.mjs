import proofFlow from "./lib/proof-flow.js";

const { loadWorkspace, recordFeedback, saveWorkspace } = proofFlow;

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

const event = recordFeedback(workspace, {
  distributionId: args["--distribution-id"],
  feedbackType: args["--feedback-type"],
  signalStrength: args["--signal-strength"],
  notes: args["--notes"],
  relatedFundingStage: args["--related-funding-stage"]
});

saveWorkspace(workspacePath, workspace);
console.log(`Recorded ${event.id} for ${event.distribution_id}.`);
