# Third guided Erik sheet trial

This experiment is not connected to production character rendering or the skin
selector. It uses the built-in imagegen tool, with exact prompts and untouched
sources retained in assets/vikings77. No Baleog/Olaf expansion until the method
establishes native density and pose fidelity for Erik.

The revised procedural guide covers32cells:8walk,4idle,2look,4rearclimb,2rise,
2fall,3land,1hurt and6bash. Sheet512x256,8x4cells64x64, origin32/40, sole62,
neutral body36nativepixels/72worldunits. Lookup/down rotate the head; ladder
grips alternate with rear-facing head intent. Near/far limb identity is retained.

First77source improves shaded materials/rear climb but adds fine rendered
details, enlarges the figure and substitutes/repeats walk phases. A targeted
density correction uses the original guide again, asks for coarse16color shading
and avoids the painted source as a generation reference. The correction has
coarser material clusters and clearer head direction, but still changes scale
and several walking/action poses.

Both outputs are1774x887. Guide cell0opaque extent is36nativepixels; first raw
figure is158sourcepixels and correction157, about45.6/45.3nativepixels at the
requested sheet scale. Source head position/registration therefore does not
match the guide. They cannot be treated as completed native sprite sources.

erik-native-comparison-diagnostic.png is solely a same-cell-size inspection:
left guide, middle first source, right corrected source. Its uniform target-size
sampling is not an accepted candidate or a repair. No torso transplant,
per-frame fitting, alpha cleanup, production replacement or final skin approval
has been applied. Independent source review is recorded separately. Runtime
approval remains unavailable for any source that fails that review.

The reliable next method is to author final native geometry and occlusion,
using imagegen only as a material reference if whole-sheet generation continues
to override anatomy. Do not disguise discarded high-resolution source pixels
as compliant sprites through downsampling or altered world scale.
