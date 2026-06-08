import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const about = readFileSync(new URL("../about.htm", import.meta.url), "utf8");
const services = readFileSync(new URL("../services.htm", import.meta.url), "utf8");
const virtualMarking = readFileSync(new URL("../virtual-marking.htm", import.meta.url), "utf8");
const strategy = readFileSync(new URL("../startup-patent-strategy.htm", import.meta.url), "utf8");
const provisionalVsNda = readFileSync(new URL("../provisional-vs-nda.htm", import.meta.url), "utf8");
const provisionalBudget = readFileSync(new URL("../poc-and-provisional.htm", import.meta.url), "utf8");
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
  assert.match(services, /virtual-marking\.htm/);
  assert.match(services, /mailto:wp@wpatent\.com/);
  assert.match(services, /<link rel="canonical" href="https:\/\/wpatent\.com\/services\.htm">/);
});

test("virtual marking has its own crawlable support page", () => {
  assert.match(virtualMarking, /<title>Virtual Marking for Founders/i);
  assert.match(virtualMarking, /virtual marking/i);
  assert.match(virtualMarking, /issued patent/i);
  assert.match(virtualMarking, /services\.htm/);
  assert.match(virtualMarking, /<link rel="canonical" href="https:\/\/wpatent\.com\/virtual-marking\.htm">/);
});

test("active strategy and support pages avoid em dashes", () => {
  for (const page of [about, services, strategy, provisionalVsNda, provisionalBudget, drawFirst]) {
    assert.doesNotMatch(page, /—/);
  }
});

