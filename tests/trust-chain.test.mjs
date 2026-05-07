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

test("trust chain demo page shows a complete authority-page example", () => {
  const demo = read("trust-chain-demo.htm");

  for (const fragment of [
    "Signal Atlas",
    "Domain",
    "Author",
    "Content",
    "Proof",
    "Machine-readable layer",
    '"@type": "WebPage"',
    '"@type": "FAQPage"',
    'href="trust-chain.htm"'
  ]) {
    assert.match(demo, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
});

test("starter-kit files and repo README document the trust chain assets", () => {
  assert.equal(existsSync(new URL("../templates/trust-chain-starter/README.md", import.meta.url)), true);
  assert.equal(existsSync(new URL("../templates/trust-chain-starter/config.json", import.meta.url)), true);
  assert.equal(existsSync(new URL("../templates/trust-chain-starter/index.html", import.meta.url)), true);

  const starterReadme = read("templates/trust-chain-starter/README.md");
  const starterConfig = read("templates/trust-chain-starter/config.json");
  const starterHtml = read("templates/trust-chain-starter/index.html");
  const repoReadme = read("README.md");

  assert.match(starterReadme, /Trust Chain Starter Kit/i);
  assert.match(starterConfig, /companyName/);
  assert.match(starterHtml, /Founder-led authority page/i);
  assert.match(repoReadme, /Trust Chain/i);
  assert.match(repoReadme, /trust-chain\.htm/);
  assert.match(repoReadme, /templates\/trust-chain-starter\//);
});
