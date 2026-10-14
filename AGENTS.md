# Repository working rules

Read [the architecture guide](docs/ARCHITECTURE.md) for current source locations.
Use `config/release-manifest.json` for build/release inputs and
`config/source-map.json` to resolve legacy file references. Historical scripts
under `archive/` are development records, not current mutation entrypoints.
Run package commands from the repository root; keep runtime additions inside
`src/`, tests inside `tests/`, and update the manifest for shipped modules/assets.

For any generated or replacement game sprite, read and apply
[native-sprite-art](skills/native-sprite-art/SKILL.md).

Standing rule from the user: **sprites must be generated at a resolution and
native detail density matching their intended display size.** A high-resolution
painted character subsequently downsampled is not acceptable pixel-art source.

The critique cycle must explicitly check raw native-density art, processed
native art and real in-game 1x/2x evidence before publication. Apply
[the visual review gate](docs/standards/VISUAL-REVIEW-GATE.md). Record both visual
gate verdicts; automated dimensions/alpha tests alone do not establish quality.

Use version control. Preserve original sources and prompts. Do not overwrite
unrelated uncommitted work. Keep the existing review requirements for puzzle
causality, smoothly animated progression, consistent visual mechanics, grounded
objects/supports/enemies, and adult-human scale for the Vikings.

For environment layers and camera-relative scenery, apply
[grounded-parallax](skills/grounded-parallax/SKILL.md).
For level concepts, story/worldbuilding and cooperative puzzle work, apply
[cooperative-world-design](skills/cooperative-world-design/SKILL.md).
The existing native-sprite-art skill also defines the preferred pixel-art quality.
