# W&Patent Marketplace Static Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the W&Patent site into a static multi-page marketplace-plus-advisory demo with crawlable listing pages, shared assets, honest mocked product flows, and SEO/AEO/GEO artifacts.

**Architecture:** Keep the site as hand-authored static HTML files with one shared stylesheet and one shared script. Put all important copy, metadata, and schema directly in HTML so the pages are readable without JavaScript; use `site.js` only for progressive enhancement such as the signup modal, dashboard reveal, and client-side listing filtering. The worktree is already dirty on core site files, so integrate local edits carefully and never discard unrelated user changes while applying this plan.

**Tech Stack:** Static HTML, shared CSS, vanilla JavaScript, JSON, Node.js built-in test runner (`node:test`)

---

## File Structure Map

- `index.html`
  Homepage with dual-path CTAs, featured listings preview, trust blocks, plans preview, and FAQ answers.
- `listings.htm`
  Crawlable listings index with static cards and JavaScript-enhanced filtering.
- `platform.htm`
  Plans, mocked owner workflow, dashboard preview, and agent-ready metadata explanation.
- `listing-points2perks.htm`
  Detail page for Points2Perks.
- `listing-tourist-aid.htm`
  Detail page for Tourist Aid.
- `listing-persona-album.htm`
  Detail page for Persona Album.
- `listing-sign-language-chat.htm`
  Detail page for Sign Language Chat.
- `listing-dashing-robo.htm`
  Detail page for Dashing Robo.
- `about.htm`
  Founder and firm credibility tied to marketplace evaluation.
- `why_us.htm`
  Differentiation page comparing W&Patent against brokers, generic law firms, and plain listing boards.
- `faq.htm`
  Mixed filing, listing, buyer, and agent-discovery FAQ with schema.
- `career.htm`
  Lightweight recruiting page aligned to the marketplace narrative.
- `main.html`
  Redirect-only page that still points to `index.html`.
- `site.css`
  Shared visual system, layout utilities, cards, forms, modal, filter controls, and dashboard styling.
- `site.js`
  Shared interaction layer for modal state, dashboard reveal, UCP demo helpers, and listing filtering.
- `.well-known/ucp.json`
  Agent-readable static manifest that clearly identifies itself as demo metadata.
- `robots.txt`
  Crawl guidance for the site.
- `sitemap.xml`
  Static sitemap with every public page.
- `package.json`
  Add a real test script using Node’s built-in test runner.
- `tests/shared-shell.test.mjs`
  Verifies shared CSS/JS includes and primary navigation on existing pages.
- `tests/homepage.test.mjs`
  Verifies homepage structure, dual-path messaging, and homepage schema markers.
- `tests/listings.test.mjs`
  Verifies listings index, detail-page coverage, canonicals, and inquiry CTAs.
- `tests/platform.test.mjs`
  Verifies platform plans, demo disclosures, modal wiring, and UCP manifest expectations.
- `tests/support-pages.test.mjs`
  Verifies rewrites for about, why-us, FAQ, and career pages plus FAQ schema.
- `tests/discovery.test.mjs`
  Verifies `robots.txt`, `sitemap.xml`, `main.html`, and final URL coverage.

### Task 1: Establish the shared shell and automated checks

**Files:**
- Create: `tests/shared-shell.test.mjs`
- Create: `site.js`
- Modify: `package.json`
- Modify: `index.html`
- Modify: `about.htm`
- Modify: `why_us.htm`
- Modify: `faq.htm`
- Modify: `career.htm`

- [ ] **Step 1: Write the failing shared-shell test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const pages = [
  "index.html",
  "about.htm",
  "why_us.htm",
  "faq.htm",
  "career.htm"
];

function read(page) {
  return readFileSync(new URL(`../${page}`, import.meta.url), "utf8");
}

for (const page of pages) {
  test(`${page} loads shared assets`, () => {
    const html = read(page);
    assert.match(html, /<link rel="stylesheet" href="site\.css">/);
    assert.match(html, /<script src="site\.js" defer><\/script>/);
  });
}

test("shared navigation exposes marketplace routes", () => {
  const html = read("about.htm");
  for (const href of [
    "index.html",
    "listings.htm",
    "platform.htm",
    "about.htm",
    "why_us.htm",
    "faq.htm",
    "career.htm"
  ]) {
    assert.match(html, new RegExp(`href="${href}"`));
  }
});
```

- [ ] **Step 2: Run the shared-shell test and confirm it fails**

Run: `node --test tests/shared-shell.test.mjs`

Expected: FAIL because `index.html` does not load `site.css` or `site.js`, and the current shared navigation does not yet include `listings.htm` or `platform.htm`.

- [ ] **Step 3: Add the shared script, real test script, and consistent nav shell**

Update `package.json` scripts so the repo has a real test command:

```json
{
  "scripts": {
    "test": "node --test tests/*.test.mjs"
  }
}
```

Create `site.js` as a safe shared enhancement layer that no-ops on pages without the matching controls:

```js
(() => {
  const modal = document.querySelector("[data-signup-modal]");
  const status = document.querySelector("[data-signup-status]");
  const dashboard = document.querySelector("[data-dashboard]");
  const planInput = document.querySelector("[data-signup-plan]");
  const searchForm = document.querySelector("[data-listing-search]");
  const searchInput = document.querySelector("[data-listing-query]");
  const cards = Array.from(document.querySelectorAll("[data-listing-card]"));

  function openSignupModal(plan = "Basic") {
    if (!modal) return;
    if (planInput) planInput.value = plan;
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeSignupModal() {
    if (!modal) return;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  }

  function filterCards(query) {
    const normalized = query.trim().toLowerCase();
    cards.forEach((card) => {
      const haystack = `${card.dataset.title} ${card.dataset.tags} ${card.dataset.summary}`.toLowerCase();
      const visible = !normalized || haystack.includes(normalized);
      card.hidden = !visible;
    });
  }

  document.querySelectorAll("[data-open-signup]").forEach((button) => {
    button.addEventListener("click", () => openSignupModal(button.dataset.plan || "Basic"));
  });

  document.querySelectorAll("[data-close-signup]").forEach((button) => {
    button.addEventListener("click", closeSignupModal);
  });

  document.querySelectorAll("[data-signup-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const plan = String(formData.get("plan") || "Basic");
      const email = String(formData.get("email") || "demo@example.com");
      if (status) {
        status.textContent = `Demo account created for ${email} on the ${plan} plan.`;
      }
      if (dashboard) {
        dashboard.hidden = false;
        dashboard.classList.add("show");
      }
      closeSignupModal();
    });
  });

  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      filterCards(searchInput.value);
    });
    searchInput.addEventListener("input", () => filterCards(searchInput.value));
  }

  window.ucpTools = {
    searchPatents(query) {
      return { mode: "demo", query };
    },
    bidPatent(patentId, amountUsd) {
      return { mode: "demo", patentId, amountUsd, action: "mock-bid" };
    },
    listPatent(payload) {
      return { mode: "demo", payload, action: "mock-listing" };
    }
  };
})();
```

Replace the primary nav in the existing shared pages with this exact link set, and add the shared script before `</body>`:

```html
<nav class="nav">
  <a href="index.html">Home</a>
  <a href="listings.htm">Listings</a>
  <a href="platform.htm">Platform</a>
  <a href="about.htm">About</a>
  <a href="why_us.htm">Why Us</a>
  <a href="faq.htm">FAQ</a>
  <a href="career.htm">Career</a>
  <button class="btn" type="button" data-open-signup data-plan="Basic">Start Free</button>
