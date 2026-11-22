/* Character input policies are supported by comparacao/passo-2 evidence.
 * Browser key repeat is never an attack edge. Failed normals are not queued. */
(function(scope){
 'use strict';
 const normals=['punch','punch2','punch3','kick','kick2','kick3'];
 const buttons=[...normals,'special','throw','teleport'];
 function normalize(value){
  if(typeof value==='number')return {x:Math.sign(value),down:false,up:false};
  const v=value||{},out={x:Math.sign(v.x||0),down:!!v.down,up:!!v.up};
  for(const key of [...buttons,'block','run'])out[key]=!!v[key];return out;
 }
 function direction(input,facing){const x=input.x*facing;return input.down?(x>0?3:x<0?1:2):input.up?(x>0?9:x<0?7:8):(x>0?6:x<0?4:5);}
 function record(player,input,time,definition={}){
  const code=direction(input,player.facing),prev=player.previousInput||{},policy=definition.inputPolicy||{};
  if(!player.history.length||player.history.at(-1).code!==code)player.history.push({code,time});
  player.history=player.history.filter(e=>time-e.time<.8);
  player.releasedAt ||= {};player.lastPressAt ||= {};
  player.chargeStarted ??= {};
  for(const command of definition.commands||[]){
   if(!command.chargeSeconds)continue;
   const key=command.button;
   if(input[key]&&!prev[key])player.chargeStarted[key]=time;
  }
  // Keep just this simulation tick's edges. Special repeat slots live on the
  // active action; they cannot become a later unrelated move.
  player.buffer=[];
  for(const button of buttons){
   if(!input[button]&&prev[button]){player.releasedAt[button]=time;if(policy.negativeEdge&&(policy.negativeEdgeButtons||['punch','punch2','punch3']).includes(button))player.buffer.push({button,time,release:true});}
   if(input[button]&&!prev[button]){
    const released=player.releasedAt[button];
    if(!normals.includes(button)||released===undefined||time-released+1/240+1e-8>=(policy.minimumReleaseSeconds||0)){
     player.buffer.push({button,time});player.lastPressAt[button]=time;
    }
   }
  }
  for(const command of definition.commands||[]){
   if(!command.chargeSeconds)continue;
   const key=command.button;
   if(prev[key]&&!input[key]){
    if(!!command.air!==player.airborne)continue;
    if(time-(player.chargeStarted[key]??time)>=command.chargeSeconds)
     player.buffer.push({button:key,time,release:true,chargedMove:command.move});
    delete player.chargeStarted[key];
   }
  }
  for(const button of ['run','block','up']){
   if(input[button]&&!prev[button]&&definition.commands?.some(command=>command.button===button||command.buttons?.includes(button)))
    player.buffer.push({button,time});
  }
  if(input.block&&!prev.block&&!player.buffer.some(e=>e.button==='block')&&
     definition.moves?.[player.action?.name]?.chainEdges?.some(e=>e.button==='block'))
    player.buffer.push({button:'block',time});
  if(definition.airThrow&&player.airborne&&input.block&&!prev.block)player.buffer.push({button:'airThrow',time});
  player.jumpPressed=policy.heldJump?input.up:input.up&&!prev.up;
  if(!player.airborne&&player.jumpPressed&&player.buffer.some(event=>event.button==='up')&&
     definition.commands?.some(command=>command.button==='up'&&!command.air&&motion(player,command,time)))player.jumpPressed=false;
  player.previousInput={...input};player.input=input;
 }
 function motion(player,command,time){
  const sequence=Array.isArray(command)?command:command.sequence;
  let list=player.history.filter(e=>e.time>=(player.motionConsumedAt??-1));
  if(command.allowNeutral)list=list.filter(e=>e.code!==5);
  // A button may follow forward + neutral, but unrelated directions invalidate
  // the motion. Neutral does not reset the timestamp of the required direction.
  while(list.at(-1)?.code===5)list.pop();
  if(list.length<sequence.length)return false;
  list=list.slice(-sequence.length);
  if(!sequence.every((v,i)=>list[i].code===v))return false;
  const limits=command.stageSeconds||[];
  for(let i=0;i<list.length-1;i++)if(list[i+1].time-list[i].time>= (limits[i]??command.windowSeconds??.25)-1e-8)return false;
  for(const span of command.spanWindows||[])if(list[span.to].time-list[span.from].time>=span.seconds-1e-8)return false;
  return time-list.at(-1).time<=(command.buttonSeconds??command.windowSeconds??.2)+1e-8;
 }
 function action(player,definition,time){
  const events=player.buffer;if(!events.length)return null;
  const charged=events.find(event=>event.chargedMove&&!!definition.moves[event.chargedMove]?.air===player.airborne);
  if(charged)return {move:charged.chargedMove,event:charged};
  const grab=events.find(event=>event.button==='airThrow');
  if(grab&&definition.airThrow)return {move:definition.airThrow,event:grab};
  // Dedicated crossover shortcuts take priority; native directional commands
  // precede normal attacks and may be activated on release in SF.
  for(const button of ['teleport','special','throw']){
   const event=events.find(e=>e.button===button&&!e.release);if(!event)continue;
   const move=button==='special'?definition.special:button==='teleport'?definition.teleport:(player.airborne?definition.airDefaultThrow:definition.defaultThrow)||'throw';
   if(move)return {move,event};
  }
  for(const command of definition.commands||[]){
   if(command.chargeSeconds)continue;
   const airborne=command.airborneByHeight?player.airborne&&player.y>.01:player.airborne;
   if(!!command.air!==airborne)continue;
   const chord=command.buttons;
   if(chord&&!chord.every(button=>player.input[button]))continue;
   const event=events.find(e=>(chord?chord.includes(e.button):e.button===(command.button||'punch'))&&(!e.release||!chord&&command.negativeEdge));
   if(event&&motion(player,command,time))return {move:command.move,event};
  }
  const comboBlock=events.find(e=>e.button==='block'&&!e.release);
  if(comboBlock&&definition.moves[player.action?.name]?.chainEdges?.some(e=>e.button==='block'))
    return {move:player.action.name,event:comboBlock};
  if(definition.guard==='button'&&player.input.block)return null;
  const event=events.find(e=>!e.release&&normals.includes(e.button));if(!event)return null;
  const control=definition.normalControls?.[event.button];
  if(control){
   if(player.airborne){
    const throws=control.airThrows,back=player.input.x===-player.facing;
    if(throws&&player.input.x&&player.opponentAirborne&&Math.abs(player.opponentHeight-player.y)<=throws.heightRange&&player.opponentDistance<=Math.max(throws.range,(player.bodyHalfWidth||0)+(player.opponentBodyHalfWidth||0)+4)&&throws[back?'backward':'forward'])
      return {move:throws[back?'backward':'forward'],event};
    return {move:player.jumpKind==='jump'?control.airVertical:control.airDirectional,event};
   }
   if(player.input.down)return {move:control.crouch,event};
   const forward=player.input.x===player.facing,back=player.input.x===-player.facing;
   if(control.throws&&(forward||back)&&player.opponentDistance<=Math.max(control.throws.range,(player.bodyHalfWidth||0)+(player.opponentBodyHalfWidth||0)+4)&&control.throws[back?'backward':'forward'])
     return {move:control.throws[back?'backward':'forward'],event};
   const standing=control.standing,near=player.opponentDistance<=standing.nearRange;
   if(back&&control.back&&(!near||definition.nativeBackNormals))return {move:control.back,event};
   // UMK3 back+LP deliberately suppresses its automatic close throw.
   if(near&&definition.moves[standing.near]?.grapple?.escapeByBack&&back)
     return {move:standing.far,event};
   return {move:near?standing.near:standing.far,event};
  }
  if(definition.normalControls)return null; // no fictional fifth/sixth MK button
  const suffix=event.button==='punch'?'Punch':event.button==='kick'?'Kick':null;if(!suffix)return null;
  return {move:player.airborne?'air'+suffix:player.input.down?'crouch'+suffix:suffix.toLowerCase(),event};

 }
 scope.FightCommands={normalize,direction,record,motion,action};
})(typeof window==='undefined'?globalThis:window);

