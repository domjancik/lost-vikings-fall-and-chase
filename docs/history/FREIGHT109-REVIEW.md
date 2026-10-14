# Ember Freight109 independent critique

Reviewer scope: this review record only. No runtime or art implementation.
Apply cooperative-world-design, native-sprite-art and VISUAL-REVIEW-GATE.

## Concept review

The furnace depot can support a strong progression: commission a safe steam
riser, carry a passenger into an exposed freight crossing, defeat a mobile
inspector under shield cover, then jointly purge the working hot gallery.
Its freight/power/pressure infrastructure gives these actions a reason to exist.
Concept acceptance is conditional on the concrete requirements below; a synopsis
does not establish clearability or publication approval.

1. Teach one cracked masonry construction and retain its interaction verb.
   Opening the teaching vent and the final exhaust plug must visibly be the
   same physical action. Give Erik an actual running lane and bash envelope;
   an elevated target reached from a narrow shield must not require impossible
   acceleration or an unannounced jumping bash.
2. A dropped power cell needs visible travel, persistent pickup, a matching
   receiver and unmistakable seated/completed art. Show pressure or power move
   through an actual connection before the next draft starts. A killed enemy
   must not silently flip an unrelated permission flag.
3. Olaf's front and raised shield retain established functions. Teach the
   raised passenger surface in a safe area, then test the carried rider through
   the complete draft and docking range. Verify soles against the actual shield
   walking plane, not its sprite edge. A shield covers a firing lane only where
   its geometry intercepts the projectile.
4. Mobile inspectors need readable walking boundaries, grounding, firing tells,
   an active interval and recovery. Avoid unavoidable simultaneous hazards
   while switching heroes. Parked heroes need structural cover.
5. Freight boarding, waiting and dismounting need broad safe docks. A missed
   trolley or draft must lead to a recovery floor and a return path that does
   not require Olaf to be on both sides of the gap simultaneously. Persistent
   commissioning and a repeatable trolley cycle should prevent softlocks.
6. Purging should animate a valve/duct/pressure consequence continuously. Cool
   projectile sources, then let already emitted fireballs complete or visibly
   quench; do not erase traveling threats on an invisible state change.
7. Final victory should reunite all three through the same physical exit.
   Waiting heroes must not be forced to cross an uncleared hazard offscreen.

## Required review evidence

- Concrete map and movement envelopes: actual acceleration, jump reach,
  ladder dismounts, passenger head clearance, drafts and boarding windows.
- Interaction matrix: intact/opening/open vents; dropped/carried/inserting/
  seated power cell; freight idle/moving/docked; inspector warning/firing/
  recovery/defeated; purge warming/cooling/cooled; exit closed/moving/open.
- Raw art beside native-size and enlarged processed art. Define two world
  units per native pixel and per-asset footprint before generation. Fresh
  Inside the Clockwork material quality must survive its gameplay scale.
- Ground contact and final port registration throughout moving ranges; no
  floating supports, enemy soles above floors or oversized human architecture.
- Production 1x, 2x and coarse-pointer mobile captures of the interactions,
  hazards, carried rider and reunion; ordinary-control complete route with all
  three alive, plus relevant failure/retry. No debug teleport acceptance.

## Gate verdicts

- Cooperative concept/progression: **accept**, final route and states below.
- Native-density/source gate: **accept selected V2 cell/body sources and far
  scene; revised human-scale middle scene accepted separately below**. V1 and
  rejected V2 machinery are retained historical failures, not shipped assets.
- Processed/in-game gate: **accept**, final production correction evidence below.
- Publication: **allowed after final package/build/release verification**.

## Raw V1 source review

Inspected originals directly before normalization:
`assets/freight109/machines-raw-v1.png`, `inspector-raw-v1.png` and
`cart-raw-v1.png`. No reduced candidate was used to rescue their density.

- Machines target 64-native cells; raw 1280-square four-column sheet implies
  approximately five source pixels per deliberate native pixel. Thin mottled
  corrosion, rivet rims and bevel gradients contain numerous one/two-source-
  pixel details. Masonry has painted rough flecks instead of a small number of
  purposeful cluster planes. **Reject** matching native density.
