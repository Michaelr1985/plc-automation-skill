#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

function parseArgs(argv) {
  const args = { folder: argv[2], type: "" };
  for (let i = 3; i < argv.length; i++) {
    if (argv[i] === "--type") {
      args.type = argv[i + 1];
      i++;
    }
  }
  return args;
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function read(file) {
  return fs.readFile(file, "utf8");
}

function fail(errors, message) {
  errors.push(message);
}

async function validateArchive(folder, errors) {
  const required = [
    "CMakeLists.txt",
    "BUILD-VERIFICATION.md",
    "README.md",
    "build-main.sh",
    "build-tests.sh",
    "main/CMakeLists.txt",
    "main/app_main.c",
    "main/archive_config.h",
    "main/archive_io.c",
    "main/archive_io.h",
    "main/archive_wifi.c",
    "main/archive_wifi.h",
    "main/archive_ble.c",
    "main/archive_ble.h",
    "main/mqtt_client_app.c",
    "main/mqtt_client_app.h",
    "main/http_server_app.c",
    "main/http_server_app.h",
    "main/modbus_tcp_server.c",
    "main/modbus_tcp_server.h",
    "main/ota_update.c",
    "main/ota_update.h",
    "main/test_harness.c",
    "main/test_harness.h",
    "main/plc_runtime.c",
    "main/plc_runtime.h",
  ];
  for (const rel of required) {
    if (!(await exists(path.join(folder, rel)))) {
      fail(errors, `Missing ${rel}`);
    }
  }
  const app = await read(path.join(folder, "main/app_main.c")).catch(() => "");
  const io = await read(path.join(folder, "main/archive_io.c")).catch(() => "");
  const runtime = await read(path.join(folder, "main/plc_runtime.c")).catch(() => "");
  if (!app.includes("app_main")) fail(errors, "app_main.c does not define app_main");
  if (!io.includes("archive_io_write_safe")) fail(errors, "archive_io.c missing safe output function");
  if (!runtime.includes("nvs_")) fail(errors, "plc_runtime.c missing NVS retained-state handling");
  if (!runtime.includes("PLC_STEP_FAULTED")) fail(errors, "plc_runtime.c missing faulted step handling");
  const wifi = await read(path.join(folder, "main/archive_wifi.c")).catch(() => "");
  const ble = await read(path.join(folder, "main/archive_ble.c")).catch(() => "");
  const test = await read(path.join(folder, "main/test_harness.c")).catch(() => "");
  if (!wifi.includes("esp_wifi")) fail(errors, "archive_wifi.c missing ESP-IDF Wi-Fi use");
  if (!ble.includes("archive_ble_init")) fail(errors, "archive_ble.c missing BLE init scaffold");
  if (!test.includes("archive_test_run_step")) fail(errors, "test_harness.c missing test runner");
}

async function validateSiemens(folder, errors) {
  const files = await fs.readdir(folder);
  const sclFiles = files.filter((f) => f.endsWith(".scl"));
  const dbFiles = files.filter((f) => f.endsWith(".db"));
  if (sclFiles.length === 0) fail(errors, "No .scl files found");
  if (dbFiles.length === 0) fail(errors, "No .db files found");
  for (const file of sclFiles) {
    const text = await read(path.join(folder, file));
    if (!/FUNCTION_BLOCK|FUNCTION|ORGANIZATION_BLOCK|TYPE|DATA_BLOCK/.test(text)) {
      fail(errors, `${file} has no TIA source wrapper`);
    }
  }
  for (const file of dbFiles) {
    const text = await read(path.join(folder, file));
    if (!text.includes("DATA_BLOCK") || !text.includes("END_DATA_BLOCK")) {
      fail(errors, `${file} is not a complete DATA_BLOCK source`);
    }
  }
}

async function validateRockwell(folder, errors) {
  const files = await fs.readdir(folder);
  const hasL5x = files.some((f) => f.endsWith(".L5X"));
  const hasReadme = files.includes("README.md");
  if (!hasReadme) fail(errors, "Missing README.md");
  if (!hasL5x && files.some((f) => f.endsWith(".ST"))) {
    const readme = await read(path.join(folder, "README.md")).catch(() => "");
    if (!/paste-in|reference/i.test(readme)) {
      fail(errors, "Rockwell .ST files must be labeled paste-in/reference unless .L5X exists");
    }
  }
}

async function validateCodesys(folder, errors) {
  const files = await fs.readdir(folder);
  if (!files.includes("README.md")) fail(errors, "Missing README.md");
  const hasImport = files.some((f) => f.endsWith(".xml") || f.endsWith(".export"));
  if (!hasImport && files.some((f) => f.endsWith(".ST"))) {
    const readme = await read(path.join(folder, "README.md")).catch(() => "");
    if (!/paste-in|reference/i.test(readme)) {
      fail(errors, "CODESYS .ST files must be labeled paste-in/reference unless XML/export exists");
    }
  }
}

const args = parseArgs(process.argv);
if (!args.folder || !args.type) {
  console.error("Usage: node scripts/validate-package.mjs <folder> --type <archive|siemens|rockwell|codesys>");
  process.exit(2);
}

const folder = path.resolve(args.folder);
const errors = [];
if (!(await exists(folder))) {
  fail(errors, `Folder does not exist: ${folder}`);
} else if (args.type === "archive") {
  await validateArchive(folder, errors);
} else if (args.type === "siemens") {
  await validateSiemens(folder, errors);
} else if (args.type === "rockwell") {
  await validateRockwell(folder, errors);
} else if (args.type === "codesys") {
  await validateCodesys(folder, errors);
} else {
  fail(errors, `Unknown type: ${args.type}`);
}

if (errors.length > 0) {
  console.error(errors.map((e) => `ERROR: ${e}`).join("\n"));
  process.exit(1);
}

console.log(`OK ${args.type} package: ${folder}`);
