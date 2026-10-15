# Sewer pipe spray registration

The left-facing pipe was independently positioned at(908,652), placing the jet below its opening. Its retained native cell13 has a mouth center(11,26), inner vertical bounds17..36. The sprite is now registered from the jet position via sewerSprayMount: origin(918,678), mouth world(940,730), jet y716..742. Both use the native two-world-unit grid. Collision, spray range and shield/valve mechanics are unchanged.

Regression covers current and repositioned jets, opening containment and native alignment. Other source changes invalidate import caches only. Route harness accepts an evidence destination and spray-only capture focus.

Verification: 635 tests passed; build and release check match471 files; publish preflight472 files. Ordinary browser route completed in60.35s with all three at3HP, no page errors, continued into stable water level4. Evidence assets/sewer128/route includes1×/2×, portrait and landscape plus review-skin receipts.

Independent sewer128_review critique: source gate accepted (existing source/detail density unchanged); runtime gate accepted (stream emerges within recessed mouth at1×/2× and mobile, bronze rim retained, no floating contact); aesthetic gate accepted (translation-only correction preserves existing pixel-art volume/materials). Latest imagegen90 review skin verified as vikings90 Erik/Baleog and olaf111.
