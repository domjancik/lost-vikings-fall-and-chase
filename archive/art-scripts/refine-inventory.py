from pathlib import Path
q=Path('inventory-campaign.js');s=q.read_text(encoding='utf-8-sig').replace("kind:'fire',x:1050", "kind:'fire',x:1080");q.write_text(s,encoding='utf-8')
q=Path('world-render.js');s=q.read_text(encoding='utf-8-sig').replace('[5,3,2][s.round-6]','[0,3,2][s.round-6]');q.write_text(s,encoding='utf-8')
q=Path('inventory-render.js');s=q.read_text(encoding='utf-8-sig').replace("if(s.round===6){drawItemSprite", "if(s.round===6){if(g.oven){for(let i=0;i<4;i++){const yy=475-((t*35+i*17)%60);box('#ead1a0',990+(i%2)*12,yy,4,4);}box('#252020',958,486,84,8);box('#ffc679',960,488,80*Math.min(g.cook/3,1),4);}drawItemSprite")
s=s.replace("if(!g.motor){ctx.strokeStyle", "if(!g.motor){text('SWINGING GLASS · DANGER',870,285,'#ffb48b',10);ctx.strokeStyle");q.write_text(s,encoding='utf-8')
