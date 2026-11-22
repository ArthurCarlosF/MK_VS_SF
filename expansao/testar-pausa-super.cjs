const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=__dirname,s={window:{}};vm.createContext(s);for(const f of ['assets','engine','commands','collisions','calibration','combat-data','ryu-especiais','ryu-projeteis','fight-engine','special-engine','session'])vm.runInContext(fs.readFileSync(path.join(root,'arena',f+'.js'),'utf8'),s,{filename:f});
const w=s.window,B=w.ARENA_ASSETS.characters,D=w.FIGHT_DATA,fps=B.ryu.fps,passed=[];
function test(n,f){f();passed.push(n);console.log('PASS',n);}
D.characters.ryu.moves.freezeWitness={clip:'special',kind:'strike',damage:0,startup:1,active:0,recovery:1,sampleRate:fps,meterCost:100,meterCostSample:3,freezeWindow:{start:3/fps,duration:8/fps,inputLead:2/fps}};
function game(ids=['ryu','ryu']){const g=new w.FightArena(B,ids);g.phase='fight';g.timer=99;g.players[0].meter=100;g.players[0].x=400;g.players[1].x=700;return g;}
function run(g,n,fn=()=>[]){for(let i=0;i<n;i++)g.step(1/240,fn(i));}
function begin(g){assert(g.startAction(g.players[0],'freezeWitness'));for(let i=0;i<100&&!g.superFreeze;i++)g.step(1/240,[]);assert(g.superFreeze);}
test('Medidor exigido, consumido na fase medida e cobrado uma única vez',()=>{
 const g=game(),p=g.players[0];p.meter=99;assert.equal(g.canStart(p,'freezeWitness'),false);p.meter=100;begin(g);assert.equal(p.meter,0);run(g,60);assert.equal(p.meter,0);assert.equal(g.events.filter(e=>e.type==='meterSpent').length,1);
});
test('Pausa preserva corpos, projéteis e reações, mas mantém o relógio correndo',()=>{
 const g=game(),p=g.players[1];g.spawnProjectile(p,'hadouken_lp');begin(g);p.stun=.5;const saved={x:p.x,y:p.y,stun:p.stun,clock:p.stateTime,shot:g.projectiles[0].x,age:g.projectiles[0].age,timer:g.timer};
 run(g,8,()=>[{}, {x:-1,up:true}]);assert.equal(p.x,saved.x);assert.equal(p.y,saved.y);assert.equal(p.stun,saved.stun);assert.equal(p.stateTime,saved.clock);assert.equal(g.projectiles[0].x,saved.shot);assert.equal(g.projectiles[0].age,saved.age);assert(Math.abs(g.timer-(saved.timer-8/240))<1e-8);
});
test('Apertar cedo, inclusive mantendo o botão, não cria um soco depois da pausa',()=>{
 for(const held of [false,true]){const g=game();begin(g);run(g,70,i=>[{}, {punch:i===0||held&&i<45}]);assert(!g.events.some(e=>e.type==='action'&&e.player===1));}
});
test('Apertar nos dois últimos quadros preserva a entrada até o retorno',()=>{
 const g=game();begin(g);let pressed=false;
 while(g.superFreeze?.remaining>1e-9){const late=g.superFreeze.remaining<1/fps&&!pressed;g.step(1/240,[{}, {punch:late}]);if(late)pressed=true;}
 run(g,10);assert(g.events.some(e=>e.type==='action'&&e.player===1));
});
test('Movimentos direcionais feitos durante a pausa não avançam o reconhecedor',()=>{
 const g=game();begin(g);const history=JSON.stringify(g.players[1].history.map(e=>e.code));run(g,15,i=>[{}, i<5?{down:true}:i<10?{down:true,x:-1}:{x:-1}]);assert.equal(JSON.stringify(g.players[1].history.map(e=>e.code)),history);
});
test('Supers simultâneos de participantes diferentes não disputam um dono único',()=>{
 const g=game(Array(8).fill('ryu'));for(const p of g.players){p.meter=100;assert(g.startAction(p,'freezeWitness'));}
 run(g,20);assert.equal(g.superFreeze.owners.length,8);assert(g.players.every(p=>p.meter===0));run(g,100);assert.equal(g.superFreeze,null);assert(g.players.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)));
});
fs.writeFileSync(path.join(root,'evidencias/testes-pausa-super.json'),JSON.stringify({status:'PASS',groups:passed,nativeEvidence:'sondas-pausa-super-r2.json',syntheticMoveFixture:true,liveSuperIntegrated:false},null,2));
