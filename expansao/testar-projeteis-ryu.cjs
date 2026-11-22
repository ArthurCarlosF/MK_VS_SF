const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=__dirname,s={window:{}};vm.createContext(s);
for(const f of ['assets','engine','commands','collisions','calibration','combat-data','ryu-especiais','ryu-projeteis','fight-engine','session'])vm.runInContext(fs.readFileSync(path.join(root,'arena',f+'.js'),'utf8'),s,{filename:f+'.js'});
const w=s.window,B=w.ARENA_ASSETS.characters,D=w.FIGHT_DATA,names=w.RYU_PROJECTILES_STATUS.moves,passed=[];
function test(n,f){f();passed.push(n);console.log('PASS',n);}
function game(ids=['ryu','scorpion'],options={}){const g=new w.FightArena(B,ids,D,options);g.phase='fight';g.timer=999;return g;}
function run(g,n,fn=()=>[]){for(let i=0;i<n;i++)g.step(1/240,fn(i));}
test('Seis projéteis com arte própria, âncoras, colisões e reações existentes',()=>{
 assert.equal(names.length,6);
 for(const name of names){const m=D.characters.ryu.moves[name],q=m.projectile;assert(q.motionSamples.length>2);assert(q.attackTimeline.length===q.motionSamples.length);
  assert(B.ryu.clips[m.clip]);for(const f of B.ryu.clips[q.clip].frames.filter(Boolean))assert(fs.existsSync(path.join(root,'arena',B.ryu.assets[f.asset].file)));
  for(const f of B.ryu.clips[m.clip].frames){const asset=B.ryu.assets[f.asset];assert(f.originEvidence);assert(Math.abs(asset.height+f.y)<=8,'grounded casting sprite must retain its foot anchor');}
  for(const id of Object.values(m.reactionProfiles))assert(D.reactions[id]);
 }
});
test('Saída e percurso medidos espelhados nos dois lados, com continuação finita',()=>{
 for(const name of names)for(const facing of [-1,1]){const g=game(),p=g.players[0];p.x=550;p.facing=facing;g.spawnProjectile(p,name);const q=g.projectiles[0],m=D.characters.ryu.moves[name].projectile;
  const origin=q.x;assert.equal(origin,p.x+facing*m.spawnX);
  for(let i=1;i<m.motionSamples.length;i++){g.advanceProjectile(q,1/m.sampleRate);assert(Math.abs(q.x-origin-facing*m.motionSamples[i].x)<1e-6);}
  const before=q.x;g.advanceProjectile(q,1/m.sampleRate);assert(Math.abs(q.x-before-facing*m.speed/m.sampleRate)<1e-6);
 }
});
test('Três velocidades e prioridades dos comandos azul/vermelho nas três forças',()=>{
 for(const color of ['','red_']){const velocities=['lp','mp','hp'].map(k=>D.characters.ryu.moves[color+'hadouken_'+k].projectile.speed);assert(velocities[0]<velocities[1]&&velocities[1]<velocities[2]);}
 for(const c of D.characters.ryu.commands.filter(c=>names.includes(c.move)||c.move==='projectile'))for(const facing of [-1,1]){
  const p={facing,airborne:false,history:c.sequence.map((code,i)=>({code,time:i*.025})),buffer:[{button:c.button,time:.11}],input:{},opponentDistance:200,motionConsumedAt:-1};
  assert.equal(w.FightCommands.action(p,D.characters.ryu,.11).move,c.move);
 }
});
test('Dano e defesa funcionam contra os dois universos, sem contato duplicado',()=>{
 for(const name of names)for(const victim of ['ryu','scorpion'])for(const block of [false,true]){
  const g=game(['ryu',victim]),[p,q]=g.players;p.x=400;q.x=650;q.facing=-1;g.startAction(p,name);
  run(g,650,()=>[{},block?(victim==='ryu'?{x:1}:{block:true}):{}]);
  const m=D.characters.ryu.moves[name],expected=block?m.nativeChip:m.damage;
  assert(Math.abs(100-q.health-expected)<1e-5,name+' '+victim+' '+block+' '+q.health);
 }
});
test('Um projétil por dono e liberação após o fim do voo',()=>{
 const g=game(),[p,q]=g.players;p.x=100;q.x=1000;g.resolvePositions=()=>{};g.startAction(p,'hadouken_lp');run(g,200);assert.equal(p.action,null);assert.equal(g.projectiles.length,1);assert.equal(g.canStart(p,'hadouken_hp'),false);run(g,1200);assert.equal(g.projectiles.length,0);assert(g.canStart(p,'hadouken_hp'));
});
test('Colisão entre projéteis usa os retângulos nativos e não atinge os donos',()=>{
 const g=game(['ryu','ryu']),[a,b]=g.players;a.x=400;b.x=650;a.facing=1;b.facing=-1;g.spawnProjectile(a,'hadouken_lp');g.spawnProjectile(b,'red_hadouken_hp');g.collisions(1/240);assert.equal(g.projectiles.length,0);assert.equal(a.health,100);assert.equal(b.health,100);assert(g.events.some(e=>e.type==='projectileClash'));
});
test('Contato tardio do projétil não confirma um soco diferente do dono',()=>{
 const g=game(),[p,q]=g.players;p.x=400;q.x=650;g.startAction(p,'punch');const action=p.action;
 assert.equal(action.connected,false);g.hit(p,q,D.characters.ryu.moves.hadouken_lp,'hadouken_lp');assert.equal(action.connected,false);assert.equal(action.contactResult,undefined);
});
test('Projéteis nativos atingem o carro sem aplicar reação humana',()=>{
 for(const name of names){const g=game(['ryu','scorpion'],{mode:'bonus'}),p=g.players[0];p.x=432;p.facing=1;g.startAction(p,name);run(g,400);assert(g.bonus.damage>0);assert.equal(g.players[1].health,100);assert.equal(g.tethers.length,0);}
});
test('Quatro, oito e dezesseis participantes com os novos projéteis permanecem estáveis',()=>{
 for(const n of [4,8,16]){const g=game(Array(n).fill('ryu'));
  for(let i=0;i<1800;i++){
   if(i%120===0&&g.phase==='fight')for(const p of g.players)g.startAction(p,names[(p.index+i/120)%names.length]);
   g.step(1/240,g.players.map((p,j)=>({x:i%240<80?(j%2?1:-1):0,down:i%180<20})));
   for(const p of g.players)assert(Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.health>=0&&p.health<=100);
   for(const q of g.projectiles)assert(Number.isFinite(q.x)&&Number.isFinite(q.y));
  }
 }
});
fs.writeFileSync(path.join(root,'evidencias/testes-projeteis-ryu.json'),JSON.stringify({status:'PASS',groups:passed,limits:w.RYU_PROJECTILES_STATUS.limits},null,2));
