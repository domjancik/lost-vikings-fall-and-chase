# Pub143 independent cooperation review

Status: accepted after corrected geometry, visible head clearance, scene spacing
and final production evidence. This reviewer changes
no runtime code or art. Review applies cooperative-world-design and the visual
review gate to the tavern's shield-to-loft teaching sequence.

## Independent diagnosis and movement envelope

The old cask parks at840 with top706, beneath a loft spanning640..900 at610.
Its loading steps and top therefore form a solo route: the96world-unit climb
from cask to loft is below Erik's approximately130world-unit jump rise. That
route makes Olaf's raised shield unnecessary despite the explicit invitation.
The geometry, rather than a hidden progression flag, should establish the
cooperative teaching relationship.

Moving the complete cask travel range and berth340world units right puts the
parked cask's left edge1132,232units beyond the loft's right edge900. Keep the
loft/key and Olaf's intended shield approach near1000. Move both rendered
timber treads and their authoritative collision surfaces; moving only the
barrel would leave a climbing scaffold under the loft.

Body overhang, coyote time and dash speed matter. Independently swept41bash
thresholds by41jump thresholds at60/120Hz in an ignored diagnostic, using
actual prepareMotion/startBash/integrateMotion and the proposed cask706/loft610
surfaces. No solo loft landing occurred. The best center reached approximately
923.08 while still at loft height; landing requires center below915. The
proposed gap is viable but its approximate8world-unit margin deserves a
production-geometry regression, not only a static distance assertion.

## Pickup obstruction

Generic pickup allows48horizontal and64vertical reach. Erik can therefore
grab the key from underneath during a ground jump, independently of the barrel
problem. An optional physical reach predicate must participate in the candidate
search, so an obstructed first item does not hide another reachable item.
Default behavior elsewhere should remain compatible.

The existing loft is a one-way walking surface: a head-origin ray can start
above deck610 while Erik's feet remain below it. Even center+h22 approaches608
at the jump apex and can miss the deck. Use an explained physical obstruction
policy that genuinely rejects below-deck reach, or make the24world-unit solid
timber underside physical. Do not gate pickup by a past shield-support flag.
Once Erik is on the loft, ordinary pickup/drop/recovery should still work.

## Required final checks

Require below-deck pickup rejection, ordinary loft pickup acceptance, reachable
candidate after blocked candidate, relocated berth/cask bounds, solo grounded
and cask/coyote/bash attempts, and the unchanged shield-supported healthy route
at60/120Hz. Inspect actual1x/2x/coarse-mobile cask parking, shield boarding,
loft landing/key pickup and final crew exit. Loft beams/posts and berth treads
must retain visible floor contact; source art dimensions must remain unchanged.

Cooperation/control gate: pending. Runtime/aesthetic gate: pending. No
publication approval follows from this initial diagnosis.

## Implemented correction reviewed

The final implementation chooses the physical deck option, rather than adding
an inventory reach hook. Shared layout constants define the loft as640,610,
260x24, and its complete timber thickness now blocks side/underside entry.
Upward motion clamps at underside634. The key remains at566, leaving at least
68vertical separation from a Viking stopped beneath the wood, outside the
unchanged64-unit pickup reach. No remembered shield-use flag, item lock or
global inventory behavior change is introduced. Standing on the loft still
allows ordinary key pickup; dropped keys remain recoverable and transferable.

The cask moves between1180 and1420, starting1360; Olaf starts1440. The complete
berth follows the park position. The lowest treads widen to36world units so
Olaf can raise his shield after parking and walk over from actual push contact,
rather than needing an unexplained reverse shuffle. The delivery lashing moves
to1550, away from the relocated barrel's travel. Shared geometry drives the
rendered treads, collision walking planes and loft timbers.

Independently ran24 focused pub143, alehall135 and pub138 tests: all passed.
These include underside pickup rejection and solo cask-jump rejection at60/120Hz,
the healthy ordinary shield-supported full routes at both rates, cask pushing,
social/tutorial actions and key drop/recovery/transfer. The ordinary route raises
Olaf's shield before crossing the parked barrel, then later positions him near
1000 for Erik's two-stage shield-to-loft jump. This uses normal inputs and the
same movement rules as other rooms. Actual in-game scene/route review remains
pending below; unit completion does not establish visual fit.

