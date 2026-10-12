# Independent Baleog eight-family gait review

Review opened2026-10-12 under native-sprite-art and VISUAL-REVIEW-GATE.md.
Reviewer owns this record only; no source/runtime edits.

## Requested correction

Trial84height/cadence correction remains accepted within its recorded scope.
Its remaining Baleog defect is weak near/far leg exchange among near-duplicate
guarded stances. A new source must visibly show contact, compression, passing
and swing, then exchange supporting/swinging leg identities for the other
half-cycle. Eight indexed cells or color differences alone cannot establish
eight meaningful poses.

Read assets/vikings85/baleog-gait-prompt.txt. It assigns accepted81native
pose guides as anatomy authority and80raw art as material reference only.
Intended atlas:4×2 logical64×64native cells; anatomical body38native pixels;
2world units per native pixel. Body rootx32, planted sole row61, uniform
scale and at most one-native-pixel chest/head motion. The prompt explicitly
requires coarse deliberate clusters, maximum24colors, transparent padding,
and no fine painted textures or soft edges.

Measure anatomical helmet-to-sole and horn-inclusive height separately. A
38native body plus horns can exceed the84whole76world silhouette budget;
fitting that whole silhouette to76world must not be falsely reported as
38native anatomical size. Judge actual adult proportions and body/idle
transition at the same apparent size.

## First raw source — REJECTED

Inspected assets/vikings85/baleog-gait-raw.png (1774×887) and its
baleog-gait-appearance-4x-review.png intended-size diagnostic. Raw armor,
tunic, beard and edges retain soft fine multitone shading and connected
colored fringe finer than the intended native block. Native-density/alpha
gate fails before any processing.

Gait also fails the eight-family contract: contacts0/4 repeat the same
near-leading front boot, while chest/sword guarded stance stays largely
fixed. There are real pose differences, but they do not establish a readable
opposing support-leg exchange. Material-reference standing poses appear to
have overridden the guide geometry. This is not an accepted new source.

## Guide-only retry — pose fidelity improved; raw source REJECTED

Read baleog-gait-guide-only-prompt.txt. Inspected
baleog-gait-guide-only-raw.png (1774×887) and its
baleog-gait-guide-only-appearance-4x-review.png intended-size diagnostic.
Removing the80material reference improves motion: light near-leg contact0
leads, while contact4 puts that leg behind the pelvis and the dark far leg
forward. Compression, passing and folded recovery are more legible, with
subtle arm/chest changes rather than a completely frozen sword guard.
This is a meaningful pose-fidelity improvement, separate from art acceptance.

It still fails native-density/alpha. Raw steel/helmet/sword highlights and
edges contain irregular fine pixels and gray/green connected fringe smaller
than the enlarged logical native blocks. A coarser main silhouette does not
waive finer edge/detail density. The intended-size review is diagnostic only,
not an acceptable conversion or cleaned production atlas. Both candidates
remain rejected; no density rescue/downsample processing is approved.

## Processed / actual runtime gate — NOT ASSESSABLE; NOT APPROVED

### Third clean-pixel retry — raw source REJECTED

Read baleog-gait-clean-pixels-prompt.txt and inspected the retained
baleog-gait-clean-pixels-raw.png (1774×887), plus its intended-size4x
appearance diagnostic. This preserves the guide-only retry's improved
near/far exchange, while helmet, sword and material planes are broader and
closer to the requested coarse density. However thin gray/green/gold outline
residue remains around horns/helmet, sword, boots and inter-leg gaps, smaller
than the native material clusters. Raw boundary/alpha quality still fails
the clean native-pixel contract. No processed cleanup or runtime approval
is inferred from this partial improvement.

No85runtime replacement has been reviewed. Require same-size source/runtime
comparison, all phase families at actual1x/2x/mobile, mirrors, stable sole
registration, start/stop/reverse and existing fallback/action contacts after
the raw source passes.84cadence acceptance cannot waive these gates.

## Direct native alternative — density/pose pass; material quality REJECTED so far

Read tools/native-vikings85-gaits.py and inspected all three
assets/vikings85-native/{erik,baleog,olaf}-gait-4x.png sheets. Each source is
512×64, eight64×64native cells, directly drawn from81pose geometry with no
imagegen pixels or rendered-body splice. Whole geometry is authored with a
.925vertex projection around the sole to fit the horn-inclusive display
budget, while Olaf's physical shield diameter remains24native. This is new
native authorship, not a bitmap downsample of rejected art.

Native cluster/alpha density passes. Pose families retain the guide's near/
far exchange, compression, passing and swing. However production material
quality does not yet pass: narrow edge strips on broad flat limb/torso shapes
still read as recolored anatomy guides, particularly Baleog's slablike slate
torso/legs and sparse head/pauldron volume. Olaf's ochre shield is a flat plate
without convincing rim/wood/boss depth; facial/beard/steel planes lack the
earthy dimensional identity of the approved game and material references.

Requested native correction: connected helmet dome, face/beard separation,
rounded shoulder/chest planes, boot/toe/sole volume and shield rim/boss depth,
while preserving anatomy, support plane, body budget and coarse density.
Binary alpha and numerically valid skeletons alone do not approve weak-looking
art. This first native alternative remains NOT APPROVED for runtime integration.

## Revised direct native full kit — SOURCE GATE ACCEPTED

Inspected revised native gait sheets, Baleog/Erik full frame keys, all60Olaf
frames, Olaf contact montage and final Erik native atlas. Read revised
native-vikings85-gaits.py and VIKINGS85-FIX.md. Full atlases use eight columns
of64×64cells:32Erik/38Baleog/60Olaf poses. The raw native output itself is
the production source; nearest4x/frame keys are inspection views only.

