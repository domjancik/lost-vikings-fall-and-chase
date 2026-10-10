export function damage(s,h,amount=1,fatal=false){
 if(h.dead||(!fatal&&(h.invulnerable||0)>0))return false;
 h.hp=Math.max(0,h.hp-amount);h.invulnerable=.95;h.hurt=.35;s.hurt=.35;
 if(!h.hp){h.dead=true;h.vx=0;h.vy=0;h.shield=false;s.failed=true;s.won=false;s.failure= ['Erik','Baleog','Olaf'][h.id]+' has fallen. All three must survive.';}
 return true;
}
