# Safety Boundary Standard

Use this whenever a project includes E-stops, guards, access doors, conveyors, pumps, drives, hoists, crushers, mines, hazardous motion, fire/gas, or any protection function.

## Core Position

Generated standard PLC or ESP32 firmware is not safety-rated unless it is explicitly implemented in a certified safety PLC/environment and reviewed through the required safety lifecycle.

## Must Remain Safety-Rated Hardware Or Certified Safety Logic

- Emergency stop circuits.
- Safety relay functions.
- Guard locking/interlocking.
- Light curtains and scanners.
- Two-hand control.
- Safe torque off.
- Safety brakes.
- Hoisting safety functions.
- Fire/gas trip systems where regulated.
- Any SIL/PL-rated function.

## Standard PLC/Firmware May Do

- Monitor safety healthy feedback.
- Display safety diagnostic status.
- Stop standard outputs when safety healthy is false.
- Inhibit restart after a safety event.
- Log alarms/events.
- Require operator reset/acknowledgement after safety restoration.

## Standard PLC/Firmware Must Not Do

- Bypass E-stops.
- Simulate safety relay behavior as a substitute for safety hardware.
- Override safety guards.
- Auto-reset safety trips.
- Restart equipment from reset alone.
- Claim SIL/PL compliance without validated safety design.

## Safety Interface Table

| Safety Function | Safety Device | Standard PLC Signal | PLC Action | Reset Requirement | Proof Test |
| --- | --- | --- | --- | --- | --- |

## Restart Rules

- Reset does not start equipment.
- Safety restoration does not start equipment.
- A fresh start command is required unless a documented, risk-assessed auto-resume mode exists.
- Power recovery must force outputs safe before any resume path.

## Archive ESP32 Safety Boundary

Archive ESP32 is standard control firmware:

- Use external safety relays/controllers for safety functions.
- Use Archive firmware only to monitor safety feedback and inhibit standard commands.
- Do not implement safety-rated logic in ESP-IDF code.
- Brownout/watchdog/reboot must default outputs off.

## Documentation Requirements

Every safety-sensitive output must state:

- What is safety-rated.
- What is standard control only.
- Which device removes energy.
- Which signal the PLC monitors.
- Reset sequence.
- Proof-test method.
- Remaining assumptions and required engineering review.
