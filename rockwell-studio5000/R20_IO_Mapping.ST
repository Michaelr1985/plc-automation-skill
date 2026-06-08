(* Example I/O mapping routine.
   Keep physical I/O and Ethernet/IP drive assemblies mapped in one place. *)

(* Inputs from hardwired I/O or drive comms into internal VSD structures. *)
CP01_VSD[0].Sts.Ready := I_VSD01_Ready;
CP01_VSD[0].Sts.Running := I_VSD01_Running;
CP01_VSD[0].Sts.Faulted := I_VSD01_Faulted;
CP01_VSD[0].Sts.Local := I_VSD01_Local;

CP01_VSD[1].Sts.Ready := I_VSD02_Ready;
CP01_VSD[1].Sts.Running := I_VSD02_Running;
CP01_VSD[1].Sts.Faulted := I_VSD02_Faulted;
CP01_VSD[1].Sts.Local := I_VSD02_Local;

CP01_VSD[2].Sts.Ready := I_VSD03_Ready;
CP01_VSD[2].Sts.Running := I_VSD03_Running;
CP01_VSD[2].Sts.Faulted := I_VSD03_Faulted;
CP01_VSD[2].Sts.Local := I_VSD03_Local;

CP01_VSD[3].Sts.Ready := I_VSD04_Ready;
CP01_VSD[3].Sts.Running := I_VSD04_Running;
CP01_VSD[3].Sts.Faulted := I_VSD04_Faulted;
CP01_VSD[3].Sts.Local := I_VSD04_Local;

CP01_VSD[4].Sts.Ready := I_VSD05_Ready;
CP01_VSD[4].Sts.Running := I_VSD05_Running;
CP01_VSD[4].Sts.Faulted := I_VSD05_Faulted;
CP01_VSD[4].Sts.Local := I_VSD05_Local;

(* Outputs from internal VSD structures to hardwired I/O or drive comms. *)
O_VSD01_RunCmd := CP01_VSD[0].Cmd.RunCmd;
O_VSD01_SpeedRefPct := CP01_VSD[0].Cmd.SpeedRefPct;

O_VSD02_RunCmd := CP01_VSD[1].Cmd.RunCmd;
O_VSD02_SpeedRefPct := CP01_VSD[1].Cmd.SpeedRefPct;

O_VSD03_RunCmd := CP01_VSD[2].Cmd.RunCmd;
O_VSD03_SpeedRefPct := CP01_VSD[2].Cmd.SpeedRefPct;

O_VSD04_RunCmd := CP01_VSD[3].Cmd.RunCmd;
O_VSD04_SpeedRefPct := CP01_VSD[3].Cmd.SpeedRefPct;

O_VSD05_RunCmd := CP01_VSD[4].Cmd.RunCmd;
O_VSD05_SpeedRefPct := CP01_VSD[4].Cmd.SpeedRefPct;
