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
  assert.match(html, /"@type":\s*"Organization"/);
  assert.match(html, /"@type":\s*"WebSite"/);
  assert.match(html, /AEO \/ GEO FAQ/);
});
