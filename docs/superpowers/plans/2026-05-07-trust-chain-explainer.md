# Trust Chain Explainer Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the Trust Chain article as a public HTML companion page that strengthens W&Patent's authority system through crawlable, internally linked, founder-facing content.

**Architecture:** Add one new static HTML page at `trust-chain-explainer.htm`, wire it into the existing Trust Chain page and sitemap, and keep the presentation editorial by reusing the shared site shell plus a small set of article-specific CSS classes. Validate the new route with focused contract tests first, then finish with a full site test run.

**Tech Stack:** Static HTML, shared CSS, vanilla JavaScript (no new JS expected), Markdown as source reference, XML sitemap, Node.js built-in test runner (`node:test`)

---

## File Structure Map

- `trust-chain-explainer.htm`
  New public founder-facing explainer page for the Trust Chain method.
- `trust-chain.htm`
  Add a clear internal link from the methodology page to the new explainer companion.
- `site.css`
  Add a small set of article-specific layout and typography rules for the new explainer page.
- `sitemap.xml`
  Add the new public explainer route so discovery coverage matches the site structure.
- `tests/trust-chain.test.mjs`
  Extend the Trust Chain contract tests to cover the new explainer page, its metadata, content, and cross-links.
- `tests/shared-shell.test.mjs`
  Ensure the new explainer page loads the shared CSS and JS shell.
- `tests/discovery.test.mjs`
  Ensure the sitemap includes the new public route.
- `docs/articles/2026-05-07-startup-domain-trust-infrastructure.md`
  Existing source copy reference for the new page. Do not modify in this plan unless copy errors are found during implementation.

## Scope Check

This is one contained content-publication change, not a broader publishing-system project. The work stays focused on turning an existing article into one public Trust Chain companion page that fits the current site architecture.

### Task 1: Define the public explainer contract with failing tests

**Files:**
- Modify: `tests/trust-chain.test.mjs`
- Modify: `tests/shared-shell.test.mjs`
- Modify: `tests/discovery.test.mjs`

- [ ] **Step 1: Add the explainer page to the shared-shell contract**

Update the `pages` array in `tests/shared-shell.test.mjs` to include the new route:

```js
const pages = [
  "index.html",
  "about.htm",
  "why_us.htm",
  "faq.htm",
  "career.htm",
  "trust-chain.htm",
  "trust-chain-demo.htm",
  "trust-chain-explainer.htm"
];
```

- [ ] **Step 2: Add the explainer URL to sitemap coverage**

Insert the new URL into the list in `tests/discovery.test.mjs` immediately after `trust-chain-demo.htm`:

```js
    "https://hmc62843u.github.io/trust-chain-explainer.htm",
```

- [ ] **Step 3: Extend the Trust Chain contract test file with explainer expectations**

Append these tests to `tests/trust-chain.test.mjs`:

```js
test("trust chain methodology links to the explainer companion", () => {
  const landing = read("trust-chain.htm");

  assert.match(landing, /href="trust-chain-explainer\.htm"/);
  assert.match(landing, /Read why this matters in 2026/i);
});

test("trust chain explainer page is public, crawlable, and tied back to the system", () => {
  assert.equal(existsSync(new URL("../trust-chain-explainer.htm", import.meta.url)), true);

  const explainer = read("trust-chain-explainer.htm");

  for (const fragment of [
    "<title>When a Startup Domain Becomes Trust Infrastructure | W&amp;Patent</title>",
    '<link rel="canonical" href="https://hmc62843u.github.io/trust-chain-explainer.htm">',
    '"@type": "WebPage"',
    "When a Startup Domain Becomes Trust Infrastructure",
    "Why SEO, AEO, and GEO are converging",
    "SEO",
    "AEO",
    "GEO",
    "Trust Chain",
    "The goal is not to manufacture trust, but to make real credibility easier for AI systems to interpret, cite, and use.",
    'href="trust-chain.htm"',
    'href="trust-chain-demo.htm"',
    'href="templates/trust-chain-starter.zip"'
  ]) {
    assert.match(explainer, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
});
```

- [ ] **Step 4: Run the targeted tests to verify they fail first**

Run: `node --test tests/trust-chain.test.mjs tests/shared-shell.test.mjs tests/discovery.test.mjs`

Expected: FAIL because `trust-chain-explainer.htm` does not exist yet, `trust-chain.htm` does not link to it yet, and `sitemap.xml` does not list it yet.

- [ ] **Step 5: Commit the red tests**

```bash
git add tests/trust-chain.test.mjs tests/shared-shell.test.mjs tests/discovery.test.mjs
git commit -m "test: define trust chain explainer page contract"
```

### Task 2: Publish the explainer page and wire it into Trust Chain discovery

**Files:**
- Create: `trust-chain-explainer.htm`
- Modify: `trust-chain.htm`
- Modify: `sitemap.xml`

- [ ] **Step 1: Add a companion-essay link to the Trust Chain methodology page**

Replace the hero action block in `trust-chain.htm` with:

