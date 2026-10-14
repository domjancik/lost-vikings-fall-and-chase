# Water114 swim and world resource feedback review

Reviewer scope: this record and asset gate metadata only; no implementation.
Apply native-sprite-art and VISUAL-REVIEW-GATE.

Contract: Erik swim for original procedural and latest corrected imagegen90 skins
only; all other skins retain established falling fallback. Generated whole swim
poses use80x80-native cells,36-native human density, two world units per native
pixel, horizontal core40,58 with normal frame origin40,48. No high-resolution
render rescue, per-cell resizing, fixed body graft or lost/doubled hands.

Before generation inspect native guide joint/limb identities, near/far occlusion,
stroke reach/catch/pull/recovery and alternating kicks. Raw artwork must retain
guide anatomy, full directional stroke and coherent helmet/beard/clothing volume
and palette at native gameplay density; registration is whole-frame translation.

Production review must show full8-phase cycle and loop/mirror at1x/2x/mobile for
imagegen90, plus procedural movement; underwater-floor movement continues
swimming rather than standing/walking, while dry ground/grounded air pocket walks.
Check transition into/out of water, side entry and anchor stability without
teleportation or clipping below basin floor.

World air and strength meters supplement the existing picker HUD. Inspect active
and inactive heroes, depletion/recovery and death/reset; authoritative values and
labels match the picker, readable above actual body poses without shrinking the
canvas, obscuring other indicators or spoiling puzzles. The world-layer meter
must attach to the visible hero location including horizontal swim orientation.

## Gates

- Guide anatomy: **accepted after fixed-length joint correction below**.
- Raw native-density/source: **accepted selected V2/V3 complete keys below**.
- Processed/in-game: **accepted**, final production proof below.
- Publication: **allowed after final package/build/release checks**.

## Native silhouette guide checkpoint

Inspected `swim-guide-native.png` and `swim-guide-enlarged.png` before generated
art. Horizontal adult length is approximately36 native pixels, core remains
stable, hands alternate forward pull/recovery with opposing kicks and modest
whole-body bob. No obvious duplicated hands are present in the silhouette.

Pre-generation anatomy gate remains **pending joint/limb overlay and loop**.
The partly occluded far arm above the helmet in keys2/6 needs actual shoulder/
elbow/wrist ownership and consistent segment lengths. A plausible sheet cannot
waive the repository's required skeleton/occlusion review; retain joint centers,
nominal lengths and near/far chain identities before sending the guide to image
generation. Source/native artwork acceptance will be separate afterward.

## Corrected guide pre-generation acceptance

Inspected corrected native/enlarged silhouettes, `swim-joints-overlay.png`,
`swim-joints.json`, retained `swim-guide-loop.gif` and `src/heroes/swim-motion.js`.
Ordered8 keys and colored near/far chains give forward catch→downward pull→rear
stroke→overhead recovery, with two identifiable hands and opposing kicks. Arms
retain10+10-native segment lengths and legs9+9; float joints use a fixed bend
branch with raster rounding only. Shoulder/core position follows modest1pixel
bob, keeping identity and loop anchors intact. Elbow/wrist chains beside/above
helmet retain connected limb ownership instead of detached hands.

**Accept guide anatomy as image-generation constraints**. The GIF's retained
loop and sheet ordering support the cycle; raw rendered anatomy must still be
compared against each exact guide key. This acceptance neither approves generated
material art nor waives actual procedural/generated gameplay pose review.

## Raw V1 rejection

Independently inspected `erik-swim-raw-v1.png` before preprocessing: **reject**.
Occupied body/forward-arm width is approximately330 source pixels versus the
guided roughly42-native-wide reach at this sheet's approximately5.54x scale.
Helmet/beard/torso expand and finely painted beard/fabric detail changes approved
density/material identity. Guide overhead recovery keys2/6 are lost; most arms
remain beneath chest instead of an identifiable complete8-phase stroke. Core
and helmet positions drift between cells. This attractive illustration cannot
be rescued by downsampling, per-cell registration or mixing fixed body parts.
Retain source/prompt as rejected history and regenerate from accepted geometry.

## V2 raw and intended-size review

Inspected `erik-swim-raw-v2.png` and intended native/4x review-only views.
Native-density/body material is substantially improved and plausible at target
density. The complete source gate remains **reject for anatomy/full stroke**:
key2's guided far wrist53,37 should be peach skin above/beside the helmet horn,
but is missing or replaced by white helmet material. Near hand pulls below the
chest, so only one clear hand exists in that recovery key. Key6 has a distinct
overhead peach hand; the opposite half-cycle therefore lacks matching anatomy.
Generated leg/body extent is broader than the guide and apparent core drift
requires uniform landmark comparison. Correct complete authored recovery
geometry and stable anchors; do not paste a fixed hand or resize individual
frames. No runtime normalization is approved from V2 yet.

