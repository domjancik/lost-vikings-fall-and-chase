# Momentum Works68 independent critique

Concept review of MOMENTUM-SPEC.md and assets/momentum68/brainstorm.png before
implementation. The brainstorm conveys a legible push → steer → board → leap
relay, followed by a timing lane and crew reunion. It is composition/concept
evidence, not native sprite source acceptance or proof of feasible geometry.

## Initial verdict — blockout corrections required

The causal progression is promising: an externally visible fork changes a
physical route, a rider gains height through the sphere, and the final safety
control gives the rest of the crew permanent access. Neither actuator needs a
teammate stranded holding it. Repeatable return and a safe lower floor provide
a suitable recovery loop. Close these specifics before implementing the route:

1. **Sphere energy and fair guide timing.** State launch acceleration/speed,
   gravity, friction, rider load and upper-path speed envelope. A downhill run
   followed by an equal-height climb must have enough visible supplied energy;
   do not secretly replace momentum with constant motor speed after the fork.
   The two-second deflection needs an approach cue and a reproducible usable
   window from the sword gallery. Record minimum timing margin at60/120Hz,
   including switching Vikings. Require the guide to be visibly in the routing
   position when the sphere commits, not an unrelated hidden timer.

2. **Actuator affordance and consistent force.** A sword hitting a heavy bronze
   arm is less obvious than a spring latch/tab shaped to accept a blade, or an
   impact paddle with a clear loading/recoil action. Choose and depict one.
   If sufficient impact activates it, other reachable sufficient impacts must
   behave consistently; don't reject Erik's bash solely by hero ID. Explain
   why an arrow cannot supply that impulse. Olaf's braced shield contact must
   visibly transmit the sphere push; specify force/resistance rather than a
   special-location or named-hero unlock.

3. **Swept sphere clearance and boarding.** Specify every gallery's x interval,
   thickness and rail curve coordinates, not only floor heights. A boarding
   gallery at1190/820 can intersect the120-diameter sphere as the upper route
   rises: a crown around800 and deck at820 overlap. Keep the sphere below the
   shelf until its center clears the shelf end plus radius before ascending,
   or place the shelf outside its swept volume. Test physical circle/deck
   clearance throughout the route. Rendering the sphere over a shelf isn't
   an acceptable physical solution.

4. **Endpoint and leap feasibility.** Make the upper rail endpoint horizontal,
   with an actual registered rail-contact/radius measurement. Only there does
   crown=railY-2r justify highGround=720-2r-100. Confirm horizontal gap and
   landing width, residual sphere speed, takeoff window and Erik's actual jump
   apex; maintain the stated30-unit vertical clearance. Board/reboard while
   the sphere is still accessible; no blind leap onto an offscreen moving target.

5. **Reset custody.** Define what the return hoist does with riders. Carry them
   continuously to an unobstructed safe dock, or visibly defer reset until
   empty. Never teleport, strand, crush or preserve a rider offset through a
   static deck. Lower catcher controls must remain reachable after misses;
   reset must work when the sphere stops on either branch, not only the catcher.

6. **Complete crew route.** Author an uninterrupted lower-floor path to the
   bottom lift2910, safe from upper-lane falling pieces/fireballs. Olaf/Baleog
   cannot be required to jump the padded bumper. The lowering recovery ladder
   may help Erik recover, but the crew should be able to wait safely below and
   board the permanent lift after shutdown. Show both docks and the real shaft
   gap; permit three riders without hiding their feet under its front rim.

## Timing lane details to fix in the numerical plan

- Specify bumper height/width, rebound surface normal and furnace projectile
  height. Its placement must protect a waiting area rather than trap returning
  fireballs between the bumper and furnace. Destroy or safely expire repeated
  rebounds; use bounded lifetime and an unambiguous escape path.
- State laser charge/live phase cues at the actual emitter, and ensure the
  full beam is readable before live damage. Charge stays harmless. Confirm
  arrival timing can be judged from safe staging with the gameplay camera.
