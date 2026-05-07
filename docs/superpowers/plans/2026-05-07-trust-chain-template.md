# Trust Chain Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a public Trust Chain methodology page, a live demo page, a starter-kit folder, and an honest static scorecard request flow that turns W&Patent into the canonical home of an Andrew-led authority-template system.

**Architecture:** Keep the implementation GitHub Pages-friendly and static-first. Add two new public pages, reuse the existing shared CSS and JS shell, expose the starter files directly in-repo under a dedicated template folder, and use a mailto-based scorecard request flow so the CTA is real without pretending there is a backend.

**Tech Stack:** Static HTML, shared CSS, vanilla JavaScript, JSON, Markdown, Node.js built-in test runner (`node:test`)

---

## File Structure Map

- `index.html`
  Add a homepage teaser that introduces the Trust Chain methodology and links to the new canonical page plus the live demo.
- `trust-chain.htm`
  New canonical landing page for the methodology, audience fit, value proposition, proof framing, and scorecard offer.
- `trust-chain-demo.htm`
  New live demo page that shows the authority-page structure in action with a fictional founder-led B2B example.
- `templates/trust-chain-starter/README.md`
  Starter-kit usage guide that explains the three-file template, what to customize first, and how it relates back to W&Patent.
- `templates/trust-chain-starter/config.json`
  Small editable content model for the starter kit.
- `templates/trust-chain-starter/index.html`
  The free authority-page template itself, adapted from the existing three-file starter concept.
- `README.md`
  Replace the current placeholder README with a repo overview that mentions the Trust Chain assets, demo page, and test command.
- `site.css`
  Add layout and component styles for the Trust Chain landing page, demo page, and scorecard intake section while reusing the existing palette and form controls.
- `site.js`
  Add a tiny scorecard-form enhancement that builds a `mailto:wp@wpatent.com` request from user-entered fields and keeps the flow explicitly static.
- `sitemap.xml`
  Add the new public pages so discovery coverage matches the site structure.
- `tests/homepage.test.mjs`
  Extend homepage coverage for the new Trust Chain links.
- `tests/shared-shell.test.mjs`
  Ensure the new pages load the shared CSS and JS assets.
- `tests/discovery.test.mjs`
  Extend sitemap coverage for the two new public pages.
- `tests/trust-chain.test.mjs`
  New focused contract test for the Trust Chain landing page, live demo page, starter-kit files, README, and scorecard helper script.

## Scope Check

This is one connected static-site initiative, not multiple unrelated subsystems. The new pages, starter kit, README narrative, and scorecard CTA all reinforce the same Trust Chain asset system and can be implemented under one plan without overloading the repo structure.

### Task 1: Establish the Trust Chain route shell and discovery coverage

**Files:**
- Create: `trust-chain.htm`
- Create: `trust-chain-demo.htm`
- Create: `tests/trust-chain.test.mjs`
- Modify: `index.html`
- Modify: `sitemap.xml`
- Modify: `tests/homepage.test.mjs`
- Modify: `tests/shared-shell.test.mjs`
- Modify: `tests/discovery.test.mjs`

- [ ] **Step 1: Write the failing discovery and route-contract tests**

Update `tests/homepage.test.mjs` by appending this new test:

```js
test("homepage links to the Trust Chain methodology and demo", () => {
  assert.match(html, /Trust Chain/i);
  assert.match(html, /href="trust-chain\.htm"/);
  assert.match(html, /href="trust-chain-demo\.htm"/);
});
```

Update the `pages` array in `tests/shared-shell.test.mjs` to include the two new pages:

```js
const pages = [
  "index.html",
  "about.htm",
  "why_us.htm",
  "faq.htm",
  "career.htm",
  "trust-chain.htm",
  "trust-chain-demo.htm"
];
```

Extend the sitemap URL list in `tests/discovery.test.mjs` with these entries:

```js
    "https://wpatent.com/trust-chain.htm",
    "https://wpatent.com/trust-chain-demo.htm",
```

Create `tests/trust-chain.test.mjs` with this initial contract:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

