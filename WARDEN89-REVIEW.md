# Fourfold Warden — independent review

Reviewer: Warden critique agent. This log records puzzle, art-source and actual
runtime judgments separately. An accepted concept is not an accepted asset.

## Initial design review — 2026-10-13

Reviewed FOURFOLD-WARDEN-CONCEPT.md, ART-DIRECTION-CLOCKWORK.md, HUMAN-SCALE.md,
VISUAL-REVIEW-GATE.md and skills/native-sprite-art/SKILL.md.

**Concept verdict: ACCEPT with implementation constraints below.** The proposed
brace → back access → shutter actuator → exposed optical target → released lift
sequence has physically understandable causes, distinctive hero contributions,
and an exit reward integrated into the machinery. It can meet the Clockwork
benchmark if each moving support and mechanical state is visibly real.

### Geometry and causality constraints

- Keep exactly four leg identities readable, with near/far depth shading rather
  than translucent duplicate legs. The load path must connect foot, knee and
  torso. Every planted foot must meet an identified support surface.
- Olaf braces a unstable forked ankle joint; he does not lift the entire animal.
  Actual raised-shield/ankle contact and facing must cause the reaction. Raising
  a shield elsewhere or on the wrong side must not activate the encounter.
- Measure the before/after foothold height using existing Erik motion. Kneeling
  must turn an initially unreachable route into a reachable jump without buffs,
  an invisible hero lock or a newly teleported platform. Preserve a safe retreat
  when Olaf unloads the joint; carry actors on the continuously moving spine.
- Give the impact plunger a visibly stout head, spring, guide and short mechanical
  linkage to the eye shutters. This communicates impact rather than a random box
  assigned to bash. Arrows/sword cannot accidentally imply that it is fragile.
- Closed shutters physically cover the lens and stop arrows. Open states must
  visibly expose glass. Allow a repeatable approximately eight-second window,
  long enough for a normal character switch and clear aimed shot.
- A missed shot or closed eye must preserve a safe supported place for Erik and
  allow another plunger stroke. Shutdown persists. Keep obvious clearance for
  Olaf to leave beneath the final kneel without being crushed or trapped.
- The released gondola is visibly attached to one coherent supported lift rail
  before the reward occurs. Release, docking and travel must be continuous;
  riders meet its real walking rim. Recall from either landing prevents stranding.
- Human maintenance doors, rails and steps must establish adult Viking scale.
  Machinery can be enormous while inhabited architectural cues remain human.
- Use new authored Clockwork material art with intended two-world-unit native
  detail density. The existing high-resolution concept board is composition
  evidence only; it cannot be downsampled into production sprite source.

### Required evidence before acceptance

Normal controls must demonstrate brace contact, wrong-position/nonactivation,
inactive Olaf hold, reachable kneeling route, partial unloading with rider,
plunger initial/intermediate/released states, closed/open eye shots, missed-window
recovery, permanent shutdown, escape clearance, lift rider/dock contacts, recall,
restart and all-three exit. Capture the interacted mechanism itself at the same
camera in before/intermediate/after states, plus actual 1x/2x and mobile framing.

## Native-density/source gate

**PENDING.** No proposed production art or native articulated motion guides have
yet been provided for review. Neither the attractive concept board nor dimension
and alpha assertions establish a pass.

## Processed and actual-game gate

**PENDING.** No implementation or actual production-control captures have yet
been provided. Publication of new Warden assets remains blocked until the native
source and processed/runtime gates are separately reviewed and accepted.

## Production geometry review — 2026-10-13

Reviewed WARDEN89-SPEC.md and root's updated placements: spine rear660/front680,
eye760, firingledge784. Main floor940 means Olaf's raised middle plane860.
Existing Erik jump v=-570/g1250 has ideal130-unit rise; the intended100-unit
climb from service760 to kneelingrear660 has useful safety margin, while original
spine560 is200 high and genuinely inaccessible. Arrow launch is approximately
24 units above feet, so firingfeet784/lens760 is coherent.

