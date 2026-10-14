# Warden105 carriage source/runtime critique

Scope: replace the inherited coarse carriage artwork while preserving physical
deck width, movement path, rider contact, release clamps and controls. Reviewer
owns this document only; no runtime changes.

## Native guide review

Inspected `assets/warden105/cart-guide-native.png` and `art-contract.json`.
Native cell 192×128; world pixel 2; desired visible footprint 336×158 world.
Deck anchor [21,72], span 150 native pixels/300 world units. Upper beam row28
is 88 world units above deck, leaving 16 world units clearance over a normal
72-world-unit adult Viking. Wheel bottom-exclusive row107 is 70 world units
below deck, meeting the lower floor at940 for carriage deck870. These dimensions
retain human scale and the original physical support.

Keep generated material within deliberate 1-native-pixel contour density; do
not hide coarse edges through higher-resolution painted detail. Require
readable thin curved iron rim, aged bronze bevels, panel joins, dimensional
wheel construction and structural negative space. Retain registration via
translation only. Derive handwheel/hinge ports from final opaque pixels.

Existing handwheel hub p.x+158/p.y−18 corresponds guide x100/y63; reserve that
hub and the clamp ports near native x21/171,row27. Check raised framing does
not occlude heads and walking/rider soles. The complete moving range must retain
rigid art and traceable track/wheel support, not merely a correct static box.

## Gates

- Guide geometry: **accept** as generation constraints only.
- Raw native-density/source gate, V1: **reject**. Inspected retained
  `cart-raw-v1.png` directly: fine corrosion speckles and wheel bevel gradients
  are much finer than its declared 8× native proof grid. Large translucent gold
  haze surrounds the frame and fills negative space; handwheel hub is absent.
  Normalizing its 1536×1024 source to 192×128 would discard defining painted
  material texture, which is not a valid native-art rescue. Construction layout
  is useful, but a new deliberate native source is required.
- Selected raw native-density/source gate, V4: **accept**, as reviewed below.
- Processed/in-game gate: **accept**, final production evidence reviewed below.
- Publication: **allowed after final build/release checks**.

Evidence must include retained raw/prompt, native-size and nearest-enlarged art,
actual 1×/2×/mobile held/released/boarded/moving/upper-dock poses, measured actual
deck and broad wheel bottoms, and normal-control encounter completion.

## V2 source inspection

Inspected `cart-raw-v2.png`, `cart-candidate-v2-native.png`, and ordinary
alpha-clean `cart-candidate-v2-clean.png`. Native density is **accepted**:
thin deliberate one-native-pixel contours, wheel curve steps, vent/rivet planes
and readable handwheel survive the intended192×128 view. Remaining low-alpha
external haze is an ordinary matte-cleanup issue; alpha thresholding is valid
only while opaque geometry/features remain unchanged, with no contour erosion.

Reported actual broad deck row71 and wheel bottom-exclusive106 preserve the
70-world-unit floor offset. Registering the complete source by translation to
the actual [20,71] deck is appropriate; do not independently stretch rails,
wheels or panels. Directional caveat: V2 is overly pristine and its rail planes
are more diagrammatic than the worn Clockwork benchmark. Recommend a targeted
new source with sparse broad 3–6-native-pixel chips/rust and coherent steel bevel
volume, preserving the thin contour and registration. V2 density acceptance
does not grant final runtime/material approval or approve a later source.

## V4 selected source and component registration

Inspected retained `cart-raw-v4.png` and intended192×128
`cart-candidate-v4-clean.png`. **Source gate: accept V4 density/material.**
Broad brown seam/joint rust clusters and coherent steel bevels restore worn
Clockwork character without defining it through tiny painted grain. Handwheel,
road-wheel curves, rivets and vent structure remain deliberate native clusters.
Low-alpha exterior matte may receive ordinary cleanup; final contours must
remain intact, fully opaque and halo free.

