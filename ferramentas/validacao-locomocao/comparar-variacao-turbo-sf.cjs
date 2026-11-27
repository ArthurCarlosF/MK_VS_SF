const fs=require('fs'),path=require('path'),w=require('./carregar-modelo-testes.cjs')(),B=w.ARENA_ASSETS.characters;
const E=path.join(__dirname,'evidencias/caminhada-elenco-20261121'),rom=fs.readFileSync('D:/Projetos/Mortal Kombat vs Street Fighter/engenharia-reversa/entradas/ssf2tu-68k-data-be.bin');
const desc=p=>rom.readUInt32BE(parseInt(p,16)+4),rows=[],witnesses=[];
for(const folder of fs.readdirSync(path.join(E,'original'))){
 const file=path.join(E,'original',folder,'variacao-turbo.json');if(!fs.existsSync(file))continue;
 const source=require('./carregar-referencias-sf.cjs')(path.dirname(file)),trace=JSON.parse(fs.readFileSync(path.join(E,'original',folder,'trace.json'))),id=folder==='sf-0'?'ryu':folder,b=B[id],scale=1.25;
 witnesses.push({id,files:source.witnessFiles,repeats:source.cases[0].repeats.length});
 for(const c of source.cases)for(const side of [1,-1]){
  const recipe=trace.cases.find(r=>r.id===c.id),models=[];
  for(const rep of c.repeats){
   const g=new w.FightArena(B,[id,id],w.FIGHT_DATA,{mode:'training'});g.phase='fight';g.timer=999;const p=g.players[0];p.x=550;p.facing=side;g.players[1].x=550+(rep.initial.p2_x-rep.initial.x)*scale*side;g.players[1].facing=-side;p.nativeSfCounter=rep.initial.counter;
   // Align only the initial native logic/video clock phase. Both observations
   // are idle, before the first directional input has reached the fighter.
   const first=rep.samples[0],same=rep.initial.frame===first.frame,duration=rom.readUInt16BE(parseInt(first.frame,16));
   const initialSteps=same?rep.initial.timer-first.timer:rep.initial.timer+duration-first.timer;
   const idleRate=b.nativeGroundGait.logicalRates.idle;
   p.nativeSfPhase=Math.max(0,Math.min(.999999,initialSteps-idleRate+.15));
   const frames=b.clips.idle.frames,at=frames.findIndex(f=>f.native_pose_pointer===rep.initial.frame);
   if(at>=0){const duration=rom.readUInt16BE(parseInt(rep.initial.frame,16));p.frame=Math.min(frames.length-1,at+Math.max(0,duration-rep.initial.timer));}
   let tick=0;const samples=[];
   for(let i=0;i<recipe.samples.length;i++){
    const r=recipe.samples[i],keys=r.keys,input={x:(keys.includes(7)?1:keys.includes(6)?-1:0)*side,down:keys.includes(5),run:r.runRequested},end=Math.floor((i+1)*240/source.fps+1e-8);
    while(tick<end){g.step(1/240,[input,{}]);tick++;}
    // Reflect the fractional coordinate into the source capture's orientation
    // before rasterizing. Reflection and floor do not commute: flooring first
    // manufactured an extra pixel solely in the mirrored test fixture.
    const canonicalX=550+(p.x-550)*side;
    const f=g.clip(p,p.state).frames[p.frame];samples.push({x:Math.floor(canonicalX/scale)*scale-550,subpixelX:(p.x-550)*side,pose:f.native_pose_pointer,state:p.state});
   }
   models.push(samples);
  }
  let positionOutsideEnvelope=0,visualMismatches=0,checked=0;const first=[];
  for(let i=0;i<recipe.samples.length;i++){
   if(c.repeats.some(rep=>rep.samples[i].p2_x-rep.samples[i].x<100))continue;
   const original=c.repeats.flatMap(rep=>rep.samples.slice(Math.max(0,i-1),i+2).map(row=>(row.x-rep.initial.x)*scale)),lo=Math.min(...original),hi=Math.max(...original);
   const allowedPoses=new Set(c.repeats.flatMap(rep=>rep.samples.slice(Math.max(0,i-1),i+2).map(r=>desc(r.frame))));
   for(const model of models){
    const r=model[i];checked++;const error=Math.max(0,lo-r.x,r.x-hi);positionOutsideEnvelope=Math.max(positionOutsideEnvelope,error);
    if(!r.pose||!allowedPoses.has(desc(r.pose))){visualMismatches++;if(first.length<4)first.push({sample:i,state:r.state,pose:r.pose});}
   }
  }
  rows.push({id,case:c.id,side,repeats:c.repeats.length,checked,positionOutsideEnvelope,visualMismatches,first,pass:positionOutsideEnvelope<=scale+1e-7&&!visualMismatches});
 }
}
fs.writeFileSync(path.join(E,'comparacao-variacao-sf.json'),JSON.stringify({criterion:'Compare native raster X in the source orientation against the measured original presentation envelope, within one displayed native frame and one native pixel; sprite descriptors use the same one-frame temporal window. Six baseline repetitions plus twelve independent additional repetitions for the twelve pending characters. Additional witnesses were captured after freezing the candidate parameters, following an original-versus-original check that exposed incomplete coverage of native Turbo cadence. Fractional physical velocities are independently measured in velocidades-sf.json. No original ROM/control/timing routine modified.',witnesses,rows},null,2));
console.log(JSON.stringify({characters:new Set(rows.map(r=>r.id)).size,total:rows.length,passed:rows.filter(r=>r.pass).length,failures:rows.filter(r=>!r.pass).slice(0,10)},null,2));
