# Magnetic feedback117

Keep physics and approved native sprite rasters unchanged. Blue sole bars must
turn in the same local basis as the character on rounded rails, using2-world-unit
opaque pixels without antialiased Canvas rotation.

Use one body-relative head anchor for health before/during/after magnetic capture:
body center plus local outward normal60world units. Selection uses the same body
basis with68units (80for a raised shield). Equipment flags alone never move health.

During ceiling attraction, connect each actual interpolated glowing sole center
to its actual target rail contact(u +/-9). Bound refraction to narrow paths on the
native grid; keep endpoints anchored while the character rotates and rises.
Flow quiet particles toward the rail. End paths once contact closes to4world units
or pull finishes. Render after world geometry but before actors; draw health and
all other feedback after optical passes so they remain crisp.

Regression checks include vertical/diagonal bars, no upright health jump,
body-relative anchors through inversion, actual path endpoints and contact expiry,
viewport-bounded integer source/destination sampling. Review actual normal-control
corner and ceiling-attraction states at1x/2x and mobile before publishing.
