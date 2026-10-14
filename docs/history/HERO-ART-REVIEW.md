# Viking character art review

Independent critique under AGENTS.md, HERO-ART-SPEC.md,
skills/native-sprite-art/SKILL.md and VISUAL-REVIEW-GATE.md. This record covers
the pending character replacement; it does not approve or alter gameplay code.

## Target and evidence

Body cells: 64x64 native, eight columns/four rows. One native pixel occupies
two world units. Standing Erik/Olaf: 36 native pixels; Baleog: 38. Origin
(32,40), grounded sole 62, corresponding to the existing y+44 support plane.
Shield: separate 14x24 native, fixed 28x48 world in both orientations. People
must read as adult humans with long articulated legs, not miniature dwarves.

Inspected originals: assets/vikings55/{erik,baleog,olaf,shield}-source.png;
processed Erik/Baleog atlases and their registration/preparation code.
The prior flat sources and processed sheets are comparison evidence, not
approved release art. The old preparation uses two_stage_pack; the replacement
must be made once from retained originals with uniform nearest sampling and
translation for registration, without another reconstruction pass.

Inspected replacement originals: assets/vikings63/{erik,baleog,olaf}-source.png,
with exact edits retained in assets/vikings63/PROMPTS.md.

## RAW source preflight — Vikings63

**Native-density and material direction: PASS preflight.** The three sources
have deliberate stepped outlines and broad flat shading clusters. Helmet,
cloth and legs gain form through large light/shadow planes rather than tiny
painted texture. This answers the flatness problem without reverting to the
rejected high-density Vikings54 art. File dimensions alone were not used as
evidence of suitable density. A final same-size source/native comparison is
still required after packing.

Adult leg length is readable. Preserve these proportions during pose edits;
the helmet/beard block is already visually prominent and must not grow. Check
head/body ratio on standing references at actual native size rather than
counting the helmet and long beard as the anatomical head.

**Complete animation-source gate: BLOCKED.** All three sheets' climb frames
16–19 repeat essentially the same reaching arm and bent leg. Four different
pixel buffers do not establish four meaningful climbing poses. Author an
alternating reach/pull sequence: left arm/right knee, weight transfer, right
arm/left knee, opposite transfer. The body and equipment must retain their
scale and anchors; do not simulate alternation through stretching or packing.

Run frames also contain near-duplicate adjacent poses, yielding about four
readable steps from eight authored frames. Strengthen contact, passing and
recoil silhouettes to make the advertised eight-frame run worthwhile. Idle
can remain restrained; walking and climbing need readable limb progression.

Baleog's bow sequence has distinct draw/release poses, and his sword sequence
has windup/downstroke/extension/recovery. Erik's last row has a readable
shoulder-charge lean. Olaf's overhead hands are distinct from chest-level
hands. Their actual equipment origins, timing and contacts remain runtime
checks, including the prior bow-origin defect.

## PROCESSED / actual runtime gate — PENDING

No Vikings63 packed atlas or current production 1x/2x/mobile evidence has been
accepted. Existing Vikings55 gameplay captures and earlier route completion
cannot approve a new source or waive unresolved action/contact defects.

Required evidence before release:

- Compare source and native result at the same apparent size, and nearest
  enlarged native cells. Reject lost steel edges, mottled isolated pixels,
  damaged alpha, broken bowstring or changing body scale.
- Inspect all run/climb/action extremes, both facings, rise/fall/float and
  landing. Require meaningful limb motion, unclipped equipment and no weapon
  disappearance during a switch to bow or climbing.
- Inspect grayscale silhouettes and actual Story normal-pub and Cycle views
  at 1x/2x plus mobile. Erik's scarf/lean, Baleog's equipment/upright shape and
  Olaf's breadth/braids must remain distinct without color alone.
- Inspect actual arrow emission against the drawn shaft; preserve existing
  projectile physics rather than moving gameplay origins to hide art errors.
- Inspect grounded sole contact in representative animation frames; also
  an ordinary-control shield passenger and a horizontally carried stack.
  Passenger soles must meet the raised shield's center walking plane, stay
  visible through correct paint order, and Olaf's hands must grip its underside.
- Shield stays one fixed-size separate asset through raising, forward stance,
  overhead brace and float. Portraits must load and identify the same heroes.
- Record focused validators and a normal-input route separately from visual
  acceptance. A passing route does not substitute for native art inspection.

Current verdict: density/material direction is suitable for processing, but
climbing source poses need correction. Publication remains blocked until the
source animation correction and the processed/actual-gameplay gate both pass.

## Corrected Vikings63 source review

Re-inspected all three current source sheets after the climb/run edits. Earlier
shading-only versions are retained as `{hero}-shading-source.png`; the verdict
above describes those superseded animation poses.

**RAW gate: ACCEPTED for a two-phase reach/pull climb.** The corrected climb
shows a high extension and a lower pull with changed head/hand and knee
positions. Both hands are available for climbing; Baleog no longer holds a
sword in the reaching hand. The revised run adds readable passing/contact
variation. Density and broad material shading remain appropriate for the
native targets.

The climb still does not clearly alternate opposite limbs. Describe and map it
as two authored reach/pull phases, with paired frames if needed, rather than
claiming four distinct alternating-limb phases. This is a viable compact
animation; actual native/runtime review must confirm its displacement survives
packing and reads as climbing rather than flickering. No per-frame fitting or
procedural pose repair is accepted. This source acceptance does not close the
processed/actual-gameplay gate, which remains pending.

