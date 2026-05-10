# Proof-to-Funding System Design

## Goal

Describe a compatible system that an incubator can use to help founders create stronger proof, structure that proof for discovery, circulate it through the right networks, and improve fundability over time.

This design should be readable in two ways:

- as an incubator-facing explanation of the operating model
- as a coding-agent-facing system description that can be used for planning and implementation

## Why This Exists

The current W&Patent discovery framework is already strong at one part of the broader problem:

- it helps structure proof for discovery
- it helps diagnose where understanding, surfacing, citation, and authority transfer are breaking down
- it can identify missing proof and recommend what should be built next

What it does not yet cover by itself is the incubator-side operating system that helps founders:

- generate more usable proof from their expertise and work
- validate that proof before it is shared
- route that proof through the people, channels, and networks that shape trust and access
- learn whether that circulation is improving fundability

That incubator-side system should be designed as a separate but compatible layer.

## Core Framing

### Recommended name

`Proof-to-Funding System`

### One-line definition

The Proof-to-Funding System turns founder expertise and evidence into structured, discoverable, and distributable proof that can improve fundability over time.

### Core idea

The goal is not proof for its own sake.
The goal is stronger fundability and, ultimately, funding outcomes.

Proof matters because it helps a founder become:

- easier to understand
- easier to verify
- easier to discuss
- easier to introduce
- easier to trust

## Contrast With The Traditional Pitch-Deck Model

The traditional fundraising model often treats the pitch deck as the main credibility artifact.
The founder compresses the company story into a presentation, then trust is built largely in meetings, introductions, and follow-up materials.

The Proof-to-Funding System uses a broader model.
The deck still matters, but it becomes a downstream summary of a larger proof system rather than the only serious container of trust.

Simple contrast:

- `deck-first model`: trust is pitched
- `proof-to-funding model`: trust is built, structured, circulated, and reinforced before the meeting starts

This design does not replace pitch decks.
It makes them more believable because they sit on top of a stronger proof base.

## The Four-Part Model

### 1. Proof Creation

Turn founder expertise, examples, work product, and outcomes into usable proof assets.

Examples:

- case notes
- founder memos
- annotated teardowns
- investor-facing summaries
- customer or partner proof blocks
- market commentary tied to a real point of view

### 2. Proof Structuring

Organize proof so it is easier to understand, verify, and discover across onsite and offsite surfaces.

Examples:

- founder and company identity coherence
- topic clustering
- citation-target pages
- proof-network mapping
- structured metadata and internal links

### 3. Proof Circulation

Move validated proof through the networks that shape trust, attention, and access.

Examples:

- founder posts
- incubator channels
- investor update snippets
- intro notes
- interviews
- guest pieces
- talks
- community distribution

### 4. Funding Outcomes

Use the proof system to improve fundability and downstream fundraising outcomes.

Examples:

- warmer introductions
- better investor responses
- more credible diligence posture
- stronger meeting conversion
- improved funding readiness

## Role Of The Current Framework

The current framework is best understood as the `Proof Structuring` and `discovery diagnosis` layer inside the broader Proof-to-Funding System.

It is strongest at:

- topic mapping
- founder/company/method clarity
- citation-surface design
- proof-gap diagnosis
- evidence-led prioritization
- discovery reruns and roadmap refreshes

It can also support `Proof Creation` by identifying:

- what proof is missing
- what proof asset should exist next
- which claims need more evidence

It is not the main `Proof Circulation` system.
That is where a separate incubator-side operating layer is needed.

## Role Of The Incubator-Side Automation System

The compatible incubator-side automation system should support:

- founder proof intake
- proof formation and drafting
- human review and validation
- routing into the right channels
- feedback capture tied to fundability signals

It should not be framed as automating trust itself.
It should be framed as systematizing parts of proof creation and proof circulation while keeping humans responsible for judgment, relationships, and truth.

## Compatibility Requirement

The incubator-side system should be compatible with the current framework rather than duplicating it.

That means both systems should share:

- the same founder identity model
- the same company identity model
- the same topic cluster map
- the same proof asset vocabulary
- the same evidence standards
- a clean handoff between discovery diagnosis and proof action

Practical meaning:

- the current framework identifies which proof gap matters next
- the incubator system helps create and circulate the right proof asset
- the results feed back into the current framework for re-evaluation

## Human-In-The-Loop Shape

The system should use a clear division of labor:

- `agents draft`
- `humans verify`
- `systems route`
- `evidence decides what happens next`

### Human roles

- `founder`
  - provides expertise, context, examples, approvals, and relationship judgment
- `incubator operator`
  - helps shape priority, distribution, investor relevance, and channel fit
- `reviewer`
  - checks confidentiality, factual accuracy, and positioning quality before distribution

### System roles

- `discovery framework`
  - diagnoses what is missing or weak
- `proof-flow automation`
  - captures raw material, drafts assets, packages them, routes them, and logs outcomes

### Non-negotiable review gates

Nothing should be published, shared externally, or sent into investor-facing channels without human review.

Review should cover:

- truth
- confidentiality
- strategic fit
- founder voice
- investor sensitivity
- channel appropriateness

## System Shape

### Recommended name

`Proof Flow System`

### Five modules

1. `Proof Intake`
2. `Proof Formation`
3. `Proof Validation`
4. `Proof Routing`
5. `Proof Feedback`

## Module Descriptions

### 1. Proof Intake

Capture raw material that could become proof.

Typical inputs:

- founder notes
- call transcripts
- internal memos
- product or market observations
- customer situations
- diligence Q&A
- pitch feedback
- portfolio updates

