(function(scope){
  'use strict';
  const overlap=(a,b)=>a.left<b.right&&a.right>b.left&&a.bottom<b.top&&a.top>b.bottom;
  function box(player,rect,scale=1){
    const a=rect.x*scale,b=(rect.x+rect.w)*scale;
    return {left:player.x+(player.facing>0?a:-b),right:player.x+(player.facing>0?b:-a),
      bottom:player.y+rect.y*scale,top:player.y+(rect.y+rect.h)*scale};
  }
  function hurt(player,definition){
    const height=player.airborne?definition.body.airHeight:player.input.down?definition.body.crouchHeight:definition.body.height;
    return {left:player.x-definition.body.halfWidth,right:player.x+definition.body.halfWidth,
      bottom:player.y,top:player.y+height};
  }
  function canGuard(defender,definition,move){
    if(defender.airborne||defender.action||defender.stun>0||defender.knockdown>0||defender.health<=0||move.kind==='throw')return false;
    const input=defender.input,holding=(definition.guard==='button'&&input.block)||(definition.guard==='back'&&input.x===-defender.facing);
    if(!holding)return false;
    if(move.level==='low')return input.down;
    if(move.level==='overhead')return !input.down;
    return true;
  }
  scope.FightCollision={overlap,box,hurt,canGuard};
})(typeof window==='undefined'?globalThis:window);
