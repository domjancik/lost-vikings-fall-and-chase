# The Cycle of Depths — playable puzzle laboratory

An independent `cycle` campaign, reached from the campaign menu. Preserve the
current story and arcade campaigns. Adult Viking scale; fixed pixel cells;
grounded machinery; actual authored sprites; hidden hints by default.

## Causal sequence

1. Baleog cuts the visibly frayed shipping restraint at the conveyor drive.
   Its loose ends recoil; the motor and a passenger cradle begin circulating
   clockwise around a closed, continuously traversed rectangular rail.
2. All three may climb the real maintenance ladder (Up/Down, also touch).
   Erik boards at the low circuit's upper-left dock, jumps to the brake loft and releases the
   wind-brake pin. Its rod visibly retracts beside the vent's transmission.
3. From the left gallery, Baleog shoots the exposed glass trip catch across the
   gap. It is mounted on the damper's hinge, so hitting it releases that damper;
   the flap opens smoothly and airflow starts only after the brake is released.
4. Olaf rides the lower cradle to the vent staging deck. With his shield raised,
   the updraft carries him upward. A lowered shield does not catch the draft.
   He steers onto the upper gallery and changes the rail selector to the high
   circuit. The next lap adopts the route at the bottom-left dock: no midair
   jumps, passenger teleports or moving rail endpoints.
5. The crew reunites using the high circuit: Erik returns by the ladder, Baleog
   boards from a safe dock, and Olaf steps onto the passing high cradle at the
   right edge of his gallery. Stationary deck occupants are never collected.
   All ride/walk to the right upper exit. Both route settings remain
   reversible. A selector changes routing, not access by named hero identity.

## Geometry

World 2800×1200; thin lower decks y940 and recovery floor y1120. Upper rail
y500 or260. Carrier x850..2050, width160, four segments, bounded acceleration
and 1.5-second docking pauses. Decks x0..850,1280..1440,1700..2050,2210..2800;
the cut shafts permit vertical carrier travel. Missed boarding lands on the
recovery floor. Left gallery x500..850/y500; ladder x650/y500..1120. Brake
loft x1000..1180/y390 is 110 units above the low carrier. Draft
x1280..1440 lifts Olaf's feet past y220 before he steers onto the routing
gallery x1460..1680/y260. Its 240-unit rise prevents a shield-assisted Erik
jump from bypassing airflow. Right exit deck x2210..2800/y260. Exit x2600.
Glass catch collision is registered to the generated hinge lens at1324,476.
All elevated static decks have supports to a
real lower floor or visible ceiling suspension. Carrier tops match collision.

Ladder use works for every hero, sets a climb pose, cancels cleanly on leaving,
and has accessible entry at each landing. Up/Down keyboard and mobile overlay.
Draft ascent is physical velocity and requires Olaf's overhead shield; it never
sets a hero position to a destination. The carrier transports inactive heroes
by the same displacement and cannot adopt a new route while traversing a lap.

## Review and acceptance

Independent critique must reject incoherent causal targets, arbitrary hero
locks, impossible jump geometry, stranded crew and floating scenery. Validate
whole routes through ordinary controls at 60/120 Hz, actual browser inputs,
mobile and both zooms. Capture initial, moving and completed core states. Check
that routes are recoverable after mistimed boarding and selector reversal.
Use VISUAL-REVIEW-GATE.md for authored motion, grounding and human scale.

This is a new transport/airflow puzzle, not a rewrite of story blurbs.
