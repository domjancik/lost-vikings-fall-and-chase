from pathlib import Path

for filename in ('archive/scripts/build.mjs', 'archive/scripts/publish-update.mjs'):
    path = Path(filename)
    data = path.read_text(encoding='utf-8')
    data = data.replace("'src/campaigns/story/story-visuals.js',", "'src/campaigns/story/story-visuals.js','src/render/interaction-art.js','src/render/interaction-frames.js',")
    while "'src/render/interaction-art.js','src/render/interaction-frames.js','src/render/interaction-art.js','src/render/interaction-frames.js'," in data:
        data = data.replace("'src/render/interaction-art.js','src/render/interaction-frames.js','src/render/interaction-art.js','src/render/interaction-frames.js',", "'src/render/interaction-art.js','src/render/interaction-frames.js',")
    if filename == 'archive/scripts/publish-update.mjs':
        data = data.replace("'assets/scale50/pub-far.png',", "'assets/ground51/interaction-frames.png','assets/scale50/pub-far.png',")
        while "'assets/ground51/interaction-frames.png','assets/ground51/interaction-frames.png'," in data:
            data = data.replace("'assets/ground51/interaction-frames.png','assets/ground51/interaction-frames.png',", "'assets/ground51/interaction-frames.png',")
    path.write_text(data, encoding='utf-8')

for path in Path('.').glob('browser-ground51*.js'):
    data = path.read_text(encoding='utf-8')
    data = data.replace('ground51Capture', 'sprite51Capture').replace('ground51MatrixCapture', 'sprite51MatrixCapture')
    data = data.replace('output/playwright/ground51', 'output/playwright/sprite51')
    path.write_text(data, encoding='utf-8')
