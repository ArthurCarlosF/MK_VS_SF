/* Input history is relative to facing when recorded, not keyboard layout. */
(function(scope){
  'use strict';
  function normalize(value) {
    if (typeof value === 'number') return {x:Math.sign(value),down:false,up:false};
    const v=value||{};
    return {x:Math.sign(v.x||0),down:!!v.down,up:!!v.up,punch:!!v.punch,kick:!!v.kick,
      block:!!v.block,special:!!v.special,throw:!!v.throw,teleport:!!v.teleport};
  }
  function direction(input,facing){
    const x=input.x*facing;
    return input.down ? (x>0?3:x<0?1:2) : input.up ? (x>0?9:x<0?7:8) : (x>0?6:x<0?4:5);
  }
  function record(player,input,time){
    const code=direction(input,player.facing),prev=player.previousInput||{};
    if (!player.history.length||player.history.at(-1).code!==code)player.history.push({code,time});
    player.history=player.history.filter(e=>time-e.time<.7);
    for(const button of ['punch','kick','special','throw','teleport'])
      if(input[button]&&!prev[button])player.buffer.push({button,time});
    player.buffer=player.buffer.filter(e=>time-e.time<=.14);
    player.jumpPressed=input.up&&!prev.up;
    player.previousInput={...input};player.input=input;
  }
  function motion(player,sequence,time){
    const list=player.history.filter(e=>e.code!==5&&time-e.time<=.55&&e.time>=player.motionConsumedAt);
    if(list.length<sequence.length)return false;
    return sequence.every((v,i)=>list[list.length-sequence.length+i].code===v);
  }
  function action(player,definition,time){
    if(!player.buffer.length)return null;
    const event=player.buffer[0];
    if(event.button==='punch'&&!player.airborne)
      for(const command of definition.commands||[])if(motion(player,command.sequence,time))return {move:command.move,event};
    if(event.button==='special')return {move:definition.special,event};
    if(event.button==='teleport')return definition.teleport?{move:definition.teleport,event}:null;
    if(event.button==='throw')return {move:'throw',event};
    const suffix=event.button==='punch'?'Punch':event.button==='kick'?'Kick':null;
    if(!suffix)return null;
    return {move:player.airborne?'air'+suffix:player.input.down?'crouch'+suffix:suffix.toLowerCase(),event};
  }
  scope.FightCommands={normalize,direction,record,motion,action};
})(typeof window==='undefined'?globalThis:window);
