# Scrap Orbit scenery depth119 validation

User request: separate floating background wreckage from gameplay objects and
add floating silhouettes farther back.

Changes are limited to decorative layout/raster/color and cache import stamps.
Original113 source sprites, foreground hazard render/collisions, supports, level
route and puzzle states are retained. Both new depth passes precede middle
architecture and all collision objects.

Validation2026-10-15:
- Red test: missing orbitScrapDepthPlan/orbitSceneryColor exports failed before implementation.
- Green: all553 package tests passed, including3 new depth/palette regressions.
- Production build succeeded; source/built browser smoke passed3 campaigns,
  28 previews and movement/selection/inventory/zoom/pause/restart/mobile; errors[].
- Ordinary-input first-field route: allHP3,30 captures, errors[].
  Evidence assets/orbit119/local/route.json.
- Focused actual browser:8 first-field/upper-gallery views at1x/2x and touch
  portrait/landscape,8 middle/12 far pieces and2 gameplay hazards in each art
  receipt; both24/32 native runtime cells explicitly verified; errors[].
  Evidence assets/orbit119/depth/evidence.json and retained native PNGs.
- Focused harness observes intermediate native canvas sources only for evidence;
  it does not change game state or art. Gameplay movement uses ordinary inputs.
- Independent source/runtime review recorded separately in ORBIT119-REVIEW.md
  and assets/orbit119/visual-gates.json; publication requires both accepted.
