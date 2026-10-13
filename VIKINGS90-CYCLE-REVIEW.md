# Vikings90 full-cycle independent critique

Reviewer: cycle review subagent. Applied `skills/native-sprite-art/SKILL.md`,
`VISUAL-REVIEW-GATE.md`, `VIKINGS90-SPEC.md` and the retained earlier review.
Scope is visual critique; no implementation or asset edits made.

## Evidence inspected

- All eight `assets/vikings90/erik-walk-{0..7}-raw-v4.png` original sources.
- `erik-joints-4x.png`, `erik-source-native-comparison.png`,
  `erik-replacement-4x.png` and `erik-registration.json`.
- `erik-climb-{0,2}-raw-v4.png`, rejected V4 rear1/3 and replacement
  `erik-climb-{1,3}-raw-v5.png`; updated native comparison/replacement sheet.
- `tools/pack-vikings90.py` and registered walk/climb GIF construction.

Native contract: each retained source1254square describes a64square logical
cell, runtime padding80square, one native pixel2world units; Erik standing
horn-inclusive target36native pixels. The sources use deliberate roughly
20source-pixel clusters, including readable steel, leather, trouser and boot
regions. They are materially different from the earlier fine-painted rejected
pilot. A shared1254/64 sampling scale is used for every cell, followed only by
integer whole-actor steel-dome registration and binary alpha cleanup.

## Eight-frame Erik walk

**Raw native-density/source gate: ACCEPTED for Erik V4 walk0..7.**

The light near trouser chain visibly reaches forward at0, trails rearward at2,
folds behind at4 and returns forward at6. The darker far chain has the opposite
route: forward planted contact at4 and rearward travel at6. Thus similar outer
boot silhouettes at0/4 do not establish a duplicate pose: their anatomical
owners genuinely exchange. Phases1/5 show passing/compression and3/7 recovery.
The connected leather shoulder/chest, horned helmet and long red beard retain
Imagegen character mass rather than substituting the flat procedural guide.
Skin/leather/steel/trouser/boot material assignments remain readable; no extra
hands or body/leg splice appears in the inspected sources.

**Processed native fidelity subgate: ACCEPTED for the eight walk cells.**

The same-size original/processed comparisons retain their contours, identity,
clusters and meaningful phases. Binary alpha removes the raw thin residue
without a connected halo or lost limb. Registration tracks the actual upper
steel dome rather than trousers or changing moving boots. Recorded whole-actor
translations are -2..0native x and0..1native y; the authored helmet target x
ranges35.5..37native, with the actual rounded registration within half a pixel.
This is cyclic modest response, not the previous accumulating several-pixel
core excursion. The explicit phase7→0 cells retain a coherent root position.

**Loop playback evidence: CORRECTION REQUIRED before acceptance.**

The GIF writer currently appends `seq[1:]*3+seq[:1]`: its frame order is
0,1..7,1..7,1..7,0. It skips phase0 at the intermediate loop joins. This can
produce a false speed/pose jump and cannot establish three complete cycles.
Use `(seq*3)[1:]` after the first frame and verify the resulting0..7 repetitions.
The defect affects the diagnostic GIF, not the correctly ordered atlas cells.

## Four-frame Erik rear climb

V5 rear1/3 successfully remove the rejected orange beard patch from the back.
They retain steel rear helmet, visible nape, leather jacket and deliberate
native clusters. V4 rear0/2 visibly alternate the elevated left/right reach;
V5 intermediates connect those reaches without invented extra hands.

**Rear source material-continuity gate: FAILED, correction required at phase2.**

Phase0 has a dark screen-left trouser leg and a strongly highlighted light
screen-right leg. V5 phases1/3 retain that ownership. V4 phase2 exchanges it:
screen-left becomes the light trouser and screen-right becomes dark. The rear
view does not rotate the body enough to justify exchanging anatomical garment
shading. At native size this is the conspicuous alternating limb-color pop
reported by the user. Preserve the same material/value family on each
anatomical rear left/right leg across0..3; subtle local shading may follow the
bend, but it must not swap the light/dark ownership. Correct the original
phase2 render, not an arbitrary atlas recolor or limb-fragment replacement.

