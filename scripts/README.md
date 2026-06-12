# PLC Automation Scripts

These scripts turn the skill standards into repeatable checks and package generation helpers.

## Generators

```sh
node scripts/generate-package.mjs --platform archive --project demo
node scripts/generate-package.mjs --platform siemens --project demo
node scripts/generate-package.mjs --platform rockwell --project demo
node scripts/generate-package.mjs --platform codesys --project demo
node scripts/generate-hmi-tag-pack.mjs --platform ignition --project demo
node .spreadsheet-build/build_fat_sat_workbook.mjs
```

## Validators

```sh
node scripts/validate-package.mjs archive-esp-idf --type archive
node scripts/validate-package.mjs siemens-tia-s7-1215 --type siemens
node scripts/validate-local-sync.mjs archive-esp-idf /Users/michaeljohnrautenbach1985/Documents/Archive-ESP-IDF-Template-Files
```

Validators are structural checks. They do not replace TIA Portal, Studio 5000, CODESYS, Machine Expert, or ESP-IDF compiler validation.
