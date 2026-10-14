# Vikings90 independent movement review

Final status,14October: the selected whole-pose Imagegen implementation passed
separate source/native and processed/gameplay gates for all three heroes.
See [the final cycle verdicts](VIKINGS90-CYCLE-REVIEW.md) and
[verification evidence](VIKINGS90-VERIFICATION.md). The rejected deformation
experiments below remain as historical records; they are not the published skin.

Reviewer scope: guide anatomy/motion before image generation, then retained raw
render, processed native output and actual gameplay. Implementation and asset
authoring belong to the lead. Applied skills/native-sprite-art/SKILL.md and
VISUAL-REVIEW-GATE.md. This record preserves the earlier88 contact approval;
the user's new motion critique exposes shortcomings that contact screenshots
and distinct frame counts did not resolve.

## Baseline findings — correction required

Inspected tools/native-vikings85-gaits.py, its guide81/78 rig dependencies,
tools/native-vikings86.py, assets/vikings86-native/anatomy-contactboard-4x.png,
the retained88 raw full atlases (Erik/Baleog v1 and Olaf v3), and
output/imagegen88/guide-render-gait-2x.png plus review-actual-gait-all24.png.

The85/86 guide has separate limb identities and an eight-position foot route,
but its visible projection does not reliably communicate the intended
front-three-quarter body. The86 pose moves the near shoulder/hip chains toward
screen-right and far chains left while the render remains fixed far then near.
Both legs are drawn before the torso; boots are subsequently repainted far then
near. The apparent nearer side and the chest/face orientation therefore need
explicit reconciliation. A viewArt label does not establish the actual camera
orientation. Rear-looking shoulder/back silhouettes can accompany a rightward
face even when joint lengths and z metadata are numerically consistent.

The88 raw first rows visibly depart from those guide identities. Erik has
folded and extended poses, but the dominant visible trouser/boot silhouette
does not consistently exchange through a full front-to-back stride. Baleog's
generated chest is more convincingly front-three-quarter than the guide, yet
his feet cycle through short, similar under-body positions with uncertain
identity. Olaf's broad belly and shield further conceal a compressed foot
cycle. The rendered row cannot be accepted merely because all eight cells
differ or the boots are grounded. Missing rear travel and confused overlap
already exist in the originals; alpha cleanup or atlas registration cannot
invent the missing anatomical poses.

The user reports accumulating horizontal body displacement followed by a loop
reset. The same-size rows show changing core placement and lean, but a still
montage alone does not quantify a complete loop's root excursion. This is a
required motion blocker to verify in looping evidence, rather than an invented
numeric measurement. Current88 registration uses a shared idle silhouette center
for horizontal anchoring, not a tracked anatomical pelvis/core per walk frame.
Correcting the cycle requires separating intentional body response from raw
frame composition drift without aligning each changing boot or alpha box.

**Existing85/86 guide front-three-quarter motion suitability: FAILED for this
new correction scope. Existing88 full-stride/limb-continuity gate: FAILED.**
Earlier contact acceptance and the human-approved88 material direction remain
preserved; these findings do not ask for a subjective style reset.

## Acceptance criteria for corrected guides

- Establish a single right-facing front-three-quarter camera convention. Show
  visible chest, oblique pelvis and face in agreement, with anatomically tracked
  near/far shoulders, hips, knees, ankles and hands. Provide a colored identity
  overlay alongside the opaque silhouette. Occlusion must follow the projected
  geometry and depth; arbitrary phase-based layer swaps are not a substitute.
- Each leg must traverse forward contact, loaded compression, stance passing,
  rear extension/push-off, folded recovery, swing passing and forward extension.
  Four phases later the opposite anatomical leg must perform the corresponding
  role. Show both legs' complete routes even where the final shield/body partly
  occludes them. Preserve adult proportions, segment lengths and bend direction.
- Maintain Erik's purposeful run, Baleog's weighted stride and Olaf's broad,
  stout mass. Torso counter-rotation and arms must respond to the feet rather
  than hold a frozen torso above swapped leg patches. Olaf's shield grip and
  physical diameter/rider plane remain stable through body motion.
- A planted stance foot moves backward relative to the actor at the travel
  rate; swing clears the ground and advances. Do not equate arbitrary time
  advancement or more frame IDs with a convincing spatial gait.
