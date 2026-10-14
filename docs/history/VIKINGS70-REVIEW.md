# Vikings70 locomotion critique

## Scope and standing gates

Review replaces only idle, run/walk and ladder-climb locomotion from Vikings63.
Ability poses, body world scale and the separately registered fixed-size shield
remain reference constraints. Apply skills/native-sprite-art/SKILL.md and
VISUAL-REVIEW-GATE.md: deliberate native-density source, uniform once-from-original
packing, separate RAW and processed/actual1x/2x/mobile verdicts. Both replacement
gates are pending new evidence; this review does not approve unseen70assets.

Target64x64native cells at2world units/native; adult standing height36native
Erik/Olaf and38Baleog, current body origin32,40 and floor sole row62, yielding
visible sole at physics h.y+44. Retain original sources/prompts and existing63
as regression evidence. I edited no runtime or production art.

## Independent current63 findings

Inspected all three processed atlases, registration.json, prepare-vikings63.py,
sprite-render.js, hero-art.js and movement.js. Nearest-enlarged diagnostic contact
sheet: output/vikings70-existing-review.png. Prior63 acceptance is superseded
for the three user-rejected locomotion behaviours, without reopening its abilities.

Idle deformation is authored rather than a renderer breathing transform.
hero-art draws the unchanged cell at the snapped root. Baleog idle alpha bounds
move23..48→20..45 horizontally, a3native/6world-unit drift; Olaf23..44→20..40.
Helmet/head contour, shoulder and stance change while the broad sole row stays62.
Thus matching the maximum bottom-alpha coordinate is insufficient to stabilize
the pelvis, boots or identity. The existing fixed sole-x reference retains this
per-pose drift. Bounds alone are diagnostic, not an anatomical anchor measurement.

Erik run has actual leg differences, so calling all eight frames identical would
be inaccurate. However wide-contact0/4 and similar passing2/6 silhouettes repeat
without a clearly readable opposing foot transfer, and arm/torso changes are
weak. The native sheet reads as a small number of variations rather than a clean
eight-phase gait. Require coherent planted-foot progression and limb alternation,
not merely eight byte-distinct PNG cells or changing helmet pixels.

Climb16..19 shows a side/front-facing face and torso, with two repeated reach/pull
families. It does not read as rear-facing hands/boots contacting the ladder.
prepare-vikings63.py treats every climb pose as grounded and translates its lowest
opaque pixel to62. That can move the body root when a lifted knee changes the
lowest foot; Olaf frame19 has offsetY20 versus21 for16..18. Native knee/arm motion
must not cause whole-body re-registration. Renderer uses absolute animTime*6 and
resets a stopped climber to frame0, so a stop/restart can jump to a different pose.

## Required replacement contract

- Idle: stable planted boots, pelvis, head silhouette and lateral root throughout.
  Animate a restrained chest/shoulder cluster by at most one native pixel; a
  breathing cycle must not translate the complete person, helmet or boot stance.
  Preserve asynchronous per-character timing.
- Run: explicit contact→down→passing→up→opposite contact→down→passing→up.
  Opposing hands/feet must remain identifiable in silhouette. Keep body proportions
  and root alignment; modest one-native-pixel torso rise is authored motion,
  not a new frame-dependent scale. Check actual slow acceleration and fast travel:
  current movement increments run phase by abs(deltaX)/9, so full cycle72world
  units. Match authored step length or adjust phase from measured gait, avoiding
  planted-foot skating. Inactivity must not keep advancing the run cycle.
- Climb: rear-facing helmet/back, equipment visibly stowed, both hands free.
  Alternate left-hand/right-knee reach and right-hand/left-knee reach with real
  transfer poses, not mirrored facial art. Use fixed ladder-root x32 and registered
  pelvis; never normalize each pose from its lowest opaque boot. Author limb
  contact around the ladder's13native/26world rung spacing. A four-phase cycle
  spanning two rungs52world is a coherent candidate; verify actual contacts and
  speed rather than blindly using that number. Accumulate phase from actual
  vertical travel, reverse on descent and freeze current grip when stationary.
- Preserve ability registration, bow origin, overhead hands/shield underside and
  passenger sole-center contact. No equipment crop, head-size drift or anatomy
  change is permitted just to distinguish animation frames.

## Evidence needed for final verdict

Provide RAW source beside exact native target and processed comparison; show
idle full cycle, slow/fast run both directions and four actual ladder phases
with stop/restart and descent. Actual1x/2x/mobile gameplay must show boot-floor,
hand/toe-rung and shield passenger contacts. A sheet enlargement alone is not
runtime acceptance. Meaningful pose tests may supplement visual review; frame
uniqueness, broad alpha bounds and a completed puzzle cannot replace it.

**RAW/source gate: PENDING replacement sources.**
**PROCESSED/native and actual gameplay gate: PENDING replacement evidence.**

## First70 RAW source preflight

