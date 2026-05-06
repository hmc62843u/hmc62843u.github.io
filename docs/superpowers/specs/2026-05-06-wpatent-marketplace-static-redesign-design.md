# W&Patent Static Marketplace Redesign Design

Date: 2026-05-06
Project: W&Patent website redesign for a GitHub Pages-friendly SaaS demo with SEO, AEO, and GEO support
Status: Approved design draft

## Summary

W&Patent will be redesigned as a small static multi-page site that balances two roles:

- a patent marketplace product for owners, buyers, and licensees
- an advisory-led credibility layer that explains why the platform can be trusted

The site will remain deployable as plain static files on GitHub Pages. All product flows will be mocked in-browser without implying a live backend, real authentication, or real payment processing. Content will be structured so search engines, answer engines, and AI agents can understand the organization, the founder, the marketplace platform, and each featured listing as distinct but related entities.

## Goals

- Present W&Patent as a balanced marketplace plus advisory brand
- Convert two primary audiences equally: patent owners and buyers/licensees
- Ship a believable static SaaS demo that works with no backend
- Improve crawlability and answer retrieval through page-level intent and structured content
- Support SEO, AEO, and GEO with schema, metadata, FAQ formatting, and agent-readable artifacts
- Reuse the existing five featured projects as the initial marketplace inventory

## Non-Goals

- No real authentication, billing, escrow, or deal execution
- No external API dependency beyond optional frontend-only demo references already present in the site
- No CMS, build system, or framework migration
- No blog, newsroom, or dynamically generated listing system in this phase

## Audience

The site must speak to two groups with equal importance.

### Patent Owners

- want to list, value, and commercialize patents
- need confidence in process, expertise, and visibility
- respond to plans, dashboard previews, and advisory credibility

### Buyers and Licensees

- want to discover active opportunities quickly
- need enough context to judge fit and inquire
- respond to searchable listings, commercialization framing, and concise detail pages

## Brand Position

The redesign will use a balanced hybrid positioning:

- marketplace-first enough to feel like a real product
- advisory-backed enough to feel credible and differentiated

The homepage will introduce both sides of the marketplace. Supporting pages will reinforce the expertise behind the platform rather than feeling like a separate legacy firm site.

## Information Architecture

The site will stay hand-authored and static. Existing advisory pages will be rewritten to match the new positioning. New marketplace and platform pages will be added.

### Core Pages

- `index.html`: homepage and main conversion hub
- `listings.htm`: marketplace index for all featured opportunities
- `platform.htm`: plans, dashboard demo, and agent-ready platform explanation
- `about.htm`: founder and company credibility
- `why_us.htm`: differentiation versus generic brokers, law firms, and simple listing boards
- `faq.htm`: mixed filing, listing, buyer, and agent-discovery FAQ
- `career.htm`: lightweight recruiting page aligned with the product story
- `main.html`: keep as redirect to `index.html`

### Listing Detail Pages

Each current featured project will get its own static detail page:

- `listing-points2perks.htm`
- `listing-tourist-aid.htm`
- `listing-persona-album.htm`
- `listing-sign-language-chat.htm`
- `listing-dashing-robo.htm`

These pages are a core part of the SEO/AEO/GEO strategy and should not be collapsed back into the homepage.

## Homepage Design

The homepage is the central routing page for the whole system.

### Required Sections

- hero with split CTAs for `List a Patent` and `Explore Opportunities`
- concise marketplace positioning that explains the product and its advisory backing
- featured listings preview with links to detail pages
- benefits for owners and for buyers/licensees
- plans preview with CTA to the full platform page
- dashboard preview for the mocked post-signup experience
- founder credibility / trust block tied to Andrew Leung and commercialization strategy
- concise FAQ or answer blocks with links to the full FAQ page

### Messaging Approach

The page must not force a single audience path. It should clearly acknowledge:

- owners who want to list, value, or commercialize patents
- buyers and licensees who want to evaluate opportunities

## Listings Experience

### Listings Index

`listings.htm` will own marketplace browsing intent. It should include:

- searchable/filterable static listing cards
- status labels such as `For Sale` or `For Sale / Licensing`
- short commercialization summaries
- direct links to detail pages
- clear inquiry CTA for each listing

Search and filter behavior will run entirely in the browser using static data.

### Listing Detail Pages

Each listing page should include:

- listing title and commercial summary
- problem and market context
- patent or filing identifiers already disclosed by the site
- buyer/licensee fit or use cases
- commercialization angle and why the asset matters
- inquiry CTA
- supporting structured data and metadata

The goal is to make each opportunity readable by humans, search engines, and LLM retrieval systems without requiring JS rendering.

## Platform and Plans Experience

`platform.htm` will explain the product layer cleanly rather than forcing all product detail into the homepage.

### Required Sections

- Basic, Pro, and Enterprise plans
- a clear statement that workflows are demo or mocked
- dashboard teaser covering portfolio, bids, analytics, and quick actions
- explanation of owner flow: choose plan, sign up, reveal dashboard
- explanation of agent-ready features such as metadata, discovery, and tool descriptions

