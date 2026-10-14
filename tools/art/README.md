# Art tools

Run these from the repository root, using the local pixel-fixer Python runtime
where needed. Files are grouped by subject; current native art rules live in
`skills/native-sprite-art/` and `docs/standards/`.

Preparation/packing and validation scripts retain their release names so their
sources and prompts remain traceable. Old browser-driver generators and patch
helpers are historical utilities, not current game or release entrypoints.
Read a utility before running it; use the root package commands for the build,
release check and current browser smoke.

The maintained scene resampler and comparison helpers here use the current
`src/render/scene-resolution.js`. Their original toolchain copies remain untouched
in `archive/tools/`.
