import {native85ShieldPose} from './native85-registration.js?v=native85';
import {imagegen88ShieldPose} from './imagegen88-registration.js?v=imagegen88';
export function syncShieldArtPose(hero,skin,animation){
 hero.skin=skin;
 if(hero.id!==2||!['native85','imagegen88','imagegen90'].includes(skin)){delete hero.shieldArtPose;return;}
 const pose=skin==='native85'?native85ShieldPose:imagegen88ShieldPose;
 hero.shieldArtPose=pose(hero,animation.pose,animation.frame);
}
