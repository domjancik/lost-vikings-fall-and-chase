# Pub144 independent scenery review

Status: accepted after production image and coverage review. The reviewer changes no runtime
code or assets. Review applies grounded-parallax, native-sprite-art continuity
and the repository visual review gate to this scenery-only correction.

## Independent diagnosis and intended planes

The original coast is a768x384-world rectangle at native2world-pixel density.
It follows camera x*.82-120 and y*.35+310 on the snapped grid. The interior
window holes1192,534,66x38 and1512,534,66x38 can lie outside that single image's
horizontal extent, revealing the renderer's flatgray clear color. This is a
coverage issue, not a reason to enlarge or resample the original coast.

The original yard and doorway516..574 should retain their existing coast draw
unchanged. Additional retained-source scenery can mirror-repeat on both axes,
strictly clipped to the two interior window openings and behind their frames.
All windows must sample the same world-anchored far-layer phase; resetting a
different picture in each aperture would undermine their shared exterior plane.
The far layer keeps its existing x/y camera response and native density.

The under-loft infill should read as a recessed timber rear wall beneath the
physical deck, bounded by existing structural posts and attached to floor760.
Actors can walk in front of that wall. It must not resemble a new solid cross-room
partition or cast blocking light volumes while remaining noncolliding. Local
contact shading beneath a real deck is appropriate; the existing24world-unit
loft deck retains its physical side/underside collision. Draw new infill behind
existing posts, casings and actors so front/rear plane ownership is explicit.

## Required evidence

Compare production before/after window coverage across x/y camera positions and
actual1x/2x/coarse-mobile views. Establish original yard/door pixel equality, no
gray holes in either interior aperture, stable world-mounted frames, no mirror
seam or fractional-pixel shimmer, and unchanged source art dimensions. Inspect
the complete under-loft bay with a Viking walking in front; verify posts/deck
and bottom contact rather than accepting a crop of wall texture. Puzzle and
movement behavior should remain unchanged.

## Source/native and plane review

Inspected retained `assets/alehall135/coast-native.png`384x192 and its source
registration context, plus the unchanged native architecture cells. The coast
still draws768x384world units: two world units per native pixel, unchanged
aspect/detail density. No generated replacement, downsampling, resampling or
palette simplification is introduced. The original coast draw uses the same
snapped x/y expression; the extension is clipped only to the two window holes.
Shared world-anchored tile phase and reflected neighboring tiles preserve edge
coverage without separate moving pictures per window. Native filtering remains
nearest-neighbor.

The backing spans x660..876, y634..760: it joins the existing posts' inner edges,
the physical deck underside and the room floor. A short top contact shadow and
floor trim establish a recessed rear surface. Front posts/deck and Vikings draw
over it. It adds no collider or light-blocking occluder; the existing24world-unit
deck remains the physical support. The complete bay reads as dark timber behind
the walking characters, rather than an opaque partition they pass through.

## Independent production evidence

Compared before `output/pub144/before/first-window-2x.png` and
`loft-backing-2x.png` with the corresponding corrected desktop images. The old
second window is flatgray; the new one contains the same landscape plane as its
neighbor. The backing is visibly recessed and supported instead of merely
painting a free-floating shadow under the loft.

Inspected `assets/pub144/desktop/first-window-2x.png`, `second-window-1x.png`,
`loft-backing-2x.png`, `look-up-2x.png`, plus
`touch/portrait-window-2x.png` and `touch/loft-backing-1x.png`. Window frames stay
attached to room timbers while the landscape moves behind them. Mountains,
shoreline and sky fill the apertures without a hard image edge, flatgray hole,
ghost duplicate or visible repeated seam. The yard/door view retains its original
landscape; the new rear panel does not cover those exterior regions. The bay's
floor contact, carved supports and Vikings retain their original size/material
richness at1x/2x and mobile portrait/landscape.

Independently read both actual-game receipts:10desktop and12coarse/mobile views,
errors[]; authoritative camera zoom1/2 and look values-1,0,1 are recorded.
Sidecars confirm ready imagegen90 with vikings90 Erik/Baleog and olaf111.
This establishes actual spatial views while normal controls move/look around;
it is not claimed as a new complete manual campaign playthrough.

Independently inspected the production-canvas coverage test and verified all16
camera results in `assets/pub144/pixel-check.json`. Before rendering reproduces
missing aperture pixels; afterward every aperture has opaque scenery and zero
changed pixels outside the two window masks. This is a bounded scenery-pass
pixel comparison, not a claim that intentionally changed loft-panel pixels are
unchanged. Source placement/code review confirms those panel changes are
restricted to the interior bay. Independently ran all three pub144 geometry
regressions: pass, including25camera x/y combinations and fixed backing contact.

**Source/native continuity gate: accepted. Runtime gate: accepted.
Aesthetic/grounded-plane gate: accepted. Cooperation/control continuity gate:
accepted for this scenery-only change.** No remaining concrete blocker found.
Publication remains subject to the parent's final build/release and live-byte
verification. Approval preserves the existing outside coast and limits repeated
source scenery to the interior apertures; it does not approve enlarging the
original background or turning the recessed panel into a noncolliding opaque
foreground wall.
