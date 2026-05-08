# W&Patent Discovery Improvement Roadmap

> **Version:** 2026-05-08
> **Scope:** First evidence-led roadmap derived from the Trust Chain scorecard and prompt-run log
> **Status:** Seeded from current evidence. A fresh live Perplexity run is still needed when `PERPLEXITY_API_KEY` is available.

## Objective

Improve how clearly W&Patent is understood, surfaced, and cited across the target topic spaces already tracked in the prompt set.

## Current Evidence Snapshot

| Evidence class | Signal | What it suggests |
| --- | --- | --- |
| `public-site simulation` | The public-URL-constrained `kilocode_dev` run interpreted Trust Chain correctly, recognized W&Patent, and cited live W&Patent URLs. | The live pages are capable of carrying the intended framing once the right W&Patent context is in scope. |
| `public-site simulation` | The same successful run did not explicitly name Andrew Leung. | Founder-to-company authority transfer is still weaker than the broader Trust Chain concept framing. |
| `public-site simulation` | The strongest successful citation landed on `https://wpatent.com/` rather than consistently favoring a dedicated explainer page. | The preferred citation targets are not yet obvious enough. |
| `development/provider comparison` | The unconstrained `opencode_dev` run interpreted `trust chain for websites` as TLS certificate-chain language. | The phrase still drifts toward security terminology when W&Patent context is missing. |
| `external discovery evidence` | `exa_answer` comparison runs across all ten prompts produced `0/10` W&Patent mentions and `0/10` W&Patent citations. | W&Patent is not yet surfacing across the broader non-branded topic spaces that matter most. |
| `external discovery evidence` | Current `perplexity` rows are blocked by a missing API key rather than a completed live benchmark. | The production benchmark is still incomplete, so roadmap confidence is strongest where Exa and simulation already agree. |

## Priority Workstreams

| Priority | Discovery gap | Evidence | Target surfaces | Recommended move | Validation |
| --- | --- | --- | --- | --- | --- |
| `P1` | `Trust Chain` still defaults to security-language meanings outside W&Patent context. | `opencode_dev` and `exa_answer` both drifted toward certificate-chain framing on the plain prompt `trust chain for websites`. | `trust-chain.htm`, `trust-chain-explainer.htm`, homepage Trust Chain block | Add explicit disambiguation near the top of the Trust Chain surfaces: state that this is not a TLS certificate-chain concept, but a founder-led authority framework for websites. Reinforce that distinction in FAQs, intros, and summary copy. | Rerun `trust chain for websites` without URL constraints and check for fewer security-only answers plus more W&Patent mentions or citations. |
| `P1` | Founder authority transfer is not durable enough in retrieved answers. | The strongest public-site simulation cited W&Patent but did not name Andrew Leung. The scorecard still shows Founder Recognition trailing other dimensions. | `trust-chain.htm`, `trust-chain-explainer.htm`, `about.htm`, homepage schema and founder panels | Increase repeated Andrew Leung naming, role clarity, and person-to-organization linkage on the most citable pages. Add stronger author and organization linkage where the explainer currently behaves more like a generic page than a clearly authored authority asset. | Rerun prompts like `founder-led authority building`, `founder identity and company authority`, and `trust chain for websites`; confirm whether Andrew is named and role-correct. |
| `P1` | W&Patent is absent from high-value non-branded prompt clusters. | `exa_answer` returned `0/10` W&Patent mentions across patent strategy, defensibility, commercialization, advisory, authority, and AI-readability prompts. | New public topic pages plus stronger links from `index.html`, `about.htm`, and `trust-chain-explainer.htm` | Build dedicated pages for the highest-intent prompt clusters W&Patent wants to own, especially `startup patent strategy`, `patent commercialization for founders`, `patent advisory for startup founders`, `founder-led authority building`, and `AI-readable company website`. | Rerun the full prompt set after publishing the new pages and compare mention and citation rates by topic cluster. |
| `P2` | The right pages are not yet obvious citation targets. | The successful public-site simulation cited the homepage first even though the explainer and methodology pages were also in scope. | `trust-chain-explainer.htm`, `trust-chain.htm`, new topic pages | Sharpen page openings, add direct-answer sections, and improve internal anchor text so answer engines have cleaner passages to lift and cite. Each target page should answer one core query clearly in the first screenful. | Track whether citations shift from the homepage toward the explainer or topic-specific pages in later runs. |
| `P2` | Current advisory framing is distributed across general pages instead of concentrated in topic assets. | `about.htm` and the homepage mention patent strategy and commercialization, but there are no dedicated pages mapped to those prompt spaces yet. | `about.htm`, `index.html`, future advisory pages | Use the general pages to route users and crawlers toward narrower pages, rather than asking the homepage or About page to do all the interpretive work. | Check whether new topic pages become the first cited URLs on their corresponding prompts. |
| `P3` | Discovery improvements are not yet connected to outcome tracking strongly enough. | The scorecard includes starter-kit downloads and scorecard requests, but business-outcome evidence is still mostly manual or unfilled. | Scorecard workflow, analytics pull routine, intake tracking | Once visibility improves, tighten the measurement loop for starter-kit downloads, Trust Chain scorecard requests, and page-level engagement on the explainer and future topic pages. | Compare visibility improvements against inquiry or download movement in the next score refresh. |

## Recommended Build Order

1. Strengthen Trust Chain disambiguation and founder linkage on the existing core pages.
2. Publish topic pages for the highest-value non-branded prompt clusters.
3. Improve citation shaping on the explainer, methodology page, and new topic assets.
4. Rerun the fixed prompt set with live external providers.
5. Refresh the scorecard and carry forward only the recommendations still supported by the newest evidence.

## Recheck Rules

- Treat `external discovery evidence` as the tie-breaker whenever it conflicts with simulation.
- Use `public-site simulation` to diagnose why W&Patent is or is not legible once context is present.
- Keep the roadmap tied to repeatable prompt clusters rather than one-off prompt wording.
- Retire or downgrade any roadmap item that loses support in later evidence refreshes.
