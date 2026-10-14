# Drowned Regulator87 correction review

Independent review scope: replace simplified machine artwork with authored
generated machines, show basin containment, communicate crank progression and
remove Olaf's instantaneous deep-entry surface snap. Swimming poses remain
deferred. Apply native-sprite-art, VISUAL-REVIEW-GATE and HUMAN-SCALE; reviewer
does not edit runtime or art. Earlier83acceptance does not waive these new defects.

## Initial current-implementation findings

Read WATER83-SPEC/REVIEW and water-campaign/render. The cooperative sequence
remains understandable: shield calms local jet, inlet wheel opens passage,
pushed compressor tows bottom air hood, chain cut frees drain crank, draining
exposes permanent exit route. Preserve air-pocket recovery, retained winding,
bidirectional physical push and inactive breathing through the correction.

1. **Confirmed continuous-motion blocker:** waterFloat is classified solely from
   Olaf's depth and basinX, followed by unconditional y=waterY-24 both before and
   after integrateMotion. Deep sideways entry is consequently a teleport. Replace
   this with bounded buoyant acceleration/velocity and surface capture only at
   actual crossing. Verify deep side entry and surface descent frame by frame;
   descending water must not pull an airborne body through obstacles.
2. **Additional contact blocker:** pushPontoon uses root±28 while Olaf's front
   shield outer plane is±42. Root relocation to float edge±28 visibly penetrates
   the pontoon with14world units of shield. Use one actual contact plane for
   detection, carrier motion and collision; test both directions and inspect
   own pixels, including braking or changing shield state while touching it.
3. Water overlay has bare vertical edges at320/2100 from surface to1000. Basin
   walls must physically contain that whole column and meet dock/floor supports,
   while preserving bottom-to-right-ladder access. Rendered containment must match
   collision bounds; a wall painted across an accessible route is not a fix.
4. Crank phase currently uses floor(wound*40)%8, representing five revolutions
   over10seconds but discontinuously resets to a different final frame. New art
   must show actual turning, chain prerequisite, retained stroke and stop/done
   state. A progress label alone cannot substitute for changing handle pixels.
   Inspect release/regrip and LEFT unwinding as well as full winding.

## Required acceptance evidence

**RAW/source/native gate: PENDING replacement machinery.** Record native cells,
opaque component dimensions, original sources/prompts, single normalization and
actual pivots/ports/footings. Open-bottom bells must read as accessible air cavities,
not sealed display cases. Human-sized handles and maintenance access establish
adult scale; industrial bulk does not require changing hero collision geometry.

**PROCESSED/actual1x/2x/mobile gate: PENDING.** Inspect initial/working/completed
machine own pixels, winding/unwinding/retained progress, open bell cavities and
compressor hose/tow terminals across lowering surface. Verify complete supported
basin walls and corners, calm jet shelter matching forces, grounded hood/crank/
sluice and portal, visible floor/rider contacts, bounded Olaf entry trajectories
and no hidden collision bypass. Normal-controls completion/air margins supplement
these images; tests alone do not approve art or containment. Review explicit
normal-input and recovery evidence separately from state-injected diagnostics.

## Generated machinery v1 raw review

Inspected assets/water87/machines-raw-v1.png against WATER87-ART-SPEC.md and its
exact prompt. Target96native cells/192world units, broad baseline88 and centered
component anchors remain proposed contracts, not measured accepted registration.

**RAW v1 gate: REJECTED; do not normalize or integrate.** Brass and teal planes
contain mottled tiny texture, smoothly shaded highlights and fine edge/bolt
detail below the intended native clusters. Reducing this attractive painted
source would rescue the wrong density. Preserve it as a concept and regenerate
deliberate square clusters with broad material bands, no antialias/noise.

Additional source semantics blockers: the two supposed floor sluices are upright
door/hatch forms rather than a horizontal drain with a retained rim; the valve
state bodies/pipes differ in height and socket geometry, rather than the same
machine with wheel/indicator state changes. Correct these while retaining the
promising open-bottom bell cavities and separately authored wheel/rod housing.
Actual component ports/footings must be measured from accepted source pixels.

## Generated machinery v2 raw review

Inspected assets/water87/machines-raw-v2.png and machines-v2-prompt.txt.
**RAW v2 material/native-density gate: ACCEPTED.** Broad discrete brass/steel/
wood shading replaces the fine mottled painted planes. Bell cavities remain
open-bottom. Separate valve body/wheel avoids mismatched state bodies, and the
drain now reads as a horizontal floor slot plus separate shutter. The full
alpha range does not itself establish a wrong density; conservative single
binary-alpha normalization may remove thin fringe, with native outlines and
holes inspected afterward. It cannot rescue v1 or erase actual material detail.

