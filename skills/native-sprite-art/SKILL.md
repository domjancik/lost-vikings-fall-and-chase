---
name: native-sprite-art
description: Generate and review pixel-art game sprites at the native pixel density of their intended runtime size. Use for characters, equipment, animated props, terrain tiles and replacement sprite sheets in this repository.
---

# Match the sprite to its display resolution

Before generating, record the intended world/display dimensions, game pixel
size, native cell dimensions, opaque subject height and animation anchors.
For this engine one native pixel occupies2world units. A72world-unit person
therefore needs36deliberate native pixels of height, not a detailed painted
figure reduced from hundreds of pixels.

Generate the subject at that **native detail density**. A larger output file
may show a nearest-neighbor enlargement of those pixels; it must not introduce
extra hair strands, shading, mail textures or subpixel outlines. State native
dimensions, a limited palette and flat readable pixel clusters in the prompt.
Generated output dimensions do not prove native density; inspect the artwork.

Never rely on pixel-grid detection, quantization or downsampling to rescue
artwork designed at a fundamentally higher resolution. Reject and regenerate
that source. Do not force unrelated assets into a universal256square, change
world scale to disguise bad art, or repeatedly process a processed sprite.

Use the retained original source once. Normalize the sheet's scale consistently;
register pivots/soles by translation, never stretch each frame to its alpha box.
Keep original art, exact prompts and native/runtime dimensions in the repository.

## Mandatory review gate

Before replacing or publishing an asset, provide the critique reviewer:

1. Raw source alongside its intended native-size view. Confirm the source
   genuinely has matching detail density before any grid-processing step.
2. Source-to-runtime comparison at the same apparent size, plus an enlarged
   nearest-neighbor view. Reject lost features, isolated noise pixels, broken
   outlines, changed silhouettes, inconsistent pixel sizes and damaged alpha.
3. Actual production gameplay at1x and2x, including mobile where relevant;
   not just an isolated sheet or large art preview. Readability at gameplay
   size takes precedence over the attractive enlarged image.
4. All key poses, mirror direction, contacts, extreme equipment bounds and
   stable dimensions. Grounded soles and supports must meet physical surfaces.

The review record must explicitly accept the **native-density/source gate**
and the **processed/in-game gate** separately. Passing image dimensions,
alpha tests or gameplay completion cannot substitute for either visual gate.
If either fails, correct the art and repeat the affected evidence before
publishing. User approval is not required for this internal correction loop.
