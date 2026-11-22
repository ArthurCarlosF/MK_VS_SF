/* Route the arcade renderers by source. The match supplies shared coordinates. */
(function(scope){
 'use strict';
 const sf=scope.NativeStages;
 const mk=new Map(scope.NATIVE_STAGE_DATA.stages.filter(s=>s.sourceGame==='umk3').map(s=>[s.id,s]));
 const stages=new Map();let buffer=null;
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 async function load(base,selection,options){
  const wanted=selection===undefined?scope.NATIVE_STAGE_DATA.stages.map(s=>s.id):Array.isArray(selection)?selection:[selection];
  const sfIds=wanted.filter(id=>!mk.has(id));
  await Promise.all([sfIds.length?sf.load(base,sfIds,options):null,...wanted.filter(id=>mk.has(id)).map(id=>{
   if(!stages.has(id)){
    const url=new URL(mk.get(id).manifest,new URL(base,scope.location.href));
    stages.set(id,scope.NativeMkStage.load(url).then(instance=>{stages.get(id).instance=instance;return instance;}).catch(error=>{stages.delete(id);throw error;}));
   }
   return stages.get(id);
  })]);
 }
 function draw(ctx,view){
  const data=mk.get(view.stageId);if(!data)return sf.draw(ctx,view);
  const instance=stages.get(data.id)?.instance;if(!instance)return false;
  const {scale,left,viewportWidth:w,viewportHeight:h,floor,cameraY,elapsed}=view;
  const width=Math.min(data.nativeWorldWidth,Math.ceil(w/scale)),height=data.nativeViewport[1];
  if(!buffer)buffer=typeof OffscreenCanvas!=='undefined'?new OffscreenCanvas(width,height):document.createElement('canvas');
  if(buffer.width!==width)buffer.width=width;if(buffer.height!==height)buffer.height=height;
  // Center 550 in the crossover corresponds to original world center 600.
  const cameraX=clamp(left+data.nativeCenter-550,0,data.nativeWorldWidth-width);
  instance.renderNative(buffer.getContext('2d'),{cameraX,elapsed,nativeWidth:width});
  const drawLeft=Math.max(0,(w-width*scale)/2),drawTop=Math.round(floor+(cameraY-data.nativeFloor)*scale);
  ctx.save();ctx.imageSmoothingEnabled=false;ctx.fillStyle='#090b10';ctx.fillRect(0,0,w,h);ctx.drawImage(buffer,drawLeft,drawTop,width*scale,height*scale);ctx.restore();return true;
 }
 scope.NativeStages={...sf,catalog:scope.NATIVE_STAGE_DATA.stages,get:id=>mk.get(id)||sf.get(id),load,draw,
  renderBaseline:(ctx,id)=>mk.has(id)?stages.get(id)?.instance?.renderNative(ctx,{}):sf.renderBaseline(ctx,id),
  renderAtFrame:(ctx,id,index)=>mk.has(id)?stages.get(id)?.instance?.renderNative(ctx,{frameIndex:index}):sf.renderAtFrame(ctx,id,index)};
})(typeof window==='undefined'?globalThis:window);
