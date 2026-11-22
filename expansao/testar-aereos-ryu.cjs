const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=__dirname,s={window:{}};vm.createContext(s);
for(const f of ['assets','engine','commands','collisions','calibration','combat-data','ryu-especiais','ryu-projeteis','ryu-super','ryu-aereos','fight-engine','special-engine','session'])vm.runInContext(fs.readFileSync(path.join(root,'arena',f+'.js'),'utf8'),s,{filename:f});
const w=s.window,B=w.ARENA_ASSETS.characters,D=w.FIGHT_DATA,names=w.RYU_AIR_STATUS.moves,passed=[];
function test(n,f){f();passed.push(n);console.log('PASS',n);}
function game(ids=['ryu','scorpion']){const g=new w.FightArena(B,ids,D);g.phase='fight';g.timer=999;return g;}
function run(g,n,fn=()=>[]){for(let i=0;i<n;i++)g.step(1/240,fn(i));}
function airborne(g,p,kind='jump',age=17){p.motion ||= w.FightMovement.init(g,p);p.jumpKind=kind;p.motion.jumpAge=age;p.motion.jumpFacing=p.facing;p.y=B.ryu.movement.jumps[kind].heights[age-1];p.airborne=true;}
test('Três forças têm arte aérea, aterrissagem, física e reações próprias',()=>{
 assert.equal(names.length,3);
 for(const name of names){const m=D.characters.ryu.moves[name];assert(m.air&&m.untilLanding&&m.airPhysics);assert.equal(m.airPhysics.normalGravity,80);assert.equal(m.airPhysics.floatGravity,32);
  for(const clip of [m.clip,m.landingClip])for(const f of B.ryu.clips[clip].frames)assert(fs.existsSync(path.join(root,'arena',B.ryu.assets[f.asset].file)));
  assert(D.reactions[m.reactionProfiles.hit]);
 }
 const audit=JSON.parse(fs.readFileSync(path.join(root,'evidencias/aereos-ryu-integracao.json')));assert(audit.velocityInference.every(v=>!v.heightInferenceErrors.length));
});
test('A física 8.8 preserva direção, aplica impulso na subida e respeita duração do flutuar',()=>{
 for(const name of names)for(const sign of [-1,1]){
  const g=game(),p=g.players[0],m=D.characters.ryu.moves[name],c=m.airPhysics;airborne(g,p);g.startAction(p,name);
  p.action.time=1;p.action.airMotion={vx:768*sign,vy:512,drag:5,gravity:80,clock:0,ticks:0,boosted:false,floatLeft:0};
  const x=p.x,y=p.y;g.advanceAirSpecial(p,m,1/c.updateRate);const b=p.action.airMotion;
  assert.equal(b.vx,(768+c.boost-5)*sign);assert.equal(b.vy,480);assert.equal(b.gravity,32);assert.equal(b.floatLeft,c.floatTicks-1);
  assert.equal(p.x-x,b.vx/256*1.25);assert.equal(p.y-y,b.vy/256*1.25);
  for(let i=1;i<c.floatTicks;i++)g.advanceAirSpecial(p,m,1/c.updateRate);assert.equal(b.gravity,80);
 }
});
test('Começar na descida mantém velocidade horizontal e gravidade normal',()=>{
 for(const name of names){const g=game(),p=g.players[0],m=D.characters.ryu.moves[name];airborne(g,p);g.startAction(p,name);p.action.time=1;
  p.action.airMotion={vx:-768,vy:-512,drag:5,gravity:80,clock:0,ticks:0,boosted:false,floatLeft:0};g.advanceAirSpecial(p,m,1/m.airPhysics.updateRate);
  const b=p.action.airMotion;assert.equal(b.vx,-763);assert.equal(b.vy,-592);assert.equal(b.gravity,80);assert.equal(b.floatLeft,0);
 }
});
test('Preparação do salto ainda no chão aceita Tatsumaki terrestre e impede o aéreo',()=>{
 const g=game(),p=g.players[0];p.airborne=true;p.y=0;
 assert(!g.canStart(p,'air_tatsumaki_lk'));assert(g.canStart(p,'tatsumaki_lk'));
 p.history=[{code:2,time:0},{code:1,time:.03},{code:4,time:.06}];p.buffer=[{button:'kick',time:.07}];p.motionConsumedAt=-1;
 assert.equal(w.FightCommands.action(p,D.characters.ryu,.07).move,'tatsumaki_lk');p.y=10;assert.equal(w.FightCommands.action(p,D.characters.ryu,.07).move,'air_tatsumaki_lk');
});
test('Todos os tipos de salto e momentos de ativação aterrissam sem saltos de posição',()=>{
 for(const name of names)for(const kind of ['jump','jumpForward','jumpBackward'])for(const age of [8,17,30])for(const facing of [-1,1]){
  const g=game(),p=g.players[0];g.resolvePositions=()=>{};p.x=550;p.facing=facing;airborne(g,p,kind,age);assert(g.startAction(p,name));
  let landing=false,previousY=p.y;
  for(let i=0;i<650;i++){g.step(1/240,[]);assert(Number.isFinite(p.x)&&Number.isFinite(p.y));assert(Math.abs(p.y-previousY)<20);previousY=p.y;if(g.events.some(e=>e.type==='land'&&e.player===0))landing=true;}
  assert(landing,name+kind+age);assert.equal(p.y,0);assert.equal(p.airborne,false);assert.equal(p.action,null);assert.equal(g.events.filter(e=>e.type==='land'&&e.player===0).length,1);assert.equal(p.meter,12.5);
 }
});
test('Contato aéreo atinge os dois universos e não se repete por quadro',()=>{
 for(const name of names)for(const victim of ['ryu','scorpion'])for(const facing of [-1,1]){
  const g=game(['ryu',victim]),[p,q]=g.players;p.x=550;p.facing=facing;q.x=550+facing*45;q.facing=-facing;airborne(g,p);q.motion ||= w.FightMovement.init(g,q);q.y=p.y;q.airborne=true;q.jumpKind='jump';q.motion.jumpAge=17;q.motion.jumpFacing=q.facing;
  assert(g.startAction(p,name));run(g,600);const hits=g.events.filter(e=>e.type==='hit'&&e.move===name);assert.equal(hits.length,1,name+victim+facing);assert(q.health<100);
 }
});
test('Quatro, oito e dezesseis lutadores terminam especiais aéreos sem estados inválidos',()=>{
 for(const n of [4,8,16]){const g=game(Array(n).fill('ryu'));for(const p of g.players){airborne(g,p,'jumpForward',17);g.startAction(p,names[p.index%3]);}run(g,1200);assert(g.players.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.y>=0));}
});
test('Pausa de Super interrompe a física aérea e depois permite a continuação',()=>{
 const g=game(['ryu','ryu']),[a,b]=g.players;a.x=350;b.x=800;airborne(g,a);g.startAction(a,'air_tatsumaki_hk');b.meter=100;g.startAction(b,'shinkuhadouken');
 while(!g.superFreeze)g.step(1/240,[]);const saved={x:a.x,y:a.y,t:a.action.time,ticks:a.action.airMotion.ticks};
 run(g,12);assert.equal(a.x,saved.x);assert.equal(a.y,saved.y);assert.equal(a.action.time,saved.t);assert.equal(a.action.airMotion.ticks,saved.ticks);
 run(g,150);assert(!a.action||a.action.time>saved.t);
});
test('Fim de rodada preserva o voo modificado até a aterrissagem',()=>{
 const g=game(),p=g.players[0];airborne(g,p);g.startAction(p,'air_tatsumaki_hk');run(g,30);g.phase='roundEnd';g.phaseTime=3;run(g,380);
 assert.equal(p.y,0);assert.equal(p.airborne,false);assert.equal(p.action,null);assert.equal(g.events.filter(e=>e.type==='land'&&e.player===0).length,1);
});
fs.writeFileSync(path.join(root,'evidencias/testes-aereos-ryu.json'),JSON.stringify({status:'PASS',groups:passed,completeGame:false,limits:w.RYU_AIR_STATUS.limits},null,2));
