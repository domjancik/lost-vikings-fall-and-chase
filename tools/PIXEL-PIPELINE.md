# Pixel asset pipeline

Use the patched Retro-Diffusion/pixel-art-fixer checkout in `tools/pixel-art-fixer/python`. Source mappings, output dimensions and inventory atlas partitions are in `tools/pixel-assets.json`; this must cover every PNG in the publisher manifest. Generated originals remain under the default Codex generated-images directory; `--source-root` overrides that directory.

## Commands (Windows workspace)

```powershell
tools/pixel-fixer-venv/Scripts/python.exe tools/test-pixel-pipeline.py
tools/pixel-fixer-venv/Scripts/python.exe tools/rebuild-pixel-assets.py
tools/pixel-fixer-venv/Scripts/python.exe tools/rebuild-pixel-assets.py --check
```

`--only story-near` restricts a rebuild or check to matching assets. The full rebuild stages all files and validates them before installation. Never normalize already normalized artwork: always rebuild from originals. Keep output sizes and atlas partitions fixed. Alpha remains binary. Backups and the per-asset report live in `output/pixel-pipeline44/`.

## Confirmed defect and repair

The original triangular weights in `two_stage_pack` could become negative at fractional source-cell edges. For example, packing a 1774×887 source into 1024×512 generated false colored pixels and broken dark lines on the observatory columns. A negative weighted average can extrapolate beyond every source color, then clip to 0 or 255.

Both one-dimensional triangular weights are now clamped to zero before their product; the existing positive epsilon ensures every source sample can vote. Cell ownership, dimensions and alpha handling stay unchanged. Each resulting color is a convex average of source colors. The rebuild rejects any channel outside the min/max range of that output cell's original source pixels; it also validates dimensions and binary alpha. `pixel-pipeline.test.js` runs the fractional-ratio Python regression from `npm test` when the bundled environment is present.

This is a local patch to the vendor checkout. Preserve it when updating pixel-art-fixer and run the regression before rebuilding. No upstream release is assumed to contain the repair.

The unrelated grid43 distant-background scale changes were reverted. Normalization is the repair; graphics are not enlarged to hide defects. Module and image cache keys use `pipeline44` so the browser fetches rebuilt graphics.

## Verification

All 43 published graphics rebuilt from their latest original sources and passed color-bounds, alpha and dimension checks. The rebuilt chapter-six observatory atlas has zero out-of-source-range colors (74,471 before; includes transparent RGB). Before/after screenshots: `output/playwright/observatory-artifact-zoom-2.png` and `output/playwright/observatory-fixed44-zoom-2.png`. Full game regression: 173 tests, zero failures and zero skips.

## Display-sized scenery grids (native47)

Full scenes must not use a fixed256×256 cell or a sprite-atlas resolution policy. The active Arcade parallax plates have scene-specific720-wide grids (405/360/480/720 tall), drawn at their established scale. The retired old Story atlas is not used by the rebuilt campaign.

New Story sources remain unmodified768×512 crops. `scene-resolution.js` computes the intended far-scene coverage from viewport dimensions, then chooses an exact3:2 display raster, rounded only enough to maintain whole rows/columns. `story-render.js` prepares that grid directly from the original source pixels once per scene/size and caches at most12 canvases. Every prepared pixel renders at two world units. Reduction uses nonnegative center weights plus a positive epsilon; RGB cannot escape each source cell's bounds. Larger views duplicate source samples, preserving detail available in the source. Never magnify scenery because a resolution bucket was crossed. Camera travel, framing, and supports retain their established relationships. Native crops used by the canopy reveal remain full resolution.

Tests cover fractional cell boundaries, no invented colors, identity preparation, both zooms, portrait and ultrawide displays, tight coverage bounds around width thresholds, and the full-resolution canopy crop. `browser-native47.js` captures every chapter at both zooms and checks that source pixels map to exactly two world units.

## Contrast-aware scenery sampling(edge67)

Positive weights prevent overshoot but still mix unrelated high-contrast colors.
Use scene-resolution.js guarded center-color resampling for campaign far scenes
and tools/prepare-scale67.py for middle-plane assets. Default48-channel color
limit excludes distant colors; smooth positive range weights blend nearby tones.
Always use retained originals once at existing native/display dimensions, with
binary-alpha crossings excluded. Original8middlefoundation offsets must survive.
Do not apply this as repeated sharpening/filtering of already-packed assets or
as a rescue for character/sprite source density. Source67 README records sources,
comparison controls, limitations and rebuild commands.
