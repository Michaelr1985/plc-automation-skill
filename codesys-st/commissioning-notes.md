# CODESYS ST Commissioning Notes

## Import / Build Checks

- Create DUTs before creating `GVL_IO`, `FB_VSD_Cascade5`, and `PRG_Main`.
- Confirm the standard timer `TON` is available from the target runtime libraries.
- Attach `PRG_Main` to a cyclic task, normally 100 ms to 250 ms.
- Confirm array indexes are `1..5` throughout the project.
- Map real fieldbus or hardwired I/O to the `I_` and `O_` variables in `GVL_IO`.

## Logic Checks

- `CP01.Cmd.xReset` clears eligible latched trips only when faults are gone.
- `CP01.Cmd.xReset` does not issue any VSD run command.
- `CP01_xEStopOK = FALSE` removes all run commands.
- Faulted, local, inhibited, or unavailable VSDs are skipped.
- Stage-up starts one next available VSD after `tStageOnDelay`.
- Stage-down stops one lag VSD after `tStageOffDelay`.
- Stage-down does not stop the lead while lag drives are running.
- Minimum run and stop timers prevent short cycling.

## Safety Boundary

This is standard CODESYS control logic only. Safety-rated functions must be engineered with approved safety hardware/software, validated by risk assessment, and proof tested on site.