test("trust chain landing and demo pages exist with canonical links", () => {
  assert.equal(existsSync(new URL("../trust-chain.htm", import.meta.url)), true);
  assert.equal(existsSync(new URL("../trust-chain-demo.htm", import.meta.url)), true);

  const landing = read("trust-chain.htm");
  const demo = read("trust-chain-demo.htm");

  assert.match(landing, /<title>Trust Chain Template \| W&amp;Patent<\/title>/);
  assert.match(landing, /<link rel="canonical" href="https:\/\/hmc62843u\.github\.io\/trust-chain\.htm">/);
  assert.match(landing, /href="trust-chain-demo\.htm"/);

  assert.match(demo, /<title>Trust Chain Demo \| W&amp;Patent<\/title>/);
  assert.match(demo, /<link rel="canonical" href="https:\/\/hmc62843u\.github\.io\/trust-chain-demo\.htm">/);
  assert.match(demo, /href="trust-chain\.htm"/);
});
```

- [ ] **Step 2: Run the targeted tests and confirm they fail**

Run: `node --test tests/homepage.test.mjs tests/shared-shell.test.mjs tests/discovery.test.mjs tests/trust-chain.test.mjs`

Expected: FAIL because the homepage does not yet link to `trust-chain.htm`, the sitemap does not list the new routes, and the new HTML files do not exist.

- [ ] **Step 3: Add the minimal route shell, homepage teaser, and sitemap entries**

Insert this new section in `index.html` just before the existing `AEO / GEO FAQ` section:

```html
    <section class="section container">
      <span class="eyebrow mono">Trust Chain</span>
      <h2>Build a verifiable authority surface alongside the marketplace demo.</h2>
      <p class="lead">Explore the founder-led method W&amp;Patent uses to explain who a company is, who stands behind it, and what proof makes the story easier for humans and AI systems to trust.</p>
      <div class="actions">
        <a class="btn btn-solid" href="trust-chain.htm">Explore the methodology</a>
        <a class="btn" href="trust-chain-demo.htm">View the live demo</a>
      </div>
    </section>
```

Create `trust-chain.htm` with this minimal shell:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trust Chain Template | W&amp;Patent</title>
  <meta
    name="description"
    content="Trust Chain is a W&Patent methodology page and free template concept for founder-led firms that need a clearer authority surface for AI search."
  >
  <meta property="og:title" content="Trust Chain Template | W&Patent">
  <meta property="og:description" content="See how W&Patent frames domain, author, and content into a clearer trust chain for AI-readable authority pages.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://wpatent.com/trust-chain.htm">
  <link rel="canonical" href="https://wpatent.com/trust-chain.htm">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=IBM+Plex+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="site.css">
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
  <main class="container">
    <section class="hero">
      <span class="eyebrow mono">Trust Chain</span>
      <h1>Turn expertise into a clearer authority surface for AI search.</h1>
      <p class="lead">Trust Chain is the W&amp;Patent method for making domain, author, and content easier to verify.</p>
      <div class="actions">
        <a class="btn btn-solid" href="trust-chain-demo.htm">View the live demo</a>
      </div>
    </section>
  </main>
  <footer><div class="container mono">W&Patent - Andrew-led authority systems for clearer trust on the web.</div></footer>
  <script src="site.js" defer></script>
</body>
</html>
```

Create `trust-chain-demo.htm` with this minimal shell:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trust Chain Demo | W&amp;Patent</title>
  <meta
    name="description"
    content="See a live static example of a founder-led authority page designed around the Trust Chain method."
  >
  <meta property="og:title" content="Trust Chain Demo | W&Patent">
  <meta property="og:description" content="Inspect a static authority-page demo with domain, author, proof, and machine-readable trust layers.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://wpatent.com/trust-chain-demo.htm">
  <link rel="canonical" href="https://wpatent.com/trust-chain-demo.htm">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=IBM+Plex+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="site.css">
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
  <main class="container">
    <section class="hero">
      <span class="eyebrow mono">Live Demo</span>
      <h1>Inspect the Trust Chain method on a single authority page.</h1>
      <p class="lead">This static demo shows how a founder-led B2B firm can make its domain, author, proof, and structured content easier to parse.</p>
      <div class="actions">
        <a class="btn btn-solid" href="trust-chain.htm">Back to the methodology</a>
      </div>
    </section>
  </main>
  <footer><div class="container mono">W&Patent - Andrew-led authority systems for clearer trust on the web.</div></footer>
  <script src="site.js" defer></script>
