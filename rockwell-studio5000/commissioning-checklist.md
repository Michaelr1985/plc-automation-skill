# Commissioning Checklist

## Electrical And Panel Checks

- Verify panel drawings match installed hardware.
- Verify incomer, MCCB/fuse ratings, short-circuit rating, and cable sizes.
- Verify VSD input protection, line reactors, EMC filters, screened motor cable bonding, and earthing.
- Verify panel cooling for total VSD heat loss.
- Verify control power protection and 24 VDC loading.
- Verify motor nameplate parameters loaded into each VSD.
- Verify VSD acceleration/deceleration and stop mode settings.

## Safety Checks

- Verify E-stop/safety chain removes torque through engineered safety hardware, such as STO or safety contactors where required.
- Verify standard PLC logic only monitors safety status and does not replace certified safety logic.
- Verify reset clears faults only when safe and does not start any motor.
- Verify loss of safety healthy indication stops all VSD run commands.
- Verify local/keypad mode removes the VSD from automatic cascade.

## PLC Logic Checks

- Verify task period and timer presets.
- Verify `MaxRunning` is limited from 1 to 5.
- Verify faulted, local, inhibited, or unavailable VSDs are skipped.
- Verify start fail timer latches trip when running feedback is absent.
- Verify min run and min stop timers prevent short cycling.
- Verify stage-up and stage-down delays work under simulated demand.
- Verify stage-down never stops the lead drive while lag drives are running.
- Verify no duplicate writers exist for each VSD run command.
- Verify commands are mapped once in an I/O mapping routine.

## Process Checks

- Tune PID/PIDE loop with one VSD first.
- Confirm cascade stage-up threshold and delay.
- Confirm cascade stage-down threshold and delay.
- Verify pressure/flow/level transmitter scaling and bad-quality behavior.
- Verify all HMI commands, setpoints, limits, and alarms.

## Acceptance Tests

- Start with only VSD01 available.
- Start with each individual VSD as the only available drive.
- Start with two, three, four, and five available drives.
- Force a running VSD fault and confirm it trips and cascade response is acceptable.
- Put a lag VSD in local mode and confirm it is skipped.
- Put the lead VSD in local/fault and confirm no hidden restart occurs.
- Simulate high demand and confirm staging up.
- Simulate low demand and confirm staging down.
- Press E-stop and verify hardware stop plus PLC command removal.
- Reset after trip and confirm a fresh start command is required.
