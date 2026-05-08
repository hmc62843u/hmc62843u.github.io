# W&Patent Prompt Evidence Automation Design

## Goal

Create a lightweight automation flow that runs a fixed W&Patent prompt set against selected AI systems, captures normalized evidence, and appends the results to a raw CSV log.

The purpose is to support the Trust Chain scorecard with repeatable evidence about:

- whether W&Patent is mentioned
- whether `wpatent.com` is cited
- which W&Patent page is cited
- whether Andrew Leung is named
- how the current positioning is showing up in AI-mediated discovery

## Recommended Approach

Use a small local data pipeline rather than a dashboard.

The pipeline should:

1. read a fixed prompt list from a text file
2. run each prompt against Perplexity and OpenAI web search
3. normalize the returned answers and citations into a shared schema
4. append one row per `prompt × system × run` into a raw CSV file

This keeps the automation easy to inspect, easy to rerun, and easy to combine later with Search Console and GA data.

## Architecture

The v1 architecture is:

`prompt file -> API runs -> normalized rows -> raw CSV`

This is intentionally narrower than a full reporting stack.

It does not try to:

- score alignment automatically
- update the Trust Chain scorecard summary automatically
- automate Google AI consumer UI behavior
- automate Search Console or GA pulls yet

Those can come later as separate subsystems.

## Files and Responsibilities

### New files

- `docs/scorecards/prompts.txt`
  - fixed prompt set
  - one prompt per line

- `docs/scorecards/2026-05-08-wpatent-prompt-runs.csv`
  - raw append-only evidence log
  - one row per system per prompt per run

- `scripts/run-prompt-evidence.mjs`
  - main runner
  - reads prompts
  - calls external APIs
  - normalizes results
  - appends CSV rows

- `scripts/lib/prompt-evidence.js`
  - shared helpers
  - CSV escaping
  - timestamp formatting
  - citation normalization
  - text matching helpers for W&Patent and Andrew signals

- `tests/prompt-evidence.test.mjs`
  - protects the prompt file, CSV header, and row-normalization behavior

### Not in v1

- `scripts/pull-search-console.mjs`
- `scripts/pull-ga.mjs`
- any dashboard or UI surface

Those are intentionally deferred to keep the first automation focused.

## Prompt Set

The first prompt set should be fixed and reused across runs.

Recommended prompts:

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

The first pass should use these prompts unchanged so the evidence is consistent.

## Raw CSV Schema

The raw CSV should use this header:

`timestamp,system,prompt,answer_summary,wpatent_mentioned,wpatent_cited,cited_page,andrew_named,andrew_role_correct,positioning_aligned,citation_urls,notes`

### Field meanings

- `timestamp`
  - ISO timestamp for the run

- `system`
  - the source system, for example `perplexity` or `openai_web_search`

- `prompt`
  - exact prompt text

- `answer_summary`
  - short normalized answer excerpt or summary

- `wpatent_mentioned`
  - `yes` or `no`

- `wpatent_cited`
  - `yes` or `no`

- `cited_page`
  - first cited `wpatent.com` page, if present

- `andrew_named`
  - `yes` or `no`

- `andrew_role_correct`
  - `manual` in v1 unless a later review process formalizes this

- `positioning_aligned`
  - `manual` in v1

- `citation_urls`
  - pipe-separated citation URL list

- `notes`
  - free-text notes or API failure context

## Script Behavior

### Inputs

The script should:

- read prompts from `docs/scorecards/prompts.txt`
- read credentials from environment variables
  - `PERPLEXITY_API_KEY`
  - `OPENAI_API_KEY`

### Per prompt workflow

For each prompt:

1. call the Perplexity API
2. call the OpenAI Responses API with web search enabled
3. extract answer text
4. extract citations or source URLs
5. normalize the output into one row per system

### Normalization rules

The script should auto-fill only what can be determined reliably:

- if any cited URL contains `wpatent.com`, set `wpatent_cited=yes`
- if the answer text contains `W&Patent` or `wpatent`, set `wpatent_mentioned=yes`
- if the answer text contains `Andrew Leung`, set `andrew_named=yes`
- if a `wpatent.com` URL is cited, store the first matching URL in `cited_page`
- set `andrew_role_correct=manual`
- set `positioning_aligned=manual`
- join citations with `|`

### Output behavior

- if the CSV file does not exist, write the header first
- append rows by default
- do not overwrite previous evidence in v1
- every run should produce a timestamped evidence snapshot

## CLI Behavior

The initial command should be:

`node scripts/run-prompt-evidence.mjs`

Optional flags can be added later if needed, but are not part of the first version.

Examples of deferred flags:

- `--system perplexity`
- `--system openai`
- `--limit 3`

The first version should stay simple.

## Guardrails

- if an API call fails, the run should surface the failure clearly rather than silently skipping it
- if a row cannot be fully populated, use explicit values such as `manual`, blank strings, or a short failure note
- raw evidence must stay separate from curated scorecard summaries
- judgment-based fields should remain manual until there is a strong reason to automate them

## Scope

Included:

- fixed prompt file
- prompt-run automation
- Perplexity integration
- OpenAI web-search integration
- raw CSV append output
- tests for prompt loading and normalization behavior

Not included:

- Search Console automation
- GA automation
- browser automation of consumer AI products
- dashboard UI
- automatic scoring of judgment-based fields

## Success Criteria

This design succeeds if W&Patent can:

- rerun the same prompt set consistently
- collect raw AI mention and citation evidence in a single CSV
- compare evidence over time without depending on one vendor UI
- feed that evidence into the broader Trust Chain scorecard workflow

The first version should optimize for reliability, transparency, and reusability, not feature breadth.
