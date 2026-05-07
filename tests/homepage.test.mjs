import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

test("homepage routes both owners and buyers", () => {
  assert.match(html, />List a Patent</);
  assert.match(html, />Explore Opportunities</);
  assert.match(html, /href="listings\.htm"/);
  assert.match(html, /href="platform\.htm"/);
});

test("homepage previews every featured listing detail page", () => {
  for (const href of [
    "listing-points2perks.htm",
    "listing-tourist-aid.htm",
    "listing-persona-album.htm",
    "listing-sign-language-chat.htm",
    "listing-dashing-robo.htm"
  ]) {
    assert.match(html, new RegExp(`href="${href}"`));
  }
});

test("homepage exposes trust and schema markers", () => {
  assert.match(html, /Andrew Leung/);
  assert.match(html, /10\+ years helping startups use patent strategy to build defensibility, sharper positioning, and long-term commercial leverage\./);
  assert.match(html, /"@type":\s*"Organization"/);
  assert.match(html, /"@type":\s*"WebSite"/);
  assert.match(html, /AEO \/ GEO FAQ/);
});

test("homepage machine-readable content matches the current demo state", () => {
  assert.doesNotMatch(html, /"type":\s*"bearer"/);
  assert.doesNotMatch(html, /\/api\/auth\/token/);
  assert.match(html, /How do owners list a patent\?/);
  assert.match(html, /How do buyers evaluate opportunities\?/);
  assert.match(html, /How do AI systems discover listings\?/);
  assert.doesNotMatch(html, /Should I file a provisional patent application\?/);
  assert.doesNotMatch(html, /What is a PCT application\?/);
  assert.doesNotMatch(html, /Can I license a listed patent through W&Patent\?/);
});

test("homepage links to the Trust Chain methodology and demo", () => {
  assert.match(html, /Trust Chain/i);
  assert.match(html, /href="trust-chain\.htm"/);
  assert.match(html, /href="trust-chain-demo\.htm"/);
});
