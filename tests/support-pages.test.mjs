import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

const about = read("about.htm");
const services = read("services.htm");
const strategy = read("startup-patent-strategy.htm");
const openLicensing = read("patent-strategy-open-licensing.htm");
const commercialization = read("patent-commercialization-for-founders.htm");
const provisionalVsNda = read("provisional-vs-nda.htm");
const founderAuthority = read("andrew-leung-startup-patent-strategy.htm");

test("about page frames Andrew as the founder-language translator", () => {
  assert.match(about, /Andrew Leung, patent agent turned entrepreneur/i);
  assert.match(about, /articulate patent strategy in founder language/i);
  assert.match(about, /OpenFor member/i);
  assert.match(about, /wrong script/i);
  assert.match(about, /startup-patent-strategy\.htm/);
  assert.match(about, /services\.htm/);
  assert.match(about, /<link rel="canonical" href="https:\/\/wpatent\.com\/about\.htm">/);
});

test("services page stays small and secondary to the flagship guide", () => {
  assert.match(services, /founder patent advisory/i);
  assert.match(services, /virtual marking/i);
  assert.match(services, /decision support/i);
  assert.match(services, /generic filing advice/i);
  assert.match(services, /Read the flagship guide/i);
  assert.match(services, /startup-patent-strategy\.htm/);
  assert.match(services, /<link rel="canonical" href="https:\/\/wpatent\.com\/services\.htm">/);
  assert.doesNotMatch(services, /Commercialization/i);
});

test("strategy page is now the rewritten pillar and no longer routes into retired strategy support", () => {
  assert.match(strategy, /<title>What Every Patent Practitioner Knows But Won't Tell Founders \| W&(?:amp;)?Patent<\/title>/i);
  assert.match(strategy, /Andrew Leung is a registered patent agent who works with founders/i);
  assert.match(strategy, /translates startup patent strategy into plain founder terms/i);
  assert.match(strategy, /Opening Thesis/i);
  assert.match(strategy, /Provisional Before NDA/i);
  assert.match(strategy, /Draw First\. Write Second\./i);
  assert.match(strategy, /Build And File In Parallel/i);
  assert.match(strategy, /The Unifying Founder Strategy/i);
  assert.match(strategy, /"@type":\s*"Article"/);
  assert.match(strategy, /<link rel="canonical" href="https:\/\/wpatent\.com\/startup-patent-strategy\.htm">/);
  assert.match(strategy, /Warning &amp; Disclaimer/i);
  assert.match(strategy, /investors generally do not sign NDAs/i);
  assert.match(strategy, /draw first/i);
  assert.match(strategy, /Protect what changes bargaining position/i);
  assert.doesNotMatch(strategy, /href="trust-chain\.htm"/);
  assert.doesNotMatch(strategy, /href="trust-chain-explainer\.htm"/);
  assert.doesNotMatch(strategy, /href="patent-strategy-open-licensing\.htm"/);
  assert.doesNotMatch(strategy, /"@type":\s*"FAQPage"/);
});

test("provisional vs NDA page still exists as pre-reset history until week 1 rewrite", () => {
  assert.equal(existsSync(new URL("../provisional-vs-nda.htm", import.meta.url)), true);
  assert.match(provisionalVsNda, /<title>Provisional Patent vs NDA for Founders \| W&(?:amp;)?Patent<\/title>/i);
  assert.match(provisionalVsNda, /Andrew Leung, founder of W&(?:amp;)?Patent/i);
  assert.match(provisionalVsNda, /href="startup-patent-strategy\.htm"/);
  assert.match(provisionalVsNda, /<link rel="canonical" href="https:\/\/wpatent\.com\/provisional-vs-nda\.htm">/);
  assert.doesNotMatch(provisionalVsNda, /NDAs Won't Save You\. A Provisional Will\./i);
});

test("open licensing page is now a retired helper URL", () => {
  assert.match(openLicensing, /This standalone note now routes into the flagship strategy guide/i);
  assert.match(openLicensing, /<meta name="robots" content="noindex, follow">/i);
  assert.match(openLicensing, /http-equiv="refresh" content="0; url=https:\/\/wpatent\.com\/startup-patent-strategy\.htm"/i);
  assert.match(openLicensing, /href="startup-patent-strategy\.htm"/);
  assert.match(openLicensing, /href="about\.htm"/);
  assert.match(openLicensing, /<link rel="canonical" href="https:\/\/wpatent\.com\/startup-patent-strategy\.htm">/);
  assert.doesNotMatch(openLicensing, /"@type":\s*"FAQPage"/);
});

test("commercialization URL still consolidates into the strategy guide", () => {
  assert.match(commercialization, /This commercialization logic now lives in the startup patent strategy guide/i);
  assert.match(commercialization, /http-equiv="refresh" content="0; url=https:\/\/wpatent\.com\/startup-patent-strategy\.htm"/i);
  assert.match(commercialization, /href="startup-patent-strategy\.htm"/);
  assert.match(commercialization, /href="services\.htm"/);
});

test("founder-authority helper URL still consolidates into the strategy guide", () => {
  assert.match(founderAuthority, /This founder view now lives in the startup patent strategy guide/i);
  assert.match(founderAuthority, /http-equiv="refresh" content="0; url=https:\/\/wpatent\.com\/startup-patent-strategy\.htm"/i);
  assert.match(founderAuthority, /href="about\.htm"/);
  assert.match(founderAuthority, /href="startup-patent-strategy\.htm"/);
});
