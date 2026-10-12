# Vikings80: distinct adult builds, with first-game stout Olaf

The user requested a much chubbier Olaf based on **the original first Lost
Vikings game**, then rendering all three heroes. This guide packet makes Olaf's
full mass authoritative before the parent imagegen stage. It preserves78/79
sources, changes no production renderer and performs no imagegen calls.

## Reference authority

The original first-game SNES Olaf sheet was visually inspected in its browser
page and from the retained original PNG:

https://www.spriters-resource.com/snes/lostvikings/asset/8335/

`assets/vikings80/references/olaf-original-snes.png` is the unchanged638x620
sheet credited to ripper Dazz. `references/REFERENCE.md` records provenance.
Its full belly, broad back, chunky arms/stout neck, green clothing, yellow beard
and round shield inform the new silhouette. The Lost Vikings2 and Heroes of
the Storm are explicitly excluded as reference authorities. No original sprite
pixels were transplanted into the procedural guide.

## Scale, anatomy and visible body mass

All cells remain **64x64native /128x128world**, with **origin32/40** and planted
exclusive **sole62**. Neutral adult body heights remain **36Erik /38Baleog /
36Olaf native pixels**. Bones and the reviewed gait/contact paths are retained;
body mass is authored around them at the same native density.

| Hero | Intended build | Mass construction |
| --- | --- | --- |
| Erik | Lean athletic adult | Existing narrow chest/waist and slim limbs |
| Baleog | Muscular adult |11.6native shoulder target,7.3waist, thicker1.28mass limbs |
| Olaf | Very stout adult |~18native convex belly, broad upper back/chest,14shoulder target, stout neck, substantial arms/thighs/calves |

Olaf is **not just a wider belt**. His continuous outline starts at broad
trapezius/shoulder mass, bows out across the upper back and ribs, continues into
a large convex abdomen and finishes in a low rounded hem. The belly extends
well beyond the old torso, with green clothing surrounding a broad warm belly
plane, following the original game's identity. A4native-pixel stout neck joins
the head into the body. Thigh radius is3native pixels, calf radius2.35, and
upper-arm radius2.45; ankles taper to1.35 so thick legs enter the existing boots
without pushing an outline through the floor during landing.

The side-view shoulder girdle is broader too: complete near/far arm chains
are translated to their revised shoulder landmarks, preserving segment lengths.
Near and far limbs retain distinct tones and paint order. Body width does not
change the fixed arm/thigh/shin lengths or enlarge the head to fake stoutness.

`three-builds-body-only.png` compares all three at identical scale with equipment
hidden. `olaf-stout-body-review.png` compares complete poses with the same
unshielded poses: neutral, contact, passing, overhead and rear climb. These
diagnostics deliberately expose the belly/back that a large shield could hide.
Their native equivalents are retained too.

## Round held shield and support geometry

Olaf keeps79's round **24native /48world diameter** shield and body-driven bob.
The front face is carried **3.5native pixels farther forward**, nearX47.5,
so it does not conceal the entire new belly. The interior strap and hand move
with that face, and the unchanged6.0/5.5native arm lengths are solved back to the
moving grip. The shield face still occludes the gripping palm.

Walk/idle centerY remains42.35..43.45, with **7–8native pixels actual floor
clearance** and1.10native-pixel total bob. The shield does not use the foot sole
as a ground anchor. Its24x24 upright face foreshortens to a24x6 overhead ellipse;
the6pixels describe apparent projected face depth, not physical thickness or
an altered diameter. Overhead center/rider plane remains **nativeY22 /
world-relativeY-36**, with underside **Y25** and palms at **X25.5/38.5,Y25**.

Shoulders elevate to reach the underside without stretched bones. Raised-shield
rear climbing retains one support hand and one ladder-reaching hand, alternating
roles after each half cycle. Back-strapped climbing retains both ladder hands.
Production transfer timing, stopped/reversed climbing and rider contacts remain
runtime review requirements.

## Complete action coverage and imagegen inputs

Every hero retains the shared8walk,4idle,2look and4rear-climb core. Total counts:

- **Erik32**: plus2rise,2fall,3land,1hurt,6bash.
- **Baleog38**: plus2rise,2fall,3land,1hurt,6sword,6bow.
- **Olaf60**: plus2rise,2fall,3land,1hurt,8overhead-walk,4overhead-idle,
  7raise,7lower,4overhead-climb,4float.

Each hero has a transparent eight-column original native sheet and exact2x
full-sheet imagegen input, with no labels or grid:

| Hero | Native input | Exact2x input |
| --- | --- | --- |
| Erik |512x256 |1024x512 |
| Baleog |512x320 |1024x640 |
| Olaf |512x512 |1024x1024 |

Paths: `assets/vikings80/{hero}-full-input-native.png` and
`{hero}-full-input-2x.png`. Empty trailing cells are transparent and have no
pose metadata. Eight-walk alternatives are `{hero}-walk-input-native.png`
(256x128, four columns/two rows) and `{hero}-walk-input-4x.png` (1024x512).
All enlargement uses nearest-neighbor and introduces no new detail.

The packet also contains each hero's original guide,2x/4x enlargements, frame
key, joint key, native-density comparison, JSON and native-derived mirrored
GIF loops. JSON schema `vikings80.first-game-build-guide.v1` retains complete
XYZ joints, exact bone lengths, phase/contact roles and anchors. Olaf frames
add `softTissue` outline, target widths, belly center and mass information;
shield metadata includes actual opaque bounds and floor clearance.

## Costume authority for the parent render

The guides establish anatomy and mass. The parent material-render prompts may
add the user's requested longish beards and horned helmets at native detail
density, including Olaf's yellow beard and green first-game identity. Those
costume details must fit transparent cell space while preserving the stated
adult body heights, head scale, full stout silhouette, motion and grips.
Do not slim Olaf back down behind a large shield or trade his belly for an
oversized head. No whole-body rescaling, isolated torso paste or leg replacement
is permitted as a way to fit the render back onto the guide.

## Reproduction and review gates

```powershell
tools/pixel-fixer-venv/Scripts/python.exe tools/guide-vikings80.py
```

The generator reuses unchanged78/79 source modules and writes only the80
directory. Independent existing validation was applied to the generated80
metadata/images:78checks for Erik/Baleog and79checks for Olaf. All130poses pass
fixed XYZ segment lengths, native body scale, sole registration and eight
distinct walking frames; Olaf also passes held clearance/bob and rider-plane
checks. An initially over-thick landing ankle extended one pixel below the
sole; native tapering corrected that before the final pass.

**Native-density/source guide gate:** **ACCEPTED for all three heroes** in the
independent `VIKINGS80-REVIEW.md`. The critic inspected the original first-game
reference, final native atlases, body-only mass diagnostics and action/joint
keys, and independently checked all130 poses after the ankle correction. The
eventual rendered source needs a separate native-density/pose-fidelity review
against these guides.

**Processed/in-game gate:** **NOT ASSESSABLE / NOT APPROVED FOR PUBLICATION.**
No runtime integration or production1x/2x/mobile captures exist for this packet.
Guide sheets and JSON do not prove production readability, ladder contact,
passenger soles, stop/reverse behavior or smoothly timed equipment transitions.

Self-critique: the large shield still legitimately occludes the near forearm
and some front belly, so unshielded and overhead diagnostics are required to
judge the body. Strong near/far shading must survive the material pass. Flat
anatomical colors and compact helmet/beard guides are not finished costume art.
