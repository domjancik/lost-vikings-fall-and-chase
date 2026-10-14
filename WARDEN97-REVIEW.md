# Warden97 independent visual review

Design authority: `assets/warden86/concept-raw.png`. Rules applied: `skills/native-sprite-art/SKILL.md`, `VISUAL-REVIEW-GATE.md` and `WARDEN97-SPEC.md`.

## Target and inspected evidence

One native pixel occupies two world units. Atlas: 512×512 native; body cell 320×104, heads 104×112, links 40×104, feet 48×48. Mechanical pivots, eye aperture, walking deck, collider geometry and cargo contacts must remain registered. Cell dimensions alone do not establish these visible anchors.

Inspected the original concept, `assets/warden89/parts-native.png`, `assets/warden97/parts-raw-v1.png` (1280×1280) and `assets/warden97/parts-native-v1.png` (512×512), including the raw art and its proposed native-size result.

## V1 source gate: FAIL

The slate iron, rusty panels and hanging cables improve materially on Warden89's clean gold/teal toy appearance. However, the raw source contains fine mottled chips, tiny isolated highlights and soft/colored edge pixels finer than the intended 512-native grid. These become granular surface noise and inconsistent small details in the native result. This is not a convincing nearest-neighbor enlargement of deliberate native clusters; dimensions cannot approve it.

Design recovery is incomplete. The torso remains a straight rectangular chest divided by bright brass straps, while the concept uses layered curved oxidized armor and substantial exposed mechanisms. The heads still read as bright C-shaped brass housings. The links remain thin rigid bars. Cables on the body are a useful improvement, but do not recover the concept's weighted curved shell and layered joint construction.

Regenerate at explicit native density with larger purposeful iron planes, restrained bronze edge hardware, clearer layered curved armor, substantial joint casings and readable cable negative space. Preserve the mechanical anchor layout, but do not treat the previous atlas silhouette and surface design as the design authority.

## V1 processed/runtime gate: FAIL / gameplay evidence PENDING

The processed sheet visibly retains red/olive perimeter fringe, especially on the wheel, head exteriors and cargo rail openings. Shading and wear include scattered small pixels instead of coherent clusters. These observations already block the processed portion of the gate.

Visible placement and contacts remain unverified. No actual production captures have been supplied for 1x, 2x or mobile, and no normal-control route evidence has been reviewed. Required states remain initial, foot raised/grounded, shield brace, plunger stroke, shutter open, disabled, cargo dock and exit. Inspect the actual housing/joint terminals, planted foot pixels, walking deck and passenger soles at their supporting surfaces in those captures; atlas canvas bounds cannot stand in for contact.

Publication is blocked. Source and runtime gates must both be repeated after corrected art and final integration. This review grants no motion, anchor or gameplay approval.

## V2 source gate: FAIL; structural direction improved

Inspected `assets/warden97/parts-raw-v2.png` (1280×1280) and `assets/warden97/parts-native-v2.png` (512×512). Layered curved plates, exposed gear negative space, thicker piston/joint casings and heavier hanging cables substantially recover the original mechanical language. This is a useful structural revision.

Density remains unaccepted. The raw curved armor faces contain irregular fine stipple and chips smaller than the 2.5-source-pixel width corresponding to one native pixel. Curved outlines also include fine antialias fragments. In the native result, this wear becomes granular sparkle instead of deliberately connected rust patches. Native one-pixel accents can be valid when authored as solid grid cells with clear purpose; the raw sub-grid irregular microtexture here is not that.

Next prompt constraint: render a uniform 512×512 logical grid, enlarged with nearest-neighbor blocks only. Each native pixel must be a single solid color with no subpixel marks or antialiasing. Rust should occupy contiguous 3–8-native-pixel patches. Use 3–4 connected armor shading bands and no stipple or microtexture. Cable links and gear teeth must use deliberate native clusters. Preserve V2's structural revision.

V2 processed/runtime gate remains FAIL / gameplay PENDING. Colored fringe is still visible and cleanup has not yet been applied. Cleaning chroma edges can correct alpha contamination, but cannot approve a failed source density. No final anchor or production state/contact evidence has yet been inspected.

## V3 source gate: ACCEPTED

