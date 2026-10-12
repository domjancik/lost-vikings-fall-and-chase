# Clockwork71 correction review

## Scope and initial acceptance criteria

Review only the requested Clockwork changes: rail-speed continuity, release
visibility while the swordsman is active, pitch-circle gear meshing, curved
open-cup walking, mandatory cooperative first crossing and the short watchtower
ladder's mechanical purpose. Existing character artwork is reference scope.
No implementation/art edits by this reviewer. New station artwork requires
separate RAW native-density and processed/actual1x/2x/mobile gates under
AGENTS.md, skills/native-sprite-art/SKILL.md and VISUAL-REVIEW-GATE.md.

## Rolling path diagnosis

Current rolling velocity is divided by hypot(1,railSlope), the support rail's
arc-length derivative, but actual wheel center follows the rail normal atR80.
For slope m and curvature k, center derivative factor is1+R*k; center speed
therefore changes with curvature even if stored velocity stays fixed.
Worse, the current descending cubic rail approaches y''=-1920/370^2 near1050.
At slope0 this makes1+80*y''=-0.122: the normal-offset center path folds/reverses.
This cannot be fixed honestly by smoothing displayed velocity or relabeling it.

Require C2 joins, a positive center derivative and curvature radius greater
than wheel radius throughout, including join neighbourhoods. Integrate actual
center arc length and derive tangent/gravity consistently from the same path.
Test small steps on both sides of each join: continuous position/speed/tangent,
no backwards fold and no energy injection with no input. Preserve a physically
plausible spring approach speed and the validated ballistic receiving socket;
rerun60/120Hz full routes after any rail shape/length change. Cached native track
must draw the same geometric support used by physics.

## Cooperation and recovery

Remove the650→1260 recovery ladder's upward path; its previous unrolling after
first landing still allowed subsequent bypass. A downward-only return must have
a visible one-way physical explanation, such as a drop chute or descending
hoist, rather than a normal ladder silently refusing Up. No arbitrary named-hero
lock may replace that geometry. Landing/access flags alone are not cooperation.

All three can recover from the bottom1260floor through the starting420watchtower
ladder. Preserve that retry route and1800boarding/staging access; those allow
missed passengers to reach the ferry. If Baleog misses the glide, Olaf must be
able to descend, walk back, climb the starting tower and carry him again. If
Olaf falls with Baleog already on the service deck, Baleog can wait while Olaf
recovers. Released2900maintenance access must still reach1260floor after release.

Enumerate actual floors, platforms, one-way devices and shield-assisted jumps
to ensure bottom1260→staging920 cannot reach service650 or chain400. In particular
new winch/counterweight supports must not create a staircase into the gallery.
Erik may independently explore lower works, but entry to the upper-half service
deck must require the intended carried crossing. Test both missed glide and
single passenger falling after successful crossing; neither may softlock crew.

## Mechanical and visual contract

- Short ladder: connect a generated winding/timing station visibly to a real
  mechanism. A coherent option is preloading the launch spring/catch ratchet,
  with authored winding stroke, visible stored state and traceable transmission.
  Distinguish winding energy from the wheel's later compression/launch. Any hero
  reaching the handle can operate it; its usefulness must follow physical cause,
  not an unrelated invisible gate flag.
- Gear train: register actual shaft pivots and pitch radii, center distance
  equal to the sum of pitch radii. Teeth overlap tooth gaps, not merely touch
  their outer tips. Opposed rotation and angular speed must match tooth counts;
  maintain meshing through full native rotation and keep connections attached.
- Open cup: derive a continuous inner walking floor from the actual authored
  curved rim. Support feet at a plausible local arc, smoothly follow during
  walking and allow normal jump escape over the real lip. The flat80-wide deck
  plus two vertical boxes is insufficient. Test left/right walking, jump detach,
  reentry and nonjumping exit recovery, including mirrored source contacts.
- Remote release: when Baleog breaks the pin, keep an actual production runner
  inset or briefly frame both locations throughout the collapse. Do not hide
  Erik exactly when the cooperative result occurs. The final opening must remain
  reversible-camera safe and leave a clearly walkable cup; mobile views must not
  place the runner/action behind HUD or pause overlays.

## Pending gates

**Concept/route verdict: viable with the curvature and recovery constraints above.**
**New station RAW/source gate: PENDING source and target-density comparison.**
**Processed/actual runtime and final mechanics gate: PENDING implementation,
focused checks, actual before/moving/held states,1x/2x/mobile contacts and ordinary
full route plus deliberate fall/retry evidence.**

## Proposed physical return route

Accept the proposed removal of1450long ladder/service unfurl in favour of a
short boarding ladder at1400,570→650 and a second real Olaf/Baleog shield glide
to the initial freight/staging dock1640..1820 at920. It has a consistent physical
purpose without a special one-way input rule. At feet650 Olaf's shield support
is570: h.y606 plus SHIELD.upTop-36, exactly matching that short ladder top.
270drop at terminal100 gives approximately2.7seconds; hold right to around1710
then release horizontal input to brake before descent lands, rather than racing
to the dock's far edge. The inactive runner leaves the initial freight position
held; fixed staging access must be available if he has not docked yet.

Numerical clarification: Erik's jump speed570/gravity1250 yields about130world
units of rise, and the shield is80above Olaf's feet. Combined maximum is about210,
not166. The270rise back to service still has60units of clearance. Test against
actual additional station/crank/gear/support surfaces, since their geometry
could create stepping stones even when the principal decks remain unreachable.

