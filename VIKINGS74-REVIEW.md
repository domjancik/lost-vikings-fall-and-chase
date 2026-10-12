# Guided experiment review

Source gates independently REJECTED; runtime gate NOT ACCEPTED. The experiment is intentionally not connected
to production skins until all poses exist and the reviewer accepts actual
native-density source and1x/2x/mobile gameplay evidence.

First source erik-source.png and candidate erik-candidate.png: REJECTED by
implementer preflight. Walk phases0/1 and4/5 are too similar; surface detail is
finer than guide native clusters and candidate registration does not match exact
sole62positions. Look/rearclimb direction improves but cannot waive those defects.
Keep failed source/prompt; do not salvage it by torso transplant or scale fitting.

Second strict source erik-source-strict.png: REJECTED by implementer preflight.
It respects near/far limb placement better but closely reproduces the flat
schematic, loses the desired shaded material finish and does not supply a
convincing downward head/neck pose. A complete-sheet imagegen pass alone is not
a reliable pose constraint. Use geometry/occlusion as authoritative final masks
and imagegen to supply material reference; review contacts/actions frame by frame.

Front-shield paint-order correction added to hero-art.js in the separate73release; real renderer
regression reproduced body painting over shield before change, then passed after
shield painted last. Actual1x/2x/mobile contact and passenger/inset gates for that
limited change are accepted in SKINS73-REVIEW.md. This does not approve74art.

Observed70pipeline defects: fixed torso transfer gait[:48]=torso[:48] for Olaf,
fixed upper/head transfer gait[:39]=root[:39] for Erik, and idle changes limited
to41..45belly colors. These cannot establish full-body motion and can leave
anatomical splice seams. Front shield is currently drawn before body outside
climb, permitting hand/body pixels to overpaint its face. Alpha thresholding
and largest-component filtering do not remove opaque connected halos. The
original front-shield order described above was corrected separately in73.

74guide explicitly retains limb identities and draws far limb before near limb.
Imagegen must preserve those complete poses and material identity. Do not accept
nice-looking individual cells when guide motion was ignored. Check look poses
for real head/neck direction, not a moved eye pixel alone. Retain failed sources.

Prior automatic approval review failed due account usage limit; no unsafe-action
determination. Usage restored and review completed: these art rejections are
quality verdicts, not remaining quota blockers.

## Independent source verdict (2026-10-12)

Inspected erik-source.png and erik-source-strict.png directly alongside the
native procedural guide. **RAW gate: REJECTED for both candidates.** The first
uses finer mottled shading than the intended coarse36-native-pixel body and has
nearly repeated contact poses0/1 and4/5 rather than a credible complete gait.
Its attractive rear/head poses do not establish source compliance or eliminate
visible fringe. The strict source has clearer flat limb silhouettes, but largely
copies the schematic without the requested material treatment; its downward
look reads as the same forward head, not a convincing neck/head orientation.
Neither establishes all poses/actions for all three heroes. Do not rescue these
with torso transplants, frame fitting or a publication label claiming completion.

**PROCESSED/new74 gameplay gate: NOT ACCEPTED; incomplete and excluded.** This
is separate from the73selector for previously approved63/70 assets and the local
shield paint-order correction. Those changes cannot approve the new74rework or
claim to fix its listed anatomy, idle, look and complete-cycle requirements.
