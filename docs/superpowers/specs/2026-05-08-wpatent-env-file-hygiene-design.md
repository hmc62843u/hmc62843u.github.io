# W&Patent Env File Hygiene Design

## Goal

Add a minimal, safe `.env` workflow for local prompt-evidence runs without changing the runner logic or adding dependencies.

The first version should:

- protect local env files from accidental commits
- provide an example env file for the expected keys
- document the native Node `--env-file` usage for prompt-evidence runs

## Recommended Approach

Use Node's built-in env-file support instead of adding `dotenv` or custom loader logic.

This repo already runs on Node `v23.11.1`, which supports:

- `--env-file`
- `--env-file-if-exists`

That means local key loading can stay external to the runner and the runner can continue reading `process.env` directly.

## Scope

Included:

- add a root `.gitignore`
  - ignore `.env`
  - ignore `.env.local`
  - ignore `.env.*`
  - keep `.env.example` tracked

- add `.env.example`
  - `EXA_API_KEY=`
  - `PERPLEXITY_API_KEY=`
  - `OPENAI_API_KEY=`

- add a short usage note
  - document how to run the prompt-evidence runner with:
    - `node --env-file=.env.local scripts/run-prompt-evidence.mjs --include-exa`
    - `node --env-file-if-exists=.env.local scripts/run-prompt-evidence.mjs --include-exa`

Not included:

- adding `dotenv`
- automatic `.env` loading inside `scripts/run-prompt-evidence.mjs`
- npm alias scripts
- secret management beyond local developer hygiene

## Files

- Create: `.gitignore`
- Create: `.env.example`
- Modify: `docs/scorecards/README.md`

## Design Details

### `.gitignore`

The ignore rules should be minimal and explicit:

- `.env`
- `.env.local`
- `.env.*`
- `!.env.example`

This keeps local keys out of git while preserving the tracked example file.

### `.env.example`

The example file should stay bare and instructional:

```bash
EXA_API_KEY=
PERPLEXITY_API_KEY=
OPENAI_API_KEY=
```

No real values, no comments unless needed for clarity.

### README note

The best home is `docs/scorecards/README.md`, because that is where the prompt-evidence workflow already lives.

Add a short section such as:

## Local env file

You can store local API keys in `.env.local` and use Node's built-in env loading:

```bash
node --env-file=.env.local scripts/run-prompt-evidence.mjs --include-exa
```

Or, if you want the file to be optional:

```bash
node --env-file-if-exists=.env.local scripts/run-prompt-evidence.mjs --include-exa
```

Expected keys:

- `EXA_API_KEY`
- `PERPLEXITY_API_KEY`
- `OPENAI_API_KEY`

The note should stay short and practical.

## Guardrails

- do not load `.env` automatically in code
- do not introduce new runtime dependencies
- do not commit live secrets
- keep the workflow aligned with the current `process.env`-based runner

## Success Criteria

This design succeeds if W&Patent can:

- create a local `.env.local` file safely
- run Exa/Perplexity/OpenAI evidence commands with native Node env-file support
- avoid accidental secret commits

The first version should optimize for safety, clarity, and low complexity.
