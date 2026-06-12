#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

async function listFiles(root, prefix = "") {
  const result = [];
  const entries = await fs.readdir(path.join(root, prefix), { withFileTypes: true });
  for (const entry of entries) {
    const rel = path.join(prefix, entry.name);
    if (entry.isDirectory()) {
      result.push(...await listFiles(root, rel));
    } else if (entry.isFile()) {
      result.push(rel);
    }
  }
  return result.sort();
}

async function read(file) {
  return fs.readFile(file);
}

const [src, dest] = process.argv.slice(2);
if (!src || !dest) {
  console.error("Usage: node scripts/validate-local-sync.mjs <repo-folder> <local-folder>");
  process.exit(2);
}

const source = path.resolve(src);
const target = path.resolve(dest);
const srcFiles = await listFiles(source);
const destFiles = await listFiles(target);
const errors = [];

for (const rel of srcFiles) {
  if (!destFiles.includes(rel)) {
    errors.push(`Missing local file ${rel}`);
    continue;
  }
  const a = await read(path.join(source, rel));
  const b = await read(path.join(target, rel));
  if (!a.equals(b)) {
    errors.push(`Different local file ${rel}`);
  }
}

if (errors.length > 0) {
  console.error(errors.map((e) => `ERROR: ${e}`).join("\n"));
  process.exit(1);
}

console.log(`OK sync: ${source} -> ${target}`);