### Product Honesty Boundary

This page must avoid implying:

- live account persistence
- real Stripe checkout
- real escrow delegation
- functioning backend APIs

Acceptable phrasing includes `demo`, `mocked workflow`, `static preview`, and `agent-ready metadata demonstration`.

## Interaction Model

### Owner Flow

- user selects a plan from homepage or platform page
- signup modal opens with plan preselected
- submission stores local demo state only
- a dashboard state is revealed in the current page session
- no data leaves the browser

### Buyer Flow

- user enters through homepage or listings page
- browses the marketplace inventory
- opens detail pages for deeper context
- uses mailto or contact CTA to express interest

### Agent-Facing Demo Layer

The site should demonstrate agent discoverability without pretending to be a live agent platform.

Required elements:

- `.well-known/ucp.json`
- structured data on key pages
- form annotations or tool descriptions where relevant
- plain-language explanation of how listings are exposed to search and AI systems

## Content Strategy for SEO, AEO, and GEO

The redesign will treat the site as a set of linked entities rather than one page with generic marketing copy.

### Primary Entities

- `W&Patent` as the organization
- `Andrew Leung` as founder and expert
- each featured project as a distinct listing opportunity
- the platform itself as a service or software-style offering

### Search Intent Ownership

- `index.html`: marketplace overview and dual-audience conversion
- `listings.htm`: browse patent opportunities and marketplace inventory
- `listing-*.htm`: project-specific discovery and commercialization intent
- `platform.htm`: plans, dashboard, and product capability intent
- `faq.htm`: direct answer retrieval
- `about.htm` and `why_us.htm`: E-E-A-T, differentiation, and authority

### Answer-Engine Formatting Rules

Important pages should use:

- direct headings that resemble user questions or intents
- short summaries near the top of the page
- concise Q/A blocks where useful
- explicit definitions for terms like UCP, WebMCP, listing workflow, and marketplace role
- copy that can be quoted or summarized cleanly by LLM-based systems

## Structured Data and Metadata

### Global Schema Targets

- `Organization`
- `Person`
- `WebSite`

### Page-Specific Schema Targets

- homepage: `Organization`, `Person`, `WebSite`, and optionally `Service`
- listings index: `ItemList`
- platform page: prefer `Service`; use `SoftwareApplication` only if the resulting description stays honest about the static demo boundary
- FAQ page: `FAQPage`
- listing detail pages: structured data appropriate to a listing or commercial offering page, using the most accurate schema available without overstating transactional capability

### Metadata Requirements

Each page should include:

- unique title
- unique meta description
- canonical URL
- Open Graph basics
- crawlable heading structure

## Shared Technical Architecture

### Files

- keep shared styling in `site.css`
- move shared interactive behavior into a small `site.js`
- keep important content in HTML, not injected from JS
- add `robots.txt`
- add `sitemap.xml`
- add `.well-known/ucp.json`

### Rendering Rules

- all primary content must be serverless-static and present in source HTML
- JS may enhance search, modal behavior, dashboard reveal, and state toggles
- the site must remain useful if JS is unavailable

### Data Model

The browser-only demo state should be minimal:

- selected pricing plan
- signed-in demo flag
- listing search/filter state
- dashboard visibility state

No persistence beyond the local browsing session is required.

## Content Rewrite Direction by Existing Page

### `about.htm`

Keep founder and company credibility, but rewrite it to connect advisory experience with marketplace evaluation and commercialization support.

### `why_us.htm`

Focus on differentiation versus:

- generic legal services
- generic brokers
- plain listing boards with no strategic context

### `faq.htm`

Expand from filing basics into a mixed FAQ covering:

- provisional, PCT, continuation, divisional, CIP basics
- how listing works
- who the marketplace is for
- how buyers engage
- how AI agents or answer engines discover listings

### `career.htm`

Keep light, but align tone and content with the marketplace-plus-advisory identity.

## Visual and UX Direction

The redesign should preserve the refined editorial tone already present in the repo while making the product story more explicit.

Design characteristics:

- premium, calm, credible presentation
- clear split between owner and buyer actions
- stronger navigation to marketplace and platform pages
- mobile-first responsive layouts
- no framework-like dashboard shell that suggests unsupported depth

## Verification Plan

Before implementation is considered complete, verify:

- all navigation links resolve correctly
- homepage, listings, platform, FAQ, and detail pages each own distinct intent
- metadata and canonical tags are present and page-specific
- schema is present on the intended pages
- static search/filter interactions behave correctly
- signup modal and dashboard reveal are understandable and clearly demo-only
- mobile and desktop layouts both hold together
- the site functions as static files without a running server

## Implementation Boundaries

This redesign is intentionally scoped as a static product demo and content architecture upgrade. If a later phase introduces real backend features, those should be layered on top of this structure rather than replacing it.

## Recommended Next Step

After user review of this design spec, create a concrete implementation plan that:

- sequences shared asset extraction first
- adds the new page set
- rewrites existing pages to the new positioning
- adds technical artifacts for discoverability
- verifies content, links, metadata, and demo interactions before completion
