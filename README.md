# Industrial Automation Codex Skill

A custom Codex skill for complete industrial automation engineering work from project scope through commissioning.

## What It Covers

- Design-first automation project workflow
- PLC, HMI, SCADA, network, simulation, FAT/SAT, commissioning, documentation, and estimating
- Mandatory retentive step-engine sequence standard
- IEC 61131-3 programming posture and review guidance
- Ladder Diagram (LD), Structured Text (ST), and Function Block Diagram (FBD) patterns
- Siemens TIA Portal / STEP 7 conventions
- Rockwell Studio 5000 Logix Designer conventions
- Delta ISPSoft / WPLSoft conventions
- Omron Sysmac Studio conventions
- Schneider EcoStruxure Machine Expert conventions
- CODESYS programming standards
- Mine automation safety and sequencing guidance
- Safety interlock review principles
- Motor starter and conveyor control templates

## Skill Name

Invoke the skill in Codex as:

```text
$plc-automation
```

## Install Location

Copy the `plc-automation` folder into your Codex skills directory:

```text
~/.codex/skills/plc-automation
```

The skill has already been installed locally on this machine.

## Included Control Packages

- `siemens-tia-s7-1215/`: Siemens S7-1215 / TIA Portal SCL External Source package for the Valpre effluent VSD cascade project.
- `rockwell-studio5000/`: Allen-Bradley / Rockwell Studio 5000 package for a 5 VSD cascade control panel.
- `codesys-st/`: CODESYS Structured Text package for the same 5 VSD cascade control panel.
