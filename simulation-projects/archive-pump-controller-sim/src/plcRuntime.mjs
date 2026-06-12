export const PLC_STEP = Object.freeze({
  STOPPED: 0,
  PRECHECK: 10,
  STARTING: 20,
  RUNNING: 30,
  STOPPING: 40,
  FAULTED: 90
});

export const DEFAULT_REMOTE_COMMAND_EXPIRY_MS = 1000;

export function defaultInputs(overrides = {}) {
  return {
    estopOk: true,
    startPb: false,
    stopPb: false,
    resetPb: false,
    driveReady: true,
    driveRunning: false,
    driveFault: false,
    adcRaw: 0,
    remoteCommand: null,
    remoteCommandAgeMs: 0,
    commsHealthy: true,
    ...overrides
  };
}

export function defaultRuntime(retainOverrides = {}) {
  return {
    startPrev: false,
    stopPrev: false,
    resetPrev: false,
    startPulse: false,
    stopPulse: false,
    resetPulse: false,
    permissiveOk: false,
    activeTrip: false,
    processValue: 0,
    retain: {
      mainSeqStep: PLC_STEP.STOPPED,
      tripLatched: false,
      starts: 0,
      ...retainOverrides
    },
    outputs: safeOutputs(),
    ioConfig: {
      analogMinRaw: 0,
      analogMaxRaw: 4095,
      analogMinEng: 0,
      analogMaxEng: 100
    }
  };
}

export function initRuntime(retainOverrides = {}) {
  const runtime = defaultRuntime(retainOverrides);

  if (
    runtime.retain.mainSeqStep === PLC_STEP.RUNNING ||
    runtime.retain.mainSeqStep === PLC_STEP.STARTING
  ) {
    runtime.retain.mainSeqStep = PLC_STEP.STOPPED;
    runtime.retain.tripLatched = true;
  }

  return runtime;
}

export function scan(runtime, rawInputs = {}) {
  const inputs = defaultInputs(rawInputs);
  const remoteStart = validRemoteCommand(inputs, "start");
  const remoteStop = validRemoteCommand(inputs, "stop");
  const startRequest = inputs.startPb || remoteStart;
  const stopRequest = inputs.stopPb || remoteStop;

  runtime.startPulse = startRequest && !runtime.startPrev;
  runtime.stopPulse = stopRequest && !runtime.stopPrev;
  runtime.resetPulse = inputs.resetPb && !runtime.resetPrev;

  runtime.startPrev = startRequest;
  runtime.stopPrev = stopRequest;
  runtime.resetPrev = inputs.resetPb;

  runtime.processValue = scaleAnalog(inputs.adcRaw, runtime.ioConfig);
  runtime.activeTrip = !inputs.estopOk || !inputs.driveReady || inputs.driveFault;

  if (runtime.activeTrip) {
    runtime.retain.tripLatched = true;
    runtime.retain.mainSeqStep = PLC_STEP.FAULTED;
  }

  if (runtime.resetPulse && !runtime.activeTrip) {
    runtime.retain.tripLatched = false;
    if (runtime.retain.mainSeqStep === PLC_STEP.FAULTED) {
      runtime.retain.mainSeqStep = PLC_STEP.STOPPED;
    }
  }

  runtime.permissiveOk =
    inputs.estopOk &&
    inputs.driveReady &&
    !inputs.driveFault &&
    !runtime.retain.tripLatched;

  switch (runtime.retain.mainSeqStep) {
    case PLC_STEP.STOPPED:
      runtime.outputs = safeOutputs();
      if (runtime.startPulse && runtime.permissiveOk) {
        runtime.retain.mainSeqStep = PLC_STEP.PRECHECK;
      }
      break;

    case PLC_STEP.PRECHECK:
      runtime.outputs = safeOutputs();
      if (!runtime.permissiveOk) {
        runtime.retain.mainSeqStep = PLC_STEP.FAULTED;
      } else {
        runtime.retain.mainSeqStep = PLC_STEP.STARTING;
      }
      break;

    case PLC_STEP.STARTING:
      runtime.outputs.driveRunCmd = runtime.permissiveOk && !runtime.stopPulse;
      runtime.outputs.runLight = runtime.outputs.driveRunCmd;
      runtime.outputs.alarmLight = false;
      if (inputs.driveRunning) {
        runtime.retain.starts += 1;
        runtime.retain.mainSeqStep = PLC_STEP.RUNNING;
      } else if (!runtime.outputs.driveRunCmd) {
        runtime.retain.mainSeqStep = PLC_STEP.STOPPED;
      }
      break;

    case PLC_STEP.RUNNING:
      runtime.outputs.driveRunCmd = runtime.permissiveOk && !runtime.stopPulse;
      runtime.outputs.runLight = runtime.outputs.driveRunCmd;
      runtime.outputs.alarmLight = false;
      if (!runtime.outputs.driveRunCmd) {
        runtime.retain.mainSeqStep = PLC_STEP.STOPPING;
      }
      break;

    case PLC_STEP.STOPPING:
      runtime.outputs = safeOutputs();
      if (!inputs.driveRunning) {
        runtime.retain.mainSeqStep = PLC_STEP.STOPPED;
      }
      break;

    case PLC_STEP.FAULTED:
      runtime.outputs = { ...safeOutputs(), alarmLight: true };
      break;

    default:
      runtime.outputs = safeOutputs();
      runtime.retain.tripLatched = true;
      runtime.retain.mainSeqStep = PLC_STEP.FAULTED;
      break;
  }

  return runtime;
}

export function scaleAnalog(raw, config) {
  if (!config || config.analogMaxRaw <= config.analogMinRaw) {
    return 0;
  }

  const normalized = clamp(
    (raw - config.analogMinRaw) / (config.analogMaxRaw - config.analogMinRaw),
    0,
    1
  );

  return config.analogMinEng + normalized * (config.analogMaxEng - config.analogMinEng);
}

export function safeOutputs() {
  return {
    driveRunCmd: false,
    alarmLight: false,
    runLight: false
  };
}

function validRemoteCommand(inputs, command) {
  return (
    inputs.commsHealthy &&
    inputs.remoteCommand === command &&
    inputs.remoteCommandAgeMs <= DEFAULT_REMOTE_COMMAND_EXPIRY_MS
  );
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
