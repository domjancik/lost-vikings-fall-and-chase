# Sewer145 independent enemy review

Status: accepted after corrected gait, local contacts and final evidence. The reviewer
changes no runtime code or art. Review applies native-sprite-art, the grounded
visual review gate and cooperative-world-design to the sewer lurker correction.

## Independent diagnosis

The old enemy only damages during the dark, timed warning attack. A lit enemy
instead retreats and never reaches that damage branch. Its recoil branch exits
early too. A Viking can therefore visibly overlap a living moving cockroach
without taking damage. The renderer chooses one static cell15 for both retreat
and recoil; those bodies translate with no changing leg contacts. Patrol/stalk
time-based frame changes also keep playing independent of actual displacement.

Contact damage should apply to actual live body overlap independently of
illumination and movement state, including recoil. Keep existing invulnerability
and hazards-disable conventions; exclude dead/captured heroes and dead enemies.
Check real vertical overlap and intervening physical solids so nearby-but-separated
bodies do not collide through a hatch. The front shield must protect through
actual local placement/facing, rather than a remote Olaf within an arbitrary
radius blocking a strike at another Viking. Overhead and backward shields cannot
silently provide front-body protection.

## Art and gait requirements

Retain the original sewer125 native shell, head, antennae and material richness.
One native pixel remains two world units; do not enlarge the creature or flatten
its detailed body to match a crude replacement. Six articulated legs need clear
hip/knee/foot connections and near/far depth order. Small limbs may be concise,
but thin unshaded placeholder lines under the rendered shell do not establish
matching art quality.

Advance gait from actual displacement after wall containment, not elapsed time
or requested velocity. Review walking, retreat, recoil, warning/idle, direction
reversal and death separately. Supporting feet should stay attached to floor760,
with alternate swing/stance and no root jump when a gait loops or body flips.
No moving legs when stationary or paused. Keep source soles, body width and
equipment/antenna bounds stable; show native pose proof before actual1x/2x and
coarse-mobile scene review.

## Required checks

Reproduce lit-body damage; verify dark contact/timed warning, temporary damage
immunity, repeated contact after immunity, death/reset and disabled hazards.
Check front local shield, reversed/overhead shield and remotely positioned Olaf.
Inspect grounded full-state gait keys at actual gameplay size and native density,
then an ordinary healthy affected route. Automated damage flags alone cannot
approve visible body contact or animation quality.

Source/native gate: pending. Runtime gate: pending. Aesthetic gate: pending.
Cooperation/control gate: pending. No publication approval at diagnosis.

## Corrected implementation and native matrix

The contact pass now runs after containment in ordinary and recoil movement,
checks nearby vertical/horizontal body contact and intervening physical solids,
and applies the existing damage/immunity policy. Dead/captured heroes, dead
enemies and disabled hazards are excluded. Local front-shield contact recoils
the enemy; its back does not protect. The older timed warning attack was also
tightened so Olaf cannot remotely cancel another Viking's damage.

An initial gait used absolute traveled distance even while recoiling backward,
which would make supporting feet slide at double speed. The corrected gait
uses facing-signed actual displacement, retaining absolute travel only as a
metric. Positive modulo supports negative phase. Initial repeated leg patches
could extend past the authored foot; segment-end and exclusive-native-row60
clips now prevent material from extending below the floor.

Inspected `assets/sewer145/gait-matrix.png` with eight poses in both directions
and retained source cells beneath. Original detailed shell, head, raised mouth
appendages and antennae remain intact at the same native scale. Six articulated
walking supports use a measured opaque5x7-native chitin patch from the original
source; far legs are darker. Their shading/texture belongs with the original
carapace rather than replacing it with flat sticks. Body size, outlines and
negative spaces are retained. This is retained-art assembly, not new generated
art or approval of a different pixel-density pipeline.

Independently ran all six sewer145 focused tests: pass, covering lit retreat
damage at60/120Hz, temporary immunity, no-hazards/dead-enemy safety, local versus
backward/remote shielding, distance-driven gait, negative recoil and eventual
fatal contact. An additional independent numeric check covers planted stance
feet in all four combinations of left/right facing and forward/backward travel.
Actual scene and contact/pixel evidence remain pending below.

## Final production evidence and verdict

Inspected the final native matrix and `gait-check.json`:16representative poses
in both directions, plus192raster phase/facing checks with zero material at or
below the exclusive native floor60. Final clearRect explicitly removes partial
alpha remaining on a rotated clip boundary below that plane. The source sole
maps to worldfloor760 at the unchanged128world-unit cell size. Independently
ran all final seven sewer145 tests: pass, including planted-foot checks in
forward/backward movement with both facing directions.

Inspected `contact/contact-before-2x.png`, `contact-motion-2x.png` and
`shield-after-1x.png` with their matching before/after keys. These are clearly
labeled **SEEDED DIAGNOSTIC**, using the production engine, sewer world/darkness
and ready imagegen90 hero renderer; they are not presented as ordinary route
captures. The live insect's retained shell and shaded articulated limbs fit the
surrounding native masonry. Distinct contacts bend while the torso moves, feet
meet the floor and there is no enlarged body, flat substitute, floating sole or
obvious new halo. The live overlap is visible next to Erik; HP changes3to2 and
remains2during temporary immunity. Olaf's nearby correctly facing front shield
recordsHP3, one block and recoil. `contact/check.json` confirms these results.

Independently read both ordinary browser completion receipts under `desktop/`
and `mobile/`: allHP3,19captures each, errors[], continuation to stableID4.
Desktop completes at62.275simulation seconds and coarse/mobile at62.0333.
Inspected desktop inspection2x/guarded-shot1x and mobile guarded-shot landscape
views. Those guarded-shot views already show the defeated insect, so they prove
scene fit/death state and ordinary route safety, not live locomotion. The
separate native matrix and labeled production-render diagnostics establish the
live gait/contact correction. Mobile evidence is automated browser context;
no separate full manual touch playthrough or video playback is claimed.

**Source/native continuity gate: accepted. Runtime gate: accepted. Aesthetic
gate: accepted. Cooperation/control gate: accepted.** No remaining concrete
blocker found within this correction. The accepted animation uses signed actual
travel, retained textured chitin and exclusive sole60; the earlier absolute
recoil gait and overshooting segment extraction are not approved. Publication
remains subject to the parent's final build/release and live-byte checks.
