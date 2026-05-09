import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const pages = [
  "index.html",
  "about.htm",
  "why_us.htm",
  "faq.htm",
  "career.htm",
  "startup-patent-strategy.htm",
  "trust-chain.htm",
  "trust-chain-demo.htm",
  "trust-chain-explainer.htm"
];

function read(page) {
  return readFileSync(new URL(`../${page}`, import.meta.url), "utf8");
}

for (const page of pages) {
  test(`${page} loads shared assets`, () => {
    const html = read(page);
    assert.match(html, /<link rel="stylesheet" href="site\.css">/);
    assert.match(html, /<script src="site\.js" defer><\/script>/);
  });
}

test("shared navigation exposes marketplace routes", () => {
  const html = read("about.htm");
  for (const href of [
    "index.html",
    "listings.htm",
    "platform.htm",
    "about.htm",
    "why_us.htm",
    "faq.htm",
    "career.htm"
  ]) {
    assert.match(html, new RegExp(`href="${href}"`));
  }
});
