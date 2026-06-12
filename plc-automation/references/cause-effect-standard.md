# Cause And Effect Matrix Standard

Use this for safety-sensitive, interlock-heavy, sequence-heavy, or multi-equipment systems.

## Matrix Columns

| Cause ID | Cause | Condition | Affected Equipment | Effect | Delay | Latch | Reset | Alarm | HMI Message | Test Method | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Cause Categories

- Safety diagnostic input.
- Emergency stop monitor.
- Guard/access monitor.
- Process permissive.
- Instrument fault.
- Drive/starter fault.
- Communication loss.
- Downstream unavailable.
- Upstream feed fault.
- Power recovery.
- Operator stop.
- Maintenance inhibit.
- Sequence timeout.

## Effect Types

- Immediate stop.
- Controlled stop.
- Inhibit start.
- Hold sequence.
- Move to recovery step.
- Stop upstream feed.
- Stop affected equipment only.
- Stop full process area.
- Alarm only.
- Degrade operation.

## Reset Rules

- Safety-related causes require safety hardware reset where applicable.
- Process trips reset only after the cause clears.
- Reset must not start equipment.
- Communication-loss reset must require data healthy for the configured validation period.
- Power recovery may require operator acknowledgement before resuming.

## Test Method Rules

Every cause/effect row should have a test method:

- Simulation.
- FAT bench input toggle.
- SAT loop check.
- Controlled process test.
- Not safe to test live; verify by simulation/proof method.

## Output Requirements

When generating a cause/effect matrix:

- Include all common stops/trips.
- Include each equipment-specific trip.
- Include communication and stale-data conditions.
- Include reset method.
- Include alarm mapping.
- Include HMI message text.
- Include test evidence requirement.
