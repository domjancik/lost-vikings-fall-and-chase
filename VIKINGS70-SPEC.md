# Viking locomotion correction

Keep the Vikings63 identity, material depth, adult height and existing ability
poses. Replace idle, walking and climbing; add Olaf's separate front-held walk,
overhead-held walk and draft/glide/braking poses. The same14x24native shield is
used everywhere at28x48world dimensions. Forward palm native40,50 reaches the
existing handle/left edge; overhead palms26/38,29 reach its underside. Front
shield draws before the gripping forearm, overhead after its supporting hands.

Native pixel2world units, cell64x64, sole62, draw origin32,40, pelvis32,48.
Erik36native tall, Baleog38, Olaf36. Generated source may enlarge these native
clusters, never add painted details. Retain original/exact prompts and normalize
one uniform scale per hero once from the original. Register torso/pelvis by
translation; never re-anchor climb from a moving boot's lowest alpha.

Erik/Baleog4x4cells: run0..7, quiet idle8..11, rear climb12..15.
Olaf8x4cells: front walk0..7, overhead walk8..15, front idle16..19,
rear climb20..23, overhead brace24..27, draft/glide/glide/brake28..31.
Breathing may change chest shading/one shoulder pixel, never displace the
entire body/head/boots or sway several world units. Idle freezes body silhouette
outside a small registered tunic region if generated variants introduce drift.
Run uses four deliberate contact/compression/passing/swing poses rather than duplicating an eight-frame claim; phase advances with travel and each pose spans two distance ticks. Preserve foot transfer, stable torso and consistent
planted-foot height. Climb faces into the ladder, uses travel-driven phase,
freezes its reached pose on stop and resumes without a phase reset.

Test source/native head/sole/hip stability, explicit shield-state selection,
float-state selection and climb phase. Review source density separately from
actual1x/2x/mobile grounded walk, idle, climb, forward grip, overhead walk,
float and mirror evidence. Keep unrelated working changes. Save in Git and
publish an isolated release only after the independent visual gate passes.

Final registration uses the highest connected neutral-steel helmet component,
excluding cream collars and grey trousers. Rear climb helmet roots: Erik/Baleog28,
Olaf26. Floating palms start at native26 under the shield's native29 underside;
airborne boots do not set the pivot. Erik's authored head and central torso stay
fixed across gait frames; his outer arm and leg transfers remain animated. Front
shield is slung on Olaf's back during climbing; a raised shield keeps its actual
support plane. These are equipment poses, not additional selectable shield modes.

Reproduce: tools/pixel-fixer-venv/Scripts/python.exe tools/prepare-vikings70.py,
then tools/validate-vikings70.py. Run npm test and the browser-vikings70 gait,
poses, flight and Clockwork route drivers against the isolated port3017 release.
