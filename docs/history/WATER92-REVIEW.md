# WATER92 independent visual review

Reviewer: independent critique agent. Publication status: **visual gates accepted for final WATER92 candidate**. Live publication/hash verification remains the publishing agent's final check.

Reviewed instructions: `AGENTS.md`, `skills/native-sprite-art/SKILL.md`, `VISUAL-REVIEW-GATE.md`, `WATER92-SPEC.md`.

## Targets and anchors

One native pixel equals two world units. Machinery uses a 384×288 native atlas of twelve 96×96 cells (192×192 world per cell), preserving WATER87 layout, registered broad bases, cavities and final connection ports. Cradle uses 128×128 native (256×256 world), preserving its open cavity and reviewed seat/feet. Background uses 960×640 native (1920×1280 world). Terrain source/runtime atlas is 256×256 (8×8 cells of32×32), with eight selected tile roles explicitly mapped and a continuous first opaque walking row. Vegetation uses four 32×48 clumps in two sway rows of a 128×96 native sheet, with stationary root anchors. Subject heights must follow retained registration; no scale change or per-frame stretching may disguise a mismatch.

## Initial reference critique

Inspected `assets/warden86/concept-raw.png`, `assets/water87/machines-native-v2-4x.png`, `assets/water83/scene-raw.png`, and WATER87 machine/cradle registration records.

Warden86 establishes heavy dark iron housing, broad worn bronze plate planes, inset fasteners, recessed mechanisms, exposed dark hoses and structural supports. Its bright copper/brass appears on meaningful worn edges and connectors, not uniformly around every outline. That construction and material hierarchy is the benchmark; copying its high-resolution texture density is inappropriate for 96-pixel cells.

WATER87 machinery fails the requested material fidelity: bright gold rims and smoothly shaded teal tubes read as polished toy equipment. Wear is not organized around joints, plate faces and working edges. Replacement must author readable plate construction and large restrained corrosion clusters, rather than tinting or quantizing this source.

WATER83 background has strong foundry architecture, but its many tiny illuminated fittings, flecked surfaces and soft distant planes risk noise or blur when reduced to 960×640. A new source needs deliberate clusters at its target density and broad submerged foundations. The intended walking plane must agree visibly with wet foreground stone/iron, with no exposed background gap.

## Source gate: ACCEPT (all selected v2 sources)

Corrected sources inspected raw at original size alongside their intended native proofs:

- `extras-raw-v2.png` / `extras-native-proof-v2.png`: **ACCEPT**. Broad hard iron/rust faces, logical rivets and restrained bronze bands survive at the 128×128 cradle/96×96 nozzle density. Open central cradle cavity and nozzle mouth remain clear. Pack/runtime registration remains separate.
- `flora-raw-v2.png` / `flora-native-proof-v2.png`: **ACCEPT**. Simple 3-tone blade clusters replace fine ribs. Branch families match between sway rows; roots are readable. Actual animation must register identical root bases and bend only exposed fronds.
- `terrain-raw-v2.png` / `terrain-native-proof-v2.png`: **ACCEPT**. Large basalt courses, horizontal mortar, attached algae and restrained iron lintels now agree with background masonry, with readable 32-pixel cell clusters and no baked ripple texture. Actual selected role mapping, first opaque walking row and tile joins still need runtime review.

All required categories have accepted source candidates: machinery v2, scene v2, extras v2, flora v2 and terrain v2. Earlier failures below are retained as provenance, not current acceptance.

Packing geometry follow-up: extras v2 acceptance covers source density/material only. Root's uniform-scale measurement found cradle overflowing its logical 128-cell footprint and nozzle undersized on the same canvas basis. **Extras v2 cannot be used as a production packed source.** Separate exact128 cradle/exact96 nozzle generation is required; final individual sources need density review and processed anchor checks. No per-object scaling/stretching or clipping may force them into cells.

