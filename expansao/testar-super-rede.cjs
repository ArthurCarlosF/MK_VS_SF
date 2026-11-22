const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {chromium}=require('C:/Users/Pichau/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {createGameServer}=require('./rede/server.cjs');
(async()=>{
 const root=__dirname,app=createGameServer({root,project:'D:/projetos/Mortal Kombat vs Street Fighter'}),addr=await app.listen(0,'127.0.0.1'),url='http://127.0.0.1:'+addr.port;
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true}),contexts=[],errors=[];
 try{
  const pages=[];for(let i=0;i<2;i++){const c=await browser.newContext();contexts.push(c);const p=await c.newPage();pages.push(p);p.on('pageerror',e=>errors.push(e.message));await p.goto(url);}
  const [a,b]=pages;await a.fill('#nick','Teste Super');await a.click('#create button');await a.waitForFunction(()=>window.roomPage?.room?.code);
  const code=await a.locator('#room-code').textContent();await a.selectOption('#character','ryu');await b.fill('#nick','Teste Scorpion');await b.fill('#code',code);await b.click('#join button');await b.waitForFunction(()=>window.roomPage?.room?.players.length===2);
  for(const p of pages)await p.click('#ready');await a.waitForFunction(()=>!document.querySelector('#start').disabled);await a.click('#start');
  for(const p of pages)await p.waitForFunction(()=>window.arena?.ready&&window.arena.network?.latest?.phase==='playing');
  await a.waitForFunction(()=>window.arena.game.phase==='fight');
  const room=app.rooms.get(code.trim());assert(room?.game);room.game.players[0].meter=100; // Server-only test fixture, never a client privilege.
  await a.evaluate(()=>window.arena.setPaused(false));await a.locator('canvas').focus();
  let held=[];
  for(const desired of [['ArrowDown'],['ArrowDown','ArrowRight'],['ArrowRight'],['ArrowDown'],['ArrowDown','ArrowRight'],['ArrowRight']]){
   await a.evaluate(({held,desired})=>{
    for(const code of held.filter(k=>!desired.includes(k)))window.dispatchEvent(new KeyboardEvent('keyup',{code,bubbles:true}));
    for(const code of desired.filter(k=>!held.includes(k)))window.dispatchEvent(new KeyboardEvent('keydown',{code,bubbles:true}));
   },{held,desired});held=desired;await a.waitForTimeout(40);
  }
  await a.keyboard.down('j');await a.waitForTimeout(35);await a.keyboard.up('j');await a.keyboard.up('ArrowRight');
  for(const p of pages)await p.waitForFunction(()=>window.arena.network.frames.some(f=>f.state.superFreeze?.remaining>0),null,{timeout:8000});
  const states=await Promise.all(pages.map(p=>p.evaluate(()=>window.arena.network.frames.filter(f=>f.state.superFreeze?.remaining>0).map(f=>({tick:f.tick,state:f.state})))));
  const common=states[0].find(f=>states[1].some(v=>v.tick===f.tick));assert(common);assert.deepEqual(common.state,states[1].find(f=>f.tick===common.tick).state);assert.equal(common.state.players[0].meter,0);assert.equal(common.state.players[0].action.name,'shinkuhadouken');
  const info=await (await a.request.get(url+'/api/info')).json();assert.equal(info.combatRevision,'ryu-aereos-8.5');assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(root,'evidencias/testes-super-rede.json'),JSON.stringify({status:'PASS',twoIndependentContexts:true,authoritativeMove:'shinkuhadouken',matchingTick:common.tick,freezeAndMeterSynchronized:true,serverMeterFixture:100,physicalControllersTested:false,errors},null,2));
  console.log('PASS Super executado por teclado pela rede; ativação, barra e estado idênticos nos dois navegadores');
 }finally{await browser.close();await app.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
