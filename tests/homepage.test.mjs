import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

// Positioning approved 2026-11-17 (43a30ff): lead with Startup Tarot, then founder guides and patent advisory.
test("homepage leads with Startup Tarot, then founder guides and Andrew's patent advisory", () => {
  assert.match(html, /<h1>Know what to try next with your startup\.<\/h1>/);
  assert.match(html, /href="https:\/\/wpatent\.com\/startup-tarot\/"/);
  assert.match(html, /href="startup-patent-strategy\.htm"/);
  assert.match(html, /href="services\.htm"/);
  assert.match(html, /Talk to Andrew Leung, a registered patent agent/i);
  assert.match(html, /mailto:wp@wpatent\.com/);
});

test("homepage keeps the key proof and schema signals", () => {
  assert.match(html, /Registered patent agent/i);
  assert.match(html, /OpenFor member/i);
  assert.match(html, /"@type":\s*"Organization"/);
  assert.match(html, /"@type":\s*"Person"/);
  assert.match(html, /"@type":\s*"WebSite"/);
});

test("homepage no longer leads with extra top-level concepts", () => {
  assert.doesNotMatch(html, /Commercialization framing/i);
  assert.doesNotMatch(html, /Trust Chain methodology/i);
  assert.doesNotMatch(html, /href="faq\.htm"/);
  assert.doesNotMatch(html, /href="patent-commercialization-for-founders\.htm"/);
});

test("homepage avoids em dashes in the active live surface", () => {
  assert.doesNotMatch(html, /—/);
});