Inspected assets/vikings70/{erik,baleog,olaf}-source.png and VIKINGS70-SPEC.md.
Erik/Baleog use4x4cells, Olaf8x4cells; the intended processed cells remain64native.
The rear-facing climb silhouettes are a clear directional improvement: helmet
back, torso back and stowed equipment replace the previous outward-looking face.
Erik has deliberate broad flat clusters; Baleog/Olaf retain finer material and
edge detail, requiring an exact intended-native comparison before accepting
density for the entire kit. Large file dimensions are not proof of native fit.

**RAW/source gate: NOT YET ACCEPTED; Olaf locomotion is blocking.**
Olaf front walk0..7 mostly repeats the same wide squat and overhead walk8..15
mostly repeats a planted standing pose with occasional knee bends. Neither row
currently supplies the specified opposing-foot contact/passing/up gait. Lowering
the overhead palms alone cannot fix this. Regenerate those walk rows with clear
near/far foot transfer, readable longer adult legs and stable pelvis/head identity,
while keeping the fixed front/overhead grip anchors. Do not turn a repeated stance
into purported eight-phase walking by translating or duplicating it in processing.

Erik/Baleog run is more legible than the previous sheet, but contact0/4 and
passing2/6 families remain very similar. Make the opposite near/far arm/foot
transfer explicit, or honestly describe a four-phase cycle; the proposed eight
phases cannot be accepted from subtle color differences alone. All three climb
rows still mostly comprise two alternating raised-hand/knee families. Provide
meaningful transfer poses if retaining the four-phase promise. Rear-facing
direction alone does not prove hand/toe contact or stable climbing anatomy.

Overhead palms are visibly too high in the first Olaf source, consistent with
the implementer's identified issue. Repair against the existing shield underside
at native palm anchors26/38,29, keeping sole/root and shield dimensions unchanged.
Preserving a single idle body silhouette with only small registered tunic shading
variants is a sensible correction to generated idle drift; check the result
against the source and actual gameplay instead of treating that plan as acceptance.

The replacement runtime gate remains pending. This preflight identifies visible
source problems before packing; it does not certify adult proportions, source
density, animation contacts or new actual gameplay not yet supplied.

## Targeted Olaf components preflight

Inspected generated originals exec-1d094625-c162-4155-812d-e614eb8bef86.png
(targeted gait) and exec-f15f8118-dd03-4915-a9b9-17128e1dec59.png (lowered grip)
in the session generated_images directory. The targeted first four leg families
are materially better: extended-toe contact0, compressed stance1, tucked rear
boot/passing2 and raised-knee swing3 provide usable distinct locomotion components.
The second half largely repeats them, so it is not accepted as eight independent
authored gait phases. A deliberately described four-phase cycle is acceptable
in principle; near/far leg-depth shading must distinguish the actual alternating
limbs, not introduce unrelated palette flicker or claim uniqueness from noise.
Actual target-size motion will determine whether those transfers read coherently.

**RAW component preflight: ACCEPTED for the new first-four leg components and
repaired bent-arm upper-body/grip and distinct tuck/glide/brake components.**
Register those compatible pieces at one uniform hero scale, fixed pelvis/head
and fixed shield underside. This permits native preparation/comparison, not
publication or acceptance of the as-yet unseen assembled runtime gait.

Do not take the repaired grip source's climb row: both hands are beside the
helmet in its poses, erasing alternating reaches. Retain the earlier rear-facing
climb source with explicit alternating hand/knee families, and honestly use its
meaningful phase count rather than claiming four unique transfers. Keep original
sources and record which component comes from which source; preserve the old
rejected gait/grip as regression evidence.

Full RAW assembled/target-density comparison and PROCESSED/actual runtime gates
remain pending. Check foot transfer and root at native size, then slow/fast motion,
mirror direction, actual palm contact, ladder grip and passenger support in game.

## Assembled native preflight

Inspected erik-native-review.png, baleog-native-review.png,
olaf-native-review.png and prepare-vikings70.py against the retained originals.
Erik/Baleog use four deliberately mapped walk poses, not a false eight-pose
claim. New Olaf legs now read as stride/compression/passing/swing at native size.
Gripping upper body is fixed across both walk rows, with native height and
source scale preserved. The subtle idle tunic-only changes keep head, outline
and boots fixed. Distinct tuck/glide/brake read at this size. Material clusters
and adult identities remain readable; no high-density artwork rescue is evident.

**RAW/assembled native gate: acceptable for these walking, idle and float
components; full kit remains BLOCKED by Olaf's current climb20..23.**
In the new walk source20/22 show the left arm high, whereas21/23 lower both arms.
No right-hand-high transfer is visible. This is one-sided reach/passing rather
than alternating grips. Use the retained original Olaf-source.png rear climb
family, which contains alternating left/right raised hands, at the same fixed
helmet root. Climb does not need the overhead grip repair applied to it.
Do not regenerate accepted walk/float components to fix this isolated problem.

Actual production1x/2x/mobile motion and contact review remains pending browser
evidence. Enlarged native sheets cannot certify stopped/reversed ladder grip,
walk skating, shield passenger hand contact or transition continuity.

## Restored climb and current production review

