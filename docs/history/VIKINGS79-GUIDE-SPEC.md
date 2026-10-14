# Olaf79: a held round shield

This sibling guide corrects Olaf78's floor-level rectangular shield. The user
requested the round version, visibly carried clear of the floor, with subtle
held motion. `tools/guide-vikings79.py` reuses the preserved78 anatomy generator
and replaces only Olaf's shield geometry, shoulder/grip response and associated
support posture. Neither78 sources nor production rendering were changed.

## Native anatomy and shield geometry

The native cell remains64x64, world cell128x128, origin32/40, exclusive planted
sole62, and neutral adult body height36native/72world. Upper/lower arm lengths
remain6.0/5.5 and thigh/shin lengths7.2/7.0 native. All60 previously authored
action poses remain present, including8walk,4idle,4rear climb, raised-shield
walking/climbing, raise/lower and floating. Anatomy and near/far identities
remain authoritative.

The shield is now a **round24native-pixel diameter /48world-unit diameter**
face. Side-held center is approximately native44/43. Its center follows the
actual ribcage/shoulder vertical motion, rather than an independent post-render
offset. Walk/idle centerY varies42.35..43.45 (1.10native pixels total); measured
opaque shield clearance is **7–8native pixels** above the foot plane. The
minimum required clearance is4native pixels. The front shield never shares
the foot's sole anchor.

The concealed interior strap is4.5native pixels left and1.5above the moving
front center. Its palm endpoint is transformed with the shield, and the arm
is solved to that exact target using the existing bone lengths. The shield
face is painted after the arm to hide the palm. The free far arm retains its
counter-swing. A rear-climb shield uses the same round face, strapped to the
back near32/44 with body motion, leaving both ladder hands available.

Overhead, the same round face is **foreshortened to24x6native pixels**.
The6pixel apparent depth describes the camera's visible face/profile; it is
not a changed physical diameter or a six-pixel-thick wooden shield. The face
projects as an ellipse, not a rectangular plate. Apparent depth varies smoothly
as `6+18*cos(tilt)` during raise/lower, from24 upright to6 overhead.

The overhead center and rider plane stay **nativeY22 / world-relativeY-36**.
Its visible underside is nativeY25. Supporting palms meet that underside at
`(25.5,25)` and `(38.5,25)`. The shoulders elevate naturally to reach the new
underside without stretching the arms; the helmet clears the profile below.
Overhead-climb still alternates one supporting palm with one ladder-reaching
hand, and metadata explicitly identifies each role. Production hand transfer
and passenger contact still require runtime evidence.

## Files and reproduction

The full60-frame guide packet is in `assets/vikings79/`:

- `olaf-guide-native.png`:512x512 original native-density guide.
- `olaf-guide-2x.png`, `olaf-guide-4x.png`: nearest-neighbor enlargements.
- `olaf-frame-key.png`, `olaf-joint-key.png`: labeled poses and joint overlay.
- `olaf-native-density-review.png`: actual source1x beside exact2x.
- `olaf-guide.json`: anatomy, moving grips, contact roles, projected dimensions,
  actual shield bounds, opaque bottom and actual floor clearance.
- `olaf-*-6x.gif`: native-derived mirrored animation loops.
- `olaf-walk-input-native.png`:256x128 transparent source, four columns/two rows.
- `olaf-walk-input-4x.png`:1024x512 transparent imagegen input; exact4x enlargement
  of eight64x64 walk cells, phase0–3 first row and4–7 second row, without labels.

JSON schema is `vikings79.round-shield-guide.v1`, retaining78's joint schema.
Shield entries add `shape`, `physicalDiameterNative`, `projectionSize`,
`overheadProjectionDepthNative`, `bodyDrivenBobNative`, `opaqueBoundsNative`,
`actualBottomExclusiveNative` and `actualGroundClearanceNative`.

```powershell
tools/pixel-fixer-venv/Scripts/python.exe tools/guide-vikings79.py
tools/pixel-fixer-venv/Scripts/python.exe tools/validate-vikings79.py
```

The generator uses the unchanged `tools/guide-vikings78.py` for shared native
anatomy and evidence rendering. It writes only the sibling79 asset directory.

## Imagegen handoff and costume additions

The parent supplies `VIKINGS79-IMAGEGEN-PROMPT.txt` and performs the separately
authorized imagegen attempt. This guide-authoring task made no imagegen call.
After the guide was reviewed, the user requested longish beards and horned
helmets. The material-render prompt permits **3–4native-pixel horns** and a
**5–6native-pixel beard** in transparent cell space. Those are explicit costume
additions; the guide remains authoritative for adult body scale, limb anatomy,
pose timing, round shield diameter/clearance and all grip anchors. Costume
additions must not enlarge the head/body or replace the authored gait.

## Review status

**Native-density/source guide gate:** author inspection passes. The independent
critic accepted the eight-walk input before the parent imagegen call. Round
silhouette, carried floor clearance, body-driven bob and concealed grip are
visible in the native source and exact enlargement. A rendered imagegen source
requires its own separate native-density/pose-fidelity verdict.

**Processed/in-game gate:** **NOT ASSESSABLE / NOT APPROVED FOR PUBLICATION.**
These guides are not connected to gameplay. Native atlas views and looping
studies do not establish real floor/rung/rider contacts, mobile readability,
stopped/reversed climbing, support transfer or production animation timing.

The independent parent validator passes fixed XYZ bones, native body scale,
soles, round-shield floor clearance, held bob and unchanged overhead rider
plane. Visual critique remains necessary even when those checks pass.

Self-critique: the large round face legitimately hides much of Olaf's near arm
and torso; joint overlays are required to inspect the hidden grip. Flat guide
colors are not finished costume/material art. The overhead ellipse deliberately
describes a readable platform profile while preserving the exact rider plane;
actual passenger soles and side/rear occlusion need a later production review.
