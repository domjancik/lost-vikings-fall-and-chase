import fs from 'node:fs';
const folder='output/release-vikings90',candidate=JSON.parse(fs.readFileSync(folder+'/candidate.json'));
const gates=JSON.parse(fs.readFileSync(folder+'/dist/assets/vikings90/visual-gates.json'));
if(candidate.draft||!candidate.publishAllowed||!gates.publicationAllowed)throw Error('Incomplete native-art review: publication remains blocked');
for(const hero of ['erik','baleog','olaf'])for(const gate of ['sourceGate','processedRuntimeGate'])
 if(!gates[hero][gate].startsWith('accepted'))throw Error(`${hero} ${gate} must have an independent accepted verdict`);
const publisher=fs.readFileSync('output/release-warden91/publish-update.mjs','utf8')
 .replace('const files=[','const files=['+candidate.files.map(f=>JSON.stringify(f)).join(',')+',');
const guard="const gates=JSON.parse(await fs.readFile('dist/assets/vikings90/visual-gates.json','utf8'));if(!gates.publicationAllowed)throw Error('Viking visual review is incomplete');\n";
fs.writeFileSync(folder+'/publish-update.mjs',publisher.replace('const files=[',guard+'const files=['));
console.log('Prepared selective Viking90 publisher over verified Warden91; no network changes made.');
