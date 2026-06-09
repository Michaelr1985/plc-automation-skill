FUNCTION_BLOCK FB_VSD_Cascade5
VAR_INPUT
    xEStopOK : BOOL;
    xProcessPermissiveOK : BOOL;
    stCmd : ST_CascadeCmd;
    stCfg : ST_CascadeCfg;
    rPIDOutPct : REAL;
END_VAR
VAR_IN_OUT
    aVSD : ARRAY[1..5] OF ST_VSD;
END_VAR
VAR_OUTPUT
    stSts : ST_CascadeSts;
END_VAR
VAR
    i : INT;
    iScanIndex : INT;
    iNextLeadIndex : INT := 1;
    xRotateLeadPrev : BOOL;
    tStageOn : TON;
    tStageOff : TON;
    atStartFail : ARRAY[1..5] OF TON;
    atMinRun : ARRAY[1..5] OF TON;
    atMinStop : ARRAY[1..5] OF TON;
    cfg : ST_CascadeCfg;
END_VAR

(* Clamp configuration locally. *)
cfg := stCfg;

IF cfg.iMaxRunning < 1 THEN
    cfg.iMaxRunning := 1;
ELSIF cfg.iMaxRunning > 5 THEN
    cfg.iMaxRunning := 5;
END_IF;

IF cfg.rSpeedMinPct < 0.0 THEN
    cfg.rSpeedMinPct := 0.0;
END_IF;

IF cfg.rSpeedMaxPct > 100.0 THEN
    cfg.rSpeedMaxPct := 100.0;
END_IF;

IF cfg.rSpeedMaxPct < cfg.rSpeedMinPct THEN
    cfg.rSpeedMaxPct := cfg.rSpeedMinPct;
END_IF;

(* Clamp speed demand. PID is normally calculated outside this FB. *)
stSts.rSpeedDemandPct := rPIDOutPct;
IF stSts.rSpeedDemandPct < cfg.rSpeedMinPct THEN
    stSts.rSpeedDemandPct := cfg.rSpeedMinPct;
ELSIF stSts.rSpeedDemandPct > cfg.rSpeedMaxPct THEN
    stSts.rSpeedDemandPct := cfg.rSpeedMaxPct;
END_IF;

(* Group permissive. Reset never starts equipment. *)
stSts.xPermissiveOK :=
    stCmd.xAutoMode AND
    xEStopOK AND
    xProcessPermissiveOK;

stSts.xAnyTrip := (NOT xEStopOK) OR (NOT xProcessPermissiveOK);

(* Rotate preferred lead for next start. *)
IF stCmd.xRotateLead AND NOT xRotateLeadPrev THEN
    iNextLeadIndex := iNextLeadIndex + 1;
    IF iNextLeadIndex > 5 THEN
        iNextLeadIndex := 1;
    END_IF;
END_IF;
xRotateLeadPrev := stCmd.xRotateLead;

IF (iNextLeadIndex < 1) OR (iNextLeadIndex > 5) THEN
    iNextLeadIndex := 1;
END_IF;

(* Per-drive availability, trips, counts, and timers. *)
stSts.iRunningCount := 0;
stSts.iAvailableCount := 0;

FOR i := 1 TO 5 DO
    aVSD[i].Sts.xAvailable :=
        aVSD[i].Sts.xReady AND
        NOT aVSD[i].Sts.xFaulted AND
        NOT aVSD[i].Sts.xLocal AND
        NOT aVSD[i].Cmd.xInhibit AND
        NOT aVSD[i].Sts.xTripLatched;

    IF aVSD[i].Sts.xFaulted OR NOT xEStopOK THEN
        aVSD[i].Sts.xTripLatched := TRUE;
    END_IF;

    IF stCmd.xReset AND NOT aVSD[i].Sts.xFaulted AND xEStopOK THEN
        aVSD[i].Sts.xTripLatched := FALSE;
        aVSD[i].Sts.xStartFail := FALSE;
    END_IF;

    IF aVSD[i].Sts.xTripLatched OR
       aVSD[i].Sts.xFaulted OR
       aVSD[i].Sts.xLocal OR
       aVSD[i].Cmd.xInhibit THEN
        aVSD[i].Cmd.xRunCmd := FALSE;
        aVSD[i].Cmd.rSpeedRefPct := 0.0;
    END_IF;

    IF aVSD[i].Sts.xRunning THEN
        stSts.iRunningCount := stSts.iRunningCount + 1;
    END_IF;

    IF aVSD[i].Sts.xAvailable THEN
        stSts.iAvailableCount := stSts.iAvailableCount + 1;
    END_IF;

    atStartFail[i](IN := aVSD[i].Cmd.xRunCmd AND NOT aVSD[i].Sts.xRunning, PT := cfg.tStartTimeout);
    IF atStartFail[i].Q THEN
        aVSD[i].Sts.xStartFail := TRUE;
        aVSD[i].Sts.xTripLatched := TRUE;
    END_IF;

    atMinRun[i](IN := aVSD[i].Sts.xRunning, PT := cfg.tMinRunTime);
    atMinStop[i](IN := NOT aVSD[i].Sts.xRunning, PT := cfg.tMinStopTime);
END_FOR;

IF stSts.xAnyTrip OR stCmd.xStop THEN
    stSts.eState := E_CascadeState.Stopped;
END_IF;

