#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const templates = {
  archive: "archive-esp-idf",
  siemens: "siemens-tia-s7-1215",
  rockwell: "rockwell-studio5000",
  codesys: "codesys-st",
};

function parseArgs(argv) {
  const args = { platform: "", project: "plc-project", out: "" };
  for (let i = 2; i < argv.length; i++) {
    const key = argv[i];
    const val = argv[i + 1];
    if (key === "--platform") {
      args.platform = val;
      i++;
    } else if (key === "--project") {
      args.project = val;
      i++;
    } else if (key === "--out") {
      args.out = val;
      i++;
    }
  }
  return args;
}

function safeName(name) {
  return name.trim().replace(/[^A-Za-z0-9_.-]+/g, "-").replace(/^-+|-+$/g, "") || "plc-project";
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(s, d);
    } else if (entry.isFile()) {
      await fs.copyFile(s, d);
    }
  }
}

const args = parseArgs(process.argv);
if (!templates[args.platform]) {
  console.error(`Unknown platform. Use one of: ${Object.keys(templates).join(", ")}`);
  process.exit(2);
}

const project = safeName(args.project);
const source = path.join(repoRoot, templates[args.platform]);
const defaultOut = path.join(process.env.HOME || repoRoot, "Documents", `${project}-${args.platform}-Upload-Files`);
const output = path.resolve(args.out || defaultOut);

await copyDir(source, output);

const note = [
  `# Generated Package`,
  ``,
  `Project: ${project}`,
  `Platform: ${args.platform}`,
  `Source template: ${templates[args.platform]}`,
  `Generated folder: ${output}`,
  ``,
  `Run the relevant vendor/compiler validation before field use.`,
  ``,
].join("\n");

await fs.writeFile(path.join(output, "PACKAGE-GENERATION-NOTE.md"), note);
console.log(output);
