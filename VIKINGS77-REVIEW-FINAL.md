# Independent final review: third guided Erik trial

Reviewed 2026-10-12 against skills/native-sprite-art/SKILL.md and
VISUAL-REVIEW-GATE.md. No runtime edits or asset processing performed by reviewer.

## Target and retained sources

Native sheet: assets/vikings77/erik-guide-native.png, 512x256, eight columns by
four rows, 32 cells of 64x64. One native pixel occupies two world units;
world cell is 128x128, intended body height about36 native pixels /72 world
units. erik-guide.json records origin(32,40), sole62 and per-frame head,
arm/foot anchors and near/far leg identity. The guide's first opaque body spans
y26 through61 (bounds end62).

Raw imagegen outputs retained and inspected:

- assets/vikings77/erik-source.png, 1774x887
- assets/vikings77/erik-source-density-correction.png, 1774x887
- Exact prompts: erik-prompt.md and erik-prompt-density-correction.md

Also inspected source-diagnostics.json and
erik-native-comparison-diagnostic.png. The latter presents the native guide
beside raw samples at target cell size. It is diagnostic evidence only, not
an accepted production sheet or a permitted rescue processing operation.

## Raw native-density / guide-preservation gate — REJECTED

The first output is detailed painted sprite artwork with fine beard/hair,
helmet highlights, fabric/leather variation and irregular small outline
details. At the intended gameplay cell size these become compressed texture,
not deliberate guide-density clusters. The material result is attractive as
larger art but fails the native source requirement. It also replaces the lean
guide with a larger, broader figure.

The correction substantially simplifies internal shading into coarse patches,
but still changes the authoritative silhouette, body size and animation
anchors. It is not a material-only render over the guide. Both first-cell raw
bodies span about158/157 image pixels. The sheet scale is 1774/512=3.4648,
so these spans correspond to about45.6/45.3 native pixels instead of36.
The comparison diagnostic visibly confirms enlarged heads/body envelopes and
higher placement within the cells. Resolving this by shrinking each body or
stretching frames would violate the guide registration contract.

Pose fidelity fails independently of pixel density: row1 begins with nearly
repeated wide stances, rather than preserving the first two different guide
arm/leg phases. The walk cells substitute a recurring shoulder/forearm hold
instead of the guide's continuous opposite-limb exchange. Rear climb cells
have rear orientation, which is an improvement, but their hand positions do
not preserve all alternating reaches. The final bash cells settle into a
repeated forward-arm pose rather than the guide's varying torso/limb extension
and recovery. Simplifying the pixels does not restore those missing poses.

Required correction: regenerate from the retained original geometry guide at
its actual native figure density, preserving cell anchors, silhouette and
all distinct motion phases before material shading. Do not downsample, quantize
or use grid detection to rescue either rejected source as production art.

## Processed / actual-game gate — NOT ACCEPTED; missing runtime evidence

This trial is not wired into the game and has no accepted processed sheet,
source-to-production comparison, or actual 1x/2x/mobile gameplay evidence.
The diagnostic sheet cannot substitute for that gate. The rejected raw gate
already blocks publication of these generated sprites. Retain the trial and
prompts for review; do not describe them as finished replacement assets.
