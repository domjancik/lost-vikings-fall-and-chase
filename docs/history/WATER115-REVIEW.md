# Water115 corrective swim scale and movement review

Reviewer owns this record and gate metadata only. User reports the114 swimmer
is oversized, arm layering is odd and strokes should run only during active
movement. The114 review accepted contacts and posed source density but missed
the standing/swimming occupied-mass mismatch; that acceptance is insufficient
for this corrective release.

Reported same-native comparison: standing imagegen90 Erik idle has510 opaque
pixels versus694..889 for114 swim. Proposed user-requested uniform.8 authored
linear correction targets444..569 pixels and42-native reach versus36-native
standing height. Re-export once from retained accepted raw whole actors to64-
native cells, then integer-place in80-cell runtime atlas; no fractional runtime
scale, no resampling an already processed sheet, no per-frame/body-part scaling.
The unchanged raw artwork needs new target-density review: reject if the smaller
native view loses defining hands, beard, helmet or near/far limb ownership.

Required actual proof: standing/swimming juxtaposition at unchanged camera1x/2x
and coarse mobile, opposite stroke near/far ownership, both mirrors, wet-floor
and dry-refuge transitions; moving→stopped holds the last reached stroke; an
inactive swimmer freezes; input against an obstacle and true displacement phase
rules are explicit. Procedural painter must keep coherent native chains after
uniform local-coordinate adjustment, not arbitrary independent elbow moves.

## Gates

- New generated target native-size/source checkpoint: **accepted below**.
- Standing/swimming scale and arm ownership runtime: **accepted below**.
- Active-movement-only phase and inactive freeze: **accepted below**.
- Supplemental AIR, falling entry and health feedback: **accepted below**.
- Publication: **allowed by the completed source/runtime visual gates**.

## New native target checkpoint

Inspected `standing-comparison-3x.png`, `source-review-4x.png` and candidate
registration. Corrected top-row swim mass now matches standing actor closely;
old bottom-row114 clearly expands body/head volume. Complete retained source
poses exported once at64-cell authoring density preserve horns, helmet, beard,
peach palms and distinct recovery keys2/6 without losing defining clusters.
Native areas around462..568 compare with standing510, rather than694..889.
**Accept new generated target native-size/source checkpoint**. User requested
the uniform size correction; no fractional runtime scaling or reprocessed-atlas
rescue was used. Actual transitions/arm ownership and phase behavior remain
pending. Procedural needs its own rendered comparison because its original
standing raster density differs from the generated family.

## Independent runtime critique, 2026-10-15

Reviewed the corrected source/native comparisons and actual production captures
under `assets/water115/`: `source-review-4x.png`, both `standing-comparison`
views, both `render-comparison` views, and the generated desktop stroke keys0–7.
Also inspected generated desktop entry/mirror/floor at2x, generated mobile swim
at1x, procedural desktop entry at1x and recovery key2 at2x, and procedural
mobile swim at1x and mirror at2x. These cover each skin in both desktop and
actual coarse-pointer contexts; all four `evidence.json` records contain all
eight reached keys, 1x/2x state pairs and no browser errors.

**Source/native-density gate: accepted, reaffirmed.** Retained originals are
`assets/water114/erik-swim-raw-v2.png` keys0,1,3–7 and v3 key2, uniformly
re-exported once to64x64 authoring cells and integer-packed into80x80 runtime
cells at2 world units/native pixel. Helmet, horn ends, beard and exposed palms
remain deliberate clusters. Recovery keys2 and6 retain the overhead far palm
behind the head and the near forearm/palm below the torso, rather than extra
hands. No defining feature disappears at native size. Procedural art remains
deliberate integer clusters at its own established density.

**Swim-art runtime gate: accepted.** Corrected generated mass reads like the
unchanged standing adult in the actual water-entry shot. The new native area
range is441–568 against510 standing (the earlier462 lower bound omitted key7).
The procedural range351–433 compares with407 standing; its helmet/body volume
is coherent with its own standing skin. Neither gains a larger head on entry.
The horizontal reach is a pose change rather than a scale increase. Opposite
recovery keys show distinct near/far arm depth, hands remain readable, mirrored
equipment stays coherent, and wet-floor bounds do not bury the actor in the
solid floor. Rendered water tint reduces contrast naturally without destroying
helmet/beard identity. No native outline, alpha or registration blocker found.

**Movement phase gate: accepted.** All four records traverse keys5,6,7,0,1,2,3,4.
Stopped/still/inactive distances and key4 remain identical; blocked/held-floor
distance and key remain identical in every context. Resume adds actual travel
without resetting the held key. This supports travel-driven continuous phase
and rejects elapsed-time cycling while released, inactive or blocked.
The full normal-control route reports won=true, HP3 for every hero and errors[].

## Supplemental behavior and final runtime verdict

Inspected `assets/water115/supplemental/evidence.json` and actual production
`jump-entry-health-1x.png` / `jump-entry-health-2x.png`. Dry dock resources are
empty and all three HUD resource meters are hidden. After the ordinary keyboard
jump into water, only submerged Erik has a world AIR callout and visible HUD AIR;
the two dry parked Vikings have neither. The shared resource helper requires
authoritative underwater state. Independently ran
`node --test tests/unit/water-entry115.test.js tests/unit/water-swim114.test.js`:
14/14 pass, including no AIR in a breathing pocket and dry exit, plus inactive
hero resource coverage.

The falling-entry capture records y539.86, vy135 and swim=true; subsequent Down
records y614.11, vy160 and travel74.25, without a second jump. The 60/120Hz
regressions also preserve entry momentum and successful downward swimming.
The actual 1x/2x screenshots show a submerged, correctly scaled actor rather
than a character stranded above the surface.

Health rectangles and active triangle are crisp and complete above the swimmer
in both supplemental screenshots, despite the visible water refraction behind
them. Source ordering in `src/app/game.js` draws water, Warden and magnetic
optical passes before `drawHeroFeedback` and world resource labels, confirming
that this feedback is not sampled into the distorted scene. Parked crew health
remains readable. No health-overlay blocker found.

Latest `assets/water115/full-route/route.json` reports won=true, HP[3,3,3] and
errors[]. This supplements the visual judgment above; it does not replace it.
**Final processed/in-game runtime gate: accepted. Source gate: accepted.
Publication allowed for this corrective asset/behavior scope.**
