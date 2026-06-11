# Industry Templates

Use these templates to infer likely IO, sequences, interlocks, HMI screens, alarms, and commissioning tests. Mark inferred items as assumptions.

## Conveyors

- Sequences: prestart warning, start, run, stop, trip recovery.
- IO: pull-wire, E-stop healthy, belt drift, zero speed, blocked chute, drive ready/running/fault/local.
- Interlocks: downstream ready, chute clear, safety healthy, drive ready.
- HMI: conveyor faceplate, route overview, alarms, trends for speed/load.

## Pump Stations

- Sequences: duty/standby selection, start, run, stop, cascade, failover.
- IO: pressure/flow/level, pump ready/running/fault/local, valve feedback.
- Interlocks: low suction, high discharge, dry run, valve open, tank level.
- HMI: pump faceplates, station overview, trend page, duty rotation.

## Tank Control

- Sequences: fill, mix, drain, transfer, clean.
- IO: level, high-high/low-low, valves, agitator, pump, flowmeter.
- Interlocks: overfill, low level, valve permissives, pump dry-run.

## Batching Systems

- Sequences: recipe load, ingredient dosing, mixing, transfer, cleanout.
- IO: scales, flowmeters, valves, pumps, mixers.
- Interlocks: recipe valid, vessel available, ingredient available, tolerance checks.

## Crushers And Screening Plants

- Sequences: lubrication precheck, start downstream-to-upstream, feed enable, stop upstream-to-downstream.
- IO: motor protection, vibration, bearing temperature, blocked chute, belt speed.
- Interlocks: downstream running, crusher ready, lubrication healthy, bin level.

## Fuel Management

- Sequences: authorization, pump enable, dispensing, totalization, shutdown.
- IO: pump, flowmeter, tank level, leak detection, emergency stop.
- SCADA: transaction logs, reports, tank inventory.

## Ventilation Systems

- Sequences: fan start, damper prove, speed control, fault recovery.
- IO: fan ready/running/fault, damper open/closed, airflow, gas/dust where applicable.
- Interlocks: damper position, gas level, fire mode, local mode.

## Water Treatment

- Sequences: dosing, filtration, backwash, transfer, alarms.
- IO: flow, level, pressure, pH/ORP/conductivity, valves, pumps.
- SCADA: historian trends, compliance reports, chemical usage.

## Smart Lock Systems

- Sequences: authorization, unlock, access monitoring, relock, alarm.
- IO/network: lock status, door status, credential reader, tamper, network controller.
- Interlocks: authorized access, door closed, emergency release.

## Warehouse Automation

- Sequences: conveyor zones, diverters, barcode scan, sortation, jam recovery.
- IO/network: photoeyes, scanners, drives, diverters, safety gates.
- SCADA/HMI: throughput, jams, equipment status, maintenance pages.

## Asset Tracking Systems

- Sequences: scan/read, validate, locate, report, exception handling.
- Network: RFID/barcode, gateways, database/SCADA interface.
- Reports: location, movement history, exceptions.

## Vaccine Fridge Monitoring

- Sequences: monitor, alarm, acknowledge, escalate, report.
- IO/network: temperature probes, door switch, power fail, network logger.
- Alarms: high temp, low temp, door open, probe fault, power loss, comms loss.
- Reports: temperature history, excursions, acknowledgement records.
