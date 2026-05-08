# W&Patent Prompt Evidence Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a lightweight prompt-evidence automation flow that reads a fixed W&Patent prompt set, runs it against Perplexity and OpenAI web search, and appends normalized rows to a raw CSV log.

**Architecture:** Create a documentation-first evidence pipeline with a prompt source file in `docs/scorecards/`, a raw CSV output file in the same folder, a small Node runner in `scripts/`, and a focused test file that protects prompt loading plus normalization logic without making live API calls. Keep judgment fields manual and preserve append-only raw evidence.

**Tech Stack:** Node 23, `.mjs` entry script, CommonJS helper module, built-in `node:test`, CSV file output, Perplexity API, OpenAI Responses API

---

### Task 1: Scaffold prompt-source and raw-log contracts

**Files:**
- Create: `tests/prompt-evidence.test.mjs`
- Create: `docs/scorecards/prompts.txt`
- Create: `docs/scorecards/2026-05-08-wpatent-prompt-runs.csv`
- Modify: `docs/scorecards/README.md`

- [ ] **Step 1: Write the failing contract test**

Create `tests/prompt-evidence.test.mjs` with:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

function read(relativePath) {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("prompt evidence assets expose the fixed prompt set and raw CSV header", () => {
  assert.equal(existsSync(new URL("../docs/scorecards/prompts.txt", import.meta.url)), true);
  assert.equal(
    existsSync(new URL("../docs/scorecards/2026-05-08-wpatent-prompt-runs.csv", import.meta.url)),
    true
  );

  const prompts = read("docs/scorecards/prompts.txt");
  const csv = read("docs/scorecards/2026-05-08-wpatent-prompt-runs.csv");

  for (const fragment of [
    "patent strategy for startups",
    "startup defensibility through patents",
    "patent commercialization for founders",
    "entity authority for AI search"
  ]) {
    assert.match(prompts, new RegExp(fragment.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&"), "i"));
  }

  assert.match(
    csv,
    /timestamp,system,prompt,answer_summary,wpatent_mentioned,wpatent_cited,cited_page,andrew_named,andrew_role_correct,positioning_aligned,citation_urls,notes/i
  );
});

test("scorecards README documents the prompt evidence artifacts", () => {
  const readme = read("docs/scorecards/README.md");
  assert.match(readme, /prompts\.txt/i);
  assert.match(readme, /prompt-runs\.csv/i);
  assert.match(readme, /append/i);
});
```

- [ ] **Step 2: Run the new test and verify it fails**

Run:

```bash
node --test tests/prompt-evidence.test.mjs
```

Expected: FAIL because the prompt file, raw CSV file, and README references do not exist yet.

- [ ] **Step 3: Create the prompt file, CSV header, and README references**

Create `docs/scorecards/prompts.txt` with:

```txt
patent strategy for startups
startup defensibility through patents
patent commercialization for founders
founder-led authority building
AI-readable company website
trust chain for websites
how founders build credibility online
patent advisory for startup founders
founder identity and company authority
entity authority for AI search
```

Create `docs/scorecards/2026-05-08-wpatent-prompt-runs.csv` with:

```csv
timestamp,system,prompt,answer_summary,wpatent_mentioned,wpatent_cited,cited_page,andrew_named,andrew_role_correct,positioning_aligned,citation_urls,notes
```

Update `docs/scorecards/README.md` to:

```md
# Scorecards

This folder holds internal before/after measurement assets for the W&Patent Trust Chain scorecard.

## Files

- `2026-05-07-wpatent-trust-chain-scorecard.md`: shareable summary dashboard for the Trust Chain rework
- `2026-05-07-wpatent-trust-chain-scorecard.csv`: detailed worksheet for evidence rows, prompt checks, and source notes
- `prompts.txt`: fixed prompt set for AI evidence collection
- `2026-05-08-wpatent-prompt-runs.csv`: append-only raw log for prompt-run evidence

## Update routine

1. Run `npm test` to make sure the site and scorecard contract are green.
2. Reuse the fixed Trust Chain prompt set before and after changes.
3. Pull structural facts from the repo, then pull live evidence from Search Console, GA, and manual AI prompt checks.
4. Append new prompt-run rows to `2026-05-08-wpatent-prompt-runs.csv`.
5. Update the markdown summary and the scorecard CSV after the new raw evidence is reviewed.
6. Commit the scorecard files together so the measurement snapshot stays versioned.
```

- [ ] **Step 4: Run the dedicated test and full suite**

Run:

```bash
node --test tests/prompt-evidence.test.mjs
npm test
```

Expected:

- the new prompt-evidence test passes
- the full suite passes with `48` tests total

- [ ] **Step 5: Commit the scaffolding**

Run:

```bash
git add tests/prompt-evidence.test.mjs docs/scorecards/prompts.txt docs/scorecards/2026-05-08-wpatent-prompt-runs.csv docs/scorecards/README.md
git commit -m "docs: scaffold prompt evidence assets"
```

### Task 2: Add normalization helpers and unit tests

**Files:**
- Modify: `tests/prompt-evidence.test.mjs`
- Create: `scripts/lib/prompt-evidence.js`

- [ ] **Step 1: Extend the test with failing helper expectations**

Update `tests/prompt-evidence.test.mjs` to:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import {
  buildRow,
  csvEscape,
  extractFirstWpatentCitation,
  normalizeCitations
} from "../scripts/lib/prompt-evidence.js";

function read(relativePath) {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("prompt evidence assets expose the fixed prompt set and raw CSV header", () => {
  assert.equal(existsSync(new URL("../docs/scorecards/prompts.txt", import.meta.url)), true);
  assert.equal(
    existsSync(new URL("../docs/scorecards/2026-05-08-wpatent-prompt-runs.csv", import.meta.url)),
    true
  );

  const prompts = read("docs/scorecards/prompts.txt");
  const csv = read("docs/scorecards/2026-05-08-wpatent-prompt-runs.csv");

  for (const fragment of [
    "patent strategy for startups",
    "startup defensibility through patents",
    "patent commercialization for founders",
    "entity authority for AI search"
  ]) {
    assert.match(prompts, new RegExp(fragment.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&"), "i"));
  }

  assert.match(
    csv,
    /timestamp,system,prompt,answer_summary,wpatent_mentioned,wpatent_cited,cited_page,andrew_named,andrew_role_correct,positioning_aligned,citation_urls,notes/i
  );
});

test("scorecards README documents the prompt evidence artifacts", () => {
  const readme = read("docs/scorecards/README.md");
  assert.match(readme, /prompts\.txt/i);
  assert.match(readme, /prompt-runs\.csv/i);
  assert.match(readme, /append/i);
});

test("normalization helpers identify W&Patent and Andrew signals", () => {
  const citations = normalizeCitations([
    "https://wpatent.com/trust-chain-explainer.htm",
    "https://example.com/reference"
  ]);

  assert.deepEqual(citations, [
    "https://wpatent.com/trust-chain-explainer.htm",
    "https://example.com/reference"
  ]);
  assert.equal(
    extractFirstWpatentCitation(citations),
    "https://wpatent.com/trust-chain-explainer.htm"
  );

  const row = buildRow({
    timestamp: "2026-05-08T00:00:00.000Z",
    system: "perplexity",
    prompt: "trust chain for websites",
    answerText:
      "Andrew Leung explains how W&Patent uses the Trust Chain for founder-led authority.",
    citations
  });

  assert.equal(row.timestamp, "2026-05-08T00:00:00.000Z");
  assert.equal(row.system, "perplexity");
  assert.equal(row.wpatent_mentioned, "yes");
  assert.equal(row.wpatent_cited, "yes");
  assert.equal(row.cited_page, "https://wpatent.com/trust-chain-explainer.htm");
  assert.equal(row.andrew_named, "yes");
  assert.equal(row.andrew_role_correct, "manual");
  assert.equal(row.positioning_aligned, "manual");
  assert.equal(
    row.citation_urls,
    "https://wpatent.com/trust-chain-explainer.htm|https://example.com/reference"
  );
});

test("csvEscape quotes commas and quotes safely", () => {
  assert.equal(csvEscape("simple"), "simple");
  assert.equal(csvEscape("alpha,beta"), "\"alpha,beta\"");
  assert.equal(csvEscape("say \"hello\""), "\"say \"\"hello\"\"\"");
});
```

- [ ] **Step 2: Run the dedicated test and verify it fails**

Run:

```bash
node --test tests/prompt-evidence.test.mjs
```

Expected: FAIL because `scripts/lib/prompt-evidence.js` does not exist yet.

- [ ] **Step 3: Implement the normalization helper module**

Create `scripts/lib/prompt-evidence.js` with:

```js
function normalizeCitations(citations) {
  return (citations || [])
    .map((value) => String(value || "").trim())
    .filter(Boolean);
}

function extractFirstWpatentCitation(citations) {
  return normalizeCitations(citations).find((value) => value.includes("wpatent.com")) || "";
}

function summarizeAnswer(answerText) {
  return String(answerText || "").replace(/\s+/g, " ").trim().slice(0, 280);
}

function csvEscape(value) {
  const stringValue = String(value ?? "");
  if (!/[",\n]/.test(stringValue)) {
    return stringValue;
  }
  return `"${stringValue.replace(/"/g, "\"\"")}"`;
}

