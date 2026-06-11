# PLC Automation Skill Test Run

## Test Summary

Input file: `/Users/michaeljohnrautenbach1985/Downloads/effluent-upgrade-2026-06-10-2.json`

Customer: Coca cola  
Site: Valpre  
Project: Effluent upgrade  
Industry: Water  
PLC platform: Siemens  
Network: Profinet  
HMI/SCADA: Siemens 10 inch HMI, SCADA required  
Main process requirement: Control effluent plant output flow using VSDs and a flow meter.

## Skill Test Verdict

Result: PASS WITH CONTROLLED OUTPUT

The skill correctly produced design-first engineering content and did not generate a false Siemens import-ready source file. Because the intake confirms only "Siemens" and does not confirm CPU family, TIA Portal version, or source import method, the correct output level is engineering design, Siemens DB structure, and pseudocode. Importable Siemens `.scl` or `.s7dcl` generation should happen only after the target CPU and import workflow are confirmed.

| Check | Expected Skill Behavior | Result |
| --- | --- | --- |
| Design before code | Scope, architecture, IO, sequence, interlocks, alarms, recovery, HMI/SCADA, simulation, and vendor validation before code | PASS |
| Siemens DB rule | Include global DBs and FB instance DBs | PASS |
| Step engine rule | Use retentive step word as sequence source of truth | PASS |
| Safety-sensitive handling | Treat E-stop, dry run, overcurrent, drive faults, and reset behavior conservatively | PASS |
| Vendor file correctness | Do not label loose SCL/STL as TIA import-ready | PASS |
| Missing data handling | Separate confirmed facts, assumptions, and open questions | PASS |
| Code generation restraint | Provide pseudocode only until CPU/TIA/import path is confirmed | PASS |

## 1. Executive Summary

The proposed system is a Siemens-based effluent output flow control upgrade using four Danfoss VSD-driven motors, one IFM flow meter, a Siemens 10 inch panel-mounted HMI, Siemens SCADA integration, Profinet communications, Schneider switchgear, and an outdoor IP55 mild steel control panel.

The control philosophy is duty/standby cascade flow control. The PLC will maintain an operator-entered flow setpoint by starting the lead VSD pump, modulating speed, and cascading additional pumps when the running capacity is insufficient. The system must include dry-run protection, overcurrent/drive trip handling, manual and automatic modes, lead-lag/duty rotation, HMI operation, alarm logging, SCADA visibility, FAT, commissioning support, and safe recovery after faults or power loss.

## 2. Confirmed Facts

| Item | Confirmed Value |
| --- | --- |
| PLC vendor | Siemens |
| HMI | Siemens 10 inch HMI at panel door |
| SCADA | Required |
| Network | Profinet |
| Process | Effluent output flow control |
| Motors | 4 |
| VSDs | Danfoss |
| Motor size | 7.5, assumed kW pending confirmation |
| Instrument brand | IFM |
| Switchgear | Schneider |
| Supply voltage | 400 VAC |
| Control voltage | 24 VDC |
| Panel | Outdoor, IP55, mild steel |
| Modes | Manual and Auto |
| Start/stop | From HMI in auto and manual |
| Required control | Duty/standby/lead-lag and flow control |
| Required protection | Dry-run protection |
| Known alarms/trips | Over Current |
| AI count | 1 |
| Installation | Included |
| FAT | Included, client witness required |
| SAT | Not selected in intake |
| Shutdown | Required |
| Site visit | Required |

## 3. Assumptions

| Area | Assumption |
| --- | --- |
| CPU | Siemens S7-1200 or S7-1500, final selection pending IO, Profinet, SCADA, and memory requirements |
| Software | TIA Portal version not confirmed |
| VSD communication | Danfoss VSDs are preferably Profinet-capable; hardwired fallback requires additional DI/DO/AO |
| Flow meter | IFM 4-20 mA analog flow signal unless Profinet/IO-Link gateway is confirmed |
| Motor size | 7.5 means 7.5 kW |
| Pump arrangement | Four VSD pumps in parallel discharging to a common effluent outlet |
| Control objective | Maintain discharge flow setpoint using PID plus pump cascade staging |
| Safety | E-stop removes drive enable through safety-rated hardware; PLC monitors safety healthy status only |
| Dry-run | Dry-run input may come from level switch, suction pressure, or flow/pressure logic; final device TBC |
| SCADA | Siemens WinCC assumed unless client standard says otherwise |

## 4. Architecture Recommendation

Project size: Medium

Recommended architecture:

