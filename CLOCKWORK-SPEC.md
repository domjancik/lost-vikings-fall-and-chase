# Inside the Clockwork — room69

One fourth Puzzle Lab room, separate from the story/arcade campaigns. The three
existing heroes and their consistent abilities remain unchanged. Baleog is the
archer/swordsman, Erik the runner, Olaf the shield/glider.

## Causal sequence

1. Watchtower ladder reaches a380-unit takeoff above a360-unit first chasm.
   Baleog climbs onto Olaf's raised shield. Olaf carries him in a real glide to
   the650-unit service deck. The650→1260 recovery ladder visibly unrolls after
   the first physical landing; it cannot bypass the initial glide from below.
2. Baleog climbs the chain gallery and shoots an exposed chain link. The upper
   wheel half drops under gravity onto a service ledge. Olaf walks around its
   right side, fronts his shield left and pushes it to a visibly sloped return
   chute. It slides/falls toward the lower cup near the starting area.
3. Erik first jumps into the lower cup. Joining is a safe clam-shell closure.
   Mirrored authored spring catches accept the descending arch and lift it clear
   of the entry. Actual cup weight seats the roof; an empty cup waits safely.
   Any passenger can trigger the weight catch. USE reopens the assembled wheel
   before the launch pawl locks it; a short entry ladder also lets nonjumping
   passengers leave. There is no hidden identity-specific box/lever rule.
4. Running inside accelerates the completed wheel along segmented track,
   down into the U-shaped lower works and up toward a visible spring pad.
   Track-normal circle contact and swept flight avoid corners and tunneling.
   Pad's compressed/released poses animate a ballistic jump over the bigger
   gap. A catcher docks the wheel into the main gear train.
5. Erik now runs in place to drive a reversible freight carriage and its
   counterweight. Release input brakes the train; switching heroes holds its
   position. Board at the left dock, ferry across, then raise the crew to the
   exit balcony. Predictable steam charges threaten the passage; Olaf can
   shield it, or Erik can brake and wait. No arbitrary ability-specific switches.
6. Full travel seats a visible ratchet and permanently opens the portal. The
   carriage may still reverse for missed passengers until release. Baleog
   swords the exposed red retaining pin on the upper
   dock. The machinery visibly disengages and the wheel opens over a safe
   floor, releasing Erik. The upper arch falls to its own supported lower
   footing. Erik jumps over the surviving lower cup's real rim. A released
   maintenance ladder reaches all the way from the recovery floor to the balcony.
   All three must physically reach the exit. Enter/Space continue normally.

## Camera and controls

Normal keys and mobile actions. Left/right while Erik is inside drives wheel/
machinery; jump into the open cup, USE reopens it before launch. At dock Erik is physically captive
until pin release. While he is active, a small runner view accompanies the main
crew/machinery view; both desktop and mobile use one large crew
pane plus runner inset. Switching Olaf/Baleog returns to one normal camera.
Inserts render the production world and characters, never schematic substitutes.
Hints remain default hidden. Brief operational controls may label the captive
wheel (RUN / BRAKE), without giving the whole puzzle away.

## Art contract

Game pixels2world units. New hollow wheel radius80 => native96x96cell with
an approximately80native-pixel opaque diameter and fixed48,48 center, hollow
interior at least56native pixels wide for a36native-pixel adult. Wheel's upper
and lower semicircles share one fixed center, no independent bbox scaling.
Gear rotations are rasterized on native canvas, then snapped when composited.
Machine housing, toothed partners, broken pin, chain, spring and clam-shell
states require authored sprite art. Existing grounded terrain, ladders, hero
sprites and connection kit may be reused at registered native scale.
New scene native768x512 displayed1536x1024; no256-square normalization. Retain
raw generations/exact prompts; assess source density before processing once.
Broad bases, actual ports/chain attachment, supported platforms and human scale
must pass source and actual1x/2x/mobile review separately.
The chain/vent source is not exactly2:1. It therefore uses a single horizontal
source scale and padded96x104native cells (192x208world), rather than stretching
its source into square cells. The chain's detached fragment falls to650; the
valve's actual native93mounting flange meets its650ceiling support.

## Final dimensions and connections

World3300x1400. Watchtower320..560 at380, far service920..1460 at650, chain
gallery1200..1400 at400. Normal Olaf terminal fall100/s and horizontal150/s
carry the passenger across the360gap with a270drop; no ability buff.
Lower cup560,720 and interior feet776. Upper arch1080,500 drops to640 (actual
tab underside650), pushed to920, then guided down to560,690. Catch stroke
25native pixels holds the arch at640 before closure at720. Its generated hook,
spring and base remain at native scale; base778 has masonry footing to800.

Rail560..680 at800 descends through1050..1250 at1120, then rises to1640,920.
Native segmented track resolves on a cached raster with continuous normal circle
contacts. Spring loads0.6s and launches to dock2460,840 across820world units;
the launch assembly uses a constrained impulse tuned for its receiving socket.
The dock housing native160x224 has clear mouth80,112 and base193, yielding
world base1002 on its own supported deck. Freight carriage180wide moves1640→2700
at920, then rises530; counterweight at3060 descends530→920 on the same drive.
Input ramps to0.045travel/s, release brakes0.4/s, reversing0.12/s acceleration.
Ceiling vent2140 has off3.2s, charge0.8s, live1s; overhead shield protects via
actual position. Pin32x56native draws64x112 at2798,418, base530 on upper balcony.
Maintenance2900 reaches530→920 at ratchet, then extends to1260 after release.
New spring catches48x80native use only valid extended/released generated heads;
generated mid-frame's misplaced hook is excluded. Components translate/clip at
integer native pixels, with a fixed base and authored coiled shaft.

## Validation and recovery

Test-first state/physics checks: carrying Olaf passengers; swept arrows;
continuous half fall/slide/join; occupancy and later boarding; wheel track and
ballistic capture at60/120Hz; input brake/reverse; actual carriage carry; steam
warning/shield/damage; no pin release before ratchet; no stranded Erik after
collapse. Full ordinary-input simulation and browser all-three exit routes,
including missed carry/late board/steam wait. Inspect each interaction's own
initial/intermediate/completed pixels. Review agent independently critiques
causality and contacts before publication. Save in Git, isolated release build
preserves unrelated working files, verify live hashes after publishing.