function buildRow({ timestamp, system, prompt, answerText, citations, notes = "" }) {
  const normalizedCitations = normalizeCitations(citations);
  const citedPage = extractFirstWpatentCitation(normalizedCitations);
  const answer = String(answerText || "");

  return {
    timestamp,
    system,
    prompt,
    answer_summary: summarizeAnswer(answer),
    wpatent_mentioned: /w&patent|wpatent/i.test(answer) ? "yes" : "no",
    wpatent_cited: citedPage ? "yes" : "no",
    cited_page: citedPage,
    andrew_named: /andrew leung/i.test(answer) ? "yes" : "no",
    andrew_role_correct: "manual",
    positioning_aligned: "manual",
    citation_urls: normalizedCitations.join("|"),
    notes
  };
}

module.exports = {
  buildRow,
  csvEscape,
  extractFirstWpatentCitation,
  normalizeCitations
};
```

- [ ] **Step 4: Run the dedicated test and full suite**

Run:

```bash
node --test tests/prompt-evidence.test.mjs
npm test
```

Expected:

- the helper tests pass
- the full suite passes with `50` tests total

- [ ] **Step 5: Commit the helper module**

Run:

```bash
git add tests/prompt-evidence.test.mjs scripts/lib/prompt-evidence.js
git commit -m "feat: add prompt evidence normalization helpers"
```

### Task 3: Add the prompt runner entry script

**Files:**
- Modify: `tests/prompt-evidence.test.mjs`
- Create: `scripts/run-prompt-evidence.mjs`

- [ ] **Step 1: Extend the test with a failing runner contract**

Update `tests/prompt-evidence.test.mjs` to:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import {
  buildRow,
  csvEscape,
  extractFirstWpatentCitation,
  normalizeCitations
} from "../scripts/lib/prompt-evidence.js";

function read(relativePath) {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("prompt evidence assets expose the fixed prompt set and raw CSV header", () => {
  assert.equal(existsSync(new URL("../docs/scorecards/prompts.txt", import.meta.url)), true);
  assert.equal(
    existsSync(new URL("../docs/scorecards/2026-05-08-wpatent-prompt-runs.csv", import.meta.url)),
    true
  );

  const prompts = read("docs/scorecards/prompts.txt");
  const csv = read("docs/scorecards/2026-05-08-wpatent-prompt-runs.csv");

  for (const fragment of [
    "patent strategy for startups",
    "startup defensibility through patents",
    "patent commercialization for founders",
    "entity authority for AI search"
  ]) {
    assert.match(prompts, new RegExp(fragment.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&"), "i"));
  }

  assert.match(
    csv,
    /timestamp,system,prompt,answer_summary,wpatent_mentioned,wpatent_cited,cited_page,andrew_named,andrew_role_correct,positioning_aligned,citation_urls,notes/i
  );
});

test("scorecards README documents the prompt evidence artifacts", () => {
  const readme = read("docs/scorecards/README.md");
  assert.match(readme, /prompts\.txt/i);
  assert.match(readme, /prompt-runs\.csv/i);
  assert.match(readme, /append/i);
});

test("normalization helpers identify W&Patent and Andrew signals", () => {
  const citations = normalizeCitations([
    "https://wpatent.com/trust-chain-explainer.htm",
    "https://example.com/reference"
  ]);

  assert.deepEqual(citations, [
    "https://wpatent.com/trust-chain-explainer.htm",
    "https://example.com/reference"
  ]);
  assert.equal(
    extractFirstWpatentCitation(citations),
    "https://wpatent.com/trust-chain-explainer.htm"
  );

  const row = buildRow({
    timestamp: "2026-05-08T00:00:00.000Z",
    system: "perplexity",
    prompt: "trust chain for websites",
    answerText:
      "Andrew Leung explains how W&Patent uses the Trust Chain for founder-led authority.",
    citations
  });

  assert.equal(row.timestamp, "2026-05-08T00:00:00.000Z");
  assert.equal(row.system, "perplexity");
  assert.equal(row.wpatent_mentioned, "yes");
  assert.equal(row.wpatent_cited, "yes");
  assert.equal(row.cited_page, "https://wpatent.com/trust-chain-explainer.htm");
  assert.equal(row.andrew_named, "yes");
  assert.equal(row.andrew_role_correct, "manual");
  assert.equal(row.positioning_aligned, "manual");
  assert.equal(
    row.citation_urls,
    "https://wpatent.com/trust-chain-explainer.htm|https://example.com/reference"
  );
});

test("csvEscape quotes commas and quotes safely", () => {
  assert.equal(csvEscape("simple"), "simple");
  assert.equal(csvEscape("alpha,beta"), "\"alpha,beta\"");
  assert.equal(csvEscape("say \"hello\""), "\"say \"\"hello\"\"\"");
});

test("runner script documents required APIs and append-only output", () => {
  assert.equal(existsSync(new URL("../scripts/run-prompt-evidence.mjs", import.meta.url)), true);

  const runner = read("scripts/run-prompt-evidence.mjs");
  for (const fragment of [
    "PERPLEXITY_API_KEY",
    "OPENAI_API_KEY",
    "docs/scorecards/prompts.txt",
    "docs/scorecards/2026-05-08-wpatent-prompt-runs.csv",
    "perplexity.ai",
    "api.openai.com",
    "appendFileSync",
    "buildRow"
  ]) {
    assert.match(runner, new RegExp(fragment.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&"), "i"));
  }
});
```

