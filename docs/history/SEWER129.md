# Sewer wall mounting and solid geometry

Rear pipes and sealed grilles previously translated camera×.08/.025 over fixed masonry. They now use fixed world mounting points; camera and zoom cannot shift a fixture relative to its wall. Diagnostic rear-fixture contacts and browser captures assert these positions throughout the route.

Movement and lighting now share full physical ceiling volumes, solid service decks/floors, a continuous lifting landing and the actual raised/closed shutter positions. Rear decorative masonry remains outside collision and walk-plane shadow geometry. Service slab side/underside contacts now stop the full72-world-unit body. Their top landings use the same volumes.

Real collision exposed insufficient clearance: the inspection leaf now lifts200 instead of170, leaving8 units above a service-platform rider's head. The linked landing lifts100 instead of60, leaving8 units below for ground-standing heads and8 above for passengers under the ceiling. Native artwork and cable motion use the same travel constants. Grounded passengers move with the landing continuously.

Native iron faces receive real adjacent-air lamp illumination after the shadow mask, without light transmission through opaque volumes. The lifting deck's retained native cap/front likewise receives local surface lighting. No generated assets were replaced or rescaled.

Eight structure regressions cover both camera axes, side/underside contacts for all heroes, full ceiling shadow volume, physical raised leaves, headroom, landing passage and passenger carry, lamp-only shutter face light and the continuous native landing face. All643 tests pass; build and release check match471 files.

Final browser evidence is assets/sewer129/final-route and final-touch-route. Desktop normal-control route completed63.1167s with full health, continuation4 and no page errors; mobile completed63.2333s, also full health, continuation4 and no page errors. Independent source/runtime/aesthetic gates accepted after inspection of final leaf-clearance, outlet-moving and outlet-open at1×/2×/portrait/landscape. Native iron relief and textured cap/front remain visible, with no detached shadows or wall-relative sliding; source assets and native scale unchanged. Reviewer independently reran all eight structure regressions. No blocking findings. Earlier captures rejected for framing/black surface visibility are preserved under ignored output/sewer129/diagnostic-* and do not establish approval. Final paths are assets/sewer129/final-route and final-touch-route. The route deliberately positions Erik under the leaf with actual wide-beam lamp controls and on the landing throughout raising, then dismounts and completes using ordinary controls. Latest imagegen90 review skin required by capture helper.

Visual review standard now explicitly requires common fixture/wall transforms and shared physical shadow/collision volumes with all-face contact checks and actual raised clearances.

Published version01M50VDFXBJS8S9KW5JVSW42TJ. Live HTML and15 release files match the tested build. Implementation commit82ad72b.