| Layer | Recommendation |
| --- | --- |
| PLC | Siemens S7-1200 or S7-1500 with Profinet |
| HMI | Siemens 10 inch Comfort/Unified panel, final model TBC |
| SCADA | Siemens WinCC tag integration for monitoring, alarms, trends, and reports |
| Drives | 4 x Danfoss VSDs on Profinet if supported |
| Instrumentation | IFM flow meter to AI module or network gateway |
| Network | Profinet OT network through industrial switch |
| Panel | IP55 outdoor mild steel with 24 VDC PSU, surge protection, ventilation/heating as required by site conditions |
| Code architecture | OB_Main calls FB_EffluentCascade, FB_VSD_Pump instances, FB_Interlocks, FB_Alarms, FB_FlowControl |
| Sequence style | Retentive step engine with `MainSeqStep` and `CascadeSeqStep` |

## 5. IO List

### Digital Inputs

| Tag | Type | Device | Description | Signal | Units | Range | Fail State | Assumption |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EFF_DI_EStopHealthy | DI | Safety relay | E-stop chain healthy monitor | 24 VDC | - | On/Off | False trips system | Confirm safety relay contact |
| EFF_DI_ControlPowerHealthy | DI | Panel PSU | 24 VDC control power healthy | 24 VDC | - | On/Off | False trips system | Recommended |
| EFF_DI_DryRunHealthy | DI | Dry-run device | Pump suction/dry-run permissive | 24 VDC | - | On/Off | False trips pumps | Device TBC |
| EFF_DI_VSD01_Ready | DI/Profinet | VSD01 | Drive ready | Digital/status word | - | On/Off | False trips VSD01 | Hardwired if no Profinet |
| EFF_DI_VSD01_Running | DI/Profinet | VSD01 | Drive running feedback | Digital/status word | - | On/Off | False stops cascade feedback | Hardwired if no Profinet |
| EFF_DI_VSD01_Fault | DI/Profinet | VSD01 | Drive fault | Digital/status word | - | On/Off | True trips VSD01 | Hardwired if no Profinet |
| EFF_DI_VSD01_Remote | DI/Profinet | VSD01 | Drive in remote/auto | Digital/status word | - | On/Off | False inhibits VSD01 | Recommended |
| EFF_DI_VSD02_Ready | DI/Profinet | VSD02 | Drive ready | Digital/status word | - | On/Off | False trips VSD02 | Hardwired if no Profinet |
| EFF_DI_VSD02_Running | DI/Profinet | VSD02 | Drive running feedback | Digital/status word | - | On/Off | False stops cascade feedback | Hardwired if no Profinet |
| EFF_DI_VSD02_Fault | DI/Profinet | VSD02 | Drive fault | Digital/status word | - | On/Off | True trips VSD02 | Hardwired if no Profinet |
| EFF_DI_VSD02_Remote | DI/Profinet | VSD02 | Drive in remote/auto | Digital/status word | - | On/Off | False inhibits VSD02 | Recommended |
| EFF_DI_VSD03_Ready | DI/Profinet | VSD03 | Drive ready | Digital/status word | - | On/Off | False trips VSD03 | Hardwired if no Profinet |
| EFF_DI_VSD03_Running | DI/Profinet | VSD03 | Drive running feedback | Digital/status word | - | On/Off | False stops cascade feedback | Hardwired if no Profinet |
| EFF_DI_VSD03_Fault | DI/Profinet | VSD03 | Drive fault | Digital/status word | - | On/Off | True trips VSD03 | Hardwired if no Profinet |
| EFF_DI_VSD03_Remote | DI/Profinet | VSD03 | Drive in remote/auto | Digital/status word | - | On/Off | False inhibits VSD03 | Recommended |
| EFF_DI_VSD04_Ready | DI/Profinet | VSD04 | Drive ready | Digital/status word | - | On/Off | False trips VSD04 | Hardwired if no Profinet |
| EFF_DI_VSD04_Running | DI/Profinet | VSD04 | Drive running feedback | Digital/status word | - | On/Off | False stops cascade feedback | Hardwired if no Profinet |
| EFF_DI_VSD04_Fault | DI/Profinet | VSD04 | Drive fault | Digital/status word | - | On/Off | True trips VSD04 | Hardwired if no Profinet |
| EFF_DI_VSD04_Remote | DI/Profinet | VSD04 | Drive in remote/auto | Digital/status word | - | On/Off | False inhibits VSD04 | Recommended |

### Digital Outputs

