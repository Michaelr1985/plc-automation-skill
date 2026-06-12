# Rockwell Conveyor Example

Generator Mode: Full Project Pack
Platform: Rockwell CompactLogix / ControlLogix
Software: Studio 5000 Logix Designer

Scope:

- Three conveyor route.
- Downstream-to-upstream start.
- Upstream-to-downstream normal stop.
- Pull-wire, belt drift, zero-speed, blocked chute, and drive fault trips.

Expected outputs:

- UDTs for command/status/config.
- Routine or `.L5X` import package.
- Alarm list.
- Cause/effect matrix.
- FactoryTalk tag template.
- FAT/SAT route test sheet.

Validation:

- `.L5X` structure check when generated.
- Zero-speed trip test.
- Pull-wire reset-does-not-start test.
