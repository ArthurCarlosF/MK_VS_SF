// Isolated ground-controller diagnostic; the shipping engine remains the oracle.
module.exports=function(pack,recipe,initial,phase=0,age=0,rates=pack.gait.logicalRates,maximumDistance=Infinity){
const d=pack.gait,n={mode:'idle',age,previousRaw:{},pending:{},phase,wasDown:false},out=[];let x=0,video=0,pose;
for(let sample=0;sample<recipe.samples.length;sample++){
const row=recipe.samples[sample],keys=row.keys,raw={x:keys.includes(7)?1:keys.includes(6)?-1:0,down:keys.includes(5)},end=Math.floor((sample+1)*240/d.fps+1e-8),count=Math.floor((1/60+end/240)*d.fps+1e-8);
while(video<count){video++;
const next=n.pending,rateName=n.rising?'rise':next.down?'crouch':next.x?(next.x>0?'forward':'backward'):'idle';n.phase+=rates[rateName];const steps=Math.floor(n.phase);n.phase-=steps;
for(let i=0;i<steps;i++){
 const input=n.pending;n.pending=n.previousRaw;const down=!!input.down;
 if(n.wasDown&&!down){n.rising=true;n.riseAge=d.riseEntryIndex||0;}
 let state,index;
 if(n.rising){if(n.riseAge<d.standUpSamples){state='nativeGaitRise';index=n.riseAge++;}else{n.rising=false;n.mode='idle';n.age=-1;}}
 if(!state){state=down?'crouch':input.x?(input.x>0?'forward':'backward'):'idle';index=n.mode===state?n.age+1:1;if(input.x&&!down)x+=input.x*(state==='forward'?d.forwardSpeed:d.backwardSpeed);}
 n.mode=state;n.age=index;n.wasDown=down;
}x=Math.max((initial.p2_x-initial.x)*1.25-maximumDistance,Math.min(510,Math.max(-510,x)));n.previousRaw=raw;
}
const clip=pack.clips[n.mode],start=clip.loopStart||0,index=clip.loop?n.age<clip.frames.length?n.age:start+(n.age-start)%(clip.frames.length-start):Math.min(n.age,clip.frames.length-1);pose=clip.frames[Math.max(0,index)].native_pose_pointer;
out.push({x:Math.floor((550+x)/1.25)*1.25-550,pose,state:n.mode});
}return out;
};
