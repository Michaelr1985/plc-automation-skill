# Project Generator Modes

Use generator modes to decide the output scope before producing files. If the user does not specify a mode, infer the most useful mode from the request and state the assumption.

## Modes

| Mode | Use When | Required Output |
| --- | --- | --- |
| Design Only | User is exploring architecture or scope | Design sections, IO assumptions, sequence/interlock/alarm strategy, open questions |
| Code Package | User asks for PLC/HMI/firmware code | Design summary, vendor validation, source files, README/import note, local delivery folder |
| Commissioning Pack | User asks to test, commission, FAT, SAT, or checklist | Excel-ready checklists, IO loop checks, alarm tests, sequence tests, recovery tests |
| Full Project Pack | User asks for a complete project | Design, code package, HMI/SCADA, test harness, FAT/SAT, commissioning, docs, estimate |
| Quote/Estimate Pack | User asks for budget, proposal, or quotation | Scope, inclusions/exclusions, assumptions, risk register, hours, BOM assumptions, deliverables |
| Migration Pack | User asks to convert between PLC platforms | Source behavior summary, migration risks, target design, mapping table, vendor-specific output |
| Review Existing Code | User provides code/project files and asks for review | Findings first, risks, import/compile issues, test gaps, recommendations |
| Test Harness Pack | User asks to test generated software | Vendor-specific test harness, test DB/tags, test instructions, expected evidence |
| HMI/SCADA Pack | User asks for operator interface or SCADA | Screen list, faceplates, alarm/trend/tag lists, security levels, comms assumptions |

## Mode Selection Rules

- If the user asks "build/code/upload/import", choose **Code Package** unless they also ask for full documentation.
- If the user asks "everything", "complete", or "full project", choose **Full Project Pack**.
- If the user asks "test it" or "check IO", choose **Test Harness Pack** plus relevant commissioning checks.
- If the user provides a sales intake or budget request, choose **Quote/Estimate Pack** unless a code deliverable is explicitly requested.
- If the platform is Archive, Code Package means ESP-IDF project files.
- If the platform is Siemens, Code Package means TIA-compatible External Source or SIMATIC SD according to the selected workflow.
- If the platform is Rockwell, Code Package means `.L5X`/`.L5K` where import-ready output is required; plain `.ST` is paste-in reference only.
- If the platform is CODESYS/Schneider, Code Package means PLCopen XML or native export format where import-ready output is required.

## Required Mode Declaration

Every substantial output must begin or include:

```text
Generator Mode:
Vendor/Platform:
Target Software:
Artifact Type:
Local Delivery Folder:
Validation Status:
```

## File Package Rule

For any mode that creates files:

- Create a repo folder when working inside a repo.
- Create a standalone local delivery folder under `~/Documents`.
- Include a README/import note.
- Label every file as native import, external source, paste-in source, native source project, engineering reference, checklist, or documentation.
- State what was not verified because the vendor IDE/runtime is unavailable.
