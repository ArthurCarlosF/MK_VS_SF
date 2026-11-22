/* Arcade strike geometry and damage verified against the original ROM. */
(function(s){
 'use strict';const walk=s.SCORPION_VALIDATED_WALK;Object.assign(s.ARENA_ASSETS.characters.scorpion.assets,walk.assets);Object.assign(s.ARENA_ASSETS.characters.scorpion.clips,walk.clips);const d=s.FIGHT_DATA.characters.scorpion,B=s.ARENA_ASSETS.characters;
 const bindings={punch:3,punchFollow:3,punchReturn:3,mixHLBack:3,mixHLFront:3,mixLHBack:2,mixLHFront:2,normal_stand_lp_far:3,normal_stand_hp_far:2,highPunchFollow:2,highPunchReturn:2,
  normal_stand_hp_near:15,normal_stand_lk_far:0,normal_stand_hk_far:1,kick:1,normal_stand_lk_near:14,normal_stand_hk_near:14,
  crouchPunch:5,normal_crouch_lp:5,normal_crouch_hp:8,normal_crouch_lk:6,crouchKick:7,normal_crouch_hk:7,
  normal_back_lk:13,normal_back_hk:4,airPunch:9,normal_airVertical_hp:9,normal_airForward_lp:9,normal_airForward_hp:9,
  airKick:10,normal_airVertical_hk:10,normal_airVertical_lk:10,normal_airForward_hk:11,normal_airForward_lk:11};
 for(const [name,index]of Object.entries(bindings)){
  const m=d.moves[name],r=s.SCORPION_NATIVE_STRIKES[index];if(!m)continue;
  m.box={x:r.xOffset-r.width,y:134-r.yOffset-r.height,w:r.width,h:r.height};
  m.nativeStrike={index,flags:r.flags,bitAddress:r.bitAddress};m.nativeChip=r.baseBlockedDamage/166*100;
  m.level=r.flags&2?'low':'mid';if(m.air)m.nativeLandingContact=true;
 }
 for(const id of ['mk-4','mk-1']){
  const def=s.FIGHT_DATA.characters[id],floor=id==='mk-4'?137:138;
  const indices={stand_lp:3,stand_hp:2,near_hp:15,near_hk:14,near_lk:14,stand_hk:0,stand_lk:1,crouch_lp:5,crouch_hp:8,crouch_hk:6,crouch_lk:7,
   air_lp:9,air_hp:9,air_hk:10,air_lk:10,nativeDirectionalPunch:9,nativeDirectionalKick:11,nativeRoundhouse:13,back_hk:13,nativeSweep:4,sweep:4};
  for(const [name,index]of Object.entries(indices)){
   const m=def.moves[name],r=s.SCORPION_OPPONENT_STRIKES[id][index];if(!m)continue;
   m.box={x:r.xOffset-r.width,y:floor-r.yOffset-r.height,w:r.width,h:r.height};m.nativeStrike={index,flags:r.flags,bitAddress:r.bitAddress};
   m.nativeChip=r.baseBlockedDamage/166*100;m.level=r.flags&2?'low':'mid';if(m.air)m.nativeLandingContact=true;
   if(name==='nativeDirectionalKick')m.damage=r.baseHitDamage/166*100;
  }
 }
 for(const name of ['airKick','normal_airVertical_hk','normal_airVertical_lk']){
  const m=d.moves[name];if(!m)continue;const duration=m.startup+m.active+m.recovery;
  m.activeRanges=[[10,25]];m.active=15/B.scorpion.fps;m.recovery=duration-m.startup-m.active;
 }
 // The legacy LK alias carried the close knee damage into the far kick.
 d.moves.kick.damage=d.moves.normal_stand_hk_far.damage;
 for(const name of ['guard','crouchGuard','crouch'])B.scorpion.clips[name].loop=false;
 for(const id of ['mk-4','mk-1']){
  const m=s.FIGHT_DATA.characters[id].moves.crouch_lk,duration=m.startup+m.active+m.recovery;m.startup=8/B[id].fps;m.recovery=duration-m.startup-m.active;
 }
 {
  const m=s.FIGHT_DATA.characters['mk-1'].moves.crouch_hk,duration=m.startup+m.active+m.recovery;m.startup=11/B['mk-1'].fps;m.recovery=duration-m.startup-m.active;
 }
 d.nativeGroundPush={maximumPerSample:3};
 for(const id of ['scorpion','mk-4','mk-1'])s.FIGHT_DATA.characters[id].nativeCrouchReadySamples=6;
 const C=s.FightCommands,record=C.record,action=C.action;
 C.record=function(p,input,time,def){
  if(p.previousInput?.down&&!input.down&&def.nativeCrouchReadySamples)p.nativeStandUpUntil=time+def.nativeCrouchReadySamples/B[p.id].fps;
  if(input.down)p.nativeCrouchSince??=time;else delete p.nativeCrouchSince;
  return record(p,input,time,def);
 };
 C.action=function(p,def,time){
  const request=action(p,def,time),control=def.normalControls?.[request?.event?.button];
  if(request&&def.nativeCrouchReadySamples&&!p.airborne&&p.input.down&&control?.crouch===request.move&&time-(p.nativeCrouchSince??time)<(def.nativeCrouchReadySamples-1)/B[p.id].fps-1e-8)return null;
  return request;
 };
 for(const m of Object.values(d.moves))if(m.grapple&&!m.air&&m.grapple.releaseReaction==='scorpion_stand_lp_near_released'){
  m.grapple.damageSample=40;m.grapple.deferredDamageSample=4;
 }
 const Base=s.FightArena;
 class ScorpionValidationArena extends Base{
  state(p,name){
   const old=p.state;super.state(p,name);
   if(p.id==='scorpion'&&name==='idle'&&old!=='idle'){
    const index=B.scorpion.clips.idle.frames.findIndex(f=>f.asset==='frame-0007');if(index>=0)p.frame=index;
   }
  }
  strikeHurtBoxes(p,attacker,move){
   const inherited=super.strikeHurtBoxes(p,attacker,move);
   if(!inherited.length||!move.nativeStrike||B[p.id].universe!=='mk'||p.reaction||p.action&&this.definition(p).moves[p.action.name]?.calibration?.hurtTimeline)return inherited;
   // In both native opponent captures, LP passes over a ducking defender
   // holding Block; that input does not raise its vulnerable head into LP.
   const duckLP=attacker.id==='scorpion'&&move.nativeStrike.index===3&&p.input.down&&p.input.block;
   const f=duckLP?this.clip(p,'crouch').frames.at(-1):this.clip(p,p.state).frames[p.frame],a=B[p.id].assets[f.asset],scale=B[p.id].scale||1;
   const rect={x:f.x*scale,y:-(f.y+a.height)*scale,w:a.width*scale,h:a.height*scale};
   // Native bit 0 shrinks the multipart bounds horizontally by 3/8 per side.
   if(move.nativeStrike.flags&1){const inset=(Math.floor(rect.w)>>>3)+(Math.floor(rect.w)>>>2);rect.x+=inset;rect.w-=2*inset;}
   return [s.FightCollision.box(p,rect)];
  }
 }
 s.FightArena=ScorpionValidationArena;
})(typeof window==='undefined'?globalThis:window);