- Crumble tiles need per-tile contact timers, consistent sag/contact plane,
  clear intact/cracked/sagging/falling states and generous run-speed crossing
  margin. A failed crossing should land on the recovery floor without being
  struck by unavoidable debris. Restore gradually only after clearance, or
  reject reassembly through a Viking's body.
- Place furnace/control paths so the hero can cross the safety control without
  passing through opaque solid machinery. Shutdown stops actual emitters and
  live projectiles visibly, with a defined treatment of existing projectiles.

## Required validation flow

First submit a numeric blockout with rail position/tangent, sphere radius,
speed/timing envelope, shelf bounds, clearance and complete recovery routes.
Review conceptual fixes before accepting a successful scripted route.

Mechanical tests must cover normal and missed guide timing, miss/late boarding,
balance walk/jump detach, swept circle/deck clearance, rider foot contact against
the actual circular crown, return with/without occupants, and all crew lift/exit.
Include reversal/reset at multiple path positions, damage/death and invulnerability,
warning/live laser boundaries, shield/bumper projectile direction and tile support
removal. Full normal-input routes at60/120Hz need actual margin, not only success.

Actual browser evidence must show push contact, guide before/moving/held/recoil,
both branches and safe catcher, boarded moving rider, leap/recovery, complete
return hoist, all crumble phases, laser charge/live, furnace/rebound/shield,
shutdown/restoration and three-rider reunion. Separate simulated routes from
actual normal-control browser playthrough. Inspect both1x/2x and mobile, with
own object pixels unobscured and camera/zoom matched for state comparisons.

## Art gates — pending separately

**RAW native-density/source gate: PENDING.** The brainstorm is not a gameplay
atlas. Require retained originals and same-size native probes for sphere60px
opaque diameter in64cell, tiles40px width, mechanisms and a proportionate wide
connected foundry. Broad material shading must survive intended display size;
no detailed source rescue through grid detection or heavy downsampling.

**PROCESSED / actual gameplay gate: PENDING.** Once-from-original packing,
fixed sphere radius/pivot, grounded rails and supports, tile physical rim,
emitter ports and attached animated fire/smoke all require independent inspection.
Circular passenger contact must agree with visible art throughout rotation;
fixed pivots cannot be replaced by per-frame fitting. All supports terminate
on real lower footing, and adult-human references must avoid miniature scale.

No implementation/art acceptance is given by this initial concept review.

## Revised blockout and RAW art preflight

Parent revised boarding gallery to810..980/y820 with ladder820, added a starter
escape ladder320, and moved the return hoist outside the starter deck to680.
The lower return rail at1060 clears the sword gallery. Proposed geared gravity40
and friction.12 produce roughly150 downhill and65 uphill from a70 push, rather
than a hidden constant-speed motor. Spring accepts a reachable sufficient bash
as well as sword; arrow only clinks. Reset defers while the sphere has a rider.
These address the causal/recovery concerns in principle; review actual swept
volume and timing margins before declaring geometry accepted. Center1020 with
shelf end980 still needs circle/deck-thickness clearance, not a point test.

Inspected assets/momentum68/source-a.png, source-b.png, source-scene.png and
native-review.png. **RAW machinery density: PASS preflight.** A uses deliberate
approximately4-source-pixel clusters and96x64native source cells; B uses coarse
approximately5-pixel clusters and64-square targets. Broad brass/ceramic/flame
planes are readable at the supplied native view. The long striker must retain
its96x64extent; do not crop or fit it into64square. Sphere opaque diameter is
56native/112world, so radius56 and high508 correctly supersede the earlier
120world/high500 estimate. Register one stable radius/pivot across all frames.

Final B furnace pose's rear housing appears tight against its source-cell edge
in the contact sheet; establish explicit safe opaque bounds before accepting
equipment completeness. If clipped, regenerate/recrop that pose rather than
rescale each frame. Tile nine-slicing is appropriate only if source pixel scale
and authored edge widths are preserved; verify actual cracks/sag contacts later.

