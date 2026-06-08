# Safety And Mine Automation

## Safety-Critical Boundaries

Generated PLC logic is not a substitute for a risk assessment, safety requirements specification, certified safety design, peer review, proof testing, and site acceptance testing. For safety functions, require a qualified controls/safety engineer and the applicable jurisdictional standards before implementation.

Common standards to consider by jurisdiction and machine type include IEC 61508, IEC 62061, ISO 13849, ISO 12100, IEC 60204-1, IEC 62443, NFPA 70/NFPA 79, MSHA rules, and local mining regulations. Do not assume a standard applies; identify it as a candidate and ask the user to confirm site requirements.

## Safety Interlock Principles

- Safety-rated functions belong in safety-rated hardware/software where required.
- Standard PLC code may monitor and report safety states, but should not replace a required safety function.
- De-energize outputs on E-stop, guard open, pull-wire trip, overspeed, underspeed, blocked chute, fire/gas trip, communication loss, or invalid feedback where applicable.
- Reset must require the unsafe condition to be clear and must not initiate motion.
- Restart after trip must require a deliberate start command unless the risk assessment explicitly permits auto restart.
- Start warnings must precede hazardous motion where people may be exposed.
- Bypass logic must be controlled, visible, alarmed, logged, time-limited, and excluded from certified safety unless formally designed.

## Mine Automation Control Topics

Common mine automation hazards and interlocks:

- Conveyor pull-wire/E-stop chain.
- Belt drift/misalignment.
- Belt slip, zero speed, overspeed, and broken belt detection.
- Blocked chute, high level, plugged transfer point.
- Sequence interlocks between upstream and downstream conveyors.
- Crusher/bin level permissives.
- Fire detection, bearing temperature, motor winding temperature.
- Gas, dust suppression, ventilation, and water pressure permissives.
- VSD/soft-starter healthy, ready, running, faulted, and local/remote state.
- Brake release feedback for incline conveyors, winches, and hoists.
- Personnel access gates, trapped-key systems, and lockout/tagout interfaces.

## Conveyor Start Philosophy

Typical conveyor start sequence:

1. Confirm safety chain healthy and no latched trips.
2. Confirm downstream equipment ready/running or transfer path clear.
3. Sound horn/beacon for configured prestart duration.
4. Start downstream-to-upstream.
5. Confirm each motor running feedback within timeout.
6. Enable feed only after belt proven running.

Typical stop sequence:

- Normal stop: stop upstream feed first, allow belts to clear, then stop downstream belts.
- Trip stop: stop affected equipment immediately and stop upstream feed; downstream behavior depends on hazard analysis.
- E-stop/safety trip: de-energize according to safety design; do not rely on standard sequence code.

## Review Checklist

- Is every motion-producing output gated by safety status, mode, permissive, and trip state?
- Can reset energize equipment? If yes, redesign.
- Does any bypass defeat an interlock silently?
- Is bad input quality handled?
- Are start warnings enforced and restart inhibits clear?
- Are blocked chute and zero speed timers suitable for startup versus running?
- Is local control coordinated with remote/SCADA commands?
- Are HMI alarms actionable and mapped to the same trip bits that stop equipment?
