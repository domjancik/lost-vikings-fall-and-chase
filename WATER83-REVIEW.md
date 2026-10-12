# Independent Drowned Regulator review

Review opened 2026-10-12 under native-sprite-art, VISUAL-REVIEW-GATE.md
and HUMAN-SCALE.md. Reviewer owns this record only; no runtime edits.

## Concept checkpoint

Read WATER75-CONCEPT.md and inspected
output/concepts/water75/drowned-regulator-concept.png. The cooperative
sequence is legible: Olaf locally shelters the inlet, Erik reaches its
connected shutoff, Baleog releases and opens the drain, and the falling
surface exposes the reunion route. Concept art is illustrative reference,
not accepted native production sprite source.

The implementation review must establish these causal links using actual
controls and visible states:

- The jet's rendered blocked region matches its physical current region.
  Erik cannot bypass the service restriction before Olaf shelters it; the
  shield creates a local lee rather than disabling currents everywhere.
- Olaf remains surface-bound, Erik can swim vertically/horizontally, and
  armored Baleog sinks onto a reachable bottom route. Head submersion, air
  depletion and breathing recovery must match the visible water/air pockets.
- Bells have visibly open bottoms and separate refuge ledges. Baleog can
  reach his refuge by steps or ladder without needing to swim.
- Cut chain, crank stroke, linked sluice, tapering inlet and falling water
  each visibly change their own mechanical state. A success flag alone is
  insufficient evidence.
- Olaf pushes a floating item through visible contact and continuous motion.
  Any necessary docking/float trigger must have an understandable physical
  connection to the resulting mechanism and a recoverable positioning route.
- Draining preserves escape access for Erik and Olaf; inlet shutoff stays
  shut. A misplaced float, early release or interrupted action cannot create
  an irreversible soft lock. Air margins require measured normal-control
  routes and recovery evidence.
- Falling surface, buoyant objects, counterweight and stairs move continuously.
  Grounded machines have visible footing and seated linkage endpoints. Ordinary
  steps, handrails, ledges and handles establish adult scale.

## Specification / puzzle causality — ACCEPTED as design; implementation pending

Read WATER83-SPEC.md. The2400×1120 map gives a permanent bottom-to-exit
ladder, a fixed refuge, a reversible pushed pontoon and a grounded towed hood.
These avoid making a temporary floating platform the only recovery/exit route.
Valve access has a geometric prerequisite rather than a hero-ID permission;
the retaining chain uses the existing sword action. Retained crank progress
and bidirectional float motion are sensible recovery rules.

The floor-supported weighted hood is a clearer mechanism than a hovering bell:
the compressor pontoon changes height with water while the hood remains on
floor skids. Its hose must visibly gain slack as the float descends; tow lines
must follow the actual registered supports. The hood's air pocket and crank
must remain reachable together when the pontoon stops at the sluice. The
chain, crank, rod and gate should be visible together or connected by a
traceable uninterrupted linkage.

These implementation questions remain required evidence, not waived design
details:

- Jet bounds atX710 must extend through the intended underwater obstruction,
  and the bulkhead atX760 must block the maximum jump/pontoon boarding route
  as well as surface swimming. Test diving near the floor before shelter.
  The local shield calm column must provide a physically traversable route
  beneath theY850bulkhead opening rather than an unexplained remote immunity.
- Measure12-second air margins from first head submersion to the fixed bell
  nearX940, then from that refuge to the mobile hood nearX1660. Measure inactive
  heroes too: the long pontoon tow must leave Erik/Baleog in real breathing
  refuge, not quietly suspend their air meters. Recovery includes returning
  to a bell before suffocation, not only surviving with the last health point.
- Initial surfaceY540 and finalY930 above floorY1000 leave70world units of
  shallow water. The bottom route remains wet. Air detection must agree with
  the visible72–76world-unit adult head rather than a different collision-box
  landmark; confirm both stopped and moving heroes at the final water level.
- Confirm the right ladder is enterable from the floor and surface throughout
  draining, and that the mobile hood cannot be towed outside a reachable
  range, trapped behind geometry or leave its crank inaccessible. Test an
  interrupted tow, partial crank unwind/release and an early hero switch.

This acceptance concerns the proposed causal design only. Source quality,
measured route feasibility and actual visual/state transitions remain pending.

## Native-density / source gate — ACCEPTED for direct native assets and declared scene scale

The generated machine study remains rejected separately below. Do not convert
the dense75concept illustration into production pixel sprites.

### New source checkpoint

Inspected assets/water83/machines-imagegen-raw.png (1448×1086) beside the
intended96native-cell contract and read machines-prompt.txt. REJECTED: fine
painted metallic texture/soft colored fringe, unequal cell registration and
the mobile bell's sealed lower housing violate native density and open air
access. It is retained study evidence, not a processed source.

