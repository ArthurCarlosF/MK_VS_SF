const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {chromium}=require('C:/Users/Pichau/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {createGameServer}=require('./server.cjs');
(async()=>{
 const root=path.resolve(__dirname,'..'),app=createGameServer({root,project:'D:/projetos/Mortal Kombat vs Street Fighter',graceMs:5000}),address=await app.listen(0,'127.0.0.1'),url='http://127.0.0.1:'+address.port;
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true}),contexts=[],pages=[],errors=[],failed=[];
 try{
  for(let i=0;i<3;i++){
   const c=await browser.newContext(i===2?{viewport:{width:390,height:844},isMobile:true,hasTouch:true}:{viewport:{width:1280,height:900}});contexts.push(c);
   await c.addInitScript(()=>Object.defineProperty(navigator,'getGamepads',{value:()=>window.testPads||[]}));
   const p=await c.newPage();pages.push(p);p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))failed.push(r.url());});await p.goto(url);
  }
  const [a,b,c]=pages;await a.fill('#nick','Anfitrião');await a.click('#create button');await a.waitForFunction(()=>window.roomPage?.room?.code);const code=await a.locator('#room-code').textContent();
  for(const [i,p] of [b,c].entries()){await p.fill('#nick','Jogador '+(i+2));await p.fill('#code',code);await p.click('#join button');await p.waitForFunction(()=>window.roomPage?.room?.players.length>=2);}
  await b.selectOption('#character','ryu');for(const p of pages)await p.click('#ready');await a.waitForFunction(()=>!document.querySelector('#start').disabled);await a.click('#start');
  for(const p of pages)await p.waitForFunction(()=>window.arena?.ready&&window.arena.network?.latest?.phase==='playing');
  const room=app.rooms.get(code),id=room.players[0].id;await a.waitForFunction(()=>window.arena.game.phase==='fight');await a.evaluate(()=>window.arena.setPaused(false));const x=room.game.players[0].x;
  await a.keyboard.down('ArrowRight');await a.waitForTimeout(180);await a.keyboard.up('ArrowRight');assert(room.game.players[0].x>x);
  await b.evaluate(()=>{window.arena.setPaused(false);window.testPads=[{axes:[1,0],buttons:Array.from({length:17},()=>({pressed:false}))}];});const bx=room.game.players[1].x;await b.waitForTimeout(180);await b.evaluate(()=>window.testPads=[]);assert(room.game.players[1].x>bx);
  await c.evaluate(()=>window.arena.setPaused(false));await c.locator('.touch:not([hidden]) button[data-action="punch"]').tap();await c.waitForTimeout(150);assert(room.game.events.some(e=>e.type==='action'&&e.player===2));
  const frames=await Promise.all(pages.slice(0,2).map(p=>p.evaluate(()=>window.arena.network.frames.map(f=>({tick:f.tick,players:f.state.players.map(p=>[p.x,p.y,p.health,p.state,p.frame])})))));
  const common=frames[0].findLast(f=>frames[1].some(g=>f.tick===g.tick));assert(common);assert.deepEqual(common.players,frames[1].find(f=>f.tick===common.tick).players);
  await c.screenshot({path:path.join(root,'Previa-rede-celular.png'),fullPage:true});
  await a.reload();await a.waitForFunction(()=>window.arena?.ready&&window.arena.network?.latest?.phase==='playing');assert.equal(room.players[0].id,id);assert.equal(room.players.length,3);
  await c.click('header .back');await c.waitForURL(url+'/salas.html');assert.equal(room.game.players[2].health,0);
  await a.click('#reset');for(const p of [a,b])await p.waitForURL(url+'/salas.html');await a.waitForFunction(()=>window.roomPage?.room?.players.length===2);
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
  const result={status:'PASS',independentBrowsers:3,mobileViewport:'390x844',keyboard:true,syntheticGamepadMapping:true,physicalGamepadTested:false,touch:true,authoritativeFramesMatch:true,reconnect:true,leave:true,rematchLobby:true,errors,failed};
  fs.writeFileSync(path.join(root,'testes-rede-navegadores.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 }finally{await browser.close();await app.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