Inspected `cradle-raw-v3.png` / `cradle-native-proof-v3.png` (128×128) and `nozzle-raw-v3.png` / `nozzle-native-proof-v3.png` (96×96): **ACCEPT native density/material**. Hard large clusters retain iron/rust/bronze at their individual canvas scale and the cradle has a clear open cavity. Nozzle mouth appears dark filled in raw/proof; central aperture alpha must be inspected/corrected before processed approval. Cradle seat/feet and nozzle inlet/outlet placement remain pending.

Nozzle clarification accepted: root confirmed original WATER87 source/guide and existing art test intentionally retain an opaque dark inner-pipe pixel at 48,85. A recessed pressure-nozzle interior is structurally appropriate; transparency in the generation prompt was imprecise. Preserve the dark cavity and show water emerging behind the bronze lip at its registered outlet. Mouth opacity itself is not a blocker; actual outlet/stream seating remains required.

Additional source/native proof review:

- `scene-raw-v2.png` / `scene-native-proof-v2.png`: **ACCEPT** native density, material and source construction. Continuous opaque masonry replaces v1 water/reflections. Large stone blocks, restrained iron wear, hard architecture and low-contrast distant silhouettes remain readable at 960×640. Runtime camera/parallax and foundation contact remain pending.
- `extras-raw-v1.png` / `extras-native-proof-v1.png` (256×128): **FAIL native density**. Substantial iron construction and open cradle cavity are appropriate, but raw column faces/beam/rust/nozzle contain fine speckle and layered highlights below intended 128-pixel cradle density; native proof collapses that into stipple. Regenerate coherent coarse clusters and flat 3–4-tone faces, preserving open cavity, feet, seat and nozzle anchors. Retain source/prompt provenance.
- `flora-raw-v1.png` / `flora-native-proof-v1.png` (128×96, 32×48 cells): **FAIL native density and sway consistency**. Fine leaf rib/checker texture in the large raw becomes noise rather than readable blades at 32×48. First species lower-row silhouette also changes branch family/height rather than gently swaying the same clump. Use a few simple leaf blades with 2–3 deliberate tone planes, fixed roots and identical branch ownership/leaf count between poses.
- `terrain-raw-v1.png` / `terrain-native-proof-v1.png` (256×256): native density direction is acceptable, but **FAIL material/construction**. It reads as an iron panel wall sheet rather than wet basalt masonry under iron lintels. Diagonal scrawl on several faces and baked reflective water on the lowest row conflict with quiet horizontal stone infill and dynamic water. Regenerate recognizable dark stone blocks/mortar with restrained iron seams, continuous opaque walking tops and quiet infill. Do not use static ripple cells.

Inspected `assets/water92/machines-raw-v2.png` at original resolution alongside `assets/water92/machines-native-proof-v2.png` (384×288). Machine v2 source is **accepted for native-density and material direction**. Compared with v1, dominant outlines, rivets, threaded shaft, bronze bands and iron/corrosion planes use coherent coarse logical clusters. The native proof preserves meaningful structural features rather than turning fine painted texture into sparkle. Iron body mass and restrained old bronze/copper now agree with Warden86. Residual fine alpha/perimeter specks require processed cleanup comparison; this is not approval of layout, anchors or runtime art.

Inspected `assets/water92/scene-raw-v1.png` (1536×1024) alongside `assets/water92/scene-native-proof-v1.png` (960×640). Source density direction is acceptable: masonry blocks and iron bands have hard clustered edges, architectural silhouettes remain clear at native size, and the far atmospheric planes remain restrained. **Background v1 fails construction** because static reflective water occupies the lower quarter, obscuring rather than establishing continuous submerged foundations. Correct by retaining coarse foundry architecture and extending opaque masonry footings to the bottom without baked water/reflections. Re-review corrected source before acceptance.

### Rejected machine v1 retained for provenance

