# PUB148 independent storeroom partition review

Status: accepted after final open-room and healthy route proof. Reviewer owns
only this report and the visual-gate receipt.

## Intent and visible construction

The requested divider is the horizontal timber wall above the storeroom door,
joining the room to the roof and lintel. It is not another strip beneath the
loft and is not an invisible collision wall across the opening. The header
starts1680,480, extends720world units right and166down to lintel646. The visible
doorway remains1708,646 to floor760,72wide and114high. The partition is cutaway
background construction, while the existing inventory door retains its real
closed/open collision behavior.

Independently inspected source and actual desktop1x, coarse landscape2x and
portrait2x closed-door views. Retained native timber is drawn at two world units
per source pixel, clipped to the header and tied together by the lower beam.
The new overhead mass visibly seats on the existing doorway frame and joins the
roof beam. Its wood grain, fasteners, shaded material and scale remain consistent
with the alehall rather than replacing rich source art with flat invented panels.
There is no new generated/resampled source; this is a continuity source gate.

## Shadow causality and mechanics

The former arbitrary vertical darkness rectangle extended through unrelated soil.
The new cached mask is native313x71 for a626x142world region starting1774,646.
Brightness grows smoothly through the64world threshold into the back room; the
shade fades through the28world floorboard thickness760..788 and is zero below.
The timber above the opening has its own darker material rather than pretending
to be an empty dark room. Local candle/globe light removes shade from this mask.

Actual closed-door views show continuous soil brightness beneath the lit hall
and darker storeroom. The doorway transition is soft, without the old inexplicable
vertical split through the ground. Header and floorboards give the shadow a
visible architectural cause. Foreground heroes retain their adult scale and stand
on the same floor; no support floats above it and no new walking obstacle was
introduced.

Independently ran28 focused pub148/pub147-dialogue/pub147/alehall135 tests: all
pass. Two new regressions assert header/lintel/floor attachment, doorway shape,
no new collision, intermediate threshold brightness and zero shade in soil.
Existing normal-input60/120Hz routes, shield/loft/key interaction, door collision,
pass-through barrel and dialogue behavior also pass. These programmatic checks
support, but do not replace, the final visual gate.

Initial six closed-door captures and their sidecars are in
`assets/pub148/room/`; final ordinary-input route scenes are in
`assets/pub148/touch/`. Both use current imagegen90 heroes, resolving to native
vikings90 Erik/Baleog and Olaf111 sheets.

The ordinary coarse-context route in `assets/pub148/touch/route.json` is already
healthy: wontrue,3HP each,60.0152seconds,8scene captures, errors[] and the expected
fall entry to the sewer. Independently inspected the opened door and floor-break
views. The door leaf retracts while its original frame remains attached beneath
the header, and the collapse exposes a real shaft rather than the former shadow
split. A pause overlay is appropriate to retain that transient floor-break pose,
but initially obscured the upper-header proof in the opened-door views; those
were refreshed unpaused before final acceptance. These are browser/coarse-input proofs,
not physical mobile-device performance or iOS claims.

## Final gates

Independently inspected final unpaused open-door1x, landscape2x and portrait2x
views. The complete horizontal timber infill and its lower beam remain visibly
attached to roof/frame, without a pause overlay masking the construction. Door
leaf and hardware are removed on opening; the room's rear boards remain visible
through the frame. Soft light on floorboards meets unchanged soil consistently.
The final receipt confirms all three heroes complete the existing sequence,
enter the room and fall onward with full health; no puzzle permission changes
were required for this architectural correction.

Source/native continuity gate: accepted. Runtime gate: accepted. Aesthetic gate:
accepted. Cooperation/control gate: accepted. Publication allowed subject to
the integrating agent's final release and live-byte verification. The initial
57.9135second route and paused door screenshots are superseded by the refreshed
60.0152second route and unpaused doorway views; paused floor-break scenes remain
explicitly transient-pose evidence.

## Release verification

Runtime commit `9f5f5e8` published as `01M52QYBDQ7WRZ1ADCB0FQAXJM` at
`https://united-marsh-6ppd.here.now/?campaign=fall&release=pub148`.
All753 tests passed; source/build browser smoke covered31previews across four
campaigns with no errors. Final build contains520explicit files and passes release
hash and publication-gate checks. Live verification matched10critical files plus
HTML against the reviewed build. A fresh live ordinary-input doorway check
captured six desktop/landscape/portrait1x/2x views with current imagegen90 heroes,
the expected partition geometry and no browser errors. Receipts:
`assets/pub148/live-hashes.json` and `assets/pub148/live-room-check.json`.
