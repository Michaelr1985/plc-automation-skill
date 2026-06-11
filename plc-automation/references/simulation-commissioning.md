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
