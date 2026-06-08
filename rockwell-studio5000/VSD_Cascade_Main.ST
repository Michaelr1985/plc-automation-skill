(* Rockwell Studio 5000 Structured Text routine for 5 VSD cascade control.
   Recommended use: call from a 100 ms to 250 ms periodic task.
   Safety-rated stops, STO, E-stops, and GuardLogix safety logic must be engineered separately. *)

(* Default configuration clamps. *)
IF CP01.Cfg.MaxRunning < 1 THEN
    CP01.Cfg.MaxRunning := 1;
ELSIF CP01.Cfg.MaxRunning > 5 THEN
    CP01.Cfg.MaxRunning := 5;
END_IF;

IF CP01.Cfg.SpeedMinPct < 0.0 THEN
    CP01.Cfg.SpeedMinPct := 0.0;
END_IF;

IF CP01.Cfg.SpeedMaxPct > 100.0 THEN
    CP01.Cfg.SpeedMaxPct := 100.0;
END_IF;

IF CP01.Cfg.SpeedMaxPct < CP01.Cfg.SpeedMinPct THEN
    CP01.Cfg.SpeedMaxPct := CP01.Cfg.SpeedMinPct;
END_IF;

(* Clamp PID/speed demand. PID is normally calculated in a separate PIDE routine. *)
CP01.Sts.SpeedDemandPct := CP01.PIDOutPct;
IF CP01.Sts.SpeedDemandPct < CP01.Cfg.SpeedMinPct THEN
    CP01.Sts.SpeedDemandPct := CP01.Cfg.SpeedMinPct;
ELSIF CP01.Sts.SpeedDemandPct > CP01.Cfg.SpeedMaxPct THEN
    CP01.Sts.SpeedDemandPct := CP01.Cfg.SpeedMaxPct;
END_IF;

(* Group permissive. Reset never starts equipment. *)
CP01.Sts.PermissiveOK :=
    CP01.Cmd.AutoMode AND
    CP01_EStopOK AND
    CP01_ProcessPermissiveOK;

CP01.Sts.AnyTrip := NOT CP01_EStopOK OR NOT CP01_ProcessPermissiveOK;

(* Lead rotation request. Applies to the next start or next stage search. *)
IF CP01.Cmd.RotateLead AND NOT CP01_RotateLeadPrev THEN
    CP01_NextLeadIndex := (CP01_NextLeadIndex + 1) MOD 5;
END_IF;
CP01_RotateLeadPrev := CP01.Cmd.RotateLead;

IF (CP01_NextLeadIndex < 0) OR (CP01_NextLeadIndex > 4) THEN
    CP01_NextLeadIndex := 0;
END_IF;

(* Per-drive availability, trips, and feedback timers. *)
CP01.Sts.RunningCount := 0;
CP01.Sts.AvailableCount := 0;

