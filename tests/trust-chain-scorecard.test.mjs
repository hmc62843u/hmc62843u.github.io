import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

function read(relativePath) {
  return readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("scorecard docs folder has a maintenance guide", () => {
  assert.equal(existsSync(new URL("../docs/scorecards/README.md", import.meta.url)), false);
  assert.equal(
    existsSync(new URL("../docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.md", import.meta.url)),
    false
  );
  assert.equal(
    existsSync(new URL("../docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.csv", import.meta.url)),
    false
  );
  assert.equal(
    existsSync(new URL("../docs/scorecards/2026-05-08-wpatent-discovery-roadmap.md", import.meta.url)),
    false
  );
});

test("root README points to scorecard assets", () => {
  const rootReadme = read("README.md");
  assert.doesNotMatch(rootReadme, /docs\/scorecards\//);
  assert.doesNotMatch(rootReadme, /trust-chain-scorecard/i);
  assert.doesNotMatch(rootReadme, /discovery-roadmap/i);
  assert.doesNotMatch(rootReadme, /docs\/comparison-controls\//);
  assert.doesNotMatch(rootReadme, /openfor/i);
});

test("site repo no longer ships provider-key examples for prompt evidence", () => {
  assert.equal(existsSync(new URL("../.env.example", import.meta.url)), false);
});

test("comparison control docs are no longer site-owned", () => {
  assert.equal(existsSync(new URL("../docs/comparison-controls/README.md", import.meta.url)), false);
  assert.equal(
    existsSync(new URL("../docs/comparison-controls/2026-05-19-openfor-scorecard.md", import.meta.url)),
    false
  );
  assert.equal(
    existsSync(
      new URL("../docs/comparison-controls/2026-05-19-openfor-identity-overview.md", import.meta.url)
    ),
    false
  );
  assert.equal(
    existsSync(
      new URL(
        "../docs/comparison-controls/2026-05-19-openfor-discovery-grounding-overview.md",
        import.meta.url
      )
    ),
    false
  );
  assert.equal(
    existsSync(
      new URL("../docs/comparison-controls/2026-05-19-openfor-improvement-snapshot.md", import.meta.url)
    ),
    false
  );
});

test("scorecard summary defines the four scoring categories and prompt workflow", () => {
  assert.equal(
    existsSync(new URL("../docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.md", import.meta.url)),
    false
  );
});

test("scorecard summary includes the AEO/GEO comparison block", () => {
  assert.equal(
    existsSync(new URL("../docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.md", import.meta.url)),
    false
  );
});

test("discovery roadmap turns current evidence into prioritized actions", () => {
  assert.equal(
    existsSync(new URL("../docs/scorecards/2026-05-08-wpatent-discovery-roadmap.md", import.meta.url)),
    false
  );
});

test("scorecard worksheet seeds the evidence model", () => {
  assert.equal(
    existsSync(new URL("../docs/scorecards/2026-05-07-wpatent-trust-chain-scorecard.csv", import.meta.url)),
    false
  );
});
