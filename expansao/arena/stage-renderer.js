/* Caller supplies a canvas context. No DOM or Image use during module load. */
(function(scope){
 'use strict';
 const stages=new Map(scope.NATIVE_STAGE_DATA.stages.map(s=>[s.id,s])),images=new Map(),pendingImages=new Map(),animatedMaps=new Map();
 const wrap=(n,m)=>((n%m)+m)%m;
 async function load(baseUrl,selection,{animation=true}={}){
  const base=baseUrl.endsWith('/')?baseUrl:baseUrl+'/';
  const ids=selection===undefined?null:new Set(Array.isArray(selection)?selection:[selection]);
  const selected=[...stages.values()].filter(s=>!ids||ids.has(s.id));
  await Promise.all(selected.flatMap(stage=>[...stage.layers,...(stage.objectOverlay?[{layer:'objects',image:stage.objectOverlay}]:[]),...(animation&&stage.animation?Object.values(stage.animation.layers).flatMap(l=>l.states.filter(s=>s.patch).map(s=>({layer:'patch:'+s.patch.image,image:s.patch.image}))):[])].map(async l=>{
   const key=stage.id+':'+l.layer;if(images.has(key))return;if(pendingImages.has(key))return pendingImages.get(key);
   const task=(async()=>{const im=new Image();im.src=base+l.image;await im.decode();images.set(key,im);})();pendingImages.set(key,task);
   try{await task;}finally{pendingImages.delete(key);}
  })));
 }
 function band(ctx,im,sx,sy,w,h,dx,dy){
  let done=0;
  while(done<w){const x=wrap(sx+done,im.width),take=Math.min(w-done,im.width-x);ctx.drawImage(im,x,sy,take,h,dx+done,dy,take,h);done+=take;}
 }
 function canvas(width,height){const c=typeof OffscreenCanvas!=='undefined'?new OffscreenCanvas(width,height):document.createElement('canvas');c.width=width;c.height=height;return c;}
 function layerAt(stage,layer,frameIndex){
  const anim=frameIndex===null?null:stage.animation,entry=anim?.layers[String(layer.layer)];
  if(!entry)return {layer,image:images.get(stage.id+':'+layer.layer)};
  const i=Math.max(0,Math.floor(frameIndex)),at=entry.observedPeriodFrames?i%entry.observedPeriodFrames:Math.min(i,entry.timeline.length-1);
  const state=entry.states[entry.timeline[at]],p=state.patch,base=images.get(stage.id+':'+layer.layer);
  const current={...layer,scroll:state.scroll,rowScrollOffset:state.rowScrollOffset,rowScrollTable:state.rowScrollTableId===null?null:anim.rowTables[state.rowScrollTableId]};
  if(!p)return {layer:current,image:base};
  const patch=images.get(stage.id+':patch:'+p.image);if(!patch)return {layer,image:base};
  const key=stage.id+':'+layer.layer;let cached=animatedMaps.get(key);
  if(!cached){cached={canvas:canvas(base.width,base.height),patch:null};animatedMaps.set(key,cached);}
  if(cached.patch!==p.image){const c=cached.canvas.getContext('2d');c.clearRect(0,0,base.width,base.height);c.drawImage(base,0,0);c.clearRect(p.x,p.y,p.width,p.height);c.drawImage(patch,p.x,p.y);cached.patch=p.image;}
  return {layer:current,image:cached.canvas};
 }
 function render(ctx,{stageId,nativeWidth=384,nativeHeight=224,xDelta=0,yDelta=0,scrollDeltaByLayer={},frameIndex=null,clipVertical=false}){
  const s=stages.get(stageId);if(!s)throw Error('Unknown native stage: '+stageId);
  ctx.save();ctx.imageSmoothingEnabled=false;ctx.fillStyle='#000';ctx.fillRect(0,0,nativeWidth,nativeHeight);
  // The extra tilemap rows are not a continuation of the arcade picture.
  // Keep the native floor and camera offset, and letterbox outside the
  // documented vertical viewport instead of wrapping unused memory rows.
  const rowStart=clipVertical?Math.max(0,-Math.floor(yDelta)):0;
  const rowEnd=clipVertical?Math.min(nativeHeight,s.nativeViewport[1]-Math.floor(yDelta)):nativeHeight;
  if(rowStart>=rowEnd){ctx.restore();return true;}
  if(clipVertical){ctx.beginPath();ctx.rect(0,rowStart,nativeWidth,rowEnd-rowStart);ctx.clip();}
  for(const id of s.order){
   if(!id)continue;const sampled=layerAt(s,s.layers.find(l=>l.layer===id),frameIndex),layer=sampled.layer,im=sampled.image;if(!im){ctx.restore();return false;}
   const delta=scrollDeltaByLayer[id]??xDelta;
   let row=rowStart;
   while(row<rowEnd){
    const hwY=Math.floor(16+yDelta+row),sy=wrap(layer.scroll[1]+hwY,im.height);
    const extra=layer.rowScrollTable?.[wrap(hwY+layer.rowScrollOffset,1024)]||0;
    let count=1;
    while(row+count<rowEnd&&sy+count<im.height){
     const next=layer.rowScrollTable?.[wrap(hwY+count+layer.rowScrollOffset,1024)]||0;if(next!==extra)break;count++;
    }
    band(ctx,im,layer.scroll[0]+64+Math.floor(delta)+extra,sy,nativeWidth,count,0,row);row+=count;
   }
  }
  const objects=images.get(stageId+':objects');if(objects)ctx.drawImage(objects,-Math.floor(xDelta),-Math.floor(yDelta));
  ctx.restore();return true;
 }
 let buffer=null;
 function draw(ctx,{stageId,left=310,cameraY=0,scale=2,floor=530,viewportWidth=960,viewportHeight=600,elapsed=0,scrollDeltaByLayer={}}){
  const stage=stages.get(stageId);if(!stage)return false;
  const zoom=scale*stage.sourceScale,nw=Math.ceil(viewportWidth/zoom),nh=Math.ceil(viewportHeight/zoom);
  if(!buffer){if(typeof OffscreenCanvas!=='undefined')buffer=new OffscreenCanvas(nw,nh);else buffer=document.createElement('canvas');}
  if(buffer.width!==nw)buffer.width=nw;if(buffer.height!==nh)buffer.height=nh;
  const ground=floor+cameraY*scale,yDelta=stage.nativeFloor-ground/zoom;
  if(!render(buffer.getContext('2d'),{stageId,nativeWidth:nw,nativeHeight:nh,xDelta:(left-stage.baselineArenaLeft)/stage.sourceScale,yDelta,scrollDeltaByLayer,frameIndex:Math.floor(elapsed*(stage.animation?.fps||59.6333313)),clipVertical:true}))return false;
  ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(buffer,0,0,nw,nh,0,0,nw*zoom,nh*zoom);ctx.restore();return true;
 }
 scope.NativeStages={catalog:[...stages.values()],load,draw,renderBaseline:(ctx,stageId)=>render(ctx,{stageId}),renderAtFrame:(ctx,stageId,frameIndex)=>render(ctx,{stageId,frameIndex}),get:stageId=>stages.get(stageId)};
})(typeof window==='undefined'?globalThis:window);