**RAW scenery framing: PENDING correction of contract.** The new source is
1536x1024, a3:2connected foundry, while the initial spec requests1600x640, a5:2
scene. Preserve its actual aspect and update native/world framing and floor
registration, or regenerate a genuinely wide source. Do not squash it to the
old requested extent or reduce the detailed source to the384x256 comparison
thumbnail for runtime. The original's material density is suitable for a large
environment at roughly its original native density; the thumbnail is preview
evidence only. Its wall/bridge/door references need actual adult-human scale
inspection after integration.

No processed/runtime gate is accepted yet. The reported initial60/120routes
are useful feasibility evidence, but do not waive swept circle clearance,
source bounds, visual contact or actual ordinary-control playthrough gates.

## Implementation audit before final evidence

The current boarding gallery1080..1200/y760, ladder1140 and starter deck end520
supersede the earlier geometry. Independently ran momentum.test.js:13 tests
passed, including all24-thick deck sweeps on both branches and ordinary-input
60/120Hz full routes with health[3,3,3]. This closes the demonstrated static
circle/deck intersection blocker. Lower-floor access to the crew lift is
continuous; the act2 bumper does not block Olaf/Baleog's lower route.

Reset defers while a grounded circle rider remains aboard. The visible return
route stays below the sword gallery and outside the starter deck, and occupied
reset regression passes. Missed tiles restore after a bounded delay, so a failed
timing attempt is recoverable before safety activation. Warning/live damage
and ordinary shield/bumper tests pass. New tests include solid furnace housing
and its landing surface; final art must match those physical boundaries.

Inspected initial momentum68-start, guide-moving, rider and timing-lane pictures
for diagnostic context. Several predate the latest shelf/B-source corrections,
so they are not final acceptance evidence. Circle riding appears readable in
the supplied frame and the foundry is coherent, but no current all-contact
runtime verdict is given from these superseded pictures.

Outstanding own-pixel registration checks for the final capture matrix:

- Spring interaction target970 versus actual pivot1030: show the blade striking
  the exposed authored tab before its registered guide stroke.
- Beam x2160 versus emitter drawnx2088 plus its authored lens center: measure
  the native lens port rather than assuming cell center. A center32 would imply
  x2152, leaving an8world discrepancy; final source may have another measured
  port. Correct draw/collision registration together if needed.
- Bumper reflection at2026 must match the final opaque right-side face and
  compressed frames after the margin correction, not the old rectangle.
- Sphere velocity currently stops instantly when reaching either rail endpoint.
  Show a visible catcher/contact cushion or another plausible impact stop;
  avoid an unexplained silent halt. No teleport occurs, but continuity of
  positions alone does not establish a convincing catch animation.

SourceB clipping was confirmed by parent and is being regenerated with safe
margins. RAW complete-equipment gate and processed/actual1x/2x/mobile gate remain
pending the replacement, updated spec/framing and final state evidence.

## Dedicated furnace source and native packing review

Inspected source-furnace.png (2172x724) and furnace-native-review.png.
**Dedicated furnace RAW density/source gate: ACCEPTED.** Approximately8-source-
pixel blocks give deliberate coarse brass/fire planes at the72-native cell and
144world extent. Closed/loading/open/firing states are distinct, the original
rear housing is complete, and broad steel/brass shading survives the native
view. The rejected clipped sourceB furnace row is removed from production.

**Processed furnace native gate: BLOCKED on registration/extraction.** An
independent actual-PNG alpha scan found all four cells' opaque bounds end at
exclusive y71 (last opaque row70), with zero opaque pixels on row71. Drawing
y364 at144world therefore gives visible base506 instead of support508. Translate
all frames one native pixel down, preserving scale and stable base.

The third cell has bbox(7,14,72,71), reaching its right cell boundary, while the
other housing bounds end at63. The72-wide crops overlap a68-native stride;
neighboring firing-frame fringe can enter that edge. Isolate the authored
connected physical pose from the retained original/crop and reject unrelated
neighbor pixels. Verify clear left/right borders and a broad actual final base
row in all four cells. Do not stretch or fit frames independently.

