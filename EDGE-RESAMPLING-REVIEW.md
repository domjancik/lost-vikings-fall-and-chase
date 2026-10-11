# Edge67 scenery sampling review

Independent changed-scope review of scene-resolution.js, the direct-original
scale67 rebuild, comparisons and actual Story gameplay captures. No new art
generation or character/physics change is included.

## RAW source gate — unchanged

**Existing source acceptance retained.** Original campaign46 scene crops,
mid49 source sheets and scale50 human-scale pub originals are unchanged. The
pipeline reads these retained originals directly, rather than reprocessing
the previous runtime PNGs. Middle targets remain 192x128 (chapters0–6) and
288x192 (pub); pub far is prepared once at192x128. Prior native-density/source
gates therefore remain applicable; this verdict does not approve a new source
or claim that existing painted source artifacts were removed.

## Processing and independent checks

The positive spatial sampler now uses its selected center color as a contrast
reference. It rejects neighbors differing by more than48 in any RGB channel,
and gives accepted colors positive spatial/similarity weights. The center itself
provides nonzero weight, with zero tolerance retaining that sample. This prevents
a bright center and dark neighbors from creating an unrelated middle gray.
Similar tones can still blend; this is not an exact source-palette preservation
algorithm. There are no negative weights or sharpening terms.

With preserveAlpha, a transparent center remains all-zero output, and binary
opaque/transparent neighbors do not blend into an alpha/color fringe. Rebuild
inputs are binary-alpha before sampling. Sheet-wide scale/translation and actual
substantial foundation offsets stay unchanged. No world-size adjustment hides
sampling quality. Runtime pub-far identity avoids an additional reduction.

Independently ran scene-resolution.test.js, midground-layout.test.js,
scene-art.test.js and vertical-parallax.test.js: 11 tests passed, including the
actual PNG dimension/alpha/foundation validator and strong-edge regression.

## PROCESSED / actual runtime gate

**ACCEPTED in the reviewed contexts.** Inspected far comparisons
output/playwright/scene67-compare-{0,5,6}.png and middle comparisons
scene67-middle-compare-{0,5,6,7}.png. Small lamps, gold rim highlights, dark
openings, arch supports and ceiling cages retain readable silhouettes. No new
large posterized color patches, ringing edge, isolated color speckle or broken
outline is apparent. The improvement is subtle in many regions and stronger at
contrasting edges; it must not be described as repairing all source defects.

Inspected all16 actual edge67-chapter-{0..7}-{1x,2x}.png views and
edge67-mobile-pub.png. Scenery framing/native scale remains consistent across
zooms. Visible middle architecture bases meet the foreground without exposed
sky gaps; the hanging chapter5 source retains its ceiling support. Pub doors,
balcony and counters remain at adult-human scale. Thin native lines are still
quantized/readable, without newly blended transparent ghost outlines.

Parent reports zero browser errors across these captures and273 root tests
passing. I independently inspected the images and focused tests; no separate
browser playthrough is claimed. These spawn views do not certify every moving
camera context or unrelated legacy art.

Nonblocking out-of-scope observation: the unchanged terrain infill shows periodic
dark horizontal seams in chapter3/4 1x views and chapter4 2x. This scenery sampler
does not process those terrain tiles. Avoid claiming this release eliminates
every tiling artifact; terrain needs its own targeted inspection if pursued.

Final recommendation: accept the scenery-resampling correction. No blocking
new feature loss, alpha damage, scale change or grounding regression is found
in the reviewed comparisons and runtime evidence.

## Published verification —2026-10-12

Commitc9c9382 published to the existing site. Live HTML, four changed runtime
modules and all nine rebuilt scenery planes match the reviewed release by
SHA256. Public all8chapter1x/2x and mobilepub checks pass with identical native
sizes, foundation offsets and floor/ceiling contact metadata; zero page errors.
Evidence output/playwright/edge67-live-*. Root273tests pass. This record remains
scoped to resampling color bleed, not painted source halos or terrain tiling.
