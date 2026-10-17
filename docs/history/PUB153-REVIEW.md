# PUB153 independent orb-room darkness review

Status: accepted. Reviewer changes no runtime code or art.

## Source and lighting causality

The previous orb pool had radius310 with0.96light removal, washing away darkness
through most of the storeroom. Independently compared the old pub151 floor-break2x
capture with final room-entry/inspection/floor-break views: the former clearly
reads as another bright timber room rather than a dark discovery chamber.

The final shared lighting specification uses0.96ambient mask, an orb radius110
with0.78light and candle radius70 with0.68light. Header timber brightness is0.35.
These are local sources anchored to the actual candle and orb, leaving dark space
between them and in the cup-storage corner. The mask still starts below the
existing lintel, has its soft doorway threshold and fades through floorboards;
no darkness is introduced into unrelated soil. Main-hall lighting is untouched.

Native architecture/props/globe sources retain their original density of two
world units per source pixel, dimensions, palette and material detail. No generated
replacement, processing, resampling, collision, story or puzzle-permission changes
are involved. Darkening presentation does not flatten or replace the retained
rich source art.

## Actual visible review

Independently inspected final actual room-entry1x, inspection2x/portrait and
floor-break2x/landscape images. The main hall remains visibly warm and inhabited;
the back room is distinctly dark. Candle and orb are readable localized pools,
while gaps and room corners remain dark. The orb silhouette, glass/arms, stool,
crew faces/shield and breaking boards remain legible where the discovery happens.
Darkness does not hide the important object or floor-collapse motion. Native beams
and boards retain texture rather than becoming a flat black rectangle.

The mask's physical header/door threshold and floor fade remain causal. Actors
stay grounded until the existing floor gives way; no support, enemy or decorative
architecture gains a floating placement. Pause banners preserve the transient
inspection/break poses above the actual subject. Portrait inspection can show the
crew still approaching at the left edge because the existing cinematic camera
centers the orb; this is not used as a claim that they are already beside it.

## Verification and gates

Independently ran27 focused pub153/pub152/pub151/pub148/alehall135 tests: all pass.
The lighting regression verifies dark gaps/corner, readable orb/candle centers and
unchanged main hall; existing geometry, speech/story, key/door and healthy ordinary
60/120Hz routes remain green.

The final ordinary coarse-touch route in `assets/pub153/touch/route.json` wins in
58.1765seconds with all three heroes3HP,12scene captures/errors[] and the proper
fall entry to the sewer. Actual1x/2x/portrait/landscape screenshots and sidecars use
imagegen90, resolving to vikings90 Erik/Baleog plus Olaf111. This is browser/coarse
proof and does not claim physical-device or iOS validation.

Source/native continuity gate: accepted. Runtime gate: accepted. Aesthetic gate:
accepted. Cooperation/control gate: accepted. Localized illumination restores
the intended mysterious discovery while preserving clearable progression and
readable interactions. Publication allowed subject to integrating-agent final
build/release and live-byte checks.
## Publication verification

Runtime commit `89d1f3b` published as `01M54KQPNQRAXDDRM9XW5W7507` at
`https://united-marsh-6ppd.here.now/?campaign=fall&release=pub153`.
All781tests passed. Final528file build passed integrity and visual-gate preflight.
Live13critical files and HTML match the reviewed build. The complete live touch
route wins in57.4621seconds with3HP per Viking,12room-entry/inspection/collapse
captures, errors[] and the correct fall entry into the sewer. Lighting stays
localized while the original native art, soil footprint and puzzle logic remain.
Receipts: `assets/pub153/live-check.json` and `assets/pub153/live-hashes.json`.
