# PLC Automation Capability Index

This skill supports these capability groups.

## Core Engineering

- Design-first workflow.
- Generator modes.
- Project scope and architecture.
- IO definition.
- Step-engine sequences.
- Interlocks.
- Alarms.
- Cause/effect.
- Power recovery.
- HMI/SCADA.
- Communications.
- Simulation.
- Vendor validation.
- Code generation.
- Code review.
- Documentation.
- Estimates.
- FAT/SAT/commissioning.

## Vendor Platforms

- Siemens TIA Portal / STEP 7.
- Rockwell Studio 5000 / Logix Designer.
- Schneider EcoStruxure Machine Expert.
- CODESYS V3 and CODESYS-based runtimes.
- Omron Sysmac Studio.
- Delta ISPSoft / WPLSoft.
- Archive ESP32 PLC with ESP-IDF.

## Deliverable Types

- Engineering design.
- Import/source code package.
- Native source firmware project.
- Generated package folder from script.
- HMI/SCADA screen pack.
- Alarm list.
- Interlock matrix.
- Cause/effect matrix.
- IO list.
- Network map.
- FAT/SAT workbook.
- Commissioning checklist.
- Test harness.
- Migration pack.
- Review report.
- Quote/estimate pack.
- Structured JSON project intake.
- HMI/SCADA tag export CSV.
- Site standard profile.

## Validation Standards

- Vendor file output standards.
- Siemens source wrapper checks.
- Rockwell `.L5X` checks.
- CODESYS/Schneider XML/export checks.
- Archive ESP-IDF structure checks.
- Local package validator scripts.
- Local folder sync validator scripts.
- Local delivery folder synchronization.
- Safety boundary audit.
- Reset-does-not-start test.
- Communication-loss test.
- Power recovery test.

## Archive-Specific Capabilities

- ESP-IDF C/CMake project generation.
- ESP32 PLC-style scan task.
- GPIO/ADC hardware profile.
- NVS retained state.
- Watchdog/brownout recovery.
- Wi-Fi STA/SoftAP/APSTA/provisioning.
- BLE NimBLE/Bluedroid/GATT/provisioning/Mesh.
- MQTT/HTTP/WebSocket/Modbus TCP/OTA/mDNS/SNTP guidance.
- ESP-NOW peer-to-peer non-safety IO guidance.

## Repository Tooling

- `scripts/generate-package.mjs`
- `scripts/generate-hmi-tag-pack.mjs`
- `scripts/validate-package.mjs`
- `scripts/validate-local-sync.mjs`
- `.spreadsheet-build/build_fat_sat_workbook.mjs`
- `schemas/automation-project-intake.schema.json`
- `templates/hmi-tags/*`
- `templates/site-standards/*`
- `examples/*`
