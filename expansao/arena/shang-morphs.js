/* Complete guide morph set; crossover timings, not original-game validation. */
(function(scope){
 'use strict';
 const catalog=scope.SHANG_MORPHS,def=scope.FIGHT_DATA.characters['mk-12'];
 for(const form of catalog)def.moves[form.move]={kind:'morph',clip:'idle',startup:.25,active:0,recovery:.25,damage:0,hitboxes:[],morphTarget:form.target};
 const Commands=scope.FightCommands,record=Commands.record,action=Commands.action;
 Commands.record=function(p,input,time,definition){
  const previous=p.previousInput||{};
  record(p,input,time,definition);
  p.morphRequest=null;
  if(p.morphBase&&time>=p.morphExpires)p.jumpPressed=false;
  if(p.id!=='mk-12'||p.morphBase)return;
  const edges=[];
  if(input.x&&input.x!==previous.x)edges.push(input.x===p.facing?'forward':'back');
  for(const key of ['down','up','punch','punch2','kick','kick2','block','run'])if(input[key]&&!previous[key])edges.push(key);
  p.morphHistory=(p.morphHistory||[]).filter(e=>time-e.time<1.4);
  if(edges.length)p.morphHistory.push({inputs:edges,time});
  for(const form of catalog){
   const events=p.morphHistory.slice(-form.sequence.length);
   if(events.length!==form.sequence.length||events.at(-1)?.time!==time)continue;
   if(form.sequence.every((step,i)=>step.every(key=>events[i].inputs.includes(key)))&&events.every((e,i)=>!i||e.time-events[i-1].time<=.4)){
    p.morphRequest=form.move;p.morphHistory=[];break;
   }
  }
  // Holding Block permits the original Up motions without an unwanted jump.
  if(input.block||p.morphRequest)p.jumpPressed=false;
 };
 Commands.action=function(p,definition,time){
  if(p.morphRequest&&!p.airborne)return {move:p.morphRequest,event:{button:'morph',time}};
  return action(p,definition,time);
 };
 const Base=scope.FightArena;
 class MorphArena extends Base{
  requestAction(p,request){
   if(this.definition(p).moves[request.move]?.morphTarget)return this.startAction(p,request.move);
   return super.requestAction(p,request);
  }
  canStart(p,name){
   if(p.morphBase&&this.elapsed>=p.morphExpires)return false;
   if(!this.definition(p).moves[name]?.morphTarget)return super.canStart(p,name);
   if(p.id!=='mk-12'||p.morphBase||p.morphCast||this.hasMorphDependents(p))return false;
   const saved=p.action;
   // Button-only morph sequences can finish a normal already begun by LP/HK.
   if(saved&&! /^(stand_|crouch_|near_|air_|back_|sweep$)/.test(saved.name))return false;
   p.action=null;
   try{return super.canStart(p,name);}finally{p.action=saved;}
  }
  hasMorphDependents(p){
   return this.projectiles.some(q=>q.owner===p.index)||this.tethers.some(q=>q.owner===p.index||q.target===p.index)||this.grapples.some(q=>q.owner===p.index||q.target===p.index)||!!this.protectedPair?.(p);
  }
  startAction(p,name,...args){
   const target=this.definition(p).moves[name]?.morphTarget;
   const started=super.startAction(p,name,...args);
   if(started&&target){p.morphCast={target,move:name};p.flash=.25;}
   return started;
  }
  changeForm(p,id,returning=false){
   const from=p.id,health=p.health,meter=p.meter;
   p.id=id;p.action=null;p.motion=null;p.reaction=null;p.y=0;p.airborne=false;p.vx=0;p.vy=0;
   p.state='idle';p.frame=0;p.clock=0;p.stateTime=0;p.motionTick=0;
   p.history=[];p.buffer=[];p.frozenEdges=[];p.chargeStarted={};p.morphHistory=[];p.morphRequest=null;
   p.invisible=false;p.projectileImmuneUntil=0;p.flash=.25;p.morphCast=null;
   if(returning){p.morphBase=null;p.morphExpires=0;}else{p.morphBase=from;p.morphExpires=this.elapsed+8;}
   p.health=health;p.meter=meter;
   this.emit('morph',{player:p.index,from,to:id,returning});
  }
  updatePlayer(p,dt){
   super.updatePlayer(p,dt);
   if(p.morphCast){
    if(p.health<=0||p.stun>0||p.guardStun>0||p.knockdown>0||p.reaction||p.frozenUntil>this.elapsed)p.morphCast=null;
    else if(!p.action&&!this.hasMorphDependents(p))this.changeForm(p,p.morphCast.target);
   }
   // Finish the current attack, projectile or paired animation before reverting.
   if(p.morphBase&&this.elapsed>=p.morphExpires&&!p.action&&!p.airborne&&!p.reaction&&p.stun<=0&&p.guardStun<=0&&p.knockdown<=0&&!(p.frozenUntil>this.elapsed)&&!this.hasMorphDependents(p))this.changeForm(p,p.morphBase,true);
  }
 }
 scope.FightArena=MorphArena;
})(typeof window==='undefined'?globalThis:window);
