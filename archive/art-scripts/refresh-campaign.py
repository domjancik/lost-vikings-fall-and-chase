from pathlib import Path
p=Path('browser-feel26-campaign.js');s=p.read_text(encoding='utf-8').replace('async page=>{\n','async page=>{\nawait page.setViewportSize({width:1440,height:900});await page.goto(\'https://united-marsh-6ppd.here.now/?feel=27\');await page.locator(\'#play\').click();\n',1);p.write_text(s,encoding='utf-8')