- Inspector target 48x64-native cells; 384-wide raw cells imply eight source
  pixels per native pixel. Contours, cables and material detail commonly occupy
  two/four-source-pixel clusters, with fine helmet/chest shading. Broad amber
  exterior haze also fills transparent negative space. **Reject** density;
  whole-sheet normalization would discard defining detail.
- Cart target 192x128 native, raw 1536x1024 implies eight source pixels per
  native pixel. Fine scratches, material flecks, rim detail and small curved
  contour steps are finer than that grid, beneath broad smoothly shaded planes.
  Exterior gold haze is not authored opaque machinery. **Reject** density.

These originals provide useful material direction but do not establish approved
runtime pixel sources. Regenerate with explicit native cluster scale, flat
coherent material planes, a few well-sized fasteners, stable anchors and no
painted microtexture. Preserve these rejected originals and exact prompts.

Implementation refinement reported by author: final ledge y200 above gallery
y360 provides Erik an 80-world-unit jump from the raised shield plane y280;
320-wide landing gives a running lane for the final bash. This resolves the
synopsis's narrow-shield/runway concern in principle, pending actual controls
and landing evidence. Recovery winches cut by Baleog unfold actual ladders;
inspect their local rope/stroke/ladder transfer rather than an unlock flag.

## Raw machine V2 source review

Inspected original generation `exec-52844e51-65c1-4f1b-a0b8-731d5717a280.png`
before normalization, against `assets/freight109/machines-prompt-v2.txt`.
Broad iron and stone plane clusters are substantially closer to the 256-square
logical sheet (actual 1280 output implies five source pixels per native pixel).
The raw complete-sheet gate nevertheless remains **reject**: thin white/glint
contours and ragged colored fringe surround housings; winch rope remains finely
painted twisted texture; charging muzzle has smooth multicolor glow rather than
a small authored cluster set. These are defining mechanical/material features,
not only removable transparent blank-area noise. Preserve the broad-plane
direction and regenerate the offending machinery at explicit cluster scale.
Individual acceptable cells may be reviewed separately; no blanket grid rescue.

## Inspector V2 raw body source review

Inspected original `exec-a1403356-24d3-4cb2-b768-6e4c5d755ae4.png` directly.
**Accept native-density body source:** large deliberate square clusters carry
the helmet, barrel, chest battery, shoulder planes and boots at intended 48x64
logical density. Dimensional iron planes survive without fine texture rescue.
Opposing walking leg poses plausibly exchange contacts, pending native frame
comparison and actual runtime motion evidence.

This acceptance excludes the extensive exterior amber/navy haze. Ordinary
exterior matte cleanup is permissible only if opaque material silhouettes,
mechanical negative spaces and body shading remain unchanged. Processed native
alpha and all-frame sole contacts remain pending; do not treat the body source
acceptance as complete-sheet or in-game acceptance.

## Machine V2 individual cell source acceptance

After separate body inspection, **accept native-density sources** for empty/
filled receiver (row1col4/row2col1), cracked/fracturing plug (row2cols2/3), rubble
(row2col4), gate frame/leaf (row4cols1/2) and pier (row4col3). Their defining plane
clusters and negative spaces match logical density. This does not accept the
complete sheet: nozzle/burner/winch retain the rejection above. Thin outer
fringe on accepted cells can undergo ordinary matte cleanup if opaque structural
contours remain unchanged. Require uniform normalization, translation-only
registration and native/state comparison before runtime acceptance.

## Cart V2 raw source review

Inspected original `exec-09914195-e789-480d-8e6e-55800e2ef3dd.png` directly.
**Accept native-density source:** magenta matte surrounds a clean stepped body;
wood grain is broad directional bands, rivet/bevel clusters are deliberately
sized, and wheel rims have stable square contours. The intended 192x128 logical
image within 1536x1024 presentation gives approximately eight pixels per native
cluster. Single uniform normalization and matte removal are appropriate;
derive the actual first deck row and wheel sole afterward. The reported
128-native/256-world deck must define collision and rider contact, rather than
stretching the art back to an older 224-world span. Processed and runtime contact
gates remain pending.

