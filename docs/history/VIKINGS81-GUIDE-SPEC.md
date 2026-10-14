# Vikings81: running Erik, flowing beard and angled Olaf shield

This sibling guide packet preserves the78–80 sources and contains no runtime
or production-renderer edits. The user requested a genuinely dynamic running
Erik with a long flowing beard, an oblique original-game Olaf shield and an
Olaf helmet that covers his eyes. All artwork is rasterized directly on the
native64x64 grid; larger evidence and inputs use exact nearest-neighbor copies.

## Source authority and registration

The reference is **the first Lost Vikings game**, specifically the original
SNES Olaf sheet at https://www.spriters-resource.com/snes/lostvikings/asset/8335/.
The unchanged638x620 reference is retained at
`assets/vikings81/references/olaf-original-snes.png`, with provenance beside it.
It was visually inspected for the stout belly/back, round oblique shield,
low helmet and yellow beard. No sequel or Heroes of the Storm design is used,
and no source sprite pixels were transplanted.

Cells are **64x64 native /128x128 world**, registered at **(32,40)**, with
planted exclusive **sole62**. Anatomical neutral body heights remain
**36Erik /38Baleog /36Olaf**. The new costume horns extend about3 native pixels
above the anatomical helmet; these are explicitly excluded from body height.
`bodyOpaqueBoundsWithoutEquipmentOrCostume` records an independently rasterized
body-only alpha bound for this check. No pose receives per-frame rescaling.

Olaf retains80's convex~18-pixel belly, broad back, stout neck and thick limbs.
Erik remains lean; Baleog retains80's muscular build and all existing poses.
The shared horn/beard costume anchors do not alter Baleog's limb animation.

## Erik: an eight-phase run

The eight existing `action:"walk"` cells deliberately retain their atlas mapping
but now carry `motionClass:"run"` and `dynamicRun` metadata. Production can map
them to running without losing the established action order.

| Phase | Near-leg family | Whole-body timing |
| --- | --- | --- |
|0 | Contact | Forward heel placement and opposite arm drive |
|1 | Compression | Root drops into the supporting leg |
|2 | Toe-off drive | Rear push and opposite knee drive |
|3 | Flight fold | Both feet airborne, recovery leg folds |
|4 | Recovery fold | Opposite leg contacts |
|5 | Passing | Opposite support compresses |
|6 | Knee drive | Opposite rear push |
|7 | Flight extension | Both feet airborne before next contact |

Root bob spans2 native pixels. Forward shoulder lead varies3.1–3.7 pixels.
The pelvis/shoulder girdle articulate with the stride; near/far identities and
fixed arm/thigh/shin lengths remain authoritative. Two-link leg solutions use
plausible forward knee bend; strongly bent arms counter-swing with the legs.
Quiet idle poses retain their prior body motion.

Erik's beard has **three fixed3-pixel segments**, total **9native pixels**.
During running, the jaw attachment leads and the flexible downstream chain
trails to the left with authored phase lag. The tip changes direction through
the cycle rather than forming a frozen straight strap. Quiet idle lets the
same long beard hang under gravity with only a small angular change. Air and
bash poses have separate follow-through. Rear views correctly occlude it.
The coarse copper color is brighter than the red tunic so the native silhouette
remains legible without fine hair detail. `secondaryMotion.beard` stores all
points, segment lengths, attachment, motion mode and phase.

## Olaf: shield projection, physical grips and helmet

The shield retains a **24native /48world physical diameter**. In front poses,
45-degree yaw projects this circle to approximately **16.97x24 native pixels**;
a **-8-degree roll** gives the slight original-game slant. This is an oblique
view of one round object, not a physically narrower shield. The new native
reference pixels contain the oblique outline, so a material pass cannot infer
an upright circular face from old reference art.

The center remains forward nearX47.5 and bobs with the body. Walk/idle keep at
least4 native pixels actual alpha clearance above sole62. The interior strap
is transformed with the face, and the arm is solved to that moving grip with
unchanged bones. The palm remains behind the shield face. Metadata records
physical diameter, projected size, yaw, roll, strap, grips, actual alpha bounds
and actual floor clearance.

Raising progressively removes yaw and roll while the round face foreshortens
into its **24x6** overhead profile. The rider/center plane stays **Y22**, the
underside stays **Y25**, and full overhead grips remain **(25.5,25)/(38.5,25)**.
The new horns require an additional3.2-pixel head duck at full raise, introduced
continuously with raise amount; the shield and rider plane do not move to make
room. Back-strapped climbing retains a full round back view. Raised climbing
keeps alternating shield-support and ladder-reaching hands.

Olaf's metal helmet rim covers the old eye point while leaving his nose and
beard visible. Helmet metadata records the covered eye and rim points. Rear
views retain their appropriate occlusion. These are actual native costume
shapes, rather than prose-only requests for a later renderer.

## Coverage, assets and API

All130 poses are present: **32Erik /38Baleog /60Olaf**, with the complete80
action ordering retained. Every hero includes8walk/run,4idle,2look,4rear-climb,
2rise,2fall,3land,1hurt. Erik adds6bash; Baleog adds6sword/6bow. Olaf adds
8overhead-walk,4overhead-idle,7raise,7lower,4overhead-climb,4float.

Transparent full inputs have eight columns,64-pixel cells and no labels:

| Hero | Native full input | Exact2x input |
| --- | --- | --- |
| Erik |512x256 |1024x512 |
| Baleog |512x320 |1024x640 |
| Olaf |512x512 |1024x1024 |

Paths are `assets/vikings81/{hero}-full-input-native.png` and
`{hero}-full-input-2x.png`. Eight-frame walk/run inputs use four columns/two rows:
`{hero}-walk-input-native.png` is256x128 and `-walk-input-4x.png` is1024x512.
Trailing unused full-atlas cells are transparent. Per-hero guide JSON, native
atlases,2x/4x review sheets, labeled frame/joint keys, native-density evidence
and action GIFs are retained. Focused references are `erik-run-review.png` and
`olaf-shield-helmet-review.png`.

Generator: `tools/guide-vikings81.py`. Import it and call `configure()` to get
the configured native module without writing files. Then
`G.base_pose(hero,action,phase)` returns a pose and `G.render(pose)` returns
RGBA64x64, enriching the pose with tissue, costume and secondary-motion metadata.
`main()` writes all outputs. This API lets a direct native material pass keep
the accepted mesh, joint coordinates, paint order and registration.

## Evidence and limits

`tools/check-vikings81-guides.py` checks all130 poses with the existing78
fixed-bone/contact/registration validator, replacing only the old total-alpha
height check with the explicitly separated anatomical height check. It also
checks binary alpha, exact beard segment lengths, run flight at3/7, trailing
beard direction, moving shield grips, round physical diameter, oblique
projection, floor clearance, unchanged overhead planes and horn clearance.

Latest automated result: **PASS for all130 native poses**. Independent visual
checkpoint accepted the run anatomy, beard follow-through, oblique shield and
eye-covering helmet; final source guide verdict is recorded separately in
`VIKINGS81-REVIEW.md` when reviewed. Source-guide acceptance does not approve a
subsequent material render or runtime animation.

Remaining limits: four rear-climb guide poses establish hand roles, not
continuous transfer timing. Gameplay still needs stopped/reversed climbing,
rider support, ground contact and actual1x/2x camera review. Production timing,
materials, lighting and any imagegen output require their own raw/native and
in-game gates. No imagegen, runtime hookup, publication or commit was performed
by this guide generator task.
