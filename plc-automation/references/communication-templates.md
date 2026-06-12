# Industrial Communication Templates

Use this when designing or generating communication interfaces.

## Common Communication Table

| Device | Protocol | Role | Address/ID | Data Exchanged | Update Rate | Timeout | Fail State | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Profinet

Use for Siemens PLCs, Profinet VSDs, remote IO, HMIs, and instruments.

Generate:

- Device name.
- IP address.
- GSDML/device profile assumption.
- IO data words/bytes.
- Status word mapping.
- Control word mapping.
- Diagnostics/stale-data behavior.

Rules:

- Do not assume VSD telegram layout without model/profile.
- Separate raw fieldbus words from process logic tags.

## Ethernet/IP

Use for Rockwell PLCs, PowerFlex drives, remote IO, scanners/adapters.

Generate:

- Module/profile assumption.
- Assembly instances where applicable.
- RPI.
- Input/output data layout.
- Connection fault behavior.

Rules:

- Document produced/consumed tags where used.
- Connection loss must drive a configured safe state.

## Modbus TCP

Generate register maps:

| Register | Name | Type | R/W | Scale | Units | Source/Destination | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |

Rules:

- Separate command, status, analog, alarm, and configuration ranges.
- Use command expiry or transaction sequence numbers for remote start/stop commands.
- Define stale-data timeout.

## Modbus RTU

Generate:

- Baud rate, parity, stop bits.
- Slave IDs.
- Register map.
- Poll rate.
- Timeout/retry behavior.
- RS485 termination/biasing notes.

## MQTT

Generate:

- Broker URI.
- Client ID.
- Topic namespace.
- Telemetry topics.
- Alarm topics.
- Command request topics.
- Birth/will messages.
- QoS assumptions.
- Retained message policy.

Rules:

- Commands must include expiry or timestamp.
- Commands must pass local mode/permissive/interlock checks.
- Loss of broker must not leave equipment running because of stale remote commands.

## OPC UA

Generate:

- Server/client role.
- Namespace structure.
- Security policy.
- Certificate assumptions.
- Tag list.
- Update rate.

Rules:

- Use OPC UA for SCADA/enterprise integration where supported.
- Do not expose raw writable control tags without command arbitration.

## BLE GATT

Generate characteristic map:

| Service | Characteristic | Direction | Type | Security | Purpose |
| --- | --- | --- | --- | --- | --- |

Recommended services:

- Device information.
- Status.
- Alarms.
- Configuration.
- Commissioning/test.
- Command requests.

Rules:

- Prefer notify/read for status.
- Use write-with-response for commands/config.
- Require authentication for command/config writes.
- Add command expiry.

## Wi-Fi Commissioning

Generate:

- Provisioning method: SoftAP or BLE.
- Credential storage.
- Re-provisioning procedure.
- Local setup page or BLE service.
- Lockout after commissioning.

## ESP-NOW

Generate:

- Peer list.
- Message structure.
- Encryption assumption.
- Sequence number.
- Timeout/stale behavior.
- Fail-safe response.

Rules:

- Use only for non-safety remote IO/telemetry.
- Treat missed peer updates as stale and unsafe where process-critical.