Rejected new nozzle/burner/winch cells may be replaced with historically approved
cycle52 fan, clockwork69 burner and loom96 winch sources at their native two-world-
unit scale. Historical source approval does not waive the new installation's
mounting, contact, ports, animation or gameplay-scale material-context review.

## Background raw source review

Far source `exec-9eda947f-ee30-412a-8637-c6661fd606b9.png`: **accept** at planned
768x512 native / 1536x1024 world. Small building/window/masonry clusters remain
purposefully structured at the two-source-pixel presentation density. Distant
tall architecture and service openings read at plausible human scale. Runtime
parallax, source-to-native stability, seam handling and grounding remain pending.

Middle source `exec-58bae65e-9d84-44d1-b490-68b273f4a49d.png`: **reject** at
planned 384x256 native / 768x512 world. Chain links, brick edges, fine rust/bevel
clusters and lamp/window bars would disappear at four source pixels per native
pixel. A separately specified 768x512-native human-scale wall spanning 1536x1024
world could be a plausible placement: its service door would be about 80 world
units beside a 72-unit adult Viking. That alternative is not automatically
accepted and must not silently enlarge near scenery to disguise bad density;
record intended placement first, retain original, then inspect its native and
actual gameplay evidence. Regenerate for 384-native if the original smaller
footprint is required.

## Processed native artifact review

Inspected `assets/freight109/machines-native-2x.png`, `inspector-native-2x.png`,
`cart-native-2x.png` and `registration.json` against accepted raw cell bodies.

- Accepted machines: **accept processed native artwork**. Receiver/plug/gate/
  pier planes and outlines survive; no lost defining features or detached noise.
  Register each actual exclusive material bottom (60/61 or53), not cell edge.
- Inspector: **accept processed native artwork**. Exterior amber/navy haze is
  gone while coherent material shading, helmet, muzzle and limbs remain opaque.
  Approximately33 native/66 world height fits an adult-sized mechanical guard.
  Support/swing leg poses read distinctly. Walk sole48 versus standing/action
  sole44 must use whole-pose translation; actual runtime contacts/motion pending.
- Cart: **pending**, visible magenta fringe persists on wheel rims. Remove only
  matte spill and re-review; material, 128-native deck and wheel sole96 otherwise
  remain coherent. No wheel rim repaint or caster housing rotation rescue.

These processed-art verdicts do not establish the full production in-game gate.

## Updated native and installation review

Corrected `cart-native-2x.png`: **accept processed artwork**; purple wheel fringe
is gone and stepped rim/material survives. Native far768 scene: **accept**,
purposeful city clusters retained. Native middle768 full-wall scene: **accept
source and processed artwork for the explicitly revised 1536-world placement**;
chain/brick/iron features survive and do not depend on discarded fine texture.
Actual service door is about136 world units (not earlier80 estimate), about1.9
adult Viking heights, plausible for a tall industrial service door. Confirm
the actual camera scene does not shrink heroes visually beside nearer objects.

Code audit flags for production evidence: rescue winch initially draws a fixed
legacy cell regardless of rescuePose; cutting only a connection without machine
stroke/rope state is insufficient. Receiver socket/pipe ports must derive from
the final bottom60/61 registration. Burner extraction currently uses a cropped
loom atlas region, rather than previously reported clockwork source: confirm
recognizable burner geometry and opaque mounting flange in gameplay. Inspector
diagnostics echo its declared floor, so measured source sole and rendered
material contact must still be inspected independently.

## Actual production progression review

