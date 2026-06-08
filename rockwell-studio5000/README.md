# Allen-Bradley 5 VSD Cascade Panel

Rockwell Studio 5000 / Logix Designer design package for a 5-drive VSD cascade panel.

## Intended Platform

- ControlLogix, CompactLogix, or GuardLogix controller
- Studio 5000 Logix Designer
- Periodic task recommended, for example 100 ms to 250 ms
- Ethernet/IP VSD control preferred where supported
- Hardwired safety chain still required for E-stop and safety-rated stop functions

## Design Philosophy

The PLC controls five VSDs as a duty/assist cascade group. One lead drive starts first and receives the PID speed demand. Additional drives stage in when demand stays high, and stage out when demand falls. Faulted, local, inhibited, or unavailable drives are skipped.

Reset clears latched faults only after the unsafe/fault condition is gone. Reset does not start any VSD.

## Files

- `udt-definitions.md`: UDT structure to create in Studio 5000.
- `controller-tags.csv`: suggested controller/program tag list.
- `VSD_Cascade_Main.ST`: Logix-style Structured Text cascade routine.
- `commissioning-checklist.md`: commissioning and safety validation checklist.
- `Allen-Bradley-5-VSD-Cascade-Commissioning-Checklist.xlsx`: Excel commissioning checklist with status tracking and signoff fields.

## Recommended Logix Organization

- Task: `Task_Process_100ms`
- Program: `P_VSD_Cascade`
- Main routine: `R00_Main`
- ST routine: `R10_VSD_Cascade`
- Optional routines:
  - `R20_IO_Mapping` using `R20_IO_Mapping.ST`
  - `R30_HMI_Mapping`
  - `R40_Alarms`

## Safety Boundary

This package is standard PLC control logic. It is not a certified safety design. GuardLogix safety tasks, safety relays, STO wiring, E-stop categories, risk assessment, and proof testing must be engineered separately.
