# Archive ESP32 PLC / ESP-IDF Standard

Use this when the selected PLC/controller is **Archive**, the bespoke ESP32-based PLC platform.

## Platform Identity

- Controller name: Archive PLC
- CPU family: ESP32
- Software: ESP-IDF
- Primary language: C
- Build system: ESP-IDF CMake
- Runtime model: deterministic PLC-style scan task running under FreeRTOS

Archive is not treated as Siemens, Rockwell, CODESYS, Arduino, or vendor-neutral IEC source. When Archive is selected, generate ESP-IDF firmware source.

## Required Output Package

Create an ESP-IDF project folder containing at minimum:

```text
<project>/
├── CMakeLists.txt
├── README.md
└── main/
    ├── CMakeLists.txt
    ├── app_main.c
    ├── archive_io.c
    ├── archive_io.h
    ├── plc_runtime.c
    └── plc_runtime.h
```

Add extra modules when needed, for example:

- `motor_control.c/.h`
- `pump_cascade.c/.h`
- `conveyor_control.c/.h`
- `archive_wifi.c/.h`
- `archive_ble.c/.h`
- `modbus_server.c/.h`
- `mqtt_client_app.c/.h`
- `hmi_register_map.c/.h`

## Mandatory Runtime Pattern

Use this scan order:

1. Boot diagnostics.
2. Initialize NVS and load retained state.
3. Configure all outputs to safe off state.
4. Initialize GPIO, ADC, comms, watchdog, timers, and diagnostics.
5. Start `plc_scan_task`.
6. Every scan:
   - Read raw IO.
   - Condition/debounce inputs.
   - Scale analog signals.
   - Build permissives.
   - Detect active trips.
   - Latch trips and alarms.
   - Execute retained step engines.
   - Calculate commands.
   - Map outputs once.
   - Save retained state only on change or at controlled intervals.
   - Feed watchdog only after successful scan.

## Step Engine Rule

All automatic sequences still use the skill's retained Step Engine standard.

For Archive, retained step words must be represented in C and stored through NVS:

```c
typedef enum {
    PLC_STEP_STOPPED = 0,
    PLC_STEP_PRECHECK = 10,
    PLC_STEP_STARTING = 20,
    PLC_STEP_RUNNING = 30,
    PLC_STEP_STOPPING = 40,
    PLC_STEP_FAULTED = 90
} plc_step_t;
```

Use explicit recovery behavior after ESP32 reset or power loss:

- Load retained step.
- Force outputs off.
- Verify IO/permissives.
- Require operator acknowledgement before resuming motion.

## Data Model

Use C structs to preserve PLC readability:

```c
typedef struct {
    bool estop_ok;
    bool drive_ready;
    bool drive_running;
    bool drive_fault;
    float process_value;
} archive_inputs_t;

typedef struct {
    bool drive_run_cmd;
    bool alarm_light;
    float speed_ref_pct;
} archive_outputs_t;

typedef struct {
    int32_t main_seq_step;
    bool trip_latched;
    uint32_t starts;
} archive_retain_t;
```

Separate:

- Raw IO.
- Conditioned IO.
- Commands.
- Status.
- Configuration.
- Alarms.
- Retained state.

## IO Rules

- Use a dedicated IO map.
- Do not scatter GPIO numbers through application logic.
- Configure outputs safe before enabling normal scan.
- Document each GPIO/ADC signal, polarity, units, range, and fail state.
- Treat ADC scaling as an engineering assumption until calibrated on Archive hardware.
- If external IO expanders are used, isolate their driver code from application logic.

## Timing Rules

- Define PLC scan time in milliseconds.
- Use `vTaskDelayUntil` for periodic scan timing.
- Avoid blocking network calls in the scan task.
- Use separate tasks/queues for communications.
- Feed watchdog after successful scan, not before.

## Wi-Fi Communication Options

Archive projects may use these ESP-IDF Wi-Fi modes and services. Select the smallest option that satisfies the project requirements.

| Option | ESP-IDF Feature | Use When | Guidelines |
| --- | --- | --- | --- |
| Wi-Fi Station | `esp_wifi` STA mode | Archive connects to plant/site Wi-Fi | Preferred for MQTT, HTTP client, remote SCADA gateway, NTP/SNTP, and OTA through existing infrastructure. Store credentials securely and handle reconnects without blocking the PLC scan. |
| SoftAP | `esp_wifi` AP mode | Archive hosts a local commissioning or setup network | Use for commissioning pages, local HMI setup, or initial configuration. Require authentication; do not expose unrestricted write commands. |
| Station + SoftAP | `WIFI_MODE_APSTA` | Archive must stay on plant Wi-Fi while exposing local commissioning access | Use carefully because radio airtime is shared. Keep commissioning traffic low and prioritize control/telemetry timing. |
| Wi-Fi Provisioning via SoftAP | `wifi_prov_mgr` SoftAP transport | Field technicians need to set Wi-Fi credentials without rebuilding firmware | Recommended for installer setup where BLE is not desired. Disable provisioning after success unless re-provision mode is authorized. |
| Wi-Fi Provisioning via BLE | `wifi_prov_mgr` BLE transport | Mobile app setup is required | Good for headless devices. Keep provisioning separate from normal BLE telemetry/services. |
| ESP-NOW | `esp_now` | Low-latency peer-to-peer ESP32 telemetry or remote IO | Use for non-safety remote IO, sensor nodes, or local peer messages. Define peer authentication/encryption, loss timeout, stale-data handling, and fail-safe behavior. |
| HTTP/REST server | `esp_http_server` | Local setup or simple local status API | Keep control writes authenticated and rate-limited. Do not run blocking work in request handlers. |
| HTTP/REST client | `esp_http_client` | Archive reports to a web service | Use TLS where possible and queue data outside the PLC scan. |
| WebSocket | ESP-IDF HTTP server/client WebSocket support | Live HMI/status streaming | Use for diagnostics and HMI updates. Never let WebSocket receive handlers directly drive outputs. |
| MQTT | `esp-mqtt` | Telemetry, alarms, cloud/site broker integration | Recommended for publish/subscribe status, alarms, and commands. Use retained command safeguards, command expiry, sequence numbers, and offline fail-safe rules. |
| Modbus TCP | ESP-IDF TCP sockets or Modbus component where available | SCADA/HMI expects Modbus registers over Wi-Fi/Ethernet bridge | Provide a documented register map. Separate raw IO, status, command, alarms, and configuration registers. |
| OTA update | `esp_https_ota` | Firmware updates over Wi-Fi | Require signed/validated update process, rollback plan, and output-safe update mode. Do not update while equipment is running unless the process is engineered for it. |
| mDNS | `mdns` | Local discovery during commissioning | Use as convenience only. Do not depend on mDNS for deterministic control. |
| SNTP/NTP | `esp_netif`/SNTP APIs | Accurate event and alarm timestamps | Use for logs, alarms, historian timestamps, and audit trails. Keep control logic independent of wall-clock availability. |

