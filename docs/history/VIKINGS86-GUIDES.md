# Viking86 anatomy guides

These are motion/anatomy constraints for the final imagegen material pass, not
approved production character art. No native86 assets are integrated or deployed.
The direct native rendering is retained to show silhouette and occlusion; its
material style is not the requested final imagegen result.

## Display and source contract

Each pose is authored directly on a64×64 native cell. One native pixel spans two
world units. Root32,40 and sole-exclusive62 are retained. Neutral whole visible
heights, including horns, are36/38/36 native pixels for Erik/Baleog/Olaf, yielding
72/76/72world units. Do not separately stretch each frame or downsample a painted
character to achieve this budget.

`tools/native-vikings86.py` preserves85's eight walk-phase families, original
distance cadence, limb IK lengths and planted contact heights. Whole chain
translations separate near/far shoulders and hips in three-quarter view. Native
rendered vertices use the same fixed geometry projection as85; no bitmap is
reduced. Rear ladder heads are explicitly authored without chin beard painting.

`assets/vikings86-native/anatomy-measurements.json` records dimensions, shoulder
positions and all eight foot-contact geometries. Across130poses, nominal limb
lengths agree with joint chains within4.3e−14 native units before grid rounding.
This proves numerical constraints only; it does not establish good visual motion.

## Guide evidence

- `contactboard-native.png` and `contactboard-4x.png`: neutral, opposing walk
  contact/passing families, look directions and rear ladder for all three.
- `anatomy-contactboard-native.png` and `anatomy-contactboard-4x.png`: matching
  projected joint overlay, gold near chain and blue far chain.
- `olaf-idle-guide-native.png` and `olaf-idle-guide-8x.png`: isolated64×64 source
  and exact integer nearest enlargement for imagegen reference.
- `olaf-idle-joints-native.png` and `olaf-idle-joints-8x.png`: isolated same-pose
  overlay including the hand behind the shield face.
- `olaf-idle-anatomy-unoccluded-native.png` and its8x enlargement: shield omitted
  solely to show the underlying connected arm/belly; not a valid shield pose.
- `olaf-idle-guide-pad128-native.png`, its8x enlargement and JSON: accepted64px
  guide copied unchanged at32,64 inside128×128 transparent canvas; root64,104,
  sole-exclusive126 and body36px. Padding adds no detail and changes no pose.
- Full frame keys, full64px atlases and looping walk/idle/climb/shield GIFs retain
  motion and occlusion constraints. Their rendering remains guide-only.

## Independent verdicts

First/second procedural material proposals were rejected for narrow/profile
chests and arms covering the chest front, flat helmets and insufficient material
character. They must not be presented as final art acceptance.

The third guide moves complete arm chains to chest edges, retains broad tapered
chest/waist with an oblique belt, and exposes Olaf's fleshy upper arm.
Independent reviewer `skin76_visual_gate` accepted the isolated Olaf idle
**anatomy-guide scope**: broad adult gut/chest, stout connected limbs, planted
soles, wrist behind the round shield face and low brow covering the eyes.
Independent full130pose **anatomy-guide scope: ACCEPTED** after chest-edge
revision. Reviewer inspected eight contact families, connected lengths/depth,
rear heads/actions, Olaf raised/floating underside grips and alternating raised
ladder support. This does not approve simplified procedural material as final.

Five focused geometry tests pass, including unchanged foot-contact y coordinates
against every corresponding85pose. These checks cannot approve visual art.

**Final imagegen native-density/source gate: PENDING.** The high-detail86style
studies are concept references only and were rejected as production sprite
sources. They cannot be rescued by downsampling.

**Final processed/in-game gate: PENDING.** No86runtime integration yet. Require
actual1x/2x/mobile Clockwork context, mirrored movement, all eight distinct gait
families, rear climb, look poses, actions, floating, overhead grip and passenger
center-plane contacts after final material art is accepted.
