# WATER100 independent optics review

Reviewer: independent critique subagent. Source and runtime visual gates are accepted for the WATER100 optics changes. The ordinary-input browser completion and error receipts were independently inspected.

Instructions reviewed: `skills/native-sprite-art/SKILL.md`, `skills/grounded-parallax/SKILL.md`, `docs/standards/VISUAL-REVIEW-GATE.md`, and `docs/ARCHITECTURE.md`.

## Native-density/source gate: accepted

Reviewed `src/levels/water/effects.js`, `src/levels/water/optics.js`, the authoritative basin/bell geometry, and `tests/unit/water-optics.test.js`. No generated or processed sprite is replaced. Source art and its registered scale remain unchanged. The source for the new optics is the already rendered world/actor image, captured without smoothing. Refraction uses four-world-unit-high strips with two-world-unit sample/destination coordinates and displacement steps: one native pixel remains two world units. It does not interpolate high-contrast art or enlarge source details.

Both source and destination spans stay inside the submerged basin and viewport. Air rectangles are subtracted before displacement, with conservative native-grid rounding at their sides. The dry cavity retains the undisplaced scene. Tint-mask pockets now begin at the water surface when draining crosses them, avoiding an even-odd clip island above the surface. The current two bell geometries lie inside the basin. Warm dry cavity color, a dark/light mouth rim, and cool side highlights communicate an open-bottom breathing space without changing its collision or air rules.

The stream phase is `floor(y / 4 - time * 24)`: a given phase moves four world units down after 1/24 second. Both width-wave and luminous phase now move downstream. Bubble travel upward is physically distinct from the downward inlet stream.

Independent focused execution: `node --test tests/unit/water-optics.test.js` passed 2/2 tests. These establish bounds/grid/direction constraints, not visual acceptance.

## Processed/in-game gate: accepted

Independently opened these actual production screenshots under `output/water100/`: `initial-1x.png`, `initial-2x.png`, `air-pocket-1x.png`, `air-pocket-2x.png`, `air-pocket-mobile.png`, `shield-intake.png`, `shield-intake-flow-next.png`, `crank-half-1x.png`, `crank-half-mobile.png`, and `drained.png`.

Retained key evidence: [air pocket 1x](../../tests/evidence/water100/air-pocket-1x.png), [air pocket 2x](../../tests/evidence/water100/air-pocket-2x.png), [mobile](../../tests/evidence/water100/air-pocket-mobile.png), and [drained surface](../../tests/evidence/water100/drained.png).

At 1x the dry upper and lower bell cavities retain a warm interior and a continuous cool/light mouth boundary. The occupied bell visibly protects Erik's dry silhouette. The 2x view confirms registered rim pixels, readable retained source contours and no sampled underwater pixels crossing the dry cavity. The mobile view preserves this difference without a hint label. Initial bank captures show a narrow reflected side rim attached to the retaining stone, rather than a displaced physical edge. Partial-drain and final-drain captures keep the water surface separate from the dry machine above it; no above-surface tint island is visible.

Submerged masonry, pipe edges and machinery acquire modest horizontal contour displacement. No new interpolation halo or blurred pixel transition was introduced, and active targets remain identifiable. The paired shield-intake captures show time-changing highlights and different refracted contours while the nozzle, shield and visible physical support remain registered.

Additional unshielded frames were independently opened: [frame 0](../../tests/evidence/water100/unshielded-flow-0.png), [frame 1](../../tests/evidence/water100/unshielded-flow-1.png), and [frame 2](../../tests/evidence/water100/unshielded-flow-2.png). The [flow receipt](../../tests/evidence/water100/flow.json) confirms full-strength flow and zero shelter. These show traveling broken light clusters inside the inlet column, with a stable physical nozzle. Together with the exact downstream phase progression test, this resolves the earlier shielded-only motion evidence limitation.

## Scope and performance

The renderer keeps one reusable scene canvas per destination canvas, reallocating only when the viewport changes. Visible-water clipping limits strip draws; a full 460-world-unit water depth requires about 115 strip rows before pocket splits. There is no per-frame asset generation or high-resolution color averaging.

The [ordinary-input browser route receipt](../../tests/evidence/water100/route.json) reports `won: true`, health `[3,3,3]`, and no page errors. It exercises the complete inlet/air-bell/drain/exit progression after optics integration. The flow receipt also reports no page errors and 90 local animation-frame intervals: median 5.9 ms, p95 7.2 ms. This bounded measurement demonstrates no apparent stall in the tested browser; it is neither an isolated render-cost benchmark nor a guarantee for other devices.
