# Industrial Automation Platform Workflow

This skill is design-first. Code generation happens only after scope, architecture, IO, sequences, interlocks, alarms, power recovery, HMI/SCADA, simulation, and vendor validation are addressed.

## Primary Workflow Detail

1. **Project Scope**: machine/process overview, boundaries, success criteria, constraints, stakeholders, open questions.
2. **Architecture Selection**: project size, PLC/HMI/SCADA/network architecture, modular split, task structure.
3. **IO Definition**: DI, DO, AI, AO, networked devices, assumptions, spare capacity.
4. **Sequence Design**: step engines, retentive step words, transition tables, recovery.
5. **Interlock Design**: equipment/interlock/action/reset/severity matrix.
6. **Alarm Design**: severity, message, cause, operator action, reset method.
7. **Power Recovery Design**: power loss, PLC reboot, E-stop, CPU recovery.
8. **HMI Design**: screen list, navigation, faceplates, popups, alarms, trends, maintenance.
9. **SCADA Design**: tags, historian, alarms, KPIs, reports.
10. **Simulation Plan**: normal operation, failures, recovery, communications, power loss.
11. **Vendor Validation**: PLC/software/language/memory/retentive/task/naming strategy.
12. **Code Generation**: only after design and vendor validation.
13. **Code Review**: safety, race conditions, latches, timers, retentive risks, naming, unreachable steps, recovery.
14. **Documentation Generation**: FDS, IO list, alarm list, interlocks, cause/effect, sequence tables, FAT/SAT, commissioning checklist, user manual.
15. **Engineering Estimate**: PLC, HMI, SCADA, testing, commissioning, documentation, travel: low/expected/high.
16. **FAT/SAT Planning**: test cases, evidence, acceptance criteria.
17. **Commissioning Planning**: loop checks, IO verification, alarm verification, sequence verification, recovery verification.

## Project Response Contract

For full project requests, include:

- Executive Summary
- Confirmed Facts
- Assumptions
- Architecture Recommendation
- IO List
- Sequence Design
- Interlock Matrix
- Alarm List
- Power Recovery Strategy
- HMI Design
- SCADA Design
- Network Design
- Simulation Plan
- Vendor Validation
- PLC Logic Structure
- Draft Code/Pseudocode
- Code Review
- Documentation List
- Engineering Estimate
- FAT/SAT Plan
- Open Questions

For narrow requests, still preserve order. Example: if asked "write code", briefly provide scope assumptions, vendor validation, sequence/interlock/alarm implications, then code.

## Project Size Classification

- **Small**: 1-3 equipment modules, local HMI, limited IO, 1-2 sequences, no full SCADA.
- **Medium**: 4-15 modules, multiple sequences, HMI with trends/alarms, networked devices.
- **Large**: multiple process areas, several HMIs, SCADA, historian, reporting, formal FAT/SAT.
- **Enterprise**: multi-site, redundant SCADA/servers, standards library, cybersecurity, historian/reporting, role-based operations.

Recommendations by size:

- Small: 1-3 FBs, 1 HMI, local alarm list, simple FAT/SAT.
- Medium: area FBs, reusable equipment FBs, 1-2 HMIs, structured alarm/interlock matrix.
- Large: modular sequence engines, central alarm philosophy, SCADA tags, historian, commissioning packs.
- Enterprise: design standards, naming library, cyber/network zones, template faceplates, governance.
