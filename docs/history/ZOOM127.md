# Three-step zoom

Zoom button and V cycle 1× → 1.5× → 2× → 1×. All three settings persist. Default remains 2×. The button announces current and next magnification. Help text lists the three views.

Fractional zoom rounds the viewport to integer canvas dimensions, avoiding continuous backing-store resets. Simulation and native artwork are unchanged. Updated transition/route screenshot helpers accommodate the three-state cycle. Other module changes only invalidate import caches.

Validation: 634 unit/build tests passed; build and release hashes verified (471 files). Desktop and coarse-touch browser checks passed button taps, keyboard cycling, reload persistence, movement, and zero canvas dimension resets at 1.5×, with no page errors. Screenshot evidence uses the latest review skin.

Visual check: touch 1.5× framing preserves full-screen gameplay, character picker and bottom controls. No replacement art.
