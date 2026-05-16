# W&Patent Proof Network

Use this companion file with `profiles/wpatent.md` when the question is not just which page to build, but which proof, example, reference, or public signal should support that page next.

## Evidence Boundary

- `discovery evidence` shows what answer engines currently surface, cite, or miss
- `proof assets` help explain why W&Patent should be trusted on a topic
- proof can live `onsite` or `offsite`
- internal scorecards help W&Patent operate, but they are not public proof assets by themselves

## Current Cross-Cluster Assets

- `about.htm`: founder biography, role clarity, and positioning baseline
- `trust-chain.htm`: public method page with founder attribution, FAQ structure, and starter-kit CTA
- `trust-chain-explainer.htm`: founder-authored explanation of the Trust Chain idea and why it matters
- `trust-chain-demo.htm`: inspectable fictional demo page showing the method in use
- `templates/trust-chain-starter.zip`: public starter kit that makes the method inspectable
- `startup-patent-strategy.htm`: founder-facing patent-strategy surface tied to defensibility and commercialization
- `patent-commercialization-for-founders.htm`: founder-facing commercialization surface tied to licensing, diligence, and leverage
- `docs/scorecards/*`: internal evidence assets for diagnosis and prioritization

## Cluster Map

| Cluster | Current surfaces | Current onsite proof | Current offsite reinforcement | Main proof gap | Next proof priority |
| --- | --- | --- | --- | --- | --- |
| `Trust Chain concept ownership` | `trust-chain.htm`, `trust-chain-explainer.htm`, `trust-chain-demo.htm` | founder-linked method definition, live demo, downloadable starter kit, FAQ/schema | none intentionally tracked yet | the concept is explainable onsite, but still has little reinforcing proof beyond W&Patent itself | publish one applied teardown or before/after scorecard-style example and one external founder commentary asset |
| `startup patent strategy` | `startup-patent-strategy.htm` | founder point of view, practical framework, example logic, common mistakes section | none intentionally tracked yet | the page is conceptually strong, but still light on inspectable named examples, references, or companion proof | publish a short case note or teardown showing how a startup decides what to protect and why |
| `patent commercialization for founders` | `patent-commercialization-for-founders.htm` | founder point of view, commercialization framing, licensing and diligence scenarios | none intentionally tracked yet | the page needs clearer buyer logic, examples, and public reinforcement for commercialization claims | publish a short commercialization memo or case note with one licensing or diligence pathway |
| `AI-readable company website` | Trust Chain pages only, for now | method page, explainer, demo, starter kit | none intentionally tracked yet | there is no dedicated topic page or simple proof asset for this cluster yet | publish `ai-readable-company-website.htm` plus a checklist or teardown that shows what AI readability looks like in practice |
| `founder-led authority building` | `about.htm` and `trust-chain-explainer.htm`, partially | Andrew Leung attribution, founder/company/method linkage, Trust Chain framing | no tracked interviews, talks, guest posts, or third-party mentions yet | founder authority exists mostly on the site, with little public reinforcement beyond it | publish `founder-led-authority-building.htm` and seek one offsite interview, guest piece, quote, or reference tied to the same cluster |

## Current Interpretation

### What W&Patent already has

- an identifiable founder, company, and named method
- inspectable onsite proof in the form of the Trust Chain explainer, demo, and starter kit
- two live advisory topic pages that can now be supported with narrower proof assets

### What is still thin

- most of the proof is self-hosted
- few public examples are tied to the live advisory pages
- offsite reinforcement is sparse, untracked, or absent
- there is not yet a stable habit of pairing each new topic page with a supporting proof asset

### What that suggests

The next proof work should not start with a broad thought-leadership push.
It should start by giving the live pages stronger support:

1. a smaller, inspectable proof asset on the site
2. a clearer bridge from that proof asset back to Andrew Leung and W&Patent
3. one reinforcing signal beyond the site when practical

## Priority Next Proof Assets

### 1. Startup patent strategy case note

Support: `startup-patent-strategy.htm`

Best shape:

- one concrete startup context
- what was worth protecting
- what business leverage the patent work was meant to create
- which mistake was avoided
- links back to `startup-patent-strategy.htm` and `trust-chain-explainer.htm`

### 2. Patent commercialization memo

Support: `patent-commercialization-for-founders.htm`

Best shape:

- one licensing, diligence, or partnership pathway
- what made the patent commercially legible
- what proof still mattered beyond the filing itself
- links back to `patent-commercialization-for-founders.htm`

### 3. AI-readable website checklist or teardown

Support: future `ai-readable-company-website.htm`

Best shape:

- a short checklist or annotated teardown
- visible examples of founder linkage, entity clarity, and proof blocks
- links back to `trust-chain.htm`, `trust-chain-demo.htm`, and the future topic page

### 4. One offsite founder proof asset

Support: the overall identity spine and `founder-led authority building` cluster

Best shape:

- one interview, guest article, founder quote, or external commentary piece
- clear Andrew Leung attribution
- direct connection to one W&Patent topic cluster rather than a generic bio mention

## Agent Guidance

When asked to improve the W&Patent proof network:

1. identify which live or planned topic page is thinnest on proof
2. separate `onsite proof gaps` from `offsite reinforcement gaps`
3. recommend the smallest next proof asset that can strengthen a live page already in market
4. connect the proof asset back to Andrew Leung, W&Patent, and the relevant citation surface
5. define what discovery rerun or citation check should happen after publish

## MVP Tooling Link

When the proof gap should become an actual task, use the Proof Flow MVP:

- open the task with `scripts/create-proof-task.mjs`
- package approved proof with `scripts/build-proof-packet.mjs`
- log outcome signals with `scripts/record-proof-feedback.mjs`

## Mixed-Mode Sync

When a proof asset is approved and should move into incubator or community circulation:

- export it with `scripts/export-proof-sync.mjs`
- apply it to the shared layer with `scripts/apply-proof-sync.mjs`
- import selected response signals back with `scripts/import-proof-feedback.mjs`

## Short Definition

This file tracks the proof assets that help W&Patent's topic pages hold up.
Use it to decide what evidence, examples, references, and public reinforcement should be built around the next page or cluster.