Wi-Fi rules:

- Keep Wi-Fi event handling outside the PLC scan task.
- Use queues, ring buffers, or protected shared structs between comms tasks and the PLC runtime.
- Define a communications-loss timeout and fail-safe behavior for every remote command source.
- Treat remote commands as requests; validate mode, permissives, interlocks, and command expiry before acting.
- Do not let any network callback write physical outputs directly.
- Use TLS, authentication, and credential storage appropriate to the deployment.
- Document whether Archive is an HMI server, SCADA client, MQTT edge node, Modbus TCP server, or peer-to-peer node.
- For industrial environments, prefer wired Ethernet or isolated gateways when deterministic or high-availability communication is required.

## BLE Communication Options

Archive projects may use these ESP-IDF Bluetooth Low Energy options. Prefer BLE for provisioning, commissioning, local diagnostics, and low-bandwidth mobile access, not deterministic process control.

| Option | ESP-IDF Feature | Use When | Guidelines |
| --- | --- | --- | --- |
| NimBLE BLE stack | NimBLE host | BLE-only Archive firmware needs lower memory use | Preferred default for BLE-only services on ESP32 unless Bluetooth Classic is required. |
| Bluedroid stack | Bluedroid host | Bluetooth Classic plus BLE is required | Use when Classic Bluetooth is needed. Budget more memory and test coexistence with Wi-Fi. |
| BLE GATT server | BLE peripheral/GATT server | Phone/tablet/HMI reads Archive status or writes setup values | Good for local commissioning, status, alarms, and limited commands. Use explicit characteristic permissions and command expiry. |
| BLE GATT client | BLE central/GATT client | Archive reads BLE sensors or devices | Validate stale data and signal quality. Do not treat missing BLE data as healthy. |
| BLE advertising/beacons | GAP advertising | Broadcast identity, state, or commissioning availability | Keep payload small. Do not broadcast sensitive plant data. |
| BLE provisioning | `wifi_prov_mgr` BLE transport | Mobile app provisions Wi-Fi credentials | Recommended for headless setup. Disable or lock provisioning after commissioning. |
| BLE Mesh | ESP-BLE-MESH | Many low-bandwidth BLE nodes need mesh networking | Use for non-safety distributed sensors/status where mesh latency and reliability are acceptable. Document heartbeat, timeout, and stale-data behavior. |

BLE rules:

- Use GATT characteristics with explicit direction: status read/notify, command write, config write, alarm notify.
- Treat BLE writes as operator or commissioning requests; validate mode, authorization, permissives, interlocks, and expiry.
- Never execute motion/output commands directly inside a BLE callback.
- Use a queue from BLE callbacks to the PLC application layer.
- Add stale-data timers for BLE sensor values.
- Consider Wi-Fi/BLE coexistence and memory budget before enabling both.
- Prefer NimBLE for BLE-only Archive applications; use Bluedroid when Bluetooth Classic is explicitly required.
- Document pairing/bonding/security assumptions and what data is visible before authentication.

## Retentive Data Rules

- Use NVS for retained step words, starts, runtime counters, selected config, and recovery flags.
- Do not write NVS every scan.
- Save retained data on state changes, counter changes, controlled intervals, or orderly shutdown events when available.
- On corrupt/missing NVS data, default to stopped/faulted safe state.

## Safety Boundary

Archive ESP32 firmware is standard control firmware. Do not present it as safety-rated.

For E-stops, guards, safety relays, motor contactor safety, or hazardous motion:

- Use external safety-rated hardware.
- Let Archive monitor safety healthy feedback.
- Force standard outputs off when safety healthy is false.
- Do not implement safety bypasses in firmware.

## Build And Test Instructions

Generated README files must include:

- ESP-IDF version assumption.
- Target chip assumption, for example `esp32`.
- `idf.py set-target esp32`
- `idf.py build`
- `idf.py flash monitor`
- Hardware IO assumptions.
- Bench/FAT tests:
  - Boot outputs safe.
  - IO proof test.
  - Analog scaling test.
  - Step recovery after reset.
  - Watchdog/fault output off test.
  - Communications loss test.
  - Brownout/power-cycle recovery test.

## Output Labels

Archive generated code is:

- **Native source project** for ESP-IDF.

It is not:

- PLC vendor import.
- IEC 61131-3 import.
- TIA External Source.
- Rockwell `.L5X`.
- PLCopen XML.