FOR CP01_i := 0 TO 4 DO
    CP01_VSD[CP01_i].Sts.Available :=
        CP01_VSD[CP01_i].Sts.Ready AND
        NOT CP01_VSD[CP01_i].Sts.Faulted AND
        NOT CP01_VSD[CP01_i].Sts.Local AND
        NOT CP01_VSD[CP01_i].Cmd.Inhibit AND
        NOT CP01_VSD[CP01_i].Sts.TripLatched;

    IF CP01_VSD[CP01_i].Sts.Faulted OR NOT CP01_EStopOK THEN
        CP01_VSD[CP01_i].Sts.TripLatched := TRUE;
    END_IF;

    IF CP01.Cmd.Reset AND NOT CP01_VSD[CP01_i].Sts.Faulted AND CP01_EStopOK THEN
        CP01_VSD[CP01_i].Sts.TripLatched := FALSE;
        CP01_VSD[CP01_i].Sts.StartFail := FALSE;
    END_IF;

    IF CP01_VSD[CP01_i].Sts.Running THEN
        CP01.Sts.RunningCount := CP01.Sts.RunningCount + 1;
    END_IF;

    IF CP01_VSD[CP01_i].Sts.Available THEN
        CP01.Sts.AvailableCount := CP01.Sts.AvailableCount + 1;
    END_IF;

    CP01_tStartFail[CP01_i].PRE := CP01.Cfg.StartTimeoutMs;
    IF CP01_VSD[CP01_i].Cmd.RunCmd AND NOT CP01_VSD[CP01_i].Sts.Running THEN
        TON(CP01_tStartFail[CP01_i]);
    ELSE
        RES(CP01_tStartFail[CP01_i]);
    END_IF;

    IF CP01_tStartFail[CP01_i].DN THEN
        CP01_VSD[CP01_i].Sts.StartFail := TRUE;
        CP01_VSD[CP01_i].Sts.TripLatched := TRUE;
    END_IF;

    CP01_tMinRun[CP01_i].PRE := CP01.Cfg.MinRunTimeMs;
    IF CP01_VSD[CP01_i].Sts.Running THEN
        TON(CP01_tMinRun[CP01_i]);
    ELSE
        RES(CP01_tMinRun[CP01_i]);
    END_IF;

    CP01_tMinStop[CP01_i].PRE := CP01.Cfg.MinStopTimeMs;
    IF NOT CP01_VSD[CP01_i].Sts.Running THEN
        TON(CP01_tMinStop[CP01_i]);
    ELSE
        RES(CP01_tMinStop[CP01_i]);
    END_IF;
END_FOR;

IF CP01.Sts.AnyTrip OR CP01.Cmd.Stop THEN
    CP01.Sts.State := 0;
END_IF;

