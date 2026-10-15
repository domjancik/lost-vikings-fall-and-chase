# Scrap Orbit122: ceiling crossing

Published 2026-10-15:
https://united-marsh-6ppd.here.now/?campaign=cycle&release=orbit122&skin=imagegen90

Implementation `bba0412`; hosting version `01M4ZNYKXFKN5HDCBS8KG49VKP`.

The continuous gallery below the ceiling rail is now two landings separated by
a real 190-world-unit gap. Baleog and Olaf use magnetic traversal to reach the
second carrier while Erik remains at the crane controls. The carrier starts
at2280, putting Olaf's push position2076 on the real right floor. The room wall
ends at the left ledge; existing rich121 art and shared steel behavior remain.

Verification:

- 569/569 package tests pass. New regressions prove the missing floor cannot be
  walked across, a fallen Viking can land below and climb back, and both
  non-jumping heroes cross and finish healthy at60/120Hz.
- Normal and revolution-reset/retry simulation routes win allHP3 at both rates.
  Mistimed second-carrier danger still damages Baleog.
- Complete actual browser route wins in103.225seconds, allHP3,136captures,
  errors[]. Actual1x/2x/portrait/landscape scenes use all three latest90 sheets.
- Source/build cross-campaign browser smoke passes three campaigns and28previews.
- Independent source/runtime/aesthetic/cooperation review accepted all gates.
- Build/release verify438files; publication preflight439including emitted manifest.
- Live19critical files and normalized HTML match the tested build.
- Focused mobile-sized browser crossing passes locally and live using ordinary
  controls: acquire ceiling, walk around far rounded end, disable magnets and
  land atx2082.04, feet650, HP3, errors[]. Evidence in
  `assets/orbit122/crossing` and `assets/orbit122/live-crossing`.

No runtime changes after review/publication. Unrelated archive scripts,
Viking55 experiments and pixel-fixer work remain untouched.
