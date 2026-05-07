import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

test("trust chain landing and demo pages exist with canonical links", () => {
  assert.equal(existsSync(new URL("../trust-chain.htm", import.meta.url)), true);
  assert.equal(existsSync(new URL("../trust-chain-demo.htm", import.meta.url)), true);

  const landing = read("trust-chain.htm");
  const demo = read("trust-chain-demo.htm");

  assert.match(landing, /<title>Trust Chain Template \| W&amp;Patent<\/title>/);
  assert.match(landing, /<link rel="canonical" href="https:\/\/hmc62843u\.github\.io\/trust-chain\.htm">/);
  assert.match(landing, /href="trust-chain-demo\.htm"/);

  assert.match(demo, /<title>Trust Chain Demo \| W&amp;Patent<\/title>/);
  assert.match(demo, /<link rel="canonical" href="https:\/\/hmc62843u\.github\.io\/trust-chain-demo\.htm">/);
  assert.match(demo, /href="trust-chain\.htm"/);
});

test("trust chain landing page explains the methodology honestly", () => {
  const landing = read("trust-chain.htm");

  for (const fragment of [
    "<title>Trust Chain Template | W&amp;Patent</title>",
    "A free template for founder-led startups and B2B firms",
    "This template helps structure trust. It does not manufacture it.",
    "Domain",
    "Author",
    "Content",
    "Who This Is For",
    "Who This Is Not For",
    "Founder-led B2B firms",
    "Andrew Leung, founder of W&amp;Patent",
    "Trust Chain Scorecard",
    '"@type": "Organization"',
    '"@type": "Person"',
    '"@type": "FAQPage"'
  ]) {
    assert.match(landing, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
});
