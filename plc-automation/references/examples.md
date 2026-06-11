# Examples

## Example: Code Request Still Starts With Design

User asks: "Write CODESYS ST for a pump station."

Response shape:

1. Confirmed Facts
2. Assumptions
3. Project Scope
4. IO List
5. Step Engine Design
6. Interlock Matrix
7. Alarm List
8. Power Recovery
9. Vendor Validation
10. ST Code
11. Review and Commissioning Tests

## Example: Vendor Validation Block

```text
Vendor Code Standard Check

PLC: Siemens S7-1500
Software: TIA Portal
Language: SCL for sequence FBs, LAD/FBD acceptable for field diagnostics
Memory Strategy: FBs with instance DBs, UDT-based global DBs
Retentive Strategy: Retentive step words and recovery flags in DB_SeqRetain
Step Engine Strategy: CASE-based step engine, 100-step spacing
Naming Convention: Area_Equipment_Signal with DB_HMI, DB_CFG, DB_DIAG
Risks: safety function boundary must be verified in safety hardware/program
Assumptions: optimized DBs enabled unless HMI/SCADA integration requires otherwise
```

## Example: Transition Table

| Step Number | Step Name | Active Actions | Transition Condition | Next Step | Fault Condition | Recovery Action |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | Stopped | All run commands off | Start pulse and permissives OK | 10 | None | Stay stopped |
| 10 | Precheck | Validate devices | All ready | 20 | Any permissive lost | Go 90 |
| 20 | Starting | Run command on | Running feedback | 30 | Start timeout | Go 90 |
| 30 | Running | Maintain control | Stop request | 0 | Trip active | Go 90 |
| 90 | Faulted | Run commands off | Reset and faults clear | 0 | Fault remains | Stay 90 |

## Example: Alarm Row

| Alarm Number | Alarm Message | Severity | Cause | Operator Action | Reset Method |
| --- | --- | --- | --- | --- | --- |
| ALM-101 | Pump P101 failed to start | Major | Run command active but running feedback absent after timeout | Check drive, isolator, motor protection, and local mode | Reset after drive fault clears |
