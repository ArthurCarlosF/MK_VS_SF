'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=__dirname,s={window:{}};vm.createContext(s);
for(const f of ['assets','engine','commands','collisions','calibration','combat-data','ryu-especiais','fight-engine','session'])vm.runInContext(fs.readFileSync(path.join(root,'arena',f+'.js'),'utf8'),s,{filename:f+'.js'});
const w=s.window,B=w.ARENA_ASSETS.characters,D=w.FIGHT_DATA,results=[];
function test(name,fn){fn();results.push(name);console.log('PASS',name);}
function arena(ids=['ryu','scorpion']){const g=new w.FightArena(B,ids);g.phase='fight';g.timer=999;return g;}
const run=(g,n,inputs=()=>[])=>{for(let i=0;i<n;i++)g.step(1/240,inputs(i));};
test('Seis variantes usam sprites existentes e referências de reação válidas',()=>{
 assert.equal(w.RYU_SPECIALS_STATUS.moves.length,6);
 for(const name of w.RYU_SPECIALS_STATUS.moves){
  const m=D.characters.ryu.moves[name],clip=B.ryu.clips[m.clip];assert.equal(clip.frames.length+1,m.motionTimeline.length);
  for(const f of clip.frames){const a=B.ryu.assets[f.asset];assert(a);assert(fs.existsSync(path.join(root,'arena',a.file)));assert(Number.isFinite(f.x)&&Number.isFinite(f.y));}
  for(const id of Object.values(m.reactionProfiles)){const p=D.reactions[id];assert(p);assert(p.samples.length>0);assert(B.ryu.clips[p.clip]);for(const r of p.samples)assert(Number.isFinite(r.x)&&Number.isFinite(r.y));}
 }
});
test('Trajetórias próprias, espelhadas e com retorno ao chão sem teletransporte',()=>{
 for(const name of w.RYU_SPECIALS_STATUS.moves)for(const direction of [-1,1]){
  const g=arena(),p=g.players[0];p.x=550;p.facing=direction;g.players[1].x=direction>0?1000:100;g.resolvePositions=()=>{};
  assert(g.startAction(p,name));const m=D.characters.ryu.moves[name],origin=p.x;let peak=0;
  for(let i=0;p.action&&i<600;i++){
   g.step(1/240,[]);peak=Math.max(peak,p.y);
   if(p.action){const sample=Math.min(m.motionTimeline.length-1,Math.floor((p.action.time+1e-9)*m.sampleRate));const r=m.motionTimeline[sample];assert(Math.abs(p.x-origin-r.x*direction)<1e-6,name+' root');assert(Math.abs(p.y-r.y)<1e-6,name+' height');}
  }
  assert.equal(p.action,null);assert.equal(p.y,0);assert.equal(p.airborne,false);assert.equal(peak,Math.max(...m.motionTimeline.map(r=>r.y)));
 }
});
test('Comandos direcionais nas seis forças e nos dois lados da tela',()=>{
 const d=D.characters.ryu;
 for(const direction of [-1,1])for(const c of d.commands.filter(c=>w.RYU_SPECIALS_STATUS.moves.includes(c.move))){
  const p={facing:direction,airborne:false,history:c.sequence.map((code,i)=>({code,time:i*.03})),buffer:[{button:c.button,time:.07}],input:{},opponentDistance:200,motionConsumedAt:-1};
  assert.equal(w.FightCommands.action(p,d,.07).move,c.move);
  p.buffer[0].release=true;assert.equal(w.FightCommands.action(p,d,.07).move,c.move);
 }
});
test('Medidor cresce uma vez por execução, inclusive sem contato, até o limite',()=>{
 for(const name of w.RYU_SPECIALS_STATUS.moves){
  const g=arena(),p=g.players[0];p.x=100;g.players[1].x=1000;g.startAction(p,name);run(g,400);
  assert(Math.abs(p.meter-D.characters.ryu.moves[name].meterGain)<1e-6);
  p.meter=99;g.startAction(p,name);run(g,400);assert.equal(p.meter,100);
 }
});
test('Contato contra os dois universos e ataques simultâneos de oito participantes são finitos',()=>{
 for(const ids of [['ryu','ryu'],['ryu','scorpion'],Array(8).fill('ryu')])for(const name of w.RYU_SPECIALS_STATUS.moves){
  const g=arena(ids),p=g.players[0];p.x=400;g.players[1].x=455;g.startAction(p,name);run(g,700,i=>g.players.map((q,j)=>j?{x:-q.facing,down:i%80<40}:{}));
  assert(g.players[1].health<100,name+' must contact '+ids[1]);
  for(const q of g.players){assert(Number.isFinite(q.x)&&Number.isFinite(q.y));assert(q.health>=0&&q.health<=100);}
 }
});
test('Interromper movimento aéreo não deixa o lutador suspenso ou com coordenadas inválidas',()=>{
 const g=arena(),p=g.players[0],q=g.players[1];p.x=450;q.x=700;g.startAction(p,'shoryuken_hp');run(g,80);assert(p.y>0);
 p.action=null;p.stun=.05;run(g,500);assert(Number.isFinite(p.y));assert.equal(p.y,0);assert.equal(p.airborne,false);
});
test('Fases ascendentes têm dano e reação próprios; rotações não reutilizam um único contato',()=>{
 for(const name of ['shoryuken_lp','shoryuken_mp','shoryuken_hp']){
  const m=D.characters.ryu.moves[name],a=m.contactGroups[1],b=m.contactGroups[2];assert(a.damage>b.damage);assert.notEqual(a.reactionProfiles.hit,b.reactionProfiles.hit);
 }
 const g=arena(['ryu','ryu']),p=g.players[0],q=g.players[1];p.x=400;q.x=460;q.facing=-1;g.startAction(p,'tatsumaki_hk');
 const contacts=[];let serial=0;
 for(let i=0;i<900;i++){g.step(1/240,[{},{x:1}]);for(const e of g.events)if(e.id>serial&&e.type==='block')contacts.push(e);serial=g.serial;}
 assert(contacts.length>1,'strong Tatsumaki must be capable of repeated guarded contacts');
});
test('O desafio do carro respeita o dano de cada fase do especial',()=>{
 const g=new w.FightArena(B,['ryu','scorpion'],D,{mode:'bonus'});g.phase='fight';const p=g.players[0];p.x=432;p.facing=1;
 g.startAction(p,'shoryuken_lp');const hits=[];let serial=0;
 for(let i=0;i<400;i++){g.step(1/240,[]);for(const e of g.events)if(e.id>serial&&e.type==='objectHit')hits.push(e.damage);serial=g.serial;}
 const m=D.characters.ryu.moves.shoryuken_lp;assert.equal(hits.length,2);assert(Math.abs(hits[0]-m.contactGroups[1].damage)<1e-6);assert(Math.abs(hits[1]-m.contactGroups[2].damage)<1e-6);
});
fs.writeFileSync(path.join(root,'evidencias/testes-especiais-ryu.json'),JSON.stringify({status:'PASS',groups:results,limits:w.RYU_SPECIALS_STATUS.limits},null,2));
