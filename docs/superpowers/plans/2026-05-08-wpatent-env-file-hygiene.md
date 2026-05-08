# W&Patent Env File Hygiene Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add minimal `.env` hygiene to the repo so local prompt-evidence runs can use Node’s native `--env-file` support safely without changing runner logic or adding dependencies.

**Architecture:** Keep the runner unchanged and add only three pieces around it: a root `.gitignore` for local env files, a tracked `.env.example` for expected keys, and a short usage note in `docs/scorecards/README.md`. Use Node’s built-in env-file flags rather than automatic loading inside the code.

**Tech Stack:** Git ignore rules, plain text example env file, markdown docs, existing Node runtime support

---

## File Structure

- Create: `.gitignore`
  - ignore `.env`, `.env.local`, and `.env.*`
  - preserve `.env.example`

- Create: `.env.example`
  - placeholder keys for Exa, Perplexity, and OpenAI

- Modify: `docs/scorecards/README.md`
  - add a short local env file section with native Node commands

### Task 1: Lock the env-file contract in tests

**Files:**
- Modify: `tests/prompt-evidence.test.mjs`
- Test: `tests/prompt-evidence.test.mjs`

- [ ] **Step 1: Read the current prompt-evidence tests**

Run:

```bash
sed -n '1,260p' tests/prompt-evidence.test.mjs
```

Expected: the file covers provider policy and runner contract, but does not yet mention `.env.example`, `.gitignore`, or native `--env-file` usage.

- [ ] **Step 2: Add failing assertions for env-file hygiene**

Update `tests/prompt-evidence.test.mjs` with checks like:

```js
test("env file hygiene assets are documented", () => {
  assert.equal(existsSync(new URL("../.env.example", import.meta.url)), true);
  assert.equal(existsSync(new URL("../.gitignore", import.meta.url)), true);

  const example = read(".env.example");
  const ignore = read(".gitignore");
  const readme = read("docs/scorecards/README.md");

  assert.match(example, /EXA_API_KEY=/);
  assert.match(example, /PERPLEXITY_API_KEY=/);
  assert.match(example, /OPENAI_API_KEY=/);
  assert.match(ignore, /\\.env/);
  assert.match(ignore, /\\.env\\.local/);
  assert.match(ignore, /!\\.env\\.example/);
  assert.match(readme, /--env-file=.env.local/);
  assert.match(readme, /--env-file-if-exists=.env.local/);
});
```

Keep the test focused on the presence and documentation of the env-file workflow.

- [ ] **Step 3: Run the focused prompt-evidence tests to verify they fail**

Run:

```bash
npm test -- --test-name-pattern "prompt-evidence"
```

Expected: FAIL because `.env.example`, `.gitignore`, and the README env-file note do not yet exist.

- [ ] **Step 4: Commit the failing-test checkpoint**

```bash
git add tests/prompt-evidence.test.mjs
git commit -m "test: cover env file hygiene assets"
```

### Task 2: Add `.env` hygiene files

**Files:**
- Create: `.gitignore`
- Create: `.env.example`
- Test: `tests/prompt-evidence.test.mjs`

- [ ] **Step 1: Create the root `.gitignore`**

Create `.gitignore` with:

```gitignore
.env
.env.local
.env.*
!.env.example
```

Keep it minimal and focused on the local env use case.

- [ ] **Step 2: Create `.env.example`**

Create `.env.example` with:

```bash
EXA_API_KEY=
PERPLEXITY_API_KEY=
OPENAI_API_KEY=
```

Do not add real values.

- [ ] **Step 3: Run the focused prompt-evidence tests again**

Run:

```bash
npm test -- --test-name-pattern "prompt-evidence"
```

Expected: still FAIL until the README documents the usage commands.

- [ ] **Step 4: Commit the new env files**

```bash
git add .gitignore .env.example tests/prompt-evidence.test.mjs
git commit -m "chore: add local env file hygiene assets"
```

### Task 3: Document native env-file usage and verify the full suite

**Files:**
- Modify: `docs/scorecards/README.md`
- Test: `tests/prompt-evidence.test.mjs`

- [ ] **Step 1: Add a short local env file section to the scorecards README**

Modify `docs/scorecards/README.md` to include a section like:

```md
## Local env file

You can store local API keys in `.env.local` and use Node's built-in env loading:

```bash
node --env-file=.env.local scripts/run-prompt-evidence.mjs --include-exa
```

Or, if you want the file to be optional:

```bash
node --env-file-if-exists=.env.local scripts/run-prompt-evidence.mjs --include-exa
```

Expected keys:

- `EXA_API_KEY`
- `PERPLEXITY_API_KEY`
- `OPENAI_API_KEY`
```

Keep this section short and practical.

- [ ] **Step 2: Run the focused prompt-evidence tests to verify they pass**

Run:

```bash
npm test -- --test-name-pattern "prompt-evidence"
```

Expected: PASS for the env-file hygiene assertions and the existing prompt-evidence contract tests.

- [ ] **Step 3: Run the full test suite**

Run:

```bash
npm test
```

Expected: PASS with the full suite green.

- [ ] **Step 4: Check the final worktree state**

Run:

```bash
git status --short
```

Expected: only the intended env-file hygiene changes and any already-known unrelated files remain.

- [ ] **Step 5: Commit the docs checkpoint**

```bash
git add .gitignore .env.example docs/scorecards/README.md tests/prompt-evidence.test.mjs
git commit -m "docs: add env file usage notes"
```

## Self-Review Checklist

- Spec coverage:
  - `.gitignore` support: covered in Task 2
  - `.env.example`: covered in Task 2
  - README note: covered in Task 3
  - no runner changes and no dependencies: preserved by all tasks

- Placeholder scan:
  - no `TBD`, `TODO`, or vague implementation steps remain

- Type consistency:
  - env keys stay consistent across files and docs:
    - `EXA_API_KEY`
    - `PERPLEXITY_API_KEY`
    - `OPENAI_API_KEY`
