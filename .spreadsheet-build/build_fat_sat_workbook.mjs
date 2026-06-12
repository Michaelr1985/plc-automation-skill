import path from "node:path";
import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const repoRoot = "/Users/michaeljohnrautenbach1985/Documents/PLC Skill";
const outputPath = path.join(repoRoot, "templates", "FAT-SAT-Commissioning-Workbook.xlsx");

const sheets = [
  "Cover",
  "IO_Checks",
  "Loop_Checks",
  "Drive_Actuator_Checks",
  "Alarm_Tests",
  "Interlock_Tests",
  "Sequence_Tests",
  "Communications",
  "Power_Recovery",
  "Test_Harness",
  "HMI_SCADA",
  "Issues_Punchlist",
  "Sign_Off",
];

const commonHeaders = [
  "Test ID",
  "Area",
  "Requirement",
  "Procedure",
  "Expected Result",
  "Actual Result",
  "Pass/Fail",
  "Evidence",
  "Initials",
  "Date",
  "Comments",
];

const workbook = Workbook.create();

for (const sheetName of sheets) {
  const sheet = workbook.worksheets.add(sheetName);
  if (sheetName === "Cover") {
    sheet.getRange("A1:B10").values = [
      ["Project", ""],
      ["Client", ""],
      ["Site", ""],
      ["PLC Platform", ""],
      ["Software Version", ""],
      ["Prepared By", ""],
      ["Revision", "A"],
      ["FAT Date", ""],
      ["SAT Date", ""],
      ["Commissioning Date", ""],
    ];
    sheet.getRange("A1:B10").format.autofitColumns();
  } else {
    sheet.getRange("A1:K1").values = [commonHeaders];
    sheet.getRange("A2:K6").values = [
      [`${sheetName}-001`, sheetName, "Verify requirement.", "Execute documented test.", "Expected result achieved.", "", "", "", "", "", ""],
      [`${sheetName}-002`, sheetName, "Verify reset does not start equipment where applicable.", "Trip, clear cause, press reset.", "Alarm/trip clears only; output remains off.", "", "", "", "", "", ""],
      [`${sheetName}-003`, sheetName, "Verify communication/stale-data behavior where applicable.", "Remove or invalidate communication source.", "Configured fail-safe response occurs.", "", "", "", "", "", ""],
      [`${sheetName}-004`, sheetName, "Verify evidence captured.", "Attach screenshot/log/photo/trend.", "Evidence is traceable.", "", "", "", "", "", ""],
      [`${sheetName}-005`, sheetName, "Verify sign-off readiness.", "Review results and open issues.", "No blocking issues remain.", "", "", "", "", "", ""],
    ];
    sheet.getRange("A1:K6").format.autofitColumns();
  }
}

await fs.mkdir(path.dirname(outputPath), { recursive: true });
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(outputPath);