</nav>
<script src="site.js" defer></script>
```

Keep the correct `active` class on the current page link in each file. For `index.html`, remove the inline `<style>` and inline behavior block entirely once the shared assets are wired in.

- [ ] **Step 4: Run the shared-shell test again**

Run: `node --test tests/shared-shell.test.mjs`

Expected: PASS with six passing assertions and no missing shared asset failures.

- [ ] **Step 5: Commit the shared-shell foundation**

```bash
git add package.json site.js index.html about.htm why_us.htm faq.htm career.htm tests/shared-shell.test.mjs
git commit -m "feat: add shared shell and site interactions"
```

### Task 2: Rewrite the homepage as the dual-audience conversion hub

**Files:**
- Create: `tests/homepage.test.mjs`
- Modify: `index.html`
- Modify: `site.css`

- [ ] **Step 1: Write the failing homepage test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

test("homepage routes both owners and buyers", () => {
  assert.match(html, />List a Patent</);
  assert.match(html, />Explore Opportunities</);
  assert.match(html, /href="listings\.htm"/);
  assert.match(html, /href="platform\.htm"/);
});

test("homepage previews every featured listing detail page", () => {
  for (const href of [
    "listing-points2perks.htm",
    "listing-tourist-aid.htm",
    "listing-persona-album.htm",
    "listing-sign-language-chat.htm",
    "listing-dashing-robo.htm"
  ]) {
    assert.match(html, new RegExp(`href="${href}"`));
  }
});

test("homepage exposes trust and schema markers", () => {
  assert.match(html, /Andrew Leung/);
  assert.match(html, /"@type":\s*"Organization"/);
  assert.match(html, /"@type":\s*"WebSite"/);
  assert.match(html, /AEO \/ GEO FAQ/);
});
```

- [ ] **Step 2: Run the homepage test and confirm it fails**

Run: `node --test tests/homepage.test.mjs`

Expected: FAIL because the current homepage still centers one main CTA, does not link to dedicated listing pages, and does not yet include a `WebSite` schema block.

- [ ] **Step 3: Replace the homepage copy and layout with the approved structure**

Update the head metadata in `index.html` so it is explicit about the dual audience:

```html
<title>W&Patent Marketplace | List Patents, Explore Licensing Opportunities</title>
<meta
  name="description"
  content="W&Patent is a static demo of an AI-native patent marketplace where owners can list patents and buyers or licensees can explore commercialization opportunities."
>
<meta property="og:title" content="W&Patent Marketplace">
<meta
  property="og:description"
  content="Browse featured patent opportunities, preview marketplace plans, and learn how W&Patent combines advisory expertise with agent-ready discoverability."
>
<meta property="og:type" content="website">
<meta property="og:url" content="https://wpatent.com/">
<link rel="canonical" href="https://wpatent.com/">
```

Replace the homepage `<main>` with this section order and wording:

```html
<main>
  <section class="hero container hero-split">
    <div>
      <span class="eyebrow mono">Marketplace + advisory</span>
      <h1>List patents, attract buyers, and explain the opportunity clearly.</h1>
      <p class="lead">
        W&Patent is a static marketplace demo for patent owners, buyers, and licensees.
        It pairs commercialization strategy with agent-ready metadata, structured answers,
        and detailed opportunity pages that search engines and AI systems can read.
      </p>
      <div class="actions">
        <button class="btn btn-solid" type="button" data-open-signup data-plan="Pro">List a Patent</button>
        <a class="btn" href="listings.htm">Explore Opportunities</a>
      </div>
    </div>
    <aside class="card feature hero-panel">
      <p class="kicker">Founder credibility</p>
      <h2>Andrew Leung</h2>
      <p>USPTO drafting 10+ years, patent filing strategy expert, and commercialization-focused advisor.</p>
      <p class="mono">Balanced for product visibility, buyer understanding, and practical filing strategy.</p>
    </aside>
  </section>

  <section class="section container">
    <span class="eyebrow mono">How it works</span>
    <div class="grid cols-2 split-benefits">
      <article class="card">
        <h3>For patent owners</h3>
        <p>Choose a plan, preview a dashboard, and position your patent with clearer commercial context.</p>
      </article>
      <article class="card">
        <h3>For buyers and licensees</h3>
        <p>Browse focused opportunity pages with filing identifiers, use cases, and direct inquiry paths.</p>
      </article>
    </div>
  </section>

  <section class="section container">
    <span class="eyebrow mono">Featured opportunities</span>
    <h2>Five live marketplace examples</h2>
    <div class="grid cols-2 listing-preview">
      <article class="card"><h3><a href="listing-points2perks.htm">Points2Perks x Local Licensed Issuer</a></h3><p>Policy-gated loyalty settlement infrastructure for Japan.</p></article>
      <article class="card"><h3><a href="listing-tourist-aid.htm">Tourist Aid</a></h3><p>Off-grid travel safety and autonomous SOS support.</p></article>
      <article class="card"><h3><a href="listing-persona-album.htm">Persona Album</a></h3><p>AI storytelling and personalized multimedia narration.</p></article>
      <article class="card"><h3><a href="listing-sign-language-chat.htm">Sign Language Chat</a></h3><p>Inclusive teletherapy workflows with sign-language support.</p></article>
      <article class="card"><h3><a href="listing-dashing-robo.htm">Dashing Robo</a></h3><p>Autonomous building logistics and payload docking.</p></article>
    </div>
    <p><a class="btn" href="listings.htm">View all listings</a></p>
  </section>

  <section class="section container">
    <span class="eyebrow mono">Platform preview</span>
    <h2>Mocked plans and dashboard workflow</h2>
    <div class="grid cols-3 pricing-preview">
      <article class="card"><p class="kicker">Basic</p><p class="price">Free</p><p>List one patent, search the marketplace, and review baseline analytics.</p></article>
      <article class="card feature"><p class="kicker">Pro</p><p class="price">$49/mo</p><p>Manage multiple listings, preview bidding workflows, and unlock deeper analytics.</p></article>
      <article class="card"><p class="kicker">Enterprise</p><p class="price">$199/mo</p><p>Model white-label workflows and custom agent-readiness for portfolio teams.</p></article>
    </div>
    <p><a class="btn" href="platform.htm">Explore the platform</a></p>
  </section>

  <section class="section container">
    <span class="eyebrow mono">AEO / GEO FAQ</span>
    <p id="faq-summary" class="lead">Key questions are written so search engines and answer engines can retrieve the right marketplace context quickly.</p>
    <div class="grid cols-3">
      <article class="card"><h3 class="faq-q">How do owners list a patent?</h3><p>They choose a plan, open the demo signup flow, and preview how a structured listing would appear.</p></article>
      <article class="card"><h3 class="faq-q">How do buyers evaluate opportunities?</h3><p>They browse detail pages that explain the market context, filing status, and commercial fit.</p></article>
      <article class="card"><h3 class="faq-q">How do AI systems discover listings?</h3><p>Through crawlable pages, JSON-LD, direct answers, and the static `.well-known/ucp.json` manifest.</p></article>
    </div>
  </section>
</main>
```

