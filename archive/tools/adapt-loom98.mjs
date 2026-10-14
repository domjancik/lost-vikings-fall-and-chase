import fs from 'node:fs';
let render=fs.readFileSync('loom-render96.js','utf8').replace('far,middle,terrain,ladder,bobbin,cloth,parts.image,portal.image','far,middle,terrain,ladder,bobbin,cloth,guideImage,parts.image,portal.image');fs.writeFileSync('loom-render96.js',render);
fs.writeFileSync('tools/browser-loom98.mjs',fs.readFileSync('tools/browser-loom96.mjs','utf8').replaceAll('LOOM96_LIVE','LOOM98_LIVE').replaceAll('release-loom96','release-loom98').replaceAll('output/loom96','output/loom98').replaceAll('loom96-','loom98-').replace('release=loom96','release=loom98'));
for(const n of ['warden97','loom98'])fs.writeFileSync('tools/verify-'+n+'-live.mjs',fs.readFileSync('tools/verify-loom96-live.mjs','utf8').replaceAll('loom96',n));
