# Visible grounding and interaction contract

This is mandatory in the campaign critique cycle, alongside HUMAN-SCALE.md.

## Native sprite resolution

Apply [native-sprite-art](../../skills/native-sprite-art/SKILL.md) to every generated
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

## Artistic fidelity is a separate blocking gate

Native-grid compliance is necessary, but does not establish artistic quality.
Compare the preferred earlier source, shipped baseline and proposed replacement
at the SAME apparent gameplay size, in isolation and inside the full scene.
Preserve modeled volume, directional light, beveled construction, raised hardware,
deep recesses, hue-shifted material ramps and deliberate clustered wear. Reject a
flatter, toy-like or less polished replacement even when its grid/alpha/anchors
pass. Do not invent 16/24-color limits or 2–3-plane restrictions; a coherent pixel
grid permits rich shading and one-native-pixel highlights. Remove subpixel noise
without erasing the design's relief. If either richness or density fails,
regenerate at the intended density; do not use one gate to excuse the other.

New asset reviews use `reviewVersion: 2` with separate accepted sourceGate,
runtimeGate and aestheticGate verdicts. Record what improved and what richness
was retained, with actual comparison evidence. Publication validation blocks a
missing/rejected aesthetic verdict for this schema; historical receipts stay intact.

All general environment/gameplay screenshots explicitly use `skin=imagegen90`:
Erik/Baleog vikings90, Olaf olaf111. Record selected skin and resolved asset paths
in capture receipts; verify ready assets before taking pictures. Current aliases
the complete corrected set, never a mixed legacy set. Historical/comparison-skin
captures are allowed only as labeled comparison evidence, never as the sole scene
fit approval. Do not rewrite old evidence to claim it used the new set.

## Ground contact

For articulated feet, measure each near/far sprite independently from its actual
opaque material rows. Register the **exclusive** bottom (`last material row+1`),
not an interior sole stripe or the atlas cell edge. Verify that no material pixel
extends below the physical plane at1x/2x; shadows are separate. Moving a foot
requires reconnecting its ankle mounting pivot while preserving rigid links.
Record measured source rows and pixel/contact regression results alongside
actual grounded, raised, braced and shutdown captures. A previous visual approval
does not waive this measurement (Warden103 corrects a missed8/6-world-unit overrun).

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

Identify the first opaque terrain row at the physical surface, rather than
using a lower bright highlight as the floor. Compare actual screenshot pixels
with the snapped camera and native raster dimensions (including rounded raster
height). A dark structural top strip can be valid contact; an exposed background
row between planted sole and that strip is an actual gap. For generated gait
poses, never add guide head bob as a whole-image translation that lifts an
already authored planted foot. Register reviewed anatomical contacts and
recheck the modest head/core excursion and loop seam in gameplay.

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

### Guide anatomy before image generation

Review a procedural guide before using it as an image-generation reference.
Inspect its joint overlay, opaque silhouette and looping motion separately at
native size and nearest-neighbor enlargement. A plausible still pose, correct
cell size or fixed feet cannot approve an awkward guide cycle.

Record separate near/far shoulders and hips, elbow/wrist and knee/ankle chains,
nominal segment lengths and authored support contacts. Limb lengths must remain
consistent within native-grid rounding; do not choose a common knee row or move
elbows independently to approximate a swing. Check bend direction and readable
flexion throughout the cycle, including passing and rear reaches. Reject sharp
arbitrary zigzags, collapsing limb volume and abrupt joint-direction flips even
when a numerical length check passes. Pelvis, chest, shoulders and neck must
form a coherent adult body with connected limbs.

Show contact, compression, passing and swing; retain limb identities as their
depth order changes. Review torso/head response with planted feet, neck-led
look direction, ladder-facing alternating grips and equipment contact. Correct
the guide itself when these fail. Do not ask image generation to invent anatomy
over a faulty skeleton. Guide acceptance approves animation constraints only;
it does not waive raw rendered-art or actual-game review gates.

### Actual character motion

Inspect each hero moving away from the parked group: overlapping bodies cannot
establish a gait verdict. Capture planted contact, compression, passing and
swing at 1x/2x. Count meaningful phase families rather than near-duplicate cells.
For every generated gait key, compare the actual near/far hip-to-knee-to-boot
chains against that exact guide phase. Record which anatomical leg is forward,
which supports weight and which swings; correct colors on two plausible boots
do not prove their ownership. Check the opposite-contact keys explicitly before
expanding a pilot. A pilot accepted for shading or equipment dimensions has no
motion approval until these chains are checked.
Inspect palms at gameplay size throughout the loop, especially when a far hand
crosses a beard or cuff. One or two skin pixels overwhelmed by a dark cuff can
read as a missing hand even when the raw source technically contains flesh.
Check the native head/core root across the entire cycle; a five-pixel excursion
is a failed walk, even when every boot touches the floor. Idle head, silhouette
and feet must stay registered. A detected helmet landmark must exclude collars,
trousers and disconnected color noise; inspect the actual neutral head component.

Climbing faces the ladder, advances with actual vertical travel, freezes at the
last reached grip and reverses without resetting. Do not register from the lowest
moving boot. Inspect alternating left/right reaches, stopped poses and equipment
in both shield states. A raised shield must retain its physical rider plane.
Track each limb's cloth, armor, skin and trouser palette through every grip:
lifting/crossing a limb must not exchange its material with the other limb.
Keep near/far shading attached to anatomical identity, including rear views;
inspect adjacent frames and complete loops for color pops. Brown trousers need
brown highlights, rather than slate patches that imply a costume change.
Inspect floating rise, glide and braking separately; register supporting palms
to the unchanged shield underside rather than aligning dangling feet. Include
mobile evidence and passenger soles when a pose can carry another Viking.

## Acceptance

### Gameplay feedback and crew resources

Review traveling effects early, midway, near expiry and after removal. Refraction
and the visible crest must follow the same world position and life envelope;
keep sampling/displacement on the native grid while opacity dissipates. Verify
that quantized displacement does not round away the effect prematurely. Retain
viewport-limited copies and a mobile-sized performance check.

Attach sweat and similar body feedback to the actual rendered head/body landmark,
not an assumed collision-box top. Inspect early and sustained strain, stopped
simulation and release. Crew resource meters must show inactive heroes too and
follow authoritative strength/air/recovery values. Check depletion, replenishment,
integer-second boundaries and death/reset. Verify names, health and inventory
remain readable without overlaps or shrinking the gameplay canvas. Use actual
mouse-desktop and coarse/mobile browser contexts: changing viewport dimensions
alone does not change pointer media queries.

### Full movement envelopes and fluid transitions

Inspect the whole swept range of moving machinery, including its resting state
after water recedes or another support disappears. A float must berth on visible
structural support before it intersects a bell, wheel or actuator beneath it.
Use one authoritative physical deck height for riders, artwork and all ports.
Check docking approach, first contact and the final drained state. An actuator
is not a parking support unless its construction explicitly communicates that
role. Include actual support contact, rather than accepting a completed route.

For buoyancy, measure actual per-step character displacement through side entry,
submerged ladder release and surface settling. Reject direct surface-height
assignments that teleport a deep character. For ground contacts, distinguish
the visible structural tire/foot from a dark shadow or stray alpha at the bottom
of a cell. Preserve native scale; correct registration by translation.

Exercise attached hose/cable geometry across the full relative movement range,
including when endpoint heights cross. One invalid intermediate bend can stop
the render loop even when start and end screenshots look correct. Require a
normal-control browser completion with no page errors after final art integration.

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
