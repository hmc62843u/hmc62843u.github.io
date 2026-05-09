# W&Patent Operating Profile

## Role

This profile adapts the general Founder-Led Discovery Spine skill to W&Patent.
Use it when the task is specifically about `wpatent.com`, Andrew Leung, the Trust Chain method, or W&Patent's founder-led discovery roadmap.

This profile assumes:

- one primary domain: `wpatent.com`
- one identity spine: `Andrew Leung -> W&Patent -> Trust Chain`
- multiple topic clusters inside one site rather than an early domain split

## Current Framing

W&Patent combines:

- patent strategy
- patent commercialization framing
- founder-led authority building
- AI-readable website and trust-surface design

The operating assumption is:

**one domain, multiple topic clusters, one identity spine**

Do not recommend a domain split by default.
Recommend clearer clustering within `wpatent.com` first unless the evidence later shows that one domain is creating persistent entity confusion.

## Current Evidence Baseline

### Known strengths

- public-site simulation can recover the intended Trust Chain framing when the right W&Patent URLs are already in context
- the live site now includes stronger Trust Chain disambiguation and stronger Andrew Leung attribution
- the site has a public explainer, methodology page, demo page, starter template, and scorecard framework

### Known weaknesses

- live `exa_answer` reruns on `2026-05-08` still returned `0/10` W&Patent mentions and `0/10` W&Patent citations across the fixed prompt set
- `trust chain for websites` still drifts to TLS or certificate-chain language externally
- founder recognition still lags concept framing
- general pages such as the homepage and About page still carry too much interpretive burden for advisory topics
- Perplexity production evidence is still incomplete because `PERPLEXITY_API_KEY` is not configured locally

### Main interpretation

W&Patent is more legible when the system is already looking at the right pages than it is discoverable in open non-branded topic spaces.
That means the next gains are more likely to come from topic ownership and stronger citation surfaces than from homepage or methodology-page polishing alone.

## Priority Topic Clusters

Use these clusters as the default W&Patent working map.

| Cluster | Representative prompts | Current state | Recommended surface |
| --- | --- | --- | --- |
| `startup patent strategy` | `patent strategy for startups`, `startup defensibility through patents`, `patent advisory for startup founders` | absent externally | dedicated topic page |
| `patent commercialization for founders` | `patent commercialization for founders` | absent externally | dedicated topic page |
| `founder-led authority building` | `founder-led authority building`, `how founders build credibility online`, `founder identity and company authority` | absent externally; founder transfer weak | dedicated topic page plus stronger founder linkage |
| `AI-readable company website` | `AI-readable company website`, `entity authority for AI search` | absent externally | dedicated topic page linked to Trust Chain |
| `Trust Chain concept ownership` | `trust chain for websites` | misinterpreted externally as TLS/certificate-chain language | keep disambiguation live; support with adjacent topic pages and links |

## Current Surface Map

### Core pages already live

- `https://wpatent.com/`
- `https://wpatent.com/about.htm`
- `https://wpatent.com/trust-chain.htm`
- `https://wpatent.com/trust-chain-explainer.htm`
- `https://wpatent.com/trust-chain-demo.htm`

### What these pages do well

- explain the Trust Chain method
- connect Andrew Leung to W&Patent more clearly than before
- provide a starter template and scorecard CTA
- support simulation-time understanding once the right URLs are in scope

### What they do not do well enough yet

- own non-branded advisory prompts
- act as obvious citation targets for patent-strategy queries
- transfer founder authority reliably into retrieved external answers
- provide enough narrow topic coverage outside the proprietary Trust Chain concept

## Default Recommendations

Use these as the starting recommendation set unless fresh evidence clearly changes the order.

### P1: Publish new citation surfaces

Default first-wave pages:

1. `startup-patent-strategy.htm`
2. `patent-commercialization-for-founders.htm`
3. `ai-readable-company-website.htm`
4. `founder-led-authority-building.htm`

Optional next-wave page:

5. `patent-advisory-for-startup-founders.htm`

### P1: Keep identity coherence high

Carry Andrew Leung attribution across:

- each new topic page
- the homepage
- the About page
- the Trust Chain methodology page
- the Trust Chain explainer