Inspected retained `assets/warden97/parts-raw-v3.png` (1280×1280) beside `assets/warden97/parts-native-v3.png` (512×512 draft). Large deliberate connected shading and rust clusters replace the sub-grid stipple. Stepped silhouettes, readable gear/cable negative space and consistent mechanical detail now survive at intended native size. Curved layered plates and thick piston casings preserve V2's improved construction. Slate iron and oxidized patches give the bronze a coherent worn-metal context. This is sufficient source-density and design-direction acceptance; it is not anchor or runtime approval.

V3 processed/runtime gate: PENDING. The draft has not received final alpha cleanup or component translation registration, and colored edge contamination is still visible. Inspect the cleaned registered candidate before integration approval. Preserve scale during translation. A visible joint cap can seat on the physical hip mount, but adjacent rings must read as attachment eyes rather than disconnected pivots. Require actual joint/port pixels, sole/deck contacts, all required states and final production 1x/2x/mobile evidence. Publication remains blocked.

## Cleaned V3 and first runtime evidence

Processed art ACCEPTED: inspected `parts-native.png`, `parts-native-2x.png` and `registration.json`. Cleanup removes the colored fringe while preserving clustered planes, outlines and cable/gear negative space. This acceptance covers the processed image, not its placements.

Runtime FAIL pending correction: inspected `assets/warden97/evidence/initial-1x.png`, `initial-2x.png`, `brace-{desktop,mobile,portrait}-{1x,2x}.png` and `spine.png`. Planted Warden soles meet the floor, held foot visibly meets Olaf's raised shield, Erik's soles meet the back deck, and joint caps seat on the piston chains. Initial 2x frames heroes/walls rather than the boss. Room windows and frames remain readable behind actors.

Also inspected `cap-before-desktop-1x.png`, `cap-middle-desktop-1x.png`, `cap-full-desktop-{1x,2x}.png`, `cap-middle-mobile-1x.png`, `cap-full-portrait-2x.png`, `lens-open.png` and `shutdown-{start,middle,complete}.png`. Plunger/shutter progress and disabled lens are visually legible. Further mobile/2x shutdown evidence and final route completion remain pending.

Contact blocker: `boarded-{1x,2x}.png`, `boarded-mobile-{1x,2x}.png` and `upper-dock.png` show passenger soles embedded in the cargo front face, roughly 28–32 screen pixels below its bright upper walking strip at desktop 2x. The registered cargo rim at crop-relative native y68 appears lower than the actual strip around y60–61. Correct the artwork translation against the unchanged rider walking plane, then recapture boarded and dock states. Publication remains blocked until this visible contact is corrected and the normal-control route is verified.

## Final corrected runtime gate: ACCEPTED

Re-inspected refreshed `boarded-{1x,2x}.png`, `boarded-mobile-{1x,2x}.png` and `upper-dock.png` after cargo rim correction 68→60. Passenger soles now meet the cargo's visible upper walking strip; the prior front-face sinking is corrected. At upper dock, that strip meets the landing plane. At lower dock, visible wheels/base meet the floor. Physics were preserved while artwork registration changed.

Inspected `disabled-lens-{desktop,mobile}-{1x,2x}.png`: fractures remain legible at gameplay scale, with coherent housing and grounded disabled feet. Portrait disabled-lens captures frame Balaeog and leave the actual lens offscreen, so portrait lens is explicitly unverified; landscape mobile supplies the mobile lens evidence. Portrait brace and plunger evidence were reviewed earlier.

Inspected `exit.png` and verified `browser-route.json`: `won: true`, HP `[3,3,3]`, time `99.70833333335875`, `errors: []`. This final normal-control route supplies completion evidence after the contact correction. Route success supplements the visually inspected state/contact captures rather than replacing them.

Final extraction dimensions are body 320×124, head 104×116, link 40×93, foot 48×48; source scale remains uniform. These rectangles accommodate the generated component positions/cables and are distinct from the original planned cells. Native atlas remains 512×512 and one native pixel remains two world units. Final reviewed anchors include foot sole39, head eye(86,58), body deck4 and cargo rim60. No arbitrary per-component stretch was approved.

Both gates are accepted for the final Warden97 asset integration: source V3, cleaned processed image and corrected runtime placement. Publication is allowed for this reviewed integration. This review covers the Warden boss/contact evidence, not an independent visual survey of the other five rooms.
