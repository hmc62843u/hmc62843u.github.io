import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

test("homepage centers Andrew's founder-language strategy framing", () => {
  assert.match(html, /Andrew Leung articulates patent strategy in founder language/i);
  assert.match(html, /rewrites the usual patent script for founders/i);
  assert.match(html, /Most founders hear a patent script that sounds tidy, serious, and incomplete/i);
  assert.match(html, /href="startup-patent-strategy\.htm"/);
  assert.match(html, /href="services\.htm"/);
  assert.match(html, /href="about\.htm"/);
});

test("homepage keeps the key founder and schema signals", () => {
  assert.match(html, /Registered patent agent/i);
  assert.match(html, /OpenFor member/i);
  assert.match(html, /"@type":\s*"Organization"/);
  assert.match(html, /"@type":\s*"Person"/);
  assert.match(html, /"@type":\s*"WebSite"/);
});

test("homepage avoids the older extra top-level concepts", () => {
  assert.doesNotMatch(html, /Trust Chain/i);
  assert.doesNotMatch(html, /Commercialization/i);
  assert.doesNotMatch(html, /href="faq\.htm"/);
});