**Packaging/processed gate remains PENDING.** Generated objects do not obey
exact nominal equal4x3cell bounds: first-row bell feet extend to aboutY405,
beyond nominal row362, and pontoon reaches beyond nominal first-columnX362.
Blind equal-cell cropping would clip objects or include neighboring fragments.
Measure each isolated original component ROI, use one consistent original scale
and translation registration; enlarge destination canvas if needed rather than
fitting every alpha box. Inspect a native contact sheet and actual ports/feet
before integration. Source acceptance does not approve unmeasured96cell anchors.

## Physics/enclosure correction preflight

Read current water-campaign/render corrections and independently ran water.test.js
and water-route.test.js: **12passed,0failed**, including ordinary-input full-health
60/120Hz routes. Deep entry now changes velocity through capped damped buoyancy,
rather than assigning Olaf's surfaceY. The new per-step deep-entry and draining
checks measure actual Olaf displacement; this addresses the earlier misleading
test that measured water alone. Tests place the hero at depth for a diagnostic;
normal-control entry trajectory evidence is still required for the runtime gate.

Pontoon contact now uses±42in both directions, with tests checking its actual
edge and Olaf's front-shield reach remain coincident. Banks extend from540to1000
and render matching retaining terrain. Right ladder2080lies on the wet face;
the dock extends to2056, allowing emergence onto its44unit supported projection.
The independent ladder test reaches its top and then crosses onto the dry bank.
This is a physically explained access correction rather than a painted wall
blocking the only escape route.

**Limited physics/code preflight: ACCEPTED.** This does not accept final wall
appearance, generated machine packing, animation readability or actual camera/
contact evidence. Their source/processed/runtime gates remain pending as above.

## Native v2 packing checkpoint

Inspected machines-native-v2-4x.png, registration-v2.json and pack-water87.py.
**Processed native packaging/material preflight: ACCEPTED.** One shared4.25raw
pixels/native pixel transform samples the retained original, isolating measured
components and translating them into96cells with exclusive baseline92. This
preserves entire bell/pontoon/grate shapes and avoids blind atlas clipping or
independent alpha-box scaling. Open bell cavities, wheel spoke gaps and broad
material planes remain legible. Baseline92and measured component ports must
replace proposed88anchors in runtime; this is not gameplay placement acceptance.

The actual handwheel is approximately60native across, larger than requested40.
An exposed industrial wheel around1.6adult standing height can be plausible,
provided its mounted center/handle and operating Viking agree in gameplay.
Do not shrink only this component or silently move its interaction point.

**Remaining initial-state art blocker:** retaining chain comprises two halves
with an open apex. It reads as already broken, contradicting the required cut
prerequisite. Generate a closed coupling/breakable link or correct its original
source; inspect raw/native link material before integration. An indicator or
completion flag cannot visually repair an absent retaining connection. Actual
runtime/animation/containment acceptance still pending final corrected packet.

## Ordinary-control buoyancy and basin visual checkpoint

Inspected water87-olaf-deep-before-release, rise-2/14/29, initial-1x,
right-dock-before-exit and mobile-2x. The ordinary-control exit-ladder release
shows Olaf leaving at depth, rising through the visible column and approaching
the actual surface across successive captures; he does not appear instantly at
surface level. Camera movement prevents inferring world speed from screen
position alone. Reported trajectory854.87→540.18over1.94seconds, with velocity
accelerating−53→−180then braking−72, supplies the corresponding world-motion
measurement. This is actual ladder release using ArrowLeft, not a placed-state
diagnostic. The earlier independent bounded-motion regressions agree.

The initial/mobile bank now visibly forms a solid retaining face beneath the
left dock. The right-dock and deep-rise views show the wet-face ladder against
the right bank, reaching the supported top projection and continuing below.
Water meets those visible masonry sides instead of ending as an exposed plane.
These captures establish the inspected bank/support contexts, not every possible
camera angle. The reported old-art normal browser route cleared all threeHP3
without page errors.

**Buoyancy/enclosure runtime checkpoint: ACCEPTED for these corrections.** This
packet intentionally uses superseded simplified machinery; it cannot approve
new generated machine art, crank state clarity, terminal contacts or the final
87release. Final source/processed machinery and full refreshed runtime gates
remain pending the corrected generated-art packet.

## Extra nozzle/coupling source v1

