from pathlib import Path
p=Path('background-depth.test.js');s=p.read_text(encoding='utf-8-sig').replace('assert.equal(layer[key]%2,0)','assert.equal(Math.abs(layer[key]%2),0)').replace('{x:920,y:150},{width,height:395}', '{x:width>1440?0:920,y:150},{width,height:395}');p.write_text(s,encoding='utf-8')
p=Path('background-depth.js');s=p.read_text(encoding='utf-8-sig').replace("restore:[rect(33,124,217,36),rect(0,90,277,37)", "restore:[rect(0,91,293,20),rect(0,116,293,5)")
s=s.replace("const arch=", "const oval=(x,y,rx,ry)=>Array.from({length:24},(_,i)=>[x+Math.cos(i*Math.PI/12)*rx,y+Math.sin(i*Math.PI/12)*ry]);\nconst arch=")
s=s.replace('rect(166,52,107,35)','rect(610,174,41,24)')
s=s.replace('rect(234,0,238,70),rect(137,0,81,86),rect(504,0,84,86)', 'oval(353,30,113,35),oval(177,59,32,24),oval(546,60,33,23)')
s=s.replace('rect(240,77,5,120)]}', 'rect(240,77,5,120),...[[75,140,11],[97,146,9],[122,148,12],[146,150,13],[178,151,13],[213,147,11],[241,145,10]].map(([x,y,r])=>oval(x,y,r,r+2))]}')
s=s.replace('rect(131,0,518,224)],restore:', 'rect(131,0,518,224)],foliage:[rect(174,17,183,208),rect(574,81,66,143)],restore:')
p.write_text(s,encoding='utf-8')