## First processed/runtime review — partial, not release acceptance

Inspected `output/playwright/vikings63-{pub-1x,pub-2x,cycle,mobile,
native-matrix,silhouettes,shield-passenger}.png` and the packed Baleog atlas.
Reviewed tools/prepare-vikings63.py: uniform scale chosen from idle references,
single nearest sampling from retained originals, translation-only registration,
and no two_stage_pack reconstruction. Independently ran hero-frames.test.js,
hero-art.test.js, shield-platform.test.js and shield-carrier.test.js: 15 passed.

Erik/Baleog's visible idle/action poses retain readable clean clusters and
material planes. Grayscale preview distinguishes Erik's scarf/lean, Baleog's
equipment and Olaf's broad shape. Grounded idle boots meet the foreground in
the supplied actual screenshots. The native matrix shows free climbing hands
and readable sword/bow/bash silhouettes; no clipped weapon is visible there.

**Blocking contact defect:** Olaf's overhead pose crouches so deeply that his
raised hands end well below the separate shield, leaving it visibly unsupported.
The passenger boots meet its center, but that does not fix Olaf's grip. A new
authored body pose must reach its unchanged support/underside anchor without
rescaling the full character or altering shield physics. Parent is correcting
the source last row; this capture is superseded only after fresh evidence.

Evidence still required: the pub captures are legacy Arcade Neon Stag, not the
normal-human Story pub specified for adult scale. The mobile capture cuts Olaf
out of view. Provide Story pub at both zooms, Olaf-centered mobile forward and
overhead states, actual bow emission against the drawn shaft, and both actual
climb reach/pull phases. One static pose does not demonstrate the motion cycle.
Overall processed/runtime gate remains pending.

## Corrected grip and remaining actual evidence

Inspected the latest Olaf source and native atlas directly, plus the refreshed
shield-passenger screenshot. Taller authored arms and long standing legs retain
coarse density; boots remain grounded. His hands now visibly join the raised
shield underside, with Erik's boots on its center plane. **The unsupported
shield defect is resolved in this actual 2x view.** The short-grip source is
retained separately as olaf-short-grip-source.png.

Inspected vikings63-story-pub-1x/2x, mobile-olaf-front/overhead, bow-origin and
source-runtime screenshots. Story pub furniture/doors support adult-human
scale. Mobile now shows Olaf fully in both shield states; the fixed shield and
grip remain readable. Erik/Baleog's source/native comparison retains their
silhouette, scarf/steel/clothing planes and equipment without mottled noise.
The bow shaft and emitted projectile line visibly align in the actual shot;
reported shot y916 equals Baleog y896+20, preserving the existing physics.

**Remaining evidence gap:** climb-phase-0/1 are paused with the large PAUSED
label over the climber's own head/chest/hands. They cannot establish the full
actual reach/pull cycle independently. Supply unobscured actual phase captures.
These are capture failures, not a newly demonstrated runtime defect. Final
processed/runtime acceptance remains pending that evidence and the current
normal-input route result. No separate reviewer browser playthrough is claimed.

## Final changed-scope verdict — Vikings63

**RAW native-density/source gate: ACCEPTED.** The final Erik/Baleog sheets and
corrected Olaf last row retain deliberate coarse clusters and broad material
shading. Adult limbs, distinct equipment and the honest two-phase reach/pull
climb meet the compact native art contract. The rejected higher-density/flat
and short-grip sources remain comparison records, not production approvals.

**PROCESSED / actual runtime gate: ACCEPTED.** Re-inspected refreshed
vikings63-climb-phase-0/1 at original image resolution: Baleog is now left of
the pause label with his own head, hands, torso and boots visible. Higher reach
and lower pull are distinguishable on the actual ladder, with free gripping
hands and preserved quiver. This closes the capture gap above. Inspected the
latest refraction62-draft and clear captures containing final Vikings63: Olaf's
extended arms visibly grip the overhead shield while floating; grounded heroes
retain adult scale and clean outlines. Earlier inspected Story pub at both
zooms, mobile forward/overhead, bow emission, grayscale and native matrix supply
the remaining contexts. The old short-grip and obscured climb captures are
explicitly superseded.

Independent verification: the latest 15 hero-art/frame/platform/carrier tests
passed, including all-pose pixel validation and shield movement/contact checks.
Parent reports the final ordinary-input Refraction route won in 103.7166667s,
health [3,3,3], Enter continued, and zero page errors; the overall root suite
passed 266 tests. These reported route results supplement, rather than replace,
the independent source/code/test/image inspection. I did not run a separate
browser playthrough. No remaining blocker is found for this character-art
replacement in the reviewed contexts; this verdict does not certify every
legacy background or every uncaptured animation instant.

## Live release verification — 2026-10-12

Commit e2d3f95 published to the existing here.now game. Live HTML, four character
modules and all four native sprite PNGs match the reviewed release by SHA256.
Real public1x/2x smoke and shield boarding pass: Erik feet530 equals Olaf's
walking plane530; all heroesHP3, zero page errors. Local full Refraction clear
with final sprites:103.7166667seconds, HP[3,3,3], Entercontinues. Root266tests pass.
Captured evidence output/playwright/vikings63-live-{pub-1x,pub-2x,shield-passenger}.
