const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const P=path.resolve(__dirname,'..'),H=path.join(P,'comparacao/passo-6'),s={window:{}};vm.createContext(s);
for(const f of ['assets','engine','commands','collisions','calibration','combat-data','fight-engine'])vm.runInContext(fs.readFileSync(path.join(P,'arena',f+'.js'),'utf8'),s);
const W=s.window,B=W.ARENA_ASSETS.characters,D=W.FIGHT_DATA.characters,R=W.FightReactions,profiles=W.FIGHT_DATA.reactions,passed=[],details=[];
const test=(n,f)=>{f();passed.push(n);},near=(a,b,e=1e-6)=>assert(Math.abs(a-b)<e,`${a} != ${b}`);
const run=(g,t,input=[{},{}])=>{for(let i=0;i<Math.ceil(t*240);i++)g.step(1/240,input);};
function game(ids=['scorpion','ryu'],side=1,gap=80){const g=new W.FightArena(B,ids);g.phase='fight';g.players[0].x=side>0?400:700;g.players[1].x=g.players[0].x+side*gap;g.players[0].facing=side;g.players[1].facing=-side;return g;}
test('Every reaction pose is a retained native victim pose with a real asset',()=>{
 for(const profile of Object.values(profiles)){
  const source=JSON.parse(fs.readFileSync(path.join(P,profile.source))),clip=B[profile.character]?.clips[profile.clip]||B.ryu.clips[profile.clip];
  assert(clip,profile.id);assert.equal(clip.frames.length,profile.samples.length);
  clip.frames.forEach((f,i)=>{assert.equal(f.native_pose_pointer,source.samples[profile.startSample+i].after.players[1].pose);assert(fs.existsSync(path.join(P,'arena',B[profile.character]?.assets[f.asset]?.file||B.ryu.assets[f.asset].file)));});
  assert(profile.controlSamples>0);assert(profile.controlSamples<=profile.samples.length);
 }
});
test('Native mirror motion, control locks and poses replay sample by sample, both ways',()=>{
 let cases=0;
 for(const profile of Object.values(profiles)){
  if(!B[profile.character]||profile.derivedFrom||profile.id.includes('quick'))continue;
  for(const side of [-1,1]){
   const g=game([profile.character,profile.character],side),a=g.players[0],p=g.players[1],origin=p.x;p.y=profile.initialHeight;
   assert(R.start(g,p,a,profile,{direction:side}));
   for(let i=0;i<profile.samples.length;i++){
    if(i)R.update(g,p,1/profile.fps);
    const row=profile.samples[i];assert(p.reaction,profile.id+'/'+i);
    if(i<profile.controlSamples){assert(Math.abs(p.x-(origin+side*row.x))<1e-6,profile.id+' / '+i+' x '+p.x+' expected '+(origin+side*row.x));near(p.y,row.y);assert(p.stun>0||p.guardStun>0||p.knockdown>0);}
    const clip=B[p.id].clips[p.state];assert.equal(clip.frames[p.frame].native_pose_pointer,B[p.id].clips[profile.clip].frames[i].native_pose_pointer,profile.id+'/'+i);
   }
   run(g,.1);assert.equal(p.reaction,null,profile.id);cases++;
  }
 }
 details.push({nativeMirrorReplays:cases});
});
test('Hybrid reactions use only the victim atlas and preserve source contact time',()=>{
 for(const ids of [['scorpion','ryu'],['ryu','scorpion']])for(const name of ['punch','kick','normal_crouch_hp','normal_crouch_hk'])for(const side of [-1,1]){
  const g=game(ids,side),a=g.players[0],p=g.players[1],m=D[a.id].moves[name];if(!m?.reactionProfiles?.hit)continue;
  assert(g.hit(a,p,m,name));assert(p.reaction);const profile=profiles[p.reaction.profile];
  const deadline=profile.duration;
  for(let i=0;i<Math.ceil((deadline+.1)*240);i++){g.step(1/240);if(p.reaction){const clip=B[p.id].clips[p.state];assert(clip);assert(B[p.id].assets[clip.frames[p.frame].asset]);assert(Number.isFinite(p.x)&&Number.isFinite(p.y));}}
  assert.equal(p.reaction,null);assert.equal(p.y,0);
 }
});
test('MK jab keeps zero push; stronger contacts and corner recoil use measured displacement',()=>{
 const light=profiles[D.scorpion.moves.punch.reactionProfiles.hit];assert.equal(Math.max(...light.samples.map(s=>s.x)),0);
 const g=game(['ryu','ryu'],1,60),a=g.players[0],p=g.players[1];p.x=1060;a.x=1000;const before=a.x;
 assert(g.hit(a,p,D.ryu.moves.punch,'punch'));assert(p.reaction.profile.includes('corner'));
 run(g,1);near(p.x,1060);assert(a.x<before);assert(a.x>=40);
});
test('Confirmed late recovery input is accepted once; earlier presses are discarded',()=>{
 for(const id of ['scorpion','ryu'])for(const accepted of [false,true]){
  const g=game([id,id],1,160),a=g.players[0],p=g.players[1],profile=profiles[D[id].moves.punch.reactionProfiles.hit];R.start(g,p,a,profile);
  const lead=profile.earlyInputSamples;assert(lead>0);
  run(g,profile.duration-(lead+(accepted?-.2:3))/profile.fps);
  g.step(1/240,[{}, {punch:true}]);run(g,.25);
  assert.equal(g.events.some(e=>e.type==='action'&&e.player===1),accepted,id+' late='+accepted);
 }
});
test('Down/getup protection comes from reaction data and ends without fixed extra immunity',()=>{
 for(const id of ['scorpion','ryu']){
  const g=game([id,id]),a=g.players[0],p=g.players[1];const pf=R.catalog(g,p,'sweep','heavy');assert(pf?.knockdown);R.start(g,p,a,pf);
  const down=pf.phases.down||pf.phases.getup;assert(down);run(g,(down.start+1)/pf.fps);
  assert.equal(g.hurtBoxes(p).length,0);assert.equal(g.hit(a,p,D[id].moves.punch,'punch'),false);
  run(g,(pf.samples.length+2)/pf.fps);assert.equal(p.reaction,null);assert.equal(p.invulnerable,0);assert(g.hit(a,p,D[id].moves.punch,'punch'));
 }
});
test('Throw owner releases before victim landing; committed damage occurs exactly once',()=>{
 const g=game(['ryu','ryu'],1,40),p=g.players[0],q=g.players[1],m=D.ryu.moves.normal_throw_mp_1;assert(g.startAction(p,'normal_throw_mp_1'));
 run(g,(m.sourceSamples+2)/B.ryu.fps);assert.equal(p.action,null);assert(q.reaction?.deferred);assert.equal(q.health,100);
 run(g,.3);near(q.health,100-m.damage);assert.equal(g.events.filter(e=>e.type==='hit'&&e.committedThrow).length,1);
 run(g,1.4);assert.equal(q.reaction,null);assert.equal(q.y,0);
});
test('Reset clears deferred damage, contact buffers and vertical camera; snapshots own reaction state',()=>{
 const g=game(['ryu','ryu'],1,40);g.startAction(g.players[0],'normal_throw_mp_1');run(g,.7);assert(g.players[1].reaction);
 const snap=g.snapshot(),stored=JSON.stringify(snap.players[1].reaction);run(g,.1);assert.equal(JSON.stringify(snap.players[1].reaction),stored);
 g.reset();g.phase='fight';run(g,2);assert(g.players.every(p=>p.health===100&&!p.reaction&&!p.action));assert.equal(g.cameraY,0);
});
test('Interrupted coupled throw releases a victim into a finite native reaction',()=>{
 const g=game(),p=g.players[0],q=g.players[1];q.x=p.x+56;g.startAction(p,D.scorpion.defaultThrow);run(g,.2);assert(g.grapples.length);p.action=null;run(g,.1);assert.equal(g.grapples.length,0);assert(q.reaction);run(g,3);assert.equal(q.reaction,null);assert.equal(q.y,0);
});
test('Near Ryu HK separates first and weaker second contacts and never doubles first-hit damage',()=>{
 const m=D.ryu.moves.normal_stand_hk_near;assert(m.contactGroups?.[2]);near(m.contactGroups[2].damage,4/144*100);
 for(const group of [1,2]){
  const g=game(['ryu','ryu'],1,40),p=g.players[0],q=g.players[1];g.startAction(p,'normal_stand_hk_near');
  const sample=m.contactGroupTimeline.findIndex((v,i)=>v===group&&m.attackTimeline[i]?.length);assert(sample>=0);
  p.action.time=sample/m.sampleRate;g.collisions(0);g.collisions(0);
  near(q.health,100-(group===1?m.damage:m.contactGroups[2].damage));assert.equal(g.events.filter(e=>e.type==='hit').length,1);
 }
});
test('Air-hit and knockdown branches finish on the floor without stale jump physics',()=>{
 for(const ids of [['scorpion','ryu'],['ryu','scorpion']])for(const side of [-1,1]){
  const g=game(ids,side),p=g.players[0],q=g.players[1];q.y=45;q.airborne=true;q.motion=W.FightMovement.init(g,q);q.motion.jumpAge=10;
  assert(g.hit(p,q,D[p.id].moves.punch,'punch'));assert(q.reaction);run(g,4);assert.equal(q.y,0);assert(!q.airborne);assert.equal(q.reaction,null);
 }
});
test('A committed throw can finish a double KO; fatal reactions never stand up',()=>{
 const g=game(['ryu','ryu'],1,40),p=g.players[0],q=g.players[1];g.startAction(p,'normal_throw_mp_1');run(g,.7);assert(q.reaction?.deferred);p.health=0;q.health=.1;
 run(g,.1);assert.equal(g.phase,'fight');run(g,.6);assert.equal(g.phase,'roundEnd');assert.equal(g.roundWinner,null);assert.equal(q.health,0);
});
fs.writeFileSync(path.join(W.SEQUENCE_CALIBRATION?path.join(P,'comparacao/passo-7'):H,'verificacao-reacoes.json'),JSON.stringify({status:'PASS',passed,details},null,2));console.log(JSON.stringify({status:'PASS',tests:passed.length,details}));


