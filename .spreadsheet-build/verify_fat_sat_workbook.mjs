import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const workbookPath = "/Users/michaeljohnrautenbach1985/Documents/PLC Skill/templates/FAT-SAT-Commissioning-Workbook.xlsx";
const input = await FileBlob.load(workbookPath);
const workbook = await SpreadsheetFile.importXlsx(input);

for (const sheetName of ["Cover", "IO_Checks", "Alarm_Tests", "Communications", "Sign_Off"]) {
  const inspection = await workbook.inspect({
    kind: "table",
    range: `${sheetName}!A1:K6`,
    include: "values",
    tableMaxRows: 6,
    tableMaxCols: 11,
  });
  console.log(inspection.ndjson);
}

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "formula error scan",
});
console.log(errors.ndjson);
console.log("FAT/SAT workbook verification completed");
