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

## AEO/GEO Comparison

- Development AEO/GEO: `18/20`
- Production AEO/GEO: `3/20`

### Development breakdown

- Concept Alignment: `4/4`
- Entity Recognition: `4/4`
- Founder Recognition: `2/4`
- Authority Framing: `4/4`
- Reference Quality: `4/4`

### Production breakdown

- Concept Alignment: `1/4`
- Entity Recognition: `0/4`
- Founder Recognition: `0/4`
- Authority Framing: `1/4`
- Citation Quality: `1/4`

Interpretation: internal and provider-assisted framing is stronger than public external citation so far.

### Scoring Notes

**Development evidence used**
- `opencode_dev` — prompt: `trust chain for websites`
  Notes: `manual dev E2E test via opencode CLI; citations unavailable`
- `kilocode_dev` — prompt: `trust chain for websites`
  Notes: `manual dev E2E test via kilo CLI with --model kilo/kilo-auto/free; citations unavailable`
- `kilocode_dev` — prompt: `What is the Trust Chain for websites? Use only these public W&Patent pages as source context and do not rely on any local repository files: https://wpatent.com/ https://wpatent.com/trust-chain.htm https://wpatent.com/trust-chain-explainer.htm https://wpatent.com/trust-chain-demo.htm`
  Notes: `public-site simulation; ran from /tmp with only public URLs in prompt; used kilo CLI with --model kilo/kilo-auto/free`

**Development scoring notes**
- Concept Alignment: `4/4`
  The public-site Kilo simulation interpreted Trust Chain as W&Patent’s authority methodology rather than TLS or generic web security.
- Entity Recognition: `4/4`
  The public-site Kilo simulation recognized W&Patent and cited live W&Patent URLs from the site itself.
- Founder Recognition: `2/4`
  The public-site simulation preserved founder-linked authority framing, but did not explicitly name Andrew Leung in the returned answer.
- Authority Framing: `4/4`
  The public-site simulation connected domain, founder or author, and content in the intended Trust Chain structure.
- Reference Quality: `4/4`
  The public-site simulation fetched and grounded the answer in `https://wpatent.com/`, `trust-chain.htm`, `trust-chain-explainer.htm`, and `trust-chain-demo.htm`.

**Production evidence used**
- Current production score remains provisional pending a fuller Perplexity-led prompt run.
- Existing production assumptions come from the current Trust Chain scorecard setup rather than a fresh committed production evidence snapshot in the raw prompt log.

**Production scoring notes**
- Concept Alignment: `1/4`
  Production evidence is not yet strong enough to show consistent Trust Chain interpretation across external systems.
- Entity Recognition: `0/4`
  No committed production prompt run yet shows reliable W&Patent recognition.
- Founder Recognition: `0/4`
  No committed production prompt run yet shows consistent Andrew Leung naming.
- Authority Framing: `1/4`
  The site structure supports the intended framing, but committed external answer evidence remains sparse.
- Citation Quality: `1/4`
  Production citation evidence is still limited pending a fuller prompt run.

## Discovery Improvement Roadmap

This framework should produce a prioritized discovery improvement roadmap, not just score snapshots.
Each recommendation should be grounded in a specific evidence class so measurement and action stay tied together.
The current working roadmap lives in `docs/scorecards/2026-05-08-wpatent-discovery-roadmap.md`.

### Evidence classes

- `external discovery evidence`
  Live Perplexity, Exa, OpenAI web search, Search Console, GA, and any real third-party mentions or citations.
- `public-site simulation`
  Public-URL-constrained tests or development-provider runs that show how the live W&Patent pages can be interpreted.
- `site structure evidence`
  Repo HTML, schema, internal links, canonical signals, and test-backed implementation facts.

### Current priorities

| Priority | Evidence pattern | Interpretation | Recommended action |
| --- | --- | --- | --- |
| `P1` | Public-site simulation is strong, but committed live production citation evidence is sparse. | W&Patent is relatively legible once the right pages are in context, but external discovery systems are not yet surfacing it reliably. | Expand and tighten topic-space pages around the highest-value prompt clusters, then rerun live provider checks to measure whether W&Patent starts appearing without prompt-side help. |
| `P1` | Founder recognition is weak in both development and production scoring. | Authority transfer from Andrew Leung to W&Patent is still not durable enough in retrieved answers. | Strengthen founder naming, role repetition, and person-to-organization linkage across core pages and schema, especially on pages most likely to be cited. |
| `P2` | Current evidence suggests the Trust Chain framing is clearer than the surrounding service/category framing. | W&Patent may be easier to interpret on its proprietary concept than on broader advisory topic spaces. | Build or sharpen pages mapped to prompt clusters such as founder-led authority building, AI-readable company websites, and startup patent strategy so the site can surface beyond branded or Trust Chain-specific prompts. |
| `P2` | Citation quality is limited and may depend too much on a small set of pages. | The preferred citation targets are not yet obvious enough to external systems. | Make the explainer and adjacent topic pages easier to cite with sharper introductions, direct-answer sections, stronger internal anchor text, and cleaner page-level summaries. |
| `P3` | The scorecard flow and starter kit are live, but business-outcome evidence is still incomplete. | Discovery gains may arrive before conversion and proof signals are fully validated. | Once live visibility improves, review scorecard CTA clarity, proof blocks, and destination flow so discovery wins translate into inquiries or starter-kit engagement. |

### Prioritization rules

- External discovery evidence outranks simulation when roadmap priorities conflict.
- Simulation evidence should be used to diagnose copy, page, or structure issues rather than to claim public visibility.
- Fixes that improve understanding across multiple prompt clusters should outrank one-off prompt tuning.
- Every roadmap item should name the metric or evidence check that will confirm whether the change worked.

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
5. Classify the latest findings as `external discovery evidence`, `public-site simulation`, or `site structure evidence`.
6. Refresh the discovery improvement roadmap before adjusting headline interpretations.
7. Update the CSV worksheet first, then refresh this summary with the latest before/after narrative.
