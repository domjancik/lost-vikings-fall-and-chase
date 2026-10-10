import fs from 'node:fs';
let c=fs.readFileSync('campaign.js','utf8').replace("if(g.mirrorTime>1.2&&!g.mirror){g.mirror=true;feedback(s,'Ghost reflected into its own eye. Baleog can now cut the vines.');}","");
c=c.replace("if(p.kind==='fire'&&", "if(p.kind==='reflected-ghost'&&p.x<570&&px>=570){p.dead=true;if(!g.mirror){g.mirror=true;feedback(s,'Ghost reflected into its own eye. Baleog can now cut the vines.');}}\n  if(p.kind==='fire'&&");
fs.writeFileSync('campaign.js',c);let t=fs.readFileSync('campaign.test.js','utf8').replace("tick({},100);assert.ok(g.mirror)","waitFor(()=>g.mirror,'reflected eye');assert.ok(g.mirror)");fs.writeFileSync('campaign.test.js',t);
