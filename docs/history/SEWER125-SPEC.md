# Sewer125 implementation contract: The Last Lamplighter

Implement the enclosed-dark sewer proposal as a real playable level. Start with
all three Vikings FALLING through a broken tavern floor in the ceiling. End with
each Viking physically caught and swept down an outlet by a WATER STREAM. Only
finish once all three have travelled through it; follow with Drowned Regulator.
No portal finale, bright vista or replacement of the existing water puzzle.

## Coordination / ownership

Root: art, native source pipeline, render.js, darkness overlay, audio, release.
Mechanics agent: src/levels/sewer/campaign.js, light.js, tests/unit/sewer125*.js,
 tests/routes/sewer-route125.js. Own implementation geometry/ordinary clear route.
Integration agent: stable campaign ordering, dispatch/menu/continue/debug; core
 inventory item definitions; game overlay/sound/transition hooks after contract.
Reviewer: docs/history/SEWER125-REVIEW.md, assets/sewer125/visual-gates.json.
No agent commits another agent's work. Preserve unrelated WIP.

## Stable integration

Use stable round10 appended to cycleLevels, with an explicit play order inserting
10 before existing water round4. Preserve existing stable round0..9 IDs/tests/save
references. Display/order in menu/debug/header/continue must agree: clockwork3 ->
sewer10 -> water4. Existing previews use stable IDs; add a sewer framing. Transition
is a water tunnel/wash after the simulated stream, not generic portal travel.

## Mechanics/render contract

Exports sewerLevel, setupSewer(s), sewerStep(s,input,dt), sewerObjects(s),
sewerSurfaces(s). Mechanic 'sewer'. Existing inventory/health/accel/shield/arrow rules.
New inventory types inspectionLamp(icon17), lampOil(icon18), bullseyeLens(icon19).
Agent provides light.js exports sewerLights(s), sewerOccluders(s), sewerLightAt(s,x,y)
used by BOTH darkness rendering and lurking enemy AI. Light objects {x,y,radius,
face,focused}; occluders solid rectangles{x,y,w,h}. Real true occlusion, zero ambient.
No special flag requiring illumination to allow a shot/door.

Expose machine state for rendering:
- falling entrance (heroes actual vy, no teleport); introTime/landed
- lamp {lit,focused,lens,hookId|null}, hooks[{id,x,y,face}],
  lamps[{id,x,y,oil,lit}], oil animation/fill state. Carry owner resolved inventory.
- jet {x,y,w,h,dir,pose}, valve {x,y,pose}, valveOpened bool
- gates [{id,x,y,w,h,open,pose}], hatch {x,y,open,pose},
  rope {x,y,cut,pose}, ladder/stair recovery routes actualgeometry
- lurkers [{id,x,y,dir,hp,phase,warning,...}] grounded real moving threats
- stream {x,y,w,h,active,pose}, captured[3], escapeTravel[3], events/eventSerial
Provide final actual exported level.layout metadata if geometry differs. Rendering
must use actual contacts/ports and state, not assume concept map coordinates.

Room sequence: first safe lamphouse/drop; blind bends with spray/Olaf protection
and upper valve route; borrowed-light permanent refuges and upper inspection
hatch requiring Erik's jump; Baleog shoots ordinary exposed rope while Olaf
protects dark flank; shutter physically opens a route to the outlet stream.
Use consistent material action, no colored locks, no magic lamp-powered gate.
Make inventory verbs discoverable via actual source/fixture construction:
USE picks items/hooks, Q oilfills/lensfits/lamp relights or toggles focused mode.
No fuel countdown; refill at sheltered maintenance source; soaked lamp remains
recoverable. Fixed flame makes a safe parked refuge. Transfer/drop through standardbag.

Architecture is enclosed: ceiling height140..180 above walk plane, localized taller
service alcoves for jumping. Thick front roofs/walls and opaque rear brick rooms,
blind piers/shutters occlude light. Recovery paths stay physically clearable.
Starting camera follows the fall and settles in the lit lamphouse.

## Art, review, tests

New generated rich native-scale damp brick/iron/copper, human scale. Separate
native tiles/props, not concept wallpaper or repeated giant tiles. Actual black
unlit branches, tiny useful light pools, real occluded cones/radial glow. UI above
world-darkness pass. Quantized mask; no blur across pixelgrid or fullviewportreadback.
Enemyreveals by bodyparts/light and spatialscrapes/waterripples, notalwaysglowingeyes.
Final allcaughtwateroutlet continuouslyanimated actualphysics, noinstantteleports.

Tests beforeimplementation. Fullhealthy ordinary input60/120 route, wetting/relight,
fill/refill/wrongitem, give/drop/recover, allfixedsafeplaces, occlusion/closedgates,
enemyretreat/warnings/damage, independentcaptures, allthreecaughtonlywinsaftertravel.
Actual1x2x/mobile latest90 captures; independent source/runtime/aesthetic/cooperation
acceptance beforepublish. Use Git and preserve sourceprompts.

