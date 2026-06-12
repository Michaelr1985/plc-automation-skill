# Archive Pump Controller Simulation Report

Generated: 2026-06-12T09:55:43.613Z

## Summary

- Total: 8
- Passed: 8
- Failed: 0

## Results

| Test ID | Scenario | Status | Evidence |
| --- | --- | --- | --- |
| SIM-001 | Boot state has safe outputs | PASS | Runtime initialized stopped with all outputs de-energized. |
| SIM-002 | Normal start, run, and stop sequence | PASS | Start pulse moved sequence to PRECHECK/STARTING/RUNNING; stop pulse forced STOPPING then STOPPED. |
| SIM-003 | E-stop trip de-energizes outputs | PASS | Loss of estop_ok latched trip, entered FAULTED, and dropped drive command. |
| SIM-004 | Drive fault latches trip and de-energizes outputs | PASS | Drive fault latched trip and removed run command. |
| SIM-005 | Reset clears only after fault cause clears and does not restart | PASS | Reset during active fault was ignored; reset after cause cleared returned to STOPPED without starting. |
| SIM-006 | Power recovery from retained running state forces safe stopped/tripped state | PASS | Retained RUNNING state on boot was converted to STOPPED with tripLatched=true and no auto restart. |
| SIM-007 | Stale remote BLE/Wi-Fi command is ignored | PASS | Expired and unhealthy remote start commands did not create a start pulse. |
| SIM-008 | Analog scaling clamps and scales low/mid/high values | PASS | Raw ADC values clamp at limits and scale midpoint to approximately 50%. |

## Validation Boundary

This report validates generated control behavior in software only. Hardware IO checks, VSD parameter checks, safety circuit proof tests, and site commissioning remain mandatory before operation.
