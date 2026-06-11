# Vendor Conventions

## Siemens TIA Portal / STEP 7

Use for SIMATIC S7-1200, S7-1500, TIA Portal, STEP 7, LAD/FBD/SCL, DBs, FBs, FCs, OBs, UDTs, ProDiag, and SIMATIC Safety discussions.

Conventions:

- Prefer symbolic tags over absolute addresses in application logic.
- Use FBs with instance DBs for reusable equipment modules.
- Always create and document the relevant DBs in the software design, not only the logic blocks.
- For each reusable FB, include its instance DB or multi-instance plan.
- Create global DBs where needed for HMI command/status, configuration parameters, diagnostics, alarms/events, recipes, retained values, and external interfaces.
- Separate DBs by purpose when it improves commissioning and maintenance: for example `DB_HMI`, `DB_Config`, `DB_Diagnostics`, `DB_Alarms`, `DB_ProcessData`, and equipment instance DBs.
- Mark which DB members are retentive, HMI-writable, read-only status, engineering constants, or commissioning-only.
- Use FCs for stateless calculations or checks.
- Keep OB1 orchestration thin; call area/equipment FBs from organized networks.
- Use UDTs for equipment interfaces, parameters, alarms, and HMI structures.
- Use optimized blocks unless integration requirements demand non-optimized access.
- Use SCL for state machines and calculations; LAD/FBD for field-maintainable discrete interlocks.
- Use network titles/comments to make online diagnosis readable.
- Separate safety program logic from standard control logic. Do not simulate certified safety behavior with standard code.
- For importable generated files, follow `siemens-tia-source-standard.md`: generate full External Source or SIMATIC SD structures with wrappers, interfaces, networks, DBs, and block endings.
- Never describe loose SCL/STL body text as import-ready for TIA Portal.

Naming examples:

- `MTR_CV101` for a conveyor motor FB instance.
- `DB_MTR_CV101` or the local standard name for the motor FB instance DB.
- `DB_HMI_CV101`, `DB_CFG_CV101`, `DB_DIAG_CV101` for HMI/config/diagnostic global DBs when separate DBs are useful.
- `CV101_CmdStart`, `CV101_RunFb`, `CV101_TripPullwire`.
- `udtMotorCmd`, `udtMotorSts`, `fbMotorStarter`.

## Rockwell Studio 5000 Logix Designer

Use for ControlLogix, CompactLogix, GuardLogix, Studio 5000, Logix Designer, Ladder, FBD, ST, AOIs, UDTs, tasks, programs, routines, and PlantPAx-style patterns.

Conventions:

- Use UDTs for equipment command/status/config structures.
- Use AOIs for reusable validated equipment behavior when the site permits AOI lifecycle controls.
- Separate periodic/continuous/event tasks deliberately. Document task period assumptions.
- Use program-scoped tags for local internals and controller-scoped tags for shared I/O/HMI interfaces.
- Use aliases or mapped I/O tags to avoid raw module references throughout process logic.
- Use `ONS`/edge logic for commands that must not retrigger each scan.
- Watch retentive behavior of tags, timers, and latches across downloads/power cycles.
- For GuardLogix, keep safety task and safety tags under safety lifecycle controls.
- For importable generated files, use `.L5X` XML or another documented Logix import/export format. Plain `.ST` files are paste-in routine source only.

Naming examples:

- `CV101.Cmd.Start`, `CV101.Sts.Running`, `CV101.Trip.Pullwire`.
- `Mtr_CV101`, `AOI_MotorStarter`, `UDT_Motor`.
- `I_CV101_RunFb`, `O_CV101_RunCmd` when flat tag styles are required.

## Schneider EcoStruxure Machine Expert

Use for Modicon machine controllers, EcoStruxure Machine Expert, Machine Expert - Safety, GVLs, POUs, libraries, and CODESYS-derived project structure.

Conventions:

- Confirm product line first: Machine Expert, Machine Expert - Basic, Machine Expert - Safety, or Control Expert differ.
- Use POUs and DUTs/structures for reusable equipment modules.
- Use GVLs sparingly for shared I/O and system-wide constants.
- Prefer local variables inside FBs and explicit interfaces between POUs.
- Confirm which IEC languages and safety subsets are available in the selected product/version.
- Keep safety logic in the safety environment and standard control in the standard controller environment.
- For importable generated files, use Machine Expert `.export` or PLCopen XML `.xml`; plain `.ST` text is not a complete import file.

Naming examples:

- `FB_MotorStarter`, `ST_MotorCmd`, `ST_MotorSts`.
- `gvlIO.xCV101RunFb`, `fbCV101`, `xPermissiveOK`.

## CODESYS

Use for CODESYS V3 applications, IEC POUs, libraries, devices, tasks, visualizations, and fieldbus mappings.

Conventions:

- Use `FB_`, `FC_`, `PRG_`, `GVL_`, `DUT_` prefixes if the project already follows that style.
- Use methods/properties/interfaces only when the maintenance team and target runtime support them comfortably.
- Prefer library-qualified names when ambiguity is possible.
- Keep device I/O mapping separate from application logic.
- Document task cycle time and watchdog assumptions.
- Treat online changes, retained variables, and persistent variables as commissioning risks requiring checks.
- For importable generated files, use PLCopen XML `.xml` or CODESYS `.export`; plain `.ST` text is paste-in/object content only.

## Delta ISPSoft / WPLSoft

Use for Delta PLC work only after confirming exact CPU and programming software.

Conventions:

- Confirm supported IEC languages and instruction set before writing syntax.
- Document retentive memory ranges/registers explicitly.
- Keep step words in documented retentive memory.
- Use vendor-neutral pseudocode if software/CPU details are missing.
- Keep raw IO mapping separate from sequence and interlock logic where practical.
- Do not claim generated files are import-ready unless the user provides a Delta export/import format or confirms the exact supported file workflow.

## Omron Sysmac Studio

Use for Omron NJ/NX and Sysmac Studio projects.

Conventions:

- Confirm controller family, task cycle, safety CPU boundaries, and retained variable behavior.
- Use structured variables, programs, FBs, and tasks according to project standards.
- Use CASE-based sequence engines unless the site standard requires another method.
- Document retained step words and restart behavior.
- Keep safety program/interface status separate from standard control logic.
- For importable generated files, confirm Sysmac version and use supported project/POU export formats or IEC 61131-10 XML where available.

## Vendor-Neutral Migration Watchpoints

- Boolean polarity and normally-open/normally-closed symbol meaning.
- Timer/counter reset and retentive behavior.
- First-scan bits and power-up initialization.
- Array lower bounds and string handling.
- UDT/structure packing and HMI tag paths.
- Safety signatures, passwords, locked blocks, source protection, and online edit limitations.