**Geometry verdict: ACCEPT provisionally for implementation.** Four separated
foot intervals, continuous shared-pose spine collision and the short lower
boarding ladder are sensible. No new hero movement buff is needed.

Before runtime acceptance, explicitly confirm the gondola's visible/physical
walking rim width: finalleft2080 must overlap upperlanding2200 sufficiently for
Baleog/Olaf to walk off without a forbidden gap. The128-native-cell width alone
is not its deck width. Check sideways shutdown1490→1570 foot sweep against Olaf
and adjacentfarfront1660, preserving fourleg readability and adult clearance.
The interaction and failure-state evidence listed above remains mandatory.

## Native articulation guide review — 2026-10-13

Inspected assets/warden89/parts-guide-2x.png (512×512 native layout enlarged2x),
assets/warden89/parts-layout.json and output/warden89/articulation-guide-2x.png
(1280×2560 evidence board), plus the authoritative hip/knee/ankle construction in
warden-campaign.js. Upright, warning-lift, shield-brace and shutdown show four
leg identities and a coherent two160-world-unit link chain per leg. Feet are
registered to floor940; the raised fork meets shieldmiddle860; shutdown shifts
the nearfront foot clear before it returns to940. Rear knees fold consistently.

**Guide anatomy verdict: ACCEPT provisionally for Imagegen material guidance.**
This approves mechanical anatomy and anchor constraints, not generated source.
The heavily folded braced nearfront upper link becomes almost horizontal under
the belly: preserve a visible hinge/piston so that its loaded state is legible.
Final evidence must include intermediate motion to exclude hinge branch flips,
opaque limb popping and incorrect head/foot overlaps. The flat guide body and
schematic source colors remain guides only and do not meet final Clockwork art.

## Generated component kit v1 source review — 2026-10-13

Raw source inspected:
C:/Users/magne/.codex/generated_images/01a11dbd-7cba-7623-810b-89ce1687aed7/exec-05524dac-8df4-4c4d-b273-b449b696c511.png.
Image1280×1280; intended native512×512, nominal2.5× enlargement.

**Native-density/source verdict: REJECT.** Brass faces contain pervasive
single-source-pixel grain, onepixel scratch/highlight lines, soft rim/lens
shading and fine stippled outline pixels. These are materially finer features
than deliberate512-native clusters and would have to be destroyed/quantized to
fit the intended display. Outputdimensions do not excuse authored density.
The private Vikings88 source exception is specific to accepted Viking trials;
it does not authorize a Warden asset exception. Do not normalize this source
into production. Retain it as a failed trial.

The material language is attractive and useful directionally. Regeneration
should preserve those brass/teal volumes through broad connected3–4tone shade
clusters, not grain/glints/dither/blur. The feet also replace the guide's visibly
open ankle fork with a largely solid trapezoid; preserve a clear fork/notch or
other unmistakable shield-catching construction in final art.

Processed/runtime gate remains PENDING; this rejected source cannot establish it.

## Intermediate articulation correction required — 2026-10-13

Inspected output/warden89/guide-motion-contact.png and guide-motion.json,
which sample actual advanceWarden across12seconds, including brace and shutdown.
The live lift/brace stroke preserves knee branches, but shutdown nearfront knee
is a blocker: holding footy860 while shifting1490→1570 makes the endpoint chain
fold around a nearly coincident hip/ankle. At7.2→7.6seconds the knee sweeps upward
through the eye/head, eventually above the spine. Its sampled0.1second movement
peaks39.5world units while otherknees stay below8. It is analytically continuous
but the material leg would pierce the optic and visually invert its load path.

**Guide full-motion verdict: REJECT pending shutdown correction.** Use a clearance
path/hip geometry/constrained fold that leaves the knee outside the optical head
and retains Olaf safeescape. Repeat actual motionloop/contact evidence. The
previous provisional guide acceptance remains valid only for the four still
poses; it does not waive this newly demonstrated intermediate defect.

## Generated component kit v2 and far scene source review — 2026-10-13