| Tag | Type | Device | Description | Signal | Units | Range | Fail State | Assumption |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EFF_DO_VSD01_RunEnable | DO/Profinet | VSD01 | Run command/enable | 24 VDC/status word | - | On/Off | Off stops drive | Profinet preferred |
| EFF_DO_VSD02_RunEnable | DO/Profinet | VSD02 | Run command/enable | 24 VDC/status word | - | On/Off | Off stops drive | Profinet preferred |
| EFF_DO_VSD03_RunEnable | DO/Profinet | VSD03 | Run command/enable | 24 VDC/status word | - | On/Off | Off stops drive | Profinet preferred |
| EFF_DO_VSD04_RunEnable | DO/Profinet | VSD04 | Run command/enable | 24 VDC/status word | - | On/Off | Off stops drive | Profinet preferred |
| EFF_DO_VSD_Reset | DO/Profinet | VSDs | Drive fault reset pulse | 24 VDC/status word | - | Pulse | Off no reset | Must not start equipment |
| EFF_DO_Pilot_Run | DO | Panel | Run pilot light | 24 VDC | - | On/Off | Off | Recommended |
| EFF_DO_Pilot_Fault | DO | Panel | Fault pilot light | 24 VDC | - | On/Off | Off | Recommended |
| EFF_DO_Pilot_Auto | DO | Panel | Auto mode pilot light | 24 VDC | - | On/Off | Off | Recommended |
| EFF_DO_RemoteRunning | DO | External | Remote common running signal | 24 VDC | - | On/Off | Off | Required |
| EFF_DO_RemoteFault | DO | External | Remote common fault signal | 24 VDC | - | On/Off | Off | Required |

### Analog Inputs

| Tag | Type | Device | Description | Signal | Units | Range | Fail State | Assumption |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EFF_AI_FlowRaw | AI | IFM flow meter | Effluent output flow | 4-20 mA | m3/h | TBC | Bad quality trips auto/cascade | Scaling TBC |

### Analog Outputs

| Tag | Type | Device | Description | Signal | Units | Range | Fail State | Assumption |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EFF_AO_VSD01_SpeedRef | AO/Profinet | VSD01 | Speed reference | 4-20 mA or Profinet | Hz/% | 0-100% | 0% | Only required if no Profinet speed control |
| EFF_AO_VSD02_SpeedRef | AO/Profinet | VSD02 | Speed reference | 4-20 mA or Profinet | Hz/% | 0-100% | 0% | Only required if no Profinet speed control |
| EFF_AO_VSD03_SpeedRef | AO/Profinet | VSD03 | Speed reference | 4-20 mA or Profinet | Hz/% | 0-100% | 0% | Only required if no Profinet speed control |
| EFF_AO_VSD04_SpeedRef | AO/Profinet | VSD04 | Speed reference | 4-20 mA or Profinet | Hz/% | 0-100% | 0% | Only required if no Profinet speed control |

## 6. Sequence Design

### Main Sequence

Retentive step word: `DB_EFF_Retain.MainSeqStep`  
Owner: `FB_EffluentCascade`  
Step spacing: 10-step medium sequence  
Purpose: Manage automatic effluent flow control lifecycle.

Power recovery behavior: Retain the step value, remove all VSD run commands on first scan, validate safety/permissives/feedback/flowmeter quality, then require operator acknowledgement before resuming automatic control.

Fault recovery behavior: On trip, remove run commands, latch alarm, move to step 90. Reset is allowed only when the unsafe condition clears. Reset returns the sequence to step 0 and never starts a drive.

Manual reset behavior: HMI reset clears latched trips only when active causes are clear. A new start command is required.

| Step Number | Step Name | Active Actions | Transition Condition | Next Step | Fault Condition | Recovery Action |
| ---: | --- | --- | --- | ---: | --- | --- |
| 0 | Stopped | All auto run commands off; PID disabled; speed refs 0% | HMI AutoStart pulse and permissives OK | 10 | Any critical permissive lost | Stay 0, alarm |
| 10 | Precheck | Validate E-stop healthy, dry-run healthy, flowmeter healthy, at least one VSD available | Prechecks OK | 20 | Precheck fails | 90 | Correct cause and reset |
| 20 | Start Lead Pump | Select duty lead pump, enable lead VSD, ramp minimum speed | Lead VSD running feedback healthy | 30 | Start timeout or VSD fault | 90 | Remove command, latch trip |
| 30 | Flow Control Running | Enable PID, control running pump speed, monitor demand | Flow below setpoint with speed high for cascade delay | 40 | Flowmeter fail, dry-run trip, E-stop unhealthy, all pumps unavailable | 90 | Stop all drives, latch trip |
| 40 | Cascade Active | Start additional available pumps as required, balance speed demand, rotate duty by runtime/starts | Stop request or demand reduces below de-stage threshold | 30 or 0 | Any running pump trips; no standby available and flow cannot be controlled | 90 | Failover if possible or trip |
| 90 | Faulted | All auto run commands off; PID disabled; alarm latched | Reset pulse and faults clear | 0 | Fault remains active | 90 | Operator correction required |

