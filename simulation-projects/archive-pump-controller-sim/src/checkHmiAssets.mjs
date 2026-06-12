import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requiredFiles = [
  "hmi/index.html",
  "hmi/styles.css",
  "hmi/hmiApp.mjs",
  "src/plcRuntime.mjs"
];

for (const file of requiredFiles) {
  const stat = await fs.stat(path.join(projectRoot, file));
  assert.equal(stat.isFile(), true, `${file} must exist`);
}

const html = await fs.readFile(path.join(projectRoot, "hmi/index.html"), "utf8");
const app = await fs.readFile(path.join(projectRoot, "hmi/hmiApp.mjs"), "utf8");
const css = await fs.readFile(path.join(projectRoot, "hmi/styles.css"), "utf8");

for (const id of [
  "startBtn",
  "stopBtn",
  "resetBtn",
  "estopToggle",
  "readyToggle",
  "runningToggle",
  "faultToggle",
  "remoteCommand",
  "commsToggle",
  "commandAge",
  "adcRaw",
  "stepText",
  "alarmBanner"
]) {
  assert.match(html, new RegExp(`id="${id}"`), `index.html must contain #${id}`);
  assert.match(app, new RegExp(`byId\\("${id}"\\)`), `hmiApp.mjs must bind #${id}`);
}

assert.match(app, /from "\.\.\/src\/plcRuntime\.mjs"/, "HMI must import shared PLC runtime");
assert.match(css, /\.pump\.running/, "HMI must include running pump state styling");
assert.match(css, /\.alarm-banner\.active/, "HMI must include alarm banner state styling");

console.log("OK HMI assets");
