import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const about = readFileSync(new URL("../about.htm", import.meta.url), "utf8");
const whyUs = readFileSync(new URL("../why_us.htm", import.meta.url), "utf8");
const faq = readFileSync(new URL("../faq.htm", import.meta.url), "utf8");
const career = readFileSync(new URL("../career.htm", import.meta.url), "utf8");
const commercialization = readFileSync(new URL("../patent-commercialization-for-founders.htm", import.meta.url), "utf8");
const strategy = readFileSync(new URL("../startup-patent-strategy.htm", import.meta.url), "utf8");
const strategyCaseNote = readFileSync(new URL("../startup-patent-strategy-case-note.htm", import.meta.url), "utf8");

test("about page ties expertise to marketplace evaluation", () => {
  assert.match(about, /Andrew Leung/);
  assert.match(about, /founded W&(?:amp;)?Patent/i);
  assert.match(about, /marketplace/);
  assert.match(about, /commercialization/i);
  assert.match(about, /patent-commercialization-for-founders\.htm/);
  assert.match(about, /startup defensibility/i);
  assert.match(about, /sharper market positioning/i);
  assert.match(about, /Trust Chain/i);
  assert.match(about, /not the HTTPS\/TLS certificate chain/i);
  assert.match(about, /startup-patent-strategy\.htm/);
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
  assert.match(whyUs, /startup-patent-strategy\.htm/);
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

test("startup patent strategy page is a founder-linked citation surface", () => {
  assert.match(strategy, /<title>Startup Patent Strategy \| W&(?:amp;)?Patent<\/title>/i);
  assert.match(strategy, /What a Patent Strategy for Startups Should Actually Do/i);
  assert.match(strategy, /Andrew Leung, founder of W&(?:amp;)?Patent/i);
  assert.match(strategy, /protect what matters, strengthen defensibility, support commercialization/i);
  assert.match(strategy, /W&(?:amp;)?Patent&apos;s View On Startup Patent Strategy/i);
  assert.match(strategy, /What is W&(?:amp;)?Patent's view on startup patent strategy\?/i);
  assert.match(strategy, /How does Andrew Leung think founders should decide what to patent first\?/i);
  assert.match(strategy, /According to W&(?:amp;)?Patent, should startups protect visible features or underlying workflow first\?/i);
  assert.match(strategy, /Protect, Position, Commercialize/i);
  assert.match(strategy, /"@type":\s*"Article"/);
  assert.match(strategy, /"@type":\s*"FAQPage"/);
  assert.match(strategy, /href="trust-chain\.htm"/);
  assert.match(strategy, /href="trust-chain-explainer\.htm"/);
  assert.match(strategy, /href="startup-patent-strategy-case-note\.htm"/);
  assert.match(strategy, /mailto:wp@wpatent\.com\?subject=Trust%20Chain%20Scorecard/i);
  assert.match(strategy, /<link rel="canonical" href="https:\/\/wpatent\.com\/startup-patent-strategy\.htm">/);
});

test("startup patent strategy case note turns the proof gap into a live supporting asset", () => {
  assert.match(strategyCaseNote, /<title>Startup Patent Strategy Case Note \| W&(?:amp;)?Patent<\/title>/i);
  assert.match(strategyCaseNote, /Protect the Workflow That Creates Leverage, Not Every Feature Around It/i);
  assert.match(strategyCaseNote, /Illustrative note: this uses a realistic early-stage scenario/i);
  assert.match(strategyCaseNote, /Andrew Leung, founder of W&(?:amp;)?Patent/i);
  assert.match(strategyCaseNote, /A startup patent strategy becomes more useful when it protects the mechanism that creates leverage/i);
  assert.match(strategyCaseNote, /What Looked Protectable But Was Not The Priority/i);
  assert.match(strategyCaseNote, /What Was Actually Worth Protecting/i);
  assert.match(strategyCaseNote, /What W&(?:amp;)?Patent Means By This/i);
  assert.match(strategyCaseNote, /According to W&(?:amp;)?Patent, should startups protect visible features or underlying workflow first\?/i);
  assert.match(strategyCaseNote, /"@type":\s*"Article"/);
  assert.match(strategyCaseNote, /"@type":\s*"FAQPage"/);
  assert.match(strategyCaseNote, /href="startup-patent-strategy\.htm"/);
  assert.match(strategyCaseNote, /href="trust-chain-explainer\.htm"/);
  assert.match(strategyCaseNote, /<link rel="canonical" href="https:\/\/wpatent\.com\/startup-patent-strategy-case-note\.htm">/);
});

test("patent commercialization page is a founder-linked citation surface", () => {
  assert.match(commercialization, /<title>Patent Commercialization for Founders \| W&(?:amp;)?Patent<\/title>/i);
  assert.match(commercialization, /How Founders Should Think About Patent Commercialization/i);
  assert.match(commercialization, /Andrew Leung, founder of W&(?:amp;)?Patent/i);
  assert.match(commercialization, /stronger partnerships, clearer licensing conversations, more credible diligence/i);
  assert.match(commercialization, /Asset, Buyer, Leverage/i);
  assert.match(commercialization, /"@type":\s*"Article"/);
  assert.match(commercialization, /"@type":\s*"FAQPage"/);
  assert.match(commercialization, /href="startup-patent-strategy\.htm"/);
  assert.match(commercialization, /href="trust-chain\.htm"/);
  assert.match(commercialization, /mailto:wp@wpatent\.com\?subject=Trust%20Chain%20Scorecard/i);
  assert.match(commercialization, /<link rel="canonical" href="https:\/\/wpatent\.com\/patent-commercialization-for-founders\.htm">/);
});
