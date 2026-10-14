from pathlib import Path

for chapter, label in ((5, 'canopy-reveal'), (7, 'lift-travel')):
    path = Path(f'browser-ground51-{chapter}.js')
    data = path.read_text(encoding='utf-8')
    marker = f"await page.screenshot({{path:'output/playwright/sprite51-{chapter+1}-'+label+'.png'}});"
    extra = f"""if(label==='{label}'){{
        await page.locator('#pause').click();
        const zoom=await page.locator('#zoom').innerText();
        if(zoom!=='1×')await page.locator('#zoom').click();
        await page.setViewportSize({{width:1440,height:1440}});
        await page.waitForTimeout(100);
        await page.screenshot({{path:'output/playwright/sprite51-{chapter+1}-full-footings.png'}});
        await page.setViewportSize({{width:1440,height:900}});
        if(zoom!=='1×')await page.locator('#zoom').click();
        await page.locator('#pause').click();
    }}"""
    assert marker in data
    data = data.replace(marker, marker + extra)
    data = data.replace('sprite51Capture', 'sprite51FootingCapture')
    path.write_text(data, encoding='utf-8')