- [ ] **Step 2: Run the dedicated test and verify it fails**

Run:

```bash
node --test tests/prompt-evidence.test.mjs
```

Expected: FAIL because `scripts/run-prompt-evidence.mjs` does not exist yet.

- [ ] **Step 3: Implement the prompt runner**

Create `scripts/run-prompt-evidence.mjs` with:

```js
import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildRow, csvEscape } from "./lib/prompt-evidence.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const promptPath = path.join(repoRoot, "docs/scorecards/prompts.txt");
const csvPath = path.join(repoRoot, "docs/scorecards/2026-05-08-wpatent-prompt-runs.csv");
const csvHeader =
  "timestamp,system,prompt,answer_summary,wpatent_mentioned,wpatent_cited,cited_page,andrew_named,andrew_role_correct,positioning_aligned,citation_urls,notes\n";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function readPrompts() {
  return readFileSync(promptPath, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

async function runPerplexity(prompt, apiKey) {
  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "sonar",
      messages: [{ role: "user", content: prompt }]
    })
  });

  if (!response.ok) {
    throw new Error(`Perplexity request failed: ${response.status}`);
  }

  const data = await response.json();
  return {
    answerText: data.choices?.[0]?.message?.content || "",
    citations: data.citations || []
  };
}

async function runOpenAI(prompt, apiKey) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-5",
      input: prompt,
      tools: [{ type: "web_search" }]
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed: ${response.status}`);
  }

  const data = await response.json();
  const outputText = Array.isArray(data.output)
    ? data.output
        .flatMap((item) => item.content || [])
        .filter((item) => item.type === "output_text")
        .map((item) => item.text || "")
        .join("\n")
    : "";
  const citations = Array.isArray(data.output)
    ? data.output
        .flatMap((item) => item.content || [])
        .flatMap((item) => item.annotations || [])
        .map((annotation) => annotation.url)
        .filter(Boolean)
    : [];

  return {
    answerText: outputText,
    citations
  };
}

