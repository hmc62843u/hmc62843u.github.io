import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const about = readFileSync(new URL("../about.htm", import.meta.url), "utf8");
const services = readFileSync(new URL("../services.htm", import.meta.url), "utf8");
const strategy = readFileSync(new URL("../startup-patent-strategy.htm", import.meta.url), "utf8");
const provisionalVsNda = readFileSync(new URL("../provisional-vs-nda.htm", import.meta.url), "utf8");
const provisionalBudget = readFileSync(new URL("../provisional-and-poc-budget.htm", import.meta.url), "utf8");
const drawFirst = readFileSync(new URL("../draw-first-write-second.htm", import.meta.url), "utf8");

test("about page surfaces founder identity and the simplified proof story", () => {
  assert.match(about, /Andrew Leung/);
  assert.match(about, /patent agent turned entrepreneur/i);
  assert.match(about, /OpenFor member/i);
  assert.match(about, /startup-patent-strategy\.htm/);
  assert.match(about, /services\.htm/);
  assert.match(about, /"@type":\s*"Organization"/);
  assert.match(about, /"@type":\s*"Person"/);
  assert.match(about, /<link rel="canonical" href="https:\/\/wpatent\.com\/about\.htm">/);
});

test("services page focuses on strategy, virtual marking, and founder decision support", () => {
  assert.match(services, /startup patent strategy advisory/i);
  assert.match(services, /virtual marking/i);
  assert.match(services, /founder decision support|founder articulation/i);
  assert.match(services, /startup-patent-strategy\.htm/);
  assert.match(services, /mailto:wp@wpatent\.com/);
  assert.match(services, /<link rel="canonical" href="https:\/\/wpatent\.com\/services\.htm">/);
});

test("startup patent strategy page is the new pillar with sharper voice", () => {
  assert.match(strategy, /<title>Patent Strategy, in Founder Language \| W&(?:amp;)?Patent<\/title>/i);
  assert.match(strategy, /Patent Strategy, in Founder Language/i);
  assert.match(strategy, /Andrew Leung, founder of W&(?:amp;)?Patent/i);
  assert.match(strategy, /registered patent agent/i);
  assert.match(strategy, /"@type":\s*"Article"/);
  assert.match(strategy, /<link rel="canonical" href="https:\/\/wpatent\.com\/startup-patent-strategy\.htm">/);
  assert.match(strategy, /href="provisional-vs-nda\.htm"/);
  assert.match(strategy, /href="provisional-and-poc-budget\.htm"/);
  assert.match(strategy, /href="draw-first-write-second\.htm"/);
});

test("provisional-vs-nda page reframes patent strategy as strategic thinking", () => {
  assert.match(provisionalVsNda, /<title>Your Moat Is Not in an NDA/i);
  assert.match(provisionalVsNda, /Moat Is Not in an NDA/i);
  assert.match(provisionalVsNda, /Andrew Leung, founder of W&(?:amp;)?Patent/i);
  assert.match(provisionalVsNda, /"@type":\s*"Article"/);
  assert.match(provisionalVsNda, /<link rel="canonical" href="https:\/\/wpatent\.com\/provisional-vs-nda\.htm">/);
  assert.match(provisionalVsNda, /href="startup-patent-strategy\.htm"/);
});

test("provisional-and-poc-budget page addresses timing and budget tradeoffs", () => {
  assert.match(provisionalBudget, /<title>Provisional \+ POC on a Limited Budget/i);
  assert.match(provisionalBudget, /Andrew Leung, founder of W&(?:amp;)?Patent/i);
  assert.match(provisionalBudget, /"@type":\s*"Article"/);
  assert.match(provisionalBudget, /<link rel="canonical" href="https:\/\/wpatent\.com\/provisional-and-poc-budget\.htm">/);
  assert.match(provisionalBudget, /POC and provisional together|parallel execution/i);
  assert.match(provisionalBudget, /href="startup-patent-strategy\.htm"/);
});

test("draw-first-write-second page explains possession and drafting", () => {
  assert.match(drawFirst, /<title>Draw First, Write Second, Claim Third/i);
  assert.match(drawFirst, /Andrew Leung, founder of W&(?:amp;)?Patent/i);
  assert.match(drawFirst, /"@type":\s*"Article"/);
  assert.match(drawFirst, /<link rel="canonical" href="https:\/\/wpatent\.com\/draw-first-write-second\.htm">/);
  assert.match(drawFirst, /you can never claim more than you possessed/i);
  assert.match(drawFirst, /href="startup-patent-strategy\.htm"/);
});

test("retired pages redirect with meta refresh", () => {
  for (const [page, destination] of [
    ["patent-strategy-open-licensing.htm", "startup-patent-strategy.htm"],
    ["trust-chain.htm", "startup-patent-strategy.htm"],
    ["trust-chain-demo.htm", "startup-patent-strategy.htm"],
    ["trust-chain-explainer.htm", "about.htm"],
    ["patent-commercialization-for-founders.htm", "startup-patent-strategy.htm"],
    ["startup-patent-strategy-case-note.htm", "startup-patent-strategy.htm"],
    ["why_us.htm", "about.htm"],
    ["faq.htm", "startup-patent-strategy.htm"],
    ["career.htm", "about.htm"]
  ]) {
    const html = readFileSync(new URL(`../${page}`, import.meta.url), "utf8");
    assert.match(html, new RegExp(`http-equiv="refresh" content="0; url=https://wpatent\\.com/${destination.replace(/\./g, "\\.")}"`));
    assert.match(html, new RegExp(`<link rel="canonical" href="https://wpatent\\.com/${destination.replace(/\./g, "\\.")}">`));
  }
});

test("andrew-leung-startup-patent-strategy.htm is a meta refresh redirect", () => {
  const founderAuthorityPath = new URL("../andrew-leung-startup-patent-strategy.htm", import.meta.url);
  assert.equal(existsSync(founderAuthorityPath), true);
  const founderAuthority = readFileSync(founderAuthorityPath, "utf8");
  assert.match(founderAuthority, /http-equiv="refresh" content="0; url=https:\/\/wpatent\.com\/startup-patent-strategy\.htm"/i);
  assert.match(founderAuthority, /<link rel="canonical" href="https:\/\/wpatent\.com\/startup-patent-strategy\.htm">/);
  assert.match(founderAuthority, /href="about\.htm"/);
  assert.match(founderAuthority, /href="startup-patent-strategy\.htm"/);
});