V4's actual broad deck row71 and wheel-exclusive bottom107 imply a 36-native
offset, one native pixel greater than the desired35. Do not bury a wheel or trim
its rim to hide this. Whole authored wheel-part registration by translation up
one native pixel to its measured sole is valid, subject to preserving every
wheel material pixel and native scale. Require native masks/parts and runtime
assembly inspection: rims, bolts and axle housings must rejoin continuously,
including rotation extremes, deck contact and both docking floors.

## Additional sweat origin correction

User observed prior sweat appeared to originate from the shield. The correction
requires skin-aware forehead registration: generated/bitmap temple near logical
hero.y−12 and original procedural head near hero.y+8. Prior Warden104 approval
does not approve this changed placement. Current, imagegen90 and procedural
held captures are required; drops must visibly originate below the shield's
underside near the temples, not from the supporting object.

## Final native assembly and runtime evidence

Inspected final `cart-native-2x.png` against selected raw V4/192 clean view.
Thin rails, deliberate wheel bevels, vent panels and broad wear clusters remain
coherent and readable. Transparent negative gaps are real; exterior matte is
removed without missing rim/bolt features or opaque halos.

Final registration records deck[19,71,150], handwheel[98,62],
clamps[20,26]/[167,26]. These derive world ports x+158/y−18 and upper clamps
y−90 from actual art. Code inspection confirms source pixels partition into
body, two caster components and authored handwheel without scale change.
`output/warden105/art-pixels.json` reports source reconstruction mismatches0;
both actual caster alpha bottoms register visibleBottom940 at the lower dock.
Casters preserve their prior fixed orientation; only the handwheel rotates.

Directly inspected actual `output/warden105/route/boarded-1x.png`,
`boarded-2x.png`, `boarded-mobile-2x.png`, `lift-middle.png`, and
`upper-dock.png`. Carriage material now has finer contour/plane density than
the inherited atlas. Wheels rejoin the axle housings continuously; no extraction
seam, missing rim, stretched circle or abrupt scale change is visible. Both
wheels meet the lower dock floor without burial. Riders are planted on the
registered top deck, clear of the overhead beam; released clamp pivots remain
attached to that beam throughout the lift. Upper docking retains the rider
plane and traceable lift rail support; it is not falsely treated as a wheel
floor contact where the carriage is mechanically carried.

Sweat correction: inspected `sweat-current-desktop-2x.png`,
`sweat-imagegen90-mobile-2x.png` and `sweat-procedural-desktop-2x.png`.
Small cool drops now belong beside the held character's head/temple below the
shield, rather than the shield's rim. Checked route metadata confirms actual
current/imagegen90/procedural skins and two early drops in each. Art/scale
of the shield itself is unchanged.

Read ordinary-input route results independently: won true, HP[3,3,3], time
106.4583s, browser errors empty. Implementation agent reports all454 unit/build/
simulation tests passing. Separate selected V4 source and processed/in-game
gate verdicts are **accepted**. No remaining carriage/contact/sweat publication
blocker; retain raw trials/prompts and selected native/registration/evidence.

## Durable evidence and transparent-padding optimization

Evidence is retained in [assets/warden105/evidence](../../assets/warden105/evidence/):
[normal-input boss route](../../assets/warden105/evidence/boss-route.json),
[native partition/contact proof](../../assets/warden105/evidence/art-pixels.json),
boarded1×/2×/mobile captures, lift-middle/upper-dock and all six skin-aware sweat
captures. Raw trials, exact prompts, selected native/2× art and final registration
remain in `assets/warden105/`.

Final transparent-padding draw optimization uses source bounds[5,23,182,84]
at unchanged two-world-unit native scale. Fresh browser art proof reports
`croppedMismatches:0` and reassembly mismatches0, preserving every visible pixel
and both measured caster-floor contacts. It changes transparent draw extent,
not geometry, material density or approved appearance; a repeat whole encounter
route is unnecessary for this byte-identical visible result.
