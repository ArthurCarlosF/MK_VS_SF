const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const P=path.resolve(__dirname,'..'),H=path.join(P,'comparacao/passo-5'),s={window:{}};vm.createContext(s);
for(const f of ['assets','engine','commands','collisions','calibration','combat-data','fight-engine'])vm.runInContext(fs.readFileSync(path.join(P,'arena',f+'.js'),'utf8'),s);
const W=s.window,B=W.ARENA_ASSETS.characters,D=W.FIGHT_DATA.characters,passed=[],checks=[];
const test=(name,f)=>{f();passed.push(name);};
const game=(id='scorpion')=>{const g=new W.FightArena(B,[id,id]);g.phase='fight';g.players[0].x=380;g.players[1].x=720;return g;};
const run=(g,t)=>{for(let i=0;i<Math.ceil(t*240);i++)g.step(1/240);};
const near=(a,b)=>assert(Math.abs(a-b)<1e-7,a+' != '+b);
test('Every calibrated phase points to the retained native pose and source sample',()=>{
 for(const [id,pack] of Object.entries(W.PHASE_CALIBRATION.characters))for(const [name,m] of Object.entries(pack.moves)){
  if(m.timing.kind==='grapple')continue;
  const c=JSON.parse(fs.readFileSync(path.join(P,m.timing.source)));const applied=D[id].moves[name],clip=B[id].clips[applied.clip];
  assert.equal(clip.frames.length,m.sourceSamples);
  m.timing.keptSourceSamples.forEach((src,i)=>assert.equal(clip.frames[i].native_pose_pointer,c.samples[src].after.players[0].pose,id+'/'+name+'/'+i));
  near((applied.startup+applied.active+applied.recovery)*applied.sampleRate,applied.sourceSamples);
  checks.push({character:id,move:name,samples:m.sourceSamples});
 }
});
test('SF paused frames are removed only when native actor+0x47 was positive',()=>{
 for(const [name,m] of Object.entries(W.PHASE_CALIBRATION.characters.ryu.moves)){
  if(m.timing.kind==='grapple')continue;
  const c=JSON.parse(fs.readFileSync(path.join(P,m.timing.source)));
  const discarded=c.samples.slice(0,m.timing.sourceRawSamples).filter(r=>Buffer.from(r.before.players[0].runtimeBytes,'hex')[0x47]>0).map(r=>r.sample);
  assert.deepEqual(Array.from(m.timing.removedPauseSamples),discarded);
  const rom=fs.readFileSync(path.join(P,'engenharia-reversa/entradas/ssf2tu-68k-data-be.bin'));
  m.timing.keptSourceSamples.forEach((src,i)=>{
   const boxes=c.samples[src].after.players[0].boxes.filter(b=>b.kind==='attack');assert.equal(m.attackTimeline[i].length,boxes.length);
   boxes.forEach((box,j)=>{const a=parseInt(box.address,16);assert.equal(box.w,rom[a+2]*2);near(m.attackTimeline[i][j].w,rom[a+2]*2*1.25);});
  });
 }
});
test('Native late-entry experiments extend MK jab/high-kick/sweep contact windows',()=>{
 const wanted={punch:[11,17],normal_stand_hp_far:[11,17],kick:[8,14],normal_stand_lk_far:[8,14],normal_back_lk:[14,17]};
 for(const [name,[first,end]] of Object.entries(wanted)){const g=game(),p=g.players[0],m=D.scorpion.moves[name];assert(g.startAction(p,name));
  for(let sample=0;sample<m.sourceSamples;sample++){p.action.time=sample/m.sampleRate;assert.equal(!!g.activeBox(p),sample>=first&&sample<end,name+'/'+sample);}
 }
});
test('A target entering the MK jab late is hit; entering after recovery starts is safe',()=>{
 for(const sample of [15,17]){const g=game(),p=g.players[0],q=g.players[1];assert(g.startAction(p,'punch'));run(g,sample/B.scorpion.fps);q.x=p.x+64;g.step(1/240);
  assert.equal(q.health<100,sample===15,'entry at '+sample);run(g,1);assert(g.events.filter(e=>e.type==='hit').length<=1);
 }
});
test('Each normal whiffs without an impact pause and recovers at its calibrated duration',()=>{
 for(const [id,pack] of Object.entries(W.PHASE_CALIBRATION.characters))for(const [name,m] of Object.entries(pack.moves)){
  if(m.timing.kind==='grapple')continue;
  const g=game(id),p=g.players[0];if(D[id].moves[name].air)g.beginJump(p);assert(g.startAction(p,name),id+'/'+name);
  const length=m.sourceSamples/m.sampleRate;run(g,Math.max(0,length-.02));assert.equal(g.hitstop,0);
  run(g,.04);assert.equal(p.action,null,id+'/'+name+' recovery');assert.equal(g.players[1].health,100);
 }
});
test('Ryu near HP recovers in 29 samples on whiff; contact adds its measured pause once',()=>{
 const m=D.ryu.moves.normal_stand_hp_near;assert.equal(m.sourceSamples,29);near(m.hitstop,11/B.ryu.fps);
 const g=game('ryu'),p=g.players[0],q=g.players[1];q.x=p.x+50;assert(g.startAction(p,'normal_stand_hp_near'));
 for(let n=0;n<120&&!g.events.some(e=>e.type==='hit');n++)g.step(1/240);
 assert(g.events.some(e=>e.type==='hit'));near(g.hitstop,m.hitstop);const time=p.action.time,pose=p.frame;run(g,m.hitstop-.01);near(p.action.time,time);assert.equal(p.frame,pose);
 run(g,.8);assert.equal(p.action,null);assert.equal(g.events.filter(e=>e.type==='hit').length,1);
});
test('MK air contact pauses only the attacker for eight samples, then resets fall velocity',()=>{
 for(const guarded of [false,true])for(const facing of [-1,1]){
  const g=game(),p=g.players[0],q=g.players[1],fps=B.scorpion.fps;g.step(1/240);p.airborne=true;p.y=80;p.facing=facing;p.motion.clock=0;
  assert(g.startAction(p,'normal_airForward_lp'));p.action.connected=true;p.frame=9;q.input.block=guarded;
  const x=p.x;assert(g.hit(p,q,D.scorpion.moves.normal_airForward_lp,'normal_airForward_lp'));assert.equal(g.hitstop,0);
  for(let i=0;i<8;i++){g.step(1/fps);near(p.y,80);near(p.x,x);}
  for(let i=1;i<=5;i++){g.step(1/fps);near(p.y,80-.75*i*(i+1)/2);near(p.x,x);assert.equal(p.frame,9);}
  run(g,1.2);assert(!p.airborne);assert.equal(p.y,0);assert.equal(p.action,null);
 }
});
test('Retained native MK air contacts independently confirm eight paused samples and posture-specific fall acceleration',()=>{
 let count=0;
 for(const folder of ['execucao-01','ar-01','ar-tarde-01','ar-guarda-01','ar-hit-01']){
  const root=path.join(H,folder,'original/umk3/rep-1');if(!fs.existsSync(root))continue;
  for(const id of fs.readdirSync(root)){
   const file=path.join(root,id,'trace.json');if(!fs.existsSync(file))continue;const c=JSON.parse(fs.readFileSync(file));if(!c.meta.posture?.startsWith('air'))continue;
   const hit=c.samples.findIndex(r=>r.before.players[1].health>r.after.players[1].health);if(hit<0)continue;
   const at=c.samples[hit].after.players[0];let j=hit+1;
   while(j<c.samples.length&&['x','y'].every(k=>c.samples[j].after.players[0][k]===at[k]))j++;
   assert.equal(j-hit-1,8,c.id);
   for(let n=0;n<3;n++)near(c.samples[j+n].after.players[0].y-c.samples[j+n-1].after.players[0].y,(c.meta.posture==='airVertical'?.875:.75)*(n+1));
   count++;
  }
 }
 assert(count>=20);checks.push({native_air_response_cases:count});
});
test('Reset and a new round clear local pause and aerial contact trajectory',()=>{
 const g=game(),p=g.players[0];g.step(1/240);p.airborne=true;p.y=80;assert(g.startAction(p,'normal_airForward_hk'));p.action.connected=true;
 g.hit(p,g.players[1],D.scorpion.moves.normal_airForward_hk,'normal_airForward_hk');assert(p.localHitstop>0);g.endRound('ko');g.startRound();assert(g.players.every(p=>p.localHitstop===0&&!p.motion?.contactFall));g.reset();assert(g.players.every(p=>p.localHitstop===0&&!p.motion?.contactFall));
});
fs.writeFileSync(path.join(H,'verificacao-fases.json'),JSON.stringify({status:'PASS',passed,checks},null,2));console.log(JSON.stringify({status:'PASS',tests:passed.length,records:checks.length}));
