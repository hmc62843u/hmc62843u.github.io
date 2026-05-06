import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const posterRef = new URL("../artifacts/linkedin-feature-map-poster.html", import.meta.url);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("poster artifact exists with approved structure", () => {
  assert.equal(existsSync(posterRef), true);
  const html = readFileSync(posterRef, "utf8");

  for (const fragment of [
    "How W&amp;Patent Is Built for Search + AI Discovery",
    "Static patent marketplace demo with strong SEO, AEO, and GEO foundations",
    "SEO",
    "AEO",
    "GEO",
    "AI Demo Layer",
    "Crawlable. Structured. AI-discoverable.",
    "width: 1080px",
    "height: 1350px",
    "poster-grid",
    "feature-card"
  ]) {
    assert.match(html, new RegExp(escapeRegExp(fragment), "i"));
  }
});

test("poster includes final branded copy and technical labels", () => {
  const html = readFileSync(posterRef, "utf8");

  for (const fragment of [
    "<code>robots.txt</code> and <code>sitemap.xml</code>",
    "Quote-friendly Q&amp;A patterns",
    "<code>speakable</code> markup",
    "Visible protocol copy",
    "Static JSON request/response examples",
    "<code>JSON-LD</code>: real",
    "<code>UCP</code>: real static metadata",
    "<code>WebMCP</code>: mock capability surface",
    "<code>ACP</code>: mock transaction states",
    "--bg: #f2f1ed",
    "--accent: #f54e00"
  ]) {
    assert.match(html, new RegExp(escapeRegExp(fragment), "i"));
  }
});