V4 rear0 and V5 rear1/3 individually have acceptable native-density and
rear-anatomy quality. The complete rear row is not accepted until the phase2
material correction is reviewed at source/native size and in complete loops.

## Publication status

**Actual production1x/2x/mobile runtime gate: PENDING / not integrated.**

Neither the accepted walk sources nor individual rear keys authorize final
publication. Correct the GIF loop and rear phase2 material ownership, then
review the complete cycles. Actual movement must show Erik separated from the
parked group, both mirrored directions, start/stop and three real walk loops;
rear climb must show stopped/reversed grips with stable material ownership.
The other heroes and Olaf shield/rider states require their own full-cycle
and runtime evidence; Erik approval does not transfer to them.

## Corrected rear phase2 and complete loop sequence — re-review

Inspected the retained `erik-climb-2-raw-v6.png`, updated selection manifest,
same-size original/native comparison and native4x replacement sheet. The
corrected original preserves the opposite high right-hand reach and lifted
right knee from V4. It retains dark slate screen-left trousers and lighter
slate screen-right trousers, consistent with accepted rear0 and V5 rear1/3.
The previous material ownership exchange is removed without changing the
opposite reach into a duplicate intermediate pose. Rear steel, exposed nape,
leather back and skin remain coherent; no orange rear beard or extra hands.

**Complete selected Erik rear0..3 raw native-density/source gate: ACCEPTED.**
Selection: phase0V4, phase1V5, phase2V6, phase3V5. All are whole-pose sources;
the V6 source color edit does not authorize reassembling body/limb fragments.

**Complete selected rear processed native fidelity subgate: ACCEPTED.**
Whole-actor steel-core registration and a shared native sampling scale preserve
the reviewed limb reaches, costumes, silhouettes and readable pixel clusters.
The same-size source/native row does not introduce the old highlight exchange,
connected halo or false front-facing beard.

Rechecked the corrected GIF writer `(seq*3)[1:]` and decoded actual GIF frames.
Walk has24frames in exact0..7 three-time order; climb has12frames in exact0..3
three-time order. All repeated phase images hash identically across cycles.
The earlier skipped-contact diagnostic defect is resolved. Read the complete
sequence together with the native strip and core landmarks; cyclic head/body
response remains modest and there is no accumulating root drift at7→0.

**Selected Erik full walk/climb source and native gates: ACCEPTED for local
production integration and subsequent gameplay review.**
**Actual production1x/2x/mobile runtime gate: still PENDING.**
This does not approve publication or the other heroes. Gameplay evidence must
establish actual movement cadence, both directions, stops/reversals, ground and
ladder contacts, mobile readability and transition back to unchanged idle.

## Baleog / Olaf three-key V4 pilot review

Inspected retained `{baleog,olaf}-{walk-0,walk-4,climb-0}-raw-v4.png` sources
alongside each exact pose guide. Also inspected same-scale64native samples in
`output/vikings90-review/baleog-olaf-pilot-native4x.png`. All originals are1254
square with deliberate roughly20source-pixel clusters; density is suitable
for64logical cells and target38Baleog/36Olaf native heights. Density acceptance
does not waive the following original anatomy and costume defects.

**Baleog walk0/4 limited source gate: ACCEPTED.** The light near trouser leg
is forward at0 and rear at4, with the opposite dark far leg role. Both boots,
two connected arms, armor, beard and steel retain a consistent identity and
native contour. Full8phase progression, common core registration, complete
climb and runtime evidence remain pending; this pair cannot approve a cycle.

**Baleog climb0 source anatomy gate: FAILED.** The upper back contains four
overlapping round steel masses: two central discs below the neck and additional
outer shoulder discs. At native size this reads as duplicate shoulders/arm
segments, rather than two shoulders attached to one coherent armored torso.
The bent left reach and right hand can be found, but their anatomical chains
are visually obscured by the extra armor volumes. Render exactly two shoulder
pauldrons attached to one connected backplate; the plate must not split into
another pair of round shoulder-like masses. Preserve the guide reaches and
stowed sword/bow without introducing extra limb silhouettes.

