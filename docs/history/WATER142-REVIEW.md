# Water142 independent foliage review

Status: accepted after corrected source-cell use and production evidence. Review covers the
Drowned Regulator foliage popping correction; no replacement art is planned.
The reviewer has not changed runtime code or assets.

## Independent diagnosis

Read `src/levels/water/effects.js`, its render call sites and the retained
`assets/water92/flora-registration.json`; inspected the native4x source sheet.
The atlas has four32x48-native species in each of two rows. Those rows contain
different leaf geometry, not equivalent registered poses. For example species1
changes its top bound from native7 to5 and its horizontal bounds from5..23 to
9..25. Species3 changes horizontal bounds from8..23 to10..24. Roots remain
registered at16,46, but individual leaf clusters visibly differ.

The former renderer chooses source row0 for phases0..5 and row1 for6..11. At
three phases per second, it swaps the underlying plant every two seconds and
swaps back at the four-second loop. This directly explains leaves appearing or
disappearing. Row displacement of a consistent retained plant can preserve all
leaves while bending the stalk on the native grid; changing atlas identity
cannot.

Other effects were considered: water refraction displaces scene strips but
does not swap plant leaf pixels; the plants are drawn continuously even after
draining. The wet/dry test formerly snaps to phase0 as the water passes
floor-8, potentially creating a small tip snap, but it is not the recurring
leaf-replacement cause. Preserve fixed roots: source root46 at worldfloor-92
lands exactly on the authored floor. Both root rows should have zero sway.

## Required correction evidence

Verify that each individual plant uses one consistent source cell throughout
its loop, that row pixel count/material survives every phase, and that roots
stay fixed. Inspect the former phase5-to6 and11-to0 boundaries, sustained
underwater movement, water recession/dry settling and paused simulation. Sway
must remain quantized to the two-world-unit grid, with bounded frame-to-frame
movement rather than a new whole-plant jitter. Compare native before/after
loops and actual production1x/2x/coarse-mobile views with imagegen90 sheets.
Passing geometric tests does not substitute for that visible motion review.

## Corrected source-cell and native-pixel evidence

The correction selects a persistent atlas row from plant identity, retaining
both authored variants in the environment without swapping an individual
plant's leaves. Cached row displacement changes its bend only. Underwater sway
strength is reduced over96world units of water recession in four native-grid
steps, rather than snapping to an unrelated fully wet pose at floor-8.

Inspected `assets/water142/before.png` and `after.png`, generated using the
production foliage renderer at all twelve phases. The old first plant changes
from294 to303 opaque native pixels at phase6 and its roots change. The corrected
plant retains294 pixels at every phase and identical bottom two native rows.
The after sheet visibly preserves all leaf identities, including5-to6 and
11-to0. No replacement palette, blur, new scale or flattened art was introduced.

Inspected `assets/water142/after-dry.png` and `after.json`. The second authored
variant retains303 opaque pixels at water heights550,850,874,899,901 and950;
the six keys keep the same plant while bending tapers. The current displacement
formula rounds native shifts and leaves root rows46/47 fixed. Independently
ran `node --test tests/unit/water142.test.js`: the focused regression passes,
including persistent source-cell selection for all ten plants across a full
cycle and multiple water heights. Pixel-count checks supplement the actual
sheet inspection; alone they would not prove leaf ownership.

## Actual gameplay and verdicts

Independently inspected desktop phase5/6 at2x and phase0at1x, plus coarse/mobile
phase11at2x and phase0at1x under `assets/water142/desktop/` and `touch/`.
The foliage retains its silhouette and leaf placements while the tips bend;
roots meet the visible basin floor. The native pixel density and existing rich
water/machinery scene remain unchanged. The first, green and ochre plants are
separately readable beside the active Erik. Normal scene refraction still moves
the underwater image, but there is no newly invented/disappearing leaf cluster
at the old atlas-swap boundaries.

Both actual-game receipts record eight paused boundary captures at authoritative
camera zoom1/2, all heroesHP3 and errors[]. The mobile receipt confirms coarse
pointer context. The harness lets simulation advance to phases5,6,11,0 and
checks120ms pause stability before resuming. Capture sidecars confirm
imagegen90 with vikings90 Erik/Baleog and olaf111. These are automated gameplay
boundary stills and full-cycle native-render evidence, not a separately reviewed
video or complete manual water-level playthrough.

**Source/native gate: accepted. Runtime gate: accepted. Aesthetic gate:
accepted.** No remaining concrete blocker found for this foliage-only renderer
correction. The accepted source-cell policy preserves the authored plant; the
former alternating-atlas animation is not approved. Publication remains subject
to the parent's final package/build/release and live-byte checks.