### Pump/VSD Sequence

Retentive step word: `DB_EFF_Retain.VSDxxSeqStep` for each VSD or retained array `VSDSeqStep[1..4]`  
Owner: `FB_VSD_Pump`

| Step Number | Step Name | Active Actions | Transition Condition | Next Step | Fault Condition | Recovery Action |
| ---: | --- | --- | --- | ---: | --- | --- |
| 0 | Available Stopped | Run command off, speed ref 0% | Start request and permissive OK | 10 | Drive unavailable | 90 | Keep isolated |
| 10 | Starting | Run command on, speed ref minimum | Running feedback on before timeout | 20 | Start timeout, drive fault, local mode | 90 | Stop command and latch trip |
| 20 | Running | Follow cascade speed reference | Stop request | 30 | Drive fault, feedback lost, permissive lost | 90 | Stop and report to cascade |
| 30 | Stopping | Run command off, speed ref 0% | Running feedback off | 0 | Stop timeout | 90 | Investigate drive/status |
| 90 | Faulted | Run command off, speed ref 0% | Reset and active causes clear | 0 | Cause remains | 90 | Maintenance/operator action |

## 7. Interlock Matrix

| Equipment | Interlock | Action | Reset Method | Severity |
| --- | --- | --- | --- | --- |
| All VSDs | E-stop chain unhealthy | Remove run commands; safety circuit removes drive enable | Hardware reset plus PLC alarm acknowledgement | Critical |
| All VSDs | Dry-run unhealthy | Stop all pumps and inhibit restart | Reset after dry-run condition clears | Major |
| All VSDs | Flow meter signal invalid | Stop auto cascade, inhibit PID control | Reset after valid signal restored | Major |
| Individual VSD | Drive fault/overcurrent | Stop affected VSD, start standby if available | Drive reset then PLC reset | Major |
| Individual VSD | Drive not ready | Inhibit start of affected VSD | Automatic when ready returns, alarm acknowledgement if latched | Minor |
| Individual VSD | Drive in local mode | Inhibit remote start of affected VSD | Automatic when remote restored | Minor |
| Individual VSD | Start feedback timeout | Stop affected VSD and mark unavailable | Reset after cause clears | Major |
| Cascade | No VSD available | Stop auto sequence and alarm | Reset after at least one VSD available | Major |
| Cascade | Stop command | Controlled stop of all running VSDs | New start command | Warning |
| Panel | Control power unhealthy | Stop outputs where possible, alarm on recovery | Restore power and acknowledge | Major |

## 8. Alarm List

| Alarm Number | Alarm Message | Severity | Cause | Operator Action | Reset Method |
| ---: | --- | --- | --- | --- | --- |
| 1001 | Effluent E-stop chain unhealthy | Critical | E-stop/safety relay monitor open | Inspect and reset safety circuit | Hardware reset plus HMI acknowledge |
| 1002 | Effluent dry-run protection active | Major | Dry-run input unhealthy | Verify suction/source condition | HMI reset after condition clears |
| 1003 | Effluent flow meter signal invalid | Major | AI fault, out of range, bad quality | Check IFM flow meter and wiring | HMI reset after signal valid |
| 1011 | VSD01 fault or overcurrent | Major | Danfoss VSD fault/status | Inspect VSD fault code and motor | Drive reset plus HMI reset |
| 1012 | VSD02 fault or overcurrent | Major | Danfoss VSD fault/status | Inspect VSD fault code and motor | Drive reset plus HMI reset |
| 1013 | VSD03 fault or overcurrent | Major | Danfoss VSD fault/status | Inspect VSD fault code and motor | Drive reset plus HMI reset |
| 1014 | VSD04 fault or overcurrent | Major | Danfoss VSD fault/status | Inspect VSD fault code and motor | Drive reset plus HMI reset |
| 1021 | VSD01 failed to start | Major | Run command on but feedback absent | Check drive, motor, isolator, comms | HMI reset after cause clears |
| 1022 | VSD02 failed to start | Major | Run command on but feedback absent | Check drive, motor, isolator, comms | HMI reset after cause clears |
| 1023 | VSD03 failed to start | Major | Run command on but feedback absent | Check drive, motor, isolator, comms | HMI reset after cause clears |
| 1024 | VSD04 failed to start | Major | Run command on but feedback absent | Check drive, motor, isolator, comms | HMI reset after cause clears |
| 1030 | No effluent VSD available | Major | All VSDs faulted/unavailable/local | Restore at least one VSD | HMI reset |
| 1040 | Flow setpoint not achieved | Warning | Flow below SP while cascade at maximum | Check process demand, pump condition, blockage | Auto clears or acknowledge |
| 1050 | Profinet communication fault | Major | PLC lost communication to drive/HMI/remote IO | Check network and device power | Auto clears plus acknowledge |

