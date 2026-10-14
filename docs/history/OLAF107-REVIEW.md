# Olaf107 independent visual review

Reviewer: `/root/olaf107_review`, 2026-10-14.

User reports lighter walking art, a fixed hand around the shield, and unclear leg motion. Review follows `skills/native-sprite-art/SKILL.md` and `docs/standards/VISUAL-REVIEW-GATE.md`. User-selected skin is not yet confirmed; no automatic substitution is approved by this diagnosis.

## Existing current skin diagnosis

Inspected `assets/vikings70/olaf.png`, `assets/vikings70/olaf-grip-source.png`, `assets/vikings70/registration.json`, `tools/art/vikings/prepare-vikings70.py`, and runtime frame/art selection.

The current skin uses a 64×64 cell, origin [32,40], 36 native pixel intended person height, and two world units per native pixel. Its standing upper body is visibly copied across the walking row: the preparer replaces all rows above native y48 with the idle/gripping frame. This is a fixed torso/hand, not an authored moving grip. The current standing jacket reads much brighter yellow-orange than the richer brown, dimensional corrected art, and the source/body design has relatively little volume.

The runtime also selects only four effective current-skin walk poses: `floor(frame/2)%4`. Olaf has eight cells available, but cells4–7 are never reached for ordinary walking. The opposite half of the cycle is therefore absent rather than merely too rapid. Boots in the effective four poses frequently read as the same forward foot changing spread; the clear support/passing/opposite-contact sequence is lost. Overhead walking has the same four-pose restriction. This aggravates the weak negative space and the fixed upper half.

Verdict for publishing that gait as corrected: **rejected**. A palette-only correction cannot restore missing anatomical leg ownership or a frozen hand/shoulder hold. Pasting a fixed torso onto replacement legs is specifically prohibited by the current skill.

## Corrected generated reference

Inspected `assets/vikings90/olaf-native.png` and `assets/vikings90/olaf-source-native-comparison.png` beside the current sheet. The eight front walking cells show integrated shield/arm ownership, more dimensional brown-and-gold material planes, and meaningful changes in foot placement. The authored shield face covers its gripping palm; its diameter reads stable across front gait keys. The comparison shows processed native key silhouettes/materials matching their corresponding source presentations, without the wholesale frozen top-row splice used by70.

This is a candidate reuse reference, not final acceptance of a new mixed-skin integration. Its heavier torso and integrated shield require checking actual legacy equipment transitions and mirroring if reused only for current locomotion. A complete replacement must preserve gameplay dimensions and adult-human scale, not enlarge the art to recover detail.

## Olaf107 gates

- Native-density/source gate: **pending**. Await the chosen replacement source, retained original and matching native-size view; inspect all front and overhead keys, opposite-contact chains and palette continuity with idle.
- Processed/in-game gate: **pending**. Await production1×/2× and coarse/mobile captures with Olaf away from parked heroes; front/overhead complete loops, mirrored movement, stop/idle transition, lifted shield passenger contact, and legacy-to-new-art action transitions. Inspect visible hand occlusion, sole contacts, unchanged shield bounds and head/core excursion. Automated dimensions alone cannot approve these.

No runtime or source edits were made by this reviewer.

## Whole-actor90 reuse candidate

Implementation resolves default `current` Olaf to `imagegen90` for every pose through one `heroSkin` mapping. Other current heroes retain their existing art; the old70 set remains selectable as `reworked70`. This avoids grafting an unrelated upper half, mixing legacy action bodies, or layering an external shield over the generated shield face. Physical shield registration must follow this same resolved skin.

Re-inspected selected raw front0V5/front4V6 and raised0V16/raised4V9 originals, the complete24-key `olaf-replacement-4x.png`, `olaf-source-native-comparison.png`, native atlas and retained exact selection/registration. These are coarse intentional clusters in enlarged raw presentation, not painted fine texture rescued through downsampling. Whole-pose registration preserves authored limb ownership, mass, solid material alpha and coherent wood/steel/skin boundaries. Opposite contact keys retain distinct near/far support and recovery, without70's static torso splice. Raised disc and palms remain a single authored construction.

The exact untouched source set also retains the final separate source acceptance in `docs/history/VIKINGS90-CYCLE-REVIEW.md` and `assets/vikings90/olaf-registration.json`; early rejected prototypes in the general90 history are superseded by that final exact-selection record. No raster/source preparation changed in107.

**Olaf107 native-density/source gate for exact whole-actor90 reuse: ACCEPTED.** Native64 key presentations are placed into unchanged padded80 runtime cells, with two world units per logical pixel and existing authored helmet/sole/shield anchors. This approves the retained source set and immutable pixel output only. The new default mapping still needs fresh actual runtime evidence; runtime gate remains **pending**.

## Fresh default-current production evidence

Inspected `output/olaf107/walk/evidence.json`, all front `current-2-phase0..7-2x.png`, opposite loop3 phase7/0 captures, stopped idle, mirrored reverse, actual running1× and mobile running1×/2×. Inspected all corresponding eight raised `output/olaf107/raised/current-2-phase0..7-2x.png`, loop3 phase0, stopped idle and mobile2×. Metadata explicitly shows selected `current` resolving Olaf id2 to `imagegen90`; parked Erik/Baleog remain `current`. This is the affected default skin, not an accidental screenshot of a different user-selected preset.

The new default actually removes70's bright jacket/frozen pasted hand. It has readable dark olive/brown material mass, a continuous articulated arm feeding behind the front shield, and no additional palm or pale stub outside that shield. Front0/4 show opposite contacts;1/5 carry weight while the opposite chain recovers;2/6 pass and3/7 swing. Boots retain distinguishable ownership and negative space rather than four repeated spread poses. Core/head response is modest, floor contacts use the opaque first terrain row, and the loop seam does not jump back to a corrected horizontal root. Stopping retains the same character/material identity. Mirroring maintains grip/face ownership. Raised walking preserves the same disc size, supporting palms and differentiated alternating feet.

One diagnostic is excluded: `walk/same-size-native-gaits.png` shows Erik, not Olaf. It is a stale helper board and supplies no Olaf evidence. Acceptance instead rests on the correct actual production captures and their metadata; the raised board correctly shows Olaf.

Inspected all eight `output/olaf107/rider/walk-0..7-2x.png`, `reversed.png`, `rider-1x.png`, `rider-mobile-2x.png` and `rider/evidence.json`. Rider soles meet the raised disc's central interior plane through every gait key and mirror, while supporting palms remain beneath its unchanged underside. No visible contact gap, extra gripping limb or relative rider slide appears. Metadata has support2, Olaf's resolved90 registration and the unchanged y−36 physical shield plane. Both walking sets report24 phase captures/errors[]; rider reports12 captures/errors[].

**Olaf107 processed/native and fresh default-current gameplay1×/2×/mobile/mirrored front/raised movement and moving shield-rider runtime gate: ACCEPTED.** This approves the immutable whole90 art under the coherent default mapping. Full existing action/climb/float kits retain their earlier exact-source90 acceptance; this fresh107 set does not claim a newly captured every-action playthrough. Parent must still perform final build/release/deployment verification. No unresolved visible blocker remains for this scoped default walking correction.

## Retained publication evidence

The reviewed front/raised/passenger captures and JSON receipts are retained at assets/olaf107/evidence/{walk,raised,rider}. The excluded stale board was not copied. The normal-input Warden route with the updated default skin also won at102.05simulation seconds, HP3/3/3, errors[], restart and Enter continuation verified (assets/olaf107/evidence/boss-route.json). Root suite:459passed. These parent verification results supplement the independent visual verdicts above.
