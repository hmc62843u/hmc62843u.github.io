# W&Patent LinkedIn Feature Map Poster Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone branded HTML poster that can be opened locally and exported as a LinkedIn PNG explaining W&Patent's SEO, AEO, GEO, and AI-demo feature map.

**Architecture:** Keep the poster as one self-contained HTML artifact under `artifacts/`, with embedded CSS and no JavaScript. Protect it with a small Node test that verifies the export size, core structure, and final copy so the poster remains portable and easy to regenerate without drifting away from the approved spec.

**Tech Stack:** Static HTML, embedded CSS, Node.js built-in test runner (`node:test`)

---

## File Structure Map

- `artifacts/linkedin-feature-map-poster.html`
  Standalone `1080 x 1350` HTML poster for local preview and PNG capture.
- `tests/poster.test.mjs`
  Verifies the poster artifact exists, uses the approved headline/footer structure, stays at the export size, and includes the final feature-map copy.

### Task 1: Establish the poster artifact contract

**Files:**
- Create: `tests/poster.test.mjs`
- Create: `artifacts/linkedin-feature-map-poster.html`

- [ ] **Step 1: Write the failing poster test**

Create `tests/poster.test.mjs` with this content:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const posterRef = new URL("../artifacts/linkedin-feature-map-poster.html", import.meta.url);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("poster artifact exists with approved structure", () => {
  assert.equal(existsSync(posterRef), true);
  const html = readFileSync(posterRef, "utf8");

  for (const fragment of [
    "How W&amp;Patent Is Built for Search + AI Discovery",
    "Static patent marketplace demo with strong SEO, AEO, and GEO foundations",
    "SEO",
    "AEO",
    "GEO",
    "AI Demo Layer",
    "Crawlable. Structured. AI-discoverable.",
    "width: 1080px",
    "height: 1350px",
    "poster-grid",
    "feature-card"
  ]) {
    assert.match(html, new RegExp(escapeRegExp(fragment), "i"));
  }
});
```

- [ ] **Step 2: Run the poster test and confirm it fails**

Run: `node --test tests/poster.test.mjs`

Expected: FAIL because `artifacts/linkedin-feature-map-poster.html` does not exist yet.

- [ ] **Step 3: Create the standalone poster shell**

Create `artifacts/linkedin-feature-map-poster.html` with this initial export-ready shell:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>W&Patent LinkedIn Feature Map Poster</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=IBM+Plex+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #f2f1ed;
      --surface: #ebeae5;
      --surface-strong: #e1e0db;
      --text: #26251e;
      --muted: rgba(38, 37, 30, 0.68);
      --accent: #f54e00;
      --line: rgba(38, 37, 30, 0.12);
      --shadow: rgba(0, 0, 0, 0.12) 0 24px 60px;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background:
        radial-gradient(1100px 480px at 10% -10%, rgba(245, 78, 0, 0.1), transparent),
        radial-gradient(900px 460px at 90% 0%, rgba(192, 168, 221, 0.16), transparent),
        #ddd8cf;
      font-family: "Instrument Sans", "Avenir Next", "Helvetica Neue", Helvetica, Arial, sans-serif;
      color: var(--text);
      padding: 24px;
    }

    .poster {
      width: 1080px;
      height: 1350px;
      padding: 72px;
      border: 1px solid var(--line);
      background: var(--bg);
      box-shadow: var(--shadow);
      display: grid;
      grid-template-rows: auto auto 1fr auto;
      gap: 28px;
    }

    .eyebrow {
      display: inline-flex;
      width: fit-content;
      padding: 6px 12px;
      border: 1px solid var(--line);
      border-radius: 999px;
      background: var(--surface);
      color: var(--muted);
      font: 500 0.8rem/1 "IBM Plex Mono", Menlo, Monaco, Consolas, monospace;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    h1,
    h2,
    p {
      margin: 0;
    }

    h1 {
      max-width: 11ch;
      font-size: 4.8rem;
      line-height: 0.95;
      letter-spacing: -0.05em;
    }

    .subtitle {
      max-width: 44rem;
      color: var(--muted);
      font-family: "Cormorant Garamond", Georgia, "Times New Roman", serif;
      font-size: 1.6rem;
      line-height: 1.2;
    }

    .poster-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 20px;
    }

    .feature-card {
      display: grid;
      gap: 14px;
      padding: 24px;
      border: 1px solid var(--line);
      border-radius: 18px;
      background: var(--surface);
    }

    .feature-card h2 {
      font-size: 1.5rem;
      letter-spacing: -0.03em;
    }

    .feature-card ul {
      margin: 0;
      padding-left: 18px;
      color: var(--muted);
      display: grid;
      gap: 10px;
      font-size: 1.02rem;
      line-height: 1.4;
    }

    .footer-line {
      padding-top: 20px;
      border-top: 1px solid var(--line);
      color: var(--accent);
      font-size: 1.15rem;
      font-weight: 600;
      letter-spacing: -0.02em;
    }

    code {
      font-family: "IBM Plex Mono", Menlo, Monaco, Consolas, monospace;
      font-size: 0.92em;
    }
  </style>
</head>
<body>
  <article class="poster">
    <div class="eyebrow">W&amp;Patent feature map</div>
    <header>
      <h1>How W&amp;Patent Is Built for Search + AI Discovery</h1>
      <p class="subtitle">Static patent marketplace demo with strong SEO, AEO, and GEO foundations</p>
    </header>
    <section class="poster-grid">
      <article class="feature-card">
        <h2>SEO</h2>
        <ul>
          <li>Crawlable static pages</li>
          <li>Unique titles, descriptions, and canonicals</li>
        </ul>
      </article>
      <article class="feature-card">
        <h2>AEO</h2>
        <ul>
          <li>Direct-answer FAQ content</li>
          <li><code>FAQPage</code> schema</li>
        </ul>
      </article>
      <article class="feature-card">
        <h2>GEO</h2>
        <ul>
          <li>Entity-style structured data</li>
          <li>Static <code>.well-known/ucp.json</code> manifest</li>
        </ul>
      </article>
      <article class="feature-card">
        <h2>AI Demo Layer</h2>
        <ul>
          <li><code>JSON-LD</code>: real</li>
          <li><code>UCP</code>: real static metadata</li>
        </ul>
      </article>
    </section>
    <footer class="footer-line">Crawlable. Structured. AI-discoverable.</footer>
  </article>
</body>
</html>
```

