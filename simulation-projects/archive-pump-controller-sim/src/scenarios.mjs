import assert from "node:assert/strict";
import { initRuntime, PLC_STEP, scan, scaleAnalog } from "./plcRuntime.mjs";

function driveToRunning(runtime) {
  scan(runtime, { startPb: true });
  scan(runtime, { startPb: false });
  scan(runtime, { driveRunning: false });
  scan(runtime, { driveRunning: true });
  return runtime;
}

function result(id, name, fn) {
  const evidence = [];
  fn(evidence);
  return {
    id,
    name,
    status: "PASS",
    evidence
  };
}

export const scenarios = [
  () =>
    result("SIM-001", "Boot state has safe outputs", (evidence) => {
      const runtime = initRuntime();
      assert.equal(runtime.retain.mainSeqStep, PLC_STEP.STOPPED);
      assert.deepEqual(runtime.outputs, {
        driveRunCmd: false,
        alarmLight: false,
        runLight: false
      });
      evidence.push("Runtime initialized stopped with all outputs de-energized.");
    }),

  () =>
    result("SIM-002", "Normal start, run, and stop sequence", (evidence) => {
      const runtime = initRuntime();
      scan(runtime, { startPb: true });
      assert.equal(runtime.retain.mainSeqStep, PLC_STEP.PRECHECK);
      scan(runtime, { startPb: false });
      assert.equal(runtime.retain.mainSeqStep, PLC_STEP.STARTING);
      scan(runtime, { driveRunning: false });
      assert.equal(runtime.outputs.driveRunCmd, true);
      scan(runtime, { driveRunning: true });
      assert.equal(runtime.retain.mainSeqStep, PLC_STEP.RUNNING);
      assert.equal(runtime.retain.starts, 1);
      scan(runtime, { stopPb: true, driveRunning: true });
      assert.equal(runtime.outputs.driveRunCmd, false);
      assert.equal(runtime.retain.mainSeqStep, PLC_STEP.STOPPING);
      scan(runtime, { driveRunning: false });
      assert.equal(runtime.retain.mainSeqStep, PLC_STEP.STOPPED);
      evidence.push("Start pulse moved sequence to PRECHECK/STARTING/RUNNING; stop pulse forced STOPPING then STOPPED.");
    }),

  () =>
    result("SIM-003", "E-stop trip de-energizes outputs", (evidence) => {
      const runtime = driveToRunning(initRuntime());
      scan(runtime, { estopOk: false, driveRunning: true });
      assert.equal(runtime.retain.tripLatched, true);
      assert.equal(runtime.retain.mainSeqStep, PLC_STEP.FAULTED);
      assert.equal(runtime.outputs.driveRunCmd, false);
      assert.equal(runtime.outputs.alarmLight, true);
      evidence.push("Loss of estop_ok latched trip, entered FAULTED, and dropped drive command.");
    }),

  () =>
    result("SIM-004", "Drive fault latches trip and de-energizes outputs", (evidence) => {
      const runtime = driveToRunning(initRuntime());
      scan(runtime, { driveFault: true, driveRunning: true });
      assert.equal(runtime.retain.tripLatched, true);
      assert.equal(runtime.retain.mainSeqStep, PLC_STEP.FAULTED);
      assert.equal(runtime.outputs.driveRunCmd, false);
      evidence.push("Drive fault latched trip and removed run command.");
    }),

  () =>
    result("SIM-005", "Reset clears only after fault cause clears and does not restart", (evidence) => {
      const runtime = driveToRunning(initRuntime());
      scan(runtime, { driveFault: true, driveRunning: true });
      scan(runtime, { driveFault: true, resetPb: true });
      assert.equal(runtime.retain.tripLatched, true);
      assert.equal(runtime.retain.mainSeqStep, PLC_STEP.FAULTED);
      scan(runtime, { driveFault: false, resetPb: false });
      scan(runtime, { driveFault: false, resetPb: true });
      assert.equal(runtime.retain.tripLatched, false);
      assert.equal(runtime.retain.mainSeqStep, PLC_STEP.STOPPED);
      assert.equal(runtime.outputs.driveRunCmd, false);
      scan(runtime, { driveFault: false, resetPb: false });
      assert.equal(runtime.retain.mainSeqStep, PLC_STEP.STOPPED);
      evidence.push("Reset during active fault was ignored; reset after cause cleared returned to STOPPED without starting.");
    }),

  () =>
    result("SIM-006", "Power recovery from retained running state forces safe stopped/tripped state", (evidence) => {
      const runtime = initRuntime({ mainSeqStep: PLC_STEP.RUNNING, tripLatched: false, starts: 12 });
      assert.equal(runtime.retain.mainSeqStep, PLC_STEP.STOPPED);
      assert.equal(runtime.retain.tripLatched, true);
      assert.equal(runtime.outputs.driveRunCmd, false);
      scan(runtime, { startPb: true });
      assert.equal(runtime.retain.mainSeqStep, PLC_STEP.STOPPED);
      assert.equal(runtime.outputs.driveRunCmd, false);
      evidence.push("Retained RUNNING state on boot was converted to STOPPED with tripLatched=true and no auto restart.");
    }),

  () =>
    result("SIM-007", "Stale remote BLE/Wi-Fi command is ignored", (evidence) => {
      const runtime = initRuntime();
      scan(runtime, {
        remoteCommand: "start",
        remoteCommandAgeMs: 2500,
        commsHealthy: true
      });
      assert.equal(runtime.retain.mainSeqStep, PLC_STEP.STOPPED);
      assert.equal(runtime.outputs.driveRunCmd, false);
      scan(runtime, {
        remoteCommand: "start",
        remoteCommandAgeMs: 100,
        commsHealthy: false
      });
      assert.equal(runtime.retain.mainSeqStep, PLC_STEP.STOPPED);
      assert.equal(runtime.outputs.driveRunCmd, false);
      evidence.push("Expired and unhealthy remote start commands did not create a start pulse.");
    }),

  () =>
    result("SIM-008", "Analog scaling clamps and scales low/mid/high values", (evidence) => {
      const config = {
        analogMinRaw: 0,
        analogMaxRaw: 4095,
        analogMinEng: 0,
        analogMaxEng: 100
      };
      assert.equal(scaleAnalog(-100, config), 0);
      assert.equal(scaleAnalog(0, config), 0);
      assert.ok(Math.abs(scaleAnalog(2048, config) - 50.01) < 0.05);
      assert.equal(scaleAnalog(4095, config), 100);
      assert.equal(scaleAnalog(5000, config), 100);
      evidence.push("Raw ADC values clamp at limits and scale midpoint to approximately 50%.");
    })
];