Individual V2 keys0,1,3,4,5,6,7: **accept native-density/material source bodies**,
pending integer whole-frame anchor verification and actual gameplay palm
visibility. A separately generated complete key2 actor can replace the rejected
key without torso/hand grafts; review that original recovery source independently
before compiling a selected whole-frame family.

## Early procedural/world-meter checkpoint

Inspected procedural swimming desktop2x/mirrored mobile2x, supported pocket2x,
outside pocket2x and inactive air2x. Horizontal procedural stroke and mirror are
readable; supported dry pocket returns upright. Separated world air callouts
match picker values and read well after optical passes. However supported
pocket paired hero labels overlap into `AIRAIRs12s`: **reject world-meter layout**
until nearby callouts pack with stable separation and visible hero association.
Actual three-hero cluster, depletion/recovery/death/reset and strength proof
remain required. Air/strength are mutually exclusive authoritative resources
in current level mechanics; no invented simultaneous state is required.

## Selected V3 recovery-key source acceptance

Inspected original `erik-swim-raw-v3.png` and intended-size4x review. Complete
key2 now has a distinct peach recovery fist above/between helmet horns,
connected through its far sleeve behind the helmet, while the near hand pulls
below the torso. Material, occupied density and body identity remain coherent
with the selected V2 family. **Accept raw whole key2**.

Selected source gate: **accepted** for V2 complete keys0,1,3,4,5,6,7 and V3
complete key2. Normalize each retained accepted source once uniformly, compile
whole actors only and register by integer translation. Do not resize per-key
boxes, transplant body parts or process rejected V1/V2-key2. Native landmark,
loop/hand visibility and actual1x/2x/mobile checks remain the runtime gate.

## Processed artwork and strength feedback checkpoints

Inspected `erik-swim-4x.png` and `source-runtime-native.png`: **accept native
processing**. Complete key2 recovery hand survives, opaque material has no halo,
whole-frame density/palette remains coherent and helmet anchor is stable within
about one native pixel. Distinct pull/recovery and kick keys remain present;
actual loop/palms/wet-floor/dry-refuge behavior still requires production review.

Inspected `strength-evidence/` holding-desktop2x, critical-mobile1x,
death-desktop1x and reset-mobile2x, with errors[] receipt. **Accept strength world
feedback**: worldSTR13s matches picker while held; critical redSTR4s matches
picker; death removes the world meter; restart restoresSTR14s and healthy crew.
Labels read above Olaf after optical passes without shifting shield/body anchors.
Corrected clustered worldAIR packing and generated actual strokes remain pending.

## Final production swim and resource-layout acceptance

Inspected selected generated actual captures in `evidence-imagegen90/`:
swimming-desktop2x, swimming-mirrored-mobile2x, swimming-portrait1x,
outside-pocket-desktop1x, supported-pocket-desktop2x and initial1x. Whole
horizontal actor preserves head/beard/clothing identity, distinct limbs and
native density through actual water optics. Dry supported refuge changes back
to an upright body while movement outside remains a swimmer. Paired refuge
meters now pack into separate E/B-labeled callouts with thin leaders rather
than the rejected overlapping text.

Inspected actual coarse-touch generated `touch-evidence/` basin-floor2x,
stroke0/2/4/6 and three-crew-meters1x; procedural counterpart stroke3/5 and
basin-floor2x. Generated opposite recovery keys2/6 each retain a visible peach
hand beside/above helmet, distinct from the pulling palm. Contact/body roots
stay stable while limbs stroke, without fixed torso grafts or an oversized
different-density character. Procedural anatomy follows the approved chains.
Both skins remain horizontal swimmers at the wet basin floor, with no boots/
hands extending below it or standing/walking pose silently replacing swimming.

Touch harness and receipts use actual pointer-coarse touch controls, pause/zoom
and read-only dataset observation. Its invariant verifies non-ground swimmer
pose at the basin floor and true coarse-pointer context. All8 actual phase keys
are recorded for each target skin, with mirror evidence and errors[]. Six other
selectable skins are exercised in actual gameplay and retain `fall` fallback;
source dispatch independently inspected in hero-frames/sprite-render confirms
swim is restricted to Erik in procedural/imagegen90.

Packed three-hero meters remain readable at mobile1x and both desktop zooms,
with E/B/O identity and leader association; labels match the picker air values
and do not shrink the gameplay canvas. Earlier strength holding/critical/death/
reset proof also passed. Completed ordinary production routes independently read
as wonHP[3,3,3]: generated116.30 seconds and procedural117.0167 seconds. Final
poses, meter packing and floor/dry-pocket correction preserve clearability.

Final independent verdicts: **guide anatomy accepted**, **selected raw native-
density/source accepted**, **processed/in-game accepted**. No additional art,
control, floor or world-meter correction requested from the inspected evidence.
Publication allowed after final package/build/release checks. This targeted
review does not certify physical-phone frame rate or every unrelated level.
