# Independent review: Vikings78 anatomical guides

Reviewed 2026-10-12 against skills/native-sprite-art/SKILL.md,
VISUAL-REVIEW-GATE.md and HUMAN-SCALE.md. This review accepts an anatomical
guide deliverable only. It does not approve a replacement production skin.
Reviewer changed no generator or runtime files.

## Evidence and target

Read tools/guide-vikings77.py as the failed anatomical baseline, then
tools/guide-vikings78.py and VIKINGS78-GUIDE-SPEC.md. Independently inspected
all three final heroes' assets/vikings78/{hero}-guide-native.png,
{hero}-native-density-review.png and {hero}-frame-key.png; Erik and Olaf
joint-key.png sheets additionally establish the visible chains and shield
occlusion. Reviewed the Erik first18 experiment, corrected full32 packet,
full Baleog38/Olaf60 packets, and the corrected final Olaf52–55 poses.
These are native and enlarged atlas views, not actual gameplay captures.

Cells are64x64 native /128x128 world, one native pixel equals two world
units, origin(32,40), planted sole exclusive62 (last opaque row61).
Neutral body heights are36 Erik /38 Baleog /36 Olaf native pixels,
or72 /76 /72 world units. Native sheets are512x256,512x320,512x512 respectively.
Source is constructed directly on this native grid; 2x/4x sheets enlarge that
same art by nearest neighbor. There is no detailed painted source to reduce.

## Guide source density and anatomical geometry — ACCEPTED

Final guide silhouettes read as adult humans: a small head above a visible
neck and shoulder girdle, articulated chest/waist/pelvis, and substantial
leg length below the belt. Erik is lean, Baleog broader and taller, Olaf
wide through the ribcage. The flat guide palette is intentional semantic
anatomy/depth evidence, not finished costume shading. It remains readable
at actual native size and enlarges into deliberate pixel clusters.

The77 baseline used a common hip, fixed knee row and separately assigned
elbow points. Those produced changing segment lengths and awkward angles.
The78 side knees now bend forward through contact, passing and folded swing;
forearms bend from coherent shoulder/elbow chains. Rear-view knees fold
toward the ladder in depth rather than splaying sideways. Visible limbs
agree with their joint overlays; no detached joints or duplicate hands were
seen in the final guide sheets.

The first78 neutral stance was visibly too crouched. The revised idle raises
the pelvis and gives the knees a slight standing bend, with fixed planted
soles. Its chest/head breathing remains subtle. Walk phases distinguish
heel/flat/toe support and airborne passing/swing; bright near and dark far
legs exchange their foreground roles. Symmetric half-cycle silhouettes
can resemble each other, but their leg identities and depth tones visibly
exchange. The final material rendering must preserve that separation.

Look-up/down tilt the head about the neck and change the helmet/jaw direction,
rather than only moving an eye. Rear climb shows the back of the head and
alternates reaching hands and lifted legs. Rise/fall fold or extend the legs;
landing visibly compresses and returns to standing. Erik's bash shows body
anticipation/forward lean/recovery. Baleog's sword follows the wrist through
its arc; the bow hand/draw hand remain attached to their respective arms.

Olaf's shield stays14x24 native /28x48 world, with raised center(32,22),
underside29 and rider plane22. Front shield bottom meets the same sole62
reference as the planted boots. Shield transition frames turn the plate
without changing its physical size; the opaque face covers its gripping
palm. Raised poses duck the neck/helmet below the unchanged shield and keep
support palms at its underside. Back-strapped rear-climb shield legitimately
occludes some hips/legs; its joint overlay resolves those chains.

The initial overhead-climb52–55 had both hands held under the shield and no
ladder hand. Final poses correct this:52/53 retain near-hand shield support
with far-hand ladder reach;54/55 exchange the roles. The visibly lower
ladder hand is distinct from the palm seated at the shield underside.

Independently measured all four limb chains in all130 JSON poses. Maximum
XYZ segment-length discrepancy is below4e-14 native pixels. Also checked
the recorded arm contacts for52–55: each has exactly one ladder grip and
one underside support. These corroborate the visibly natural final poses;
bone measurements alone would not have accepted the earlier crouched idle
or the two-hand overhead-climb error.

## Finished art / processed / actual-game runtime — NOT ASSESSABLE; NOT APPROVED

No new imagegen material result, production processing or game wiring exists
for this packet. Atlas1x/2x and labeled keys cannot establish the actual
gameplay visual gate. These guides may be used as the anatomical authority
for a subsequent rendering trial, preserving their native density and anchors.

Further review must inspect the raw material source beside these guides,
source-to-processed comparison, actual gameplay1x/2x/mobile, mirrors, planted
soles against real floors, vertical ladder travel/stopped/reversed grips,
continuous shield hand transfer, shield transitions and real passenger soles.
Four climb keys establish anatomical endpoint roles, not seamless rung or
support transfer timing. The guide's local floor/rung references are not
production contacts. Architecture-relative adult scale also requires real
scene evidence. No final skin publication is authorized by this guide review.