Originals inspected:
- C:/Users/magne/.codex/generated_images/01a11dbd-7cba-7623-810b-89ce1687aed7/exec-b20059f8-1262-4d9e-a6b4-ed55641aacce.png
  (1280×1280 components, intended512×512 logical native kit; cell padding may
  increase to preserve actual authored rims/hinges without stretching).
- C:/Users/magne/.codex/generated_images/01a11dbd-7cba-7623-810b-89ce1687aed7/exec-26fea413-d2d4-460d-b26d-f111dde5c0d3.png
  (1440×1080 far architecture; intended640×480 native,1280×960world).

**Native-density/source verdict: ACCEPT provisionally pending same-size native
comparison.** Kitv2 replaces v1's fine grain with broad connected brass/teal
shade clusters, chunky rivets and mechanically readable shutter/spring poses.
It retains curved Clockwork material volume without requiring texture rescue.
The scene has deliberate stepped masonry silhouettes, distant window clusters
and layered architecture rather than highresolution painted surface grain.

Conservative removal of isolated exterior matte pixels is allowed; do not erase
or repaint structural outlines. Component extraction must retain the complete
original silhouette under one uniform native normalization, deriving actual deck,
sole and joint anchors by translation. The guide cell positions need not be
forced onto source anatomy. The ankle's visible notch and stable deck contacts
remain runtime requirements. Both sources require processed/native comparisons
and actual 1x/2x/mobile gameplay before the separate runtime gate can pass.

## Corrected intermediate guide and native comparison — 2026-10-13

Reinspected regenerated guide-motion-contact.png/guide-motion.json after the
nearfront branch is explicitly rearward(-1). The loaded joint now folds below
the hip and outside the optical head; no knee direction flip or headpiercing
remains. **Full guide motion: ACCEPT**, subject to final material sweep/contact.
At7.7seconds kneecenter reaches934.4 versus floor940, so check the material joint
radius at that extremum; a center abovefloor alone does not establish clearance.

Inspected output/warden89/parts-native-review.png (512×512 same-apparent native
comparison) and scene-native-review.png (640×480), beside their retained originals.
The new processing preserves deliberate material clusters, complete head/lens
states, silhouettes, spring strokes and architecture. No repeated rescue pass,
per-component scale changes or smeared fine texture were observed.

**Native-density/source gate: ACCEPT for parts-raw-v2.png and scene-raw-v1.png.**
**Processed isolated-native gate: ACCEPT.** This does not yet approve in-game
contacts, mechanical state causality or deployment. Actual1x/2x/mobile remains
PENDING. The failedv1 source stays rejected and must not be shipped as runtime.

## First actual gameplay review — 2026-10-13

Inspected output/warden89/brace-1x.png, brace-2x.png, lens-closed.png,
lens-open.png, shutdown-middle.png, shutdown-complete.png, boarded-2x.png,
boarded-mobile-2x.png, lift-middle.png, upper-dock.png and exit.png, plus
browser-route.json (normal-input completion won=true,HP3/2/3,errors[]).
The route demonstrated the real encounter and all-three exit; its early Baleog
stamp is a harness timing error being corrected, not evidence of harmless hazards.

Positive runtime findings: final material volumes meet the Clockwork language;
fourfeet, folded loadpaths, shield/fork plane, Erik spine contact, final Olaf
clearance, gondola wheelgrounding/rider rim, mobile adultscale and upperlanding
walkoff appear coherent. The lower cargo and all three riders are physically
located in the actual scene, not abstract progressflags. No obvious halos or
source-processing damage are visible.

**Actual-game gate: REJECT pending specific corrections and missing evidence.**
The farpanorama repeats a conspicuous black canyon seam through the central
play space, and upperdock reveals an abrupt empty navy strip above the image.
Use one properly sized panorama with opaque continuation and bothaxisparallax;
1920×1440world/960×720native sourced once from the original is a reasonable
scene-specific framing choice, rather than magnifying/tiling the640native plane.