These are processing defects, not a rejection of the new source's material
density. Final runtime gate stays pending corrected packing and actual evidence.

## Corrected native furnace and actual matrix audit

Independent alpha scan of the corrected furnace now gives bounds
(7,15,63,72) for the first three states and(5,15,63,72) for firing, with38–39
opaque pixels on row71. The neighboring right-edge fringe is gone. **Processed
furnace native gate: ACCEPTED**, superseding the previous extraction/base failure.
Fresh actual furnace-footing evidence remains required after this correction.

Reviewed current start/rider/guide-moving/timing-lane/safety-after/upper-dock
views at1x/2x and representative portrait/landscape variants. Mobile/landscape
pause placement leaves the circle rider and guide's own pixels visible. The
circle crown supports the visible planted boot; arm and spring pedestal share
a stable pivot, with a post to the lower support. Background retains3:2aspect;
the updated source contract closes the forced5:2framing concern. It does not
establish every upper/lower background footing independently.

**Actual lift contact blocker:** momentum68-upper-dock-0 shows the hero floating
above the authored lift rim. Momentum draws the reused Refraction lift at
carrier.y-16, but refractionArt.liftRim is33native/66world. Its real walking rim
therefore appears50world below the simulated floor. Reuse the registered rim
anchor rather than assuming the Cycle cradle's offset, add a rendered-rim/contact
regression, and refresh dock/rider matrix views. Successful completion cannot
waive this visible support failure.

Independently reran14mechanical tests successfully. Parent reports an ordinary
keyboard full clear129.708s, allHP3, Enter continuation and no errors. This is
reported production-route evidence, not a separate reviewer playthrough.

Final state evidence still needed: harmless laser charge versus live beam,
furnace windup/firing at its actual mouth, crumble sag/fall/restore, bumper/catcher
compression, missed lower branch and return hoist. Current timing-lane is safe
staging and safety-after only shows shutdown, so these files alone cannot
establish every changing object. Use own pixels unobscured by pause/HUD overlays.
Overall processed/actual runtime gate remains pending.

## Latest ordinary-input state matrix

Independently ran the current16momentum tests: all passed, including the shared
registered lift-rim regression and left-side reachable return control. Inspected
fresh upper-dock-0 and its portrait mobile variant: soles now meet the visible
silver front rim, closing the50world contact error. Furnace-charge/fire show the
corrected broad base on its deck and flames issuing from its measured mouth.
The dedicated-source packing defects are resolved in native and actual views.

Inspected laser-charge/live and rebound; warning is subdued and live is bright,
with the authored bumper and outgoing reflected fireball readable. Inspected
crumble-sag/fall/restoring/restored: first tile's state changes and continuous
vertical displacement are visible, with safe landing and subsequent rebuilding.
The compact pause badge leaves the relevant mechanisms/contacts clear.
Return-horizontal and return-hoist show the sphere along the lower/vertical
route, while updated catcher return control is reachable from its left.

Parent reports a final ordinary-controls failure/retry run deliberately taking
the lower branch, resetting, falling with a tile, recovering via ladder and
reuniting the crew:153.408s, health[2,3,3], Enter continued, no errors. The one
hit came from a rebounding fireball after an extended hazard wait. Separate
ordinary full route129.708s and independently rerun60/120simulated routes finish
health[3,3,3]. Taking real damage during deliberate retry is not itself a defect.

**Final evidence gap:** lower-catch.png and lower-catch-1x.png show the active
hero on the starter deck with the sphere offscreen. returned-cradle.png follows
the active hero on the lower floor and also leaves the sphere offscreen. The
filenames and reported state cannot certify the catch or final visible reseating.
Provide actual own-pixel lower-catch and returned-cradle captures by following
the sphere or widening the viewport. No additional runtime defect was found in
the inspected corrected state matrix, but the complete processed/runtime gate
remains pending these two essential recovery endpoints.

