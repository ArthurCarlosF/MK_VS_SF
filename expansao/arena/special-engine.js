/* Optional special-move policies. Native freeze witnesses: sondas-pausa-super-r2. */
(function(scope){
 'use strict';
 const Base=scope.FightArena;
 class SpecialArena extends Base{
  startRound(){super.startRound();this.superFreeze=null;this._freezing=false;}
  payMoveCost(p){
   const a=p.action,m=a&&this.definition(p).moves[a.name];
   if(!m?.meterCost||a.meterSpent||a.time+1e-9<(m.meterCostSample||0)/(m.sampleRate||this.bank[p.id].fps))return;
   a.meterSpent=true;p.meter=Math.max(0,p.meter-m.meterCost);this.emit('meterSpent',{player:p.index,move:a.name,amount:m.meterCost});
  }
  advanceAirSpecial(p,m,dt){
   const a=p.action,c=m.airPhysics;
   p.motion ||= scope.FightMovement.init(this,p);
   if(a.landed)return;
   if(!a.airMotion){
    const kind=p.jumpKind||'jump',table=c.jumpVelocities[kind]||c.jumpVelocities.jump;
    const sample=Math.max(0,Math.min(table.length-1,(p.motion?.jumpAge||1)-1)),v=table[sample];
    a.airMotion={vx:v.vx*(p.motion?.jumpFacing||p.facing),vy:v.vy,drag:v.drag,gravity:c.normalGravity,clock:0,ticks:0,boosted:false,floatLeft:0};
   }
   const b=a.airMotion;b.clock+=dt;
   while(b.clock+1e-9>=1/c.updateRate){
    b.clock-=1/c.updateRate;
    if(!b.boosted&&a.time+1e-9>=c.commitSample/m.sampleRate){
     b.boosted=true;
     if(b.vy>0){b.vx+=c.boost*(Math.sign(b.vx)||a.initialFacing);b.gravity=c.floatGravity;b.floatLeft=c.floatTicks;}
    }
    b.vy-=b.gravity;
    if(b.vx)b.vx-=Math.sign(b.vx)*Math.min(Math.abs(b.vx),b.drag);
    p.x+=b.vx/256*c.scale;p.y+=b.vy/256*c.scale;b.ticks++;
    if(b.floatLeft>0&&!--b.floatLeft)b.gravity=c.normalGravity;
    if(p.y<=0&&b.vy<0){
     this.beginActionLanding(p,m);break;
    }
    p.airborne=true;
   }
  }
  step(dt,inputs){
   if(!(dt>0&&dt<=.05))throw Error('Invalid simulation step');
   if(this.superFreeze?.remaining<=1e-9)this.superFreeze=null;
   if(this.phase==='fight'&&!this.hitstop&&!this.superFreeze){
    const owners=this.players.filter(p=>{
     const a=p.action,m=a&&this.definition(p).moves[a.name];
     return p.health>0&&p.stun<=0&&p.localHitstop<=1e-9&&m?.freezeWindow&&!a.freezeStarted&&a.time+dt+1e-9>=m.freezeWindow.start;
    });
    if(owners.length){
     let duration=0,inputLead=0;
     for(const p of owners){const a=p.action,f=this.definition(p).moves[a.name].freezeWindow;a.freezeStarted=true;duration=Math.max(duration,f.duration);inputLead=Math.max(inputLead,f.inputLead||0);}
     this.superFreeze={owners:owners.map(p=>p.index),remaining:duration,duration,inputLead};
     this.emit('superFreeze',{players:[...this.superFreeze.owners],duration});
    }
   }
   this._freezing=this.phase==='fight'&&this.superFreeze?.remaining>1e-9;
   if(!this._freezing){super.step(dt,inputs);return;}
   // Native FF8DCE continues counting during super activation. Only bodies,
   // animation of other actors and projectiles freeze; the round clock runs.
   const saved={camera:this.camera,cameraY:this.cameraY,effects:this.effects.map(e=>({...e})),hitstop:this.hitstop};
   this._freezeHistories=this.players.map(p=>p.history.map(e=>({...e})));this.hitstop=0;
   super.step(dt,inputs);
   this.camera=saved.camera;this.cameraY=saved.cameraY;this.effects=saved.effects;this.hitstop=saved.hitstop;
   this.superFreeze.remaining=Math.max(0,this.superFreeze.remaining-dt);this._freezing=false;
  }
  updatePlayer(p,dt){
   if(!this._freezing){super.updatePlayer(p,dt);this.payMoveCost(p);return;}
   if(this.superFreeze.owners.includes(p.index)){
    const a=p.action;
    if(a){a.time+=dt;this.payMoveCost(p);this.state(p,this.definition(p).moves[a.name].clip);this.animation(p,dt);}
    p.buffer=[];p.frozenEdges=[];return;
   }
   // Parser timers stop; physical button edges continue to be sampled. Early
   // presses are consumed, including a button held across the whole freeze.
   p.history=this._freezeHistories[p.index].map(e=>({...e,time:e.time+dt}));
   if(p.motionConsumedAt>=0)p.motionConsumedAt+=dt;
   if(p.action){p.action.wallTime=Math.max(0,p.action.wallTime-dt);p.action.startedAt+=dt;}
   const lead=this.superFreeze.inputLead;
   p.frozenEdges=this.superFreeze.remaining<=lead+dt+1e-9?p.buffer.filter((e,i,a)=>this.elapsed-e.time<=lead+dt&&a.findIndex(v=>v.button===e.button&&v.release===e.release)===i):[];
   p.buffer=[];
  }
  updateTethers(dt){if(!this._freezing)super.updateTethers(dt);}
  updateGrapples(){if(!this._freezing)super.updateGrapples();}
  resolvePositions(){if(!this._freezing)super.resolvePositions();}
  collisions(dt){if(!this._freezing)super.collisions(dt);}
  endRound(reason){if(!this._freezing)super.endRound(reason);}
  snapshot(){return {...super.snapshot(),superFreeze:this.superFreeze?{...this.superFreeze,owners:[...this.superFreeze.owners]}:null};}
 }
 scope.FightArena=SpecialArena;
})(typeof window==='undefined'?globalThis:window);
