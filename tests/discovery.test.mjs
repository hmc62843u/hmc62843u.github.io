import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

test("robots exposes sitemap", () => {
  assert.equal(existsSync(new URL("../robots.txt", import.meta.url)), true);
  const robots = readFileSync(new URL("../robots.txt", import.meta.url), "utf8");
  assert.match(robots, /Sitemap: https:\/\/hmc62843u\.github\.io\/sitemap\.xml/);
});

test("sitemap lists every public page", () => {
  assert.equal(existsSync(new URL("../sitemap.xml", import.meta.url)), true);
  const sitemap = readFileSync(new URL("../sitemap.xml", import.meta.url), "utf8");
  for (const url of [
    "https://hmc62843u.github.io/",
    "https://hmc62843u.github.io/listings.htm",
    "https://hmc62843u.github.io/platform.htm",
    "https://hmc62843u.github.io/about.htm",
    "https://hmc62843u.github.io/why_us.htm",
    "https://hmc62843u.github.io/faq.htm",
    "https://hmc62843u.github.io/career.htm",
    "https://hmc62843u.github.io/listing-points2perks.htm",
    "https://hmc62843u.github.io/listing-tourist-aid.htm",
    "https://hmc62843u.github.io/listing-persona-album.htm",
    "https://hmc62843u.github.io/listing-sign-language-chat.htm",
    "https://hmc62843u.github.io/listing-dashing-robo.htm"
  ]) {
    assert.match(sitemap, new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("main redirect still points to index.html", () => {
  const redirect = readFileSync(new URL("../main.html", import.meta.url), "utf8");
  assert.match(redirect, /url=index\.html/);
});
