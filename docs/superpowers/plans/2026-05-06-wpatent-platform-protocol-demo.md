# W&Patent Platform Protocol Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a GitHub Pages-compatible interactive protocol demo to `platform.htm` that shows seller intake, AI valuation preview, buyer discovery, and mock ACP-style transaction states without implying a live backend.

**Architecture:** Keep `platform.htm` readable as static HTML first, then progressively enhance it with a browser-side state machine in `site.js`. Align the page copy, `.well-known/ucp.json`, and the mock tool surface so the site tells one consistent SEO/AEO/GEO story about a static, browser-simulated demo.

**Tech Stack:** Static HTML, shared CSS, vanilla JavaScript, JSON, Node.js built-in test runner (`node:test`)

---

## File Structure Map

- `platform.htm`
  Expand the existing platform page with a protocol intro, scenario buttons, a step-by-step walkthrough shell, payload panels, and a capability evidence block while keeping the pricing cards, signup modal, and dashboard preview.
- `site.js`
  Extend the shared enhancement script with a small protocol-demo controller, local fixture data, scenario switching, and aligned `window.ucpTools` methods.
- `site.css`
  Style the protocol demo grid, stepper, payload panels, transaction chips, scenario buttons, and mobile layout without disturbing existing listing and modal styles.
- `.well-known/ucp.json`
  Rename the capability set so it matches the interactive demo and keep the auth note explicit that this is a static GitHub Pages mock.
- `tests/platform.test.mjs`
  Verify the platform page contract, static-demo disclosures, scenario labels, mock transaction states, manifest capability names, and the shared script’s protocol surface.

### Task 1: Add the truthful protocol shell and aligned manifest

**Files:**
- Modify: `platform.htm`
- Modify: `site.css`
- Modify: `.well-known/ucp.json`
- Modify: `tests/platform.test.mjs`

- [ ] **Step 1: Write the failing platform-shell test**

Replace `tests/platform.test.mjs` with this version so the page contract is explicit before any markup changes:

```js
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
  assert.equal(ucp.endpoints.platform, "https://hmc62843u.github.io/platform.htm");
});
```

- [ ] **Step 2: Run the platform-shell test and confirm it fails**

Run: `node --test tests/platform.test.mjs`

Expected: FAIL because `platform.htm` does not yet include the protocol shell, scenario buttons, or the exact `previewValuation` / `discoverListings` / `advanceMockTransaction` capability names.

- [ ] **Step 3: Add the protocol shell, conservative disclosures, and manifest alignment**

Update the head copy in `platform.htm` so the page advertises the browser-simulated protocol story:

```html
  <meta
    name="description"
    content="Explore W&Patent plans and a browser-simulated patent marketplace protocol demo with mock WebMCP and ACP-style payloads."
  >
  <meta property="og:description" content="Explore Basic, Pro, and Enterprise plans plus a static protocol demo for listing, discovery, and mock transactions.">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "W&Patent Marketplace Platform",
    "url": "https://hmc62843u.github.io/platform.htm",
    "description": "Browser-simulated demo of a patent marketplace platform for listing intake, buyer discovery, and mock transaction states."
  }
  </script>
```

Replace the trailing single-card metadata section in `platform.htm` with this full protocol shell:

```html
    <section class="section protocol-demo" data-protocol-demo>
      <article class="card protocol-intro">
        <p class="kicker">Mock protocol flow</p>
        <h2>Inspect a static listing, discovery, and mock transaction journey.</h2>
        <p>This browser-simulated walkthrough shows how a patent owner could stage a listing, receive an AI valuation preview, appear in buyer discovery, and move through explicit mock transaction states without any live backend.</p>
        <div class="protocol-badges">
          <span class="status">Mock</span>
          <span class="status status-neutral">Static demo</span>
          <span class="status status-warn">No live transaction</span>
        </div>
        <div class="actions protocol-scenarios">
          <button class="btn btn-solid is-active" type="button" data-protocol-scenario="happy">Happy path</button>
          <button class="btn" type="button" data-protocol-scenario="missing-field">Missing seller field</button>
          <button class="btn" type="button" data-protocol-scenario="low-bid">Low bid review</button>
          <button class="btn" type="button" data-protocol-scenario="manual-review">Manual review pause</button>
        </div>
      </article>
      <div class="protocol-layout">
        <aside class="card protocol-stepper" data-protocol-steps>
          <button class="protocol-step is-active" type="button" data-protocol-step="intake">1. Seller submits a listing intake</button>
          <button class="protocol-step" type="button" data-protocol-step="valuation">2. AI valuation preview returns a range</button>
          <button class="protocol-step" type="button" data-protocol-step="discovery">3. Buyer discovery view updates</button>
          <button class="protocol-step" type="button" data-protocol-step="facts">4. Buyer opens structured listing facts</button>
          <button class="protocol-step" type="button" data-protocol-step="bid">5. Buyer submits a mock bid</button>
          <button class="protocol-step" type="button" data-protocol-step="transaction">6. Mock transaction reaches settlement preview</button>
        </aside>
        <div class="grid">
          <article class="card protocol-stage">
            <p class="mono" data-protocol-stage-label>Step 1 of 6 · Happy path</p>
            <h3 data-protocol-stage-title>Seller submits a listing intake</h3>
            <p data-protocol-stage-copy>A patent owner stages the asset with filing status, commercialization goal, use-case tags, and ask guidance.</p>
            <p class="mono" data-protocol-stage-note>Mock tool: listPatent</p>
            <div class="actions">
              <button class="btn btn-solid" type="button" data-protocol-next>Advance demo</button>
              <button class="btn" type="button" data-protocol-reset>Reset</button>
            </div>
          </article>
          <article class="card protocol-transaction">
            <p class="kicker">Mock transaction state</p>
            <p class="mono" data-transaction-state>draft</p>
            <ul class="protocol-state-list">
              <li>draft</li>
              <li>reviewed</li>
              <li>mock-approved</li>
              <li>mock-settled</li>
            </ul>
          </article>
          <article class="card protocol-payload">
            <div class="grid cols-2">
              <div>
                <p class="kicker">Mock request</p>
                <pre class="protocol-code" data-protocol-request>{}</pre>
              </div>
              <div>
                <p class="kicker">Mock response</p>
                <pre class="protocol-code" data-protocol-response>{}</pre>
              </div>
            </div>
          </article>
          <article class="card protocol-evidence">
            <p class="kicker">Capability evidence</p>
            <h3>How this demo maps to the manifest</h3>
            <p>The machine-readable top-level descriptor lives at <code>.well-known/ucp.json</code> and summarizes the same static demo capabilities shown here.</p>
            <ul>
              <li><code>listPatent</code> stages a seller intake.</li>
              <li><code>previewValuation</code> returns a mock valuation band.</li>
              <li><code>discoverListings</code> shows how the staged asset becomes discoverable.</li>
              <li><code>openListingFacts</code> reveals structured listing context for a buyer.</li>
              <li><code>submitMockBid</code> creates a browser-simulated offer state.</li>
              <li><code>advanceMockTransaction</code> moves the demo through mock ACP-style status changes.</li>
            </ul>
          </article>
        </div>
      </div>
    </section>
```

Append these styles to `site.css` so the new shell is legible on desktop and mobile:

```css
.protocol-demo {
  padding-top: 0;
}

.protocol-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
}

.status-neutral {
  color: var(--text);
  background: var(--surface-strong);
}

.status-warn {
  color: #7a3410;
  background: #fff1e8;
}

.protocol-layout {
  display: grid;
  gap: 18px;
  grid-template-columns: minmax(230px, 0.72fr) minmax(0, 1.28fr);
  align-items: start;
}

.protocol-stepper {
  display: grid;
  gap: 10px;
  align-content: start;
}

.protocol-step {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--bg);
  color: var(--text);
  padding: 12px 14px;
  text-align: left;
  cursor: pointer;
}

.protocol-step.is-active,
.protocol-scenarios .btn.is-active {
  background: var(--text);
  border-color: var(--text);
  color: var(--bg);
}

.protocol-code {
  min-height: 220px;
  margin: 0;
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: #171712;
  color: #f7f6f2;
  overflow: auto;
  white-space: pre-wrap;
}

.protocol-state-list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0;
  margin: 14px 0 0;
}

.protocol-state-list li {
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 5px 10px;
  background: var(--bg);
}

@media (max-width: 900px) {
  .protocol-layout {
    grid-template-columns: 1fr;
  }
}
```

Replace `.well-known/ucp.json` with this aligned capability set:

```json
{
  "version": "1.0",
  "capabilities": [
    {
      "name": "listPatent",
      "description": "Preview a browser-simulated seller intake payload for a patent listing."
    },
    {
      "name": "previewValuation",
      "description": "Return a mock AI valuation preview for the staged patent listing."
    },
    {
      "name": "discoverListings",
      "description": "Show how a buyer-facing discovery result would appear in the static marketplace demo."
    },
    {
      "name": "openListingFacts",
      "description": "Reveal structured facts for a featured listing in the platform demo."
    },
    {
      "name": "submitMockBid",
      "description": "Advance the simulated buyer flow with a mock bid request."
    },
    {
      "name": "advanceMockTransaction",
      "description": "Move the demo through mock ACP-style states such as mock-approved and mock-settled."
    }
  ],
  "auth": {
    "type": "none",
    "note": "Static GitHub Pages demo. No live token endpoint or delegated payment API is enabled."
  },
  "pricing": {
    "model": "tiered",
    "currency": "USD"
  },
  "endpoints": {
    "platform": "https://hmc62843u.github.io/platform.htm",
    "listings": "https://hmc62843u.github.io/listings.htm"
  }
}
```

- [ ] **Step 4: Run the platform-shell test again**

Run: `node --test tests/platform.test.mjs`

Expected: PASS with the new protocol shell content present in `platform.htm` and the capability list aligned in `.well-known/ucp.json`.

- [ ] **Step 5: Commit the shell and manifest contract**

```bash
git add platform.htm site.css .well-known/ucp.json tests/platform.test.mjs
git commit -m "feat: add platform protocol demo shell"
```

### Task 2: Wire the interactive state machine and verify the full site

**Files:**
- Modify: `site.js`
- Modify: `tests/platform.test.mjs`

- [ ] **Step 1: Extend the platform test to require protocol interactivity**

Add this test to the end of `tests/platform.test.mjs` so the shared script contract is locked before editing `site.js`:

```js
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
```

- [ ] **Step 2: Run the interactivity test and confirm it fails**

Run: `node --test tests/platform.test.mjs`

Expected: FAIL because `site.js` still exposes only `searchPatents`, `bidPatent`, and `listPatent`, with no protocol scenario controller or mock transaction-state labels.

- [ ] **Step 3: Extend `site.js` with fixtures, scenario switching, and aligned tool methods**

Insert this protocol-demo block after the existing listing-filter setup in `site.js`, keeping the modal and filtering logic intact:

```js
  const protocolRoot = document.querySelector("[data-protocol-demo]");
  const protocolStepButtons = Array.from(document.querySelectorAll("[data-protocol-step]"));
  const protocolScenarioButtons = Array.from(document.querySelectorAll("[data-protocol-scenario]"));
  const protocolStageLabel = document.querySelector("[data-protocol-stage-label]");
  const protocolStageTitle = document.querySelector("[data-protocol-stage-title]");
  const protocolStageCopy = document.querySelector("[data-protocol-stage-copy]");
  const protocolStageNote = document.querySelector("[data-protocol-stage-note]");
  const protocolRequest = document.querySelector("[data-protocol-request]");
  const protocolResponse = document.querySelector("[data-protocol-response]");
  const protocolTransaction = document.querySelector("[data-transaction-state]");
  const protocolNext = document.querySelector("[data-protocol-next]");
  const protocolReset = document.querySelector("[data-protocol-reset]");

  const protocolScenarios = {
    happy: {
      label: "Happy path",
      steps: [
        {
          title: "Seller submits a listing intake",
          copy: "A patent owner provides filing status, commercialization intent, use-case tags, and ask guidance to stage the listing.",
          note: "Mock tool: listPatent",
          request: {
            capability: "listPatent",
            ownerEmail: "owner@example.com",
            listingTitle: "Points2Perks",
            filingStatus: "utility application",
            commercializationGoal: "sale or licensing",
            askGuidanceUsd: 180000
          },
          response: {
            status: "accepted",
            listingDraftId: "draft-points2perks",
            next: "previewValuation"
          },
          transactionState: "draft"
        },
        {
          title: "AI valuation preview returns a range",
          copy: "The staged listing is scored for demand signals, comparable categories, and buyer-readiness cues.",
          note: "Mock tool: previewValuation",
          request: {
            capability: "previewValuation",
            listingDraftId: "draft-points2perks",
            valuationInputs: ["loyalty", "mobile engagement", "merchant offers"]
          },
          response: {
            status: "reviewed",
            valuationBandUsd: [150000, 220000],
            topSignals: ["retail loyalty", "travel rewards", "promotion analytics"]
          },
          transactionState: "reviewed"
        },
        {
          title: "Buyer discovery view updates",
          copy: "The listing becomes discoverable through a buyer-facing marketplace result with short commercial context and status tags.",
          note: "Mock tool: discoverListings",
          request: {
            capability: "discoverListings",
            query: "loyalty rewards patent"
          },
          response: {
            resultCount: 1,
            topResult: {
              slug: "points2perks",
              status: "For Sale / Licensing",
              commercialTheme: "Loyalty points and merchant perks"
            }
          },
          transactionState: "reviewed"
        },
        {
          title: "Buyer opens structured listing facts",
          copy: "The buyer inspects filing context, buyer fit, and commercialization notes before taking any action.",
          note: "Mock tool: openListingFacts",
          request: {
            capability: "openListingFacts",
            listingSlug: "points2perks"
          },
          response: {
            filingReference: "Points2Perks featured listing",
            buyerFit: ["travel networks", "credit-card rewards", "merchant marketplaces"],
            readiness: "structured"
          },
          transactionState: "reviewed"
        },
        {
          title: "Buyer submits a mock bid",
          copy: "The buyer moves from discovery into a browser-simulated offer state with no live payment or escrow action.",
          note: "Mock tool: submitMockBid",
          request: {
            capability: "submitMockBid",
            listingSlug: "points2perks",
            bidUsd: 175000,
            buyerType: "travel loyalty network"
          },
          response: {
            status: "mock-approved",
            next: "advanceMockTransaction",
            note: "Mock approval only. No real transaction created."
          },
          transactionState: "mock-approved"
        },
        {
          title: "Transaction advances through a mock settlement record",
          copy: "The final state shows the protocol-shaped end of the flow while staying explicit that no live money movement happened.",
          note: "Mock tool: advanceMockTransaction",
          request: {
            capability: "advanceMockTransaction",
            transactionId: "txn-points2perks-demo",
            targetState: "mock-settled"
          },
          response: {
            status: "mock-settled",
            note: "No live payment, escrow, or delegated transfer executed."
          },
          transactionState: "mock-settled"
        }
      ]
    },
    "missing-field": {
      label: "Missing seller field",
      steps: [
        {
          title: "Seller submits a listing intake",
          copy: "The seller leaves out a filing identifier, so the demo pauses before valuation.",
          note: "Mock tool: listPatent",
          request: {
            capability: "listPatent",
            ownerEmail: "owner@example.com",
            listingTitle: "Points2Perks",
            filingStatus: "",
            commercializationGoal: "sale or licensing"
          },
          response: {
            status: "needs-owner-input",
            missingFields: ["filingStatus"],
            next: "listPatent"
          },
          transactionState: "draft"
        }
      ]
    },
    "low-bid": {
      label: "Low bid review",
      steps: [
        {
          title: "Buyer submits a mock bid",
          copy: "A bid lands below the ask guidance, so the demo returns counter guidance rather than a straight approval.",
          note: "Mock tool: submitMockBid",
          request: {
            capability: "submitMockBid",
            listingSlug: "points2perks",
            bidUsd: 90000,
            buyerType: "merchant marketplace"
          },
          response: {
            status: "manual-review",
            counterGuidanceUsd: 160000,
            note: "Demo review path only. No real negotiation thread created."
          },
          transactionState: "reviewed"
        }
      ]
    },
    "manual-review": {
      label: "Manual review pause",
      steps: [
        {
          title: "Transaction pauses for manual review",
          copy: "The simulated transaction is paused to show a human review checkpoint before any mock approval or settlement state.",
          note: "Mock tool: advanceMockTransaction",
          request: {
            capability: "advanceMockTransaction",
            transactionId: "txn-points2perks-demo",
            targetState: "manual-review"
          },
          response: {
            status: "manual-review",
            ownerAction: "confirm exclusivity terms",
            note: "Static demo only. No live callback or approval queue exists."
          },
          transactionState: "reviewed"
        }
      ]
    }
  };

  const protocolState = {
    scenario: "happy",
    stepIndex: 0
  };

  function formatProtocolJson(value) {
    return JSON.stringify(value, null, 2);
  }

  function getProtocolScenario() {
    return protocolScenarios[protocolState.scenario] || protocolScenarios.happy;
  }

  function getProtocolStep() {
    return getProtocolScenario().steps[protocolState.stepIndex];
  }

  function renderProtocolDemo() {
    if (!protocolRoot) return;
    const scenario = getProtocolScenario();
    const step = getProtocolStep();
    if (protocolStageLabel) {
      protocolStageLabel.textContent = `Step ${protocolState.stepIndex + 1} of ${scenario.steps.length} · ${scenario.label}`;
    }
    if (protocolStageTitle) {
      protocolStageTitle.textContent = step.title;
    }
    if (protocolStageCopy) {
      protocolStageCopy.textContent = step.copy;
    }
    if (protocolStageNote) {
      protocolStageNote.textContent = step.note;
    }
    if (protocolRequest) {
      protocolRequest.textContent = formatProtocolJson(step.request);
    }
    if (protocolResponse) {
      protocolResponse.textContent = formatProtocolJson(step.response);
    }
    if (protocolTransaction) {
      protocolTransaction.textContent = step.transactionState;
    }
    protocolStepButtons.forEach((button, index) => {
      const active = index === protocolState.stepIndex && protocolState.scenario === "happy";
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-current", active ? "step" : "false");
    });
    protocolScenarioButtons.forEach((button) => {
      const active = button.dataset.protocolScenario === protocolState.scenario;
      button.classList.toggle("is-active", active);
      if (button.classList.contains("btn-solid") && !active) {
        button.classList.remove("btn-solid");
      }
      if (!button.classList.contains("btn-solid") && active) {
        button.classList.add("btn-solid");
      }
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    if (protocolNext) {
      protocolNext.textContent = protocolState.stepIndex === scenario.steps.length - 1 ? "Restart demo" : "Advance demo";
    }
  }

  function setProtocolScenario(name) {
    protocolState.scenario = protocolScenarios[name] ? name : "happy";
    protocolState.stepIndex = 0;
    renderProtocolDemo();
  }

  function setProtocolStep(index) {
    if (protocolState.scenario !== "happy") {
      protocolState.scenario = "happy";
    }
    protocolState.stepIndex = Math.max(0, Math.min(index, protocolScenarios.happy.steps.length - 1));
    renderProtocolDemo();
  }

  function advanceProtocolDemo() {
    const scenario = getProtocolScenario();
    if (protocolState.stepIndex === scenario.steps.length - 1) {
      protocolState.stepIndex = 0;
    } else {
      protocolState.stepIndex += 1;
    }
    renderProtocolDemo();
  }

  protocolStepButtons.forEach((button, index) => {
    button.addEventListener("click", () => setProtocolStep(index));
  });

  protocolScenarioButtons.forEach((button) => {
    button.addEventListener("click", () => setProtocolScenario(button.dataset.protocolScenario || "happy"));
  });

  if (protocolNext) {
    protocolNext.addEventListener("click", advanceProtocolDemo);
  }

  if (protocolReset) {
    protocolReset.addEventListener("click", () => setProtocolScenario("happy"));
  }

  if (protocolRoot) {
    renderProtocolDemo();
  }
```