Missed second glide can land on1260floor and recover through1800staging ladder.
Missed first glide returns to420watchtower ladder for another actual carried
crossing. No need to add teleportation, identity locks or a silently one-way
ladder. Conceptual route gate accepts this plan; ordinary route and intentional
miss/retry evidence remain required after implementation.

## Implemented rail/cup and station preflight

Independently inspected current campaign/view/render and retained tower original
plus enlarged native sheet. New rail is C2quintic; center-arc lookup advances the
actual normal-offset circle path. Open cup now uses the measured curved rim,
toe offset and local arc movement; release inset follows the swordsman's pin
action. Existing22mechanics/view/render tests pass independently; actual browser
contacts remain required before final runtime acceptance.

**Tower RAW/source and prepared native preflight: ACCEPTED.** Four64x96native
cells packed uniformly1/8 once from retained tower-source.png, at128x192world.
Clock dial, gear/pilot state and broad fixed foot survive at target density;
no fitted cell scaling is apparent. Foundation94 is registered, but actual
floor380 contact, hatch hand reach and links await production captures.

**Mechanical ladder-purpose gate: BLOCKED in current code.** The station only
cycles its four frames from time*3; clockObjects exposes entry catch and safety
winch, with no station action, stored state or transmission to a puzzle mechanism.
A decorative open hatch reached by the ladder does not satisfy the requested
mechanical purpose. Provide a visible meaningful inspection/winding interaction
whose consequence follows actual mechanism state, usable by any reaching hero;
or identify an existing functional role not evident in the inspected code.
Do not satisfy this with an unrelated hidden flag or a nominal text label.
Raw art acceptance alone does not close this mechanical scope blocker.

## Functional station and current runtime evidence

Current code supersedes the decorative station blocker. USE at450,254, reached
via the short ladder, starts a1.2second authored winding stroke; catchWound
persists and enables the real compressed arch catch to rise690→640 at70units/s.
Unwound catch remains compressed. No named-hero check is used. The terminal wire
joins the fixed catch base, not the travelling hook, and is painted behind its
housing. This supplies an understandable physical purpose for the short ladder.

Independently ran31current focused mechanics/corrections/view/render/art checks
and validate-clockwork71.py successfully. Inspecting actual tower before/working/
wound at2x plus wound1x/mobile shows the dial/pilot state changes and a broad
foot directly on380support. The operator obscures some hatch gears, but dial and
pilot own pixels are visible; do not claim all mechanism pixels unobscured.
The source/native station gate remains ACCEPTED.

Inspected second boarding1x and glide/mobile: actual raised shield carries
Baleog onto the initial ferry route; no650→1260ladder survives. Actual release
inset/mobile continues to show freed Erik with Baleog selected, after occupation
ends. Released1x shows the open lower cup, detached roof supported on1002footing
and closer pitch-meshed partners. Rail join/contact and source tests support
the C2/center-arc correction; screenshots alone cannot establish velocity timing.

Final processed/runtime gate remains pending settled cup-edge evidence.
The moving cup-left/right images show wide gait feet that are hard to compare
with the sloped rim; the driver currently photographs after an x threshold,
without asserting current clock-cup support. Request settled idle at both edges,
ground&&support clock-cup plus actual dx/footY, keeping own feet/rim pixels visible.
This distinguishes a swinging gait foot from a real support mismatch rather
than blindly changing mechanics. Other current inspected changes pass.

## Final settled contacts and acceptance

Inspected freshly captured13:40 cup-settled-left/right desktop and right/mobile
own pixels. The ordinary keyboard driver waits for actual ground, support
clock-cup and vx0 before photographing; no internal state injection. Reported
left/right dx=-40/+40, both footY732, ground:true, support:clock-cup, vx0,
no page errors. The near-wall boot has credible visible rim contact and the bowl
supports smoothly toward either lip. The far boot extends over the descending
arc because the authored idle stance has level soles; this is not a claim that
both soles conform to a sloped surface. It does not recreate lost-support/drop
behaviour. Jump detach and nonjumping ladder exit pass focused checks. This
closes the moving-gait evidence question without arbitrary screenshot-only physics.

**Final RAW/source and prepared-native gate: ACCEPTED.**
**Mechanical causality/cooperation gate: ACCEPTED.**
**Processed/actual1x/2x/mobile changed-scope gate: ACCEPTED.**

Current winding stroke/state physically arms the arch catch; the decorative
station blocker is superseded. Rail center-arc and positive-tangent tests address
the original speed/folding cause. Pitch spacing and opposite native rotation
improve tooth engagement. First service access requires the carried crossing,
and its short ladder supports a second real carried descent. Recovery420tower
and1800staging access survive, while1450service ascent is gone. Released Erik
remains visible in the actual inset with Baleog selected after occupation ends.
Station foot, hatch reach and fixed cable terminals are visible at gameplay
scale; actual PNG terminal validation passes independently.

Independently ran31focused checks plus native tower/terminal validator successfully.
Implementer reports327full-suite checks and final ordinary browser all-three
exitHP3each/Enter continuation/no page errors. Reviewed actual evidence is that
normal path plus settled cup-edge keyboard prefix. A separate reviewer browser
playthrough or new deliberate-fall browser recovery run is not claimed.
Retained recovery geometry and late-board/reopen/reverse simulations are distinct
from actual browser evidence. No material blocker remains in this reviewed scope.
