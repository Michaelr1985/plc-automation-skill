PROGRAM PRG_Main
VAR
    fbCascade : FB_VSD_Cascade5;
END_VAR

(* Map raw inputs into the internal VSD structures. *)
CP01_VSD[1].Sts.xReady := I_VSD01_xReady;
CP01_VSD[1].Sts.xRunning := I_VSD01_xRunning;
CP01_VSD[1].Sts.xFaulted := I_VSD01_xFaulted;
CP01_VSD[1].Sts.xLocal := I_VSD01_xLocal;

CP01_VSD[2].Sts.xReady := I_VSD02_xReady;
CP01_VSD[2].Sts.xRunning := I_VSD02_xRunning;
CP01_VSD[2].Sts.xFaulted := I_VSD02_xFaulted;
CP01_VSD[2].Sts.xLocal := I_VSD02_xLocal;

CP01_VSD[3].Sts.xReady := I_VSD03_xReady;
CP01_VSD[3].Sts.xRunning := I_VSD03_xRunning;
CP01_VSD[3].Sts.xFaulted := I_VSD03_xFaulted;
CP01_VSD[3].Sts.xLocal := I_VSD03_xLocal;

CP01_VSD[4].Sts.xReady := I_VSD04_xReady;
CP01_VSD[4].Sts.xRunning := I_VSD04_xRunning;
CP01_VSD[4].Sts.xFaulted := I_VSD04_xFaulted;
CP01_VSD[4].Sts.xLocal := I_VSD04_xLocal;

CP01_VSD[5].Sts.xReady := I_VSD05_xReady;
CP01_VSD[5].Sts.xRunning := I_VSD05_xRunning;
CP01_VSD[5].Sts.xFaulted := I_VSD05_xFaulted;
CP01_VSD[5].Sts.xLocal := I_VSD05_xLocal;

(* Cascade control. CP01.rPIDOutPct should come from a CODESYS PID/PID_FIXCYCLE loop or external demand calculation. *)
fbCascade(
    xEStopOK := CP01_xEStopOK,
    xProcessPermissiveOK := CP01_xProcessPermissiveOK,
    stCmd := CP01.Cmd,
    stCfg := CP01.Cfg,
    rPIDOutPct := CP01.rPIDOutPct,
    aVSD := CP01_VSD,
    stSts => CP01.Sts
);

(* Map internal commands to raw outputs. *)
O_VSD01_xRunCmd := CP01_VSD[1].Cmd.xRunCmd;
O_VSD01_rSpeedRefPct := CP01_VSD[1].Cmd.rSpeedRefPct;

O_VSD02_xRunCmd := CP01_VSD[2].Cmd.xRunCmd;
O_VSD02_rSpeedRefPct := CP01_VSD[2].Cmd.rSpeedRefPct;

O_VSD03_xRunCmd := CP01_VSD[3].Cmd.xRunCmd;
O_VSD03_rSpeedRefPct := CP01_VSD[3].Cmd.rSpeedRefPct;

O_VSD04_xRunCmd := CP01_VSD[4].Cmd.xRunCmd;
O_VSD04_rSpeedRefPct := CP01_VSD[4].Cmd.rSpeedRefPct;

O_VSD05_xRunCmd := CP01_VSD[5].Cmd.xRunCmd;
O_VSD05_rSpeedRefPct := CP01_VSD[5].Cmd.rSpeedRefPct;
