# W&Patent Discovery Improvement Roadmap Design

## Goal

Extend the current discovery evaluation framework so its next meaningful output is not just a benchmark snapshot, but a prioritized discovery improvement roadmap for W&Patent.

## Problem

The current framework is already good at collecting evidence:

- answer-engine benchmark output
- prompt-level mention and citation behavior
- separation between production evidence and public-site simulation

What it does not yet do clearly enough is convert that evidence into action.
Scores can tell us that W&Patent is underperforming in a topic space, but they do not yet say what should be fixed first, why that recommendation matters, or which evidence layer supports it.

## Recommended Approach

Treat the framework as a three-layer system:

1. `Evidence collection`
   - prompt runs
   - citation logs
   - Search Console and GA
   - structural site facts

2. `Evaluation`
   - scorecards
   - AEO/GEO comparisons
   - interpretation notes by topic space or prompt cluster

3. `Improvement roadmap`
   - prioritized recommendations
   - evidence-linked reasoning
   - recheck criteria for the next refresh

The roadmap should become the main decision-making output after each evidence cycle.

## Evidence Hierarchy

The framework should keep a strict evidence hierarchy:

- `external discovery evidence`
  - live Perplexity, Exa, OpenAI web search, Search Console, GA, earned third-party mentions
- `public-site simulation`
  - runs constrained to public W&Patent URLs or development-provider tests of the live public pages
- `site structure evidence`
  - repo HTML, schema, links, canonical setup, and test-backed implementation details

Rules:

- external discovery evidence outranks simulation for prioritization
- simulation is diagnostic, not proof of market visibility
- structural evidence supports implementation and explanation, but should not substitute for live discovery performance

## Roadmap Output Shape

Each recommendation should carry the same fields:

- `priority`
- `topic space` or `prompt cluster`
- `evidence class`
- `observed issue`
- `interpretation`
- `recommended change`
- `expected impact`
- `validation method`

Example shape:

```md
| Priority | Topic Space | Evidence Class | Observed Issue | Recommended Change | Validation |
| --- | --- | --- | --- | --- | --- |
| P1 | founder-led authority building | external discovery evidence | W&Patent is not surfaced or cited on high-intent prompts | strengthen dedicated topic page plus supporting internal links and founder-linked proof | rerun prompt cluster and compare citation presence |
```

## Recommendation Categories

The roadmap should organize recommendations into a small number of repeatable buckets:

- `understanding clarity`
  - can external systems correctly tell what W&Patent is and what it helps with
- `topic-space coverage`
  - does W&Patent appear in the right prompt clusters beyond branded queries
- `citation capture`
  - are the intended pages the ones being cited and summarized
- `authority transfer`
  - does Andrew Leung's authority transfer clearly into W&Patent's interpretation
- `conversion follow-through`
  - once discovered, does the site make the next step legible and credible

## Prioritization Model

Recommendations should be prioritized using a simple qualitative model:

- `severity`
  - how badly the misunderstanding or absence blocks discovery
- `breadth`
  - how many prompt clusters, pages, or providers show the same issue
- `confidence`
  - how strong the evidence is, based on the hierarchy above
- `leverage`
  - whether one fix improves multiple downstream signals
- `effort`
  - whether the change is relatively fast compared with its likely impact

Priority guidance:

- `P1`: strong external evidence, high-severity gap, high leverage
- `P2`: meaningful issue with narrower scope or weaker external confirmation
- `P3`: useful optimization after the core understanding and citation gaps are addressed

## Placement

This roadmap layer should be reflected in:

- `docs/scorecards/README.md`
- `docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.md`

It does not require:

- a new CSV schema
- automatic scoring logic
- a separate dashboard product

## Success Criteria

This design succeeds if the framework can:

- explain what W&Patent should fix next, not just how it scored
- distinguish live discovery gaps from simulation-only gaps
- tie each recommendation to a target topic space and clear evidence trail
- support repeated refresh cycles without drifting into vague editorial advice
