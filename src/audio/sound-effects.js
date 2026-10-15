// Layered synthesized arcade Foley: noise transients, pitched bodies, and resonant tails.
const tone=(frequency,end,duration,volume=.14,type='triangle',delay=0)=>({frequency,end,duration,volume,type,delay});
const noise=(frequency,end,duration,volume=.16,delay=0)=>tone(frequency,end,duration,volume,'noise',delay);
const metal=(f=720)=>[noise(2800,500,.045,.13),tone(f,f*.97,.34,.1,'sine'),tone(f*2.71,f*2.68,.2,.04,'sine')];
const chime=(f=440)=>[tone(f,f,.18,.13,'sine'),tone(f*1.25,f*1.25,.2,.1,'sine',.09),tone(f*1.5,f*1.5,.32,.1,'sine',.18)];
export const effects={
 // Sewer voices retain a low wet body and restrained, irregular metal transients.
 sewerWood:[noise(3400,320,.14,.27),tone(145,56,.32,.13,'triangle'),noise(1400,110,.5,.16,.06),noise(2500,170,.16,.12,.19)],
 sewerLand:[noise(3300,300,.12,.2),tone(105,43,.22,.22),noise(1800,160,.45,.13,.03)],
 sewerDrip:[tone(1220,590,.09,.08,'sine'),tone(510,295,.18,.05,'sine',.045),noise(1900,600,.045,.025)],
 sewerClaw:[noise(3400,420,.23,.15),tone(570,340,.22,.07,'triangle'),tone(1120,690,.14,.028,'sine',.04)],
 sewerCrawl:[noise(1400,170,.32,.07),noise(2700,240,.13,.065,.12),tone(125,83,.26,.027,'sine')],
 sewerWater:[noise(950,450,1.55,.06),noise(2700,800,.85,.035,.23),tone(65,72,1.5,.018,'sine')],
 sewerSplash:[noise(4600,280,.16,.25),noise(1500,100,.95,.24,.025),tone(87,29,.6,.24,'sine'),noise(3100,400,.4,.12,.2)],
 sewerHiss:[noise(2800,1100,.7,.08),noise(1100,430,.75,.045,.04)],
 sewerValve:[noise(2400,350,.16,.1),tone(170,83,.26,.1,'triangle'),noise(850,180,.4,.085,.08)],
 sewerIgnite:[noise(4100,680,.16,.13),noise(1700,600,.42,.08,.05),tone(135,190,.13,.045,'sine')],
 sewerChain:[noise(3500,650,.12,.11),...metal(440),noise(2100,250,.2,.08,.13),tone(82,58,.3,.055,'triangle')],
 sewerPour:[noise(1800,550,.75,.12),tone(380,180,.15,.045,'sine',.1),noise(2600,900,.24,.045,.2)],
 sewerLamp:[noise(2400,600,.035,.055),tone(620,390,.045,.05,'triangle')],
 orbitLatch:[...metal(820),tone(180,95,.16,.13,'triangle'),noise(1700,600,.09,.1)],
 orbitReset:[tone(420,140,.3,.12,'triangle'),...metal(480),noise(2200,500,.28,.12)],
 orbitRelease:[noise(2600,120,.75,.3),tone(88,28,.8,.3,'sine'),...metal(320),tone(620,170,.36,.12,'triangle',.12),noise(4000,400,.45,.2,.25)],
 magnetOn:[tone(110,330,.24,.14,'sine'),...metal(950),tone(720,1080,.13,.07,'sine',.08)],
 magnetOff:[tone(440,90,.22,.13,'sine'),noise(1500,150,.08,.07)],
 magnetGrab:[...metal(680),tone(100,75,.2,.09,'triangle')],

 wardenCharge:[{...noise(350,2600,1.5,.085),attack:1.15},{...tone(90,620,1.5,.07,'sine'),attack:1.1},{...tone(180,1240,1.4,.035,'sine',.08),attack:1.05}],
 wardenLaser:[noise(6500,900,.35,.28),noise(1800,240,.55,.16,.025),tone(180,48,.38,.21,'sine'),tone(1200,260,.3,.06,'sawtooth'),noise(900,180,.6,.065,.12)],
 wardenDrop:[{...noise(240,1800,.5,.2),attack:.32},{...tone(110,58,.55,.09,'sine'),attack:.27},{...noise(2400,600,.18,.07,.27),attack:.08}],
 wardenStomp:[noise(4200,320,.09,.34),tone(74,28,.85,.32,'sine'),tone(142,65,.48,.18,'triangle'),noise(1100,80,1.05,.2,.035),tone(390,375,.75,.065,'sine',.02),tone(780,730,.55,.028,'sine',.04),noise(450,100,.75,.075,.18)],
 plunger:[tone(220,950,.14,.16),tone(760,120,.45,.12,'sine',.06),noise(2200,500,.06,.1)],step:[noise(1100,200,.055,.11),tone(100,65,.055,.08)],jump:[tone(150,530,.15,.15),noise(800,1600,.08,.07)],land:[noise(1800,180,.1,.18),tone(130,48,.13,.2)],
 sword:[noise(2200,600,.17,.23),tone(320,110,.13,.06)],bow:[noise(3200,1400,.07,.15),tone(780,220,.11,.16)],bash:[noise(400,1600,.18,.2),tone(160,60,.19,.19)],impact:[noise(3600,180,.16,.3),tone(100,40,.22,.24)],
 shieldRaise:[noise(1500,900,.08,.09),tone(300,600,.12,.1)],shieldLower:[noise(900,400,.08,.09),tone(450,190,.12,.1)],shieldHit:metal(),reflect:[...metal(980),tone(600,1800,.13,.08)],
 hurt:[tone(220,65,.23,.21,'sawtooth'),noise(1600,350,.13,.13)],death:[tone(330,40,1.1,.2,'sawtooth'),tone(160,32,1.3,.12),noise(1400,180,.45,.12)],
 pickup:chime(700),heal:chime(520),bombPlace:[noise(900,160,.09,.13),tone(140,75,.09,.12)],fuse:[noise(6000,3500,.025,.09)],explosion:[noise(5000,80,.65,.4),tone(95,24,.65,.3),noise(1700,160,.35,.16,.08)],
 switch:[tone(400,650,.075,.1)],click:[tone(650,380,.045,.09)],start:chime(220),portal:[noise(300,5500,1.4,.2),tone(70,1000,1.5,.16),tone(110,1600,1.7,.09,'sine')],arrival:chime(660),
 lever:[noise(2000,400,.045,.11),tone(180,90,.08,.12)],lift:[noise(900,450,.23,.055),tone(75,85,.23,.04)],bell:metal(1100),wrong:[tone(250,100,.25,.14,'square')],chain:[...metal(1300),noise(3800,700,.25,.14)],pour:[noise(2500,800,.5,.18),tone(240,95,.2,.08)],forge:[noise(1800,250,.42,.19),tone(95,55,.3,.15)],pump:[noise(450,1800,.23,.2),tone(80,150,.18,.09)],cart:[noise(1500,400,.18,.065),tone(220,170,.1,.04)],mix:[noise(700,300,.23,.12)],oven:[noise(800,1900,.3,.1),tone(100,150,.25,.07)],lens:chime(940),unlock:chime(350),ambient:[tone(65,70,1.8,.018,'sine'),noise(800,500,1.5,.013)]};
