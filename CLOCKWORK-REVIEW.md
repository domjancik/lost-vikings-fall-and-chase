# Inside the Clockwork69 independent review

Initial critique of CLOCKWORK-SPEC.md, assets/clockwork69/brainstorm.png and the
first wheel/spring source, under the repository native-art and visual gates.
No runtime changes or implementation acceptance are included.

## Causal design

The coherent version is the proposed wheel-driven freight carriage with a
counterweight and final holding ratchet. This is preferable to unrelated doors
that alternate because a timer says so. Wheel/shaft rotation must physically
explain carriage progress; braking holds position, reversal follows the same
visible route backwards, and ratchet completion visibly explains why the
carriage/portal remain safe after the runner is released.

Assembly uses recognizable matching upper/lower rims, exposed suspension link,
guide chute and seam pins. Arrow cutting the exposed link must visibly release
the actual hanging half. A solid bronze chain should not silently break from
any point on its housing: provide a clear weak link/tether consistent with
existing material rules. Likewise, the final retaining pin needs a narrow,
visibly breakable stem or latch target; avoid sword-cutting an unexplained solid
gearbox. No named-hero lock is justified by object labels alone.

The specification's reversible carriage, safe wheel release floor, maintenance
ladder and ratchet address the risk of solving the portal while permanently
abandoning Erik. Require actual release and reunion, not teleporting him to the
exit or declaring success while still in the wheel.

## Numeric geometry and recovery gates

- **First glide:** Olaf must step off an elevated takeoff, not gain an invented
  jump. The current movement implementation caps raised-shield descent at100
  world/s and horizontal speed150. Feet380→650 gives about2.7s and roughly400
  horizontal travel before acceleration costs; a320gap has useful margin, but
  the proposed3.33s estimate uses another fall rate. Validate the actual original
  movement and passenger inheritance at60/120Hz. Baleog must board safely before
  takeoff, retain sole/center-shield contact, and have an accessible retry path.
- **Upper-half transport:** author suspension→serviceledge→chute→lowercup as
  one continuous physical path. No springing straight to the seam when Olaf
  crosses a trigger. Show shield push contact in both facings; ensure there is
  room to walk around the landed half without crossing a void or trapping it.
- **Closure/occupancy:** keep ample headroom while closing around an adult.
  Guide pins, not invulnerability, explain avoiding a falling roof crush. The
  unoccupied cup's side-entry latch prevents late-board softlock. Define how
  wrong occupancy, stepping out before launch and multiple nearby heroes work;
  no accidental sealing of a teammate with no reversible service release.
- **U track:** for rail560/800→1050/1120→1640/920, measure normal-offset wheel
  contact against the authored rim and every deck/support. Segmented joins need
  smooth tangent/contact transitions and visible hinge structure. Avoid a
  procedural path change that relocates the wheel between segments.
- **Spring flight:** vx500, vy-574 withg700 spans about820horizontal units at
  the same height, matching1640→2460. This is nominal coincidence, not a timing
  margin: specify launch center, spring compression/release interval and broad
  docking catch aperture. Test swept entry at60/120Hz and nearby speeds, plus a
  safe failed landing/reset route. Check the complete wheel/head clearance at
  its apex (approximately235units above launch), not just its center.
- **Freight ride:** carriage width180 must permit both waiting Vikings and
  actual boarding at the left dock. Its route1640/920→2700then530 needs visible
  horizontal/vertical guide and counterweight connection. Braking and switching
  heroes must preserve rider contacts and phase; docks need enough waiting
  time to reposition without perfect frame timing.
- **Steam:** show charge at the real nozzle before damage, permit a safe
  brake/wait solution as well as shield protection, and keep inactive crew safe.
  No random phase restart on selection or invisible damage during warning.
- **End state:** ratchet1 holds the upper dock and powered portal independently
  of continued running. Broken retaining pin disengages the actual train and
  opens the enclosure continuously over a safe920floor. Ladder2900 must join
  that floor and balcony530 while clearing the opened wheel/carriage. All three
  must have an unobstructed physical exit route after the pin is broken.

## Split-view contract

Only the active trapped runner invokes the special view. The main crew/machinery
pane remains large enough to judge moving carriage, steam and boarding; the
runner inset shows the actual production character/interior rather than a
schematic. Switching to either outside Viking restores the normal camera
without a jump in simulation time. Controls stay consistent: left/right drive,
release brakes, USE boards/leaves only where physically permitted. Portrait
and landscape layouts require actual1x/2x captures, no overlapping HUD/hints
or a large inset obscuring the next hazardous contact.

## RAW art preflight

Inspected original exec-5ad53f9d-7dba-4edd-9ea8-8c82d4bda8ff.png, a4x2 sheet
retained through the generator output. **Material/detail density: suitable
preflight at approximately96native cells**, using deliberate coarse roughly
5-source-pixel clusters and broad bronze/teal shading. The brainstorm is
composition evidence only, not production-density acceptance.

