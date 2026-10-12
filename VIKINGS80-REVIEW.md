# Independent review: first-game builds and full native atlas trial

Reviewed2026-10-12 against native-sprite-art, VISUAL-REVIEW-GATE.md and
HUMAN-SCALE.md. No generator or runtime edits by reviewer. Earlier79 review
remains preserved and is not superseded as an acceptance of its raw render.

## Procedural guide source density / geometry — ACCEPTED for all three heroes

Authoritative visual reference inspected:
assets/vikings80/references/olaf-original-snes.png, the original first-game
SNES Olaf sheet from https://www.spriters-resource.com/snes/lostvikings/asset/8335/.
The first1992/1993 game is the anatomy/mass authority, not Lost Vikings2 or
Heroes of the Storm. The sheet shows the required round belly, broad back,
thick arms, compact sturdy legs, stout neck, green costume and yellow beard.

Inspected tools/guide-vikings80.py; all three guide-native.png atlases;
olaf-stout-body-review.png, three-builds-body-only.png; full Baleog and Olaf
frame keys; Olaf joint key; and the final corrected Olaf native-density-review.
Earlier78/79 guide reviews establish the retained lean Erik/muscular Baleog
joint system and held roundshield construction;80 was visually inspected anew.

Erik32 cells:512x256; Baleog38:512x320; Olaf60:512x512. Each cell64x64
native /128x128 world, origin(32,40), planted sole exclusive62; one native
pixel equals two world units. Body height36/38/36 native pixels remains
72/76/72 world units. All artwork is directly authored on this native grid;
full-input-2x enlargements do not add finer source detail.

Olaf is now visibly much chubbier than79: a full convex barrel abdomen,
broad rounded back, thicker arms/thighs and stout neck. Body-only evidence
shows that this is actual silhouette mass, not an equipment illusion.
The green/open-belly design recalls the first-game sheet while preserving
adult head/body scale. Overhead/rear poses make the broad body especially
clear. Erik stays lean and Baleog broad/muscular, so their builds are distinct.

Olaf's held shield moves forward with its grip to expose the enlarged body.
Arm IK remains attached to the moving interior strap; the shield face hides
the gripping palm. The24-native round face stays clear of the planted boots,
with subtle body-driven bob. Overhead it uses the24x6 projected disc, center/
rider plane22 and underside palms25. Alternating raised-climb support/ladder
roles remain separate. Shield sampled transitions do not establish production
hand-transfer timing.

Walk contact/passing/swing, neck-led look tilt, rear climb, landing compression/
recovery and action-specific body/weapon poses remain coherent at native size.
The first stout packet had one landing ankle pixel below the sole; final
ankle taper correction and regenerated native board resolve that visible edge.
Independently ran validate-vikings78.validate on all three final80 packets:
Erik[], Baleog[], Olaf[] (no geometry/registration errors). These checks
corroborate, rather than replace, visual source acceptance.

## Raw imagegen sources — REJECTED separately for each hero

Inspected all three {hero}-imagegen-raw.png sources and the Erik/Baleog
intended-size {hero}-imagegen-native-diagnostic.png sheets against their
native guides. Exact prompts are retained as {hero}-imagegen-prompt.txt.
Diagnostic global nearest sampling is review evidence only, not an accepted
production conversion or a density rescue.

**Erik: REJECTED.** Raw1774x887 has finer irregular helmet/beard/material
detail and soft multitone edges rather than uniform enlarged native clusters.
The rear-climb14–17 images place orange beard/front-face-like material below
the back helmet, failing the rear-facing anatomy contract. Several guide arm
swings become a generic clenched-forearm hold. Intended-size planted cells0/8
reach exclusive bottom64 rather than62; source placement did not retain the
sole registration. Nice readable red costume and distinct leg families do not
waive those failures.

**Baleog: REJECTED.** Raw1586x992 adds detailed steel shoulder reflections,
fine beard/cloth/boot shading and antialiased outline texture. Rear-climb14–17
shows a yellow beard/front-face arrangement instead of a back-of-head render.
The guide's walking arm exchange is replaced with a repeated two-arm sword
hold. At intended-size sampling, planted frame0 reaches bottom64, and several
row1 cells have opaque pixels at local top0: the raw art extends across the
intended fixed-cell registration rather than preserving padding/sole anchors.
Weapon silhouettes and selected action poses look attractive larger, but
neither source density nor guide-fidelity gate passes.

**Olaf full60 atlas: REJECTED.** Raw1254x1254 does preserve a visibly stout
build and roundshield, but shifts to bright flat green/yellow material unlike
the richer earthy79 style the user liked. That stylistic regression is an
explicit user correction, independent of source-density failures. The full
source also contains fine irregular edges/soft shading, misplaced beard-like
material in rear poses, generic held hands and registration loss. It is
retained as a trial, not accepted production art. A separate corrected8walk
style trial, if produced, needs its own raw verdict and cannot approve this
full atlas or its unrendered action cells.

Scalar diagnostics corroborate the visible density/alpha issues: Erik has
80,595 distinct RGB colors at alpha>240 and351,222 partially transparent
pixels; Baleog143,252 and448,505; Olaf192,120 and638,695. Counts alone do not
reject art, but match the visually finer/softer source. Bounds above use
alpha>240 in the diagnostic and establish loss of source registration,
not a prescription for per-frame fitting.

Regenerate using deliberate native material clusters, back-only climb head
traits, retained near/far limb paths and fixed cell/sole anchors. Do not
quantize/downsample or fit each source figure to rescue these failed assets.

### Olaf eight-walk style correction — raw source REJECTED

Separately inspected assets/vikings80/olaf-style-correction-raw.png against
the80 stout guide and79 earthy material direction. Exact correction prompt
is retained at olaf-style-correction-prompt.txt. This version restores the
richer muted green, brown leather, ginger beard and sculpted wood/steel look.
It keeps visibly broad Olaf mass and the roundshield clear of the boot plane,
so it resolves the full80 atlas's bright flat material regression as a style
study. The user has since requested helmet-covered eyes and an oblique
held shield; those are future81 changes, not retrospective source repairs.

The correction still has fine helmet/beard/leather detail, irregular small
edge fragments and soft many-tone shading at the raw scale, rather than
matching deliberate uniform native clusters. Its larger attractive rendering
does not pass the native-source gate. It is only eight walk poses, so it
cannot supply or approve the remaining52 Olaf actions. Retain as a style
reference/trial and regenerate natively; no downsampling rescue or runtime
approval follows from the restored material look.

## Processed / actual-game runtime — NOT ASSESSABLE; NOT APPROVED

The80 trial is not wired into production. Final material source, processed
comparison and actual1x/2x/mobile gameplay are not yet available. Guide keys
cannot establish scene-relative scale, floor/ladder contacts, stopped/reversed
climbing, continuous hand transfer, mirrors or passenger soles on the shield.
No finished replacement skin is approved by this guide verdict.