</body>
</html>
```

Add the two new URLs in `sitemap.xml` directly before `about.htm`:

```xml
  <url><loc>https://wpatent.com/trust-chain.htm</loc></url>
  <url><loc>https://wpatent.com/trust-chain-demo.htm</loc></url>
```

- [ ] **Step 4: Run the targeted tests and confirm they pass**

Run: `node --test tests/homepage.test.mjs tests/shared-shell.test.mjs tests/discovery.test.mjs tests/trust-chain.test.mjs`

Expected: PASS

- [ ] **Step 5: Commit the route shell**

```bash
git add index.html trust-chain.htm trust-chain-demo.htm sitemap.xml tests/homepage.test.mjs tests/shared-shell.test.mjs tests/discovery.test.mjs tests/trust-chain.test.mjs
git commit -m "feat: add trust chain route shell"
```

### Task 2: Build the canonical Trust Chain methodology page

**Files:**
- Modify: `trust-chain.htm`
- Modify: `site.css`
- Modify: `tests/trust-chain.test.mjs`

- [ ] **Step 1: Extend the landing-page test with the full methodology contract**

Replace `tests/trust-chain.test.mjs` with this fuller version:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

test("trust chain landing and demo pages exist with canonical links", () => {
  assert.equal(existsSync(new URL("../trust-chain.htm", import.meta.url)), true);
  assert.equal(existsSync(new URL("../trust-chain-demo.htm", import.meta.url)), true);
});

test("trust chain landing page explains the methodology honestly", () => {
  const landing = read("trust-chain.htm");

  for (const fragment of [
    "<title>Trust Chain Template | W&amp;Patent</title>",
    "A free template for founder-led startups and B2B firms",
    "This template helps structure trust. It does not manufacture it.",
    "Domain",
    "Author",
    "Content",
    "Who This Is For",
    "Who This Is Not For",
    "Founder-led B2B firms",
    "Andrew Leung, founder of W&amp;Patent",
    "Trust Chain Scorecard",
    '"@type": "Organization"',
    '"@type": "Person"',
    '"@type": "FAQPage"'
  ]) {
    assert.match(landing, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
});
```

- [ ] **Step 2: Run the landing-page test and confirm it fails**

Run: `node --test tests/trust-chain.test.mjs`

Expected: FAIL because `trust-chain.htm` does not yet include the full value proposition, audience sections, Andrew/W&Patent positioning, or JSON-LD blocks.

- [ ] **Step 3: Expand `trust-chain.htm` into the full canonical page and add the supporting styles**

Replace the `<main>` in `trust-chain.htm` with this structure:

```html
  <main class="container">
    <section class="hero trust-hero">
      <div>
        <span class="eyebrow mono">Trust Chain</span>
        <h1>Free template for building a verifiable authority surface for AI search.</h1>
        <p class="lead">A free template for founder-led startups and B2B firms that need a clearer chain of trust across their domain, founder, and content.</p>
        <p class="mono trust-note">This template helps structure trust. It does not manufacture it.</p>
        <div class="actions">
          <a class="btn btn-solid" href="trust-chain-demo.htm">View the live demo</a>
          <a class="btn" href="mailto:wp@wpatent.com?subject=Trust%20Chain%20Scorecard">Request the scorecard</a>
        </div>
      </div>
      <aside class="card feature trust-aside">
        <p class="kicker">Andrew-led, W&amp;Patent-anchored</p>
        <h2>Andrew Leung, founder of W&amp;Patent</h2>
        <p>Trust Chain is the method W&amp;Patent uses to connect the founder, the company entity, and the proof behind a public claim so the web presence is easier to verify.</p>
      </aside>
    </section>

    <section class="section">
      <span class="eyebrow mono">Method</span>
      <h2>Trust is easier to build when the chain is explicit.</h2>
      <div class="grid cols-3 trust-pillars">
        <article class="card"><h3>Domain</h3><p>Stable URLs, canonical pages, machine-readable structure, and explicit company identity.</p></article>
        <article class="card"><h3>Author</h3><p>Visible expert authorship, founder context, and a clear relationship between person and company.</p></article>
        <article class="card"><h3>Content</h3><p>Precise claims, citations, proof blocks, and structured answers that are easy to quote and verify.</p></article>
      </div>
    </section>

    <section class="section audience-grid">
      <article class="card">
        <p class="kicker">Who This Is For</p>
        <ul>
          <li>Founder-led B2B firms with low brand recognition and real expertise</li>
          <li>Small expert-led companies that need more than a brochure site</li>
          <li>Teams ready to publish public authority assets on a custom domain</li>
        </ul>
      </article>
      <article class="card">
        <p class="kicker">Who This Is Not For</p>
        <ul>
          <li>Teams looking for instant ranking wins from a template alone</li>
          <li>Companies with no credible expert, method, or proof to show</li>
          <li>Businesses that want only gated lead magnets and no public trust surface</li>
        </ul>
      </article>
    </section>

    <section class="section">
      <span class="eyebrow mono">Proof Layer</span>
      <h2>Turn vague marketing into something easier to verify.</h2>
      <div class="grid cols-2">
        <article class="card">
          <h3>What the template includes</h3>
          <ul>
            <li>clear entity definition</li>
            <li>visible founder or expert block</li>
            <li>method or point-of-view section</li>
            <li>proof and citation blocks</li>
            <li>machine-readable trust signals</li>
          </ul>
        </article>
        <article class="card">
          <h3>What it does not promise</h3>
          <ul>
            <li>guaranteed rankings</li>
            <li>guaranteed AI recommendation</li>
            <li>guaranteed citations without real evidence</li>
          </ul>
        </article>
      </div>
    </section>

    <section class="section">
      <article class="card">
        <p class="kicker">Trust Chain Scorecard</p>
        <h2>Get a structured teardown of your current trust surface.</h2>
        <p>The scorecard grades domain clarity, founder visibility, method articulation, proof quality, and machine-readable signals so you can see where trust breaks down first.</p>
        <div class="actions">
          <a class="btn btn-solid" href="mailto:wp@wpatent.com?subject=Trust%20Chain%20Scorecard">Request the scorecard</a>
        </div>
      </article>
    </section>

    <section class="section">
      <div class="grid cols-3">
        <article class="card"><h3>What is the Trust Chain?</h3><p>A way to connect domain, author, and content so a company is easier to verify online.</p></article>
        <article class="card"><h3>Does this guarantee GEO or AEO results?</h3><p>No. It improves structural clarity and proof presentation, which supports better discovery and verification.</p></article>
        <article class="card"><h3>Why center the founder?</h3><p>For unknown firms, a visible expert often makes the company easier to trust than a brand with no human anchor.</p></article>
      </div>
    </section>
  </main>
```

Add these JSON-LD blocks in the `<head>` of `trust-chain.htm`:

```html
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "W&Patent",
    "url": "https://wpatent.com/",
    "description": "Andrew-led authority systems, patent advisory, and structured web experiences."
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Andrew Leung",
    "jobTitle": "Founder",
    "worksFor": {
      "@type": "Organization",
      "name": "W&Patent"
    },
    "description": "Founder of W&Patent and the trust anchor behind the Trust Chain methodology."
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the Trust Chain?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It is a founder-led framework for connecting domain, author, and content so a company is easier to verify."
        }
      },
      {
        "@type": "Question",
        "name": "Does this guarantee GEO or AEO outcomes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. The template improves structural clarity and proof presentation, but it does not guarantee recommendation or citation."
        }
      },
      {
        "@type": "Question",
        "name": "Who is this template for?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It is built for founder-led startups and B2B firms with real expertise and low brand recognition."
        }
      }
    ]
  }
  </script>
```

Append these styles to `site.css`:

