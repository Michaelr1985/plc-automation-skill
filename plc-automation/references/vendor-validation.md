# Vendor Validation Engine

Before code generation, determine:

- PLC Brand
- CPU Type
- Programming Software
- Language
- Memory Architecture
- Retentive Strategy
- Task Structure
- Vendor Naming Standard
- Required File Output Format

Output this check:

```text
Vendor Code Standard Check

PLC:
Software:
Language:
Memory Strategy:
Retentive Strategy:
Step Engine Strategy:
Naming Convention:
File Output Format:
Risks:
Assumptions:
```

If the platform is unknown, generate vendor-neutral design and pseudocode only. Never mix vendor syntax.

## Supported Platforms

### Siemens

- S7-1200
- S7-1500
- TIA Portal

Rules:

- Use FBs with instance DBs.
- Always create relevant DBs in the software design.
- Use global DBs for HMI, configuration, diagnostics, alarms, recipes, retained values, and external interfaces.
- Use optimized DBs unless integration requirements demand otherwise.
- Use SCL for algorithms/state engines and LAD/FBD where site maintenance benefits.
- Before generating importable source, choose either External Source `.scl`/STL or SIMATIC SD `.s7dcl`.
- Do not emit bare Siemens SCL/STL snippets as import-ready files.
- Do not generate STL in SIMATIC SD. Siemens documents that STL is not supported in SIMATIC SD.
- For S7-1200/S7-1200 G2, do not assume STL support; prefer SCL unless the user confirms otherwise.

### Rockwell

- CompactLogix
- ControlLogix
- Studio 5000

Rules:

- Use UDTs for equipment command/status/config.
- Use AOIs only where lifecycle governance allows.
- Document controller/program tag scope and task period.
- Watch retentive tags, timers, latches, and first-scan behavior.
- Use `.L5X` XML for import-ready components. Plain `.ST` files are paste-in source, not native import files.
- Include target Logix Designer major version assumptions for generated `.L5X`.

### Delta

- ISPSoft
- WPLSoft

Rules:

- Confirm exact CPU/software before syntax.
- Use vendor-neutral design if instruction support is uncertain.
- Document retentive registers, memory ranges, and scan behavior.
- Do not promise import-ready files without a confirmed WPLSoft/ISPSoft import format or a user-supplied exported project/source file.

### Schneider

- EcoStruxure Machine Expert

Rules:

- Confirm product line and safety environment.
- Use POUs, DUTs, and GVLs for modular design.
- Keep safety logic separate from standard control.
- Use Machine Expert `.export` or PLCopen XML `.xml` for import-ready exchange. Plain `.ST` files are paste-in source.

### Omron

- Sysmac Studio

Rules:

- Confirm NJ/NX/other controller family.
- Use structured variables, programs, FBs, and tasks according to Sysmac standards.
- Document retained variables and safety CPU boundaries.
- Use supported Sysmac project formats or IEC 61131-10 XML where available. Plain `.ST` files are not generic import-ready files.

### CODESYS

- CODESYS V3.x
- WAGO
- IFM
- Eaton
- Festo
- Turck
- Raspberry Pi Runtime

Rules:

- Preferred structure: `GVL`, `DUT`, `FB_SequenceEngine`, `FB_Interlocks`, `FB_Alarms`, `PRG_Main`.
- Use `VAR PERSISTENT RETAIN` for retentive step words where supported.
- Use CASE-based step engines.
- Do not default to SFC.
- Use PLCopen XML `.xml` or CODESYS `.export` for import-ready exchange. Plain `.ST` files are paste-in source/object content references.

### Archive

- Archive PLC
- ESP32 CPU
- ESP-IDF

Rules:

- Treat Archive as a bespoke PLC platform, not a generic Arduino board.
- Generate ESP-IDF C/CMake projects when Archive is selected.
- Use `app_main`, FreeRTOS tasks, `esp_timer` or deterministic task delays, ESP-IDF GPIO/ADC drivers, NVS for retained values, and watchdog/error handling where appropriate.
- Keep PLC concepts explicit in C: raw IO mapping, conditioned IO, command logic, permissives, trips, alarms, retentive step words, diagnostics, and output mapping.
- Automatic sequences still require the standard retained Step Engine architecture.
- Use C structs/enums for command/status/config/alarm/runtime data.
- Use fail-safe defaults: set all outputs off during boot, fault, watchdog, invalid IO, invalid mode, communications loss, or failed initialization.
- Separate hardware abstraction from application logic: `io_map`, `plc_runtime`, equipment modules, comms, and `app_main`.
- For Wi-Fi communication, select and document STA, SoftAP, APSTA, SoftAP provisioning, BLE provisioning, ESP-NOW, MQTT, HTTP/REST, WebSocket, Modbus TCP, OTA, mDNS, and/or SNTP as applicable.
- For BLE communication, select and document NimBLE or Bluedroid, GATT server/client, advertising, provisioning, and/or BLE Mesh as applicable.
- Keep BLE/Wi-Fi callbacks outside the PLC scan. Use queues/shared command buffers and validate all remote commands through mode, permissive, interlock, and expiry checks.
- Confirm exact Archive hardware revision, GPIO map, analog input hardware, relay/transistor output type, comms ports, power-fail behavior, and isolation before generating final production firmware.
- Do not claim ESP-IDF code is ready for field commissioning without hardware bench test, IO proof test, watchdog test, brownout/power-cycle test, and FAT.
- Required file output format is an ESP-IDF project folder with `CMakeLists.txt`, `main/CMakeLists.txt`, and C/H source files. Label it **native source project**, not PLC vendor import.

## Industrial Network Engine

Support:

- Profinet
- Ethernet/IP
- Modbus TCP
- Modbus RTU
- EtherCAT
- CANOpen

Generate columns:

| Device | IP Address | Protocol | Node ID | PLC Interface | Data Exchanged | Notes |
| --- | --- | --- | --- | --- | --- | --- |
