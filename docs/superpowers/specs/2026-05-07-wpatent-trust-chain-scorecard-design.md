# W&Patent Trust Chain Scorecard Design

## Goal

Create a practical before/after scorecard for W&Patent that measures whether the Trust Chain rework improved:

- the structural clarity of the domain
- AI-oriented visibility and citation potential
- authority transfer from Andrew Leung to W&Patent
- early business outcomes tied to the new trust surface

The scorecard should be useful even without paid tools, while still allowing optional AI-visibility tool data when available.

## Recommended Approach

Use a hybrid scorecard:

- a scored summary for quick before/after comparison
- an evidence table for transparency and diagnosis

This keeps the scorecard simple enough to share while grounding each score in observable signals.

## Score Architecture

The scorecard uses a 100-point model with four categories:

- `Trust Surface Score` — 35 points
- `AI Visibility Score` — 25 points
- `Authority Transfer Score` — 20 points
- `Business Outcome Score` — 20 points

This weighting reflects the current W&Patent strategy:

- trust surface gets the most weight because it is the part most directly controlled by the rework
- AI visibility matters, but it is slower and more downstream
- authority transfer deserves its own category because the Andrew → W&Patent link is central to the Trust Chain model
- business outcomes matter, but should not dominate the score too early in an authority-building phase

## Category Definitions

### Trust Surface Score

Measures whether the domain itself is clearer, more structured, and easier to verify.

Suggested inputs:

- canonical URLs on core pages
- sitemap coverage
- crawlable static HTML
- structured data presence
- founder/company linkage
- live trust-oriented pages
- machine-readable assets
- internal links to authority pages

### AI Visibility Score

Measures whether AI systems are surfacing, citing, or referencing W&Patent.

Suggested inputs:

- Perplexity citation presence
- ChatGPT / AI Mode mention presence
- cited page frequency
- cited domain frequency
- prompt coverage across a fixed question set
- optional third-party tool metrics such as AI visibility or share of voice

This category should work manually first, with optional tool-assisted columns.

### Authority Transfer Score

Measures whether Andrew Leung's identity is clearly transferring trust into W&Patent.

Suggested inputs:

- Andrew named clearly on core pages
- founder/company relationship in schema
- Andrew named in cited answers
- consistent author/company positioning across pages
- off-domain references that link Andrew to W&Patent

This is what makes the scorecard specifically Trust Chain-aware rather than just a generic SEO dashboard.

### Business Outcome Score

Measures whether the rework is beginning to produce real engagement or conversion value.

Suggested inputs:

- Search Console clicks
- Search Console impressions on target pages
- branded search growth
- average engagement time
- Trust Chain page visits
- starter template downloads
- scorecard requests or direct inquiries

This category should stay intentionally lightweight at first.

## Evidence Model

Each category score should be backed by a compact evidence table with these columns:

- `Metric`
- `Before`
- `After`
- `Source`
- `Notes`

Recommended row count: 10 to 15 rows total.

Example rows:

- canonical coverage of core trust pages
- Trust Chain explainer publicly indexed
- Andrew → W&Patent linkage visible on core pages
- Perplexity cites wpatent.com on target prompts
- Perplexity cites trust-chain-explainer.htm
- founder named in AI answer
- Search Console impressions for Trust Chain pages
- average engagement time on trust-chain-explainer.htm
- starter template downloads
- scorecard requests

The evidence table is the accountability layer. It prevents the score from becoming arbitrary and makes the framework reusable for future projects.

## Measurement Workflow

The workflow should stay lightweight and repeatable.

### Step 1: Fix a Prompt Set

Choose 10 to 20 prompts relevant to W&Patent and reuse the same set before and after changes.

Example prompt themes:

- patent strategy for startups
- startup defensibility
- patent commercialization
- founder-led authority
- AI-readable websites
- trust chain for websites

### Step 2: Capture the Baseline

Record:

- whether W&Patent is mentioned
- whether `wpatent.com` is cited
- which page is cited
- whether Andrew is named
- whether the answer aligns with the intended positioning

### Step 3: Score the Domain Layer

Review the site itself:

- canonical pages live
- schema present
- founder/company links clear
- trust pages indexable
- internal links in place

### Step 4: Pull Traffic and Engagement

From Search Console and GA, record:

- impressions
- clicks
- engagement time
- page-level visits
- conversions if relevant

### Step 5: Re-score After Changes

Run the same prompt set, the same structural review, and the same traffic pull after the rework. Compare the deltas.

This keeps continuity even if AEO/GEO tooling changes over time.

## Output Format

The scorecard should exist in two forms.

### 1. Summary Dashboard

A one-screen before/after summary:

- overall score
- four category scores
- five to eight headline evidence lines

Example:

- Overall: `42 → 68`
- Trust Surface: `14 → 29`
- AI Visibility: `8 → 15`
- Authority Transfer: `10 → 16`
- Business Outcome: `10 → 8`

### 2. Detailed Working Sheet

A fuller table containing:

- all evidence rows
- prompt-check data
- notes
- sources

The summary is for communication. The working sheet is for maintenance.

## Tooling Assumptions

The scorecard should be hybrid by design:

- manual core using Search Console, GA, and direct prompt checks
- optional vendor-assisted columns using tools such as Semrush or Ahrefs when available

The core scorecard should never depend on a single paid platform.

## Scope

Included:

- a W&Patent-specific score model
- a repeatable before/after workflow
- a summary plus evidence-based output structure
- support for both manual and tool-assisted measurement

Not included:

- automated data collection
- live dashboards
- API integrations
- a generic multi-company scoring product

## Success Criteria

This design succeeds if it gives W&Patent a way to say, with evidence:

- how much the Trust Chain rework improved structural trust signals
- whether AI visibility and citation potential improved
- whether Andrew's authority is transferring more clearly into W&Patent
- whether early engagement outcomes are beginning to move

The scorecard should make progress visible before business outcomes fully catch up.
