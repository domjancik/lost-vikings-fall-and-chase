from pathlib import Path
p=Path('engine.test.js');s=p.read_text(encoding='utf-8');s=s.replace("test('the arcade armor only opens when Olaf grounds it with his shield',()=>{const s=createState();", "test('the arcade armor requires the front shield rather than overhead',()=>{const s=createState();s.heroes[2].shieldUp=true;")
s=s.replace('s.heroes[2].x=1140;s.heroes[2].y=566;s.heroes[2].shield=true;', 's.heroes[2].x=1140;s.heroes[2].y=566;s.heroes[2].shield=true;s.heroes[2].shieldUp=false;');p.write_text(s,encoding='utf-8')
p=Path('campaign.test.js');s=p.read_text(encoding='utf-8').replace(' }else{\n  move(1,890);', ' }else{\n  s.active=2;tick({jump:true}); // Keep the shield overhead while pressure is prepared.\n  move(1,890);');p.write_text(s,encoding='utf-8')
for file in ['browser-collision22-round-5.js','output/playwright/creative/round-5.js']:
 p=Path(file);s=p.read_text(encoding='utf-8').replace('await move(1,890);','await select(2);await press(\'Space\');await move(1,890);');p.write_text(s,encoding='utf-8')
