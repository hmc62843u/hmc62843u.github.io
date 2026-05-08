# W&Patent Dev Provider Evidence Design

## Goal

Extend the prompt-evidence runner so it supports development-friendly provider options without weakening the Trust Chain scorecard's evidence boundary.

The main objective is to keep:

- `perplexity` as the production evidence source
- `openai_web_search`, `opencode_dev`, and `kilocode_dev` as explicitly tagged development or comparison providers

This allows W&Patent to test the prompt-evidence pipeline more flexibly during development while keeping scorecard interpretation clean.

## Recommended Approach

Use a minimal provider switch inside the existing runner rather than splitting the workflow across multiple scripts.

The runner should:

1. keep `perplexity` as the production-safe default
2. add a simple development mode flag such as `--include-dev`
3. normalize all providers to the same row shape
4. preserve provenance through the existing `system` and `notes` fields

This keeps the current scorecard flow intact while making local development and provider experimentation much easier.

## Architecture

The v1 architecture should become:

`prompt file -> provider adapters -> normalized rows -> raw CSV`

Each provider adapter should answer the same questions:

- how to execute the provider
- how to extract answer text
- how to extract citation URLs if available
- what note to record when citations are unavailable or the provider is skipped

The overall flow should remain append-only and CSV-based.

## Provider Model

The runner should support four systems:

- `perplexity`
- `openai_web_search`
- `opencode_dev`
- `kilocode_dev`

Their roles are not equal.

### Production evidence

- `perplexity`
  - production evidence source
  - default provider in the runner
  - primary benchmark for the Trust Chain scorecard

### Development and comparison providers

- `openai_web_search`
  - real API-backed provider
  - useful for development and comparison runs
  - not treated as the main benchmark in this workflow

- `opencode_dev`
  - local or wrapper-based provider
  - intended for development testing only

- `kilocode_dev`
  - local or wrapper-based provider
  - intended for development testing only

This separation preserves one stable evidence source while still allowing flexible local workflow experimentation.

## Script Behavior

The runner should move from a fixed provider loop to a provider list with safe defaults.

### Default behavior

`node scripts/run-prompt-evidence.mjs`

Should run:

- `perplexity` only

This keeps the command production-safe by default.

### Development behavior

`node scripts/run-prompt-evidence.mjs --include-dev`

Should run:

- `perplexity`
- `openai_web_search`
- `opencode_dev` if available
- `kilocode_dev` if available

### Failure and availability behavior

- if `perplexity` is requested and fails, the script should surface that failure clearly
- if a development provider is unavailable, the script should skip it cleanly and record that fact in console output and, when appropriate, in the row notes
- development-provider availability should never silently change the meaning of the run

### Deferred behavior

Not part of v1:

- fine-grained `--provider` filtering
- server mode support for OpenCode or Kilo Code
- automatic provider promotion from dev to production

## Provider Interfaces

All providers should normalize to the same internal contract:

- input
  - `prompt`
- output
  - `answerText`
  - `citations`
  - `notes`

### Perplexity

- direct HTTP API call
- expects answer text and citations

### OpenAI web search

- direct HTTP API call
- expects answer text and citations
- remains tagged as development or comparison output for this workflow

### OpenCode

- v1 should assume CLI execution
- answer text is expected
- citations may be missing or weakly structured
- acceptable in development mode as long as provenance is clear

### Kilo Code

- v1 should assume CLI execution
- answer text is expected
- citations may be missing or weakly structured
- acceptable in development mode as long as provenance is clear

The key rule is that missing citations are acceptable for development providers. The point of those runs is to test the pipeline, not to claim production-grade citation evidence.

## CSV and Provenance

The existing raw CSV schema should remain unchanged:

`timestamp,system,prompt,answer_summary,wpatent_mentioned,wpatent_cited,cited_page,andrew_named,andrew_role_correct,positioning_aligned,citation_urls,notes`

That schema already gives enough provenance through:

- `system`
- `notes`

### System values

Expected values:

- `perplexity`
- `openai_web_search`
- `opencode_dev`
- `kilocode_dev`

### Notes usage

Examples:

- `dev provider run; citations unavailable`
- `opencode local run via CLI`
- `kilocode run skipped: command not found`
- `openai comparison run`

This avoids a schema migration while keeping production evidence and development evidence clearly distinguishable.

## Documentation Updates

The scorecards README should explicitly say:

- `perplexity` rows are the main production evidence source
- `openai_web_search`, `opencode_dev`, and `kilocode_dev` rows are for development or comparison unless explicitly promoted later

This makes the interpretation rule visible to future readers without requiring them to infer it from code.

## Guardrails

- the default command must remain production-safe
- development providers must never be mistaken for benchmark evidence
- provider provenance must stay visible in every row
- if local CLIs are missing, the runner should skip cleanly rather than fail the whole run
- if citations are unavailable, the script should record that honestly rather than fabricate structure

## Scope

Included:

- provider abstraction in `scripts/run-prompt-evidence.mjs`
- `--include-dev` flag
- `perplexity` as the default production evidence source
- `openai_web_search` as a development or comparison provider
- `opencode_dev` CLI adapter
- `kilocode_dev` CLI adapter
- README and test updates

Not included:

- scorecard scoring changes
- CSV schema changes
- browser automation
- OpenCode or Kilo server integrations
- Search Console or GA automation
- automatic promotion of development providers into production evidence

## Success Criteria

This design succeeds if W&Patent can:

- run production evidence with a safe default command
- optionally include development providers without changing the scorecard meaning
- append all provider outputs into the same raw CSV with clear provenance
- develop and test the prompt pipeline more cheaply and flexibly than relying only on paid API calls

The first version should optimize for evidence integrity, development flexibility, and low operational complexity.
