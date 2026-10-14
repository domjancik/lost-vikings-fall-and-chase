import fs from 'node:fs';
import {prepareScenePixels} from '../scene-resolution.js';
for(const n of [0,5,6]){
 const source=fs.readFileSync(`output/scene67-source-${n}.rgba`);
 for(const [label,contrastLimit] of [['before',Infinity],['after',48]]){
  const start=performance.now(),out=prepareScenePixels(source,768,512,375,250,{contrastLimit});
  fs.writeFileSync(`output/scene67-${label}-${n}.rgba`,out);
  console.log(n,label,Math.round(performance.now()-start)+'ms');
 }
}
