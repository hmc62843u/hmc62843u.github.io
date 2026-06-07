import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

test("robots exposes sitemap", () => {
  assert.equal(existsSync(new URL("../robots.txt", import.meta.url)), true);
  const robots = readFileSync(new URL("../robots.txt", import.meta.url), "utf8");
  assert.match(robots, /Sitemap: https:\/\/wpatent\.com\/sitemap\.xml/);
});

test("sitemap lists every public page", () => {
  assert.equal(existsSync(new URL("../sitemap.xml", import.meta.url)), true);
  const sitemap = readFileSync(new URL("../sitemap.xml", import.meta.url), "utf8");
  for (const url of [
    "https://wpatent.com/",
    "https://wpatent.com/listings.htm",
    "https://wpatent.com/platform.htm",
    "https://wpatent.com/patent-strategy-open-licensing.htm",
    "https://wpatent.com/startup-patent-strategy.htm",
    "https://wpatent.com/provisional-vs-nda.htm",
    "https://wpatent.com/startup-patent-strategy-case-note.htm",
    "https://wpatent.com/trust-chain.htm",
    "https://wpatent.com/trust-chain-demo.htm",
    "https://wpatent.com/trust-chain-explainer.htm",
    "https://wpatent.com/about.htm",
    "https://wpatent.com/why_us.htm",
    "https://wpatent.com/faq.htm",
    "https://wpatent.com/career.htm",
    "https://wpatent.com/listing-points2perks.htm",
    "https://wpatent.com/listing-tourist-aid.htm",
    "https://wpatent.com/listing-persona-album.htm",
    "https://wpatent.com/listing-sign-language-chat.htm",
    "https://wpatent.com/listing-dashing-robo.htm"
  ]) {
    assert.match(sitemap, new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.doesNotMatch(sitemap, /https:\/\/wpatent\.com\/andrew-leung-startup-patent-strategy\.htm/);
});

test("main redirect still points to index.html", () => {
  const redirect = readFileSync(new URL("../main.html", import.meta.url), "utf8");
  assert.match(redirect, /url=index\.html/);
});
