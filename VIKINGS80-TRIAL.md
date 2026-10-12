# Full guided Viking material trials

Built-in imagegen rendered all three accepted native pose atlases, followed by
an Olaf style correction requested by the user. Raw outputs are retained in
assets/vikings80/{hero}-imagegen-raw.png and olaf-style-correction-raw.png.
Exact prompts are alongside them. The style correction uses the stout80 walk
guide as anatomy authority and the earlier79 render solely as a material/style
reference, restoring earthy colors and dimensional shading.

The guide generator and reference record use the **first game's original SNES
Olaf** sheet; Heroes of the Storm and The Lost Vikings2 are not design authority.
The broader belly, back and limbs remain at the current adult-human scale.

All130 native guide poses passed fixed-bone/registration checks and independent
guide review. All generated sources remain rejected for native-density or pose
fidelity. The full renders expose rear-climb orientation and sole registration
errors; the corrected Olaf walk trial restores the desired material language
but does not establish the remaining52 poses or remove fine source detail.
See VIKINGS80-REVIEW.md for individual verdicts.

tools/review-vikings80-source.py creates target-size diagnostic comparisons,
not production art. No source was pixel-grid processed or installed in gameplay.
The user's next corrections (angled Olaf shield/hidden eyes, dynamic Erik run
and long flowing beard) belong to the subsequent81 references.
