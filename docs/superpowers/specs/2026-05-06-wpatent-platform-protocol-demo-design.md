# W&Patent Platform Protocol Demo Design

Date: 2026-05-06
Project: GitHub Pages-compatible mock WebMCP and ACP demo on `platform.htm`
Status: Approved design draft

## Summary

W&Patent will add a browser-simulated protocol demo to `platform.htm` that helps visitors understand how the marketplace could support agent-driven listing, discovery, bidding, and transaction workflows without adding any server infrastructure. The demo will remain fully deployable on GitHub Pages and will use only static HTML, CSS, and client-side JavaScript backed by local fixture data.

The page will be useful to both commercial visitors and protocol-curious evaluators. It will show a balanced end-to-end flow: seller intake, AI valuation preview, buyer discovery, mock bid submission, and mock ACP-style transaction progression. The design must be explicit that the entire experience is a static demo with no live endpoint execution, no real payment flow, and no backend persistence.

## Goals

- Strengthen the product credibility of `platform.htm` with an interactive protocol-shaped demo
- Keep the entire experience compatible with GitHub Pages and static hosting
- Show both seller and buyer journeys in one connected flow
- Improve GEO/AEO value by exposing structured, inspectable payload examples
- Clarify how the existing UCP-style manifest relates to the product demo

## Non-Goals

- No live WebMCP server
- No live ACP implementation
- No authentication, token issuance, escrow, or payment execution
- No remote API calls
- No new multi-page protocol subsite in this phase

## Audience

The demo must serve three overlapping audiences:

- patent owners evaluating whether the platform can present and commercialize their assets
- buyers or licensees evaluating how opportunities are discovered and assessed
- AI/protocol reviewers who want machine-readable evidence and realistic state transitions

The page should remain understandable even if the visitor never opens a JSON panel.

## Hosting Constraint

This design assumes the site remains a plain static GitHub Pages deployment.

That means:

- all demo logic runs in the browser
- all payloads come from local fixture objects or optional static JSON files
- all state is session-only and ephemeral
- there are no fetch-dependent success paths

Any visual pattern that could imply server execution must be avoided or clearly labeled as simulated.

## Page Strategy

`platform.htm` remains the single page for the protocol story. The goal is not to split protocol documentation into a separate microsite, but to make the existing product page more concrete and inspectable.

The page will be organized into three layers:

1. a sales-readable overview that explains the marketplace capability
2. an interactive state-machine playground that demonstrates the workflow
3. an evidence layer showing the underlying mock capabilities and payloads

This lets a casual visitor skim the story while still giving technical evaluators a deeper artifact to inspect.

## Truthfulness Rules

The demo must be deliberately and repeatedly honest.

Required labels:

- `Mock`
- `Static demo`
- `No live transaction`

These labels must appear:

- near the top of the protocol section
- inside the interactive playground shell
- in the payload/evidence area
- next to transaction status displays

Mock transaction states must use demo-safe names such as:

- `draft`
- `reviewed`
- `mock-approved`
- `mock-settled`

The design must not use unlabeled production-sounding states like `settled` if that could be misread in isolation. ACP and WebMCP references should be phrased as `protocol-shaped demo`, `browser-simulated`, or `example payloads`, not as live support claims.

## End-to-End Demo Flow

The playground centers on one balanced story:

1. seller submits a listing intake
2. the platform shows an AI valuation preview
3. the listing appears in a buyer discovery view
4. the buyer opens structured listing facts
5. the buyer submits a mock bid or delegation step
6. the transaction advances through explicit mock ACP-style states

This is one continuous storyline rather than separate disconnected widgets. The visitor should feel that the platform is demonstrating a coherent marketplace lifecycle.

## Page Sections

### 1. Protocol Intro

This section explains what the visitor is about to see in plain language:

- the marketplace supports patent listing and buyer discovery
- the protocol demo shows how an agent-oriented workflow could look
- everything on the page is simulated in-browser for static hosting

This section should be concise and not overwhelm the user with jargon.

### 2. Interactive Playground

This is the main feature on the page. It presents the balanced seller-to-buyer journey as a step-by-step state machine. Each step should have:

- a short human-readable explanation
- a visible current state
- a primary action to advance the demo
- an associated request/response payload view

