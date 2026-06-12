# Archive Remote IO Pump Controller Example

Generator Mode: Full Project Pack
Platform: Archive ESP32 PLC
Software: ESP-IDF

Scope:

- One pump.
- E-stop healthy monitor.
- Start/stop/reset buttons.
- Analog level input.
- MQTT telemetry.
- BLE commissioning.

Expected outputs:

- ESP-IDF project.
- `archive_io.c/.h`
- `plc_runtime.c/.h`
- `archive_wifi.c/.h`
- `archive_ble.c/.h`
- `mqtt_client_app.c/.h`
- `test_harness.c/.h`
- Hardware profile.
- FAT/SAT workbook.

Validation:

- ESP-IDF project structure check.
- Boot outputs safe.
- NVS retained step recovery.
- Wi-Fi/BLE command expiry tests.
- Brownout/watchdog output-off tests.
