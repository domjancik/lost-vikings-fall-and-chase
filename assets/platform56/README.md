# Wider maintenance ladder

The generated source uses broad flat copper clusters on a square grid. Its
actual occupied source density corresponds to 24×64 native pixels, so it is
packed at that density instead of forcing the requested 24×40 aspect ratio.
Extract one 24×13 rung period from that first pack; render at 48×26 world units.
The ladder remains centered at x650, from y500 to y1120. Physics, entry radius
and top/bottom endpoints are unchanged. Broad rails touch both tile boundaries.

Retain `ladder-source.png`; regenerate runtime art using
`tools/prepare-platform56.py`. The matching native grid is 2 world units/pixel.

Shield: preserve the support plane at Olaf y−36. Render the fixed 28×48 shield
center on that plane, so riders stand through the middle of its deck thickness.
The raise/lower stroke interpolates continuously to that center.
Render passengers after Olaf so the shield does not hide their soles at its
upper edge. The visible foot contact must lie on the central deck plane.