Replace the current `window.ucpTools` object at the bottom of `site.js` with this aligned version:

```js
  window.ucpTools = {
    listPatent(payload) {
      return {
        mode: "demo",
        capability: "listPatent",
        payload,
        response: protocolScenarios.happy.steps[0].response
      };
    },
    previewValuation(payload) {
      return {
        mode: "demo",
        capability: "previewValuation",
        payload,
        response: protocolScenarios.happy.steps[1].response
      };
    },
    discoverListings(query) {
      return {
        mode: "demo",
        capability: "discoverListings",
        query,
        response: protocolScenarios.happy.steps[2].response
      };
    },
    openListingFacts(listingId) {
      return {
        mode: "demo",
        capability: "openListingFacts",
        listingId,
        response: protocolScenarios.happy.steps[3].response
      };
    },
    submitMockBid(payload) {
      return {
        mode: "demo",
        capability: "submitMockBid",
        payload,
        response: protocolScenarios.happy.steps[4].response
      };
    },
    advanceMockTransaction(transactionId, nextState) {
      return {
        mode: "demo",
        capability: "advanceMockTransaction",
        transactionId,
        nextState,
        response: {
          ...protocolScenarios.happy.steps[5].response,
          status: nextState || protocolScenarios.happy.steps[5].response.status
        }
      };
    },
    searchPatents(query) {
      return this.discoverListings(query);
    },
    bidPatent(patentId, amountUsd) {
      return this.submitMockBid({ listingSlug: patentId, bidUsd: amountUsd });
    }
  };
```

- [ ] **Step 4: Run the platform test, then the full suite**

Run: `node --test tests/platform.test.mjs`

Expected: PASS with the protocol scenario strings and capability names now present in `site.js`.

Run: `npm test`

Expected: PASS with all site tests green, including the existing homepage, listings, discovery, and support-page checks.

- [ ] **Step 5: Commit the interactive protocol demo**

```bash
git add site.js tests/platform.test.mjs
git commit -m "feat: simulate platform protocol demo"
```

## Final Verification Commands

Run these after Task 2 before any merge or push:

```bash
node --test tests/platform.test.mjs
npm test
git status --short
```

Expected final state:

- `tests/platform.test.mjs` passes with the protocol shell and script contract covered
- `npm test` is fully green
- `git status --short` shows a clean tree except for intentional untracked local artifacts like `.agents/` and `skills-lock.json`
