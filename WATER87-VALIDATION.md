# Water87 validation

The release is built over the frozen native85 distribution, with only reviewed
water modules and generated native87 machinery overlaid. Unrelated working-tree
changes are excluded. Original sources, prompts and rejected attempts are retained.

## Verification

- Root JavaScript suite:364 passed, zero failures.
- Generated art alpha/registration/contact suite:5 passed.
- Normal simulated routes at60/120Hz finish with3/3/3 health.
- Real Chrome keyboard route:won,3/3/3 health,112.475 simulated seconds,
  no browser or render errors. Enter continues after completion.
- Captures include desktop1x/2x and mobile, closed/intermediate/open valve and
  gate, closed/cut chain, half/complete crank, water descent/first docking/full
  drainage, submerged ladder release and gradual Olaf ascent, all three exits.

The ordinary-control browser evidence is recorded in output/water87-route.json
and output/playwright/water87-*.png. Geometry tests check the actual generated
deck, beam, air pocket, carrier bounds and final grounded ports. The hose test
includes the intermediate water height that previously caused a short-leg crash.

Independent visual verdicts and inspected captures are recorded in
WATER87-REVIEW.md. Automated passing alone does not waive those gates.

Swimming-specific Viking frames remain deferred pending character art direction.

## Published verification

Release87 is live at united-marsh-6ppd.here.now. All16 checked deployed HTML,
runtime, registration and generated art files match the reviewed isolated build
by SHA256 (excluding only host-injected social metadata). The publication builder
now asserts every water dependency is in its upload manifest, including frozen
publishers using double-quoted filenames.

The complete ordinary-keyboard Chrome route against the public URL also passed:
won=true,3/3/3 health,112.250 simulated seconds, errors=[]. Enter continuation
and desktop/mobile captures were repeated live. Evidence is retained in
output/water87-live-route.json. Commits5449c99 and3491a2c contain the correction
and manifest repair; unrelated local changes were preserved.
