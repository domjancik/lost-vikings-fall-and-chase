# DEPTH146 — Cycle of Depths mobile rendering

The CPU profile showed repeated canvas image submission dominating this level.
Its world renderer drew738 image tiles each frame, including the entire terrain,
decorative structure and filtered rail network outside the current camera.

A bounded native scene cache now retains the fixed rear plane, terrain/ladder
front plane, and the two possible active rail routes. Original draw order remains
rear → active rail → moving signals → terrain → mechanisms. Each layer is
1400×600 native pixels for the2800×1200 world, with nearest-neighbor display at
two world units per pixel. At most four layers consume13.44MB of RGBA storage;
camera movement copies only the visible native source rectangle. This cache is
specific to Cycle of Depths. It does not reduce scene detail, resolution or effects.

Parallax, carrier travel, animated cables, selector/brake poses, fan, wind and gate
remain live. Layers are built only after all relevant images finish loading;
level-ready also includes terrain/ladder readiness. No source artwork, gameplay,
collision or puzzle timing changed. Original renderer retained as a test fixture.

Matched Chrome mobile emulation at844×390 with4×CPU throttling:

| Measurement | Before | After |
| --- | ---: | ---: |
| World image draws/frame |738|108|
| Repeated filter assignments/frame |2|0|
| World draw median, three camera regions |16.4–18ms|1.5–1.7ms|
| Actual app RAF spacing median |28.9ms|10ms|
| Actual app RAF spacing95th percentile |37ms|15.9ms|

These are matched emulated browser measurements, not an iPhone hardware claim.
Receipts include profiles, draw-call counts and throttle settings. Regression
budgets assert fewer than120 warm world image calls and zero repeated filters;
they avoid fragile machine-specific timing assertions.

The final sequential comparison explicitly waits for all atlas registrations.
This supersedes the exploratory695→65 count, which missed the fan's registered
duct/cable draw calls. Both final measurements include the same complete scene.

Verification:740 tests pass, including the existing60/120Hz cooperative full
routes and cache crop/readiness/LRU tests. Source/build smoke covers31 previews
and four campaigns.18 production renderer comparisons cover both rail routes,
three cameras and three viewport footprints: every RGBA pixel matches baseline.
Both route entries are reused within the four-layer bound. A controlled incomplete
ladder test proves zero cache entries until completion, then three warm layers.
Actual coarse-touch gameplay uses ordinary movement/sword release and confirms
carrier motion, then12 verified1x/2x portrait/landscape views; remote camera views
are explicitly labeled as diagnostics. All heroes remain healthy; errors[].

Evidence: assets/depth146. Independent gates: DEPTH146-REVIEW.md.
