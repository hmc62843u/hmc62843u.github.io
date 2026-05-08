import { execFile } from "node:child_process";
import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import promptEvidence from "./lib/prompt-evidence.js";

const execFileAsync = promisify(execFile);
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

function optionalEnv(name) {
  const value = process.env[name];
  return value ? value : "";
}

function parseArgs(argv) {
  return {
    includeDev: argv.includes("--include-dev"),
    includeExa: argv.includes("--include-exa")
  };
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
    citations: data.citations || [],
    notes: ""
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
    citations,
    notes: "openai comparison run"
  };
}

async function runExaAnswer(prompt, apiKey) {
  const response = await fetch("https://api.exa.ai/answer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey
    },
    body: JSON.stringify({
      query: prompt,
      text: true
    })
  });

  if (!response.ok) {
    throw new Error(`Exa request failed: ${response.status}`);
  }

  const data = await response.json();
  const citations = Array.isArray(data.citations)
    ? data.citations
        .map((citation) =>
          typeof citation === "string"
            ? citation
            : citation?.url || citation?.link || citation?.source || ""
        )
        .filter(Boolean)
    : [];

  return {
    answerText: data.answer || "",
    citations,
    notes: "exa comparison run"
  };
}

async function runOpenCode(prompt) {
  const { stdout } = await execFileAsync("opencode", ["run", prompt], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024
  });

  return {
    answerText: stdout.trim(),
    citations: [],
    notes: "opencode local run via CLI; dev provider run; citations unavailable"
  };
}

async function runKiloCode(prompt) {
  const { stdout } = await execFileAsync("kilocode", ["run", "--auto", prompt], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024
  });

  return {
    answerText: stdout.trim(),
    citations: [],
    notes: "kilocode local run via CLI; dev provider run; citations unavailable"
  };
}

function buildProviders({ includeDev, includeExa, openAIKey, exaKey, prompt }) {
  const providers = [
    {
      system: "perplexity",
      run: () => runPerplexity(prompt, requireEnv("PERPLEXITY_API_KEY"))
    }
  ];

  if (includeExa) {
    if (exaKey) {
      providers.push({
        system: "exa_answer",
        run: () => runExaAnswer(prompt, exaKey)
      });
    } else {
      providers.push({
        system: "exa_answer",
        run: async () => {
          throw new Error("exa_answer run skipped: EXA_API_KEY not configured");
        }
      });
    }
  }

  if (!includeDev) {
    return providers;
  }

  if (openAIKey) {
    providers.push({
      system: "openai_web_search",
      run: () => runOpenAI(prompt, openAIKey)
    });
  } else {
    providers.push({
      system: "openai_web_search",
      run: async () => {
        throw new Error("openai_web_search run skipped: OPENAI_API_KEY not configured");
      }
    });
  }

  providers.push(
    { system: "opencode_dev", run: () => runOpenCode(prompt) },
    { system: "kilocode_dev", run: () => runKiloCode(prompt) }
  );

  return providers;
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

function isMissingCommandError(error) {
  return Boolean(error) && typeof error === "object" && "code" in error && error.code === "ENOENT";
}

function noteFromError(system, error) {
  if (isMissingCommandError(error)) {
    return `${system} run skipped: command not found`;
  }

  return error instanceof Error ? error.message : String(error);
}

async function main() {
  const { includeDev, includeExa } = parseArgs(process.argv.slice(2));
  const prompts = readPrompts();
  const openAIKey = optionalEnv("OPENAI_API_KEY");
  const exaKey = optionalEnv("EXA_API_KEY");

  ensureCsvHeader();

  for (const prompt of prompts) {
    const timestamp = new Date().toISOString();
    const providers = buildProviders({ includeDev, includeExa, openAIKey, exaKey, prompt });

    for (const provider of providers) {
      try {
        const result = await provider.run();
        const row = buildRow({
          timestamp,
          system: provider.system,
          prompt,
          answerText: result.answerText,
          citations: result.citations,
          notes: result.notes || ""
        });
        appendFileSync(csvPath, `${serializeRow(row)}\n`, "utf8");
      } catch (error) {
        const note = noteFromError(provider.system, error);
        console.warn(note);
        const row = buildRow({
          timestamp,
          system: provider.system,
          prompt,
          answerText: "",
          citations: [],
          notes: note
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
