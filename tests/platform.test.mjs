import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

test("platform page includes plans, demo disclosure, and dashboard preview", () => {
  assert.equal(existsSync(new URL("../platform.htm", import.meta.url)), true);
  const platform = readFileSync(new URL("../platform.htm", import.meta.url), "utf8");
  assert.match(platform, /Basic/);
  assert.match(platform, /Pro/);
  assert.match(platform, /Enterprise/);
  assert.match(platform, /mocked workflow/i);
  assert.match(platform, /Your portfolio command center/);
  assert.match(platform, /data-signup-form/);
});

test("ucp manifest stays honest about static hosting", () => {
  const ucp = JSON.parse(readFileSync(new URL("../.well-known/ucp.json", import.meta.url), "utf8"));
  assert.equal(ucp.auth.type, "none");
  assert.match(ucp.auth.note, /Static GitHub Pages demo/i);
  assert.equal(Array.isArray(ucp.capabilities), true);
});
