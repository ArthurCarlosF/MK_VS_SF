/* Reusable SF charge, mash, rotation, chord, hold and continuation support. */
(function(s){
 'use strict';
 const C=s.FightCommands,record=C.record,action=C.action;
 const buttonFamilies={punch:['punch','punch2','punch3'],kick:['kick','kick2','kick3']};
 const held=(input,kind,facing)=>kind==='back'?input.x===-facing:kind==='down'?input.down:input.down&&input.x===-facing;
 C.record=function(p,input,time,def){
  const previous=p.previousInput||{};record(p,input,time,def);
  if(!def.sfSpecialCommands)return;
  p.sfCharges ||= {};p.sfChargeReleases ||= {};p.sfButtonHolds ||= {};p.sfChordHolds ||= {};p.sfChordReleases={};
  p.sfPresses=(p.sfPresses||[]).filter(e=>time-e.time<.8);
  for(const kind of ['back','down','downBack']){
   if(held(input,kind,p.facing)){if(p.sfCharges[kind]===undefined)p.sfCharges[kind]=time;}
   else if(p.sfCharges[kind]!==undefined){
    const duration=time-p.sfCharges[kind],old=p.sfChargeReleases[kind];
    if(duration>=.8||!old||time-old.time>.65)p.sfChargeReleases[kind]={time,duration};
    delete p.sfCharges[kind];
   }
  }
  for(const button of [...buttonFamilies.punch,...buttonFamilies.kick]){
   if(input[button]&&!previous[button]){p.sfPresses.push({button,time});p.sfButtonHolds[button]=time;}
   if(!input[button])delete p.sfButtonHolds[button];
  }
  for(const [family,buttons] of Object.entries(buttonFamilies)){
   if(buttons.every(b=>input[b]))p.sfChordHolds[family]??=time;
   else if(p.sfChordHolds[family]!==undefined){p.sfChordReleases[family]=time-p.sfChordHolds[family];delete p.sfChordHolds[family];}
  }
  if(!p.airborne&&input.up&&def.sfSpecialCommands.some(command=>matches(p,command.sfInput,time,true)))p.jumpPressed=false;
 };
 function motion(p,sequence,time){
  if(!sequence.length)return true;
  const history=p.history.filter(e=>e.code!==5&&e.time>=(p.sfConsumed??-1));
  const tail=history.slice(-sequence.length);
  return tail.length===sequence.length&&sequence.every((v,i)=>tail[i].code===v)&&time-tail[0].time<=1.1&&time-tail.at(-1).time<=.25;
 }
 function rotation(p,count,time){
  const list=p.history.filter(e=>[2,4,6,8].includes(e.code)&&e.time>=(p.sfConsumed??-1)&&time-e.time<1.1).map(e=>e.code);
  const tail=list.slice(-4*count);
  if(tail.length!==4*count)return false;
  return [ [6,2,4,8],[6,8,4,2] ].some(pattern=>[0,1,2,3].some(offset=>tail.every((code,i)=>code===pattern[(i+offset)%4])));
 }
 function matches(p,cfg,time,jumpCheck=false){
  if(!cfg)return false;
  if(cfg.parent){
   if(!p.action||p.action.time<.05||p.action.time>1.8)return false;
   if(p.sfActionFamily!==cfg.parent)return false;
  }else if(!!cfg.air!==p.airborne&&!jumpCheck)return false;
  if(cfg.automaticLanding)return false;
  if(cfg.nearTarget&&p.opponentDistance>cfg.nearTarget)return false;
  if(cfg.grabBand==='head'&&p.y-(p.sfTargetHeight||0)<45)return false;
  if(cfg.grabBand==='waist'&&p.y-(p.sfTargetHeight||0)>=45)return false;
  if(cfg.directionCharge){
   const charge=p.sfChargeReleases?.[cfg.directionCharge];
   if(!charge||charge.duration+1/240<cfg.chargeSeconds||time-charge.time>.65)return false;
  }
  if(cfg.rotation&&!rotation(p,cfg.rotation,time))return false;
  const heldKickContinuation=cfg.buttonHold&&['inazumakick','forwardstepkick','thunderkick'].includes(p.sfActionFamily);
  if(cfg.sequence?.length&&!heldKickContinuation&&!motion(p,cfg.sequence,time))return false;
  if(cfg.holdChord)return (p.sfChordReleases?.[cfg.holdChord[0]==='punch'?'punch':'kick']||0)>=cfg.holdSeconds;
  if(cfg.mash)return p.buffer.some(e=>e.button===cfg.button&&!e.release)&&(p.sfPresses||[]).filter(e=>cfg.mash.includes(e.button)&&time-e.time<.55&&e.time>(p.sfConsumed??-1)).length>=4;
  if(cfg.buttonHold)return p.input[cfg.button]&&time-(p.sfButtonHolds?.[cfg.button]??time)>=cfg.buttonHold&&p.sfHeldConsumed!==p.sfButtonHolds[cfg.button];
  if(cfg.chord)return cfg.chord.every(b=>p.input[b])&&p.buffer.some(e=>cfg.chord.includes(e.button)&&!e.release);
  return p.buffer.some(e=>e.button===cfg.button);
 }
 C.action=function(p,def,time){
  const candidates=(def.sfSpecialCommands||[]).filter(c=>matches(p,c.sfInput,time));
  candidates.sort((a,b)=>{
   const score=c=>(def.moves[c.move].meterCost?100:0)+(c.sfInput.parent?80:0)+(c.sfInput.buttonHold?60:0)+(def.moves[c.move].grapple?10:0)+(c.sfInput.chord?30:0)+(c.sfInput.sequence?.length||0);
   return score(b)-score(a);
  });
  const selected=candidates.find(c=>{
   const m=def.moves[c.move];
   return (!m.meterCost||p.meter>=m.meterCost)&&(!m.grapple||p.opponentDistance<=m.grapple.range);
  });
  if(selected)return {move:selected.move,event:{button:selected.sfInput.button||'sfSpecial',time,sfSpecial:true}};
  return action(p,def,time);
 };
 const Base=s.FightArena;
 class SfSpecialArena extends Base{
  canStart(p,name){
   const m=this.definition(p).moves[name];
   if(!m?.sfInput)return super.canStart(p,name);
   if(m.sfParent&&p.sfActionFamily!==m.sfParent)return false;
   if(p.action){
    const previous=this.definition(p).moves[p.action.name];
    const continuation=m.sfParent===previous.sfFamily||m.sfRekka&&previous.sfRekka&&p.action.time>=.08&&(p.sfRekkaStage||1)<3||m.sfInput.buttonHold;
    if(!continuation&&previous.kind!=='strike')return false;
    const old=p.action;p.action=null;
    try{return super.canStart(p,name);}finally{p.action=old;}
   }
   return super.canStart(p,name);
  }
  requestAction(p,request){
   if(this.definition(p).moves[request.move]?.sfInput)return this.startAction(p,request.move);
   return super.requestAction(p,request);
  }
  startAction(p,name,...args){
   const m=this.definition(p).moves[name],previous=p.action,previousFamily=p.sfActionFamily;
   const result=super.startAction(p,name,...args);
   if(result&&m?.sfInput){
    p.sfRekkaStage=m.sfRekka?(previous&&previousFamily==='rekkaken'?(p.sfRekkaStage||1)+1:1):0;
    p.sfActionFamily=m.sfFamily;p.sfConsumed=this.elapsed;
    if(m.sfInput.buttonHold)p.sfHeldConsumed=p.sfButtonHolds?.[m.sfInput.button];
    if(m.sfInput.directionCharge&&p.sfChargeReleases)delete p.sfChargeReleases[m.sfInput.directionCharge];
   }
   return result;
  }
  grappleHeightMatches(owner,target,config){
   if(config.allowOwnerAir)return owner.y<190&&Math.abs(owner.y-target.y)<160;
   return super.grappleHeightMatches(owner,target,config);
  }
  hit(a,b,move,name){
   if(move.sfRekka&&a.sfRekkaStage>1)move={...move,damage:move.damage*(1+(a.sfRekkaStage-1)*.1)};
   return super.hit(a,b,move,name);
  }
  updatePlayer(p,dt){
   const old=p.action,m=old&&this.definition(p).moves[old.name];
   p.sfTargetHeight=this.opponent(p).y;
   if(m?.sfInput?.holdRelease&&p.input[m.sfInput.button]&&old.time>.18&&old.wallTime<2)old.time-=dt;
   super.updatePlayer(p,dt);
   if(m?.sfRunningGrab&&p.action===old&&old.time>.1){
    const target=this.opponent(p);
    if(target.health>0&&Math.abs(target.x-p.x)<75&&Math.abs(target.y-p.y)<100)this.startAction(p,m.sfRunningGrab);
   }
   if(m?.sfAutoLanding&&(!p.action||p.action===old)&&old.time>.25&&p.y<20&&p.health>0&&p.stun<=0){p.y=0;p.airborne=false;this.startAction(p,m.sfAutoLanding);}
   if(old&&m?.sfInput&&!p.action&&p.y>0){p.airborne=true;p.motion ||=s.FightMovement.init(this,p);p.motion.reactionFall={velocity:0};}
   if(!p.action)p.sfActionFamily=null;
  }
 }
 s.FightArena=SfSpecialArena;
})(typeof window==='undefined'?globalThis:window);
