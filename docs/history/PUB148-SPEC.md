# Storeroom partition and architectural shadow

The requested divider is the horizontal wall above the storeroom doorway at
the bright/dark room boundary. The earlier under-loft backing did not provide
this divider.

Use the retained `assets/alehall135/architecture-native.png` timber at two world
units per native pixel. The cutaway header occupies x1680–2400, y480–646: its
top joins the roof beam and its bottom joins the door lintel. The walking
opening remains x1708–1780, y646–760. This is rear/cutaway scenery; the existing
keyed door remains the only collider at that opening. Do not invent a new
platform, invisible obstacle or support.

Replace the old dark rectangle extending down to y1250 with a static native
room mask starting beneath the lintel. Its threshold penumbra spans64world
units; shading fades through the28world-unit floorboard thickness and ends
at y788. Earth below the boards has one consistent lighting treatment. Existing
candle and creation-globe light still illuminate the room. Cache the22,223pixel
mask once; preserve the existing per-view light subtraction pass.

Validate partition attachment, doorway clearance and shadow/floor bounds in
unit tests, plus actual latest-skin1x/2x desktop and mobile views. Play the
ordinary-input healthy tavern route through keyed entry, inspection and the
floor collapse into the sewer. Independent source, runtime, aesthetic and
cooperation gates must accept the final evidence before publication.
