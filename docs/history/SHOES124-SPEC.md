# Magnetic shoe visibility and equipment racks

Both magnetic levels share a recognizable equipment rack and loose shoe sprite.
The new rack is decorative, grounded on the starting floor; collection ranges,
spawn coordinates and all puzzle mechanics stay unchanged.

## Root causes

- Scrap Orbit drew atlas cell5, a control panel, for shoe pickups.
- The Lode Engine omitted world pickup rendering entirely.
- Inventory icon16 cropped that same control panel instead of footwear.

## Art and placement

Retain originals, exact prompts and rejectedv1. Acceptedv3 removes the uneven
shelf dividers from acceptedv2 using imagegen. Runtime subjects are normalized
uniformly once from original source crops, with no grid rescue or palette flattening.

- Rack native128x96 -> world256x192. Actual opaque sole89 grounds on floor1000
  in Scrap Orbit and1260 in The Lode Engine. Highlighted shelf front rim49.
- Boot pair native32square, material27x21 at2,6. Exclusive sole27 rests on the
  shelf rim; stock coordinates120,175,230 preserve normal pickup routes.
- Rack stock derives from actual initial item IDs and disappears per pickup.
  Dropped shoes use the same world artwork resting at their ordinary item feet.
- The16square inventory icon is separately prepared from the original boot crop,
  and used consistently by bag, small HUD and touch item button.

Dark iron uprights, copper bevels, cross-braces and a horseshoe emblem retain the
level's modeled material richness. Binary material alpha and zero hiddenRGB remove
transparent fringe without losing intentional one-pixel highlights.

## Verification

Independent source/native, runtime, aesthetic and cooperation review gates.
Actual production captures in both levels at1x/2x and portrait/landscape touch
sizes show3/2/1/0 pairs. Walk away from a dropped pair so ground contact is visible,
then return, recover and activate via the touch item button. Check nonempty/cyan
boot HUD icons, latest imagegen90 character receipts and grounded rack feet.

Unit regression covers stock visibility plans, contacts and drop recovery. Full
suite also exercises ordinary completion routes for both magnetic levels. Verify
source/build menus, manifest, cache-safe import graph, commit, publish and compare
live critical hashes plus repeat the actual touch pickup/drop/activation checks.
