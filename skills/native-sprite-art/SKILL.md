---
name: native-sprite-art
description: Generate and review pixel-art game sprites at the native pixel density of their intended runtime size. Use for characters, equipment, animated props, terrain tiles and replacement sprite sheets in this repository.
---

# Match the sprite to its display resolution

Before generating, record the intended world/display dimensions, game pixel
size, native cell dimensions, opaque subject height and animation anchors.
For this engine one native pixel occupies 2 world units. A 72-world-unit person
therefore needs 36 deliberate native pixels of height, not a detailed painted
figure reduced from hundreds of pixels.

Generate the subject at that **native detail density**. A larger output file
may show a nearest-neighbor enlargement of those pixels; it must not introduce
extra hair strands, shading, mail textures or subpixel outlines. State native
dimensions, a limited palette and solid readable pixel clusters in the prompt.
Generated output dimensions do not prove native density; inspect the artwork.

Never rely on pixel-grid detection, quantization or downsampling to rescue
artwork designed at a fundamentally higher resolution. Reject and regenerate
that source. Do not force unrelated assets into a universal 256×256 square, change
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
3. Actual production gameplay at 1x and 2x, including mobile where relevant;
   not just an isolated sheet or large art preview. Readability at gameplay
   size takes precedence over the attractive enlarged image.
4. All key poses, mirror direction, contacts, extreme equipment bounds and
   stable dimensions. Grounded soles and supports must meet physical surfaces.

The review record must explicitly accept the **native-density/source gate**
and the **processed/in-game gate** separately. Passing image dimensions,
alpha tests or gameplay completion cannot substitute for either visual gate.
If either fails, correct the art and repeat the affected evidence before
publishing. User approval is not required for this internal correction loop.

Record the target dimensions, source paths, evidence paths and each gate's
verdict in the relevant review log. Have the critique subagent apply
[the repository visual review gate](../../VISUAL-REVIEW-GATE.md); leave a
failed or missing gate pending until corrected evidence is reviewed.

## Guided animation anatomy

For articulated sprites, prefer native procedural pose/occlusion guides plus
imagegen material rendering. Guides must include limb identities, near/far depth,
foot contacts, shoulder/elbow/hand chains and stable equipment anchors. A guide
is not proof the generated render preserved the motion. Reject duplicate hands,
near legs that never exchange front/back, opaque connected alpha fringe, belt
splice seams and frozen torso/shoulder holds. Do not repair them by pasting fixed
body rows onto separately generated gait legs. Idle should allow subtle whole
torso/head breathing with planted feet; look poses need head/neck orientation.
Shield face must occlude its gripping palm, with unchanged physical dimensions.

## The pixel-art quality the user prefers

Use Inside the Clockwork as the material/volume benchmark for this game:
dimensional worn iron, restrained bronze, coherent light, exposed working parts,
and characters with weight and personality. Deliberate clusters should describe
planes, bevels and silhouette, rather than mottled noise or painted blur. Richness
comes from purposeful structure, not tiny isolated highlights on every surface.
Reject both flat cartoon simplification and high-resolution painterly texture.

Define native canvas, occupied subject size, palette roles, light direction and
anchor before generation. At actual gameplay size, check recognizable materials,
clean outline ownership, contrast hierarchy and readable negative space. Source
alpha is genuinely transparent around objects; keep opaque materials opaque.
Keep art scale consistent with adult humans and neighboring sprites.

For animation, motion guides establish anatomy and causal geometry; imagegen
supplies final character/material art. Frame registration cannot repair invented
limbs, missed poses or mismatched density. Use complete authored state/frame sets
for machines, with steady equipment size and continuous mechanical transfer.

For layer placement, apply [grounded-parallax](../grounded-parallax/SKILL.md).
For new rooms, apply [cooperative-world-design](../cooperative-world-design/SKILL.md).