Separately read tools/draw-water83-machines.py and inspected the directly
authored machines-native.png (384×288,12cells96×96) and final motion-native.png
(768×384,8phases per row, pontoon/crank/valve/sluice). These do not incorporate/downsample generated
pixels. Native-machine SOURCE GATE: ACCEPTED. Deliberate coarse shadow/base/
highlight clusters, binary transparent cavities, steady floor row88 and
registered rotor/crank phases are readable. Bells have open cavity sides/
undersides and grounded feet/skids; wheels/cranks and their material identity
are recognizable. This acceptance does not approve scene contacts or state
transitions at runtime.

Inspected scene-raw.png (1774×887) and scene-prompt.txt. The renderer keeps
the source at2world units per actual source pixel, with no reduction or
fixed-square packing. Large architecture has dark receding bays, adult-sized
maintenance access cues and a connected lower foundation. Its source detail
is displayed at its actual native pitch rather than rescued by reduction.
Scene source density is ACCEPTED at that declared2world/source-pixel scale;
camera-relative door scale and foundation placement still require runtime
inspection. Do not reuse this approval for a smaller downsampled destination.

Updated specification now sets final waterY950 (50world-unit wet depth),
face breathing at rootY−20 and pontoon initialX1020 to the right of the gate.
These supersede the earlierY930/left-pontoon design figures. Fixed pocket
Y820..890 and mobile pocketY920..992 correspond to the visible native bell
cavities. Final valve/sluice motion rows keep housing/rim registration while
the handle turns and aperture opens; source-native state progression is
accepted. Actual placements and air margins remain runtime requirements.

### First runtime checkpoint — BLOCKED pending corrected evidence

Inspected output/playwright/water83-initial-1x.png, initial-2x.png and
shield-intake.png (1440×900). Bell/skid and floor support are visible in the
initial1x survey. However the first shelter capture keeps jet streaks beneath
Olaf's shield with no visibly caught above-surface stream or calm lee. Its
connection reads as rigid elbowed copper pipe rather than a flexible hose
that gains slack. Root reports both are being corrected; these first captures
cannot approve their corrected state. Require refreshed shelter/tow/drain
motion evidence before final runtime acceptance.

## Processed / actual-game runtime gate — ACCEPTED after final corrections

At review opening no water83 gameplay evidence was available. Required evidence includes
raw/processed comparison, actual1x/2x/mobile views, all relevant mechanical
states, local shelter and push contacts, submerged air/refuge routes, recovery,
continuous draining and final reunion. Automated completion or dimensions
alone cannot establish these visual gates.

### Refreshed runtime review — evidence gaps pending

Inspected refreshed1440×900desktop initial1x/2x, shield-intake, valve-before/
after, fixed-air, air-towed, chain-before/cut, crank-complete, drain-middle/
drained and all-exit captures; also844×390mobile1x/2x and mobile-controls.
These are actual controls in the new Machine Puzzle Lab room.

The corrected falling stream now joins its nozzle and visibly stops at Olaf's
raised shield, leaving a quiet underwater lee. His body remains surface-bound.
The submerged fixed refuge shows the hero's head inside the open cavity with
air bars, a reachable ladder and visibly seated ledge posts. Olaf's front
shield touches the pontoon's side; the flexible native connection kit replaces
the former rigid air-pipe appearance and adds a separate skid tow line.
Later fixed/mobile hood locations show that surface/bottom motion is coupled,
while the bottom hood and crank remain floor-seated.

Retaining chain is visibly present before cutting and absent/broken after.
Wound crank state retains its frame/feet, lights its indicator and links to
the sluice. Drain opening and lower water appear in their own scene, with
Olaf and pontoon descending while hood/crank stay grounded. Final water is
still shallow and wet rather than falsely dry. Scene foreground floor and
bell/gearbox skids meet; maintenance-scale machines remain legible beside
adult heroes. Mobile uses a landscape844×390viewport;1x sees the machine
layout,2x preserves hero/control readability. Actual touch control capture
shows Olaf selected with raised shield following movement input.

Independently ran water.test.js and water-route.test.js:10tests passed,
including full-health normal60/120Hz completion. Also measured minimum air
along those normal-control routes: Erik/Baleog/Olaf8.53/5.53/12seconds at
60Hz and8.60/5.58/12seconds at120Hz. This supplies a real error margin on
the refuge transfer. Inactive suffocation/refill, both-way pushing and local
shelter/bulkhead tests pass. Root reports final real browser completion in
89.658seconds, HP3/3/3, no JavaScript errors and Enter continuation. This
review independently checks code/tests/capture pixels, not a separate critic
browser playthrough.

Remaining required visual evidence/correction:

- gate-moving.png frames the valve/hero while the retracting gate is above/
  outside the useful view. Add gate-centered before/intermediate/after views;
  successful valve state does not approve an offscreen gate's transition.
- all-exit.png is the victory portal animation and obscures support/crew.
  Add a pre-victory right-dock/ladder/exit footing view at gameplay size.
- New portal housing is drawn as flat canvas rectangles. Reuse existing
  authored portal posts/frame or directly author a native frame rather than
  leave a placeholder interactive panel; moving interior effects may remain.

Source acceptance for the machine atlas is retained. Final runtime gate
remains pending these concrete gaps; previous stale shelter evidence is
superseded by the inspected corrected stream/lee.

### Gate/nozzle/frame corrections inspected

Inspected new48×48assets/water83/nozzle-native.png and its direct native
authoring code: clean coarse material clusters, a seated top pipe mount and
open lower mouth. Its96×96world placement preserves2world/sourcepixel and
stream start at the actual mouth. Source gate ACCEPTED for the nozzle.

Inspected water83-gate-before-visible.png, gate-middle-visible.png and
gate-open-visible.png at actual1x. The gate itself is clearly visible in all
three and retreats progressively fromY850through an intermediate bottom to
Y450, clearing an adult head above the surface. This resolves the offscreen
intermediate evidence gap. Valve indicator changes with the same sequence;
Olaf's local sheltered stream remains physically framed.

Read revised portal placement: it now reuses the existing authored gate61
native frame and derives field aperture/footing from atlas placement, replacing
the flat interactive panel. Moving machine rows also use actual cell-foot
grounding. These resolve the implementation concerns in code. Final refreshed
route and pre-victory exit-frame support captures remain pending inspection.

### Final corrected runtime acceptance

Inspected final refreshed shield-intake.png, initial-1x.png, drained.png and
right-dock-before-exit.png after the authored nozzle/portal and actual-foot
placement changes. The nozzle's pipe mount and open mouth join the stream;
it lands on Olaf's shield and the lee below stays quiet. The final low surface
leaves the bottom crank/hood seated while the pontoon settles with its water
support. Flexible air hose and skid tow line remain distinct through the
surface-to-bottom transition.

The pre-victory right-dock capture shows the permanent ladder reaching the
exit deck, Erik completing the climb, and the authored gate61portal feet
meeting that deck. Olaf/Baleog share the exit position and partially occlude
each other; this is ordinary permitted hero overlap, not proof of individual
gait contacts. Full-crew reunion is additionally established by the normal
route's all-three exit predicate and full-health result. Portal aperture is
derived from the actual frame placement. Parent reports actual visible
bottom/floor values900for fixed bell/valve,1000for hood/crank/sluice, and540
for portal; the inspected opaque feet agree with the identified supports.

Independently reran all10water tests after final gate/nozzle/portal changes:
passed, including full-health60/120Hz ordinary-control routes. Parent's final
refreshed production browser route completed in90.46667seconds atHP3/3/3,
with no JavaScript errors and Enter continuation working. Earlier route
times are historical; stale shelter/offscreen gate/victory support evidence
is not used for final acceptance.

**Final scoped verdict: source gate ACCEPTED for the direct native machine,
motion/nozzle art and scene at its declared2world/sourcepixel scale;
processed/actual1x/2x/mobile water-level runtime gate ACCEPTED.**
Generated machine study remains rejected and unused. This accepts the water
room's causal mechanics, visual states, grounding, adult scale and recovery
route; it does not approve the separate Viking85sprite candidates or claim
an exhaustive timing audit of every possible player trajectory.

### Added portrait-mobile context —2x readability correction pending

Subsequently inspected390×844water83-mobile-portrait-1x.png and
water83-mobile-portrait-2x.png. Portrait1x keeps the full standing heroes,
floor and controls readable. The supplied2x capture places Erik beneath the
touch controls at the bottom and clips boots/floor beyond the viewport.
This newly supplied context fails framing/readability/contact evidence,
despite the accepted desktop/landscape route. Correct portrait2x camera
framing or select the readable1x view for that narrow viewport, then recapture.
Prior source and desktop/landscape verdicts remain accepted; portrait2x is
an explicitly pending scoped blocker, not silently covered by those verdicts.

### Portrait framing blocker CLOSED

Read the corrected game.js toggleZoom(): it computes the new viewport and
immediately centers the current camera target rather than carrying the old
zoom's world-camera position into the new viewport. Inspected the refreshed
390×844portrait2x capture taken50msafter the1x→2x toggle. Erik's complete
head/body/boots and supporting floor are now visible above the touch controls;
feet lie near530screen pixels, with controls below670. The existing portrait1x
view remains readable. The camera change does not modify water source art or
mechanics. This resolves the added portrait2x evidence/readability blocker;
final water source and desktop/landscape/portrait runtime gates are ACCEPTED.
