import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

test("robots exposes sitemap", () => {
  assert.equal(existsSync(new URL("../robots.txt", import.meta.url)), true);
  const robots = readFileSync(new URL("../robots.txt", import.meta.url), "utf8");
  assert.match(robots, /Sitemap: https:\/\/wpatent\.com\/sitemap\.xml/);
});

test("sitemap lists only the active live pages", () => {
  assert.equal(existsSync(new URL("../sitemap.xml", import.meta.url)), true);
  const sitemap = readFileSync(new URL("../sitemap.xml", import.meta.url), "utf8");
  for (const url of [
    "https://wpatent.com/",
    "https://wpatent.com/startup-patent-strategy.htm",
    "https://wpatent.com/services.htm",
    "https://wpatent.com/about.htm",
    "https://wpatent.com/virtual-marking.htm",
    "https://wpatent.com/provisional-vs-nda.htm",
    "https://wpatent.com/poc-and-provisional.htm",
    "https://wpatent.com/draw-first-write-second.htm"
  ]) {
    assert.match(sitemap, new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.doesNotMatch(sitemap, /https:\/\/wpatent\.com\/trust-chain\.htm/);
  assert.doesNotMatch(sitemap, /https:\/\/wpatent\.com\/patent-strategy-open-licensing\.htm/);
  assert.doesNotMatch(sitemap, /https:\/\/wpatent\.com\/andrew-leung-startup-patent-strategy\.htm/);
  assert.doesNotMatch(sitemap, /https:\/\/wpatent\.com\/provisional-and-poc-budget\.htm/);
});

test("main redirect still points to index.html", () => {
  const redirect = readFileSync(new URL("../main.html", import.meta.url), "utf8");
  assert.match(redirect, /url=index\.html/);
});