export function renderEffect(ctx,destination,name,{pan=0,volume=1,pitch=1}={}){const voices=effects[name]||effects.click;const nodes=[];const now=ctx.currentTime;
 const spatial=ctx.createStereoPanner();spatial.pan.value=Math.max(-1,Math.min(1,pan));spatial.connect(destination);let end=0;
 for(const v of voices){const start=now+(v.delay||0),finish=start+v.duration;end=Math.max(end,finish);const gain=ctx.createGain();gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(Math.max(.0001,v.volume*volume),start+Math.min(v.attack??.008,v.duration*.8));gain.gain.exponentialRampToValueAtTime(.0001,finish);gain.connect(spatial);let source;
 if(v.type==='noise'){source=ctx.createBufferSource();const buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*v.duration),ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;source.buffer=buffer;const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.Q.value=.7;filter.frequency.setValueAtTime(v.frequency*pitch,start);filter.frequency.exponentialRampToValueAtTime(Math.max(30,v.end*pitch),finish);source.connect(filter);filter.connect(gain);nodes.push(filter);}
 else{source=ctx.createOscillator();source.type=v.type;source.frequency.setValueAtTime(v.frequency*pitch,start);source.frequency.exponentialRampToValueAtTime(Math.max(20,v.end*pitch),finish);source.connect(gain);}
 source.start(start);source.stop(finish);nodes.push(source,gain);source.onended=()=>{source.disconnect();gain.disconnect();};}
 nodes.push(spatial);return {nodes,end};}
export function createSoundLayer(){let context,master,compressor,enabled=true,history=[],voices=[];const rate=new Map();
 async function unlock(){try{if(!context){context=new AudioContext();master=context.createGain();master.gain.value=enabled?.65:0;compressor=context.createDynamicsCompressor();compressor.threshold.value=-20;compressor.ratio.value=5;compressor.attack.value=.003;master.connect(compressor);compressor.connect(context.destination);}if(context.state==='suspended')await context.resume();}catch{} }
 function play(name,options={}){if(!enabled||!context||context.state!=='running')return false;const now=context.currentTime,key=name+':'+(options.id??'');if(now-(rate.get(key)??-10)<(name==='ambient'?1.5:.035))return false;rate.set(key,now);voices=voices.filter(v=>{if(v.end<now){v.nodes.forEach(n=>n.disconnect());return false;}return true;});if(voices.length>=24)return false;voices.push(renderEffect(context,master,name,options));history.push(name);history=history.slice(-64);return true;}
 function setEnabled(value){enabled=value;if(master){master.gain.cancelScheduledValues(context.currentTime);master.gain.setTargetAtTime(value?.65:0,context.currentTime,.015);}if(!value){voices.forEach(v=>v.nodes.forEach(n=>n.disconnect()));voices=[];}}
 return {unlock,play,setEnabled,get enabled(){return enabled;},get diagnostics(){return {enabled,state:context?.state||'locked',voices:voices.length,played:[...history]};}};
}
