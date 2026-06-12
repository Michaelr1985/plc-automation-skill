import { initRuntime, PLC_STEP, scan } from "../src/plcRuntime.mjs";

const runtime = initRuntime();
const state = {
  momentary: {
    startPb: false,
    stopPb: false,
    resetPb: false
  },
  previousStep: runtime.retain.mainSeqStep,
  previousTrip: runtime.retain.tripLatched,
  logEntries: []
};

const els = {
  alarmBanner: byId("alarmBanner"),
  startBtn: byId("startBtn"),
  stopBtn: byId("stopBtn"),
  resetBtn: byId("resetBtn"),
  estopToggle: byId("estopToggle"),
  readyToggle: byId("readyToggle"),
  runningToggle: byId("runningToggle"),
  faultToggle: byId("faultToggle"),
  remoteCommand: byId("remoteCommand"),
  commsToggle: byId("commsToggle"),
  commandAge: byId("commandAge"),
  adcRaw: byId("adcRaw"),
  adcRawText: byId("adcRawText"),
  adcEngText: byId("adcEngText"),
  tankLevel: byId("tankLevel"),
  pvText: byId("pvText"),
  pumpSymbol: byId("pumpSymbol"),
  vsdSymbol: byId("vsdSymbol"),
  driveText: byId("driveText"),
  ioEstop: byId("ioEstop"),
  ioReady: byId("ioReady"),
  ioRunning: byId("ioRunning"),
  ioFault: byId("ioFault"),
  outRun: byId("outRun"),
  outRunLight: byId("outRunLight"),
  outAlarm: byId("outAlarm"),
  startsCounter: byId("startsCounter"),
  stepText: byId("stepText"),
  permissiveText: byId("permissiveText"),
  activeTripText: byId("activeTripText"),
  tripLatchedText: byId("tripLatchedText"),
  eventLog: byId("eventLog")
};

bindMomentary(els.startBtn, "startPb", "Operator START pressed");
bindMomentary(els.stopBtn, "stopPb", "Operator STOP pressed");
bindMomentary(els.resetBtn, "resetPb", "Operator RESET pressed");

for (const input of [
  els.estopToggle,
  els.readyToggle,
  els.runningToggle,
  els.faultToggle,
  els.remoteCommand,
  els.commsToggle,
  els.commandAge,
  els.adcRaw
]) {
  input.addEventListener("input", () => render());
}

setInterval(() => {
  const inputs = collectInputs();
  scan(runtime, inputs);
  state.momentary.startPb = false;
  state.momentary.stopPb = false;
  state.momentary.resetPb = false;
  inspectEvents();
  render(inputs);
}, 50);

render(collectInputs());
log("Simulator ready");

function collectInputs() {
  return {
    estopOk: els.estopToggle.checked,
    startPb: state.momentary.startPb,
    stopPb: state.momentary.stopPb,
    resetPb: state.momentary.resetPb,
    driveReady: els.readyToggle.checked,
    driveRunning: els.runningToggle.checked,
    driveFault: els.faultToggle.checked,
    adcRaw: Number(els.adcRaw.value),
    remoteCommand: els.remoteCommand.value || null,
    remoteCommandAgeMs: Number(els.commandAge.value),
    commsHealthy: els.commsToggle.checked
  };
}

function render(inputs = collectInputs()) {
  const stepName = stepText(runtime.retain.mainSeqStep);
  const pv = runtime.processValue;
  const outputActive = runtime.outputs.driveRunCmd;
  const alarmActive = runtime.outputs.alarmLight || runtime.retain.tripLatched || runtime.activeTrip;

  els.alarmBanner.textContent = alarmActive ? activeAlarmText(inputs) : "No active alarm";
  els.alarmBanner.classList.toggle("active", alarmActive);

  els.tankLevel.style.height = `${Math.round(pv)}%`;
  els.pvText.textContent = `PV ${pv.toFixed(1)} %`;
  els.adcRawText.textContent = `${inputs.adcRaw} raw`;
  els.adcEngText.textContent = `${pv.toFixed(1)} %`;

  els.pumpSymbol.classList.toggle("running", outputActive);
  els.vsdSymbol.classList.toggle("running", outputActive && !alarmActive);
  els.vsdSymbol.classList.toggle("fault", alarmActive);
  els.driveText.textContent = alarmActive ? "FAULTED" : outputActive ? "RUN CMD" : "STOPPED";

  setBool(els.ioEstop, inputs.estopOk);
  setBool(els.ioReady, inputs.driveReady);
  setBool(els.ioRunning, inputs.driveRunning);
  setBool(els.ioFault, inputs.driveFault);
  setBool(els.outRun, runtime.outputs.driveRunCmd);
  setBool(els.outRunLight, runtime.outputs.runLight);
  setBool(els.outAlarm, runtime.outputs.alarmLight);

  els.startsCounter.textContent = String(runtime.retain.starts);
  els.stepText.textContent = `${stepName} (${runtime.retain.mainSeqStep})`;
  setBool(els.permissiveText, runtime.permissiveOk);
  setBool(els.activeTripText, runtime.activeTrip);
  setBool(els.tripLatchedText, runtime.retain.tripLatched);
  renderLog();
}

function bindMomentary(button, key, message) {
  button.addEventListener("click", () => {
    state.momentary[key] = true;
    log(message);
  });
}

function inspectEvents() {
  if (runtime.retain.mainSeqStep !== state.previousStep) {
    log(`Step changed to ${stepText(runtime.retain.mainSeqStep)} (${runtime.retain.mainSeqStep})`);
    state.previousStep = runtime.retain.mainSeqStep;
  }

  if (runtime.retain.tripLatched !== state.previousTrip) {
    log(runtime.retain.tripLatched ? "Trip latched" : "Trip reset");
    state.previousTrip = runtime.retain.tripLatched;
  }
}

function activeAlarmText(inputs) {
  if (!inputs.estopOk) return "ALARM: E-stop healthy input lost";
  if (!inputs.driveReady) return "ALARM: Drive ready permissive lost";
  if (inputs.driveFault) return "ALARM: Drive fault active";
  if (runtime.retain.tripLatched) return "ALARM: Trip latched - clear cause and reset";
  return "ALARM: Output alarm active";
}

function setBool(element, value) {
  element.textContent = value ? "TRUE" : "FALSE";
  element.style.color = value ? "var(--good)" : "var(--muted)";
}

function log(message) {
  const time = new Date().toLocaleTimeString();
  state.logEntries.unshift(`${time} ${message}`);
  state.logEntries = state.logEntries.slice(0, 30);
  renderLog();
}

function renderLog() {
  els.eventLog.replaceChildren(
    ...state.logEntries.map((entry) => {
      const li = document.createElement("li");
      li.textContent = entry;
      return li;
    })
  );
}

function stepText(step) {
  switch (step) {
    case PLC_STEP.STOPPED:
      return "STOPPED";
    case PLC_STEP.PRECHECK:
      return "PRECHECK";
    case PLC_STEP.STARTING:
      return "STARTING";
    case PLC_STEP.RUNNING:
      return "RUNNING";
    case PLC_STEP.STOPPING:
      return "STOPPING";
    case PLC_STEP.FAULTED:
      return "FAULTED";
    default:
      return "UNKNOWN";
  }
}

function byId(id) {
  return document.getElementById(id);
}
