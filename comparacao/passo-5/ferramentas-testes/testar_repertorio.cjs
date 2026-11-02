const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const P=path.resolve(__dirname,'..'),H=path.join(P,'comparacao/passo-4'),s={window:{}};vm.createContext(s);
for(const f of ['assets','engine','commands','collisions','calibration','combat-data','fight-engine'])vm.runInContext(fs.readFileSync(path.join(P,'arena',f+'.js'),'utf8'),s);
const W=s.window,B=W.ARENA_ASSETS.characters,D=W.FIGHT_DATA.characters,passed=[],details=[];
const test=(name,f)=>{f();passed.push(name);};
const run=(g,t,input=[{},{}])=>{for(let n=0;n<Math.round(t*240);n++)g.step(1/240,input);};
const game=(ids=['scorpion','ryu'],reversed=false,gap=56)=>{const g=new W.FightArena(B,ids);g.phase='fight';g.players[0].x=reversed?550+gap:550;g.players[1].x=reversed?550:550+gap;g.players[0].facing=reversed?-1:1;g.players[1].facing=-g.players[0].facing;return g;};
test('All imported frames exist, have native provenance and no idle replacement',()=>{
 const resources=JSON.parse(fs.readFileSync(path.join(H,'recursos.json')));assert.equal(resources.unmapped_used.length,0);
 for(const [id,b] of Object.entries(B))for(const [name,c] of Object.entries(b.clips))for(const f of c.frames){assert(b.assets[f.asset],id+'/'+name);assert(fs.existsSync(path.join(P,'arena',b.assets[f.asset].file)));assert(!f.unmapped);}
});
test('Native control layout exposes exactly four MK and six SF attack buttons',()=>{
 assert.equal(Object.keys(D.scorpion.normalControls).length,4);assert.equal(Object.keys(D.ryu.normalControls).length,6);
});
test('Distance, crouch and jump direction select native variants in both facings',()=>{
 for(const id of ['scorpion','ryu'])for(const [button,c] of Object.entries(D[id].normalControls))for(const facing of [-1,1]){
  for(const [posture,expected,distance] of [['far',c.standing.far,250],['near',c.standing.near,40],['crouch',c.crouch,250],['airVertical',c.airVertical,250],['airDirectional',c.airDirectional,250]]){
   const p={buffer:[{button,release:false}],input:{x:0,down:posture==='crouch'},airborne:posture.startsWith('air'),jumpKind:posture==='airVertical'?'jump':'jumpForward',facing,opponentDistance:distance,directions:[],history:[]};
   assert.equal(W.FightCommands.action(p,D[id],0).move,expected,id+' '+button+' '+posture);
  }
 }
});
test('Every new normal advances native poses and recovers without invalid roots',()=>{
 for(const id of ['scorpion','ryu'])for(const [name,m] of Object.entries(D[id].moves)){
  if(!name.startsWith('normal_')||m.grapple)continue;
  const g=game([id,id],false,250),p=g.players[0];if(m.air){g.step(1/240,[{up:true},{}]);run(g,.12);}
  assert(g.startAction(p,name),id+'/'+name);let frames=new Set(),hits=[];
  for(let n=0;n<600;n++){g.step(1/240);frames.add(p.state+':'+p.frame);assert(Number.isFinite(p.x)&&Number.isFinite(p.y));assert(p.y>=0);}
  assert(frames.size>2,id+'/'+name+' frozen');assert.equal(p.action,null,id+'/'+name+' stuck');assert.equal(p.y,0);
  details.push({character:id,move:name,frames:frames.size});
 }
});
test('Native throw families run once, mirror their roots and release both actors',()=>{
 for(const ids of [['scorpion','scorpion'],['ryu','ryu'],['scorpion','ryu'],['ryu','scorpion']])for(const reversed of [false,true]){
  const id=ids[0],names=id==='scorpion'?[D[id].defaultThrow]:['normal_throw_mp_1','normal_throw_mp_-1','normal_throw_mk_1','normal_throw_mk_-1'];
  for(const name of names){const g=game(ids,reversed),p=g.players[0],q=g.players[1],m=D[id].moves[name];assert(g.startAction(p,name));run(g,.13);
   assert.equal(g.grapples.length,1,name);assert(q.state.startsWith('victim_'));assert.equal(q.action,null);
   assert(B[q.id].clips[q.state]);run(g,2.1);
   assert.equal(g.events.filter(e=>e.type==='hit').length,1);assert(Math.abs(q.health-(100-m.damage))<1e-7);
   assert.equal(g.grapples.length,0);assert.equal(p.action,null);assert.equal(q.y,0);assert(Number.isFinite(q.x));
  }
 }
});
test('MK back direction suppresses grab; guard alone does not escape it',()=>{
 for(const [input,grabs] of [[{x:1},false],[{block:true},true],[{down:true},true]]){const g=game();run(g,.8,[{punch:true},input]);assert.equal(g.events.some(e=>e.type==='grab'),grabs);}
});
test('SF direction plus medium/heavy punch or kick selects corresponding throw',()=>{
 for(const button of ['punch2','punch3','kick2','kick3'])for(const sign of [-1,1])for(const rev of [false,true]){
  const g=game(['ryu','scorpion'],rev);run(g,.13,[{x:sign*g.players[0].facing,[button]:true},{}]);assert.equal(g.grapples.length,1);assert(g.grapples[0].move.endsWith('_'+sign));
 }
});
test('Throw cannot reach distant or airborne players or bypass wakeup immunity',()=>{
 for(const id of ['scorpion','ryu'])for(const state of ['far','air','immune']){const g=game([id,id],false,state==='far'?200:56);const q=g.players[1];if(state==='air')q.airborne=true;if(state==='immune')q.invulnerable=.2;
  assert.equal(g.startAction(g.players[0],D[id].defaultThrow),false);assert.equal(g.grapples.length,0);
 }
});
test('Interrupted grapple, reset and KO cannot retain a target lock',()=>{
 for(const mode of ['interrupt','reset','ko']){const g=game();assert(g.startAction(g.players[0],D.scorpion.defaultThrow));run(g,.12);assert.equal(g.grapples.length,1);
  if(mode==='interrupt'){g.players[0].action=null;run(g,.5);}else if(mode==='reset')g.reset();else{g.players[1].health=.1;run(g,1);}
  assert.equal(g.grapples.length,0,mode);if(mode==='ko')assert.equal(g.phase,'roundEnd');
 }
});
fs.writeFileSync(path.join(W.PHASE_CALIBRATION?path.join(P,'comparacao/passo-5'):H,'verificacao-repertorio.json'),JSON.stringify({status:'PASS',passed,details},null,2));console.log(JSON.stringify({status:'PASS',tests:passed.length,moves:details.length}));
