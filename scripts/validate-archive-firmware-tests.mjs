#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requiredFiles = [
  "archive-esp-idf/test/CMakeLists.txt",
  "archive-esp-idf/test/README.md",
  "archive-esp-idf/test/main/CMakeLists.txt",
  "archive-esp-idf/test/main/test_archive_plc_runtime.c"
];

for (const file of requiredFiles) {
  const stat = await fs.stat(path.join(root, file));
  assert.equal(stat.isFile(), true, `${file} must exist`);
}

const testCmake = await fs.readFile(
  path.join(root, "archive-esp-idf/test/main/CMakeLists.txt"),
  "utf8"
);
const testSource = await fs.readFile(
  path.join(root, "archive-esp-idf/test/main/test_archive_plc_runtime.c"),
  "utf8"
);

for (const expected of [
  "../../main/plc_runtime.c",
  "../../main/archive_io.c",
  "unity",
  "nvs_flash",
  "driver"
]) {
  assert.match(testCmake, new RegExp(escapeRegex(expected)), `test CMake must include ${expected}`);
}

for (const expected of [
  "test_archive_runtime_boots_stopped_with_safe_outputs",
  "test_archive_runtime_starts_commands_drive_and_stops_safely",
  "test_archive_runtime_latches_drive_fault_and_reset_does_not_restart",
  "test_archive_runtime_power_recovery_from_running_requires_acknowledgement",
  "test_archive_runtime_scales_analog_input_to_engineering_units",
  "plc_runtime_scan",
  "plc_runtime_save_retain",
  "RUN_TEST"
]) {
  assert.match(testSource, new RegExp(escapeRegex(expected)), `firmware test must cover ${expected}`);
}

console.log("OK Archive ESP-IDF firmware tests");

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
