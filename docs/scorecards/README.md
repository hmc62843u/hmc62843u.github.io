# Scorecards

This folder holds internal before/after measurement assets for the W&Patent Trust Chain scorecard.

## Files

- `2026-05-07-wpatent-trust-chain-scorecard.md`: shareable summary dashboard for the Trust Chain rework
- `2026-05-07-wpatent-trust-chain-scorecard.csv`: detailed worksheet for evidence rows, prompt checks, and source notes
- `prompts.txt`: fixed prompt set for AI evidence collection
- `2026-05-08-wpatent-prompt-runs.csv`: append-only raw log for prompt-run evidence

## Provider policy

- `perplexity` rows are the main production evidence source for the Trust Chain scorecard.
- `openai_web_search`, `opencode_dev`, and `kilocode_dev` rows are development or comparison outputs unless explicitly promoted later.
- The default prompt-evidence command stays production-safe by running `perplexity` only.
- Use `--include-dev` when you want to compare development providers or test the pipeline locally.

## Update routine

1. Run `npm test` to make sure the site and scorecard contract are green.
2. Reuse the fixed Trust Chain prompt set before and after changes.
3. Pull structural facts from the repo, then pull live evidence from Search Console, GA, and manual AI prompt checks.
4. Append new prompt-run rows to `2026-05-08-wpatent-prompt-runs.csv`.
5. Update the markdown summary and the scorecard CSV after the new raw evidence is reviewed.
6. Commit the scorecard files together so the measurement snapshot stays versioned.
