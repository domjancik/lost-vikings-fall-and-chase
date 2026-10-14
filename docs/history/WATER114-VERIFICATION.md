# Water114 verification

- Full repository suite:523 tests pass, zero failures.
- Ordinary-input water simulation clears at60/120Hz with all three at3HP.
- Ordinary browser routes for `procedural` and `imagegen90` both clear with3HP
  for each Viking and no page errors. Retained receipts are
  `assets/water114/evidence-{procedural,imagegen90}/route.json`.
- True coarse-pointer touch inputs verify horizontal swimming, mirrored poses,
  all eight actually paused animation keys, underwater-floor swimming and
  three nearby resource callouts at1x/2x. Receipts are
  `assets/water114/touch-evidence{,-procedural}/evidence.json`.
- The six other skins retain falling-pose fallback in real gameplay; no blank
  or unsupported pose errors. Generated touch receipt records each selection.
- Warden normal controls verify strength holding/critical, death hiding and
  restart restoration against picker values at desktop/mobile zooms. The
  standalone hold eventually receives lethal laser damage; that is a deliberate
  resource/death check, not a claim of boss completion.
- Source and built application smoke both pass: three campaigns,28 previews,
  movement, selection, inventory, zoom, pause, restart and mobile controls.
- Build and release hashes match421 explicit files. Publication additionally
  requires independent accepted visual gates and live verification.

An intermediate water browser capture failed because its automation placed
Baleog outside the slightly shifted mobile bell's usable cavity. The fixture
now walks him to the actual bell center rather than a hardcoded coordinate;
final routes are healthy. Preserve the failure capture as diagnostic history.

Raw V1 and V2-key2 were rejected before runtime compilation. Final generated
family uses seven reviewed whole V2 poses plus independently reviewed whole
V3-key2; original prompts, sources, anatomical guides and integer registration
records are retained. Independent gate verdicts are in WATER114-REVIEW.md.
