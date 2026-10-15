# Scrap Orbit120 validation

All563 package tests passed, including10 new focused regressions. Source and
production browser smoke passed3campaigns/28previews, movement, hero switching,
inventory, zoom, pause/restart and mobile; errors[]. Explicit build432files,
publication433including emitted manifest; release byte check and gate preflight
passed2026-10-15.

Normal-input simulation full wins allHP3 at60/120Hz. Deliberate single-switch
revolution timeout and subsequent complete set also wins allHP3 at both rates.
A deliberately mistimed second lift still damages Baleog:HP[3,2,3] both rates.
The fixture waits on real hazard phase; it does not disable hazards or teleport.

Actual production browser normal route: won=true,HP[3,3,3],errors[],131 captures
including1x/2x/portrait/landscape. Actual deliberate timeout/retry: won=true,
HP[3,3,3],errors[],151 captures, plus native switch open/pressed/return states.
Receipts: assets/orbit120/{route,retry}/route.json. Use retry captures for the
unobstructed inverted ceiling-brake aim; waitingOlaf was parked to the left.

Field2-only optics while firstwell completed: push-second-frame2x has46strips,
9828copiedpixels; crane-lifting2x has45strips/12212pixels. Actors/UI not sampled.
Wheel angle follows actual hook horizontal travel; stationary/vertical-only
motion does not spin it. Seated U-tray visible in retry exit-aim1x/2x/mobile.

Rawv4 source accepted independently before processing. Single uniform nearest
normalization gives exact native opaque box[10,36,182,60], canvas192x96,
pivot96,48 and world344x48. Native4x and actual rotating/overhead contacts accepted.
Rejected concepts retained and excluded from release. Springs/cartridge reuse
approved native material without rope in the reusable switch aperture.

Independent source/runtime/cooperation gates all accepted in
ORBIT120-REVIEW.md and assets/orbit120/visual-gates.json. No debug teleport or
invisible hero-specific target permissions used. Original sources/prompts and
normalization script retained; unrelated archive/Viking55/pixel-fixer WIP intact.
