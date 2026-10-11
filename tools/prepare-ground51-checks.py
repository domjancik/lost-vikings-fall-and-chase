from pathlib import Path
source=Path('browser-campaign46-0.js').read_text(encoding='utf-8')
source=source.replace('campaignCapture','ground51Capture').replace('campaign46-1-','ground51-first-').replace('arc=46','ground=51')
source=source.replace('await move(runner,latch);await use(runner);await tick({},.3);','await move(runner,latch-50);await capture("ratchet-before");await use(runner);await capture("ratchet-moving");await tick({},.6);await capture("ratchet-after");')
source=source.replace("await move(0,1500);await tick({},1);await item(0,'serviceKey');await tick({},1.3);", "await move(0,1450);await tick({},1);await capture('socket-before');await item(0,'serviceKey');await capture('socket-moving');await tick({},1.3);await capture('socket-after');")
Path('browser-ground51-first.js').write_text(source,encoding='utf-8')
for chapter in [5,7]:
 source=Path(f'browser-campaign46-{chapter}.js').read_text(encoding='utf-8')
 source=source.replace('campaignCapture','ground51Capture').replace(f'campaign46-{chapter+1}-',f'ground51-{chapter+1}-').replace('arc=46','ground=51')
 Path(f'browser-ground51-{chapter}.js').write_text(source,encoding='utf-8')
source=Path('browser-scale50.js').read_text(encoding='utf-8').replace('scale=50','ground=51').replace('scale50-','ground51-')
Path('browser-ground51.js').write_text(source,encoding='utf-8')
