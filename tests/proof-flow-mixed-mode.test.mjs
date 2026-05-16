import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

function read(relativePath) {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("mixed-mode scaffolding exposes a community workspace and guide", () => {
  assert.equal(
    existsSync(new URL("../data/proof-flow/community-workspace.json", import.meta.url)),
    true
  );
  assert.equal(
    existsSync(new URL("../docs/proof-flow/mixed-mode.md", import.meta.url)),
    true
  );

  const community = JSON.parse(read("data/proof-flow/community-workspace.json"));
  assert.deepEqual(Object.keys(community), [
    "version",
    "received_sync_ids",
    "shared_assets",
    "amplification_events"
  ]);
  assert.deepEqual(community.received_sync_ids, []);
  assert.deepEqual(community.shared_assets, []);
  assert.deepEqual(community.amplification_events, []);

  const guide = read("docs/proof-flow/mixed-mode.md");
  assert.match(guide, /private founder instance/i);
  assert.match(guide, /incubator community operating system/i);
  assert.match(guide, /selective sync/i);

  const readme = read("docs/proof-flow/README.md");
  assert.match(readme, /mixed mode/i);
  assert.match(readme, /community-workspace\.json/i);
});
