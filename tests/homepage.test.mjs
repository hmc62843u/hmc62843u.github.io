import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

test("homepage centers Andrew-led advisory and the two primary paths", () => {
  assert.match(html, /Andrew Leung translates patent strategy into founder language/i);
  assert.match(html, /W&(?:amp;)?Patent is Andrew Leung(?:&apos;|')s advisory surface/i);
  assert.match(html, /href="startup-patent-strategy\.htm"/);
  assert.match(html, /href="services\.htm"/);
  assert.match(html, /href="virtual-marking\.htm"/);
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
