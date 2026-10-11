# Vertical parallax65 review

Independent changed-scope review of vertical-parallax.js and its consumers in
Story, Arcade depth, Cycle and Refraction rendering. No source assets, native
pixel sizes, scene aspect ratios or physical support coordinates are changed.

## Code and verification

farSceneY spends existing overscan, limits distant travel to 80% of that margin,
and clamps image placement within the viewport-covering interval. Its reported
speed is at most .18 and falls when the unchanged raster has less overscan.
Negative Story/Arcade camera ranges are included in the coverage test. Whole
puzzle backdrops use .22 vertical depth motion and extend their foundations
below the foreground floor when descending, while physical platforms and props
retain world coordinates. Output placements stay on the two-world-unit grid.

Grounded middle scenery is still rendered through its original support anchor.
Story's final pub bays preserve their furniture scale and floor anchor rather
than treating nearby doorways and counters as distant sky scenery.

Independently ran vertical-parallax.test.js, background-depth.test.js and
scene-resolution.test.js: 10 tests passed. These check edge coverage, slower
depth motion, native grid/framing and original interior floor registration.
Also ran the attached background-effect and vertical-polish regressions.

## Actual visual evidence

Inspected all desktop before/up pairs under output/playwright/vertical65-:
story0, story5, arcade9, cycle0 and cycle1. Inspected landscape mobile before/up
pairs for story0, arcade9 and cycle1. These are supplied production-browser
captures using ordinary Up input; I did not independently drive another browser.

Visible landmarks move less than foreground heroes, floors and controls. The
Story canopy retains its connected overhead ribs; the Arcade observatory's
near column moves with its physical plane while mountain/cloud scenery moves
more slowly. Cycle's complete reservoir/architecture and Refraction's cave
ceiling remain internally connected throughout the pan. No newly exposed top
or side canvas gap is visible in these pairs. Object scale and pixel clusters
match between each pair; there is no re-zoom or raster reconstruction.

At the full Up look, grounded heroes/floors can move below the bottom of these
screenshots. That is the existing look-camera behavior, not evidence of
detached feet. In before views, visible props/boots meet their supports; code
retains those supports in world coordinates. This review does not certify
every uncaptured lower footing or change the earlier grounding contracts.

## Verdict

**ACCEPTED for the vertical-parallax correction in the reviewed contexts.**
No blocking new gap, floating support, detached effect or scale change was
found. Existing source/processing acceptance remains applicable because raster
assets and native scaling are unchanged. Parent reports 268 root tests passing
and zero errors in the normal-input desktop/mobile pan checks; those reports
supplement the independent code, focused-test and image inspection above.

## Published verification

Commit1e7f72b published2026-10-12. Live entry and all seven runtime modules
match the reviewed release by SHA256. Public ordinary-Up camera-pan checks pass
in Story0/5, Arcade9, and both puzzle rooms; zero page errors. Captures are
output/playwright/vertical65-live-*. No gameplay physics changed. Root268tests
pass, including both zooms at negative camera limits and effect registration.
