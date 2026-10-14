import fs from 'node:fs';
import {prepareScenePixels} from '../scene-resolution.js';
const [input,sw,sh,dw,dh,output,alpha]=process.argv.slice(2);
const source=fs.readFileSync(input);
const pixels=prepareScenePixels(source,+sw,+sh,+dw,+dh,{preserveAlpha:alpha==='alpha'});
fs.writeFileSync(output,pixels);
