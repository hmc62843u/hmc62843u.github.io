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

  window.ucpTools = {
    searchPatents(query) {
      return { mode: "demo", query };
    },
    bidPatent(patentId, amountUsd) {
      return { mode: "demo", patentId, amountUsd, action: "mock-bid" };
    },
    listPatent(payload) {
      return { mode: "demo", payload, action: "mock-listing" };
    }
  };
})();