CASE stSts.eState OF
    E_CascadeState.Stopped:
        FOR i := 1 TO 5 DO
            aVSD[i].Cmd.xRunCmd := FALSE;
            aVSD[i].Cmd.rSpeedRefPct := 0.0;
        END_FOR;

        stSts.xAlarmNoAvailableVSD := FALSE;
        stSts.xAlarmStageFail := FALSE;
        stSts.iLeadIndex := 0;
        stSts.iNextStageIndex := 0;

        IF stCmd.xStart AND stSts.xPermissiveOK THEN
            stSts.eState := E_CascadeState.SelectLead;
        END_IF;

    E_CascadeState.SelectLead:
        stSts.iLeadIndex := 0;

        FOR i := 0 TO 4 DO
            iScanIndex := iNextLeadIndex + i;
            IF iScanIndex > 5 THEN
                iScanIndex := iScanIndex - 5;
            END_IF;

            IF aVSD[iScanIndex].Sts.xAvailable AND atMinStop[iScanIndex].Q THEN
                stSts.iLeadIndex := iScanIndex;
                iNextLeadIndex := stSts.iLeadIndex + 1;
                IF iNextLeadIndex > 5 THEN
                    iNextLeadIndex := 1;
                END_IF;
                EXIT;
            END_IF;
        END_FOR;

        IF stSts.iLeadIndex > 0 THEN
            stSts.eState := E_CascadeState.StartLead;
        ELSE
            stSts.xAlarmNoAvailableVSD := TRUE;
            stSts.eState := E_CascadeState.Tripped;
        END_IF;

    E_CascadeState.StartLead:
        aVSD[stSts.iLeadIndex].Cmd.xRunCmd := TRUE;
        aVSD[stSts.iLeadIndex].Cmd.rSpeedRefPct := stSts.rSpeedDemandPct;

        IF aVSD[stSts.iLeadIndex].Sts.xRunning THEN
            stSts.eState := E_CascadeState.RunningCascade;
        ELSIF NOT stSts.xPermissiveOK THEN
            stSts.eState := E_CascadeState.Stopped;
        END_IF;

    E_CascadeState.RunningCascade:
        FOR i := 1 TO 5 DO
            IF aVSD[i].Cmd.xRunCmd THEN
                aVSD[i].Cmd.rSpeedRefPct := stSts.rSpeedDemandPct;
            ELSE
                aVSD[i].Cmd.rSpeedRefPct := 0.0;
            END_IF;
        END_FOR;

        tStageOn(
            IN := (stSts.rSpeedDemandPct >= cfg.rStageOnSpeedPct) AND
                  (stSts.iRunningCount < cfg.iMaxRunning),
            PT := cfg.tStageOnDelay
        );

        tStageOff(
            IN := (stSts.rSpeedDemandPct <= cfg.rStageOffSpeedPct) AND
                  (stSts.iRunningCount > 1),
            PT := cfg.tStageOffDelay
        );

        IF tStageOn.Q THEN
            stSts.eState := E_CascadeState.StageUp;
        ELSIF tStageOff.Q THEN
            stSts.eState := E_CascadeState.StageDown;
        END_IF;

    E_CascadeState.StageUp:
        stSts.iNextStageIndex := 0;

        FOR i := 1 TO 5 DO
            iScanIndex := stSts.iLeadIndex + i;
            IF iScanIndex > 5 THEN
                iScanIndex := iScanIndex - 5;
            END_IF;

            IF aVSD[iScanIndex].Sts.xAvailable AND
               NOT aVSD[iScanIndex].Cmd.xRunCmd AND
               atMinStop[iScanIndex].Q THEN
                stSts.iNextStageIndex := iScanIndex;
                EXIT;
            END_IF;
        END_FOR;

        IF stSts.iNextStageIndex > 0 THEN
            aVSD[stSts.iNextStageIndex].Cmd.xRunCmd := TRUE;
            aVSD[stSts.iNextStageIndex].Cmd.rSpeedRefPct := stSts.rSpeedDemandPct;
        ELSE
            stSts.xAlarmStageFail := TRUE;
        END_IF;

        tStageOn(IN := FALSE, PT := cfg.tStageOnDelay);
        stSts.eState := E_CascadeState.RunningCascade;

    E_CascadeState.StageDown:
        stSts.iNextStageIndex := 0;

        FOR i := 5 TO 1 BY -1 DO
            iScanIndex := stSts.iLeadIndex + i - 1;
            IF iScanIndex > 5 THEN
                iScanIndex := iScanIndex - 5;
            END_IF;

            IF (iScanIndex <> stSts.iLeadIndex) AND
               aVSD[iScanIndex].Cmd.xRunCmd AND
               atMinRun[iScanIndex].Q THEN
                stSts.iNextStageIndex := iScanIndex;
                EXIT;
            END_IF;
        END_FOR;

        IF stSts.iNextStageIndex > 0 THEN
            aVSD[stSts.iNextStageIndex].Cmd.xRunCmd := FALSE;
            aVSD[stSts.iNextStageIndex].Cmd.rSpeedRefPct := 0.0;
        END_IF;

        tStageOff(IN := FALSE, PT := cfg.tStageOffDelay);
        stSts.eState := E_CascadeState.RunningCascade;

    E_CascadeState.Tripped:
        FOR i := 1 TO 5 DO
            aVSD[i].Cmd.xRunCmd := FALSE;
            aVSD[i].Cmd.rSpeedRefPct := 0.0;
        END_FOR;

        IF stCmd.xReset AND NOT stSts.xAnyTrip THEN
            stSts.eState := E_CascadeState.Stopped;
        END_IF;

ELSE
    stSts.eState := E_CascadeState.Tripped;
END_CASE;
