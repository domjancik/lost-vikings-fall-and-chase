from pathlib import Path
for r,x,y in [(1,'move(2,230)','move(2,250)'),(2,'move(2,650);await faceLeft();await press(\'x\')','move(2,720);await faceLeft();await press(\'Space\');await press(\'d\')'),(5,'move(2,780);await faceRight();await press(\'x\')','move(2,850);await faceRight();await press(\'Space\');await press(\'d\')')]:
 s=Path(f'output/playwright/creative/round-{r}.js').read_text(encoding='utf-8').replace(x,y)
 Path(f'browser-collision22-round-{r}.js').write_text(s,encoding='utf-8')
p=Path('index.html');s=p.read_text(encoding='utf-8').replace('at SHIELD HERE','in the arcade firing lane');p.write_text(s,encoding='utf-8')
