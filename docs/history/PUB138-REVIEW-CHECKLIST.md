# Pub 138 review brief

This revision retains the accepted alehall135 native artwork. It changes scene
ordering, character prompts, practice interactions and the loft approach. Review
the final integrated level, rather than approving isolated state flags.

## Art and source continuity

- Compare `assets/alehall135/props-native.png`, `patrons-native.png` and
  `cup-native.png` against the shipped baseline; no replacement art is intended.
- Source/native-density, runtime and aesthetic verdicts: **accepted** by the
  independent reviewer; evidence and limitations are in `PUB138-REVIEW.md`.
- Gameplay captures must use `skin=imagegen90`, recording the resolved sheets,
  actual 1x/2x scale and a coarse-pointer mobile context.

## Required before / moving / completed evidence

1. **Cask and loft:** capture the final parked cask and the floor around both
   sides. Loading-berth steps must have opaque timber bodies from each physical
   tread to the floor; no transparent slivers or decorative fake stairs remain.
   Verify all six `berthTreads` render contacts against collision. Check Olaf's
   raised shield and Erik's soles on the actual support, then Erik reaching the
   loft key. The cask, shield and loft must retain adult-human scale and visible
   support contact.
2. **Practice target:** capture an undamaged face, arrow impact and Erik's dash
   impact. Fence posts and the backstop beam belong behind the target face.
   The target pivots around its ground contact and recovers continuously; no
   plank obscures where an arrow should land. Capture near the maximum lean.
3. **Baleog:** approaching inhabitants must naturally invite the bow challenge
   and explain the delivery binding's sword use. Check each prompt at ordinary
   movement speed, including approaching from the opposite direction.
4. **Ale service:** capture carried, early serving, individual landing and
   completed service while Olaf walks across the table. Cups in flight pass
   in front of bodies; each landed cup belongs behind the heroes. Leaving the
   table must not drag a serving arc or finished cup with Olaf.
5. **Defense:** capture Hakon's four-frame windup, cup launch, front-shield
   contact and an unblocked miss. The empty practice cup must remain readable
   and harmless; the windup and release must follow the authoritative defense
   state rather than unrelated idle animation. Verify retry/recovery.
6. **Story:** optional showing-off and serving activities must not become
   arbitrary completion gates. The key opens the storeroom, all three inspect
   the creation globe, Olaf approaches last and the floor gives way.

## Regression checks

- Run `tests/unit/pub138-render.test.js` for stationary table positions,
  captured serving departure and per-cup landing pass changes.
- Run the ordinary-input pub route after the altered loft geometry and new
  optional challenges; clear with all three healthy at 60/120 Hz.
- Check keyboard and coarse-pointer mobile play, final scene paint order,
  level transition, page errors and console errors.
- Independent reviewer records source, runtime and aesthetic verdicts with exact
  evidence paths; passing route flags alone do not establish visual acceptance.
