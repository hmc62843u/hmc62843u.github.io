import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

test("retired trust chain pages exist with meta refresh redirects", () => {
  assert.equal(existsSync(new URL("../trust-chain.htm", import.meta.url)), true);
  assert.equal(existsSync(new URL("../trust-chain-demo.htm", import.meta.url)), true);
  assert.equal(existsSync(new URL("../trust-chain-explainer.htm", import.meta.url)), true);

  const landing = read("trust-chain.htm");
  const demo = read("trust-chain-demo.htm");
  const explainer = read("trust-chain-explainer.htm");

  assert.match(landing, /http-equiv="refresh" content="0; url=https:\/\/wpatent\.com\/startup-patent-strategy\.htm"/);
  assert.match(demo, /http-equiv="refresh" content="0; url=https:\/\/wpatent\.com\/startup-patent-strategy\.htm"/);
  assert.match(explainer, /http-equiv="refresh" content="0; url=https:\/\/wpatent\.com\/about\.htm"/);

  assert.match(landing, /<link rel="canonical" href="https:\/\/wpatent\.com\/startup-patent-strategy\.htm">/);
  assert.match(explainer, /<link rel="canonical" href="https:\/\/wpatent\.com\/about\.htm">/);
});

test("starter-kit files and repo README document the trust chain assets", () => {
  assert.equal(existsSync(new URL("../templates/trust-chain-starter/README.md", import.meta.url)), true);
  assert.equal(existsSync(new URL("../templates/trust-chain-starter/config.js", import.meta.url)), true);
  assert.equal(existsSync(new URL("../templates/trust-chain-starter/index.html", import.meta.url)), true);
  assert.equal(existsSync(new URL("../templates/trust-chain-starter.zip", import.meta.url)), true);

  const starterReadme = read("templates/trust-chain-starter/README.md");
  const starterConfig = read("templates/trust-chain-starter/config.js");
  const starterHtml = read("templates/trust-chain-starter/index.html");
  const repoReadme = read("README.md");

  assert.match(starterReadme, /Trust Chain Starter Kit/i);
  assert.match(starterReadme, /config\.js/);
  assert.match(starterReadme, /zip/i);
  assert.match(starterConfig, /window\.TRUST_CHAIN_CONFIG/);
  assert.match(starterHtml, /script src="config\.js"/);
  assert.match(starterHtml, /data-config-company/);
  assert.match(repoReadme, /Trust Chain/i);
  assert.match(repoReadme, /trust-chain\.htm/);
  assert.match(repoReadme, /templates\/trust-chain-starter\//);
  assert.match(repoReadme, /templates\/trust-chain-starter\.zip/);
});
