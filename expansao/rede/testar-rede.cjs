'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),WS=require('faye-websocket');
const {createGameServer}=require('./server.cjs');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function until(fn,ms=4000){const start=Date.now();while(!fn()){if(Date.now()-start>ms)throw Error('Timeout');await delay(10);}return fn();}
class Peer{
  constructor(url){this.messages=[];this.ws=new WS.Client(url,[],{headers:{Origin:url.replace('ws:','http:').replace('/ws','')}});this.ws.on('message',e=>this.messages.push(JSON.parse(e.data)));this.ws.on('error',()=>{});}
  async open(){await until(()=>this.ws.readyState===1);return this;}
  send(m){this.ws.send(JSON.stringify(m));}
  wait(type,p=()=>true,from=0){return until(()=>this.messages.slice(from).find(m=>m.type===type&&p(m)));}
  close(){this.ws.close();}
}
(async()=>{
 const root=path.resolve(__dirname,'..'),app=createGameServer({root,project:path.resolve(root,'..'),graceMs:350,loadingMs:1200});const address=await app.listen(0,'127.0.0.1'),origin='http://127.0.0.1:'+address.port,url=origin.replace('http:','ws:')+'/ws',peers=[],passed=[];
 const peer=async()=>{const p=await new Peer(url).open();peers.push(p);return p;};
 try{
  const a=await peer();a.send({type:'create',name:'Teste',nick:'Anfitrião',capacity:4,mode:'versus'});const ja=await a.wait('joined'),code=ja.room.code;
  const b=await peer();b.send({type:'join',code,nick:'Jogador 2'});const jb=await b.wait('joined');const c=await peer();c.send({type:'join',code,nick:'Jogador 3'});const jc=await c.wait('joined');
  assert(!JSON.stringify((await a.wait('room',m=>m.room.players.length===3)).room).includes(jb.token));passed.push('Três participantes na mesma sala; credenciais não são publicadas');
  b.send({type:'start'});await b.wait('error',m=>m.message.includes('anfitrião'));
  a.send({type:'start'});await a.wait('error',m=>m.message.includes('Pronto'));passed.push('Início exige anfitrião, dois jogadores e todos prontos');
  b.send({type:'select',character:'ryu'});for(const p of [a,b,c])p.send({type:'ready',ready:true});await a.wait('room',m=>m.room.players.length===3&&m.room.players.every(p=>p.ready));a.send({type:'start'});
  const match=(await a.wait('match')).match;for(const p of [a,b,c])p.send({type:'loaded',match});await a.wait('frame',m=>m.phase==='playing');
  assert.equal(app.rooms.get(code).game.players.length,3);passed.push('Partida só avança após todos carregarem');
  const d=await peer();d.send({type:'join',code,nick:'Intruso tardio'});await d.wait('error',m=>m.message.includes('já começou'));passed.push('Novas entradas não trocam o elenco de uma luta em andamento');
  const room=app.rooms.get(code);await until(()=>room.game.phase==='fight');const startX=room.game.players[0].x;
  a.send({type:'input',match,seq:1,input:{x:1,health:0,index:1}});await delay(110);assert(room.game.players[0].x>startX);assert.equal(room.game.players[1].health,100);assert.equal(room.game.players[1].input.x,0);
  a.send({type:'input',match,seq:2,input:{x:0}});await delay(80);passed.push('Cada conexão só controla a própria vaga e não define vida ou resultado');
  await delay(600);assert.equal(room.game.players[0].input.x,0);passed.push('Comandos expiram e não deixam movimento preso');
  const common=a.messages.filter(m=>m.type==='frame').findLast(m=>b.messages.some(n=>n.type==='frame'&&n.tick===m.tick));assert(common);assert.deepEqual(common,b.messages.find(m=>m.type==='frame'&&m.tick===common.tick));passed.push('Estado autoritativo idêntico distribuído para todos os clientes');
  c.close();await delay(40);const c2=await peer();c2.send({type:'join',code,token:jc.token});const resumed=await c2.wait('joined');assert.equal(resumed.playerId,jc.playerId);assert.equal(resumed.slot,2);c2.send({type:'loaded',match});passed.push('Reconexão recupera a vaga e a identidade da partida');
  c2.close();await until(()=>room.game.players[2].health===0);assert.equal(room.game.phase,'fight');passed.push('Desconexão após tolerância elimina só aquele participante');
  a.close();await b.wait('room',m=>m.room.hostId===jb.playerId);b.send({type:'rematch'});await b.wait('lobby');assert.equal(room.phase,'lobby');passed.push('Migração de anfitrião e retorno à sala para uma nova partida');
  for(const route of ['/../Etapas%20do%20projeto.txt','/expansao/arena/../../dados/config.json','/rede/server.cjs','/expansao/rede/node_modules/faye-websocket/package.json']){const r=await fetch(origin+route);assert.equal(r.status,404);}
  assert.equal((await fetch(origin+'/api/info')).status,200);assert.equal((await fetch(origin+'/expansao/arena/assets.js')).status,200);passed.push('Somente arquivos públicos do jogo são servidos');
  const e=await peer();e.send({type:'create',capacity:2,mode:'bonus',nick:'MK'});const je=await e.wait('joined'),f=await peer();f.send({type:'join',code:je.room.code,nick:'SF'});await f.wait('joined');f.send({type:'select',character:'ryu'});for(const p of [e,f])p.send({type:'ready',ready:true});await e.wait('room',m=>m.room.players.length===2&&m.room.players.every(p=>p.ready));e.send({type:'start'});const carMatch=(await e.wait('match')).match;for(const p of [e,f])p.send({type:'loaded',match:carMatch});await e.wait('frame',m=>m.phase==='playing');assert.equal(app.rooms.get(je.room.code).game.mode,'bonus');assert(app.rooms.get(je.room.code).game.bonus);passed.push('Desafio do carro também usa uma partida compartilhada na rede');
  fs.writeFileSync(path.join(root,'testes-rede.json'),JSON.stringify({status:'PASS',groups:passed.length,passed},null,2));console.log(JSON.stringify({status:'PASS',groups:passed.length,passed}));
 }finally{peers.forEach(p=>p.close());await app.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
