/* Optional type-0x1a presentation. Caller controls native update cadence,
 * camera, RNG and the capacity shared with other effects. */
(function(scope){
 'use strict';
 const d=scope.NATIVE_CAR_DEBRIS_DATA,images=new Map(),clips=new Map(d.clips.map(c=>[`${c.directionMode}:${c.variant}`,c]));
 const recipes=new Map(d.recipes.map(c=>[`${c.ordinal}:${+c.breakHit}:${c.hitGroup}`,c]));
 const word=fn=>{const n=fn();if(!Number.isInteger(n)||n<0||n>65535)throw RangeError('Expected a native RNG word');return n;};
 const int16=n=>(n<<16)>>16;
 // Arcade world (192,48) is the car root. The dock floor is at y=37.
 const scale=1.25,centerX=192,floorY=37;
 const nativeContact=(carX,x,y)=>[centerX+(x-carX)/scale,floorY+y/scale];
 function drawAtCar(ctx,particles,{carX,left,zoom,floor}){
  draw(ctx,particles,{zoom:zoom*scale,project:(x,y)=>[(carX-left+(x-centerX)*scale)*zoom,floor-(y-floorY)*scale*zoom]});
 }
 async function load(baseUrl){
  const base=baseUrl.endsWith('/')?baseUrl:baseUrl+'/';
  await Promise.all(Object.entries(d.assets).map(async ([key,a])=>{if(images.has(key))return;const im=new Image();im.src=base+a.file;await im.decode();images.set(key,im);}));
 }
 function spawn({ordinal,breakHit,hitGroup,contact,capacity=Infinity},nextWord){
  const recipe=recipes.get(`${ordinal}:${+!!breakHit}:${hitGroup}`),particles=[];
  if(!recipe)return {particles,additionalActors:[]};
  for(const b of recipe.bursts){
   const origin=b.origin.kind==='contact'?contact:[b.origin.x,b.origin.y];
   if(!origin||!Number.isFinite(origin[0])||!Number.isFinite(origin[1]))throw Error('A native world contact point is required');
   for(let i=0;i<b.count&&particles.length<capacity;i++){
    const life=d.init.lifetimes[(word(nextWord)>>1)&15];
    const x=Math.trunc(origin[0])+d.init.coordinateJitter[(word(nextWord)>>1)&15];
    const y=Math.trunc(origin[1])+d.init.coordinateJitter[(word(nextWord)>>1)&15];
    const v=d.init.velocityProfiles[b.profile].rows[word(nextWord)&7];
    const direction=b.directionMode<0?word(nextWord)&1:b.directionMode>0?1:0;
    const clip=clips.get(`${direction}:${b.variant}`);
    particles.push({xFixed:x<<16,yFixed:y<<16,vx:v.velocityX,vy:v.velocityY,ax:v.accelerationX,ay:v.accelerationY,
     life:life.lifetimeUpdates,steady:life.continuousVisibleUpdates,clipId:direction+':'+b.variant,pose:0,poseTicks:clip.frames[0].holdUpdates,visible:false});
   }
  }
  return {particles,additionalActors:recipe.otherActorAllocations};
 }
 function step(particles){
  for(let i=particles.length-1;i>=0;i--){
   const p=particles[i],clip=clips.get(p.clipId);if(p.life<=0){particles.splice(i,1);continue;}
   p.vx=int16(p.vx-p.ax);p.vy=int16(p.vy-p.ay);p.xFixed=(p.xFixed+(p.vx<<8))|0;p.yFixed=(p.yFixed+(p.vy<<8))|0;
   p.life--;if(--p.poseTicks===0){p.pose++;if(p.pose>=clip.frames.length)p.pose=clip.loopStartIndex;p.poseTicks=clip.frames[p.pose].holdUpdates;}
   p.visible=p.steady>0||(p.life&1)===0;if(p.steady>0)p.steady--;
  }
  return particles;
 }
 function draw(ctx,particles,{project,zoom=1}){
  ctx.save();ctx.imageSmoothingEnabled=false;
  for(const p of particles){if(!p.visible)continue;const f=clips.get(p.clipId).frames[p.pose],im=images.get(f.asset);if(!im)continue;
   const [x,y]=project(p.xFixed>>16,p.yFixed>>16);ctx.drawImage(im,x-f.anchor[0]*zoom,y-f.anchor[1]*zoom,im.width*zoom,im.height*zoom);}
  ctx.restore();
 }
 scope.NativeCarDebris={load,spawn,step,drawAtCar,nativeContact};
})(typeof window==='undefined'?globalThis:window);
