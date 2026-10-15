# Touch HUD118

Requested behavior:
- A fourth thumb action uses the active Viking's currently selected inventory
 item through the existing single-press item input(Q). Holding it must not repeat.
 Show slot number, native existing item icon and name; empty slots are visibly
 disabled. Keep all four actions in the existing2x2 footprint.
- Clicking/tapping the active Viking advances all four bag slots and wraps.
 Selecting another Viking preserves their slot. Keyboard hero-selection keys
 retain their previous behavior and do not cycle inventory.
- Make HUD panel fills translucent, with grayscale backdrop filtering only on
 the scene behind individual panels/buttons. HUD text, portraits, inventory
 icons, highlights and health retain their colors; no blur is added.
- Remove the two persistent crane world-text lines. Preserve the native
 action-button labels and all crane physics/puzzle behavior.

Validation:
- Three focused controls regressions passed, including one use while held.
- Real coarse-touch Chrome uses magnetic shoes from the fourth action, toggles
 them off/on, holds the action without repetition, cycles all slots, switches
 Vikings without losing slots, and verifies number-key behavior.
- Screenshots inspected at844x390,430x780,320x568 and1440x900. All four action
 hitboxes are at least44x44, remain in bounds and do not overlap. Computed
 backdrop filtering is grayscale(1); existing game pixels remain crisp.
- Evidence:assets/hud118/local/evidence.json and neighboring PNGs. No character
 or environment raster assets, pixel density or puzzle mechanics changed.
- Additional real-touch consumable check: collect a bomb from the arcade dispenser,
 use it through ITEM, verify the slot becomes empty/disabled and one live bomb
 exists, then move with the touch pad successfully. No stale held input.
- Full suite550/550 passes; source/production smoke covers3campaigns/28previews
 plus movement, selection, inventory, zoom, pause, restart and mobile.
- Crane-context regression: a repeated active-Viking tap originally re-ran hero
 selection and replaced CLAMP with normal ability labels. HUD re-selection now
 only changes the slot and preserves the existing control mode. Verified through
 a normal-input ladder/bashing approach to the panel and actual touch selection.
- Item-button icons retry until their existing atlas is ready rather than caching
 an empty drawing on a slower connection.
