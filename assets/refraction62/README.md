# Refraction62 native assets

Original concept panel2 retained in brainstorm.png; refined design in sketch.png.
The initial machines-source.png and mirrors-source.png are rejected and unused.
Accepted sources: machines-coarse-source.png, parts-source.png, scene-source.png.
Prompts retained verbatim in PROMPTS.md. Native source-density gate and processed
runtime gate are recorded separately in REFRACTION-REVIEW.md.

`tools/prepare-refraction62.py` samples each accepted source once, uniformly with
NEAREST. No pixel-grid detection or iterative resampling. Machine atlas256×192
is4×3 of64-native cells,128-world each. Broad feet register by translation only.
Parts use a common square crop around the authored row, not individual bounding
box scaling. Original square art-density was accepted independently. Alpha
normalizes once to binary; retain the connected physical sprite to exclude
detached pixels accidentally entering margins from neighboring generated rows.
No meaningful connected art is recolored or resized. The validator requires
connected silhouettes and broad foot coverage, not a few false bottom pixels.

Base bronze hinge center measured32,27 after bottom registration; world optical
pivot lies74 above floor. Upper mirror hangs from its bracket with base inverted,
so incoming light hits the reflector before any solid pedestal/deck. Reflector
bar alone is centered on its cyan reflecting edge, native64×64. Native raster
angle frames use that same authoritative plane; each world pixel stays2 units.
Lift front walking rim measured native33, not its rear railing or cell bottom.
Nine-slice extension makes its deck160 wide without changing native pixel scale.

Scene2079×756 becomes1400×509 once, maintaining landscape aspect and density.
Draw2800×1018world. Foundation measured native413, anchored at worldfloor900;
foreground stone hides boundary irregularities. Background is subdued, parallax
horizontal only so physical foundation cannot float with vertical camera motion.
