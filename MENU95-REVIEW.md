# Campaign picker release

The title and in-game picker have three campaign choices: The Return Address,
Machine Rooms and Arcade Collection. A campaign choice changes only the gallery
underneath. Clicking a numbered scene picture launches that exact level. Removed
the separate title buttons for individual machine levels and the duplicate text
level list. Gameplay HUD and touch controls stay hidden on the title screen.

Thumbnails render dynamically at native game pixel density from isolated initial
states through scene-render95.js, which is also the live game's scene renderer.
They remain static once assets load and are cached for the page session. Framing
is bounded and snapped, with wider shots for Clockwork and the complete Warden.
This is scene capture, not generated or replacement game sprite artwork.

Root UI review: accepted desktop1440x900, portrait390x844 and landscape844x390.
Campaign labels and numbered level titles remain readable; galleries scroll
vertically without horizontal overflow. No hints, puzzle solutions or HUD overlays
are baked into the pictures. Reviewed screenshots are retained in assets/menu95.

Verification: 397 root tests pass. Browser check confirms25distinct scene pictures,
all25correct campaign/level launches with a healthy crew, title browsing leaves
game state unchanged, in-game browsing preserves puzzle/hero/time state, Escape
preserves prior pause, and native touch plus Enter activation work. Browser errors
empty. A meaningful preview-frame test was observed failing before implementation
and passing afterward; complete boss framing was likewise checked red/green.

Release is frozen from verified Depth94. Only menu modules, shared scene extraction,
game UI wiring, HTML and CSS are overlaid. All other JavaScript matches the previous
publication except cache query strings; unrelated working-tree changes are excluded.

Live publication and verification: pending.
