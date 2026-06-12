# HMI And SCADA Screen Packs

Use this when generating HMI, SCADA, Archive web HMI, or BLE/mobile diagnostic interfaces.

## Standard Screen Pack

| Screen | Purpose | Main Objects | Commands | Security |
| --- | --- | --- | --- | --- |
| Overview | Process status and primary operation | Process graphic, equipment summary, active alarms, key PV/SP | Start, stop, reset, mode | Operator |
| Equipment Faceplate | Per-device control and diagnosis | Mode, status, permissives, trips, runtime, starts | Manual start/stop, reset, inhibit | Operator/Maintenance |
| Alarm Page | Alarm response | Active alarms, history, severity, timestamp | Acknowledge, reset request | Operator |
| Trends | Process analysis | PV/SP/output, drive speed/current, runtime | Time range, cursor | Operator |
| Manual Controls | Maintenance operation | Individual equipment controls, permissives, active trips | Jog/start/stop where allowed | Maintenance |
| Maintenance | Service functions | Inhibits, runtime reset, counters, device availability | Inhibit, reset counters | Maintenance |
| Settings | Configuration | Scaling, delays, timeouts, PID/cascade parameters | Edit setpoints/config | Supervisor/Engineer |
| IO Diagnostics | Commissioning and fault-finding | Raw IO, conditioned IO, force/sim status if allowed | Simulation enable only in FAT | Engineer |
| Communications | Network status | Device status, IPs, fieldbus quality, stale data | Reconnect where safe | Engineer |
| Commissioning/Test | FAT/SAT support | Test harness status, steps, pass/fail, evidence | Enable test, reset test | Engineer |

## Faceplate Standard

Every equipment faceplate must show:

- Equipment name.
- Mode.
- Command source.
- Ready/available/running/faulted status.
- Run command and running feedback.
- Permissive summary.
- Active trip summary.
- Alarm summary.
- Speed/output demand where applicable.
- Runtime and starts.
- Maintenance inhibit status.
- Last trip cause.

Commands:

- Start.
- Stop.
- Reset.
- Manual/auto selection where permitted.
- Maintenance inhibit with authorization and alarm/logging.

Rules:

- Reset must not start equipment.
- Manual commands must still show and enforce permissives/trips.
- Inhibits/bypasses must be visible, authorized, alarmed, and logged where applicable.
- Safety functions must not be bypassable from HMI.

## Archive Web/BLE HMI

For Archive ESP-IDF:

- Web HMI may use HTTP/REST and WebSocket.
- BLE HMI may use GATT characteristics for status/config/limited commands.
- Local UI must not directly write outputs.
- Commands must enter the PLC command layer and pass mode/permissive/interlock/expiry checks.
- Expose test harness status in commissioning builds only.
- Do not expose Wi-Fi credentials or security secrets through plain status endpoints.

## SCADA Tag Pack

Generate tags for:

- Process PV/SP/output.
- Equipment command/status/fault.
- Permissives and trips.
- Alarms and acknowledgement.
- Runtime/starts.
- Communications status and stale data.
- Test harness pass/fail status where relevant.
- Energy/current/speed where VSD data is available.

## Security Levels

| Level | Role | Typical Permissions |
| --- | --- | --- |
| View | Operator/view-only | View status, alarms, trends |
| Operator | Operator | Start/stop/reset where permitted |
| Maintenance | Maintenance | Manual controls, inhibit devices, reset counters |
| Supervisor | Supervisor | Setpoints, recipes, selected tuning |
| Engineer | Engineer | Scaling, timeouts, test mode, communications config |
| Admin | System owner | Users, security, remote access, firmware/update controls |
