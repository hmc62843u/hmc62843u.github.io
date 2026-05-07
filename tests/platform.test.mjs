import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const platform = readFileSync(new URL("../platform.htm", import.meta.url), "utf8");

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("platform page includes plans, static demo disclosure, and protocol shell", () => {
  assert.equal(existsSync(new URL("../platform.htm", import.meta.url)), true);
  for (const fragment of [
    "Basic",
    "Pro",
    "Enterprise",
    "Mock",
    "Static demo",
    "No live transaction",
    "Seller submits a listing intake",
    "Buyer opens structured listing facts",
    "Buyer submits a mock bid",
    "data-protocol-demo",
    "data-protocol-steps",
    "data-protocol-request",
    "data-protocol-response",
    "data-transaction-state",
    "data-protocol-scenario=\"happy\"",
    "data-protocol-scenario=\"missing-field\"",
    "data-protocol-scenario=\"low-bid\"",
    "data-protocol-scenario=\"manual-review\"",
    ".well-known/ucp.json"
  ]) {
    assert.match(platform, new RegExp(escapeRegExp(fragment), "i"));
  }
});

test("platform metadata and static payload evidence reflect protocol demo intent", () => {
  for (const fragment of [
    "<title>Platform Plans &amp; Protocol Demo | W&amp;Patent Marketplace</title>",
    'meta property="og:title" content="Platform Plans & Protocol Demo | W&Patent Marketplace"',
    "mock WebMCP capability surface",
    "mock ACP-style transaction path",
    '"capability": "listPatent"',
    '"status": "accepted"',
    '"listingDraftId": "draft-points2perks"'
  ]) {
    assert.match(platform, new RegExp(escapeRegExp(fragment), "i"));
  }
});

test("ucp manifest aligns to the platform demo capabilities", () => {
  const ucp = JSON.parse(readFileSync(new URL("../.well-known/ucp.json", import.meta.url), "utf8"));
  assert.equal(ucp.auth.type, "none");
  assert.match(ucp.auth.note, /Static GitHub Pages demo/i);
  assert.deepEqual(
    ucp.capabilities.map((capability) => capability.name),
    [
      "listPatent",
      "previewValuation",
      "discoverListings",
      "openListingFacts",
      "submitMockBid",
      "advanceMockTransaction"
    ]
  );
  assert.equal(ucp.endpoints.platform, "https://wpatent.com/platform.htm");
});

test("site script exposes protocol scenarios, mock states, and tool helpers", () => {
  const script = readFileSync(new URL("../site.js", import.meta.url), "utf8");
  for (const fragment of [
    "const protocolScenarios = {",
    "data-protocol-scenario",
    "previewValuation(payload)",
    "discoverListings(query)",
    "openListingFacts(listingId)",
    "submitMockBid(payload)",
    "advanceMockTransaction(transactionId, nextState)",
    "missing-field",
    "low-bid",
    "manual-review",
    "mock-approved",
    "mock-settled"
  ]) {
    assert.match(script, new RegExp(escapeRegExp(fragment)));
  }
});
