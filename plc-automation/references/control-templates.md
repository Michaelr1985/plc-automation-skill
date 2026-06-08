# Control Templates

## Motor Starter Template

Use for DOL starters, soft starters, VSD run commands, pumps, fans, and conveyor drives. Adapt names to the vendor/site standard.

### Core Tags

Commands:

- `Cmd_Start`: momentary start request.
- `Cmd_Stop`: stop request.
- `Cmd_Reset`: fault reset request.
- `Cmd_Auto`: auto mode selected.
- `Cmd_Manual`: manual/local maintenance mode selected.

Inputs/status:

- `In_RunFb`: motor/drive running feedback.
- `In_Ready`: starter/drive ready.
- `In_Fault`: starter/drive fault.
- `In_Local`: local mode active.
- `In_EStopOK`: safety chain healthy indication.
- `Perm_ProcessOK`: process permissive summary.

Outputs:

- `Out_RunCmd`: run command to starter/drive.

Internal:

- `Trip_Active`, `Trip_Latched`, `PermissiveOK`, `StartPulse`, `FeedbackFault`, `State`.

### ST Skeleton

```iecst
Trip_Active :=
    NOT In_EStopOK OR
    In_Fault OR
    NOT In_Ready OR
    FeedbackFault;

IF Cmd_Reset AND NOT Trip_Active THEN
    Trip_Latched := FALSE;
END_IF;

IF Trip_Active THEN
    Trip_Latched := TRUE;
END_IF;

PermissiveOK := Cmd_Auto AND Perm_ProcessOK AND NOT In_Local AND NOT Trip_Latched;

tStart(IN := Out_RunCmd AND NOT In_RunFb, PT := StartTimeout);
FeedbackFault := tStart.Q;

CASE State OF
    0: (* Stopped *)
        Out_RunCmd := FALSE;
        IF StartPulse AND PermissiveOK THEN
            State := 10;
        END_IF;

    10: (* Starting/Running *)
        Out_RunCmd := PermissiveOK AND NOT Cmd_Stop;
        IF NOT Out_RunCmd THEN
            State := 0;
        END_IF;
ELSE
    Out_RunCmd := FALSE;
    State := 0;
END_CASE;
```

Adapt timer call syntax for Siemens, Rockwell, Schneider, or CODESYS.

### LD Rung Layout

1. `Trip_Active` from safety healthy, drive fault, ready, and feedback fault.
2. `Trip_Latched` set by `Trip_Active`, reset by reset command with active trips clear.
3. `PermissiveOK` from mode, process permissives, remote/ready status, and no latched trip.
4. Start latch or state request from start pulse and permissive.
5. `Out_RunCmd` energized only while run request, permissive, and no stop.
6. Start feedback timer: run command on and feedback absent.
7. Alarm/status rungs.

## Conveyor Template

Use for single conveyors and extend to conveyor lines.

### Core Conveyor Trips

- Pull-wire or E-stop unhealthy.
- Belt drift left/right.
- Zero speed/slip while commanded running after startup delay.
- Blocked chute or high-high level.
- Drive fault/not ready.
- Downstream unavailable.
- Fire/gas/dust suppression critical trip where applicable.

### Core Conveyor Permissives

- Downstream conveyor running or discharge path clear.
- Chute not blocked.
- Drive ready and remote.
- Safety chain healthy.
- Maintenance doors closed or access system healthy.
- Start warning complete.

### Sequence States

- `0 Stopped`
- `10 PrestartWarning`
- `20 Starting`
- `30 Running`
- `40 Stopping`
- `90 Tripped`

### ST Skeleton

```iecst
AnyTrip :=
    NOT SafetyHealthy OR
    PullwireTrip OR
    BeltDriftTrip OR
    BlockedChuteTrip OR
    DriveFault OR
    ZeroSpeedTrip;

IF AnyTrip THEN
    TripLatched := TRUE;
    State := 90;
END_IF;

IF ResetPulse AND NOT AnyTrip THEN
    TripLatched := FALSE;
END_IF;

PermissiveOK :=
    AutoMode AND
    SafetyHealthy AND
    DriveReady AND
    DownstreamReady AND
    NOT TripLatched;

tPrestart(IN := State = 10, PT := PrestartTime);
tStartFb(IN := RunCmd AND NOT RunFb, PT := StartFeedbackTime);
tZeroSpeed(IN := State = 30 AND RunCmd AND NOT SpeedOK, PT := ZeroSpeedDelay);

ZeroSpeedTrip := tZeroSpeed.Q;

CASE State OF
    0:
        RunCmd := FALSE;
        WarningCmd := FALSE;
        IF StartPulse AND PermissiveOK THEN
            State := 10;
        END_IF;

    10:
        WarningCmd := TRUE;
        RunCmd := FALSE;
        IF NOT PermissiveOK OR StopRequest THEN
            State := 0;
        ELSIF tPrestart.Q THEN
            State := 20;
        END_IF;

    20:
        WarningCmd := FALSE;
        RunCmd := PermissiveOK AND NOT StopRequest;
        IF RunFb THEN
            State := 30;
        ELSIF tStartFb.Q OR NOT RunCmd THEN
            TripLatched := TRUE;
            State := 90;
        END_IF;

    30:
        RunCmd := PermissiveOK AND NOT StopRequest;
        IF NOT RunCmd THEN
            State := 40;
        END_IF;

    40:
        RunCmd := FALSE;
        IF NOT RunFb THEN
            State := 0;
        END_IF;

    90:
        RunCmd := FALSE;
        WarningCmd := FALSE;
        IF ResetPulse AND NOT TripLatched AND NOT AnyTrip THEN
            State := 0;
        END_IF;
ELSE
    RunCmd := FALSE;
    WarningCmd := FALSE;
    State := 90;
END_CASE;
```

### Conveyor Line Rules

- Start downstream-to-upstream.
- Stop feed upstream-to-downstream on normal stop.
- Stop upstream feed immediately on downstream trip.
- Keep restart inhibits after E-stop, pull-wire, blocked chute, fire, or access trip until reset and operator start.
- For incline conveyors, include brake release/healthy feedback and rollback/overspeed protections according to engineered design.
