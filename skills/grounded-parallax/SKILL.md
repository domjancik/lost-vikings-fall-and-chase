---
name: grounded-parallax
description: Author layered pixel-art environments with horizontal and vertical parallax, readable depth and grounded human-scale architecture. Use for scene backgrounds, midground, wall tiles and their camera transforms.
---

# Layered environments that stay physically coherent

User-approved reference: Ember Freight's climb above the depot reveals an expansive
sky and city. Compose upper routes to earn comparable changes of view, with
substantial connected architecture below and quieter distant depth above.

Before artwork, assign each plane its native size, fixed world footprint,
perspective depth, camera response on both axes, and physical attachment. Apply
[native-sprite-art](../native-sprite-art/SKILL.md) to source density and quality.
Viewport/zoom changes the view, not the furniture or native grid. Preserve aspect;
never force unrelated scenes into a universal square or hide rough art by zooming.

Far layers carry atmosphere and distant large structure; middle layers establish
inhabited service galleries and room identity; foreground contains collision,
devices and grounded material edges. The user prefers substantial connected
architecture and occasional quiet intermediate structure, not a few harsh object
cutouts over a blurred picture. Keep ordinary distant references smaller than
their equally placed foreground equivalents. Vikings are adult humans.

Move depth planes on x AND y, with the far plane moving slowest. A building and
its foundation share one transform. Floor-standing midground props either stay
fixed to their actual support or belong to a complete independently anchored
plane; translating their bottoms separately creates floating scenery. Hanging
fixtures attach visibly to a ceiling beam. Identify actual opaque mounting/base
pixels, not transparent cell edges or shadows. Derive every cable/pipe terminal
after final registration. Check both endpoints throughout movement.

Use opaque structure with real transparent gaps, not low-opacity duplicate scenes
that produce ghost buildings. Remove baked smoke, fire and moving machinery from
static planes; draw their authored animation separately. Smooth simulation may
remain continuous, but final camera, sprite and effect positions use the native
pixel grid. Nearest-neighbor enlargement preserves it. If reducing source scenes,
use their intended native density and avoid averaging across contrasting edges;
filtering cannot rescue a badly generated grid.

Ground surfaces use coherent top, side, corner and quiet infill tiles. Reserve
strong detail for edges and key features; infill repetition should recede. Avoid
garish identical motifs, detached platform posts and wall patches resembling
unannounced passages. Keep static scenery subordinate to active puzzle targets.

Decorative wall tiles establish connected room enclosures behind actors at
foreground world coordinates; they add no collision. Do not substitute arbitrary
brick patches in platform infill for room walls. Use intentional openings,
visible structural boundaries and coherent materials; preserve readable hazards,
targets and support contacts. Review the complete room rather than tile variety.

Review complete layers, then actual gameplay 1x/2x and mobile with x/y camera
travel, upper routes, left/right edges and every support. Reject gaps, distorted
scale, doubled transparent planes, edge halos and native-grid drift. Record
specific evidence under the repo's [visual gate](../../docs/standards/VISUAL-REVIEW-GATE.md).