test("startup patent strategy page is the new pillar with sharper voice", () => {
  assert.match(strategy, /<title>Startup Patent Strategy, in Founder Language \| W&(?:amp;)?Patent<\/title>/i);
  assert.match(strategy, /startup patent strategy/i);
  assert.match(strategy, /Startup Patent Strategy, in Founder Language/i);
  assert.match(strategy, /Andrew Leung, founder of W&(?:amp;)?Patent/i);
  assert.match(strategy, /registered patent agent/i);
  assert.match(strategy, /"@type":\s*"Article"/);
  assert.match(strategy, /"affiliation":\s*\{\s*"@type":\s*"Organization",\s*"name":\s*"OpenFor"/s);
  assert.match(strategy, /<link rel="canonical" href="https:\/\/wpatent\.com\/startup-patent-strategy\.htm">/);
  assert.match(strategy, /href="provisional-vs-nda\.htm"/);
  assert.match(strategy, /href="poc-and-provisional\.htm"/);
  assert.match(strategy, /href="draw-first-write-second\.htm"/);
});

test("provisional-vs-nda page reframes patent strategy as strategic thinking", () => {
  assert.match(provisionalVsNda, /<title>Provisional vs\. NDA for Founders: Your Moat Is Not in an NDA \| W&(?:amp;)?Patent<\/title>/i);
  assert.match(provisionalVsNda, /<meta name="description" content="Provisional vs\. NDA for founders/i);
  assert.match(provisionalVsNda, /provisional vs\. nda/i);
  assert.match(provisionalVsNda, /Provisional vs\. NDA for Founders: Your Moat Is Not in an NDA/i);
  assert.match(provisionalVsNda, /<h2>Quick answer<\/h2>/i);
  assert.match(provisionalVsNda, /Quick answer[\s\S]{0,220}Provisional vs\. NDA for founders/i);
  assert.match(provisionalVsNda, /Andrew Leung, founder of W&(?:amp;)?Patent/i);
  assert.match(provisionalVsNda, /"@type":\s*"Article"/);
  assert.match(provisionalVsNda, /"affiliation":\s*\{\s*"@type":\s*"Organization",\s*"name":\s*"OpenFor"/s);
  assert.match(provisionalVsNda, /<link rel="canonical" href="https:\/\/wpatent\.com\/provisional-vs-nda\.htm">/);
  assert.match(provisionalVsNda, /href="startup-patent-strategy\.htm"/);
  assert.doesNotMatch(provisionalVsNda, /That is all you need to start talking/i);
  assert.doesNotMatch(provisionalVsNda, /talk freely about everything else/i);
  assert.doesNotMatch(provisionalVsNda, /That piece hold/i);
  assert.match(provisionalVsNda, /does not mean every detail is safe to disclose|still decides what stays private/i);
  assert.match(provisionalVsNda, /Hold that piece close to your chest/i);
  assert.match(provisionalVsNda, /href="poc-and-provisional\.htm"/);
});

test("provisional-and-poc-budget page reframes as you do both", () => {
  assert.match(provisionalBudget, /<title>POC and Provisional for Founders: You Do Both \| W&(?:amp;)?Patent<\/title>/i);
  assert.match(provisionalBudget, /<meta name="description" content="POC and provisional for founders/i);
  assert.match(provisionalBudget, /poc and provisional/i);
  assert.match(provisionalBudget, /POC and Provisional for Founders: You Do Both/i);
  assert.match(provisionalBudget, /<h2>Quick answer<\/h2>/i);
  assert.match(provisionalBudget, /Quick answer[\s\S]{0,220}POC and provisional for founders/i);
  assert.match(provisionalBudget, /Andrew Leung, founder of W&(?:amp;)?Patent/i);
  assert.match(provisionalBudget, /"@type":\s*"Article"/);
  assert.match(provisionalBudget, /"affiliation":\s*\{\s*"@type":\s*"Organization",\s*"name":\s*"OpenFor"/s);
  assert.match(provisionalBudget, /<link rel="canonical" href="https:\/\/wpatent\.com\/poc-and-provisional\.htm">/);
  assert.match(provisionalBudget, /POC and provisional together|parallel execution/i);
  assert.match(provisionalBudget, /href="startup-patent-strategy\.htm"/);
  assert.doesNotMatch(provisionalBudget, /\$60/);
  assert.doesNotMatch(provisionalBudget, /You can only patent what works/i);
  assert.doesNotMatch(provisionalBudget, /That piece hold/i);
  assert.match(provisionalBudget, /better provisional is grounded in how the invention actually works in practice|POC can strengthen that description/i);
  assert.match(provisionalBudget, /not a formal legal prerequisite to file|not just the government fee/i);
  assert.match(provisionalBudget, /Hold that piece close(?: to your chest)?/i);
});

test("draw-first-write-second page reframes as exit strategy", () => {
  assert.match(drawFirst, /<title>Draw First, Write Second: Your Drawings Are Your Exit Strategy \| W&(?:amp;)?Patent<\/title>/i);
  assert.match(drawFirst, /<meta name="description" content="Draw first, write second for founders/i);
  assert.match(drawFirst, /draw first, write second/i);
  assert.match(drawFirst, /Draw First, Write Second: Your Drawings Are Your Exit Strategy/i);
  assert.match(drawFirst, /<h2>Quick answer<\/h2>/i);
  assert.match(drawFirst, /Quick answer[\s\S]{0,220}Draw first, write second/i);
  assert.match(drawFirst, /Andrew Leung, founder of W&(?:amp;)?Patent/i);
  assert.match(drawFirst, /"@type":\s*"Article"/);
  assert.match(drawFirst, /"affiliation":\s*\{\s*"@type":\s*"Organization",\s*"name":\s*"OpenFor"/s);
  assert.match(drawFirst, /<link rel="canonical" href="https:\/\/wpatent\.com\/draw-first-write-second\.htm">/);
  assert.match(drawFirst, /you can never claim more than you possessed/i);
  assert.match(drawFirst, /AI will not warn you/i);
  assert.match(drawFirst, /Statutory anchor/i);
  assert.match(drawFirst, /still needs legal judgment|still needs patent judgment/i);
  assert.doesNotMatch(drawFirst, /generate a provisional from your public footprint/i);
  assert.match(drawFirst, /href="startup-patent-strategy\.htm"/);
});

test("support posts carry a calm article-level disclaimer", () => {
  for (const page of [provisionalVsNda, provisionalBudget, drawFirst]) {
    assert.match(page, /Warning &amp; Disclaimer/i);
    assert.match(page, /registered patent agent and an entrepreneur/i);
    assert.match(page, /Nothing on this website constitutes legal advice nor creates an agent-client relationship/i);
  }
});

test("retired pages redirect with meta refresh", () => {
  for (const [page, destination] of [
    ["patent-strategy-open-licensing.htm", "startup-patent-strategy.htm"],
    ["trust-chain.htm", "startup-patent-strategy.htm"],
    ["trust-chain-demo.htm", "startup-patent-strategy.htm"],
    ["trust-chain-explainer.htm", "about.htm"],
    ["patent-commercialization-for-founders.htm", "startup-patent-strategy.htm"],
    ["startup-patent-strategy-case-note.htm", "startup-patent-strategy.htm"],
    ["provisional-and-poc-budget.htm", "poc-and-provisional.htm"],
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
