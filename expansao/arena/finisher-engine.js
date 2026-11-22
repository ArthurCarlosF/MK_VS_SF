/* Pair-scoped cinematics. A guide entry alone cannot activate an uncaptured film. */
(function(scope){
 'use strict';
 const Base=scope.FightArena;
 class FinisherArena extends Base{
  startRound(){super.startRound();this.cinematics=[];this.finishOffers=[];this.finishInputs=[];this.finishReleases=this.players.map(()=>({}));this.finisherBlockUsed=this.players.map(()=>false);this.mercyOffers=[];this.mercyPairs=[];this.mercyInputs=[];}
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
  triggerFor(owner,profile){return profile?.triggerByOwner?.[owner.id]||profile?.trigger;}
  provenProfile(owner,target,profileId){
   const profile=Object.hasOwn(scope.NATIVE_FINISHERS||{},profileId)?scope.NATIVE_FINISHERS[profileId]:null;
   if(!profile||!/^umk3(?:[-_]|$)/.test(profile.game||'')||!/^[a-f0-9]{64}$/.test(profile.captureSha256||''))return null;
   if(!profile.verifiedCapture&&!((profile.nativeCommandAccepted||profile.nativeRoutineObserved)&&profile.visualReview==='experimental'))return null;
   if(profile.syntheticFixture&&!this.options.allowFixtureCinematics)return null;
   if(!profile.terminal?.fullNativePostCinemaLifecycleCaptured||!Array.isArray(profile.frames)||!profile.frames.length||!(profile.nativeFps>0&&profile.nativeFps<=120))return null;
   const exactPair=profile.provenPairs?.some(p=>p.owner===owner.id&&p.victim===target.id);
   const adaptedPair=profile.adaptVictim&&profile.provenPairs?.some(p=>p.owner===owner.id)&&this.bank[target.id];
   const adaptedOwner=profile.adaptOwners?.includes(owner.id)&&this.bank[owner.id]&&profile.adaptVictim&&this.bank[target.id];
   return exactPair||adaptedPair||adaptedOwner?profile:null;
  }
  beginFinisher(owner,target,profileId){
   if(!owner||!target||this.players[owner.index]!==owner||this.players[target.index]!==target)return false;
   const profile=this.provenProfile(owner,target,profileId);if(!profile)return false;
   const trigger=this.triggerFor(owner,profile);
   if(this.mode!=='versus'||this.phase!=='fight'||owner.health<=0||target.health>0||owner.index===target.index||this.teams[owner.index]===this.teams[target.index]||this.protectedPair(owner)||this.protectedPair(target))return false;
   if(owner.stun>0||owner.guardStun>0||owner.knockdown>0||owner.airborne||owner.action)return false;
   if(trigger?.requiresNoBlock&&this.finisherBlockUsed[owner.index])return false;
   if(trigger?.stages&&!trigger.stages.includes(this.stageId))return false;
   if(trigger?.requiresMercy&&!this.mercyPairs.some(p=>p.owner===owner.index&&p.target===target.index))return false;
   if(trigger?.requireGroundedVictim&&(target.y>.01||Math.abs(target.vy)>.01))return false;
   if(this.tethers.some(q=>q.owner===owner.index||q.target===owner.index)||this.grapples.some(q=>q.owner===owner.index||q.target===owner.index))return false;
   const facing=Math.sign(target.x-owner.x)||owner.facing;
   const c={id:++this.serial,profile:profileId,owner:owner.index,target:target.index,time:0,frame:0,facing,originX:owner.x,originY:owner.y,victimFighter:target.id,
    adaptVictim:!profile.provenPairs.some(p=>p.victim===target.id),ownerFighter:owner.id,
    adaptOwner:!profile.provenPairs.some(p=>p.owner===owner.id)};
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
   const mercyUsed=this.mercyPairs.some(p=>p.target===target.index);
   if((scope.MK_FINISHER_STATUS?.mercyOwners?.includes(owner.id)||owner.id==='scorpion'||owner.id==='mk-4')&&!mercyUsed&&!this.mercyOffers.some(p=>p.target===target.index)&&(this.players.length>2||this.wins.every(w=>w>0)))this.mercyOffers.push({owner:owner.index,target:target.index,opens:this.elapsed+2/53.20494842529297,expires:this.elapsed+170/53.20494842529297,heldSince:null,downs:[],releasedAt:null});
   for(const id of Object.keys(scope.NATIVE_FINISHERS||{})){
    const trigger=this.triggerFor(owner,this.provenProfile(owner,target,id));
    if(!(trigger?.nativeTimingVerified||trigger?.nativeCommandObserved||trigger?.commandImplemented)||!trigger.steps?.length||!trigger.steps.every(k=>['forward','back','up','down','run','block','punch','punch2','kick','kick2'].includes(k)))continue;
    if(![trigger.delay,trigger.window,trigger.commandWindow,trigger.minDistance,trigger.maxDistance].every(Number.isFinite)||trigger.delay<0||trigger.window<=0||trigger.commandWindow<=0||trigger.maxDistance<trigger.minDistance)continue;
    if(trigger.stages&&!trigger.stages.includes(this.stageId))continue;
    if(trigger.requiresNoBlock&&this.finisherBlockUsed[owner.index])continue;
    if(trigger.requiresMercy&&!this.mercyPairs.some(p=>p.owner===owner.index&&p.target===target.index))continue;
    if(this.players.length===2&&trigger.finalRoundOnly&&this.wins[owner.index]+1<this.rules.roundsToWin)continue;
    const opens=this.elapsed+trigger.delay,expires=opens+trigger.window;
    this.finishOffers.push({owner:owner.index,target:target.index,profile:id,opens,expires,position:0,started:null});
   }
  }
  processFinishInputs(inputs){
   this.processMercyInputs(inputs);
   if(!scope.NATIVE_FINISHERS)return inputs;
   const prior=this.finishInputs;this.finishInputs=this.players.map((_,i)=>scope.FightCommands.normalize(inputs?.[i]));
   const physical=(input,key)=>key==='left'?input.x===-1:key==='right'?input.x===1:!!input[key];
   const directions=['left','right','up','down'];
   for(const [i,now] of this.finishInputs.entries())for(const key of directions){
    if(physical(prior[i]||{},key)&&!physical(now,key))this.finishReleases[i][key]=this.elapsed;
   }
   this.finishOffers=this.finishOffers.filter(o=>o.expires>this.elapsed&&this.players[o.owner].health>0&&this.players[o.target].health<=0&&
     !(this.triggerFor(this.players[o.owner],scope.NATIVE_FINISHERS[o.profile]).requiresNoBlock&&this.finisherBlockUsed[o.owner]));
   if(this.phase!=='fight'||!this.finishOffers.length)return inputs;
   const adjusted=Array.from(inputs||[]);
   for(const owner of this.players){
    if(this.protectedPair(owner))continue;
    const offers=this.finishOffers.filter(o=>o.owner===owner.index&&o.opens<=this.elapsed).sort((a,b)=>Math.abs(this.players[a.target].x-owner.x)-Math.abs(this.players[b.target].x-owner.x)||a.target-b.target);
    const selected=offers[0];if(!selected)continue;
    const target=this.players[selected.target],facing=Math.sign(target.x-owner.x)||owner.facing;
    const now=this.finishInputs[owner.index],old=prior[owner.index]||{};
    const pressed=(input,key)=>key==='forward'?input.x===facing&&!input.up&&!input.down:key==='back'?input.x===-facing&&!input.up&&!input.down:!!input[key];
    const relativeDirs=['forward','back','up','down'];
    const physicalKey=key=>key==='forward'?facing===1?'right':'left':key==='back'?facing===1?'left':'right':key;
    let finished=false,holdUp=false;
    for(const offer of offers.filter(o=>o.target===selected.target).sort((a,b)=>this.triggerFor(owner,scope.NATIVE_FINISHERS[b.profile]).steps.length-this.triggerFor(owner,scope.NATIVE_FINISHERS[a.profile]).steps.length)){
     const trigger=this.triggerFor(owner,scope.NATIVE_FINISHERS[offer.profile]);
     if(offer.started!==null&&this.elapsed-offer.started>trigger.commandWindow){offer.position=0;offer.started=null;offer.held=[];}
     const step=trigger.steps[offer.position];
     const inputStep=trigger.inputSteps?.[offer.position];
     const keys=inputStep?.inputs||[step];
     const edge=inputStep?.action==='release'?keys.every(k=>!pressed(now,k))&&keys.some(k=>pressed(old,k)):
      keys.every(k=>pressed(now,k))&&keys.some(k=>!pressed(old,k));
     if((offer.held||[]).some(k=>!pressed(now,k)&&!(inputStep?.action==='release'&&keys.includes(k)))){
      offer.position=0;offer.started=null;offer.held=[];continue;
     }
     const release=this.finishReleases[owner.index][physicalKey(step)];
     const releasedLongEnough=release===undefined||this.elapsed-release+1e-8>=(trigger.minDirectionReleaseSeconds||0);
     if((trigger.blockHeldThroughout||trigger.holdBlockDirections&&offer.position<trigger.steps.length-1)&&!now.block){
      offer.position=0;offer.started=null;continue;
     }
     if(trigger.strictDirectionQueue&&relativeDirs.some(k=>k!==step&&pressed(now,k)&&!pressed(old,k))){
      offer.position=0;offer.started=null;
      const first=trigger.steps[0],since=this.finishReleases[owner.index][physicalKey(first)];
      if(pressed(now,first)&&!pressed(old,first)&&(since===undefined||this.elapsed-since+1e-8>=(trigger.minDirectionReleaseSeconds||0))){offer.position=1;offer.started=this.elapsed;}
     }else if(edge&&releasedLongEnough){
      if(inputStep?.action==='hold')offer.held=[...new Set([...(offer.held||[]),...keys])];
      if(inputStep?.action==='release')offer.held=(offer.held||[]).filter(k=>!keys.includes(k));
      offer.started??=this.elapsed;offer.position++;
      if(offer.position===trigger.steps.length){
       const gap=trigger.integerRootDistance?Math.abs(Math.trunc(target.x)-Math.trunc(owner.x)):Math.abs(target.x-owner.x);
       const finalButtonClear=!trigger.onlyFinalButton||!['punch','punch2','kick','kick2','block','run'].some(k=>k!==step&&now[k]);
       offer.position=0;offer.started=null;
       if(finalButtonClear&&(!trigger.holdBlockDirections||!old.block)&&gap>=trigger.minDistance&&gap<=trigger.maxDistance&&this.beginFinisher(owner,target,offer.profile)){
        this.finishOffers=this.finishOffers.filter(o=>o.target!==target.index);finished=true;break;
       }
      }
     }
     if(trigger.steps[offer.position-1]==='up'&&now.up)holdUp=true;
    }
    if(finished||offers.some(o=>this.triggerFor(owner,scope.NATIVE_FINISHERS[o.profile]).commandImplemented&&o.position>0))adjusted[owner.index]={};else if(holdUp)adjusted[owner.index]={...now,up:false};
   }
   return adjusted;
  }
  processMercyInputs(inputs){
   const fps=53.20494842529297,prior=this.mercyInputs;
   this.mercyInputs=this.players.map((_,i)=>scope.FightCommands.normalize(inputs?.[i]));
   this.mercyOffers=(this.mercyOffers||[]).filter(o=>this.phase==='fight'&&o.expires>this.elapsed&&this.players[o.owner].health>0&&this.players[o.target].health<=0&&!this.protectedPair(this.players[o.target]));
   for(const o of [...this.mercyOffers]){
    const owner=this.players[o.owner],target=this.players[o.target],now=this.mercyInputs[o.owner],old=prior[o.owner]||{};
    if(this.elapsed<o.opens||this.protectedPair(owner))continue;
    if(now.run&&!old.run){o.heldSince=this.elapsed;o.downs=[];}
    if(old.down&&!now.down)o.releasedAt=this.elapsed;
    if(now.run&&now.down&&!old.down&&(o.releasedAt===null||this.elapsed-o.releasedAt+1e-8>=2/fps))o.downs.push(this.elapsed);
    if(now.x||now.up){o.downs=[];}
    if(old.run&&!now.run){
     const distance=Math.abs(Math.trunc(target.x)-Math.trunc(owner.x));
     const accepted=o.heldSince!==null&&this.elapsed-o.heldSince+1e-8>=48/fps&&o.downs.length===2&&this.elapsed-o.downs[0]<=40/fps+1e-8&&distance>=160;
     o.heldSince=null;o.downs=[];
     if(!accepted||owner.airborne||owner.action||owner.stun>0||owner.guardStun>0||owner.knockdown>0)continue;
     // Native Mercy restores five of the arcade's 166 health units. The
     // crossover keeps each game's normal health scale.
     this.mercyPairs.push({owner:owner.index,target:target.index});
     target.health=this.rules.health*5/166;target.finisherRemoved=false;
     Object.assign(target,{y:0,vy:0,vx:0,airborne:false,action:null,reaction:null,stun:0,guardStun:0,knockdown:0,localHitstop:0,buffer:[],history:[],frozenEdges:[]});
     this.state(target,'idle');
     this.finishOffers=this.finishOffers.filter(q=>q.target!==target.index);
     this.mercyOffers=this.mercyOffers.filter(q=>q.target!==target.index);
     this.emit('mercy',{player:owner.index,target:target.index});
    }
   }
  }
  applyCinematic(c,profile){
   const row=profile.frames[c.frame],owner=this.players[c.owner],target=this.players[c.target];
   if(row.detachedNativeScene){for(const p of [owner,target]){p.buffer=[];p.history=[];p.frozenEdges=[];}return;}
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
  endRound(reason){if((this.cinematics||[]).length||reason==='ko'&&(this.finishOffers?.length||this.mercyOffers?.length))return;super.endRound(reason);}
  step(dt,inputs){
   if(!(dt>0&&dt<=.05))throw Error('Invalid simulation step');
   if(this.phase==='fight'){
    this.players.forEach((player,index)=>{
     if(player.health>0&&!this.protectedPair(player)&&!this.finishOffers.some(o=>o.owner===index&&o.expires>this.elapsed)&&inputs?.[index]?.block)this.finisherBlockUsed[index]=true;
    });
   }
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
     if(profile.terminal.victimRemoved)target.finisherRemoved=true;
     this.emit('finisherEnd',{player:owner.index,target:target.index,profile:c.profile});
    }else this.applyCinematic(c,profile);
   }
  }
  snapshot(){return {...super.snapshot(),cinematics:(this.cinematics||[]).map(c=>({...c})),finishOffers:this.visibleFinishOffers()};}
  visibleFinishOffers(){return (this.finishOffers||[]).filter(o=>o.opens<=this.elapsed&&o.expires>this.elapsed).map(({owner,target,profile,expires})=>({owner,target,profile,expires}));}
 }
 scope.FightArena=FinisherArena;
})(typeof window==='undefined'?globalThis:window);