- Present at least three consecutive loops at native size and integer nearest
  enlargement, right and mirrored left, with fixed root/pelvis markers. Include
  phase7→0 and3→4 joins. Core/head motion must be cyclic, not accumulate then
  snap; avoid a five-native-pixel core excursion. Distinguish intended modest
  bob/lean from a registration error using annotated landmark trajectories.

## Render and runtime evidence required

Approve guide motion before sending it to image generation. Retain original
renders and exact prompts. Compare each new raw walk row to the accepted guide
at the intended size; follow anatomical identities through all eight phases.
Do not paste fixed torso rows onto new legs, stretch frame alpha bounds, rescue
over-detailed art through repeated downsampling, or silently broaden the prior
material exception into a new density claim.

Record intended body heights36/38/36native at2world units per native pixel,
storage cell/padding, origin and registration landmarks before the art pass.
Any carried equipment requires its own unchanged contact contract. Compare
original and processed silhouettes, outlines and alpha, including extremes.

Actual gameplay must isolate each moving hero away from the parked group at
1x/2x and mobile; capture meaningful phase families and at least three loops,
with normal movement distance, reverse, start and stop. The camera/world actor
coordinates must distinguish player travel from sprite-root drift. Check soles
against floor, unsupported swing boots, mirror direction, idle transition and
Olaf raised-walk rider/grip contacts. Existing action/rear/float kits require
regression contact evidence if changed by the new projection or registration.

**Corrected guide gate: PENDING new evidence.**
**New raw native-density/source gate: PENDING new evidence.**
**Processed art / actual1x2xmobile runtime gate: PENDING new evidence.**
No new90asset publication is approved by this baseline review.

## Corrected90 procedural guide review — ACCEPTED as motion constraints

Inspected tools/guide-vikings90.py, all three guide-native/guide-2x sheets,
colored joints-4x sheets, and recorded walk joints in each guide.json. The
front-view attachment correction now places the camera-near arm/hip on the
visible left side and camera-far chain on the right. Face, exposed chest and
oblique waist read together as front-three-quarter. Olaf's front disc belongs
to the far/right grip; the visible near arm remains anatomically connected.
The corrected projection is a whole-chain translation, not a bitmap limb/body
splice or segment stretching.

Tracked yellow near and blue far chains show backward stance, knee folding,
passing and forward recovery with identities intact. Walking feet cover their
complete route relative to their own separated hip attachments; a far/right
attachment naturally has a different absolute screen-x range from near/left.
Erik's ankle-x ranges are24.9..36.5near and29.0..40.6far; Baleog24.1..33.2near
and30.9..40.0far; Olaf23.8..32.9near and31.2..40.3far (unprojected guide units).
This is materially more informative than accepting eight different hashes.
The generated render must retain the complete route rather than compress it
back under the belly or turn alternate poses into the same dominant leg.

Walk pelvisx32 is fixed in all eight phases for every hero. Erik's neckx range
35.6..36.2 is a cyclic0.6guide-unit response; Baleog/Olaf neckx33 is fixed.
Phase7 returns toward0 without an accumulating anatomical core translation.
The authored GIF sequences repeat the same eight-phase cycle three times with
a fixed root line, rather than rebasing each loop. This establishes the guide
constraint; it cannot establish that imagegen or later packing will preserve it.

Rear ladder joint rows preserve alternating arm reaches and knee/foot motion,
rear steel heads, and Olaf's stowed disc. Raised rear grips transfer between
supporting palm and ladder reach without moving the fixed disc. Raised walk
shows a connected underside grip and helmet clearance. Native silhouettes and
colored chains are coherent enough to approve this guide packet for the next
imagegen material pass. This approval is guide anatomy/contact only; procedural
guide materials are not approved as final character art.

### Added climbing material-continuity requirement

Each anatomical limb must retain its costume base color and garment identity
through all four climb phases, reversal and a stopped grip. Near/far lighting
may consistently describe depth; it must not exchange blue/brown trousers,
boot colors, sleeves or armor between left/right anatomical limbs as poses
change. Review the original rendered four-phase climb row with identity labels
and actual stopped/reversed gameplay, not just a palette count. Register the
helmet/core independently of moving boots; raised rear/float registers to the
fixed disc/palm contract. Any material identity swap is a source failure.

**Corrected90 guide anatomy/motion/contact gate: ACCEPTED for imagegen input.**
**New raw rendered native-density/source gate: PENDING.**
**Processed art / actual1x2xmobile runtime gate: PENDING.**
Mirrored actual movement, material consistency and multiple rendered loop joins
remain mandatory later evidence. No final character replacement or publication
is approved by guide acceptance alone.

