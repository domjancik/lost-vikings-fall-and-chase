# Depth94 decorative art review

Reviewer: independent critique agent. Scope: decorative middle scenery and quiet wall variation across the latest six machine/cycle campaign levels. This review does not authorize mechanics, collision, route or hero-scale changes.

The native-sprite-art skill, VISUAL-REVIEW-GATE.md and HUMAN-SCALE.md apply. One native pixel occupies two world units. Retained raw source, exact prompts, native dimensions, world placement and real gameplay evidence are required before acceptance.

## Native-density/source gate — accept

Targets: two 256×192 native atlases, four columns and three rows of 64×64 cells. Native pixels occupy two world units. Atlas A rows are Cycle, Refraction and Momentum; atlas B rows are Clockwork, Water and Warden. The 54-pixel industrial pipes occupy about 108 world units; 20-pixel welded racks occupy 40 world units, about half the 72-unit rendered adult Viking. Grilles occupy about 80 world units; final opaque wall tile crops occupy 108×104 world units. Floor props use a broad registered base at native row 62. Wall fixtures require opaque wall attachment. See DEPTH94-SPEC.md.

Guide-native.png and both v1 prompts reviewed: acceptable construction constraints, closed grilles, low racks and deliberate 64-pixel density. Guide acceptance does not approve rendered source or gameplay.

- **Atlas A v1: accept source density/material direction.** Inspected assets/depth94/a-raw-v1.png beside a-native-proof-v1.png. Broad flat iron/slate planes and readable rivets, pipe silhouettes, grille slats and masonry courses survive native scale. Restrained contiguous wear does not overpower the structure. Raw edge fringe still requires one-pass processing and runtime review.
- **Atlas B v1: fail.** Inspected assets/depth94/b-raw-v1.png beside b-native-proof-v1.png. Dense checker-like rust/moss mottling covers pipes, rack tops and especially the wall tiles; at 64-pixel cells this becomes scattered flecks instead of quiet large material planes. Bench contents remain readable, but that does not approve the noisy whole atlas. Regenerate using A's broad flat material density, limited tones and a few contiguous corrosion patches. Do not attempt to rescue this candidate by texture quantization.

- **Atlas B v2: accept source density/material direction.** Inspected assets/depth94/b-raw-v2.png beside b-native-proof-v2.png. Broad flat iron planes replace the mottled v1 texture; moss and rust are contiguous stepped shapes. Wall courses, grille slats and spare-gear silhouettes remain clear at native scale. The warm rack top requires subdued runtime presentation, checked under the separate gameplay gate.

Combined source gate accepts selected A v1 and B v2. Rejected B v1 remains retained as evidence and must not be used. File dimensions alone do not establish matching detail density.

## Processed/in-game gate — accept

Inspected a-native.png/a-native-4x.png and b-native.png/b-native-4x.png against their accepted raw and native-proof candidates. Broad pipe silhouettes, mounting collars, spare-gear cavities, grille slats and tile courses remain stable. Clean exterior alpha and genuine rack/pipe gaps preserve the authored silhouettes. Registrations normalize the retained source uniformly and translate cells without independently stretching parts. Final wall sampling uses an opaque 54×52 native interior, rendered as 108×104 world units without scale distortion; this actual crop supersedes the nominal 120-unit source tile footprint.

Reviewed all six **unscaled production-screen contact sheets** in output/depth94: cycle-contacts.png, refraction-contacts.png, momentum-contacts.png, clockwork-contacts.png, water-contacts.png and warden-contacts.png. These include every authored prop and wall patch at 2x, including upper galleries, exit decks and recovery floors. They are camera-only diagnostic views of the paused production renderer; camera movement changes framing, not entity or puzzle state. They establish static placement coverage, not route completion.

Also reviewed all 24 normal-start captures: output/playwright/depth94-{cycle,refraction,momentum,clockwork,water,warden}-normal-{1440,390}-{1,2}x.png. These are actual desktop/mobile production views at both zooms. Inspected full upper views depth94-cycle-diagnostic-prop-6-2x.png, depth94-cycle-diagnostic-prop-7-2x.png, depth94-refraction-diagnostic-prop-6-2x.png and depth94-momentum-diagnostic-prop-6-2x.png for nearby interactive silhouettes and route edges. The evidence manifest is output/depth94/evidence.json.

- Pipe shoes and rack bases meet opaque floor/deck rows. No sky strip separates the fixtures from their supporting planes. Wall-mounted grilles sit within opaque masonry patches whose bottoms meet the deck; no transparent cutout reveals a false opening.
- Low racks remain about half a standing adult Viking. Industrial pipes rise about one and a half adult heights; ordinary spares stay small, avoiding giant furniture or miniature-human cues. World sizes remain fixed at both zooms and on mobile.
- Passive iron/slate fixtures and warm spare racks remain below the contrast of working controls, bright optics, portals and heroes. No added lever, indicator, pickup handle or false walking ledge is implied. Production foreground rails, ladders, supports, mechanisms and character silhouettes retain their readability over rear scenery.
- Quiet wall courses remain within solid face depth below the walking edge. Opaque crop seams do not create holes or harsh alpha cutouts. The Water room retains its consistent existing basalt foreground over the rear-depth additions.

Both visual gates accept the selected A v1/B v2 candidate. The two initial resource errors were traced exclusively to the local browser's unused favicon request (output/depth94/normal-evidence.json). The server correction returned 204 for that request; the full repeated production survey has 97 captures across all six rooms and an empty errors array in output/depth94/evidence.json, independently checked by this reviewer. The technical blocker is resolved and publication is allowed for this decorative candidate. Mechanics and complete puzzle routes are outside this static-art review and must remain covered by the root's unchanged-module and route checks; live identity and gameplay require post-publication verification.

The root is retaining the six unscaled contact sheets, all 24 normal desktop/mobile captures and verification manifests under assets/depth94/review/ for version control. Original generated sources, prompts and rejected B v1 remain retained alongside the accepted atlases.