Inspected initial1x/2x/portrait/landscape and later passenger-draft2x,
second-riser-powered2x, upper-inspector1x, high-exhaust-run1x and
cooled-departure2x under `output/freight109/captures/`. Starting masonry/fan is
grounded, depot architecture has credible adult scale, piers reach the lower
floor and raised-shield passenger soles meet its center walking plane. Filled
receiver clearly retains the same cell form. Final high runway and duct trace
explain the repeated cracked-masonry action. Purple chimney matte fringe in
these earlier captures blocks final runtime acceptance until corrected proof.

Further actual-state captures under `output/freight109-final/captures/`:
draft-rising2x, winch-unrolling2x, trolley-crossing2x, inspector-charge2x,
purging1x, shutter-retracting2x and crew-departure1x. Rider remains planted
through the rising draft; trolley soles/deck and tires/rail meet visibly.
Winch cut/spool and unfolding return ladder show local progression. Purge
steam, cracked rubble and retracting shutter preserve existing traveling flames.
Crew-departure reunites all three at the same physical exit. Also inspected
trolley-crossing-landscape, purging-portrait and inspector-charge-landscape:
active gameplay stays legible at coarse-control mobile sizes.

Inspector-charge currently has a dark muzzle similar to walking/idle; request
the authored illuminated muzzle key for warning, strongest key for fire and
neutral key for recovery. This is a remaining warning-readability correction,
alongside cleaned chimney-edge evidence. Avoid approving only the state flag.

Independently read route/death/touch records: normal production route won all
three HP3 in99.375 seconds with errors[], failure route actually killed exposed
Baleog (HP0) then reset, and touch record confirms coarse-pointer context with
real right movement, shield poses and look input. Unit fixture uses ordinary
step commands; no debug teleport is used as clearability proof. Final runtime
verdict remains pending the two visible corrections above.

## Final visual and cooperative verdicts

Inspected corrected chimney-edge captures in
`output/freight109-clean-upper/captures/inspector-charge-{2x,landscape}.png`.
Saturated magenta rim is gone; retained dark blue stepped silhouettes read as
intentional cool structure against sky. No further density/matte correction is
required from this evidence.

Inspected final authored enemy warning/fire/recovery in
`output/freight109-clean-upper2/captures/`:
`inspector-charge-2x.png`, `inspector-firing-2x.png`,
`inspector-recovered-2x.png`, `inspector-charge-landscape.png`, and
`inspector-firing-portrait.png`. Warning has a visible amber muzzle, firing
brightens it while an actual projectile leaves, recovery returns its mouth to
dark while the existing projectile travels. Registered soles remain seated
across the different source rows. Corrected middle outlines remain clean in
the same upper-camera evidence. Portrait2x naturally limits view and can put a
remote guard outside the active hero's camera; landscape and 1x give broader
planning visibility and the front shield remains an established interception
surface. This is not claimed as an all-enemies-visible camera mode.

Independent final verdicts:

- **Native-density/source: accepted** for selected V2 machines, inspector and
  cart body sources; far768 scene; revised middle768 human-scale full wall;
  previously approved reused machinery at its unchanged native scale. Rejected
  sources/cells are not normalized into the shipped runtime sheet.
- **Processed/in-game: accepted** after conservative exterior matte cleanup,
  actual registered contacts, authored warning phases and production1x/2x/mobile
  states. Passenger and trolley contact, supported piers, cell seating, winch
  transfer, purge/shutter continuity and reunited exit have been inspected.
- **Cooperative puzzle/progression: accepted**. Safe teaching vent → passenger
  draft → shielded inspector/trolley → inserted physical power cell → upper
  draft/recovery ladder → raised-shield high runway → taught masonry bash and
  duct purge → common exit is causal and clearable, with actual hazards and
  recovery. Full ordinary production route won allHP3; later targeted upper
  warning recheck reached its states allHP3 at63.0417 seconds with errors[].
- **Publication allowed after final build/release checks**. The reviewer has
  not certified physical-phone performance or every possible player strategy;
  coarse-pointer browser input and relevant failure/reset were exercised.

Retain the final screenshots and compact route/death/touch records under the
asset evidence directory before release; historical rejected captures may
remain separately as the correction audit trail.
