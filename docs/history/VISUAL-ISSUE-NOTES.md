# Visual issues

## Foreground/background artifact pixels — pipeline44

Confirmed with the user in campaign chapter 6, The False Summit: colored speckles and broken dark streaks on observatory stone columns and doorway details. Earlier grid43 attribution to background scale was incorrect, and that rendering change has been reverted.

Root cause: negative triangular sampling weights in the pixel-art-fixer normalization step at noninteger ratios. Original artwork was compared cell by cell with the normalized atlas; some normalized colors were outside every color in their source cell. Both axis weights are now nonnegative. Rebuilt all 43 published graphics from originals and verified zero out-of-source-range pixels, unchanged dimensions and binary alpha.

The reproducible pipeline, regression and maintenance instructions are documented in tools/PIXEL-PIPELINE.md. Marked original capture: output/playwright/observatory-marked.png. Repaired capture: output/playwright/observatory-fixed44-zoom-2.png.

## Far scenery framing — far45

Story far plates now fit the viewport with 8% overscan instead of a fixed 1200-world-unit size. Their apparent scale stays constant across gameplay zoom levels. Horizontal tiling follows slow 0.16 parallax; vertical drift is bounded by the available image margin so camera movement cannot uncover empty sky. Near architecture and world geometry retain their sizing. Tested all eight chapters at both zooms, portrait, and layout coverage at negative/high/low camera positions and ultrawide widths. Full suite: 176 tests passed. Pixel asset validation: all 43 files still pass; normalization remains pipeline44.
