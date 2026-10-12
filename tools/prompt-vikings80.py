"""Retain exact full-atlas material-pass prompts, including every authored cell."""
from pathlib import Path
import json

root = Path('assets/vikings80')
costumes = {
    'erik': 'Lean agile Erik: rusty red tunic, slate blue trousers, long-ish red beard, small steel helmet with two curved horns. Athletic adult silhouette.',
    'baleog': 'Muscular, taller Baleog: broad armored shoulders, teal and steel vest, long-ish blond beard, steel helmet with two curved horns. Sword and bow stay exactly at the guide hand contacts.',
    'olaf': 'Olaf the Stout from the FIRST 1992/1993 Lost Vikings design: substantially chubby, large rounded belly, broad curved back, stout neck, thick arms and legs, green vest/tunic, long-ish golden blond beard, steel helmet with two curved horns. Keep the large belly visibly broad beside his shield. Round wooden shield with steel rim and central boss is carried above floor; never shrink his belly into an athletic waist.'
}
for hero, costume in costumes.items():
    meta = json.loads((root/(hero+'-guide.json')).read_text())
    from PIL import Image
    dimensions = Image.open(root/(hero+'-guide-native.png')).size
    order = '\n'.join(f"cell {f['cell']} (row {f['cell']//8}, column {f['cell']%8}): {f['action']} phase {f['phase']}" for f in meta['frames'])
    prompt = f'''Use case: sketch-to-render. Asset type: native-density full game animation sprite atlas for {hero}.
Input is an exact native procedural pose and occlusion authority, enlarged 2x, not a rough composition suggestion. Apply a coherent Viking costume/material pass to EVERY occupied cell. Preserve every cell location and action, joint/hand/foot endpoints, adult body silhouette, root (32,40) and planted foot exclusive sole62. Native cells are64x64; atlas is{dimensions[0]}x{dimensions[1]} native pixels,8columns. Body height is{meta['neutralOpaqueBodyHeight']} native pixels, representing{meta['neutralOpaqueBodyHeight']*2}world units. Never fit each character to its frame. Empty trailing cells stay fully transparent.
{costume}
Style: first-generation SNES pixel sprite craftsmanship at EXACT native density, 16-color indexed palette appearance, chunky deliberate clusters and hard stair-step outlines. Only three flat tones for each material (shadow, base, highlight), with no gradients or fine texture. Face is a few readable native pixels; no eyelashes, strands, mail pattern, wood grain, speckles or elaborate reflections. Each logical pixel is one whole native grid square. An enlarged output must show uniform squares, never smaller edge pixels. Do not produce a detailed painting intended for later reduction. Use broad light/shadow clusters rather than fine shaded rendering. Palette is warm skin, beard, costume colors, cool dark outline and limited silver/wood accents.
Add horns3-4native pixels and beard5-6native pixels within spare cell space, WITHOUT enlarging the head, shrinking body height, shortening legs or changing the authored action. Exactly two arms, two hands, two legs, two feet. Preserve near/far depth and leg identities as they exchange in the eight-phase walk. Rear climb faces the ladder and alternates hands/feet. Head/neck look poses must point up/down. Never invent duplicate limbs. Equipment occludes the gripping hand; wrists still meet the grip. Do not copy a static torso over different legs.
For Olaf, round shield face diameter24 native pixels remains invariant. Held shield follows body-driven bob and stays clear of floor. Overhead it projects as the guide's24x6 edge-on disc centered on rider plane22; this is the same round shield, not a second resized plate. Preserve transitions, floating postures and the one supporting hand/opposite climbing hand. Do not restore a rectangular shield.
Transparent RGBA background, binary clean edges, no shadow, no floor, no backdrop or checkerboard, no lettering, no labels, no cell borders, no extra props. Render the supplied atlas faithfully rather than rearranging it. Retain distinct authored poses; do not fill with standing duplicates.
Authored occupied cell order (zero-based):
{order}
'''
    (root/(hero+'-imagegen-prompt.txt')).write_text(prompt, encoding='utf-8')
    print(hero, dimensions, len(meta['frames']), 'exact prompt retained')