## 9. Power Recovery Strategy

| Event | Required Behavior |
| --- | --- |
| Power loss | VSD run commands de-energize. Retentive sequence step remains stored. |
| PLC reboot | First scan clears output commands and requires validation before restart. |
| HMI reboot | PLC continues safe state; no command is assumed from stale HMI bits. |
| E-stop | Safety hardware removes drive enable. PLC records diagnostic only. |
| Drive communication loss | Affected drive marked unavailable; running drive trips if feedback cannot be trusted. |
| Flowmeter failure | Automatic flow control stops because PID feedback is invalid. |
| Reset after fault | Reset clears trip only. It does not start pumps or advance sequence. |
| Resume | Operator acknowledgement and fresh start command required unless a documented risk-assessed auto-resume mode is later approved. |

## 10. HMI Design

| Screen | Purpose | Main Objects | Commands | Security Level | Notes |
| --- | --- | --- | --- | --- | --- |
| Effluent Overview | Main operating screen | Flow PV/SP, cascade status, VSD summary, active alarm banner | Start, Stop, Reset, Auto/Manual | Operator | First screen on panel |
| VSD Faceplate | Per-drive operation | Mode, ready, run, fault, speed, runtime, starts, permissives | Manual start/stop, reset, inhibit | Operator/Maintenance | Reset must not start |
| Flow Control | PID and cascade settings | Flow PV, SP, output, staging thresholds, trend | SP edit, PID tuning by authorized user | Supervisor | Tuning protected |
| Alarm Page | Alarm handling | Active alarms, history, severity | Acknowledge, reset request | Operator | Reset separated from acknowledge |
| Trends | Process diagnostics | Flow PV/SP, speed refs, running pumps | Time range, cursor | Operator | Useful for SCADA comparison |
| Maintenance | Runtime and inhibit controls | Runtime, starts, availability, forced unavailable | Maintenance inhibit, duty rotation reset | Maintenance | Inhibits visible and alarmed |
| Settings | Commissioning parameters | Scaling, timeouts, delays, min/max speeds | Parameter edits | Engineer | Password protected |

## 11. SCADA Design

| Tag | Source | Data Type | Purpose | Historian | Alarm | Report/KPI |
| --- | --- | --- | --- | --- | --- | --- |
| EFF_Flow_PV_m3h | DB_EFF_Status | Real | Measured effluent flow | Yes | High/low optional | Flow trend |
| EFF_Flow_SP_m3h | DB_EFF_HMI | Real | Operator flow setpoint | Yes | No | Setpoint change record |
| EFF_Cascade_ActivePumps | DB_EFF_Status | Int | Number of running VSDs | Yes | No | Utilization |
| EFF_VSD01_Running | DB_EFF_Status | Bool | VSD01 running | Yes | No | Runtime |
| EFF_VSD01_Fault | DB_EFF_Alarms | Bool | VSD01 fault | Yes | Yes | Fault count |
| EFF_VSD01_SpeedPct | DB_EFF_Status | Real | VSD01 speed demand/feedback | Yes | No | Energy/runtime |
| EFF_VSD02_Running | DB_EFF_Status | Bool | VSD02 running | Yes | No | Runtime |
| EFF_VSD02_Fault | DB_EFF_Alarms | Bool | VSD02 fault | Yes | Yes | Fault count |
| EFF_VSD03_Running | DB_EFF_Status | Bool | VSD03 running | Yes | No | Runtime |
| EFF_VSD03_Fault | DB_EFF_Alarms | Bool | VSD03 fault | Yes | Yes | Fault count |
| EFF_VSD04_Running | DB_EFF_Status | Bool | VSD04 running | Yes | No | Runtime |
| EFF_VSD04_Fault | DB_EFF_Alarms | Bool | VSD04 fault | Yes | Yes | Fault count |
| EFF_DryRun_Trip | DB_EFF_Alarms | Bool | Dry-run trip | Yes | Yes | Downtime |
| EFF_EStop_Unhealthy | DB_EFF_Alarms | Bool | E-stop monitor alarm | Yes | Yes | Safety diagnostic |

Recommended KPIs: pump availability, runtime per pump, starts per pump, fault count, flow total, flow setpoint achievement, downtime by cause.

## 12. Network Design

IP addresses are placeholders pending site standard.

