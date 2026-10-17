# PUB152 independent sky continuation review

Status: accepted after decode-readiness and vertical-streak corrections. Reviewer
changes no runtime code or art.

The retained384x192native coast was independently inspected. It remains the rich,
muted mountain/harbor/settlement view at768x384world units, two world units per
native pixel. Original image scale/aspect/placement are unchanged in source.
The proposed sky adds a native64row continuation sampled from its top edge,
smoothly reducing horizontal variation toward the average storm-sky tone.
This is not approval to stretch mountains or reflect them above the scene.

Actual desktop1x and portrait1x yard views currently show a solid black band
ending sharply at the original coast top (approximately screen139 and120).
Desktop1.5x also shows the dark cutoff immediately below the HUD. These are
not acceptable seamless sky proof, despite pure helper tests passing. Requested
runtime generated-sky tone/boundary pixel evidence and corrected actual views.
The retained original scene itself remains attractive and must not be degraded
to hide the extension problem. No publication approval until the hard cut is
resolved and final1x/1.5x/2x portrait/landscape/desktop views are inspected.

The first root cause is corrected: image dimensions could be known before
`image.complete`, allowing a blank early draw to become the cached sky. The
renderer now requires completion and a regression asserts no partial-load cache.
Refreshed actual views show gray-blue sky instead of black and preserve the
original coastal image.

The aesthetic gate remains rejected: desktop1x and portrait1x show vertical tonal
columns above the mountains where a single source row is extended upward. Though
low contrast, they read as stretched edge samples rather than storm atmosphere.
Requested altitude-dependent horizontal diffusion toward the average sky tone,
while keeping the exact boundary row and all original coast pixels. Helper
dimensions/color equality do not justify visible streaking.

## Final corrections and acceptance

The final source broadens horizontal cloud-tone sampling with altitude, using
mirrored edge sampling and a growing native radius, then converges to the same
average storm-sky tone. The exact final native row remains unchanged. This
eliminates thin stretched columns without modifying or blurring the source coast.
The extension is64native rows at128world units and fills still-higher viewport
space with the same quiet tone. It is drawn before the unmodified coast, with
the shared snapped x/y far-plane origin and opaque coverage; no ghost duplicate
mountains or screen-fixed join is introduced.

Independently inspected final actual yard desktop1x/1.5x, portrait1x/2x and
landscape1x/2x views. The upper sky is a restrained gray-blue continuation without
the old black boundary or visible vertical columns. Original cloud shapes,
mountains, harbor and settlement retain their rich native pixels, composition,
scale and aspect. The extension recedes quietly above the scene rather than
competing with the coast. Interior/fisher views remain coherent; this introduces
no new ground attachments or changes to human-scale furniture.

Independently ran12focused pub152/pub151/pub148 tests: all pass, including the
partial-load guard, viewport coverage, unchanged coast size and exact join-row
color. Actual evidence records18ordinary-input desktop/landscape/portrait views
at1/1.5/2x, errors[], per-capture runtime skyPixel checks and latest imagegen90
sidecars (vikings90 Erik/Baleog, Olaf111). Thus the black-cache failure is covered
in the production canvas, not solely the color helper. This scenery-only change
does not require a new full puzzle route or alter collision/story permissions.

Source/native continuity gate: accepted. Runtime gate: accepted. Aesthetic gate:
accepted. Cooperation/control gate: unchanged/accepted. Initial black and later
streaked pictures are rejected development iterations and superseded by final
views. Publication allowed subject to final build/release/live-byte verification.
## Publication receipt

Runtime commit `5d017c8` is live as version `01M54K7NZ5P5RV0SCXTA1EASQ8`
at `https://united-marsh-6ppd.here.now/?campaign=fall&release=pub152`.
All780 tests pass. Source/build smoke covered four campaigns and31previews
each without errors. Final527file build passed release integrity and visual
preflight. Live13critical files and HTML matched the reviewed release.
Live browser checks repeated18ordinary-input desktop/landscape/portrait views
at1x/1.5x/2x with errors[] and actual sky pixel `[101,114,133,255]`, confirming
opaque decoded storm sky above the preserved panorama. Receipts:
`assets/pub152/live-hashes.json` and `assets/pub152/live-check.json`.

