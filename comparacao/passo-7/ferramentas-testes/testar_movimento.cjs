const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert/strict');
const P=path.resolve(__dirname,'..'),H=path.join(P,'comparacao/passo-3'),s={window:{}};vm.createContext(s);
for(const f of ['assets','engine','commands','collisions','calibration','combat-data','fight-engine'])vm.runInContext(fs.readFileSync(path.join(P,'arena',f+'.js'),'utf8'),s);
const W=s.window,B=W.ARENA_ASSETS.characters,passed=[];const test=(name,fn)=>{fn();passed.push(name);};
const game=(ids=['scorpion','ryu'])=>{const g=new W.FightArena(B,ids);g.phase='fight';return g;};
const run=(g,sec,input=[{},{}])=>{for(let i=0;i<Math.round(sec*240);i++)g.step(1/240,typeof input==='function'?input(i):input);};
const eq=(a,b,t=1e-6)=>assert(Math.abs(a-b)<=t,a+' != '+b);
const native=game=>JSON.parse(fs.readFileSync(path.join(H,'execucao-01/original',game,'rep-1/trace.json')));
test('34 original movement cases reproduce across two fresh processes per game',()=>{
 for(const name of ['umk3','ssf2tu']){const a=native(name),b=JSON.parse(fs.readFileSync(path.join(H,'execucao-01/original',name,'rep-2/trace.json')));assert.equal(a.cases.length,34);assert.deepEqual(a.cases,b.cases);}
});
test('Profiles keep separate native sampling clocks, SF scale, and source-specific push widths',()=>{
 assert(B.scorpion.movement.sampleRate<54);assert(B.ryu.movement.sampleRate>59);eq(B.ryu.movement.sourceScale,1.25);eq(B.scorpion.movement.pushHalfWidth,31.5);eq(B.ryu.movement.pushHalfWidth,20);
});
test('Source Scorpion walk/run and all six isolated jump curves match recorded positions/heights',()=>{
 const report=JSON.parse(fs.readFileSync(path.join(H,'paridade-movimento.json')));
 for(const row of report.rows.filter(r=>(r.game==='umk3'&&['walk_forward_12','walk_forward_24','walk_backward_12','walk_backward_24','run_forward'].includes(r.id))||['jump_vertical','jump_forward_free','jump_backward_free'].includes(r.id))){eq(row.after.x,0);eq(row.after.height,0);}
});
test('Ryu sampled walk stays within one native movement update across 12/24-sample trials',()=>{
 const report=JSON.parse(fs.readFileSync(path.join(H,'paridade-movimento.json')));for(const row of report.rows.filter(r=>r.game==='ssf2tu'&&['walk_forward_12','walk_forward_24','walk_backward_12','walk_backward_24'].includes(r.id)))assert(row.after.x<=3.75);
});
test('Releasing walk retains the measured two-sample delay then stops',()=>{
 const g=game(['scorpion','scorpion']);const x=g.players[0].x;run(g,12/B.scorpion.fps,[{x:1},{}]);const before=g.players[0].x;run(g,6/B.scorpion.fps);eq(g.players[0].x-x,39);assert(g.players[0].x>before);const end=g.players[0].x;run(g,.2);eq(g.players[0].x,end);
});
test('Running jump selects its own measured transition and keeps the run resource',()=>{
 const g=game();run(g,10/B.scorpion.fps,[{x:1,run:true},{}]);const before=g.players[0].motion.runEnergy;run(g,.04,[{x:1,run:true,up:true},{}]);assert.equal(g.players[0].jumpKind,'jumpRunForward');assert(g.players[0].motion.runEnergy<=before);run(g,1.2);eq(g.players[0].y,0);
});
test('Running is only Scorpion forward + run; Ryu never inherits it',()=>{
 for(const ids of [['scorpion','ryu'],['ryu','scorpion']]){const i=ids.indexOf('scorpion'),g=game(ids),input=[{},{}];input[i]={x:g.players[i].facing,run:true};run(g,.2,input);assert(g.players[i].motion.runEnergy<48);assert.equal(g.players[i].state,'run');}
 const g=game(['ryu','ryu']);run(g,.2,[{x:1,run:true},{}]);assert.equal(g.players[0].state,'forward');assert(!B.ryu.movement.run);
});
test('Run consumes 48-unit energy, exhausts, then recovers with a delay',()=>{
 const g=game();run(g,52/B.scorpion.fps,[{x:1,run:true},{}]);eq(g.players[0].motion.runEnergy,0);run(g,.3);eq(g.players[0].motion.runEnergy,0);run(g,2);eq(g.players[0].motion.runEnergy,48);
});
test('Backward/neutral/guard + run do not spend energy',()=>{
 for(const u of [{x:-1,run:true},{run:true},{x:1,run:true,block:true}]){const g=game();run(g,.4,[u,{}]);eq(g.players[0].motion.runEnergy,48);assert.notEqual(g.players[0].state,'run');}
});
test('Horizontal input does not steer a jump after takeoff',()=>{
 for(const id of ['scorpion','ryu']){const a=game([id,id]),b=game([id,id]);run(a,.09,[{up:true},{}]);run(b,.09,[{up:true},{}]);run(a,.3,[{x:1},{}]);run(b,.3);eq(a.players[0].x,b.players[0].x);eq(a.players[0].y,b.players[0].y);}
});
test('Backward jumps select separate native pose/trajectory data',()=>{
 for(const id of ['scorpion','ryu']){const g=game([id,id]);run(g,.25,[{up:true,x:-1},{}]);assert.equal(g.players[0].jumpKind,'jumpBackward');assert(g.players[0].y>40);assert(g.players[0].x<440);assert(B[id].clips.jumpBackward.frames.length>20);}
});
test('Air attacks preserve the jump trajectory and ground at zero',()=>{
 const g=game();run(g,.15,[{up:true,x:1},{}]);run(g,.01,[{punch:true},{}]);assert(g.players[0].action?.name==='normal_airForward_lp');run(g,1.2);eq(g.players[0].y,0);assert(!g.players[0].airborne);
});
test('Walking pushes stationary bodies; neither can overlap or move through a grounded opponent',()=>{
 const g=game();g.players[0].x=500;g.players[1].x=552;run(g,1,[{x:1},{}]);assert(g.players[1].x>552);assert(g.players[1].x-g.players[0].x>=51.5-1e-6);
});
test('Both player orders cross in the air and face opponent after landing',()=>{
 for(const ids of [['scorpion','ryu'],['ryu','scorpion']])for(const i of [0,1]){const g=game(ids);g.players[0].x=500;g.players[1].x=560;const u=[{},{}];u[i]={up:true,x:i?-1:1};run(g,.05,u);run(g,1.1);const p=g.players[i],q=g.players[1-i];assert(i?p.x<q.x:p.x>q.x);assert.equal(p.facing,q.x>p.x?1:-1);eq(p.y,0);}
});
test('Maximum separation stops retreat without dragging stationary player',()=>{
 const g=game(['scorpion','scorpion']);g.players[0].x=400;g.players[1].x=600;run(g,2,[{x:-1},{}]);eq(g.players[1].x,600);eq(g.players[1].x-g.players[0].x,306);
});
test('Ryu mirror retains scaled maximum source separation without moving idle opponent',()=>{
 const g=game(['ryu','ryu']);g.players[0].x=440;g.players[1].x=660;run(g,3,[{x:-1},{}]);eq(g.players[1].x,660);eq(g.players[1].x-g.players[0].x,380);
});
test('Stage corners prevent ground escape and do not pin aerial crossover into the floor',()=>{
 const g=game();g.players[0].x=40;g.players[1].x=100;run(g,.8,[{x:-1},{}]);eq(g.players[0].x,40);run(g,.05,[{x:-1,up:true},{}]);run(g,.2);assert(g.players[0].y>0);assert(g.players[0].x>=40);run(g,1);eq(g.players[0].y,0);
});
test('Shared dead-zone camera rests, tracks edge motion and remains inside the stage',()=>{
 const g=game();const c=g.camera;run(g,.4);eq(g.camera,c);run(g,4,[{x:1},{x:1}]);assert(g.camera>c);assert(g.camera<=860);for(const p of g.players)assert(p.x>=40&&p.x<=1060);
});
test('Camera step does not depend on number of fixed simulation calls',()=>{
 const a=game(),b=game();a.players[1].x=b.players[1].x=790;W.FightMovement.camera(a,1/60);for(let i=0;i<4;i++)W.FightMovement.camera(b,1/240);eq(a.camera,b.camera);
});
test('A third character registration inherits motion profile without name branches',()=>{
 const bank={...B,extra:{...B.ryu}},data={...W.FIGHT_DATA,characters:{...W.FIGHT_DATA.characters,extra:W.FIGHT_DATA.characters.ryu}};const g=new W.FightArena(bank,['extra','scorpion'],data);g.phase='fight';run(g,.3,[{x:-1,up:true},{}]);assert.equal(g.players[0].jumpKind,'jumpBackward');assert(g.players[0].y>0);
});
fs.writeFileSync(path.join(P,'arena/verificacao-movimento.json'),JSON.stringify({status:'PASS',date:new Date().toISOString(),tests:passed.length,passed},null,2));console.log(JSON.stringify({status:'PASS',tests:passed.length,passed},null,2));