Restored Olaf rear climb now visibly alternates left/right high arms in the
refreshed native sheet. Independently inspected actual pose-climb0/2 showing
both transfers, mobile1x ladder view, front-grip, overhead-walk0 and shield-board
mobile. Hands reach the same fixed shield underside; passenger boots remain on
its center support plane. Climbing faces into the ladder with stowed equipment;
the shield covers part of Olaf's lower body but does not remove the hand reach.
Distance-driven phase freezes rather than resetting on stop. Independently ran
four hero-locomotion tests plus the actual native validator successfully.

**Final RAW/source and assembled native gate: ACCEPTED.** The earlier isolated
Olaf climb blocker is superseded by the restored original alternating row.
This accepts deliberate four-phase walking, not the abandoned eight-unique-phase
promise. The source components, fixed idle silhouette and native material density
retain recognizable adult character identities without rescaling between poses.

**PROCESSED/actual runtime gate: still PENDING final evidence.**
Erik walk-0-3 and Baleog walk-1-2 overlap Olaf/shield so most of their bodies and
foot transfers are hidden. Mirror-1 shows part of Baleog, insufficient to claim
all actual gait phases inspected. Ordinary-walk E/B away from the group before
capturing unobscured phase families at gameplay size. Actual draft/brake captures
are also being prepared. These are evidence gaps, not newly invented art defects.
The reported99.77second full Clockwork route HP3/noerrors predates the restored
Olaf climb source only; distinguish route completion from final image acceptance.

## Uncrowded runtime packet and remaining Erik stability correction

Inspected refreshed gait packet after the implementer corrected the inherited
zoom setting: actual2x Erik/Baleog samples are now separated from parked heroes.
Floor soles and readable stride families are visible. Actual Refraction draft
and brake show distinct tucked rise and knees-forward braking; Clockwork glide
shows fixed hands/overhead shield with passenger boots on the same support.
These close the prior crowding/float evidence gaps. The failed obsolete Cycle
capture harness is not completion evidence and is excluded.

**Processed/runtime gate remains BLOCKED by Erik's excessive gait excursion.**
Independent PNG measurement of the four used Erik gait bounds gives top alpha
rows27,30,27,25, while each sole is62. That is5native/10world units of vertical
helmet excursion, substantially larger than the intended restrained one-native
torso bob. It is a visible walk stability issue, separate from corrected idle.
Stabilize Erik's pelvis/upper body using compatible authored components while
preserving real leg transfer, planted soles and one uniform scale. Do not move
the whole sprite away from its physical floor or scale individual frames.

The preparer's current 'helmet' color mask also includes pale collar pixels:
absolute RGB-channel differences below38 are not sufficient to isolate steel.
Therefore metadata helmetSourceNative alone is not proof of anatomical root
stability. Use actual helmet component/explicit authored root or a verified
helmet-only mask. This is an isolated Erik correction; accepted Olaf/Baleog
gait, grip and float do not require regeneration. Reinspect refreshed Erik
native/actual gait after correction before replacing the overall pending verdict.

## Final corrected kit acceptance

**RAW/source and assembled native gate: ACCEPTED.** Original component sources
remain unchanged and retained. Independently inspected refreshed native Erik
and Olaf sheets and the revised uniform preparer. Erik uses one authored head
and core while preserving outside forearms/leg transfer; native top row27 is
stable across the used four gait poses. No visible splice gap or new frame scale
was introduced. The steel landmark now chooses the upper connected neutral-steel
component and rejects cream collar contamination. Olaf rear grips alternate,
and floating poses register from palms instead of a dangling boot. This
supersedes the isolated Erik excessive excursion and one-sided climb findings.

**PROCESSED/native and actual1x/2x/mobile runtime gate: ACCEPTED.**
Inspected final uncrowded actual gait samples after explicit2x setting plus1x
companions, actual front/overhead grips, stopped climb, ordinary rear climbing,
shield passenger/glide and final Refraction draft/brake at desktop and mobile.
Foot transfer is readable without head/torso pumping; the standing idle head,
boots and outline remain fixed. Actual raised-shield climbing initially had a
capture-harness detachment: Action releases the ladder. Exclude that floating
front-pose capture. Final12:04 ordinary Up re-grip capture explicitly asserts
climbing&&shieldUp and shows the rear-facing climber with shield at the true
overhead rider plane, rather than a stowed-back shield. Independently viewed
unique copies output/vikings70-review-final-overhead.png and
output/vikings70-review-final-mobile.png to avoid stale same-path evidence.

Final flight packet distinguishes tucked upward draft, extended forward glide
and knees-forward braking, with hands attached to the unchanged shield and no
clipped pose. Five focused tests and the actual native PNG validator passed
independently. The implementer reports319root tests, ordinary Clockwork completion
HP3each and final Refraction flight prefix10.17simulated seconds/noerrors. Later
changes were sprite registration/capture corrections, not new puzzle mechanics.
This review is independent code/native/capture inspection of those ordinary
browser controls, not a separate reviewer browser playthrough or an exhaustive
every-frame timing audit.

**Final changed-scope verdict: ACCEPTED; no material blocker remains.**
The approved runtime consciously uses four authored gait families and alternating
rear climb families; no eight-unique-gait claim is made. Earlier failed/stale or
crowded captures remain diagnostic history and do not support final acceptance.
