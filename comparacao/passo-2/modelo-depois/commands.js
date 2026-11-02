/* Character input policies are supported by comparacao/passo-2 evidence.
 * Browser key repeat is never an attack edge. Failed normals are not queued. */
(function(scope){
 'use strict';
 const buttons=['punch','kick','special','throw','teleport'];
 function normalize(value){
  if(typeof value==='number')return {x:Math.sign(value),down:false,up:false};
  const v=value||{},out={x:Math.sign(v.x||0),down:!!v.down,up:!!v.up};
  for(const key of [...buttons,'block'])out[key]=!!v[key];return out;
 }
 function direction(input,facing){const x=input.x*facing;return input.down?(x>0?3:x<0?1:2):input.up?(x>0?9:x<0?7:8):(x>0?6:x<0?4:5);}
 function record(player,input,time,definition={}){
  const code=direction(input,player.facing),prev=player.previousInput||{},policy=definition.inputPolicy||{};
  if(!player.history.length||player.history.at(-1).code!==code)player.history.push({code,time});
  player.history=player.history.filter(e=>time-e.time<.8);
  player.releasedAt ||= {};player.lastPressAt ||= {};
  // Keep just this simulation tick's edges. Special repeat slots live on the
  // active action; they cannot become a later unrelated move.
  player.buffer=[];
  for(const button of buttons){
   if(!input[button]&&prev[button]){player.releasedAt[button]=time;if(policy.negativeEdge&&button==='punch')player.buffer.push({button,time,release:true});}
   if(input[button]&&!prev[button]){
    const released=player.releasedAt[button];
    if(!['punch','kick'].includes(button)||released===undefined||time-released+1/240+1e-8>=(policy.minimumReleaseSeconds||0)){
     player.buffer.push({button,time});player.lastPressAt[button]=time;
    }
   }
  }
  player.jumpPressed=policy.heldJump?input.up:input.up&&!prev.up;
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
  return time-list.at(-1).time<=(command.buttonSeconds??command.windowSeconds??.2)+1e-8;
 }
 function action(player,definition,time){
  const events=player.buffer;if(!events.length)return null;
  // Dedicated crossover shortcuts take priority; native directional commands
  // precede normal attacks and may be activated on release in SF.
  for(const button of ['teleport','special','throw']){
   const event=events.find(e=>e.button===button&&!e.release);if(!event)continue;
   const move=button==='special'?definition.special:button==='teleport'?definition.teleport:'throw';
   if(move)return {move,event};
  }
  if(!player.airborne)for(const command of definition.commands||[]){
   const event=events.find(e=>e.button===(command.button||'punch')&&(!e.release||command.negativeEdge));
   if(event&&motion(player,command,time))return {move:command.move,event};
  }
  if(definition.guard==='button'&&player.input.block)return null;
  const event=events.find(e=>!e.release&&['punch','kick'].includes(e.button));if(!event)return null;
  const suffix=event.button==='punch'?'Punch':'Kick';
  return {move:player.airborne?'air'+suffix:player.input.down?'crouch'+suffix:suffix.toLowerCase(),event};
 }
 scope.FightCommands={normalize,direction,record,motion,action};
})(typeof window==='undefined'?globalThis:window);
