TYPE E_CascadeState :
(
    Stopped := 0,
    SelectLead := 10,
    StartLead := 20,
    RunningCascade := 30,
    StageUp := 40,
    StageDown := 50,
    Tripped := 90
);
END_TYPE

TYPE ST_VSD_Cmd :
STRUCT
    xInhibit : BOOL;
    xRunCmd : BOOL;
    rSpeedRefPct : REAL;
END_STRUCT
END_TYPE

TYPE ST_VSD_Sts :
STRUCT
    xReady : BOOL;
    xRunning : BOOL;
    xFaulted : BOOL;
    xLocal : BOOL;
    xAvailable : BOOL;
    xTripLatched : BOOL;
    xStartFail : BOOL;
    rRuntimeHours : REAL;
    rSpeedFbPct : REAL;
END_STRUCT
END_TYPE

TYPE ST_VSD :
STRUCT
    Cmd : ST_VSD_Cmd;
    Sts : ST_VSD_Sts;
END_STRUCT
END_TYPE

TYPE ST_CascadeCmd :
STRUCT
    xAutoMode : BOOL;
    xManualMode : BOOL;
    xStart : BOOL;
    xStop : BOOL;
    xReset : BOOL;
    xRotateLead : BOOL;
END_STRUCT
END_TYPE

TYPE ST_CascadeCfg :
STRUCT
    iMaxRunning : INT := 5;
    rStageOnSpeedPct : REAL := 90.0;
    rStageOffSpeedPct : REAL := 45.0;
    tStageOnDelay : TIME := T#30S;
    tStageOffDelay : TIME := T#60S;
    tStartTimeout : TIME := T#10S;
    tMinRunTime : TIME := T#120S;
    tMinStopTime : TIME := T#120S;
    rSpeedMinPct : REAL := 0.0;
    rSpeedMaxPct : REAL := 100.0;
END_STRUCT
END_TYPE

TYPE ST_CascadeSts :
STRUCT
    eState : E_CascadeState;
    xAnyTrip : BOOL;
    xPermissiveOK : BOOL;
    iRunningCount : INT;
    iAvailableCount : INT;
    iLeadIndex : INT;
    iNextStageIndex : INT;
    rSpeedDemandPct : REAL;
    xAlarmNoAvailableVSD : BOOL;
    xAlarmStageFail : BOOL;
END_STRUCT
END_TYPE

TYPE ST_Cascade :
STRUCT
    Cmd : ST_CascadeCmd;
    Cfg : ST_CascadeCfg;
    Sts : ST_CascadeSts;
    rPV : REAL;
    rSP : REAL;
    rPIDOutPct : REAL;
END_STRUCT
END_TYPE
