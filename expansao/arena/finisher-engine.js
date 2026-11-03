/* Pair-scoped cinematics. A guide entry alone cannot activate an uncaptured film. */
(function(scope){
 'use strict';
 const Base=scope.FightArena;
 class FinisherArena extends Base{
  startRound(){super.startRound();this.cinematics=[];this.finishOffers=[];this.finishInputs=[];}
  protectedPair(p){return p&&(this.cinematics||[]).find(c=>c.owner===p.index||c.target===p.index)||null;}
  enemies(p){return this.protectedPair(p)?[]:super.enemies(p).filter(q=>!this.protectedPair(q));}
  opponent(p){
   const q=super.opponent(p);
   return this.protectedPair(q)?this.enemies(p).sort((a,b)=>Math.abs(a.x-p.x)-Math.abs(b.x-p.x)||a.index-b.index)[0]||p:q;
  }
  bodyCollidable(p){return !this.protectedPair(p)&&super.bodyCollidable(p);}
  hurtBoxes(p){return this.protectedPair(p)?[]:super.hurtBoxes(p);}
  canStart(p,name){return !this.protectedPair(p)&&super.canStart(p,name);}
  hit(a,b,m,name){if(this.protectedPair(a)||this.protectedPair(b))return false;return super.hit(a,b,m,name);}
  provenProfile(owner,target,profileId){
   const profile=Object.hasOwn(scope.NATIVE_FINISHERS||{},profileId)?scope.NATIVE_FINISHERS[profileId]:null;
   if(!profile||!/^umk3(?:[-_]|$)/.test(profile.game||'')||!/^[a-f0-9]{64}$/.test(profile.captureSha256||'')||!profile.verifiedCapture)return null;
   if(profile.syntheticFixture&&!this.options.allowFixtureCinematics)return null;
   if(!profile.terminal?.fullNativePostCinemaLifecycleCaptured||!Array.isArray(profile.frames)||!profile.frames.length||!(profile.nativeFps>0&&profile.nativeFps<=120))return null;
   return profile.provenPairs?.some(p=>p.owner===owner.id&&p.victim===target.id)?profile:null;
  }
  beginFinisher(owner,target,profileId){
   if(!owner||!target||this.players[owner.index]!==owner||this.players[target.index]!==target)return false;
   const profile=this.provenProfile(owner,target,profileId);if(!profile)return false;
   if(this.mode!=='versus'||this.phase!=='fight'||owner.health<=0||target.health>0||owner.index===target.index||this.teams[owner.index]===this.teams[target.index]||this.protectedPair(owner)||this.protectedPair(target))return false;
   if(owner.stun>0||owner.guardStun>0||owner.knockdown>0||owner.airborne||owner.action)return false;
   if(this.tethers.some(q=>q.owner===owner.index||q.target===owner.index)||this.grapples.some(q=>q.owner===owner.index||q.target===owner.index))return false;
   const facing=Math.sign(target.x-owner.x)||owner.facing;
   const c={id:++this.serial,profile:profileId,owner:owner.index,target:target.index,time:0,frame:0,facing,originX:owner.x,originY:owner.y};
   this.cinematics.push(c);
   const involved=new Set([owner.index,target.index]);
   for(const p of [owner,target]){p.action=null;p.reaction=null;p.buffer=[];p.history=[];p.frozenEdges=[];p.vx=0;p.vy=0;p.localHitstop=0;p.flash=0;}
   this.projectiles=this.projectiles.filter(q=>!involved.has(q.owner));this.tethers=this.tethers.filter(q=>!involved.has(q.owner)&&!involved.has(q.target));
   this.grapples=this.grapples.filter(q=>!involved.has(q.owner)&&!involved.has(q.target));
   this.applyCinematic(c,profile);this.emit('finisherStart',{player:owner.index,target:target.index,profile:profileId});return true;
  }
  emit(type,detail={}){
   super.emit(type,detail);
   if(type!=='hit'||this.mode!=='versus'||this.phase!=='fight'||!this.finishOffers)return;
   const owner=this.players[detail.player],target=this.players[detail.target];
   if(!owner||!target||owner.health<=0||target.health>0||this.teams[owner.index]===this.teams[target.index]||this.finishOffers.some(o=>o.target===target.index))return;
   for(const id of Object.keys(scope.NATIVE_FINISHERS||{})){
    const trigger=this.provenProfile(owner,target,id)?.trigger;
    if(!trigger?.nativeTimingVerified||!trigger.steps?.length||!trigger.steps.every(k=>['forward','back','up','down','run','block','punch','punch2','kick','kick2'].includes(k)))continue;
    if(![trigger.delay,trigger.window,trigger.commandWindow,trigger.minDistance,trigger.maxDistance].every(Number.isFinite)||trigger.delay<0||trigger.window<=0||trigger.commandWindow<=0||trigger.maxDistance<trigger.minDistance)continue;
    if(trigger.stages&&!trigger.stages.includes(this.stageId))continue;
    if(this.players.length===2&&trigger.finalRoundOnly&&this.wins[owner.index]+1<this.rules.roundsToWin)continue;
    const opens=this.elapsed+trigger.delay,expires=opens+trigger.window;
    this.finishOffers.push({owner:owner.index,target:target.index,profile:id,opens,expires,position:0,started:null});
   }
  }
  processFinishInputs(inputs){
   if(!scope.NATIVE_FINISHERS)return inputs;
   const prior=this.finishInputs;this.finishInputs=this.players.map((_,i)=>scope.FightCommands.normalize(inputs?.[i]));
   this.finishOffers=this.finishOffers.filter(o=>o.expires>this.elapsed&&this.players[o.owner].health>0&&this.players[o.target].health<=0);
   if(this.phase!=='fight'||!this.finishOffers.length)return inputs;
   const adjusted=Array.from(inputs||[]);
   for(const owner of this.players){
    if(this.protectedPair(owner))continue;
    const offers=this.finishOffers.filter(o=>o.owner===owner.index&&o.opens<=this.elapsed).sort((a,b)=>Math.abs(this.players[a.target].x-owner.x)-Math.abs(this.players[b.target].x-owner.x)||a.target-b.target);
    const selected=offers[0];if(!selected)continue;
    const target=this.players[selected.target],facing=Math.sign(target.x-owner.x)||owner.facing;
    const now=this.finishInputs[owner.index],old=prior[owner.index]||{};
    const pressed=(input,key)=>key==='forward'?input.x===facing&&!input.up&&!input.down:key==='back'?input.x===-facing&&!input.up&&!input.down:!!input[key];
    let finished=false,holdUp=false;
    for(const offer of offers.filter(o=>o.target===selected.target)){
     const trigger=scope.NATIVE_FINISHERS[offer.profile].trigger;
     if(offer.started!==null&&this.elapsed-offer.started>trigger.commandWindow){offer.position=0;offer.started=null;}
     const step=trigger.steps[offer.position];
     if(pressed(now,step)&&!pressed(old,step)){
      offer.started??=this.elapsed;offer.position++;
      if(offer.position===trigger.steps.length){
       const gap=Math.abs(target.x-owner.x);offer.position=0;offer.started=null;
       if(gap>=trigger.minDistance&&gap<=trigger.maxDistance&&this.beginFinisher(owner,target,offer.profile)){
        this.finishOffers=this.finishOffers.filter(o=>o.target!==target.index);finished=true;break;
       }
      }
     }
     if(trigger.steps[offer.position-1]==='up'&&now.up)holdUp=true;
    }
    if(finished)adjusted[owner.index]={};else if(holdUp)adjusted[owner.index]={...now,up:false};
   }
   return adjusted;
  }
  applyCinematic(c,profile){
   const row=profile.frames[c.frame],owner=this.players[c.owner],target=this.players[c.target];
   for(const [p,key,sign] of [[owner,'owner',1],[target,'victim',-1]]){
    const actor=row.logicalActors?.[key],pose=actor?.stageAlignedWorldFromOwnerInitial;
    if(actor?.present&&pose){p.x=c.originX+pose.x*c.facing*(profile.origin.sourceFacing||1);p.y=c.originY+pose.feetY;}
    p.facing=c.facing*sign;p.buffer=[];p.history=[];p.frozenEdges=[];
   }
  }
  updatePlayer(p,dt){if(this.protectedPair(p)){p.buffer=[];p.frozenEdges=[];return;}super.updatePlayer(p,dt);}
  resolvePositions(){
   if(this.players.length===2&&this.cinematics?.length)return;
   const held=(this.cinematics||[]).flatMap(c=>[c.owner,c.target]).map(i=>({p:this.players[i],x:this.players[i].x,y:this.players[i].y,facing:this.players[i].facing}));
   super.resolvePositions();for(const h of held)Object.assign(h.p,{x:h.x,y:h.y,facing:h.facing});
  }
  endRound(reason){if((this.cinematics||[]).length||reason==='ko'&&this.finishOffers?.length)return;super.endRound(reason);}
  step(dt,inputs){
   if(!(dt>0&&dt<=.05))throw Error('Invalid simulation step');
   super.step(dt,this.processFinishInputs(inputs));
   // Other combat continues. Activation hitstop may pause this pair, but this
   // cinematic never creates a global stop for uninvolved participants.
   for(const c of [...(this.cinematics||[])]){
    const profile=scope.NATIVE_FINISHERS[c.profile];c.time+=dt;c.frame=Math.floor(c.time*profile.nativeFps+1e-9);
    if(c.frame>=profile.frames.length){
     const owner=this.players[c.owner],target=this.players[c.target];this.cinematics=this.cinematics.filter(p=>p.id!==c.id);
     for(const p of [owner,target]){
      p.y=0;p.airborne=false;p.motion=null;p.buffer=[];p.frozenEdges=[];p.history=[];p.stun=0;p.guardStun=0;p.knockdown=0;
      this.state(p,p.health>0?'idle':'ko');
     }
     this.emit('finisherEnd',{player:owner.index,target:target.index,profile:c.profile});
    }else this.applyCinematic(c,profile);
   }
  }
  snapshot(){return {...super.snapshot(),cinematics:(this.cinematics||[]).map(c=>({...c})),finishOffers:this.visibleFinishOffers()};}
  visibleFinishOffers(){return (this.finishOffers||[]).filter(o=>o.opens<=this.elapsed&&o.expires>this.elapsed).map(({owner,target,profile,expires})=>({owner,target,profile,expires}));}
 }
 scope.FightArena=FinisherArena;
})(typeof window==='undefined'?globalThis:window);
