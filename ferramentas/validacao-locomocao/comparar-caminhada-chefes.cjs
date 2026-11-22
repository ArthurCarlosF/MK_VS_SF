const fs=require('fs'),path=require('path'),assert=require('assert/strict'),w=require('./carregar-modelo-testes.cjs')(),B=w.ARENA_ASSETS.characters;
const E=path.join(__dirname,'evidencias/caminhada-chefes-20261122'),results=[];
for(const id of ['shao-kahn','motaro','noob-saibot']){
 const capture=JSON.parse(fs.readFileSync(path.join(E,id,'trace.json'))),r=capture.rows,b=B[id],data=b.nativeGroundGait;
 for(const mode of ['forward','backward']){
  const clip=b.clips[mode],poses=clip.frames.map(f=>f.native_pose_pointer),set=new Set(poses),speed=data[mode+'Speed'],direction=mode==='forward'?1:-1;
  let sourceSamples=0,segments=0;const failures=[];
  for(let i=1;i<r.length-8;i++){
   const first=r[i],previous=r[i-1],dx=(first.x-previous.x)*first.facing;
   if(first.pose!==poses[0]||dx!==direction*speed||first.y!==previous.y)continue;
   if(previous.pose===poses[0]&&(previous.x-(r[i-2]?.x??previous.x))*previous.facing===direction*speed)continue;
   let end=i+1;
   while(end<r.length){const a=r[end],z=r[end-1],counter=a.process.saved.a10,old=z.process.saved.a10;
    if(a.facing!==first.facing||a.y!==first.y||!set.has(a.pose)||(a.x-z.x)*first.facing!==direction*speed||counter>old)break;
    end++;
   }
   if(end-i<8)continue;
   for(const side of [1,-1]){
    const g=new w.FightArena(B,[id,'scorpion'],w.FIGHT_DATA,{mode:'training'});g.phase='fight';g.timer=999;const p=g.players[0];p.x=550;p.facing=side;g.players[1].x=550+side*(mode==='forward'?330:90);g.players[1].facing=-side;
    p.motion=w.FightMovement.init(g,p);p.motion.queue=[{x:side*direction},{x:side*direction}];let tick=0,error=0,visual=0;
    for(let n=0;n<end-i;n++){
     const target=Math.floor((n+1)*240/capture.fps+1e-8);while(tick<target){g.step(1/240,[{x:side*direction},{}]);tick++;}
     const expected=(r[i+n].x-previous.x)*first.facing,actual=(p.x-550)*side;error=Math.max(error,Math.abs(actual-expected));
     const f=g.clip(p,p.state).frames[p.frame],ok=r.slice(Math.max(i,i+n-1),Math.min(end,i+n+2)).some(q=>q.pose===f.native_pose_pointer);if(!ok)visual++;
    }
    if(error||visual)failures.push({start:i,end,side,error,visual});
   }
   segments++;sourceSamples+=end-i;i=end-1;
  }
  assert(segments>0&&sourceSamples>=20,'Insufficient original gait coverage '+id+'/'+mode);
  results.push({id,mode,nativeSpeed:speed,sourceSamples,segments,facings:2,failures,pass:!failures.length});
 }
}
fs.writeFileSync(path.join(E,'comparacao.json'),JSON.stringify({criterion:'Original AI walk invocations: unimpeded displacement exact and own pose within one native frame, both facings. Player input entry is a crossover adapter because these are native AI opponents.',results},null,2));console.log(JSON.stringify(results,null,2));if(results.some(r=>!r.pass))process.exitCode=1;
