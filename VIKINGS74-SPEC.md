# Guided character animation correction

Do not repeat the70pipeline: copying a fixed torso over independently drawn
legs leaves duplicate arms, rigid shield holds and a horizontal splice seam.
Restricting idle to belly-color replacement is not breathing animation.

Procedural guide supplies complete anatomy, stable native64x64cells, feet62,
root32/40, adult-human opaque heights36Erik/38Baleog/36Olaf, limb paths,
near/far depth ordering, action contacts and equipment bounds. Imagegen renders
the complete guided pose at matching native detail density. Never splice body
rows from unrelated source frames. Retain source, guides and exact prompts.

Near/far legs exchange forward/backward position twice per8phasewalk. Far
limbs are shaded and painted first; exactly two arms, each continuous from one
shoulder to one hand. Contact/compression/passing/swing must be distinct.
Idle includes maximum1nativepixel shoulder/head motion, planted feet and
subtle ribcage expansion; no whole-body drift. Lookup/lookdown have authored
neck/head/eyeline poses and leave torso/feet anchored. Camera look input only
applies those poses outside ladder or interaction use.

Olaf: front grip is behind the opaque shield face; fingers cannot appear over
its center. Separate whole-body braced walk and overhead walk guides, with
shoulder/elbow response while supporting a constant-size shield. Raise/lower,
rear ladder and draft/glide/brake require full matching poses before replacing
the production set. No horizontal belt patch or seam. Alpha is binary after
one native normalization; remove dark/colored fringe connected to silhouettes,
not just detached components. Inspect raw source at native density first.

First experimental packet:8walk,4idle,2look,2rearclimb guide cells for Erik.
Do not expose this incomplete set as a finished skin. Expand to all actions
and all heroes only after source/guide comparison establishes the method.
Reviewer must explicitly check every defect listed above, complete mirrored
cycles,1x/2x/mobile real gameplay, and record separate source/runtime verdicts.
