# SEWER149 independent attack and wall-crawl review

Status: accepted after final adjacent-platform clearance correction and refreshed
evidence. Reviewer changes no runtime code or art.

## Attack and movement contract

The user clarifies that the telegraphed attack, not merely contact, must hurt.
The new committed warning lasts0.7seconds, followed by0.2seconds of attack and
0.5seconds of recovery. Bite damage is active while0.15..0.015seconds remain,
within110world units ahead and45vertical units of the walking plane, with real
wall visibility. Normal damage immunity prevents repeated hits in one window.
Moving out of range dodges; disabled hazards stay harmless. The windup commits
direction and cannot be erased by a one-pixel fire-light flicker. Local front
shield blocks rather than granting another hero remote protection.

Patrol only turns inward when at a limit and currently facing outward. It does
not alternate every frame simply because its x lies beyond a threshold. Retreat
can stop at the outer refuge clamp rather than repeatedly turn against it.

The closed inspection shutter is now followed along its real exterior: approach,
quarter turn, climb side, turn onto top, cross, turn down opposite side, descend
and return to floor. Position changes at60world units/second, with continuous
quarter-turn rotation. Opening the shutter releases the creature under gravity;
it is not snapped to the floor. Attack/contact/arrow bounds use rotated body
geometry. Distance-driven tripod feet stop when translation stops rather than
cycling during a stationary patrol turn.

## Independent findings and corrections

1. Initial visibility rays began at the wall-support coordinate, which lies on
   the shutter's inclusive boundary during vertical crawling. Even an exposed-side
   overlapping hero was rejected as occluded at t0. Reproduced right-face contact
   at2060,699.5 with Erik2080,656 and no damage. The ray now starts at the rotated
   body's center in air. A regression reproduces the case and asserts damage.
2. Initially, hp0 skipped movement, leaving a killed wall crawler permanently
   suspended at its elevated y. Killing now clears crawl and applies outward
   drift/gravity until a real support/floor is reached. The new arrow-kill test
   confirms continuous falling, outward separation and floor760 settling. Ground
   corpses remain harmless and do not keep their live gait.

Independently reran39 focused tests across sewer149, sewer145, sewer136 and
sewer125: all pass. Coverage includes visible-reach bite without body overlap,
warning dodge, active-window arrival/immunity, disabled hazards, stable patrol
direction, continuous side/top/side crossing at60/120Hz, shutter release, climbing
contact, airborne death, front/back/remote shield distinctions and healthy normal
complete60/120Hz sewer routes. Existing wall/light/inventory/stream causality also
passes. These tests do not replace the visual and in-game gates.

## Art review scope

The retained rich chitin source remains unchanged. Shell/head/antennae are kept,
with body warning crouch and a forward bite lunge. The native motion canvas grows
to96x64 solely to retain the extended head; final display stays at two world units
per source pixel. Wall turns mirror before rotation and use bounded128x128 native
inverse-nearest raster steps of5degrees. No painted replacement, downsampling or
generated source is involved. Final raw-source continuity and actual1x/2x/coarse
views must show preserved detail, attached feet, legible bite direction, stable
wall contacts and grounded dead art before publication.

Independently inspected the unchanged `assets/sewer125/props-native.png`: the
cockroach's shaded segmented shell, antennae and small face remain a rich native
source. Initial seeded production diagnostics preserved that source on the
visible wall-ascent/corner poses, but the bite-warning/active images were fully
obscured by fog/darkness and the descent subject was hidden. Those images were
rejected as visual proof; passing numerical attack checks cannot establish an
unseen lunge. Requested refreshed illuminated diagnostic subjects, clearly
distinguished from ordinary gameplay/lighting proof.

## Final actual and diagnostic evidence

Final diagnostics contain 24 native 1x/2x images across 12 states. Bite warning
and forward lunge are now visible, retaining the original chitin shading and
antennae without clipping the extended head. The receipt shows stationary enemy
travel0 while Erik loses3 to2HP, establishing the bite rather than body movement;
front-shield Olaf stays at3HP and the creature recoils continuously. Upper-side,
top and descent poses retain native density, attached feet and the same detailed
shell. Floor return restores grounded walking; the shot-off climber falls outward
and the overturned corpse visibly settles at floor760.

The first left diagnostic lamp was under the inspection platform and could not
illuminate its upper side. Final extra inspection lights above/below that platform
are enabled only while rendering seeded diagnostic pictures, preserving real
production darkness and AI simulation. Each image explicitly says SEEDED
PRODUCTION DIAGNOSTIC. These pictures prove native rendering and state geometry,
not unseeded acquisition or an ordinary route. All extra inspection lights are
now render-only, so crawl simulation follows the dark patrol state. Per-frame enemy metadata is now
deep-copied: side stage1, top stage3 and descent stage5 correctly match the scenes,
rather than every record retaining the final mutable crawl object.

Separately inspected actual ordinary-input route shots at1x/2x and portrait,
with imagegen90 heroes and the retained live/dead creature next to the real lamp,
walls and floor. Pausing retains the shot state; its banner is above the subject.
`route/evidence.json` records a healthy69.4667second win, all heroes3HP,9captures,
errors[] and continuation to water round4. The run used `--touch
--sewer132-focus`, so it is a coarse/touch browser context with responsive views,
not merely resized desktop proof and not a physical iOS test. Final diagnostic
and actual route sheets resolve to vikings90 Erik/Baleog plus Olaf111.

Source/native continuity gate: accepted. Runtime gate: accepted. Aesthetic gate:
accepted. Cooperation/control gate: accepted. Bite timing is dodgeable, front
shield and ordinary immunity remain consistent, wall crawling follows a real
obstacle without teleporting, and the complete light/weapon/stream sequence stays
clearable with full health. Publication allowed subject to final build/release
and live-byte verification by the integrating agent.

## Reopened adjacent-deck correction

The integrating agent caught an additional real-layout clearance problem after
initial acceptance: the service deck1800..1990 at640 leaves only30world units
beside the shutter's left side2020. A complete left-side descent would pass the
creature through this deck. Earlier diagnostic pictures showing that descent do
not establish collision correctness and are superseded.

The revised path checks adjacent platform clearance before leaving the shutter
top. In this actual layout it turns atop the shutter, traverses back and descends
the exposed right face; an isolated shutter with both sides clear still permits
full crossing. The isolated-crossing test now explicitly removes platforms rather
than claiming that layout is the real scene. A new real-layout regression rejects
descent through the deck and requires a continuous grounded return to the right.
Final runtime/aesthetic/cooperation acceptance is reopened pending refreshed
production and diagnostic evidence; publication is temporarily disabled.

Independently reran the same focused suite after this correction: all 40 tests
pass. Refreshed diagnostic top/right-descent/return views are accepted: the return
records `returning:true` at2060,631 facing right, then2097.67,760 on the floor.
Its detailed source remains attached to the exposed shutter side and does not
intersect the adjacent deck. The refreshed ordinary route receipt also passes:
69.4667seconds, all three at3HP,9captures/errors[] and water round4 continuation.
Final actual2x guarded-shot and exposed-face return were independently reinspected.
The test controller explicitly faces right before its rope shot instead of
depending on braking direction; this does not change runtime puzzle permissions.
Earlier failed and67.6083second route variants are superseded. Final runtime,
aesthetic and cooperation gates are accepted again, and publicationAllowed is
restored subject to final release/live verification.
