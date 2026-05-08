# Scorecards

This folder holds internal before/after measurement assets for the W&Patent Trust Chain scorecard.

## Files

- `2026-05-07-wpatent-trust-chain-scorecard.md`: shareable summary dashboard for the Trust Chain rework
- `2026-05-07-wpatent-trust-chain-scorecard.csv`: detailed worksheet for evidence rows, prompt checks, and source notes

## Update routine

1. Run `npm test` to make sure the site and scorecard contract are green.
2. Reuse the fixed Trust Chain prompt set before and after changes.
3. Pull structural facts from the repo, then pull live evidence from Search Console, GA, and manual AI prompt checks.
4. Update the markdown summary first, then update the CSV worksheet.
5. Commit the scorecard files together so the measurement snapshot stays versioned.
