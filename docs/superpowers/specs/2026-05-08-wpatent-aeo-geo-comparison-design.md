# W&Patent AEO/GEO Comparison Design

## Goal

Add a compact comparison layer to the existing Trust Chain scorecard that separates:

- development-time AEO/GEO readiness
- production-time AEO/GEO visibility

The purpose is to make it easier to compare internal AI-readable framing against real external AI mention and citation behavior without mixing the two into one ambiguous number.

## Recommended Approach

Add a small `AEO/GEO Comparison` block to the existing Trust Chain scorecard markdown rather than creating a separate dashboard.

The block should include:

- `Development AEO/GEO Score`
- `Production AEO/GEO Score`
- a shared five-dimension rubric
- a short interpretation line

This keeps the scorecard lightweight, readable, and honest.

## Score Shape

Use two scores, both out of `20`:

- `Development AEO/GEO Score`
- `Production AEO/GEO Score`

Each score should use the same five dimensions, worth `4` points each.

This enables a direct comparison such as:

- `Development AEO/GEO: 13/20`
- `Production AEO/GEO: 4/20`

The comparison should communicate whether W&Patent is:

- internally well-shaped for AI interpretation
- externally visible or citable yet

## Scoring Dimensions

Both development and production should be scored on the same five dimensions:

1. `Concept Alignment`
   - does the answer interpret the Trust Chain or W&Patent in the intended way
   - or does it drift into unrelated meanings such as generic TLS trust chains

2. `Entity Recognition`
   - does the answer recognize `W&Patent` as a distinct company or entity

3. `Founder Recognition`
   - does the answer recognize Andrew Leung, or at least preserve founder-linked authority correctly

4. `Authority Framing`
   - does the answer reflect the intended relationship between founder, company, domain, and content

5. `Citation / Reference Quality`
   - for production scoring: actual page citation quality
   - for development scoring: whether the answer grounds itself in specific repo pages, files, or contextual references rather than generic discussion

This keeps the rubric symmetric while still respecting the different evidence types.

## Evidence Sources

### Development AEO/GEO Score

Use:

- `opencode_dev`
- `kilocode_dev`
- optionally `openai_web_search` when used in comparison mode

This score is meant to answer:

- are the prompts producing the intended interpretation
- are the pages shaping the right narrative
- do provider-assisted development systems reflect the Trust Chain framing

### Production AEO/GEO Score

Use:

- `perplexity`
- optionally `openai_web_search`
- optionally manual ChatGPT / AI Mode checks later

This score is meant to answer:

- are external systems actually surfacing W&Patent
- are they citing the right pages
- are they transferring founder authority into company understanding

The systems are different on purpose:

- development providers should never directly increase the production score
- production providers should not be treated as simple development checks

## Output Format

Represent the comparison in one compact section inside the existing scorecard markdown.

Example shape:

```md
## AEO/GEO Comparison

- Development AEO/GEO: `11/20`
- Production AEO/GEO: `3/20`

### Development breakdown

- Concept Alignment: `2/4`
- Entity Recognition: `1/4`
- Founder Recognition: `0/4`
- Authority Framing: `4/4`
- Reference Quality: `4/4`

### Production breakdown

- Concept Alignment: `1/4`
- Entity Recognition: `0/4`
- Founder Recognition: `0/4`
- Authority Framing: `1/4`
- Citation Quality: `1/4`

Interpretation: internal and provider-assisted framing is stronger than public external citation so far.
```

This should live near the AI Visibility and Authority Transfer sections of the Trust Chain scorecard.

## Placement

The comparison should be added to:

- `docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.md`

It should not create:

- a separate top-level scorecard
- a separate dashboard page
- a new scorecard CSV schema

The current CSV and prompt-run evidence log remain the supporting evidence sources.

## Scope

Included:

- a new `AEO/GEO Comparison` section in the existing markdown scorecard
- two `0–20` scores
- five shared dimensions
- short interpretation guidance
- manual scoring workflow for the first version

Not included:

- automatic scoring logic
- new CSV columns
- SEO comparison rows
- business outcome comparison rows
- a new dedicated analytics file

## Guardrails

- development evidence can show readiness or proof of concept, but not public visibility
- production evidence can show real surfacing or citation, but may lag good internal structure
- the two scores should be shown together whenever possible
- ambiguous answers should be scored conservatively
- the comparison should stay narrow so it remains maintainable and trustworthy

## Success Criteria

This design succeeds if W&Patent can:

- compare development-time AI interpretation against production-time AI surfacing in one place
- explain the gap between “well framed internally” and “visible externally”
- reuse the same prompt set and evidence log without introducing a second full scoring system

The first version should optimize for clarity, honesty, and practical decision support rather than automation.