Broader connected steel helmet/pauldron planes, torso material separation,
leather boot shafts/cuffs/toes and Olaf's rim/wood/plank/boss shading resolve
the first native rendition's flat guide look. This remains a consciously
simpler coarse native style, rather than reproducing every painted detail of
the rejected imagegen studies. At its intended size the material identity is
readable without subnative noise or soft alpha. Adult lean/armored/stout body
types and leg exchange remain intact; actual scene readability still belongs
to the separate runtime gate.

Rear climbing initially exposed a hair-colored head/beard mass facing the
viewer. That was a source blocker despite accepted gait density. Final rear
material_head uses steel shell/rim planes and paint_beard explicitly returns
for rear views. Inspected corrected rear14–17and Olaf52–55: helmet backs,
torso backs/stowed equipment and alternating hands/knees now read ladder-facing,
without a jaw beard pasted on the rear torso. This resolves that blocker.

Olaf's raised profile is corrected to physical center native22/world−36,
top19/bottom25, not the initially mistaken center25. Shield physical diameter
remains24native; inverse-authored head/arm contacts leave helmet/horns below
the shield and supporting palms at its underside. Raised rear climb separates
one support arm from the opposing ladder reach. Front/raised/transition source
montage shows connected hands and consistent equipment identity. Actual rider
soles, shield transfer, ladder contacts and mirrors remain runtime requirements.

**Final native full-kit source density, pose fidelity and material quality:
ACCEPTED.** This supersedes the initial direct-native material/rear-source
failures only. All three imagegen85raw candidates remain rejected and unused.
**Processed / actual-game runtime gate: NOT ASSESSABLE; NOT APPROVED** until
new source-to-runtime, actual1x/2x/mobile and support/action evidence is inspected.

## Native85 actual-game checkpoint — runtime review in progress

Inspected the production drawHeroArt same-size gait board and isolated actual
native85/current70 phase captures, including Erik phase0, Baleog phase4 and
Olaf phase3 at2x; running1x/2x/mobile, mirrored Baleog and stopped idle views.
The new native silhouettes stay within the established total visible height
budget and their soles meet the same game floor. This is the horn-inclusive
budget, not a claim that projected anatomical bodies remain36/38/36native.
Near/far boots exchange visibly across the authored gait family; the native
source has genuinely different whole-body phases rather than the old four
families duplicated. Eight selected frame IDs alone are not the visual proof.

Inspected actual rear ladders for all three heroes at1x/2x/mobile. Steel helmet
backs, rear torso/stowed equipment, alternating hands and boots read correctly
against the real ladder. Inspected bow release, shield raising and held overhead
at2x: equipment remains connected to the hands, the raised supporting palms
meet the underside, helmet/horns clear it, and no duplicate legacy shield is
drawn. Actual Erik rider capture at2x shows soles on the middle support plane,
with Olaf grounded beneath him. These observations support the contact scope;
extended sword/bash phases and native front projectile collision remain pending.

Independent focused verification: node --test viking-native85.test.js
viking-cadence84.test.js hero-frames.test.js hero-skins.test.js passed15/15.
The initial browser evidence records48phase captures with matching0..7IDs and
zero errors. These checks supplement the inspected pixels; they do not replace
the remaining actual-action/collision gate. Final runtime verdict remains pending.

## Final native85 action/contact review

Inspected replacement actual bash3 and sword3 captures: Erik leans into the
impact and Baleog extends the blade from the connected hand rather than merely
holding his guard. Bow2, shield-raise4 and held-overhead3 provide visible action
continuity within the same native kit. Desktop1x/2x and mobile captures retain
readable adult silhouettes and grounded soles. Rider desktop and portrait2x
show Erik's soles meeting the middle shield plane; Olaf's boots remain on the
floor, hands support the underside and helmet/horns remain below the disc.
Final contacts-evidence records36ordinary-control captures and zero errors.

Read final game.js syncHeroArt and projectile-collision.js. The selected native
skin assigns the matching source ellipse at each simulation tick, draw/reset
and skin change. Swept collision uses the rotated source shape, mirrors it,
omits a front guard for a back-stowed shield, rejects outgoing rays and puts
overhead interception at the actual top. Rider support retains the established
numeric middle plane. Independently ran native85-shield.test.js,
viking-native85.test.js and projectile-collision.test.js:9tests passed, including
the below-shield gap, mirror, stow, overhead and moving-shield regressions.

**Actual native85 art, animation and support/action visual gate: ACCEPTED.**
The coarse material style reads consistently in the inspected scenes, all eight
gait families exchange the authored near/far limbs, and the complete action kit
avoids old art splices. This approves the new optional native85 skin, not the
three rejected85imagegen sources or existing current70's duplicated gait.
Final selected-skin/collision browser propagation remains a narrow verification
item until the latest combined preview is captured; no art/source blocker remains.

## Final selected-skin binding closure

Inspected final combined-preview bound-front, bound-overhead and bound-ladder
screenshots and binding-evidence.json. All three actors actually carry native85;
Olaf carries the matching front ellipse, overhead center(world0,−36)/radii24,6
or back-stowed ellipse as appropriate. These are production controls and real
rendered states, not a test-only actor. Images retain the previously accepted
ground/hand/helmet contacts and one shield. Browser errors are empty. This
closes the remaining selected-skin propagation verification.

**Final native85 source gate: ACCEPTED. Final processed / actual1x/2x/mobile
runtime gate: ACCEPTED for the optional native85 skin.** Collision correctness
is supported by source-matching production binding and swept-collision
regressions; these three binding screenshots are not claimed as a live enemy
projectile interception demonstration. No rejected imagegen source is approved
or used by this verdict, and no default-skin change is implied.
