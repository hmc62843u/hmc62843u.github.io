import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

test("trust chain landing and demo pages exist with canonical links", () => {
  assert.equal(existsSync(new URL("../trust-chain.htm", import.meta.url)), true);
  assert.equal(existsSync(new URL("../trust-chain-demo.htm", import.meta.url)), true);

  const landing = read("trust-chain.htm");
  const demo = read("trust-chain-demo.htm");

  assert.match(landing, /<title>Trust Chain Template \| W&amp;Patent<\/title>/);
  assert.match(landing, /<link rel="canonical" href="https:\/\/hmc62843u\.github\.io\/trust-chain\.htm">/);
  assert.match(landing, /href="trust-chain-demo\.htm"/);

  assert.match(demo, /<title>Trust Chain Demo \| W&amp;Patent<\/title>/);
  assert.match(demo, /<link rel="canonical" href="https:\/\/hmc62843u\.github\.io\/trust-chain-demo\.htm">/);
  assert.match(demo, /href="trust-chain\.htm"/);
});
