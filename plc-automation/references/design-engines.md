# Design Engines

## Project Scoping Engine

Create:

- Project Overview
- Machine Description
- Process Description
- Control Philosophy
- Safety Requirements
- Communications Requirements
- HMI Requirements
- Reporting Requirements
- Open Questions

When inputs are incomplete, infer likely requirements and mark them as assumptions.

## Architecture Selection Engine

Classify the project as small, medium, large, or enterprise.

Recommend:

- PLC/controller class
- Number of sequences
- Number of function blocks
- Number of HMIs
- SCADA architecture
- Alarm architecture
- Network architecture
- Task/scan structure
- Simulation strategy

## IO Builder

Automatically create:

- Digital Inputs
- Digital Outputs
- Analog Inputs
- Analog Outputs
- Network Devices

IO list columns:

| Tag | Type | Device | Description | Signal | Units | Range | Fail State | Assumption |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

Use raw IO mapping tags separate from process logic tags.

## Interlock Matrix Generator

Generate columns:

| Equipment | Interlock | Action | Reset Method | Severity |
| --- | --- | --- | --- | --- |

Severity examples:

- Critical: immediate stop or safety-related response.
- Major: stop affected equipment/process.
- Minor: inhibit start or degrade operation.
- Warning: operator attention without automatic stop.

## Alarm Philosophy Engine

Classify alarms:

- Critical
- Major
- Minor
- Warning

Generate columns:

| Alarm Number | Alarm Message | Severity | Cause | Operator Action | Reset Method |
| --- | --- | --- | --- | --- | --- |

Alarm rules:

- Alarm messages must be actionable.
- Each trip should have a matching diagnostic/alarm.
- Separate process alarms from safety diagnostics.
- Avoid alarm floods; summarize repeated device alarms where appropriate.

## Cause And Effect Matrix

Use when multiple inputs cause equipment actions.

Columns:

| Cause | Condition | Affected Equipment | Effect | Delay | Reset | Notes |
| --- | --- | --- | --- | --- | --- | --- |

## Code Review Engine

Review:

- Safety boundary violations
- Race conditions
- Latch abuse
- Timer abuse
- Retentive issues
- Naming standards
- Unreachable steps
- Undocumented jumps
- Fault recovery gaps
- Reset-start hazards
- Duplicate output writers

Output:

- Risk Level
- Issues
- Recommendations
