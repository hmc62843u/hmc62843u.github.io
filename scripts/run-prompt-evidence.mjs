import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import promptEvidence from "./lib/prompt-evidence.js";

const { buildRow, csvEscape } = promptEvidence;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const promptPath = path.join(repoRoot, "docs/scorecards/prompts.txt");
const csvPath = path.join(repoRoot, "docs/scorecards/2026-05-08-wpatent-prompt-runs.csv");
const csvHeader =
  "timestamp,system,prompt,answer_summary,wpatent_mentioned,wpatent_cited,cited_page,andrew_named,andrew_role_correct,positioning_aligned,citation_urls,notes\n";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function readPrompts() {
  return readFileSync(promptPath, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

async function runPerplexity(prompt, apiKey) {
  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "sonar",
      messages: [{ role: "user", content: prompt }]
    })
  });

  if (!response.ok) {
    throw new Error(`Perplexity request failed: ${response.status}`);
  }

  const data = await response.json();
  return {
    answerText: data.choices?.[0]?.message?.content || "",
    citations: data.citations || []
  };
}

async function runOpenAI(prompt, apiKey) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-5",
      input: prompt,
      tools: [{ type: "web_search" }]
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed: ${response.status}`);
  }

  const data = await response.json();
  const outputText = Array.isArray(data.output)
    ? data.output
        .flatMap((item) => item.content || [])
        .filter((item) => item.type === "output_text")
        .map((item) => item.text || "")
        .join("\n")
    : "";
  const citations = Array.isArray(data.output)
    ? data.output
        .flatMap((item) => item.content || [])
        .flatMap((item) => item.annotations || [])
        .map((annotation) => annotation.url)
        .filter(Boolean)
    : [];

  return {
    answerText: outputText,
    citations
  };
}

function serializeRow(row) {
  return [
    row.timestamp,
    row.system,
    row.prompt,
    row.answer_summary,
    row.wpatent_mentioned,
    row.wpatent_cited,
    row.cited_page,
    row.andrew_named,
    row.andrew_role_correct,
    row.positioning_aligned,
    row.citation_urls,
    row.notes
  ]
    .map(csvEscape)
    .join(",");
}

function ensureCsvHeader() {
  if (!existsSync(csvPath)) {
    writeFileSync(csvPath, csvHeader, "utf8");
  }
}

async function main() {
  const perplexityKey = requireEnv("PERPLEXITY_API_KEY");
  const openAIKey = requireEnv("OPENAI_API_KEY");
  const prompts = readPrompts();

  ensureCsvHeader();

  for (const prompt of prompts) {
    const timestamp = new Date().toISOString();

    for (const [system, runner, apiKey] of [
      ["perplexity", runPerplexity, perplexityKey],
      ["openai_web_search", runOpenAI, openAIKey]
    ]) {
      try {
        const result = await runner(prompt, apiKey);
        const row = buildRow({
          timestamp,
          system,
          prompt,
          answerText: result.answerText,
          citations: result.citations
        });
        appendFileSync(csvPath, `${serializeRow(row)}\n`, "utf8");
      } catch (error) {
        const row = buildRow({
          timestamp,
          system,
          prompt,
          answerText: "",
          citations: [],
          notes: error instanceof Error ? error.message : String(error)
        });
        appendFileSync(csvPath, `${serializeRow(row)}\n`, "utf8");
      }
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
