const fs=require('fs'),path=require('path'),w=require('./carregar-modelo-testes.cjs')(),B=w.ARENA_ASSETS.characters;
const E=path.join(__dirname,'evidencias/caminhada-elenco-20261121'),rows=[];
const sfRom=fs.readFileSync('D:/Projetos/Mortal Kombat vs Street Fighter/engenharia-reversa/entradas/ssf2tu-68k-data-be.bin');
const samePose=(a,b,sf)=>a===b||sf&&a&&b&&sfRom.readUInt32BE(parseInt(a,16)+4)===sfRom.readUInt32BE(parseInt(b,16)+4);
const dirs=process.argv.slice(2).length?process.argv.slice(2):fs.readdirSync(path.join(E,'original'));
for(const native of dirs){
 const file=path.join(E,'original',native,'trace.json');if(!fs.existsSync(file))continue;
 const source=JSON.parse(fs.readFileSync(file)),id=native==='mk-18'?'scorpion':native==='sf-0'?'ryu':native,b=B[id],scale=b.movement.sourceScale||1;
 if(process.env.MK_GAIT_ONLY==='1'&&source.game!=='umk3')continue;
 for(const c of source.cases)for(const side of [1,-1]){
  const g=new w.FightArena(B,[id,id],w.FIGHT_DATA,{mode:'training'});g.phase='fight';g.timer=999;
  const p=g.players[0];p.x=550;p.facing=side;g.players[1].x=550+(c.initial.p2_x-c.initial.x)*scale*side;g.players[1].facing=-side;
  if(source.game==='ssf2tu')p.nativeSfCounter=c.initial.game_counter_ff801d;
  const idle=b.clips.idle.frames,poses=idle.map(f=>f.native_pose_pointer||b.assets[f.asset]?.metadata?.frame_pointer);
  if(poses.includes(c.initial.frame)){
   const observed=[];for(const row of c.samples.slice(0,12)){if(!poses.includes(row.after.frame))break;observed.push(row.after.frame);}
   const indexes=poses.map((pose,index)=>({index,error:observed.reduce((n,p,i)=>n+(poses[(index+i)%poses.length]!==p),0)+(pose!==c.initial.frame?100:0)})).sort((a,b)=>a.error-b.error);p.frame=indexes[0].index;
  }
  let ticks=0,maxPositionError=0,visualSamples=0,visualMismatches=0;const first=[];
  for(let i=0;i<c.samples.length;i++){
   const r=c.samples[i],keys=r.keys,input={x:(keys.includes(7)?1:keys.includes(6)?-1:0)*side,down:keys.includes(5),run:r.runRequested};
   const end=Math.floor((i+1)*240/source.fps+1e-8);while(ticks<end){g.step(1/240,[input,{}]);ticks++;}
   // Compare unimpeded locomotion; native/crossover body spacing is a separate rule.
   if(r.after.p2_x-r.after.x<100)continue;
   const expected=(r.after.x-c.initial.x)*scale,actual=(p.x-550)*side,error=Math.abs(expected-actual);maxPositionError=Math.max(maxPositionError,error);
   const f=g.clip(p,p.state).frames[p.frame],a=b.assets[f.asset],pose=f.native_pose_pointer||a.metadata?.frame_pointer||a.native_pose;
   const relevant=!p.action&&['forward','backward','crouch','nativeGaitRise','run','idle'].includes(p.state)&&c.id!=='idle';
   if(relevant&&pose){visualSamples++;const okay=c.samples.slice(Math.max(0,i-1),i+2).some(row=>samePose(row.after.frame,pose,source.game==='ssf2tu'));if(!okay){visualMismatches++;if(first.length<3)first.push({sample:i,state:p.state,expected:r.after.frame,actual:pose});}}
  }
  rows.push({id,case:c.id,side,maxPositionError,visualSamples,visualMismatches,first,pass:maxPositionError<=scale+1e-7&&visualMismatches===0});
 }
}
fs.writeFileSync(path.join(E,'comparacao.json'),JSON.stringify({criterion:'Same native input, both facings; unimpeded position within one native pixel and pose within one source frame. Visual coverage explicitly counted.',rows},null,2));
console.log(JSON.stringify({characters:new Set(rows.map(r=>r.id)).size,cases:rows.length,passed:rows.filter(r=>r.pass).length,failed:rows.filter(r=>!r.pass).length,failures:rows.filter(r=>!r.pass).slice(0,12)},null,2));
