# Siemens TIA Portal S7-1215 Effluent Cascade Package

Target: Siemens S7-1215 / S7-1200 family
Software: TIA Portal
Language: SCL External Source
Artifact type: External source files for TIA block generation

This package creates a Siemens SCL control structure for the Valpre effluent upgrade:

- Four Danfoss VSD pumps
- Flow-meter based output flow control
- Duty/standby cascade
- Manual and automatic modes
- Dry-run, E-stop monitor, flow signal, and VSD fault handling
- Required Siemens DB structure for HMI, configuration, status, alarms, diagnostics, retained sequence data, and IO mapping

## Files

| File | TIA Action | Purpose |
| --- | --- | --- |
| `01_EFF_Global_Datablocks.db` | Add as External Source and generate data blocks | Creates global DBs |
| `02_FB_EFF_VSD.scl` | Add as External Source and generate block | Reusable VSD pump FB |
| `03_FB_EFF_Cascade.scl` | Add as External Source and generate block | Main effluent cascade controller |
| `04_DB_FB_EFF_Cascade.db` | Add as External Source and generate data block | Instance DB for `FB_EFF_Cascade` |
| `05_OB1_Call_Note.txt` | Manual reference | Shows the OB1 call to add manually |
| `06_FB_EFF_TestHarness.scl` | Add as External Source and generate block | PLCSIM/FAT test harness for IO mapping and connections |
| `07_DB_FB_EFF_TestHarness.db` | Add as External Source and generate data block | Instance DB for `FB_EFF_TestHarness` |

## Import Order

1. Open the S7-1215 PLC in TIA Portal.
2. Under `Program blocks > External source files`, add:
   - `01_EFF_Global_Datablocks.db`
   - `02_FB_EFF_VSD.scl`
   - `03_FB_EFF_Cascade.scl`
   - `04_DB_FB_EFF_Cascade.db`
   - `06_FB_EFF_TestHarness.scl`
   - `07_DB_FB_EFF_TestHarness.db`
3. Generate blocks from the sources in that order.
4. Open OB1 and add the call shown in `05_OB1_Call_Note.txt`.
5. Compile the PLC.
6. Connect actual PLC tags, Profinet drive telegrams, or hardwired IO to `DB_EFF_IO`.

## Important TIA Notes

- These are SCL External Source files, not STL.
- S7-1200/S7-1215 should use SCL here.
- The source files use full block/data block wrappers, not loose snippets.
- `DB_EFF_Retain` is created as the retained-data DB. After generation, mark its required members retentive in TIA Portal if your TIA version does not preserve retentive settings from source.
- Keep E-stop removal of drive enable in safety-rated hardware. The PLC code only monitors the safety healthy feedback.
- Reset clears trips only. It does not start any pump.
- `FB_EFF_TestHarness` is for PLCSIM/FAT only. Do not enable `DB_EFF_Test.EnableTestMode` with live outputs connected.

## Built-In Test Harness

The test harness checks:

- Flow analog scaling through `DB_EFF_IO.AI_FlowRaw`
- Common healthy inputs: E-stop monitor, control power, and dry-run
- VSD ready/remote/fault input mapping for all four drives
- VSD run command output mapping for all four drives
- VSD running feedback mapping into VSD state
- VSD fault/alarm mapping
- Reset behavior confirming reset does not start a VSD

To run it in PLCSIM/FAT:

1. Call `DB_FB_EFF_TestHarness` before `DB_FB_EFF_Cascade` in OB1.
2. Set `DB_EFF_Test.EnableTestMode` to `TRUE`.
3. Pulse `DB_EFF_Test.ResetTest`.
4. Monitor `DB_EFF_Test.TestPassed`, `TestFailed`, `FailureCode`, and `FailureText`.
5. Disable `EnableTestMode` before connecting real field IO or live outputs.

## Commissioning Defaults To Review

After import, review these values in `DB_EFF_Config`:

- Flow raw minimum and maximum
- Engineering flow range in m3/h
- Minimum and maximum VSD speed
- Cascade start and stop thresholds
- Cascade and de-stage delays
- VSD start feedback timeout
- Flow control gain

Final tuning must be done on site with the actual pump curve, pipework, IFM flow meter scaling, and Danfoss VSD profile.
