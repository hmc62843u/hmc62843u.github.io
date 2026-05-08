# W&Patent Exa Provider Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Exa as an explicit production-style comparison provider in the prompt-evidence runner while keeping `perplexity` as the default benchmark and preserving the existing CSV schema.

**Architecture:** Extend the existing provider-selection flow in `scripts/run-prompt-evidence.mjs` with a new `--include-exa` flag and an `exa_answer` adapter that calls Exa’s Answer API. Keep the rollout narrow: no `.env`, no schema changes, and no change to the default `perplexity`-only behavior.

**Tech Stack:** Node.js ESM runner, built-in `fetch`, existing CSV append flow, existing Node test suite, markdown docs

---

## File Structure

- Modify: `scripts/run-prompt-evidence.mjs`
  - add `EXA_API_KEY` support
  - add `--include-exa`
  - add `runExaAnswer()`
  - include `exa_answer` in provider selection when explicitly requested

- Modify: `tests/prompt-evidence.test.mjs`
  - assert the Exa env var, flag, host, and provider label are present
  - assert docs/provider policy mention Exa correctly

- Modify: `docs/scorecards/README.md`
  - document `exa_answer` as a production comparison source
  - describe `--include-exa`

### Task 1: Lock the Exa contract in tests

**Files:**
- Modify: `tests/prompt-evidence.test.mjs`
- Test: `tests/prompt-evidence.test.mjs`

- [ ] **Step 1: Read the current prompt-evidence tests**

Run:

```bash
sed -n '1,260p' tests/prompt-evidence.test.mjs
```

Expected: the file covers provider policy, runner env vars, dev providers, and append-only CSV behavior, but does not yet mention Exa.

- [ ] **Step 2: Add failing assertions for Exa support**

Update `tests/prompt-evidence.test.mjs` so it includes checks like:

```js
test("scorecard docs describe Exa as a production comparison provider", () => {
  const readme = read("docs/scorecards/README.md");
  assert.match(readme, /exa_answer.*production comparison source/i);
  assert.match(readme, /--include-exa/i);
});

test("runner supports explicit Exa comparison runs", () => {
  const runner = read("scripts/run-prompt-evidence.mjs");
  assert.match(runner, /EXA_API_KEY/);
  assert.match(runner, /--include-exa/);
  assert.match(runner, /exa_answer/);
  assert.match(runner, /api\\.exa\\.ai/i);
});
```

Also extend the existing provider checks to expect Exa in the runner contract.

- [ ] **Step 3: Run the focused prompt-evidence tests to verify they fail**

Run:

```bash
npm test -- --test-name-pattern "prompt-evidence"
```

Expected: FAIL because the runner and README do not yet include `EXA_API_KEY`, `--include-exa`, or `exa_answer`.

- [ ] **Step 4: Commit the failing-test checkpoint**

```bash
git add tests/prompt-evidence.test.mjs
git commit -m "test: cover exa prompt evidence provider contract"
```

### Task 2: Implement the Exa provider in the runner

**Files:**
- Modify: `scripts/run-prompt-evidence.mjs`
- Test: `tests/prompt-evidence.test.mjs`

- [ ] **Step 1: Read the current runner in context**

Run:

```bash
sed -n '1,340p' scripts/run-prompt-evidence.mjs
```

Expected: the runner currently supports `perplexity`, `openai_web_search`, `opencode_dev`, and `kilocode_dev`, with only `--include-dev` as a flag.

- [ ] **Step 2: Extend argument parsing and add Exa env handling**

Update the arg parser to include Exa:

```js
function parseArgs(argv) {
  return {
    includeDev: argv.includes("--include-dev"),
    includeExa: argv.includes("--include-exa")
  };
}
```

Keep `PERPLEXITY_API_KEY` required only for the `perplexity` provider, and use `optionalEnv("EXA_API_KEY")` for Exa.

- [ ] **Step 3: Add the Exa Answer API adapter**

Add a function like:

