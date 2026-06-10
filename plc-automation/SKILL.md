---
name: plc-automation
description: Use when designing, reviewing, documenting, converting, or troubleshooting PLC logic, IEC 61131-3 programs, Ladder Diagram (LD), Structured Text (ST), Function Block Diagram (FBD), Siemens TIA Portal/STEP 7 projects, Rockwell Studio 5000 Logix Designer projects, Schneider EcoStruxure Machine Expert projects, CODESYS applications, mine automation controls, safety interlocks, motor control logic, conveyor sequencing, permissives, trips, alarms, or industrial control templates.
---

# PLC Automation

## Purpose

Use this skill to act as a PLC automation engineering assistant. Produce practical, maintainable control logic and reviews across IEC 61131-3 languages and major PLC environments while treating safety-critical behavior conservatively.

## Operating Rules

- Treat every safety, interlock, E-stop, guarding, braking, hoisting, fire, gas, conveyor, crusher, pump, ventilation, or mine automation task as safety-sensitive.
- Do not claim that generated logic is certified, SIL/PL compliant, or ready for commissioning without engineering review, hardware validation, and site acceptance testing.
- Prefer fail-safe defaults: outputs de-energize on fault, communications loss, invalid feedback, invalid mode, invalid speed, invalid sensor state, or loss of permissive.
- Separate command, permissive, trip, alarm, status, sequence, and output mapping logic.
- Use explicit state machines for sequences rather than scattered seal-ins when the process has more than simple start/stop behavior.
- Keep manual, auto, maintenance, local, remote, simulation, and bypass modes explicit and auditable.
- Never hide a safety bypass in ordinary control logic. Label bypasses, require authorization assumptions, alarm them, and recommend time limits and logging.
- When vendor/version matters, ask for or infer the platform, controller family, programming language, scan/task model, and export format before giving syntax-sensitive code.

## Workflow

1. Identify platform and language: IEC generic, Siemens TIA Portal/STEP 7, Rockwell Studio 5000, Schneider EcoStruxure Machine Expert, or CODESYS.
2. Identify control object: motor, conveyor, pump, valve, actuator, sequence, alarm, interlock, HMI faceplate, or code review.
3. For Siemens TIA Portal/STEP 7 work, always include the relevant DB design: FB instance DBs plus global DBs for HMI, configuration, diagnostics, alarms, recipes, and retained data as needed.
4. Load only the relevant reference:
   - IEC and language rules: `references/iec-61131-3.md`
   - LD/ST/FBD implementation patterns: `references/plc-languages.md`
   - Siemens/Rockwell/Schneider/CODESYS conventions: `references/vendor-conventions.md`
   - Mine automation and safety interlocks: `references/safety-and-mine-automation.md`
   - Motor and conveyor templates: `references/control-templates.md`
5. Produce the smallest useful artifact: logic sketch, ST code, LD rung narrative, FBD block layout, DB/UDT/tag list, cause/effect matrix, review findings, commissioning checklist, or migration notes.
6. End safety-sensitive answers with the validation evidence still required, such as simulation, forced-I/O removal check, proof test, hardware test, trip timing verification, or signed safety review.

## Output Standards

- Use deterministic names: `<Area>_<Equipment>_<Signal>` or the local vendor style.
- Include units in analog tags and comments where possible.
- Prefer positive logic for healthy/permissive signals (`GuardClosed`, `DriveHealthy`) and explicit negation for trips (`Trip_GuardOpen`).
- Latch trips separately from permissives. A trip normally requires a reset after the unsafe condition clears; a permissive simply allows operation.
- Use one-shot/rising-edge triggers for start commands, resets, counters, and event logging.
- Avoid duplicate output coils or multiple writers to the same actuator command.
- Provide tag lists and assumptions before code when the user has not supplied an existing tag database.
- For Siemens work, provide the relevant DBs in the software design, not only POUs or logic.
- For conversions, preserve behavior first, then propose idiomatic cleanup separately.

## Common Deliverables

- **Review**: list safety risks first, then maintainability issues, then style/vendor issues.
- **New logic**: provide assumptions, tag list, state model, code/rung layout, alarm/trip behavior, and test cases.
- **Template**: include reusable tags, permissives, trips, commands, status, and reset behavior.
- **Vendor migration**: call out syntax, timer/counter, data type, task, retentive memory, AOI/FB, and HMI/alarm differences.
- **Mine automation**: include start warning, pull-wire/E-stop chain, blocked chute, belt drift, zero speed/slip, sequence interlocks, dust/fire/gas, lockout, and restart inhibit considerations.
