# A real journey into the sewer outlet

The previous current, actor trajectory and pipe opening did not agree. An opaque
foreground masonry curtain concealed the mismatch. Remove that curtain and put
the retained pipe art behind the incoming water and actors.

Retained `assets/sewer125/environment-native.png`, cell12, has its dark aperture
center at native31,27. At the unchanged two-world-unit density and sprite origin
3090,812, that is3152,866 with a conservative30world clear radius. The inner
throat is3164,870. One sampled arc-length path now drives both the visible water
and actor motion. Water highlights converge through the opening into the throat.

Capture requires actual overlap with this finite ribbon, including its upper,
lower and end bounds; jumping above, beside or below it does not trigger capture.
Record the Viking's actual arrival pose, tip into the current, follow the bend,
then recede inside the pipe. Normal scale is1 until the final approach, reaches
.55at the mouth and falls to zero inside. Recession uses nearest pixels and
native-snapped destination sizes, rather than changing the character source art.
Late entry retains its exact initial sole/scale and gets a short settling phase
before recession. Disappearance occurs only after that physical/depth journey.

The original mouth and character images are unchanged. Source/runtime density
remains2world units/native pixel; explicit perspective shrinking happens only
during this exit. The fixed outlet lamp moves clear of the water to3240,780 and
remains attached to rear masonry. Captured actors have no detached full-size
world markers; health remains in the normal HUD picker.

Validate source aperture, finite capture bounds, continuous60/120Hz travel for
each hero, late entries, pause stability and completion. Review staged production
1x/2x frames separately from ordinary-input touch gameplay at actual desktop,
portrait and landscape zooms. Require all three healthy and continuation into
the Drowned Regulator. No opaque frame, ground curtain or screen wipe may stand
in for the actor's own visible entry into the opening.