```js
async function runExaAnswer(prompt, apiKey) {
  const response = await fetch("https://api.exa.ai/answer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey
    },
    body: JSON.stringify({
      query: prompt,
      text: true
    })
  });

  if (!response.ok) {
    throw new Error(`Exa request failed: ${response.status}`);
  }

  const data = await response.json();
  const citations = Array.isArray(data.citations)
    ? data.citations
        .map((citation) =>
          typeof citation === "string"
            ? citation
            : citation?.url || citation?.link || citation?.source || ""
        )
        .filter(Boolean)
    : [];

  return {
    answerText: data.answer || "",
    citations,
    notes: "exa comparison run"
  };
}
```

This keeps the adapter tolerant of citation shape differences without changing the shared row builder.

- [ ] **Step 4: Include Exa in provider selection only when explicitly requested**

Update `buildProviders()` so it follows this shape:

```js
function buildProviders({ includeDev, includeExa, openAIKey, exaKey, prompt }) {
  const providers = [
    {
      system: "perplexity",
      run: () => runPerplexity(prompt, requireEnv("PERPLEXITY_API_KEY"))
    }
  ];

  if (includeExa) {
    if (exaKey) {
      providers.push({
        system: "exa_answer",
        run: () => runExaAnswer(prompt, exaKey)
      });
    } else {
      providers.push({
        system: "exa_answer",
        run: async () => {
          throw new Error("exa_answer run skipped: EXA_API_KEY not configured");
        }
      });
    }
  }

  if (!includeDev) {
    return providers;
  }

  // existing OpenAI + local dev providers remain here
}
```

Then update `main()` to pass `includeExa` and `exaKey` into `buildProviders()`.

- [ ] **Step 5: Run the focused prompt-evidence tests to verify they pass**

Run:

```bash
npm test -- --test-name-pattern "prompt-evidence"
```

Expected: PASS for the prompt-evidence contract tests, including the new Exa assertions.

- [ ] **Step 6: Commit the runner implementation**

```bash
git add scripts/run-prompt-evidence.mjs tests/prompt-evidence.test.mjs
git commit -m "feat: add exa prompt evidence provider"
```

### Task 3: Update provider policy docs and verify the full suite

**Files:**
- Modify: `docs/scorecards/README.md`
- Test: `tests/prompt-evidence.test.mjs`

- [ ] **Step 1: Update the scorecards README provider policy**

Modify `docs/scorecards/README.md` so the provider policy includes language like:

```md
- `perplexity` rows are the main production evidence source for the Trust Chain scorecard.
- `exa_answer` rows are a production comparison source.
- `openai_web_search` rows are comparison or development outputs unless explicitly promoted later.
- `opencode_dev` and `kilocode_dev` rows are development or public-site simulation outputs.
- The default prompt-evidence command stays production-safe by running `perplexity` only.
- Use `--include-exa` when you want to compare Exa against the production benchmark.
- Use `--include-dev` when you want to compare development providers or test the pipeline locally.
```

Keep the rest of the README intact.

- [ ] **Step 2: Run the full test suite**

Run:

```bash
npm test
```

Expected: PASS with the full suite green.

- [ ] **Step 3: Manually inspect the updated runner contract**

Run:

```bash
sed -n '1,360p' scripts/run-prompt-evidence.mjs
```

Expected: the script clearly shows:

- `--include-exa`
- `EXA_API_KEY`
- `system: "exa_answer"`
- `https://api.exa.ai/answer`
- graceful missing-key handling for Exa
- unchanged default `perplexity` behavior

- [ ] **Step 4: Commit the documentation checkpoint**

```bash
git add docs/scorecards/README.md scripts/run-prompt-evidence.mjs tests/prompt-evidence.test.mjs
git commit -m "docs: document exa prompt evidence policy"
```

## Self-Review Checklist

- Spec coverage:
  - Exa behind explicit flag: covered in Task 2
  - `EXA_API_KEY` support: covered in Task 2
  - `exa_answer` as production comparison source: covered in Task 2 and Task 3
  - no schema changes and no default-behavior change: preserved by all tasks

- Placeholder scan:
  - no `TBD`, `TODO`, or vague implementation steps remain

- Type consistency:
  - provider labels stay consistent across spec, code, tests, and docs:
    - `perplexity`
    - `exa_answer`
    - `openai_web_search`
    - `opencode_dev`
    - `kilocode_dev`
