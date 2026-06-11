# Siemens TIA Portal SCL/STL Import Standard

Use this whenever generating Siemens TIA Portal source files. Do not emit loose SCL/STL snippets as "import-ready" files.

## Root Cause Of Common Import Failures

TIA Portal import fails when generated code is only a bare CASE block, bare variable list, or copied network body. Importable sources need the correct TIA source container:

- External Source file for STL/SCL.
- SIMATIC SD `.s7dcl` file for S7-1200/S7-1500 LAD/FBD/SCL blocks, DBs, and PLC data types.

Source: Siemens STEP 7 V21 docs state that external source files must follow syntax and structure rules before blocks can be generated, and SIMATIC SD files contain pragmas, block name/type, interface, code networks, and block end sections.

## Decision Rules

- For S7-1200/S7-1500 SCL import/versioning, prefer SIMATIC SD `.s7dcl` when the user wants Git-friendly import/export.
- For ordinary SCL external-source generation, provide a complete `.scl` source with full `FUNCTION_BLOCK`, `FUNCTION`, `ORGANIZATION_BLOCK`, `DATA_BLOCK`, or `TYPE` wrappers.
- For STL, first confirm CPU and TIA support. Do not generate STL for S7-1200 or S7-1200 G2 unless the user proves support in their environment. S7-1500 has STL instruction documentation, but STL is not supported in SIMATIC SD.
- Never generate STL inside `.s7dcl`. Siemens documents "No support of STL in SIMATIC SD".
- If platform/version/import path is unknown, generate Siemens design plus pseudocode only.

## External Source Rules

Requirements:

- Add source under `External source files`.
- Use `Generate blocks from source`.
- Save with permitted encoding: ANSI or Unicode encodings with BOM such as UTF-8 with BOM.
- Terminate every instruction and declaration with `;`.
- Use `//` for single-line comments.
- For strings, use the target project language. For S7-1200/1500 WSTRING constants, use `WString#'<text>'`.
- Use complete block/type wrappers and matching `END_*` delimiters.
- Avoid absolute addressing unless deliberately creating generated symbolic tags.

## SIMATIC SD `.s7dcl` Rules

SIMATIC SD is available for S7-1200/S7-1500 family blocks and PLC data types. A `.s7dcl` file needs:

1. Pragma block.
2. Block type and block name.
3. Interface/tag declarations.
4. Program code inside `NETWORK` / `END_NETWORK`.
5. Matching block end keyword.

Minimal SCL FB `.s7dcl` structure:

```scl
{
S7_EditorMode := "SCL";
S7_Optimized := "TRUE";
S7_Version := "0.1"
}
FUNCTION_BLOCK "FB_Example"
VAR_INPUT
    StartCmd : Bool;
    StopCmd : Bool;
END_VAR
VAR_OUTPUT
    RunCmd : Bool;
END_VAR
VAR
    StepWord : Int;
END_VAR
NETWORK
    CASE #StepWord OF
        0:
            #RunCmd := FALSE;
            IF #StartCmd THEN
                #StepWord := 10;
            END_IF;
        10:
            #RunCmd := NOT #StopCmd;
            IF #StopCmd THEN
                #StepWord := 0;
            END_IF;
    ELSE
        #StepWord := 0;
    END_CASE;
END_NETWORK
END_FUNCTION_BLOCK
```

Minimal instance DB `.s7dcl` structure:

```scl
{
S7_Optimized := "TRUE";
S7_StandardRetain := "TRUE";
S7_Version := "0.1"
}
DATA_BLOCK "DB_FB_Example"
    "FB_Example"
END_DATA_BLOCK
```

Minimal PLC data type `.s7dcl` structure:

```scl
{
S7_Optimized := "TRUE";
S7_Version := "0.1"
}
TYPE "UDT_Example"
STRUCT
    Ready : Bool;
    Running : Bool;
    Faulted : Bool;
END_STRUCT;
END_TYPE
```

## SCL Code Rules Inside TIA Blocks

- Prefix local/interface tags with `#` in SCL network code.
- Use Siemens types/casing that TIA accepts, for example `Bool`, `Int`, `DInt`, `Real`, `Time`.
- Declare static FB variables in `VAR`, temporary variables in `VAR_TEMP`, inputs in `VAR_INPUT`, outputs in `VAR_OUTPUT`, and in-outs in `VAR_IN_OUT`.
- Do not use CODESYS-only constructs such as `VAR PERSISTENT RETAIN` in Siemens SCL. For Siemens, retentiveness is a DB/block property/member setting, not that exact CODESYS declaration syntax.
- Do not use `PROGRAM ... END_PROGRAM` for Siemens TIA blocks unless specifically working from a supported exported source type. Use OB/FB/FC/DB/TYPE structures.
- Avoid modifying a `FOR` loop index inside the loop for S7-1200/S7-1500 SCL.
- Keep pure SCL `.s7dcl` blocks pure SCL; mixed-language networks are not allowed in files with `{ S7_EditorMode := "SCL" }`.

## Siemens DB Rule

For every Siemens code package, generate:

- UDTs first where useful.
- FBs/FCs next.
- Instance DBs for FBs.
- Global DBs for HMI, configuration, diagnostics, alarms/events, recipes, retained sequence data, and external interfaces.

Mark DB intent:

- Retentive
- HMI-writable
- Read-only status
- Engineering constant
- Commissioning-only

## Output Requirements For This Skill

When asked for Siemens importable files, output:

- File names and target import method: `.scl` External Source or `.s7dcl` SIMATIC SD.
- CPU/software assumptions.
- Complete source wrappers, not snippets.
- Import procedure: add under External source files, then Generate blocks from source.
- A note that the final compile must be done in TIA Portal and error messages come from the source file/import inspector.
