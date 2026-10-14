from pathlib import Path
q=Path('normalize-inventory.py');s=q.read_text(encoding='utf-8-sig').replace("cell=bg.crop((0,round(i*bg.height/3),bg.width,round((i+1)*bg.height/3)))","edges=[0,480,970,bg.height];cell=bg.crop((0,edges[i],bg.width,edges[i+1]))")
s=s.replace("Image.fromarray(two_stage_pack(np.array(sprites),320,320)).save(p/'assets/pixel/inventory-sprites.png')", "atlas=Image.new('RGBA',(320,320));edges=[0,315,620,915,sprites.height]\nfor n in range(16):\n row=n//4;col=n%4;cell=sprites.crop((round(col*sprites.width/4),edges[row],round((col+1)*sprites.width/4),edges[row+1]));atlas.paste(Image.fromarray(two_stage_pack(np.array(cell),80,80)),(col*80,row*80))\natlas.save(p/'assets/pixel/inventory-sprites.png')")
q.write_text(s,encoding='utf-8')
