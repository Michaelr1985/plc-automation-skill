# CODESYS ST 5 VSD Cascade Project

CODESYS V3 Structured Text version of the 5 VSD cascade control project.

## Intended Platform

- CODESYS V3 or CODESYS-derived controller environment
- Structured Text POUs
- Cyclic task, typically 100 ms to 250 ms
- Fieldbus or hardwired VSD I/O mapped into `GVL_IO`
- Safety-rated E-stop, STO, and guard functions engineered separately

## Files

- `DUT_CascadeTypes.ST`: enumerations and structures for VSD and cascade data.
- `GVL_IO.ST`: example global I/O and internal array mapping.
- `FB_VSD_Cascade5.ST`: reusable 5-drive cascade function block.
- `PRG_Main.ST`: example program calling the function block and mapping outputs.
- `commissioning-notes.md`: CODESYS-specific validation notes.

## Basic Use

1. Create the DUT objects from `DUT_CascadeTypes.ST`.
2. Create `GVL_IO`.
3. Create `FB_VSD_Cascade5`.
4. Create or adapt `PRG_Main`.
5. Attach `PRG_Main` to a cyclic task.
6. Map real VSD inputs and outputs in `GVL_IO` or a dedicated I/O mapping POU.

## Safety Boundary

This is standard PLC control logic. It does not replace a risk assessment, certified safety program, safety relay, STO wiring, or proof test. Reset clears eligible trips only when faults are gone and does not start any motor.
