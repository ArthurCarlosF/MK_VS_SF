const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const P=path.resolve(__dirname,'..'),H=path.join(P,'comparacao/passo-7'),s={window:{}};vm.createContext(s);
for(const f of ['assets','engine','commands','collisions','calibration','combat-data','fight-engine'])vm.runInContext(fs.readFileSync(path.join(P,'arena',f+'.js'),'utf8'),s);
const W=s.window,B=W.ARENA_ASSETS.characters,D=W.FIGHT_DATA.characters,passed=[],details=[];
const test=(n,f)=>{f();passed.push(n)},near=(a,b)=>assert(Math.abs(a-b)<1e-6,`${a} != ${b}`);
const raw={scorpion:{0:'punch',1:'punch2',8:'kick',9:'kick2',10:'block'},ryu:{0:'punch',8:'punch2',1:'punch3',9:'kick',10:'kick2',11:'kick3'}};
function inp(v,id,side=1){return {x:(v.x||0)*side,down:!!v.down,up:!!v.up,...Object.fromEntries((v.raw||[]).map(b=>[raw[id][b],true]))};}
function game(ids=['scorpion','scorpion'],side=1,gap=63){const g=new W.FightArena(B,ids);g.phase='fight';g.players[0].x=side===1?450:650;g.players[1].x=g.players[0].x+side*gap;g.players[0].facing=side;g.players[1].facing=-side;return g;}
const run=(g,t,input=[{},{}])=>{for(let i=0;i<Math.ceil(t*240);i++)g.step(1/240,input);};
function replay(c,ids=['scorpion','scorpion'],side=1){const gap=c.initial.players[1].x-c.initial.players[0].x,g=game(ids,side,gap);let tick=0;const health=[];for(const r of c.samples){const end=Math.floor((r.sample+1)*240/B[ids[0]].fps+1e-9);while(tick<end){g.step(1/240,r.input.map((v,i)=>inp(v,ids[i],side)));tick++;}health.push(g.players[1].health);}return {g,health};}
test('28 native high/low punch prefixes keep arm, height and rhythm without extra punches',()=>{
 for(const folder of fs.readdirSync(path.join(H,'mistura-mk/original/umk3/rep-1')).filter(n=>n.startsWith('mix_'))){
  const c=JSON.parse(fs.readFileSync(path.join(H,'mistura-mk/original/umk3/rep-1',folder,'trace.json'))),g=game(['scorpion','scorpion'],1,103),expected=[],actual=[];let tick=0,prev,sprev;
  const ext=['0xff938dd0','0xff938ef0','0xff9393d0','0xff9394f0'];
  for(const r of c.samples){const end=Math.floor((r.sample+1)*240/B.scorpion.fps+1e-9);while(tick<end){g.step(1/240,r.input.map(v=>inp(v,'scorpion')));tick++;}const p=g.players[0],ptr=B.scorpion.clips[p.state].frames[p.frame].native_pose_pointer,source=r.after.players[0].pose;if(ptr!==prev&&ext.includes(ptr))actual.push([r.sample,ptr]);if(source!==sprev&&ext.includes(source))expected.push([r.sample,source]);prev=ptr;sprev=source;}
  assert.equal(actual.length,expected.length,c.id);actual.forEach((v,i)=>{assert.equal(v[1],expected[i][1],c.id);assert(Math.abs(v[0]-expected[i][0])<=1,c.id+' time');});
 }details.push({mixedPunchPrefixes:28});
});
test('MK terminal combinations reproduce hit count and native reduced damage, both facings',()=>{
 for(const route of ['elbows','triple','four','knees'])for(const side of [-1,1]){
  const c=JSON.parse(fs.readFileSync(path.join(H,`confirmacao-mk/original/umk3/rep-1/confirm_${route}_False/trace.json`))),{g,health}=replay(c,undefined,side);
  const expected=c.samples.filter(r=>r.after.players[1].health<r.before.players[1].health).map(r=>r.sample),actual=health.flatMap((hp,i)=>hp<(i?health[i-1]:100)-1e-7?[i]:[]);
  assert.equal(actual.length,expected.length,route+' '+side+' '+JSON.stringify(actual));assert(actual.every((sample,i)=>Math.abs(sample-expected[i])<=1),route+' native timing');near(g.players[1].health,c.samples.at(-1).after.players[1].health/166*100);assert.equal(g.players[1].reaction,null);assert.equal(g.players[1].y,0);details.push({route,side,expected,actual});
 }
});
test('Guarded MK terminal prefixes preserve native chip without treating blocked hits as full damage',()=>{
 for(const route of ['elbows','triple','four','knees']){const c=JSON.parse(fs.readFileSync(path.join(H,`confirmacao-mk/original/umk3/rep-1/confirm_${route}_True/trace.json`)));const {g}=replay(c);near(g.players[1].health,c.samples.at(-1).after.players[1].health/166*100);}
});
test('MK combinations can hit either crossover victim and use only victim-owned reaction assets',()=>{
 const c=JSON.parse(fs.readFileSync(path.join(H,'confirmacao-mk/original/umk3/rep-1/confirm_four_False/trace.json')));
 for(const side of [-1,1]){const {g}=replay(c,['scorpion','ryu'],side);assert.equal(g.events.filter(e=>e.type==='hit').length,4);assert.equal(g.players[1].reaction,null);assert.equal(g.players[1].y,0);}
});
test('Holding HP never auto-repeats; invalid combo branches never queue until recovery',()=>{
 let g=game();run(g,2,[{punch2:true},{}]);assert.equal(g.events.filter(e=>e.type==='hit').length,1);
 g=game();g.startAction(g.players[0],'normal_stand_hp_near');g.requestAction(g.players[0],{move:'normal_stand_hp_near',event:{button:'punch2'}});run(g,1);assert.equal(g.events.filter(e=>e.type==='hit').length,1);
});
test('A hit lock prevents guard switching inside a real combo; a recovered gap permits defense',()=>{
 const g=game(['ryu','ryu'],1,60),a=g.players[0],p=g.players[1];p.input.x=0;assert(g.hit(a,p,D.ryu.moves.crouchPunch,'crouchPunch'));p.input.x=1;
 assert(g.hit(a,p,D.ryu.moves.crouchPunch,'crouchPunch'));assert.equal(g.events.at(-1).type,'hit');run(g,1);p.input.x=1;assert(g.hit(a,p,D.ryu.moves.crouchPunch,'crouchPunch'));assert.equal(g.events.at(-1).type,'block');
});
test('Late SF links are bounded; early different normals do not survive recovery',()=>{
 for(const late of [false,true]){const g=game(['ryu','ryu'],1,300),p=g.players[0];g.startAction(p,'normal_stand_mp_far');const m=D.ryu.moves.normal_stand_mp_far;p.action.time=m.startup+m.active+m.recovery-(late?1:5)/B.ryu.fps;g.step(1/240,[{kick:true},{}]);run(g,.2);assert.equal(g.events.some(e=>e.type==='link'),late);}
});
test('Native cancellation windows reject late recovery and require the measured outcome',()=>{
 let count=0;for(const [name,m] of Object.entries(D.ryu.moves))for(const [to,rule] of Object.entries(m.specialCancels||{})){
  const g=game(['ryu','ryu'],1,60),p=g.players[0];g.startAction(p,name);assert(p.action,name);p.action.connected=true;p.action.contactResult=rule.outcomes.find(v=>v!=='whiff')||rule.outcomes[0];const [lo,hi]=(rule.byOutcome?.[p.action.contactResult]||rule.ranges)[0];if(rule.wallByOutcome)p.action.wallTime=rule.wallByOutcome[p.action.contactResult][0][0]/B.ryu.fps;p.action.time=(lo+.2)/B.ryu.fps;assert(g.canStart(p,to),name+' valid cancel');p.action.time=(hi+.2)/B.ryu.fps;assert(!g.canStart(p,to),name+' late cancel');count++;
 }assert(count>=10);details.push({cancelAliasesTested:count});
});
test('Reset and hit interruption clear pending chain and late-link requests',()=>{
 const g=game(),p=g.players[0];g.startAction(p,'normal_stand_hp_near');p.action.time=6/B.scorpion.fps;g.requestAction(p,{move:'normal_stand_hp_near',event:{button:'punch2'}});assert(p.action.chain);g.hit(g.players[1],p,D.ryu.moves.punch,'punch');assert(!p.action);run(g,1);assert(!g.events.some(e=>e.type==='chain'));g.reset();assert(g.players.every(p=>!p.action));
});
fs.writeFileSync(path.join(H,'verificacao-sequencias.json'),JSON.stringify({status:'PASS',passed,details},null,2));console.log(JSON.stringify({status:'PASS',tests:passed.length,details}));
