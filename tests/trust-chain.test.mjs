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
    'href="templates/trust-chain-starter.zip"',
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
    'href="templates/trust-chain-starter.zip"',
    '"@type": "WebPage"',
    '"@type": "FAQPage"',
    'href="trust-chain.htm"'
  ]) {
    assert.match(demo, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
});

test("starter-kit files and repo README document the trust chain assets", () => {
  assert.equal(existsSync(new URL("../templates/trust-chain-starter/README.md", import.meta.url)), true);
  assert.equal(existsSync(new URL("../templates/trust-chain-starter/config.js", import.meta.url)), true);
  assert.equal(existsSync(new URL("../templates/trust-chain-starter/index.html", import.meta.url)), true);
  assert.equal(existsSync(new URL("../templates/trust-chain-starter.zip", import.meta.url)), true);

  const starterReadme = read("templates/trust-chain-starter/README.md");
  const starterConfig = read("templates/trust-chain-starter/config.js");
  const starterHtml = read("templates/trust-chain-starter/index.html");
  const repoReadme = read("README.md");

  assert.match(starterReadme, /Trust Chain Starter Kit/i);
  assert.match(starterReadme, /config\.js/);
  assert.match(starterReadme, /zip/i);
  assert.match(starterConfig, /window\.TRUST_CHAIN_CONFIG/);
  assert.match(starterHtml, /script src="config\.js"/);
  assert.match(starterHtml, /data-config-company/);
  assert.match(repoReadme, /Trust Chain/i);
  assert.match(repoReadme, /trust-chain\.htm/);
  assert.match(repoReadme, /templates\/trust-chain-starter\//);
  assert.match(repoReadme, /templates\/trust-chain-starter\.zip/);
});

test("trust chain scorecard intake stays static and uses the shared script helper", () => {
  const landing = read("trust-chain.htm");
  const script = read("site.js");

  for (const fragment of [
    'data-scorecard-form',
    'id="scorecardCompany"',
    'id="scorecardUrl"',
    'id="scorecardGoal"',
    'data-scorecard-status',
    'mailto:wp@wpatent.com'
  ]) {
    assert.match(landing, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }

  for (const fragment of [
    'const scorecardForm = document.querySelector("[data-scorecard-form]")',
    "function buildScorecardMailto(",
    "wp@wpatent.com",
    "Opening your email client with a prefilled Trust Chain Scorecard request."
  ]) {
    assert.match(script, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
});

test("trust chain methodology links to the explainer companion", () => {
  const landing = read("trust-chain.htm");

  assert.match(landing, /href="trust-chain-explainer\.htm"/);
  assert.match(landing, /Read why this matters in 2026/i);
});

test("trust chain explainer page is public, crawlable, and tied back to the system", () => {
  assert.equal(existsSync(new URL("../trust-chain-explainer.htm", import.meta.url)), true);

  const explainer = read("trust-chain-explainer.htm");

  for (const fragment of [
    "<title>When a Startup Domain Becomes Trust Infrastructure | W&amp;Patent</title>",
    '<link rel="canonical" href="https://hmc62843u.github.io/trust-chain-explainer.htm">',
    '"@type": "WebPage"',
    "When a Startup Domain Becomes Trust Infrastructure",
    "Why SEO, AEO, and GEO are converging",
    "SEO",
    "AEO",
    "GEO",
    "Trust Chain",
    "The goal is not to manufacture trust, but to make real credibility easier for AI systems to interpret, cite, and use.",
    'href="trust-chain.htm"',
    'href="trust-chain-demo.htm"',
    'href="templates/trust-chain-starter.zip"'
  ]) {
    assert.match(explainer, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
});

test("trust chain explainer page uses dedicated editorial scaffolding", () => {
  const explainer = read("trust-chain-explainer.htm");
  const styles = read("site.css");

  for (const fragment of [
    "article-shell",
    "article-header",
    "article-body",
    "article-table",
    "article-cta"
  ]) {
    assert.match(explainer, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }

  for (const fragment of [
    ".article-shell",
    ".article-header",
    ".article-body",
    ".article-table",
    ".article-cta"
  ]) {
    assert.match(styles, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
});

test("trust chain article assets keep author, company, and canonical source connected", () => {
  const explainer = read("trust-chain-explainer.htm");
  const article = read("docs/articles/2026-05-07-startup-domain-trust-infrastructure.md");

  for (const fragment of [
    "By Andrew Leung, founder of W&Patent",
    "Canonical source: https://hmc62843u.github.io/trust-chain-explainer.htm"
  ]) {
    const pattern = new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    assert.match(explainer, pattern);
    assert.match(article, pattern);
  }
});
