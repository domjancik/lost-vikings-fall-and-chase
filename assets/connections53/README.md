# Reusable connection atlas

Generated with the built-in imagegen tool. Unmodified source:source.png.
Final runtime sheet:connections.png,128×64,8×4cells,16native pixels per cell.
At32world units per tile each native pixel occupies the shared2-unit grid.
Prompt:PROMPT.md. Rebuild:tools/prepare-connections53.py. Port metadata:ports.json.

| Cells | Material / purpose |
| --- | --- |
| 0..7 | Copper pipes, bends, tees, cross, terminal, valve |
| 8..15 | Braided cables, bends, tees, cross, horizontal/vertical mounts |
| 16..19 | Horizontal cable sway; fixed attachment strips |
| 20..23 | Vertical cable sway; fixed attachment strips |
| 24..29 | Structural rails and junctions |
| 30..31 | Retracted/extended tensioner |

The packer registers port collars copied from the authored straight connectors;
all advertised edge midpoint pixels are opaque. Animated frames share exactly
the same endpoint strips. No per-frame cell resizes or runtime fractional
positioning. Rigid materials stay stationary. Rendering/layout modules are
independent of campaign physics and accept authored orthogonal anchor routes.

Local assembled preview:connection-kit-preview.html. Full source and runtime
art are retained for adding other materials and larger variants later.
