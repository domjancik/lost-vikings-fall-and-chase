# SEWER150 independent outlet-entry review

Status: accepted after eligibility, late-origin and world-marker corrections,
with final visible production/diagnostic evidence. Reviewer changes no runtime
code or art.

## Shared aperture and journey

The user requests visible water and hero movement into the pipe opening, rather
than disappearance behind foreground masonry. The retained environment-native
cell12 was independently inspected: its dark center is native31,27, mapping from
sprite3090,812 to mouth3152,866 at two world units per native pixel. Conservative
clear radius30 stays inside the native rim. The virtual throat3164,870 remains
inside that aperture.

The shared curve goes2700,770 to that measured center. Arc-length lookup drives
both water highlights and hero movement, avoiding arbitrary speed changes along
the bend. Captured heroes retain their current origin, blend their body center
into the current, tip head-first, then approach0.55scale at the mouth and recede
to zero inside the throat. Scale is quantized and bounded, rotation is a native
raster, and movement is continuous rather than a final-coordinate teleport.

Pipe art is behind the current and heroes; the former foreground wall curtain
is removed. Only small wakes cross the actor. Their own movement, orientation
and recession must visibly establish entry, not an opaque overlay. The magnetic
renderer defaults to scale1 elsewhere; the explicit transit scale does not
change other magnetic gameplay or normal hero dimensions.

## Independent checks and finding

Independently ran43 focused tests across sewer150/149/145/136/125: all pass.
New tests cover shared endpoint, monotonic curve, each hero's continuous60/120Hz
journey, small visible in-aperture depth before disappearance, retained health
and shared final throat. Old attack/shield/contact/deck-clearance/light/inventory
and healthy full-route regressions also pass.

One source issue remains: initial capture still accepts feet above700, while
the new visible ribbon's upper surface at x2780 is approximately743. A jumping
hero with feet710..735 would therefore be captured before touching the current.
Requested shared-surface overlap eligibility and an above-water/jump regression,
preserving legitimate standing entry at feet760. This is now corrected through
`sewerOutletSurface`, which inverts the ribbon's upper edge; the new jumping
regression waits for actual contact. Numerical path checks alone do not establish
correct entry contact or visible mouth alignment.

Staged production diagnostics now show all three heroes shrinking inside the
measured dark aperture, and retained native pipe/rim is clearly behind the actor.
The current highlights converge through the opening rather than ending at the
old hidden floor coordinate. Each seeded picture is explicitly labeled and uses
current imagegen90 heroes and real production lighting. The tunnel wick is moved
from inside the corrected current to a rear bracket beside the mouth.

Two additional review findings were found: `startDistance` initially clamped late
origins to3100 although the opening extends3152, causing a leftward jump for a
late capture; initial approach scale can also start below1 for a short remaining
approach. Requested full-domain origin/sole continuity, including late entry.
Initial actual ordinary entry images also showed full-size world health pips/selection
marker far above the tiny receding hero. Requested hiding/fading those markers
during noninteractive capture while keeping HUD health, so they do not undermine
the visible depth. Isolated diagnostics do not draw those app-level markers.

Both are corrected with regressions. Shared inversion now uses the measured mouth
3152; a short remaining approach gets at least110travel units to tip/sink from its
actual origin before depth, retaining scale1 and exact initial sole instead of
shrinking or jumping on capture. Tests sample3090/3120/3140/3152 origins. Captured
sewer heroes omit world feedback markers during this noninteractive movement,
while HUD picker health stays visible. Independently reran all focused tests:
47pass, including the original healthy60/120Hz routes and the new contact,
late-origin and marker regressions. The additional finite-water check rejects
actors beside the mouth or below the lower ribbon, preventing capture outside
actual water. Final ordinary UI pictures verify the marker correction; earlier
marker-bearing pictures are superseded.

## Final visible and route gates

Independently inspected final ordinary entry/depth views for all three heroes,
including1x/2x, portrait and landscape. The native metal rim remains rich, correctly
scaled and rear-mounted; water and shrinking bodies visibly enter its dark center.
The small inner water wedge continues to the throat rather than ending at a flat
endcap. No foreground wall or opaque actor overlay substitutes for entry. Captured
world health pips and selection arrows are gone while HUD picker health remains.
The pause banner preserves transient entry/depth frames above the subject.

`assets/sewer150/diagnostic/check.json` records36images across18seeded stages:
all three heroes at0,.55,1.25,1.7,1.95 and2.3seconds, using production lighting and
the current imagegen90 sheets. The gap is intentionally dark, but illuminated
mouth and small-depth stages visibly demonstrate entry and recession. These are
clearly labeled SEEDED PRODUCTION FLOW and are not claimed as ordinary playthrough.

Separately, final `assets/sewer150/route/evidence.json` records actual coarse/touch
ordinary-input completion in66.2583seconds, all heroes3HP,49captures/errors[] and
continuation to water round4. Independently verified the compact receipt's linked
raw SHA256, outcome, capture count, errors and continuation against the original
full evidence. Its cameras/hero poses/current metadata and sidecars preserve the
actual1x/2x/mobile entry proof. Current skin resolves to vikings90 Erik/Baleog and
Olaf111; no physical-device/iOS claim is made.

Source/native continuity gate: accepted. Runtime gate: accepted. Aesthetic gate:
accepted. Cooperation/control gate: accepted. Each hero must contact the finite
current, makes its own complete visible journey and remains safe while the crew
follows; all three reaching the throat triggers the onward water transition.
Original shoot/shield/enemy/light/inventory regressions remain green. Publication
allowed subject to integrating-agent final build/release and live-byte checks.