/* Native sequence edges belong to character data. No fighter-name branches. */
(function(scope){
 'use strict';
 scope.FightSequences={
  request(g,p,request){
   const a=p.action;if(!a||request.event?.release)return null;
   const requested=g.definition(p).moves[request.move];
   const m=g.definition(p).moves[a.name],edges=m.chainEdges||[],fps=g.bank[p.id].fps;
   const normalButton=['punch','punch2','kick','kick2'].includes(request.event?.button);
   if(requested?.kind!=='strike'&&!(normalButton&&(requested?.grapple||m.nativeComboRoute)))return null;
   const edge=edges.find(e=>e.button===request.event?.button&&
    (e.direction===undefined||p.input.x*p.facing===e.direction)&&
    (e.requirement!==1||p.input.x*p.facing===-1)&&
    (e.requirement!==2||scope.FightCommands.motion(p,{sequence:[2,6],allowNeutral:true,windowSeconds:.4},g.elapsed))&&
    (e.requirement!==3||p.input.x*p.facing===1)&&
    (e.requirement!==4||p.input.down)&&
    (e.requirement!==6||p.input.up)&&e.requirement!==7);
   if(!edge)return null;
   const age=a.time*fps;
   if(age<edge.window[0]-fps/240-1e-6||age>=edge.window[1]+1e-6)return false;
   a.sequenceCarry=!!edge.preserveStrike;
   a.chain={to:edge.to,at:Math.max(a.time,edge.gate/fps),contact:edge.contact||'any',skip:0};
   return true;
  },
  advance(g,p,dt){
   const a=p.action,q=a?.chain;if(!q||a.time+dt<q.at-1e-8)return;
   delete a.chain;
   if(q.contact==='none'||a.connected&&(q.contact==='any'||q.contact===a.contactResult)){
    const from=a.name;if(g.startAction(p,q.to,true,q.skip||0))g.emit(q.link?'link':'chain',{player:p.index,from,to:q.to});
   }
  },
  canCancel(g,p,name){
   const a=p.action;if(!a)return true;
   const m=g.definition(p).moves[a.name],rule=m.specialCancels?.[name];if(!rule)return false;
   if(!rule.outcomes.includes(a.contactResult||'whiff'))return false;
   const age=a.time*g.bank[p.id].fps;
   const wall=rule.wallByOutcome?.[a.contactResult||'whiff'];
   if(wall&&a.wallTime!==undefined&&!wall.some(([lo,hi])=>(a.requestWall??a.wallTime)*g.bank[p.id].fps>=lo-.5&&(a.requestWall??a.wallTime)*g.bank[p.id].fps<hi-.5))return false;
   const ranges=rule.byOutcome?.[a.contactResult||'whiff']||rule.ranges;
   // Before contact, these SF whiff windows are native video samples. A
   // simulation step can land just before their integer boundary.
   const sample=wall&&!a.connected&&a.time<m.startup?Math.round(age):age;
   return ranges.some(([lo,hi])=>sample>=lo-1e-6&&sample<hi+1e-6);
  }
 };
})(typeof window==='undefined'?globalThis:window);