The broken eye reads as a black crescent/iris notch instead of the authored
crackedX glass. Inspect hardcrop384,180,24,50 and ellipseclip against actual
brokenlens opaque bounds/anchor; retain the complete crack structure, dim power
and visible hit/release response. Closed/intermediate/open/broken captures and
plungerinitial/intermediate/held captures must share a stable camera to prove
the interacted mechanism's own continuous state changes. Existing separate
camera framing plus route success is insufficient to close that matrix.

## Intermediate actual correction review — 2026-10-13

Reinspected the regenerated registered-state-board.png, cap-before/middle/full,
shutdown-complete.png and upper-dock.png. Connected springcompression and panel
travel read clearly; the fullbrokencrack is restored and the single larger
panorama removes both centraltileseam and uppernavystrip. Support and adultscale
contacts are retained. These specific blockers are resolved.

The remaining closedeye exposes a broadcyanleftcrescent (approximately a quarter
of visibleglass), so it reads partiallyopen despite arrowblocking logic. This is
an authored-aperture/crop registration issue: glass from the openvariant is wider
than the extracted closedmetalpanels. Root is correcting the commonaperture using
the completeauthoredclosedhousing and matchednativepanel/glass bounds, without
stretching or a placeholdercover. Await updatedstateboard and normalcontrolroute.
Actual-game gate remains PENDING until sealedinitiallens is visibly confirmed.

## Final actual art gate — 2026-10-13

Independently inspected final labeled initial-1x.png, brace-1x.png, brace-2x.png,
boarded-mobile-1x.png, boarded-mobile-2x.png and upper-dock.png, together with the
corrected registered-state-board.png. These are actual production-control scenes.
The final browser-route.json confirms won=true,HP3/3/3,time71.225,errors[], and
all three riders report support='warden-lift' in boarding evidence.

**Native-density/source gate: ACCEPT.** Final parts-raw-v2.png and scene-raw-v1.png
retain the approved Clockwork volumes and deliberate native-detail clusters.
Final scene-native.png is960×720 at1920×1440world, normalized once from its retained
original for intended panorama framing; this is not a universal256-square rescue.
The failed parts-raw-v1.png remains rejected provenance, not runtime art.

**Processed/actual1x/2x/mobile art gate: ACCEPT.** The final registered body/limbs,
four grounded feet, shieldfork/palms, carried spine rider, final Olaf clearance,
cargo wheelgrounding/rider soles, supported liftshaft, adult scale and upperdock
walkoff are visually coherent. The corrected sealedmetal initialeye, continuously
separating authoredpanels, exposedglass, fullcrack and springplungerstroke make
mechanical progression legible. The panorama seam/navytop defects are resolved.
No remaining art blocker was observed in the inspected contexts.

Puzzle concept and basic normalcontrol completion are accepted. Before declaring
full mechanical validation complete, additionally record ordinary-input recovery
for unloadingwhileErikstands on the spine, missedexposure/closing/retrigger, and
both recall controls exercised through interact (not solely direct control.run).
Existing unit checks demonstrate those individual primitives; the missing cases
are a gameplay coverage requirement rather than an art-source rejection.

## Final mechanical recovery gate — 2026-10-13

Read final warden-route.js/warden-route.test.js and independently ran
node --test warden89.test.js warden-route.test.js:10passed,0failed. These include
full ordinary-input60/120Hz routes and additional ordinary-input recovery60/120Hz
routes. Recovery lowers/removes Olaf's shield while Erik remains on the moving
spine, requiring ground/support and <=2world-unit perstep motion; rebraces; waits
through a completely missed exposure and closedshutters before runningbash
again; retrieves a cabin from the lowercall while Erikrides alone; and uses
uppercall after Olafphysicallywalks off. The paths only select heroes and feed
normal motion/action/USE inputs, without writing position/progressflags.
All recovery routes finish won=true withHP3/3/3. Restart/Entercontinue are also
recorded by the successful final production-browser harness.

**Puzzle causality/recoverability gate: ACCEPT.** Both required visual gates,
actualnormalcontrol completion and focused recovery/hazard/contact coverage are
now accepted. No remaining Warden blocker was found in this review. Root still
must verify frozen/live deployment bytes and final livebrowser success before
claiming publication complete; this critique does not attest an unseen livebuild.