Outputs:

- normalized proof ideas
- tagged source material
- topic-cluster assignment
- rough investor relevance notes

### 2. Proof Formation

Turn raw material into draft proof assets.

Typical outputs:

- public case note
- founder commentary
- investor-facing proof memo
- teardown article
- talk abstract
- guest-post draft
- internal summary for intro notes

This is where agents can add real leverage.
They can turn one raw founder input into multiple draft forms while preserving the same underlying claim.

### 3. Proof Validation

Apply human review before any proof asset is distributed.

Validation questions:

- is it true
- is it safe to share
- does it help the founder's positioning
- does it match the intended audience
- is the claim strong enough to stand up under scrutiny

Outputs:

- approved
- revise
- internal-only
- confidential
- do-not-use

### 4. Proof Routing

Move approved proof into the right surfaces and channels.

Possible destinations:

- company website
- founder site or profile
- incubator newsletter
- incubator social channels
- investor update
- warm intro notes
- community post
- guest article pitch
- podcast pitch
- talk proposal

The routing system should favor reuse.
One validated proof asset should be adaptable into several channel-specific versions without reinventing the content each time.

### 5. Proof Feedback

Track what happened after proof moved.

Possible feedback signals:

- page engagement
- citation movement
- mention movement
- replies
- intro acceptance
- investor interest
- meeting requests
- diligence traction
- narrative resonance

This module should help answer:

- which proof formats work best
- which channels travel best
- which topic clusters generate stronger fundability signals
- what proof should be created next

## End-To-End Workflow

Recommended flow:

1. current framework identifies a topic gap or proof gap
2. incubator system opens a proof task for that gap
3. raw founder material is collected in `Proof Intake`
4. agent drafts one or more proof assets in `Proof Formation`
5. founder or incubator reviewer approves or revises in `Proof Validation`
6. approved asset is connected back to the right page or topic cluster
7. channel-specific versions are created in `Proof Routing`
8. outcomes are logged in `Proof Feedback`
9. current framework reruns discovery checks and refreshes priorities

## Data And Artifact Model

The system does not need a heavy product shape at first.
It does need a stable artifact model.

### Core objects

- `founder`
- `company`
- `topic cluster`
- `proof asset`
- `distribution instance`
- `feedback event`
- `funding signal`

### Suggested proof-asset fields

- `asset id`
- `title`
- `asset type`
- `status`
- `source material`
- `topic cluster`
- `audience`
- `claim`
- `supporting evidence`
- `confidentiality level`
- `founder approval status`
- `distribution targets`
- `linked site page`
- `linked framework recommendation`

### Suggested distribution fields

- `distribution id`
- `asset id`
- `channel`
- `audience type`
- `date sent or published`
- `operator`
- `status`
- `notes`

### Suggested feedback fields

- `feedback id`
- `distribution id`
- `feedback type`
- `signal strength`
- `notes`
- `related funding stage`

## Compatibility With W&Patent

This system should be able to consume the outputs that already exist in the W&Patent framework.

Relevant existing artifacts:

- `docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.md`
- `docs/scorecards/2026-05-08-wpatent-discovery-roadmap.md`
- `.agents/skills/founder-led-discovery-spine/profiles/wpatent.md`
- `.agents/skills/founder-led-discovery-spine/profiles/wpatent-proof-network.md`
- `.agents/skills/founder-led-discovery-spine/runbooks/wpatent-on-demand-operations.md`

Compatibility examples:

- a W&Patent roadmap item can open a proof-creation task
- a proof-network gap can become a routing plan
- a live topic page can become the linked destination for a new proof asset
- feedback from circulation can be fed back into the discovery roadmap

## MVP Recommendation

The first version should not try to be a full incubator platform.
It should be a lightweight human-in-the-loop operating system.

### MVP scope

Include:

- proof task intake
- topic-cluster tagging
- one or two draft asset types
- human approval workflow
- simple routing targets
- simple outcome logging
- compatibility with the current framework's recommendations

Defer:

- full CRM integration
- autonomous outreach
- automatic investor targeting
- automatic publishing without review
- complex analytics dashboards
- multi-incubator multi-tenant design

### Strong first asset types

- founder memo
- case note
- site-supporting proof note
- investor-facing summary
- intro-note snippet

### Strong first routing targets

- linked site page
- founder post
- incubator newsletter or channel
- investor update

## Operational Views

### Incubator view

The incubator should be able to answer:

- what topic or narrative matters most right now
- what proof asset should be created next
- what is approved and ready to circulate
- where it should go first
- whether it is helping the founder become more fundable

### Coding-agent view

The coding agent should be able to answer:

- what the main entities are
- which modules exist
- where human approval is required
- how the current framework hands off into the incubator system
- what an MVP can ship without overbuilding

## Success Criteria

This design succeeds if it allows an incubator to:

- see proof creation, proof structuring, and proof circulation as one connected system
- use the current framework as the discovery and structuring layer rather than rebuilding it
- keep humans in control of truth, confidentiality, and relationship judgment
- create repeatable proof assets instead of relying only on pitch decks
- connect proof operations to fundability rather than vanity content output

This design succeeds technically if a coding agent can:

- identify the modules and data objects cleanly
- implement a small MVP without guessing the core workflow
- preserve compatibility with the W&Patent discovery framework
- maintain clear human review gates

## Short Definition

The Proof-to-Funding System combines a discovery-side proof-structuring framework with an incubator-side proof-flow system.
Together, they help founders create stronger proof, structure it for discovery, circulate it through the right networks, and improve fundability over time.
