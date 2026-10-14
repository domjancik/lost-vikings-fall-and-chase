# Independent structural review — Reorg99

Review status: **accepted for the structural reorganization commit**. No remaining
blocking findings. This verdict does not authorize a deployment or substitute for
visual acceptance of newly changed art.

This review inspected the migrated working tree, source map, release manifest,
build implementation, migration/staging implementation, art-tool references and
navigation documents. It did not regenerate art or modify game behavior.

## Verified evidence

- The independent final rerun passed 427 tests: existing unit tests, structure,
  manifest and release validation. The development-server test hit sandbox EPERM
  on fs.realpath of the repository root in this review environment. The main
  agent's final run passed all 431 tests with approved realpath access, recorded
  in the durable checks receipt below.
- Independently running the release checker verified 359 files.
- Three added visual-gate regression tests independently passed, and publisher
  dry-run passed for 360 explicit files without credentials or network access.
- Every source-map destination exists. All 246 shipping assets and all runtime
  module sources were already tracked; untracked experiments are excluded.
- README, architecture, AGENTS, repository skills and current standard Markdown
  links resolve after the moves.
- Recorded equivalence follows the emitted import graph and checks all 102
  runtime modules against verified Loom98 after cache-token/CR normalization.
  It reports unchanged copied assets and byte-identical archived scripts.
- Real-Chrome evidence in output/reorg99/browser/results.json covers source and
  build modes, three campaigns, 26 previews, movement, hero selection, inventory,
  zoom, pause, restart and mobile viewport, with an empty error list. The smoke
  also visits four preview/gallery pages.
- Grouping simulation, art and rendering by level is coherent. The source map
  preserves discoverability of historical names; the explicit manifest replaces
  the incomplete old build list and preserves public URLs.

## Corrected migration blocker

Maintained scale/scene Python tools initially invoked archived Node helpers with
broken ../scene-resolution.js imports. Maintained copies now live under
 tools/art/scene/, import ../../../src/render/scene-resolution.js, and have updated
Python callers. Archived bytes remain intact. This blocker is resolved.

## Staging and original-work preservation

The staged audit reports 874 tracked moves and compares staged blobs against
transformed saved HEAD. Its intentional AGENTS exception adds current navigation
instructions; that diff was independently inspected.

Independent Git inspection confirmed exactly three original substantive unstaged
differences: archived build.mjs, archived publish-update.mjs, and the dirty
pixel-fixer submodule. The eleven original untracked art files, browser probes
and Python utilities remain untracked at their mapped paths. New infrastructure
is staged explicitly. Working-tree equivalence and committed-HEAD equivalence
must remain distinct because original WIP is deliberately excluded from this
structural commit.

Many original beforeHash/headHash differences are merely CRLF checkout conversion;
Git's original patch, rather than raw byte comparisons, establishes the three
substantive pre-existing deltas.

The migration now refuses changed HEAD and applied/staged replays. Both marker
files exist. Do not remove these guards or replay historical snapshots over later
work.

## Corrected publication-preflight blocker

The publisher now invokes tools/release/visual-gates.mjs before its dry-run or
publication branches. Both source and runtime verdicts are required, including
accept/accepted object verdicts and Vikings90 per-character accepted strings.
Cooperation verdicts are required when present. Regression tests reject missing,
pending and rejected verdicts even with a true publication flag. Original gate
JSON bytes are preserved. This blocker is resolved.

## Durable evidence

- [Final 431-test run, build and preflight checks](reorg99-evidence/checks.json)
- [Runtime, asset and archive equivalence](reorg99-evidence/equivalence.json)
- [Staged migration and original-work preservation](reorg99-evidence/wip-verification.json)
- [Real-Chrome source and build smoke](reorg99-evidence/browser-results.json)

These receipts supplement the test and focused preflight results above. Before
committing, stage this final review and the evidence files explicitly; retain the
three original unstaged differences and eleven original untracked experiments.

## Bounded limitations

The ESM scanner covers this repository's verified syntax; it is not a full JS
parser. Direct computed, template and concatenated imports are now rejected by
a regression-tested guard. Imports nested inside template interpolation remain
outside demonstrated coverage. Current closure evidence is not proof for every
future syntax form.

The asset equivalence verifier compares current sources to emitted hashes rather
than an independent original asset snapshot. Original paths, Git asset status and
the preserved frozen release supply the additional preservation evidence. This
structural review does not replace art source/runtime visual acceptance.
