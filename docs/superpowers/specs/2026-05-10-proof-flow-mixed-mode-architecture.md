# Proof Flow Mixed-Mode Architecture

## Purpose

Define a mixed-mode architecture for the Proof Flow system in which a founder keeps a private operating instance while selectively syncing approved proof assets into an incubator community operating system.

This note is intentionally narrow.
It does not redefine the full Proof-to-Funding model.
It clarifies the system boundary between:

- founder-private proof work
- incubator-shared circulation and amplification
- the sync layer between them

## Why Mixed Mode

A fully centralized incubator platform is not always the best fit for founder proof work.

Founders often need a private place for:

- raw notes
- unfinished drafts
- sensitive investor context
- internal examples
- candid operating memory

At the same time, the incubator creates value through:

- shared routines
- structured guidance
- circulation channels
- community amplification
- network-aware feedback

Mixed mode keeps both advantages:

- founder privacy and control
- incubator coordination and leverage

## Three Layers

### 1. Private Founder Instance

This is the founder's private operating system for proof creation and early proof shaping.

Typical contents:

- raw notes
- founder memos
- draft proof assets
- internal examples
- investor-specific context
- private feedback
- company-specific operating memory

Default rule:

- private by default

### 2. Incubator Community Operating System

This is the shared layer where the incubator adds structure, discipline, and network leverage.

Typical contents:

- templates
- topic maps
- routing patterns
- approved shared proof assets
- channel playbooks
- community amplification surfaces
- selected feedback signals

Default rule:

- shared only after founder approval

### 3. Selective Sync Layer

This is the boundary that decides what can move from the founder instance into the incubator layer and what can move back.

Its role is not to mirror everything.
Its role is to move only the assets and signals that should become shared.

## What Stays Private

These should remain founder-private by default:

- raw notes
- internal strategy discussion
- unapproved drafts
- confidential investor details
- sensitive customer or partner examples
- internal comments that are not ready for circulation
- abandoned proof ideas

Private does not mean unused.
It means not automatically pushed into the shared community system.

## What Can Sync Outward

These can move from the founder instance into the incubator system after approval:

- approved proof assets
- approved excerpts from longer private drafts
- routing packets
- channel-ready summaries
- approved founder commentary
- selected linked-page references
- approved proof status metadata

The key principle is:

- sync approved proof, not raw context

## What Can Sync Back

These can move from the incubator system back into the founder instance:

- amplification events
- routing history
- selected reply signals
- endorsement or mention signals
- investor-interest signals
- community traction notes
- channel-performance summaries

The founder instance should remain the long-term operating memory.
The incubator layer should contribute useful external feedback, not replace that memory.

## Sync Rules

The mixed-mode boundary should follow a few strict rules:

1. `Founder approval required`
   Nothing moves from private to shared without explicit approval.

2. `Minimal outward sync`
   Only sync the smallest useful asset or metadata needed for circulation.

3. `Context stays local when possible`
   Do not sync supporting raw material unless it is necessary and approved.

4. `Feedback can be selective`
   Not every external signal needs to sync back; only the signals that help future proof decisions.

5. `No forced centralization`
   The shared incubator system should add leverage without requiring the founder to surrender all operating memory.

## Object Boundary

A mixed-mode system should treat these objects differently:

### Founder-private objects

- draft proof task
- private source material
- confidential founder memo
- internal review notes
- unapproved asset

### Shareable objects

- approved proof asset
- routing packet
- channel variant
- approved summary
- approved linked-page reference

### Shared-return objects

- amplification event
- mention event
- endorsement event
- investor-interest event
- channel feedback summary

## Human Review Gates

Before an object becomes shareable, a human should confirm:

- it is true
- it is safe to share
- it matches the founder's positioning
- it is appropriate for the intended audience
- it does not reveal private context unintentionally

This review gate is central to the architecture.
Without it, the system drifts from founder-controlled proof work into uncontrolled content distribution.

## Benefits Of This Model

### For founders

- stronger privacy
- better control over what leaves the private workspace
- lower adoption risk
- preserved operating memory

### For incubators

- more usable shared proof assets
- cleaner circulation inputs
- better community coordination
- easier amplification across followers and members

### For the overall system

- supports eventual network effects through shared circulation
- supports softer switching costs through accumulated private and shared context
- avoids premature centralization

## Relationship To The Current Documents

This architecture note extends:

- `docs/superpowers/specs/2026-05-10-proof-to-funding-incubator-overview.md`
- `docs/superpowers/plans/2026-05-10-proof-flow-mvp.md`

Relationship:

- the incubator overview explains why mixed mode is valuable
- the MVP plan keeps v1 founder-private first
- this note defines the boundary that a later mixed-mode version would implement

## Out Of Scope

This note does not specify:

- tenancy model
- authentication model
- permission matrix
- sync transport
- conflict resolution
- audit logs
- billing or SaaS packaging
- community ranking logic
- investor CRM integration

Those should be designed later if and when the system moves beyond the founder-private MVP.

## Short Definition

The mixed-mode architecture gives the founder a private proof operating system and the incubator a shared circulation operating system, connected by a selective sync layer that moves approved proof outward and useful feedback back in.
