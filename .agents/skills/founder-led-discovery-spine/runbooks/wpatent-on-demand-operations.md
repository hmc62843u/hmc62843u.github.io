# W&Patent On-Demand Operations Runbook

This runbook is for an `agent-ready` operating mode.
It assumes W&Patent does **not** need a continuously running agent.
Instead, the founder can invoke an agent on demand to inspect the current state, interpret evidence, draft assets, and refresh priorities.

## Purpose

Provide a lightweight default loop for using an agent such as Codex or Claude Code to help operate the W&Patent discovery system without requiring full-time automation.

## What This Runbook Assumes

- the site is already structured to be readable and editable
- prompts, scorecards, and roadmap files already exist
- the founder is willing to invoke an agent manually at useful checkpoints
- the agent should produce evidence-backed recommendations rather than free-form brainstorming

## Invoke The Agent When

Use the agent after:

- a new page is published
- a meaningful rewrite goes live
- a benchmark rerun finishes
- the roadmap needs to be refreshed
- a founder wants help deciding what to publish next
- a topic cluster continues to underperform

## Default Read Order

When invoked, the agent should read these first:

1. `docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.md`
2. `docs/scorecards/2026-05-08-wpatent-discovery-roadmap.md`
3. `docs/scorecards/2026-05-08-wpatent-prompt-runs.csv`
4. `.agents/skills/founder-led-discovery-spine/profiles/wpatent.md`
5. `.agents/skills/founder-led-discovery-spine/test-prompts.json`

Then it should inspect the relevant live pages or target files for the topic at hand.

## Standard Agent Tasks

### 1. Evidence Refresh

Use when the main question is:
`What does the latest evidence say now?`

Expected outputs:

- updated evidence summary
- differences from the last snapshot
- whether the primary bottleneck has changed
- whether roadmap priorities should move

### 2. Page Decision

Use when the main question is:
`Should we improve an existing page or build a new one?`

Expected outputs:

- identified prompt cluster
- page-vs-new-page recommendation
- reasoning tied to current evidence
- the specific next page or rewrite target

### 3. Brief Drafting

Use when the main question is:
`What should this next citation-surface page contain?`

Expected outputs:

- completed page brief using `templates/page-brief-template.md`
- target query and audience
- opening answer
- attribution guidance
- proof requirements
- validation prompts

### 4. Rewrite Pass

Use when the main question is:
`How should this page be improved based on the current evidence?`

Expected outputs:

- identified structural weaknesses
- exact rewrite guidance
- linking recommendations
- schema or attribution adjustments
- rerun plan after publish

## Standard Commands

These are the default evidence commands.

### Run the test suite

```bash
npm test
```

### Run an Exa-only comparison rerun

```bash
node --env-file=.env scripts/run-prompt-evidence.mjs --only-exa
```

### Run a broader comparison rerun when keys exist

```bash
node --env-file=.env.local scripts/run-prompt-evidence.mjs --include-exa
```

### Inspect current prompt list

```bash
sed -n '1,200p' docs/scorecards/prompts.txt
```

## Default Output Contract

When the agent is asked to operate this runbook, it should return:

1. `What changed`
2. `What the evidence now says`
3. `What W&Patent should do next`
4. `Which files or pages that affects`
5. `What to rerun afterward`

## Minimal Monthly Loop

If the founder wants a simple recurring cadence without full automation:

1. publish or improve one priority page
2. rerun prompt evidence
3. refresh the roadmap
4. decide whether the next move is:
   - another new page
   - a rewrite
   - proof support
   - stronger founder linkage

## W&Patent Defaults

Until new evidence changes the order, assume:

- one domain
- one identity spine
- multiple topic clusters
- new citation surfaces matter more than homepage polish
- copy refinement alone is usually not enough if non-branded prompt absence remains total

## Boundaries

This runbook is not a full autonomous agent system.
It does not assume:

- continuous monitoring
- automatic publishing
- automatic roadmap updates without human review
- autonomous outbound authority-building

It is designed for on-demand agent leverage with a founder still in control.

## Short Definition

W&Patent is `agent-ready`, not necessarily `agent-run`.
This runbook describes how to use an agent on demand to keep the discovery system moving without requiring always-on autonomy.
