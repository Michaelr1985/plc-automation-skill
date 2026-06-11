# Step Engine And Power Recovery Standard

## Required Step Engine Architecture

All automatic sequences use CASE-based step engines or vendor-equivalent state machines. The retentive step word is the single source of truth.

Required sequence fields:

- Retentive Step Word Name
- Sequence Description
- Power Recovery Behavior
- Fault Recovery Behavior
- Manual Reset Behavior
- Transition Table

Required step table columns:

- Step Number
- Step Name
- Active Actions
- Transition Condition
- Next Step
- Fault Condition
- Recovery Action

## Step Numbering

Use 10-step spacing for small sequences:

| Step | Typical Meaning |
| --- | --- |
| 0 | Stopped / Idle |
| 10 | Ready / Precheck |
| 20 | Start / Initiate |
| 30 | Running / Active |
| 40 | Complete / Stop |
| 90 | Faulted |

Use 100-step spacing for large sequences:

| Step | Typical Meaning |
| --- | --- |
| 0 | Stopped / Idle |
| 100 | Ready / Precheck |
| 200 | Start / Initiate |
| 300 | Running / Active |
| 400 | Transfer / Process |
| 900 | Faulted |

## Multi-Sequence Splitting

Automatically split large projects into logical modules. Examples:

- `MainSeqStep`
- `PumpSeqStep`
- `ConveyorSeqStep`
- `TransferSeqStep`
- `CleaningSeqStep`
- `AlarmSeqStep`

Each module must have its own retentive step word, transition table, recovery plan, and owner FB/POU.

## Power Recovery Strategy

Every sequence must define behavior after:

- Power loss
- PLC reboot
- Emergency stop
- CPU fault recovery

Required power recovery behavior:

- Step value retained.
- Safety validation on restart.
- Equipment state verification before motion.
- Operator recovery path.
- Resume strategy: resume, hold for operator confirmation, return home, drain/clear, or manual recovery.

Default recommendation: retain the step, remove motion commands, validate safety/permissives/feedback, then require operator acknowledgement before resuming hazardous motion.

## Fault Recovery

Fault recovery must define:

- Fault detection condition.
- Latched trip/alarm bit.
- Motion/output response.
- Reset allowed condition.
- Whether reset returns to idle, previous step, recovery step, or manual mode.

Reset must never energize equipment or advance the process by itself.

## CODESYS Pattern

Preferred CODESYS architecture:

```text
Application
├── GVL
├── DUT
├── FB_SequenceEngine
├── FB_Interlocks
├── FB_Alarms
└── PRG_Main
```

Preferred retentive step word:

```iecst
VAR PERSISTENT RETAIN
    MainSeqStep : INT;
END_VAR
```

Use CASE-based step engines. Do not default to SFC unless the user explicitly requests it and the site standard permits it.

## Generic ST Skeleton

```iecst
CASE MainSeqStep OF
    0: (* Stopped *)
        RunCmd := FALSE;
        IF StartPulse AND PermissiveOK THEN
            MainSeqStep := 10;
        END_IF;

    10: (* Precheck *)
        IF NOT PermissiveOK THEN
            MainSeqStep := 90;
        ELSIF PrecheckOK THEN
            MainSeqStep := 20;
        END_IF;

    20: (* Starting *)
        RunCmd := TRUE;
        IF RunningFb THEN
            MainSeqStep := 30;
        ELSIF StartTimeout.Q THEN
            MainSeqStep := 90;
        END_IF;

    30: (* Running *)
        RunCmd := PermissiveOK AND NOT StopRequest;
        IF NOT RunCmd THEN
            MainSeqStep := 0;
        END_IF;

    90: (* Faulted *)
        RunCmd := FALSE;
        IF ResetPulse AND FaultsClear THEN
            MainSeqStep := 0;
        END_IF;
ELSE
    MainSeqStep := 90;
END_CASE;
```
