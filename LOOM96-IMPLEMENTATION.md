# Storm Loom release

The new seventh Machine Rooms level repairs a sky-pattern machine. Olaf builds
pressure through actual shield/exhaust contact and supplies the raised shield
step. Baleog releases a visible retaining pin and operates a reusable timed
clutch from the firing gallery. Erik carries a small bobbin through two physical
guide apertures on moving shuttles, then feeds a supported storm tapestry into
the winding drum. Its cable raises the exit shutter; a ratchet retains it while
the reunion ladders unfold and all three reach the portal.

Three original imagegen concepts and prompts are retained in
assets/level96/concepts: Counterweight Chapel, Storm Loom and Resonant Archive.
Storm wins for the new spatial act of carrying thread through a moving machine;
its safe commissioning, warned beaters, timed second span, recovery floor and
retained progress provide a short progression rather than repeated switches.
Guide heights were tuned near the jump apex to avoid one-frame precision.

Reusable repo skills are linked from AGENTS.md: native-sprite-art now explicitly
defines the preferred material/volume and density quality; grounded-parallax
covers whole-plane horizontal/vertical movement and measured foundations;
cooperative-world-design covers world purpose, causal mechanisms, pacing,
recoverability and independent review. All three pass the skill validator.

Original runtime sources, rejected iterations, native guides, exact prompts,
registration metadata and 64 actual production views remain in assets/level96.
Parts480x288, terrain96x96, far960x640, middle384x256, bobbin20x20 and cloth48x80
use their own native footprints. Each native pixel is two world units. Original
components are isolated before one uniform sample; anchors use translation,
not per-object stretching. The middle's broad foundation is measured at248.
Rotating parts use bounded native-raster caches and quantized rendered positions.

Independent source, runtime and cooperation acceptance is recorded in
LEVEL96-REVIEW.md and assets/level96/visual-gates.json. The review corrected source
spill, overly fine texture, ungrounded supports, missing transmissions, cloth
output readability and mobile framing before publication. Ordinary up-look is
retained on pause so the player can inspect machines using the normal camera.

Validation: node --test *.test.js —407 passed. Focused regressions cover shield
contact, full bobbin clearance/order, continuous drive, retained exit, healthy
ordinary-input completion, missed-jump recovery, damage/death/retry, signed piston
velocity reversal, visible pin stroke and Erik's original running bash.
tools/browser-loom96.mjs drives the real title card, keyboard controls and hero
selection; it never injects game state or teleports actors. The reviewed browser
route completed at111.1583 simulation seconds with HP3/3/3 and no errors; its
extra floor walk/jump/look detour collects the full mechanism matrix. Production
retry resets the crew, thread and machine. Evidence is retained under
assets/level96/evidence. Failure/recovery tests are simulation evidence; the
full completion, inspection and reset evidence comes from actual browser controls.

tools/freeze-loom96.mjs builds on verified output/release-menu95/dist, copying
only this release's changed modules and artwork. Other modules must match that
base after cache-query normalization. Publication requires all three accepted
gates. The generated publisher updates the existing here.now site; live assets
are checked by hash and the same browser route is replayed after deployment.
