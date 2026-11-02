const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const P=path.resolve(__dirname,'..'),H=path.join(P,'comparacao/passo-7'),s={window:{}};vm.createContext(s);
for(const f of ['assets','engine','commands','collisions','calibration','combat-data','fight-engine'])vm.runInContext(fs.readFileSync(path.join(P,'arena',f+'.js'),'utf8'),s);
const W=s.window,B=W.ARENA_ASSETS.characters,results=[];
for(const file of fs.readdirSync(path.join(H,'hp-01/original/umk3/rep-1')).filter(n=>n.startsWith('hp_')&&n.includes('far'))){
 const c=JSON.parse(fs.readFileSync(path.join(H,'hp-01/original/umk3/rep-1',file,'trace.json'))),g=new W.FightArena(B,['scorpion','scorpion']);g.phase='fight';g.players.forEach((p,i)=>p.x=c.initial.players[i].x);
 let tick=0,prev,posePrev,actual=[],expected=[];const extensions=['0xff938dd0','0xff938ef0'];
 for(const r of c.samples){
  const target=Math.floor((r.sample+1)*240/B.scorpion.fps+1e-9);
  const inp=r.input.map(v=>({x:v.x||0,punch2:v.raw?.includes(1),block:v.raw?.includes(10)}));
  while(tick<target){g.step(1/240,inp);tick++;}
  const p=g.players[0],clip=B.scorpion.clips[p.state],ptr=clip.frames[p.frame].native_pose_pointer,source=r.after.players[0].pose;
  if(ptr!==prev&&extensions.includes(ptr))actual.push([r.sample,ptr]);
  if(source!==posePrev&&extensions.includes(source))expected.push([r.sample,source]);prev=ptr;posePrev=source;
 }
 assert.equal(actual.length,expected.length,c.id+' punch count');actual.forEach((v,i)=>{assert.equal(v[1],expected[i][1],c.id+' alternating hand');assert(Math.abs(v[0]-expected[i][0])<=1,c.id+' timing');});results.push({id:c.id,extensions:actual});
}
fs.writeFileSync(path.join(H,'verificacao-soco-alto.json'),JSON.stringify({status:'PASS',cases:results.length,timingToleranceSourceSamples:1,results},null,2));console.log(JSON.stringify({status:'PASS',cases:results.length}));
