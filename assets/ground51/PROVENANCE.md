# Generated interaction frames

Generated with the built-in image generation tool on 2026-10-11, then refined twice. The retained source is `source.png`, copied from generated image `exec-d16383d5-424b-4241-9b1b-ba1dbdb1ee82.png`.

The brief requested a transparent, fixed-cell 8-column by 4-row sheet of detailed brass and dark metal mechanisms matching the campaign: a retained-grip locking lever, a triangle wafer socket, a reversible lift selector, and an archive cradle receiving its parcel. Refinements corrected the final lever grip, made the archive parcel travel locally into its cradle, and removed duplicate shafts from the lift selector's continuous arc.

Each mechanism has eight actual illustrated frames. The runtime never constructs a substitute lever, panel, shaft, or socket from flat canvas shapes. Row order is lever, wafer, lift, archive. Frames have a fixed 24×32 native cell and display at 48×64 world units. This is a small mechanism atlas, not a scene background.

`tools/prepare-ground51-art.py` retains the source, uses the corrected positive-weight pixel resampler, preserves binary alpha, and registers each broad opaque base at native row 31. `registration.json` records every translation. There is no per-frame object scaling or trimming. Reversing a lift plays the same frames backwards.

Acceptance requires production-control before, intermediate, completed, and reversible-state captures. Logic state or a status label cannot substitute for a changed sprite.
