# Generated File Validation Rules

Use this before claiming a generated package is ready for user import/build.

## Universal Checks

- Required files exist.
- README/import note exists.
- Local delivery folder exists and is synchronized with repo copy.
- Artifact type is stated.
- Vendor/software/version assumptions are stated.
- File naming is deterministic.
- Safety and validation limits are stated.
- Generated code is not mislabeled as verified unless actually compiled/imported.

## Siemens TIA Checks

Check:

- `.scl` files contain complete `FUNCTION_BLOCK`, `FUNCTION`, `ORGANIZATION_BLOCK`, `DATA_BLOCK`, or `TYPE` wrappers.
- `.db` files contain complete `DATA_BLOCK` wrappers.
- No loose SCL/STL snippets are labeled import-ready.
- No STL is generated for S7-1200/S7-1200 G2 assumptions.
- DB design includes HMI, config, diagnostics, alarms, retained data, and instance DBs where needed.
- OB1 replacement is not generated unless explicitly requested.

## Rockwell Checks

Check:

- Import-ready files use `.L5X` with `RSLogix5000Content` root where applicable.
- Plain `.ST` files are labeled paste-in/reference only.
- Target Logix Designer major version is stated.
- Controller/program tag scope is documented.
- AOI use is justified and lifecycle constraints are noted.

## CODESYS / Schneider Checks

Check:

- Import-ready files use PLCopen XML or supported native export format.
- Plain `.ST` files are labeled paste-in/object reference only.
- GVL/DUT/POU structure is documented.
- Persistent/retain behavior is documented.
- Product line/version assumptions are stated.

## Omron Checks

Check:

- Sysmac project/XML support is confirmed.
- Plain `.ST` is not labeled generic import-ready.
- Controller family and version assumptions are stated.
- Safety CPU boundaries are separated.

## Delta Checks

Check:

- Exact CPU/software is confirmed before claiming import-ready output.
- Memory/register map is documented.
- Output defaults to engineering reference when import schema is unknown.

## Archive ESP-IDF Checks

Check:

- Project has top-level `CMakeLists.txt`.
- Project has `main/CMakeLists.txt`.
- Project has `main/app_main.c`.
- Project has hardware IO module such as `archive_io.c/.h`.
- Project has PLC runtime module such as `plc_runtime.c/.h`.
- README includes ESP-IDF target/build/flash commands.
- GPIO/ADC assumptions are stated.
- Outputs are initialized safe.
- Retained state uses explicit NVS or documented storage.
- Wi-Fi/BLE modules are separated from PLC scan when included.
- `idf.py build` is run when ESP-IDF is available; otherwise state that build validation was not performed.

## Validation Report

Every file package final response should state:

```text
Validation Performed:
- File structure:
- Syntax/wrapper checks:
- Local delivery folder:
- Vendor IDE/build:
- Not verified:
```
