/* Native ground locomotion: sampled input, complete cycles and rise transitions. */
(function(s){
 'use strict';const packs=s.NATIVE_GROUND_GAITS,B=s.ARENA_ASSETS.characters,M=s.FightMovement,originalTick=M.tick;
 for(const[id,p]of Object.entries(packs)){
  Object.assign(B[id].assets,p.assets);Object.assign(B[id].clips,p.clips);B[id].nativeGroundGait=p.gait;
  if(p.gait.nativeAiReference)B[id].movement.walk={forward:[p.gait.forwardSpeed],backward:[p.gait.backwardSpeed]};
  if(p.gait.crouchBodyHeight)s.FIGHT_DATA.characters[id].body.crouchHeight=p.gait.crouchBodyHeight;
 }
 function frame(g,p,state,index){const c=g.clip(p,state),start=c.loopStart||0;g.state(p,state);p.frame=c.loop?index<c.frames.length?index:start+(index-start)%(c.frames.length-start):Math.min(index,c.frames.length-1);p.clock=0;}
 function sfVideo(g,p,n,t,data,raw){
  const next=n.sfPendingInput||{},down=!!next.down,latched=n.previousRaw||{};
  n.sfPhase??=p.nativeSfPhase||0;
  const rateName=n.rising?'rise':down?'crouch':next.x?(next.x*p.facing>0?'forward':'backward'):'idle';
  n.sfPhase+=data.logicalRates[rateName];const steps=Math.floor(n.sfPhase);n.sfPhase-=steps;
  for(let i=0;i<steps;i++){
   const input=n.sfPendingInput||{};n.sfPendingInput=latched;const down=!!input.down;
   if(n.wasDown&&!down){n.rising=true;n.riseAge=0;n.walkDirection=0;}
   let state,index;
   if(n.rising){
    if(n.riseAge<data.standUpSamples){state='nativeGaitRise';index=n.riseAge++;}
    else{n.rising=false;n.mode='idle';n.age=-1;}
   }
   if(!state){
    state=down?'crouch':input.x?(input.x*p.facing>0?'forward':'backward'):'idle';index=n.mode===state?n.age+1:1;
    if(input.x&&!down)p.x+=input.x*(state==='forward'?data.forwardSpeed:data.backwardSpeed);
   }
   frame(g,p,state,index);n.mode=state;n.age=index;
   n.wasDown=down;t.lastInput=input;t.lastWalk=!down&&input.x&&!n.rising?n.mode:'';
  }
 }
 M.tick=function(g,p,dt){
  const data=B[p.id].nativeGroundGait;
  const threatGuard=g.definition(p).guard==='back'&&p.input.x===-p.facing&&g.hasGuardThreat(p);
  const free=data&&!p.airborne&&!p.action&&!p.stun&&!p.guardStun&&!p.knockdown&&!p.reaction&&!p.input.block&&!threatGuard&&p.health>0&&!p.motion?.landing&&!g.tethers.some(z=>z.owner===p.index||z.target===p.index);
  if(!free){if(p.nativeGait)p.nativeGait.active=false;return originalTick(g,p,dt);}
  p.motion||=M.init(g,p);const t=p.motion;
  if(!p.nativeGait?.active)p.nativeGait={active:true,mode:'idle',age:p.state==='idle'?p.frame-(data.universe==='sf'?0:1):-1,previousRaw:{},wasDown:false,rise:0,walkDirection:0};
  const n=p.nativeGait;t.clock+=dt;
  while(t.clock+1e-9>=1/data.fps){
   t.clock-=1/data.fps;t.sample++;
   const raw={x:p.input.x||0,down:!!p.input.down,run:!!p.input.run};
   if(data.universe==='sf'){sfVideo(g,p,n,t,data,raw);n.previousRaw=raw;continue;}
   t.queue.push(raw);
   const input=t.queue.length>data.walkDelay?t.queue.shift():{},relative=(input.x||0)*p.facing,down=data.canCrouch!==false&&!!input.down&&relative<=0;
   const visualDown=data.canCrouch!==false&&!!n.previousRaw.down&&(n.previousRaw.x||0)*p.facing<=0;
   let state='idle',index=0,moving=false;
   if(n.wasDown&&!down)n.rise=data.standUpSamples;
   if(n.rise>0){state='nativeGaitRise';index=data.standUpSamples-n.rise;n.rise--;n.walkDirection=0;}
   else if(input.x&&!down){
    if(n.walkDirection&&n.walkDirection!==input.x){state=n.mode;index=n.age;n.walkDirection=0;}
    else{
     moving=true;const run=data.canRun!==false&&relative>0&&input.run&&t.runEnergy>0;state=run?'run':relative>0?'forward':'backward';
     index=n.mode===state?n.age+1:0;n.walkDirection=input.x;
     p.x+=input.x*(run?data.runSpeed:relative>0?data.forwardSpeed:data.backwardSpeed);
     if(run){t.runEnergy=Math.max(0,t.runEnergy-1);t.runRecovery=B[p.id].movement.run?.recoveryDelaySamples||48;}
    }
   }else{n.walkDirection=0;if(visualDown||down){state='crouch';index=n.mode==='crouch'?n.age+1:0;}else{state='idle';index=n.mode==='idle'?n.age+1:0;}}
   // Duck animation starts one scan before the delayed horizontal velocity ends.
   if(visualDown&&n.rise===0&&down===false&&moving){state='crouch';index=n.mode==='crouch'?n.age+1:0;}
   if(state!=='run'&&t.runEnergy<(B[p.id].movement.run?.maximum||0)){if(t.runRecovery>0)t.runRecovery--;else t.runEnergy++;}
   frame(g,p,state,index);n.mode=state;n.age=index;n.wasDown=down;n.previousRaw=raw;t.lastInput=input;t.lastWalk=moving?state:'';
  }
  if(n.age>=0)frame(g,p,n.mode,n.age);
 };
 const Base=s.FightArena;
 s.FightArena=class NativeGroundGaitArena extends Base{
  updatePlayer(p,dt){
   if(B[p.id].nativeGroundGait&&!p.nativeGait?.active&&p.state==='idle'&&!p.action&&!p.airborne&&!p.reaction&&!p.stun&&!p.guardStun&&!p.input.block)p.nativeGait={active:true,mode:'idle',age:p.frame-(B[p.id].nativeGroundGait.universe==='sf'?0:1),previousRaw:{},wasDown:false,rise:0,walkDirection:0};
   return super.updatePlayer(p,dt);
  }
  animation(p,dt){if(p.nativeGait?.active&&!p.action&&!p.airborne&&!p.reaction&&!p.stun&&!p.guardStun)return;return super.animation(p,dt);}
 };
})(typeof window==='undefined'?globalThis:window);
