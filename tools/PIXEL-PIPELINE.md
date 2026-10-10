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
