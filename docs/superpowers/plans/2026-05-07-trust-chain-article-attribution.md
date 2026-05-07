# Trust Chain Article Attribution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add consistent author, company, and canonical-domain attribution to the Trust Chain article markdown, the public explainer page, and the regenerated PDF.

**Architecture:** Reuse one compact attribution pattern everywhere: a quiet editorial attribution block directly below the title/subhead area. Validate the text contract first in the public HTML page and markdown source, then add a small CSS rule for the public page and regenerate the PDF from the updated markdown using the existing Node + Playwright render flow.

**Tech Stack:** Static HTML, shared CSS, Markdown, PDF generation via Node.js with `marked` and Playwright, Node.js built-in test runner (`node:test`)

---

## File Structure Map

- `docs/articles/2026-05-07-startup-domain-trust-infrastructure.md`
  Source article that will gain the attribution lines used for sharing and PDF generation.
- `docs/articles/2026-05-07-startup-domain-trust-infrastructure.pdf`
  Regenerated PDF output from the updated markdown.
- `trust-chain-explainer.htm`
  Public explainer page that will gain a matching on-page attribution block below the subhead.
- `site.css`
  Add one small article attribution style for the public explainer page.
- `tests/trust-chain.test.mjs`
  Extend the Trust Chain contract tests to assert the attribution is present in the markdown source and public HTML explainer.

## Scope Check

This is one small attribution-alignment change, not a broader article rewrite. The work stays contained to the article assets and the public explainer page.

### Task 1: Define the attribution contract with failing tests

**Files:**
- Modify: `tests/trust-chain.test.mjs`

- [ ] **Step 1: Add failing attribution expectations for the markdown article and public explainer**

Append this test to `tests/trust-chain.test.mjs`:

```js
test("trust chain article assets keep author, company, and canonical source connected", () => {
  const explainer = read("trust-chain-explainer.htm");
  const article = read("docs/articles/2026-05-07-startup-domain-trust-infrastructure.md");

  for (const fragment of [
    "By Andrew Leung, founder of W&Patent",
    "Canonical source: https://wpatent.com/trust-chain-explainer.htm"
  ]) {
    const pattern = new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    assert.match(explainer, pattern);
    assert.match(article, pattern);
  }
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `node --test tests/trust-chain.test.mjs`

Expected: FAIL because neither the public explainer page nor the markdown article currently includes the attribution block.

- [ ] **Step 3: Commit the red test**

```bash
git add tests/trust-chain.test.mjs
git commit -m "test: define trust chain article attribution contract"
```

### Task 2: Add matching attribution to the public HTML page and markdown source

**Files:**
- Modify: `trust-chain-explainer.htm`
- Modify: `docs/articles/2026-05-07-startup-domain-trust-infrastructure.md`
- Modify: `site.css`
- Modify: `tests/trust-chain.test.mjs`

- [ ] **Step 1: Add the attribution block to the markdown article**

Insert these two lines directly below the italic subhead in `docs/articles/2026-05-07-startup-domain-trust-infrastructure.md`:

```md
By Andrew Leung, founder of W&Patent  
Canonical source: https://wpatent.com/trust-chain-explainer.htm
```

- [ ] **Step 2: Add the matching attribution block to the public explainer page**

Insert this block in `trust-chain-explainer.htm` directly below the existing lead paragraph inside `.article-header`:

```html
      <p class="mono article-attribution">By Andrew Leung, founder of W&amp;Patent<br>Canonical source: https://wpatent.com/trust-chain-explainer.htm</p>
```

- [ ] **Step 3: Add a small dedicated style for the attribution block**

Insert these rules in `site.css` near the other `.article-*` selectors:

```css
.article-attribution {
  margin-top: 14px;
  color: var(--muted);
}

