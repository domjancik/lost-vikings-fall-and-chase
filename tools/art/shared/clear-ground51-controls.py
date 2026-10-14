from pathlib import Path
for path in list(Path('.').glob('browser-ground51-matrix-*.js')) + [Path('archive/browser/browser-ground51-5.js'), Path('archive/browser/browser-ground51-7.js')]:
    data = path.read_text(encoding='utf-8').replace('l.x+30+n*40', 'l.x+58+n*28')
    data = data.replace('sprite51MatrixCapture', 'sprite51ClearMatrixCapture')
    if path.name in ('archive/browser/browser-ground51-5.js', 'archive/browser/browser-ground51-7.js'):
        data = data.replace('sprite51Capture', 'sprite51FootingCapture')
    path.write_text(data, encoding='utf-8')
