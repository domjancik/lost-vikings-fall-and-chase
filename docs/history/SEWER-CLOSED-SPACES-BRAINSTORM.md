# Sewer prelude: closed spaces and real darkness

Status: additional visual brainstorm only; no runtime or deployment changes.
Supersedes the broad, scenic lighting direction in the initial sewer proposal.
Preserve its inventory verbs and ordinary physical puzzle rules. New concept:
assets/concepts/sewer-prelude/closed-spaces.png; exact built-in imagegen prompt
alongside it. This is concept art, not approved runtime sprites.

## Direction

Closed rooms, low roofs, thick piers, blind bends and opaque maintenance shutters.
Human-sized doorways and ceiling clearance roughly1.4-2 adult Viking heights.
Rear walls and foreground enclosure must genuinely make rooms, rather than put
an arch over an open vista. Layer depth lives in nearby pipes, wall recesses,
inspection slots and connecting passages. No city panorama or sunlight finale.

Allow truly black unlit space, including undiscovered branches. Remove the earlier
requirement to keep distant ledges and silhouettes always faintly visible. Light
is how the player discovers the route. Fairness comes from safe teaching spaces,
controllable scouting and consistent enemy approach cues, rather than ambient
blue fill or global outlines that defeat the darkness. Keep UI outside darkness.

## Three rooms as one escalating sequence

###1. Blind Bends

A low brick culvert turns behind a thick opaque pier. The small lamp pool ends at
the corner. Drips, a scrape above a pipe and disturbed shallow water suggest
something nearby; a fragment is briefly caught when the beam sweeps its path.
Let the first reveal occur from a safe alcove. The player learns that walls stop
light and that a claw on the edge is attached to a real moving creature.

Olaf faces the unexplored approach with his shield; Erik moves the lamp between
actual hooks; Baleog covers the direction the lamp leaves exposed. Heavy grilles
and a visible service hatch provide the physical cooperative route, not a random
requirement to stand in darkness. Keep the first dark exploratory floor forgiving.

###2. Borrowed Light

Two small dry refuges are separated by a black service passage and grille.
One portable lamp cannot illuminate both working positions. Fill and ignite a
fixed wick in the first refuge, then transfer the lamp/lens through an actual
reachable handoff hatch. Erik's upper route gets the light into the second room;
Baleog can stay in the established refuge and operate the lower mechanism.
Olaf protects the exposed crossing or the remaining dark approach.

The player chooses what becomes safe permanently and what remains unknown.
Only light sources actually present illuminate anything. Placing, giving,
retrieving and fitting the lens use the existing inventory/USE conventions.
Do not turn every room into a repeated oil-filling chore.

###3. Something Behind the Shutter

A cramped iron pump vestibule has two opaque service shutters and a real linked
pulley/counterweight. Initially light the near room only. Opening an inspection
slit lets a thin strip of real lamplight reveal part of a large shape beyond;
closing it occludes both the view and light. Show the load path and moving door
edges. The creature stays in the adjacent physical tunnel, never spawning as a
scripted jump-scare prop.

Establish a fixed refuge before transferring the portable lamp into the far room.
Erik reaches the upper service release, Baleog can cover the revealed approach
and shoot an ordinary exposed rope, and Olaf holds the near threat direction.
Keep the existing consistent rope material/action rule. Unfold or lower the
service stair continuously; reveal a cramped passage with increasingly loud
water machinery leading into the Drowned Regulator, rather than a bright vista.
These are route ideas, not a geometrically validated implementation map.

## Lurking behavior

Use one understandable primary threat: a sewer scavenger which avoids direct
bright illumination but stalks through accessible unlit recesses. Its routes use
real floors, grilles and climbable pipes. No teleporting between shadows, player
tracking through opaque walls, arbitrary spawn behind a parked Viking, or glowing
eyes constantly identifying its location. Direct illumination reveals its body
and causes a readable recoil/retreat. Sometimes the beam finds an empty recess.

The lamp offers short surrounding light or a long focused cone with an unlit rear.
The focused lens does not create extra energy. Changing modes trades close safety
for scouting and ranged sight. A newly exposed dark flank matters; stand Olaf on
that flank or establish another fixed light. This is territory and positioning,
not a hidden light-permission flag on doors or attacks.

Let approaching threats displace water, scrape a grille, cast a partial shadow or
jostle a pipe before contact. Sound positions follow the creature's actual route,
with wall/door muffling; a closed shutter does not transmit a perfect x-ray cue.
Leave time to react, aim light, block or switch. A lit refuge must remain a reliable
place for parked heroes, and an endangered remote hero needs a clear directional
alert and switching window. Do not resolve damage silently offscreen.

Use silence, idle drips and mechanical settling between movements. Avoid endless
roaring, repeated fake attacks or camera cuts showing the monster in full.

## Inventory refinements and recovery

Retain inspection lamp, refillable oil can and attachable bullseye lens. The lamp's
open vent explains spray sensitivity even when its front lens is installed.
No global fuel countdown. A soaked flame can be relit at any established wick;
the item remains recoverable. No black return trip caused by a consumable softlock.
Opaque shutters block light; a placed lamp cannot illuminate through them.
Use actual fitting lamp hooks to avoid pixel-perfect placement/aiming.

## Before implementation

Prototype light occlusion and room scale first. Check that a truly black scene is
still playable through deliberate scouting, rather than restoring ambient fill
when testing gets difficult. Test both lamp modes and facing directions, shutter
slits/partial states, item handoffs through intended openings, light left behind,
relighting, retreating enemies, creature/door collision and parked-hero safety.
Keep enemy rules physical and consistent; darkness never changes collision.

Final runtime art needs native-density/source, processed/runtime and richness
reviews separate from this concept. Full normal-input healthy routes, failure
recovery and1x/2x/mobile evidence remain mandatory before publication.
