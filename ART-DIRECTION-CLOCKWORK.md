# Clockwork character and material direction

User direction: Inside the Clockwork is the visual benchmark for other game
elements. The Warden concept supplies Viking personality and weight. Its fine
detail is not permission to violate the native sprite-resolution contract.

## Preserve the accepted motion

Native85's continuous eight-family gait, distance-driven cadence, limb identities,
IK, planted contacts, rear ladder poses and equipment anchors are the baseline.
This pass changes visual anatomy and material authorship rather than slowing
the simulation or hiding movement behind fewer frames. Keep existing selectable
skins and the72/76/72 world-unit standing budgets. Native64×64 pose cells use
two world units per native pixel, root32,40 and sole-exclusive62.

## Bring back body volume

Walking and neutral actors face along the platform in a three-quarter view:
the player sees a broad chest/front plane, near shoulder and a receding far
shoulder/hip. Heads, belt, boots and equipment share that depth. Moving limbs
keep their identity as they overlap. Widening only a flat torso rectangle or
putting highlights on a profile guide does not establish convincing volume.
Rear ladder poses still face the ladder; do not turn them into front portraits.

Erik is a compact athletic adult with eager forward lean, long wind-swept red
beard and springy knees. Baleog has broad armored shoulders, a confident chest
and deliberate veteran weight. Olaf has a genuinely broad round belly, ample
chest, heavy shoulders and patient protector stance; he must remain much
chubbier than the other two at the same adult standing height. Helmets have
horns, coherent domed volume and brow shadow; Olaf's helmet covers his eyes.

## Shared material language

Use the curved steel/brass, warm wood/leather, deep brown recesses and restrained
cool reflections visible in assets/clockwork69/machine.png, parts.png and dock.png.
The Warden concept's Viking stances/body masses are secondary references.
Connected native shadow/highlight clusters should turn curved surfaces and
separate depth planes. No flat vector slabs, uniformly pale armor, noisy
single-pixel decoration, opaque halos or high-resolution-painted downsampling.
Beards contribute silhouette/personality rather than generic vertical strips.

Olaf retains one physical24-native-pixel round shield. Foreshortening and tilt
may change its projected outline; they do not change its diameter. The gripping
hand is behind the face, supporting palms meet the underside overhead, and the
raised middle walking plane stays world-36. New geometry metadata must derive
from actual authoring, not from a guessed post-render rectangle.

## Independent review

Record anatomy/guide evidence before material rendering. Then separately review
raw native-density source and actual processed/runtime1x/2x/mobile evidence.
Compare85 and86 at the same apparent size beside real Clockwork machinery.
Reject clean animation if actors still look diagrammatic, too thin, generic or
from a different world. Rich enlargement alone is insufficient: check native
gameplay readability,8distinct leg phases, torso/head registration, look up/down,
mirrored equipment, rear ladders, attacks, floating and Olaf passenger contacts.
Recheck shield collision and actor-platform contact after anatomy changes.

## Current scope

First finish the Viking visual pass. Do not build the Warden encounter until
this character direction has earned its separate source/runtime approvals.
Apply this style brief to future props and new levels; replacing every existing
environment is not part of this character pass. The saved imagegen86 study is
concept evidence until its native detail density is independently accepted.
