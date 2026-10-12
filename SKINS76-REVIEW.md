# Original procedural Vikings restoration review

Scope: user-selectable nostalgic procedural skin restored from d2c551a, adapted
to current pose dispatch and fixed shield geometry. This does not approve the
unfinished74guided art or claim correction of all original anatomy/animation
limitations. No implementation edits by this reviewer.

## Source/code gate

**SOURCE gate: ACCEPTED for the requested restoration.** There is no new
imagegen source or raster resampling. hero-procedural.js directly authors its
cached112x136canvas figures, with distinct rust/teal/ochre equipment silhouettes.
The restored source/provenance is identified. Foot row45 drawn at origin-59 after
source translation58 yields the current world-root+44foot plane. Removed local
shadow avoids a second body-attached ellipse; the world shadow stays responsible
for floor projection. The shield uses current28x48dimensions and upTop-36, paints
after the body outside torso bob and mirrors with the character. Portrait/inset
dispatch uses the selected global skin, with explicit h.skin taking precedence.

Independently ran hero-procedural, hero-skins and hero-shield-occlusion tests:
5passed,0failed. The pose test covers28hero/action combinations without requiring
image sheets. It verifies valid drawing dispatch, not visual quality, every frame
or actual terrain contacts. The nostalgic figures retain their original stylized
head/torso proportions and forward-looking climb; acceptance is restoration of
that optional style, not a new adult-anatomy or rear-climb redesign.

## Runtime gate

**Actual1x/2x/mobile runtime gate: PENDING.** Inspect floor soles, front/overhead
grip and mirror, readable gameplay scale, portrait repaint/persistence and remote
inset selection. Runtime screenshots must demonstrate the restored selector
route, not merely an isolated procedural preview. No source-code blocker found
in the limited restoration preflight.