(* State machine. *)
CASE CP01.Sts.State OF
    0: (* Stopped *)
        FOR CP01_i := 0 TO 4 DO
            CP01_VSD[CP01_i].Cmd.RunCmd := FALSE;
            CP01_VSD[CP01_i].Cmd.SpeedRefPct := 0.0;
        END_FOR;

        CP01.Sts.AlarmNoAvailableVSD := FALSE;
        CP01.Sts.AlarmStageFail := FALSE;

        IF CP01.Cmd.Start AND CP01.Sts.PermissiveOK THEN
            CP01.Sts.State := 10;
        END_IF;

    10: (* Select lead *)
        CP01.Sts.LeadIndex := -1;

        FOR CP01_i := 0 TO 4 DO
            CP01_scanIndex := (CP01_NextLeadIndex + CP01_i) MOD 5;

            IF CP01_VSD[CP01_scanIndex].Sts.Available AND CP01_tMinStop[CP01_scanIndex].DN THEN
                CP01.Sts.LeadIndex := CP01_scanIndex;
                CP01_NextLeadIndex := (CP01.Sts.LeadIndex + 1) MOD 5;
                EXIT;
            END_IF;
        END_FOR;

        IF CP01.Sts.LeadIndex >= 0 THEN
            CP01.Sts.State := 20;
        ELSE
            CP01.Sts.AlarmNoAvailableVSD := TRUE;
            CP01.Sts.State := 90;
        END_IF;

    20: (* Start lead *)
        CP01_VSD[CP01.Sts.LeadIndex].Cmd.RunCmd := TRUE;
        CP01_VSD[CP01.Sts.LeadIndex].Cmd.SpeedRefPct := CP01.Sts.SpeedDemandPct;

        IF CP01_VSD[CP01.Sts.LeadIndex].Sts.Running THEN
            CP01.Sts.State := 30;
        ELSIF NOT CP01.Sts.PermissiveOK THEN
            CP01.Sts.State := 0;
        END_IF;

    30: (* Running cascade *)
        FOR CP01_i := 0 TO 4 DO
            IF CP01_VSD[CP01_i].Cmd.RunCmd THEN
                CP01_VSD[CP01_i].Cmd.SpeedRefPct := CP01.Sts.SpeedDemandPct;
            ELSE
                CP01_VSD[CP01_i].Cmd.SpeedRefPct := 0.0;
            END_IF;
        END_FOR;

        CP01_tStageOn.PRE := CP01.Cfg.StageOnDelayMs;
        IF (CP01.Sts.SpeedDemandPct >= CP01.Cfg.StageOnSpeedPct) AND
           (CP01.Sts.RunningCount < CP01.Cfg.MaxRunning) THEN
            TON(CP01_tStageOn);
        ELSE
            RES(CP01_tStageOn);
        END_IF;

        CP01_tStageOff.PRE := CP01.Cfg.StageOffDelayMs;
        IF (CP01.Sts.SpeedDemandPct <= CP01.Cfg.StageOffSpeedPct) AND
           (CP01.Sts.RunningCount > 1) THEN
            TON(CP01_tStageOff);
        ELSE
            RES(CP01_tStageOff);
        END_IF;

        IF CP01_tStageOn.DN THEN
            CP01.Sts.State := 40;
        ELSIF CP01_tStageOff.DN THEN
            CP01.Sts.State := 50;
        END_IF;

    40: (* Stage up next available VSD *)
        CP01.Sts.NextStageIndex := -1;

        FOR CP01_i := 1 TO 5 DO
            CP01_scanIndex := (CP01.Sts.LeadIndex + CP01_i) MOD 5;

            IF CP01_VSD[CP01_scanIndex].Sts.Available AND
               NOT CP01_VSD[CP01_scanIndex].Cmd.RunCmd AND
               CP01_tMinStop[CP01_scanIndex].DN THEN
                CP01.Sts.NextStageIndex := CP01_scanIndex;
                EXIT;
            END_IF;
        END_FOR;

        IF CP01.Sts.NextStageIndex >= 0 THEN
            CP01_VSD[CP01.Sts.NextStageIndex].Cmd.RunCmd := TRUE;
            CP01_VSD[CP01.Sts.NextStageIndex].Cmd.SpeedRefPct := CP01.Sts.SpeedDemandPct;
        ELSE
            CP01.Sts.AlarmStageFail := TRUE;
        END_IF;

        RES(CP01_tStageOn);
        CP01.Sts.State := 30;

    50: (* Stage down last lag VSD *)
        CP01.Sts.NextStageIndex := -1;

        FOR CP01_i := 4 TO 0 BY -1 DO
            CP01_scanIndex := (CP01.Sts.LeadIndex + CP01_i) MOD 5;

            IF CP01_scanIndex <> CP01.Sts.LeadIndex AND
               CP01_VSD[CP01_scanIndex].Cmd.RunCmd AND
               CP01_tMinRun[CP01_scanIndex].DN THEN
                CP01.Sts.NextStageIndex := CP01_scanIndex;
                EXIT;
            END_IF;
        END_FOR;

        IF CP01.Sts.NextStageIndex >= 0 THEN
            CP01_VSD[CP01.Sts.NextStageIndex].Cmd.RunCmd := FALSE;
            CP01_VSD[CP01.Sts.NextStageIndex].Cmd.SpeedRefPct := 0.0;
        END_IF;

        RES(CP01_tStageOff);
        CP01.Sts.State := 30;

    90: (* Tripped/no available drive *)
        FOR CP01_i := 0 TO 4 DO
            CP01_VSD[CP01_i].Cmd.RunCmd := FALSE;
            CP01_VSD[CP01_i].Cmd.SpeedRefPct := 0.0;
        END_FOR;

        IF CP01.Cmd.Reset AND NOT CP01.Sts.AnyTrip THEN
            CP01.Sts.State := 0;
        END_IF;

ELSE
    CP01.Sts.State := 90;
END_CASE;

(* Map commands to physical or comms outputs in an I/O mapping routine.
   Example:
   O_VSD01_RunCmd := CP01_VSD[0].Cmd.RunCmd;
   O_VSD01_SpeedRefPct := CP01_VSD[0].Cmd.SpeedRefPct;
*)
