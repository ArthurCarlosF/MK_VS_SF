const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {chromium}=require('C:/Users/Pichau/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const url=process.env.MKVSF_TEST_URL||'http://192.168.0.199:8765',browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true}),errors=[];
 try{
  const pages=[];for(let i=0;i<2;i++){const c=await browser.newContext();const p=await c.newPage();pages.push(p);p.on('pageerror',e=>errors.push(e.message));await p.goto(url);}
  const [a,b]=pages;await a.fill('#nick','Teste aéreo');await a.click('#create button');await a.waitForFunction(()=>window.roomPage?.room?.code);
  const code=await a.locator('#room-code').textContent();await a.selectOption('#character','ryu');await b.fill('#nick','Teste Scorpion');await b.fill('#code',code);await b.click('#join button');await b.waitForFunction(()=>window.roomPage?.room?.players.length===2);
  for(const p of pages)await p.click('#ready');await a.waitForFunction(()=>!document.querySelector('#start').disabled);await a.click('#start');
  for(const p of pages)await p.waitForFunction(()=>window.arena?.ready&&window.arena.network?.latest?.phase==='playing');
  await a.waitForFunction(()=>window.arena.game.phase==='fight');await a.evaluate(()=>window.arena.setPaused(false));await a.locator('canvas').focus();
  await a.keyboard.down('ArrowUp');await a.waitForTimeout(130);await a.keyboard.up('ArrowUp');await a.keyboard.down('ArrowDown');await a.waitForTimeout(40);
  await a.keyboard.down('ArrowLeft');await a.waitForTimeout(40);await a.keyboard.up('ArrowDown');await a.waitForTimeout(40);
  await a.keyboard.down('k');await a.waitForTimeout(35);await a.keyboard.up('k');await a.keyboard.up('ArrowLeft');
  for(const p of pages)await p.waitForFunction(()=>window.arena.network.frames.some(f=>f.state.players[0].action?.name==='air_tatsumaki_lk'),null,{timeout:8000});
  const states=await Promise.all(pages.map(p=>p.evaluate(()=>window.arena.network.frames.filter(f=>f.state.players[0].action?.name==='air_tatsumaki_lk').map(f=>({tick:f.tick,state:f.state})))));
  const common=states[0].find(f=>states[1].some(v=>v.tick===f.tick));assert(common);assert.deepEqual(common.state,states[1].find(f=>f.tick===common.tick).state);assert(common.state.players[0].y>0);
  const info=await (await a.request.get(url+'/api/info')).json();assert.equal(info.combatRevision,'ryu-aereos-8.5');assert.deepEqual(errors,[]);
  await a.click('#reset');for(const p of pages)await p.waitForURL(url+'/salas.html');for(const p of pages)await p.click('#leave');
  fs.writeFileSync(path.join(__dirname,'evidencias/testes-aereos-rede.json'),JSON.stringify({status:'PASS',url,installedRevision:'8.5',twoIndependentContexts:true,authoritativeMove:'air_tatsumaki_lk',matchingTick:common.tick,physicalControllersTested:false,errors},null,2));
  console.log('PASS Tatsumaki aéreo executado por teclado no servidor instalado; dois navegadores receberam o mesmo estado');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
