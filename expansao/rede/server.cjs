'use strict';
const http=require('http'),https=require('https'),fs=require('fs'),path=require('path'),vm=require('vm'),os=require('os'),crypto=require('crypto'),zlib=require('zlib');
const WebSocket=require('faye-websocket');
const BUILD='rede-8.1';
const ACTIONS=['up','down','punch','punch2','punch3','kick','kick2','kick3','block','special','throw','teleport','run'];
const random=n=>crypto.randomBytes(n).toString('hex');
const clean=(v,max,fallback)=>typeof v==='string'?v.replace(/[\u0000-\u001f\u007f]/g,'').trim().slice(0,max)||fallback:fallback;
const lanAddresses=()=>Object.entries(os.networkInterfaces()).filter(([name])=>!/(tailscale|vmware|wsl|vethernet|loopback)/i.test(name)).flatMap(([,values])=>values).filter(n=>n.family==='IPv4'&&!n.internal);
function createGameServer(options={}){
  const root=path.resolve(options.root||path.join(__dirname,'..'));
  const project=path.resolve(options.project||path.join(root,'..'));
  const scope={window:{}};vm.createContext(scope);
  for(const file of ['assets','engine','commands','collisions','calibration','combat-data','ryu-especiais','fight-engine','session'])vm.runInContext(fs.readFileSync(path.join(root,'arena',file+'.js'),'utf8'),scope,{filename:file+'.js'});
  const W=scope.window,bank=W.ARENA_ASSETS.characters,roster=Object.keys(W.FIGHT_DATA.characters),rooms=new Map(),clients=new Set(),cache=new Map();
  const graceMs=options.graceMs??15000,loadingMs=options.loadingMs??30000,roomTtl=options.roomTtl??180000;
  let closed=false,last=performance.now(),accumulator=0;
  const send=(ws,value)=>{if(ws?.readyState===1)ws.send(typeof value==='string'?value:JSON.stringify(value));};
  const fail=(ws,message)=>send(ws,{type:'error',message});
  function publicRoom(r){return {code:r.code,name:r.name,capacity:r.capacity,mode:r.mode,phase:r.phase,hostId:r.hostId,match:r.match,
    players:r.players.map((p,i)=>({id:p.id,slot:i,nick:p.nick,character:p.character,ready:p.ready,loaded:p.loaded,connected:!!p.socket}))};}
  function broadcast(r,obj){const json=JSON.stringify(obj);r.players.forEach(p=>send(p.socket,json));}
  const announce=r=>broadcast(r,{type:'room',room:publicRoom(r)});
  const requireMember=ws=>{if(!ws.room||!ws.player||ws.player.socket!==ws)throw Error('Entre em uma sala primeiro.');return ws.room;};
  const requireHost=ws=>{const r=requireMember(ws);if(r.hostId!==ws.player.id)throw Error('Apenas o anfitrião pode fazer isso.');return r;};
  function migrate(r){
    const host=r.players.find(p=>p.id===r.hostId);
    if(host&&!host.forfeit&&(host.socket||Date.now()-host.disconnectedAt<graceMs))return;
    r.hostId=r.players.find(p=>p.socket)?.id||r.players[0]?.id||null;
  }
  function disconnect(ws,leave=false){
    const r=ws.room,p=ws.player;if(!r||!p||p.socket!==ws)return;
    p.socket=null;p.ready=false;p.input={};p.queue=[];p.disconnectedAt=Date.now();
    if(leave){p.forfeit=true;p.disconnectedAt=0;if(r.phase==='lobby')r.players=r.players.filter(q=>q!==p);else if(r.game)r.game.players[r.players.indexOf(p)].health=0;}
    ws.room=null;ws.player=null;r.lastActive=Date.now();migrate(r);announce(r);
    if(!r.players.length)rooms.delete(r.code);
  }
  function attach(ws,r,p){
    if(ws.room&&ws.player!==p)disconnect(ws,true);
    if(p.socket&&p.socket!==ws){const old=p.socket;p.socket=null;old.close(4001,'Reaberto em outra janela');}
    p.socket=ws;p.disconnectedAt=null;p.input={};p.queue=[];p.seq=0;p.lastInput=Date.now();p.forfeit=false;
    ws.room=r;ws.player=p;r.lastActive=Date.now();
    send(ws,{type:'joined',token:p.token,playerId:p.id,slot:r.players.indexOf(p),room:publicRoom(r),build:BUILD});
    announce(r);
    if(r.phase!=='lobby'){sendMatch(ws,r);if(r.game)send(ws,frame(r));}
  }
  function sendMatch(ws,r){send(ws,{type:'match',match:r.match,room:r.code,ids:r.players.map(p=>p.character),mode:r.mode,slot:r.players.indexOf(ws.player)});}
  function backToLobby(r,message){
    r.phase='lobby';r.game=null;r.match=null;
    r.players=r.players.filter(p=>p.socket);r.players.forEach(p=>{p.ready=false;p.loaded=false;p.input={};p.queue=[];});
    migrate(r);broadcast(r,{type:'lobby',room:publicRoom(r),message});announce(r);
  }
  function handle(ws,m){
    if(!m||typeof m!=='object'||Array.isArray(m))throw Error('Mensagem inválida.');
    if(m.type==='ping'){send(ws,{type:'pong',at:Number.isFinite(m.at)?m.at:0});return;}
    if(m.type==='create'){
      if(ws.room)throw Error('Saia da sala atual antes de criar outra.');
      if(rooms.size>=24)throw Error('Limite de salas atingido.');
      if(!Number.isInteger(m.capacity)||m.capacity<2||m.capacity>8)throw Error('Escolha de 2 a 8 vagas.');
      if(!['versus','training','bonus'].includes(m.mode))throw Error('Modo indisponível.');
      let code;do{code=random(3).toUpperCase();}while(rooms.has(code));
      const r={code,name:clean(m.name,40,'Sala de luta'),capacity:m.capacity,mode:m.mode,phase:'lobby',players:[],hostId:null,game:null,match:null,tick:0,lastActive:Date.now()};
      rooms.set(code,r);m={...m,type:'join',code};
    }
    if(m.type==='join'){
      if(typeof m.code!=='string')throw Error('Informe o código da sala.');const r=rooms.get(m.code.toUpperCase());if(!r)throw Error('Sala não encontrada.');
      let p=typeof m.token==='string'?r.players.find(p=>p.token===m.token):null;
      if(!p){
        if(r.phase!=='lobby')throw Error('Esta partida já começou. Aguarde uma nova sala.');
        if(r.players.length>=r.capacity)throw Error('A sala está cheia.');
        p={id:random(8),token:random(24),nick:clean(m.nick,24,'Jogador'),character:roster[0],ready:false,loaded:false,socket:null,input:{},queue:[],seq:0,lastInput:0};
        r.players.push(p);if(!r.hostId)r.hostId=p.id;
      }
      attach(ws,r,p);return;
    }
    if(m.type==='leave'){requireMember(ws);disconnect(ws,true);send(ws,{type:'left'});return;}
    const r=requireMember(ws),p=ws.player;
    if(m.type==='select'){
      if(r.phase!=='lobby')throw Error('A escolha fica fechada durante a partida.');
      if(!roster.includes(m.character))throw Error('Personagem ainda indisponível.');
      p.character=m.character;p.ready=false;announce(r);return;
    }
    if(m.type==='ready'){
      if(r.phase!=='lobby')throw Error('A partida já está em andamento.');p.ready=m.ready===true;announce(r);return;
    }
    if(m.type==='settings'){
      requireHost(ws);if(r.phase!=='lobby')throw Error('Volte à sala para alterar o modo.');
      if(!Number.isInteger(m.capacity)||m.capacity<r.players.length||m.capacity>8||m.capacity<2)throw Error('Número de vagas inválido.');
      if(!['versus','training','bonus'].includes(m.mode))throw Error('Modo indisponível.');r.capacity=m.capacity;r.mode=m.mode;r.players.forEach(q=>q.ready=false);announce(r);return;
    }
    if(m.type==='start'){
      requireHost(ws);if(r.phase!=='lobby')throw Error('A partida já começou.');
      if(r.players.length<2||r.players.some(p=>!p.socket||!p.ready))throw Error('Espere pelo menos dois jogadores e todos marcarem Pronto.');
      r.game=new W.FightArena(bank,r.players.map(p=>p.character),W.FIGHT_DATA,{mode:r.mode});r.phase='loading';r.loadingAt=Date.now();r.match=random(12);r.tick=0;
      r.players.forEach(p=>{p.loaded=false;p.input={};p.queue=[];});announce(r);r.players.forEach(p=>sendMatch(p.socket,r));return;
    }
    if(m.type==='loaded'){
      if(m.match!==r.match||!r.game)throw Error('A partida mudou; volte à sala.');p.loaded=true;announce(r);
      if(r.phase==='loading'&&r.players.every(p=>p.socket&&p.loaded)){r.phase='playing';announce(r);broadcast(r,frame(r));}return;
    }
    if(m.type==='rematch'){requireHost(ws);backToLobby(r,'Escolham os personagens e marquem Pronto para a próxima partida.');return;}
    if(m.type==='input'){
      if(r.phase!=='playing'||!p.loaded||m.match!==r.match)return;
      if(!Number.isInteger(m.seq)||m.seq<=p.seq)return;
      const v=m.input;if(!v||typeof v!=='object'||Array.isArray(v))return;
      const input={x:Number.isFinite(v.x)?Math.sign(v.x):0};for(const a of ACTIONS)input[a]=v[a]===true;
      p.seq=m.seq;p.lastInput=Date.now();
      if(p.queue.length>=32){p.queue=[];p.input={};throw Error('Comandos enviados rápido demais.');}
      // Separate press/release messages remain separate simulation samples.
      if(JSON.stringify(input)!==JSON.stringify(p.input)||p.queue.length)p.queue.push(input);
      return;
    }
    throw Error('Ação indisponível.');
  }
  function renderPlayer(p){
    const value={};for(const k of ['id','index','x','y','facing','state','frame','clock','motionTick','stateTime','airborne','health','meter','combo','comboTime','flash','stun','guardStun','knockdown','invulnerable','blocked','reaction','input'])value[k]=p[k];
    value.motion=p.motion?{runEnergy:p.motion.runEnergy}:null;
    value.action=p.action?{name:p.action.name,time:p.action.time,hit:[],carriedStrike:null}:null;
    return value;
  }
  function frame(r){const g=r.game;return {type:'frame',build:BUILD,match:r.match,tick:r.tick,phase:r.phase,state:{players:g.players.map(renderPlayer),camera:g.camera,cameraY:g.cameraY||0,elapsed:g.elapsed,
    phase:g.phase,phaseTime:g.phaseTime,result:g.result,timer:g.timer,wins:[...g.wins],round:g.round,roundWinner:g.roundWinner,
    projectiles:g.projectiles.map(p=>({...p})),effects:g.effects.map(p=>({...p})),tethers:g.tethers.map(p=>({...p})),grapples:g.grapples.map(p=>({...p})),bonus:g.bonus?JSON.parse(JSON.stringify(g.bonus)):null}};}
  const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.crt':'application/x-x509-ca-cert'};
  function handler(req,res){
    res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','same-origin');res.setHeader('Permissions-Policy','gamepad=(self)');
    if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);res.end();return;}
    let route;try{route=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end();return;}
    if(route==='/api/info'){
      const address=server.address(),scheme=options.tls?'https':'http';
      const urls=lanAddresses().map(n=>`${scheme}://${n.address}:${address.port}/`);
      res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','application/json');res.end(JSON.stringify({build:BUILD,urls,characters:roster,activeRooms:rooms.size,combatRevision:'ryu-especiais-8.2',rooms:[...rooms.values()].filter(r=>r.phase==='lobby').map(r=>({code:r.code,name:r.name,count:r.players.length,capacity:r.capacity,mode:r.mode}))}));return;
    }
    let file;
    if(route==='/'||route==='/salas.html')file=path.join(__dirname,'salas.html');
    else if(route==='/salas.js'||route==='/client.js'||route==='/salas.css')file=path.join(__dirname,route.slice(1));
    else if(route==='/expansao/rede/client.js')file=path.join(__dirname,'client.js');
    else if(route==='/roster.js')file=path.join(project,'roster.js');
    else if(/^\/assets\/(mk|sf)\/[a-zA-Z0-9_-]+\.png$/.test(route))file=path.join(project,route.slice(1));
    else if(/^\/expansao\/(index\.html|lobby\.js|arena\/(index\.html|style\.css|[a-z-]+\.js|assets\/[a-zA-Z0-9_/-]+\.png))$/.test(route))file=path.join(root,route.slice('/expansao/'.length));
    if(!file||!fs.existsSync(file)){res.writeHead(404);res.end('Arquivo indisponível');return;}
    res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.setHeader('Cache-Control',file.endsWith('.png')?'public, max-age=86400':'no-cache');
    if(req.method==='HEAD'){res.end();return;}
    if(/\.(js|html|css)$/.test(file)&&req.headers['accept-encoding']?.includes('gzip')){
      if(!cache.has(file))cache.set(file,zlib.gzipSync(fs.readFileSync(file)));
      res.setHeader('Content-Encoding','gzip');res.setHeader('Vary','Accept-Encoding');res.end(cache.get(file));
    }else{const stream=fs.createReadStream(file);stream.on('error',()=>res.destroy());stream.pipe(res);}
  }
  const server=options.tls?https.createServer(options.tls,handler):http.createServer(handler);
  server.on('upgrade',(req,socket,body)=>{
    let originOK=false;try{const o=new URL(req.headers.origin);originOK=['http:','https:'].includes(o.protocol)&&o.host===req.headers.host;}catch{}
    if(!originOK||req.url!=='/ws'||!WebSocket.isWebSocket(req)||clients.size>=128){socket.end('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n');return;}
    const ws=new WebSocket(req,socket,body,[],{ping:10,maxLength:8192});ws.count=0;ws.bucket=Date.now();clients.add(ws);
    send(ws,{type:'hello',build:BUILD,characters:roster});
    ws.on('message',e=>{
      const now=Date.now();if(now-ws.bucket>1000){ws.count=0;ws.bucket=now;}if(++ws.count>240){ws.close(1008,'Muitas mensagens');return;}
      try{handle(ws,JSON.parse(e.data));}catch(e){fail(ws,e.message||'Não foi possível realizar a ação.');}
    });
    ws.on('close',()=>{clients.delete(ws);disconnect(ws);});ws.on('error',()=>{});
  });
  const timer=setInterval(()=>{
    const now=performance.now(),wall=Date.now();accumulator+=Math.min((now-last)/1000,.1);last=now;
    while(accumulator>=1/240){
      for(const r of rooms.values())if(r.phase==='playing'){
        r.players.forEach((p,i)=>{if(!p.socket||wall-p.lastInput>500){p.input={};p.queue=[];}else if(p.queue.length)p.input=p.queue.shift();if(p.forfeit||!p.socket&&wall-p.disconnectedAt>graceMs)r.game.players[i].health=0;});
        try{r.game.step(1/240,r.players.map(p=>p.input));r.tick++;}catch(e){console.error('Falha na sala',r.code,e.stack);backToLobby(r,'Falha na partida. A sala foi preservada para tentar novamente.');continue;}
        if(r.tick%4===0)broadcast(r,frame(r));
      }
      accumulator-=1/240;
    }
    for(const r of rooms.values()){
      const oldHost=r.hostId;migrate(r);if(oldHost!==r.hostId)announce(r);
      if(r.phase==='loading'&&wall-r.loadingAt>loadingMs)backToLobby(r,'Nem todos carregaram a arena. Confiram as conexões e tentem novamente.');
      if(r.phase==='lobby'){
        const old=r.players.length;r.players=r.players.filter(p=>p.socket||wall-p.disconnectedAt<graceMs);
        if(r.players.length!==old){migrate(r);announce(r);}
      }
      if(!r.players.some(p=>p.socket)&&wall-r.lastActive>roomTtl)rooms.delete(r.code);
    }
  },4);timer.unref();
  return {server,rooms,build:BUILD,listen(port=8765,host='0.0.0.0'){return new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,host,()=>{server.removeListener('error',reject);resolve(server.address());});});},
    async close(){if(closed)return;closed=true;clearInterval(timer);for(const ws of clients)ws.close();await new Promise(r=>server.close(r));}};
}
module.exports={createGameServer,BUILD};
if(require.main===module){
  const port=Number(process.env.MKVSF_PORT||8765),options={};
  if(process.env.MKVSF_TLS_KEY&&process.env.MKVSF_TLS_CERT)options.tls={key:fs.readFileSync(process.env.MKVSF_TLS_KEY),cert:fs.readFileSync(process.env.MKVSF_TLS_CERT)};
  const app=createGameServer(options);app.listen(port).then(address=>{const scheme=options.tls?'https':'http';console.log(`Mortal Kombat vs Street Fighter — rede local ${BUILD}\nAbra ${scheme}://localhost:${address.port}/ neste PC.`);for(const n of lanAddresses())console.log(`Outros aparelhos: ${scheme}://${n.address}:${address.port}/`);console.log('Mantenha o servidor aberto durante as partidas. Ctrl+C encerra.');}).catch(e=>{console.error(e.code==='EADDRINUSE'?'Esta porta já está em uso. Confira se o servidor já está aberto.':e.message);process.exitCode=1;});
  for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>app.close().then(()=>process.exit()));
}