Add a `WebSite` schema block beside the existing organization schema:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "W&Patent Marketplace",
  "url": "https://wpatent.com/",
  "description": "Static patent marketplace demo for owners, buyers, and licensees."
}
</script>
```

Extend `site.css` with the supporting classes used above:

```css
.hero-split {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.8fr);
  gap: 24px;
  align-items: start;
}

.hero-panel,
.pricing-preview .card,
.listing-preview .card {
  min-height: 100%;
}

.split-benefits,
.listing-preview,
.pricing-preview {
  margin-top: 20px;
}

.price {
  font-size: 2rem;
  color: var(--text);
  margin: 0.2rem 0 0.8rem;
}

@media (max-width: 900px) {
  .hero-split {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 4: Run the homepage test again**

Run: `node --test tests/homepage.test.mjs`

Expected: PASS with all three homepage assertions succeeding.

- [ ] **Step 5: Commit the homepage rewrite**

```bash
git add index.html site.css tests/homepage.test.mjs
git commit -m "feat: rebuild homepage for owners and buyers"
```

### Task 3: Build the listings index and all five detail pages

**Files:**
- Create: `tests/listings.test.mjs`
- Create: `listings.htm`
- Create: `listing-points2perks.htm`
- Create: `listing-tourist-aid.htm`
- Create: `listing-persona-album.htm`
- Create: `listing-sign-language-chat.htm`
- Create: `listing-dashing-robo.htm`
- Modify: `site.css`
- Modify: `site.js`

- [ ] **Step 1: Write the failing listings test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const listings = readFileSync(new URL("../listings.htm", import.meta.url), "utf8");
const detailPages = [
  "listing-points2perks.htm",
  "listing-tourist-aid.htm",
  "listing-persona-album.htm",
  "listing-sign-language-chat.htm",
  "listing-dashing-robo.htm"
];

test("listings index includes filter UI and all detail links", () => {
  assert.match(listings, /data-listing-search/);
  assert.match(listings, /data-listing-query/);
  assert.match(listings, /data-empty-state/);
  for (const href of detailPages) {
    assert.match(listings, new RegExp(`href="${href}"`));
  }
});

for (const page of detailPages) {
  test(`${page} exposes canonical, inquiry CTA, and schema`, () => {
    const html = readFileSync(new URL(`../${page}`, import.meta.url), "utf8");
    assert.match(html, /<link rel="canonical" href="https:\/\/hmc62843u\.github\.io\//);
    assert.match(html, /mailto:wp@wpatent\.com/);
    assert.match(html, /<script type="application\/ld\+json">/);
  });
}
```

- [ ] **Step 2: Run the listings test and confirm it fails**

Run: `node --test tests/listings.test.mjs`

Expected: FAIL because `listings.htm` and the five new detail pages do not exist yet.

- [ ] **Step 3: Create the listings index, filter UI, and all five detail pages**

Create `listings.htm` with crawlable cards and JavaScript-enhanced filtering:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Patent Listings | W&Patent Marketplace</title>
  <meta
    name="description"
    content="Browse W&Patent marketplace listings for patent sale and licensing opportunities across payments, travel safety, AI storytelling, teletherapy, and robotics."
  >
  <meta property="og:title" content="Patent Listings | W&Patent Marketplace">
  <meta property="og:description" content="Explore detailed patent opportunities for sale or licensing.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://wpatent.com/listings.htm">
  <link rel="canonical" href="https://wpatent.com/listings.htm">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=IBM+Plex+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="site.css">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "W&Patent marketplace listings",
    "itemListElement": [
      {"@type":"ListItem","position":1,"url":"https://wpatent.com/listing-points2perks.htm"},
      {"@type":"ListItem","position":2,"url":"https://wpatent.com/listing-tourist-aid.htm"},
      {"@type":"ListItem","position":3,"url":"https://wpatent.com/listing-persona-album.htm"},
      {"@type":"ListItem","position":4,"url":"https://wpatent.com/listing-sign-language-chat.htm"},
      {"@type":"ListItem","position":5,"url":"https://wpatent.com/listing-dashing-robo.htm"}
    ]
  }
  </script>
</head>
<body>
  <header class="topbar">
    <div class="container topbar-inner">
      <a class="brand" href="index.html">W&<strong>Patent</strong></a>
      <nav class="nav">
        <a href="index.html">Home</a>
        <a class="active" href="listings.htm">Listings</a>
        <a href="platform.htm">Platform</a>
        <a href="about.htm">About</a>
        <a href="why_us.htm">Why Us</a>
        <a href="faq.htm">FAQ</a>
        <a href="career.htm">Career</a>
        <button class="btn" type="button" data-open-signup data-plan="Basic">Start Free</button>
      </nav>
    </div>
  </header>
  <main class="container">
    <section class="page-title">
      <span class="eyebrow mono">Marketplace listings</span>
      <h1>Browse patent opportunities with commercial context.</h1>
      <p class="lead">Use the static filter below to preview how buyers and licensees can narrow the marketplace inventory.</p>
    </section>
    <form class="filter-bar" data-listing-search>
      <label class="mono" for="listingQuery">Search by keyword, sector, or use case</label>
      <input id="listingQuery" name="query" type="search" placeholder="Try payments, travel safety, teletherapy, or robotics" data-listing-query>
    </form>
    <p class="card" data-empty-state hidden>No listings match that search yet. Try a broader category or open the full marketplace overview from the homepage.</p>
    <section class="section grid cols-2">
      <article class="card" data-listing-card data-title="Points2Perks" data-tags="payments loyalty japan licensing" data-summary="policy-gated loyalty settlement infrastructure">
        <span class="status">For Sale</span>
        <h3><a href="listing-points2perks.htm">Points2Perks x Local Licensed Issuer</a></h3>
        <p>Policy-gated loyalty settlement layer for Japan with multi-rail reward infrastructure.</p>
      </article>
      <article class="card" data-listing-card data-title="Tourist Aid" data-tags="travel safety lora emergency licensing" data-summary="off-grid autonomous sos support">
        <span class="status">For Sale / Licensing</span>
        <h3><a href="listing-tourist-aid.htm">Tourist Aid</a></h3>
        <p>LoRa mesh safety system for off-grid travel support and autonomous SOS escalation.</p>
      </article>
      <article class="card" data-listing-card data-title="Persona Album" data-tags="ai storytelling multimedia licensing" data-summary="personalized multimedia narration">
        <span class="status">For Sale / Licensing</span>
        <h3><a href="listing-persona-album.htm">Persona Album</a></h3>
        <p>AI storytelling workflows built around personality-driven multimedia narration.</p>
      </article>
      <article class="card" data-listing-card data-title="Sign Language Chat" data-tags="teletherapy accessibility sign language health" data-summary="inclusive conversational support">
        <span class="status">For Sale / Licensing</span>
        <h3><a href="listing-sign-language-chat.htm">Sign Language Chat</a></h3>
        <p>Accessible teletherapy interaction model with sign-language-aware support.</p>
      </article>
      <article class="card" data-listing-card data-title="Dashing Robo" data-tags="robotics logistics autonomous buildings" data-summary="payload docking and building logistics">
        <span class="status">For Sale / Licensing</span>
        <h3><a href="listing-dashing-robo.htm">Dashing Robo</a></h3>
        <p>Autonomous payload docking system for building logistics and delivery workflows.</p>
      </article>
    </section>
  </main>
  <script src="site.js" defer></script>
</body>
</html>
```

Add the filter and detail-page support styles:

```css
.filter-bar {
  display: grid;
  gap: 8px;
  margin: 0 0 24px;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface);
}

.detail-hero {
  display: grid;
  gap: 18px;
  grid-template-columns: minmax(0, 1.35fr) minmax(260px, 0.85fr);
  align-items: start;
}

.detail-meta {
  display: grid;
  gap: 12px;
}

@media (max-width: 900px) {
  .detail-hero {
    grid-template-columns: 1fr;
  }
}
```

Refine the search helper in `site.js` so it also restores cards when the query is empty:

```js
function filterCards(query) {
  const normalized = query.trim().toLowerCase();
  let visibleCount = 0;
  cards.forEach((card) => {
    const haystack = `${card.dataset.title} ${card.dataset.tags} ${card.dataset.summary}`.toLowerCase();
    const visible = !normalized || haystack.includes(normalized);
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });

  const emptyState = document.querySelector("[data-empty-state]");
  if (emptyState) {
    emptyState.hidden = visibleCount !== 0;
  }
}
```

Create the five detail pages using the same shell, each with page-specific metadata, canonical URL, inquiry CTA, and a `WebPage` JSON-LD block. Use these exact titles and summaries inside the page bodies:

```html
<!-- listing-points2perks.htm -->
<title>Points2Perks x Local Licensed Issuer | W&Patent Marketplace</title>
<meta name="description" content="Explore the Points2Perks patent opportunity covering compliance ring-fenced cross-border payments and licensed-partnered multi-rail loyalty infrastructure.">
<link rel="canonical" href="https://wpatent.com/listing-points2perks.htm">
<section class="page-title detail-hero">
  <div>
    <span class="eyebrow mono">Payments infrastructure</span>
    <h1>Points2Perks x Local Licensed Issuer (Japan)</h1>
    <p class="lead">A policy-gated loyalty settlement layer designed for cross-border payments and licensed multi-rail reward programs.</p>
  </div>
  <aside class="card detail-meta">
    <p class="kicker">Filed assets</p>
    <p><span class="mono">US 63/864,341</span> Compliance Ring-Fenced Cross-Border Payments</p>
    <p><span class="mono">US 63/864,366</span> Licensed-Partnered Multi-Rail Loyalty</p>
    <a class="btn btn-solid" href="mailto:wp@wpatent.com?subject=Interest%20in%20Points2Perks">Inquire about this listing</a>
  </aside>
</section>
```

```html
<!-- listing-tourist-aid.htm -->
<title>Tourist Aid | W&Patent Marketplace</title>
<meta name="description" content="Review the Tourist Aid patent opportunity for off-grid travel safety, LoRa mesh support, and autonomous SOS escalation.">
<link rel="canonical" href="https://wpatent.com/listing-tourist-aid.htm">
<section class="page-title detail-hero">
  <div>
    <span class="eyebrow mono">Travel safety</span>
    <h1>Tourist Aid</h1>
    <p class="lead">LoRa mesh and autonomous SOS support designed for travelers who need off-grid resilience and faster incident escalation.</p>
  </div>
  <aside class="card detail-meta">
    <p class="kicker">Filed assets</p>
    <p><span class="mono">US 63/859,951</span> Autonomous Network Healing</p>
    <a class="btn btn-solid" href="mailto:wp@wpatent.com?subject=Interest%20in%20Tourist%20Aid">Inquire about this listing</a>
  </aside>
</section>
```

```html
<!-- listing-persona-album.htm -->
<title>Persona Album | W&Patent Marketplace</title>
<meta name="description" content="Review the Persona Album opportunity for AI storytelling, personality-driven narration, and personalized multimedia experiences.">
<link rel="canonical" href="https://wpatent.com/listing-persona-album.htm">
<section class="page-title detail-hero">
  <div>
    <span class="eyebrow mono">AI storytelling</span>
    <h1>Persona Album</h1>
    <p class="lead">A personalized multimedia narration concept centered on AI storytelling, memory capture, and personality-driven content delivery.</p>
  </div>
  <aside class="card detail-meta">
    <p class="kicker">Filed assets</p>
    <p><span class="mono">US 63/715,656</span> Personalized Multimedia Narration</p>
    <a class="btn btn-solid" href="mailto:wp@wpatent.com?subject=Interest%20in%20Persona%20Album">Inquire about this listing</a>
  </aside>
</section>
```

```html
<!-- listing-sign-language-chat.htm -->
<title>Sign Language Chat | W&Patent Marketplace</title>
<meta name="description" content="Review the Sign Language Chat opportunity for inclusive teletherapy, sign-language interfaces, and conversational support workflows.">
<link rel="canonical" href="https://wpatent.com/listing-sign-language-chat.htm">
<section class="page-title detail-hero">
  <div>
    <span class="eyebrow mono">Accessible teletherapy</span>
    <h1>Sign Language Chat</h1>
    <p class="lead">An inclusive teletherapy workflow that combines conversational support with a sign-language-aware interaction model.</p>
  </div>
  <aside class="card detail-meta">
    <p class="kicker">Filed assets</p>
    <p><span class="mono">Patent Pending</span> Conversational Support with Sign Language Interface</p>
    <a class="btn btn-solid" href="mailto:wp@wpatent.com?subject=Interest%20in%20Sign%20Language%20Chat">Inquire about this listing</a>
  </aside>
</section>
```

```html
<!-- listing-dashing-robo.htm -->
<title>Dashing Robo | W&Patent Marketplace</title>
<meta name="description" content="Review the Dashing Robo opportunity for autonomous building logistics, robot payload docking, and delivery workflow automation.">
<link rel="canonical" href="https://wpatent.com/listing-dashing-robo.htm">
<section class="page-title detail-hero">
  <div>
    <span class="eyebrow mono">Robotics logistics</span>
    <h1>Dashing Robo</h1>
    <p class="lead">A robotics logistics concept focused on autonomous payload docking, elevator coordination, and delivery movement inside buildings.</p>
  </div>
  <aside class="card detail-meta">
    <p class="kicker">Filed assets</p>
    <p><span class="mono">US 64/051,103</span> System and Method for Autonomous Payload Docking</p>
    <a class="btn btn-solid" href="mailto:wp@wpatent.com?subject=Interest%20in%20Dashing%20Robo">Inquire about this listing</a>
  </aside>
</section>
```

For every detail page, include a supporting body section with three cards titled `Commercial angle`, `Buyer fit`, and `Why this listing is on W&Patent`, and include this JSON-LD shape adjusted to the page’s title and URL:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Points2Perks x Local Licensed Issuer | W&Patent Marketplace",
  "url": "https://wpatent.com/listing-points2perks.htm",
  "description": "Patent marketplace detail page for the Points2Perks opportunity.",
  "about": {
    "@type": "Thing",
    "name": "Points2Perks x Local Licensed Issuer"
  },
  "publisher": {
    "@type": "Organization",
    "name": "W&Patent",
    "url": "https://wpatent.com/"
  }
}
</script>
```

- [ ] **Step 4: Run the listings test again**

Run: `node --test tests/listings.test.mjs`

Expected: PASS with one passing index test and five passing detail-page tests.

- [ ] **Step 5: Commit the marketplace listing pages**

```bash
git add listings.htm listing-points2perks.htm listing-tourist-aid.htm listing-persona-album.htm listing-sign-language-chat.htm listing-dashing-robo.htm site.css site.js tests/listings.test.mjs
git commit -m "feat: add marketplace listings and detail pages"
```

### Task 4: Build the platform page and static demo workflow

**Files:**
- Create: `tests/platform.test.mjs`
- Create: `platform.htm`
- Modify: `index.html`
- Modify: `site.css`
- Modify: `site.js`
- Modify: `.well-known/ucp.json`

- [ ] **Step 1: Write the failing platform test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const platform = readFileSync(new URL("../platform.htm", import.meta.url), "utf8");
const ucp = JSON.parse(readFileSync(new URL("../.well-known/ucp.json", import.meta.url), "utf8"));

test("platform page includes plans, demo disclosure, and dashboard preview", () => {
  assert.match(platform, /Basic/);
  assert.match(platform, /Pro/);
  assert.match(platform, /Enterprise/);
  assert.match(platform, /mocked workflow/i);
  assert.match(platform, /Your portfolio command center/);
  assert.match(platform, /data-signup-form/);
});

test("ucp manifest stays honest about static hosting", () => {
  assert.equal(ucp.auth.type, "none");
  assert.match(ucp.auth.note, /Static GitHub Pages demo/i);
  assert.equal(Array.isArray(ucp.capabilities), true);
});
```

- [ ] **Step 2: Run the platform test and confirm it fails**

Run: `node --test tests/platform.test.mjs`

Expected: FAIL because `platform.htm` does not exist and the current UCP manifest still implies a live token endpoint.

- [ ] **Step 3: Add the platform page, shared modal markup, and a demo-safe UCP manifest**

Create `platform.htm` with shared nav, page metadata, plan cards, dashboard teaser, and explicit demo language:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Platform Plans | W&Patent Marketplace</title>
  <meta
    name="description"
    content="Review W&Patent marketplace plans, preview the mocked owner dashboard, and understand the platform's agent-ready metadata model."
  >
  <meta property="og:title" content="Platform Plans | W&Patent Marketplace">
  <meta property="og:description" content="Explore Basic, Pro, and Enterprise plans in the W&Patent static product demo.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://wpatent.com/platform.htm">
  <link rel="canonical" href="https://wpatent.com/platform.htm">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=IBM+Plex+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="site.css">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "W&Patent Marketplace Platform",
    "url": "https://wpatent.com/platform.htm",
    "description": "Static demo of a patent marketplace platform for listings, buyer discovery, and agent-ready metadata."
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
        <a class="active" href="platform.htm">Platform</a>
        <a href="about.htm">About</a>
        <a href="why_us.htm">Why Us</a>
        <a href="faq.htm">FAQ</a>
        <a href="career.htm">Career</a>
        <button class="btn" type="button" data-open-signup data-plan="Pro">Start Free</button>
      </nav>
    </div>
  </header>
  <main class="container">
    <section class="page-title">
      <span class="eyebrow mono">Platform demo</span>
      <h1>Preview the marketplace workflow before a backend exists.</h1>
      <p class="lead">Everything on this page is a static, mocked workflow designed to show how owners, buyers, and AI agents would interact with the marketplace.</p>
    </section>
    <section class="section grid cols-3">
      <article class="card"><p class="kicker">Basic</p><p class="price">Free</p><p>List one patent, search the marketplace, and review baseline analytics.</p><p><button class="btn" type="button" data-open-signup data-plan="Basic">Start Free</button></p></article>
      <article class="card feature"><p class="kicker">Pro</p><p class="price">$49/mo</p><p>Preview multi-listing workflows, bidding tools, and richer dashboard visibility.</p><p><button class="btn btn-solid" type="button" data-open-signup data-plan="Pro">Preview Pro</button></p></article>
      <article class="card"><p class="kicker">Enterprise</p><p class="price">$199/mo</p><p>Model white-label portfolio workflows and custom agent-readiness discussions.</p><p><button class="btn" type="button" data-open-signup data-plan="Enterprise">Talk to W&Patent</button></p></article>
    </section>
    <section class="section">
      <article class="card">
        <p class="kicker">Mocked workflow</p>
        <h2>Your portfolio command center</h2>
        <p>Submit the demo form to reveal an in-browser dashboard preview. No account is persisted and no billing action is taken.</p>
      </article>
    </section>
    <section class="section dashboard" data-dashboard hidden>
      <div class="grid cols-2">
        <article class="card"><h3>Patent portfolio manager</h3><p>Preview grid and list views, listing quality cues, and valuation summaries.</p></article>
        <article class="card"><h3>Bid tracking</h3><p>See how incoming offers and counter states would be summarized.</p></article>
        <article class="card"><h3>Analytics</h3><p>Views, inquiry volume, and listing-quality indicators in one place.</p></article>
        <article class="card"><h3>Quick actions</h3><p><button class="btn" type="button">List New Patent</button> <button class="btn" type="button">View Market Report</button></p></article>
      </div>
    </section>
    <section class="section">
      <article class="card">
        <p class="kicker">Agent-ready metadata</p>
        <h2>How the static demo exposes capabilities</h2>
        <p>The site ships a `.well-known/ucp.json` file, direct-answer FAQ content, JSON-LD on core pages, and tool descriptions on demo forms so search engines and AI systems can understand the marketplace structure.</p>
      </article>
    </section>
  </main>
  <div class="modal" data-signup-modal aria-hidden="true">
    <div class="modal-box">
      <h3>Preview the owner workflow</h3>
      <p class="mono">This is a mocked workflow only. No real account or payment is created.</p>
      <form data-signup-form>
        <label for="platformEmail">Email</label>
        <input id="platformEmail" name="email" type="email" required>
        <label for="platformPlan">Plan</label>
        <select id="platformPlan" name="plan" data-signup-plan>
          <option>Basic</option>
          <option>Pro</option>
          <option>Enterprise</option>
        </select>
        <div class="actions">
          <button class="btn btn-solid" type="submit">Reveal dashboard</button>
          <button class="btn" type="button" data-close-signup>Close</button>
        </div>
      </form>
      <p class="mono" data-signup-status></p>
    </div>
  </div>
  <script src="site.js" defer></script>
</body>
</html>
```

Update the homepage modal markup to match the shared selectors used above:

```html
<div class="modal" data-signup-modal aria-hidden="true">
  <div class="modal-box">
    <h3>Preview the owner workflow</h3>
    <p class="mono">This is a mocked workflow only. No real account or payment is created.</p>
    <form data-signup-form toolname="listPatent" tooldescription="List patent for sale with AI valuation">
      <label for="signupEmail">Email</label>
      <input id="signupEmail" name="email" type="email" required>
      <label for="signupPlan">Plan</label>
      <select id="signupPlan" name="plan" data-signup-plan>
        <option>Basic</option>
        <option>Pro</option>
        <option>Enterprise</option>
      </select>
      <div class="actions">
        <button class="btn btn-solid" type="submit">Reveal dashboard</button>
        <button class="btn" type="button" data-close-signup>Close</button>
      </div>
    </form>
    <p class="mono" data-signup-status></p>
  </div>
</div>
<section class="section container dashboard" data-dashboard hidden>
```

Update `.well-known/ucp.json` so it stays machine-readable without implying a backend:

```json
{
  "version": "1.0",
  "capabilities": [
    {
      "name": "searchPatents",
      "description": "Search static patent listings by technology, assignee, or use case keyword."
    },
    {
      "name": "bidPatent",
      "description": "Preview a mocked bidding workflow for a featured patent listing."
    },
    {
      "name": "listPatent",
      "description": "Preview how a patent listing would be structured in the static marketplace demo."
    }
  ],
  "auth": {
    "type": "none",
    "note": "Static GitHub Pages demo. No live token endpoint or delegated payment API is enabled."
  },
  "pricing": {
    "model": "tiered",
    "currency": "USD"
  },
  "endpoints": {
    "platform": "https://wpatent.com/platform.htm",
    "listings": "https://wpatent.com/listings.htm"
  }
}
```

Add one small modal utility style so the shared signup experience works the same on the homepage and platform page:

```css
.dashboard[hidden] {
  display: none;
}
```

- [ ] **Step 4: Run the platform test again**

Run: `node --test tests/platform.test.mjs`

Expected: PASS with both the page structure test and the UCP honesty test succeeding.

- [ ] **Step 5: Commit the platform experience**

```bash
git add platform.htm index.html site.css site.js .well-known/ucp.json tests/platform.test.mjs
git commit -m "feat: add platform demo and static agent manifest"
```

### Task 5: Rewrite the supporting credibility pages

**Files:**
- Create: `tests/support-pages.test.mjs`
- Modify: `about.htm`
- Modify: `why_us.htm`
- Modify: `faq.htm`
- Modify: `career.htm`

- [ ] **Step 1: Write the failing support-pages test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const about = readFileSync(new URL("../about.htm", import.meta.url), "utf8");
const whyUs = readFileSync(new URL("../why_us.htm", import.meta.url), "utf8");
const faq = readFileSync(new URL("../faq.htm", import.meta.url), "utf8");
const career = readFileSync(new URL("../career.htm", import.meta.url), "utf8");

test("about page ties expertise to marketplace evaluation", () => {
  assert.match(about, /Andrew Leung/);
  assert.match(about, /marketplace/);
  assert.match(about, /commercialization/i);
  assert.match(about, /<link rel="canonical" href="https:\/\/hmc62843u\.github\.io\/about\.htm">/);
});

test("why us page compares W&Patent to generic alternatives", () => {
  assert.match(whyUs, /generic brokers/i);
  assert.match(whyUs, /listing boards/i);
  assert.match(whyUs, /advisory/i);
  assert.match(whyUs, /<link rel="canonical" href="https:\/\/hmc62843u\.github\.io\/why_us\.htm">/);
});

test("faq page covers listing and agent discovery topics", () => {
  assert.match(faq, /How does listing work\?/);
  assert.match(faq, /How do AI agents discover listings\?/);
  assert.match(faq, /"@type":\s*"FAQPage"/);
  assert.match(faq, /<link rel="canonical" href="https:\/\/hmc62843u\.github\.io\/faq\.htm">/);
});

test("career page reflects the hybrid marketplace mission", () => {
  assert.match(career, /marketplace/i);
  assert.match(career, /advisory/i);
  assert.match(career, /<link rel="canonical" href="https:\/\/hmc62843u\.github\.io\/career\.htm">/);
});
```

- [ ] **Step 2: Run the support-pages test and confirm it fails**

Run: `node --test tests/support-pages.test.mjs`

Expected: FAIL because the current support pages still read like a legacy advisory site and the FAQ does not yet cover listing or agent-discovery topics.

- [ ] **Step 3: Rewrite the support pages to reinforce the hybrid brand**

Update `about.htm` to connect founder expertise to the marketplace:

```html
<title>About W&Patent | Marketplace and Advisory Credibility</title>
<meta
  name="description"
  content="Learn how W&Patent combines Andrew Leung's patent strategy experience with a clearer marketplace presentation for patent opportunities."
>
<meta property="og:title" content="About W&Patent">
<meta property="og:description" content="Founder and company context behind the W&Patent marketplace and advisory approach.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://wpatent.com/about.htm">
<link rel="canonical" href="https://wpatent.com/about.htm">
<section class="page-title">
  <span class="eyebrow mono">About W&Patent</span>
  <h1>Advisory judgment behind a clearer patent marketplace.</h1>
  <p class="lead">W&Patent combines patent strategy, drafting experience, and commercialization framing so listings are easier for buyers, licensees, search engines, and AI systems to understand.</p>
</section>
<section class="section grid cols-2">
  <article class="card">
    <h3>Why this marketplace exists</h3>
    <p>Many patent opportunities fail to convert because the technical story, the filing story, and the buyer story are scattered. W&Patent puts those pieces into one structured presentation.</p>
  </article>
  <article class="card">
    <h3>Andrew Leung</h3>
    <p>Andrew Leung brings more than a decade of USPTO drafting and filing strategy experience to a marketplace built around practical commercialization outcomes.</p>
  </article>
</section>
```

Update `why_us.htm` to compare against alternatives directly:

```html
<title>Why W&Patent | Better Than Generic Brokers and Listing Boards</title>
<meta
  name="description"
  content="See how W&Patent combines advisory rigor, commercialization framing, and discoverable listing pages for stronger patent marketplace communication."
>
<meta property="og:title" content="Why W&Patent">
<meta property="og:description" content="Why W&Patent offers more context than generic brokers, law-firm brochures, or plain listing boards.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://wpatent.com/why_us.htm">
<link rel="canonical" href="https://wpatent.com/why_us.htm">
<section class="page-title">
  <span class="eyebrow mono">Why W&Patent</span>
  <h1>More context than a listing board, more product visibility than a generic advisory site.</h1>
</section>
<section class="section grid cols-2">
  <article class="card"><h3>Not a generic broker</h3><p>W&Patent does not treat every listing like a commodity. Each opportunity is framed around commercial fit and filing context.</p></article>
  <article class="card"><h3>Not just a law-firm brochure</h3><p>The site is designed to attract discovery, not simply describe services.</p></article>
  <article class="card"><h3>Better than plain listing boards</h3><p>Marketplace pages explain why the asset matters, who it fits, and how a buyer should evaluate it.</p></article>
  <article class="card"><h3>Advisory still matters</h3><p>Behind the product story is a strategy-first view of filing sequence, positioning, and deal readiness.</p></article>
</section>
```

Update `faq.htm` so it mixes filing, listing, and agent questions, and add a `FAQPage` JSON-LD block:

```html
<title>Patent Marketplace FAQ | W&Patent</title>
<meta
  name="description"
  content="Read filing, listing, buyer, and AI-discovery questions for the W&Patent static marketplace demo."
>
<meta property="og:title" content="Patent Marketplace FAQ | W&Patent">
<meta property="og:description" content="Answers covering patent filings, marketplace listings, buyers, and agent discoverability.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://wpatent.com/faq.htm">
<link rel="canonical" href="https://wpatent.com/faq.htm">
<section class="section grid cols-2">
  <article class="card"><h3>Should I file a provisional first?</h3><p>Often yes when speed matters and you need an early filing date while refining claim strategy.</p></article>
  <article class="card"><h3>How does listing work?</h3><p>In this static demo, owners choose a plan, preview a signup workflow, and then reveal a mocked dashboard showing how a listing could be managed.</p></article>
  <article class="card"><h3>What is a PCT application?</h3><p>A PCT filing creates a coordinated path for later national filings across participating jurisdictions.</p></article>
  <article class="card"><h3>How do buyers engage?</h3><p>Buyers review the opportunity pages, evaluate fit, and contact W&Patent directly through inquiry links.</p></article>
  <article class="card"><h3>How do AI agents discover listings?</h3><p>They read crawlable listing pages, FAQ answers, JSON-LD, and the static `.well-known/ucp.json` manifest.</p></article>
  <article class="card"><h3>Need case-specific guidance?</h3><p>For filing sequence, jurisdiction strategy, or commercialization framing, contact W&Patent directly.</p></article>
</section>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type":"Question","name":"Should I file a provisional first?","acceptedAnswer":{"@type":"Answer","text":"Often yes when speed matters and you need an early filing date while refining claim strategy."}},
    {"@type":"Question","name":"How does listing work?","acceptedAnswer":{"@type":"Answer","text":"In this static demo, owners choose a plan, preview a signup workflow, and then reveal a mocked dashboard showing how a listing could be managed."}},
    {"@type":"Question","name":"How do AI agents discover listings?","acceptedAnswer":{"@type":"Answer","text":"They read crawlable listing pages, FAQ answers, JSON-LD, and the static .well-known/ucp.json manifest."}}
  ]
}
</script>
```

Update `career.htm` so it reflects the hybrid product mission:

```html
<title>Careers | W&Patent Marketplace</title>
<meta
  name="description"
  content="Join W&Patent to work on marketplace clarity, advisory rigor, and stronger communication around patent opportunities."
>
<meta property="og:title" content="Careers | W&Patent Marketplace">
<meta property="og:description" content="Career paths for builders who care about marketplace clarity and patent commercialization support.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://wpatent.com/career.htm">
<link rel="canonical" href="https://wpatent.com/career.htm">
<section class="page-title">
  <span class="eyebrow mono">Career</span>
  <h1>Help shape a marketplace that makes patent opportunities easier to understand.</h1>
</section>
<section class="section grid cols-2">
  <article class="card">
    <h3>Who we want</h3>
    <p>We look for builders who can move between product thinking, technical writing, and commercialization logic.</p>
  </article>
  <article class="card">
    <h3>Why the work matters</h3>
    <p>The mission blends marketplace clarity with advisory rigor so inventors and buyers can make faster decisions.</p>
  </article>
</section>
```

- [ ] **Step 4: Run the support-pages test again**

Run: `node --test tests/support-pages.test.mjs`

Expected: PASS with all four support-page assertions succeeding.

- [ ] **Step 5: Commit the support-page rewrites**

```bash
git add about.htm why_us.htm faq.htm career.htm tests/support-pages.test.mjs
git commit -m "feat: rewrite support pages for marketplace positioning"
```

### Task 6: Add crawl artifacts and run final verification

**Files:**
- Create: `tests/discovery.test.mjs`
- Create: `robots.txt`
- Create: `sitemap.xml`
- Modify: `main.html`

- [ ] **Step 1: Write the failing discovery test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const robots = readFileSync(new URL("../robots.txt", import.meta.url), "utf8");
const sitemap = readFileSync(new URL("../sitemap.xml", import.meta.url), "utf8");
const redirect = readFileSync(new URL("../main.html", import.meta.url), "utf8");

test("robots exposes sitemap", () => {
  assert.match(robots, /Sitemap: https:\/\/hmc62843u\.github\.io\/sitemap\.xml/);
});

test("sitemap lists every public page", () => {
  for (const url of [
    "https://wpatent.com/",
    "https://wpatent.com/listings.htm",
    "https://wpatent.com/platform.htm",
    "https://wpatent.com/about.htm",
    "https://wpatent.com/why_us.htm",
    "https://wpatent.com/faq.htm",
    "https://wpatent.com/career.htm",
    "https://wpatent.com/listing-points2perks.htm",
    "https://wpatent.com/listing-tourist-aid.htm",
    "https://wpatent.com/listing-persona-album.htm",
    "https://wpatent.com/listing-sign-language-chat.htm",
    "https://wpatent.com/listing-dashing-robo.htm"
  ]) {
    assert.match(sitemap, new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("main redirect still points to index.html", () => {
  assert.match(redirect, /url=index\.html/);
});
```

- [ ] **Step 2: Run the discovery test and confirm it fails**

Run: `node --test tests/discovery.test.mjs`

Expected: FAIL because `robots.txt` and `sitemap.xml` do not exist yet.

- [ ] **Step 3: Add `robots.txt`, `sitemap.xml`, and clean up the redirect page**

Create `robots.txt`:

```txt
User-agent: *
Allow: /

Sitemap: https://wpatent.com/sitemap.xml
```

Create `sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://wpatent.com/</loc></url>
  <url><loc>https://wpatent.com/listings.htm</loc></url>
  <url><loc>https://wpatent.com/platform.htm</loc></url>
  <url><loc>https://wpatent.com/about.htm</loc></url>
  <url><loc>https://wpatent.com/why_us.htm</loc></url>
  <url><loc>https://wpatent.com/faq.htm</loc></url>
  <url><loc>https://wpatent.com/career.htm</loc></url>
  <url><loc>https://wpatent.com/listing-points2perks.htm</loc></url>
  <url><loc>https://wpatent.com/listing-tourist-aid.htm</loc></url>
  <url><loc>https://wpatent.com/listing-persona-album.htm</loc></url>
  <url><loc>https://wpatent.com/listing-sign-language-chat.htm</loc></url>
  <url><loc>https://wpatent.com/listing-dashing-robo.htm</loc></url>
</urlset>
```

Keep `main.html` as a redirect, but make the copy explicit:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=index.html">
  <title>Redirecting to W&Patent Marketplace</title>
</head>
<body>
  <p>Redirecting to the <a href="index.html">W&Patent homepage</a>.</p>
</body>
</html>
```

- [ ] **Step 4: Run the full suite**

Run: `npm test`

Expected: PASS with all test files green:
- `tests/shared-shell.test.mjs`
- `tests/homepage.test.mjs`
- `tests/listings.test.mjs`
- `tests/platform.test.mjs`
- `tests/support-pages.test.mjs`
- `tests/discovery.test.mjs`

- [ ] **Step 5: Commit the discovery artifacts and final verification**

```bash
git add robots.txt sitemap.xml main.html tests/discovery.test.mjs
git commit -m "feat: add crawl artifacts and final verification"
```
