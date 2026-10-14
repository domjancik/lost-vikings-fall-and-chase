import fs from 'node:fs';
const file='browser-ground51-5.js';
let data=fs.readFileSync(file,'utf8');
data=data.replaceAll('sprite51LowerFootingCapture','sprite51SettledFootingCapture');
data=data.replace("select(2);await tick({jump:true});await move(2,2470)", "select(2);await tick({},.15);await tick({jump:true},.15);if(!read().heroes[2].shieldUp)await tick({jump:true},.15);if(!read().heroes[2].shieldUp)throw Error('Overhead control not applied');await move(2,2470)");
fs.writeFileSync(file,data);
