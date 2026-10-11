# Cycle52 release verification

Implementation commit:2593a75. Independent critique: CYCLE-REVIEW.md.

- `npm test`:221 tests pass;13 focused Cycle tests pass.
- `npm run build`:static build completes.
- `browser-cycle52.js`:ordinary production keyboard controls, all three at
  exit withhealth3 each, won=true at156.841667simulation seconds. Enter continues.
- 60/120Hz simulation routes use ordinary controls without puzzle flag or
  position injections. Isolated physics tests set up their own boundary cases.
- Three passengers also complete a full high lap through ordinary world physics,
  preserving carrier support through galleries and every corner.
- Mobile landscape:actual pointer ladder climb;all seven control hit areas in
  bounds and no pairwise overlap. 1x/2x artwork inspected.
- Public portrait390×844:puzzle loads, all art ready,native1066×600scene,
  ladder controls visible,no horizontal overflow,no page errors.
- `tools/verify-cycle52-live.mjs`:15 published modules/assets exactly match local
  bytes. HTML entry points verified separately because here.now injects social
  metadata into the document.

Live:https://united-marsh-6ppd.here.now/?campaign=cycle&release=52

Local evidence:output/playwright/cycle52-{start,rider-deck,brake-before,
brake-middle,brake,damper,draft,selector,olaf-exit,clear,overview,
mobile-ladder,live-mobile}.png. Screenshots are locally retained, not packaged
as game runtime assets. Independent reviewer inspected art/source/tests; the
implementation agent performed the real browser playthroughs.
