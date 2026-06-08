import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

for (const page of [
  "trust-chain.htm",
  "trust-chain-demo.htm",
  "trust-chain-explainer.htm"
]) {
  test(`${page} remains as a retired helper URL`, () => {
    assert.equal(existsSync(new URL(`../${page}`, import.meta.url)), true);
    const html = read(page);
    assert.match(html, /<meta name="robots" content="noindex, follow">/i);
    assert.match(html, /http-equiv="refresh" content="0; url=https:\/\/wpatent\.com\/startup-patent-strategy\.htm"/i);
    assert.match(html, /<link rel="canonical" href="https:\/\/wpatent\.com\/startup-patent-strategy\.htm">/i);
    assert.match(html, /href="startup-patent-strategy\.htm"/);
    assert.match(html, /href="about\.htm"/);
  });
}
