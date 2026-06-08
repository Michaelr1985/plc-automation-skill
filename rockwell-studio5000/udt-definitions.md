# UDT Definitions

Create these user-defined data types in Studio 5000.

## UDT_VSD_Cmd

| Member | Type | Description |
| --- | --- | --- |
| StartReq | BOOL | Momentary start request from cascade |
| StopReq | BOOL | Stop request |
| ResetReq | BOOL | Fault reset request |
| Inhibit | BOOL | Maintenance/operator inhibit |
| RunCmd | BOOL | Command to run VSD |
| SpeedRefPct | REAL | Speed reference, 0.0 to 100.0 percent |

## UDT_VSD_Sts

| Member | Type | Description |
| --- | --- | --- |
| Ready | BOOL | VSD ready/healthy and permissive from drive |
| Running | BOOL | VSD run feedback |
| Faulted | BOOL | VSD fault active |
| Local | BOOL | VSD in local/keypad control |
| Available | BOOL | Calculated available for cascade |
| TripLatched | BOOL | Latched PLC trip |
| StartFail | BOOL | Failed to prove running after command |
| RuntimeHours | REAL | Runtime total |
| SpeedFbPct | REAL | Optional actual speed feedback |

## UDT_VSD

| Member | Type | Description |
| --- | --- | --- |
| Cmd | UDT_VSD_Cmd | VSD commands |
| Sts | UDT_VSD_Sts | VSD status |

## UDT_Cascade_Cmd

| Member | Type | Description |
| --- | --- | --- |
| AutoMode | BOOL | Cascade auto enabled |
| ManualMode | BOOL | Manual mode selected |
| Start | BOOL | Operator/SCADA start |
| Stop | BOOL | Operator/SCADA stop |
| Reset | BOOL | Operator/SCADA reset |
| RotateLead | BOOL | Manual lead rotation request |

## UDT_Cascade_Cfg

| Member | Type | Description |
| --- | --- | --- |
| MaxRunning | DINT | Maximum VSDs allowed to run, 1 to 5 |
| StageOnSpeedPct | REAL | Speed threshold to stage up |
| StageOffSpeedPct | REAL | Speed threshold to stage down |
| StageOnDelayMs | DINT | Stage-up delay in milliseconds |
| StageOffDelayMs | DINT | Stage-down delay in milliseconds |
| StartTimeoutMs | DINT | Running feedback timeout in milliseconds |
| MinRunTimeMs | DINT | Minimum run time before stopping |
| MinStopTimeMs | DINT | Minimum stop time before restarting |
| SpeedMinPct | REAL | Minimum allowed speed reference |
| SpeedMaxPct | REAL | Maximum allowed speed reference |

## UDT_Cascade_Sts

| Member | Type | Description |
| --- | --- | --- |
| State | DINT | Cascade state |
| AnyTrip | BOOL | Any group trip active |
| PermissiveOK | BOOL | Group permissive summary |
| RunningCount | DINT | Number of VSDs running |
| AvailableCount | DINT | Number of VSDs available |
| LeadIndex | DINT | Active lead index, 0 to 4 |
| NextStageIndex | DINT | Candidate VSD to start |
| SpeedDemandPct | REAL | PID/cascade speed demand |
| AlarmNoAvailableVSD | BOOL | No available VSD for start |
| AlarmStageFail | BOOL | Stage operation failed |

## UDT_Cascade

| Member | Type | Description |
| --- | --- | --- |
| Cmd | UDT_Cascade_Cmd | Group commands |
| Cfg | UDT_Cascade_Cfg | Group configuration |
| Sts | UDT_Cascade_Sts | Group status |
| PV | REAL | Process variable |
| SP | REAL | Process setpoint |
| PIDOutPct | REAL | PID output/speed demand |
