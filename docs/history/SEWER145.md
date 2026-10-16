# SEWER145 — Cockroach contact and grounded gait

The existing enemy could hurt Vikings only during its timed dark-room attack.
Its light-retreat and recoil branches skipped damage, allowing bodies to overlap
harmlessly. A separate physical-contact check now runs in every living state,
including recoil. It observes vertical overlap, wall occlusion, dead/captured
heroes, disabled hazards and normal health immunity. Olaf blocks with his front
shield locally; a nearby shield cannot remotely cancel attacks on another hero.
Light still drives retreat, but does not make the creature's body harmless.

The retreat/recoil renderer held one static image; patrol also switched poses
by clock rather than travel. Six articulated legs now use an alternating tripod
gait driven by actual contained displacement, signed relative to facing for
backward recoil. Stance feet remain planted, swing feet lift, and stationary or
dead creatures stop advancing the gait. Native segment clips prevent feet from
extending below their floor.

Art contract: retained assets/sewer125/props-native.png, cell12,64×64 native;
128×128 world display,2 world units per pixel. Shell, head and antenna pixels
remain unchanged. Articulated legs reuse the original opaque shaded chitin patch
at40,242,5×7 native. The shell mask removes fixed leg silhouettes only. All
assembly happens on a native64×64 canvas and is enlarged nearest-neighbor once.
The original source, attack/death art and existing death registration are kept.
No image generation, density conversion or source overwrites were performed.

Regression coverage includes actual60/120Hz contact during lit retreat, immunity,
hazard toggle, death, front/back shield behavior, nonremote protection, signed
recoil and planted stance feet. The ordinary route now shoots the creature from
safe range before Erik approaches the inspection chamber; walking through a live
enemy is no longer treated as a healthy solution. Visual evidence and independent
verdicts are recorded under assets/sewer145 and SEWER145-REVIEW.md.

Verification:738 tests pass. Both source/build smoke checks cover31 previews,
four campaigns and desktop/mobile controls. Final desktop and coarse-touch full
sewer routes each clear with HP3/3/3,19 captures, no browser errors and correct
continuation to Drowned Regulator. A separately labeled seeded diagnostic uses
the actual production engine, scene/darkness and imagegen90 heroes: lit contact
reduces HP3→2 with immunity; the front shield yields recoil and preserves HP3.
Sixteen native gait poses retain the original material comparison, while192
production raster checks prove zero pixels at/below the exclusive floor row.