## First production-view corrections

The first blocked-underloft2x view still showed Erik's helmet above/through the
timber despite the collider being stopped beneath it. His rendered head extends
above the44world-unit body collider. The implementation subsequently adds
36world units of head clearance, compared with the measured34world-unit latest
Erik helmet extent, to underside and side clearance. This resolves visible head
contact rather than only making the inventory separation large enough.

The first proposed dash sweep accidentally requested action only after jumping;
`startBash` requires grounded contact, so it exercised no real dash. This was
flagged and corrected to independent grounded bash/jump thresholds, with an
explicit assertion that actual bashes occurred. Independently ran the corrected
six pub143 tests: all pass, including140timing combinations across60/120Hz.

The first relocated cask also creates a scene-placement blocker: parked barrel
1132..1228, top706, covers the hearth's actual opening1140..1194 at706..716.
The hearth body remains centered1170 while the barrel parks1180. The1x view
confirms the recess is hidden by the barrel, making its loading berth occupy the
fireplace. Do not approve this merely because the loft bypass is fixed. Move
complete physical/art placements to genuinely clear bays, including every flame,
heat-shimmer and supporting-stone anchor if the hearth moves. Final approval
remains pending the scene correction and refreshed evidence.

## Final corrected layout and evidence

The final layout moves the cask/berth another80world units right: park1260,
start1440, right stop1468 and Olaf spawn1520. Parked barrel left1212 clears the
fire opening's right1194 by18world units. Its right1308 also clears the usual
table's visible left edge. The widened loading timbers remain floor-supported
and the hearth flames/recess are visible in the accepted1x scene.

Reviewed the complete opposite travel extreme too. Retained cask source bounds
9..56 put its visible right edge at center+48; the delivery at1550 has visible
left1518. An initial right stop1500 would have overlapped them by30world units.
The final stop1468 keeps barrel right1516, leaving two world units before the
packing board. An actual reversed-push test verifies this physical bound. No
scaled replacement assets or changed material styles were needed.

Independently ran the final27 focused tests: all pass. They include the actual
grounded-dash/coyote timing sweep, helmet clearance, far-stop reversal, healthy
ordinary60/120Hz routes, key drop/recovery/transfer and the previous tutorial
actions. The final wider cask-to-loft separation removes the earlier small
timing margin. No ability-history flag gates the key.

Inspected `assets/pub143/accepted-desktop/parked-sledge-1x.png`,
`blocked-underloft-2x.png`, `key-picked-2x.png`, and the coarse/mobile
`accepted-touch/blocked-underloft-landscape.png`,
`shield-boarded-landscape.png`, `key-picked-portrait.png`, plus delivery/open
room context. The stopped helmet now remains beneath the timber, the shield
actually supports Erik's soles, and his later soles rest on the loft. The key
appears in the small HUD bag after ordinary pickup. The separated barrel leaves
the fire visible and does not turn the loft posts into floating supports.
At1x/2x and portrait/landscape the native art density and adult-human scale are
retained. Sidecars resolve imagegen90 using vikings90 Erik/Baleog and olaf111.

Independently read both final `route.json` receipts. Desktop completes at
63.0000simulation seconds, coarse/mobile touch-action route at63.5636; both
record allHP3,33captures, errors[] and a subsequent fall-entry transition.
The route explicitly boards Olaf before reaching the loft/key, then completes
the globe inspection and collapse with all three. Superseded screenshots that
still show helmet penetration or fireplace obstruction are not approval evidence.

**Source/native continuity gate: accepted for unchanged retained artwork.
Runtime gate: accepted. Aesthetic/world-placement gate: accepted.
Cooperation/control gate: accepted.** No remaining concrete blocker found for
this correction. Publication may proceed after the parent's final build/release
and live-byte verification. Approval applies to the final1260/1440/1468 cask
layout with36world-unit visible head clearance, not the earlier1180 placement
or body-only underside clamp.
