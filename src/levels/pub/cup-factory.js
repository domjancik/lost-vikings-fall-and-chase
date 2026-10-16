const interval=3.2,firstThrow=1.1,flight=1,bounce=.35,limit=32;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const createCupFactory=()=>({clock:0,made:0,pile:8,flying:[]});
function slot(index){
 index%=limit;const rows=[8,7,6,5,4,2];let row=0;
 while(index>=rows[row])index-=rows[row++];
 const sideways=(index+row)%3===1;
 return{x:2324+(index-(rows[row]-1)/2)*12+(row%2?2:0),bottom:760-row*10,angle:sideways?Math.PI/2:0,height:sideways?12:16};
}
export function stepCupFactory(s,dt){
 const f=s.machine.factory,oldPile=f.pile;f.clock+=Math.max(0,dt);
 if(['play','inspect'].includes(s.machine.phase))f.made=Math.max(f.made,Math.max(0,Math.floor((f.clock-firstThrow)/interval)+1));
 const settled=Math.min(f.made,Math.max(0,Math.floor((f.clock-firstThrow-flight-bounce)/interval)+1));
 f.pile=Math.min(limit,8+settled);f.flying=[];
 // Only the most recent throw can still be airborne. A long simulation step
 // advances the count without allocating all historical cups.
 for(let id=Math.max(0,f.made-2);id<f.made;id++){
  const age=f.clock-(firstThrow+id*interval);if(age<0||age>=flight+bounce)continue;
  const target=slot(8+id),t=clamp(age/flight,0,1),rebound=clamp((age-flight)/bounce,0,1);
  const bottom=age<flight?706+(target.bottom-706-260)*t+260*t*t:target.bottom-Math.sin(rebound*Math.PI)*6;
  f.flying.push({id,x:2132+(target.x-2132)*t,y:bottom,bottom,angle:target.angle+(1-t)*Math.PI*2,height:target.height,phase:age<flight?'throw':'bounce'});
 }
 return Math.max(0,f.pile-oldPile);
}
export function cupFactoryScene(s){const f=s.machine.factory;return{pile:Array.from({length:f.pile},(_,i)=>slot(i)),flying:f.flying.map(p=>({...p})),made:f.made};}
export function cupFactoryFrame(s){
 if(!['play','inspect'].includes(s.machine.phase))return 0;
 const f=s.machine.factory,lastThrow=firstThrow+(f.made-1)*interval;
 if(f.made&&f.clock-lastThrow<.4)return 3;
 const until=firstThrow+f.made*interval-f.clock;
 return until>.8?0:until>.35?1:2;
}
