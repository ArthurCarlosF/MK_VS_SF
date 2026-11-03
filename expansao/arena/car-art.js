/* Arcade car graphics; a remaining visible wreck is a crossover cue at frame 15. */
(function(scope){
 'use strict';
 const frames=scope.NATIVE_CAR_FRAMES,dock=scope.NATIVE_CAR_DOCK;let ready=null;
 const images=new Map();
 function load(){
  ready ||= Promise.all([...frames.filter(Boolean),{file:dock.file,size:[dock.width,dock.height]}].map(async frame=>{
   const im=new Image();im.src=frame.file;await im.decode();
   if(im.naturalWidth!==frame.size[0]||im.naturalHeight!==frame.size[1])throw Error('Imagem do carro incompatível.');
   images.set(frame.file,im);
  })).catch(error=>{ready=null;throw error;});return ready;
 }
 function drawStage(ctx,{b,left,scale,floor,width,height}){
  const im=images.get(dock.file);if(!im)return false;
  const zoom=scale*1.25;
  ctx.save();ctx.imageSmoothingEnabled=false;ctx.fillStyle='#090b10';ctx.fillRect(0,0,width,height);
  ctx.drawImage(im,Math.round((b.x-left)*scale-dock.width*zoom/2),Math.round(floor-dock.floor*zoom),dock.width*zoom,dock.height*zoom);ctx.restore();return true;
 }
 function clip(ctx,b,left,scale,floor){
  const zoom=scale*1.25;ctx.save();ctx.beginPath();ctx.rect(Math.round((b.x-left)*scale-dock.width*zoom/2),Math.round(floor-dock.floor*zoom),dock.width*zoom,dock.height*zoom);ctx.clip();
 }
 function draw(ctx,b,left,scale,floor){
  const at=b.native.frame===15?14:b.native.frame,frame=frames[at],im=frame&&images.get(frame.file);
  if(!im)return false;
  ctx.save();ctx.imageSmoothingEnabled=false;
  const nativeScale=scale*1.25;
  ctx.drawImage(im,Math.round((b.x-left)*scale-frame.anchor[0]*nativeScale),Math.round(floor-(frame.anchor[1]+dock.floor-dock.rootY)*nativeScale),im.width*nativeScale,im.height*nativeScale);
  ctx.font='bold 13px Arial';ctx.textAlign='center';ctx.fillStyle='#fff2c4';
  ctx.fillText((b.native.wreckFlag&&!b.native.completed?'GOLPE FINAL · ':'CARRO · ')+b.score+' PONTOS',480,35);
  ctx.fillStyle='#1c2029';ctx.fillRect(340,44,280,8);ctx.fillStyle='#d2ac5f';
  ctx.fillRect(340,44,280*(b.native.completed?1:b.native.frame/16),8);ctx.restore();return true;
 }
 scope.NativeCarArt={load,draw,drawStage,clip};
})(typeof window==='undefined'?globalThis:window);