- [ ] **Step 4: Run the poster test again**

Run: `node --test tests/poster.test.mjs`

Expected: PASS with one passing test and no missing-file failure.

- [ ] **Step 5: Commit the poster scaffold**

```bash
git add artifacts/linkedin-feature-map-poster.html tests/poster.test.mjs
git commit -m "feat: add LinkedIn poster scaffold"
```

### Task 2: Polish the branded poster copy and final visual treatment

**Files:**
- Modify: `artifacts/linkedin-feature-map-poster.html`
- Modify: `tests/poster.test.mjs`

- [ ] **Step 1: Extend the poster test to cover the final copy**

Append this second test to `tests/poster.test.mjs`:

```js
test("poster includes final branded copy and technical labels", () => {
  const html = readFileSync(posterRef, "utf8");

  for (const fragment of [
    "<code>robots.txt</code> and <code>sitemap.xml</code>",
    "Quote-friendly Q&amp;A patterns",
    "<code>speakable</code> markup",
    "Visible protocol copy",
    "Static JSON request/response examples",
    "<code>JSON-LD</code>: real",
    "<code>UCP</code>: real static metadata",
    "<code>WebMCP</code>: mock capability surface",
    "<code>ACP</code>: mock transaction states",
    "--bg: #f2f1ed",
    "--accent: #f54e00"
  ]) {
    assert.match(html, new RegExp(escapeRegExp(fragment), "i"));
  }
});
```

- [ ] **Step 2: Run the extended poster test and confirm it fails**

Run: `node --test tests/poster.test.mjs`

Expected: FAIL because the scaffold does not yet include the full bullet copy for all four blocks.

- [ ] **Step 3: Replace the scaffold copy and tighten the final card styling**

Update the card section in `artifacts/linkedin-feature-map-poster.html` so the poster matches the approved copy:

```html
    <section class="poster-grid">
      <article class="feature-card">
        <h2>SEO</h2>
        <ul>
          <li>Crawlable static pages</li>
          <li>Unique titles, descriptions, and canonicals</li>
          <li><code>robots.txt</code> and <code>sitemap.xml</code></li>
          <li><code>JSON-LD</code> on core pages</li>
        </ul>
      </article>
      <article class="feature-card">
        <h2>AEO</h2>
        <ul>
          <li>Direct-answer FAQ content</li>
          <li><code>FAQPage</code> schema</li>
          <li>Quote-friendly Q&amp;A patterns</li>
          <li><code>speakable</code> markup</li>
        </ul>
      </article>
      <article class="feature-card">
        <h2>GEO</h2>
        <ul>
          <li>Entity-style structured data</li>
          <li>Static <code>.well-known/ucp.json</code> manifest</li>
          <li>Visible protocol copy</li>
          <li>Static JSON request/response examples</li>
        </ul>
      </article>
      <article class="feature-card feature-card-accent">
        <h2>AI Demo Layer</h2>
        <ul>
          <li><code>JSON-LD</code>: real</li>
          <li><code>UCP</code>: real static metadata</li>
          <li><code>WebMCP</code>: mock capability surface</li>
          <li><code>ACP</code>: mock transaction states</li>
        </ul>
      </article>
    </section>
```

Replace the current `.feature-card` block in the inline CSS with this final version:

```css
    .feature-card {
      position: relative;
      display: grid;
      gap: 14px;
      padding: 24px;
      border: 1px solid var(--line);
      border-radius: 18px;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.34), transparent 45%),
        var(--surface);
    }

    .feature-card::before {
      content: "";
      width: 44px;
      height: 4px;
      border-radius: 999px;
      background: var(--accent);
    }

    .feature-card-accent {
      box-shadow: var(--shadow);
      outline: 1px solid rgba(245, 78, 0, 0.18);
    }
```

Update the footer line so it reads as a branded signature:

```html
    <footer class="footer-line">Crawlable. Structured. AI-discoverable.</footer>
```

Leave the headline, subtitle, palette, and export size unchanged.

- [ ] **Step 4: Run the focused test, then the full suite**

Run: `node --test tests/poster.test.mjs`

Expected: PASS with both poster tests green.

Run: `npm test`

Expected: PASS with the new `tests/poster.test.mjs` included alongside the existing site tests.

- [ ] **Step 5: Commit the finished poster**

```bash
git add artifacts/linkedin-feature-map-poster.html tests/poster.test.mjs
git commit -m "feat: add LinkedIn feature map poster"
```

## Final Verification Commands

Run these after Task 2 before any merge or push:

```bash
node --test tests/poster.test.mjs
npm test
git status --short
```

Expected final state:

- `tests/poster.test.mjs` passes
- `npm test` is fully green with the poster test included
- `git status --short` is clean except for intentional untracked local artifacts like `.agents/` and `skills-lock.json`
