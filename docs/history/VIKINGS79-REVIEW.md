# Independent review: held round-shield Olaf trial

Reviewed 2026-10-12 against skills/native-sprite-art/SKILL.md and
VISUAL-REVIEW-GATE.md. No generator/runtime edits by reviewer.

## Procedural guide density / geometry — ACCEPTED

Inspected assets/vikings79/olaf-walk-input-native.png (256x128, eight64x64
cells arranged4x2), its exact4x1024x512 input, the full olaf-frame-key.png,
olaf-joint-key.png and tools/guide-vikings79.py. These are directly authored
native pixels using the retained78 anatomical rig. Olaf remains36 native
pixels /72 world units tall, cell64x64 /128x128 world, origin(32,40), sole62.

The held round face is24x24 native /48x48 world. Its opaque underside stays
7–8 native pixels above the planted sole reference in walk/idle, visibly
removing the previous dragging-floor cue. The circular face/boss is readable
at actual native size. Its center follows torso motion with a small bob;
the arm is solved to its moving concealed interior strap, rather than painting
an independently floating plate. Joint overlay confirms the shoulder/elbow/
palm chain beneath the face. The eight input cells preserve alternating
bright-near/dark-far walking leg identities and planted/swing foot states.

Full60pose packet retains distinct adult torso/pelvis/head proportions and
the accepted78 pose roles. Round face becomes an edge-on24x6 native profile
overhead, preserving the physical24-native diameter and rider plane22 /
world-relative-36. Palms now seat at its underside25. Front-to-overhead
transition is a circular plate tipping away from the image plane, rather than
a rectangle rotating face-on. This is guide geometry, not a runtime change.
Overhead-climb continues to alternate one support palm and one ladder hand.

Independently ran tools/validate-vikings79.py: passed fixed bones, native
scale, soles, clearance, held bob and rider-plane checks; its mutated dragging
shield fixture was rejected. That corroborates the visible guide changes,
and does not establish raw generated material quality or gameplay acceptance.

## Imagegen raw source native-density / pose fidelity — REJECTED

Independently inspected assets/vikings79/olaf-imagegen-raw.png at1774x887,
then olaf-imagegen-native-diagnostic.png and olaf-imagegen-comparison.png.
The diagnostic is uniform target-size nearest sampling for review only;
it is not an accepted processed sprite. Exact prompt is retained at
VIKINGS79-IMAGEGEN-PROMPT.txt. Logical source atlas is256x128, so the raw
output represents about6.9297 output pixels per intended native pixel.

The result adds the requested two readable curved horns and longish ginger
beard above the belt. The round wooden shield, steel rim/boss, earthy tunic
and distinct leg poses are visually present. The shield stays above the
boot floor reference instead of resting on it. Body and shield composition
are broadly consistent with the guide, and the eight poses do not collapse
into eight identical standing figures. These are successful trial features.

The raw source nevertheless fails native-density quality. Helmet highlights,
beard shading, boot folds and shield outline contain fine irregular pixels,
soft multi-shade texture and antialiased edge detail smaller than the logical
pixel pitch. They are not uniform enlarged native clusters. At intended
native size those features compress into speckled shading and unstable
small edges, particularly face/beard and boots; attractive larger rendering
does not establish usable native source. The comparison clearly separates
the guide's deliberate flat clusters from the generated compressed texture.

Independent raw diagnostic found65,789 RGB colors among pixels with alpha>240,
all256 alpha levels and336,704 partially transparent pixels. Any-alpha
first-cell bounds span(25,41,442,439), well beyond the visibly occupied figure,
so the background also retains low-alpha residue. These scalar observations
corroborate the visibly soft/fine source; they are not the sole rejection basis.
No opaque duplicate limb was identified, but that cannot waive density/alpha
failure or establish a continuous production gait/contact verdict.

Regenerate from the accepted native guide with actual matching cluster density
and clean transparent edges. Do not quantize/downsample/grid-detect this source
into production or treat the target diagnostic as a repaired asset. Preserve
the successful horns, upper-chest beard, held roundshield and guide pose anchors.

## Processed / actual-game runtime — NOT ASSESSABLE; NOT APPROVED

This trial is not wired into production. Native input/keys are not gameplay
evidence. Final acceptance still requires retained raw material art, source
and processed comparison, real1x/2x/mobile, floor/shield/palm contacts,
continuous shield hand transfer, mirrored poses and actual passenger soles.
The full guide's sampled equipment keys cannot waive that review gate.