| Device | IP Address | Protocol | Node ID | VLAN/Zone | Data Exchanged | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| PLC_EFF_01 | 192.168.10.10 | Profinet | PLC | OT Control | IO, VSD control, HMI/SCADA data | Siemens CPU TBC |
| HMI_EFF_01 | 192.168.10.20 | Profinet/S7 | HMI | OT Control | Operator commands/status | Siemens 10 inch |
| VSD_EFF_01 | 192.168.10.31 | Profinet | Drive 1 | OT Control | Run, speed, status, fault | Danfoss option card TBC |
| VSD_EFF_02 | 192.168.10.32 | Profinet | Drive 2 | OT Control | Run, speed, status, fault | Danfoss option card TBC |
| VSD_EFF_03 | 192.168.10.33 | Profinet | Drive 3 | OT Control | Run, speed, status, fault | Danfoss option card TBC |
| VSD_EFF_04 | 192.168.10.34 | Profinet | Drive 4 | OT Control | Run, speed, status, fault | Danfoss option card TBC |
| SCADA_EFF | TBC | S7/OPC UA | SCADA | OT Server | Tags, alarms, trends | WinCC assumed |
| SW_EFF_01 | 192.168.10.2 | Managed switch | Switch | OT Control | Network diagnostics | Managed switch recommended |

## 13. Simulation Plan

| Test ID | Scenario | Initial State | Action | Expected Result | Evidence |
| --- | --- | --- | --- | --- | --- |
| SIM-001 | Normal auto start | Step 0, permissives OK | Press Auto Start | Lead VSD starts, flow PID enabled | PLCSIM trace/screenshots |
| SIM-002 | Cascade staging | One VSD running at high speed | Reduce simulated flow below SP | Next available VSD starts after delay | Trend and step log |
| SIM-003 | De-stage | Multiple VSDs running, flow above SP | Simulate low demand | Extra VSD stops after delay | Trend and VSD status |
| SIM-004 | Dry-run trip | Running | Drop dry-run healthy input | All VSD commands off, alarm latched | Alarm list and output trace |
| SIM-005 | Flowmeter failure | Running | Force AI bad/out of range | Auto control trips, PID disabled | Alarm and sequence step |
| SIM-006 | VSD fault failover | VSD01 running, VSD02 available | Force VSD01 fault | VSD01 stops; standby starts if permitted | Step log |
| SIM-007 | No pumps available | All VSDs unavailable | Start auto | Sequence goes to fault/no available VSD | Alarm evidence |
| SIM-008 | E-stop | Running | Drop E-stop healthy | Commands off, critical alarm, reset required | Output trace |
| SIM-009 | Power loss/restart | Running at step 30/40 | Simulate PLC restart | Outputs off; retained step held; operator ack required | First-scan test |
| SIM-010 | Reset behavior | Faulted | Press reset with faults clear | Trip clears, no pump starts | Output trace |

## 14. Vendor Validation

Vendor Code Standard Check

| Field | Result |
| --- | --- |
| PLC | Siemens, exact CPU TBC |
| Software | TIA Portal, version TBC |
| Language | SCL recommended for cascade/PID/step engine; LAD/FBD acceptable for maintenance-facing simple interlocks if required |
| Memory Strategy | Optimized DBs recommended unless SCADA/legacy integration requires non-optimized access |
| Retentive Strategy | Retentive global DB for sequence steps, runtimes, starts, duty order, and selected configuration |
| Step Engine Strategy | CASE-based SCL step engines using retained `MainSeqStep` and VSD sequence steps |
| Naming Convention | `EFF_<Area>_<Equipment>_<Signal>` and Siemens FB/DB naming |
| File Output Format | Engineering reference only in this test. Future importable output must be `.scl` External Source or `.s7dcl` SIMATIC SD with complete wrappers. |
| Risks | CPU/TIA version, VSD comms profile, IO details, flow scaling, dry-run device, and safety relay design not confirmed |
| Assumptions | Siemens S7-1200/S7-1500, Profinet VSD comms, WinCC SCADA |

Import decision: Do not generate import-ready Siemens code yet. The next step is to confirm CPU family, TIA Portal version, and whether the customer wants External Source `.scl` or SIMATIC SD `.s7dcl`.

## 15. PLC Logic Structure

### Siemens Blocks

| Block | Type | Purpose | DB Requirement |
| --- | --- | --- | --- |
| OB1 | OB | Main cyclic call | None |
| FB_EffluentCascade | FB | Overall cascade sequence and pump selection | Instance DB `DB_FB_EffluentCascade` |
| FB_VSD_Pump | FB | Reusable VSD command/status/trip block | Instance DB per VSD or multi-instance in cascade FB |
| FB_FlowControl | FB | Flow PID, setpoint handling, speed demand | Instance DB `DB_FB_FlowControl` |
| FB_EFF_Interlocks | FB | Interlock summary and permissives | Instance DB `DB_FB_EFF_Interlocks` |
| FB_EFF_Alarms | FB | Alarm latching, reset, severity mapping | Instance DB `DB_FB_EFF_Alarms` |
| FC_EFF_Scaling | FC | Flow meter scaling and signal validation | None |

