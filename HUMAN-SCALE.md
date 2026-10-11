# Human scale: required art and critique gate

Erik, Baleog and Olaf are adult human Vikings. Their stylized, stocky sprites
do not imply dwarves, children, toys or miniature people. Use the rendered standing
Viking silhouette as the scale ruler, with the 44-unit collision body as a stable
technical reference; do not change collision or movement to repair scenery art.

Every scene must identify a human-scale reference in its inhabited architecture.
Relative to the rendered standing adult height H, ordinary doors are roughly
1.2–1.6H, counter tops 0.5–0.65H, chair seats 0.25–0.3H and railings 0.5–0.7H.
Window dimensions depend on building type, but ordinary windows and furniture
must not accidentally imply that a Viking is knee-high to a human resident.
Perspective makes middle/distant references smaller, never larger, than equally
placed foreground references. Do not treat the viewport size as a prop's size.

Large machines, chambers, industrial shutters and multi-storey structural spans
may exceed H many times. Their access handles, stairs, maintenance doors and
occupied rooms must still establish a plausible adult scale. An enormous chair,
mug, bolt or enlarged wood grain is a blocking miniature-scale cue unless that
specific transformation is explicitly authorized by the user. Brass embodiment
in the current story is not permission to shrink the Vikings.

## Critique procedure

1. Compare standing Vikings with ordinary door/window/furniture references in
   screenshots at both zooms. Include an upper route and the physical pub.
2. Audit each depth layer separately: art asset dimensions, destination world
   dimensions, apparent reference size, perspective depth and ground attachment.
3. Reject accidental giant furnishings, distorted native grids and contradictory
   scale across adjacent bays. Record the offending object/chapter and screenshot.
4. Fix authored scale or framing; preserve aspect, correct native grid, support
   anchor, collisions and puzzle reach. Do not fix one exaggerated prop by
   magnifying heroes or arbitrarily shrinking the whole world.
5. Review scale together with grounding, animation, puzzle semantics and route
   readability. An image being attractive does not waive the human-scale gate.

## Current correction

Campaign middle scenery in chapters 1–7 moves from 768×512 to 384×256 world
units, prepared at 192×128 native pixels so the two-unit grid remains consistent.
This reduces its window/inhabited-cell cues without touching industrial puzzles.
Chapter 8 receives newly authored normal-scale pub scenery in both far and middle
layers; giant screws and magnified paper/wood fibers are removed. The far layer
continues to prepare directly for its intended display size. Pub middle bays
are 576×384 world units, with ordinary doors about 75 units high. Far bays are
384×256 world units, with ordinary doors about 50 units high. These authored
world sizes stay constant at either zoom; zoom changes the view, not prop scale.

## Validation

200 tests pass, including fixed pub dimensions across zoom/viewport sizes.
All eight chapters at both zooms plus mobile load without page errors. Fresh
production-control runs complete canopy with health 3/3/2 and pub with 3/3/3;
upper canopy reveal and pub lift screenshots are available for the critique gate.