## First generated candidates — raw source FAILED

Inspected assets/vikings90/{erik,baleog,olaf}-raw-v1.png originals. These retain
attractive approved material direction but do not preserve the required pose
constraints. All three first walk rows under-follow the full anatomical stride;
the dominant under-body boot shapes recur instead of establishing an unambiguous
opposite-leg exchange. Source composition/pose differences must not be confused
with a successful walk because all cells have different pixels.

Erik's rear ladder row paints a large orange beard-shaped mass across the back
under the steel helmet. Baleog's rear row repeatedly raises the same right arm
and leaves the other low, instead of preserving four alternating authored grips.
Olaf has a painted brown background and repeated compressed front/held steps;
his rear rows also retain a beard-colored patch below the rear helmet. These
are original render failures, not atlas cleanup defects. Removing the backdrop,
flipping repeated limbs or reassembling torso/leg fragments would not establish
source pose fidelity. No processing or runtime acceptance is granted to v1.

**V1 raw rendered source gate: FAILED for Erik, Baleog and Olaf.**
Native-density approval is not inferred from the attractive material appearance;
the prior human material-direction exception does not waive missing motion,
rear anatomy or transparent-background requirements. Processed/runtime gates
for these candidates remain NOT ASSESSABLE because they are not approved/wired.

## Tightened whole-root stride guide — ACCEPTED for v2 input

Re-inspected regenerated joints-4x sheets, Olaf guide-2x, current generator and
guide.json walk chains after the foot-route correction. The previous separated
hip-centered routes were valid local limb paths but were too permissive as a
full-body stride constraint. This revision supersedes that part of the first
guide approval: both anatomical feet now cross the body rootx32.

Erik's near and far ankle routes each span27.8..39.4guide units, four phases
apart. Baleog/Olaf each span27.5..36.6, including front contact, under-body
passing, rear push-off and airborne return. Camera-near hip31.2 and camera-far
hip32.8 retain an oblique pelvis without shifting entire foot loops to opposite
sides of the body. The colored chains and opaque silhouettes show the intended
full forward/back exchange more clearly. The original roll and lift are retained;
fixed-length IK solves the revised reach rather than stretching the shins.

Independently read compression metadata: maximum added guide compression is
0.968Erik,0.059Baleog,0.002Olaf, below the stated1.4native budget after projection.
Pelvisx remains32 and the modest body response is periodic. Raised Olaf grips
are re-solved to the unchanged disc rather than lowering its rider plane with
the body. Ordinary/raised rear guides retain the alternating reach constraints
that the v1 rendered rows failed to honor.

**Tightened guide motion/anatomy/contact gate: ACCEPTED for v2 imagegen input.**
Use the guide as the sole pose reference and a separate single-cell material
reference to reduce contamination by the old88 motion. This is a workflow
choice, not proof that the next generation will obey the poses. Inspect v2 raw
limb identity, all eight strides, all four rear reaches/materials, background
alpha, stable core and loop joins before any native packing/runtime approval.

## Second generated candidates — raw source FAILED

