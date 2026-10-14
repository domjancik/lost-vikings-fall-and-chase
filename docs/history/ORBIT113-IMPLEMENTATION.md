# Scrap Orbit and companion corrections

Scrap Orbit is Machine Rooms level9. It takes furnace scrap into a suspended
magnetic sorter, then transfers the crew to the departure gallery using a
controllable crane. Olaf pushes actual carriers, magnetic shoes follow their
continuous steel perimeter, Baleog times shots through physical shutters, and
Erik clears an unmistakable cracked ceramic service cover. Debris has real
warning, damage and recovery behavior. Hook controls use the existing ACTION,
ALT and USE controls; the upright camera follows the hook during operation.

Accepted native art has matching density:768×512 far/middle scenes,192×96
carrier,64-square machinery cells and256-square background gears. Raw originals,
exact prompts, rejected attempts and native guides remain in assets/orbit113.
The carrier's measured172×24-native body owns the344×48-world collision rail;
ellipse ends use16×24-world radii. Nothing is stretched to fit a assumed box.
Object and Viking rotations use inverse nearest-pixel rasters at1-degree steps
with bounded caches. Opaque background gears have cached depth shading.

Olaf111 supplies coherent whole-actor idle/actions matching the approved gait,
fixes shield-lowering frame order and enables compatible front-shield look poses.
Freight112 replaces wobbling fans and poor burners, adds bounded wind distortion,
grounds the second fan and separates its access ladder. Its ordinary route now
waits for the physically visible furnace volley before carrying the passenger.

Independent source, processed/gameplay and cooperation verdicts are accepted in
OLAF111-REVIEW.md, FREIGHT112-REVIEW.md and ORBIT113-REVIEW.md. Ember Freight's
heat, robots, atmosphere and earned sky reveal are now standing benchmarks in
the three repository art/world skills.

## Verification

- Final complete suite:514 tests pass; assets/orbit113/evidence/final-unit.txt.
- Source and built browser smoke:3 campaigns,28 distinct previews, controls,
  inventory, zoom, pause, restart and mobile checks; no browser errors.
- Ordinary Scrap Orbit simulation routes at60/120Hz clear all three atHP3.
- Full desktop and coarse-mobile production routes clear all three atHP3,
  about86.6seconds; retained desktop-route.json/mobile-route.json.
- Final affected-art cold runs, actual unpaused corner/ceiling/bow/hook views,
  and natural intermediate crane jaw0.27778 are retained separately.
- Unsafe carrier launch causes actual Baleog damage; restart restoresHP3.
- Integrated Ember Freight production route clears at99.408seconds,HP3 all,
  60 captures and no errors; freight112/evidence/integrated-route.json.

The browser checks establish desktop/coarse-context behavior. They do not claim
benchmark results from physical mobile hardware. Final publication requires the
maintained build, release hash check and accepted visual-gate preflight.
