import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

test("platform page is a retired redirect to services", () => {
  assert.equal(existsSync(new URL("../platform.htm", import.meta.url)), true);
  const html = readFileSync(new URL("../platform.htm", import.meta.url), "utf8");
  assert.match(html, /http-equiv="refresh"/);
  assert.match(html, /url=https:\/\/wpatent\.com\/services\.htm"/);
  assert.match(html, /<link rel="canonical" href="https:\/\/wpatent\.com\/services\.htm">/);
});

test("ucp manifest still exists with correct structure", () => {
  const ucp = JSON.parse(readFileSync(new URL("../.well-known/ucp.json", import.meta.url), "utf8"));
  assert.equal(ucp.auth.type, "none");
  assert.match(ucp.auth.note, /Static GitHub Pages demo/i);
  assert.equal(ucp.endpoints.platform, "https://wpatent.com/platform.htm");
});
