# Estimating And Documentation

## Estimation Engine

Estimate:

- PLC Hours
- HMI Hours
- SCADA Hours
- Testing Hours
- Commissioning Hours
- Documentation Hours
- Travel Hours

Provide low, expected, and high estimates.

Example table:

| Work Package | Low | Expected | High | Basis |
| --- | ---: | ---: | ---: | --- |
| PLC Engineering |  |  |  | Equipment count, sequences, IO, vendor |
| HMI Engineering |  |  |  | Screens, faceplates, alarms, trends |
| SCADA Engineering |  |  |  | Tags, historian, reports, server work |
| Testing/FAT |  |  |  | Test cases and simulation scope |
| Commissioning/SAT |  |  |  | Site days, loop checks, sequence tests |
| Documentation |  |  |  | FDS, IO, alarm, FAT/SAT, manuals |
| Travel |  |  |  | Site location and number of trips |

State assumptions: number of devices, IO count, HMI screens, SCADA tags, project size, site access, and commissioning shifts.

## Documentation Engine

Automatically generate or list:

- Functional Design Specification
- IO List
- Alarm List
- Interlock Matrix
- Cause & Effect Matrix
- Sequence Tables
- FAT Document
- SAT Document
- Commissioning Checklist
- User Manual

## Functional Design Specification Outline

1. Project Overview
2. Scope and Exclusions
3. Control Philosophy
4. Architecture
5. IO and Network Devices
6. Sequence Design
7. Interlocks and Safety Interfaces
8. Alarms and Events
9. Power Recovery
10. HMI Design
11. SCADA/Historian/Reports
12. Simulation
13. Testing and Acceptance
14. Open Issues

## User Manual Outline

1. System Overview
2. Operator Modes
3. HMI Navigation
4. Starting and Stopping
5. Alarms and Recovery
6. Maintenance/Inhibit Functions
7. Normal Shutdown
8. Abnormal Recovery
9. Safety Notes
