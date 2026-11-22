/* Native teleport callbacks FFA520D0/FFA52390 and measured turning clocks. */
(function(s){
 'use strict';const B=s.ARENA_ASSETS.characters,D=s.FIGHT_DATA.characters,art=s.SCORPION_NATIVE_PHYSICS_ART,C=s.FightCollision;
 const sockets=new Map();for(const name of ['special','reel'])for(const f of B.scorpion.clips[name].frames)if(f.attachments)sockets.set(B.scorpion.assets[f.asset].sha256_pixels,f.attachments);
 for(const[id,pack]of Object.entries(art)){
  Object.assign(B[id].assets,pack.assets);Object.assign(B[id].clips,pack.clips);
  if(pack.clips.nativeIdle)B[id].clips.idle=pack.clips.nativeIdle;
  D[id].moves.nativeTurn={kind:'mobility',clip:'nativeTurnStanding',damage:0,startup:0,active:0,recovery:7/B[id].fps,allowGuardDuringAction:true};
 }
 for(const name of ['nativeSpearThrow','nativeSpearReel'])for(const f of B.scorpion.clips[name].frames){const a=B.scorpion.assets[f.asset];f.attachments=sockets.get(a.sha256_pixels)||{spear:{x:a.width-2,y:18}};}
 B.scorpion.clips.reel=B.scorpion.clips.nativeSpearReel;
 const spear=D.scorpion.moves.spear,sr=s.SCORPION_NATIVE_STRIKES[20],fps=B.scorpion.fps;
 Object.assign(spear,{clip:'nativeSpearThrow',damage:sr.baseHitDamage/166*100,nativeChip:sr.baseBlockedDamage/166*100,
  startup:10/fps,active:1/fps,recovery:(B.scorpion.clips.nativeSpearThrow.frames.length-11)/fps,nativeSpear:true,
  nativeStrike:{index:20,flags:sr.flags,bitAddress:sr.bitAddress},hitstop:0,blockHitstop:0,
  pullMotion:{hold:30/fps,speed:8*fps,stopDistance:64,settleStun:64/fps,nativeSpear:true,sampleRate:fps}
 });
 Object.assign(spear.projectile,{speed:10*fps,spawnX:84,ignoreSocketSpawn:true,y:100.5,lifetime:3,
  motionSamples:Array.from({length:160},(_,i)=>({x:i*10,y:0})),sampleRate:fps,
  attackTimeline:[[{x:-53,y:-8.5,w:53,h:17}]],nativeSpear:true,clip:'nativeSpearHead',nativeViewportBound:true});
 for(const command of D.scorpion.commands)if(command.move==='teleport'||command.move==='nativeAir_teleport')command.allowNeutral=true;
 const r=s.SCORPION_NATIVE_STRIKES[23];
 for(const name of ['teleport','nativeAir_teleport'])Object.assign(D.scorpion.moves[name],{
  kind:'mobility',clip:name==='teleport'?'nativeTeleportGround':'nativeTeleportAir',damage:r.baseHitDamage/166*100,nativeChip:r.baseBlockedDamage/166*100,
  startup:0,active:4,recovery:0,nativeTeleportController:true,ignoreMaximumDistance:true,bodyPushTimeline:[false],hitstop:0,blockHitstop:0,
  box:{x:r.xOffset-r.width,y:134-r.yOffset-r.height,w:r.width,h:r.height},nativeStrike:{index:23,flags:r.flags,bitAddress:r.bitAddress}
 });
 const camera=s.FightMovement.camera;
 s.FightMovement.camera=function(g,dt){const p=g.players.find(p=>p.action?.nativeTeleport);if(g.players.length===2&&p){g.camera=p.action.nativeTeleport.camera;return;}return camera(g,dt);};
 const Base=s.FightArena;
 class NativeScorpionPhysics extends Base{
  spearOwnerFrame(p,t){
   const reel=(t.nativeTick||0)>=26,name=reel?'reel':'nativeSpearThrow';this.state(p,name);
   p.frame=Math.min(this.clip(p,name).frames.length-1,Math.floor(reel?t.nativeTick-26:10));p.clock=0;
  }
  spearTargetFrame(p,t){this.state(p,'impaled');p.frame=Math.min(this.clip(p,'impaled').frames.length-1,t.nativeTick||0);p.clock=0;}
  faceOpponent(p,q){
   const desired=q.x>p.x?1:-1;
   if(!art[p.id]||p.stun>0||p.guardStun>0||p.reaction){p.facing=desired;return;}
   if(p.facing===desired)return;
   if(this.startAction(p,'nativeTurn')){
    p.action.turnTo=desired;p.action.endsAt=Infinity;p.action.overrideClip=p.input.down?'nativeTurnCrouch':'nativeTurnStanding';this.state(p,p.action.overrideClip);
   }else p.facing=desired;
  }
  startAction(p,name,...args){
   const ok=super.startAction(p,name,...args),m=this.definition(p).moves[name];
   if(ok&&m?.nativeTeleportController){
    p.action.nativeTeleport={tick:-1,camera:this.camera,side:p.facing,air:p.airborne,phase:'pre',vy:2.8125,returned:false};
    p.vx=0;p.vy=0;
   }
   return ok;
  }
  activeBox(p,a=p.action){
   const tp=a?.nativeTeleport;if(!tp){
    const m=a&&this.definition(p).moves[a.name];
    if(this.nativeStrikeScan&&m?.nativeStrike&&(p.airborne||this.opponent(p).airborne)){
     const tick=p.motion?.sample;
     if(a.nativeStrikeScanned===tick)return null;
     a.nativeStrikeScanned=tick;
    }
    return super.activeBox(p,a);
   }
   if(!tp.returned||tp.tick<tp.attackReady||tp.phase!=='flight')return null;
   return C.box(p,this.definition(p).moves[a.name].box);
  }
  teleportFrame(p,a){
   const tp=a.nativeTeleport,m=this.definition(p).moves[a.name],blocked=tp.phase==='blocked'||tp.phase==='blockedRecovery';
   const name=blocked?'nativeTeleportBlocked':m.clip;
   this.state(p,name);p.frame=Math.min(this.clip(p,name).frames.length-1,blocked?Math.max(0,tp.blockedAge):Math.max(0,tp.tick));p.clock=0;
  }
  finishTeleport(p){
   p.action=null;p.y=0;p.airborne=false;p.vx=0;p.vy=0;
   if(p.motion){p.motion.contactFall=null;p.motion.reactionFall=null;p.motion.queue=[];p.motion.lastWalk='';p.motion.landing=0;}
   this.state(p,p.input.down?'crouch':'idle');this.emit('land',{player:p.index});
  }
  advanceTeleport(p,a){
   const tp=a.nativeTeleport,fps=B[p.id].fps,end=Math.floor((a.time+1e-9)*fps);
   while(p.action===a&&tp.tick<end){
    tp.tick++;
    if(tp.tick<3){p.facing=tp.tick<2?tp.side:-tp.side;continue;}
    if(tp.phase==='pre')tp.phase='flight';
    if(tp.phase==='pause'){
     if(tp.pauseLeft-->0)continue;
     tp.phase='fall';tp.vy=tp.airVictim?-1.75:-1.5;tp.gravity=tp.airVictim?.75:.5;
    }
    if(tp.phase==='flight'){
     p.x-=tp.side*10;p.y+=tp.vy;tp.vy-=.3125;p.facing=-tp.side;
     const left=tp.camera-200,right=left+399;
     if(!tp.returned&&(tp.side>0?p.x<left:p.x>right)){
      const fraction=((p.x-left)%1+1)%1;p.x=(tp.side>0?right:left)+fraction;tp.returned=true;tp.attackReady=tp.tick+1;this.emit('teleport',{player:p.index});
     }
     p.airborne=p.y>0;if(p.y<=0)this.finishTeleport(p);
    }else if(tp.phase==='fall'){
     p.y+=tp.vy;tp.vy-=tp.gravity;p.airborne=p.y>0;if(p.y<=0)this.finishTeleport(p);
    }else if(tp.phase==='blocked'){
     tp.blockedAge++;p.x+=tp.side;p.y+=tp.vy;tp.vy-=.375;p.airborne=p.y>0;
     if(p.y<=0){p.y=0;p.airborne=false;tp.phase='blockedRecovery';}
    }else if(tp.phase==='blockedRecovery'){
     tp.blockedAge++;if(tp.blockedAge>=B[p.id].clips.nativeTeleportBlocked.frames.length)this.finishTeleport(p);
    }
   }
   if(p.action===a)this.teleportFrame(p,a);
  }
  updatePlayer(p,dt){
   const a=p.action;
   if(p.nativeSpearDizzy){
    const dizzy=p.nativeSpearDizzy;dizzy.time+=dt;p.stun=Math.max(0,dizzy.duration-dizzy.time);p.buffer=[];
    if(!p.stun){delete p.nativeSpearDizzy;this.state(p,p.input.down?'crouch':'idle');}
    else{this.state(p,'nativeSpearDizzy');p.frame=Math.min(this.clip(p,p.state).frames.length-1,Math.floor(dizzy.time*B[p.id].fps+1e-8));p.clock=0;}return;
   }
   const tether=this.tethers.find(t=>t.nativeSpear&&(t.owner===p.index||t.target===p.index));
   if(tether&&p.health>0){
    p.buffer=[];p.vx=0;p.vy=0;
    if(tether.owner===p.index&&a?.name===tether.move&&p.stun<=0){a.time+=dt;this.spearOwnerFrame(p,tether);return;}
    if(tether.target===p.index){p.reaction=null;p.stun=0;p.airborne=false;p.y=0;this.spearTargetFrame(p,tether);return;}
   }
   if(a?.nativeSpearRelease){
    const release=a.nativeSpearRelease;
    if(this.elapsed>=release.at){p.action=null;this.state(p,'idle');}
    else{this.spearOwnerFrame(p,{nativeTick:release.tick+(this.elapsed-release.started)*B[p.id].fps});return;}
   }
   if(a?.nativeTeleport){
    if(p.health<=0||p.stun>0||p.knockdown>0||p.reaction){p.action=null;return super.updatePlayer(p,dt);}
    p.flash=Math.max(0,p.flash-dt);p.invulnerable=Math.max(0,p.invulnerable-dt);p.buffer=[];
    if(a.nativeTeleport.tick<2&&a.nativeTeleport.air)s.FightMovement.tick(this,p,dt);
    a.time+=dt;this.advanceTeleport(p,a);return;
   }
   super.updatePlayer(p,dt);
   if(p.action?.name==='nativeTurn'&&p.action.turnTo&&p.action.time>=(this.clip(p,p.action.overrideClip).flipSample||4)/B[p.id].fps-1e-8)p.facing=p.action.turnTo;
   if(p.action?.nativeTeleport)this.advanceTeleport(p,p.action);
  }
  hit(a,b,m,name){
   const action=a.action,tp=action?.nativeTeleport,oldPause=this.hitstop,air=b.airborne,turn=b.action?.name==='nativeTurn'&&b.action.turnTo,effectCount=this.effects.length;
   const hit=super.hit(a,b,m,name);if(hit){delete b.nativeSpearDizzy;if(turn)b.facing=a.x>b.x?1:-1;}
   if(hit&&m.nativeSpear){this.hitstop=oldPause;if(action?.contactResult==='hit'){
    b.reaction=null;b.localHitstop=0;b.stun=0;b.vx=0;b.vy=0;
    const film=art.scorpion.effects?.spearBlood;
    if(film){this.effects.splice(effectCount,1);this.effects.push({kind:'nativeScorpionSpearBlood',x:b.x,y:b.y,age:0,facing:a.facing,duration:film.frames.length/film.sampleRate});}
   }return true;}
   if(!hit||!tp)return hit;
   this.hitstop=oldPause;a.localHitstop=0;a.vx=0;a.vy=0;
   if(action.contactResult==='block'){
    const floor={scorpion:134,'mk-4':137,'mk-1':138}[b.id]||134;
    a.x=b.x+tp.side*16;a.y=b.y+floor-134;a.airborne=true;tp.phase='blocked';tp.blockedAge=-1;tp.vy=7.625;
   }else{tp.phase='pause';tp.pauseLeft=air?4:6;tp.airVictim=air;}
   return true;
  }
  advanceProjectile(q,dt){
   const cfg=this.definition(this.players[q.owner]).moves[q.name].projectile;
   if(q.nativeSpearClock){
    const tick=Math.floor((this.elapsed+1e-9)*cfg.sampleRate),clock=q.nativeSpearClock;
    q.nativeCollisionReady=tick!==clock.lastFrame;q.previousX=q.x;q.x=q.originX+q.facing*10*(tick-clock.spawnFrame);q.y=q.originY;
    q.age=(tick-clock.spawnFrame)/cfg.sampleRate;clock.lastFrame=tick;
   }else super.advanceProjectile(q,dt);
   if(cfg.nativeViewportBound){const half=this.players.length===2?200:Math.min(550,240+35*(this.players.length-2));if(q.facing>0?q.x>this.camera+half:q.x<this.camera-half)q.age=q.lifetime;}
  }
  spawnProjectile(p,name,...args){
   super.spawnProjectile(p,name,...args);
   if(this.definition(p).moves[name].nativeSpear){const q=this.projectiles.at(-1),cfg=this.definition(p).moves[name].projectile;q.originX=q.x;q.originY=q.y;q.nativeSpearClock={spawnFrame:Math.floor((this.elapsed+1e-9)*cfg.sampleRate),lastFrame:-1};}
  }
  projectileBox(q,field='attackTimeline'){
   if(q.nativeSpearClock&&field==='attackTimeline')return C.box(q,this.definition(this.players[q.owner]).moves[q.name].projectile.attackTimeline[0][0]);
   return super.projectileBox(q,field);
  }
  updateTethers(dt){
   const native=this.tethers.filter(t=>t.nativeSpear);this.tethers=this.tethers.filter(t=>!t.nativeSpear);super.updateTethers(dt);const keep=[...this.tethers];
   for(const t of native){
    const owner=this.players[t.owner],target=this.players[t.target];
    if(owner.health<=0||target.health<=0||owner.stun>0||owner.knockdown>0||owner.action?.name!==t.move||this.phase!=='fight'){
     target.reaction=null;target.stun=Math.max(target.stun,.12);this.state(target,'hit');this.emit('pullCancelled',{player:t.owner,target:t.target});continue;
    }
    t.elapsed+=dt;t.nativeClock=(t.nativeClock||0)+dt;t.nativeTick||=0;let ended=false;
    target.y=0;target.airborne=false;target.vx=0;target.vy=0;target.reaction=null;
    while(t.nativeClock+1e-9>=1/t.sampleRate&&!ended){
     t.nativeClock-=1/t.sampleRate;t.nativeTick++;
     if(t.nativeTick>=30){
      if(t.phase==='impale'){t.phase='pull';this.emit('pullStart',{player:t.owner,target:t.target});}
      const root=Math.floor(owner.x),destination=root+t.direction*64;
      if(!t.firstPull||Math.abs(target.x-root)>64){target.x-=t.direction*8;t.firstPull=true;}
      else{
       target.x=destination;const clip=B[target.id].clips.nativeSpearDizzy;
       if(clip){target.nativeSpearDizzy={time:0,duration:clip.frames.length/B[target.id].fps};target.stun=target.nativeSpearDizzy.duration;this.state(target,'nativeSpearDizzy');}
       else{target.stun=t.settleStun;this.state(target,'hit');}
       owner.action.nativeSpearRelease={at:this.elapsed+1/t.sampleRate,started:this.elapsed,tick:t.nativeTick};
       this.emit('pullEnd',{player:t.owner,target:t.target});ended=true;
      }
     }
    }
    this.spearOwnerFrame(owner,t);if(!ended){this.spearTargetFrame(target,t);keep.push(t);}
   }
   this.tethers=keep;
  }
  collisions(dt){
   const turns=this.players.filter(p=>p.action?.name==='nativeTurn'&&p.action.turnTo&&p.action.time>=7/B[p.id].fps-1e-8).map(p=>({p,a:p.action}));
   this.nativeStrikeScan=true;try{super.collisions(dt);}finally{this.nativeStrikeScan=false;}
   for(const {p,a}of turns){p.facing=a.turnTo;if(p.action===a){p.action=null;this.state(p,p.input.block&&p.input.down?'crouchGuard':p.input.down?'crouch':'idle');if(p.input.down)p.frame=this.clip(p,p.state).frames.length-1;}}
  }
 }
 s.FightArena=NativeScorpionPhysics;
})(typeof window==='undefined'?globalThis:window);
