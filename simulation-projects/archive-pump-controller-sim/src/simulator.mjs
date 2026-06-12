import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { scenarios } from "./scenarios.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const evidenceDir = path.join(projectRoot, "evidence");
const writeEvidence = !process.argv.includes("--no-write");

async function run() {
  const startedAt = new Date();
  const results = [];

  for (const scenario of scenarios) {
    try {
      results.push(scenario());
    } catch (error) {
      results.push({
        id: "UNKNOWN",
        name: scenario.name || "Unnamed scenario",
        status: "FAIL",
        evidence: [error.stack || error.message]
      });
    }
  }

  const passed = results.filter((item) => item.status === "PASS").length;
  const failed = results.length - passed;
  const report = {
    project: "Archive Pump Controller Simulation",
    generatedAt: new Date().toISOString(),
    startedAt: startedAt.toISOString(),
    finishedAt: new Date().toISOString(),
    summary: {
      total: results.length,
      passed,
      failed
    },
    results
  };

  if (writeEvidence) {
    await fs.mkdir(evidenceDir, { recursive: true });
    await fs.writeFile(
      path.join(evidenceDir, "simulation-report.json"),
      `${JSON.stringify(report, null, 2)}\n`,
      "utf8"
    );
    await fs.writeFile(path.join(evidenceDir, "simulation-report.md"), renderMarkdown(report), "utf8");
  }

  console.log(`Archive pump simulation: ${passed}/${results.length} passed`);
  if (writeEvidence) {
    console.log(`Evidence: ${path.relative(process.cwd(), path.join(evidenceDir, "simulation-report.md"))}`);
  } else {
    console.log("Evidence write skipped: --no-write");
  }

  if (failed > 0) {
    process.exitCode = 1;
  }
}

function renderMarkdown(report) {
  const lines = [
    "# Archive Pump Controller Simulation Report",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "## Summary",
    "",
    `- Total: ${report.summary.total}`,
    `- Passed: ${report.summary.passed}`,
    `- Failed: ${report.summary.failed}`,
    "",
    "## Results",
    "",
    "| Test ID | Scenario | Status | Evidence |",
    "| --- | --- | --- | --- |"
  ];

  for (const item of report.results) {
    lines.push(
      `| ${item.id} | ${escapeCell(item.name)} | ${item.status} | ${escapeCell(item.evidence.join(" "))} |`
    );
  }

  lines.push(
    "",
    "## Validation Boundary",
    "",
    "This report validates generated control behavior in software only. Hardware IO checks, VSD parameter checks, safety circuit proof tests, and site commissioning remain mandatory before operation."
  );

  return `${lines.join("\n")}\n`;
}

function escapeCell(value) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
}

await run();
