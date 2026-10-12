# The Momentum Works68

Imagegen brainstorm: assets/momentum68/brainstorm.png. One third Puzzle Lab room,
separate from Story and legacy Arcade. Two linked acts, coherent momentum/clock
machinery. Retain all originals/prompts and Git history. Independent critique
must check common-sense causality, recovery, actual opaque contact, animation,
and both native-source and processed/gameplay art gates before publication.

## Sphere relay

3400x1280 room; safe recovery floor1120. All heroes start left, feet720; starter deck ends520, before the downhill curve. Ladders
at320(720..1120),890(960..1120),1140(760..1120),48world wide. Baleog can stage on
the960 sword gallery780..930; Erik on the760 boarding gallery1080..1200 before Olaf launches. Full circle/deck sweeps for both branches must clear24-thick decks.

Heavy sphere authored112world diameter/56native pixels within64native cell. Final
radius derives from registered opaque art, never stretching each frame. A
shield-braced Olaf pushes by holding RIGHT against its left side; heavier push
force overcomes static cradle resistance. Front shield/body contact must match.
Ability semantics remain normal; no new Ready/Alt mode. Physics uses continuous
acceleration and a rail-normal offset so the sphere visibly touches curved rails.

Cradle/contact x480..520 at track720; downhill to fork1000 at960, with C1 smooth
curves. A large hinged bronze striker at970,932 drives the fork guide. Sword
contact supplies a brief2sec spring deflection, with continuous angular motion;
the approaching sphere takes the upper rail if the guide is raised. No teleport
or hidden hero flag. A reachable Erik bash also supplies the required impulse. An arrow lacks that impulse.
Show loading/deflection/recoil, direction, and every trajectory continuously.

Upper rail1000..1800 rises to720. Erik jumps onto the sphere from the boarding
gallery, adjusts his relative position against a modest rotating-surface drift,
then jumps to high ground. Standing soles follow the circular crown, not a flat
invisible platform. Other heroes may ride if physically boarded; Erik's100-unit
last jump is necessary. High ground =720-2*registeredRadius-100, preserving30units
jump clearance. No hero is required to remain holding an actuator.

Missing steering sends the sphere down to a safe catcher1500 at1120. Missing
boarding/leap leaves the hero on the recovery floor. Universal USE return controls
at330 on the cradle deck and1350 left of the lower catcher continuously bring the sphere down, left and up
a visible return hoist at680, outside the starter deck, then seat it back in its cradle. Never relocate a moving
sphere or Viking instantly. Reset can be repeated without consumables. Reset requests defer while a rider remains aboard; the crank changes state immediately. Reaching
high ground lowers a visible recovery ladder1900, smoothly, into the lower room.

## Timing lane and reunion

Safe high-ground staging1780..2020 at508. Four80-wide cracked ceramic tiles2020..2340
crack/sag/fall after~.9sec of contact. Physical support follows warning sag, then
removes as pieces fall continuously. Safe landing2340..2910. A low padded wall
bumper at1964..2020,68 high, before the lane forces a jump and visibly rebounds incoming fireballs.

Laser2160 has4sec cycle: off2.6, charging.6, live.8. Visible emitter/beam states;
no silent damage during warning. Mechanical furnace2440 shoots leftward every
2.8sec with a visible windup. Fireballs animate, rebound from the padded
bumper, and stop at shields using the same ordinary collision geometry. Real
damage/death, bounded invulnerability, no level-specific shield locations.

USE the safety control2580 after the timing run. Hazards stop visibly, tiles
restore gradually (also automatically after a failed crossing), and a permanent crew lift2910..3090 opens. Lift1120..highGround,
continuous acceleration and3sec docks. A real shaft gap separates left and right
upper decks; riders stand on its authored rim. All three exit at3260 on the right
deck, no forced abandonment. Enter/Space completion and debug skipping retained.

## Art and evidence

Generated foreground family:64-native square cells at2worldpixels/native. Sphere
8 authored rolling frames; ceramic tile4 states (40native-wide80world strip);
steering parts/return control; fireball4 frames; furnace4 states (separate72native cells,144world); emitter/beam and
bumper states. Fixed pivots/rims/ports, binary alpha, source density matching the
target. Rich broad shading, no tiny painted detail subsequently crushed.
New connected foundry background: authored768x512native/1536x1024world (3:2 aspect retained);
match source aspect, preserve native density, slower vertical/horizontal parallax.
Use proper terrain top/side/infill and generated rail/support materials. All
supports terminate on a lower footing. Fire/smoke are actively animated, not
painted immobile into a background. Human references establish adult scale.

Tests: push/contact, smooth fork/return, circular rider feet, finite balance and
recovery, crumble support removal, warning versus live laser, shield/fireball and
bumper direction, carrier support, all crew exit; full normal-input60/120Hz route.
Actual browser playthrough, all key states,1x/2x/mobile and independent critique.

Final energy contract: push accelerates to70world/s, then geared gravity40 and friction.12 accelerate along arc length. The downhill reaches~150/s, upper~65/s. No hidden constant-speed motor. The upper endpoint tangent is horizontal. Sphere rider relative rolling drift is18% of carrier displacement, so corrections matter; inactive passengers keep their displacement.


Erik can rebound from the cyan pad's right face with normal JUMP while airborne. The pad compresses/recoils; only actual contact enables a bounce, not arbitrary walls. Shot reflection and dynamic collision bounds match the same face. Native rail sprites are rotated into a nearest-neighbor native raster, avoiding fractional interpolation while curved rails meet the ball normal.