### Siemens DB Design

| DB | Type | Retentive | HMI Writable | Purpose |
| --- | --- | --- | --- | --- |
| DB_EFF_HMI | Global DB | Selected members only | Yes | HMI commands, setpoints, operator acknowledgements |
| DB_EFF_Config | Global DB | Yes | Engineer only | Flow scaling, timeouts, min/max speeds, cascade delays |
| DB_EFF_Status | Global DB | No | No | Read-only process status for HMI/SCADA |
| DB_EFF_Alarms | Global DB | Yes for latched trips | Reset bits only | Active alarms, latched trips, severity/status |
| DB_EFF_Diagnostics | Global DB | Yes where useful | No | Last trip code, comms status, first-scan recovery flags |
| DB_EFF_Retain | Global DB | Yes | Limited | `MainSeqStep`, `VSDSeqStep[1..4]`, runtime, starts, duty order |
| DB_EFF_Recipe | Global DB | Yes | Supervisor/engineer | Optional flow profiles and setpoint presets |
| DB_FB_EffluentCascade | Instance DB | As needed | No | FB static memory |
| DB_FB_FlowControl | Instance DB | As needed | Engineer only for tuning | PID and flow-control static memory |
| DB_FB_EFF_Interlocks | Instance DB | No | No | Interlock FB static memory |
| DB_FB_EFF_Alarms | Instance DB | Yes for alarm latches | Reset only | Alarm FB static memory |

## 16. Draft Code/Pseudocode

Artifact status: Engineering reference, not Siemens import-ready source.

```text
OB1:
    Scale flow AI and validate signal.
    Build raw VSD status from Profinet or hardwired IO.
    Call FB_EFF_Interlocks.
    Call FB_EFF_Alarms.
    Call FB_EffluentCascade.
    Map final commands to VSD outputs only once.
    Map status and alarms to HMI/SCADA DBs.

FB_EffluentCascade:
    On first scan:
        Clear all run commands and speed references.
        Set RecoveryAckRequired if previous step was running/cascade.

    MainTrip :=
        NOT EStopHealthy OR
        NOT DryRunHealthy OR
        NOT FlowSignalValid OR
        NoVsdAvailable;

    IF MainTrip THEN
        Latch trip.
        MainSeqStep := 90;
    END_IF;

    CASE DB_EFF_Retain.MainSeqStep OF
        0:
            Stop all VSD auto commands.
            Disable PID.
            IF AutoStartPulse AND PermissiveOK AND NOT RecoveryAckRequired THEN
                MainSeqStep := 10;
            END_IF;

        10:
            Validate common permissives and at least one VSD available.
            IF PrecheckOK THEN
                MainSeqStep := 20;
            ELSE
                MainSeqStep := 90;
            END_IF;

        20:
            Select lead VSD by duty order and availability.
            Command lead VSD start at minimum speed.
            IF LeadRunning THEN
                MainSeqStep := 30;
            ELSIF LeadStartTimeout THEN
                MainSeqStep := 90;
            END_IF;

        30:
            Enable flow PID.
            Send PID speed demand to running VSDs.
            IF StopRequest THEN
                MainSeqStep := 0;
            ELSIF NeedMoreCapacity THEN
                MainSeqStep := 40;
            END_IF;

        40:
            Start next available VSD after cascade delay.
            Share or assign speed demand according to final drive strategy.
            IF StopRequest THEN
                MainSeqStep := 0;
            ELSIF DemandReduced THEN
                Stop last staged VSD and return to 30.
            END_IF;

        90:
            Stop all VSD auto commands.
            Disable PID.
            IF ResetPulse AND FaultsClear THEN
                MainSeqStep := 0;
            END_IF;

        ELSE:
            MainSeqStep := 90;
    END_CASE;
```

## 17. Code Review

| Review Area | Result |
| --- | --- |
| Safety boundary | PLC monitors E-stop only; safety removal of power/enable remains hardware/safety-rated |
| Reset-start hazard | Reset clears alarms only and does not start pumps |
| Duplicate outputs | Final VSD outputs are mapped in one place only |
| Retentive risk | Retained step is used, but first scan clears commands and requires acknowledgement |
| Sequence clarity | Main and VSD sequence tables define transitions and recovery |
| Vendor syntax risk | No Siemens importable code emitted until CPU/TIA/import path confirmed |
| Open risk | Final dry-run device and VSD communication profile must be confirmed before code |

