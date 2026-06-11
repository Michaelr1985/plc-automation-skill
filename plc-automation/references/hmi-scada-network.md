# HMI, SCADA, And Network Design

## HMI Design Engine

Generate:

- Screen List
- Navigation Structure
- Faceplates
- Popups
- Alarm Pages
- Trend Pages
- Maintenance Pages

HMI screen list columns:

| Screen | Purpose | Main Objects | Commands | Security Level | Notes |
| --- | --- | --- | --- | --- | --- |

Faceplate fields:

- Equipment name
- Mode
- Command buttons
- Status
- Permissive summary
- Active trip
- Alarm summary
- Runtime/counter
- Maintenance/inhibit controls

Rules:

- Reset must not start equipment.
- Manual controls must show permissive/trip status.
- Bypasses/inhibits must be visible, alarmed, authorized, and logged when applicable.

## SCADA Design Engine

Support:

- Ignition
- FactoryTalk
- WinCC
- AVEVA
- Wonderware
- Citect
- VTScada

Generate:

- Required Tags
- Historian Tags
- Alarm Tags
- KPIs
- Reports

SCADA tag list columns:

| Tag | Source | Data Type | Purpose | Historian | Alarm | Report/KPI |
| --- | --- | --- | --- | --- | --- | --- |

Historian candidates:

- Process variables
- Setpoints
- Equipment run status
- Speed/output demand
- Trips and alarms
- Production totals
- Energy/runtime metrics

KPI candidates:

- Availability
- Runtime
- Starts per hour/day
- Fault count
- Throughput
- Energy use
- Downtime reason

## Network Design

Generate:

| Device | IP Address | Protocol | Node ID | VLAN/Zone | Data Exchanged | Notes |
| --- | --- | --- | --- | --- | --- | --- |

Rules:

- Separate OT control, SCADA/server, engineering, and corporate zones where appropriate.
- Use deterministic naming for switches, PLCs, HMIs, remote IO, VSDs, instruments, and gateways.
- Identify single points of failure for large/enterprise systems.
- Note cybersecurity assumptions without overstating compliance.
