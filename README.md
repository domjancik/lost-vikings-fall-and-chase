# Last Call — a cooperative Viking puzzle game

Run commands from the repository root:

```sh
npm test
npm run dev
npm run build
npm run release:check
npm run test:browser
npm run publish:here-now -- --dry-run
```

Start with [the architecture guide](docs/ARCHITECTURE.md) before changing code.
Runtime lives in `src/`, tests in `tests/`, maintained commands in `tools/`, and
historical revision records in `docs/history/` and `archive/`.

The explicit [release manifest](config/release-manifest.json) defines what ships.
It preserves the existing flat public URLs while keeping source modules grouped
by responsibility. Add a module or runtime asset there when adding a feature.
`dist/release-manifest.json` records every emitted file's SHA256 and source.

Original imagegen sources, prompts, registrations and visual evidence remain in
`assets/`. Follow [AGENTS.md](AGENTS.md) and the repository skills. Do not treat
historical patch scripts as current build or publishing commands.

The publishing command consumes the verified build manifest. `--dry-run` performs
preflight only; omit it only when publishing the reviewed build is intended.
