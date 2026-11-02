const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const P=path.resolve(__dirname,'..'),H=path.join(P,'comparacao/passo-2/revisao-socos'),s={window:{}};vm.createContext(s);
for(const f of ['assets','engine','commands','collisions','calibration','combat-data','fight-engine'])vm.runInContext(fs.readFileSync(path.join(P,'arena',f+'.js'),'utf8'),s);
const W=s.window,source=JSON.parse(fs.readFileSync(path.join(H,'execucao/original/umk3/rep-1/trace.json'))),fps=source.fps,results=[];
for(const c of source.cases){
 const g=new W.FightArena(W.ARENA_ASSETS.characters,['scorpion','scorpion']);g.phase='fight';
 // Controlled contact fixture. Positions are aligned explicitly so this test
 // isolates attack branching rather than the known movement mismatch.
 g.players[0].x=c.initial.x;g.players[1].x=c.initial.p2_x;
 let ticks=0,prevPose,extensions=[],samples=[];
 for(const sample of c.samples){
  const target=Math.floor((sample.sample+1)*240/fps+1e-9);
  while(ticks<target){g.step(1/240,sample.input);ticks++;}
  const p=g.players[0],clip=W.ARENA_ASSETS.characters.scorpion.clips[p.state]||W.ARENA_ASSETS.characters.scorpion.clips.idle,pose=clip.frames[Math.min(p.frame,clip.frames.length-1)].native_pose_pointer;
  if(pose!==prevPose&&['0xff9393d0','0xff9394f0'].includes(pose))extensions.push(sample.sample);prevPose=pose;
  samples.push({sample:sample.sample,health:g.players[1].health,pose});
 }
 let oldPose,nativeExtensions=[];
 for(const sample of c.samples){const pose=sample.after.pose;if(pose!==oldPose&&['0xff9393d0','0xff9394f0'].includes(pose))nativeExtensions.push(sample.sample);oldPose=pose;}
 const nativeHits=c.samples.filter(s=>s.after.life_native[1]!==s.before.life_native[1]).map(s=>s.sample);
 const actualHits=samples.filter((s,i)=>Math.abs(s.health-(i?samples[i-1].health:100))>1e-6).map(s=>s.sample);
 assert.equal(actualHits.length,nativeHits.length,c.id+' hit count');assert.deepEqual(extensions,nativeExtensions,c.id+' hand alternation');
 assert(Math.abs(samples.at(-1).health-c.samples.at(-1).after.life_percent[1])<1e-6,c.id+' total damage');
 assert(actualHits.every((v,i)=>Math.abs(v-nativeHits[i])<=1),c.id+' contact timing');
 results.push({id:c.id,native_hit_samples:nativeHits,prototype_hit_samples:actualHits,native_extension_samples:nativeExtensions,prototype_extension_samples:extensions,total_damage:100-samples.at(-1).health});
}
// Exercise the actual crossover in both player orders as well as the mirror.
for(const ids of [['scorpion','ryu'],['ryu','scorpion']]){
 const g=new W.FightArena(W.ARENA_ASSETS.characters,ids);g.phase='fight';g.players[0].x=530;g.players[1].x=596.75;
 const owner=ids.indexOf('scorpion');
 for(let i=0;i<240;i++){
  const input=[{},{}];input[owner]={punch:i<8||(i>=24&&i<32)};g.step(1/240,input);
 }
 assert.equal(g.events.filter(e=>e.type==='hit'&&e.player===owner).length,2,'crossover double punch '+owner);
}
// A snapshot taken after the visual branch must retain the pending strike.
{
 const g=new W.FightArena(W.ARENA_ASSETS.characters,['scorpion','scorpion']);g.phase='fight';g.players[0].x=530;g.players[1].x=596.75;
 for(let i=0;i<47;i++)g.step(1/240,[{punch:i<8||(i>=24&&i<32)},{}]);
 const snap=JSON.parse(JSON.stringify(g.snapshot()));assert(snap.players[0].action.carriedStrike);
 g.players=snap.players.map(p=>({...p,action:p.action?{...p.action,hit:new Set(p.action.hit)}:null}));
 for(let i=0;i<200;i++)g.step(1/240);
 assert.equal(g.events.filter(e=>e.type==='hit'&&e.player===0).length,2,'snapshot preserves both contacts');
}
const result={status:'PASS',cases:results.length,fixture:'Mirror match; source initial positions explicitly aligned; input/video timing matched. This does not validate native movement, body geometry or final knockback.',timing_tolerance_source_samples:1,results};
fs.writeFileSync(path.join(W.PHASE_CALIBRATION?path.join(P,'comparacao/passo-5'):H,'verificacao-revisao.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({status:result.status,cases:result.cases,double:results.find(r=>r.id==='contact_pair_off3_phase0'),repeated:results.find(r=>r.id==='contact_train_2_2')},null,2));