**Olaf walk0/4 costume continuity gate: FAILED.** Walk0 exposes a tan belly
below the beard across the body center; the same surface becomes green fabric
at4. A prominent slate-gray trouser thigh patch also exchanges sides, contradicting
the retained brown-trouser costume. This is a garment/material replacement,
not subtle light following a bent leg. Fix the source material assignments and
ensure the pose guide's diagnostic highlight does not become gray trousers.
Use the same belly coverage, green tunic and brown pants in both contacts and
all future poses. Do not expand this conflicting pilot into a complete sheet.

The front shield retains the round disc in oblique17×24native projection and
occludes its gripping palm; the visible free arm remains a separate connected
limb. Its front hold is promising, but it does not waive costume continuity.

**Olaf climb0 shield/contact gate: FAILED.** The back disc is visibly shortened
and squashed compared with the24native physical diameter and its front views.
Its width/height ratio reads as a small horizontal oval rather than the same
round shield stowed on his back. Preserve the full physical24native disc with
the guide's tilt/attachment, two reaching arms and the retained broad body.
The native sample reproduces this original distortion; packing cannot repair
it by changing whole-character world scale or fitting the shield separately.

**Baleog/Olaf raw density subgate: ACCEPTED for these six individual sources.**
**Complete pilot/source motion gate: FAILED for Baleog rear and Olaf costume/
rear shield. Processed production and actual1x/2x/mobile gates: PENDING.**
Correct and independently review the failed whole keys before expanding them;
the accepted Baleog walk pair may inform its remaining walk poses.

## Guide material/armor clarification and actual Erik ladder captures

Inspected the updated `olaf-guide-2x.png`: brown highlights now remain brown
through ordinary/raised gait and rear leg poses. The geometry and contacts
are retained. **Olaf corrected guide trouser-material constraint: ACCEPTED.**
This does not accept the previously generated slate/green inconsistent sources.

Re-inspected `baleog-climb-0-guide.png` alongside `native-vikings86.py` torso/
limb drawing and the underlying guide renderer. The actual rig has only two
shoulder chains. Its two pauldron caps are joint-mounted; repeated far-arm
painting uses the same coordinates and is an occlusion pass, not extra joints.
However the guide's rounded torso volume and bright center patches below the
helmet read as another rounded steel mass between the shoulder caps. Imagegen
has amplified this ambiguity into the rejected four-disc source. The guide
therefore needs a visual clarification before rear regeneration: one broad
connected backplate with a restrained reflection, and exactly two distinct
outer shoulder caps. Preserve the skeleton, alternating grips and segment
lengths; inspect an updated colored joint overlay to trace those two arms.
**Baleog rear guide armor-readability constraint: CORRECTION REQUIRED.**

Inspected actual production screenshots
`output/playwright/vikings90/imagegen90-0-actual-ladder-phase-{0..3}.png`.
All are visible2x game captures with Erik separated from the other heroes.
They show rear-facing steel helmet, leather back, alternated upper reaches and
raised knees. Dark screen-left and lighter screen-right slate trousers retain
ownership through the four poses; arm skin/leather does not exchange garment
colors. The corrected phase2 no longer creates the pronounced trouser color
pop. There is no rear beard mass or connected halo.

**Erik actual2x ladder clothing/rear-readability limited gate: ACCEPTED.**
These stopped screenshots alone do not approve cadence, three walk loops,
reverse climbing,1x/mobile or transitions to unchanged poses. Full production
runtime gate remains PENDING those affected contexts.

## Updated Baleog rear guide — accepted for regeneration

Rechecked the latest `baleog-climb-0-guide.png`, `baleog-joints-4x.png` and
guide90's new rear-only torso function. The rounded front chest volumes have
been replaced by one broad continuous backplate with a restrained reflection.
Two distinct outer pauldron caps remain attached to the existing two shoulder
chains. Colored joint paths remain intact, including alternating ladder reach.
**Revised Baleog rear armor/anatomy guide gate: ACCEPTED for regeneration.**
This supersedes the earlier guide clarification blocker, without accepting the
older generated four-disc rear source.

