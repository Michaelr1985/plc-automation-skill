VAR_GLOBAL
    (* Group control and status. Bind HMI/SCADA tags to CP01 where required. *)
    CP01 : ST_Cascade;

    (* Internal VSD array, indexes 1..5. *)
    CP01_VSD : ARRAY[1..5] OF ST_VSD;

    (* Safety/process permissives mapped from real I/O or safety status. *)
    CP01_xEStopOK : BOOL;
    CP01_xProcessPermissiveOK : BOOL;

    (* Raw VSD inputs. Replace these with mapped fieldbus or I/O addresses. *)
    I_VSD01_xReady : BOOL;
    I_VSD01_xRunning : BOOL;
    I_VSD01_xFaulted : BOOL;
    I_VSD01_xLocal : BOOL;

    I_VSD02_xReady : BOOL;
    I_VSD02_xRunning : BOOL;
    I_VSD02_xFaulted : BOOL;
    I_VSD02_xLocal : BOOL;

    I_VSD03_xReady : BOOL;
    I_VSD03_xRunning : BOOL;
    I_VSD03_xFaulted : BOOL;
    I_VSD03_xLocal : BOOL;

    I_VSD04_xReady : BOOL;
    I_VSD04_xRunning : BOOL;
    I_VSD04_xFaulted : BOOL;
    I_VSD04_xLocal : BOOL;

    I_VSD05_xReady : BOOL;
    I_VSD05_xRunning : BOOL;
    I_VSD05_xFaulted : BOOL;
    I_VSD05_xLocal : BOOL;

    (* Raw VSD outputs. Replace these with mapped fieldbus or I/O addresses. *)
    O_VSD01_xRunCmd : BOOL;
    O_VSD01_rSpeedRefPct : REAL;

    O_VSD02_xRunCmd : BOOL;
    O_VSD02_rSpeedRefPct : REAL;

    O_VSD03_xRunCmd : BOOL;
    O_VSD03_rSpeedRefPct : REAL;

    O_VSD04_xRunCmd : BOOL;
    O_VSD04_rSpeedRefPct : REAL;

    O_VSD05_xRunCmd : BOOL;
    O_VSD05_rSpeedRefPct : REAL;
END_VAR
