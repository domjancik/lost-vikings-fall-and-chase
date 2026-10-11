# Native registration

Sources are unmodified imagegen outputs. `tools/prepare-cycle52.py` reconstructs
each runtime asset directly from the source, using the corrected positive-weight
pixel-art-fixer packer, never a previously reduced image.

- Scene:1066×600 native, drawn at2132×1200 world units; foundation anchored1120.
- Mechanisms:4×4 cells of32×32; floor bases registered atrow31.
- Fan:four64×64 native frames;128×128world.
- Ladder:16×40native;32×80world, cropped last segment, exact500..1120range.
- Carrier:80×32native;160×64world. Rear railing atrow2; walking rim atrow8.
  Draw at collisionY−16 so rider feet contact the real deck.

All runtime alpha is binary. All destinations and animated particles snap to the
shared2world-unit grid. Physics positions remain continuous. No forced256×256
scene resolution; no separate per-frame resizes.