## 18. Documentation List

Recommended project documents:

- Functional Design Specification
- IO list
- Network list
- Alarm list
- Interlock matrix
- Cause and effect matrix
- Siemens block and DB list
- HMI screen specification
- SCADA tag list
- Simulation test sheet
- FAT document
- Commissioning checklist
- Operator quick guide
- As-built backup and handover record

## 19. Engineering Estimate

Budgetary estimate only, pending site visit and final IO/VSD/SCADA details.

| Work Package | Low | Expected | High | Basis |
| --- | ---: | ---: | ---: | --- |
| PLC Engineering | 32 h | 48 h | 72 h | Four VSD cascade, flow PID, Siemens DBs, interlocks, alarms |
| HMI Engineering | 18 h | 28 h | 42 h | Overview, faceplates, trends, alarms, settings |
| SCADA Engineering | 12 h | 24 h | 40 h | Tags, alarms, historian trends, basic reports |
| Testing/FAT | 16 h | 24 h | 36 h | PLCSIM, sequence, alarm, recovery tests |
| Commissioning | 24 h | 40 h | 64 h | Loop checks, VSD tests, tuning, shutdown window |
| Documentation | 12 h | 20 h | 32 h | FDS, IO, FAT, commissioning pack |
| Travel/Site Coordination | 8 h | 16 h | 32 h | Site visit and commissioning logistics |
| Total | 122 h | 200 h | 318 h | Excludes major redesign or unavailable site windows |

## 20. FAT/SAT Plan

### FAT

| Test ID | Requirement | Procedure | Expected Result | Pass/Fail | Evidence | Comments |
| --- | --- | --- | --- | --- | --- | --- |
| FAT-001 | HMI navigation | Open every screen | All screens available and tags display valid values |  | Screenshot |  |
| FAT-002 | VSD faceplates | Simulate each VSD ready/running/fault | Status and alarms update correctly |  | Screenshot/log |  |
| FAT-003 | Auto start | Start auto with permissives OK | Lead VSD starts and PID enables |  | Trend |  |
| FAT-004 | Cascade | Simulate demand above one-pump capacity | Additional VSD starts after delay |  | Trend |  |
| FAT-005 | Dry-run | Drop dry-run healthy | All pumps stop and alarm latches |  | Alarm trace |  |
| FAT-006 | Flowmeter fail | Force AI fault/out of range | Auto stops, alarm latches |  | Alarm trace |  |
| FAT-007 | E-stop monitor | Drop E-stop healthy | Commands off and critical alarm active |  | Trace |  |
| FAT-008 | Power recovery | Restart PLC from running state | Outputs off, recovery ack required |  | Trace |  |
| FAT-009 | Reset behavior | Reset from fault | Alarm clears only; no pump starts |  | Trace |  |
| FAT-010 | SCADA tags | Verify selected tags | SCADA reads PV/SP/status/alarm tags |  | Tag screenshot |  |

### SAT / Commissioning

SAT was not selected in the intake, but commissioning is included. The commissioning checklist should still include site verification of IO, loop checks, VSD direction, scaling, alarms, and safe recovery. Any live process tests require client operations approval, shutdown coordination, and LOTO/permit compliance.

## 21. Open Questions

| Question | Why It Matters |
| --- | --- |
| Which Siemens CPU is required: S7-1200 or S7-1500? | Determines memory, task structure, Profinet capacity, and code/import approach |
| Which TIA Portal version will be used? | Determines source import format and compatibility |
| Should generated Siemens files be External Source `.scl` or SIMATIC SD `.s7dcl`? | Prevents TIA import failure |
| Are the Danfoss VSDs Profinet-capable? | Determines hardwired IO vs network control |
| What exact Danfoss VSD model and telegram/profile are used? | Required for command/status word mapping |
| What is the IFM flow meter model, range, and signal type? | Required for analog scaling and fault limits |
| What is the dry-run protection device? | Required for trip logic and IO |
| Are the four motors all 7.5 kW? | Required for panel/VSD/switchgear sizing |
| Is SCADA Siemens WinCC, and what tag/report standard applies? | Required for SCADA deliverables |
| Does site require a formal SAT even though intake says no? | Commissioning with live effluent flow usually needs site acceptance evidence |

## Next Code Generation Gate

Before generating Siemens code files, confirm:

1. Siemens CPU family and order number.
2. TIA Portal version.
3. Preferred source workflow: External Source `.scl` or SIMATIC SD `.s7dcl`.
4. VSD communication method and Danfoss profile.
5. Flow meter scaling and dry-run source.

Only after those items are confirmed should the skill generate complete TIA-compatible source wrappers and DB declarations.
