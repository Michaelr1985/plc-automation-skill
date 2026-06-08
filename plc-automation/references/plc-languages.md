# PLC Language Patterns

## Ladder Diagram (LD)

Use LD for logic that electricians and maintenance teams must diagnose quickly online.

Recommended rung order for equipment:

1. Input conditioning and debounce.
2. Mode selection.
3. Permissive summary.
4. Trip detection and trip latch.
5. Start/stop command latch or run request.
6. Output command.
7. Feedback validation.
8. Status bits, alarms, and HMI messages.

LD rules:

- Keep each rung focused on one result.
- Avoid deeply branched rungs that hide a bypass or permissive.
- Use seal-in logic only for simple memory; use state machines for sequences.
- Put stop/trip conditions in series with run permissive logic.
- Use named internal bits instead of raw I/O addresses in process logic.
- Avoid duplicate coils. If the platform allows set/reset coils, document reset priority.

## Structured Text (ST)

Use ST for reusable FB internals, sequencing, calculations, arrays, and readable state machines.

Pattern:

```iecst
IF Reset THEN
    FaultLatched := FALSE;
END_IF;

FaultActive := NOT DriveHealthy OR EStopActive OR FeedbackFault;

IF FaultActive THEN
    FaultLatched := TRUE;
END_IF;

CanRun := AutoMode AND PermissiveOK AND NOT FaultLatched;

CASE State OF
    0: (* Stopped *)
        RunCmd := FALSE;
        IF StartPulse AND CanRun THEN
            State := 10;
        END_IF;

    10: (* Starting *)
        RunCmd := TRUE;
        IF RunningFeedback THEN
            State := 20;
        ELSIF StartTimeout.Q OR NOT CanRun THEN
            FaultLatched := TRUE;
            State := 0;
        END_IF;

    20: (* Running *)
        RunCmd := CanRun AND NOT StopRequest;
        IF NOT RunCmd THEN
            State := 0;
        END_IF;
ELSE
    State := 0;
END_CASE;
```

ST rules:

- Prefer `CASE` for states.
- Avoid writing outputs in many branches. Calculate internal command bits, then map outputs once.
- Keep reset behavior separate from start behavior.
- For loops, bound the index and define what happens on invalid counts.
- For timers, call the timer once per scan in a predictable place.

## Function Block Diagram (FBD)

Use FBD when visual flow is clearer than textual branching.

Recommended layout:

- Left: raw/conditioned inputs.
- Middle-left: permissive and trip blocks.
- Middle-right: mode/sequence/memory blocks.
- Right: output command and status.
- Bottom or separate sheet: diagnostics and alarms.

FBD rules:

- Name intermediate wires/signals; do not rely on visual position alone.
- Keep safety and process-control blocks separated.
- Avoid crossing lines in safety-sensitive logic.
- Summarize permissives and trips with named signals (`PermissiveOK`, `AnyTrip`, `ResetAllowed`).

## Cross-Language Conversion

- Convert behavior before improving style.
- Preserve latch polarity, retentive behavior, timer type, reset priority, scan timing, and one-shot semantics.
- Watch for vendor timer differences: enable/reset behavior, elapsed value units, retentive timers, and done-bit timing.
- In migration notes, identify any instruction that has no direct equivalent.
