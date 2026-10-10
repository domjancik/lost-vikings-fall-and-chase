export function keyAction(key){return {ArrowLeft:'left',ArrowRight:'right',' ':'primary',f:'primary',Enter:'primary',d:'secondary',x:'secondary',z:'sword',e:'interact',s:'interact',q:'item'}[key];}
export function createControls(){
 const held=new Map(),pending=new Set();
 return {
  press(action,source){if(!action||held.has(source))return;held.set(source,action);pending.add(action);},
  release(source){held.delete(source);},
  has(action){return [...held.values()].includes(action);},
  clear(){held.clear();pending.clear();},
  discard(){pending.clear();},
  consume(hero){const primary=pending.has('primary');const result={left:this.has('left'),right:this.has('right'),jump:primary&&hero!==1,sword:pending.has('sword')||(primary&&hero===1),action:pending.has('secondary'),interact:pending.has('interact'),item:pending.has('item')};pending.clear();return result;}
 };
}
