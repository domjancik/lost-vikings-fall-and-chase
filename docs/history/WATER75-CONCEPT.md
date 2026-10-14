# The Drowned Regulator — visual brainstorm

Concept only, not implemented or approved production art. Generated using the
built-in imagegen tool. Preserve the concept and exact prompt in
output/concepts/water75. The machine regulates a submerged district's pressure;
the Vikings must isolate the intake and drain its maintenance well to escape.

## Stable water rules

- Olaf always floats at the local surface. He cannot dive. His raised shield
  deflects a falling inlet stream and creates a local sheltered passage, visibly
  turbulent outside that passage. It does not cancel currents throughout a tank.
- Erik swims horizontally and vertically, including against gentle currents.
  The strong inlet current blocks his service passage until Olaf shelters it.
- Baleog sinks in armor and walks the bottom. He can climb ladders underwater.
- Submerged heads consume air; surfaces and open-bottom trapped-air bells refill
  it. Bell approach routes and remaining air must be legible before committing.
- Falling water moves Olaf continuously; no teleport, sudden sinking or sprite
  scaling. Inlet shutoff, drain gate, floats and stairs animate mechanically.

## Cooperative route

1. Olaf shelters the inlet's downward jet. Erik swims in the lee to a service
   passage and air bell, reaching the physically connected inlet handwheel.
2. Erik shuts the inlet. Flow tapers visibly; bottom-route turbulence subsides.
   Baleog descends onto the maintenance catwalk and uses a low air refuge.
3. Baleog cuts an exposed corroded retaining chain, then operates a long drain
   crank. The visible rod opens a floor sluice; water falls continuously.
4. Olaf rides the receding surface. Submerged steps emerge and a falling float
   lowers a counterweighted exit stair. All three reunite and climb out.

## Sketch corrections before implementation

The image explores atmosphere and causality; it is not an exact collision map.
Its air bells appear to have closed bottoms in places: provide a clear open
underside, with a separate narrow standing ledge inside the air pocket. Baleog
needs a refuge he can reach by bottom steps/ladder, not an impossible swim.
Make the inlet shutoff reachable only through the initially sheltered passage;
an open swim around it would invalidate Olaf's cooperation. Define the stream's
blocked region explicitly and render that same region, rather than imply an
arbitrary invulnerability aura. The left jet and its valve must remain the same
fixture in all states. Retaining chain and crank must both be visibly accessible.

Avoid irreversible traps: shutoff remains shut, accessible ladders remain,
drain cannot strand Erik in a sealed pocket, and no critical area becomes
inaccessible solely because Olaf follows the falling surface. Tune air using
measured ordinary-controls routes, including a readable margin for mistakes.

New art requires the standing native-density and independent raw/processed
visual gates. Concept density is not a production sprite source. Implementation
requires route tests for all buoyancies, local shielding, breathing recovery,
water-level transitions, grounded machines, final reunion and restart behavior.