### P2: Route general pages into topic pages

Use the homepage and About page as:

- orientation surfaces
- identity surfaces
- navigation bridges

Do not ask them to be the main citation target for every advisory topic.

### P2: Strengthen proof support

For each new topic page, look for:

- examples
- frameworks
- decision logic
- references
- internal proof blocks

If a page is mostly assertive and thin on proof, call that out explicitly.

## W&Patent Page-Brief Rules

When creating or reviewing a W&Patent citation surface, expect:

- one clear target query in the title and H1
- a direct-answer intro in the opening section
- explicit Andrew Leung attribution
- explicit W&Patent point of view
- proof, examples, or teardown logic
- FAQ/schema where useful
- internal links to:
  - `trust-chain.htm`
  - `trust-chain-explainer.htm`
  - the scorecard CTA or equivalent next-step offer

Use `templates/page-brief-template.md` as the working brief.
Use `briefs/startup-patent-strategy.md` as the first concrete example.

## W&Patent Draft Brief Priorities

### 1. `startup-patent-strategy.htm`

- target query: `patent strategy for startups`
- role in system: primary patent-strategy citation surface
- required bridge: patent advisory -> Andrew Leung -> W&Patent -> Trust Chain
- core proof need: startup defensibility and commercialization logic
- working brief: `briefs/startup-patent-strategy.md`

### 2. `patent-commercialization-for-founders.htm`

- target query: `patent commercialization for founders`
- role in system: commercialization citation surface
- required bridge: patents as commercial assets, not just filings
- core proof need: practical framing, buyer fit, commercialization logic

### 3. `ai-readable-company-website.htm`

- target query: `AI-readable company website`
- role in system: gateway from broader AI-readability interest into Trust Chain
- required bridge: AI readability -> entity clarity -> founder/company/method coherence
- core proof need: concrete structure, examples, and why it matters

### 4. `founder-led-authority-building.htm`

- target query: `founder-led authority building`
- role in system: founder authority bridge page
- required bridge: founder identity -> company authority -> discovery interpretation
- core proof need: practical model, not vague thought-leadership advice

## Rerun Rules

After each significant publish or rewrite:

1. rerun the fixed prompt set
2. separate:
   - `external discovery evidence`
   - `public-site simulation`
   - `site structure evidence`
3. compare whether:
   - W&Patent is mentioned more often
   - W&Patent is cited more often
   - the cited page shifts from homepage to topic page
   - Andrew Leung is named more consistently
   - `trust chain for websites` drifts less toward TLS framing

## W&Patent Decision Rules

### Improve an existing page when:

- the topic is already clearly represented on that page
- the page is already being surfaced or cited, but weakly
- the gap is mostly structural or attribution-related

### Create a new page when:

- the prompt cluster has no clear home
- the homepage or About page is currently carrying the topic by implication only
- the page would otherwise have to answer multiple unrelated queries at once
- the evidence shows total absence from an important non-branded topic space

### Consider a domain split only when:

- one cluster develops a truly separate brand and audience
- one domain creates persistent entity confusion that better internal clustering cannot fix
- one offer develops enough authority to stand independently without weakening the main spine

Until then, prefer one W&Patent domain with clearer topic clusters.

## Recommended Output Shape

When using this profile, prefer output in this order:

1. `What the evidence says now`
2. `Which W&Patent cluster is failing`
3. `Whether to improve an existing page or publish a new one`
4. `Exact brief or rewrite guidance`
5. `What to rerun after publish`

## On-Demand Operating Mode

This profile is designed to be `agent-ready`, not necessarily `agent-run`.

That means W&Patent can:

- keep the site, prompts, scorecards, briefs, and roadmap in place
- invoke an agent such as Codex or Claude Code on demand
- ask the agent to inspect the current state, interpret evidence, draft pages, rerun checks, and refresh priorities

Use `runbooks/wpatent-on-demand-operations.md` for the default operating loop.

## Short Definition

The W&Patent operating profile turns the general Founder-Led Discovery Spine into a concrete working system for `wpatent.com`: one domain, one identity spine, multiple topic clusters, evidence-led page prioritization, and repeated prompt-based reruns.
