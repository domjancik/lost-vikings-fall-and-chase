# WATER108 independent intake review

Reviewer: independent cooperative-mechanism critique subagent.

Reviewed `skills/cooperative-world-design/SKILL.md`,
`docs/standards/VISUAL-REVIEW-GATE.md`, `docs/ARCHITECTURE.md`,
`src/levels/water/campaign.js`, and `tests/unit/water108.test.js`.

## Source/native-density gate: accepted, no replacement art

This correction changes simulation forces only. No source image, processed atlas,
sprite dimensions, native pixel size, camera layer, equipment anchor, connection
port, or physical support geometry changes. Existing source artwork is preserved;
this verdict does not waive its previously established visual gates.

The cause is a physical inconsistency: surface-floating Olaf entered the buoyancy
branch and continued before the underwater jet force. A front shield therefore
ignored a downward stream rather than providing the overhead interception that
the level teaches. The corrected branch applies leftward intake resistance using
the overlap of Olaf's 32-world-unit body projection and the actual 56-unit jet.
Smoothstep overlap avoids a positional clamp or teleport on entry. Continuous
`valvePose` scales the force, so closing the visible inlet removes the obstruction.
The raised shield still intercepts from above, with the existing continuously
smoothed downstream shelter response. Buoyancy remains damped velocity integration.

This retains the collaboration: Olaf parks his raised shield beneath the intake;
Erik swims through the protected flow to work the shutoff; the valve then permits
the surface carrier's transport for Baleog's drain work. It introduces no hidden
switch, arbitrary material rule, new interaction button, or precision-only target.

Independent execution of `node --test tests/unit/water108.test.js` passed 3/3:
front-shield resistance at 60/120 Hz, raised-shield entry, and passage with the
closed valve. These are physics evidence, not visual/runtime acceptance.

## Runtime gate: accepted for the scoped force correction

Independently opened actual production captures under `output/water108/`:
`front-held-1x.png`, `front-held-2x.png`, `front-held-mobile-2x.png`,
`shield-intake.png`, `raised-shelter-mobile-2x.png`, `valve-after.png`,
`gate-before-visible.png`, `gate-middle-visible.png`, `gate-open-visible.png`,
`berth-contact.png`, and `drained.png`.

The front-shield views place Olaf on the upstream edge with the downward flow
continuing past the vertical disc. Raised views visibly place the horizontal disc
under the nozzle; flow contacts that disc while the lower jet thins. Olaf retains
his buoyant position rather than snapping between those states. The gate captures
show continuous upward retraction and stable conduit terminals after the shutoff
turns. The carrier's drained berth and bell floor contact remain intact.

Independently inspected `output/water108/route.json`: ordinary production controls
complete the inlet, compressor tow, air bell, cut-chain, drain crank and reunion
route in 117.625 simulation seconds, with `won: true`, health `[3,3,3]`, and no page
errors. The front-shield hold capture has x=679.189, `shieldUp: false`, full air,
and full health after sustained RIGHT input; the raised interception capture has
x=714.085, `shieldUp: true`, and the same buoyant y=516. The current skin selection
maps Olaf internally to `imagegen90` through `hero-skins.js`, so that receipt value
is expected and is not evidence of a stale skin. Closed-front passage is separately
verified with simulation movement input by the focused regression; the ordinary
browser route also moves Olaf through the now-open inlet and gate.

The 844x390 captures verify the responsive layout and visible interaction at 2x.
This harness resizes a mouse browser page, so these specific images do not certify
a coarse-pointer/touch-input context. No control layout or touch handling changed
in this correction. Source and runtime gates are accepted within that explicit
scope; the reviewed screenshots and route receipt are retained under
`assets/water108/evidence/` for publication.
