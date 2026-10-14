# Storm Loom 106 carpet reveal critique

## Scope and contract

Review the textile artwork and its causal production reveal, without changing
Storm Loom puzzle logic, collision surfaces, or progression requirements.

Target: a 48 × 80 native textile displayed at 96 × 160 world units, with one
native pixel occupying two world units. The thread must visibly match the
textile yarn rather than read as an unrelated turquoise power cable. Alternating
horizontal row bands must read as weaving; the working shuttle must follow the
leading stitch. The finished carpet must retain readable woven texture.

## Source gate

**Accepted.** Independently inspected the retained original
`assets/level96/cloth-native.png`, the directly authored
`assets/loom106/cloth-native.png`, its 8× nearest-neighbor view
`assets/loom106/cloth-native-8x.png`, the art contract, and
`tools/art/loom/prepare-loom106.py`. The source canvas and output are both
48 × 80; native pixels are authored directly, with no resize, grid detector, or
painted source rescue. The storm/cloud/lightning motif is retained. Restrained
sky/cloud/linen palette roles and deliberate diagonal warp/weft clusters add
readable textile structure. Warm selvage and opaque fabric contrast with the
transparent atlas margin. The source has matching detail density for its
96 × 160 world-unit footprint.

## Processed/runtime gate

**Accepted.** Inspected
final production-input screenshots and their authoritative state in
`assets/loom106/evidence/route.json`. The route wins with all three heroes at
3 HP, no page errors, and 79.6833 simulated seconds. Evidence inspected:

- `assets/loom106/evidence/weave-start-1x.png` and the final route's unstarted
  `second-thread-seated-1x.png`: empty mount followed by a visible low band.
- `assets/loom106/evidence/weave-quarter-2x.png` and
  `assets/loom106/evidence/weave-half-2x.png`: authored shuttle, gold feed, and
  progressively retained woven rows.
- `assets/loom106/evidence/weave-threequarters-landscape.png`: compact mobile
  view retains the warm textile edge and storm pattern.
- `assets/loom106/evidence/sky-repaired-1x.png` and
  `assets/loom106/evidence/sky-repaired-portrait.png`: finished artwork retains
  native clusters, color identity, and hanging contact with the supported beam.
- `assets/loom106/evidence/reset-landscape.png`: reset logic confirmed, but this
  screenshot frames the heroes at spawn rather than the textile.

The captured active passes include both directions: start has direction −1 at
progress 0.09625; quarter and half have direction +1 at progress 0.34708 and
0.59792; threequarters has direction −1 at progress 0.85167. Each band is four
native rows, within the actual 36 × 72 opaque footprint. Completed rows remain
visible and the final 72 rows reproduce the source at two world units per pixel.
The matching linen yarn reads as thread being fed to the fabric, rather than
the previous unrelated turquoise cable. The fixed frame and attachment remain
in place throughout, and the animated shuttle stays at the leading stitch.

An anticipated turn jump was corrected before the final route: vertical needle
travel uses `80 - progress * 72`, preserving continuous motion across all 17
turns; final screenshots show this updated placement and the focused regression
checks adjacent positions at every turn. World drawing snaps the placement to
the existing native grid. No gameplay mechanics changed.

The initially missing reset object evidence was supplied and independently
inspected: `assets/loom106/evidence/reset-textile-1x.png`,
`assets/loom106/evidence/reset-textile-2x.png`, and
`assets/loom106/evidence/reset-textile-landscape.png`. The supported frame
remains while the entire textile and working shuttle disappear after restart.
`assets/loom106/evidence/reset-textile.json` records zero weave, no docked
bobbin, zero completed rows, paused state, and no errors. Inspected
`tests/browser/loom106-reset.mjs`: it uses the actual restart control and only
overrides the camera target for inspection, with no simulation or progression
mutation. This closes the reset evidence gap.

## Verdict

Both the native-density/source and processed/in-game gates are accepted for
this bounded textile reveal correction. The raw native motif, directly authored
textile, actual 1×/2× gameplay and mobile views have been reviewed. The normal
input route and reset observation support unchanged puzzle causality and
completion. Release/build/deployment verification remains the publishing
agent's responsibility.
