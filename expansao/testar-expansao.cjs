const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=__dirname,original='D:/projetos/Mortal Kombat vs Street Fighter';
function load(folder,extension=false){const s={window:{}};vm.createContext(s);for(const name of ['assets','engine','commands','collisions','calibration','combat-data','fight-engine',...(extension?['session']:[])])vm.runInContext(fs.readFileSync(path.join(folder,name+'.js'),'utf8'),s,{filename:name+'.js'});return s.window;}
const w=load(path.join(root,'arena'),true),old=load(path.join(original,'arena'));
const B=w.ARENA_ASSETS.characters,passed=[];const test=(name,f)=>{f();passed.push(name);console.log('PASS',name);};
const run=(g,n,fn=()=>[])=>{for(let i=0;i<n;i++)g.step(1/240,fn(i));};
const clean=o=>JSON.parse(JSON.stringify(o,(k,v)=>k==='target'&&typeof v==='number'||k==='jumpFacing'?undefined:v));
test('2 jogadores: igualdade com a versão anterior em entradas determinísticas',()=>{
  for(const ids of [['scorpion','ryu'],['ryu','scorpion'],['scorpion','scorpion'],['ryu','ryu']]){
    const a=new w.FightArena(B,ids),b=new old.FightArena(old.ARENA_ASSETS.characters,ids);let seed=1234;
    for(let t=0;t<6000;t++){
      const inp=ids.map((id,i)=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;const r=seed;return {x:(r%3)-1,down:r%17===0,up:r%29===0,punch:r%7===0,punch2:r%13===0,kick:r%19===0,special:r%47===0,block:r%5===0};});
      a.step(1/240,inp);b.step(1/240,inp);
      if(t%120===0){for(const key of ['players','camera','timer','wins','round','phase','projectiles','tethers','grapples'])assert.deepEqual(clean(a.snapshot()[key]),clean(b.snapshot()[key]),ids+' '+t+' '+key);}
    }
  }
});
test('3 a 16 participantes: movimento, ataques e estados finitos sem falhas',()=>{
  for(const n of [3,4,8,16]){
    const ids=Array.from({length:n},(_,i)=>i%2?'ryu':'scorpion'),g=new w.FightArena(B,ids);
    for(let t=0;t<2400;t++){g.step(1/240,g.players.map(p=>w.FightSession.bot(g,p)));if(g.players.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.y)))throw Error(JSON.stringify({n,t,players:g.players,events:g.events.slice(-10)}));}
    assert.equal(g.players.length,n);for(const p of g.players){assert(Number.isFinite(p.x)&&Number.isFinite(p.y));assert(p.x>=40&&p.x<=1060);assert(p.health>=0&&p.health<=100);}
  }
});
test('KO de um jogador não encerra a luta enquanto restam vários oponentes',()=>{
  const g=new w.FightArena(B,['scorpion','ryu','scorpion','ryu']);g.phase='fight';g.players[1].health=0;g.step(1/240,[]);assert.equal(g.phase,'fight');
  g.players[2].health=0;g.step(1/240,[]);assert.equal(g.phase,'fight');g.players[3].health=0;g.step(1/240,[]);assert.equal(g.phase,'roundEnd');assert.equal(g.roundWinner,0);
});
test('Alvo de teleporte é um oponente vivo e alvo de agarrão permanece fixado',()=>{
  const g=new w.FightArena(B,['scorpion','ryu','ryu','scorpion']);g.phase='fight';g.players.forEach((p,i)=>p.x=300+i*90);g.players[1].health=0;
  assert.equal(g.opponent(g.players[0]).index,2);g.teleport(g.players[0]);assert(Math.abs(g.players[0].x-g.players[2].x)<=68);
  const h=new w.FightArena(B,['scorpion','ryu','ryu']);h.phase='fight';h.players[0].x=450;h.players[1].x=510;h.players[2].x=800;
  assert(h.startAction(h.players[0],'punch'));h.players[2].x=460;assert.equal(h.opponent(h.players[0]).index,1);
});
test('Equipes excluem aliados de alvos e contam vitória em conjunto',()=>{
  const g=new w.FightArena(B,['scorpion','ryu','ryu','scorpion'],w.FIGHT_DATA,{teams:[0,0,1,1]});g.phase='fight';assert.deepEqual(Array.from(g.enemies(g.players[0]),p=>p.index),[2,3]);g.players[2].health=0;g.players[3].health=0;g.step(1/240,[]);assert.equal(g.phase,'roundEnd');assert.deepEqual(Array.from(g.wins),[1,1,0,0]);
});
test('Combate simultâneo: pausa de impacto não congela terceiros e guarda exige frente',()=>{
  const g=new w.FightArena(B,['scorpion','ryu','scorpion']);g.phase='fight';const [a,b,c]=g.players;
  a.x=500;b.x=560;b.facing=1;b.input.x=-1;c.x=700;
  assert(g.hit(a,b,{...w.FIGHT_DATA.characters.scorpion.moves.kick,reactionProfiles:{},hitstop:.1},'kick'));assert.equal(g.events.at(-1).type,'hit');assert.equal(g.hitstop,0);assert(a.localHitstop>0);
  const time=c.stateTime;g.step(1/240,[]);assert(c.stateTime>time);
});
test('Um ataque pode atingir vários alvos, uma vez por alvo e sem reviver eliminados',()=>{
  const def=w.FIGHT_DATA.characters.scorpion,m={clip:'kick',kind:'strike',damage:5,level:'mid',box:{x:0,y:0,w:120,h:140},startup:0,active:.1,recovery:.1,hitstop:0};
  const data={...w.FIGHT_DATA,characters:{...w.FIGHT_DATA.characters,scorpion:{...def,moves:{...def.moves,probe:m}}}};
  const g=new w.FightArena(B,['scorpion','ryu','ryu'],data);g.phase='fight';g.players.forEach((p,i)=>{p.x=450+i*40;p.facing=i?-1:1;});
  g.startAction(g.players[0],'probe');g.collisions(0);g.collisions(0);assert.equal(g.players[1].health,95);assert.equal(g.players[2].health,95);
  g.players[2].health=0;g.step(1/240,[{},{},{punch:true}]);assert.equal(g.players[2].action,null);
});
test('Carro recebe ataques dos dois universos sem puxão, dano em aliados ou pontos infinitos',()=>{
  const g=new w.FightArena(B,['scorpion','ryu'],w.FIGHT_DATA,{mode:'bonus'});g.phase='fight';
  g.players[0].x=432;g.players[0].facing=1;g.players[1].x=668;g.players[1].facing=-1;
  for(let i=0;i<1000;i++)g.step(1/240,[{punch:i%90===0},{kick:i%120===0}]);
  assert(g.bonus.score>0);assert(g.bonus.scores[0]>0&&g.bonus.scores[1]>0);assert(g.players.every(p=>p.health===100));assert.equal(g.tethers.length,0);
  for(let i=0;i<100;i++)g.hitCar(g.players[0],{damage:10},'test',{x:550,y:50});g.step(1/240,[]);assert.equal(g.phase,'matchEnd');assert.equal(g.bonus.score,34000);const score=g.bonus.score;assert(!g.hitCar(g.players[0],{damage:10},'test',{x:550,y:50}));assert.equal(g.bonus.score,score);
  g.reset();assert.equal(g.bonus.score,0);assert.equal(g.timer,40);
});
test('Projéteis e lança acertam o carro; teleporte não desloca o objeto',()=>{
  for(const id of ['scorpion','ryu']){const g=new w.FightArena(B,[id,'ryu'],w.FIGHT_DATA,{mode:'bonus'});g.phase='fight';const p=g.players[0];p.x=330;p.facing=1;assert(g.startAction(p,w.FIGHT_DATA.characters[id].special));run(g,480);assert(g.bonus.score>0,id);assert.equal(g.tethers.length,0);assert.equal(g.bonus.x,550);}
});
test('Carro com 8 participantes e fim de tempo',()=>{
  const g=new w.FightArena(B,Array(8).fill('scorpion'),w.FIGHT_DATA,{mode:'bonus'});g.phase='fight';g.timer=.01;run(g,4);assert.equal(g.phase,'matchEnd');assert.equal(g.events.at(-1).type,'bonusEnd');assert(!g.events.at(-1).success);
});
test('Configuração validada e campos adicionais não escritos nos perfis dos jogos',()=>{
  const v=w.FightSession.parse(new URLSearchParams('players=ryu,scorpion,ryu&cpu=2&mode=bonus'));assert.equal(v.ids.length,3);assert.equal(v.options.mode,'bonus');assert.throws(()=>w.FightSession.parse(new URLSearchParams('players=kano,ryu')));
});
fs.writeFileSync(path.join(root,'testes-motor.json'),JSON.stringify({status:'PASS',groups:passed.length,passed},null,2));
