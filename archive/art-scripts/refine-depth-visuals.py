from pathlib import Path
p=Path('background-depth.js');s=p.read_text(encoding='utf-8-sig').replace('rect(507,55,60,94)','[[531,57],[542,57],[548,83],[566,91],[566,139],[539,151],[507,133],[507,91],[526,79]]')
s=s.replace('foliage:[rect(174,17,183,208),rect(574,81,66,143)]','foliage:[rect(176,18,91,84),rect(251,77,105,74),rect(574,83,67,65)],restoreFoliage:[rect(214,70,12,155),rect(294,110,8,112),rect(322,101,8,122),rect(608,117,7,107)]')
s=s.replace('restore:[rect(565,0,86,35),rect(570,122,71,69)]', 'gold:[rect(565,123,78,70)],restore:[rect(565,0,86,35)]')
p.write_text(s,encoding='utf-8')
p=Path('parallax-render.js');s=p.read_text(encoding='utf-8-sig').replace('function separateInterior(', 'export function separateInterior(')
s=s.replace('(r+g+b)/3<65&&g>=b*.8&&r<90', '(r+g+b)/3<105&&r<110')
s=s.replace('ctx.putImageData(pixels,0,0);',"for(const points of [...(scene.restoreFoliage||[]),...(scene.gold||[])]){const [[x,y],[right],,[,bottom]]=points;for(let yy=y;yy<bottom;yy++)for(let xx=x;xx<right;xx++){const n=(yy*720+xx)*4,[r,g,b]=original.data.slice(n,n+3);const keep=(scene.restoreFoliage||[]).includes(points)?(r+g+b)/3<105&&r<110:r>g*.9&&g>b*1.15&&g>55;if(keep)pixels.data.set(original.data.subarray(n,n+4),n);}}\n ctx.putImageData(pixels,0,0);")
p.write_text(s,encoding='utf-8')