## Erik production walk/readability evidence — limited acceptance

Inspected all eight actual `imagegen90-0-phase{0..7}-2x.png` screenshots, the
1x running/idle captures, reversed left-facing capture, and running mobile1x/
2x captures in `output/playwright/vikings90`. Erik is separated from the parked
group; the actual native shapes and anatomical leg exchange survive both zooms
and mobile display. Mirroring keeps the chest/beard direction coherent. Steel,
skin, leather and trouser assignments remain stable, without duplicate hands,
connected halos or gross head/core drift. Native stance soles meet the floor;
raised/recovery boots are visually separate. The retained Imagegen rendering
continues to fit the environment's material direction.

`evidence.json` confirms actual0..7 phases at advancing worldx359.9..471.0,
constant groundedy896 and normal vx220→230, errors[]. These coordinates
distinguish world movement from modest sprite registration response. The file
currently contains one sampled phase sequence, not three actual loops.

**Erik actual1x/2x/mobile gait shape, mirror and readability subgate: ACCEPTED.**
**Full motion runtime gate: PENDING explicit three-loop actual phase traces/
7→0 joins and remaining stopped/reversed ladder1x/mobile evidence.**
One screenshot per phase plus diagnostic atlas loops cannot establish actual
repeated gameplay cadence. No final publication approval is granted yet.

## Olaf corrected V5 pilot — further source correction needed

Inspected `olaf-walk-{0,4}-raw-v5.png` and `olaf-climb-0-raw-v5.png` originals.
Brown trousers/highlights now replace the incorrect slate patches. Deliberate
native density and the retained broad body/green tunic/gold beard are preserved.
However walk0 still exposes a tan center belly while walk4 paints that same
surface green. **V5 walk pair costume continuity: FAILED.** Correct the belly
material in the opposite whole pose while preserving its limb exchange and
disc; the corrected trousers do not waive the torso color pop.

The rear shield is larger thanV4 but remains a broad flattened oval with an
asymmetric flattened upper rim. The guide metadata explicitly requires24×24
native, yaw0 and no rear foreshortening; the original reads approximately24wide
by20high. **V5 rear round-disc shape/size: correction still required.** Compare
at native scale against the actual24round guide before accepting it; improve
the original whole-key disc rather than changing world scale or separately
stretching a processed shield fragment. Full Olaf expansion remains blocked.

## Corrected whole-key pilots — accepted for cycle expansion

Inspected `baleog-climb-0-raw-v5.png`, `olaf-walk-0-raw-v5.png`,
`olaf-walk-4-raw-v6.png` and `olaf-climb-0-raw-v6.png`, plus their same-scale
64native samples in `output/vikings90-review/corrected-pilot-native4x.png`.

Baleog now has exactly two distinct caps connected to one broad backplate;
the reached hands trace two arms without the extra pair of torso discs.
Olaf's opposite walk key now retains exposed tan belly and brown trousers,
with the same green outer tunic as0. The crossed hand/body occlusion changes
with the pose while garment ownership remains coherent. The rearV6 disc at
native size reads as a broad round shield matching the guide, with plausible
upper collar/arm occlusion, rather than the earlier compressed oval. Its
physical registration and all subsequent disc poses still require review.

**Corrected individual pilot raw/source native-density, anatomy and costume
gate: ACCEPTED for full-cycle expansion.** This supersedes the listed failed
keys only; it does not retroactively accept priorV4/V5 defects or approve a
complete Baleog/Olaf cycle. Preserve selected originals/prompts, same common
scale, limb identities and shield contract through the remaining keys.

## Erik complete production movement gate — ACCEPTED

Rechecked the completed `evidence.json`:24actual screenshots cover0..7 three
times at advancing worldx361.8..729.8, groundedy896, errors[]. Actual phase
order is complete, including7→0 at both internal joins. Inspected the24pose
contact board `output/vikings90-review/erik-actual-three-loops.png`, made only
by cropping the actual production screenshots without rescaling their actors.
Core/helmet positions retain the same modest cyclic response in every loop;
changes in camera/world movement do not create accumulating sprite drift.
Both trouser chains repeat a complete front/back exchange, with readable
compression/passing/recovery and consistent costume assignment.

