# Simulation, FAT, SAT, And Commissioning

## Simulation Engine

Support:

- PLCSIM
- Logix Emulate
- Factory IO
- EasyPLC
- CODESYS Simulation

Generate:

- Normal Operation Tests
- Sensor Failure Tests
- Power Loss Tests
- Emergency Stop Tests
- Communications Failure Tests
- Recovery Tests

Simulation test columns:

| Test ID | Scenario | Initial State | Action | Expected Result | Evidence |
| --- | --- | --- | --- | --- | --- |

## FAT Planning

Generate:

- IO simulation checks
- HMI navigation and faceplate checks
- Alarm tests
- Interlock tests
- Sequence transition tests
- Power recovery tests
- Communications failure tests
- Documentation review

FAT columns:

| Test ID | Requirement | Procedure | Expected Result | Pass/Fail | Evidence | Comments |
| --- | --- | --- | --- | --- | --- | --- |

## SAT Planning

Generate:

- Site IO verification
- Loop checks
- Drive/actuator direction checks
- Instrument scaling checks
- Safety interface verification
- Alarm verification
- Sequence verification with real equipment
- Recovery verification

SAT must identify what cannot be tested safely online and what requires permit/LOTO/operations coordination.

## Commissioning Engine

Generate:

- FAT
- SAT
- Loop Checks
- IO Verification
- Alarm Verification
- Sequence Verification
- Recovery Verification

Commissioning checklist columns:

| Area | Item | Acceptance Criteria | Status | Initials | Date | Evidence | Comments |
| --- | --- | --- | --- | --- | --- | --- | --- |

## FAT/SAT Excel Workbook Standard

When the user asks for an Excel checklist, commissioning pack, FAT pack, SAT pack, or full project pack, create an Excel-ready workbook structure. If spreadsheet tooling is available, generate `.xlsx`; otherwise generate CSV/Markdown sheets clearly separated by tab name.

Required workbook sheets:

| Sheet | Purpose |
| --- | --- |
| Cover | Project, client, site, revision, prepared by, witness details |
| IO_Checks | Digital/analog IO proof checks and raw/conditioned value verification |
| Loop_Checks | Instrument loop checks, scaling, calibration, low/mid/high points |
| Drive_Actuator_Checks | VSD/starter/valve output tests, direction, feedback, interlocks |
| Alarm_Tests | Alarm activation, message, severity, acknowledge, reset, historian |
| Interlock_Tests | Permissives, trips, cause/effect validation |
| Sequence_Tests | Step-engine transitions, timeouts, holds, recovery |
| Communications | Profinet/Ethernet-IP/Modbus/MQTT/BLE/Wi-Fi/SCADA tests |
| Power_Recovery | Power loss, PLC reboot, brownout, retained step, operator recovery |
| Test_Harness | Built-in software test harness results and evidence |
| HMI_SCADA | Screens, faceplates, trends, security, command arbitration |
| Issues_Punchlist | Open issues, owner, priority, due date, closure evidence |
| Sign_Off | FAT/SAT/commissioning acceptance signatures |

Common columns:

| Test ID | Area | Requirement | Procedure | Expected Result | Actual Result | Pass/Fail | Evidence | Initials | Date | Comments |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Rules:

- Include reset-does-not-start tests.
- Include communication-loss tests for every networked command/status source.
- Include safety boundary tests as diagnostics only; do not require unsafe live testing.
- Identify tests that are simulation-only, FAT bench tests, SAT live tests, or not safe to test live.
- Include evidence requirements: screenshot, trend, PLC watch table, SCADA alarm log, photo, signed observation, or test harness result.

## Recovery Tests

Always include tests for:

- Power loss
- PLC reboot
- Emergency stop
- CPU fault recovery
- Communications failure
- Sensor failure
- Drive fault
- Reset behavior

Reset test requirement: confirm reset does not start any equipment and a fresh start command is required unless a documented, risk-assessed auto-resume mode exists.
