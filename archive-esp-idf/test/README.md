# Archive ESP-IDF Firmware Test App

Generator mode: **Test Harness Pack**

This folder is a dedicated ESP-IDF Unity test application for the Archive PLC runtime. It compiles the production PLC runtime source into a test app so the retained step engine can be verified on an ESP32 target or ESP-IDF-supported test environment.

## Run

From this folder:

```sh
idf.py set-target esp32
idf.py build
idf.py flash monitor
```

The Unity test app runs from `app_main()` and reports pass/fail results in the serial monitor.

## Test Coverage

| Test | Purpose |
| --- | --- |
| Boot safe | Confirm runtime initializes stopped with outputs off |
| Normal start/stop | Confirm start reaches running command and stop de-energizes output |
| Trip latch/reset | Confirm drive fault latches trip and reset does not restart equipment |
| Power recovery | Confirm retained running state boots to safe stopped/tripped state |
| Analog scaling | Confirm raw ADC values scale to engineering units |

## Safety Boundary

These tests are for firmware validation, bench FAT, and controlled simulation only. They do not bypass or validate external safety-rated hardware. Live outputs must be disconnected or connected only to a controlled bench rig when running firmware tests.