**Proposed80cell geometry needs adjustment before final source acceptance.**
The original outer wheel occupies about85% of its source cell and its hole
about60%. Reducing the whole source cell to80native would give roughly68–70
opaque wheel pixels and48–50interior pixels, below the stated56interior contract.
Use a96cell with a uniform source factor approximately4.7–4.8 if the intended
opaque diameter is80native/160world, or explicitly revise actual radius and
adult headroom after measurement. Do not stretch only the alpha bounds.

Upper/lower halves must overlay the full wheel's main rim at one fixed center
and uniform scale. Their seam tabs and spring bases require fixed authored
anchors; do not independently fit each pose. Spring closed/loaded/released
states have differing heights but must retain the same base and fulcrum, with
actual opaque contact. Require same-size source/native overlays before accepting
the complete source geometry. New machinery/background sources remain pending.

## Required validation and pending verdicts

Mechanical tests: actual passenger glide, all half travel/seam stages, late-board
and wrong occupancy recovery, track/deck sweeps, spring capture/miss/reset,
brake/reverse/selection holds, two-rider freight carry, steam warning/shield/live,
ratchet-before-pin constraint, continuous release and actual all-crew exit.
Full ordinary-input60/120Hz routes must pass with recoverable failure tests.

Production browser evidence: both glide contacts, suspension initial/cut/fall,
half push/chute/closure, running interior, spring compression/launch/catch,
linked carriage/counterweight phases, split-view selection, steam wait/shield,
ratchet/pin break/disengagement, released Erik and reunion. Inspect own pixels
at matched cameras, actual1x/2x and mobile. Successful logic cannot certify
grounding, material affordance or animated progress.

**RAW complete source gate: PENDING target geometry/registration and remaining
assets. PROCESSED / actual runtime gate: PENDING implementation and evidence.**
This initial critique authorizes no publication acceptance.

## First implementation/source audit

Inspected retained source-parts, source-machine, regenerated source-dock and
source-scene, plus parts-review and current native atlases. **RAW detail-density
preflight: PASS for the used parts and regenerated dock.**96-native cells retain
coarse material planes without per-pose alpha fitting; the original filled
aperture machine/dock row is rejected and unused. New dock160x224native retains
its clear aperture and complete safe horizontal borders. Full wheel native
bounds(7,7,88,88) give the intended approximately80world main radius; seam clamp
pixels on both half poses align around row48. Spring frames end at96 with fixed
base despite different loading heights. Raw complete source acceptance remains
pending final registration/visual integration evidence.

Code audit identified blockers, communicated before corrections:

1. Waiting half requires Erik already in the cup, while the spec promises
   unoccupied joining/side entry and USE exit before launch. There is no such
   routine yet. Add physical occupancy/boarding and reversible retry, or author
   a visible weight catch and accurately specify that behavior; no hidden Erik
   ID object gate or accidental irrecoverable wrong-hero occupancy.
2. Chute y650→640 is uphill while accelerating left along a horizontal visual
   guide. Descend continuously or visibly power the ascent with a mechanism.
3. Pin release keeps the closed full wheel rendered while adding a departing
   upper half. The actual released screenshot confirms the closed enclosure
   persists. Replace full-ring rendering with lower cup and moving upper half
   during release; character physics alone cannot demonstrate opening.
4. Partner gears use world-canvas rotation rather than native raster rotation,
   and a chain sprite is nonuniformly scaled into a48x72pin. Use proper native
   raster rotation and an authored pin at uniform native scale.

Independent first clockwork.test.js run passed the original seven tests/full
60/120routes, while three newly added occupancy/chute/steam regressions failed
against the still-unfixed implementation. These are recorded as an interim
test state, not a final failed release or a passing current suite.

Inspected current glide, joining, docked, released and split-drive-mobile actual
captures. Shield rider/grip contact reads correctly. Additional actual issues:
upper-camera glide leaves a flat uncovered strip below the HUD because
backgroundy236+camera*.2 can be positive relative to the view; cover the view
without changing native scale/aspect. Pause badge overlaps the mobile runner
inset; provide unobscured final split evidence. Dock alpha base ends193of224,
so drawy616 produces foot1002, below deck920 but above lowerfloor1260. Identify
and visibly connect its true supporting footing rather than assuming canvas
bottom means contact. Final grounding/state evidence must resolve these.

PROCESSED / actual runtime gate remains pending corrections and refreshed
ordinary-control1x/2x/mobile contact/state captures.

## Corrected implementation and dedicated pin preflight

Inspected source-pin.png and pin.png: **RAW dedicated-pin density/material
preflight accepted.** A narrow red stem, authored fracture/broken/released
states and broad brass ratchet form provide a meaningful blade target.
Uniform32x56native packing replaces the distorted chain overlay. Actual stem
contact and persistent broken state remain required in current gameplay views.

