# Visible grounding and interaction contract

This is mandatory in the campaign critique cycle, alongside HUMAN-SCALE.md.

## Native sprite resolution

Apply [native-sprite-art](skills/native-sprite-art/SKILL.md) to every generated
or replacement sprite, including characters, equipment and animated props.
Before generation record its intended display/world size, native pixel size,
cell dimensions, subject height and animation anchors. Generate matching native
detail density; a large output may enlarge those pixels but must not add detail
that will be destroyed at the target size. Reject high-resolution painted art
that needs downsampling or grid detection to rescue it.

The critique subagent must record two separate verdicts in the review log:

- **Source gate:** inspect the original beside its intended native-size view.
  Accept only deliberate, readable pixel clusters at the target density.
- **Runtime gate:** compare original and processed art at the same apparent
  size, then inspect actual gameplay at 1x/2x and mobile where relevant. Check
  silhouettes, outlines, noise, alpha, mirrored poses, equipment bounds,
  stable frame registration and actual visible contacts.

Record dimensions and source/capture paths with both verdicts. Missing evidence
or a failed verdict blocks publication of the affected assets. Correct the art
and repeat the affected review. Dimensions, alpha tests and level completion
cannot substitute for visual acceptance.

## Ground contact

For ceiling-mounted machinery, locate the actual opaque mounting flange rather
than the atlas cell's top edge. Remove neighboring-cell extraction spill before
measuring it. The flange must visibly join a ceiling or a service arch with a
traceable footing. Derive lens/pipe/shaft terminals after registration. A sprite
can have a correct bounding box while its main housing still floats.

For reused carrier art, read its registered walking rim, not the rear railing
or an assumed row from another carrier. Include an actual rider-at-dock capture
and an anchor regression test. Recovery captures must frame the moving or docked
object itself; a successful flag or an offscreen object does not establish contact.

Review visible opaque pixels, not canvas bounds or a single stray alpha pixel.
Locate each scene's broad structural foundation strip. Its visible underside
must meet or slightly enter the foreground support plane at both zooms. Check
left, middle and right portions while the camera moves; no exposed sky strip
may separate the foundation from its floor. Preserve pixel-grid dimensions.
Hanging structures must visibly join their ceiling beam instead.

For character-supported platforms, inspect visible rider soles against the
declared walking plane, including center-plane contact on Olaf's raised shield.
Check paint order: the supporting sprite must not hide the rider's soles and
make correct physics look like edge contact. Hands must still visibly grip
the support when its rendered position changes.

Every platform post needs an identified lower floor/deck at the same x interval.
Trace from deck underside to that footing in the screenshot. Reject fixed-length
posts that end in air. Check upper decks, split-height lower floors and side
edges; automatic geometry tests must enumerate every authored platform.

## Interaction state matrix

For each interactive object record: initial, moving/working, completed/held,
and reset state where reversible. Use actual production controls for screenshots.
Successful logic, a toast, an invisible flag or an output opening elsewhere is
not proof that the interacted object changed visibly.

Mechanical state art must use authored sprite frames matching the environment.
Reject placeholder canvas panels, shafts or socket overlays. Require fixed cell
dimensions and a registered broad base across all frames; reversing a mechanism
must traverse the same sequence backwards. Inspect the runtime atlas at its
actual display scale, not only the high-resolution generated source.

- Ratchets: raised handle → continuous grid-snapped stroke → lowered locked
  handle, inserted lock pin and persistent active indicator. Completed use state
  reflects the same secured flag as the door logic.
- Triangle socket: empty matching outline → wafer insertion motion → visible
  seated wafer and retained indicator, after the carried item is consumed.
- Lift controls: actual commanded up/down position changes the handle pose;
  both landing controls follow the same lift, and reset reverses the pose.
- Route/isolation/escape/reset controls: persistent completion follows the
  authoritative mechanism state. Working stations must visibly show progress.
- Archive/body cradles, treads, fragile targets and cut restraints: check their
  occupied/held/broken/released state and continuous transfer animation too.

Keep before/after captures at the same camera and zoom; also capture one
intermediate frame. Review the interacted object's own pixels. If the object
cannot be located or its change is ambiguous without a label, reject it.

## Character motion stability

Inspect each hero moving away from the parked group: overlapping bodies cannot
establish a gait verdict. Capture planted contact, compression, passing and
swing at 1x/2x. Count meaningful phase families rather than near-duplicate cells.
Check the native head/core root across the entire cycle; a five-pixel excursion
is a failed walk, even when every boot touches the floor. Idle head, silhouette
and feet must stay registered. A detected helmet landmark must exclude collars,
trousers and disconnected color noise; inspect the actual neutral head component.

Climbing faces the ladder, advances with actual vertical travel, freezes at the
last reached grip and reverses without resetting. Do not register from the lowest
moving boot. Inspect alternating left/right reaches, stopped poses and equipment
in both shield states. A raised shield must retain its physical rider plane.
Inspect floating rise, glide and braking separately; register supporting palms
to the unchanged shield underside rather than aligning dangling feet. Include
mobile evidence and passenger soles when a pose can carry another Viking.

## Acceptance

Run focused pixel/support/state regressions, all normal-control simulation
routes, and the affected production browser routes. Independently inspect the
state matrix and contact screenshots before accepting. A route clearing and
static spawn survey cannot waive these gates. Record specific captures inspected,
checks performed and any unverified contexts; resolve blockers before publishing.

Diagnostic pauses and viewport changes must settle before resuming input. Check
that a critical commanded pose actually applied before leaving a safe platform.
A driver exception or failed route is failed evidence, even if earlier pictures
look correct; repair the harness and repeat the affected route.

### Entity base anchors

For every floor-standing sprite, record its alpha-derived visible bottom and
identified supporting floor/platform. Transparent cell padding is not contact.
Use `createAtlas.drawGrounded` for animated floor-standing props; choose the
nearest authored surface below the entity center, preserve cell scale, and
align the visible base to that surface. Broad-base detection ignores isolated
alpha noise. Narrow feet or hanging objects need an explicit reviewed anchor.
A missing base/support must remain a failed check, never a silent canvas-edge
fallback. Inspect every animation frame for zero gap and stable registration.
Review runtime contact diagnostics AND close screenshots at 1x, 2x and mobile;
prior approval or level completion cannot waive an unexplained visible gap.

## Connections after grounding corrections

Cables, ducts, shafts and hoses must use ports on the final grounded sprite
placement, never its old nominal rectangle. Critique must inspect every
connection terminal against actual opaque housing pixels after placement changes,
including all animation frames. Draw the housing over its terminal to seat the
connection naturally; retain physical floor contact and pixel-grid coordinates.
