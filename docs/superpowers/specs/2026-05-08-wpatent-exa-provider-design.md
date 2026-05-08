# W&Patent Exa Provider Design

## Goal

Add Exa as a production-style comparison provider in the prompt-evidence runner so W&Patent can collect grounded answer and citation evidence from Exa without changing the default production workflow.

The first version should:

- keep `perplexity` as the current default benchmark
- add `exa_answer` as an explicit comparison source
- normalize Exa output into the existing prompt-run CSV schema

## Recommended Approach

Add Exa behind an explicit `--include-exa` flag.

This keeps the current runner stable while allowing W&Patent to gather comparison evidence from Exa whenever needed.

Recommended runner behavior:

- default
  - `perplexity` only

- `--include-exa`
  - `perplexity + exa_answer`

- `--include-dev --include-exa`
  - `perplexity + exa_answer + development providers`

This avoids unexpected cost or behavior changes while giving Exa a clean place in the provider model.

## Provider Model

After this change, the prompt-evidence runner should support:

- `perplexity`
  - current production benchmark

- `exa_answer`
  - production comparison source

- `openai_web_search`
  - comparison or development source

- `opencode_dev`
  - development source

- `kilocode_dev`
  - development source

Exa should not be treated as a dev-only provider. It belongs close to the production evidence layer, but it should not replace Perplexity immediately.

## Exa Provider Behavior

Use Exa’s `Answer` API rather than raw search in the first version.

Why:

- it returns a grounded answer
- it includes citations
- it matches the current runner’s answer-plus-citations contract

### Request shape

- `POST https://api.exa.ai/answer`
- auth:
  - `x-api-key: EXA_API_KEY`
- body:
  - `query`
  - `text: true`

### Response shape

The adapter should normalize:

- `answer` -> `answerText`
- `citations` -> `citations`

Then it should pass that through the existing row builder used by the prompt-evidence runner.

## CLI And Env

Add:

- env var:
  - `EXA_API_KEY`

- CLI flag:
  - `--include-exa`

### Expected behavior

- no flags
  - `perplexity` only

- `--include-exa`
  - `perplexity + exa_answer`

- `--include-dev --include-exa`
  - `perplexity + exa_answer + dev providers`

If `--include-exa` is set but `EXA_API_KEY` is missing:

- the runner should skip Exa gracefully
- the run should not crash
- a clear note or warning should be recorded

## CSV And Provenance

The existing CSV schema should remain unchanged:

`timestamp,system,prompt,answer_summary,wpatent_mentioned,wpatent_cited,cited_page,andrew_named,andrew_role_correct,positioning_aligned,citation_urls,notes`

Exa rows should use:

- `system=exa_answer`

Notes can capture whether the run was:

- a normal Exa comparison run
- skipped because `EXA_API_KEY` was missing
- failed for another reason

This preserves provenance without requiring any schema migration.

## Scorecard Policy

The scorecard provider policy should be updated to reflect:

- `perplexity`
  - production benchmark

- `exa_answer`
  - production comparison source

- `openai_web_search`
  - comparison or development source

- `opencode_dev`
  - development source

- `kilocode_dev`
  - development source

This keeps Exa close to the production evidence layer while avoiding a premature replacement of Perplexity.

## Scope

Included:

- `EXA_API_KEY` support
- `--include-exa` flag
- Exa Answer API adapter
- normalization into the existing CSV schema
- README and test updates
- provider policy update

Not included:

- `.env` support
- Exa `/search`
- Exa `/research`
- making Exa the default provider
- replacing Perplexity in the scorecard
- automatic score recalculation from Exa rows

## Guardrails

- default run must remain `perplexity` only
- Exa must run only when explicitly requested
- missing `EXA_API_KEY` must degrade gracefully
- Exa output must remain clearly labeled as `exa_answer`
- the integration should stay narrow and avoid changing the scorecard’s existing scoring model

## Success Criteria

This design succeeds if W&Patent can:

- run Exa alongside Perplexity when explicitly requested
- collect grounded Exa answer and citation evidence in the same raw CSV
- compare Exa and Perplexity output without changing the default benchmark

The first version should optimize for clean integration, explicit provenance, and safe rollout.
