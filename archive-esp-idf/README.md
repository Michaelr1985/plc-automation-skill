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
- Communication guidance for Wi-Fi and BLE module selection

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

Convenience build script from this folder:

```sh
./build-main.sh
```

The script expects ESP-IDF at `~/esp/esp-idf` by default. To use another checkout:

```sh
IDF_ROOT=/path/to/esp-idf ./build-main.sh
```

This build was verified with ESP-IDF 5.4 on 2026-06-12. See `BUILD-VERIFICATION.md`.

## Firmware Tests

The `test/` folder contains a dedicated ESP-IDF Unity test application that compiles the production PLC runtime into a test app.

Build the firmware test app from this folder:

```sh
./build-tests.sh
```

Run from `archive-esp-idf/test`:

```sh
idf.py set-target esp32
idf.py build
idf.py flash monitor
```

The firmware tests verify:

- Boot-safe stopped state and de-energized outputs
- Normal start, run command, and stop sequence
- Drive fault trip latch and reset-does-not-start behavior
- Retained running-state power recovery to stopped/tripped
- Analog raw-to-engineering scaling

When ESP-IDF is not available on the workstation, run the repository-side structure check:

```sh
node scripts/validate-archive-firmware-tests.mjs
```

## Files

| File | Purpose |
| --- | --- |
| `CMakeLists.txt` | ESP-IDF project definition |
| `main/CMakeLists.txt` | Main component registration |
| `main/app_main.c` | Startup, NVS init, IO safe state, PLC task creation |
| `main/archive_config.h` | Feature flags, command timeouts, topic names |
| `main/archive_io.h` | Archive IO data structures and function declarations |
| `main/archive_io.c` | GPIO/ADC mapping and safe output writes |
| `main/archive_wifi.c/.h` | Wi-Fi STA/SoftAP/APSTA scaffold |
| `main/archive_ble.c/.h` | BLE stack/GATT/provisioning scaffold |
| `main/mqtt_client_app.c/.h` | MQTT client scaffold |
| `main/http_server_app.c/.h` | Local HTTP health/setup scaffold |
| `main/modbus_tcp_server.c/.h` | Modbus TCP placeholder scaffold |
| `main/ota_update.c/.h` | HTTPS OTA scaffold |
| `main/test_harness.c/.h` | Bench/FAT runtime test harness scaffold |
| `main/plc_runtime.h` | PLC runtime data structures and sequence state definitions |
| `main/plc_runtime.c` | Retained state, trip logic, step engine, scan function |
| `test/` | ESP-IDF Unity firmware test app for the PLC runtime |

## Wi-Fi Options For Archive Projects

Use dedicated communication modules and tasks. Do not place network callbacks inside the PLC scan.

Supported ESP-IDF patterns to select from:

- Wi-Fi Station for plant/site Wi-Fi connection.
- SoftAP for local commissioning access.
- Station + SoftAP when plant Wi-Fi and local setup access are both required.
- Wi-Fi provisioning by SoftAP for installer credential setup.
- Wi-Fi provisioning by BLE for mobile app credential setup.
- ESP-NOW for low-latency peer-to-peer ESP32 telemetry or non-safety remote IO.
- MQTT for telemetry, alarms, and broker-based command requests.
- HTTP/REST server for local setup/status pages.
- HTTP/REST client for upstream reporting.
- WebSocket for live HMI/status streaming.
- Modbus TCP for SCADA/HMI register mapping.
- HTTPS OTA for firmware updates.
- mDNS for commissioning discovery.
- SNTP/NTP for timestamped alarms and events.

Guidelines:

- Remote commands are requests, not direct outputs.
- Validate remote commands through mode, permissives, interlocks, trip state, and command expiry.
- Use queues or protected shared structs between comms tasks and PLC logic.
- Define communication-loss behavior for every remote command source.
- Use TLS/authentication where the deployment requires it.

## BLE Options For Archive Projects

Supported ESP-IDF patterns to select from:

- NimBLE for BLE-only firmware with lower memory use.
- Bluedroid when Bluetooth Classic plus BLE is required.
- BLE GATT server for mobile/HMI status, alarms, setup, and limited commands.
- BLE GATT client for reading BLE sensors/devices.
- BLE advertising for identity, availability, or commissioning state.
- BLE provisioning for Wi-Fi credentials.
- BLE Mesh for non-safety, low-bandwidth distributed nodes.

Guidelines:

- Prefer NimBLE unless Classic Bluetooth is required.
- Use explicit GATT characteristic permissions.
- Do not execute motion/output commands directly inside BLE callbacks.
- Queue BLE command requests into the PLC application layer.
- Add stale-data timeouts for BLE sensor values.
- Document pairing, bonding, authentication, and what is visible before authentication.
- Test Wi-Fi/BLE coexistence and memory usage when both are enabled.

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
