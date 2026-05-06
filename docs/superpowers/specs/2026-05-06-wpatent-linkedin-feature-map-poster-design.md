# W&Patent LinkedIn Feature Map Poster Design

Date: 2026-05-06
Project: Branded HTML poster for LinkedIn PNG export
Status: Approved design draft

## Summary

W&Patent will add a standalone HTML poster that turns the site's SEO, AEO, GEO, and AI-demo feature map into a clean visual artifact for a LinkedIn post. The poster is not part of the live website navigation. It is a self-contained export asset designed to be opened locally and captured as a PNG.

The poster should feel like an extension of the W&Patent site rather than a generic SaaS infographic. It should be readable in one glance, work well as a LinkedIn attachment, and stay mostly plain-English while preserving a few important protocol labels such as `JSON-LD`, `UCP`, `WebMCP`, and `ACP`.

## Goals

- Create a branded, export-ready poster for LinkedIn
- Explain the feature map in a way non-technical readers can scan quickly
- Keep the design aligned with W&Patent's current visual language
- Make the artifact easy to open locally and capture as a PNG

## Non-Goals

- No integration into the main site navigation
- No interactive app behavior inside the poster
- No attempt to cover every implementation detail from the repo
- No generic corporate infographic styling

## Audience

The poster is aimed at general LinkedIn readers who may be founder-minded, product-minded, or curious about how websites are evolving for AI discovery. It should not assume the reader understands protocol jargon in depth.

## Format

- Standalone HTML file
- Sized for portrait LinkedIn export at `1080 x 1350`
- Single-screen composition with no internal scrolling
- Self-contained CSS in the file for portability

## Content Hierarchy

The poster should follow a simple reading order:

1. headline
2. short subtitle
3. four equally weighted feature blocks
4. closing footer line

### Headline

`How W&Patent Is Built for Search + AI Discovery`

This should be the visual anchor of the poster.

### Subtitle

`Static patent marketplace demo with strong SEO, AEO, and GEO foundations`

This gives immediate context before the feature blocks begin.

### Four Blocks

The poster body will use four cards:

- `SEO`
- `AEO`
- `GEO`
- `AI Demo Layer`

Each card should contain only short, scannable bullets.

### Footer

`Crawlable. Structured. AI-discoverable.`

This should act as the summary takeaway at the bottom.

## Block Copy Direction

The block copy should stay mostly plain-English.

### SEO

- Crawlable static pages
- Unique titles, descriptions, and canonicals
- `robots.txt` and `sitemap.xml`
- `JSON-LD` on core pages

### AEO

- Direct-answer FAQ content
- `FAQPage` schema
- Quote-friendly Q&A patterns
- `speakable` markup

### GEO

- Entity-style structured data
- Static `.well-known/ucp.json` manifest
- Visible protocol copy
- Static JSON request/response examples

### AI Demo Layer

- `JSON-LD`: real
- `UCP`: real static metadata
- `WebMCP`: mock capability surface
- `ACP`: mock transaction states

## Visual Direction

The design should feel editorial and intentional, not like a dashboard and not like a flowchart.

### Layout

- top title band
- `2 x 2` grid of equal cards
- bottom footer strip

### Tone

- calm and high-confidence
- premium but not flashy
- branded rather than generic

### Color

Use the current W&Patent palette direction:

- warm off-white background
- dark ink text
- muted panel surfaces
- restrained orange accent

### Typography

Use strong hierarchy with:

- large headline
- compact subtitle
- bold card labels
- short bullet copy

Monospace should be used only for labels like `JSON-LD`, `UCP`, `WebMCP`, and `ACP`.

## Design Rules

- No navigation
- No browser chrome framing
- No fake charts or filler metrics
- No decorative icons unless they clearly help scanning
- No dense paragraphs in the cards
- No technical overload

The poster should prioritize clarity, hierarchy, and screenshot-readability.

## File Placement

This should live as a standalone artifact in the repo, separate from the production site pages. A small dedicated path such as `artifacts/` or `docs/` is acceptable as long as the file is easy to find and open locally.

## Export Intent

The main output is the HTML poster file itself. The expected use is:

1. open locally in a browser
2. capture a clean PNG
3. attach the PNG to the LinkedIn post

## Success Criteria

This design is successful if:

- the poster is readable in one glance on LinkedIn
- the content feels understandable to non-technical readers
- the visual style clearly belongs to W&Patent
- the poster is easy to export as a PNG
- the technical labels are present but not overwhelming
