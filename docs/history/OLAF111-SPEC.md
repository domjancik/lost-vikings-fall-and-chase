# Coherent Olaf whole-actor pose family

Keep the approved eight-phase walking motion and chubby three-quarter character.
Replace inherited darker, narrower side-view idle/raised/action artwork with
whole-actor generated poses matching its palette, volume and camera orientation.
Do not graft a fixed torso over moving legs or change the physical Viking scale.

Native canvas: 80 by 80 pixels, actor 36 native pixels including horns, one
native pixel occupying two world units. Drawing origin remains (40,48); grounded
sole is exclusive row70. Raised disc supports riders on the center plane row30.
All source generation retains its exact prompt and original raw image.

Sources: idle-raw-v2 (four front and four raised breathing phases), raise-raw-v2
(seven continuous equipment transitions and final hold), action-raw-v2 (look,
rise, fall, land, hurt and floating). action-raw-v1 is rejected before processing:
its character was enlarged within its cell and exceeds the intended density.
raise-raw-v1 has accepted source density but failed actual geometry: its final
raised body was49native pixels high and moved the disc above the rider plane.
V2 corrects this through whole-source regeneration, not actor resizing.

Source approval precedes uniform atlas sampling. Registration uses measured
helmet center and anatomical sole for grounded poses; floating/raised equipment
uses a fixed shield rider plane. Whole-frame translation only. Existing complete
climbing/gait kit is preserved unless a complete coherent replacement is reviewed.

Required evidence: comparison with approved gait, source/native pair, all idle
and gait seam phases in both directions, stop/start in production at 1x/2x and
coarse mobile, raising/lowering, look/land/floating, rider contact and stable
equipment bounds. Separate source and runtime review verdicts remain mandatory.

The generated lower dispatcher also previously played its artwork backwards:
the absolute raised fraction was interpreted as elapsed lowering progress.
Reverse that fraction once for generated/native skins; preserve the older
legacy/procedural fraction semantics. Regression demonstrated46,47,48,50,51
before correction, and now requires actual cells to descend from raised tofront.

Actual controls produced170 gait/idle/stop/start captures at1x/2x in desktop
and coarse mobile contexts, plus22 post-fix raising/lowering/passenger captures.
Both receipts report no page errors. Independent final runtime verdict pending.

Additional54 actual Freight action captures cover look-up/down, draft rise,
horizontal floating, downward floating/braking, lowering while rising, front
falling at both velocity phases, allthree hard landing keys and real inspector
damage (HP drops naturally). Twelve supplementary early-look captures show the
full actor before its deliberate held look-around camera pan leaves the foot
out of frame. Both1x/2x and real coarse mobile contexts are included, with no
state overrides or browser page errors. Repro: tests/browser/runners/olaf111-actions.mjs
(`--look-only` repeats early-look proof).

Held look art is dispatched only for Olaf's compatible current/native/generated
families. Earlier procedural/legacy/trial skins keep safe idle art while the
camera looks around, as do Erik/Baleog's current skins lacking authored look cells.