```html
        <div class="actions">
          <a class="btn btn-solid" href="trust-chain-demo.htm">View the live demo</a>
          <a class="btn" href="trust-chain-explainer.htm">Read why this matters in 2026</a>
          <a class="btn" href="templates/trust-chain-starter.zip">Download the starter kit</a>
        </div>
```

- [ ] **Step 2: Create the new explainer page with the shared site shell and article content**

Create `trust-chain-explainer.htm` with this complete HTML:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>When a Startup Domain Becomes Trust Infrastructure | W&amp;Patent</title>
  <meta
    name="description"
    content="A founder-facing Trust Chain explainer on why startup domains now function as part of trust infrastructure across SEO, AEO, and GEO."
  >
  <meta property="og:title" content="When a Startup Domain Becomes Trust Infrastructure | W&Patent">
  <meta
    property="og:description"
    content="Why SEO, AEO, and GEO are converging into a more founder-led model of credibility, and what that means for startup domains in 2026."
  >
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://hmc62843u.github.io/trust-chain-explainer.htm">
  <link rel="canonical" href="https://hmc62843u.github.io/trust-chain-explainer.htm">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=IBM+Plex+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="site.css">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "When a Startup Domain Becomes Trust Infrastructure",
    "url": "https://hmc62843u.github.io/trust-chain-explainer.htm",
    "description": "Founder-facing Trust Chain explainer on why startup domains now function as part of trust infrastructure across SEO, AEO, and GEO."
  }
  </script>
</head>
<body>
  <header class="topbar">
    <div class="container topbar-inner">
      <a class="brand" href="index.html">W&<strong>Patent</strong></a>
      <nav class="nav">
        <a href="index.html">Home</a>
        <a href="listings.htm">Listings</a>
        <a href="platform.htm">Platform</a>
        <a href="about.htm">About</a>
        <a href="why_us.htm">Why Us</a>
        <a href="faq.htm">FAQ</a>
        <a href="career.htm">Career</a>
      </nav>
    </div>
  </header>
  <main class="container article-shell">
    <section class="article-header">
      <span class="eyebrow mono">Trust Chain Companion</span>
      <h1>When a Startup Domain Becomes Trust Infrastructure</h1>
      <p class="lead">Why SEO, AEO, and GEO are converging into a more founder-led model of credibility, and how the W&amp;Patent rework helped make that shift visible.</p>
    </section>

    <article class="article-body">
      <p>For a long time, building a good startup website mostly meant getting the right pages up, writing decent copy, and making sure the site could rank. That model still matters, but it no longer feels complete. In 2026, a domain is not just where a company describes itself. It is increasingly part of how the company gets understood, judged, and trusted across the web, including by AI systems that now shape more of how discovery happens.</p>

      <p>That shift matters most for founders who are still unknown by default. Most young companies do not have years of brand recognition, press coverage, or market trust to lean on. For them, the website is doing more than marketing work. It is helping build the first durable layer of public credibility.</p>

      <p>For founders, that also means credibility can carry forward. A domain may anchor trust for a company, but the deeper layer of authority often stays with the person behind the work and can compound across projects when the connection between identity, output, and proof stays clear. As AI systems play a bigger role in how businesses are discovered, compared, and interpreted, trust starts to work less like a first impression and more like a record that builds over time.</p>

      <p>In that environment, a domain becomes more than a brochure. By following an approach like the one outlined in the Trust Chain template, a founder can build a clearer trust surface through stronger signals, better proof, and a more consistent public story. <strong>The goal is not to manufacture trust, but to make real credibility easier for AI systems to interpret, cite, and use.</strong></p>

      <h2>Three Layers</h2>
      <p>What became clearer to me through the W&amp;Patent rework is that this breaks into at least three overlapping layers: SEO, AEO, and GEO. They are related, but they are not identical.</p>

      <div class="article-table">
        <table>
          <thead>
            <tr>
              <th>Area</th>
              <th>Simple Meaning</th>
              <th>What It Helps With</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>SEO</code></td>
              <td>Helps the site get found</td>
              <td>Crawling, indexing, and classic search visibility</td>
            </tr>
            <tr>
              <td><code>AEO</code></td>
              <td>Helps the site get answered from</td>
              <td>Direct answers, summaries, and answer-engine retrieval</td>
            </tr>
            <tr>
              <td><code>GEO</code></td>
              <td>Helps the site get interpreted and trusted by AI systems</td>
              <td>Entity understanding, citation potential, and agent interaction</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>The same site features can support all three, but for different reasons.</p>

      <h2>SEO Foundation</h2>
      <p>On W&amp;Patent, the SEO layer comes from the fundamentals: canonical URLs, a sitemap, crawlable static HTML, stronger internal links, and clearer page-level copy. These are the things that help search engines find the pages, understand which ones matter, and make sense of the site structure.</p>

      <h2>AEO Foundation</h2>
      <p>The AEO layer comes from writing pages that are easy to answer from. That includes direct FAQ sections, plain-language explanations, and structured data that matches the visible content. If a founder wants a page to be quotable, summarizable, and easy for an answer engine to lift from, the page has to do more than sound impressive. It has to be explicit.</p>

      <h2>GEO Foundation</h2>
      <p>The GEO layer goes a step further. It is about whether AI systems and agents can interpret the company as a coherent entity, connect the founder to the business, inspect proof, and understand what the site is actually claiming. On W&amp;Patent, that comes from the Trust Chain pages, the live demo, the founder-to-company linkage, the structured entity markup, and the public starter template that makes the method inspectable instead of abstract.</p>

      <h2>Trust Chain</h2>
      <p>That is why I started thinking about the rework as a Trust Chain. Trust online no longer comes from a single page or a single claim. It comes from how the domain, the person behind the work, and the content itself reinforce each other. The clearer those connections are, the easier it becomes for both people and machines to understand why a company should be taken seriously.</p>

      <p>That thinking has already started to reshape W&amp;Patent in practical ways. The site now does more to connect the founder story, the company's point of view, and the proof behind it, with new Trust Chain pages, a live demo, and a downloadable starter template meant to help founders build a clearer authority surface of their own.</p>

      <h2>Takeaway</h2>
      <p>The biggest takeaway for me is that domain building can no longer be treated as an isolated task. A startup website is no longer just a brochure site or a search asset. It is part of the company's trust infrastructure. And helping founders with domain building increasingly means helping them with authority building too.</p>

      <section class="article-cta card">
        <p class="kicker">Next Step</p>
        <h2>Explore the method, inspect the example, or start with the template.</h2>
        <div class="actions">
          <a class="btn btn-solid" href="trust-chain.htm">Explore the methodology</a>
          <a class="btn" href="trust-chain-demo.htm">View the live demo</a>
          <a class="btn" href="templates/trust-chain-starter.zip">Download the starter kit</a>
        </div>
      </section>
    </article>
  </main>
  <footer><div class="container mono">W&Patent - Andrew-led authority systems for clearer trust on the web.</div></footer>
  <script src="site.js" defer></script>
