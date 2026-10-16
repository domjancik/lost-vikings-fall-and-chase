# PUB151 independent musician, speech and story review

Status: accepted. Reviewer changes no runtime code or art.

## Source continuity and placement

Independently inspected the retained `patrons-native.png` and actual indoor/yard
views. The musician row3 now belongs to Halldor at1540, indoors beneath the actual
roof; Torsten at440 uses the travelling-cloak spectator row1. The instrument no
longer appears in the rain. All source dimensions and the two-world-unit native
grid are retained, with no generated/resampled replacement. Halldor is visibly
separate from Hakon1460 and Runa1620, with room for the instrument. Their feet
remain on floor760 and their adult scale/material match the Vikings and tavern.
Lyre sound now uses the same musician registry position1540 instead of the yard.

## Speech and narrative

The former world-canvas rectangle and separate screen-canvas text could scale
differently. The new speech request travels as one label; text and background
are measured and drawn on the same screen canvas using the actual font metrics.
Measured wrapping, padding, speaker tail, minimum11px text, viewport clamping
and the real mobile top inset now agree. Short lines fit their content instead
of leaving an empty fixed-width panel. Ordinary labels retain their old path.

Independently inspected yard and fisher samples across desktop, landscape and
portrait at1x/1.5x/2x. Text is contained and readable, panels fit within the view,
and actual people remain visible beneath their named speech. Independently
checked all18recorded panel/glyph bounds against each screenshot's viewport and
current-skin sidecar. No clipping, oversized background/text mismatch or musician
crowding was found. The tail still identifies the real patron when the panel
is shifted to fit a narrow view.

Runa's original account remains exactly: “We hauled it up in the net. Those little
arms kept working all the way ashore.” Unlocking retains “The fishers left their
find in the back.” The new final clauses and invitations express curiosity about
the stool, cups and impossible object, rather than ordering a party count or
walking each Viking through a door. The existing all-hero inspection trigger
remains a game rule; social practice does not become a hidden story prerequisite.
Era/material continuity remains the familiar Norse hall and the uncanny hauled
find, with no imported neon/machine-room explanation.

## Independent verification and gates

Independently ran27 focused pub151/pub147-dialogue/alehall135/pub148 tests: all
pass. These cover shared rendered speaker anchors, measured panels over multiple
scales, short remarks, sheltered musician/audio position, exact net/fishers story,
human repeated invitations, key recovery/teaching, partition and healthy ordinary
60/120Hz tavern routes.

`assets/pub151/dialogue/evidence.json` records18actual ordinary-input views,
errors[] and current imagegen90 sidecars resolving to vikings90 Erik/Baleog plus
Olaf111. The separate coarse-touch route wins in60.275seconds with all heroes3HP,
8captures/errors[] and the correct sewer fall entry. Independently verified the
durable `route-check.json` SHA256, complete result, arrival, errors, touch flag
and capture count against its retained raw route. Inspected the actual open-door
landscape proof as well; the indoor musician remains clearly placed through the
normal progression. This is browser/coarse evidence, not an iOS hardware claim.

Source/native continuity gate: accepted. Runtime gate: accepted. Aesthetic gate:
accepted. Cooperation/story gate: accepted. Publication allowed subject to the
integrating agent's final build/release and live-byte verification.
