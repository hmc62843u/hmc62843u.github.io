# Scorecards

This folder holds internal before/after measurement assets for the W&Patent Trust Chain scorecard.
It now serves as the base of a broader discovery evaluation framework for W&Patent.
The framework benchmarks answer engines, tracks visibility and citation behavior across target topic spaces, separates live external discovery evidence from public-site simulation, and turns that evidence into a prioritized improvement roadmap.

## Files

- `2026-05-07-wpatent-trust-chain-scorecard.md`: shareable summary dashboard for the Trust Chain rework
- `2026-05-07-wpatent-trust-chain-scorecard.csv`: detailed worksheet for evidence rows, prompt checks, and source notes
- `2026-05-08-wpatent-discovery-roadmap.md`: first-pass evidence-led roadmap for what W&Patent should improve next
- `prompts.txt`: fixed prompt set for AI evidence collection
- `2026-05-08-wpatent-prompt-runs.csv`: append-only raw log for prompt-run evidence

## Framework outputs

- a scored snapshot of Trust Surface, AI Visibility, Authority Transfer, and Business Outcome performance
- an append-only raw evidence log for prompt, citation, and provider comparisons
- a discovery improvement roadmap with prioritized recommendations tied to observed evidence

## Provider policy

- `perplexity` rows are the main production evidence source for the Trust Chain scorecard.
- `exa_answer` rows are a production comparison source.
- `openai_web_search` rows are comparison or development outputs unless explicitly promoted later.
- `opencode_dev` and `kilocode_dev` rows are development or public-site simulation outputs.
- The default prompt-evidence command stays production-safe by running `perplexity` only.
- Use `--include-exa` when you want to compare Exa against the production benchmark.
- Use `--only-exa` when you want a clean Exa-only comparison run without default Perplexity rows.
- Use `--include-dev` when you want to compare development providers or test the pipeline locally.

## Evidence classes

- `external discovery evidence`: live answer-engine behavior, Search Console, GA, and any real third-party citation or mention signals
- `public-site simulation`: prompts constrained to public W&Patent URLs or development-provider runs that test how the live site can be interpreted
- `site structure evidence`: repo HTML, schema, internal links, canonicals, and test-backed implementation facts

Production recommendations should be led by external discovery evidence whenever it exists.
Simulation evidence is still valuable, but it should be used as a diagnostic layer rather than proof of public visibility.

## Roadmap rules

- Every recommendation should cite the evidence class that triggered it.
- When production and simulation disagree, trust production for prioritization and use simulation to diagnose why the gap exists.
- Favor fixes that improve understanding across multiple prompt clusters or pages over one-off prompt-specific changes.
- Group recommendations around understanding clarity, topic-space coverage, citation capture, authority transfer, and conversion follow-through.
- Each roadmap item should state how success will be rechecked in the next evidence refresh.

## Local env file

You can keep local API keys in `.env.local` and use Node's built-in env loading:

```bash
node --env-file=.env.local scripts/run-prompt-evidence.mjs --include-exa
```

For an Exa-only rerun:

```bash
node --env-file=.env.local scripts/run-prompt-evidence.mjs --only-exa
```

If you want the file to be optional:

```bash
node --env-file-if-exists=.env.local scripts/run-prompt-evidence.mjs --include-exa
```

Expected keys:

- `EXA_API_KEY`
- `PERPLEXITY_API_KEY`
- `OPENAI_API_KEY`

## Update routine

1. Run `npm test` to make sure the site and scorecard contract are green.
2. Reuse the fixed Trust Chain prompt set before and after changes.
3. Pull structural facts from the repo, then pull live evidence from Search Console, GA, and manual AI prompt checks.
4. Append new prompt-run rows to `2026-05-08-wpatent-prompt-runs.csv`.
5. Classify the evidence by `external discovery evidence`, `public-site simulation`, and `site structure evidence`.
6. Translate the latest evidence into a prioritized discovery improvement roadmap before updating headline scores.
7. Update the markdown summary and the scorecard CSV after the new raw evidence and roadmap are reviewed.
8. Commit the scorecard files together so the measurement snapshot stays versioned.
