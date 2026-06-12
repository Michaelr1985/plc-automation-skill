#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

function parseArgs(argv) {
  const args = { platform: "generic", project: "plc-project", out: "" };
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

function csv(rows) {
  return rows.map((row) => row.map((cell) => {
    const text = String(cell ?? "");
    return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  }).join(",")).join("\n") + "\n";
}

const args = parseArgs(process.argv);
const projectSafe = args.project.replace(/[^A-Za-z0-9_.-]+/g, "-") || "plc-project";
const out = path.resolve(args.out || path.join(process.env.HOME || ".", "Documents", `${projectSafe}-HMI-SCADA-Tags`));
await fs.mkdir(out, { recursive: true });

const rows = [
  ["Tag", "Platform", "DataType", "Direction", "Purpose", "Historian", "Alarm", "Security", "Notes"],
  [`${projectSafe}_System_Healthy`, args.platform, "Bool", "PLC->HMI", "System healthy summary", "Yes", "No", "View", ""],
  [`${projectSafe}_AutoMode`, args.platform, "Bool", "HMI->PLC", "Automatic mode request", "Yes", "No", "Operator", "Command request only"],
  [`${projectSafe}_StartPB`, args.platform, "Bool", "HMI->PLC", "Start request", "Yes", "No", "Operator", "Must be edge detected"],
  [`${projectSafe}_StopPB`, args.platform, "Bool", "HMI->PLC", "Stop request", "Yes", "No", "Operator", ""],
  [`${projectSafe}_ResetPB`, args.platform, "Bool", "HMI->PLC", "Reset request", "Yes", "No", "Operator", "Reset must not start"],
  [`${projectSafe}_MainSeqStep`, args.platform, "Int", "PLC->HMI", "Main retained sequence step", "Yes", "No", "View", ""],
  [`${projectSafe}_ActiveAlarmCount`, args.platform, "Int", "PLC->HMI", "Active alarm count", "Yes", "Yes", "View", ""],
  [`${projectSafe}_CommsHealthy`, args.platform, "Bool", "PLC->HMI", "Communications healthy", "Yes", "Yes", "View", ""],
  [`${projectSafe}_TestHarnessPassed`, args.platform, "Bool", "PLC->HMI", "Software test harness passed", "No", "No", "Engineer", "Commissioning only"],
];

await fs.writeFile(path.join(out, "hmi_scada_tags.csv"), csv(rows));
await fs.writeFile(path.join(out, "README.md"), `# HMI/SCADA Tag Pack\n\nProject: ${projectSafe}\nPlatform: ${args.platform}\n\nReview and adapt tag paths to the target HMI/SCADA package.\n`);
console.log(out);
