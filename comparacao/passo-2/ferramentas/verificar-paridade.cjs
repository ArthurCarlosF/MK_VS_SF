const fs=require('fs'),path=require('path'),crypto=require('crypto');
const H=path.resolve(__dirname,'..'),P=path.resolve(H,'../..');
const {prototype}=require('../../ferramentas/executar.cjs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const suite=read(path.join(H,'casos.json')),summary=[];
const files=['assets.js','engine.js','commands.js','collisions.js','calibration.js','combat-data.js','fight-engine.js'];
const model=path.join(H,'modelo-depois'),before=path.join(H,'modelo-antes');
for(const dir of [model,before])fs.mkdirSync(dir,{recursive:true});
for(const f of files){fs.copyFileSync(path.join(P,'arena',f),path.join(model,f));
 const saved=path.join(P,'dados/backups/passo-2-comandos',f);fs.copyFileSync(fs.existsSync(saved)?saved:path.join(P,'arena',f),path.join(before,f));}
const active={umk3:{punch:['0xff9393d0','0xff9394f0'],kick:['0xff93ac90'],punch_low:['0xff937f70'],kick_low:['0xff938170']},
 ssf2tu:{punch:['0x11017a'],kick:['0x11050a'],punch_low:['0x1107a6'],kick_low:['0x110932']}};
function hits(c,game,kind){let prev;const out=[];for(const s of c.samples){if(s.after.pose!==prev&&active[game][kind].includes(s.after.pose))out.push(s.sample);prev=s.after.pose;}return out;}
for(const game of ['umk3','ssf2tu']){
 const native=read(path.join(H,'execucao-01/original',game,'rep-1/trace.json'));
 const aft=prototype(native,suite,model,path.join(H,`prototype-${game}.json`));
 const bef=prototype(native,suite,before,path.join(H,`prototype-antes-${game}.json`));
 for(const c of native.cases){const kind=['punch_low','kick_low','punch','kick'].find(k=>c.id.startsWith(k));if(!kind||c.id.includes('then')||c.id.includes('same'))continue;
  const x=hits(c,game,kind),a=hits(aft.cases.find(q=>q.id===c.id),game,kind),b=hits(bef.cases.find(q=>q.id===c.id),game,kind);
  summary.push({game,id:c.id,native_extensions:x,before_extensions:b,after_extensions:a,count_matches_before:x.length===b.length,count_matches_after:x.length===a.length,
   max_timing_error_samples:x.length===a.length?Math.max(0,...x.map((v,i)=>Math.abs(v-a[i]))):null});
 }
}
const result={meaning:'Visible extension counts and source-video sample times for mapped normal buttons at baseline distance. This is not damage/combo equality.',
 rows:summary,count_before:summary.filter(x=>x.count_matches_before).length,count_after:summary.filter(x=>x.count_matches_after).length,total:summary.length};
fs.writeFileSync(path.join(H,'paridade.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify({before:result.count_before,after:result.count_after,total:result.total,failures:summary.filter(x=>!x.count_matches_after).map(({id,game,native_extensions,after_extensions})=>({id,game,native_extensions,after_extensions}))},null,2));