```css
.trust-hero {
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(0, 1.3fr) minmax(280px, 0.85fr);
  align-items: start;
}

.trust-note {
  margin-top: 18px;
  color: var(--accent);
}

.trust-aside h2 {
  font-size: 1.8rem;
}

.trust-pillars,
.audience-grid {
  margin-top: 20px;
}
```

- [ ] **Step 4: Run the landing-page test and confirm it passes**

Run: `node --test tests/trust-chain.test.mjs`

Expected: PASS

- [ ] **Step 5: Commit the methodology page**

```bash
git add trust-chain.htm site.css tests/trust-chain.test.mjs
git commit -m "feat: add trust chain methodology page"
```

### Task 3: Add the live demo page, starter-kit files, and repo narrative

**Files:**
- Modify: `trust-chain-demo.htm`
- Modify: `README.md`
- Modify: `tests/trust-chain.test.mjs`
- Create: `templates/trust-chain-starter/README.md`
- Create: `templates/trust-chain-starter/config.json`
- Create: `templates/trust-chain-starter/index.html`

- [ ] **Step 1: Extend the test to cover the demo page, starter-kit files, and README**

Append these tests to `tests/trust-chain.test.mjs`:

```js
test("trust chain demo page shows a complete authority-page example", () => {
  const demo = read("trust-chain-demo.htm");

  for (const fragment of [
    "Signal Atlas",
    "Domain",
    "Author",
    "Content",
    "Proof",
    "Machine-readable layer",
    '"@type": "WebPage"',
    '"@type": "FAQPage"',
    "href=\"trust-chain.htm\""
  ]) {
    assert.match(demo, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
});

test("starter-kit files and repo README document the trust chain assets", () => {
  assert.equal(existsSync(new URL("../templates/trust-chain-starter/README.md", import.meta.url)), true);
  assert.equal(existsSync(new URL("../templates/trust-chain-starter/config.json", import.meta.url)), true);
  assert.equal(existsSync(new URL("../templates/trust-chain-starter/index.html", import.meta.url)), true);

  const starterReadme = read("templates/trust-chain-starter/README.md");
  const starterConfig = read("templates/trust-chain-starter/config.json");
  const starterHtml = read("templates/trust-chain-starter/index.html");
  const repoReadme = read("README.md");

  assert.match(starterReadme, /Trust Chain Starter Kit/i);
  assert.match(starterConfig, /companyName/);
  assert.match(starterHtml, /Founder-led authority page/i);
  assert.match(repoReadme, /Trust Chain/i);
  assert.match(repoReadme, /trust-chain\.htm/);
  assert.match(repoReadme, /templates\/trust-chain-starter\//);
});
```

- [ ] **Step 2: Run the expanded test and confirm it fails**

Run: `node --test tests/trust-chain.test.mjs`

Expected: FAIL because the demo page is still a shell, the starter-kit directory does not exist, and the root README does not yet describe the new assets.

- [ ] **Step 3: Implement the demo page, starter kit, and root README**

Replace the `<main>` in `trust-chain-demo.htm` with this demo content:

```html
  <main class="container">
    <section class="hero">
      <span class="eyebrow mono">Live Demo</span>
      <h1>Signal Atlas makes operational analytics easier for revenue teams to trust.</h1>
      <p class="lead">This fictional founder-led B2B company shows the Trust Chain method on one static page: clear entity language, visible authorship, proof blocks, and machine-readable explanation.</p>
      <div class="actions">
        <a class="btn btn-solid" href="trust-chain.htm">Back to the methodology</a>
        <a class="btn" href="https://github.com/hmc62843u/hmc62843u.github.io/tree/master/templates/trust-chain-starter">Open the starter kit</a>
      </div>
    </section>

    <section class="section grid cols-2">
      <article class="card">
        <p class="kicker">Domain</p>
        <h2>Signal Atlas</h2>
        <p>A founder-led software firm that helps revenue teams understand why pipeline changed, what accounts are at risk, and what evidence supports each recommendation.</p>
      </article>
      <article class="card">
        <p class="kicker">Author</p>
        <h2>Priya Raman, founder</h2>
        <p>Priya spent eight years building B2B analytics workflows and now publishes the operating method behind the product, the scoring logic, and the proof expectations.</p>
      </article>
    </section>

    <section class="section grid cols-3">
      <article class="card"><h3>Content</h3><p>Plain-language positioning, FAQ answers, and a visible method section make the claim legible.</p></article>
      <article class="card"><h3>Proof</h3><p>Case snapshots, source citations, and product artifacts show why the claim is believable.</p></article>
      <article class="card"><h3>Machine-readable layer</h3><p>JSON-LD, canonical URLs, and consistent entity naming help the page stay parseable.</p></article>
    </section>

    <section class="section">
      <article class="card">
        <p class="kicker">FAQ</p>
        <h3>What makes this page different from a normal startup homepage?</h3>
        <p>It explains the company, the founder, the method, and the evidence in one place instead of scattering trust across disconnected pages.</p>
      </article>
    </section>
  </main>
```

