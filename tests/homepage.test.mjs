import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

test("homepage surfaces founder-led advisory positioning", () => {
  assert.match(html, /Andrew Leung helps founders/i);
  assert.match(html, /founder-facing advisory surface/i);
  assert.match(html, /W&(?:amp;)?Patent is Andrew Leung/);
  assert.match(html, /href="services\.htm"/);
  assert.match(html, /href="startup-patent-strategy\.htm"/);
});

test("homepage previews all four service areas", () => {
  assert.match(html, /Startup patent strategy advisory/i);
  assert.match(html, /Commercialization framing/i);
  assert.match(html, /Founder articulation and clarity/i);
  assert.match(html, /Virtual marking support/i);
});

test("homepage exposes proof, trust, and schema markers", () => {
  assert.match(html, /OpenFor member/i);
  assert.match(html, /Registered patent agent/i);
  assert.match(html, /Trust Chain/i);
  assert.match(html, /not the HTTPS\/TLS trust chain/i);
  assert.match(html, /"@type":\s*"Organization"/);
  assert.match(html, /"@type":\s*"Person"/);
  assert.match(html, /"@type":\s*"WebSite"/);
});

test("homepage machine-readable content stays clean", () => {
  assert.doesNotMatch(html, /"type":\s*"bearer"/);
  assert.doesNotMatch(html, /\/api\/auth\/token/);
  assert.doesNotMatch(html, />List a Patent</);
  assert.doesNotMatch(html, />Explore Opportunities</);
});

test("homepage links to strategy, trust chain, and founder view", () => {
  assert.match(html, /href="trust-chain\.htm"/);
  assert.match(html, /href="startup-patent-strategy\.htm"/);
  assert.match(html, /href="services\.htm"/);
  assert.match(html, /href="patent-commercialization-for-founders\.htm"/);
  assert.match(html, /href="andrew-leung-startup-patent-strategy\.htm"/);
});
