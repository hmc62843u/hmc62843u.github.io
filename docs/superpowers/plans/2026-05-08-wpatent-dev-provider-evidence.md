# W&Patent Dev Provider Evidence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the prompt-evidence runner so it supports `openai_web_search`, `opencode_dev`, and `kilocode_dev` as explicit development providers while keeping `perplexity` as the production-safe default evidence source.

**Architecture:** Keep the current append-only CSV pipeline and add a small provider abstraction inside `scripts/run-prompt-evidence.mjs`. The runner should default to `perplexity` only, support a single `--include-dev` switch, and preserve provenance entirely through the existing `system` and `notes` fields without changing the CSV schema.

**Tech Stack:** Node.js ESM runner, CommonJS helper module, CSV append workflow, local CLI execution via `child_process`, existing `npm test` suite

---

## File Structure

- Modify: `scripts/run-prompt-evidence.mjs`
  - replace the fixed provider loop with a provider list
  - add `--include-dev`
  - add CLI-backed adapters for `opencode_dev` and `kilocode_dev`
  - keep `perplexity` as the default production-safe provider

- Modify: `docs/scorecards/README.md`
  - document production vs development providers clearly

- Modify: `tests/prompt-evidence.test.mjs`
  - protect the new default behavior, dev flag support, provider names, and CLI adapter expectations

### Task 1: Lock the provider contract in tests

**Files:**
- Modify: `tests/prompt-evidence.test.mjs`
- Test: `tests/prompt-evidence.test.mjs`

- [ ] **Step 1: Read the current prompt-evidence tests**

Run:

```bash
sed -n '1,260p' tests/prompt-evidence.test.mjs
```

Expected: the file covers prompt loading, CSV header shape, and current runner contract strings.

- [ ] **Step 2: Add failing assertions for the new provider behavior**

Update `tests/prompt-evidence.test.mjs` so it includes checks like:

```js
test("runner defaults to perplexity only and supports dev providers", () => {
  const script = readFileSync("scripts/run-prompt-evidence.mjs", "utf8");
  assert.match(script, /--include-dev/);
  assert.match(script, /perplexity/);
  assert.match(script, /openai_web_search/);
  assert.match(script, /opencode_dev/);
  assert.match(script, /kilocode_dev/);
});

test("scorecard docs describe production and development providers", () => {
  const readme = readFileSync("docs/scorecards/README.md", "utf8");
  assert.match(readme, /perplexity.*production evidence source/i);
  assert.match(readme, /openai_web_search.*development/i);
  assert.match(readme, /opencode_dev.*development/i);
  assert.match(readme, /kilocode_dev.*development/i);
});
```

Also add one test that asserts the script references CLI execution helpers:

```js
test("runner includes CLI-based dev provider handling", () => {
  const script = readFileSync("scripts/run-prompt-evidence.mjs", "utf8");
  assert.match(script, /execFile/);
  assert.match(script, /opencode/);
  assert.match(script, /kilocode/);
});
```

- [ ] **Step 3: Run the focused tests to verify they fail**

Run:

```bash
npm test -- --test-name-pattern "prompt-evidence"
```

Expected: FAIL because the current runner does not yet contain `--include-dev`, `opencode_dev`, or `kilocode_dev`.

- [ ] **Step 4: Commit the failing-test checkpoint**

```bash
git add tests/prompt-evidence.test.mjs
git commit -m "test: cover dev provider evidence runner contract"
```

### Task 2: Implement provider selection and dev CLI adapters

**Files:**
- Modify: `scripts/run-prompt-evidence.mjs`
- Test: `tests/prompt-evidence.test.mjs`

- [ ] **Step 1: Read the current runner and map the changes**

Run:

```bash
sed -n '1,260p' scripts/run-prompt-evidence.mjs
```

Expected: a fixed nested loop over `perplexity` and `openai_web_search`.

- [ ] **Step 2: Replace the fixed provider loop with provider helpers**

Update `scripts/run-prompt-evidence.mjs` so it follows this shape:

```js
import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { fileURLToPath } from "node:url";
import promptEvidence from "./lib/prompt-evidence.js";

const execFileAsync = promisify(execFile);
const { buildRow, csvEscape } = promptEvidence;
```

