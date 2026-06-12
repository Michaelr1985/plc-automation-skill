# Archive Hardware Profiles

Use this for Archive ESP32 PLC projects. Archive hardware details must be explicit because ESP-IDF code depends on GPIO, ADC, output driver, isolation, and communications hardware.

## Required Hardware Profile

Every Archive project must include:

| Field | Required Detail |
| --- | --- |
| Hardware revision | Board version or prototype revision |
| ESP32 variant | ESP32, ESP32-S3, ESP32-C3, etc. |
| Supply | Input voltage, brownout threshold, PSU notes |
| Digital inputs | GPIO, polarity, pull-up/down, debounce, isolation |
| Digital outputs | GPIO, output type, safe state, load rating |
| Analog inputs | ADC channel, scaling, filtering, calibration |
| Analog outputs | DAC/PWM/external module, scaling, fail state |
| Comms | Wi-Fi, BLE, RS485, CAN, Ethernet, expansion bus |
| Retentive storage | NVS namespace/keys, save strategy |
| Watchdog | Task watchdog and hardware watchdog assumptions |
| Safety interface | External safety relay/safety controller feedback |

## GPIO Map Template

| Signal | Direction | GPIO/Channel | Polarity | Units | Range | Safe State | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| EStopHealthy | DI | TBC | TRUE = healthy | - | On/Off | FALSE | Monitor only |
| StartPB | DI | TBC | TRUE = pressed | - | On/Off | FALSE | Edge-detected |
| StopPB | DI | TBC | TRUE = pressed | - | On/Off | TRUE preferred | Fail-safe wiring recommended |
| ResetPB | DI | TBC | TRUE = pressed | - | On/Off | FALSE | Reset does not start |
| RunCmd | DO | TBC | TRUE = energize | - | On/Off | FALSE | Output off on boot/fault |
| AlarmLight | DO | TBC | TRUE = on | - | On/Off | FALSE | Diagnostic only |
| ProcessAI | AI | TBC | Raw ADC | Engineering unit | TBC | Invalid | Calibrate |

## Digital Input Template

Rules:

- Define hardware polarity and software healthy polarity separately.
- Use debounce/filtering for pushbuttons and noisy contacts.
- Treat missing/invalid safety healthy feedback as unhealthy.
- Do not use standard ESP32 GPIO as safety-rated input.
- Use opto-isolation or input conditioning appropriate to the plant voltage.

## Digital Output Template

Rules:

- Configure outputs before enabling the PLC scan.
- Default all outputs off at boot.
- De-energize outputs on fault, invalid mode, watchdog failure, communications loss, and reset.
- Document relay/transistor output type and load limitations.
- Do not drive contactor coils directly unless the Archive hardware is designed/rated for it.

## Analog Input Template

Rules:

- Define raw min/max, engineering min/max, units, and fault limits.
- Use filtering where process noise requires it.
- Treat ADC values outside believable limits as invalid.
- Require calibration on Archive hardware before field use.
- For 4-20 mA signals, document external shunt/conditioning hardware.

## Archive Communication Hardware

| Interface | Use | Notes |
| --- | --- | --- |
| Wi-Fi | MQTT, HTTP, OTA, Modbus TCP gateway, commissioning | Document antenna, enclosure, signal level, credentials |
| BLE | Provisioning, local diagnostics, mobile HMI | Document pairing/security and coexistence with Wi-Fi |
| RS485 | Modbus RTU, VSD/instrument networks | Document biasing, termination, isolation |
| CAN/TWAI | Device networks where supported | Document transceiver and termination |
| Ethernet | Preferred industrial comms where hardware supports it | Document PHY/module and IP plan |

## Archive Code Output Requirements

Generated Archive projects should include:

- `archive_io.c/.h`
- `plc_runtime.c/.h`
- `archive_config.h` when hardware profiles are non-trivial
- `archive_wifi.c/.h` when Wi-Fi is selected
- `archive_ble.c/.h` when BLE is selected
- `test_harness.c/.h` for bench/FAT test mode
- README with hardware assumptions and commissioning warnings

## Bench Test Requirements

Before field use:

- Confirm boot outputs are off.
- Confirm every input polarity.
- Confirm every output channel and isolation.
- Confirm analog scaling at low/mid/high points.
- Confirm watchdog/fault output off.
- Confirm brownout/power-cycle recovery.
- Confirm retained state recovery.
- Confirm comms-loss safe behavior.
- Confirm safety relay feedback is monitor-only and cannot be bypassed by firmware.
