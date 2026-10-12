# Clockwork69 art package

All images were generated with the built-in imagegen tool. Original sources and
exact prompts are retained here. Runtime images are processed once from those
sources with tools/prepare-clockwork69.py. Review gates: CLOCKWORK-REVIEW.md.

| Original | Exact prompt | Runtime | Native dimensions |
| --- | --- | --- | --- |
| brainstorm.png | clockConceptPrompt.md | concept only | 1774x887 |
| source-parts.png | clockPartsPrompt.md | parts.png | 4x2 cells96x96 |
| source-machine.png | clockMachinePrompt.md | machine.png | 4x2 cells96x104 |
| source-dock.png | clockDockPrompt.md | dock.png | 4x1 cells160x224 |
| source-pin.png | clockPinPrompt.md | pin.png | 4x1 cells32x56 |
| source-catch.png | clockCatchPrompt.md | catch.png | 4x1 cells48x80 |
| source-scene.png | clockScenePrompt.md | scene.png | 768x512 |

One native pixel occupies two world units. Registered bases and source-to-world
anchors are in registration.json. The wheel uses96cells for clear margins around
its80native-pixel diameter and adult interior. The chain/vent source keeps its
actual aspect in padded96x104cells. The incorrect filled dock in the first
machine generation is not used; it was replaced by the separate open dock.
The catch's misplaced middle-hook pose is not used; its generated extended and
released hook, spring and base are registered components for a smooth native
stroke. No per-frame silhouette scaling or universal256square normalization.
