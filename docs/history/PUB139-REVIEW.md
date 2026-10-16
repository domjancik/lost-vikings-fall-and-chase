# Pub139 independent review

Reviewed against `native-sprite-art`, `cooperative-world-design` and
`docs/standards/VISUAL-REVIEW-GATE.md`. This reviewer changes documentation only.

## Source gate — accepted, retained artwork

Inspected `assets/alehall135/globe-source.png`, `globe-native-review.png`,
`props-opaque-comparison.png`, `architecture-opaque-comparison.png`, and the
current hearth crop `output/pub139/hearth-inspect.png`. The existing source and
native atlases remain unchanged. The glass body retains about20 native pixels
across (40world units); the cup retains its8×8 native cell, with6×8 material
pixels and2world units per native pixel. Architecture retains64px cells and
128world placement. This is continuity acceptance of previously corrected
production art, not approval of a new generated source or processing pass.

## Code critique — preliminary

Tavern globe and its stool now share the room pass behind the Vikings. Sewer
globe drawing moves to the foreground before the existing darkness mask, so
the creature can cross bodies while still belonging to the unlit world.
Dialogue receives explicit priority100, sorted after health/resource labels;
the labels canvas sits above crew overlays. The hearth preserves the measured
stone silhouette and clips flame pixels to its54×10world recess at1140,706.
Heat copies a maximum29×41 native pixels, with no canvas readback, and samples
simulation time. Cup storage and airborne instances are bounded; resting cup
material bottoms agree with the floor760 and stacked row geometry.

One causal concern was returned to implementation: the former independent
animation cycle could show an empty interior on later cup throws. The corrected
`cupFactoryFrame` now uses the same3.2-second factory cycle: internal creation,
finished cup, release, flight, bounce and settled pile. A focused regression
checks eight successive throws. Resting/bouncing cups retain exact cardinal
rotation, so their measured material bottoms remain aligned with the floor.

## Runtime gate — accepted

Inspected fresh production-render evidence under `assets/pub139/evidence/`:

- `desktop/orb-cup-bounce-{1x,2x}.png` and `orb-cup-bounce-portrait.png` show
  the cup pile touching the floor, subordinate to the orb but readable in the
  dark corner. One existing orb light expands to radius310; no unexplained
  separate corner emitter is introduced. The1x and2x captures actually differ
  in scale and agree with their zoom readbacks.
- `desktop/orb-release-2x.png` shows Baleog occluding the orb as he passes it;
  `orb-cup-flight-2x.png` reveals the glass behind his edge and an airborne cup
  on its continuous arc. `desktop/cracking-2x.png` and
  `touch/cracking-portrait.png` show Olaf consistently in front of both the
  table/stool and globe. The room remains a shared depth plane.
- `entry-mobile/fall-2x.png` now frames the orb below the falling crew, rather
  than an empty shaft. `settle-2x.png`, `bounce-1x.png`,
  `settle-portrait.png` and `six-feet-landscape.png` show the orb in front of
  Olaf during landing/deployment while receiving the sewer darkness mask.
- `hearth/desktop-{1x,2x}.png` and `touch-landscape.png` clearly frame the fire
  recess without Baleog hiding it. Flame pixels stay between the hearth
  stones; the surrounding masonry retains its dimensional native detail.
  `hearth/desktop-dialogue.png` and `touch-dialogue.png` retain readable text
  above the crew and current health. The browser layer receipt confirms labels
  z8 above desktop crew6/mobile crew7, with dialogue priority100 last; the unit
  test separately forces exact dialogue/health coordinate overlap.

Screenshot sidecars resolve ready `skin=imagegen90`: Erik/Baleog vikings90,
Olaf olaf111. True coarse-pointer contexts are included. The earlier captures
in `output/pub139/rejected-zoom/` had racing zoom clicks, including an empty
fall frame and duplicate apparent scales. They were rejected, replaced by the
new driver with zoom/camera assertions, and do not support these verdicts.

Inspected receipts: fresh desktop and touch normal-control routes finish in
53.975 and54.817 simulation seconds, respectively, both HP3/3/3,29 captures,
automatic fall entry and no page errors. Touch actions use actual action-button
taps plus keyboard direction, rather than a claim of full manual-device play.
The separate sewer intro receipt has24 captures, no errors and successful
control resumption. Hearth receipts provide24 unpaused motion samples in each
desktop/coarse context, frozen paused geometry, no readbacks and at most1189
copied native pixels. This bounded effect introduces no full-screen readback.

Independently reran the focused orb139, hearth139 and alehall suites after the
creation synchronization correction: **21/21 pass**. These include healthy
ordinary-input simulation routes at60/120Hz and optional-task bypass.

## Aesthetic gate — accepted

Retained source art and actual scene views preserve bronze relief, tiny internal
arms, dimensional timber and stones. The cup pile reuses the existing vessel
palette and material scale; its dim layered grouping reads as discarded cups
without competing with the uncanny find. Heat displacement stays small and
native-grid aligned, and the measured flame recess keeps the front stone lip
intact. No flat replacement illustration or high-resolution resampling was
introduced. No blocking review findings remain. Final build, complete test
suite and live-byte verification remain the publisher's responsibility.
