/* SSF2u car actor: native counters, hitbox geometry, and damage-frame selection.
 * The caller supplies the stage clock, effects, match score, and a deterministic
 * RNG nibble. This module does not claim a complete bonus mode. */
(function(root){
 'use strict';
 const ROLLS=[3,5,4,5,3,4,5,4,4,4,5,3,4,3,5,3];
 const LEFT={group:0,x:-56,y:64,radiusX:22,radiusY:25};
 const RIGHT={group:2,x:56,y:64,radiusX:22,radiusY:25};
 const BODY={group:0,x:8,y:25,radiusX:69,radiusY:22};
 const roll=nextNibble=>{const n=nextNibble();if(!Number.isInteger(n)||n<0||n>15)throw new RangeError('Expected a native RNG nibble');return ROLLS[n];};
 function create(nextNibble){return {frame:0,left:roll(nextNibble),right:roll(nextNibble),wreckFlag:false,completed:false};}
 function hitboxes(s){return s.completed?[]:s.frame<6?[{...LEFT},{...RIGHT}]:[{...BODY}];}
 function hit(s,group,attackByte8){
  if(s.completed||group!==0&&group!==2||s.frame>=6&&group===2)return {accepted:false,underflow:false};
  if(!Number.isInteger(attackByte8)||attackByte8<0||attackByte8>255)throw new RangeError('Expected the raw native attack byte +8');
  const field=group===0?'left':'right';if(s[field]<0)return {accepted:false,underflow:false};
  const amount=(attackByte8>=128?attackByte8-256:attackByte8)+1;s[field]=Math.max(-1,s[field]-amount);
  return {accepted:true,underflow:s[field]<0,amount,remaining:s[field]};
 }
 function tick(s,nextNibble){
  if(s.completed)return s.frame;
  const left=s.left<0,right=s.right<0;
  switch(s.frame){
  case 0:if(left){s.frame++;s.left=roll(nextNibble);}if(right)s.frame+=3;break;
  case 1:if(left)s.frame++;if(right)s.frame+=3;break;
  case 2:if(right){s.frame=5;s.left=roll(nextNibble);s.right=roll(nextNibble);}break;
  case 3:if(left){s.frame=4;s.left=roll(nextNibble);}break;
  case 4:if(left){s.frame=5;s.left=roll(nextNibble);s.right=roll(nextNibble);}break;
  case 5:if(left||right){s.frame=6;s.left=roll(nextNibble);}break;
  case 15:if(left)s.completed=true;break;
  default:if(left){s.frame++;s.left=roll(nextNibble);if(s.frame===15)s.wreckFlag=true;}
  }
  return s.frame;
 }
 root.NativeCarRules={create,hit,hitboxes,tick};
})(typeof window==='undefined'?globalThis:window);
