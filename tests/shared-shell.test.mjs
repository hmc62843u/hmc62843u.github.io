import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const pages = [
  "index.html",
  "about.htm",
  "services.htm",
  "startup-patent-strategy.htm",
  "provisional-vs-nda.htm",
  "provisional-and-poc-budget.htm",
  "draw-first-write-second.htm"
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

test("shared navigation exposes the primary routes", () => {
  const html = read("about.htm");
  assert.match(html, /href="index\.html"/);
  assert.match(html, /href="startup-patent-strategy\.htm"/);
  assert.match(html, /href="services\.htm"/);
  assert.match(html, /href="about\.htm"/);
  assert.match(html, /href="mailto:wp@wpatent\.com"/);
});
