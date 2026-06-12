# Alarm Philosophy Standard

Use this for every PLC/HMI/SCADA project with alarms.

## Alarm Classes

| Severity | Meaning | Typical Response |
| --- | --- | --- |
| Critical | Safety-related diagnostic or immediate process/equipment stop | Immediate operator response, output de-energized where applicable |
| Major | Equipment/process trip or loss of automatic control | Stop affected equipment/process and require correction |
| Minor | Start inhibit, degraded operation, or non-critical device fault | Operator/maintenance response |
| Warning | Abnormal condition without immediate trip | Operator awareness and monitoring |
| Event | Informational state change | Log only |

## Alarm Numbering

Use project-specific ranges:

| Range | Category |
| --- | --- |
| 1000-1999 | Safety diagnostics and common trips |
| 2000-2999 | Motors, drives, pumps, conveyors |
| 3000-3999 | Instruments and process variables |
| 4000-4999 | Communications and remote IO |
| 5000-5999 | Sequences and interlocks |
| 6000-6999 | HMI/SCADA/security/configuration |
| 7000-7999 | Archive firmware/watchdog/retained-state diagnostics |

## Alarm Table Columns

| Alarm Number | Tag | Message | Severity | Cause | Effect | Operator Action | Reset Method | Historian | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Rules

- Alarm messages must be actionable.
- Every trip must have an alarm or diagnostic.
- Separate active condition, latched alarm, acknowledgement, and reset request.
- Reset clears only eligible latched alarms after the active cause clears.
- Reset must never start equipment.
- Avoid alarm floods by grouping repeated device faults where appropriate.
- Include communication stale-data alarms for networked devices.
- Include analog signal bad-quality alarms for critical PVs.
- Include power recovery and retained-state recovery diagnostics.
- Include alarm enable/inhibit rules only when authorized, visible, logged, and justified.

## Alarm Lifecycle

1. Active condition becomes true.
2. Alarm active bit becomes true.
3. Trip latch is set if the alarm is trip-class.
4. Operator acknowledges alarm.
5. Cause clears.
6. Reset request clears latched trip where allowed.
7. Alarm history/event is retained in HMI/SCADA/log.

## Archive Alarm Rules

Archive ESP-IDF projects must include alarms for:

- Watchdog fault/restart.
- Brownout or power recovery.
- Retained data load failure.
- IO initialization failure.
- Wi-Fi disconnected where required.
- BLE sensor stale where used.
- MQTT broker disconnected where used.
- OTA failure/rollback where OTA is used.

Do not store high-frequency alarm/event logs in NVS every scan. Use controlled writes, ring buffers, external logging, or SCADA/cloud storage.
