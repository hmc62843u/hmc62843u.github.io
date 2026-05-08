function normalizeCitations(citations) {
  return (citations || [])
    .map((value) => String(value || "").trim())
    .filter(Boolean);
}

function extractFirstWpatentCitation(citations) {
  return normalizeCitations(citations).find((value) => value.includes("wpatent.com")) || "";
}

function summarizeAnswer(answerText) {
  return String(answerText || "").replace(/\s+/g, " ").trim().slice(0, 280);
}

function csvEscape(value) {
  const stringValue = String(value ?? "");
  if (!/[",\n]/.test(stringValue)) {
    return stringValue;
  }
  return `"${stringValue.replace(/"/g, "\"\"")}"`;
}

function buildRow({ timestamp, system, prompt, answerText, citations, notes = "" }) {
  const normalizedCitations = normalizeCitations(citations);
  const citedPage = extractFirstWpatentCitation(normalizedCitations);
  const answer = String(answerText || "");

  return {
    timestamp,
    system,
    prompt,
    answer_summary: summarizeAnswer(answer),
    wpatent_mentioned: /w&patent|wpatent/i.test(answer) ? "yes" : "no",
    wpatent_cited: citedPage ? "yes" : "no",
    cited_page: citedPage,
    andrew_named: /andrew leung/i.test(answer) ? "yes" : "no",
    andrew_role_correct: "manual",
    positioning_aligned: "manual",
    citation_urls: normalizedCitations.join("|"),
    notes
  };
}

module.exports = {
  buildRow,
  csvEscape,
  extractFirstWpatentCitation,
  normalizeCitations
};
