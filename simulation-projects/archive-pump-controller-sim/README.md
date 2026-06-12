# Archive Pump Controller Simulation

Generator mode: **Test Harness Pack**

This project simulates the Archive ESP32 pump controller PLC scan in Node.js. It mirrors the retained step engine used by `archive-esp-idf/main/plc_runtime.c` so software behavior can be tested before loading firmware onto hardware.

## Scope

- Single pump/VSD control sequence
- Retained step engine with safe power recovery
- E-stop, drive ready, drive fault, start, stop, reset, and run feedback logic
- Analog input scaling from raw 12-bit ADC to engineering units
- Remote command validation for BLE/Wi-Fi style command sources
- Simulation evidence for FAT/SAT records

## Run

```bash
npm test
```

or:

```bash
node src/simulator.mjs
```

The simulator writes:

- `evidence/simulation-report.json`
- `evidence/simulation-report.md`

The process exits with code `1` if any scenario fails.

## Safety Notes

- This is a software simulation only.
- It does not certify the machine, VSD panel, safety circuit, or installation.
- E-stop and safety relay verification must be done with approved site procedures and competent personnel.
- Reset clears faults only after the unsafe cause clears and never starts the pump.

## Scenario Coverage

| Scenario | Purpose |
| --- | --- |
| `SIM-001` | Boot state has safe outputs |
| `SIM-002` | Normal start, run, and stop sequence |
| `SIM-003` | E-stop trip de-energizes outputs |
| `SIM-004` | Drive fault latches trip and de-energizes outputs |
| `SIM-005` | Reset clears only after fault cause clears and does not restart |
| `SIM-006` | Power recovery from retained running state forces safe stopped/tripped state |
| `SIM-007` | Stale remote BLE/Wi-Fi command is ignored |
| `SIM-008` | Analog scaling clamps and scales low/mid/high values |

## Import/Use Note

This folder is not a PLC vendor import file. It is an engineering simulation harness used to validate generated control behavior before firmware build, bench FAT, or site commissioning.