Inspected `assets/water92/machines-raw-v1.png` at original resolution, `assets/water92/machines-native-proof-v1.png` at 384×288 intended native size, and exact `assets/water92/machines-prompt-v1.txt`. The proof is diagnostic, not approved production processing. Raw is 1448×1086 rather than a uniform integer enlargement of 384×288.

Material direction is substantially closer to Warden86: iron dominates body mass, bronze edges are worn and restrained, bell hoses are visible, housings have rivets and recessed mechanical faces. This direction should be preserved. However, the raw contains fine uneven rust flecks, smooth/antialiased transitions and many tiny outline/face details below the intended logical pixel density. Reduced proof turns these into scattered copper/gray single-pixel sparkle. Broad intentional corrosion planes and hard material clusters have not replaced fine texture. A visually appealing reduced proof does not approve a painted source needing reduction.

Required correction: regenerate with uniformly enlarged logical pixels, flat 3-tone iron planes, a small number of purposeful 3–8-native-pixel rust clusters along wet seams, readable plate divisions and rivets; retain dark hoses, open cavities and new material hierarchy. No texture dithering, smooth gradients or tiny paint scratches. Whole-object position/bounds also drift from the guide; production layout, chain closure and anchor registration require their own processed/runtime evidence.

Required evidence for corrected candidates: retained originals and exact prompts; raw alongside intended native-size view; same-apparent-size original/processed comparison; nearest-neighbor enlargement. Reject painted high-resolution source, inconsistent pixel widths, soft shading, lost mechanical features, scattered corrosion pixels, changed cavities or anchors. Source dimensions alone cannot establish acceptance.

## Processed/in-game gate: ACCEPT

Preliminary packed machinery comparison inspected `assets/water92/machines-native-4x.png` and `assets/water92/registration.json` against raw v2/native proof. Twelve silhouettes retain broad bell feet/wheels, open cavities, readable spoke gaps, thread and material hierarchy. No dominant mechanical feature loss or neighboring-cell spill is visible. Open chain halves still require the actual secured closure state. This preliminary pack review does not establish actual grounding, port contact, motion/state registration, mirroring or gameplay readability.

Inspected `assets/water92/ports-pocket-proof.png` and `assets/water92/chain-closure-proof.png`: **ACCEPT preliminary processed anchors/closure**. Axis crosshairs seat in recessed crank/valve/wheel centers, pipe terminals meet opaque collars, bell top ports meet their caps, and revised pocket rectangles exclude lower corner alpha. Coupling at the retaining-chain apex visually joins both halves into a continuous secured arch. Actual hoses after grounding, all wheel/shaft states, curved clear-air water boundaries and before/after chain state remain runtime requirements.

### Provisional runtime appearance: correction required

Inspected `output/playwright/water92-initial-1x.png`, `water92-initial-2x.png`, `water92-mobile-1x.png`, `water92-fixed-air.png`, `water92-shield-intake.png`, `water92-drained.png`. These preliminary captures contain old WATER87 cradle/nozzle and cannot approve final assets. New background, terrain and iron machines read as coherent foundry materials, and rooted vegetation fits scale. However, surface water predominantly reads as two long parallel cyan rules with stepped joins; irregular moving ripples/reflections need to break this geometric dominance. Bright four-point cyan bubbles read as sparks/diamonds rather than rising air. Clear pocket interiors are differentiated from surrounding tint, but menisci read as a U bracket with small stepped corners, requiring a more curved lip and water-edge shading. Correct effects before final runtime evidence. Route success does not waive these visible issues.

### Final candidate evidence and decision

Final individual cradle/nozzle packing inspected in `assets/water92/cradle-native-4x.png`, `nozzle-native-4x.png`, and their registration files. Packed plants inspected in `flora-native-4x.png`. Source-to-native structure and material hierarchy survive uniform normalization without lost cavities, blade connections, neighboring-cell spill or disconnected fringe. Grounded props retain hard native outlines and broad bases; exposed ports seat in the final placements.

