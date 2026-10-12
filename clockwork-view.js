export function clockworkView(s,viewport){
 const g=s.machine,release=s.level.mechanic==='clockwork'&&s.active!==0&&g.pinBroken&&s.time-g.pinAt<3.2,split=release||s.level.mechanic==='clockwork'&&s.active===0&&g.wheel.occupied&&g.wheel.mode==='docked'&&!g.pinBroken;
 if(!split)return{split:false,focus:s.heroes[s.active]};
 const a=s.heroes[1],b=s.heroes[2],w=Math.min(120,viewport.width*.4),h=w*.86;
 return{split:true,release,focus:release?s.heroes[s.active]:{x:(a.x+b.x)/2,y:(a.y+b.y)/2},inset:{x:viewport.width-w-6,y:52,w,h},runner:{x:g.wheel.x-120,y:g.wheel.y-110,width:240,height:220}};
}
