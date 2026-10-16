# Depth146 independent cache/performance review

Status: accepted after final readiness, pixel, scene and performance evidence. The reviewer
changes no runtime code or assets. Review applies native-sprite-art continuity
and the visual review gate to cached Cycle of Depths environment planes.

## Cache boundary and independent code review

The correction caches only fixed world-space layers: rear decoration/supports
and dark structural rails, each of two active rail routes, and front terrain/
ladder. The order remains back, active rail, moving signals, front terrain,
live mechanisms. Far scenery retains its live x/y parallax transform. Fan,
duct/control cables, carrier, gate field/frame, selector/brake/damper and rail
signals remain dynamic; they must not be frozen to the first cached pose.

The bounded four entries are1400x600-native canvases representing2800x1200world
units at the existing2world-unit grid. Their baseRGBA storage totals13.44MB;
this is canvas pixel capacity, not a measurement of total browser/GPU memory.
Native camera cropping uses integer source pixels and preserves1:2 scale rather
than scaling a viewport screenshot. Layers are keyed to this single immutable
level and route. Other level dispatch occurs before the cache path. Source
artwork, world geometry, collision and mechanics are unchanged.

An independently flagged stale-load risk requires the same readiness for cache
construction as for painting: ladder image complete plus nonzero dimensions,
not dimensions alone. Depth sheets should similarly be fully loaded. Unready
art should render directly without creating a permanent incomplete cache entry.
Terrain/connections already expose complete/dimension readiness.

## Evidence cautions

Initial pixel comparisons showed large deltas and a missing gold gate arch in
the optimized capture while its green field remained. The gate is deliberately
outside the static cache. `createAtlas` needs its onload registration of feet
in addition to image dimensions; comparing the second imported renderer before
those contacts initialize is invalid evidence. Both baseline and optimized
renderers must be equally ready, including actual grounded gate/fan contacts,
before accepting or diagnosing pixel differences.

Require identical native before/after images across cameras, both rail routes,
actual1x/2x/coarse-mobile views and cold-to-warm asset states. Inspect cached
supports/ladder/terrain at their unchanged contact planes and live carrier/fan/
gate/signals after the cache is warm. Check bounded builds/entries, viewport
source-copy size and performance under the same settings. Report CPU-throttled
desktop mobile emulation as such; it is not an actual iOS-device benchmark.

Source/native continuity gate: pending. Runtime/aesthetic gate: pending.
Performance verification: pending comparable final receipts. No publication
approval from the initial optimization figures alone.

## Corrected readiness and exact pixel proof

The final cache gate requires complete ladder/depth images as well as nonzero
dimensions; terrain and connections retain their complete-image checks. Overall
world readiness also includes staticReady, preventing a one-shot menu preview
from freezing terrain's loading fallback. Cold-load browser evidence forces a
ladder with known dimensions to remain incomplete: zero cache entries are built
until completion, then the three normal layers build. The cache helper's direct
unready fallback, bounded eviction and native crop tests independently pass.

The initial missing-gate comparison was corrected by waiting for atlas onload
registration before capturing both renderers. Independently verified all final18
cases in `assets/depth146/pixel-check.json`: exactly zero changed pixels and
maxDelta0, across three cameras, three viewport sizes and both lower/upper rail
states. Cache entries/builds are3for the first route and4after the second route,
never above4. Before/after images at camera0,900 and1950 are now identical,
including the dynamic gold gate, grounded fan, cables, rails, midground and
terrain. This is actual production-renderer pixel equality, not approval based
on matching dimensions alone.

## Actual game views and retained movement

Inspected `scenes/landscape-normal-1x.png`, `landscape-middle-2x.png`,
`landscape-upper-1x.png` and `portrait-middle-2x.png`, plus current imagegen90
sidecars. The12coarse/mobile portrait/landscape captures assert actual zoom1/2
and record errors[]. The8middle/upper views use a documented camera-only
diagnostic override, rather than claiming the crew physically traversed there.
Normal views use the active Viking camera. No new line gaps, aliasing, detached
supports, changed scene scale or misplaced ladder/terrain were visible.

The driver uses ordinary Baleog walking and sword input to release the drive;
its before/after motion receipt shows carrier y929.667to861.25 while game time
advances. Mechanisms and world-space movement remain live outside the cache.
This is targeted actual-game movement/camera proof, not a new full manual level
completion. Native renderer comparisons separately cover different rail routes
and active fan/gate states without freezing them into cached world planes.

## Comparable performance and final verdict

Independently read `perf-before.json` and final `perf-after.json`, both Chrome
coarse/mobile emulation with4xCPU throttling. World draw calls fall738to108per
frame and repeated filter assignments2to0. Median world rendering is approximately
16.4–18msbefore and1.5–1.7msafter across three scene cameras. Actual game RAF interval
median/p95 changes28.9/37ms to10/15.9ms. These matched measurements support the
identified repeated static-render bottleneck; they are not an actual iOS-device
benchmark or a universal frame-rate promise. Warm frames copy only the visible
native source rectangle; cache bounds remain four fixed planes.

These complete-art receipts supersede the exploratory695to65draw-call figures.
The tightened microbenchmark waits for actual gate/fan atlas-foot registration,
not image dimensions alone, so the grounded fan's connected ducts/cables are
present before measuring. Both old and optimized complete scenes include those
additional43draws; the saved work remains630draws per frame. The repeatable
baseline path now routes the retained original renderer explicitly even when
run from the optimized repository. The earlier pixel-equality proof already
waited for full registration and remains18exact matches; no runtime or art change
was needed for this measurement correction. Final budget is below120draws per
complete-art frame, rather than the exploratory below100 threshold.
The final successful budget rerun records108draws and0filter assignments at all
three cameras. These latest1.5–1.7ms and10/15.9ms values supersede the preceding
complete-run1.5–2.1ms and11/15.5ms timing sample; the modest timing variation does
not change the deterministic draw-count reduction or pixel equality.

**Source/native continuity gate: accepted. Runtime gate: accepted. Aesthetic
fidelity gate: accepted. Cooperation/control continuity gate: accepted.
Performance evidence: accepted within the recorded browser setup.** Exact native
pixel equality establishes retained art fidelity; the optimization does not trade
detail for speed. No remaining concrete blocker found for this cache boundary.
Publication remains subject to the parent's final build/release and live-byte
checks. Future users of the generic helper must key/invalidate mutable geometry
themselves; this caller is deliberately limited to the fixed Cycle of Depths
layout and its two explicit route variants.