Add these JSON-LD blocks inside the `<head>` of `trust-chain-demo.htm`:

```html
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Trust Chain Demo",
    "url": "https://wpatent.com/trust-chain-demo.htm",
    "description": "Static demo of a founder-led authority page built with the Trust Chain method."
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What makes this page different from a normal startup homepage?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It shows the company, founder, method, proof, and machine-readable structure in one place so the trust story is easier to inspect."
        }
      }
    ]
  }
  </script>
```

Create `templates/trust-chain-starter/README.md`:

```md
# Trust Chain Starter Kit

This starter kit is a three-file static template for publishing a founder-led authority page.

## Files

- `index.html`: the page shell
- `config.json`: editable identity and messaging fields
- `README.md`: setup notes

## First edits

1. Replace the company and founder values in `config.json`
2. Update the method, proof, and FAQ copy in `index.html`
3. Add real citations before publishing
```

Create `templates/trust-chain-starter/config.json`:

```json
{
  "companyName": "Your Company",
  "founderName": "Your Founder",
  "primaryClaim": "Explain what your company does in one sentence.",
  "scorecardEmail": "wp@wpatent.com"
}
```

Create `templates/trust-chain-starter/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Founder-led authority page</title>
</head>
<body>
  <main>
    <section>
      <p>Founder-led authority page</p>
      <h1>Your Company makes one clear claim.</h1>
      <p>Use this file to explain the entity, the founder, the method, and the proof behind the claim.</p>
    </section>
    <section>
      <h2>Founder</h2>
      <p>Describe the expert who stands behind the company.</p>
    </section>
    <section>
      <h2>Method</h2>
      <p>Show the framework, process, or point of view that makes the company worth trusting.</p>
    </section>
    <section>
      <h2>Proof</h2>
      <p>Add citations, artifacts, and case evidence before publishing.</p>
    </section>
  </main>
</body>
</html>
```

Replace the root `README.md` with:

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

## Development