function serializeRow(row) {
  return [
    row.timestamp,
    row.system,
    row.prompt,
    row.answer_summary,
    row.wpatent_mentioned,
    row.wpatent_cited,
    row.cited_page,
    row.andrew_named,
    row.andrew_role_correct,
    row.positioning_aligned,
    row.citation_urls,
    row.notes
  ]
    .map(csvEscape)
    .join(",");
}

function ensureCsvHeader() {
  if (!existsSync(csvPath)) {
    writeFileSync(csvPath, csvHeader, "utf8");
  }
}

async function main() {
  const perplexityKey = requireEnv("PERPLEXITY_API_KEY");
  const openAIKey = requireEnv("OPENAI_API_KEY");
  const prompts = readPrompts();

  ensureCsvHeader();

  for (const prompt of prompts) {
    const timestamp = new Date().toISOString();

    for (const [system, runner, apiKey] of [
      ["perplexity", runPerplexity, perplexityKey],
      ["openai_web_search", runOpenAI, openAIKey]
    ]) {
      try {
        const result = await runner(prompt, apiKey);
        const row = buildRow({
          timestamp,
          system,
          prompt,
          answerText: result.answerText,
          citations: result.citations
        });
        appendFileSync(csvPath, `${serializeRow(row)}\n`, "utf8");
      } catch (error) {
        const row = buildRow({
          timestamp,
          system,
          prompt,
          answerText: "",
          citations: [],
          notes: error instanceof Error ? error.message : String(error)
        });
        appendFileSync(csvPath, `${serializeRow(row)}\n`, "utf8");
      }
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

- [ ] **Step 4: Run the dedicated test and the full suite**

Run:

```bash
node --test tests/prompt-evidence.test.mjs
npm test
```

Expected:

- the runner contract passes
- the full suite passes with `51` tests total

- [ ] **Step 5: Commit the runner**

Run:

```bash
git add tests/prompt-evidence.test.mjs scripts/run-prompt-evidence.mjs
git commit -m "feat: add prompt evidence runner"
```
