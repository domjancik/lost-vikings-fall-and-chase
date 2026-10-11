# Vikings63 character redesign

The initial detailed imagegen sheets are rejected: fine source detail was
destroyed by reduction to36native pixels. Apply skills/native-sprite-art/SKILL.md
and pass its raw-density and processed/in-game gates before any release.

Replace the procedural figures with authored animation sheets. Human adults,
approximately six head heights, long articulated legs, feet registered to the
existing y+44 floor contact. Preserve physics and ability ranges.

* Erik: lean forward runner, ginger short beard, rust split tunic, cream scarf.
* Baleog: upright mail-clad warrior, teal coat, angular nasal helmet, sword,
  bow and diagonal quiver. Longer straight silhouette, controlled attacks.
* Olaf: broad heavy adult, ochre wool, pale twin braids, substantial boots,
  one iron-rimmed wooden shield. Width communicates weight, not short limbs.

All sheets have 8 columns and 4 rows. Row0 run8; row1 idle4, rise2, fall2;
row2 climb4, land3, hurt1. Row3 Erik bash6/hurt2; Baleog sword4/bow4;
Olaf shield-raising body4/overhead-brace4. No ladders, shadows or effects baked into art.
Missing pose names fail explicitly. Use matching authored frames for turns.

Normalize scale once per character using standing idle references, never fit
each frame independently. Correct generated sole jitter by translation only;
never stretch a pose. Fixed native64-square cells, body origin32,40,
sole baseline62; render at2world units/native pixel. Grounded soles meet y+44.
Keep original sources and packing metadata. Pixel alpha is binary, no cropped
weapon or foot, transparent cell boundaries. Fixed registration preserves
limb movement and apparent scale. Olaf shield is a separate native14x24 asset,
always28x48world; rotate it on the shared pixel grid around its grip.

Review silhouettes in grayscale, authored action extremes, both facing
directions, climb and float, normal pub and Cycle environments at1x/2x,
mobile HUD portraits, and an actual Erik passenger standing on Olaf. Keep
portraits synchronized with image loading. Animation timing, hitboxes,
acceleration, equipment collision and world shadows remain engine controlled.

Acceptance: no floating grounded sole, double shield, baked ladder, clipped
weapon, stretched body, blank frame or premature publish. Critique agent
reviews evidence against this contract before release.

Final shaded63 sources retain36/38native standing heights. Climb uses two
readable reach/pull phases across four authored cells; do not claim alternating
four-limb poses. Baleog sheaths his sword while gripping rungs. Packing uses
uniform NEAREST once, no grid detection/reconstruction. Final review lives in
HERO-ART-REVIEW.md; retain rejected/shading revisions for traceability.