Run the tests with `npm test`.
```

- [ ] **Step 4: Run the expanded test and confirm it passes**

Run: `node --test tests/trust-chain.test.mjs`

Expected: PASS

- [ ] **Step 5: Commit the demo and starter kit**

```bash
git add trust-chain-demo.htm templates/trust-chain-starter/ README.md tests/trust-chain.test.mjs
git commit -m "feat: add trust chain demo and starter kit"
```

### Task 4: Add the static Trust Chain Scorecard intake flow

**Files:**
- Modify: `trust-chain.htm`
- Modify: `site.js`
- Modify: `site.css`
- Modify: `tests/trust-chain.test.mjs`

- [ ] **Step 1: Extend the test to cover the scorecard form and mailto helper**

Append this test to `tests/trust-chain.test.mjs`:

```js
test("trust chain scorecard intake stays static and uses the shared script helper", () => {
  const landing = read("trust-chain.htm");
  const script = read("site.js");

  for (const fragment of [
    'data-scorecard-form',
    'id="scorecardCompany"',
    'id="scorecardUrl"',
    'id="scorecardGoal"',
    'data-scorecard-status',
    'mailto:wp@wpatent.com'
  ]) {
    assert.match(landing, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }

  for (const fragment of [
    'const scorecardForm = document.querySelector("[data-scorecard-form]")',
    "function buildScorecardMailto(",
    "wp@wpatent.com",
    "Opening your email client with a prefilled Trust Chain Scorecard request."
  ]) {
    assert.match(script, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
});
```

- [ ] **Step 2: Run the scorecard test and confirm it fails**

Run: `node --test tests/trust-chain.test.mjs`

Expected: FAIL because the landing page still uses a simple mailto button and `site.js` does not yet contain the scorecard helper.

- [ ] **Step 3: Add the intake form, JS helper, and supporting styles**

Replace the simple scorecard CTA block in `trust-chain.htm` with this form-based version:

```html
    <section class="section">
      <article class="card scorecard-card">
        <p class="kicker">Trust Chain Scorecard</p>
        <h2>Request an async teardown of your current trust surface.</h2>
        <p>Tell W&amp;Patent what company you run, which URL matters most, and what trust gap you want to close first. This stays fully static: the form opens your email client with a prefilled request instead of pretending there is a backend.</p>
        <form data-scorecard-form>
          <label for="scorecardCompany">Company</label>
          <input id="scorecardCompany" name="company" type="text" required>

          <label for="scorecardUrl">Primary URL</label>
          <input id="scorecardUrl" name="url" type="url" required>

          <label for="scorecardGoal">Main trust gap</label>
          <textarea id="scorecardGoal" name="goal" rows="4" required></textarea>

          <div class="actions">
            <button class="btn btn-solid" type="submit">Request the scorecard</button>
            <a class="btn" href="mailto:wp@wpatent.com?subject=Trust%20Chain%20Scorecard">Email directly instead</a>
          </div>
        </form>
        <p class="mono" data-scorecard-status></p>
      </article>
    </section>
```

Insert this helper near the top of `site.js`, right after the existing listing-search setup:

```js
  const scorecardForm = document.querySelector("[data-scorecard-form]");
  const scorecardStatus = document.querySelector("[data-scorecard-status]");

  function buildScorecardMailto({ company, url, goal }) {
    const subject = `Trust Chain Scorecard: ${company}`;
    const body = [
      "I'd like a Trust Chain Scorecard.",
      "",
      `Company: ${company}`,
      `Primary URL: ${url}`,
      `Main trust gap: ${goal}`
    ].join("\n");

    return `mailto:wp@wpatent.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
```

Then add this submit handler just before the protocol-demo setup begins:

```js
  if (scorecardForm) {
    scorecardForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(scorecardForm);
      const company = String(formData.get("company") || "").trim();
      const url = String(formData.get("url") || "").trim();
      const goal = String(formData.get("goal") || "").trim();
      const mailto = buildScorecardMailto({ company, url, goal });

      if (scorecardStatus) {
        scorecardStatus.textContent = "Opening your email client with a prefilled Trust Chain Scorecard request.";
      }

      window.location.href = mailto;
    });
  }
```

Append these styles to `site.css`:

```css
.scorecard-card {
  max-width: 820px;
}

.scorecard-card form {
  margin-top: 18px;
}
```

- [ ] **Step 4: Run the targeted test, then the full suite**

Run: `node --test tests/trust-chain.test.mjs`

Expected: PASS

Run: `npm test`

Expected: PASS

- [ ] **Step 5: Commit the scorecard flow**

```bash
git add trust-chain.htm site.js site.css tests/trust-chain.test.mjs
git commit -m "feat: add trust chain scorecard request flow"
```

## Self-Review Checklist

- Spec coverage:
  - methodology page: covered by Task 2
  - live demo page: covered by Task 3
  - starter kit: covered by Task 3
  - scorecard CTA and intake framing: covered by Task 4
  - homepage canonical discovery and sitemap exposure: covered by Task 1
- Placeholder scan:
  - no `TODO`, `TBD`, or unspecified commands remain in the plan
  - all files named in the spec have concrete implementation steps
- Type and naming consistency:
  - route names stay `trust-chain.htm` and `trust-chain-demo.htm`
  - starter-kit folder stays `templates/trust-chain-starter/`
  - scorecard helper name stays `buildScorecardMailto`

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-07-trust-chain-template.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