The playground should be linear enough to be easy to follow, but it can allow revisiting earlier steps.

### 3. Evidence And Capability Layer

This section supports GEO and technical credibility. It shows:

- the mock capability names
- the current request payload
- the current response payload
- a short explanation of how the demo relates to `.well-known/ucp.json`

This area should feel inspectable rather than decorative.

## UI Modules

The interaction can be composed from a small number of focused modules:

- step navigator for the current stage in the lifecycle
- narrative result panel for plain-language explanation
- payload viewer for request/response JSON
- transaction state panel showing mock ACP-style progression
- capability summary panel listing the relevant mock tools or actions

These modules should be visually coordinated but conceptually separate so the logic stays maintainable.

## Data Model

The demo will be powered by local fixture data representing what a future backend might exchange.

Core fixture types:

- seller listing intake payload
- valuation preview result
- buyer discovery result
- structured listing facts
- mock bid request
- transaction summary
- mock settlement record

The fixtures can live inline in `site.js` for this phase unless they become too noisy. If they grow, they can later move to static JSON files without changing the user-facing design.

## State Management

`site.js` will own a small client-side controller for the protocol demo. It should track:

- current demo step
- currently selected listing record
- current mock bid values
- current transaction state
- currently active request payload
- currently active response payload

State should reset cleanly on page reload. No data should persist across sessions.

## Mock Capability Framing

The demo should present a small, credible capability set rather than a sprawling fake platform.

Suggested mock capability labels:

- `listPatent`
- `previewValuation`
- `discoverListings`
- `openListingFacts`
- `submitMockBid`
- `advanceMockTransaction`

These do not need to be live tools. They are explanatory anchors for the payload panels and the state transitions.

## Error And Review Scenarios

The demo should simulate a narrow set of realistic conditions beyond the happy path:

- missing seller field in intake
- buyer bid below ask guidance
- transaction paused for manual review

These scenarios should be intentional, readable, and reversible. The point is to show realistic workflow handling, not to imitate a production-grade exception engine.

## Content Rules

The commercial story remains primary. Protocol detail exists to support trust, not to take over the page.

Copy should:

- explain the value of the workflow before showing payload syntax
- use short, quote-friendly descriptions that support AEO and GEO
- connect the demo back to the marketplace use case
- mention that the UCP manifest is the machine-readable top-level descriptor for the static site

Copy should not:

- imply real transaction completion
- imply real backend integration
- imply platform persistence or buyer account state

## Accessibility And Progressive Enhancement

The demo should remain understandable without deep interaction.

Required qualities:

- visible labels and headings that make sense in linear reading order
- payload panels that remain legible in narrow layouts
- controls with accessible button text
- page content that still conveys the protocol story even if JavaScript fails

The page does not need a no-JS fully interactive fallback, but the surrounding explanatory content should still communicate the feature honestly.

## Testing Strategy

The implementation should add or update tests covering:

- presence of `Mock`, `Static demo`, and `No live transaction` disclosures
- balanced seller/buyer flow language on `platform.htm`
- key mock transaction states such as `mock-approved` and `mock-settled`
- presence of capability and payload evidence areas
- consistency between the page copy and the static `.well-known/ucp.json` positioning

Tests should validate the page as shipped rather than only the internal JS behavior.

## Primary Files In Scope

- `platform.htm`
- `site.js`
- optionally `site.css` if the playground needs additional styling
- platform-related test files under `tests/`

No new backend files, server handlers, or deployment changes are part of this design.

## Success Criteria

This design is successful if:

- the site stays fully deployable on GitHub Pages
- the demo feels meaningfully interactive without a server
- the workflow is clear to both sellers and buyers
- payloads and state transitions are concrete enough for GEO/AEO value
- the page remains explicit that ACP/WebMCP behavior is mocked and static

## Open Design Decision Already Resolved

The following choices are already locked for this phase:

- demo depth: interactive playground
- journey emphasis: balanced seller and buyer flow
- mock disclosure style: conservative and explicit
- page placement: extend `platform.htm` rather than adding a new demo page

## Implementation Boundary

This design is intentionally narrow. It improves the protocol credibility of the platform page without turning the site into a fake live product. If a future phase adds real services, those should be introduced as a separate spec with new truthfulness and infrastructure rules rather than quietly evolving this static demo past its stated limits.