Inspected extra-raw-v1.png and extra-prompt.txt. **Nozzle RAW density/material
gate: ACCEPTED.** Discrete broad bands explain a supported inlet neck, brackets
and open downward mouth. Measure actual inlet/mouth and attach the pipe/stream
after uniform native normalization; runtime coverage/contact is not yet accepted.

**Coupling RAW gate: REJECTED for its intended small chain-link role.** At the
whole-source native scale it occupies about32×40native instead of10×12, becoming
a64×80world clamp/padlock nearly Viking-height. This changes scale and apparent
opening affordance rather than merely bridging the chain's tiny apex gap. Do not
independently shrink it or silently substitute it as the sword-cut link. Regenerate
a genuinely small closed rusty link/exposed retaining pin within its intended
native envelope. Preserve this source as rejected concept/provenance.

### Nozzle native inspection

Inspected nozzle-native-6x.png and nozzle-registration.json. Broad planes and
open mouth survive uniform normalization, but **processed native gate BLOCKED**
by anomalous bright red/green/yellow single-pixel exterior fringe, visible on
the turquoise slope, brass rim, bracket and underside. These are matte/noise,
not readable authored highlights. Clean the conservative exterior mask from
retained original and repack once; do not filter/reprocess the native output or
erase legitimate interior copper/brass material. Preserve accepted density/form.

The proposed mouth48,90lies near the lower lip rather than the dark inner
opening above it. Measure the actual opening and ensure jet starts inside or
overlaps its real edge, not from disconnected space below a solid flange.
Runtime inlet/jet contact remains pending corrected own pixels.

### Original-mask nozzle correction

Re-inspected a uniquely named copy(output/water87-review-nozzle-clean.png) after
the original-source exterior matte rejection. The preview still displays colored
points, but direct nativeRGBA samples confirm those points now have alpha0:
green25,68; yellow70,56; red20,85. They are no longer opaque runtime fringe.
Zero their RGB when alpha0 to avoid misleading previews and hidden matte during
future resampling. This is mask/output hygiene, not silhouette/detail processing.
The source retains its accepted material; mouth anchor48,85now lies in the dark
aperture rather than the lower lip. **Opaque-fringe blocker resolved; nozzle
native material/shape accepted**, with transparent-RGB hygiene requested before
final output and actual inlet/stream contact still pending runtime inspection.

### Tiny retaining link v2 source

Inspected link-raw-v2.png, its128logical guide basis and exact prompt.
**RAW small-link v2 gate: ACCEPTED.** The actual near10×13native subject is a
compact closed rusty loop with dull crossing pin and open hole, correcting the
oversized clamp. The additional one-native-pixel height versus12target is minor
registration allowance, not a change in role or material density. Normalize once
from this whole original source basis with conservative exterior mask and
transparentRGBzero. Processed connectivity/remaining hole and actual overlap with
both retaining-chain halves require inspection before final locked/cut acceptance.

## Generated runtime state preflight

Inspected refreshed initial-2x, valve-before/after, crank-half/complete and
fixed-air. Valve body/wheel is now distinct from the fixed refuge; its persistent
rotation explains shutoff without morphing the housing. The crank's threaded rod
visibly rises from half to completion and retains its final displacement, while
the same large wheel rotates about its mount. Refuge cavity and operator/handle
scale are readable. These sampled states improve the earlier placeholder machine
and progress ambiguity; continuous/held/unwinding evidence remains pending.

The mobile bell wheels in valve-before appear slightly above the floor. Native
last tire row91contains very dark connected pixels, so this might involve visual
foot contrast rather than geometric absence; hard-coded baseline metadata cannot
settle it. Request an actual rendered-alpha/broad tire footing scan or a tight
current own-pixel contact capture. Fixed bell feet clearly meet their platform.
Final runtime acceptance remains pending this grounding evidence, closed link
integration/cut states and the complete refreshed generated-art route.

### Closed native retaining assembly accepted

Inspected link-native-8x.png and chain-closed-6x-proof.png after the accepted
small source was uniformly normalized. The10×12native closed rusty loop/pin
retains its holes and bridges both upper chain halves, giving a coherent attached
retaining arc rather than the previously broken initial state. **Processed native
link/joining gate: ACCEPTED; initial-state source/native blocker resolved.**
Actual locked/cut/drop world states, footing and terminal contacts remain subject
to the final runtime gate. No further art changes requested by this preflight.

## Drainage compressor interpenetration blocker

Implementer identified actual drained capture overlap: descending compressor
passes through the grounded bell roof and crank wheel/raised rod. **Final runtime
gate BLOCKED** until real support resolves this intersection. Do not waive it
because full routes pass or because water support is continuous.

