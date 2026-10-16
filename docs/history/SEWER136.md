# Firelight, falling Creation Globe and grounded spray

The sewer receives the same small Creation Globe seen in the Norse hall. It
falls ahead of the Vikings, strikes the floor, bounces a short distance right and
settles. After a readable pause it hops under its own power: six bronze jointed
legs unfold, land on the floor, then carry it into the unlit corridor. It is a
mechanical reveal, not a teleport, a large monster or a change to the orb's size.

The opening camera must keep the globe and falling crew legible on a narrow
screen. Brief input quarantine belongs to the live entry scene; normal world
physics continues. The globe stops framing the camera once it disappears into
darkness. Its path does not gate or change the sewer puzzle.

## Art contract before generation

Retain the accepted alehall globe's smoky glass, bronze chassis, pale tiny objects
and working internal arms. One native pixel is2world units. Ball diameter remains
20native/40world; adults remain36native pixels high. A64native cell contains the
20px ball, its fixed center(32,22), folded lower chassis and six legs, extending
roughly40px wide and32px total height. Full extended sole is row44. Do not enlarge
the orb to fill the cell. Generate a4x4sheet: eight deployment keys then eight
distance-driven running keys. Keep body center/rim, palette, leg identities and
near/far layering fixed; never resize frames to their bounds. Native articulated
guides establish pivots and count; imagegen supplies the material rendering.

Preserve sources and exact prompts. Compare raw/native/processed art and actual
1x/2x/mobile scenes with imagegen90 Vikings. Independent source, runtime and
aesthetic verdicts must accept before publication. Apply the existing visual gate.

## Fire-powered illumination

Firelight varies mildly in intensity, wick position and beam direction. Rigid
lantern housings stay attached to their hooks/hands. Flame animation, visible
cone, darkness mask, enemy light sampling and wall occlusion must use the same
emitter/aim. Fluctuations cannot flash, swing like a searchlight, leak through a
wall or make a safe refuge unreliable.

## Stream causality

The leftward pipe spray falls under gravity and meets floor760 at its downstream
end. Highlights travel downstream, with a visible impact/splash. Olaf's front
shield intercepts only when its actual span crosses this trajectory. Deflected
water falls back toward the source side and reaches the floor; the upstream jet
does not disappear. Raising/reversing the shield changes interception through
geometry, not a hidden location toggle. Rendering and wet/damage tests share the
same trajectory. Preserve the valve, refuge and full healthy completion route.

## Required evidence

Regression tests: first globe impact before crew landing, continuous bounce and
powered hop, six-leg deployment/grounded escape/reset; bounded independent fire
variation and occlusion; curved floor impact, actual shield intersection,
incorrect shield states and shifted pipe placement. Ordinary full routes at60
and120Hz plus browser action/intro/state captures are required. Record limits of
automated touch evidence candidly.

## Final production strategy and measured registration

The initial16-frame whole-object generation did not preserve six distinct legs;
it is retained as `globe-whole-atlas-rejected-*` and is not shipped. A first set
of larger separate links also made the assembled underside too bulky, despite
acceptable isolated materials. Those sources and rejected native studies remain.

The final renderer retains the already accepted alehall globe's20px glass body
and tiny internal arms. Newly generated bronze parts use a64x32native sheet,
eight16px cells: near/far upper link, shin, foot and pivot. Measured joint centers
give upper8native/16world and lower9native/18world. The foot's ankle pivot is(5,7)
and its opaque sole exclusive row11, giving8world units to the support. Both rows
have the same sole. All parts keep the2world/native pitch. The exact final source
and prompt are `assets/sewer136/leg-parts-v2-{source.png,prompt.txt}`; reproducible
preparation is `tools/art/prepare-sewer136-leg-parts.py`. Final runtime images are
`leg-parts-native.png`; registration is `leg-registration.json`.

Continuous two-link chains establish six owned legs, three near and three far.
Opposite tripods alternate with travelled distance; stance feet remain fixed in
world space. Fore/aft knees bend outward to preserve open negative arches, and
far material receives restrained shadow without losing authored bevels. Airborne
deployment is body-relative rather than stretching to the floor. Front parts
emerge from beneath the chassis. Small native rasters cache5degree rotations;
final placements remain quantized to2world pixels. There is no per-part scaling.

The first impact occurs while all three Vikings are still falling. A short
settling pause separates gravity bounces from the self-powered hop. The intro
temporarily widens narrow viewports and quarantines input while physics continues;
held input is cleared when the globe disappears. Source and gameplay review
records live in `SEWER136-REVIEW.md`.

## Published verification

Runtime commit `56d62b9` is published at
`https://united-marsh-6ppd.here.now/?campaign=cycle&release=sewer136`, hosting
version `01M525JXW5P6G6XAYMM77Z0XA2`. Choose The Last Lamplighter to replay its entry.

All695 tests passed, including healthy60/120Hz ordinary routes. The desktop
browser route completes in63.4167s with HP3/3/3 and continues to water ID4. Final
coarse-mobile entry and held touch/inventory checks pass; they are targeted
checks, not a manual full mobile playthrough. Both source/build cross-campaign
smokes pass across31 previews. All four independent review gates are accepted.

The494-file build matches source and passed495-file publication preflight. Live
verification matched22 changed runtime modules/assets plus normalized HTML. A
fresh public browser replay captured all six globe phases at1x/2x/portrait/
landscape, with24 captures, no errors and controls resumed. Receipts live under
`assets/sewer136/{validation,live-hashes,deployment}.json` and `evidence/live/`.
Original art, rejected alternatives, exact prompts, native guides, scene keys,
unpaused fire samples and unedited browser recordings remain in version control.