Also inspected actual ladder-material1x, ladder-material-mobile1x/2x,
ladder-stopped and ladder-reversed captures. `ladder-detail-evidence.json`
records10entries, errors[], actual ascending0..3, stopped3 at y789.75 and
reversed2 at y821. The stopped pose retains the last grip; descending restores
the previous reach rather than resetting to0. Camera-aligned rear body, dark
left/light right trousers and leather/skin remain coherent in these contexts.
Actual1x/2x/mobile preserves the reviewed contour, contacts and clothing.
Earlier running/idle and mirrored captures establish the unchanged-pose and
direction transitions without a new halo, double hand or core jump.

**Erik selected walk/climb native-density/source gate: ACCEPTED.**
**Erik processed/native and actual production1x/2x/mobile movement gate:
ACCEPTED.** Acceptance applies only to Erik's selected12whole replacements
and their inspected current binding. Baleog/Olaf expanded cycles, shield/rider
states and future release integration must receive their own review; this is
not a blanket approval of the unfinished complete three-character skin.

## Baleog expanded12keys — corrections required before integration

Inspected the selected sources in `baleog-source-selection.json`, all eight
walk keys/four rear keys, original/native comparison, native4x strip and
registration records. Armor now has one backplate/two caps, no rear beard,
and dark-left/light-right rear trousers retain ownership. The walking limb
roles progress through front, passing, rear and recovery with the expected
opposite leg exchange. Sources retain deliberate native clusters and identity.
These improvements do not establish uniform scale or all authored grips.

**Expanded source/native full-cycle gate: FAILED pending walk1 and rear2.**

- Walk1V5 is visibly smaller than the other walk cells. Its common-scale
  registered bounds are y34..64 (30native high), against38native at0/2/3/5.
  After correct helmet registration its grounded boot ends approximately
  seven native pixels above the normal71sole plane. This is original
  composition/scale drift, not modest authored compression or an alpha anchor
  mistake. Regenerate at the shared64logical cell/38person size; fitting this
  cell independently would disguise the defect and is not approved.
- Rear2V5 places both hands high beside the helmet. The accepted exact guide
  has a distinctly lower screen-left grip and elevated screen-right grip.
  Preserve the high right reach, raised right knee, connected armor and stable
  trouser ownership, while restoring the lower left reach in the whole source.
  A four-frame row must alternate actual reaching roles, not merely change
  knee position beneath a near-constant pair of raised hands.

The other selected walk cells are approximately36..38native high and retain
their intended phase families; rear0/1/3 are usable constraints. Correct the
two affected originals and repeat the full source/native strip and complete
loops before production integration. Actual Baleog runtime remains PENDING.

## Olaf overhead pilot — anatomy promising, fixed-disc contract failed

Inspected retained overhead-walk0/4V5 and overhead-climb0/2V5 sources alongside
exact guides. Green outer tunic, tan belly, gold beard and brown trousers
remain coherent. Ordinary raised poses have two arms with palms beneath the
disc; rear pairs alternate one supporting hand and the opposite ladder reach,
with consistent arm material ownership and no rear beard. Native cluster
density is suitable for the existing scale.

**Raised pilot density/anatomy/material subgate: ACCEPTED.**
**Raised fixed-shield source gate: FAILED pending disc correction.**

The overhead walk4 disc is visibly narrower/shallower than0: approximately
20native wide versus22native at0, both short of the fixed24width guide, despite
the unchanged physical24disc and24×6 overhead projection. The palms/shield
center must obey the same physical support contract through every pose.
Keep actor size and helmet/horn clearance; correct the original whole keys'
disc size/position rather than fitting each whole actor or stretching a
processed equipment fragment. Review the resulting source/native pilot at
the common scale before expanding the remaining overhead frames. All
processed/runtime Olaf shield/rider gates remain PENDING.
