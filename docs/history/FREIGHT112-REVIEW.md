# Freight112 independent visual critique

Reviewer owns this record only. Apply native-sprite-art and the visual gate.

## Raw source review

V1 fan/burner sources are retained rejected history: finer high-resolution
contours/material treatment do not establish intended native density. Do not
normalize those rejected sources into shipped art.

fan-raw-v2.png: **accept native-density/source body** at two64x64-native cells,
housing and separate rotor,128x128-world parts. Large iron planes, deliberately
sized bolt/blade/rust clusters and stepped rim retain density. Ordinary exterior
alpha fringe cleanup is allowed without changing opaque structural material.
Rotor hub32,31 and housing seat32,31 coincide after measurement; no translation
is needed. Use an occlusion mask only for blades physically behind the static rim.

burner-raw-v2.png: **accept native-density/source** at96x64-native body cells,
but its192-world footprint conflicts with90-world neighboring nozzle spacing.
This is a placement/geometry failure; source approval does not permit stretching.

burner-raw-v4.png: **accept selected native-density/source** at two48x64-native
cells (96x64 sheet), compact96x128-world housing. Broad iron planes, substantial
mouth/rim and bolts are purposeful clusters rather than V1 painted detail.
Retain a fixed cold housing with native hot-mouth state only inside the same
aperture. One uniform presentation normalization; no per-cell stretching.
V3 was self-rejected for exterior haze and is not a shipped source.

## Native processed review and contacts

Inspected fan-housing-native-4x.png and fan-rotor-native-4x.png: **accept processed
native art**. Housing contours/material survive; detached rotor is coherent,
with unchanged hub/shape and intended opaque blades. Broad actual base60 must
touch940/640 floors; rigid housing must not rotate with the blades. Cabinet
port registration derives from final grounded placement.

Inspected burner-body-native-4x.png and burner-mouth-native-4x.png:
**accept processed native artwork**. Broad steel planes, bolts, rim and support
survive compact scale. Authored orange/yellow mouth clusters occupy the cold
aperture without repainting fixed housing; no material magenta fringe remains.
Measured broad sole56 and mouth8,44 yield360+(44-56)*2=336, matching the actual
projectile row. Actual cold/warning/firing/quenched production states
remain pending. Actual broad base must touch360 and projectile y336 start inside
the visible muzzle, preserving a gap between90-world neighboring housings.

Planned receiving floor extension1340..1800, raised step1740..1840y560 and short
ladderx1760/top560/bottom640 makes the second fan physically supported and
clears the passenger boarding route. Actual collision/support and final port
evidence is required; merely repainting art in front of a ladder would not fix
the missing support.

- Selected native-density/source gate: **accepted** for fanV2 and burnerV4.
- Processed/in-game gate: **accepted** for the exact production Freight graph
  and final native assets, as inspected below.
- Publication: **allowed after root integrated-app smoke and final checks**.

## Final production visual gate

Independently inspected actual ordinary-control captures under
`assets/freight112/evidence/captures/`: second-riser-powered2x,
draft-rising-landscape, burner-warming2x, burner-firing2x, purging1x and
cooled-departure2x. Broad fan base meets the expanded receiving deck; moved
short ladder and step clear the cabinet. Stable housing/rotating internal blade
separation reads mechanically; draft carries the centered shield passenger.
Receiver/fan connection seats on the final grounded copper intake. Burner
supports rest on gallery floor, muzzle warning lights before fire, actual shots
leave the same aperture row, then quenched mouths go dark while residual shots
continue. Compact neighboring housings preserve a visible gap and manifold
connections enter actual upper housings. No stretched heavy barrel sprite or
rotating entire fan cabinet remains.

Read final ordinary route record:101.15 seconds, wonHP[3,3,3],68 actual
1x/2x/portrait/landscape captures and errors[]. The earlier desktop graph route
also wonHP3. These are production engine/input/render mechanics with exact new
art, run in an isolated dependency graph to avoid unrelated unfinished Orbit
imports. No debug gameplay override establishes clearability. Root must recheck
the integrated application after new Orbit dependency closure is available;
this visual acceptance does not claim that pending graph has already passed.

Final separate verdicts: **source/native-density accepted** for fanV2 and
burnerV4; **processed/in-game accepted** for final assets/contact/state evidence;
**puzzle support correction accepted** for expanded floor and relocated ladder.
Publication awaits integrated-app/build/release verification, not more art work.