.article-attribution br {
  display: block;
  margin-top: 4px;
}
```

- [ ] **Step 4: Add a failing style-contract assertion and then make it pass**

Extend the existing `test("trust chain explainer page uses dedicated editorial scaffolding", ...)` in `tests/trust-chain.test.mjs` by adding `"article-attribution"` to the HTML fragment list and `".article-attribution"` to the CSS fragment list:

```js
  for (const fragment of [
    "article-shell",
    "article-header",
    "article-body",
    "article-table",
    "article-cta",
    "article-attribution"
  ]) {
    assert.match(explainer, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }

  for (const fragment of [
    ".article-shell",
    ".article-header",
    ".article-body",
    ".article-table",
    ".article-cta",
    ".article-attribution"
  ]) {
    assert.match(styles, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
```

- [ ] **Step 5: Run the focused tests to verify the attribution contract passes**

Run: `node --test tests/trust-chain.test.mjs`

Expected: PASS with the markdown and public HTML both showing the new attribution and the CSS containing `.article-attribution`.

- [ ] **Step 6: Commit the source attribution change**

```bash
git add docs/articles/2026-05-07-startup-domain-trust-infrastructure.md trust-chain-explainer.htm site.css tests/trust-chain.test.mjs
git commit -m "copy: add trust chain article attribution"
```

### Task 3: Regenerate and verify the shared PDF

**Files:**
- Modify: `docs/articles/2026-05-07-startup-domain-trust-infrastructure.pdf`

- [ ] **Step 1: Regenerate the PDF from the updated markdown**

Run this exact command from the repo root:

```bash
NODE_PATH='/Users/andrew/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules' '/Users/andrew/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node' - <<'NODE'
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const { chromium } = require('playwright');

const mdPath = path.resolve('docs/articles/2026-05-07-startup-domain-trust-infrastructure.md');
const pdfPath = path.resolve('docs/articles/2026-05-07-startup-domain-trust-infrastructure.pdf');
const markdown = fs.readFileSync(mdPath, 'utf8');
const body = marked.parse(markdown);
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>When a Startup Domain Becomes Trust Infrastructure</title>
<style>
  @page { size: Letter; margin: 0.7in; }
  :root {
    --ink: #1f2937;
    --muted: #4b5563;
    --line: #d1d5db;
    --bg: #fffdf8;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    color: var(--ink);
    background: var(--bg);
    font-family: Georgia, "Times New Roman", serif;
    line-height: 1.6;
    font-size: 11.5pt;
  }
  main {
    max-width: 7.2in;
    margin: 0 auto;
  }
  h1, h2 {
    line-height: 1.15;
    color: #111827;
    page-break-after: avoid;
  }
  h1 {
    font-size: 24pt;
    margin: 0 0 10pt;
  }
  h2 {
    font-size: 15pt;
    margin: 22pt 0 10pt;
    padding-top: 4pt;
    border-top: 1px solid var(--line);
  }
  p, li {
    margin: 0 0 10pt;
  }
  em {
    color: var(--muted);
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 14pt 0 18pt;
    font-size: 10.5pt;
  }
  th, td {
    border: 1px solid var(--line);
    padding: 8pt 9pt;
    text-align: left;
    vertical-align: top;
  }
  th {
    background: #f5f5f4;
    font-weight: 700;
  }
  code {
    font-family: "SFMono-Regular", Menlo, Consolas, monospace;
    font-size: 0.92em;
    background: #f3f4f6;
    padding: 0.08em 0.3em;
    border-radius: 4px;
  }
</style>
</head>
<body>
<main>${body}</main>
</body>
</html>`;

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  await page.pdf({
    path: pdfPath,
    format: 'Letter',
    printBackground: true,
    margin: { top: '0.7in', right: '0.7in', bottom: '0.7in', left: '0.7in' }
  });
  await browser.close();
})();
NODE
```

- [ ] **Step 2: Verify the regenerated PDF exists and is non-empty**

Run: `ls -lh docs/articles/2026-05-07-startup-domain-trust-infrastructure.md docs/articles/2026-05-07-startup-domain-trust-infrastructure.pdf && file docs/articles/2026-05-07-startup-domain-trust-infrastructure.pdf`

Expected:
- the markdown and PDF both exist
- the PDF reports as a valid PDF document
- the PDF size is non-zero

- [ ] **Step 3: Run the full test suite**

Run: `npm test`

Expected: PASS with all site tests green, including the updated attribution checks.

- [ ] **Step 4: Commit the regenerated PDF**

```bash
git add docs/articles/2026-05-07-startup-domain-trust-infrastructure.pdf
git commit -m "docs: regenerate trust chain article pdf"
```
