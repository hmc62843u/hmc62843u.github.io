# Trust Chain Article Attribution Design

Date: 2026-05-07
Project: Attribution alignment for Trust Chain article assets
Status: Draft for review

## Summary

W&Patent will add a compact attribution block to the Trust Chain article assets so the author, company, and domain stay connected when the content is shared on-site and off-site. The change will apply to the public explainer page, the source markdown article, and the regenerated PDF.

The attribution should stay editorial and minimal. It should reinforce the Trust Chain model without reading like a promotional banner.

## Goal

Make the author, company, and canonical domain explicit across all shared versions of the article.

## Why

When the article is shared as a markdown file or PDF, it can lose the structural context that exists on the live site. A compact attribution block helps preserve:

- author authority
- company context
- canonical domain linkage

This keeps the trust chain intact even when the file is forwarded or downloaded.

## Scope

Included:

- add attribution to `docs/articles/2026-05-07-startup-domain-trust-infrastructure.md`
- regenerate `docs/articles/2026-05-07-startup-domain-trust-infrastructure.pdf`
- add matching attribution to `trust-chain-explainer.htm`

Excluded:

- broader article copy changes
- redesign of the explainer page layout
- changes to unrelated Trust Chain pages

## Attribution Format

Use one compact editorial block directly below the title/subhead area.

Required content:

- `By Andrew Leung, founder of W&Patent`
- `Canonical source: https://wpatent.com/trust-chain-explainer.htm`

## Placement

### Markdown and PDF

Place the attribution directly under the article title and subhead so it survives when the article is exported or shared.

### Public HTML Explainer

Place the attribution directly below the hero subhead and above the article body content.

## Tone

The attribution should feel:

- clear
- minimal
- editorial
- trust-building

It should not feel:

- salesy
- oversized
- repetitive

## Success Criteria

The change is successful if:

- the markdown, PDF, and HTML versions all show the same author/company/domain attribution
- the attribution is visually quiet but clearly visible
- the article remains readable and editorial in tone
