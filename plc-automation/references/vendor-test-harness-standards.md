# Vendor Test Harness Standards

Use this when generating or reviewing PLC/software test functions. Test harnesses must validate IO mapping, command paths, permissives, trips, alarms, reset behavior, retained state, communication-loss behavior, and output isolation.

## Common Requirements

Every vendor test harness must include:

- Enable/disable test mode.
- Reset test command.
- Test running/done/passed/failed status.
- Current test step.
- Failure code.
- Failure text.
- Per-equipment test result bits.
- A clear warning that test mode is for simulation/FAT/controlled commissioning only.
- A rule that test mode must not bypass safety hardware.
- A rule that reset must not start equipment.
- Evidence tags or checklist rows suitable for FAT sign-off.

## Common Test Cases

| Test | Purpose |
| --- | --- |
| Boot safe | Confirm outputs are off after startup/reboot |
| IO mapping | Confirm each input updates the correct internal tag |
| Output mapping | Confirm each command energizes only the intended output |
| Output isolation | Confirm one output command does not energize another channel |
| Analog scaling | Confirm raw analog values map to engineering units |
| Permissive inhibit | Confirm equipment cannot start when permissives are false |
| Trip latch | Confirm trips latch and outputs de-energize |
| Reset behavior | Confirm reset clears only eligible trips and does not start equipment |
| Feedback timeout | Confirm missing running feedback trips or faults correctly |
| Communication loss | Confirm stale/invalid comms data causes the configured safe response |
| Power recovery | Confirm retained step behavior and operator acknowledgement path |
| Alarm mapping | Confirm active faults generate correct alarm bits/messages |

## Siemens TIA Portal

Recommended implementation:

- Test FB: `FB_<Area>_TestHarness`
- Test DB: `DB_<Area>_Test`
- Instance DB: `DB_FB_<Area>_TestHarness`
- Test HMI screen: diagnostics/test page where allowed
- Call order in OB1 during FAT: test harness before or around target FB depending on whether it stimulates input DBs or reads outputs.

Rules:

- Generate full SCL External Source or SIMATIC SD structures, not snippets.
- Use dedicated test DBs and do not overwrite production DBs unless explicitly in test mode.
- Keep test-mode enable false by default.
- Do not generate safety bypass logic.

## Rockwell Studio 5000

Recommended implementation:

- Program: `<Area>_TEST` or routine `<Area>_TestHarness`
- Tags: `<Area>_Test.Enable`, `.Reset`, `.Passed`, `.Failed`, `.Step`, `.FailCode`
- For import-ready output, use `.L5X`.

Rules:

- Do not use test code to force safety tags.
- Prefer test controller/program tags instead of modifying raw module tags directly.
- If using produced/consumed or module-defined tags, provide a simulation mapping layer.
- Include first-scan reset and test-mode inhibit from normal operation.

## CODESYS

Recommended implementation:

- POU: `FB_<Area>_TestHarness`
- GVL: `GVL_<Area>_Test`
- Persistent retain test data only if the test requires recovery evidence.

Rules:

- Use PLCopen XML or CODESYS `.export` for import-ready exchange.
- Use simulation variables separate from physical IO mapping.
- Do not use test harness tasks to drive live IO unless the user explicitly confirms a bench rig.

## Schneider EcoStruxure Machine Expert

Recommended implementation:

- POU: `FB_<Area>_TestHarness`
- GVL: `GVL_<Area>_Test`
- Export: Machine Expert `.export` or PLCopen XML where supported.

Rules:

- Confirm product line first.
- Keep Machine Expert Safety separate from standard control tests.
- Include commissioning evidence table in the README/checklist.

## Archive ESP-IDF

Recommended implementation:

- Module: `test_harness.c/.h`
- Struct: `archive_test_t`
- Test task or controlled function called from a simulated/bench mode.
- CLI, HTTP, BLE, or MQTT status endpoint where required.

Rules:

- Test mode must force outputs safe unless explicitly running a controlled output proof step.
- Use simulated input structs or a hardware abstraction layer for IO tests.
- Include brownout/reboot retained-state tests.
- Include Wi-Fi/BLE command expiry and stale-data tests when comms are enabled.
- Do not put long-running test logic inside the PLC scan task.

## Test Harness Output Checklist

Before finalizing:

- State whether the harness is simulation-only, bench-only, or commissioning-safe.
- State whether live outputs may be connected.
- Include enable/reset/run/pass/fail/failure-code tags.
- Include import/build instructions.
- Include expected evidence screenshots/trends/logs.
- Include known gaps when the vendor IDE/runtime is unavailable.