Add a simple CLI flag parser:

```js
function parseArgs(argv) {
  return {
    includeDev: argv.includes("--include-dev")
  };
}
```

Add provider-list selection:

```js
function buildProviders({ includeDev, perplexityKey, openAIKey }) {
  const providers = [
    { system: "perplexity", run: (prompt) => runPerplexity(prompt, perplexityKey) }
  ];

  if (includeDev) {
    providers.push(
      { system: "openai_web_search", run: (prompt) => runOpenAI(prompt, openAIKey) },
      { system: "opencode_dev", run: runOpenCode },
      { system: "kilocode_dev", run: runKiloCode }
    );
  }

  return providers;
}
```

Add CLI-backed dev adapters:

```js
async function runOpenCode(prompt) {
  const { stdout } = await execFileAsync("opencode", ["run", prompt], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024
  });
  return {
    answerText: stdout.trim(),
    citations: [],
    notes: "dev provider run; citations unavailable"
  };
}

async function runKiloCode(prompt) {
  const { stdout } = await execFileAsync("kilocode", ["run", "--auto", prompt], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024
  });
  return {
    answerText: stdout.trim(),
    citations: [],
    notes: "dev provider run; citations unavailable"
  };
}
```

Handle missing CLI tools gracefully:

```js
function isMissingCommandError(error) {
  return error && typeof error === "object" && error.code === "ENOENT";
}
```

In the provider loop, convert missing-command failures into skipped rows with notes:

```js
const note = isMissingCommandError(error)
  ? `${system} run skipped: command not found`
  : error instanceof Error
    ? error.message
    : String(error);
```

Ensure `openai_web_search` only runs when `--include-dev` is set, not by default.

- [ ] **Step 3: Run the focused tests to verify they pass**

Run:

```bash
npm test -- --test-name-pattern "prompt-evidence"
```

Expected: PASS for the prompt-evidence contract tests.

- [ ] **Step 4: Commit the provider-runner implementation**

```bash
git add scripts/run-prompt-evidence.mjs tests/prompt-evidence.test.mjs
git commit -m "feat: add dev providers to prompt evidence runner"
```

### Task 3: Update scorecard documentation and verify the full suite

**Files:**
- Modify: `docs/scorecards/README.md`
- Test: `tests/prompt-evidence.test.mjs`

- [ ] **Step 1: Update the scorecards README to explain provider provenance**

Modify `docs/scorecards/README.md` to include language like:

```md
## Provider policy

- `perplexity` rows are the main production evidence source for the Trust Chain scorecard.
- `openai_web_search`, `opencode_dev`, and `kilocode_dev` rows are development or comparison outputs unless explicitly promoted later.
- The default prompt-evidence command stays production-safe by running `perplexity` only.
- Use `--include-dev` when you want to compare development providers or test the pipeline locally.
```

Keep the existing file inventory and update routine intact.

- [ ] **Step 2: Run the full test suite**

Run:

```bash
npm test
```

Expected: PASS with the full suite green.

- [ ] **Step 3: Manually inspect the updated runner contract**

Run:

```bash
sed -n '1,320p' scripts/run-prompt-evidence.mjs
```

Expected: the script clearly shows:

- `perplexity` as the default provider
- `--include-dev`
- `openai_web_search`
- `opencode_dev`
- `kilocode_dev`
- graceful handling for missing local CLIs

- [ ] **Step 4: Commit the documentation and verification checkpoint**

```bash
git add docs/scorecards/README.md scripts/run-prompt-evidence.mjs tests/prompt-evidence.test.mjs
git commit -m "docs: document dev provider evidence policy"
```

## Self-Review Checklist

- Spec coverage:
  - provider model: covered in Task 2
  - default production-safe behavior: covered in Task 2 and Task 3
  - unchanged CSV schema and provenance through `system` and `notes`: preserved by Task 2
  - README clarification: covered in Task 3
  - test protection: covered in Task 1 and Task 2

- Placeholder scan:
  - no `TBD`, `TODO`, or hand-wavy implementation steps remain

- Type consistency:
  - provider names stay consistent across spec, code, tests, and docs:
    - `perplexity`
    - `openai_web_search`
    - `opencode_dev`
    - `kilocode_dev`
