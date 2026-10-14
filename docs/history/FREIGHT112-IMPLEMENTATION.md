# Ember Freight hardware correction

Implemented static native fan housing plus independently sampled copper rotor:
72 five-degree phases, one direction, fixed hub and foot, native nearest sampling
and a shared bounded raster cache. SourceV2 was independently accepted before
presentation normalization. Housing64x64native displays128x128world; broad base60
and hub32,31 are measured. No cabinet frame rotation or frame-box resizing.

Wind distortion uses only viewport-clipped96-world-wide shaft copies and
native-grid eight-world-high strips. Actual route captures report6528..9456 native
pixels copied and20..27 displaced strips in representative views. No screen pixel
readback or smoothing; the fan itself remains outside the distorted background.

Two new full compact burner housings replace the cropped borrowed cylinder.
Accepted sourceV4 has48x64-native cells displayed96x128world, broad exclusive
base56, cold mouth8,44 and authored hot interior. Each has a fixed body across
cold/warning/fire/quench; warmth blends only the original hot aperture. Actual
port equalsfloor360+(44-56)*2=336. The manifold now enters the measured upper
copper feeds behind the housings instead of crossing their projectile mouths.

Parent corrected physical grounding/access: receiving deck now reaches1800;
560-high step spans1740..1840 and short ladder1760 clears the fan. The normal
route boards Olaf1720, waits for the travelling furnace volley to pass the shaft,
then rises and lands at1775 before turning the shield front-right. This protects
Baleog as he steps off; no physical support, safety or damage override was added.

Fresh focused verification:21 tests pass, including full healthy ordinary-input
routes at60/120Hz, native rotation direction/pivot, bounded wind copies, actual
fan-base support, ladder clearance, source floor/port contacts and renderable
connection bends. The old short port bend failed real browser rendering and was
corrected with a regression against the actual connection planner.

Actual desktop production route won99.42s HP[3,3,3] with60 captures and zero errors.
Final manifold/heat-state proof used a bounded isolated production dependency
graph while parallel Orbit imports were incomplete: final Freight source/art and
physical layout were unchanged, ordinary UI/keyboard controls only. Coarse-pointer
route won101.15s HP[3,3,3] with68 captures at1x/2x/portrait/landscape and zero errors.
Real touch movement/selection/shield input also passed. Records:
`assets/freight112/evidence/route.json`, `touch.json`, and `captures/`.

Independent source and processed/in-game gates both accepted in
`FREIGHT112-REVIEW.md` and `assets/freight112/visual-gates.json`. Root must still
verify the integrated application after Orbit dependencies are complete, then
perform the final build/release checks before publishing. Those recorded Freight
captures used the prior Olaf90 texture; they do not approve the parallel Olaf111
pose replacement. Its worker owns the exact111 look/float/land evidence.

New runtime files:
- `src/levels/freight/hardware-layout.js`
- `src/levels/freight/hardware-render.js`
- `src/levels/freight/rotor.js`
- `src/levels/freight/wind-refraction.js`
- `assets/freight112/{fan-housing,fan-rotor,burner-body,burner-mouth}-native.png`

Sources, geometry guides and exact Imagegen prompts are retained under
`assets/freight112/`; preparation is under `tools/art/freight/*112.py`. Rejected
rawV1 and burnerV3 remain unprocessed history.
