(() => {
  const modal = document.querySelector("[data-signup-modal]");
  const status = document.querySelector("[data-signup-status]");
  const dashboard = document.querySelector("[data-dashboard]");
  const planInput = document.querySelector("[data-signup-plan]");
  const searchForm = document.querySelector("[data-listing-search]");
  const searchInput = document.querySelector("[data-listing-query]");
  const cards = Array.from(document.querySelectorAll("[data-listing-card]"));

  function openSignupModal(plan = "Basic") {
    if (!modal) return;
    if (planInput) planInput.value = plan;
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeSignupModal() {
    if (!modal) return;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  }

  function filterCards(query) {
    const normalized = query.trim().toLowerCase();
    let visibleCount = 0;
    cards.forEach((card) => {
      const haystack = `${card.dataset.title} ${card.dataset.tags} ${card.dataset.summary}`.toLowerCase();
      const visible = !normalized || haystack.includes(normalized);
      card.hidden = !visible;
      if (visible) {
        visibleCount += 1;
      }
    });

    const emptyState = document.querySelector("[data-empty-state]");
    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }
  }

  document.querySelectorAll("[data-open-signup]").forEach((button) => {
    button.addEventListener("click", () => openSignupModal(button.dataset.plan || "Basic"));
  });

  document.querySelectorAll("[data-close-signup]").forEach((button) => {
    button.addEventListener("click", closeSignupModal);
  });

  document.querySelectorAll("[data-signup-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const plan = String(formData.get("plan") || "Basic");
      const email = String(formData.get("email") || "demo@example.com");
      if (status) {
        status.textContent = `Demo account created for ${email} on the ${plan} plan.`;
      }
      if (dashboard) {
        dashboard.hidden = false;
        dashboard.classList.add("show");
      }
      closeSignupModal();
    });
  });

  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      filterCards(searchInput.value);
    });
    searchInput.addEventListener("input", () => filterCards(searchInput.value));
  }

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
      const active = protocolState.scenario === "happy" && index === protocolState.stepIndex;
      button.classList.toggle("is-active", active);
      if (active) {
        button.setAttribute("aria-current", "step");
      } else {
        button.removeAttribute("aria-current");
      }
    });

    protocolScenarioButtons.forEach((button) => {
      const active = button.dataset.protocolScenario === protocolState.scenario;
      button.classList.toggle("is-active", active);
      if (active) {
        button.classList.add("btn-solid");
      } else {
        button.classList.remove("btn-solid");
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
})();