## Implemented geometry and physical sequence (125)

Stable cycle round 10 appears between Inside the Clockwork (round 3) and Drowned
Regulator (round 4). The world is 3300 units wide, with its main floor at y=760.
The crew starts at x=155/220/285, y=390/402/414 and downward velocity 65. Actual
gravity carries all three through the ceiling opening at x=100..380. A stationary
tavern light at (230,390), radius 300, stays full through 1.6 seconds and fades to
zero at 2.8 seconds. It shines through the actual opening; there is no ambient fill.

The service corridor ceiling is at y=580. The valve alcove at x=820..1180 and the
inspection alcove at x=1750..2200 extend upward to y=440. Erik can jump 120 units
onto their ledges at y=640. The first spray spans x=640..940 at y=716. Front-shield
Olaf can approach the outlet and shelter those behind him. Erik jumps from x=858
into the valve alcove and uses the wheel at (1050,596). The valve closes the spray
over 0.9 seconds and relieves the hydraulic shutter at x=1180, y=580..760. That
shutter lifts along its visible pressure line.

Loose pickups are the inspection lamp at x=390, oil at x=445 and lens at x=500,
all resting on the floor. USE collects; Q uses the selected bag slot. Oil fills the
refuge wick at (1530,700), then Q with the lit lamp ignites it. USE at the service
source at x=520 refills a can. A soaked lamp remains recoverable: carry, drop or
give it, then relight beside a lit fixed lamp. Lens fitting requires proximity to
the actual carried, placed or hooked lamp. The fitted lamp switches between a
broad radius of 205 and a focused beam of 580 with a small ventilation spill of
radius 80 and intensity 0.65. AI and darkness use the same light sources and walls.
The loose lamp shines from item.y+32, matching its visible wick; carried light is
at hero.x+face*22, hero.y+8. Hooks at (620,704) and (1850,724) preserve its facing.

Erik reaches the inspection winch at (1840,596). Its shutter at x=2020,
y=600..760 raises continuously in 1.2 seconds. When closing, it waits for the
actual 72-unit hero or 48-unit creature body to clear. The grounded creature starts
at (2160,760), moves through connected space and cannot walk through shutters.
Light causes retreat. Darkness allows stalking, a 0.85-second warning and a short
continuous lunge. Front shield contact produces a decaying physical recoil.

Baleog's ordinary floor-level arrow can cut the exposed rope at x=2130,
y=650..744 once the shutter is raised. The rope supports the outlet gate at
x=2300, y=600..760, which opens over 1.8 seconds. Its linked service landing at
x=2160..2320 moves continuously rather than appearing as an instant stair.
There is no invisible illumination permission on bow, hatch or gate operation.

Fixed caged maintenance lights at (2460,700), (2740,700) and (3060,820) make the
outlet and falling stream readable. Their radius-215 pools cannot shine backward
through the closed outlet gate. Roof slabs, 24-unit platform slabs, the floor at
x=0..2700 and all moving shutters occlude light. A lamp on the inspection hook
keeps the rope visible while the crew reunites. The permanent refuge provides a
safe place to park waiting characters.

The stream begins at (2700,680). Each Viking is caught at x=2780 once their body
enters the flow. The current continuously carries them right, then down toward
the tunnel. Each travels 440 world units before sweptAway is set on that same
frame. Early arrivals remain safely inside the tunnel while the others approach.
Completion requires all three physical journeys: there is no portal or instant warp.

Ordinary input routes complete at 60 Hz in 59.62 seconds and at 120 Hz in 59.45
seconds, with all three at full health. The browser route separately exercises
keyboard controls and the real inventory UI, with mobile and 1x/2x captures.
Audio uses actual source positions, wall attenuation, sparse creature cues,
pressure and chain motion, heavy capture splashes and bounded water ambience.
Gameplay UI remains above the world darkness layer.


Final render registration: one native pixel equals two world units. The winch's
complete native frame includes its right-hand crank and uses exclusive sole64
at world640. The oil supply retains its two source foot rows beyond the old
cell boundary: exclusive sole66 at world760. Neither is independently scaled.
The inner winch wheel is removed from the stationary housing and drawn as a
separate native raster layer, preventing stationary spokes behind moving ones.
The linked landing has visible suspension; a descending iron counterweight
explains the lift after the floor-tied restraint is cut. Lamp reservoirs end
at760 or attach by a visible bracket to the chute's rear masonry.

Capture tips each hero continuously from upright to0.75radians while native
raster rotation preserves the grid. Irregular foreground crests follow the
channel and cross the lower body; there is no rectangular water panel. Captured
heroes cast no false floor shadow. Once their full440-world journey finishes,
body and world feedback disappear inside the tunnel; crew HUD remains visible.