Inspected regenerated actual `output/playwright/water92-*` captures:

- `initial-1x`, `initial-2x`, `mobile-1x`, `mobile-2x`: native terrain/background/material continuity, opaque first walking row, adult Viking scale and planted contacts. Camera views remain pixel clustered; foreground wet basalt agrees with foundry masonry.
- `stream-outside`, `stream-partial`, `stream-near`, `shield-intake`, `shield-intake-1x`: visible flow persists above the shield, progressively attenuates below overlap and has irregular native edges. Nozzle stream emerges from its dark inner mouth behind the lip. Surface uses fragmented glints/ripples rather than twin bright rulers; hollow varied bubbles now read as rising air rather than sparks. Caustic/refraction clusters remain restrained behind readable subjects.
- `fixed-air`, `air-towed`: breathable cavities remain visually clear against water tint, with shaded sides and broken curved lip highlights. Bell housings remain grounded and cavity bounds stay within open art.
- `valve-before`, `valve-after`, `gate-before-visible`, `gate-middle-visible`, `gate-open-visible`: actual wheel/rod/gate changes are visible on the same machines and keep registered mounts/ports. Intermediate travel is represented, and completed state remains held.
- `chain-before`, `chain-cut`, `crank-half`, `crank-half-1x`, `crank-half-mobile`, `crank-complete`: secured chain opens visibly, rotating wheel/threaded rod progress stays coherent, and sluice cover changes from closed to open. Cradle and mechanism feet meet native floor strips at desktop/mobile size.
- `berth-approach`, `berth-contact`, `drain-middle`, `drained`: full pontoon descent is supported above the machinery, and draining leaves a readable cradle berth with actuator/bell clearance.
- `olaf-deep-before-release`, `olaf-rise-2`, `olaf-rise-14`, `olaf-rise-29`: released submerged Olaf rises through intermediate depths and settles at the surface; no visual teleport or direct surface snap.
- `right-dock-before-exit`, `all-exit`: causal team transfer/reunion and healthy actual completion.

Initial final-art berth review identified a perceived gap: near-black narrowing underside rows were being used as the pontoon contact rather than its broad gray structural soles. Correction uses native visible-foot baseline88, seat800 and one authoritative deck752 for artwork/riders/ports; dark under-outline ends808 and enters the cradle beam. Inspected `output/water92/contact-native-4x.png`, `contact-2x-actual.png`, `contact-2x-marked.png`, `contact-1x-actual.png`, and clean unpaused `contact-mobile-actual.png`. **ACCEPT corrected contact**: four broad buoy undersides meet the cradle's dark structural top strip, with no exposed background gap beneath them. No scale change or patched silhouette was used. Discarded paused mobile evidence does not establish acceptance.

Verification inspected in `output/water92/verification.json`, `unit-tests.txt`, `contact-proof.json` and compact actual route result in `water-route.json`: 394 unit checks pass, 6 art checks pass, ordinary-control water routes clear at60/120Hz with full crew health, and the final actual browser run wins at117.133 seconds with HP3/3/3 and no page errors. Tests include continuous shield entry/exit attenuation, bounded buoyancy, reversible partial crank travel, cavity confinement and supported descent. These corroborate the reviewed visual state/contact evidence; they were not used to waive it.

Both required visual gates are accepted for the selected machinery/background/terrain/flora v2 and individual cradle/nozzle v3 sources and final registered candidate. Preserve exact prompts, rejected originals and final evidence. Re-review if art or registrations change after this acceptance.

## Publication decision

**Source gate ACCEPT. Processed/in-game gate ACCEPT.** This acceptance follows corrected source, processed and actual desktop1x/2x/mobile evidence, including repaired pontoon contact. Publish the reviewed candidate only, then verify live hashes/gameplay. Previous WATER87 approval, automated alpha/dimension checks and route success alone did not establish either verdict.
