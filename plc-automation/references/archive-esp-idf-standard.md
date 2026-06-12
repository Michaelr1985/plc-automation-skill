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