Inspected all three assets/vikings90/*-raw-v2.png originals against the tightened
guide. Reducing the material reference to one cell has not established pose
fidelity. Erik retains the orange beard mass under the rear helmet and holds
both hands high throughout the ladder row instead of exchanging the authored
upper/lower reaches. Baleog repeats the raised right-side arm arrangement; his
walk row recurs through similar dominant leg shapes at0/4 and2/6 without an
unambiguous complete opposite-leg route. Olaf again paints a brown backdrop,
repeats compressed steps and paints a yellow beard-like patch on the rear head.
His raised/rear rows do not reliably preserve the alternate ladder/support
roles. Material identity alone cannot compensate for these original defects.

**V2 raw rendered source gate: FAILED for all three heroes.**
**V2 processed/native and actual runtime gates: NOT ASSESSABLE / not approved.**
No backdrop extraction, per-frame fit, recoloring or bitmap reassembly can waive
the source motion failures. Native-density quality remains a separate contract
with the previously recorded human material-direction exception; this review
does not certify finer painted originals as deliberate integer-native sources.

## Recommended next experiment

Prefer individually guided whole-character key generations before another full
atlas request. First prove a small pilot for one hero: contact0 versus opposite
contact4, and rear reach0 versus opposite reach2. Each call should receive only
its exact single pose and the same single-cell character/material reference,
with transparent output and preserved head/core/body dimensions. The pair must
visibly exchange anatomical roles rather than repeat a generic running pose;
rear pairs must alternate actual reaching hands and have no chin beard on back.
Inspect raw keys at the intended size, with the original guide overlay and
identity colors available as diagnostics. Add a passing/swing stress key if the
first pairs work. Only then expand to eight walk/four rear keys per hero and
Olaf's raised variants. Separate calls risk costume/scale drift, so acceptance
still requires one shared scale and anatomical landmark registration, plus
continuous three-loop playback; individually attractive keys are insufficient.

A material rig driven by the accepted skeleton is a possible subsequent path,
but it is not a shortcut approval. It must deform/re-render the entire actor:
pelvis, torso, shoulder masses, head/neck, arms, legs, articulated feet, beard
and equipment; retain depth identities and supply newly exposed surfaces.
Binding colored material volumes or properly authored surfaces to those parts
is substantively different from holding a fixed body bitmap above replacement
legs. Simply stretching/rotating a finished imagegen pose can freeze lighting,
tear joints, reveal missing hidden surfaces and change apparent density. Such a
candidate would need fresh raw/material provenance, native deformation quality
and actual-game gates. Preserve the existing Imagegen character identity;
neither failed atlas attempts nor clean rig metrics justify an unsolicited
procedural style replacement.

The individual-key pilot is the smaller reviewable next step. No implementation
or publication is approved by this recommendation alone.

## Alpha clarification

The previous description of Olaf's v2 brown backdrop as opaque was too broad.
Direct PNG inspection finds cornerRGBA(34,27,15,0),24.520%pixels alpha>128 and
7.198%pixels alpha1..128. The brown RGB backdrop contains transparency and
diffuse partial alpha rather than being wholly opaque. Its incorrect diffuse
alpha/fringe still requires inspection/correction, but the verdict should not
rest on a false claim of a fully opaque canvas. Pose and rear-anatomy failures
independently retain the v2 rejection.

## Four single-pose Erik keys — pilot FAILED

Inspected erik-{walk-0,walk-4,climb-0,climb-2}-raw-v3.png individually beside
their exact *-guide.png references. The opposite walk keys again retain the
same dominant forward/right planted boot and rear folded boot. They alter arm
hold and silhouette size without preserving the guide's opposite anatomical
leg roles. This is the precise constraint the pilot was intended to prove.

All four originals are1254square. Broad subject bounds at alpha>128 have
heights781walk0,607walk4,744climb0 and675climb2raw pixels. These are substantial
independent composition/scale differences, not normal fixed-scale torso bob.
The coarse-looking walk0 internal blocks are approximately16source pixels;
its781pixel subject therefore reads about49block rows, rather than the required
36deliberate native-height rows. Block sizes and density are not sufficiently
uniform across the pilot to approve the raw native36contract. Fine edge/alpha
residue also remains visible. A single shared scale would expose the size drift;
per-key alpha-box fitting would disguise it and is not approved.

Rear climb0 is improved: back leather/steel replaces the large front beard.
Climb2 raises the opposite arm but invents an orange beard/hair-shaped mass
on the upper back. Thus even the improved reach pair does not retain consistent
rear character anatomy/materials. It cannot be assembled into an approved row.

**Individual v3 pilot raw/source motion and consistency gate: FAILED.**
**Raw native-density gate: FAILED; historical material exception is preserved
separately, not relabeled as native36source approval.**
**Processed/runtime gate: NOT ASSESSABLE / no approved integration.**

## Constrained articulated-material prototype recommended

Do not expand the failed independent-pose experiment to the full kit. The next
reviewable candidate is one hero's complete eight-phase walk driven by the
accepted90 skeleton, with Imagegen character materials assigned to persistent
anatomical surfaces. It must be a whole articulated actor rather than a fixed
upper-body strip and separately replaced gait legs. Include pelvis/chest
rotation and compression, shoulder volumes, arm chains, neck/head response,
beard motion and the entire hip/knee/ankle/foot route; choose layer depth from
the authored view and preserve left/right garment ownership across frames.

Define a rest mesh or equivalent material regions with named bone/surface
ownership. Material mapping follows those regions through deformation, not
arbitrary frame crops. Joint caps, occlusion masks and newly exposed rear/inner
surfaces must be explicitly supplied; missing art must not stretch across
elbows, invent a back beard or reveal holes. The source original, masks, binding,
shared scale and output generation must be reproducible and retained. Existing
approved character material may inform the prototype; any newly generated
surface still needs its own source provenance/density review. Do not repeatedly
resize processed frames or change world scale to hide source density problems.

Rasterize each entire posed actor at the intended display density and inspect
the result for stretched pixel clusters, rotated jagged outlines, texture
sliding, frozen highlights, joint tears and abrupt layer changes. A rig solving
all joints does not establish art quality. First deliver native0..7, colored
binding diagnostics, matching guide overlay and three consecutive loops with
fixed core/root markers, plus opposite rear0/2 if rear surfaces are involved.
Only after that prototype passes should the other heroes/complete poses and
actual1x2xmobile contacts be expanded. Preserve the current approved Imagegen
identity and mass; this recommendation does not authorize a flat guide-style
fallback or final publication.

## Erik whole-actor material-rig prototype — motion useful; art fidelity FAILED

Inspected tools/rig-vikings90.py, erik-walk-4-raw-v4.png, its source-native view,
and erik-material-rig-native/4x sheets including eight walk/four rear poses.
The prototype genuinely rebinds torso, bone chains, articulated feet, head and
beard; it does not hold a fixed torso row over independently pasted gait legs.
Guide-driven foot exchange and alternating rear reaches are substantially more
deterministic than the preceding generated atlas/pilot. The rear chin beard
contamination is prevented. These are useful motion/provenance improvements.

V4 raw art also has visibly coarser, deliberate clusters around20source pixels
per logical pixel, much closer to the64canvas/36body contract than the v3pilot.
Treat this as a promising material source, not proof that the rig retains it.
Its exact-pose appearance still cannot be used as an anatomical motion authority;
the accepted guide must control that motion.

The output does not preserve the Imagegen character's sculpted material/shape
quality. It reads as the narrow86 guide silhouette recolored rusty orange:
thin legs/boots, weak shoulder and torso mass, poorly separated leather/skin
regions and a nearly flat rear jacket. It is too close to the procedural guides
to meet the requested final Imagegen character direction. Clean alpha and correct
limb ownership do not waive that visible result.

The cause is concrete in the implementation: draw_part constructs the entire
target silhouette from guide masks. Source sampling only colors those masks;
when the source material classification does not match, and throughout rear
surfaces, the code substitutes palette colors according to guide luminance.
Named palette rectangles are not source-derived material surfaces. They cannot
preserve the source shoulder/boot/beard contour or generate sculpted rear detail.
Anatomical UV binding is useful but is currently applied to guide-shaped masks
with many palette substitutions, rather than to faithful Imagegen surfaces.

**Deterministic whole-body motion prototype: viable for further iteration.**
**Processed material/character-shape fidelity gate: FAILED.**
**Final raw-source/native approval: PENDING retained-source comparison after
faithful surface binding. Actual runtime gate: NOT ASSESSABLE / not integrated.**
Do not expand this appearance to all heroes or ship it as a final fallback.

Required next correction:

- Define explicit source-derived contours/masks for leather torso, shoulder
  masses, skin, steel helmet, horns, beard, trousers and boots. Register their
  anatomical source landmarks against the actual painted source, rather than
  assuming imagegen's pixels lie exactly on the guide skeleton. Maintain
  character volume through deformation; source-shaped joint caps must cover
  newly exposed elbow/knee/hip surfaces without arbitrarily thinning the limbs.
- Show a same-size source versus reconstructed binding/rest-pose comparison.
  It must preserve the source's recognizable mass, helmet/beard silhouette,
  sculpted shoulder volume, belt and rounded boots before animation is reviewed.
  A material rig that already loses those features in its reference pose fails
  even if all later skeleton poses are correct.
- Supply deliberate rear/inner material surfaces with the same Imagegen
  character identity; a palette-filled rear rectangle is insufficient. Keep
  garment/steel/skin boundaries attached to named surfaces and inspect elbows,
  shoulders and boot cuffs for color leakage, flat fill and texture tearing.
- Retain native density and source provenance while correcting geometry. Do
  not solve mass loss by increasing world scale or using finer texture detail.
  Repeat the full8phase/fourrear native sheets and loops after the rest-pose
  fidelity test passes, then proceed to actual1x2xmobile evidence.
