# Archive ESP32 PLC ESP-IDF Starter

Target controller: Archive PLC
CPU: ESP32
Framework: ESP-IDF
Artifact type: Native ESP-IDF source project

This package is the reference output pattern for the PLC automation skill when the selected controller is **Archive**.

It implements a PLC-style runtime on ESP-IDF:

- Safe output initialization on boot
- Fixed-period PLC scan task
- Raw IO mapping separated from application logic
- Retained step word and trip state using NVS
- Step engine pattern for automatic sequences
- Fail-safe output handling on trips and invalid permissives

## Build

Assumptions:

- ESP-IDF is installed and exported in the shell.
- Target chip is `esp32`.
- GPIO assignments are placeholders and must be confirmed against the Archive hardware revision.

Commands:

```sh
idf.py set-target esp32
idf.py build
idf.py flash monitor
```

## Files

| File | Purpose |
| --- | --- |
| `CMakeLists.txt` | ESP-IDF project definition |
| `main/CMakeLists.txt` | Main component registration |
| `main/app_main.c` | Startup, NVS init, IO safe state, PLC task creation |
| `main/archive_io.h` | Archive IO data structures and function declarations |
| `main/archive_io.c` | GPIO/ADC mapping and safe output writes |
| `main/plc_runtime.h` | PLC runtime data structures and sequence state definitions |
| `main/plc_runtime.c` | Retained state, trip logic, step engine, scan function |

## Archive Hardware Validation Required

Before field use, confirm:

- GPIO map
- Input polarity
- Output type and safe state
- ADC channel and scaling
- External IO expanders, if fitted
- Watchdog configuration
- Power-fail and brownout behavior
- Retentive-state recovery behavior

This firmware is standard control firmware. E-stops, guards, safety relays, and safety-rated motor isolation must remain external safety-rated hardware.
