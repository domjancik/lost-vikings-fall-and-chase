import {native85ShieldPose} from './native85-registration.js?v=orbit121';
import {imagegen88ShieldPose} from './imagegen88-registration.js?v=orbit121';
import {heroSkin} from './hero-skins.js?v=orbit121';
export function syncShieldArtPose(hero,skin,animation){
 skin=heroSkin(skin,hero.id);
 hero.skin=skin;
 if(hero.id!==2||!['native85','imagegen88','imagegen90'].includes(skin)){delete hero.shieldArtPose;return;}
 const pose=skin==='native85'?native85ShieldPose:imagegen88ShieldPose;
 hero.shieldArtPose=pose(hero,animation.pose,animation.frame);
}
