# W&Patent Trust Chain Scorecard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add maintainable W&Patent scorecard artifacts that track Trust Chain structure, AI visibility, authority transfer, and business outcomes before and after the rework.

**Architecture:** Ship the scorecard as documentation-first assets inside `docs/scorecards/`: a maintenance guide, a shareable markdown summary, and a detailed CSV evidence worksheet. Protect the structure with a dedicated Node test file so future edits do not drift from the approved scorecard design.

**Tech Stack:** Static markdown and CSV documents, existing Node `--test` suite, Git-based documentation workflow

---

### Task 1: Scaffold the scorecard docs folder and contract test

**Files:**
- Create: `tests/trust-chain-scorecard.test.mjs`
- Create: `docs/scorecards/README.md`
- Modify: `README.md`

- [ ] **Step 1: Write the failing scorecard scaffolding test**

Create `tests/trust-chain-scorecard.test.mjs` with:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

function read(relativePath) {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("scorecard docs folder has a maintenance guide", () => {
  assert.equal(existsSync(new URL("../docs/scorecards/README.md", import.meta.url)), true);

  const guide = read("docs/scorecards/README.md");
  assert.match(guide, /# Scorecards/);
  assert.match(guide, /Trust Chain scorecard/i);
  assert.match(guide, /Update routine/i);
  assert.match(guide, /npm test/i);
});

test("root README points to scorecard assets", () => {
  const rootReadme = read("README.md");
  assert.match(rootReadme, /docs\/scorecards\//);
  assert.match(rootReadme, /trust-chain-scorecard/i);
});
```

- [ ] **Step 2: Run the new test and verify it fails**

Run:

```bash
node --test tests/trust-chain-scorecard.test.mjs
```

Expected: FAIL because `docs/scorecards/README.md` does not exist yet and the root `README.md` does not mention `docs/scorecards/`.

- [ ] **Step 3: Create the scorecard maintenance guide and link it from the root README**

Create `docs/scorecards/README.md` with:

```md
# Scorecards

This folder holds internal before/after measurement assets for W&Patent.

## Files

- `2026-05-07-wpatent-trust-chain-scorecard.md`: shareable summary dashboard for the Trust Chain rework
- `2026-05-07-wpatent-trust-chain-scorecard.csv`: detailed worksheet for evidence rows, prompt checks, and source notes

## Update routine

1. Run `npm test` to make sure the site and scorecard contract are green.
2. Reuse the fixed Trust Chain prompt set before and after changes.
3. Pull structural facts from the repo, then pull live evidence from Search Console, GA, and manual AI prompt checks.
4. Update the markdown summary first, then update the CSV worksheet.
5. Commit the scorecard files together so the measurement snapshot stays versioned.
```

Update `README.md` to:

```md
# W&Patent Static Site

W&Patent is a static GitHub Pages site that combines a patent marketplace demo with an Andrew-led Trust Chain methodology for founder-led authority pages.

## Public pages

- `index.html`: marketplace homepage
- `platform.htm`: protocol and workflow demo
- `trust-chain.htm`: canonical Trust Chain methodology page
- `trust-chain-demo.htm`: static authority-page demo

## Starter kit

- `templates/trust-chain-starter/`: three-file starter kit for founder-led authority pages
- `templates/trust-chain-starter.zip`: packaged download for sharing the starter kit directly

## Internal measurement

- `docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.md`: before/after Trust Chain scorecard summary
- `docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.csv`: detailed evidence worksheet

## Development

Run the tests with `npm test`.
```

- [ ] **Step 4: Run the test and full suite**

Run:

```bash
node --test tests/trust-chain-scorecard.test.mjs
npm test
```

Expected:

- the dedicated scorecard test passes
- the full suite passes with `44` tests total

- [ ] **Step 5: Commit the scaffolding**

Run:

```bash
git add tests/trust-chain-scorecard.test.mjs docs/scorecards/README.md README.md
git commit -m "docs: scaffold trust chain scorecard assets"
```

### Task 2: Add the markdown summary dashboard

**Files:**
- Modify: `tests/trust-chain-scorecard.test.mjs`
- Create: `docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.md`

- [ ] **Step 1: Extend the test with a failing summary-dashboard contract**

Update `tests/trust-chain-scorecard.test.mjs` to:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

function read(relativePath) {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("scorecard docs folder has a maintenance guide", () => {
  assert.equal(existsSync(new URL("../docs/scorecards/README.md", import.meta.url)), true);

  const guide = read("docs/scorecards/README.md");
  assert.match(guide, /# Scorecards/);
  assert.match(guide, /Trust Chain scorecard/i);
  assert.match(guide, /Update routine/i);
  assert.match(guide, /npm test/i);
});

test("root README points to scorecard assets", () => {
  const rootReadme = read("README.md");
  assert.match(rootReadme, /docs\/scorecards\//);
  assert.match(rootReadme, /trust-chain-scorecard/i);
});

test("scorecard summary defines the four scoring categories and prompt workflow", () => {
  assert.equal(
    existsSync(new URL("../docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.md", import.meta.url)),
    true
  );

  const summary = read("docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.md");
  for (const fragment of [
    "# W&Patent Trust Chain Scorecard",
    "Summary Dashboard",
    "Trust Surface Score",
    "AI Visibility Score",
    "Authority Transfer Score",
    "Business Outcome Score",
    "Headline Signals",
    "Prompt Set",
    "Perplexity",
    "ChatGPT / AI Mode",
    "Update Workflow",
    "wpatent.com"
  ]) {
    assert.match(summary, new RegExp(fragment.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&"), "i"));
  }
});
```

- [ ] **Step 2: Run the dedicated test and verify it fails**

Run:

```bash
node --test tests/trust-chain-scorecard.test.mjs
```

Expected: FAIL because `docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.md` does not exist yet.

- [ ] **Step 3: Create the markdown summary dashboard**

Create `docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.md` with:

```md
# W&Patent Trust Chain Scorecard

> **Version:** 2026-05-07
> **Scope:** Before/after measurement for the Trust Chain rework on `wpatent.com`
> **Status:** Structural and authority categories can be scored from the repo today. AI visibility and business outcome rows require live prompt checks plus Search Console / GA pulls.

## Summary Dashboard

| Category | Weight | Before | After | Source | Status |
| --- | --- | --- | --- | --- | --- |
| Trust Surface Score | 35 | Pull from the pre-rework git snapshot of core pages | Pull from the current `wpatent.com` site snapshot | Repo HTML + test suite | Ready |
| AI Visibility Score | 25 | Run the fixed prompt set against the pre-rework positioning snapshot | Run the fixed prompt set against the current site | Perplexity, ChatGPT / AI Mode, optional Ahrefs or Semrush | Manual run required |
| Authority Transfer Score | 20 | Compare pre-rework founder naming and schema linkage | Compare current Andrew → W&Patent linkage and cited-answer naming | Repo HTML, schema blocks, AI answers | Ready |
| Business Outcome Score | 20 | Pull pre-rework page impressions, clicks, and engagement | Pull current page impressions, clicks, and engagement | Search Console + GA | Manual run required |

## Headline Signals

- `wpatent.com` is canonical across the core trust pages.
- The Trust Chain explainer is public, internally linked, and attributed to Andrew Leung, founder of W&Patent.
- Founder → company linkage is visible in both copy and schema.
- `.well-known/ucp.json` exposes machine-readable platform and listings endpoints.
- The starter kit and Trust Chain Scorecard request flow are both live.

## Prompt Set

Use the same prompts before and after each score refresh:

1. `patent strategy for startups`
2. `startup defensibility through patents`
3. `patent commercialization for founders`
4. `founder-led authority building`
5. `AI-readable company website`
6. `trust chain for websites`
7. `how founders build credibility online`
8. `patent advisory for startup founders`
9. `founder identity and company authority`
10. `entity authority for AI search`

## Update Workflow

1. Run `npm test`.
2. Confirm the current site state for `index.html`, `trust-chain.htm`, `trust-chain-demo.htm`, `trust-chain-explainer.htm`, `platform.htm`, `listings.htm`, `robots.txt`, `sitemap.xml`, and `.well-known/ucp.json`.
3. Run the fixed prompt set and record whether W&Patent is mentioned, whether `wpatent.com` is cited, which page is cited, and whether Andrew is named.
4. Pull Search Console and GA data for impressions, clicks, engagement time, and any scorecard or starter-kit destination traffic that is available.
5. Update the CSV worksheet first, then refresh this summary with the latest before/after narrative.
```

- [ ] **Step 4: Run the dedicated test and the full suite**

Run:

```bash
node --test tests/trust-chain-scorecard.test.mjs
npm test
```

Expected:

- the summary-dashboard test passes
- the full suite passes with `45` tests total

- [ ] **Step 5: Commit the summary dashboard**

Run:

```bash
git add tests/trust-chain-scorecard.test.mjs docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.md
git commit -m "docs: add trust chain scorecard summary"
```

### Task 3: Add the detailed evidence worksheet

**Files:**
- Modify: `tests/trust-chain-scorecard.test.mjs`
- Create: `docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.csv`

- [ ] **Step 1: Extend the test with a failing worksheet contract**

Update `tests/trust-chain-scorecard.test.mjs` to:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

function read(relativePath) {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("scorecard docs folder has a maintenance guide", () => {
  assert.equal(existsSync(new URL("../docs/scorecards/README.md", import.meta.url)), true);

  const guide = read("docs/scorecards/README.md");
  assert.match(guide, /# Scorecards/);
  assert.match(guide, /Trust Chain scorecard/i);
  assert.match(guide, /Update routine/i);
  assert.match(guide, /npm test/i);
});

test("root README points to scorecard assets", () => {
  const rootReadme = read("README.md");
  assert.match(rootReadme, /docs\/scorecards\//);
  assert.match(rootReadme, /trust-chain-scorecard/i);
});

test("scorecard summary defines the four scoring categories and prompt workflow", () => {
  assert.equal(
    existsSync(new URL("../docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.md", import.meta.url)),
    true
  );

  const summary = read("docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.md");
  for (const fragment of [
    "# W&Patent Trust Chain Scorecard",
    "Summary Dashboard",
    "Trust Surface Score",
    "AI Visibility Score",
    "Authority Transfer Score",
    "Business Outcome Score",
    "Headline Signals",
    "Prompt Set",
    "Perplexity",
    "ChatGPT / AI Mode",
    "Update Workflow",
    "wpatent.com"
  ]) {
    assert.match(summary, new RegExp(fragment.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&"), "i"));
  }
});

test("scorecard worksheet seeds the evidence model", () => {
  assert.equal(
    existsSync(new URL("../docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.csv", import.meta.url)),
    true
  );

  const worksheet = read("docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.csv");
  for (const fragment of [
    "Metric,Category,Weight,Before,After,Source,Status,Notes",
    "Canonical coverage of core trust pages",
    "Trust Chain explainer publicly indexed",
    "Andrew to W&Patent linkage visible on core pages",
    "Perplexity cites wpatent.com on target prompts",
    "Founder named in AI answer",
    "Average engagement time on trust-chain-explainer.htm",
    "Scorecard requests"
  ]) {
    assert.match(worksheet, new RegExp(fragment.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&"), "i"));
  }
});
```

- [ ] **Step 2: Run the dedicated test and verify it fails**

Run:

```bash
node --test tests/trust-chain-scorecard.test.mjs
```

Expected: FAIL because `docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.csv` does not exist yet.

- [ ] **Step 3: Create the detailed evidence worksheet**

Create `docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.csv` with:

```csv
Metric,Category,Weight,Before,After,Source,Status,Notes
Canonical coverage of core trust pages,Trust Surface,35,Pull canonicals from the pre-rework git snapshot for index trust-chain demo explainer listings and platform pages,Check canonicals on the current wpatent.com core pages,Repo HTML + tests,Ready,Use git history for the before state and the working tree or live site for the after state
Trust Chain explainer publicly indexed,Trust Surface,35,Record whether the explainer existed in the pre-rework snapshot,Confirm trust-chain-explainer.htm is public linked and sitemap-listed,Repo HTML + sitemap + robots,Ready,This row should stay tied to trust-chain-explainer.htm
Andrew to W&Patent linkage visible on core pages,Authority Transfer,20,Review pre-rework founder naming and schema linkage,Review current founder naming and schema linkage,Repo HTML + JSON-LD,Ready,Check both visible copy and machine-readable markup
Perplexity cites wpatent.com on target prompts,AI Visibility,25,Run the fixed prompt set against the pre-rework positioning snapshot,Run the fixed prompt set against the current site,Perplexity prompt checks,Manual run required,Track yes no plus which page was cited
ChatGPT or AI Mode mentions W&Patent on target prompts,AI Visibility,25,Run the fixed prompt set against the pre-rework positioning snapshot,Run the fixed prompt set against the current site,ChatGPT / AI Mode prompt checks,Manual run required,Use the same prompt list as the Perplexity check
Founder named in AI answer,Authority Transfer,20,Capture whether Andrew is named in the pre-rework answer set,Capture whether Andrew is named in the current answer set,Manual AI answer review,Manual run required,This row ties author identity to the cited company
Search Console impressions for Trust Chain pages,Business Outcome,20,Pull pre-rework impressions for trust-chain.htm trust-chain-demo.htm and trust-chain-explainer.htm,Pull current impressions for the same pages,Search Console,Manual run required,Keep the page list fixed between refreshes
Average engagement time on trust-chain-explainer.htm,Business Outcome,20,Pull pre-rework engagement if available,Pull current engagement time,GA,Manual run required,Use page-level engagement rather than sitewide averages
Starter template downloads,Business Outcome,20,Record pre-rework starter-kit download baseline,Record current starter-kit download total,Download logs or equivalent analytics,Manual run required,If direct download tracking is unavailable note that clearly in the summary
Scorecard requests,Business Outcome,20,Record pre-rework scorecard-request baseline,Record current scorecard-request total,Mail inbox or intake tracking,Manual run required,Use the same request definition on every refresh
```

- [ ] **Step 4: Run the dedicated test and the full suite**

Run:

```bash
node --test tests/trust-chain-scorecard.test.mjs
npm test
```

Expected:

- the worksheet test passes
- the full suite passes with `46` tests total

- [ ] **Step 5: Commit the worksheet**

Run:

```bash
git add tests/trust-chain-scorecard.test.mjs docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.csv
git commit -m "docs: add trust chain scorecard worksheet"
```