## Recovery endpoint and emitter refresh

Fresh lower-catch2x/1x show the sphere touching its lower floor/cushion; fresh
returned-cradle2x/1x/landscape show it reseated on the starter support. These
supersede the offscreen endpoint captures and close that evidence gap. The
current laser1x views show its flange seated on a service arch extending to
the floor, resolving the previously unregistered hanging support.

An independent actual-alpha scan found one remaining outlet discrepancy:
emitter idlecell8 bbox ends at35native, but charge9/live10/safe11 end at34.
Beamstart176+35*2=246 leaves2world gap below charge/live opaque bottom244.
Join the beam to a shared inner lens row or the frame's actual bottom; do not
use the idle maximum as every state's visible outlet. This is a narrow final
contact correction, not a source-density defect. All other inspected corrected
source/native/runtime contexts are ready for final acceptance. Sixteen current
mechanical tests pass independently.

## Final Momentum68 acceptance

**RAW native-density/source gate: ACCEPTED.** Final retained sourceA relay/sphere,
sourceB fireball/emitter/bumper and dedicated source-furnace use deliberate coarse
pixel clusters suited to their actual targets. The long arm remains96x64native,
bumper retains80x64extent for recoil, and dedicated furnace72-square cells
retain complete housing rather than the rejected clipped sourceB row. Broad
material planes are readable after once-from-original uniform nearest packing.
The connected foundry's3:2aspect is now honestly reflected in its768x512native/
1536x1024world contract. The initial wide-aspect request and rejected clipped
furnace are superseded, not approved by this verdict.

**PROCESSED / actual runtime gate: ACCEPTED in the reviewed contexts.** Final
lower-catch and returned-cradle2x/1x show actual endpoint seating, closing the
last recovery capture gap. Final laser-charge/live1x show the source flange on
its supported arch, warning/live lens states and beam joining the actual lens.
Beamstart242 overlaps the charge/live opaque bottom244, closing the measured
2world outlet gap. These refreshed files supersede the earlier floating emitter
and mismatched outlet captures.

Inspected checkpoint, checkpoint-bottom and checkpoint-mobile: the recovery
ladder at1900 is clear of the parked sphere, with ordinary climbing down to
the lower floor and back to the upper deck. The moved ladder supersedes1840;
its new full-body clearance regression prevents climbers bypassing sphere
collision. Corrected upper-dock0/1/2 show each Viking's soles on the actual
registered silver lift rim, and clear shows completed crew reunion. Native
furnace bounds/base and actual charge/fire footing are accepted above.

The reviewed matrix covers pushing/guide/riding, both branches, continuous
return, circle crown/rail contact, crumble failure/restoration, laser charge/live,
fireball rebound, furnace windup/fire, safety shutdown, three individual lift
rides, exit and representative1x/2x/portrait/landscape gameplay. Own pixels are
visible in the final essential contact/state views. No remaining material
blocker was found in these supplied final contexts.

**Mechanics/recoverability: ACCEPTED.** Independently reran17current momentum
tests successfully, including full normal-input60/120Hz routes with full health,
swept sphere/gallery clearance, occupied reset, lower-return reachability,
checkpoint body clearance, registered lift rim, crumble recovery, solid furnace,
bumper/shield projectiles, warning/live damage and repeatable continuous return.
Parent reports ordinary browser full clear129.708s/health[3,3,3], deliberate
wrong-branch/crumble failure-and-retry clear153.408s/health[2,3,3], Enter continued
and zero errors; latest recovery/checkpoint/outlet checks also passed ordinary
controls, and291root tests passed. These supplement independent code/test/image
inspection. I did not perform a separate full browser playthrough.

Acceptance is scoped to this new room and its final reviewed assets/contexts.
It does not certify every uncaptured animation instant or unrelated legacy
campaign scenery. The final accepted corrections supersede all pending/blocking
interim findings above.