</body>
</html>
```

- [ ] **Step 3: Add the new public route to the sitemap**

Insert this line in `sitemap.xml` directly after the existing `trust-chain-demo.htm` entry:

```xml
  <url><loc>https://hmc62843u.github.io/trust-chain-explainer.htm</loc></url>
```

- [ ] **Step 4: Run the targeted tests to verify the new route contract passes**

Run: `node --test tests/trust-chain.test.mjs tests/shared-shell.test.mjs tests/discovery.test.mjs`

Expected: PASS with the new route found, the methodology page linked to it, and the sitemap listing it.

- [ ] **Step 5: Commit the public explainer route**

```bash
git add trust-chain.htm trust-chain-explainer.htm sitemap.xml tests/trust-chain.test.mjs tests/shared-shell.test.mjs tests/discovery.test.mjs
git commit -m "feat: publish trust chain explainer page"
```

### Task 3: Add the editorial article styling and verify the full site

**Files:**
- Modify: `tests/trust-chain.test.mjs`
- Modify: `site.css`

- [ ] **Step 1: Add a failing style-contract test for the explainer page scaffolding**

Append this test to `tests/trust-chain.test.mjs`:

```js
test("trust chain explainer page uses dedicated editorial scaffolding", () => {
  const explainer = read("trust-chain-explainer.htm");
  const styles = read("site.css");

  for (const fragment of [
    "article-shell",
    "article-header",
    "article-body",
    "article-table",
    "article-cta"
  ]) {
    assert.match(explainer, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }

  for (const fragment of [
    ".article-shell",
    ".article-header",
    ".article-body",
    ".article-table",
    ".article-cta"
  ]) {
    assert.match(styles, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
});
```

- [ ] **Step 2: Run the targeted test and confirm it fails before the CSS exists**

Run: `node --test tests/trust-chain.test.mjs`

Expected: FAIL because `trust-chain-explainer.htm` already uses the article class names but `site.css` does not yet define them.

- [ ] **Step 3: Add the explainer-specific editorial styles to `site.css`**

Insert these rules above the existing `@media (max-width: 900px)` block:

```css
.article-shell {
  padding: 78px 0 56px;
}

.article-header {
  max-width: 900px;
}

.article-header h1 {
  max-width: 15ch;
}

.article-body {
  max-width: 760px;
}

.article-body h2 {
  margin: 34px 0 12px;
}

.article-body p {
  margin: 0 0 16px;
  color: var(--muted);
}

.article-table {
  margin: 20px 0 24px;
  overflow-x: auto;
}

.article-table table {
  margin-top: 0;
  background: var(--surface);
}

.article-cta {
  margin-top: 34px;
}
```

Also extend the existing mobile media query with this rule:

```css
  .article-shell {
    padding-top: 50px;
  }
```

- [ ] **Step 4: Run the focused test and then the full suite**

Run: `node --test tests/trust-chain.test.mjs`

Expected: PASS

Then run: `npm test`

Expected: PASS with all site tests green, including the new explainer coverage.

- [ ] **Step 5: Commit the styling and verification pass**

```bash
git add site.css tests/trust-chain.test.mjs
git commit -m "style: add trust chain explainer article layout"
```
