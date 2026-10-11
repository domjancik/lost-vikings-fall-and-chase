from pathlib import Path

for filename in ('build.mjs', 'publish-update.mjs'):
    path = Path(filename)
    data = path.read_text(encoding='utf-8')
    data = data.replace("'story-visuals.js',", "'story-visuals.js','interaction-art.js','interaction-frames.js',")
    while "'interaction-art.js','interaction-frames.js','interaction-art.js','interaction-frames.js'," in data:
        data = data.replace("'interaction-art.js','interaction-frames.js','interaction-art.js','interaction-frames.js',", "'interaction-art.js','interaction-frames.js',")
    if filename == 'publish-update.mjs':
        data = data.replace("'assets/scale50/pub-far.png',", "'assets/ground51/interaction-frames.png','assets/scale50/pub-far.png',")
        while "'assets/ground51/interaction-frames.png','assets/ground51/interaction-frames.png'," in data:
            data = data.replace("'assets/ground51/interaction-frames.png','assets/ground51/interaction-frames.png',", "'assets/ground51/interaction-frames.png',")
    path.write_text(data, encoding='utf-8')

for path in Path('.').glob('browser-ground51*.js'):
    data = path.read_text(encoding='utf-8')
    data = data.replace('ground51Capture', 'sprite51Capture').replace('ground51MatrixCapture', 'sprite51MatrixCapture')
    data = data.replace('output/playwright/ground51', 'output/playwright/sprite51')
    path.write_text(data, encoding='utf-8')