Current code adds occupant-based weight closure, reversible USE entry catch,
downhill640→690chute, lower-cup/departing-upper rendering during release,
native-raster partner rotation, true dock footing at1002, upper-camera scene
coverage and swept course clearance with staging deck1720..1840. The docked
train can be returned after first reaching the ratchet, and nonjumping wrong
occupants have a physical exit ladder after reopening the starting cup.
Independently ran19current mechanics/view/render tests successfully, including
the added recovery and empty-carriage checks. This supersedes the earlier red
interim test state, but does not by itself accept corrected art contacts.

Awaiting fresh route completion before reviewing replaced release/split images;
older images are not reaccepted. One causal cue remains to verify: after its
downhill slide, catch state raises the roof690→640. The renderer currently
changes a small connection tile30/31, rather than exposing a spring/catch stroke.
Require an actual visible linked actuator/intermediate state that explains the
rise; a code comment naming a spring is not proof that the roof is supported.
If the final capture reads as levitation, author that support or revise the
physical guide route instead. Final source/runtime acceptance stays pending.

## Final refreshed source and recovery review

**RAW / source gate: ACCEPTED.** Independently inspected the retained parts,
machine, replacement dock, pin, scene and new catch sources against their
actual target sizes. Parts and machine use96native cells; the open dock uses
160x224native; pin32x56; catch48x80; scene768x512. Coarse brass/teal material
clusters survive the once-from-original uniform native packing. The original
machine's filled-aperture dock row remains rejected and unused. The replacement
dock has a real transparent aperture in every used state. The catch source
has recognizable fixed foot, coil, sliding head and supporting hook; it is not
a high-density painted asset rescued by a second processing pass.

**Mechanics/code gate: ACCEPTED for the inspected current implementation.**
Independently reran clockwork.test.js, clockwork-view.test.js and
clockwork-render.test.js:22passed,0failed. This includes60/120Hz ordinary-input
routes, full-wheel swept clearance, reversible starting entry, nonjumping
occupant escape, late boarding, reverse freight motion, released rim escape,
recovery ladders and the linked catch stroke. The current mechanism closes
from actual cup weight, not an arbitrary Erik-only object rule. Portal ratchet
and carriage travel remain separable, preventing a stranded empty carriage.

Inspected refreshed retry catch compressed/moving/held desktop views, joined1x,
reopened mobile, shield boarding landscape, spring loading, reverse freight,
released1x/mobile and split-drive mobile. The catch head rises with the roof
while its broad feet remain on the two visible support pads; native component
translation exposes a lengthening coil. Thus the prior levitation finding is
resolved. A misplaced authored hook frame is excluded, not falsely certified
as a working intermediate pose. Released art now shows a genuinely open lower
cup and the detached upper arch on the dock's1002footing. Erik's soles remain
on the cup's actual inner rim. Dock feet contact the dedicated platform and
support piers; upper scene coverage has no prior blank band. The mobile split
inset is clear of the compact pause badge and lower controls.

Browser evidence remains the implementer's ordinary-keyboard run, independently
examined through captures/logs here, not a second reviewer browser playthrough.
The recovery log records144.8667simulated seconds, all three heroesHP3,
won:true, Enter continuation (data-won false after advancing) and no page errors.
The standard final run was reported99.858seconds with the same outcome.

**PROCESSED / actual runtime gate: pending one evidence correction.**
retry-catch-held-mobile.png follows Erik and contains no catch; it cannot prove
the device's mobile contact. Require an actual mobile compressed/held pair with
camera on the catch, using ordinary selection/look controls. Other inspected
contacts and states above pass; no additional mechanic blocker was identified.

### Final mobile contact closure

Independently inspected the refreshed06:25 retry-catch-compressed/held mobile
and landscape captures. Ordinary camera/hero repositioning now brings the
mechanism into view. Landscape clearly shows the right post's broad fixed
foot on its pad, extended coil, head and hook supporting the rising roof.
Portrait shows the left coil/foot alongside the ladder, with partial ladder
occlusion; it is corroborating contact evidence rather than a claim that every
part is unobscured. Desktop and landscape provide the missing full stroke.

**PROCESSED / native and actual1x/2x/mobile runtime gate: ACCEPTED.**
**Final mechanics/common-sense cooperation verdict: ACCEPTED.**
The previous levitating catch, filled/closed release appearance, floating roof,
dock-foot mismatch, upper blank background, stretched pin and inset obstruction
are superseded by the current evidence and fixes. No material blocker remains
in the reviewed Clockwork69 scope. This is independent source/code/test/image
review of the implementer's ordinary-control browser evidence; it does not
claim an additional independent browser playthrough or exhaustive every-frame
art inspection. No pending character/source work is covered by this verdict.
