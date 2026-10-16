# Pub147 independent pass-through item review

Status: accepted after final unobscured speaker and portrait cup proof. Reviewer
changes no runtime code or art.

## User-directed interaction contract

The user explicitly corrects the tavern barrel to follow pass-through pushable
item behavior. It is not a walking platform or blocking wall; Olaf pushes only
with his front shield. This supersedes the earlier barrel/berth collision choice.
The generic visual rule about solid opaque architecture does not require
reinstating unwanted barrel collision. Floor, physical loft deck and storeroom
door remain architecture; the barrel is intentionally an interactable item in
the room behind the passing heroes.

## Independent implementation review

The complete berth step list, rendered treads, automatic stepping, cart walking
top and cart side wall are removed together. `alehallSurfaces` exposes the real
room floor/loft surfaces only. Thus no invisible stairs, barrel landings or
height changes survive beneath deleted graphics. Existing retained barrel/sled
art stays at its native size and remains grounded on floor760.

Pushing is limited to active Olaf, on the actual floor, shield forward/down,
facing his movement and locally contacting the appropriate cask edge. Raised
shield passage does not move it. Other overlapping Vikings no longer prevent
its travel and are not carried as hidden passengers. The initial park1260,
start1440 and right stop1468 were superseded by the additional user steering
recorded below. Forward pushing at a stop still constrains Olaf to contact; raising
his shield lets him pass, consistent with the selected action mode.

Independently ran33 focused pub147/pub147-dialogue/alehall135/pub143 regressions:
all pass.
They include every hero in both directions across parked/unparked barrel areas,
constant floor height/no cart support, jump landing on the room floor, front
versus raised shield pushing, overlap with another Viking, no airborne pushing,
physical loft underside/key access and healthy ordinary full60/120Hz routes.
Normal item drop/recovery/transfer and other social/ability lessons remain
covered. Historical test wording calling the art's top a walking top is not
treated as proof of a current walking surface.

## Final evidence needed

Inspect actual1x/2x and coarse/mobile floor passage with no steps or vertical
snapping, shield-front contact/pushing, raised-shield passage and the complete
shield-to-loft/globe/fall route. Confirm heroes render in front of the retained
item as they pass it, and that the removed treads leave coherent room floor.
No replacement-source art gate is needed, but retained scale/material and
ground contact still require visible continuity acceptance.

Final gate verdicts are recorded below; the evidence requirements in this section
were completed by the refreshed targeted captures and accepted full route.

## Additional user steering: teaching and people

The same change now also attaches speech to actual people, repeats unfinished
lessons with escalating help, makes the drying cups visible beside the hearth,
and returns the now-pass-through barrel to its original area. This explicitly
supersedes the1260park spacing reviewed above: final intended cask values are
start1020, park840 and right stop1060. Since it has no walking top, moving it
back beneath the loft cannot restore the solo barrel-step route.

The shared people registry matches rendered NPC locations with dialogue anchors:
Astrid1040, Hakon1460, Runa1620 and the actual Torsten actor440 in the yard.
Viking speech tracks their actual positions. The speaker's bubble should remain
bounded/readable and its tail identify that character, rather than pointing to
an arbitrary action coordinate. Near/offscreen speaker rules must not invent
telepathic floating labels. Review actual portrait and landscape long lessons.

The three help tiers repeat every14seconds while the relevant lesson remains
unfinished, ending in actual keyboard or touch ACTION/ALT/USE controls. Checked
these tokens against the app's input mapper: ACTION=Space/F handles jump,
Baleog's sword or raised shield; ALT=D handles bash, bow or front shield; USE=E.
Reaction lines should not be immediately overwritten by repeat invitations.
One independently flagged edge case is a fetched key later dropped on the floor:
the loft lesson must not falsely resume claiming that key is still on the loft.
Tutorial completion may remember or derive the completed fetch without adding a
hidden gate to key pickup.

The complete lashed/open packing stand moves1260 beside the hearth1170, with
three unchanged native cup sprites appearing on the open surface after cutting.
Remove the unused nearby stool rather than stacking unrelated props on the
stand. Check cups visibly seat on its top as the lashing opens; text alone does
not establish drying. Retain the existing loaded/served ale cups independently.

## Review corrections and accepted route receipt

The dropped-key case is now covered by a regression: carried key, opened door
or absence of the original loft item completes that lesson, so dropping a fetched
key does not claim it remains on the loft. Native registration also now tests
the dialogue tail at two world pixels above each patron's actual head. The
initial650 anchors were rejected as36-38pixels above the people and corrected to
684/686. These fixes change instruction accuracy, not pickup permissions.

The accepted coarse-context full route summarized in `route-check.json` wins in
57.899seconds with all heroes at3HP,33captures, no browser errors and the correct
sewer fall-entry transition. It traverses the ordinary shield/loft/key/globe/
floor-collapse sequence. Movement is keyboard input in a coarse browser context
with touch action/hero controls; this does not claim an iOS hardware run.

Independently inspected the retained patrons and props native sheets directly.
These unchanged sources retain their established material, volume and pixel
density. There is no generated/replacement art or resampling in this change.
Earlier targeted proof put Baleog directly over Torsten and cropped the drying
stand outside a portrait view. Those captures cannot establish visible speaker
identity or portrait cup placement, and were requested again with the hero aside
and the stand in frame. These were refreshed before final acceptance.

## Final visible review and gate verdicts

Independently inspected final desktop1x and coarse/mobile2x landscape/portrait
Torsten scenes, floor-passage scenes and hearth/drying views. Baleog stands365
beside Torsten440, so the named speaker is unobscured; the restrained tail now
ends just above that patron's head. Long final-tier instructions wrap within
portrait bounds and use ALT on coarse input and D on keyboard. No extra triangle
or replacement drawing is required. Hero dialogue continues to follow its hero.

The portrait hearth view now contains the open stand and retained cups rather
than cropping the proof out. Landscape makes the three cups particularly clear;
their bottoms meet the opened surface while flame remains separate beside them.
The retained cask still has convincing grounded material and heroes pass in front
on uninterrupted floor, without the removed transparent treads or vertical snap.

Final `pass/evidence.json` contains18coarse/mobile1x/2x views and9200tracked
frames; `desktop-pass/evidence.json` contains14desktop1x/2x views and8688tracked
frames. All three heroes have minimum and maximum sole760 throughout both
targeted runs, with errors[]. Their sidecars resolve imagegen90 to vikings90
Erik/Baleog and Olaf111. The earlier accepted full-route speech anchors predate
the head correction; use the refreshed targeted views as authoritative dialogue
proof, and that full route as completion/health/fall-entry proof. Independently
compared the compact receipt to the original full route: outcome, every milestone
name/time/health, capture count, arrival, errors and touch-action flag match
exactly. Superseded full-route screenshots are archived in ignored diagnostics;
only the final32targeted images and their sidecars remain authoritative visual
proof in this release.

Source/native continuity gate: accepted (unchanged source sheets, native density,
palette and material retained). Runtime gate: accepted (ordinary-input passage,
push modes, complete route and bounded speech). Aesthetic gate: accepted (actual
speaker attachment, legible portrait text, grounded unchanged props and visibly
drying cups). Cooperation/control gate: accepted (user's pass-through contract,
consistent front-shield pushing, Olaf-assisted key access, escalating optional
teaching and recoverable inventory). Publication allowed subject to final build,
release and live-byte checks by the integrating agent.
