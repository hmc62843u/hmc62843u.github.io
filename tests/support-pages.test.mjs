import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const about = readFileSync(new URL("../about.htm", import.meta.url), "utf8");
const whyUs = readFileSync(new URL("../why_us.htm", import.meta.url), "utf8");
const faq = readFileSync(new URL("../faq.htm", import.meta.url), "utf8");
const career = readFileSync(new URL("../career.htm", import.meta.url), "utf8");

test("about page ties expertise to marketplace evaluation", () => {
  assert.match(about, /Andrew Leung/);
  assert.match(about, /founded W&(?:amp;)?Patent/i);
  assert.match(about, /marketplace/);
  assert.match(about, /commercialization/i);
  assert.match(about, /startup defensibility/i);
  assert.match(about, /sharper market positioning/i);
  assert.match(about, /Trust Chain/i);
  assert.match(about, /not the HTTPS\/TLS certificate chain/i);
  assert.match(about, /"@type":\s*"Organization"/);
  assert.match(about, /"@type":\s*"Person"/);
  assert.match(about, /<link rel="canonical" href="https:\/\/wpatent\.com\/about\.htm">/);
});

test("why us page compares W&Patent to generic alternatives", () => {
  assert.match(whyUs, /generic brokers/i);
  assert.match(whyUs, /listing boards/i);
  assert.match(whyUs, /advisory/i);
  assert.match(whyUs, /use IP strategically/i);
  assert.match(whyUs, /defensibility and commercialization/i);
  assert.match(whyUs, /<link rel="canonical" href="https:\/\/wpatent\.com\/why_us\.htm">/);
});

test("faq page covers listing and agent discovery topics", () => {
  assert.match(faq, /How does listing work\?/);
  assert.match(faq, /How do AI agents discover listings\?/);
  assert.match(faq, /"@type":\s*"FAQPage"/);
  assert.match(faq, /<link rel="canonical" href="https:\/\/wpatent\.com\/faq\.htm">/);
});

test("career page reflects the hybrid marketplace mission", () => {
  assert.match(career, /marketplace/i);
  assert.match(career, /advisory/i);
  assert.match(career, /<link rel="canonical" href="https:\/\/wpatent\.com\/career\.htm">/);
});
