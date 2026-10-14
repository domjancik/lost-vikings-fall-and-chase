# Independent optional Imagegen trial integration review

Reviewed 2026-10-12 under native-sprite-art and VISUAL-REVIEW-GATE.md.
Reviewer made no runtime or source-art edits. This record supplements, and
does not replace, VIKINGS80-REVIEW.md and VIKINGS81-REVIEW.md.

## Explicit experimental deployment exception

After the rejected-source report, the user explicitly requested deploying the
displayed sprites as an optional new skin. This authorizes the experimental
selection described in VIKINGS82-DEPLOYMENT.md despite the outstanding art
failures. It is not retrospective native-density or aesthetic acceptance.
The current skin remains the default; the trial is labeled
`Imagegen trial · run/walk` (`imagegen81`).

## Source / native-density gate — REJECTED, unchanged

Retained raw sources are assets/vikings81/erik-beard-correction-raw.png
(1774×887), assets/vikings81/olaf-imagegen-raw.png (1774×887), and the first
eight run cells of assets/vikings80/baleog-imagegen-raw.png (1586×992).
The intended guide cells are64×64 native /128×128 world, with36/38/36-native
adult body heights and2world units per native pixel. Exact prompts and raw
sources remain retained.

The sources still contain finer material detail and soft/irregular edges than
the intended native density. Erik's correction still reads partly as rear
helmet/shoulder hair rather than one long chin-connected trailing beard;
Olaf still exposes eyes below the requested covering helmet. The earlier
source verdicts remain rejected. Runtime reduction does not repair them.

## Runtime integration smoke check — ACCEPTED within observed scope

Read hero-art.js, hero-frames.js, hero-skins.js,
imagegen81-registration.js and browser-trial82.js. Each hero uses one uniform
raw-source scale and cell translations; there is no individual alpha-box
stretching or rewritten source raster. The generated cells apply only to
run/turn. Idle, other actions and raised-shield Olaf use existing current art.
This creates visible costume/style changes at fallback boundaries; the trial
is an incomplete skin and is labeled accordingly.

Independently inspected these actual local game captures:

- output/playwright/trial82-run-0.png, trial82-run-1.png and
  trial82-run-2.png:1440×900,2x, each hero moving away from the parked group.
  In the sampled phases the opaque boots visibly meet the broad deck top;
  there is no obvious floating or buried foot registration. Body mass remains
  legible beside the scene and the parked current-art heroes.
- output/playwright/trial82-overview.png:1440×900,1x. Erik's generated moving
  silhouette remains readable, with floor contact at the visible deck. This
  is one1x sample, not an all-hero/all-phase1x gait verdict.
- output/playwright/trial82-raised-fallback.png:1440×900,2x. Olaf has one
  current overhead shield and grounded boots. The generated oblique front
  shield is absent in this fallback; no duplicate shield is visible.
- output/playwright/trial82-mobile.png:390×844,2x. Raised Olaf again has one
  overhead shield and planted feet; the mobile controls and scene remain
  readable in the inspected viewport.

The generated Olaf front shield is already baked into his walking source.
The trial draw branch returns before the separate current shield draw,
matching the observed single shield. Raised fallback retains the existing
shield support implementation. The parent reports336tests passing and a
browser route passing selection/persistence, all three raw asset loads,
movement controls and no JavaScript errors. Those reported checks support
integration safety; they do not establish source-art quality.

## Full processed / in-game visual gate — NOT APPROVED

The limited integration evidence above supports the explicitly authorized
opt-in experiment. It does not establish all eight phases at both zooms,
both mirrored directions, every fallback transition, stop/reverse climbing,
glide/braking, shield transfer or passenger sole contact. Source failures
also remain unresolved. No complete native-density production replacement
approval is claimed, and neither earlier rejected review is waived.
