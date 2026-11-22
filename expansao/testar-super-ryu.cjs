const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=__dirname,s={window:{}};vm.createContext(s);
for(const f of ['assets','engine','commands','collisions','calibration','combat-data','ryu-especiais','ryu-projeteis','ryu-super','fight-engine','special-engine','session'])vm.runInContext(fs.readFileSync(path.join(root,'arena',f+'.js'),'utf8'),s,{filename:f});
const w=s.window,B=w.ARENA_ASSETS.characters,D=w.FIGHT_DATA,m=D.characters.ryu.moves.shinkuhadouken,passed=[];
function test(n,f){f();passed.push(n);console.log('PASS',n);}
function game(ids=['ryu','ryu'],options={}){const g=new w.FightArena(B,ids,D,options);g.phase='fight';g.timer=999;g.players.forEach(p=>p.meter=100);return g;}
function run(g,n,fn=()=>[]){for(let i=0;i<n;i++)g.step(1/240,fn(i));}
test('Super usa artes, colisões, pausa, medidor e reações nativos existentes',()=>{
 assert.equal(m.projectile.maxContacts,5);assert.equal(m.meterCost,100);assert.equal(m.freezeWindow.duration,13/m.sampleRate);
 for(const clip of [m.clip,m.projectile.clip,...Object.values(m.reactionProfiles).map(id=>D.reactions[id].clip)])for(const f of B.ryu.clips[clip].frames.filter(Boolean))assert(fs.existsSync(path.join(root,'arena',B.ryu.assets[f.asset].file)));
});
test('Duplo quarto de lua tem prioridade sobre Hadouken em ambos os lados',()=>{
 for(const c of D.characters.ryu.commands.filter(c=>c.move==='shinkuhadouken'))for(const facing of [-1,1]){
  const p={facing,airborne:false,history:c.sequence.map((code,i)=>({code,time:i*.025})),buffer:[{button:c.button,time:.13}],input:{},motionConsumedAt:-1};
  assert.equal(w.FightCommands.action(p,D.characters.ryu,.13).move,'shinkuhadouken');
 }
});
test('Reconhecedor reproduz as seis sondas nativas com direções intermediárias',()=>{
 const evidence=JSON.parse(fs.readFileSync(path.join(root,'evidencias/comando-super-nativo-r1.json')));
 for(const r of evidence.results)for(const facing of [-1,1]){
  const time=r.sequence.length*2/m.sampleRate,p={facing,airborne:false,history:r.sequence.map((code,i)=>({code,time:i*2/m.sampleRate})),buffer:[{button:'punch',time}],input:{},motionConsumedAt:-1};
  assert.equal(w.FightCommands.action(p,D.characters.ryu,time)?.move==='shinkuhadouken',r.accepted,r.case);
 }
});
test('Um Super consome a barra na ativação e congela o outro participante',()=>{
 const g=game(),[a,b]=g.players;a.x=250;b.x=800;a.meter=99;assert(!g.startAction(a,'shinkuhadouken'));a.meter=100;assert(g.startAction(a,'shinkuhadouken'));
 while(!g.superFreeze)g.step(1/240,[]);const x=b.x,t=g.timer;
 run(g,20,()=>[{}, {x:-1,up:true}]);assert.equal(b.x,x);assert.equal(b.y,0);assert.equal(a.meter,0);assert(g.timer<t);assert.equal(g.events.filter(e=>e.type==='meterSpent').length,1);
});
test('Contato pausa só o projétil, preserva seu orçamento e admite até cinco acertos',()=>{
 const g=game(),[a,b]=g.players;a.x=400;b.x=700;a.facing=1;b.facing=-1;g.spawnProjectile(a,'shinkuhadouken');const q=g.projectiles[0];
 for(let i=0;i<5;i++){
  b.health=100;b.invulnerable=0;b.reaction=null;b.stun=0;
  const r=g.projectileContact(q,b);assert(r.hit);assert.equal(r.remove,i===4);assert.equal(q.contacts,i+1);
  const x=q.x,age=q.age;g.advanceProjectile(q,1/240);assert.equal(q.x,x);assert.equal(q.age,age);assert(!g.projectileContact(q,b).hit);
  for(let j=0;j<40&&q.contactPause>0;j++)g.advanceProjectile(q,1/240);
 }
});
test('Combate real permite recontato e movimento do dono durante os impactos',()=>{
 for(const victim of ['ryu','scorpion'])for(const guard of [false,true]){
  const g=game(['ryu',victim]),[a,b]=g.players;a.x=400;b.x=650;a.facing=1;b.facing=-1;assert(g.startAction(a,'shinkuhadouken'));
  run(g,800,()=>[{},guard?(victim==='ryu'?{x:1}:{block:true}):{}]);
  const hits=g.events.filter(e=>['hit','block'].includes(e.type)&&e.move==='shinkuhadouken');
  assert.equal(hits.length,5);assert(b.health<100);assert(!a.action);assert(!g.projectiles.length);
 }
});
test('Choques nativos azul/vermelho gastam um contato; dois Supers inteiros se anulam',()=>{
 for(const name of ['hadouken_lp','red_hadouken_hp','shinkuhadouken']){
  const g=game(),[a,b]=g.players;a.x=300;b.x=800;g.spawnProjectile(a,'shinkuhadouken');g.spawnProjectile(b,name);
  const [q,r]=g.projectiles,result=g.clashProjectiles(q,r);assert.equal(result[1],true);
  assert.equal(result[0],name==='shinkuhadouken');assert.equal(q.contacts,name==='shinkuhadouken'?5:1);
  if(name!=='shinkuhadouken')assert(q.contactPause>0);
 }
});
test('O carro permanece imóvel durante a ativação e recebe o orçamento do Super',()=>{
 const g=game(['ryu','scorpion'],{mode:'bonus'}),p=g.players[0];p.x=400;p.facing=1;g.startAction(p,'shinkuhadouken');
 while(!g.superFreeze)g.step(1/240,[]);const damage=g.bonus.damage;run(g,20);assert.equal(g.bonus.damage,damage);run(g,900);assert(g.bonus.damage>0);assert.equal(g.players[1].health,100);
});
test('Supers simultâneos com 4, 8 e 16 participantes mantêm pausas e estados válidos',()=>{
 for(const n of [4,8,16]){const g=game(Array(n).fill('ryu'));for(const p of g.players)g.startAction(p,'shinkuhadouken');run(g,50);assert.equal(g.superFreeze.owners.length,n);run(g,1400);assert(g.players.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.meter>=0));assert.equal(g.superFreeze,null);}
});
fs.writeFileSync(path.join(root,'evidencias/testes-super-ryu.json'),JSON.stringify({status:'PASS',groups:passed,completeGame:false,limits:w.RYU_SUPER_STATUS.limits},null,2));
