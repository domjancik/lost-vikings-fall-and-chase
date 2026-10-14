# Generated water machinery

Replace the water83 simplified direct-authored machines with generated material
art consistent with Clockwork69. Devices must explain their operation with
visible moving parts and persistent displacement, not a flashing indicator.

## Native contract

Each intended cell is96×96 native pixels, rendered192×192world units. One native
pixel is two world units; adult Viking neutral heights remain36/38/36native.
Initial requested floor baseline was exclusive88 and object center48. Source is one384×288
logical atlas,4×3cells, optionally exact4× integer enlargement. Never fit every
alpha box or rescue finely painted art by downsampling/grid detection. Preserve
raw source and prompt. Source acceptance must precede normalization/integration.

## Generated cell plan

| Cell | Device / generated component | Required visible behavior |
| --- | --- | --- |
|0|Compressor pontoon|Flat accessible deck, rounded floats, pump and air outlet|
|1|Mobile air bell|Open-bottom human cavity, crown inlet, wheeled side skids|
|2|Fixed air refuge|Same open-bottom language and supporting anchored skids|
|3|Crank gearbox housing|Deep wheel socket and lifting-rod collar, broad feet|
|4|Isolated crank wheel|Transparent spoke gaps, asymmetric handle for rotation|
|5|Isolated threaded lifting rod|Legible4px thread spacing, displacement retained|
|6/7|Shared inlet valve body / isolated handwheel|Body fixed, wheel visibly turns|
|8/9|Shared horizontal floor sluice rim / isolated cover|Cover slides to expose aperture|
|10|Service gate segment|Strong ribs/toothed guide, physical mounting foot|
|11|Retaining chain|Visible exposed link and separate chain material|

Accepted source has larger original extents than equal-grid crops. Packing uses
ONE4.25original-pixels-per-native-pixel scale, translations only into96cells,
baseline92. Native machine/socket/collar coordinates are measured in
`registration-v2.json` and `water-art87.js`, not inferred from prompt positions.
The mobile bell's broad visible tire band seats at baseline90; two narrowing
near-black rubber rows overlap the floor by4world units. Fixed bell stays92.
Shared `water-bell-geometry.js` derives corresponding breathing pocket positions.

Root owns mechanical animation: wheel rotation linked to winding, threaded rod
travels smoothly with wound0..1 and holds its final height, cut chain releases
visibly, gate/shutter retain causal continuous displacement. This art task owns
generated source, valid native normalization and registrations only.

## Review status

First generated source retained as `assets/water87/machines-raw-v1.png` with
`machines-prompt.txt`. Independent RAW gate REJECTED: fine mottled material and
soft edge detail violate native96px source density; valve duplicated bodies drift,
and the sluice incorrectly reads as an upright hatch. It is concept only.

Second generation retains those useful bell cavities/curved forms but
requiring broad discrete four-output-pixel clusters. Shared housings and isolated
moving parts replace duplicated valve/sluice bodies. Native-density/source gate
ACCEPTED for rawv2. Independent native packing/material gate ACCEPTED with shared
4.25scale and translations, complete holes/edges and no neighboring-cell clipping.
Nozzle raw/native accepted after conservative original-exterior matte rejection
and transparentRGBzero; source preserved as `extra-raw-v1.png`. Its failed large
coupling is not packed. Guided tiny coupling `link-raw-v2.png` and native10×12link
were independently ACCEPTED; closed proof joins both original chain halves with
one connected visible alpha component. Native source prompts and original files
remain saved. Five focused registration/alpha/contact tests pass.

Docking cradle original `cradle-raw-v1.png` has ACCEPTED raw material/density.
Its model-authored top beam differs from the requested geometry, so the preserved
generated straight shaft is repeated14native pixels and the generated upper
beam translated upward14native, without scaling, stretching or new painted faces.
`cradle-registration.json` records every module crop/translation. Assembled native
gate ACCEPTED: generated collar joins the shaft extension; open cavity,
continuous seat and caster bottoms preserve native density. Native128cell,
topbeam12/depth12, sole112,2world/native yields
seat800/underside824/floor1000. Actual outer bounds124native wide mean carrier
half-width124world, while continuous topseat spans228world for180world pontoon.
Raised rod travel54world puts head834, leaving10world below the beam underside.
Central bell cavity stays transparent; root routes hose around the outer leg.

Reviewer must inspect raw source at intended apparent size,
state-body consistency, open-bottom cavities, human scale, broad base and material
quality against actual Clockwork69. Fine painted texture, lost holes and flat
placeholder parts fail independently of dimensions/alpha.

Processed native and actual in-game gates ACCEPTED for the final correction
packet. Independent review inspected1x/2x/mobile, real bell cavities, grounded
tires, hose terminals, crank progression, retaining-link separation, valve/gate
movement and compressor approach/contact/drainage. WATER87-REVIEW.md records
the evidence and supersedes earlier blocked checkpoints. The root's final
ordinary-control browser route clears with3/3/3 health and no render errors.
