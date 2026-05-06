import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const about = readFileSync(new URL("../about.htm", import.meta.url), "utf8");
const whyUs = readFileSync(new URL("../why_us.htm", import.meta.url), "utf8");
const faq = readFileSync(new URL("../faq.htm", import.meta.url), "utf8");
const career = readFileSync(new URL("../career.htm", import.meta.url), "utf8");

test("about page ties expertise to marketplace evaluation", () => {
  assert.match(about, /Andrew Leung/);
  assert.match(about, /marketplace/);
  assert.match(about, /commercialization/i);
  assert.match(about, /<link rel="canonical" href="https:\/\/hmc62843u\.github\.io\/about\.htm">/);
});

test("why us page compares W&Patent to generic alternatives", () => {
  assert.match(whyUs, /generic brokers/i);
  assert.match(whyUs, /listing boards/i);
  assert.match(whyUs, /advisory/i);
  assert.match(whyUs, /<link rel="canonical" href="https:\/\/hmc62843u\.github\.io\/why_us\.htm">/);
});

test("faq page covers listing and agent discovery topics", () => {
  assert.match(faq, /How does listing work\?/);
  assert.match(faq, /How do AI agents discover listings\?/);
  assert.match(faq, /"@type":\s*"FAQPage"/);
  assert.match(faq, /<link rel="canonical" href="https:\/\/hmc62843u\.github\.io\/faq\.htm">/);
});

test("career page reflects the hybrid marketplace mission", () => {
  assert.match(career, /marketplace/i);
  assert.match(career, /advisory/i);
  assert.match(career, /<link rel="canonical" href="https:\/\/hmc62843u\.github\.io\/career\.htm">/);
});