Preferred causal correction is a fixed docking saddle on the mobile bell's
grounded shoulder/pillar frame, with its actual pod support plane above both the
bell crown and maximum raised crank rod envelope. A moving crank rod is an
actuator, not a sensible parking support. Preserve open cavity and hose access;
generated/native cradle material should visibly join real structural mounts.
Measure the pontoon underside and rod extremity rather than guessing a deck
height. All physical deck surfaces, rider carry, sprite position and attached
ports must use the same authoritative f.y; recomputing waterY-12 in a renderer
would leave disconnected art after docking. Olaf continues with the actual water.
Inspect descending approach, first contact and fully drained state, with solid
opaque footing and intact rider plane. Remobilizing a floating compressor must
follow real buoyancy/contact, not teleporting to a different berth.

### Generated cradle source checkpoint

Inspected cradle-raw-v1.png and its exact prompt. **RAW material/native-density
gate: ACCEPTED.** Coarse shaped brass/steel bands, open central bay and caster
columns explain a real support frame. Geometry is not accepted merely because
the prompt specified it: actual beam begins near24native, depth12, soles110,
leaving86native support height rather than100. Extend legs through repetition/
translation of an authored generated straight-column module if necessary; do
not stretch or fit individual shapes. Inspect assembled native seams/feet/empty
bay separately. Original exterior mask and transparentRGBzero hygiene apply.

Example measured contact consequences: beamtop800and24world depth place its
underside824, so the bell crown and maximum rod must physically clear that
underside; a nominal60world rod stroke might provide clearance but actual opaque
head pixels must establish it. A pontoon underside56world below deck implies
deck744when resting on800. These are provisional geometric relations, not final
accepted placements. All contacts, hose endpoints and rider plane require final
own-pixel evidence after shared authoritative deck logic is implemented.

## Final WATER87 verdict — corrected cradle packet

**RAW native-density gate: ACCEPTED** for the final machinery v2, nozzle,
small retaining link and cradle sources. The rejected painted v1 and oversized
coupling remain rejected provenance, not production alternatives. This verdict
does not approve a new Viking character kit or swimming frames.

**Processed native-art gate: ACCEPTED.** Inspected the assembled
cradle-native-6x.png and registration: one original 1254/128 normalization,
translated generated upper beam, repeated straight shaft and generated collar
retain the material scale. The collar makes the seam structural; the bay stays
empty and the broad seat is continuous. Beam seat12, depth12 and sole112 are
measured native geometry, not prompt assumptions. The narrow dark final tire
edge is acceptable as an outline only when the broader tire band visibly seats;
the final world captures establish that contact. This supersedes the pending
assembled-cradle checkpoint above.

**Actual processed/runtime gate: ACCEPTED for WATER87's changed scope.**
Independently inspected refreshed initial-1x, shield-intake, chain-before/cut,
crank-half at desktop1x/2x and mobile, berth-approach/contact, drain-middle,
drained, mobile-2x and right-dock-before-exit. Closed retaining link joins the
initial chain; cut halves visibly separate. Generated wheel rotation and rising
threaded rod communicate progress while preserving their mounts. Detailed
machinery has coherent industrial scale relative to the adult crew.

The compressor's curved pods approach the cradle, meet its seat and remain
parked there while water and Olaf continue downward. The drained state retains
an open refuge bay and visible rod-to-beam clearance, with no old compressor/
bell/rod interpenetration. Broad caster/tire bands meet the terrain line. The
same broad ledge now supports character feet; moving off its visible edge to
the fixed refuge is a coherent route rather than a hero-specific collision
exception. No perceptible open gap remains at the sampled support contacts.
Nozzle inlet/hose and stream meet their actual ports; basin banks and the
wet-face exit ladder provide readable physical containment and escape.

Independently reran water.test.js, water-route.test.js and
water-connections.test.js: **16 passed, 0 failed**, including normal-control
60/120Hz routes, bounded deep-entry buoyancy, partial hold/reverse, berth rider
carry and hose bends through drainage. The root's final ordinary-keyboard
browser run reports all three HP3, won=true, 112.475 simulation seconds and
errors=[] in output/water87-route.json. This reviewer inspected its retained
screenshots and read-only evidence; did not perform a separate browser
playthrough. The earlier buoyancy sequence remains valid trajectory evidence.

**No remaining material blocker in this WATER87 correction packet.** This
supersedes the drainage interpenetration blocker above; it does not waive
unrelated character-art, campaign or future asset review requirements.
