# Vendor Validation Engine

Before code generation, determine:

- PLC Brand
- CPU Type
- Programming Software
- Language
- Memory Architecture
- Retentive Strategy
- Task Structure
- Vendor Naming Standard

Output this check:

```text
Vendor Code Standard Check

PLC:
Software:
Language:
Memory Strategy:
Retentive Strategy:
Step Engine Strategy:
Naming Convention:
Risks:
Assumptions:
```

If the platform is unknown, generate vendor-neutral design and pseudocode only. Never mix vendor syntax.

## Supported Platforms

### Siemens

- S7-1200
- S7-1500
- TIA Portal

Rules:

- Use FBs with instance DBs.
- Always create relevant DBs in the software design.
- Use global DBs for HMI, configuration, diagnostics, alarms, recipes, retained values, and external interfaces.
- Use optimized DBs unless integration requirements demand otherwise.
- Use SCL for algorithms/state engines and LAD/FBD where site maintenance benefits.
- Before generating importable source, choose either External Source `.scl`/STL or SIMATIC SD `.s7dcl`.
- Do not emit bare Siemens SCL/STL snippets as import-ready files.
- Do not generate STL in SIMATIC SD. Siemens documents that STL is not supported in SIMATIC SD.
- For S7-1200/S7-1200 G2, do not assume STL support; prefer SCL unless the user confirms otherwise.

### Rockwell

- CompactLogix
- ControlLogix
- Studio 5000

Rules:

- Use UDTs for equipment command/status/config.
- Use AOIs only where lifecycle governance allows.
- Document controller/program tag scope and task period.
- Watch retentive tags, timers, latches, and first-scan behavior.

### Delta

- ISPSoft
- WPLSoft

Rules:

- Confirm exact CPU/software before syntax.
- Use vendor-neutral design if instruction support is uncertain.
- Document retentive registers, memory ranges, and scan behavior.

### Schneider

- EcoStruxure Machine Expert

Rules:

- Confirm product line and safety environment.
- Use POUs, DUTs, and GVLs for modular design.
- Keep safety logic separate from standard control.

### Omron

- Sysmac Studio

Rules:

- Confirm NJ/NX/other controller family.
- Use structured variables, programs, FBs, and tasks according to Sysmac standards.
- Document retained variables and safety CPU boundaries.

### CODESYS

- CODESYS V3.x
- WAGO
- IFM
- Eaton
- Festo
- Turck
- Raspberry Pi Runtime

Rules:

- Preferred structure: `GVL`, `DUT`, `FB_SequenceEngine`, `FB_Interlocks`, `FB_Alarms`, `PRG_Main`.
- Use `VAR PERSISTENT RETAIN` for retentive step words where supported.
- Use CASE-based step engines.
- Do not default to SFC.

## Industrial Network Engine

Support:

- Profinet
- Ethernet/IP
- Modbus TCP
- Modbus RTU
- EtherCAT
- CANOpen

Generate columns:

| Device | IP Address | Protocol | Node ID | PLC Interface | Data Exchanged | Notes |
| --- | --- | --- | --- | --- | --- | --- |
