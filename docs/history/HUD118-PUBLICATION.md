# Touch HUD118 publication

Final URL:https://united-marsh-6ppd.here.now/?campaign=cycle&release=hud118b
Published2026-10-15. Hosting version:01M4ZCZ0SXTT4QENGTWB8D432H.
Implementation commits:101ec07 and6a693f4.

-550/550 tests pass. Source/production browser smoke passes all3campaigns and
28previews, movement, selection, inventory, zoom, pause, restart and mobile.
-Build428files/publication429files. Release byte checks and publishing
 visual-gate preflight pass. No new character/environment sprite assets.
-Live game.js,controls.js,style.css and emitted release manifest match the
 tested build; normalized HTML matches and references the finalhud118b module.
 Evidence:assets/hud118/live-hashes.json.
-Live coarse-touch tests pass fourth action use, one use while held, active-hero
 four-slot cycling, independent per-hero slots and unchanged keyboard hero keys.
-A real bomb pickup/use consumes the item, disables its empty slot, creates one
 bomb and leaves subsequent touch movement working.
-Cycling inventory during actual crane operation preserves CLAMP controls. The
 two crane playfield text lines are removed; mechanics remain unchanged.
-Inspected translucent grayscale-backdrop HUD at844x390,430x780,320x568 and
1440x900. All four action buttons meet44x44minimum, remain in bounds and do not
 overlap. UI portraits/icons retain color. Live screenshots/state:
 assets/hud118/live/evidence.json. All live checks report errors[].

Unrelated archived scripts, Viking55 local experiments and pixel-art-fixer
submodule changes remain untouched and unstaged.
