# Vikings78: anatomically rebuilt native animation guides

This is a procedural guide deliverable, not a replacement game skin. The source
is `tools/guide-vikings78.py`. It constructs complete poses at native density and
does not import, crop, splice, fit, or downsample any earlier character image.
The failed 77 sources and their guides remain untouched. No production files or
skin selection have been connected to these assets, and no imagegen call was
made for this packet.

## Native geometry and adult proportions

Every cell is **64x64 native pixels**, representing **128x128 world units**.
One native pixel occupies two world units. Registration is **(32,40)** and a
planted foot has exclusive sole **62**: its actual bottom filled row is 61.
Neutral body heights are **36 Erik / 38 Baleog / 36 Olaf** native pixels,
or **72 / 76 / 72 world units**. Equipment can extend beyond the body bounds.

Erik has a narrow athletic chest, Baleog has wider shoulders and longer limbs,
and Olaf has a broad ribcage and waist. Head, neck, shoulder girdle, ribcage,
waist and pelvis are separate anatomical landmarks. The profile has a forehead,
nose, jaw, beard and neck; it is not a square head fixed on a vertical tube.
These deliberately flat semantic colors describe anatomy, limb depth and
equipment, rather than finished metal, leather or cloth materials.

All limbs have fixed segment lengths, in native coordinates:

| Hero | Upper arm | Forearm | Thigh | Shin |
| --- | ---: | ---: | ---: | ---: |
| Erik | 5.6 | 5.0 | 7.45 | 7.15 |
| Baleog | 6.0 | 5.4 | 8.2 | 8.0 |
| Olaf | 6.0 | 5.5 | 7.2 | 7.0 |

Forward walking uses a side-view sagittal plane: knees flex anteriorly, elbows
flex with the correct opposite bend direction. An authored ankle path or arm
angle is resolved into coherent shoulder/elbow/wrist and hip/knee/ankle chains.
Unreachable endpoints raise an error; neither bones nor body scale stretch.
Joint positions retain subpixel precision in metadata, then the completed pose
is rasterized directly onto the native pixel grid with binary alpha.

Rear climbing uses a genuine depth component: knees fold **toward the ladder**
instead of making a wide sideways zigzag. Projected rear-view bone lengths are
therefore shorter than their real XYZ lengths. Validation must measure XYZ,
not mistake anatomical foreshortening for a stretched or collapsed bone.

## Depth, contacts and phase definitions

`near` means anatomical right, nearest the viewer in a right-facing side view,
and screen right in the rear view. `far` means anatomical left. Near legs are
light slate/green and far legs are dark slate/green; near skin is light ochre,
far skin is muted brown. Far limbs are painted first. Adjacent contact phases
may have similar outer silhouettes as the limbs exchange, but their identity,
tone, overlap and joint path exchange too. No copied torso rows are used.

The eight walking phases for the near leg are:

| Phase | Near leg | Far leg | Purpose |
| --- | --- | --- | --- |
| 0 | Heel contact | Toe-off | Forward leg accepts the next step |
| 1 | Compression | Early swing | Pelvis lowers gently over the planted foot |
| 2 | Passing stance | Passing swing | Swing knee passes the supporting leg |
| 3 | Terminal stance | Late swing | Heel begins rolling; opposite leg extends |
| 4 | Toe-off | Heel contact | Anatomical leg identities exchange |
| 5 | Early swing | Compression | Toe lifts and leg folds underneath |
| 6 | Passing swing | Passing stance | Near leg passes the far supporting leg |
| 7 | Late swing | Terminal stance | Near foot extends toward its next contact |

The arms counter-swing continuously with 18-26 degree elbow flexion. The torso
leans, the shoulder girdle counter-rotates and the root compresses/rises by less
than one native pixel across the cycle. Feet roll through heel/flat/toe contact.
Swing soles lift 1.6-3 native pixels instead of following a mechanical circular
pedal path. All eight walking images are independently constructed.

The four idle poses keep both soles and pelvis fixed. Ribcage breadth,
shoulders and head change subtly over a breath, with at most one pixel of
visible head/shoulder movement. Neutral knees use a slight standing flexion,
corrected after the first review found an unnecessarily crouched idle.
Look-up/down rotate authored head vertices about the neck by -22/+25 degrees;
they do not rotate a clipped head bitmap or merely move the eye pixel.

The four rear-climb poses alternate high/retracting hands and raised/supporting
feet. Their XYZ knees enter ladder depth. These local registration studies do
not implement world vertical travel, rung locking, stop/reverse logic or a
particular production ladder's rung spacing. Those remain runtime review work.
The GIF ladder is an orientation scaffold, not evidence of production contacts.

Rise/fall have two poses each; land has compression/recovery/neutral; hurt
recoils. Erik's six bash poses anticipate, load, drive, extend, recover and
settle. Baleog's six sword poses follow a wrist-held arc; the bow sequence has
an extending bow arm, a draw hand near the face, hold, release and recovery.

## Olaf's fixed shield

The plate retains **14x24 native / 28x48 world** dimensions at every angle.
Its transforms are derived from the current `hero-geometry.js` endpoints:

- Front center: native `(46,50)`; world-relative `(28,20)`.
- Overhead center: native `(32,22)`; world-relative `(0,-36)`.
- Overhead native bounds: x20..43, y15..28, with underside at y29.
- Rider walking plane: native y22 / world-relative y-36, through its center.
- Support palms: native `(23,29)` and `(41,29)`, at the underside.

Front shield grip is a concealed interior strap at `(40.8,43.8)`. The forearm
ends at that grip and the shield face is painted over the palm. Moving the grip
to the plate's center would require an unnaturally long arm at these fixed
body and equipment dimensions. The rear-climb shield is strapped to the back
at `(32,46)`, keeping both hands available to the ladder; its occlusion of the
torso and some leg geometry is intentional and visible in the joint overlay.

Overhead walking has a small trunk brace and a distinct neck duck. The helmet
clears the unchanged underside rather than moving or shrinking the shield.
Shoulders and elbows respond to body motion while palms stay on the underside.
The seven raise and seven lower poses follow the same reversible shield arc.

Raised-shield rear climbing alternates **one shield-supporting palm** and the
opposite **ladder-reaching hand**. Poses0/1 use the near hand for shield support
and far hand for the ladder; poses2/3 exchange them. Their separate contact
roles and exact points are in JSON. Both arms are never simultaneously locked
to the shield during these climb poses. Final timing for transfer between the
two support hands remains a runtime animation review, not proven by a guide.

Floating has rise, glide, extended drift and brake poses with unchanged shield
support. These are distinct from the standing overhead-walk poses.

## Full authored coverage and files

| Hero | Frames | Native sheet | Coverage after shared 18-cell core |
| --- | ---: | --- | --- |
| Erik | 32 | 512x256 | 2 rise, 2 fall, 3 land, 1 hurt, 6 bash |
| Baleog | 38 | 512x320 | 2 rise, 2 fall, 3 land, 1 hurt, 6 sword, 6 bow |
| Olaf | 60 | 512x512 | 2 rise, 2 fall, 3 land, 1 hurt, 8 overhead walk, 4 overhead idle, 7 raise, 7 lower, 4 overhead climb, 4 float |

The shared first18 cells are 8 walk, 4 idle, look-up, look-down, 4 rear climb.
Empty trailing atlas cells are transparent padding and have no metadata entry.

For each hero, `assets/vikings78/` contains:

- `{hero}-guide-native.png`: original direct native-density source.
- `{hero}-guide-2x.png` and `-guide-4x.png`: nearest-neighbor enlargements.
- `{hero}-native-density-review.png`: same-source 1x/2x atlas comparison.
- `{hero}-frame-key.png`: labeled pose sheet and native registration grid.
- `{hero}-joint-key.png`: identical art with projected bone/joint overlays.
- `{hero}-guide.json`: all pose, joint, anchor, contact and equipment metadata.
- `{hero}-{action}-6x.gif`: looping native-derived reviews, including mirrored
  direction, for idle, walk, climb and authored hero-specific actions.

JSON schema is `vikings78.anatomical-guide.v1`. Each frame includes `cell`,
`action`, `phase`, `view`, `registration`, `pelvis`, `chest`, `neck`, `shoulders`,
`hips`, `head`, `feet`, `limbs`, `contacts`, `equipment` and `opaqueBounds`.
For each limb, `start/joint/end` mean shoulder/elbow/wrist or hip/knee/ankle.
`lengths`, `flexionDegrees` and `bendPlaneHint` make the rig independently
inspectable. Coordinates are native XYZ: +x forward in side view, +y down,
+z toward the ladder in rear view. Joint-key colors are yellow near arm,
purple far arm, cyan near leg and blue far leg.

Regenerate all files with:

```powershell
tools/pixel-fixer-venv/Scripts/python.exe tools/guide-vikings78.py
```

`--hero erik --first` regenerates just the initial18-frame experiment and will
replace that hero's current full guide packet, so it is for deliberate staged
reproduction only. Use the default command for the final complete packet.

## Review gates and remaining limits

**Native-density/source gate:** author self-review passes for this guide's
direct native-pixel construction and coherent anatomical chains. Independent
review found Erik's revised standing and action anatomy acceptable and requested
the raised-shield ladder correction, now authored. Final independent verdict is
recorded separately by the critic after inspection of the final packet.

**Processed/in-game gate:** **NOT ASSESSABLE / NOT APPROVED FOR PUBLICATION.**
No processing pipeline or game integration has been performed. Atlas1x/2x and
loop previews are guide evidence, not production gameplay evidence. Required
future work includes final material rendering/native-source comparison, actual
gameplay1x/2x/mobile, contacts against real floors and ladders, stopped/reversed
climbing, full equipment transitions and actual passenger soles on Olaf's plane.

Self-critique: these are useful flat pose/anatomy guides, not finished Viking
costume art. Low native resolution hides parts of the far limbs at legitimate
overlap; a later material pass must retain the strong near/far tone separation.
The back-mounted shield conceals anatomy, so its joint sheet is necessary for
review. Four ladder keys describe an alternating cycle but do not establish
perfect production rung transfer or timing. Exact bone lengths alone do not
establish natural motion; visible silhouettes and the looping phase sequence
must remain part of every subsequent critique.
