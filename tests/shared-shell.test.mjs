import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const pages = [
  "index.html",
  "about.htm",
  "andrew-leung-startup-patent-strategy.htm",
  "why_us.htm",
  "faq.htm",
  "career.htm",
  "patent-strategy-open-licensing.htm",
  "patent-commercialization-for-founders.htm",
  "startup-patent-strategy.htm",
  "startup-patent-strategy-case-note.htm",
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

test("shared navigation exposes advisory routes", () => {
  const html = read("about.htm");
  for (const href of [
    "index.html",
    "startup-patent-strategy.htm",
    "services.htm",
    "about.htm",
    "faq.htm"
  ]) {
    assert.match(html, new RegExp(`href="${href}"`));
  }
});
