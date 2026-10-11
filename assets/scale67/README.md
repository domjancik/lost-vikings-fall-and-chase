# Edge-aware scenery67

The former positive spatial average could produce a gray or colored halo between
contrasting neighboring source clusters, even though values never exceeded the
source range. Guarded resampling references the nearest center sample inside the
same source footprint. Samples differing by more than48 in any RGB channel are
rejected; accepted samples receive a smooth squared similarity weight as well as
the positive spatial weight. Zero tolerance gives center color; Infinity is the
old unguarded behavior for comparisons. No sharpening/negative weights/ringing.

Campaign far scenes use this directly from retained768x512 original crops into
the existing viewport-sized native grids. Eight middle planes are rebuilt from
assets/mid49/source-{0,1}.png and assets/scale50/pub-middle-source.png. Their
original192x128 or288x192 grids, source registration, binary alpha and foundation
offsets are preserved. Alpha crossings do not contribute neighboring colors.
Pub far is prepared once from assets/scale50/pub-far-source.png directly at its
native192x128 target; runtime preparation at the same dimensions is identity.

This is a resampling repair, not a postprocess over already-packed PNGs. Existing
Arcade and puzzle background art and character sheets are unchanged. A halo
already painted in an original cannot be identified solely by this contrast guard.

Rebuild: tools/prepare-scale67.py invokes tools/resample-scene67.mjs, sharing the
exact game resampler. Validate: tools/validate-scale67.py and scene-resolution.test.js.
Comparisons: output/playwright/scene67-compare-{0,5,6}.png and
scene67-middle-compare-{0,5,6,7}.png. Pixel2world size and scene/world scale unchanged.
